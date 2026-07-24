import {
    getMotionIntakeEntry,
    getMotionReviewStatusFromIntake,
    isMotionIntakeApproved,
    listMotionIntakeEntries
} from './motion-intake-catalog.js';

const BASE_MOTION_DEFINITIONS = Object.freeze({
    idle: {
        id: 'idle',
        duration: 'long',
        loopable: true,
        mood: ['neutral', 'soft'],
        intensity: 0.2,
        safety: 'daily',
        autoSafe: true,
        rootMotion: false
    },
    idle1: {
        id: 'idle1',
        duration: 'long',
        loopable: true,
        mood: ['neutral', 'soft'],
        intensity: 0.22,
        safety: 'daily',
        autoSafe: true,
        rootMotion: false
    },
    idle2: {
        id: 'idle2',
        duration: 'long',
        loopable: true,
        mood: ['neutral', 'soft'],
        intensity: 0.24,
        safety: 'daily',
        autoSafe: true,
        rootMotion: false
    },
    relax: {
        id: 'relax',
        duration: 'short',
        loopable: false,
        mood: ['relaxed', 'comforting'],
        intensity: 0.28,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    thinking: {
        id: 'thinking',
        duration: 'short',
        loopable: false,
        mood: ['thinking', 'focused', 'soft'],
        intensity: 0.35,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    lookaround: {
        id: 'lookaround',
        duration: 'short',
        loopable: false,
        mood: ['thinking', 'curious'],
        intensity: 0.34,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    blush: {
        id: 'blush',
        duration: 'short',
        loopable: false,
        mood: ['shy', 'soft'],
        intensity: 0.42,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    goodbye: {
        id: 'goodbye',
        duration: 'short',
        loopable: false,
        mood: ['happy', 'friendly'],
        intensity: 0.42,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    clapping: {
        id: 'clapping',
        duration: 'short',
        loopable: false,
        mood: ['happy', 'success'],
        intensity: 0.52,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    jump: {
        id: 'jump',
        duration: 'short',
        loopable: false,
        mood: ['happy', 'surprised'],
        intensity: 0.78,
        safety: 'energetic',
        autoSafe: false,
        rootMotion: false
    },
    angry: {
        id: 'angry',
        duration: 'short',
        loopable: false,
        mood: ['angry'],
        intensity: 0.55,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    sad: {
        id: 'sad',
        duration: 'short',
        loopable: false,
        mood: ['sad', 'soft'],
        intensity: 0.45,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    sleepy: {
        id: 'sleepy',
        duration: 'short',
        loopable: false,
        mood: ['tired', 'soft'],
        intensity: 0.32,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    surprised: {
        id: 'surprised',
        duration: 'short',
        loopable: false,
        mood: ['surprised'],
        intensity: 0.55,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    vrma17: {
        id: 'vrma17',
        duration: 'long',
        loopable: false,
        mood: ['happy', 'dance'],
        intensity: 0.72,
        safety: 'dance',
        autoSafe: false,
        rootMotion: false
    },
    vrma25: {
        id: 'vrma25',
        duration: 'long',
        loopable: false,
        mood: ['happy', 'dance'],
        intensity: 0.68,
        safety: 'dance',
        autoSafe: false,
        rootMotion: false
    },
    vroid_show_full_body: {
        id: 'vroid_show_full_body',
        duration: 'long',
        loopable: false,
        mood: ['neutral', 'presentation'],
        intensity: 0.45,
        safety: 'showcase',
        autoSafe: false,
        rootMotion: false
    },
    vroid_greeting: {
        id: 'vroid_greeting',
        duration: 'long',
        loopable: false,
        mood: ['friendly', 'greeting'],
        intensity: 0.45,
        safety: 'daily',
        autoSafe: false,
        rootMotion: false
    },
    vroid_peace: {
        id: 'vroid_peace',
        duration: 'long',
        loopable: false,
        mood: ['happy', 'cute'],
        intensity: 0.5,
        safety: 'pose',
        autoSafe: false,
        rootMotion: false
    },
    vroid_shoot: {
        id: 'vroid_shoot',
        duration: 'long',
        loopable: false,
        mood: ['comic', 'pose'],
        intensity: 0.55,
        safety: 'pose',
        autoSafe: false,
        rootMotion: false
    },
    vroid_spin: {
        id: 'vroid_spin',
        duration: 'long',
        loopable: false,
        mood: ['showcase', 'spin'],
        intensity: 0.6,
        safety: 'showcase',
        autoSafe: false,
        rootMotion: true
    },
    vroid_model_pose: {
        id: 'vroid_model_pose',
        duration: 'long',
        loopable: false,
        mood: ['showcase', 'pose'],
        intensity: 0.48,
        safety: 'pose',
        autoSafe: false,
        rootMotion: false
    },
    vroid_squat: {
        id: 'vroid_squat',
        duration: 'long',
        loopable: false,
        mood: ['showcase', 'pose'],
        intensity: 0.58,
        safety: 'showcase',
        autoSafe: false,
        rootMotion: true
    }
});

function createCandidateMotionDefinition(entry) {
    const styles = Array.isArray(entry.style) ? entry.style : [];
    const isIdleLike = styles.some((style) => /idle/.test(style));
    const isSpinLike = styles.some((style) => /spin|showcase/.test(style));
    const isHighRisk = entry.clippingRisk === 'high';
    return {
        id: entry.id,
        duration: isIdleLike ? 'long' : 'medium',
        loopable: false,
        mood: styles.length ? styles : ['experimental'],
        intensity: Math.max(0.18, Math.min(0.75, Number(entry.feminineScore) || 0.35)),
        safety: entry.approved ? 'daily' : 'candidate',
        autoSafe: false,
        rootMotion: Boolean(isSpinLike || isHighRisk)
    };
}

export const MOTION_DEFINITIONS = Object.freeze({
    ...BASE_MOTION_DEFINITIONS,
    ...Object.fromEntries(listMotionIntakeEntries()
        .filter((entry) => entry.localPath && !BASE_MOTION_DEFINITIONS[entry.id])
        .map((entry) => [entry.id, createCandidateMotionDefinition(entry)]))
});

export const GESTURE_MOTION_MAP = Object.freeze({
    none: [],
    greeting: ['vroid_greeting', 'fumi_004_hello_1'],
    farewell: ['vroid_greeting'],
    listening: [],
    thinking: [],
    working: [],
    approval: [],
    success: ['jump', 'fumi_007_gekirei'],
    celebrate: ['jump'],
    shy: [],
    comfort: [],
    apologize: [],
    surprised: ['jump'],
    angry: [],
    dance: ['vrma17', 'vrma25']
});

const TASK_STATE_TO_GESTURE = Object.freeze({
    idle: 'none',
    listening: 'listening',
    thinking: 'thinking',
    speaking: 'none',
    working: 'working',
    waiting_approval: 'approval',
    happy_success: 'success',
    apologizing: 'apologize',
    comforting: 'comfort',
    blocked: 'thinking',
    failed: 'apologize'
});

const EMOTION_TO_GESTURE = Object.freeze({
    happy: 'success',
    shy: 'shy',
    sad: 'comfort',
    angry: 'angry',
    surprised: 'surprised',
    love: 'shy',
    jealous: 'angry',
    bored: 'comfort',
    serious: 'working',
    suspicious: 'thinking',
    victory: 'success',
    sleep: 'comfort',
    anxious: 'thinking',
    tired: 'comfort',
    thinking: 'thinking',
    focused: 'working',
    comforting: 'comfort'
});

const ACTION_ALIASES = Object.freeze({
    dance: 'dance'
});

function pickCandidate(candidates, random = Math.random) {
    if (!candidates.length) {
        return null;
    }
    const index = Math.floor(random() * candidates.length);
    return candidates[Math.min(index, candidates.length - 1)];
}

function normalizeAvailableActions(availableActions = []) {
    return new Set(Array.isArray(availableActions) ? availableActions.filter(Boolean) : []);
}

export function resolveActionAlias(actionName) {
    return ACTION_ALIASES[actionName] || actionName;
}

export function getMotionDefinition(motionId) {
    const resolvedId = resolveActionAlias(motionId);
    const definition = MOTION_DEFINITIONS[resolvedId];
    if (!definition) {
        return null;
    }
    return {
        ...definition,
        intake: getMotionIntakeEntry(resolvedId),
        review: getMotionReviewStatus(resolvedId)
    };
}

export function getGestureIntentForSurface(surface = {}) {
    if (surface.gestureIntent && surface.gestureIntent !== 'none') {
        return surface.gestureIntent;
    }
    if (surface.taskState && TASK_STATE_TO_GESTURE[surface.taskState]) {
        return TASK_STATE_TO_GESTURE[surface.taskState];
    }
    return EMOTION_TO_GESTURE[surface.emotion] || 'none';
}

export function getMotionCandidates(surface = {}) {
    const gestureIntent = getGestureIntentForSurface(surface);
    return GESTURE_MOTION_MAP[gestureIntent] || [];
}

export function selectMotionForSurface(surface = {}, options = {}) {
    const available = normalizeAvailableActions(options.availableActions);
    const currentMotion = options.currentMotion || '';
    const random = typeof options.random === 'function' ? options.random : Math.random;
    const hasExplicitLegacyAction = Boolean(surface.legacyAction);
    const explicitLegacyAction = resolveActionAlias(surface.legacyAction || '');
    const explicitLegacyMotion = getMotionDefinition(explicitLegacyAction);
    const allowExpressiveMotion = Boolean(options.allowExpressiveMotion || options.allowExpressive);
    const allowLegacyActionMotion = Boolean(options.allowLegacyActionMotion);
    const allowExperimentalMotion = Boolean(options.allowExperimentalMotion || options.allowExperimental);

    let candidates = hasExplicitLegacyAction && allowLegacyActionMotion && explicitLegacyMotion && explicitLegacyAction !== 'dance'
        ? [explicitLegacyMotion.id]
        : getMotionCandidates(surface);

    if (hasExplicitLegacyAction && allowLegacyActionMotion && explicitLegacyAction === 'dance') {
        candidates = GESTURE_MOTION_MAP.dance;
    }

    candidates = candidates
        .map(resolveActionAlias)
        .filter((motionId) => MOTION_DEFINITIONS[motionId])
        .filter((motionId) => {
            if (!isMotionApproved(motionId) && !allowExperimentalMotion) {
                return false;
            }
            if ((hasExplicitLegacyAction && allowLegacyActionMotion) || allowExpressiveMotion) {
                return true;
            }
            return MOTION_DEFINITIONS[motionId].autoSafe === true;
        })
        .filter((motionId) => !available.size || available.has(motionId));

    if (!candidates.length) {
        return null;
    }

    const nonCurrent = candidates.filter((motionId) => motionId !== currentMotion);
    const selectedId = pickCandidate(nonCurrent.length ? nonCurrent : candidates, random);
    if (!selectedId) {
        return null;
    }
    return MOTION_DEFINITIONS[selectedId];
}

export function listMotionLibrary() {
    return Object.values(MOTION_DEFINITIONS).map((definition) => ({
        ...definition,
        intake: getMotionIntakeEntry(definition.id),
        review: getMotionReviewStatus(definition.id)
    }));
}

export function getMotionReviewStatus(motionId) {
    const resolvedId = resolveActionAlias(motionId);
    if (!resolvedId) {
        return 'missing';
    }
    if (!MOTION_DEFINITIONS[resolvedId]) {
        return 'missing';
    }
    return getMotionReviewStatusFromIntake(resolvedId);
}

export function isMotionApproved(motionId) {
    const resolvedId = resolveActionAlias(motionId);
    return Boolean(MOTION_DEFINITIONS[resolvedId]) && isMotionIntakeApproved(resolvedId);
}
