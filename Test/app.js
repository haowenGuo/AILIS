import { setMarkdownContent, setPlainTextContent } from '../src/markdown-renderer.js';

const CLOUD_BACKEND_BASE_URL = 'https://101.133.239.56';
const DEFAULT_BACKEND_BASE_URL = window.location.hostname.toLowerCase() === 'haowenguo.github.io'
    ? CLOUD_BACKEND_BASE_URL
    : ['http:', 'https:'].includes(window.location.protocol)
        ? window.location.origin
        : CLOUD_BACKEND_BASE_URL;
const PET_CHAT_EVENT_NAME = 'ailis-chat-ui-event';
const AILIS_AVATAR_URL = new URL('../Resources/Emotes/ailis-small/wave.png', window.location.href).href;
const SCENE_STORAGE_KEY = 'ailis.web.scene.v1';
const RENDER_PROFILE_STORAGE_KEY = 'ailis.web.render-profile.v1';
const TTS_VOICE_STORAGE_KEY = 'ailis.web.tts-voice.v1';
const CLOUD_TTS_VOICE_ID = 'cloud';
const DEFAULT_RENDER_PROFILE_ID = 'ailis_bright_companion_mtoon';
const SCENE_IDS = new Set(['sakura', 'school', 'seaside']);
const WEB_ASSET_VERSION = typeof __AILIS_BUILD_REVISION__ === 'string'
    ? __AILIS_BUILD_REVISION__
    : new URL(import.meta.url).pathname.split('/').pop() || 'web';

function preloadWebModel() {
    const modelUrl = new URL('../Resources/AILIS.web.vrm', window.location.href);
    modelUrl.searchParams.set('v', WEB_ASSET_VERSION);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.type = 'application/octet-stream';
    link.crossOrigin = 'anonymous';
    link.href = modelUrl.href;
    document.head.appendChild(link);
}

const elements = {
    experience: document.querySelector('.experience'),
    petFrame: document.getElementById('pet-frame'),
    modelStatus: document.getElementById('model-status'),
    modelStatusText: document.getElementById('model-status-text'),
    backendStatus: document.getElementById('backend-status'),
    backendStatusText: document.getElementById('backend-status-text'),
    composerStatus: document.getElementById('composer-status'),
    characterPane: document.querySelector('.character-pane'),
    stageVisual: document.getElementById('stage-visual'),
    dialogueSpeaker: document.getElementById('dialogue-speaker'),
    dialogueContent: document.getElementById('dialogue-content'),
    messageList: document.getElementById('message-list'),
    historyDrawer: document.getElementById('history-drawer'),
    historyToggle: document.getElementById('history-toggle'),
    historyClose: document.getElementById('history-close'),
    historyBackdrop: document.getElementById('history-backdrop'),
    composer: document.getElementById('composer'),
    chatInput: document.getElementById('chat-input'),
    sendButton: document.getElementById('send-button'),
    voiceSelect: document.getElementById('tts-voice-select'),
    quickButtons: Array.from(document.querySelectorAll('[data-prompt]')),
    sceneButtons: Array.from(document.querySelectorAll('[data-scene-option]')),
    renderButtons: Array.from(document.querySelectorAll('[data-render-profile]'))
};

const state = {
    attachedWindow: null,
    backendState: 'checking',
    modelReady: false,
    chatReady: false,
    busy: false,
    historyOpen: false,
    renderProfileId: DEFAULT_RENDER_PROFILE_ID,
    ttsVoiceId: CLOUD_TTS_VOICE_ID,
    followLatestMessage: true,
    scrollFrame: 0,
    messagesById: new Map(),
    messageOrder: []
};

const MESSAGE_BOTTOM_THRESHOLD = 72;

function normalizeBackendBaseUrl(value) {
    try {
        const url = new URL(String(value || '').trim());
        if (!['http:', 'https:'].includes(url.protocol)) {
            return DEFAULT_BACKEND_BASE_URL;
        }
        return url.href.replace(/\/+$/, '');
    } catch {
        return DEFAULT_BACKEND_BASE_URL;
    }
}

function getBackendBaseUrl() {
    const params = new URLSearchParams(window.location.search);
    return normalizeBackendBaseUrl(params.get('backend') || DEFAULT_BACKEND_BASE_URL);
}

const backendBaseUrl = getBackendBaseUrl();

function getBrowserVoiceId(voice) {
    return String(voice?.voiceURI || voice?.name || '').trim();
}

function getBrowserVoices() {
    try {
        return window.speechSynthesis?.getVoices?.() || [];
    } catch {
        return [];
    }
}

function formatBrowserVoiceLabel(voice) {
    const serviceLabel = voice.localService ? '本地' : '在线';
    return `${voice.name} · ${voice.lang || '未知语言'} · ${serviceLabel}`;
}

function renderVoiceOptions() {
    const voices = getBrowserVoices()
        .filter((voice) => getBrowserVoiceId(voice))
        .sort((left, right) => {
            const leftChinese = /^zh\b/i.test(left.lang || '') ? 0 : 1;
            const rightChinese = /^zh\b/i.test(right.lang || '') ? 0 : 1;
            return leftChinese - rightChinese ||
                String(left.lang || '').localeCompare(String(right.lang || '')) ||
                String(left.name || '').localeCompare(String(right.name || ''));
        });

    elements.voiceSelect.replaceChildren();
    const cloudOption = document.createElement('option');
    cloudOption.value = CLOUD_TTS_VOICE_ID;
    cloudOption.textContent = 'AILIS 云端语音';
    elements.voiceSelect.appendChild(cloudOption);

    if (voices.length) {
        const browserGroup = document.createElement('optgroup');
        browserGroup.label = `Chrome 浏览器语音（${voices.length}）`;
        voices.forEach((voice) => {
            const option = document.createElement('option');
            option.value = getBrowserVoiceId(voice);
            option.textContent = formatBrowserVoiceLabel(voice);
            browserGroup.appendChild(option);
        });
        elements.voiceSelect.appendChild(browserGroup);
    } else {
        const loadingOption = document.createElement('option');
        loadingOption.value = '__loading__';
        loadingOption.textContent = window.speechSynthesis
            ? '正在读取 Chrome 语音…'
            : '当前浏览器不支持原生语音';
        loadingOption.disabled = true;
        elements.voiceSelect.appendChild(loadingOption);
    }

    const selectedVoiceExists = state.ttsVoiceId === CLOUD_TTS_VOICE_ID ||
        voices.some((voice) => getBrowserVoiceId(voice) === state.ttsVoiceId);
    if (!selectedVoiceExists && state.ttsVoiceId !== CLOUD_TTS_VOICE_ID) {
        const pendingOption = document.createElement('option');
        pendingOption.value = state.ttsVoiceId;
        pendingOption.textContent = '上次选择的 Chrome 语音（载入中）';
        elements.voiceSelect.appendChild(pendingOption);
    }
    elements.voiceSelect.value = state.ttsVoiceId;
    elements.voiceSelect.title = elements.voiceSelect.selectedOptions[0]?.textContent || '选择语音';
}

function applyTtsVoiceToPet() {
    const petWindow = getPetWindow();
    if (typeof petWindow?.setAilisSpeechVoice !== 'function') {
        return false;
    }
    const useCloudVoice = state.ttsVoiceId === CLOUD_TTS_VOICE_ID;
    petWindow.setAilisSpeechVoice({
        speechMode: useCloudVoice ? 'server' : 'native',
        nativeVoiceId: useCloudVoice ? '' : state.ttsVoiceId
    });
    return true;
}

function setTtsVoice(voiceId, { persist = true, apply = true } = {}) {
    const normalizedVoiceId = String(voiceId || '').trim();
    state.ttsVoiceId = normalizedVoiceId && normalizedVoiceId !== '__loading__'
        ? normalizedVoiceId
        : CLOUD_TTS_VOICE_ID;
    if (persist) {
        try {
            window.localStorage?.setItem(TTS_VOICE_STORAGE_KEY, state.ttsVoiceId);
        } catch {
            // The selected voice remains active for this page session.
        }
    }
    renderVoiceOptions();
    if (apply) {
        applyTtsVoiceToPet();
    }
}

function restoreTtsVoice() {
    try {
        setTtsVoice(window.localStorage?.getItem(TTS_VOICE_STORAGE_KEY), {
            persist: false,
            apply: false
        });
    } catch {
        setTtsVoice(CLOUD_TTS_VOICE_ID, { persist: false, apply: false });
    }
}

function setScene(sceneId, { persist = true } = {}) {
    const nextScene = SCENE_IDS.has(sceneId) ? sceneId : 'sakura';
    elements.characterPane.dataset.scene = nextScene;
    elements.stageVisual.dataset.scene = nextScene;
    elements.sceneButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.sceneOption === nextScene));
    });
    if (persist) {
        try {
            window.localStorage?.setItem(SCENE_STORAGE_KEY, nextScene);
        } catch {
            // Scene selection remains available for the current page session.
        }
    }
}

function restoreScene() {
    try {
        setScene(window.localStorage?.getItem(SCENE_STORAGE_KEY), { persist: false });
    } catch {
        setScene('sakura', { persist: false });
    }
}

function normalizeRenderProfileId(profileId) {
    const normalized = String(profileId || '').trim();
    return elements.renderButtons.some((button) => button.dataset.renderProfile === normalized)
        ? normalized
        : DEFAULT_RENDER_PROFILE_ID;
}

function applyRenderProfileToPet() {
    const petWindow = getPetWindow();
    return Boolean(petWindow?.setAilisRenderProfile?.(state.renderProfileId));
}

function setRenderProfile(profileId, { persist = true } = {}) {
    state.renderProfileId = normalizeRenderProfileId(profileId);
    elements.renderButtons.forEach((button) => {
        button.setAttribute(
            'aria-pressed',
            String(button.dataset.renderProfile === state.renderProfileId)
        );
    });
    if (persist) {
        try {
            window.localStorage?.setItem(RENDER_PROFILE_STORAGE_KEY, state.renderProfileId);
        } catch {
            // The selected render profile remains active for this page session.
        }
    }
    applyRenderProfileToPet();
}

function restoreRenderProfile() {
    try {
        setRenderProfile(window.localStorage?.getItem(RENDER_PROFILE_STORAGE_KEY), { persist: false });
    } catch {
        setRenderProfile(DEFAULT_RENDER_PROFILE_ID, { persist: false });
    }
}

function setModelStatus(text, status = 'loading') {
    elements.modelStatus.dataset.state = status;
    elements.modelStatusText.textContent = text;
}

function setBackendStatus(text, status = 'checking') {
    state.backendState = status;
    elements.backendStatus.dataset.state = status;
    elements.backendStatusText.textContent = text;
    updateComposer();
}

function updateComposer() {
    const ready = state.chatReady && !state.busy;
    const canSend = ready && elements.chatInput.value.trim().length > 0;
    elements.sendButton.disabled = !canSend;
    elements.quickButtons.forEach((button) => {
        button.disabled = !ready;
    });
    elements.voiceSelect.disabled = state.busy;
    elements.messageList.setAttribute('aria-busy', String(state.busy));
    elements.dialogueContent.setAttribute('aria-busy', String(state.busy));

    if (state.busy) {
        elements.composerStatus.textContent = 'AILIS 正在回应';
    } else if (!state.modelReady) {
        elements.composerStatus.textContent = '正在载入角色';
    } else if (state.backendState === 'offline') {
        elements.composerStatus.textContent = '在线模型不可用时会自动使用离线陪伴';
    } else if (state.backendState === 'online') {
        elements.composerStatus.textContent = '在线服务已连接';
    } else {
        elements.composerStatus.textContent = '正在连接在线服务';
    }
}

function setHistoryOpen(open) {
    state.historyOpen = Boolean(open);
    elements.experience.dataset.historyOpen = String(state.historyOpen);
    elements.historyDrawer.setAttribute('aria-hidden', String(!state.historyOpen));
    elements.historyDrawer.inert = !state.historyOpen;
    elements.historyBackdrop.disabled = !state.historyOpen;
    elements.historyToggle.setAttribute('aria-expanded', String(state.historyOpen));
    elements.historyToggle.setAttribute(
        'aria-label',
        state.historyOpen ? '收起对话记录' : '展开对话记录'
    );
    if (state.historyOpen) {
        scrollMessages({ force: true });
    }
}

function resizeInput() {
    elements.chatInput.style.height = 'auto';
    elements.chatInput.style.height = `${Math.min(elements.chatInput.scrollHeight, 132)}px`;
}

function getPetWindow() {
    try {
        return elements.petFrame.contentWindow;
    } catch {
        return null;
    }
}

function clearLocalMessage() {
    elements.messageList.querySelector('[data-local-message="true"]')?.remove();
}

function createMessageRow(message) {
    const role = ['user', 'assistant', 'system', 'loading'].includes(message.role)
        ? message.role
        : 'system';
    const row = document.createElement('div');
    row.className = 'message-row';
    row.dataset.role = role;
    row.dataset.messageId = message.id;

    if (role === 'assistant') {
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        avatar.src = AILIS_AVATAR_URL;
        avatar.alt = '';
        avatar.width = 30;
        avatar.height = 30;
        row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'message';
    if (role === 'assistant') {
        bubble.dataset.enableAilisEmotes = 'true';
    }
    row.appendChild(bubble);
    return row;
}

function renderMessageContent(target, message) {
    const role = message?.role || 'system';
    const content = message?.content || (role === 'loading' ? 'AILIS 正在想' : '');
    if (role === 'assistant') {
        target.dataset.enableAilisEmotes = 'true';
        setMarkdownContent(target, content);
        return;
    }
    delete target.dataset.enableAilisEmotes;
    setPlainTextContent(target, content);
}

function getLatestMessage() {
    for (let index = state.messageOrder.length - 1; index >= 0; index -= 1) {
        const message = state.messagesById.get(state.messageOrder[index]);
        if (message) {
            return message;
        }
    }
    return null;
}

function renderCurrentDialogue(message = getLatestMessage()) {
    if (!message) {
        elements.dialogueSpeaker.textContent = 'AILIS';
        elements.dialogueContent.dataset.enableAilisEmotes = 'true';
        setPlainTextContent(elements.dialogueContent, '想聊什么都可以，我在这里。');
        return;
    }

    const speakerByRole = {
        assistant: 'AILIS',
        loading: 'AILIS',
        user: '你',
        system: 'AILIS'
    };
    elements.dialogueSpeaker.textContent = speakerByRole[message.role] || 'AILIS';
    renderMessageContent(elements.dialogueContent, message);
    elements.dialogueContent.scrollTop = elements.dialogueContent.scrollHeight;
}

function isMessageListNearBottom() {
    const remaining = elements.messageList.scrollHeight
        - elements.messageList.clientHeight
        - elements.messageList.scrollTop;
    return remaining <= MESSAGE_BOTTOM_THRESHOLD;
}

function scrollMessages({ force = false } = {}) {
    if (!force && !state.followLatestMessage) {
        return;
    }

    state.followLatestMessage = true;
    if (state.scrollFrame) {
        window.cancelAnimationFrame(state.scrollFrame);
    }
    state.scrollFrame = window.requestAnimationFrame(() => {
        state.scrollFrame = 0;
        elements.messageList.scrollTop = elements.messageList.scrollHeight;
        window.requestAnimationFrame(() => {
            if (state.followLatestMessage) {
                elements.messageList.scrollTop = elements.messageList.scrollHeight;
            }
        });
    });
}

function upsertMessage(message) {
    if (!message?.id) {
        return;
    }

    const normalizedMessage = {
        ...message,
        id: String(message.id)
    };
    const shouldFollow = state.followLatestMessage || isMessageListNearBottom();
    if (!state.messagesById.has(normalizedMessage.id)) {
        state.messageOrder.push(normalizedMessage.id);
    }
    state.messagesById.set(normalizedMessage.id, normalizedMessage);
    clearLocalMessage();
    const escapedId = CSS.escape(normalizedMessage.id);
    let row = elements.messageList.querySelector(`[data-message-id="${escapedId}"]`);
    const nextRole = ['user', 'assistant', 'system', 'loading'].includes(message.role)
        ? message.role
        : 'system';

    if (!row || row.dataset.role !== nextRole) {
        const replacement = createMessageRow({ ...normalizedMessage, role: nextRole });
        if (row) {
            row.replaceWith(replacement);
        } else {
            elements.messageList.appendChild(replacement);
        }
        row = replacement;
    }

    const bubble = row.querySelector('.message');
    renderMessageContent(bubble, { ...normalizedMessage, role: nextRole });
    renderCurrentDialogue({ ...normalizedMessage, role: nextRole });
    scrollMessages({ force: shouldFollow });
}

function removeMessage(id) {
    if (!id) {
        return;
    }
    const escapedId = CSS.escape(String(id));
    elements.messageList.querySelector(`[data-message-id="${escapedId}"]`)?.remove();
    state.messagesById.delete(String(id));
    state.messageOrder = state.messageOrder.filter((messageId) => messageId !== String(id));
    renderCurrentDialogue();
    scrollMessages();
}

function renderSnapshot(messages) {
    elements.messageList.innerHTML = '';
    state.messagesById.clear();
    state.messageOrder = [];
    const visibleMessages = Array.isArray(messages) ? messages : [];
    if (!visibleMessages.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.dataset.localMessage = 'true';
        empty.innerHTML = `
            <img src="${AILIS_AVATAR_URL}" alt="" width="54" height="54">
            <strong>AILIS 已经准备好了</strong>
            <span>从一句简单的问候开始吧。</span>
        `;
        elements.messageList.appendChild(empty);
        renderCurrentDialogue();
        return;
    }
    visibleMessages.forEach(upsertMessage);
}

function handlePetEvent(payload = {}) {
    if (payload.type === 'snapshot') {
        renderSnapshot(payload.messages);
        if (typeof payload.isBusy === 'boolean') {
            state.busy = payload.isBusy;
        }
        state.chatReady = true;
        updateComposer();
        return;
    }

    if (payload.type === 'message-added' || payload.type === 'message-updated') {
        upsertMessage(payload.message);
        return;
    }

    if (payload.type === 'message-removed') {
        removeMessage(payload.id);
        return;
    }

    if (payload.type === 'state' && typeof payload.isBusy === 'boolean') {
        state.busy = payload.isBusy;
        state.chatReady = true;
        updateComposer();
    }
}

function syncPetSnapshot() {
    const petWindow = getPetWindow();
    const chatSystem = petWindow?.chatSystem;
    if (!chatSystem?.getTranscriptSnapshot) {
        return false;
    }

    renderSnapshot(chatSystem.getTranscriptSnapshot());
    state.busy = Boolean(chatSystem.isBusy);
    state.chatReady = true;
    state.modelReady = Boolean(petWindow.vrmSystem?.isModelLoaded || state.modelReady);
    if (state.modelReady) {
        setModelStatus('角色已就绪', 'ready');
    }
    updateComposer();
    return true;
}

function attachPetWindow() {
    const petWindow = getPetWindow();
    if (!petWindow || state.attachedWindow === petWindow) {
        return;
    }

    state.attachedWindow = petWindow;
    state.modelReady = false;
    state.chatReady = false;
    setModelStatus('载入角色', 'loading');
    updateComposer();

    petWindow.addEventListener(PET_CHAT_EVENT_NAME, (event) => {
        handlePetEvent(event.detail || {});
    });
    petWindow.addEventListener('modelLoaded', () => {
        state.modelReady = true;
        state.chatReady = true;
        setModelStatus('角色已就绪', 'ready');
        applyRenderProfileToPet();
        syncPetSnapshot();
        updateComposer();
    });
    petWindow.addEventListener('modelLoadError', () => {
        state.modelReady = false;
        state.chatReady = false;
        setModelStatus('角色加载失败', 'error');
        elements.composerStatus.textContent = '角色资源没有成功载入，请刷新后重试';
        updateComposer();
    });

    [250, 900, 1800, 3500].forEach((delay) => {
        window.setTimeout(syncPetSnapshot, delay);
    });
}

async function checkBackend() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setBackendStatus('唤醒服务', 'checking');

    try {
        const response = await fetch(`${backendBaseUrl}/healthz`, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const payload = await response.json().catch(() => null);
        if (payload?.status !== 'ok') {
            throw new Error('unexpected health response');
        }
        setBackendStatus('在线服务', 'online');
    } catch {
        setBackendStatus('离线陪伴', 'offline');
    } finally {
        window.clearTimeout(timeout);
    }
}

async function sendPrompt(content) {
    const text = String(content || '').trim();
    const petWindow = getPetWindow();
    if (!text || state.busy || !petWindow?.chatSystem?.sendExternalMessage) {
        updateComposer();
        return;
    }

    elements.chatInput.value = '';
    state.followLatestMessage = true;
    resizeInput();
    updateComposer();
    applyTtsVoiceToPet();
    scrollMessages({ force: true });

    try {
        await petWindow.audioPlayer?.unlock?.();
        await petWindow.chatSystem.sendExternalMessage(text);
        syncPetSnapshot();
    } catch (error) {
        const id = `local-error-${Date.now()}`;
        upsertMessage({
            id,
            role: 'system',
            content: `这次没有连接成功：${error?.message || '请稍后再试'}`
        });
    } finally {
        updateComposer();
    }
}

function configurePetFrame() {
    const petUrl = new URL('../pet.html', window.location.href);
    petUrl.searchParams.set('backend', backendBaseUrl);
    const useCloudVoice = state.ttsVoiceId === CLOUD_TTS_VOICE_ID;
    petUrl.searchParams.set('speechMode', useCloudVoice ? 'server' : 'native');
    if (!useCloudVoice) {
        petUrl.searchParams.set('ttsVoice', state.ttsVoiceId);
    }
    petUrl.searchParams.set('web', '1');
    petUrl.searchParams.set('camera', 'close');
    petUrl.searchParams.set('renderProfile', state.renderProfileId);
    petUrl.searchParams.set('assetVersion', WEB_ASSET_VERSION);
    elements.petFrame.src = petUrl.href;
}

elements.petFrame.addEventListener('load', attachPetWindow);
elements.messageList.addEventListener('scroll', () => {
    state.followLatestMessage = isMessageListNearBottom();
}, { passive: true });
elements.chatInput.addEventListener('input', () => {
    resizeInput();
    updateComposer();
});
elements.chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        elements.composer.requestSubmit();
    }
});
elements.composer.addEventListener('submit', (event) => {
    event.preventDefault();
    void sendPrompt(elements.chatInput.value);
});
elements.quickButtons.forEach((button) => {
    button.addEventListener('click', () => {
        void sendPrompt(button.dataset.prompt);
    });
});
elements.sceneButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setScene(button.dataset.sceneOption);
    });
});
elements.renderButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setRenderProfile(button.dataset.renderProfile);
    });
});
elements.voiceSelect.addEventListener('change', () => {
    setTtsVoice(elements.voiceSelect.value);
});
window.speechSynthesis?.addEventListener?.('voiceschanged', renderVoiceOptions);
elements.historyToggle.addEventListener('click', () => {
    setHistoryOpen(!state.historyOpen);
});
elements.historyClose.addEventListener('click', () => {
    setHistoryOpen(false);
    elements.historyToggle.focus();
});
elements.historyBackdrop.addEventListener('click', () => {
    setHistoryOpen(false);
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.historyOpen) {
        setHistoryOpen(false);
        elements.historyToggle.focus();
    }
});

restoreScene();
restoreRenderProfile();
restoreTtsVoice();
setHistoryOpen(false);
preloadWebModel();
configurePetFrame();
void checkBackend();
resizeInput();
updateComposer();
