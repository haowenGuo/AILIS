const ROLE_STATES = Object.freeze([
    'idle',
    'listening',
    'thinking',
    'speaking',
    'working',
    'waiting_approval',
    'happy_success',
    'apologizing',
    'comforting',
    'blocked'
]);

const STATE_ALIASES = Object.freeze({
    failed: 'apologizing',
    sad: 'comforting',
    tired: 'comforting',
    sleep: 'comforting',
    serious: 'working',
    suspicious: 'blocked',
    victory: 'happy_success',
    focused: 'working',
    completed: 'happy_success',
    needs_approval: 'waiting_approval'
});

const STATE_DEFAULTS = Object.freeze({
    idle: {
        emotion: 'relaxed',
        gestureIntent: 'none',
        gazeTarget: 'user',
        speechEnergy: 0.25,
        intensity: 0.3,
        durationHint: 'hold'
    },
    listening: {
        emotion: 'relaxed',
        gestureIntent: 'listening',
        gazeTarget: 'user',
        speechEnergy: 0.25,
        intensity: 0.34,
        durationHint: 'hold'
    },
    thinking: {
        emotion: 'thinking',
        gestureIntent: 'thinking',
        gazeTarget: 'side',
        speechEnergy: 0.25,
        intensity: 0.42,
        durationHint: 'medium'
    },
    speaking: {
        gestureIntent: 'none',
        gazeTarget: 'user',
        speechEnergy: 0.48,
        intensity: 0.48,
        durationHint: 'short'
    },
    working: {
        emotion: 'focused',
        gestureIntent: 'working',
        gazeTarget: 'screen',
        speechEnergy: 0.28,
        intensity: 0.38,
        durationHint: 'hold'
    },
    waiting_approval: {
        emotion: 'relaxed',
        gestureIntent: 'approval',
        gazeTarget: 'user',
        speechEnergy: 0.32,
        intensity: 0.36,
        durationHint: 'medium'
    },
    happy_success: {
        emotion: 'happy',
        gestureIntent: 'success',
        gazeTarget: 'user',
        speechEnergy: 0.56,
        intensity: 0.6,
        durationHint: 'short'
    },
    apologizing: {
        emotion: 'sad',
        gestureIntent: 'apologize',
        gazeTarget: 'down',
        speechEnergy: 0.3,
        intensity: 0.38,
        durationHint: 'medium'
    },
    comforting: {
        emotion: 'comforting',
        gestureIntent: 'comfort',
        gazeTarget: 'user',
        speechEnergy: 0.28,
        intensity: 0.36,
        durationHint: 'medium'
    },
    blocked: {
        emotion: 'anxious',
        gestureIntent: 'thinking',
        gazeTarget: 'side',
        speechEnergy: 0.3,
        intensity: 0.4,
        durationHint: 'medium'
    }
});

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function clamp01(value, fallback = 0.5) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallback;
    }
    return Math.min(Math.max(numericValue, 0), 1);
}

function normalizeStateName(value, fallback = 'idle') {
    const normalized = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
    const aliased = STATE_ALIASES[normalized] || normalized;
    return ROLE_STATES.includes(aliased) ? aliased : fallback;
}

function inferStateFromSurface(surface = {}, context = {}) {
    const taskState = normalizeText(surface.taskState).toLowerCase().replace(/[-\s]+/g, '_');
    if (taskState) {
        return normalizeStateName(taskState, 'idle');
    }
    if (surface.gestureIntent === 'approval') {
        return 'waiting_approval';
    }
    if (surface.gestureIntent === 'working') {
        return 'working';
    }
    if (surface.gestureIntent === 'thinking' || surface.emotion === 'thinking') {
        return 'thinking';
    }
    if (surface.emotion === 'serious') {
        return 'working';
    }
    if (surface.emotion === 'sad' || surface.emotion === 'tired' || surface.emotion === 'sleep' || surface.emotion === 'comforting') {
        return 'comforting';
    }
    if (surface.emotion === 'anxious' || surface.emotion === 'suspicious') {
        return 'blocked';
    }
    if (surface.emotion === 'victory' || (surface.emotion === 'happy' && surface.gestureIntent === 'success')) {
        return 'happy_success';
    }
    return 'idle';
}

function applyDefaults(surface = {}, stateName = 'idle') {
    const defaults = STATE_DEFAULTS[stateName] || STATE_DEFAULTS.idle;
    return {
        ...surface,
        emotion: surface.emotion || defaults.emotion,
        gestureIntent: surface.gestureIntent && surface.gestureIntent !== 'none'
            ? surface.gestureIntent
            : defaults.gestureIntent,
        gazeTarget: surface.gazeTarget || defaults.gazeTarget,
        speechEnergy: clamp01(surface.speechEnergy, defaults.speechEnergy),
        intensity: clamp01(surface.intensity, defaults.intensity),
        durationHint: surface.durationHint || defaults.durationHint,
        taskState: stateName
    };
}

export class CharacterStateMachine {
    constructor(initialState = 'idle') {
        this.state = normalizeStateName(initialState);
        this.previousState = this.state;
        this.stateStartedAt = 0;
        this.elapsedMs = 0;
    }

    transition(surface = {}, context = {}) {
        const nextState = inferStateFromSurface(surface, context);
        if (nextState !== this.state) {
            this.previousState = this.state;
            this.state = nextState;
            this.stateStartedAt = this.elapsedMs;
        }

        const enrichedSurface = applyDefaults(surface, this.state);
        return {
            state: this.state,
            previousState: this.previousState,
            changed: this.stateStartedAt === this.elapsedMs,
            elapsedInStateMs: this.elapsedMs - this.stateStartedAt,
            surface: enrichedSurface
        };
    }

    update(deltaTimeSeconds = 0, surface = {}, context = {}) {
        this.elapsedMs += Math.max(0, deltaTimeSeconds) * 1000;
        return this.transition(surface, context);
    }
}

export function getRoleStateDefaults(stateName) {
    return {
        ...(STATE_DEFAULTS[normalizeStateName(stateName)] || STATE_DEFAULTS.idle)
    };
}

export function listRoleStates() {
    return [...ROLE_STATES];
}
