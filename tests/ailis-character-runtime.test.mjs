import assert from 'node:assert/strict';
import test from 'node:test';

import { CharacterRuntime } from '../src/character/character-runtime.js';
import { CharacterSceneDirector } from '../src/character/scene-director.js';
import { CharacterStateMachine } from '../src/character/character-state-machine.js';
import { CharacterEmoteController } from '../src/character/emote-controller.js';
import { ChatVRMAmicaMotionController } from '../src/character/chatvrm-amica-motion-controller.js';
import { parseEmotionTaggedText, surfaceToScreenplay, textsToScreenplay } from '../src/character/chatvrm-amica-screenplay.js';
import { CharacterBehaviorScheduler } from '../src/character/behavior-scheduler.js';
import { mixExpressionsForSurface } from '../src/character/emotion-mixer.js';
import { isMotionApproved, listMotionLibrary, selectMotionForSurface } from '../src/character/motion-library.js';
import { getLoadableMotionFiles, listMotionIntakeEntries, listMotionIntakeSources } from '../src/character/motion-intake-catalog.js';
import { createPersonaSurfaceFromPayload, normalizePersonaSurfaceState } from '../src/character/persona-surface.js';

test('persona surface normalizes legacy avatar cue into semantic state', () => {
    const surface = createPersonaSurfaceFromPayload({
        display_text: '你好呀，我在。',
        action: 'wave',
        expression: 'happy'
    });

    assert.equal(surface.emotion, 'happy');
    assert.equal(surface.gestureIntent, 'greeting');
    assert.equal(surface.taskState, 'speaking');
    assert.equal(surface.legacyAction, 'wave');
});

test('motion library does not auto-play one-shot motion for semantic thinking state', () => {
    const surface = normalizePersonaSurfaceState({
        emotion: 'thinking',
        gestureIntent: 'thinking',
        taskState: 'thinking'
    });
    const motion = selectMotionForSurface(surface, {
        availableActions: ['idle', 'relax', 'thinking', 'lookaround'],
        random: () => 0.99
    });

    assert.equal(motion, null);
});

test('motion library ignores legacy action cues unless runtime explicitly allows them', () => {
    const surface = normalizePersonaSurfaceState({
        emotion: 'thinking',
        gestureIntent: 'thinking',
        taskState: 'thinking',
        legacyAction: 'thinking'
    });
    const motion = selectMotionForSurface(surface, {
        availableActions: ['idle', 'relax', 'thinking'],
        random: () => 0.99
    });

    assert.equal(motion, null);
});

test('motion library allows legacy action cues only in experimental review mode', () => {
    const surface = normalizePersonaSurfaceState({
        emotion: 'thinking',
        gestureIntent: 'thinking',
        taskState: 'thinking',
        legacyAction: 'thinking'
    });
    const motion = selectMotionForSurface(surface, {
        availableActions: ['idle', 'relax', 'thinking'],
        allowLegacyActionMotion: true,
        allowExperimentalMotion: true,
        random: () => 0.99
    });

    assert.equal(motion.id, 'thinking');
});

test('motion library keeps semantic success from auto-playing expressive motions', () => {
    const surface = normalizePersonaSurfaceState({
        emotion: 'happy',
        gestureIntent: 'success',
        taskState: 'happy_success'
    });
    const motion = selectMotionForSurface(surface, {
        availableActions: ['relax', 'clapping', 'jump'],
        random: () => 0.99
    });

    assert.equal(motion, null);
});

test('motion intake catalog covers every runtime motion with review metadata', () => {
    const intakeById = new Map(listMotionIntakeEntries().map((entry) => [entry.id, entry]));
    const sources = new Set(listMotionIntakeSources().map((source) => source.id));

    for (const motion of listMotionLibrary()) {
        const intake = intakeById.get(motion.id);
        assert.ok(intake, `${motion.id} missing intake metadata`);
        assert.ok(sources.has(intake.source), `${motion.id} references unknown source`);
        assert.equal(typeof intake.license, 'string');
        assert.ok(intake.license.length > 0);
        assert.ok(Array.isArray(intake.style));
        assert.ok(intake.style.length > 0);
        assert.equal(typeof intake.approved, 'boolean');
        assert.ok(Number.isFinite(Number(intake.feminineScore)));
        assert.ok(Number(intake.feminineScore) >= 0);
        assert.ok(Number(intake.feminineScore) <= 1);
        assert.ok(['low', 'medium', 'high', 'unknown'].includes(intake.clippingRisk));
    }
});

test('motion intake keeps reviewed motions loadable without auto-approving risky ones', () => {
    const loadable = new Set(getLoadableMotionFiles().map((motion) => motion.name));

    assert.equal(loadable.has('vroid_greeting'), true);
    assert.equal(loadable.has('vroid_peace'), true);
    assert.equal(loadable.has('vrma17'), true);
    assert.equal(loadable.has('jump'), true);
    assert.equal(loadable.has('fumi_004_hello_1'), true);
    assert.equal(loadable.has('sachi_wave01'), false);
    assert.equal(isMotionApproved('vroid_greeting'), false);
    assert.equal(isMotionApproved('vrma17'), false);
    assert.equal(isMotionApproved('jump'), false);
    assert.equal(isMotionApproved('fumi_004_hello_1'), false);
    assert.equal(isMotionApproved('idle'), true);
});

test('persona surface infers dance intent from assistant text as a fallback', () => {
    const surface = createPersonaSurfaceFromPayload({
        display_text: '好呀，我现在给你跳一段舞。'
    });
    const motion = selectMotionForSurface(surface, {
        availableActions: ['idle', 'vrma17', 'vrma25'],
        currentMotion: 'idle',
        allowExpressiveMotion: true,
        random: () => 0
    });

    assert.equal(surface.gestureIntent, 'dance');
    assert.equal(motion, null);
});

test('emotion mixer creates subtle multi-expression mix for shy state', () => {
    const mix = mixExpressionsForSurface(normalizePersonaSurfaceState({
        emotion: 'shy',
        intensity: 0.62,
        socialTone: 'soft'
    }));

    assert.ok(mix.blinkRight > 0.2);
    assert.ok(mix.happy > 0.1);
    assert.ok(mix.relaxed > 0.1);
});

test('chatvrm-style emote controller owns smooth emotion, blink, and lip sync channels', () => {
    const values = {};
    const controller = new CharacterEmoteController({
        getExpressionPresets: () => ({
            happy: 1,
            relaxed: 1,
            blink: 1,
            blinkRight: 1,
            aa: 1,
            neutral: 0
        }),
        defaultMix: { relaxed: 0.18 }
    });

    controller.bindVrm({
        expressionManager: {
            setValue: (name, value) => {
                values[name] = value;
            }
        }
    });

    controller.setEmotionMix({ happy: 0.5, relaxed: 0.2 }, { durationHint: 'hold' });
    controller.setLipSyncValue(0.8);
    controller.update(0.1);

    assert.ok(values.happy > 0);
    assert.ok(values.happy < 0.5);
    assert.ok(values.aa > 0);
    assert.equal(values.blink < 0.01, true);

    controller.update(5.1);
    assert.ok(values.blink > 0.8);
});

test('chatvrm/amica screenplay parses emotion tags without leaking VRM action names', () => {
    const parsed = parseEmotionTaggedText('[love]我有点想贴贴。');
    assert.equal(parsed.emotion, 'love');
    assert.equal(parsed.message, '我有点想贴贴。');

    const talks = textsToScreenplay(['[serious]我先检查一下。', '然后告诉你结果。']);
    assert.equal(talks[0].expression, 'serious');
    assert.equal(talks[0].talk.style, 'talk');
    assert.equal(talks[1].expression, 'serious');

    const screenplay = surfaceToScreenplay({
        emotion: 'victory',
        text: '搞定啦。'
    });
    assert.equal(screenplay.expression, 'victory');
    assert.equal(screenplay.talk.style, 'happy');
});

test('amica-style motion controller plays one-shot action and fades back to idle', () => {
    const calls = [];
    const createAction = (name) => ({
        name,
        enabled: false,
        loop: null,
        repetitions: null,
        clampWhenFinished: false,
        time: 0,
        reset() {
            calls.push(['reset', name]);
            return this;
        },
        setLoop(loop, repetitions) {
            this.loop = loop;
            this.repetitions = repetitions;
            calls.push(['loop', name, repetitions]);
            return this;
        },
        setEffectiveTimeScale(value) {
            this.timeScale = value;
            return this;
        },
        setEffectiveWeight(value) {
            this.weight = value;
            return this;
        },
        fadeIn(value) {
            calls.push(['fadeIn', name, value]);
            return this;
        },
        fadeOut(value) {
            calls.push(['fadeOut', name, value]);
            return this;
        },
        stopFading() {
            calls.push(['stopFading', name]);
            return this;
        },
        crossFadeTo(action, duration) {
            calls.push(['crossFade', name, action.name, duration]);
            return this;
        },
        stop() {
            calls.push(['stop', name]);
            return this;
        },
        play() {
            calls.push(['play', name]);
            return this;
        }
    });
    const listeners = {};
    const mixer = {
        addEventListener(type, listener) {
            listeners[type] = listener;
        },
        removeEventListener(type) {
            delete listeners[type];
        }
    };
    const idle = createAction('idle');
    const clapping = createAction('clapping');
    const controller = new ChatVRMAmicaMotionController({
        idleActions: ['idle'],
        crossFadeDuration: 0.4,
        logger: { log() {}, warn() {}, debug() {} }
    });

    controller.bind({ mixer, actionMap: { idle, clapping } });
    controller.prepareAllActions();
    assert.equal(controller.play('idle'), true);
    assert.equal(controller.getCurrentActionName(), 'idle');
    const idleResetCount = calls.filter((call) => call[0] === 'reset' && call[1] === 'idle').length;
    assert.equal(controller.play('idle'), true);
    assert.equal(calls.filter((call) => call[0] === 'reset' && call[1] === 'idle').length, idleResetCount);
    assert.equal(controller.play('clapping'), false);
    assert.equal(controller.getCurrentActionName(), 'idle');
    assert.equal(controller.play('clapping', { allowExperimental: true }), true);
    assert.equal(controller.getCurrentActionName(), 'clapping');

    listeners.finished({ action: clapping });
    assert.equal(controller.getCurrentActionName(), 'idle');
    assert.equal(calls.some((call) => call[0] === 'fadeOut' && call[1] === 'clapping'), true);
    assert.equal(calls.some((call) => call[0] === 'fadeIn' && call[1] === 'idle'), true);
    assert.equal(calls.some((call) => call[0] === 'play' && call[1] === 'idle'), true);
    assert.equal(calls.some((call) => call[0] === 'crossFade'), false);
});

test('behavior scheduler produces visible state-specific micro pose', () => {
    const bones = Object.fromEntries(
        ['head', 'neck', 'chest', 'upperChest', 'spine', 'leftShoulder', 'rightShoulder']
            .map((name) => [name, { name, rotation: { x: 0, y: 0, z: 0 } }])
    );
    const scheduler = new CharacterBehaviorScheduler();
    const vrm = {
        humanoid: {
            getNormalizedBoneNode: (name) => bones[name] || null
        }
    };

    scheduler.update({
        vrm,
        deltaTime: 0.3,
        surface: {
            emotion: 'thinking',
            taskState: 'thinking',
            gazeTarget: 'side',
            intensity: 0.55
        },
        currentMotion: 'idle',
        isSpeaking: false
    });

    assert.ok(Math.abs(bones.head.rotation.y) > 0.01);
    assert.ok(Math.abs(bones.neck.rotation.x) > 0.002);
    assert.ok(Math.abs(bones.chest.rotation.y) > 0.001);
});

test('behavior scheduler does not layer procedural pose over big motions', () => {
    const bones = Object.fromEntries(
        ['head', 'neck', 'chest', 'upperChest', 'spine', 'leftShoulder', 'rightShoulder']
            .map((name) => [name, { name, rotation: { x: 0, y: 0, z: 0 } }])
    );
    const scheduler = new CharacterBehaviorScheduler();
    const vrm = {
        humanoid: {
            getNormalizedBoneNode: (name) => bones[name] || null
        }
    };

    scheduler.update({
        vrm,
        deltaTime: 0.3,
        surface: {
            emotion: 'happy',
            taskState: 'happy_success',
            gestureIntent: 'dance',
            gazeTarget: 'user',
            intensity: 0.75
        },
        currentMotion: 'vrma17',
        isSpeaking: true,
        lipSyncValue: 0.6
    });

    assert.equal(bones.head.rotation.x, 0);
    assert.equal(bones.neck.rotation.y, 0);
    assert.equal(bones.chest.rotation.z, 0);
    assert.equal(bones.spine.rotation.z, 0);
});

test('character runtime drives expression mix and semantic motion through adapter', () => {
    const calls = [];
    const runtime = new CharacterRuntime({
        driver: {
            getAvailableMotions: () => ['idle', 'relax', 'goodbye', 'thinking', 'clapping'],
            getCurrentMotion: () => 'idle',
            setSurfaceState: (surface) => calls.push(['surface', surface.taskState, surface.gestureIntent]),
            applySceneMood: (sceneMood) => calls.push(['scene', sceneMood.state]),
            applyExpressionMix: (mix) => calls.push(['expression', mix]),
            playMotion: (motion) => {
                calls.push(['motion', motion.id]);
                return true;
            }
        }
    });

    const result = runtime.applyPayload({
        display_text: '好呀，我来啦。',
        surface: {
            emotion: 'happy',
            intensity: 0.58,
            gestureIntent: 'greeting',
            taskState: 'speaking',
            gazeTarget: 'user'
        }
    }, {
        random: () => 0
    });

    assert.equal(result.surface.gestureIntent, 'greeting');
    assert.equal(result.screenplay.expression, 'happy');
    assert.equal(result.motion, null);
    assert.equal(result.roleState.state, 'speaking');
    assert.equal(result.sceneMood.state, 'speaking');
    assert.deepEqual(calls[0], ['surface', 'speaking', 'greeting']);
    assert.deepEqual(calls[1], ['scene', 'speaking']);
    assert.equal(calls.some((call) => call[0] === 'motion'), false);
});

test('character runtime plays companion semantic gesture when chat motion policy opts in', () => {
    const calls = [];
    const runtime = new CharacterRuntime({
        driver: {
            getAvailableMotions: () => ['idle', 'vroid_greeting'],
            getCurrentMotion: () => 'idle',
            setSurfaceState: () => {},
            applySceneMood: () => {},
            applyExpressionMix: () => {},
            playMotion: (motion) => {
                calls.push(motion.id);
                return true;
            }
        }
    });

    const result = runtime.applyPayload({
        display_text: '你好呀，我在。',
        surface: {
            emotion: 'happy',
            gestureIntent: 'greeting',
            taskState: 'speaking'
        }
    }, {
        allowExpressiveMotion: true,
        allowExperimentalMotion: true,
        random: () => 0
    });

    assert.equal(result.motion.id, 'vroid_greeting');
    assert.equal(result.playedMotion, true);
    assert.deepEqual(calls, ['vroid_greeting']);
});

test('character state machine enriches task states with stable role defaults', () => {
    const stateMachine = new CharacterStateMachine();
    const result = stateMachine.transition({
        emotion: 'thinking',
        taskState: 'working',
        gestureIntent: 'none'
    });

    assert.equal(result.state, 'working');
    assert.equal(result.surface.taskState, 'working');
    assert.equal(result.surface.gestureIntent, 'working');
    assert.equal(result.surface.gazeTarget, 'screen');
});

test('scene director maps role state into camera and light mood', () => {
    const director = new CharacterSceneDirector();
    const mood = director.createSceneMood('happy_success', {
        emotion: 'happy',
        socialTone: 'bright',
        intensity: 0.7,
        speechEnergy: 0.5
    });

    assert.equal(mood.state, 'happy_success');
    assert.ok(mood.camera.distance < 1.1);
    assert.ok(mood.light.ambientIntensity > 2.3);
});

test('character runtime schedules gentle idle motion without interrupting speech', () => {
    const calls = [];
    const runtime = new CharacterRuntime({
        driver: {
            getAvailableMotions: () => ['idle', 'idle1', 'idle2', 'thinking'],
            getCurrentMotion: () => 'idle',
            setSurfaceState: () => {},
            applySceneMood: () => {},
            applyExpressionMix: () => {},
            playMotion: (motion) => {
                calls.push(typeof motion === 'string' ? motion : motion.id);
                return true;
            }
        }
    });

    runtime.setSurfaceState({
        emotion: 'relaxed',
        taskState: 'idle',
        gestureIntent: 'none'
    });
    runtime.nextIdleMotionMs = 100;
    runtime.update(0.2, { currentMotion: 'idle', isSpeaking: true });
    assert.deepEqual(calls, []);

    runtime.setSurfaceState({
        taskState: 'idle',
        gestureIntent: 'none',
        source: 'speech_end'
    });
    runtime.nextIdleMotionMs = 100;
    runtime.update(0.2, { currentMotion: 'idle', isSpeaking: false });
    assert.deepEqual(calls, ['idle']);
});
