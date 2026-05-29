import { VRMModelSystem } from './vrm-model-system.js';
import { TTSAudioPlayer } from './tts-audio-player.js';
import { ChatTTSSystem } from './chat-tts-system.js';
import { createChatService } from './chat-service.js';
import { createSpeechProvider } from './speech-provider.js';
import { applyDesktopPreferencesToConfig } from './config.js';
import { installAvatarDialogueBubble } from './avatar-dialogue-bubble.js';

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
            lastX: event.screenX,
            lastY: event.screenY,
            moved: false
        };

        rootElement.setPointerCapture?.(event.pointerId);
    });

    rootElement.addEventListener('pointermove', (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }

        const deltaX = event.screenX - dragState.lastX;
        const deltaY = event.screenY - dragState.lastY;
        const totalDistance = Math.abs(event.screenX - dragState.startX) +
            Math.abs(event.screenY - dragState.startY);

        if (totalDistance > 4) {
            dragState.moved = true;
        }

        dragState.lastX = event.screenX;
        dragState.lastY = event.screenY;

        if (dragState.moved && (deltaX !== 0 || deltaY !== 0)) {
            window.aigrilDesktop?.dragPetWindow?.(deltaX, deltaY);
        }
    });

    rootElement.addEventListener('pointerup', async (event) => {
        if (!dragState || event.pointerId !== dragState.pointerId) {
            return;
        }

        const wasClick = !dragState.moved;
        resetDragState();

        if (wasClick) {
            await window.aigrilDesktop?.showChatWindow?.();
        }
    });

    rootElement.addEventListener('pointercancel', resetDragState);
    rootElement.addEventListener('contextmenu', async (event) => {
        event.preventDefault();
        resetDragState();
        await window.aigrilDesktop?.showControlMenu?.();
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    const petShellEl = document.getElementById('pet-shell');
    installAvatarDialogueBubble({
        rootElement: petShellEl,
        variant: 'pet'
    });
    applyDesktopPreferencesToConfig(window.aigrilDesktop?.preferences || {});
    const vrmSystem = new VRMModelSystem();
    const audioPlayer = new TTSAudioPlayer(vrmSystem);
    const chatService = createChatService();
    const buildSpeechProvider = (speechMode = null) => createSpeechProvider({
        enableTTS: true,
        speechMode
    });
    let speechProvider = buildSpeechProvider(window.aigrilDesktop?.preferences?.speechMode);
    const chatSystem = new ChatTTSSystem(vrmSystem, audioPlayer, chatService, {
        speechProvider
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

    window.aigrilDesktop?.onChatStateSyncRequest?.(() => {
        emitDesktopChatEvent({
            type: 'snapshot',
            messages: chatSystem.getTranscriptSnapshot(),
            isBusy: chatSystem.isBusy
        });
    });

    window.aigrilDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) => {
        applyDesktopPreferencesToConfig(preferences);
        speechProvider?.dispose?.();
        speechProvider = buildSpeechProvider(preferences.speechMode);
        chatSystem.setSpeechProvider(speechProvider);
        chatSystem.applyRuntimePreferences();
        vrmSystem.applyPreferences();
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
        speechProvider?.dispose?.();
    });
});
