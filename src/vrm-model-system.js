import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createVRMAnimationClip, VRMAnimationLoaderPlugin } from '@pixiv/three-vrm-animation';

import { CONFIG } from './config.js';

export class VRMModelSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.controls = null;
        this.clock = new THREE.Clock();

        this.vrm = null;
        this.mixer = null;
        this.actionMap = {};
        this.currentAction = null;

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

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(CONFIG.RENDER_PIXEL_RATIO);
        container.appendChild(this.renderer.domElement);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

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
    }

    initLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

        directionalLight.position.set(5, 5, 5);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
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

            this.initExpressionSystem();
            this.isModelLoaded = true;
            await this.loadAllAnimations();

            console.log('✅ VRM模型和动作全部加载完成！');
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
        this.resetExpression();
    }

    async loadAllAnimations() {
        console.log('⏳ 开始加载VRMA动作文件...');
        this.mixer = new THREE.AnimationMixer(this.vrm.scene);

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
        this.playAction('idle');
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
                    if (CONFIG.IDLE_ACTION_LIST.includes(fileInfo.name)) {
                        action.setLoop(THREE.LoopRepeat, Infinity);
                        action.clampWhenFinished = false;
                    } else {
                        action.setLoop(THREE.LoopOnce, 1);
                        action.clampWhenFinished = true;
                    }

                    this.actionMap[fileInfo.name] = action;
                    resolve();
                },
                () => {},
                reject
            );
        });
    }

    setupActionFinishListener() {
        if (!this.mixer) return;

        this.mixer.addEventListener('finished', (event) => {
            const finishedAction = event.action;
            const finishedName = this.getActionNameByInstance(finishedAction);
            const isIdleAction = finishedName && CONFIG.IDLE_ACTION_LIST.includes(finishedName);
            const isCurrentAction = finishedAction === this.currentAction;

            if (isIdleAction) {
                console.log(`🔄 IDLE动作(${finishedName})播放完毕，继续下一个IDLE`);
                return;
            }

            if (!isCurrentAction) {
                console.log(`⏭️ 忽略已结束的旧动作(${finishedName})，当前动作仍在播放`);
                return;
            }

            console.log(`🔄 交互动作(${finishedName})播放完毕，切回IDLE`);
            this.playAction('idle');
        });
    }

    getActionNameByInstance(actionInstance) {
        return Object.keys(this.actionMap).find((name) => this.actionMap[name] === actionInstance);
    }

    playAction(actionName) {
        if (!this.isModelLoaded) {
            console.warn('⚠️ 模型未加载');
            return;
        }

        let targetActionName = actionName;
        if (actionName === 'idle') {
            targetActionName = this.getRandomIdleAction();
        } else if (actionName === 'dance') {
            targetActionName = this.getRandomDanceAction();
            console.log(`💃 Dance指令触发，随机选中: ${targetActionName}`);
        }

        if (!targetActionName || !this.actionMap[targetActionName]) {
            console.warn(`⚠️ 动作 "${targetActionName}" 不存在`);
            return;
        }

        const nextAction = this.actionMap[targetActionName];
        if (this.currentAction === nextAction) return;

        const isIdleAction = CONFIG.IDLE_ACTION_LIST.includes(targetActionName);

        if (isIdleAction) {
            nextAction.setLoop(THREE.LoopRepeat, Infinity);
            nextAction.clampWhenFinished = false;
        } else {
            nextAction.setLoop(THREE.LoopOnce, 1);
            nextAction.clampWhenFinished = true;
        }

        if (this.currentAction) {
            this.currentAction.enabled = true;
            nextAction.enabled = true;
            nextAction.reset();
            nextAction.time = 0;
            this.currentAction.crossFadeTo(nextAction, CONFIG.CROSS_FADE_DURATION, true);
            nextAction.play();
        } else {
            nextAction.reset();
            nextAction.play();
        }

        this.currentAction = nextAction;
        if (actionName !== 'idle') {
            console.log(`🎬 播放动作: ${targetActionName}`);
        }
    }

    getRandomIdleAction() {
        const availableIdles = CONFIG.IDLE_ACTION_LIST.filter((name) => this.actionMap[name]);
        if (availableIdles.length === 0) return null;

        let candidates = availableIdles;
        if (this.currentAction && availableIdles.length > 1) {
            const currentName = this.getActionNameByInstance(this.currentAction);
            if (currentName) {
                candidates = availableIdles.filter((name) => name !== currentName);
            }
        }

        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    getRandomDanceAction() {
        const availableDances = CONFIG.DANCE_ACTION_LIST.filter((name) => this.actionMap[name]);
        if (availableDances.length === 0) return null;

        let candidates = availableDances;
        if (this.currentAction && availableDances.length > 1) {
            const currentName = this.getActionNameByInstance(this.currentAction);
            if (currentName) {
                candidates = availableDances.filter((name) => name !== currentName);
            }
        }

        return candidates[Math.floor(Math.random() * candidates.length)];
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

        if (this.isBlinkExpression(expressionName)) {
            this.vrm.expressionManager.setValue('blink', 0);
            this.vrm.expressionManager.setValue('blinkLeft', 0);
            this.vrm.expressionManager.setValue('blinkRight', 0);
            this.activeExpressions.delete('blink');
            this.activeExpressions.delete('blinkLeft');
            this.activeExpressions.delete('blinkRight');
            this.blinkTimer = 0;
            this.nextBlinkTime = CONFIG.BLINK_MIN_INTERVAL +
                Math.random() * (CONFIG.BLINK_MAX_INTERVAL - CONFIG.BLINK_MIN_INTERVAL);
        }

        this.setExpression(expressionName, presetValue);
        this.scheduleNeutralReset(expressionName);
    }

    setExpression(expressionName, value) {
        if (!this.isModelLoaded || !this.vrm) return;
        this.clearExpressionValues({ preserveLipSync: this.isSpeaking });

        if (value > 0) {
            this.activeExpressions.add(expressionName);
        } else {
            this.activeExpressions.delete(expressionName);
        }

        this.vrm.expressionManager.setValue(expressionName, value);
    }

    clearExpressionValues({ preserveLipSync = false } = {}) {
        if (!this.isModelLoaded || !this.vrm) return;

        if (this.expressionResetTimer) {
            clearTimeout(this.expressionResetTimer);
            this.expressionResetTimer = null;
        }

        const nextActiveExpressions = new Set();
        this.activeExpressions.forEach((expressionName) => {
            if (preserveLipSync && expressionName === 'aa') {
                nextActiveExpressions.add('aa');
                return;
            }
            this.vrm.expressionManager.setValue(expressionName, 0);
        });

        this.activeExpressions = nextActiveExpressions;

        if (!preserveLipSync) {
            this.vrm.expressionManager.setValue('aa', 0);
        }

        this.vrm.expressionManager.setValue('neutral', this.getExpressionPresetValue('neutral') ?? 0);
    }

    resetExpression() {
        this.clearExpressionValues({ preserveLipSync: this.isSpeaking });
    }

    scheduleNeutralReset(expressionName) {
        if (!this.isModelLoaded || !this.vrm) return;
        if (!expressionName || expressionName === 'neutral') return;

        if (this.expressionResetTimer) {
            clearTimeout(this.expressionResetTimer);
        }

        this.expressionResetTimer = setTimeout(() => {
            this.resetExpression();
        }, this.isBlinkExpression(expressionName) ? CONFIG.BLINK_EXPRESSION_HOLD_MS : CONFIG.EXPRESSION_HOLD_MS);
    }

    startAudioDrivenSpeech() {
        if (!this.isModelLoaded) return;
        this.isSpeaking = true;
        this.useExternalLipSync = true;
        this.externalLipSyncValue = 0;
    }

    startFallbackSpeech() {
        if (!this.isModelLoaded) return;
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
        this.vrm.expressionManager.setValue('aa', 0);
        this.activeExpressions.delete('aa');
    }

    triggerBlink() {
        if (!this.isModelLoaded || !this.autoBlinkEnabled) return;
        if (this.hasBlockingEmotionExpression()) return;
        if (this.hasActiveBlinkExpression()) return;

        this.vrm.expressionManager.setValue('blink', this.getExpressionPresetValue('blink') ?? 0.8);
        this.activeExpressions.add('blink');

        setTimeout(() => {
            if (!this.vrm) return;
            this.vrm.expressionManager.setValue('blink', 0);
            this.activeExpressions.delete('blink');
        }, 150);
    }

    onWindowResize(container) {
        if (!this.camera || !this.renderer || !this.composer) return;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.composer.setSize(container.clientWidth, container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);
        const deltaTime = this.clock.getDelta();

        if (this.vrm) this.vrm.update(deltaTime);
        if (this.mixer) this.mixer.update(deltaTime);

        this.updateAutoBlink(deltaTime);
        this.updateSpeaking(deltaTime);

        this.controls.update();
        this.composer.render();
    }

    updateAutoBlink(deltaTime) {
        if (!this.autoBlinkEnabled || !this.isModelLoaded) return;
        if (this.hasBlockingEmotionExpression()) return;
        if (this.hasActiveBlinkExpression()) return;

        this.blinkTimer += deltaTime * 1000;
        if (this.blinkTimer >= this.nextBlinkTime) {
            this.triggerBlink();
            this.blinkTimer = 0;
            this.nextBlinkTime = CONFIG.BLINK_MIN_INTERVAL +
                Math.random() * (CONFIG.BLINK_MAX_INTERVAL - CONFIG.BLINK_MIN_INTERVAL);
        }
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
        this.vrm.expressionManager.setValue('aa', safeValue);

        if (safeValue > 0.02) {
            this.activeExpressions.add('aa');
        } else {
            this.activeExpressions.delete('aa');
        }
    }
}
