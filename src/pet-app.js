import { VRMModelSystem } from './vrm-model-system.js';
import { TTSAudioPlayer } from './tts-audio-player.js';
import { ChatTTSSystem } from './chat-tts-system.js';
import { createChatService } from './chat-service.js';
import { createSpeechProvider } from './speech-provider.js';
import { CONFIG, applyDesktopPreferencesToConfig } from './config.js';
import { installAvatarDialogueBubble } from './avatar-dialogue-bubble.js';
import { installPetMouseHitTest } from './pet-mouse-hit-test.js';
import { setUiLanguage } from './i18n.js';

const PET_RENDER_AVATAR_REFERENCE_HEIGHT = 560;
const PET_RENDER_WINDOW_FRAME_HEIGHT = 960;
const PET_WINDOW_CAMERA_DISTANCE_RATIO = PET_RENDER_WINDOW_FRAME_HEIGHT / PET_RENDER_AVATAR_REFERENCE_HEIGHT;
const WEB_RENDER_PROFILE_ID = 'ailis_bright_companion_mtoon';
const WEB_RENDER_SHADOW_PREFERENCES = Object.freeze({
    renderShadowStrength: 0.16,
    renderShadowRange: 1.25
});
const WEB_DESKTOP_RENDER_QUALITY_PREFERENCES = Object.freeze({
    renderResolutionScale: 1.25,
    renderShadowQuality: 2,
    renderFpsLimit: 60
});
const WEB_MOBILE_RENDER_QUALITY_PREFERENCES = Object.freeze({
    renderResolutionScale: 1,
    renderShadowQuality: 1,
    renderFpsLimit: 60
});
const WEB_CLOSE_CAMERA_PREFERENCES = Object.freeze({
    cameraDistance: 1.34,
    cameraHeight: 1.28,
    cameraTargetY: 1.04
});
const WEB_MOBILE_CAMERA_PREFERENCES = Object.freeze({
    cameraDistance: 1.48,
    cameraHeight: 1.3,
    cameraTargetY: 1.06
});

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

function emitDesktopChatEvent(payload) {
    window.ailisDesktop?.emitChatEvent?.(payload);
}

function installPetInteractions(rootElement) {
    let dragState = null;

    const resetDragState = () => {
        dragState = null;
    };

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

        const totalDistance = Math.abs(event.screenX - dragState.startX) +
            Math.abs(event.screenY - dragState.startY);

        if (totalDistance > 4) {
            dragState.moved = true;
        }

        if (dragState.moved) {
            window.ailisDesktop?.dragPetWindow?.();
        }
    });

    rootElement.addEventListener('pointerup', async (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }

        const wasClick = !dragState.moved;
        resetDragState();
        window.ailisDesktop?.endDragPetWindow?.();

        if (wasClick) {
            await window.ailisDesktop?.showChatWindow?.();
        }
    });

    rootElement.addEventListener('pointercancel', () => {
        resetDragState();
        window.ailisDesktop?.endDragPetWindow?.();
    });
    rootElement.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        resetDragState();
        await window.ailisDesktop?.showControlMenu?.();
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    const petShellEl = document.getElementById('pet-shell');
    const canvasContainerEl = document.getElementById('canvas-container');
    const initialPreferences = window.ailisDesktop?.preferences || {};
    const runtimeUrl = new URL(window.location.href);
    const isEmbeddedWebExperience = runtimeUrl.searchParams.get('web') === '1';
    const useWebCloseCamera = isEmbeddedWebExperience && runtimeUrl.searchParams.get('camera') === 'close';
    const isWebMobileViewport = window.matchMedia('(max-width: 760px)').matches;
    const webCameraPreferences = isWebMobileViewport
        ? WEB_MOBILE_CAMERA_PREFERENCES
        : WEB_CLOSE_CAMERA_PREFERENCES;
    const webRenderQualityPreferences = isWebMobileViewport
        ? WEB_MOBILE_RENDER_QUALITY_PREFERENCES
        : WEB_DESKTOP_RENDER_QUALITY_PREFERENCES;
    const withWebRenderPreferences = (preferences = {}) => isEmbeddedWebExperience
        ? {
            ...preferences,
            ...(useWebCloseCamera ? webCameraPreferences : {}),
            ...WEB_RENDER_SHADOW_PREFERENCES,
            ...webRenderQualityPreferences,
            renderProfileId: WEB_RENDER_PROFILE_ID
        }
        : preferences;
    const effectivePreferences = withWebRenderPreferences(initialPreferences);
    applyDesktopPreferencesToConfig(effectivePreferences);
    setUiLanguage(initialPreferences.uiLanguage || 'zh-CN');
    if (!isEmbeddedWebExperience) {
        applyPetWindowFrameCameraCompensation();
    }
    const vrmSystem = new VRMModelSystem();
    installAvatarDialogueBubble({
        rootElement: petShellEl,
        variant: 'pet',
        avatarBoundsProvider: () => vrmSystem.getAvatarHitTestBounds?.()
    });
    const audioPlayer = new TTSAudioPlayer(vrmSystem);
    let chatService = createChatService(initialPreferences);
    const buildSpeechProvider = (speechMode = null) => createSpeechProvider({
        enableTTS: true,
        speechMode
    });
    let speechProvider = buildSpeechProvider(initialPreferences.speechMode);
    const chatSystem = new ChatTTSSystem(vrmSystem, audioPlayer, chatService, {
        speechProvider,
        chunkedTtsEnabled: initialPreferences.chunkedTtsEnabled
    });
    const mouseHitTest = isEmbeddedWebExperience
        ? null
        : installPetMouseHitTest({
            rootElement: petShellEl,
            canvasElement: canvasContainerEl,
            avatarBoundsProvider: () => vrmSystem.getAvatarHitTestBounds?.(),
            preferences: initialPreferences
        });
    const removePetCursorPointListener = window.ailisDesktop?.onPetCursorPoint?.((payload = {}) => {
        mouseHitTest?.handleCursorPoint?.(payload);
    });

    window.addEventListener('ailis-chat-ui-event', (event) => {
        emitDesktopChatEvent(event.detail);
    });

    window.ailisDesktop?.onChatMessageRequest?.((payload = {}) => {
        void chatSystem.sendExternalMessage(payload.content || '', {
            attachments: payload.attachments || [],
            source: payload.source || ''
        });
    });

    window.ailisDesktop?.onChatControlRequest?.((payload = {}) => {
        if (payload.type === 'clear-conversation') {
            chatSystem.clearConversation();
        }
        if (payload.type === 'interrupt-conversation') {
            void chatSystem.interruptCurrentTurn();
        }
    });

    window.ailisDesktop?.onChatStateSyncRequest?.(() => {
        emitDesktopChatEvent({
            type: 'snapshot',
            messages: chatSystem.getTranscriptSnapshot(),
            isBusy: chatSystem.isBusy
        });
    });

    window.ailisDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) => {
        const previousModelPath = CONFIG.MODEL_PATH;
        applyDesktopPreferencesToConfig(withWebRenderPreferences(preferences));
        setUiLanguage(preferences.uiLanguage || 'zh-CN');
        if (CONFIG.MODEL_PATH !== previousModelPath) {
            window.location.reload();
            return;
        }
        if (!isEmbeddedWebExperience) {
            applyPetWindowFrameCameraCompensation();
        }
        speechProvider?.dispose?.();
        speechProvider = buildSpeechProvider(preferences.speechMode);
        chatSystem.setSpeechProvider(speechProvider);
        const nextChatService = createChatService(preferences);
        if (nextChatService.conversationMode !== chatService.conversationMode) {
            chatService = nextChatService;
            chatSystem.setChatService(chatService);
            window.chatService = chatService;
        }
        chatSystem.applyRuntimePreferences(preferences);
        vrmSystem.applyPreferences();
        mouseHitTest?.updatePreferences(preferences);
        window.speechProvider = speechProvider;
    });

    if (!isEmbeddedWebExperience) {
        installPetInteractions(petShellEl);
    }

    window.vrmSystem = vrmSystem;
    window.audioPlayer = audioPlayer;
    window.chatService = chatService;
    window.chatSystem = chatSystem;
    window.speechProvider = speechProvider;
    window.setAilisRenderProfile = (profileId) => {
        CONFIG.RENDER_PROFILE_ID = isEmbeddedWebExperience
            ? WEB_RENDER_PROFILE_ID
            : String(profileId || '').trim() || CONFIG.RENDER_PROFILE_ID;
        return vrmSystem.applyRenderProfile(CONFIG.RENDER_PROFILE_ID);
    };

    vrmSystem.init('canvas-container');

    if (vrmSystem.scene) {
        vrmSystem.scene.background = null;
    }
    if (vrmSystem.renderer) {
        vrmSystem.renderer.setClearColor(0x000000, 0);
    }
    if (vrmSystem.controls) {
        vrmSystem.controls.enabled = false;
    }

    await vrmSystem.loadModel();

    emitDesktopChatEvent({
        type: 'snapshot',
        messages: chatSystem.getTranscriptSnapshot(),
        isBusy: chatSystem.isBusy
    });

    window.addEventListener('beforeunload', () => {
        removePetCursorPointListener?.();
        mouseHitTest?.dispose?.();
        speechProvider?.dispose?.();
    });
});
