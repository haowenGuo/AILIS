import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import runtimeModule from '../electron/ailis-character-renderer-runtime.cjs';
import { CharacterRendererClient } from '../src/character-renderer-client.js';
import {
    CHARACTER_ACTION_INTENT_IDS,
    getCharacterActionSupport
} from '../src/character/action-catalog.js';

const {
    AILISCharacterRendererRuntime,
    clampRendererWindowByVisibleContent,
    normalizeRendererBackend,
    normalizeRendererHitTestBounds,
    pointInRendererHitTestBounds,
    sanitizeBounds,
    scaleBoundsForRenderer
} = runtimeModule;

test('Unity window movement is constrained by visible character content, not transparent canvas', () => {
    const windowBounds = { x: -999, y: -999, width: 612, height: 816 };
    const characterBounds = {
        left: 230,
        top: 298,
        right: 380,
        bottom: 561
    };
    const displayBounds = { x: 0, y: 0, width: 2000, height: 2000 };

    assert.deepEqual(
        clampRendererWindowByVisibleContent(
            windowBounds,
            characterBounds,
            displayBounds
        ),
        { x: -230, y: -298, width: 612, height: 816 }
    );
    assert.deepEqual(
        clampRendererWindowByVisibleContent(
            { ...windowBounds, x: 9999, y: 9999 },
            characterBounds,
            displayBounds
        ),
        { x: 1620, y: 1439, width: 612, height: 816 }
    );
});

class FakeSocket extends EventEmitter {
    constructor() {
        super();
        this.sent = [];
    }

    bind(_port, _host, callback) {
        queueMicrotask(callback);
    }

    send(packet, port, host) {
        this.sent.push({ message: JSON.parse(packet.toString('utf8')), port, host });
    }

    close(callback) {
        callback?.();
    }
}

class FakeChild extends EventEmitter {
    constructor() {
        super();
        this.pid = 4242;
        this.killed = false;
    }

    kill() {
        this.killed = true;
        queueMicrotask(() => this.emit('exit', 0, null));
    }
}

test('persona surface preserves renderer-neutral expression and motion semantics', () => {
    const messages = [];
    const client = new CharacterRendererClient({
        send(message) {
            messages.push(message);
        }
    });

    client.applyPersonaSurfacePayload({
        display_text: '处理完成',
        persona_surface: {
            emotion: 'victory',
            gestureIntent: 'success',
            taskState: 'happy_success',
            socialTone: 'bright',
            durationHint: 'medium',
            intensity: 0.72,
            speechEnergy: 0.61
        }
    }, {
        messageId: 'surface-test'
    });

    assert.deepEqual(messages[0], {
        type: 'persona.surface',
        requestId: 'surface-test',
        surface: {
            emotion: 'victory',
            taskState: 'happy_success',
            gestureIntent: 'success',
            gestureFallbacks: [
                'celebrate',
                'acknowledge',
                'attentive',
                'idle',
                'none'
            ],
            gazeTarget: 'user',
            socialTone: 'bright',
            durationHint: 'medium',
            intensity: 0.72,
            speechEnergy: 0.61,
            speechText: '处理完成',
            speechDurationSeconds: 0.3
        }
    });
});

test('character renderer backend and bounds normalization are deterministic', () => {
    assert.equal(normalizeRendererBackend('UNITY'), 'unity');
    assert.equal(normalizeRendererBackend('unknown'), 'electron');
    assert.deepEqual(sanitizeBounds({ x: 12.4, y: 20.7, width: 100, height: 200 }), {
        x: 12,
        y: 21,
        width: 180,
        height: 240
    });
    assert.deepEqual(scaleBoundsForRenderer({ x: 10, y: 20, width: 216, height: 288 }, 1.5), {
        x: 15,
        y: 30,
        width: 324,
        height: 432
    });
    assert.deepEqual(normalizeRendererHitTestBounds({
        x: 90,
        y: 45,
        width: 300,
        height: 600,
        shape: 'ellipse',
        complete: true,
        timestamp: 1234
    }, 1.5), {
        left: 60,
        top: 30,
        right: 260,
        bottom: 430,
        width: 200,
        height: 400,
        source: 'unity',
        shape: 'ellipse',
        complete: true,
        timestamp: 1234
    });
    const ellipseBounds = {
        left: 60,
        top: 30,
        right: 260,
        bottom: 430,
        shape: 'ellipse',
        complete: true
    };
    assert.equal(pointInRendererHitTestBounds({ x: 160, y: 230 }, ellipseBounds), true);
    assert.equal(pointInRendererHitTestBounds({ x: 60, y: 30 }, ellipseBounds), false);
    assert.equal(pointInRendererHitTestBounds({ x: 60, y: 30 }, {
        ...ellipseBounds,
        shape: 'rectangle'
    }), true);

    const mask = Buffer.from([0b00001001]).toString('base64');
    const maskBounds = normalizeRendererHitTestBounds({
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        shape: 'mask',
        maskEncoding: 'bitset-base64-v1',
        mask,
        maskWidth: 4,
        maskHeight: 2,
        complete: true
    });
    assert.equal(maskBounds.shape, 'mask');
    assert.equal(pointInRendererHitTestBounds({ x: 25, y: 25 }, maskBounds), true);
    assert.equal(pointInRendererHitTestBounds({ x: 75, y: 25 }, maskBounds), false);
    assert.equal(pointInRendererHitTestBounds({ x: 175, y: 25 }, maskBounds), true);
    assert.equal(pointInRendererHitTestBounds({ x: 25, y: 75 }, maskBounds), false);
});

test('character renderer exposes the active package semantic capabilities', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-character-capabilities-'));
    const executableRoot = path.join(
        tempRoot,
        'unity-character-demo',
        'Build',
        'Windows'
    );
    const manifestRoot = path.join(
        executableRoot,
        'AILISCharacterDemo_Data',
        'StreamingAssets'
    );
    fs.mkdirSync(manifestRoot, { recursive: true });
    fs.writeFileSync(path.join(executableRoot, 'AILISCharacterDemo.exe'), '');
    fs.writeFileSync(
        path.join(manifestRoot, 'ailis-character.json'),
        JSON.stringify({
            id: 'test-character',
            displayName: 'Test Character',
            vrmExpressionProfile: {
                schema: 'ailis.vrm-expression-profile.v1',
                standard: 'VRM-1.0',
                bindings: [{
                    id: 'happy',
                    preset: 'happy',
                    driver: 'animator-state',
                    stateName: 'HappyFace',
                    morphTargetBindings: [{
                        path: 'Body',
                        blendShapeName: 'Smile',
                        weight: 100
                    }],
                    overrideBlink: 'blend',
                    priority: 2
                }]
            },
            motions: [{
                id: 'greeting',
                stateName: 'Greeting',
                performanceLayer: 'gesture',
                nativeLayerId: 'action',
                nativeParameter: 'VRCEmote',
                nativeParameterType: 'int',
                nativeParameterValue: 1,
                loop: false,
                fallbackDurationSeconds: 2.4,
                transitionSeconds: 0.16,
                gestureIntents: ['greeting'],
                taskStates: [],
                emotions: ['happy'],
                compatibility: 'approved',
                collisionZones: ['hair'],
                priority: 3
            }]
        }),
        'utf8'
    );

    const runtime = new AILISCharacterRendererRuntime({
        projectRoot: tempRoot,
        platform: 'win32'
    });
    const capabilities = runtime.getCapabilities();

    assert.equal(capabilities.packageId, 'test-character');
    assert.equal(capabilities.displayName, 'Test Character');
    assert.equal(capabilities.schema, 'ailis.character-capabilities.v2');
    assert.equal(capabilities.expressionStandard, 'VRM-1.0');
    assert.equal(capabilities.expressions[0].key, 'happy');
    assert.equal(capabilities.expressions[0].overrideBlink, 'blend');
    assert.equal(capabilities.expressions[0].morphTargetCount, 1);
    assert.deepEqual(capabilities.motions[0].gestureIntents, ['greeting']);
    assert.equal(capabilities.motions[0].compatibility, 'approved');
    assert.deepEqual(capabilities.motions[0].collisionZones, ['hair']);
    assert.equal(capabilities.motions[0].performanceLayer, 'gesture');
    assert.equal(capabilities.motions[0].nativeLayerId, 'action');
    assert.equal(capabilities.motions[0].nativeParameter, 'VRCEmote');
    assert.equal(capabilities.motions[0].nativeParameterType, 'int');
    assert.equal(capabilities.motions[0].nativeParameterValue, 1);
    assert.equal(capabilities.motions[0].fallbackDurationSeconds, 2.4);
    assert.equal(capabilities.motions[0].transitionSeconds, 0.16);

    fs.rmSync(tempRoot, { recursive: true, force: true });
});

test('Shino package exposes only curated Sachi motions to automatic scheduling', () => {
    const manifestPath = path.resolve(
        'unity-character-demo',
        'RuntimePackages',
        'vroid-shino-cc0',
        'ailis-character.json'
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const motionsById = new Map(manifest.motions.map((motion) => [motion.id, motion]));

    for (const motionId of [
        'idle',
        'greeting',
        'thinking',
        'working',
        'celebrate',
        'shy',
        'pose'
    ]) {
        const motion = motionsById.get(motionId);
        assert.ok(motion, `missing curated motion: ${motionId}`);
        assert.equal(motion.sourceId, 'sachi-vrma-1');
        assert.equal(motion.license, 'CC0-1.0');
        assert.equal(motion.compatibility, 'approved');
        assert.ok(
            fs.existsSync(path.resolve(path.dirname(manifestPath), motion.file)),
            `missing motion asset: ${motion.file}`
        );
    }

    assert.ok(manifest.motions
        .filter((motion) => motion.compatibility === 'approved')
        .every((motion) => motion.sourceId === 'sachi-vrma-1'));
    assert.ok(manifest.motions
        .filter((motion) => motion.sourceId === 'quaternius-ual2-review')
        .every((motion) => motion.compatibility === 'review'));
    for (const removedMotionId of ['jump', 'surprised', 'sad', 'angry', 'sleepy']) {
        assert.equal(motionsById.has(removedMotionId), false);
    }
    assert.equal(motionsById.get('present')?.compatibility, 'review');
    assert.equal(motionsById.get('present')?.fallbackMotionId, 'working');
});

test('AILIS default package exposes a fully graded motion library', () => {
    const manifestPath = path.resolve(
        'unity-character-demo',
        'RuntimePackages',
        'ailis-default',
        'ailis-character.json'
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const approved = manifest.motions.filter(
        (motion) => motion.compatibility === 'approved'
    );
    const review = manifest.motions.filter(
        (motion) => motion.compatibility === 'review'
    );
    const rejected = manifest.motions.filter(
        (motion) => motion.compatibility === 'rejected'
    );

    assert.equal(manifest.id, 'ailis-default');
    assert.equal(manifest.adapter, 'vrm');
    assert.equal(manifest.motions.length, 48);
    assert.equal(approved.length, 34);
    assert.equal(review.length, 12);
    assert.deepEqual(
        rejected.map((motion) => motion.id).sort(),
        ['cc0-dance', 'cc0-formal-walk']
    );
    assert.ok(review.every((motion) => motion.fallbackMotionId));
    assert.ok(rejected.every((motion) => motion.fallbackMotionId));
    assert.ok(manifest.motions.every((motion) =>
        ['A', 'B', 'C'].includes(motion.acceptanceGrade)));
    assert.deepEqual(manifest.acceptance.gradeCounts, { A: 34, B: 12, C: 2 });
    assert.equal(new Set(manifest.motions.map((motion) => motion.id)).size, 48);
});

test('each Unity character package resolves every actionable semantic intent safely', () => {
    const characterRoot = path.resolve(
        'unity-character-demo',
        'Assets',
        'StreamingAssets',
        'Characters'
    );
    const packages = fs.readdirSync(characterRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => {
            const manifestPath = path.join(
                characterRoot,
                entry.name,
                'ailis-character.json'
            );
            return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        });

    assert.deepEqual(
        packages.map((characterPackage) => characterPackage.id).sort(),
        ['ailis-default', 'raddoll-v3.02', 'unity-chan-1.4.0', 'vroid-shino-cc0']
    );

    for (const characterPackage of packages) {
        for (const actionId of CHARACTER_ACTION_INTENT_IDS) {
            if (actionId === 'none') {
                continue;
            }
            const support = getCharacterActionSupport(
                actionId,
                characterPackage.motions
            );
            assert.notEqual(
                support.status,
                'unmapped',
                `${characterPackage.id} does not map ${actionId}`
            );
            assert.equal(
                support.motion?.compatibility || 'approved',
                'approved',
                `${characterPackage.id}/${actionId} resolved to an unapproved motion`
            );
            const hasConcreteDriver = characterPackage.adapter === 'vrm'
                ? Boolean(support.motion?.file || support.motion?.bakedClipResource)
                : Boolean(
                    support.motion?.stateName ||
                    support.motion?.nativeParameter
                );
            assert.equal(
                hasConcreteDriver,
                true,
                `${characterPackage.id}/${actionId} has no concrete playback target`
            );
        }
    }
});

test('semantic actions resolve to character-specific motions instead of a global clip', () => {
    const load = (packageId) => JSON.parse(fs.readFileSync(path.resolve(
        'unity-character-demo',
        'Assets',
        'StreamingAssets',
        'Characters',
        packageId,
        'ailis-character.json'
    ), 'utf8'));
    const packages = {
        raddoll: load('raddoll-v3.02'),
        unityChan: load('unity-chan-1.4.0'),
        shino: load('vroid-shino-cc0')
    };
    const resolve = (characterPackage, actionId) =>
        getCharacterActionSupport(actionId, characterPackage.motions);

    assert.equal(resolve(packages.raddoll, 'thinking').motion.id, 'idle-relaxed');
    assert.equal(resolve(packages.raddoll, 'thinking').status, 'motion_fallback');
    assert.equal(resolve(packages.unityChan, 'thinking').motion.id, 'thinking');
    assert.equal(resolve(packages.unityChan, 'thinking').status, 'exact');
    assert.equal(resolve(packages.shino, 'thinking').motion.id, 'thinking');
    assert.equal(resolve(packages.shino, 'thinking').status, 'exact');

    assert.equal(resolve(packages.raddoll, 'present').motion.id, 'idle-relaxed');
    assert.equal(resolve(packages.unityChan, 'present').motion.id, 'speaking');
    assert.equal(resolve(packages.shino, 'present').motion.id, 'working');
});

test('character renderer discovers installed packages and switches by package id', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-character-switch-'));
    const executableRoot = path.join(
        tempRoot,
        'unity-character-demo',
        'Build',
        'Windows'
    );
    const streamingAssets = path.join(
        executableRoot,
        'AILISCharacterDemo_Data',
        'StreamingAssets'
    );
    const charactersRoot = path.join(streamingAssets, 'Characters');
    fs.mkdirSync(charactersRoot, { recursive: true });
    fs.writeFileSync(path.join(executableRoot, 'AILISCharacterDemo.exe'), '');
    fs.writeFileSync(
        path.join(streamingAssets, 'ailis-character.json'),
        JSON.stringify({
            id: 'default-character',
            displayName: 'Default Character',
            adapter: 'asset-bundle',
            motions: []
        }),
        'utf8'
    );
    for (const character of [
        { id: 'default-character', displayName: 'Default Character', adapter: 'asset-bundle' },
        { id: 'vrm-character', displayName: 'VRM Character', adapter: 'vrm' }
    ]) {
        const packageRoot = path.join(charactersRoot, character.id);
        fs.mkdirSync(packageRoot, { recursive: true });
        fs.writeFileSync(
            path.join(packageRoot, 'ailis-character.json'),
            JSON.stringify({ ...character, model: 'avatar.vrm', motions: [] }),
            'utf8'
        );
    }

    const socket = new FakeSocket();
    const child = new FakeChild();
    let spawnArgs = [];
    const runtime = new AILISCharacterRendererRuntime({
        projectRoot: tempRoot,
        platform: 'win32',
        createSocket: () => socket,
        spawnProcess: (_executablePath, args) => {
            spawnArgs = args;
            return child;
        }
    });

    assert.deepEqual(
        runtime.listCharacterPackages().map((item) => item.id),
        ['default-character', 'vrm-character']
    );
    const status = await runtime.activate('unity', {
        characterPackageId: 'vrm-character',
        bounds: { x: 20, y: 30, width: 612, height: 816 }
    });
    assert.equal(status.characterPackageId, 'vrm-character');
    assert.equal(runtime.getCapabilities().packageId, 'vrm-character');
    assert.equal(runtime.getCapabilities().characters.length, 2);
    const packageArgumentIndex = spawnArgs.indexOf('--character-package');
    assert.ok(packageArgumentIndex >= 0);
    assert.equal(
        spawnArgs[packageArgumentIndex + 1],
        path.join(charactersRoot, 'vrm-character', 'ailis-character.json')
    );

    await runtime.activate('electron');
    fs.rmSync(tempRoot, { recursive: true, force: true });
});

test('Unity sidecar waits for ready before becoming the effective renderer', async () => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-renderer-'));
    const executable = path.join(
        projectRoot,
        'unity-character-demo',
        'Build',
        'Windows',
        'AILISCharacterDemo.exe'
    );
    fs.mkdirSync(path.dirname(executable), { recursive: true });
    fs.writeFileSync(executable, 'fixture');
    const socket = new FakeSocket();
    const child = new FakeChild();
    let spawnArgs = [];
    const runtime = new AILISCharacterRendererRuntime({
        projectRoot,
        platform: 'win32',
        createSocket: () => socket,
        spawnProcess: (_executablePath, args) => {
            spawnArgs = args;
            return child;
        }
    });

    const starting = await runtime.activate('unity', {
        bounds: { x: 20, y: 30, width: 612, height: 816 },
        preferences: {
            unityRenderer: {
                pipelineAsset: 'quality',
                targetFrameRate: 45,
                renderScale: 1.25,
                msaaSampleCount: 8,
                cameraAntialiasing: 'smaa',
                renderPostProcessing: true,
                postExposure: 0.35,
                cameraHeight: 1.48,
                keyLightColor: '#FFE1CC'
            }
        }
    });
    assert.equal(starting.status, 'starting');
    assert.equal(starting.effectiveBackend, 'electron');
    const bootstrapSettingsIndex = spawnArgs.indexOf('--settings-file');
    assert.ok(bootstrapSettingsIndex >= 0);
    const bootstrapSettingsPath = spawnArgs[bootstrapSettingsIndex + 1];
    assert.equal(fs.existsSync(bootstrapSettingsPath), true);
    const bootstrapSettings = JSON.parse(fs.readFileSync(bootstrapSettingsPath, 'utf8'));
    assert.equal(bootstrapSettings.pipelineAsset, 'quality');
    assert.equal('windowWidth' in bootstrapSettings, false);
    assert.equal('windowHeight' in bootstrapSettings, false);
    assert.equal('showDialogueBubble' in bootstrapSettings, false);

    socket.emit('message', Buffer.from(JSON.stringify({ type: 'renderer.ready', status: 'ready' })));
    assert.equal(runtime.getStatus().status, 'ready');
    assert.equal(runtime.getStatus().effectiveBackend, 'unity');
    const configureMessage = socket.sent.find((entry) => entry.message.type === 'renderer.configure').message;
    assert.equal(configureMessage.renderer.schema, 'ailis.character-renderer-settings.v4');
    assert.equal(configureMessage.renderer.performanceTuningVersion, 2);
    assert.equal(configureMessage.renderer.pipelineAsset, 'quality');
    assert.equal(configureMessage.renderer.targetFrameRate, 45);
    assert.equal(configureMessage.renderer.renderScale, 1.25);
    assert.equal(configureMessage.renderer.msaaSampleCount, 8);
    assert.equal(configureMessage.renderer.cameraAntialiasing, 'smaa');
    assert.equal(configureMessage.renderer.renderPostProcessing, true);
    assert.equal(configureMessage.renderer.postExposure, 0.35);
    assert.equal(configureMessage.renderer.cameraHeight, 1.48);
    assert.equal(configureMessage.renderer.keyLightColor, '#FFE1CC');
    assert.equal('positionMode' in configureMessage.renderer, false);
    assert.equal('bubbleScale' in configureMessage.renderer, false);
    assert.equal(socket.sent.at(-1).message.type, 'renderer.window');

    let hitTestBounds = null;
    runtime.once('hit-test-bounds', (bounds) => {
        hitTestBounds = bounds;
    });
    socket.emit('message', Buffer.from(JSON.stringify({
        type: 'renderer.hit_test_bounds',
        x: 60,
        y: 40,
        width: 220,
        height: 640,
        shape: 'ellipse',
        complete: true,
        timestamp: 5678
    })));
    assert.deepEqual(hitTestBounds, {
        left: 60,
        top: 40,
        right: 280,
        bottom: 680,
        width: 220,
        height: 640,
        source: 'unity',
        shape: 'ellipse',
        complete: true,
        timestamp: 5678
    });
    assert.deepEqual(runtime.getStatus().hitTestBounds, hitTestBounds);

    const animationStatePromise = runtime.requestAnimationDebugState({
        timeoutMs: 1000
    });
    const animationStateRequest = socket.sent.at(-1).message;
    assert.equal(
        animationStateRequest.type,
        'character.animation.state.request'
    );
    socket.emit('message', Buffer.from(JSON.stringify({
        type: 'character.animation.state',
        requestId: animationStateRequest.requestId,
        action: 'snapshot',
        animation: {
            schema: 'ailis.animation-debug.v1',
            supported: true,
            ready: true,
            paused: false,
            adapterId: 'vrm',
            layers: [{
                id: 'gesture',
                motionId: 'greeting',
                weight: 1,
                normalizedTime: 0.4
            }]
        }
    })));
    const animationStateResult = await animationStatePromise;
    assert.equal(animationStateResult.ok, true);
    assert.equal(animationStateResult.animation.adapterId, 'vrm');
    assert.equal(
        animationStateResult.animation.layers[0].motionId,
        'greeting'
    );

    const pausePromise = runtime.controlAnimationDebug({
        operation: 'pause'
    }, {
        timeoutMs: 1000
    });
    const pauseRequest = socket.sent.at(-1).message;
    assert.equal(pauseRequest.type, 'character.animation.control');
    assert.equal(pauseRequest.animationDebug.operation, 'pause');
    socket.emit('message', Buffer.from(JSON.stringify({
        type: 'character.animation.state',
        requestId: pauseRequest.requestId,
        action: 'pause',
        animation: {
            schema: 'ailis.animation-debug.v1',
            supported: true,
            ready: true,
            paused: true,
            adapterId: 'vrm',
            layers: []
        }
    })));
    const pauseResult = await pausePromise;
    assert.equal(pauseResult.ok, true);
    assert.equal(pauseResult.animation.paused, true);

    const commandCountAfterReady = socket.sent.length;
    assert.equal(runtime.sendConfiguration(runtime.lastConfiguration), false);
    assert.equal(socket.sent.length, commandCountAfterReady);

    runtime.sendWindowBounds({ x: 41, y: 52, width: 612, height: 816 });
    assert.deepEqual(socket.sent.at(-1).message.window, {
        x: 41,
        y: 52,
        width: 612,
        height: 816,
        phase: 'sync'
    });
    const commandCountAfterWindowMove = socket.sent.length;
    assert.equal(
        runtime.sendWindowBounds({ x: 41, y: 52, width: 612, height: 816 }),
        false
    );
    assert.equal(socket.sent.length, commandCountAfterWindowMove);
    assert.equal(
        runtime.sendWindowBounds(
            { x: 41, y: 52, width: 612, height: 816 },
            { phase: 'drag_begin' }
        ),
        true
    );
    assert.equal(socket.sent.at(-1).message.window.phase, 'drag_begin');
    assert.equal(
        runtime.sendWindowBounds(
            { x: 41, y: 52, width: 612, height: 816 },
            { phase: 'settle' }
        ),
        true
    );
    assert.equal(socket.sent.at(-1).message.window.phase, 'settle');

    await runtime.activate('electron');
    assert.equal(child.killed, true);
    assert.equal(runtime.getStatus().effectiveBackend, 'electron');
    assert.equal(fs.existsSync(bootstrapSettingsPath), false);
    fs.rmSync(projectRoot, { recursive: true, force: true });
});
