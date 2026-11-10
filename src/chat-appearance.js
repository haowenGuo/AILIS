// Chat-only appearance: do not broadcast renderer preferences to the avatar/runtime.
export const CHAT_BACKGROUND_KEY = 'ailis.chat.background.v1';
export const DEFAULT_CHAT_BACKGROUND = '#edf5fc';

export function normalizeChatColor(value) {
    return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
        ? value.toLowerCase() : DEFAULT_CHAT_BACKGROUND;
}

function luminance(hex) {
    const channels = hex.slice(1).match(/../g).map(channel => {
        const value = parseInt(channel, 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function chatPalette(value) {
    const paper = normalizeChatColor(value);
    const light = luminance(paper) > 0.179;
    const readable = preferred => {
        const a = luminance(paper), b = luminance(preferred);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5
            ? preferred : light ? '#000000' : '#ffffff';
    };
    return {
        '--paper': paper,
        '--surface': light ? '#ffffff' : '#202830',
        '--text-main': readable(light ? '#263747' : '#eef5fc'),
        '--text-muted': readable(light ? '#627687' : '#b7c8d8'),
        '--accent': light ? '#356b96' : '#a8d7fa',
        '--chat-color-scheme': light ? 'light' : 'dark'
    };
}

export function installChatAppearance({ translate = text => text } = {}) {
    const root = document.documentElement;
    const picker = document.getElementById('chat-background-color');
    const presets = [...document.querySelectorAll('[data-chat-color]')];
    const notice = document.getElementById('chat-color-notice');
    const apply = value => {
        const color = normalizeChatColor(value);
        Object.entries(chatPalette(color)).forEach(([key, val]) => root.style.setProperty(key, val));
        picker.value = color;
        presets.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.chatColor === color)));
    };
    const save = value => {
        apply(value);
        try {
            localStorage.setItem(CHAT_BACKGROUND_KEY, normalizeChatColor(value));
            notice.hidden = true;
        } catch {
            notice.textContent = translate('颜色已应用，但未能保存');
            notice.hidden = false;
        }
    };
    let stored;
    try { stored = localStorage.getItem(CHAT_BACKGROUND_KEY); } catch { /* Use default when storage is unavailable. */ }
    apply(stored);
    presets.forEach(button => button.addEventListener('click', () => save(button.dataset.chatColor)));
    picker.addEventListener('input', () => apply(picker.value));
    picker.addEventListener('change', () => save(picker.value));
    window.addEventListener('storage', event => {
        if (event.storageArea === localStorage && (event.key === CHAT_BACKGROUND_KEY || event.key === null)) apply(event.newValue);
    });
}
