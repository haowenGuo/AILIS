import { CONFIG, applyDesktopPreferencesToConfig } from './config.js';
import { installPetMouseHitTest } from './pet-mouse-hit-test.js';
import { setUiLanguage } from './i18n.js';

const PET_RENDER_AVATAR_REFERENCE_HEIGHT = 560;
const PET_RENDER_WINDOW_FRAME_HEIGHT = 960;
const PET_WINDOW_CAMERA_DISTANCE_RATIO = PET_RENDER_WINDOW_FRAME_HEIGHT / PET_RENDER_AVATAR_REFERENCE_HEIGHT;

function applyPetWindowFrameCameraCompensation() {
    const compensatedDistance = CONFIG.CAMERA_POSITION.z * PET_WINDOW_CAMERA_DISTANCE_RATIO;
    CONFIG.CAMERA_POSITION.set(
        CONFIG.CAMERA_POSITION.x,
        CONFIG.CAMERA_POSITION.y,
        Number(compensatedDistance.toFixed(3))
    );
    CONFIG.CAMERA_MIN_DISTANCE = Number(Math.max(0.55, compensatedDistance - 0.35).toFixed(2));
    CONFIG.CAMERA_MAX_DISTANCE = Number(Math.min(3.2, compensatedDistance + 0.6).toFixed(2));
}

function installRendererInteractions(rootElement) {
    let dragState = null;

    rootElement.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) {
            return;
        }
        dragState = {
            pointerId: event.pointerId,
            startX: event.screenX,
            startY: event.screenY,
            moved: false
        };
        window.ailisDesktop?.beginDragPetWindow?.();
        rootElement.setPointerCapture?.(event.pointerId);
    });

    rootElement.addEventListener('pointermove', (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }
        const distance = Math.abs(event.screenX - dragState.startX) +
            Math.abs(event.screenY - dragState.startY);
        dragState.moved ||= distance > 4;
    });

    const finishInteraction = async (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }
        const wasClick = !dragState.moved;
        dragState = null;
        window.ailisDesktop?.endDragPetWindow?.();
        if (wasClick) {
            await window.ailisDesktop?.showChatWindow?.();
        }
    };

    rootElement.addEventListener('pointerup', finishInteraction);
    rootElement.addEventListener('pointercancel', finishInteraction);
}

function applyRendererCommand(vrmSystem, message = {}) {
    if (!vrmSystem) {
        return;
    }
    switch (message.type) {
        case 'persona.surface':
            vrmSystem.applyPersonaSurfacePayload?.({
                persona_surface: message.surface || {},
                speech_text: message.surface?.speechText || ''
            }, {
                messageId: message.requestId || '',
                source: 'character_renderer_protocol',
                allowExpressiveMotion: true,
                allowExperimentalMotion: true
            });
            break;
        case 'persona.speech.start':
            if (message.mode === 'audio') {
                vrmSystem.startAudioDrivenSpeech?.();
            } else {
                vrmSystem.startFallbackSpeech?.();
            }
            break;
        case 'persona.speech.stop':
            vrmSystem.stopSpeaking?.();
            break;
        case 'persona.lip':
            vrmSystem.setLipSyncValue?.(Number(message.lip?.weight || 0));
            break;
        default:
            break;
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const petShellEl = document.getElementById('pet-shell');
    const canvasContainerEl = document.getElementById('canvas-container');
    const initialPreferences = window.ailisDesktop?.preferences || {};
    applyDesktopPreferencesToConfig(initialPreferences);
    setUiLanguage(initialPreferences.uiLanguage || 'zh-CN');
    applyPetWindowFrameCameraCompensation();

    let activeRendererBackend = initialPreferences.characterRendererBackend === 'unity'
        ? 'unity'
        : 'electron';
    let unityAvatarBounds = null;
    let vrmSystem = null;
    let vrmLoadPromise = null;
    petShellEl.dataset.rendererBackend = activeRendererBackend;

    const ensureThreeRenderer = async () => {
        if (vrmSystem) {
            return vrmSystem;
        }
        if (!vrmLoadPromise) {
            vrmLoadPromise = import('./vrm-model-system.js')
                .then(async ({ VRMModelSystem }) => {
                    const system = new VRMModelSystem();
                    system.init('canvas-container');
                    if (system.scene) {
                        system.scene.background = null;
                    }
                    if (system.renderer) {
                        system.renderer.setClearColor(0x000000, 0);
                    }
                    if (system.controls) {
                        system.controls.enabled = false;
                    }
                    await system.loadModel();
                    system.setRenderEnabled(activeRendererBackend === 'electron');
                    vrmSystem = system;
                    window.vrmSystem = system;
                    return system;
                })
                .catch((error) => {
                    vrmLoadPromise = null;
                    console.error('[pet] Three renderer failed to load:', error);
                    throw error;
                });
        }
        return vrmLoadPromise;
    };

    const getActiveAvatarBounds = () => activeRendererBackend === 'unity'
        ? unityAvatarBounds
        : vrmSystem?.getAvatarHitTestBounds?.();
    const mouseHitTest = installPetMouseHitTest({
        rootElement: petShellEl,
        canvasElement: canvasContainerEl,
        avatarBoundsProvider: getActiveAvatarBounds,
        preferences: initialPreferences
    });
    const applyRendererInteractionState = (payload = {}) => {
        activeRendererBackend = payload.backend === 'unity' ? 'unity' : 'electron';
        petShellEl.dataset.rendererBackend = activeRendererBackend;
        unityAvatarBounds = activeRendererBackend === 'unity' && payload.hitTestBounds?.complete
            ? payload.hitTestBounds
            : null;
        vrmSystem?.setRenderEnabled(activeRendererBackend === 'electron');
        mouseHitTest?.refreshBounds?.();
        if (activeRendererBackend === 'electron') {
            void ensureThreeRenderer();
        }
    };
    const removeCursorListener = window.ailisDesktop?.onPetCursorPoint?.((payload = {}) => {
        mouseHitTest?.handleCursorPoint?.(payload);
    });
    const removeRendererStateListener = window.ailisDesktop?.onPetRendererState?.(
        applyRendererInteractionState
    );
    const removeCommandListener = window.ailisDesktop?.characterRenderer?.onCommand?.((message = {}) => {
        if (activeRendererBackend !== 'electron') {
            return;
        }
        void ensureThreeRenderer().then((system) => {
            applyRendererCommand(system, message);
        });
    });
    void window.ailisDesktop?.characterRenderer?.getStatus?.().then((status = {}) => {
        const unityPending = status.desiredBackend === 'unity' &&
            !['fallback', 'electron'].includes(String(status.status || '').toLowerCase());
        applyRendererInteractionState({
            backend: unityPending ? 'unity' : status.effectiveBackend,
            hitTestBounds: status.hitTestBounds
        });
    });

    window.ailisDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) => {
        const previousModelPath = CONFIG.MODEL_PATH;
        applyDesktopPreferencesToConfig(preferences);
        setUiLanguage(preferences.uiLanguage || 'zh-CN');
        const preferredBackend = preferences.characterRendererBackend === 'unity'
            ? 'unity'
            : 'electron';
        if (preferredBackend !== activeRendererBackend) {
            applyRendererInteractionState({ backend: preferredBackend });
        }
        if (CONFIG.MODEL_PATH !== previousModelPath && vrmSystem) {
            window.location.reload();
            return;
        }
        applyPetWindowFrameCameraCompensation();
        vrmSystem?.applyPreferences();
        mouseHitTest?.updatePreferences(preferences);
    });

    installRendererInteractions(petShellEl);
    window.vrmSystem = null;
    if (activeRendererBackend === 'electron') {
        await ensureThreeRenderer();
    }

    window.addEventListener('beforeunload', () => {
        removeCursorListener?.();
        removeRendererStateListener?.();
        removeCommandListener?.();
        mouseHitTest?.dispose?.();
    });
});
