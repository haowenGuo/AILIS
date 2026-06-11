import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createVRMAnimationClip, VRMAnimationLoaderPlugin } from '@pixiv/three-vrm-animation';

import { CharacterEmoteController } from './character/emote-controller.js';
import { CharacterRuntime } from './character/character-runtime.js';
import { ChatVRMAmicaMotionController } from './character/chatvrm-amica-motion-controller.js';
import { MToonRenderProfileController } from './character/mtoon-render-profile-controller.js';
import { getRenderProfile, normalizeRenderProfileId } from './character/render-profiles.js';
import { createVrmDriver } from './character/vrm-driver.js';
import { CONFIG } from './config.js';

const BASE_SCENE_CAMERA = Object.freeze({
    distance: 1.1,
    height: 1.3,
    targetY: 1
});

const AVATAR_HIT_TEST_BONES = Object.freeze([
    'hips',
    'spine',
    'chest',
    'upperChest',
    'neck',
    'head',
    'leftShoulder',
    'leftUpperArm',
    'leftLowerArm',
    'leftHand',
    'rightShoulder',
    'rightUpperArm',
    'rightLowerArm',
    'rightHand',
    'leftUpperLeg',
    'leftLowerLeg',
    'leftFoot',
    'leftToes',
    'rightUpperLeg',
    'rightLowerLeg',
    'rightFoot',
    'rightToes'
]);
const AVATAR_HIT_TEST_CACHE_MS = 75;

const BASE_PROFILE_LIGHT = Object.freeze({
    ambientIntensity: 2.2,
    keyIntensity: 1,
    keyX: 5,
    keyY: 5,
    keyZ: 5
});
const GROUND_SHADOW_RECEIVER_SIZE = 7.2;
const GROUND_SHADOW_TARGET_Y = 0.85;
const GROUND_SHADOW_MIN_CAMERA_EXTENT = 2.7;
const GROUND_SHADOW_MAX_CAMERA_EXTENT = 5.6;

const SCENE_STATE_LIGHT_BOOSTS = Object.freeze({
    idle: { fill: 0, rim: 0 },
    listening: { fill: 0.02, rim: 0.03 },
    thinking: { fill: -0.04, rim: 0.1 },
    speaking: { fill: 0.04, rim: 0.06 },
    working: { fill: -0.06, rim: 0.14 },
    waiting_approval: { fill: 0.01, rim: 0.04 },
    happy_success: { fill: 0.08, rim: 0.12 },
    apologizing: { fill: -0.03, rim: -0.04 },
    comforting: { fill: 0.06, rim: 0.02 },
    blocked: { fill: -0.08, rim: 0.08 }
});

function clampNumber(value, minimum, maximum, fallbackValue = minimum) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return Math.min(Math.max(numericValue, minimum), maximum);
}

function numberOr(value, fallbackValue) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallbackValue;
}

function applyLightConfig(light, config = {}) {
    if (!light || !config) {
        return;
    }
    if (config.color) {
        light.color.set(config.color);
    }
    if ('intensity' in config) {
        light.intensity = clampNumber(config.intensity, 0, 5, light.intensity);
    }
    if (Array.isArray(config.position) && config.position.length >= 3) {
        light.position.set(
            numberOr(config.position[0], light.position.x),
            numberOr(config.position[1], light.position.y),
            numberOr(config.position[2], light.position.z)
        );
    }
}

function getRenderLookSettings() {
    const look = CONFIG.RENDER_LOOK || {};
    return {
        lightYawDeg: clampNumber(look.lightYawDeg, -75, 75, 0),
        keyLightScale: clampNumber(look.keyLightScale, 0.65, 1.45, 1),
        ambientFillScale: clampNumber(look.ambientFillScale, 0.55, 1.35, 1),
        outlineScale: clampNumber(look.outlineScale, 0.25, 1.2, 1),
        outlineEnabled: CONFIG.RENDER_OUTLINE_ENABLED !== false,
        shadowEnabled: look.shadowEnabled !== false,
        shadowStrength: clampNumber(look.shadowStrength, 0, 0.65, 0.22),
        shadowRange: clampNumber(look.shadowRange, 0.65, 1.8, 1.8)
    };
}

function rotateLightPosition(position = [], yawDeg = 0) {
    if (!Array.isArray(position) || position.length < 3) {
        return position;
    }
    const yaw = THREE.MathUtils.degToRad(yawDeg);
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const x = numberOr(position[0], 0);
    const y = numberOr(position[1], 0);
    const z = numberOr(position[2], 0);
    return [
        Number((x * cosYaw + z * sinYaw).toFixed(3)),
        y,
        Number((-x * sinYaw + z * cosYaw).toFixed(3))
    ];
}

function withLightLook(config = {}, { intensityScale = 1, yawDeg = 0 } = {}) {
    if (!config) {
        return config;
    }
    return {
        ...config,
        intensity: 'intensity' in config
            ? clampNumber(numberOr(config.intensity, 0) * intensityScale, 0, 5, config.intensity)
            : config.intensity,
        position: Array.isArray(config.position)
            ? rotateLightPosition(config.position, yawDeg)
            : config.position
    };
}

export class VRMModelSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.ambientLight = null;
        this.directionalLight = null;
        this.fillLight = null;
        this.rimLight = null;
        this.shadowReceiver = null;
        this.sceneMoodTarget = null;
        this.sceneMoodCurrent = null;
        this.clock = new THREE.Clock();
        this.lastRenderTimestamp = 0;

        this.vrm = null;
        this.mixer = null;
        this.actionMap = {};
        this.currentAction = null;
        this.motionController = new ChatVRMAmicaMotionController({
            idleActions: CONFIG.IDLE_ACTION_LIST,
            danceActions: CONFIG.DANCE_ACTION_LIST,
            crossFadeDuration: CONFIG.CROSS_FADE_DURATION,
            logger: console
        });
        this.currentSurfaceState = null;
        this.activeRenderProfileId = normalizeRenderProfileId(CONFIG.RENDER_PROFILE_ID);
        this.renderProfileController = null;
        this.avatarHitTestBounds = null;
        this.avatarHitTestBoundsUpdatedAt = 0;
        this.avatarProjectionScratch = new THREE.Vector3();
        this.avatarWorldPositionScratch = new THREE.Vector3();
        this.avatarBoxScratch = new THREE.Box3();
        this.avatarBoxCornerScratch = Array.from({ length: 8 }, () => new THREE.Vector3());
        this.characterRuntime = new CharacterRuntime({
            driver: createVrmDriver(this)
        });
        this.characterEmoteController = new CharacterEmoteController({
            getExpressionPresets: () => this.getExpressionPresets(),
            defaultMix: { relaxed: 0.18 }
        });

        this.isModelLoaded = false;
        this.autoBlinkEnabled = true;
        this.nextBlinkTime = 0;
        this.blinkTimer = 0;

        // 口型状态：优先由真实音频驱动，兜底才用正弦波。
        this.isSpeaking = false;
        this.useExternalLipSync = false;
        this.speakTimeAccumulator = 0;
        this.externalLipSyncValue = 0;
        this.smoothedLipSyncValue = 0;
        this.speechIdleResetTimer = null;

        this.activeExpressions = new Set();
        this.expressionResetTimer = null;
        this.animate = this.animate.bind(this);
    }

    isBlinkExpression(expressionName) {
        return ['blink', 'blinkLeft', 'blinkRight'].includes(expressionName);
    }

    hasActiveBlinkExpression() {
        for (const expressionName of this.activeExpressions) {
            if (this.isBlinkExpression(expressionName)) {
                return true;
            }
        }
        return false;
    }

    hasBlockingEmotionExpression() {
        for (const expressionName of this.activeExpressions) {
            if (
                expressionName !== 'aa' &&
                !this.isBlinkExpression(expressionName)
            ) {
                return true;
            }
        }
        return false;
    }

    getExpressionPresets() {
        return { ...CONFIG.EXPRESSION_PRESETS };
    }

    getExpressionPresetValue(expressionName) {
        return CONFIG.EXPRESSION_PRESETS[expressionName];
    }

    setExpressionPresetValue(expressionName, value) {
        if (!(expressionName in CONFIG.EXPRESSION_PRESETS)) {
            console.warn(`⚠️ 表情预设 "${expressionName}" 不存在，无法更新`);
            return;
        }

        CONFIG.EXPRESSION_PRESETS[expressionName] = THREE.MathUtils.clamp(value, 0, 1);
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ 画布容器不存在');
            return;
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f8ff);

        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.copy(CONFIG.CAMERA_POSITION);
        this.camera.lookAt(CONFIG.CAMERA_TARGET);

        this.renderer = new THREE.WebGLRenderer({
            antialias: CONFIG.RENDER_ANTIALIAS_ENABLED !== false,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.applyRendererQualitySettings();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.copy(CONFIG.CAMERA_TARGET);
        this.controls.enablePan = false;
        this.controls.minDistance = CONFIG.CAMERA_MIN_DISTANCE;
        this.controls.maxDistance = CONFIG.CAMERA_MAX_DISTANCE;
        this.controls.minPolarAngle = Math.PI * 0.3;
        this.controls.maxPolarAngle = Math.PI * 0.7;
        this.controls.minAzimuthAngle = -Math.PI / 6;
        this.controls.maxAzimuthAngle = Math.PI / 6;

        this.initLight();
        this.applyPreferences();
        window.addEventListener('resize', () => this.onWindowResize(container));
        this.animate();

        console.log('✅ 3D场景初始化完成');
    }

    applyPreferences() {
        if (!this.camera || !this.controls) {
            return;
        }

        this.camera.position.copy(CONFIG.CAMERA_POSITION);
        this.controls.target.copy(CONFIG.CAMERA_TARGET);
        this.controls.minDistance = CONFIG.CAMERA_MIN_DISTANCE;
        this.controls.maxDistance = CONFIG.CAMERA_MAX_DISTANCE;
        this.camera.lookAt(CONFIG.CAMERA_TARGET);
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.applyRendererQualitySettings();
        this.applyRenderProfile(CONFIG.RENDER_PROFILE_ID, {
            syncSceneMood: Boolean(this.isModelLoaded)
        });
    }

    applyRendererQualitySettings() {
        if (!this.renderer) {
            return;
        }
        const fallbackPixelRatio = clampNumber(CONFIG.RENDER_PIXEL_RATIO, 0.5, 3, 2);
        const renderPixelRatio = clampNumber(CONFIG.RENDER_RESOLUTION_SCALE, 0.5, 3, fallbackPixelRatio);
        this.renderer.setPixelRatio(renderPixelRatio);
    }

    initLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.fillLight = new THREE.DirectionalLight(0xdfeaff, 0.28);
        this.rimLight = new THREE.DirectionalLight(0xd9ecff, 0.22);

        this.directionalLight.position.set(5, 5, 5);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight.target);
        this.fillLight.position.set(-4, 3, 4);
        this.rimLight.position.set(-4, 4, -4);
        this.scene.add(this.ambientLight);
        this.scene.add(this.directionalLight);
        this.scene.add(this.fillLight);
        this.scene.add(this.rimLight);
        this.initShadowReceiver();
        this.applyRenderProfileLighting(this.getActiveRenderProfile());
    }

    initShadowReceiver() {
        if (!this.scene || this.shadowReceiver) {
            return;
        }

        const material = new THREE.ShadowMaterial({
            color: 0x202033,
            opacity: 0.22,
            transparent: true,
            depthWrite: false
        });
        const geometry = new THREE.PlaneGeometry(GROUND_SHADOW_RECEIVER_SIZE, GROUND_SHADOW_RECEIVER_SIZE);
        this.shadowReceiver = new THREE.Mesh(geometry, material);
        this.shadowReceiver.name = 'AIGL_ShadowMap_Receiver';
        this.shadowReceiver.rotation.x = -Math.PI / 2;
        this.shadowReceiver.position.set(0, -0.015, 0);
        this.shadowReceiver.receiveShadow = true;
        this.shadowReceiver.castShadow = false;
        this.shadowReceiver.renderOrder = -10;
        this.scene.add(this.shadowReceiver);
    }

    getVrmWorldBounds() {
        if (!this.vrm?.scene) {
            return null;
        }
        const box = new THREE.Box3().setFromObject(this.vrm.scene);
        if (box.isEmpty()) {
            return null;
        }
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        return { box, size, center };
    }

    getGroundShadowTarget() {
        const bounds = this.getVrmWorldBounds();
        if (!bounds) {
            return {
                center: new THREE.Vector3(0, GROUND_SHADOW_TARGET_Y, 0),
                groundY: -0.015,
                extent: GROUND_SHADOW_MIN_CAMERA_EXTENT
            };
        }

        const maxBodyExtent = Math.max(bounds.size.x, bounds.size.y, bounds.size.z, 1.8);
        return {
            center: new THREE.Vector3(
                bounds.center.x,
                bounds.box.min.y + Math.max(bounds.size.y * 0.52, GROUND_SHADOW_TARGET_Y),
                bounds.center.z
            ),
            groundY: bounds.box.min.y - 0.015,
            extent: clampNumber(maxBodyExtent * 1.55, GROUND_SHADOW_MIN_CAMERA_EXTENT, GROUND_SHADOW_MAX_CAMERA_EXTENT, 3.2)
        };
    }

    applyRenderShadowSettings() {
        const look = getRenderLookSettings();
        const enabled = Boolean(look.shadowEnabled && look.shadowStrength > 0);
        const shadowTarget = this.getGroundShadowTarget();
        if (this.renderer) {
            this.renderer.shadowMap.enabled = enabled;
        }
        if (this.directionalLight) {
            this.directionalLight.castShadow = enabled;
            if (this.directionalLight.target) {
                this.directionalLight.target.position.copy(shadowTarget.center);
                this.directionalLight.target.updateMatrixWorld();
            }
            const shadow = this.directionalLight.shadow;
            if (shadow) {
                const shadowMapSize = Math.round(clampNumber(CONFIG.RENDER_SHADOW_MAP_SIZE, 512, 2048, 2048));
                shadow.mapSize.width = shadowMapSize;
                shadow.mapSize.height = shadowMapSize;
                shadow.bias = -0.00012;
                shadow.normalBias = 0.012;
                shadow.radius = 2.4;
                const camera = shadow.camera;
                const extent = clampNumber(
                    shadowTarget.extent * look.shadowRange,
                    GROUND_SHADOW_MIN_CAMERA_EXTENT,
                    GROUND_SHADOW_MAX_CAMERA_EXTENT,
                    3.2
                );
                camera.near = 0.05;
                camera.far = Math.max(
                    14,
                    this.directionalLight.position.distanceTo(shadowTarget.center) + extent * 2.4
                );
                camera.left = -extent;
                camera.right = extent;
                camera.top = extent;
                camera.bottom = -extent;
                camera.updateProjectionMatrix();
                shadow.needsUpdate = true;
            }
        }
        if (this.shadowReceiver) {
            this.shadowReceiver.visible = enabled;
            this.shadowReceiver.position.set(shadowTarget.center.x, shadowTarget.groundY, shadowTarget.center.z);
            this.shadowReceiver.scale.setScalar(1);
            if (this.shadowReceiver.material) {
                this.shadowReceiver.material.opacity = look.shadowStrength;
                this.shadowReceiver.material.needsUpdate = true;
            }
        }
    }

    setupVrmShadowCasting() {
        if (!this.vrm?.scene) {
            return 0;
        }

        let count = 0;
        this.vrm.scene.traverse((node) => {
            if (!node?.isMesh && !node?.isSkinnedMesh) {
                return;
            }
            node.castShadow = true;
            node.receiveShadow = false;
            count += 1;
        });
        return count;
    }

    getActiveRenderProfile() {
        return getRenderProfile(this.activeRenderProfileId || CONFIG.RENDER_PROFILE_ID);
    }

    applyRenderProfileLighting(profile = this.getActiveRenderProfile()) {
        const lighting = profile?.lighting || {};
        const look = getRenderLookSettings();
        applyLightConfig(this.ambientLight, withLightLook(lighting.ambient, {
            intensityScale: look.ambientFillScale
        }));
        applyLightConfig(this.directionalLight, withLightLook(lighting.key, {
            intensityScale: look.keyLightScale,
            yawDeg: look.lightYawDeg
        }));
        applyLightConfig(this.fillLight, withLightLook(lighting.fill, {
            intensityScale: look.ambientFillScale,
            yawDeg: look.lightYawDeg
        }));
        applyLightConfig(this.rimLight, withLightLook(lighting.rim, {
            intensityScale: Math.sqrt(look.keyLightScale),
            yawDeg: look.lightYawDeg
        }));
        this.applyRenderShadowSettings();
    }

    applyRenderProfileSceneLight(light = {}, stateName = 'idle') {
        const profile = this.getActiveRenderProfile();
        const sceneMood = profile?.lighting?.sceneMood || {};
        const look = getRenderLookSettings();
        const ambientMultiplier = numberOr(sceneMood.ambientMultiplier, 1);
        const keyMultiplier = numberOr(sceneMood.keyMultiplier, 1);
        const ambientOffset = numberOr(sceneMood.ambientOffset, 0);
        const keyOffset = numberOr(sceneMood.keyOffset, 0);
        const keyPosition = rotateLightPosition(profile?.lighting?.key?.position || [], look.lightYawDeg);

        return {
            state: stateName,
            ambientIntensity: clampNumber(
                (numberOr(light.ambientIntensity, BASE_PROFILE_LIGHT.ambientIntensity) * ambientMultiplier + ambientOffset) *
                    look.ambientFillScale,
                0.4,
                4,
                BASE_PROFILE_LIGHT.ambientIntensity
            ),
            keyIntensity: clampNumber(
                (numberOr(light.keyIntensity, BASE_PROFILE_LIGHT.keyIntensity) * keyMultiplier + keyOffset) *
                    look.keyLightScale,
                0.1,
                3,
                BASE_PROFILE_LIGHT.keyIntensity
            ),
            keyX: numberOr(light.keyX, keyPosition?.[0] ?? BASE_PROFILE_LIGHT.keyX),
            keyY: numberOr(light.keyY, keyPosition?.[1] ?? BASE_PROFILE_LIGHT.keyY),
            keyZ: numberOr(light.keyZ, keyPosition?.[2] ?? BASE_PROFILE_LIGHT.keyZ)
        };
    }

    updateAuxiliaryRenderProfileLights(currentMood = {}) {
        const profile = this.getActiveRenderProfile();
        const lighting = profile?.lighting || {};
        const sceneMood = lighting.sceneMood || {};
        const stateBoost = SCENE_STATE_LIGHT_BOOSTS[currentMood.state] || SCENE_STATE_LIGHT_BOOSTS.idle;
        const look = getRenderLookSettings();

        if (this.fillLight && lighting.fill) {
            this.fillLight.intensity = clampNumber(
                numberOr(lighting.fill.intensity, 0) * look.ambientFillScale +
                    numberOr(sceneMood.fillMoodInfluence, 0) * stateBoost.fill,
                0,
                2,
                numberOr(lighting.fill.intensity, 0)
            );
        }
        if (this.rimLight && lighting.rim) {
            this.rimLight.intensity = clampNumber(
                numberOr(lighting.rim.intensity, 0) * Math.sqrt(look.keyLightScale) +
                    numberOr(sceneMood.rimMoodInfluence, 0) * stateBoost.rim,
                0,
                2,
                numberOr(lighting.rim.intensity, 0)
            );
        }
    }

    applyRenderProfile(profileId = CONFIG.RENDER_PROFILE_ID, { syncSceneMood = true } = {}) {
        const normalizedProfileId = normalizeRenderProfileId(profileId);
        const profile = getRenderProfile(normalizedProfileId);
        this.activeRenderProfileId = normalizedProfileId;

        this.applyRenderProfileLighting(profile);

        if (this.vrm) {
            if (!this.renderProfileController) {
                this.renderProfileController = new MToonRenderProfileController({
                    vrm: this.vrm,
                    logger: console
                });
                this.renderProfileController.bindVrm(this.vrm);
            }
            const result = this.renderProfileController.apply(normalizedProfileId, getRenderLookSettings());
            console.log('🎨 AIGL 渲染方案已应用:', profile.label, result.materialSummary, result.outlineSummary);
        }
        this.applyRenderShadowSettings();

        if (syncSceneMood && this.characterRuntime?.updateSceneMoodForCurrentSurface) {
            this.sceneMoodCurrent = null;
            this.characterRuntime.updateSceneMoodForCurrentSurface('render_profile_update', {
                force: true
            });
        }

        return true;
    }

    getDefaultSceneMood() {
        return {
            state: 'idle',
            camera: {
                distance: CONFIG.CAMERA_POSITION.z,
                height: CONFIG.CAMERA_POSITION.y,
                targetY: CONFIG.CAMERA_TARGET.y,
                yaw: 0
            },
            light: {
                ambientIntensity: this.ambientLight?.intensity ?? 2.2,
                keyIntensity: this.directionalLight?.intensity ?? 1,
                keyX: this.directionalLight?.position?.x ?? 5,
                keyY: this.directionalLight?.position?.y ?? 5,
                keyZ: this.directionalLight?.position?.z ?? 5
            },
            background: '#f0f8ff'
        };
    }

    normalizeSceneMood(sceneMood = {}) {
        const defaults = this.getDefaultSceneMood();
        const requestedCamera = sceneMood.camera || {};
        const requestedLight = sceneMood.light || {};
        const sceneDistance = Number(requestedCamera.distance) || BASE_SCENE_CAMERA.distance;
        const sceneHeight = Number(requestedCamera.height) || BASE_SCENE_CAMERA.height;
        const sceneTargetY = Number(requestedCamera.targetY) || BASE_SCENE_CAMERA.targetY;
        const profileLight = this.applyRenderProfileSceneLight(
            {
                ambientIntensity: requestedLight.ambientIntensity,
                keyIntensity: requestedLight.keyIntensity,
                keyX: requestedLight.keyX,
                keyY: requestedLight.keyY,
                keyZ: requestedLight.keyZ
            },
            sceneMood.state || defaults.state || 'idle'
        );
        return {
            state: sceneMood.state || defaults.state || 'idle',
            camera: {
                distance: defaults.camera.distance + (sceneDistance - BASE_SCENE_CAMERA.distance),
                height: defaults.camera.height + (sceneHeight - BASE_SCENE_CAMERA.height),
                targetY: defaults.camera.targetY + (sceneTargetY - BASE_SCENE_CAMERA.targetY),
                yaw: Number(requestedCamera.yaw) || 0
            },
            light: {
                ambientIntensity: profileLight.ambientIntensity,
                keyIntensity: profileLight.keyIntensity,
                keyX: profileLight.keyX,
                keyY: profileLight.keyY,
                keyZ: profileLight.keyZ
            },
            background: sceneMood.background || defaults.background
        };
    }

    applySceneMood(sceneMood = {}) {
        if (!this.camera || !this.scene) {
            return false;
        }
        this.sceneMoodTarget = this.normalizeSceneMood(sceneMood);
        if (!this.sceneMoodCurrent) {
            this.sceneMoodCurrent = this.getDefaultSceneMood();
        }
        return true;
    }

    updateSceneMood(deltaTime) {
        if (!this.sceneMoodTarget || !this.camera || !this.controls) {
            return;
        }

        const lerpAlpha = Math.min(1, Math.max(0.02, deltaTime * 2.8));
        const current = this.sceneMoodCurrent || this.getDefaultSceneMood();
        const target = this.sceneMoodTarget;
        const lerp = (from, to) => THREE.MathUtils.lerp(from, to, lerpAlpha);

        current.camera.distance = lerp(current.camera.distance, target.camera.distance);
        current.camera.height = lerp(current.camera.height, target.camera.height);
        current.camera.targetY = lerp(current.camera.targetY, target.camera.targetY);
        current.camera.yaw = lerp(current.camera.yaw, target.camera.yaw);
        current.state = target.state || current.state || 'idle';
        current.light.ambientIntensity = lerp(current.light.ambientIntensity, target.light.ambientIntensity);
        current.light.keyIntensity = lerp(current.light.keyIntensity, target.light.keyIntensity);
        current.light.keyX = lerp(current.light.keyX, target.light.keyX);
        current.light.keyY = lerp(current.light.keyY, target.light.keyY);
        current.light.keyZ = lerp(current.light.keyZ, target.light.keyZ);

        const cameraDistance = current.camera.distance;
        this.camera.position.set(
            Math.sin(current.camera.yaw) * cameraDistance,
            current.camera.height,
            Math.cos(current.camera.yaw) * cameraDistance
        );
        this.controls.target.set(CONFIG.CAMERA_TARGET.x, current.camera.targetY, CONFIG.CAMERA_TARGET.z);
        this.camera.lookAt(this.controls.target);

        if (this.ambientLight) {
            this.ambientLight.intensity = current.light.ambientIntensity;
        }
        if (this.directionalLight) {
            this.directionalLight.intensity = current.light.keyIntensity;
            this.directionalLight.position.set(current.light.keyX, current.light.keyY, current.light.keyZ);
        }
        this.updateAuxiliaryRenderProfileLights(current);
        if (this.scene.background && current.background) {
            this.scene.background = new THREE.Color(current.background);
        }

        this.sceneMoodCurrent = current;
    }

    getHumanoidBoneNode(boneName) {
        const humanoid = this.vrm?.humanoid;
        if (!humanoid) {
            return null;
        }

        return humanoid.getNormalizedBoneNode?.(boneName) ||
            humanoid.getRawBoneNode?.(boneName) ||
            humanoid.getBoneNode?.(boneName) ||
            null;
    }

    projectWorldPointToRenderer(worldPosition, canvasRect = null) {
        if (!this.camera || !this.renderer?.domElement || !worldPosition) {
            return null;
        }

        const rect = canvasRect || this.renderer.domElement.getBoundingClientRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) {
            return null;
        }

        const projected = this.avatarProjectionScratch.copy(worldPosition).project(this.camera);
        if (
            !Number.isFinite(projected.x) ||
            !Number.isFinite(projected.y) ||
            !Number.isFinite(projected.z)
        ) {
            return null;
        }

        if (projected.z < -1.15 || projected.z > 1.15) {
            return null;
        }

        return {
            x: rect.left + ((projected.x + 1) / 2) * rect.width,
            y: rect.top + ((1 - projected.y) / 2) * rect.height
        };
    }

    collectAvatarBoneScreenPoints() {
        if (!this.vrm || !this.camera || !this.renderer) {
            return [];
        }

        this.vrm.scene.updateWorldMatrix(true, true);
        this.camera.updateMatrixWorld(true);

        const points = [];
        const worldPosition = this.avatarWorldPositionScratch;
        const canvasRect = this.renderer.domElement.getBoundingClientRect();
        for (const boneName of AVATAR_HIT_TEST_BONES) {
            const boneNode = this.getHumanoidBoneNode(boneName);
            if (!boneNode) {
                continue;
            }
            boneNode.getWorldPosition(worldPosition);
            const screenPoint = this.projectWorldPointToRenderer(worldPosition, canvasRect);
            if (screenPoint) {
                points.push(screenPoint);
            }
        }
        return points;
    }

    computeAvatarBoxScreenBounds() {
        if (!this.vrm?.scene || !this.camera || !this.renderer?.domElement) {
            return null;
        }

        this.vrm.scene.updateWorldMatrix(true, true);
        this.camera.updateMatrixWorld(true);

        const box = this.avatarBoxScratch.setFromObject(this.vrm.scene);
        if (box.isEmpty()) {
            return null;
        }

        const corners = this.avatarBoxCornerScratch;
        corners[0].set(box.min.x, box.min.y, box.min.z);
        corners[1].set(box.min.x, box.min.y, box.max.z);
        corners[2].set(box.min.x, box.max.y, box.min.z);
        corners[3].set(box.min.x, box.max.y, box.max.z);
        corners[4].set(box.max.x, box.min.y, box.min.z);
        corners[5].set(box.max.x, box.min.y, box.max.z);
        corners[6].set(box.max.x, box.max.y, box.min.z);
        corners[7].set(box.max.x, box.max.y, box.max.z);
        const canvasRect = this.renderer.domElement.getBoundingClientRect();
        const points = corners
            .map((corner) => this.projectWorldPointToRenderer(corner, canvasRect))
            .filter(Boolean);

        return this.buildAvatarScreenBounds(points, {
            source: 'avatar_box',
            horizontalPaddingRatio: 0.06,
            topPaddingRatio: 0.04,
            bottomPaddingRatio: 0.05
        });
    }

    buildAvatarScreenBounds(points, {
        source = 'avatar_bones',
        horizontalPaddingRatio = 0.22,
        topPaddingRatio = 0.13,
        bottomPaddingRatio = 0.1
    } = {}) {
        if (!Array.isArray(points) || points.length < 4 || !this.renderer?.domElement) {
            return null;
        }

        const canvasRect = this.renderer.domElement.getBoundingClientRect();
        const minX = Math.min(...points.map((point) => point.x));
        const maxX = Math.max(...points.map((point) => point.x));
        const minY = Math.min(...points.map((point) => point.y));
        const maxY = Math.max(...points.map((point) => point.y));
        const rawWidth = Math.max(1, maxX - minX);
        const rawHeight = Math.max(1, maxY - minY);
        const horizontalPadding = Math.max(18, rawWidth * horizontalPaddingRatio, canvasRect.width * 0.035);
        const topPadding = Math.max(16, rawHeight * topPaddingRatio, canvasRect.height * 0.035);
        const bottomPadding = Math.max(20, rawHeight * bottomPaddingRatio, canvasRect.height * 0.04);
        const left = Math.max(canvasRect.left, minX - horizontalPadding);
        const top = Math.max(canvasRect.top, minY - topPadding);
        const right = Math.min(canvasRect.right, maxX + horizontalPadding);
        const bottom = Math.min(canvasRect.bottom, maxY + bottomPadding);
        const width = right - left;
        const height = bottom - top;

        if (width < 24 || height < 32) {
            return null;
        }

        return {
            left,
            top,
            right,
            bottom,
            width,
            height,
            centerX: left + width / 2,
            centerY: top + height / 2,
            source,
            pointCount: points.length
        };
    }

    computeAvatarHitTestBounds() {
        const boneBounds = this.buildAvatarScreenBounds(
            this.collectAvatarBoneScreenPoints(),
            { source: 'avatar_bones' }
        );
        if (boneBounds) {
            return boneBounds;
        }
        return this.computeAvatarBoxScreenBounds();
    }

    updateAvatarHitTestBounds({ force = false } = {}) {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (
            !force &&
            this.avatarHitTestBounds &&
            now - this.avatarHitTestBoundsUpdatedAt < AVATAR_HIT_TEST_CACHE_MS
        ) {
            return this.avatarHitTestBounds;
        }

        try {
            this.avatarHitTestBounds = this.computeAvatarHitTestBounds();
        } catch {
            this.avatarHitTestBounds = null;
        }
        this.avatarHitTestBoundsUpdatedAt = now;
        return this.avatarHitTestBounds;
    }

    getAvatarHitTestBounds() {
        return this.updateAvatarHitTestBounds();
    }

    async loadModel() {
        try {
            console.log('⏳ 开始加载VRM模型...');
            const loader = new GLTFLoader();
            loader.register((parser) => new VRMLoaderPlugin(parser));

            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    CONFIG.MODEL_PATH,
                    resolve,
                    (progress) => {
                        const percent = (progress.loaded / progress.total * 100).toFixed(2);
                        console.log(`模型加载中：${percent}%`);
                    },
                    reject
                );
            });

            this.vrm = gltf.userData.vrm;
            VRMUtils.rotateVRM0(this.vrm);
            this.vrm.scene.scale.set(1, 1, 1);
            this.scene.add(this.vrm.scene);
            const shadowCasterCount = this.setupVrmShadowCasting();
            this.renderProfileController = new MToonRenderProfileController({
                vrm: this.vrm,
                logger: console
            });
            this.renderProfileController.bindVrm(this.vrm);
            this.applyRenderProfile(CONFIG.RENDER_PROFILE_ID, {
                syncSceneMood: false
            });

            this.initExpressionSystem();
            this.isModelLoaded = true;
            await this.loadAllAnimations();

            console.log('✅ VRM模型和动作全部加载完成！');
            console.log('🌓 VRM 阴影投射 Mesh 数量:', shadowCasterCount);
            console.log('📦 当前已加载的动作列表:', Object.keys(this.actionMap));
            window.dispatchEvent(new CustomEvent('modelLoaded'));
        } catch (error) {
            console.error('❌ 模型加载失败：', error);
            window.dispatchEvent(new CustomEvent('modelLoadError', { detail: error }));
        }
    }

    initExpressionSystem() {
        if (!this.vrm) return;
        console.log('✅ 可用表情列表:', this.vrm.expressionManager.expressions.map((item) => item.expressionName));
        this.characterEmoteController?.bindVrm(this.vrm);
        this.resetExpression();
    }

    async loadAllAnimations() {
        console.log('⏳ 开始加载VRMA动作文件...');
        this.mixer = new THREE.AnimationMixer(this.vrm.scene);
        this.motionController.bind({
            mixer: this.mixer,
            actionMap: this.actionMap
        });

        const animLoader = new GLTFLoader();
        animLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));

        for (const fileInfo of CONFIG.ANIMATION_FILES) {
            try {
                await this.loadSingleAnimation(animLoader, fileInfo);
            } catch (error) {
                console.error(`❌ 加载动作失败: ${fileInfo.name}`, error);
            }
        }

        this.setupActionFinishListener();
        this.motionController.prepareAllActions();
        this.playResolvedAction('idle');
        console.log('🎬 默认动作：IDLE 循环模式启动');
    }

    loadSingleAnimation(loader, fileInfo) {
        return new Promise((resolve, reject) => {
            loader.load(
                fileInfo.path,
                (gltf) => {
                    let vrmAnimation = gltf.userData.vrmAnimation;
                    if (!vrmAnimation && gltf.userData.vrmAnimations?.length > 0) {
                        vrmAnimation = gltf.userData.vrmAnimations[0];
                    }

                    let clip;
                    if (!vrmAnimation && gltf.animations?.length > 0) {
                        clip = gltf.animations[0];
                    } else if (vrmAnimation) {
                        clip = createVRMAnimationClip(vrmAnimation, this.vrm);
                    } else {
                        reject(new Error('无法解析动画文件格式'));
                        return;
                    }

                    const action = this.mixer.clipAction(clip);
                    this.actionMap[fileInfo.name] = action;
                    this.motionController?.prepareAction(fileInfo.name, action);
                    resolve();
                },
                () => {},
                reject
            );
        });
    }

    setupActionFinishListener() {
        if (!this.mixer || !this.motionController) return;
        this.motionController.bind({
            mixer: this.mixer,
            actionMap: this.actionMap
        });
    }

    getActionNameByInstance(actionInstance) {
        return this.motionController?.getActionNameByInstance(actionInstance) ||
            Object.keys(this.actionMap).find((name) => this.actionMap[name] === actionInstance) ||
            '';
    }

    getCurrentActionName() {
        return this.motionController?.getCurrentActionName() ||
            this.getActionNameByInstance(this.currentAction) ||
            '';
    }

    setCharacterSurfaceState(surface) {
        this.currentSurfaceState = surface || null;
    }

    applyPersonaSurfacePayload(payload = {}, context = {}) {
        if (!this.characterRuntime) {
            return null;
        }
        return this.characterRuntime.applyPayload(payload, context);
    }

    playAction(actionName, options = {}) {
        if (actionName === 'idle') {
            return this.playResolvedAction('idle');
        }

        return this.applyPersonaSurfacePayload({
            action: actionName,
            source: 'legacy_action'
        }, {
            source: 'legacy_action',
            allowLegacyActionMotion: true,
            allowExperimentalMotion: Boolean(options.allowExperimental)
        });
    }

    playResolvedAction(actionName, options = {}) {
        if (!this.isModelLoaded) {
            console.warn('⚠️ 模型未加载');
            return false;
        }

        const played = this.motionController?.play(actionName, options) ?? false;
        this.currentAction = this.motionController?.currentAction || this.currentAction;
        return played;
    }

    getRandomIdleAction() {
        return this.motionController?.selectIdleAction() || null;
    }

    getRandomDanceAction() {
        return this.motionController?.selectDanceAction() || null;
    }

    applyExpressionPreset(expressionName) {
        if (expressionName === 'neutral') {
            this.resetExpression();
            return;
        }

        const presetValue = this.getExpressionPresetValue(expressionName);
        if (typeof presetValue !== 'number') {
            console.warn(`⚠️ 表情预设 "${expressionName}" 不存在`);
            return;
        }

        this.applyExpressionMix({ [expressionName]: presetValue }, {
            durationHint: this.isBlinkExpression(expressionName) ? 'short' : 'medium'
        });
    }

    applyExpressionMix(expressionMix = {}, { durationHint = 'short' } = {}) {
        if (!this.isModelLoaded || !this.vrm || !expressionMix || typeof expressionMix !== 'object') {
            return false;
        }

        return this.characterEmoteController?.setEmotionMix(expressionMix, { durationHint }) ?? false;
    }

    setExpression(expressionName, value) {
        if (!this.isModelLoaded || !this.vrm) return;
        this.characterEmoteController?.setEmotionMix({ [expressionName]: value }, {
            durationHint: 'hold'
        });
    }

    clearExpressionValues() {
        if (!this.isModelLoaded || !this.vrm) return;
        this.activeExpressions.clear();
        this.characterEmoteController?.clearEmotionMix();
    }

    resetExpression() {
        this.clearExpressionValues();
    }

    scheduleNeutralReset() {
        // Expression lifetimes are owned by CharacterEmoteController.
    }

    startAudioDrivenSpeech() {
        if (!this.isModelLoaded) return;
        clearTimeout(this.speechIdleResetTimer);
        this.speechIdleResetTimer = null;
        this.isSpeaking = true;
        this.useExternalLipSync = true;
        this.externalLipSyncValue = 0;
    }

    startFallbackSpeech() {
        if (!this.isModelLoaded) return;
        clearTimeout(this.speechIdleResetTimer);
        this.speechIdleResetTimer = null;
        this.isSpeaking = true;
        this.useExternalLipSync = false;
        this.speakTimeAccumulator = 0;
    }

    setLipSyncValue(value) {
        if (!this.isModelLoaded) return;
        this.isSpeaking = true;
        this.useExternalLipSync = true;
        this.externalLipSyncValue = THREE.MathUtils.clamp(value, 0, CONFIG.MAX_MOUTH_OPEN);
    }

    stopSpeaking() {
        if (!this.isModelLoaded || !this.vrm) return;
        this.isSpeaking = false;
        this.useExternalLipSync = false;
        this.externalLipSyncValue = 0;
        this.smoothedLipSyncValue = 0;
        this.characterEmoteController?.setLipSyncValue(0);
        clearTimeout(this.speechIdleResetTimer);
        this.speechIdleResetTimer = setTimeout(() => {
            this.speechIdleResetTimer = null;
            if (this.isSpeaking || this.currentSurfaceState?.taskState !== 'speaking') {
                return;
            }
            this.characterRuntime?.setSurfaceState({
                taskState: 'idle',
                gestureIntent: 'none',
                source: 'speech_end'
            });
        }, 900);
    }

    triggerBlink() {
        if (!this.isModelLoaded || !this.autoBlinkEnabled) return;
        return this.characterEmoteController?.forceBlink() ?? false;
    }

    onWindowResize(container) {
        if (!this.camera || !this.renderer) return;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.applyRendererQualitySettings();
    }

    animate(timestamp = 0) {
        requestAnimationFrame(this.animate);
        const fpsLimit = clampNumber(CONFIG.RENDER_FPS_LIMIT, 24, 60, 60);
        const frameIntervalMs = 1000 / fpsLimit;
        if (
            this.lastRenderTimestamp > 0 &&
            timestamp > 0 &&
            timestamp - this.lastRenderTimestamp < frameIntervalMs
        ) {
            return;
        }
        this.lastRenderTimestamp = timestamp || performance.now();
        const deltaTime = Math.min(this.clock.getDelta(), 0.1);

        this.characterRuntime?.beginFrame?.();
        if (this.mixer) this.mixer.update(deltaTime);
        this.characterRuntime?.update(deltaTime, {
            vrm: this.vrm,
            isSpeaking: this.isSpeaking,
            lipSyncValue: this.smoothedLipSyncValue,
            currentMotion: this.getCurrentActionName()
        });
        this.updateSceneMood(deltaTime);

        this.updateSpeaking(deltaTime);
        this.characterEmoteController?.setAutoBlinkEnabled(this.autoBlinkEnabled);
        this.characterEmoteController?.update(deltaTime);

        if (this.vrm) this.vrm.update(deltaTime);
        if (this.controls?.enabled) {
            this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    updateAutoBlink() {
        this.characterEmoteController?.setAutoBlinkEnabled(this.autoBlinkEnabled);
    }

    updateSpeaking(deltaTime) {
        if (!this.isModelLoaded || !this.vrm) return;

        let targetLipSyncValue = 0;
        if (this.isSpeaking) {
            if (this.useExternalLipSync) {
                targetLipSyncValue = this.externalLipSyncValue;
            } else {
                this.speakTimeAccumulator += deltaTime;
                const pulse = 0.5 - 0.5 * Math.cos(this.speakTimeAccumulator * Math.PI * 2 * CONFIG.SPEAK_SPEED);
                targetLipSyncValue = Math.pow(pulse, CONFIG.AUDIO_LIP_SYNC_PULSE_SHAPE) * CONFIG.SPEAK_AMPLITUDE;
            }
        }

        this.smoothedLipSyncValue = THREE.MathUtils.lerp(
            this.smoothedLipSyncValue,
            targetLipSyncValue,
            CONFIG.LIP_SYNC_SMOOTHING
        );

        this.applyLipSyncValue(this.smoothedLipSyncValue);
    }

    applyLipSyncValue(value) {
        if (!this.vrm) return;

        const safeValue = THREE.MathUtils.clamp(value, 0, CONFIG.MAX_MOUTH_OPEN);
        this.characterEmoteController?.setLipSyncValue(safeValue);
    }
}
