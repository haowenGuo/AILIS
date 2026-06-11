import { CharacterBehaviorScheduler } from './behavior-scheduler.js';
import { CharacterSceneDirector } from './scene-director.js';
import { CharacterStateMachine } from './character-state-machine.js';
import { mixExpressionsForSurface } from './emotion-mixer.js';
import { selectMotionForSurface } from './motion-library.js';
import { createPersonaSurfaceFromPayload, normalizePersonaSurfaceState } from './persona-surface.js';
import { surfaceToScreenplay } from './chatvrm-amica-screenplay.js';

export class CharacterRuntime {
    constructor({
        driver = null,
        scheduler = new CharacterBehaviorScheduler(),
        stateMachine = new CharacterStateMachine(),
        sceneDirector = new CharacterSceneDirector()
    } = {}) {
        this.driver = driver;
        this.scheduler = scheduler;
        this.stateMachine = stateMachine;
        this.sceneDirector = sceneDirector;
        this.currentSurface = normalizePersonaSurfaceState({
            emotion: 'relaxed',
            taskState: 'idle',
            gestureIntent: 'none',
            intensity: 0.32,
            gazeTarget: 'user',
            durationHint: 'hold',
            source: 'runtime_init'
        });
        this.currentRoleState = this.stateMachine.transition(this.currentSurface);
        this.currentSceneMood = this.sceneDirector.createSceneMood(
            this.currentRoleState.state,
            this.currentRoleState.surface
        );
        this.lastSceneMoodSignature = this.createSceneMoodSignature(
            this.currentRoleState,
            this.currentSurface
        );
        this.lastAppliedSceneMoodSignature = '';
        this.idleMotionTimerMs = 0;
        this.nextIdleMotionMs = this.pickNextIdleMotionDelayMs();
    }

    setDriver(driver) {
        this.driver = driver;
    }

    createSceneMoodSignature(roleState = this.currentRoleState, surface = this.currentSurface) {
        const activeSurface = surface || {};
        return [
            roleState?.state || '',
            activeSurface.emotion || '',
            activeSurface.taskState || '',
            activeSurface.socialTone || '',
            activeSurface.gazeTarget || '',
            Number(activeSurface.intensity || 0).toFixed(3),
            Number(activeSurface.speechEnergy || 0).toFixed(3)
        ].join('|');
    }

    updateSceneMoodForCurrentSurface(source = 'runtime_update', { force = false } = {}) {
        const signature = this.createSceneMoodSignature(this.currentRoleState, this.currentSurface);
        if (!force && signature === this.lastAppliedSceneMoodSignature) {
            return this.currentSceneMood;
        }

        this.currentSceneMood = this.sceneDirector.createSceneMood(
            this.currentRoleState.state,
            this.currentSurface
        );
        this.lastSceneMoodSignature = signature;
        this.lastAppliedSceneMoodSignature = signature;
        this.driver?.applySceneMood?.(this.currentSceneMood, {
            source
        });
        return this.currentSceneMood;
    }

    setSurfaceState(surfacePatch = {}) {
        const normalizedSurface = normalizePersonaSurfaceState(surfacePatch, this.currentSurface);
        this.currentRoleState = this.stateMachine.transition(normalizedSurface);
        this.currentSurface = this.currentRoleState.surface;
        this.scheduler.setSurface(this.currentSurface);
        this.driver?.setSurfaceState?.(this.currentSurface);
        this.updateSceneMoodForCurrentSurface(this.currentSurface.source, {
            force: true
        });
        return this.currentSurface;
    }

    applyPayload(payload = {}, context = {}) {
        const normalizedSurface = createPersonaSurfaceFromPayload(payload, {
            ...context,
            previousSurface: this.currentSurface
        });
        this.currentRoleState = this.stateMachine.transition(normalizedSurface, context);
        const surface = this.currentRoleState.surface;
        this.currentSurface = surface;
        this.scheduler.setSurface(surface);
        this.driver?.setSurfaceState?.(surface);

        this.updateSceneMoodForCurrentSurface(surface.source, {
            force: true
        });

        const expressionMix = mixExpressionsForSurface(surface);
        const screenplay = surfaceToScreenplay(
            surface,
            payload.display_text || payload.speech_text || payload.raw_text || ''
        );
        this.driver?.applyExpressionMix?.(expressionMix, {
            durationHint: surface.durationHint,
            source: surface.source
        });

        const motion = selectMotionForSurface(surface, {
            availableActions: this.driver?.getAvailableMotions?.() || [],
            currentMotion: this.driver?.getCurrentMotion?.() || '',
            allowLegacyActionMotion: Boolean(context.allowLegacyActionMotion),
            allowExperimentalMotion: Boolean(context.allowExperimentalMotion || context.allowExperimental),
            allowExpressiveMotion: this.shouldAllowExpressiveMotion(surface, context),
            random: context.random
        });
        const playedMotion = motion
            ? this.driver?.playMotion?.(motion, {
                allowExperimental: Boolean(context.allowExperimentalMotion || context.allowExperimental)
            })
            : false;
        if (playedMotion) {
            this.resetIdleMotionTimer();
        }

        return {
            surface,
            screenplay,
            roleState: this.currentRoleState,
            sceneMood: this.currentSceneMood,
            expressionMix,
            motion,
            playedMotion: Boolean(playedMotion)
        };
    }

    pickNextIdleMotionDelayMs(surface = this.currentSurface) {
        const state = surface?.taskState || 'idle';
        const intensity = Number(surface?.intensity) || 0.35;
        const baseMin = state === 'thinking' || state === 'working' ? 16000 : 19000;
        const baseMax = state === 'thinking' || state === 'working' ? 26000 : 32000;
        const intensityBias = Math.max(0, Math.min(1500, intensity * 1500));
        return Math.max(12000, baseMin + Math.random() * (baseMax - baseMin) - intensityBias);
    }

    resetIdleMotionTimer() {
        this.idleMotionTimerMs = 0;
        this.nextIdleMotionMs = this.pickNextIdleMotionDelayMs();
    }

    shouldRunIdleMotion(context = {}) {
        if (context.isSpeaking) {
            return false;
        }
        const state = this.currentRoleState?.state || this.currentSurface?.taskState || 'idle';
        if (!['idle', 'listening', 'thinking', 'working', 'waiting_approval'].includes(state)) {
            return false;
        }
        const currentMotion = String(context.currentMotion || this.driver?.getCurrentMotion?.() || '');
        return !currentMotion || currentMotion.startsWith('idle');
    }

    runIdleMotion(context = {}) {
        return this.driver?.playMotion?.('idle') ?? false;
    }

    shouldAllowExpressiveMotion(surface = {}, context = {}) {
        if (context.allowExpressiveMotion) {
            return true;
        }
        if (context.allowLegacyActionMotion) {
            return true;
        }
        if (surface.legacyAction === 'dance') {
            return true;
        }
        if (surface.legacyAction) {
            return ['greeting', 'farewell', 'success', 'celebrate', 'surprised', 'dance'].includes(surface.gestureIntent);
        }
        return surface.gestureIntent === 'dance' || surface.gestureIntent === 'farewell';
    }

    updateIdleMotion(deltaTime, context = {}) {
        if (!this.shouldRunIdleMotion(context)) {
            this.resetIdleMotionTimer();
            return;
        }
        this.idleMotionTimerMs += Math.max(0, deltaTime) * 1000;
        if (this.idleMotionTimerMs < this.nextIdleMotionMs) {
            return;
        }
        const played = this.runIdleMotion(context);
        if (played) {
            this.resetIdleMotionTimer();
            return;
        }
        this.nextIdleMotionMs += 4000;
    }

    beginFrame() {
        this.scheduler.beginFrame?.();
    }

    update(deltaTime, context = {}) {
        this.currentRoleState = this.stateMachine.update(deltaTime, this.currentSurface, context);
        this.currentSurface = this.currentRoleState.surface;
        this.driver?.setSurfaceState?.(this.currentSurface);
        this.updateSceneMoodForCurrentSurface('runtime_update');
        this.updateIdleMotion(deltaTime, context);
        this.scheduler.update({
            ...context,
            deltaTime,
            surface: this.currentSurface
        });
    }
}
