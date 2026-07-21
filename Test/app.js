const CLOUD_BACKEND_BASE_URL = 'https://101.133.239.56';
const DEFAULT_BACKEND_BASE_URL = window.location.hostname.toLowerCase() === 'haowenguo.github.io'
    ? CLOUD_BACKEND_BASE_URL
    : ['http:', 'https:'].includes(window.location.protocol)
        ? window.location.origin
        : CLOUD_BACKEND_BASE_URL;
const PET_CHAT_EVENT_NAME = 'ailis-chat-ui-event';
const AILIS_AVATAR_URL = new URL('../Resources/Emotes/ailis-small/wave.png', window.location.href).href;

const elements = {
    petFrame: document.getElementById('pet-frame'),
    modelStatus: document.getElementById('model-status'),
    modelStatusText: document.getElementById('model-status-text'),
    backendStatus: document.getElementById('backend-status'),
    backendStatusText: document.getElementById('backend-status-text'),
    composerStatus: document.getElementById('composer-status'),
    messageList: document.getElementById('message-list'),
    composer: document.getElementById('composer'),
    chatInput: document.getElementById('chat-input'),
    sendButton: document.getElementById('send-button'),
    quickButtons: Array.from(document.querySelectorAll('[data-prompt]'))
};

const state = {
    attachedWindow: null,
    backendState: 'checking',
    modelReady: false,
    chatReady: false,
    busy: false
};

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
    elements.messageList.setAttribute('aria-busy', String(state.busy));

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
    row.appendChild(bubble);
    return row;
}

function scrollMessages() {
    elements.messageList.scrollTop = elements.messageList.scrollHeight;
}

function upsertMessage(message) {
    if (!message?.id) {
        return;
    }

    clearLocalMessage();
    const escapedId = CSS.escape(String(message.id));
    let row = elements.messageList.querySelector(`[data-message-id="${escapedId}"]`);
    const nextRole = ['user', 'assistant', 'system', 'loading'].includes(message.role)
        ? message.role
        : 'system';

    if (!row || row.dataset.role !== nextRole) {
        const replacement = createMessageRow({ ...message, role: nextRole });
        if (row) {
            row.replaceWith(replacement);
        } else {
            elements.messageList.appendChild(replacement);
        }
        row = replacement;
    }

    const bubble = row.querySelector('.message');
    bubble.textContent = message.content || (nextRole === 'loading' ? 'AILIS 正在想' : '');
    scrollMessages();
}

function removeMessage(id) {
    if (!id) {
        return;
    }
    const escapedId = CSS.escape(String(id));
    elements.messageList.querySelector(`[data-message-id="${escapedId}"]`)?.remove();
    scrollMessages();
}

function renderSnapshot(messages) {
    elements.messageList.innerHTML = '';
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
    resizeInput();
    updateComposer();

    try {
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
    petUrl.searchParams.set('speechMode', 'off');
    petUrl.searchParams.set('web', '1');
    elements.petFrame.src = petUrl.href;
}

elements.petFrame.addEventListener('load', attachPetWindow);
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

configurePetFrame();
void checkBackend();
resizeInput();
updateComposer();
