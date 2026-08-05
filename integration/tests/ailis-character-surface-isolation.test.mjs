import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('Three renderer does not own chat, TTS, or dialogue UI', () => {
    const source = read('src/pet-app.js');
    assert.doesNotMatch(source, /ChatTTSSystem|TTSAudioPlayer|installAvatarDialogueBubble/);
    assert.match(source, /VRMModelSystem/);
    assert.doesNotMatch(source, /^import\s+\{\s*VRMModelSystem\s*\}/m);
    assert.match(source, /import\('\.\/vrm-model-system\.js'\)/);
    assert.match(source, /characterRenderer\?\.onCommand/);
});

test('Persona host owns chat orchestration and uses narrow renderer and dialogue ports', () => {
    const source = read('src/persona-host-app.js');
    const chatSource = read('src/chat-tts-system.js');
    assert.match(source, /ChatTTSSystem/);
    assert.match(source, /CharacterRendererClient/);
    assert.match(chatSource, /dialogueSurface\?\.publish/);
    assert.doesNotMatch(chatSource, /type:\s*'persona\.bubble'/);
});

test('Unity runtime contains no dialogue surface and visual settings contain no window geometry', () => {
    const bootstrap = read('unity-character-demo/Assets/AILIS/Runtime/AilisCharacterDemoBootstrap.cs');
    const windowBridge = read('unity-character-demo/Assets/AILIS/Runtime/AilisTransparentWindowBridge.cs');
    const settings = read('unity-character-demo/Assets/AILIS/Runtime/AilisRendererSettings.cs');
    assert.doesNotMatch(bootstrap, /AilisDialogueBubble|persona\.bubble/);
    assert.doesNotMatch(bootstrap, /renderer\.primary-click|renderer\.context-menu|renderer\.window\.changed/);
    assert.doesNotMatch(windowBridge, /PrimaryClickRequested|ContextMenuRequested|WindowBoundsChanged|BeginPointerDrag/);
    assert.match(windowBridge, /isHitTestEnabled = false/);
    assert.match(windowBridge, /isClickThrough = true/);
    assert.doesNotMatch(settings, /windowWidth|windowHeight|windowX|windowY|bubbleScale/);
    assert.match(bootstrap, /case "renderer\.window"/);
    assert.match(bootstrap, /renderer\.hit_test_bounds/);
    assert.match(bootstrap, /WorldToScreenPoint/);
});

test('Electron owns character hit testing and renderer-aware bounded dragging', () => {
    const main = read('electron/main.cjs');
    assert.doesNotMatch(main, /renderer\.primary-click|renderer\.context-menu|renderer\.window\.changed/);
    assert.match(main, /petWindow\.setOpacity\(1\)[\s\S]*startPetCursorTracking\(\)/);
    assert.match(main, /hit-test-bounds[\s\S]*publishPetRendererInteractionState/);
    assert.match(main, /useUnityHitTest[\s\S]*pointInRendererHitTestBounds[\s\S]*setPetMousePassthrough/);
    assert.match(main, /schedulePetInteractionSurfaceRaise[\s\S]*petWindow\.moveTop\(\)/);
    assert.doesNotMatch(main, /unityOwnsPresentation/);
    assert.match(main, /showControlMenu[\s\S]*popupOptions\.window = targetWindow/);
    assert.match(main, /function applyPetDragFrame[\s\S]*constrainPetBoundsToVisibleDisplay/);
    assert.match(main, /ailis:drag-pet-window[\s\S]*applyPetDragFrame/);
    assert.match(main, /constrainPetBoundsToVisibleDisplay[\s\S]*clampRendererWindowByVisibleContent/);
    assert.match(
        main,
        /getDialogueSurfaceBounds[\s\S]*getPetVisibleContentScreenBounds\(characterBounds\)[\s\S]*anchorBounds/
    );
    assert.match(
        main,
        /publishDialogueSurfaceEvent[\s\S]*dialogueWindow\.showInactive\(\)[\s\S]*setMousePassthrough\(dialogueWindow,\s*true[\s\S]*schedulePetInteractionSurfaceRaise\(0\)/
    );
    const pet = read('src/pet-app.js');
    assert.doesNotMatch(pet, /requestAnimationFrame\(flushDragFrame\)/);
    assert.doesNotMatch(pet, /scheduleDragFrame/);
    assert.match(main, /PET_DRAG_SYNC_HZ = 60/);
    assert.match(main, /startPetDragPump[\s\S]*setInterval/);
    assert.match(main, /applyPetDragFrame[\s\S]*screen\.getCursorScreenPoint/);
    assert.match(main, /backgroundThrottling:\s*false/);
    assert.match(pet, /activeRendererBackend === 'unity'[\s\S]*unityAvatarBounds/);
    assert.match(pet, /dataset\.rendererBackend = activeRendererBackend/);
    assert.match(pet, /onPetRendererState/);
    assert.match(
        pet,
        /setRenderEnabled\(activeRendererBackend === 'electron'\)/
    );
    const vrmRenderer = read('src/vrm-model-system.js');
    assert.match(
        vrmRenderer,
        /animate\(timestamp = 0\)[\s\S]*if \(!this\.renderEnabled\)[\s\S]*return;/
    );
    const petHtml = read('pet.html');
    assert.match(petHtml, /data-renderer-backend="unity"[\s\S]*visibility:\s*hidden/);
});

test('Electron loads the pet interaction surface before starting Unity presentation', () => {
    const main = read('electron/main.cjs');
    const demo = read('scripts/ailis-unity-character-demo.mjs');
    assert.match(main, /async function loadWindowContent[\s\S]*window\.loadFile\(rendererPath\)/);
    assert.match(main, /RENDERER_LOAD_RETRY_DELAYS_MS/);
    assert.match(
        main,
        /loadWindowContent\(loadingPetWindow,\s*'pet\.html'\)[\s\S]*\.then\(async \(\) =>[\s\S]*syncCharacterRenderer\('pet_window_ready'\)/
    );
    assert.doesNotMatch(main, /syncCharacterRenderer\('pet_window_created'\)/);
    assert.match(main, /applyCharacterRendererPresentation\('unity'\)[\s\S]*runtime\.activate\('unity'/);
    assert.doesNotMatch(
        main,
        /applyCharacterRendererPresentation\('electron'\)[\s\S]{0,400}runtime\.activate\('unity'/
    );
    assert.match(demo, /'-popupwindow'/);
    assert.match(demo, /'--transparent',[\s\S]*'true'/);
    assert.match(demo, /'--topmost',[\s\S]*'true'/);
});

test('Unity position-only updates do not resize or reframe the avatar', () => {
    const bootstrap = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisCharacterDemoBootstrap.cs'
    );
    const windowBridge = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisTransparentWindowBridge.cs'
    );
    assert.match(
        bootstrap,
        /case "renderer\.window"[\s\S]*outputSizeChanged[\s\S]*if \(outputSizeChanged\)[\s\S]*ReframeAfterWindowResize/
    );
    assert.match(
        windowBridge,
        /ApplyWindowBounds\(AilisRendererWindow bounds, bool resizeWindow\)[\s\S]*if \(resizeWindow/
    );
    assert.match(
        windowBridge,
        /ApplyWindowBounds\(AilisRendererWindow bounds, bool resizeWindow\)[\s\S]*bounds\.phase[\s\S]*"drag"[\s\S]*EnsureTopmost\(\)/
    );
    assert.match(
        windowBridge,
        /ApplyWindowGeometryAfterReady[\s\S]*windowPosition = _lastWindowPosition;[\s\S]*EnsureTopmost\(\)/
    );
});

test('Unity owns the visible drag hot path after one Electron handshake', () => {
    const main = read('electron/main.cjs');
    const receiver = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisPersonaSurfaceReceiver.cs'
    );
    const bootstrap = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisCharacterDemoBootstrap.cs'
    );
    const windowBridge = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisTransparentWindowBridge.cs'
    );
    const dragFrameSource = main.slice(
        main.indexOf('function applyPetDragFrame'),
        main.indexOf('function startPetDragPump')
    );
    assert.match(main, /phase:\s*'drag_begin'/);
    assert.match(main, /rendererWindowPhase:\s*'settle'/);
    assert.doesNotMatch(dragFrameSource, /syncCharacterRendererWindowBounds/);
    assert.match(main, /renderer\.window\.drag_released[\s\S]*finishPetDrag/);
    assert.match(main, /renderer\.window\.settled[\s\S]*schedulePetInteractionSurfaceRaise\(0\)/);
    assert.match(
        main,
        /applyWindowBoundsEfficiently[\s\S]*window\.setPosition\(bounds\.x,\s*bounds\.y,\s*false\)/
    );
    assert.match(
        receiver,
        /latestWindowMessage[\s\S]*FlushLatestWindow[\s\S]*DispatchMessage/
    );
    assert.match(
        bootstrap,
        /SetWindowDragActive[\s\S]*QualitySettings\.maxQueuedFrames = 1[\s\S]*QualitySettings\.vSyncCount = 1[\s\S]*Application\.targetFrameRate = -1/
    );
    assert.match(bootstrap, /BeginExternalDrag\(_lastHitTestBounds\)/);
    assert.match(bootstrap, /UpdateExternalDrag\(\)[\s\S]*renderer\.window\.drag_released/);
    assert.match(bootstrap, /"settle"[\s\S]*renderer\.window\.settled/);
    assert.match(
        windowBridge,
        /BeginExternalDrag[\s\S]*_lastWindowPosition = _controller\.windowPosition[\s\S]*_externalDragOffset = _lastWindowPosition - _controller\.cursorPosition/
    );
    assert.match(
        windowBridge,
        /UpdateExternalDrag[\s\S]*cursor \+ _externalDragOffset[\s\S]*_controller\.windowPosition = nextPosition/
    );
    assert.match(windowBridge, /GetMonitorCount[\s\S]*GetMonitorRect/);
    assert.match(
        bootstrap,
        /if \(!_windowDragActive &&\s*_status == "ready" &&\s*Time\.unscaledTime >= _nextHitTestBoundsRefreshAt\)/
    );
    assert.match(
        receiver,
        /message\.type,[\s\S]*"renderer\.window"[\s\S]*message\.window\?\.phase,[\s\S]*"drag"/
    );
});

test('renderer boundary contract documents one-way ownership', () => {
    const contract = read('docs/ailis-character-surface-boundaries.md');
    assert.match(contract, /PersonaHost -> Electron -> active CharacterRenderer/);
    assert.match(contract, /Dialogue payloads never enter the character renderer protocol/);
});

test('Unity character capabilities are data-driven rather than character-name branches', () => {
    const recipe = JSON.parse(read('unity-character-demo/CharacterRecipes/unity-chan-1.4.0.json'));
    const packageSource = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisCharacterPackage.cs'
    );
    const protocolSource = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisVrmExpressionProtocol.cs'
    );
    const adapterSource = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisAssetBundleAvatarAdapter.cs'
    );
    const vrmAdapterSource = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisVrmAvatarController.cs'
    );
    const packageBuilderSource = read(
        'unity-character-demo/Assets/AILIS/Editor/AilisCharacterPackageBuilder.cs'
    );

    assert.equal(recipe.vrmExpressionProfile.standard, 'VRM-1.0');
    assert.ok(recipe.vrmExpressionProfile.bindings.length >= 8);
    assert.ok(recipe.motions.some((motion) => motion.gestureIntents.includes('greeting')));
    assert.ok(recipe.vrmExpressionProfile.bindings.some((binding) =>
        binding.preset === 'happy'));
    assert.doesNotMatch(JSON.stringify(recipe.vrmExpressionProfile), /semanticChannels/);
    assert.match(protocolSource, /VRM-1\.0/);
    assert.match(protocolSource, /isBinary/);
    assert.match(protocolSource, /overrideBlink/);
    assert.match(protocolSource, /overrideLookAt/);
    assert.match(protocolSource, /overrideMouth/);
    assert.match(protocolSource, /AilisVrmMorphTargetBinding/);
    assert.match(packageSource, /ResolveExpressionFrame/);
    assert.match(packageSource, /IsApproved/);
    assert.match(adapterSource, /ApplyExpressionFrame/);
    assert.match(adapterSource, /morph-targets/);
    assert.match(adapterSource, /GetExpressionBaseWeight/);
    assert.match(vrmAdapterSource, /ResolveExpressionFrame/);
    assert.match(adapterSource, /LateUpdate/);
    assert.match(packageBuilderSource, /keepOriginalOrientation\s*=\s*false/);
    assert.match(packageBuilderSource, /ExtractMorphTargetBindings/);
    assert.doesNotMatch(packageSource, /Unity-?Chan/i);
    assert.doesNotMatch(adapterSource, /Unity-?Chan/i);
});

test('Unity-Chan exposes its complete action controller with safe automatic scheduling', () => {
    const recipe = JSON.parse(read('unity-character-demo/CharacterRecipes/unity-chan-1.4.0.json'));
    const performanceBridge = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisChatdollKitPerformanceBridge.cs'
    );
    const modelController = read(
        'unity-character-demo/Assets/ThirdParty/ChatdollKit/Runtime/Model/ModelController.cs'
    );
    const motions = new Map(recipe.motions.map((motion) => [motion.id, motion]));
    const states = new Set(recipe.motions.map((motion) => motion.stateName));

    assert.equal(recipe.motions.length, 24);
    for (const stateName of [
        'WAIT00',
        'WAIT01',
        'WAIT02',
        'WAIT03',
        'WAIT04',
        'HANDUP00_R',
        'WIN00',
        'REFLESH00',
        'LOSE00',
        'DAMAGED00',
        'DAMAGED01',
        'WALK00_F',
        'RUN00_F',
        'SLIDE00'
    ]) {
        assert.ok(states.has(stateName), `missing Unity-Chan state ${stateName}`);
    }
    assert.deepEqual(motions.get('speaking').taskStates, ['speaking', 'reporting']);
    assert.ok(motions.get('speaking').gestureIntents.includes('speaking'));
    assert.ok(motions.get('refresh').gestureIntents.includes('stretch'));
    assert.ok(!motions.get('refresh').gestureIntents.includes('shy'));
    assert.ok(recipe.vrmExpressionProfile.bindings.some((binding) =>
        binding.id === 'shy' && binding.stateName === 'ASHAMED'));
    assert.ok(recipe.motions
        .filter((motion) => motion.compatibility === 'review')
        .every((motion) => motion.fallbackMotionId));
    assert.match(performanceBridge, /IndexAnimatorClips/);
    assert.match(performanceBridge, /ResolveMotionDuration/);
    assert.match(performanceBridge, /GetRegisteredAnimation\(motion\.id\)/);
    assert.doesNotMatch(
        modelController,
        /Where\(index\s*=>\s*index\s*!=\s*previousIndex\)/
    );
});

test('RadDoll preserves its native UnityPackage playable layers', () => {
    const recipe = JSON.parse(read('unity-character-demo/CharacterRecipes/raddoll-v3.02.json'));
    const layers = new Map(
        recipe.nativePlayableLayers.map((layer) => [layer.id, layer])
    );

    assert.deepEqual(
        [...layers.keys()],
        ['base', 'additive', 'gesture', 'action', 'fx']
    );
    assert.ok([...layers.values()].every((layer) => layer.enabled === true));
    assert.equal(layers.get('additive').additive, true);
    assert.deepEqual(
        recipe.motionLibraries,
        ['MotionLibraries/quaternius-ual2-review.json']
    );

    const greeting = recipe.motions.find((motion) => motion.id === 'greeting');
    const celebrate = recipe.motions.find((motion) => motion.id === 'celebrate');
    const approval = recipe.motions.find((motion) => motion.id === 'approval');
    assert.deepEqual(
        [greeting.nativeLayerId, greeting.nativeParameter, greeting.nativeParameterValue],
        ['action', 'VRCEmote', 1]
    );
    assert.deepEqual(
        [celebrate.nativeLayerId, celebrate.nativeParameter, celebrate.nativeParameterValue],
        ['action', 'VRCEmote', 4]
    );
    assert.deepEqual(
        [approval.nativeLayerId, approval.nativeParameter, approval.nativeParameterValue],
        ['gesture', 'GestureRight', 7]
    );
});

test('Reusable motion libraries stay review-gated and retain source metadata', () => {
    const profile = JSON.parse(read(
        'unity-character-demo/MotionLibraries/cc0-assistant-foundation.json'
    ));
    const builder = read(
        'unity-character-demo/Assets/AILIS/Editor/AilisCharacterPackageBuilder.cs'
    );
    const packageSource = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisCharacterPackage.cs'
    );
    const performanceBridge = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisChatdollKitPerformanceBridge.cs'
    );

    assert.equal(profile.schema, 'ailis.motion-library-profile.v1');
    assert.equal(profile.license, 'CC0-1.0');
    assert.ok(profile.animatorStates.length >= 15);
    assert.ok(profile.motions.length >= 15);
    assert.ok(profile.motions.every((motion) => motion.compatibility === 'review'));
    assert.ok(profile.motions.every((motion) => motion.fallbackMotionId));
    assert.ok(profile.id && profile.license);
    assert.ok(profile.motions.every((motion) =>
        Array.isArray(motion.styleTags) && motion.styleTags.length > 0));
    assert.match(builder, /ApplyMotionLibraries/);
    assert.match(builder, /ailis\.motion-library-profile\.v1/);
    assert.match(builder, /profile\.motions[\s\S]*recipe\.motions/);
    assert.match(builder, /motion\.sourceId\s*=\s*profile\.id/);
    assert.match(builder, /motion\.license\s*=\s*profile\.license/);
    assert.match(packageSource, /displayName/);
    assert.match(packageSource, /sourceId/);
    assert.match(packageSource, /styleTags/);
    assert.match(
        performanceBridge,
        /AddIdleMode\(motion\.id[\s\S]*if \(!motion\.IsApproved\)[\s\S]*return;[\s\S]*AddSemanticIdleModes/
    );
});

test('Character Lab uses renderer-neutral ports and keeps its IPC authority isolated', () => {
    const main = read('electron/main.cjs');
    const preload = read('electron/preload.cjs');
    const lab = read('src/character-lab-app.js');
    const html = read('character-lab.html');
    const actionCatalog = JSON.parse(read('electron/ailis-character-action-catalog.json'));
    const personaProtocol = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisPersonaSurfaceProtocol.cs'
    );
    const packageSource = read(
        'unity-character-demo/Assets/AILIS/Runtime/AilisCharacterPackage.cs'
    );

    assert.match(preload, /characterLab:\s*\{[\s\S]*selectCharacter[\s\S]*applySurface[\s\S]*playMotion[\s\S]*publishBubble[\s\S]*hideBubble/);
    assert.match(
        preload,
        /characterLab:\s*\{[\s\S]*getCapabilities[\s\S]*getAnimationState[\s\S]*controlAnimation/
    );
    assert.match(main, /createCharacterLabWindow[\s\S]*character-lab\.html/);
    assert.match(
        main,
        /ailis:character-lab-apply-surface[\s\S]*sourceWindow !== characterLabWindow[\s\S]*type:\s*'persona\.surface'/
    );
    assert.match(
        main,
        /ailis:character-lab-publish-bubble[\s\S]*sourceWindow !== characterLabWindow[\s\S]*publishDialogueSurfaceEvent/
    );
    assert.match(
        main,
        /ailis:character-lab-play-motion[\s\S]*sourceWindow !== characterLabWindow[\s\S]*motion_not_in_active_character_package[\s\S]*type:\s*'character\.action'/
    );
    assert.match(
        main,
        /ailis:character-lab-select-character[\s\S]*sourceWindow !== characterLabWindow[\s\S]*character_package_not_installed[\s\S]*syncCharacterRenderer/
    );
    assert.match(lab, /gestureIntent/);
    assert.match(lab, /listCharacterActionIntents/);
    assert.equal(actionCatalog.schema, 'ailis.character-action-catalog.v1');
    assert.ok(actionCatalog.intents.length >= 60);
    assert.match(personaProtocol, /gestureFallbacks/);
    assert.match(packageSource, /ResolveGestureIntents[\s\S]*GetGestureMatchScore/);
    assert.match(lab, /characterLab\.applySurface/);
    assert.match(lab, /getMotionCatalog[\s\S]*capabilities\?\.motions/);
    assert.match(lab, /characterLab\.playMotion/);
    assert.match(lab, /characterLab\.getAnimationState/);
    assert.match(lab, /characterLab\.controlAnimation/);
    assert.match(lab, /runExperienceSequence/);
    assert.match(html, /id="experience-sequence-btn"/);
    assert.match(lab, /characterLab\?\.selectCharacter/);
    assert.match(lab, /characterLab\?\.publishBubble/);
    assert.doesNotMatch(lab, /VRMModelSystem|Animator|UnityEngine|playResolvedAction/);
    assert.match(html, /表情测试/);
    assert.match(html, /动作测试/);
    assert.match(html, /标准动作系统/);
    assert.match(html, /对话气泡/);
    assert.match(html, /切换人物/);
    const bubble = read('src/avatar-dialogue-bubble.js');
    assert.match(
        bubble,
        /variant === 'surface'[\s\S]*rootRect\.height - bubbleRect\.height - BUBBLE_EDGE_PADDING/
    );
});
