import { setMarkdownContent, setPlainTextContent } from '../src/markdown-renderer.js';
import {
    createBrowserSpeechRecognition,
    mergeSpeechTranscript
} from '../src/browser-speech-recognition.js';

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
const TTS_ENABLED_STORAGE_KEY = 'ailis.web.tts-enabled.v1';
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
    fileInput: document.getElementById('file-input'),
    attachButton: document.getElementById('attach-button'),
    voiceInputButton: document.getElementById('voice-input-button'),
    attachmentPreview: document.getElementById('attachment-preview'),
    sendButton: document.getElementById('send-button'),
    ttsEnabledToggle: document.getElementById('tts-enabled-toggle'),
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
    ttsEnabled: true,
    followLatestMessage: true,
    uploadingAttachments: false,
    pendingAttachments: [],
    voiceInputState: 'idle',
    voiceInputStatus: '',
    voiceDraftBase: '',
    voiceFinalTranscript: '',
    fileDragDepth: 0,
    scrollFrame: 0,
    messagesById: new Map(),
    messageOrder: [],
    systemNoticeTimer: 0,
    systemNoticeHideTimer: 0
};

const MESSAGE_BOTTOM_THRESHOLD = 72;

const browserSpeechRecognition = createBrowserSpeechRecognition({
    globalScope: window,
    language: 'zh-CN',
    onStateChange: ({ state: recognitionState }) => {
        state.voiceInputState = recognitionState;
        if (recognitionState === 'starting') {
            state.voiceInputStatus = '正在请求麦克风权限';
        } else if (recognitionState === 'listening') {
            state.voiceInputStatus = '正在听你说话，再点一次结束';
        } else if (recognitionState === 'processing') {
            state.voiceInputStatus = '正在整理识别结果';
        } else if (!state.voiceFinalTranscript) {
            state.voiceInputStatus = '';
        }
        updateComposer();
    },
    onInterimResult: ({ transcript }) => {
        elements.chatInput.value = mergeSpeechTranscript(
            state.voiceDraftBase,
            mergeSpeechTranscript(state.voiceFinalTranscript, transcript)
        );
        resizeInput();
        updateComposer();
    },
    onFinalResult: ({ transcript }) => {
        state.voiceFinalTranscript = mergeSpeechTranscript(state.voiceFinalTranscript, transcript);
        elements.chatInput.value = mergeSpeechTranscript(state.voiceDraftBase, state.voiceFinalTranscript);
        state.voiceInputStatus = '已识别，可以修改后发送';
        resizeInput();
        updateComposer();
        elements.chatInput.focus();
    },
    onError: ({ message }) => {
        state.voiceInputStatus = '';
        if (message) {
            showSystemNotice({ level: 'warning', message });
        }
        updateComposer();
    }
});

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

function applyTtsSettingToPet() {
    const petWindow = getPetWindow();
    if (typeof petWindow?.setAilisSpeechVoice !== 'function') {
        return false;
    }
    petWindow.setAilisSpeechVoice({
        speechMode: state.ttsEnabled ? 'server' : 'off'
    });
    return true;
}

function setTtsEnabled(enabled, { persist = true, apply = true } = {}) {
    state.ttsEnabled = Boolean(enabled);
    elements.ttsEnabledToggle.checked = state.ttsEnabled;
    elements.ttsEnabledToggle.setAttribute(
        'aria-label',
        state.ttsEnabled ? '关闭 AILIS 远端语音' : '开启 AILIS 远端语音'
    );
    if (persist) {
        try {
            window.localStorage?.setItem(TTS_ENABLED_STORAGE_KEY, String(state.ttsEnabled));
        } catch {
            // The selected speech state remains active for this page session.
        }
    }
    if (apply) {
        applyTtsSettingToPet();
    }
}

function restoreTtsEnabled() {
    try {
        setTtsEnabled(window.localStorage?.getItem(TTS_ENABLED_STORAGE_KEY) !== 'false', {
            persist: false,
            apply: false
        });
    } catch {
        setTtsEnabled(true, { persist: false, apply: false });
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
    const voiceInputActive = ['starting', 'listening', 'processing'].includes(state.voiceInputState);
    const ready = state.chatReady && !state.busy && !state.uploadingAttachments && !voiceInputActive;
    const hasDraft = elements.chatInput.value.trim().length > 0 || state.pendingAttachments.length > 0;
    const canSend = ready && hasDraft;
    elements.sendButton.disabled = !canSend;
    elements.attachButton.disabled = !ready;
    elements.voiceInputButton.disabled = !browserSpeechRecognition.supported ||
        state.busy ||
        state.uploadingAttachments ||
        (!state.chatReady && !voiceInputActive);
    elements.voiceInputButton.dataset.state = state.voiceInputState;
    elements.voiceInputButton.setAttribute('aria-pressed', String(voiceInputActive));
    elements.voiceInputButton.setAttribute(
        'aria-label',
        voiceInputActive ? '结束语音输入' : '语音输入'
    );
    elements.voiceInputButton.title = browserSpeechRecognition.supported
        ? (voiceInputActive ? '结束语音输入' : '语音输入')
        : '当前浏览器不支持语音输入，请使用最新版 Chrome 或 Edge';
    elements.quickButtons.forEach((button) => {
        button.disabled = !ready;
    });
    elements.messageList.setAttribute('aria-busy', String(state.busy));
    elements.dialogueContent.setAttribute('aria-busy', String(state.busy));

    if (state.voiceInputStatus) {
        elements.composerStatus.textContent = state.voiceInputStatus;
    } else if (state.uploadingAttachments) {
        elements.composerStatus.textContent = '正在上传附件';
    } else if (state.busy) {
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

function toggleBrowserVoiceInput() {
    if (!browserSpeechRecognition.supported) {
        showSystemNotice({
            level: 'warning',
            message: '当前浏览器不支持语音输入，请使用最新版 Chrome 或 Edge。'
        });
        return;
    }
    if (['starting', 'listening', 'processing'].includes(state.voiceInputState)) {
        browserSpeechRecognition.stop();
        return;
    }

    state.voiceDraftBase = elements.chatInput.value;
    state.voiceFinalTranscript = '';
    state.voiceInputStatus = '正在请求麦克风权限';
    browserSpeechRecognition.start();
    updateComposer();
}

function formatAttachmentBytes(bytes) {
    const size = Math.max(0, Number(bytes) || 0);
    if (size < 1024) {
        return `${size} B`;
    }
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function renderAttachmentPreview() {
    elements.attachmentPreview.replaceChildren();
    elements.attachmentPreview.hidden = state.pendingAttachments.length === 0;
    for (const attachment of state.pendingAttachments) {
        const card = document.createElement('div');
        card.className = 'attachment-card';

        const icon = document.createElement('span');
        icon.className = 'attachment-icon';
        icon.textContent = (attachment.extension || '').replace(/^\./, '').slice(0, 4).toUpperCase() || 'FILE';

        const copy = document.createElement('span');
        copy.className = 'attachment-copy';
        const name = document.createElement('strong');
        name.textContent = attachment.name || attachment.label || '附件';
        const meta = document.createElement('small');
        meta.textContent = formatAttachmentBytes(attachment.size);
        copy.append(name, meta);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'attachment-remove';
        remove.textContent = '×';
        remove.setAttribute('aria-label', `移除 ${name.textContent}`);
        remove.addEventListener('click', () => {
            state.pendingAttachments = state.pendingAttachments.filter((item) => item.id !== attachment.id);
            renderAttachmentPreview();
            updateComposer();
        });
        card.append(icon, copy, remove);
        elements.attachmentPreview.appendChild(card);
    }
}

async function addBrowserFiles(fileList) {
    const availableSlots = Math.max(0, 12 - state.pendingAttachments.length);
    const files = Array.from(fileList || []).filter((file) => file?.size > 0).slice(0, availableSlots);
    if (!files.length || state.busy || state.uploadingAttachments) {
        return;
    }
    const gateway = getPetWindow()?.chatService?.gateway;
    if (typeof gateway?.uploadAttachment !== 'function') {
        showSystemNotice({
            level: 'error',
            message: '网页版附件服务尚未就绪，请刷新页面后重试。'
        });
        return;
    }

    state.uploadingAttachments = true;
    updateComposer();
    const results = await Promise.allSettled(
        files.map((file) => gateway.uploadAttachment(file, { sessionId: 'main' }))
    );
    const uploaded = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
    const byId = new Map(state.pendingAttachments.map((attachment) => [attachment.id, attachment]));
    uploaded.forEach((attachment) => byId.set(attachment.id, attachment));
    state.pendingAttachments = [...byId.values()].slice(0, 12);
    state.uploadingAttachments = false;
    renderAttachmentPreview();
    updateComposer();

    const failed = results.filter((result) => result.status === 'rejected');
    if (failed.length) {
        showSystemNotice({
            level: 'error',
            message: failed.length === results.length
                ? `附件上传失败：${failed[0].reason?.message || '请稍后重试'}`
                : `${uploaded.length} 个附件已上传，${failed.length} 个上传失败。`
        });
    } else {
        showSystemNotice({
            level: 'success',
            durationMs: 3500,
            message: `已添加 ${uploaded.length} 个附件，可以直接让 AILIS 阅读。`
        });
    }
}

function ensureSystemNoticeElement() {
    let notice = document.getElementById('system-notice');
    if (notice) {
        return notice;
    }
    notice = document.createElement('div');
    notice.id = 'system-notice';
    notice.className = 'system-notice';
    notice.dataset.visible = 'false';
    notice.dataset.level = 'info';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');

    const indicator = document.createElement('span');
    indicator.className = 'system-notice-indicator';
    indicator.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'system-notice-text';

    const close = document.createElement('button');
    close.className = 'system-notice-close';
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', '关闭系统提醒');
    close.addEventListener('click', () => hideSystemNotice());

    notice.append(indicator, text, close);
    document.body.appendChild(notice);
    return notice;
}

function hideSystemNotice() {
    const notice = document.getElementById('system-notice');
    if (!notice) {
        return;
    }
    window.clearTimeout(state.systemNoticeTimer);
    window.clearTimeout(state.systemNoticeHideTimer);
    state.systemNoticeTimer = 0;
    notice.dataset.visible = 'false';
    state.systemNoticeHideTimer = window.setTimeout(() => {
        notice.hidden = true;
        state.systemNoticeHideTimer = 0;
    }, 180);
}

function showSystemNotice(payload = {}) {
    const message = String(payload.message || '').trim();
    if (!message) {
        return;
    }
    const notice = ensureSystemNoticeElement();
    const level = ['info', 'success', 'warning', 'error'].includes(payload.level)
        ? payload.level
        : 'info';
    const durationMs = Math.max(2500, Number(payload.durationMs) || 8000);
    window.clearTimeout(state.systemNoticeTimer);
    window.clearTimeout(state.systemNoticeHideTimer);
    state.systemNoticeHideTimer = 0;
    notice.hidden = false;
    notice.dataset.level = level;
    notice.querySelector('.system-notice-text').textContent = message;
    notice.title = message;
    window.requestAnimationFrame(() => {
        notice.dataset.visible = 'true';
    });
    state.systemNoticeTimer = window.setTimeout(() => hideSystemNotice(), durationMs);
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
    if (payload.type === 'system-notice') {
        showSystemNotice(payload.notice || {});
        return;
    }

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
    const attachments = [...state.pendingAttachments];
    const petWindow = getPetWindow();
    if ((!text && !attachments.length) || state.busy || state.uploadingAttachments || !petWindow?.chatSystem?.sendExternalMessage) {
        updateComposer();
        return;
    }

    elements.chatInput.value = '';
    state.voiceInputStatus = '';
    state.voiceDraftBase = '';
    state.voiceFinalTranscript = '';
    state.followLatestMessage = true;
    resizeInput();
    updateComposer();
    applyTtsSettingToPet();
    scrollMessages({ force: true });

    try {
        await petWindow.audioPlayer?.unlock?.();
        const sendPromise = petWindow.chatSystem.sendExternalMessage(text, { attachments });
        state.pendingAttachments = [];
        renderAttachmentPreview();
        updateComposer();
        await sendPromise;
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
    petUrl.searchParams.set('speechMode', state.ttsEnabled ? 'server' : 'off');
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
    if (!elements.chatInput.value.trim() && state.voiceInputState === 'idle') {
        state.voiceInputStatus = '';
        state.voiceDraftBase = '';
        state.voiceFinalTranscript = '';
    }
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
elements.attachButton.addEventListener('click', () => {
    if (!elements.attachButton.disabled) {
        elements.fileInput.click();
    }
});
elements.fileInput.addEventListener('change', () => {
    const files = elements.fileInput.files;
    elements.fileInput.value = '';
    void addBrowserFiles(files);
});
window.addEventListener('dragenter', (event) => {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) {
        return;
    }
    event.preventDefault();
    state.fileDragDepth += 1;
    elements.experience.dataset.draggingFiles = 'true';
});
window.addEventListener('dragover', (event) => {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) {
        return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});
window.addEventListener('dragleave', (event) => {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) {
        return;
    }
    event.preventDefault();
    state.fileDragDepth = Math.max(0, state.fileDragDepth - 1);
    if (!state.fileDragDepth) {
        elements.experience.dataset.draggingFiles = 'false';
    }
});
window.addEventListener('drop', (event) => {
    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) {
        return;
    }
    event.preventDefault();
    state.fileDragDepth = 0;
    elements.experience.dataset.draggingFiles = 'false';
    void addBrowserFiles(event.dataTransfer?.files);
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
elements.ttsEnabledToggle.addEventListener('change', () => {
    setTtsEnabled(elements.ttsEnabledToggle.checked);
});
elements.voiceInputButton.addEventListener('click', toggleBrowserVoiceInput);
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
window.addEventListener('pagehide', () => {
    browserSpeechRecognition.cancel();
});

restoreScene();
restoreRenderProfile();
restoreTtsEnabled();
setHistoryOpen(false);
preloadWebModel();
configurePetFrame();
void checkBackend();
resizeInput();
updateComposer();
