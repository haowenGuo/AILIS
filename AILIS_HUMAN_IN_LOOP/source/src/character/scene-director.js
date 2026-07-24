const SCENE_MOODS = Object.freeze({
    idle: {
        camera: { distance: 1.1, height: 1.3, targetY: 1, yaw: 0 },
        light: { ambientIntensity: 2.2, keyIntensity: 1, keyX: 5, keyY: 5, keyZ: 5 },
        background: '#f0f8ff'
    },
    listening: {
        camera: { distance: 1.08, height: 1.31, targetY: 1.02, yaw: 0 },
        light: { ambientIntensity: 2.25, keyIntensity: 1.05, keyX: 4.6, keyY: 5.2, keyZ: 5 },
        background: '#f2f9ff'
    },
    thinking: {
        camera: { distance: 1.14, height: 1.32, targetY: 1.03, yaw: -0.025 },
        light: { ambientIntensity: 2.05, keyIntensity: 0.95, keyX: 3.8, keyY: 5.4, keyZ: 4.8 },
        background: '#eef6ff'
    },
    speaking: {
        camera: { distance: 1.07, height: 1.31, targetY: 1.03, yaw: 0.012 },
        light: { ambientIntensity: 2.28, keyIntensity: 1.08, keyX: 4.8, keyY: 5.3, keyZ: 5 },
        background: '#f3faff'
    },
    working: {
        camera: { distance: 1.16, height: 1.29, targetY: 1, yaw: -0.04 },
        light: { ambientIntensity: 2.0, keyIntensity: 0.92, keyX: 3.6, keyY: 5.1, keyZ: 5.2 },
        background: '#edf6fb'
    },
    waiting_approval: {
        camera: { distance: 1.08, height: 1.3, targetY: 1.03, yaw: 0 },
        light: { ambientIntensity: 2.2, keyIntensity: 1, keyX: 5, keyY: 5, keyZ: 4.8 },
        background: '#f2f8ff'
    },
    happy_success: {
        camera: { distance: 1.04, height: 1.33, targetY: 1.04, yaw: 0.016 },
        light: { ambientIntensity: 2.42, keyIntensity: 1.2, keyX: 5.2, keyY: 5.5, keyZ: 5 },
        background: '#f6fbff'
    },
    apologizing: {
        camera: { distance: 1.15, height: 1.27, targetY: 0.98, yaw: 0 },
        light: { ambientIntensity: 2.02, keyIntensity: 0.9, keyX: 4.2, keyY: 5, keyZ: 5 },
        background: '#f0f6fb'
    },
    comforting: {
        camera: { distance: 1.12, height: 1.29, targetY: 1, yaw: 0 },
        light: { ambientIntensity: 2.18, keyIntensity: 0.98, keyX: 4.6, keyY: 5.2, keyZ: 5 },
        background: '#f4f9ff'
    },
    blocked: {
        camera: { distance: 1.15, height: 1.28, targetY: 0.99, yaw: -0.02 },
        light: { ambientIntensity: 2.0, keyIntensity: 0.88, keyX: 3.8, keyY: 5, keyZ: 5 },
        background: '#eef5fb'
    }
});

function clamp(value, minimum, maximum) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return minimum;
    }
    return Math.min(Math.max(numericValue, minimum), maximum);
}

function getMoodForState(stateName = 'idle') {
    return SCENE_MOODS[stateName] || SCENE_MOODS.idle;
}

export class CharacterSceneDirector {
    constructor() {
        this.currentMood = this.createSceneMood('idle', {});
    }

    createSceneMood(stateName = 'idle', surface = {}) {
        const base = getMoodForState(stateName);
        const intensity = clamp(surface.intensity ?? 0.45, 0, 1);
        const speechEnergy = clamp(surface.speechEnergy ?? 0.35, 0, 1);
        const cameraPush = surface.taskState === 'speaking' ? speechEnergy * 0.018 : 0;
        const warmth = surface.socialTone === 'bright' || surface.emotion === 'happy'
            ? 0.08 + intensity * 0.08
            : surface.emotion === 'sad' || surface.emotion === 'anxious'
                ? -0.08
                : 0;

        this.currentMood = {
            state: stateName,
            camera: {
                distance: clamp(base.camera.distance - cameraPush, 0.82, 1.55),
                height: clamp(base.camera.height + (intensity - 0.5) * 0.025, 0.95, 1.65),
                targetY: clamp(base.camera.targetY, 0.75, 1.3),
                yaw: clamp(base.camera.yaw, -0.12, 0.12)
            },
            light: {
                ambientIntensity: clamp(base.light.ambientIntensity + warmth, 1.5, 2.7),
                keyIntensity: clamp(base.light.keyIntensity + warmth * 0.8, 0.65, 1.4),
                keyX: base.light.keyX,
                keyY: base.light.keyY,
                keyZ: base.light.keyZ
            },
            background: base.background
        };
        return this.currentMood;
    }
}
