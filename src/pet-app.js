import { VRMModelSystem } from './vrm-model-system.js';
import { TTSAudioPlayer } from './tts-audio-player.js';
import { ChatTTSSystem } from './chat-tts-system.js';
import { createChatService } from './chat-service.js';
import { createSpeechProvider } from './speech-provider.js';
import { CONFIG, applyDesktopPreferencesToConfig } from './config.js';
import { installAvatarDialogueBubble } from './avatar-dialogue-bubble.js';
import { installPetMouseHitTest } from './pet-mouse-hit-test.js';

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

function emitDesktopChatEvent(payload) {
    window.aigrilDesktop?.emitChatEvent?.(payload);
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

        window.aigrilDesktop?.beginDragPetWindow?.();
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
            window.aigrilDesktop?.dragPetWindow?.();
        }
    });

    rootElement.addEventListener('pointerup', async (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }

        const wasClick = !dragState.moved;
        resetDragState();
        window.aigrilDesktop?.endDragPetWindow?.();

        if (wasClick) {
            await window.aigrilDesktop?.showChatWindow?.();
        }
    });

    rootElement.addEventListener('pointercancel', () => {
        resetDragState();
        window.aigrilDesktop?.endDragPetWindow?.();
    });
    rootElement.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        resetDragState();
        await window.aigrilDesktop?.showControlMenu?.();
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    const petShellEl = document.getElementById('pet-shell');
    const canvasContainerEl = document.getElementById('canvas-container');
    applyDesktopPreferencesToConfig(window.aigrilDesktop?.preferences || {});
    applyPetWindowFrameCameraCompensation();
    const vrmSystem = new VRMModelSystem();
    installAvatarDialogueBubble({
        rootElement: petShellEl,
        variant: 'pet',
        avatarBoundsProvider: () => vrmSystem.getAvatarHitTestBounds?.()
    });
    const audioPlayer = new TTSAudioPlayer(vrmSystem);
    let chatService = createChatService(window.aigrilDesktop?.preferences || {});
    const buildSpeechProvider = (speechMode = null) => createSpeechProvider({
        enableTTS: true,
        speechMode
    });
    let speechProvider = buildSpeechProvider(window.aigrilDesktop?.preferences?.speechMode);
    const chatSystem = new ChatTTSSystem(vrmSystem, audioPlayer, chatService, {
        speechProvider
    });
    const mouseHitTest = installPetMouseHitTest({
        rootElement: petShellEl,
        canvasElement: canvasContainerEl,
        avatarBoundsProvider: () => vrmSystem.getAvatarHitTestBounds?.(),
        preferences: window.aigrilDesktop?.preferences || {}
    });
    const removePetCursorPointListener = window.aigrilDesktop?.onPetCursorPoint?.((payload = {}) => {
        mouseHitTest?.handleCursorPoint?.(payload);
    });

    window.addEventListener('aigril-chat-ui-event', (event) => {
        emitDesktopChatEvent(event.detail);
    });

    window.aigrilDesktop?.onChatMessageRequest?.((payload = {}) => {
        void chatSystem.sendExternalMessage(payload.content || '', {
            attachments: payload.attachments || [],
            source: payload.source || ''
        });
    });

    window.aigrilDesktop?.onChatControlRequest?.((payload = {}) => {
        if (payload.type === 'clear-conversation') {
            chatSystem.clearConversation();
        }
        if (payload.type === 'interrupt-conversation') {
            void chatSystem.interruptCurrentTurn();
        }
    });

    window.aigrilDesktop?.onChatStateSyncRequest?.(() => {
        emitDesktopChatEvent({
            type: 'snapshot',
            messages: chatSystem.getTranscriptSnapshot(),
            isBusy: chatSystem.isBusy
        });
    });

    window.aigrilDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) => {
        applyDesktopPreferencesToConfig(preferences);
        applyPetWindowFrameCameraCompensation();
        speechProvider?.dispose?.();
        speechProvider = buildSpeechProvider(preferences.speechMode);
        chatSystem.setSpeechProvider(speechProvider);
        const nextChatService = createChatService(preferences);
        if (nextChatService.conversationMode !== chatService.conversationMode) {
            chatService = nextChatService;
            chatSystem.setChatService(chatService);
            window.chatService = chatService;
        }
        chatSystem.applyRuntimePreferences();
        vrmSystem.applyPreferences();
        mouseHitTest?.updatePreferences(preferences);
        window.speechProvider = speechProvider;
    });

    installPetInteractions(petShellEl);

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

    window.vrmSystem = vrmSystem;
    window.audioPlayer = audioPlayer;
    window.chatService = chatService;
    window.chatSystem = chatSystem;
    window.speechProvider = speechProvider;

    window.addEventListener('beforeunload', () => {
        removePetCursorPointListener?.();
        mouseHitTest?.dispose?.();
        speechProvider?.dispose?.();
    });
});
