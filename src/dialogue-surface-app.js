import {
    AVATAR_SPEECH_EVENT_NAME,
    installAvatarDialogueBubble
} from './avatar-dialogue-bubble.js';

window.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('dialogue-surface');
    const disposeBubble = installAvatarDialogueBubble({
        rootElement,
        variant: 'surface'
    });
    const removeEventListener = window.ailisDesktop?.dialogueSurface?.onEvent?.((payload = {}) => {
        window.dispatchEvent(new CustomEvent(AVATAR_SPEECH_EVENT_NAME, { detail: payload }));
    });

    window.addEventListener('beforeunload', () => {
        removeEventListener?.();
        disposeBubble?.();
    });
});
