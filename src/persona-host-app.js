import { TTSAudioPlayer } from './tts-audio-player.js';
import { ChatTTSSystem } from './chat-tts-system.js';
import { CharacterRendererClient } from './character-renderer-client.js';
import { createChatService } from './chat-service.js';
import { createSpeechProvider } from './speech-provider.js';
import { applyDesktopPreferencesToConfig } from './config.js';
import { setUiLanguage } from './i18n.js';

function emitDesktopChatEvent(payload) {
    window.ailisDesktop?.emitChatEvent?.(payload);
}

window.addEventListener('DOMContentLoaded', () => {
    const initialPreferences = window.ailisDesktop?.preferences || {};
    applyDesktopPreferencesToConfig(initialPreferences);
    setUiLanguage(initialPreferences.uiLanguage || 'zh-CN');

    const characterRenderer = new CharacterRendererClient();
    const audioPlayer = new TTSAudioPlayer(characterRenderer);
    let chatService = createChatService(initialPreferences);
    const buildSpeechProvider = (speechMode = null) => createSpeechProvider({
        enableTTS: true,
        speechMode
    });
    let speechProvider = buildSpeechProvider(initialPreferences.speechMode);
    const chatSystem = new ChatTTSSystem(characterRenderer, audioPlayer, chatService, {
        speechProvider,
        chunkedTtsEnabled: initialPreferences.chunkedTtsEnabled
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
        applyDesktopPreferencesToConfig(preferences);
        setUiLanguage(preferences.uiLanguage || 'zh-CN');
        speechProvider?.dispose?.();
        speechProvider = buildSpeechProvider(preferences.speechMode);
        chatSystem.setSpeechProvider(speechProvider);
        const nextChatService = createChatService(preferences);
        if (nextChatService.conversationMode !== chatService.conversationMode) {
            chatService = nextChatService;
            chatSystem.setChatService(chatService);
        }
        chatSystem.applyRuntimePreferences(preferences);
    });

    emitDesktopChatEvent({
        type: 'snapshot',
        messages: chatSystem.getTranscriptSnapshot(),
        isBusy: chatSystem.isBusy
    });

    window.addEventListener('beforeunload', () => {
        speechProvider?.dispose?.();
        void audioPlayer.stop();
    });
});
