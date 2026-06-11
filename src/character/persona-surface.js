export const PERSONA_SURFACE_VERSION = 1;

export const PERSONA_EMOTIONS = Object.freeze([
    'neutral',
    'relaxed',
    'happy',
    'shy',
    'sad',
    'angry',
    'surprised',
    'jealous',
    'bored',
    'serious',
    'suspicious',
    'victory',
    'sleep',
    'love',
    'anxious',
    'tired',
    'thinking',
    'focused',
    'comforting'
]);

export const PERSONA_GESTURE_INTENTS = Object.freeze([
    'none',
    'greeting',
    'farewell',
    'listening',
    'thinking',
    'working',
    'approval',
    'success',
    'celebrate',
    'shy',
    'comfort',
    'apologize',
    'surprised',
    'angry',
    'dance'
]);

export const PERSONA_TASK_STATES = Object.freeze([
    'idle',
    'listening',
    'thinking',
    'speaking',
    'working',
    'waiting_approval',
    'happy_success',
    'apologizing',
    'comforting',
    'blocked',
    'failed'
]);

const EMOTION_ALIASES = Object.freeze({
    calm: 'relaxed',
    comfort: 'comforting',
    worried: 'anxious',
    concern: 'anxious',
    concern_soft: 'anxious',
    sleepy: 'tired',
    tiredness: 'tired',
    think: 'thinking',
    thought: 'thinking',
    work: 'focused',
    working: 'focused',
    surprise: 'surprised',
    joy: 'happy',
    pleased: 'happy',
    jealous: 'jealous',
    envy: 'jealous',
    boring: 'bored',
    bored: 'bored',
    serious: 'serious',
    suspicious: 'suspicious',
    victory: 'victory',
    success: 'victory',
    love: 'love',
    sleep: 'sleep'
});

const GESTURE_ALIASES = Object.freeze({
    wave: 'greeting',
    hello: 'greeting',
    greet: 'greeting',
    goodbye: 'farewell',
    bye: 'farewell',
    think: 'thinking',
    lookaround: 'thinking',
    look_around: 'thinking',
    clap: 'success',
    clapping: 'success',
    done: 'success',
    complete: 'success',
    completed: 'success',
    dancing: 'dance',
    blush: 'shy',
    sorry: 'apologize',
    apology: 'apologize',
    approve: 'approval',
    confirm: 'approval'
});

const TASK_STATE_ALIASES = Object.freeze({
    completed: 'happy_success',
    success: 'happy_success',
    done: 'happy_success',
    planned: 'thinking',
    uncertain: 'thinking',
    needs_approval: 'waiting_approval',
    approval: 'waiting_approval',
    running: 'working',
    executing: 'working',
    task: 'working',
    fail: 'failed',
    failure: 'failed',
    error: 'failed'
});

const ACTION_TO_SURFACE = Object.freeze({
    wave: { gestureIntent: 'greeting', emotion: 'happy', taskState: 'speaking' },
    goodbye: { gestureIntent: 'farewell', emotion: 'relaxed', taskState: 'speaking' },
    angry: { gestureIntent: 'angry', emotion: 'angry', taskState: 'speaking' },
    surprised: { gestureIntent: 'surprised', emotion: 'surprised', taskState: 'speaking' },
    dance: { gestureIntent: 'dance', emotion: 'happy', taskState: 'happy_success', intensity: 0.75 },
    thinking: { gestureIntent: 'thinking', emotion: 'thinking', taskState: 'thinking' },
    lookaround: { gestureIntent: 'thinking', emotion: 'thinking', taskState: 'thinking' },
    blush: { gestureIntent: 'shy', emotion: 'shy', taskState: 'speaking' },
    clapping: { gestureIntent: 'success', emotion: 'happy', taskState: 'happy_success' },
    jump: { gestureIntent: 'celebrate', emotion: 'happy', taskState: 'happy_success', intensity: 0.8 },
    sad: { gestureIntent: 'comfort', emotion: 'sad', taskState: 'comforting' },
    sleepy: { gestureIntent: 'comfort', emotion: 'tired', taskState: 'comforting' },
    relax: { gestureIntent: 'comfort', emotion: 'relaxed', taskState: 'idle' }
});

const EXPRESSION_TO_EMOTION = Object.freeze({
    happy: 'happy',
    angry: 'angry',
    sad: 'sad',
    surprised: 'surprised',
    relaxed: 'relaxed',
    blinkRight: 'shy',
    shy: 'shy',
    love: 'love',
    victory: 'victory',
    sleep: 'sleep',
    serious: 'serious',
    suspicious: 'suspicious',
    jealous: 'jealous'
});

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeNumber(value, fallback = 0.5, minimum = 0, maximum = 1) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
        return fallback;
    }
    return Math.min(Math.max(numberValue, minimum), maximum);
}

function normalizeEnum(value, allowedValues, fallback, aliases = {}) {
    const normalized = normalizeText(value).toLowerCase().replace(/[-\s]+/g, '_');
    if (!normalized) {
        return fallback;
    }
    const aliased = aliases[normalized] || normalized;
    return allowedValues.includes(aliased) ? aliased : fallback;
}

function normalizeGazeTarget(value) {
    return normalizeEnum(value, ['user', 'side', 'down', 'screen', 'away', 'none'], 'user');
}

function normalizeDurationHint(value) {
    return normalizeEnum(value, ['short', 'medium', 'long', 'hold'], 'short');
}

function normalizeSocialTone(value) {
    return normalizeEnum(value, ['soft', 'bright', 'calm', 'serious', 'playful', 'quiet'], 'soft');
}

function normalizeSpeechEnergy(value, fallbackIntensity) {
    return normalizeNumber(value, fallbackIntensity, 0, 1);
}

function inferEmotionFromText(text = '') {
    const normalized = normalizeText(text);
    if (!normalized) {
        return '';
    }
    if (/害羞|脸红|不好意思|嘿嘿|欸嘿/.test(normalized)) {
        return 'shy';
    }
    if (/爱你|喜欢你|贴贴|亲密/.test(normalized)) {
        return 'love';
    }
    if (/开心|好耶|太好了|谢谢|棒|喜欢/.test(normalized)) {
        return 'happy';
    }
    if (/惊讶|吓|哇|欸|诶|居然/.test(normalized)) {
        return 'surprised';
    }
    if (/生气|火大|烦|不高兴/.test(normalized)) {
        return 'angry';
    }
    if (/难过|伤心|低落|委屈/.test(normalized)) {
        return 'sad';
    }
    if (/焦虑|担心|紧张|着急|超时/.test(normalized)) {
        return 'anxious';
    }
    if (/思考|想一想|检查|确认|看看|查一下/.test(normalized)) {
        return 'thinking';
    }
    return '';
}

function inferGestureIntentFromText(text = '') {
    const normalized = normalizeText(text);
    if (!normalized) {
        return '';
    }
    if (/(跳舞|舞蹈|跳一段|dance|dancing)/i.test(normalized) && !/(别跳|不要跳|不跳)/.test(normalized)) {
        return 'dance';
    }
    if (/(挥手|打招呼|拜拜|再见|wave|hello|bye)/i.test(normalized)) {
        return 'greeting';
    }
    if (/(跳一下|庆祝|好耶|成功|完成|jump|celebrate)/i.test(normalized)) {
        return 'celebrate';
    }
    return '';
}

function inferTaskStateFromPayload(payload = {}) {
    const result = payload.humanclaw && typeof payload.humanclaw === 'object'
        ? payload.humanclaw
        : {};
    const status = normalizeText(result.status || payload.status).toLowerCase();
    if (status === 'needs_approval') {
        return 'waiting_approval';
    }
    if (status === 'completed' && result.executionRequired) {
        return 'happy_success';
    }
    if (status === 'blocked') {
        return 'blocked';
    }
    if (status === 'failed' || status === 'tool_failed' || status === 'error') {
        return 'failed';
    }
    if (payload.streamMode) {
        return 'speaking';
    }
    return '';
}

export function getLegacySurfaceHint({ action = '', expression = '' } = {}) {
    const normalizedAction = normalizeText(action).toLowerCase();
    const normalizedExpression = normalizeText(expression);
    const actionHint = ACTION_TO_SURFACE[normalizedAction] || {};
    const expressionEmotion = EXPRESSION_TO_EMOTION[normalizedExpression] || '';
    return {
        ...actionHint,
        emotion: actionHint.emotion || expressionEmotion || '',
        legacyAction: normalizedAction,
        legacyExpression: normalizedExpression
    };
}

export function normalizePersonaSurfaceState(input = {}, fallback = {}) {
    const safeInput = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    const fallbackSurface = fallback && typeof fallback === 'object' ? fallback : {};
    const legacyHint = getLegacySurfaceHint({
        action: safeInput.action || safeInput.legacyAction || fallbackSurface.legacyAction,
        expression: safeInput.expression || safeInput.legacyExpression || fallbackSurface.legacyExpression
    });
    const textEmotion = inferEmotionFromText(safeInput.text || safeInput.displayText || fallbackSurface.text || '');
    const textGestureIntent = inferGestureIntentFromText(
        safeInput.text || safeInput.displayText || fallbackSurface.text || ''
    );
    const emotion = normalizeEnum(
        safeInput.emotion ||
            safeInput.emotion_hint ||
            safeInput.emotionHint ||
            legacyHint.emotion ||
            fallbackSurface.emotion ||
            textEmotion,
        PERSONA_EMOTIONS,
        'relaxed',
        EMOTION_ALIASES
    );
    const taskState = normalizeEnum(
        safeInput.taskState ||
            safeInput.task_state ||
            safeInput.state ||
            legacyHint.taskState ||
            fallbackSurface.taskState,
        PERSONA_TASK_STATES,
        'speaking',
        TASK_STATE_ALIASES
    );
    const gestureIntent = normalizeEnum(
        safeInput.gestureIntent ||
            safeInput.gesture_intent ||
            safeInput.gesture ||
            legacyHint.gestureIntent ||
            textGestureIntent ||
            fallbackSurface.gestureIntent,
        PERSONA_GESTURE_INTENTS,
        'none',
        GESTURE_ALIASES
    );
    const intensity = normalizeNumber(
        safeInput.intensity ?? fallbackSurface.intensity ?? legacyHint.intensity,
        emotion === 'neutral' || emotion === 'relaxed' ? 0.38 : 0.55,
        0,
        1
    );
    const socialTone = normalizeSocialTone(
        safeInput.socialTone ||
            safeInput.social_tone ||
            fallbackSurface.socialTone ||
            (emotion === 'happy' ? 'bright' : 'soft')
    );
    const speechEnergy = normalizeSpeechEnergy(
        safeInput.speechEnergy ?? safeInput.speech_energy ?? fallbackSurface.speechEnergy,
        Math.max(0.25, intensity * (emotion === 'tired' || emotion === 'sad' ? 0.65 : 0.9))
    );

    return {
        version: PERSONA_SURFACE_VERSION,
        emotion,
        intensity,
        socialTone,
        gestureIntent,
        taskState,
        speechEnergy,
        gazeTarget: normalizeGazeTarget(safeInput.gazeTarget || safeInput.gaze_target || fallbackSurface.gazeTarget),
        durationHint: normalizeDurationHint(safeInput.durationHint || safeInput.duration_hint || fallbackSurface.durationHint),
        text: normalizeText(safeInput.text || safeInput.displayText || fallbackSurface.text),
        source: normalizeText(safeInput.source || fallbackSurface.source, 'runtime'),
        legacyAction: legacyHint.legacyAction || '',
        legacyExpression: legacyHint.legacyExpression || ''
    };
}

export function createPersonaSurfaceFromPayload(payload = {}, context = {}) {
    const surface = payload?.personaSurface ||
        payload?.persona_surface ||
        payload?.persona_output ||
        payload?.personaOutput ||
        payload?.surface ||
        {};
    const inferredTaskState = inferTaskStateFromPayload(payload);
    const previousSurface = context.previousSurface || {};
    return normalizePersonaSurfaceState(
        {
            ...surface,
            text: surface.text || payload.display_text || payload.speech_text || payload.raw_text || '',
            action: surface.action || payload.action || '',
            expression: surface.expression || payload.expression || '',
            taskState: surface.taskState || surface.task_state || inferredTaskState,
            source: surface.source || payload.source || 'assistant_payload'
        },
        previousSurface
    );
}
