import { VRMModelSystem } from './vrm-model-system.js';
import { TTSAudioPlayer } from './tts-audio-player.js';
import { ChatTTSSystem } from './chat-tts-system.js';
import { createChatService } from './chat-service.js';
import { createSpeechProvider } from './speech-provider.js';
import { CONFIG, applyDesktopPreferencesToConfig } from './config.js';
import { installAvatarDialogueBubble } from './avatar-dialogue-bubble.js';
import { setUiLanguage } from './i18n.js';


window.addEventListener('DOMContentLoaded', async () => {
    installAvatarDialogueBubble({
        rootElement: document.getElementById('app-container'),
        variant: 'main'
    });
    applyDesktopPreferencesToConfig(window.ailisDesktop?.preferences || {});
    setUiLanguage(window.ailisDesktop?.preferences?.uiLanguage || 'zh-CN');
    const vrmSystem = new VRMModelSystem();
    const audioPlayer = new TTSAudioPlayer(vrmSystem);
    const chatService = createChatService();
    const initialPreferences = window.ailisDesktop?.preferences || {};
    const buildSpeechProvider = (speechMode = null) => createSpeechProvider({
        enableTTS: true,
        speechMode
    });
    let speechProvider = buildSpeechProvider(initialPreferences.speechMode);
    const chatSystem = new ChatTTSSystem(vrmSystem, audioPlayer, chatService, {
        speechProvider,
        chunkedTtsEnabled: initialPreferences.chunkedTtsEnabled
    });

    window.ailisDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) => {
        const previousModelPath = CONFIG.MODEL_PATH;
        applyDesktopPreferencesToConfig(preferences);
        setUiLanguage(preferences.uiLanguage || 'zh-CN');
        if (CONFIG.MODEL_PATH !== previousModelPath) {
            window.location.reload();
            return;
        }
        speechProvider?.dispose?.();
        speechProvider = buildSpeechProvider(preferences.speechMode);
        chatSystem.setSpeechProvider(speechProvider);
        chatSystem.applyRuntimePreferences(preferences);
        vrmSystem.applyPreferences();
        window.speechProvider = speechProvider;
    });

    vrmSystem.init('canvas-container');
    await vrmSystem.loadModel();

    window.vrmSystem = vrmSystem;
    window.audioPlayer = audioPlayer;
    window.chatService = chatService;
    window.chatSystem = chatSystem;
    window.speechProvider = speechProvider;

    window.addEventListener('beforeunload', () => {
        speechProvider?.dispose?.();
    });
});
