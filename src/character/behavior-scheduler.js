const TWO_PI = Math.PI * 2;

const BONE_NAMES = Object.freeze({
    head: 'head',
    neck: 'neck',
    chest: 'chest',
    upperChest: 'upperChest',
    spine: 'spine',
    leftShoulder: 'leftShoulder',
    rightShoulder: 'rightShoulder'
});
const POSE_KEYS = Object.freeze(['headX', 'headY', 'headZ', 'neckX', 'chestY', 'spineZ']);

function clamp(value, minimum = 0, maximum = 1) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
        return minimum;
    }
    return Math.min(Math.max(numberValue, minimum), maximum);
}

function getBone(vrm, boneName) {
    try {
        return vrm?.humanoid?.getNormalizedBoneNode?.(boneName) || null;
    } catch {
        return null;
    }
}

function addRotation(bone, { x = 0, y = 0, z = 0 }, weight = 1) {
    if (!bone?.rotation) {
        return null;
    }
    const applied = {
        bone,
        x: x * weight,
        y: y * weight,
        z: z * weight
    };
    bone.rotation.x += applied.x;
    bone.rotation.y += applied.y;
    bone.rotation.z += applied.z;
    return applied;
}

function subtractRotation(entry) {
    if (!entry?.bone?.rotation) {
        return;
    }
    entry.bone.rotation.x -= entry.x || 0;
    entry.bone.rotation.y -= entry.y || 0;
    entry.bone.rotation.z -= entry.z || 0;
}

function getStateMotionProfile(surface = {}) {
    if (surface.taskState === 'thinking' || surface.emotion === 'thinking') {
        return {
            body: 0.55,
            head: 0.72,
            gaze: 'side',
            energy: 0.42,
            pose: { headX: 0.018, headY: 0.042, headZ: 0.012, neckX: 0.01, chestY: 0.012, spineZ: 0.006 }
        };
    }
    if (surface.taskState === 'working' || surface.emotion === 'focused' || surface.emotion === 'serious') {
        return {
            body: 0.48,
            head: 0.64,
            gaze: 'screen',
            energy: 0.34,
            pose: { headX: 0.02, headY: -0.035, headZ: -0.006, neckX: 0.012, chestY: -0.01, spineZ: -0.004 }
        };
    }
    if (surface.taskState === 'waiting_approval') {
        return {
            body: 0.46,
            head: 0.58,
            gaze: 'user',
            energy: 0.32,
            pose: { headX: 0.01, headY: 0, headZ: 0, neckX: 0.006, chestY: 0, spineZ: 0 }
        };
    }
    if (surface.taskState === 'blocked' || surface.taskState === 'failed' || surface.emotion === 'sad' || surface.emotion === 'suspicious') {
        return {
            body: 0.42,
            head: 0.6,
            gaze: surface.emotion === 'suspicious' ? 'side' : 'down',
            energy: 0.26,
            pose: { headX: 0.045, headY: surface.emotion === 'suspicious' ? 0.03 : 0.006, headZ: -0.01, neckX: 0.022, chestY: -0.004, spineZ: -0.004 }
        };
    }
    if (surface.emotion === 'happy' || surface.emotion === 'victory') {
        return {
            body: 0.58,
            head: 0.68,
            gaze: 'user',
            energy: 0.46,
            pose: { headX: -0.006, headY: 0.01, headZ: 0.008, neckX: -0.004, chestY: 0.006, spineZ: 0.004 }
        };
    }
    if (surface.emotion === 'shy' || surface.emotion === 'love') {
        return {
            body: 0.44,
            head: 0.64,
            gaze: 'side',
            energy: 0.3,
            pose: { headX: 0.024, headY: 0.036, headZ: 0.02, neckX: 0.012, chestY: 0.006, spineZ: 0.005 }
        };
    }
    return {
        body: 0.42,
        head: 0.5,
        gaze: 'user',
        energy: 0.28,
        pose: { headX: 0, headY: 0, headZ: 0, neckX: 0, chestY: 0, spineZ: 0 }
    };
}

function getGazeBias(gazeTarget) {
    if (gazeTarget === 'side') {
        return { yaw: 0.035, pitch: 0.003, roll: 0.008 };
    }
    if (gazeTarget === 'down') {
        return { yaw: 0.01, pitch: 0.045, roll: -0.004 };
    }
    if (gazeTarget === 'screen') {
        return { yaw: -0.025, pitch: 0.018, roll: 0.004 };
    }
    if (gazeTarget === 'away') {
        return { yaw: 0.045, pitch: 0.008, roll: 0.006 };
    }
    return { yaw: 0, pitch: 0, roll: 0 };
}

function isInteractiveMotion(currentMotion = '') {
    const motionName = String(currentMotion || '');
    return Boolean(motionName && !motionName.startsWith('idle'));
}

export class CharacterBehaviorScheduler {
    constructor() {
        this.time = 0;
        this.surface = null;
        this.pose = { headX: 0, headY: 0, headZ: 0, neckX: 0, chestY: 0, spineZ: 0 };
        this.cachedVrm = null;
        this.cachedBones = {};
        this.appliedRotations = [];
    }

    setSurface(surface) {
        this.surface = surface || null;
    }

    getBones(vrm) {
        if (this.cachedVrm === vrm && this.cachedBones) {
            return this.cachedBones;
        }

        this.cachedVrm = vrm;
        this.cachedBones = {
            head: getBone(vrm, BONE_NAMES.head),
            neck: getBone(vrm, BONE_NAMES.neck),
            chest: getBone(vrm, BONE_NAMES.chest) || getBone(vrm, BONE_NAMES.upperChest),
            spine: getBone(vrm, BONE_NAMES.spine),
            leftShoulder: getBone(vrm, BONE_NAMES.leftShoulder),
            rightShoulder: getBone(vrm, BONE_NAMES.rightShoulder)
        };
        return this.cachedBones;
    }

    beginFrame() {
        if (!this.appliedRotations.length) {
            return;
        }
        for (const entry of this.appliedRotations) {
            subtractRotation(entry);
        }
        this.appliedRotations = [];
    }

    applyRotation(bone, rotation, weight = 1) {
        const applied = addRotation(bone, rotation, weight);
        if (applied) {
            this.appliedRotations.push(applied);
        }
    }

    update({ vrm, deltaTime = 0, surface = null, isSpeaking = false, lipSyncValue = 0, currentMotion = '' } = {}) {
        if (!vrm) {
            return;
        }

        this.time += Math.max(0, deltaTime);
        if (surface) {
            this.setSurface(surface);
        }

        if (isInteractiveMotion(currentMotion)) {
            const poseAlpha = 1 - Math.exp(-Math.max(0, deltaTime) * 8);
            for (const key of POSE_KEYS) {
                this.pose[key] += (0 - this.pose[key]) * poseAlpha;
            }
            return;
        }

        const activeSurface = this.surface || {};
        const profile = getStateMotionProfile(activeSurface);
        const animationWeight = 1;
        const speechWeight = isSpeaking ? 1 + clamp(activeSurface.speechEnergy, 0.2, 0.85) * 0.42 : 1;
        const intensity = clamp(activeSurface.intensity, 0.18, 0.85);
        const profileEnergy = clamp(profile.energy + intensity * 0.25, 0.1, 0.9);
        const breath = Math.sin(this.time * TWO_PI * 0.23) * 0.5 + 0.5;
        const slowSway = Math.sin(this.time * TWO_PI * 0.08);
        const headNoise = Math.sin(this.time * TWO_PI * 0.13 + 1.7);
        const speechPulse = isSpeaking
            ? Math.sin(this.time * TWO_PI * (1.1 + activeSurface.speechEnergy * 0.9)) * (0.5 + clamp(lipSyncValue, 0, 1))
            : 0;
        const gaze = getGazeBias(activeSurface.gazeTarget || profile.gaze);
        const bodyWeight = profile.body * animationWeight;
        const headWeight = profile.head;
        const targetPose = profile.pose || {};
        const poseAlpha = 1 - Math.exp(-Math.max(0, deltaTime) * 5.5);
        for (const key of POSE_KEYS) {
            this.pose[key] += ((targetPose[key] || 0) - this.pose[key]) * poseAlpha;
        }

        const {
            head,
            neck,
            chest,
            spine,
            leftShoulder,
            rightShoulder
        } = this.getBones(vrm);

        this.applyRotation(spine, {
            x: (breath - 0.5) * 0.012,
            z: this.pose.spineZ + slowSway * 0.012 * profileEnergy
        }, bodyWeight);
        this.applyRotation(chest, {
            x: (breath - 0.5) * 0.018 + speechPulse * 0.006,
            y: this.pose.chestY + slowSway * 0.008,
            z: slowSway * 0.008
        }, bodyWeight * speechWeight);
        this.applyRotation(neck, {
            x: this.pose.neckX + gaze.pitch * 0.38 + headNoise * 0.008,
            y: gaze.yaw * 0.36 + slowSway * 0.008,
            z: gaze.roll * 0.3
        }, headWeight);
        this.applyRotation(head, {
            x: this.pose.headX + gaze.pitch * 0.72 + headNoise * 0.012 + speechPulse * 0.006,
            y: this.pose.headY + gaze.yaw * 0.72 + slowSway * 0.014,
            z: this.pose.headZ + gaze.roll * 0.72 + Math.sin(this.time * TWO_PI * 0.11 + 0.8) * 0.006
        }, headWeight);
        this.applyRotation(leftShoulder, {
            z: (breath - 0.5) * 0.01 + speechPulse * 0.004
        }, bodyWeight * 0.55);
        this.applyRotation(rightShoulder, {
            z: -(breath - 0.5) * 0.01 - speechPulse * 0.004
        }, bodyWeight * 0.55);
    }
}
