import { CONFIG } from './config.js';
import {
    buildAttachmentHint,
    getDefaultMessageForAttachments,
    normalizeChatAttachments
} from './chat-attachments.js';
import { markdownToPlainText, setMarkdownContent, setPlainTextContent } from './markdown-renderer.js';
import { AVATAR_SPEECH_EVENT_NAME } from './avatar-dialogue-bubble.js';
import { deriveTtsSpeechText, normalizeTtsSpeechText } from './tts-speech-text.js';
import { t } from './i18n.js';
import { ProactiveCompanionManager } from './proactive-companion-manager.js';

const CHAT_UI_EVENT_NAME = 'ailis-chat-ui-event';
const CHAT_EXPRESSIVE_GESTURE_INTENTS = new Set([
    'greeting',
    'farewell',
    'success',
    'celebrate',
    'surprised',
    'dance'
]);

function getPayloadSurface(payload = {}) {
    return payload.surface ||
        payload.personaSurface ||
        payload.persona_surface ||
        payload.personaOutput ||
        payload.persona_output ||
        null;
}

function normalizeCueValue(value) {
    return String(value || '').trim().toLowerCase().replace(/[-\s]+/g, '_');
}

function shouldAllowChatMotion(payload = {}) {
    const surface = getPayloadSurface(payload) || {};
    const gestureIntent = normalizeCueValue(
        surface.gestureIntent ||
            surface.gesture_intent ||
            payload.gestureIntent ||
            payload.gesture_intent
    );
    const action = normalizeCueValue(surface.action || payload.action);

    return Boolean(action) ||
        CHAT_EXPRESSIVE_GESTURE_INTENTS.has(gestureIntent) ||
        payload.desktopLlmMode === true ||
        payload.demoMode === true;
}

function normalizeVisionAttachments(attachments = []) {
    if (!Array.isArray(attachments)) {
        return [];
    }

    return attachments
        .filter((attachment) => {
            if (!attachment?.dataUrl) {
                return false;
            }
            if (attachment.type && attachment.type !== 'vision') {
                return false;
            }
            return String(attachment.mimeType || 'image/png').startsWith('image/');
        })
        .map((attachment) => ({
            type: 'vision',
            id: String(attachment.id || ''),
            source: String(attachment.source || ''),
            label: String(attachment.label || '截图'),
            dataUrl: String(attachment.dataUrl || ''),
            thumbnailDataUrl: String(attachment.thumbnailDataUrl || attachment.dataUrl || ''),
            mimeType: String(attachment.mimeType || 'image/png'),
            width: Number(attachment.width) || 0,
            height: Number(attachment.height) || 0,
            createdAt: String(attachment.createdAt || '')
        }))
        .slice(0, 3);
}

function appendAttachmentHint(content, attachments = []) {
    if (!attachments.length) {
        return content;
    }

    const labels = attachments.map((attachment) => attachment.label || '截图').join('、');
    return `${content}\n\n[附带视觉上下文：${labels}]`;
}

export class ChatTTSSystem {
    constructor(vrmSystem, audioPlayer, chatService, { speechProvider = null, chunkedTtsEnabled = true } = {}) {
        this.vrmSystem = vrmSystem;
        this.audioPlayer = audioPlayer;
        this.chatService = chatService;
        this.speechProvider = speechProvider;
        this.chunkedTtsEnabled = chunkedTtsEnabled !== false;

        this.messageListEl = document.getElementById('message-list');
        this.inputEl = document.getElementById('message-input');
        this.sendBtnEl = document.getElementById('send-btn');
        this.sessionId = this.getOrCreateSessionId();
        this.messageHistory = [];
        this.historyRestored = false;

        this.isBusy = false;
        this.autoChatTimer = null;
        this.hasShownAutoplayHint = false;
        this.hasShownTextFallbackHint = false;
        this.hasShownSpeechProviderHint = false;
        this.messageCounter = 0;
        this.turnCounter = 0;
        this.interruptRequested = false;
        this.interruptInFlight = false;
        this.activeChunkedSpeechSession = null;
        this.activeTurn = null;
        this.cancelledTurnIds = new Set();
        this.backgroundMessageIds = new Set();
        this.backgroundMessageChain = Promise.resolve();
        this.backgroundMessageUnsubscribe = null;
        this.lastAutoChatMode = String(CONFIG.AUTO_CHAT_MODE || 'off');
        this.proactiveCompanion = new ProactiveCompanionManager({
            getConfig: () => CONFIG,
            getChatState: () => this.getProactiveChatState(),
            requestCompanionTurn: (payload) => this.chatService?.createProactiveCompanionTurn?.({
                sessionId: this.sessionId,
                messageHistory: this.createMessageHistorySnapshot(),
                ...payload
            }),
            requestOpportunity: (payload) => this.chatService?.evaluateProactiveOpportunity?.({
                sessionId: this.sessionId,
                messageHistory: this.createMessageHistorySnapshot(),
                ...payload
            }),
            onSpeak: (decision) => this.triggerAutoChat(decision)
        });
        this.historyReady = this.restorePersistedConversation();
        this.bindBackgroundAssistantMessages();

        this.inputEl.disabled = true;
        this.sendBtnEl.disabled = true;

        this.bindEvents();
        this.installAudioUnlockHandlers();
        this.emitChatUiEvent({ type: 'state', isBusy: this.isBusy });
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = `user_${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    getBrowserHistoryStorageKey() {
        return `ailis_chat_history:${this.sessionId}`;
    }

    loadBrowserHistory() {
        try {
            const rawValue = window.localStorage?.getItem(this.getBrowserHistoryStorageKey());
            const parsed = rawValue ? JSON.parse(rawValue) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('恢复浏览器对话历史失败：', error);
            return [];
        }
    }

    saveBrowserHistory() {
        try {
            const messages = this.createMessageHistorySnapshot()
                .filter((message) => message?.role === 'user' || message?.role === 'assistant')
                .slice(-40);
            window.localStorage?.setItem(
                this.getBrowserHistoryStorageKey(),
                JSON.stringify(messages)
            );
            return { ok: true, messageCount: messages.length };
        } catch (error) {
            console.warn('保存浏览器对话历史失败：', error);
            return { ok: false, error: error?.message || String(error) };
        }
    }

    bindEvents() {
        this.sendBtnEl.addEventListener('click', () => this.sendMessage());
        this.inputEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });

        window.addEventListener('modelLoaded', async () => {
            await this.historyReady;
            const welcomeMessage = this.chatService?.getWelcomeMessage?.() ||
                'AILIS到啦！现在可以聊天啦~';
            if (!this.messageHistory.length) {
                this.addSystemMessage(t(welcomeMessage));
            }
            this.inputEl.disabled = false;
            this.sendBtnEl.disabled = false;
            this.startAutoChatTimer('startup');
            this.emitChatUiEvent({ type: 'state', isBusy: this.isBusy });
        });
    }

    installAudioUnlockHandlers() {
        const unlockAudio = async () => {
            try {
                await this.audioPlayer.unlock();
            } catch (error) {
                console.warn('⚠️ 提前解锁音频失败：', error);
            }
        };

        window.addEventListener('pointerdown', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });
    }

    startAutoChatTimer(reason = 'idle', delayMs = undefined) {
        const supportsCompanion = typeof this.chatService?.createProactiveCompanionTurn === 'function';
        const supportsWorkFeedback = typeof this.chatService?.evaluateProactiveOpportunity === 'function';
        if (this.chatService?.supportsAutoChat === false || (!supportsCompanion && !supportsWorkFeedback)) {
            console.log('⏸️ 当前聊天后端不支持主动搭话');
            return;
        }
        this.proactiveCompanion.start(reason, delayMs);
    }

    getProactiveChatState() {
        return {
            isBusy: this.isBusy,
            userTyping: Boolean(this.inputEl?.value?.trim()),
            inputDisabled: Boolean(this.inputEl?.disabled),
            voicePlaying: Boolean(this.activeChunkedSpeechSession),
            messageHistory: this.messageHistory
        };
    }

    applyRuntimePreferences(preferences = {}) {
        const nextAutoChatMode = String(CONFIG.AUTO_CHAT_MODE || 'off');
        const autoChatModeChanged = nextAutoChatMode !== this.lastAutoChatMode;
        this.lastAutoChatMode = nextAutoChatMode;

        if ('chunkedTtsEnabled' in preferences) {
            this.chunkedTtsEnabled = preferences.chunkedTtsEnabled !== false;
            if (!this.chunkedTtsEnabled) {
                this.stopLingeringSpeech('chunked-tts-disabled');
            }
        }

        if (preferences.speechMode === 'off' || this.speechProvider?.isSpeechDisabled) {
            this.stopLingeringSpeech('speech-disabled');
            this.vrmSystem.stopSpeaking();
        }

        if (this.inputEl.disabled) {
            return;
        }

        if (autoChatModeChanged) {
            this.startAutoChatTimer(
                'mode_changed',
                CONFIG.AUTO_CHAT_ENABLED ? CONFIG.AUTO_CHAT_MIN_INTERVAL : undefined
            );
        } else if (CONFIG.AUTO_CHAT_ENABLED && !this.proactiveCompanion.timer) {
            this.startAutoChatTimer('preferences_updated');
        }
    }

    createMessageId(role = 'message') {
        this.messageCounter += 1;
        return `${role}-${Date.now()}-${this.messageCounter}`;
    }

    createTurnState(kind = 'chat') {
        this.turnCounter += 1;
        const turn = {
            id: `${kind}-${Date.now()}-${this.turnCounter}`,
            kind,
            loadingEl: null,
            aiMessageDiv: null,
            chunkedSpeechSession: null
        };
        this.activeTurn = turn;
        return turn;
    }

    isTurnCancelled(turn) {
        return Boolean(turn?.id && this.cancelledTurnIds.has(turn.id));
    }

    isTurnActive(turn) {
        return Boolean(turn?.id && this.activeTurn?.id === turn.id && !this.isTurnCancelled(turn));
    }

    createMessageHistorySnapshot() {
        return this.messageHistory.map((message) => ({
            ...message,
            attachments: Array.isArray(message.attachments)
                ? message.attachments.map((attachment) => ({ ...attachment }))
                : message.attachments
        }));
    }

    async restorePersistedConversation() {
        try {
            const desktopHistoryAvailable = typeof window.ailisDesktop?.chatHistory?.load === 'function';
            const result = desktopHistoryAvailable
                ? await window.ailisDesktop.chatHistory.load({ sessionId: this.sessionId })
                : null;
            const messages = desktopHistoryAvailable
                ? (Array.isArray(result?.messages) ? result.messages : [])
                : this.loadBrowserHistory();
            this.messageHistory = messages
                .filter((message) => message?.role === 'user' || message?.role === 'assistant')
                .map((message) => ({
                    role: message.role,
                    content: String(message.content || ''),
                    attachments: normalizeChatAttachments(message.attachments),
                    source: String(message.source || ''),
                    createdAt: String(message.createdAt || '')
                }))
                .filter((message) => message.content);
            for (const message of this.messageHistory) {
                if (message.role === 'user') {
                    this.addUserMessage(message.content, message.attachments);
                    continue;
                }
                const element = this.createAIMessage();
                this.updateMessageContent(element, message.content);
            }
            this.historyRestored = true;
            this.emitChatUiEvent({
                type: 'snapshot',
                messages: this.getTranscriptSnapshot(),
                isBusy: this.isBusy
            });
            return { ok: true, messageCount: this.messageHistory.length };
        } catch (error) {
            this.historyRestored = true;
            console.warn('恢复桌面对话历史失败：', error);
            return { ok: false, error: error?.message || String(error) };
        }
    }

    async persistConversation() {
        try {
            if (typeof window.ailisDesktop?.chatHistory?.save === 'function') {
                return await window.ailisDesktop.chatHistory.save({
                    sessionId: this.sessionId,
                    messages: this.createMessageHistorySnapshot()
                });
            }
            return this.saveBrowserHistory();
        } catch (error) {
            console.warn('保存桌面对话历史失败：', error);
            return { ok: false, error: error?.message || String(error) };
        }
    }

    markTurnCancelled(turn) {
        if (turn?.id) {
            this.cancelledTurnIds.add(turn.id);
        }
    }

    releaseTurn(turn) {
        if (this.activeTurn?.id === turn?.id) {
            this.activeTurn = null;
        }
        if (turn?.id) {
            this.cancelledTurnIds.delete(turn.id);
        }
    }

    ensureMessageIdentity(element, role) {
        if (!element.dataset.messageId) {
            element.dataset.messageId = this.createMessageId(role);
        }
        if (role) {
            element.dataset.messageRole = role;
        }
        return element.dataset.messageId;
    }

    inferMessageRole(element) {
        if (element.dataset.messageRole) {
            return element.dataset.messageRole;
        }
        if (element.classList.contains('message-user')) {
            return 'user';
        }
        if (element.classList.contains('message-ai')) {
            return 'assistant';
        }
        if (element.classList.contains('message-system')) {
            return 'system';
        }
        if (element.classList.contains('message-loading')) {
            return 'loading';
        }
        return 'system';
    }

    serializeMessageElement(element) {
        const role = this.inferMessageRole(element);
        return {
            id: this.ensureMessageIdentity(element, role),
            role,
            content: element.__ailisMessageContent ?? element.textContent ?? '',
            contentFormat: element.dataset.contentFormat || 'markdown',
            attachments: element.__ailisAttachments || [],
            pending: role === 'loading'
        };
    }

    emitChatUiEvent(payload) {
        window.dispatchEvent(new CustomEvent(CHAT_UI_EVENT_NAME, { detail: payload }));
    }

    showSystemNotice(content, options = {}) {
        const message = String(content || '').trim();
        if (!message) {
            return;
        }
        this.emitChatUiEvent({
            type: 'system-notice',
            notice: {
                id: `system-notice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                message,
                level: options.level || 'warning',
                source: options.source || 'runtime',
                code: options.code || '',
                durationMs: Math.max(2500, Number(options.durationMs) || 8000)
            }
        });
    }

    emitAvatarSpeechEvent(payload) {
        window.dispatchEvent(new CustomEvent(AVATAR_SPEECH_EVENT_NAME, { detail: payload }));
    }

    getAvatarSpeechText(payload, displayText) {
        const source = deriveTtsSpeechText(payload, displayText);
        return markdownToPlainText(source)
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    startAvatarSpeech(payload, displayText, aiMessageDiv) {
        const text = this.getAvatarSpeechText(payload, displayText);
        if (!text) {
            return;
        }

        this.emitAvatarSpeechEvent({
            phase: 'start',
            id: aiMessageDiv?.dataset?.messageId || '',
            text
        });
    }

    endAvatarSpeech(aiMessageDiv) {
        this.emitAvatarSpeechEvent({
            phase: 'end',
            id: aiMessageDiv?.dataset?.messageId || ''
        });
    }

    createChunkedSpeechSession(aiMessageDiv) {
        if (!this.chunkedTtsEnabled) {
            return null;
        }

        if (this.speechProvider?.isSpeechDisabled || typeof this.speechProvider?.createChunkedSession !== 'function') {
            return null;
        }

        let avatarSpeechStarted = false;
        const session = this.speechProvider.createChunkedSession({
            audioPlayer: this.audioPlayer,
            vrmSystem: this.vrmSystem,
            onPlaybackStart: (item) => {
                if (avatarSpeechStarted) {
                    return;
                }
                avatarSpeechStarted = true;
                this.emitAvatarSpeechEvent({
                    phase: 'start',
                    id: aiMessageDiv?.dataset?.messageId || '',
                    text: item?.text || aiMessageDiv?.__ailisMessageContent || ''
                });
            },
            onPlaybackEnd: () => {
                if (avatarSpeechStarted) {
                    this.endAvatarSpeech(aiMessageDiv);
                }
            },
            onError: (error, context) => {
                console.warn('[chunked-tts] 分段语音失败：', context, error);
            }
        });

        if (session) {
            this.activeChunkedSpeechSession = session;
        }

        return session;
    }

    appendChunkedSpeechProgress(session, payload) {
        if (!session || !payload) {
            return;
        }
        const deltaText = normalizeTtsSpeechText(payload.stream_delta_speech_text || '');
        if (deltaText) {
            session.appendText(deltaText);
        }
    }

    async finishChunkedSpeechSession(session, fallbackText = '') {
        if (!session) {
            return false;
        }
        if (!session.hasActivity() && fallbackText) {
            session.appendText(fallbackText);
        }
        session.finish();
        if (!session.hasActivity()) {
            return false;
        }
        if (typeof session.waitUntilPlaybackStartedOrDone === 'function') {
            const started = await session.waitUntilPlaybackStartedOrDone();
            return Boolean(started || session.hasPlaybackStarted?.());
        }
        await session.waitUntilDone();
        return typeof session.hasPlaybackStarted === 'function' ? session.hasPlaybackStarted() : true;
    }

    startCommittedBubbleSpeech(payload, aiMessageDiv, session = null) {
        const displayText = payload.display_text || payload.speech_text || '...';
        const bubbleSpeechText = deriveTtsSpeechText({}, displayText);
        const speechPayload = {
            ...payload,
            speech_text: bubbleSpeechText,
            speechText: bubbleSpeechText
        };
        const alignment = payload.normalized_alignment || payload.alignment || null;
        const playbackGeneration = Number(this.speechPlaybackGeneration) || 0;
        const isCurrentPlayback = () => playbackGeneration === (Number(this.speechPlaybackGeneration) || 0);

        const playbackTask = (async () => {
            const usedChunkedSpeech = await this.finishChunkedSpeechSession(
                session,
                bubbleSpeechText
            );
            if (!isCurrentPlayback()) {
                return;
            }
            if (usedChunkedSpeech) {
                this.executeAvatarCue(speechPayload, aiMessageDiv);
                return;
            }
            await this.playPreferredSpeech({
                payload: speechPayload,
                displayText,
                alignment,
                aiMessageDiv,
                preserveMessageContent: true
            });
        })();

        void playbackTask.catch((error) => {
            if (isCurrentPlayback()) {
                console.warn('已提交气泡的后台语音播放失败：', error);
            }
        });
        return playbackTask;
    }

    clearChunkedSpeechSession(session) {
        if (this.activeChunkedSpeechSession === session) {
            this.activeChunkedSpeechSession = null;
        }
    }

    releaseChunkedSpeechSessionWhenDone(session) {
        if (!session) {
            return;
        }
        if (typeof session.waitUntilDone !== 'function') {
            this.clearChunkedSpeechSession(session);
            return;
        }
        void session.waitUntilDone()
            .catch(() => {})
            .finally(() => this.clearChunkedSpeechSession(session));
    }

    stopLingeringSpeech(reason = 'new-turn') {
        this.speechPlaybackGeneration = (Number(this.speechPlaybackGeneration) || 0) + 1;
        const session = this.activeChunkedSpeechSession;
        if (session) {
            Promise.resolve(session.cancel?.(reason)).catch((error) => {
                console.warn('停止上一段分段语音失败：', error);
            });
            this.clearChunkedSpeechSession(session);
        }
        Promise.resolve(this.audioPlayer?.stop?.()).catch((error) => {
            console.warn('停止上一段音频失败：', error);
        });
        try {
            window.speechSynthesis?.cancel?.();
        } catch (error) {
            console.warn('停止浏览器原生语音失败：', error);
        }
    }

    startAvatarPlayback(payload, displayText, aiMessageDiv) {
        this.executeAvatarCue(payload, aiMessageDiv);
        if (!this.speechProvider?.isSpeechDisabled) {
            this.startAvatarSpeech(payload, displayText, aiMessageDiv);
        }
    }

    notifyMessageAdded(element, role) {
        this.ensureMessageIdentity(element, role);
        this.emitChatUiEvent({
            type: 'message-added',
            message: this.serializeMessageElement(element)
        });
    }

    notifyMessageUpdated(element) {
        if (!element?.dataset?.messageId) {
            return;
        }
        this.emitChatUiEvent({
            type: 'message-updated',
            message: this.serializeMessageElement(element)
        });
    }

    notifyMessageRemoved(element) {
        if (!element?.dataset?.messageId || element.dataset.removalNotified === 'true') {
            return;
        }
        element.dataset.removalNotified = 'true';
        this.emitChatUiEvent({
            type: 'message-removed',
            id: element.dataset.messageId
        });
    }

    setBusy(nextBusy) {
        this.isBusy = nextBusy;
        this.emitChatUiEvent({ type: 'state', isBusy: nextBusy });
    }

    renderMessageContent(element, content, contentFormat = 'markdown') {
        if (!element) {
            return;
        }
        if (contentFormat === 'text') {
            setPlainTextContent(element, content);
            return;
        }
        setMarkdownContent(element, content);
    }

    updateMessageContent(element, content, contentFormat = 'markdown') {
        if (!element) {
            return;
        }
        this.renderMessageContent(element, content, contentFormat);
        this.notifyMessageUpdated(element);
    }

    removeMessageElement(element) {
        if (!element) {
            return;
        }
        this.notifyMessageRemoved(element);
        element.remove();
        this.scrollToBottom();
    }

    getTranscriptSnapshot() {
        return Array.from(this.messageListEl.children)
            .filter((element) => element instanceof HTMLElement)
            .map((element) => this.serializeMessageElement(element));
    }

    clearConversation() {
        if (this.isBusy) {
            this.showSystemNotice(t('AILIS 正在执行当前请求，完成后再清空会话。'), {
                level: 'info',
                code: 'conversation_busy'
            });
            return false;
        }
        this.messageHistory = [];
        this.messageListEl.innerHTML = '';
        if (typeof window.ailisDesktop?.chatHistory?.clear === 'function') {
            void window.ailisDesktop.chatHistory.clear({ sessionId: this.sessionId });
        } else {
            window.localStorage?.removeItem(this.getBrowserHistoryStorageKey());
        }
        this.showSystemNotice('当前会话已清空。', {
            level: 'success',
            code: 'conversation_cleared',
            durationMs: 4000
        });
        this.emitChatUiEvent({
            type: 'snapshot',
            messages: this.getTranscriptSnapshot(),
            isBusy: this.isBusy
        });
        return true;
    }

    async sendExternalMessage(content, options = {}) {
        return this.sendMessage(content, options);
    }

    setSpeechProvider(nextProvider) {
        this.speechProvider = nextProvider;
        this.hasShownSpeechProviderHint = false;
        if (nextProvider?.isSpeechDisabled) {
            this.stopLingeringSpeech('speech-disabled');
            this.vrmSystem.stopSpeaking();
        }
    }

    setChatService(nextChatService) {
        this.backgroundMessageUnsubscribe?.();
        this.backgroundMessageUnsubscribe = null;
        this.chatService = nextChatService;
        this.bindBackgroundAssistantMessages();
        this.startAutoChatTimer('service_changed');
    }

    bindBackgroundAssistantMessages() {
        if (typeof this.chatService?.onBackgroundAssistantMessage !== 'function') {
            return;
        }
        this.backgroundMessageUnsubscribe = this.chatService.onBackgroundAssistantMessage((payload) => {
            this.backgroundMessageChain = this.backgroundMessageChain
                .then(() => this.commitBackgroundAssistantMessage(payload))
                .catch((error) => {
                    console.warn('提交后台任务消息失败：', error);
                });
        });
    }

    async commitBackgroundAssistantMessage(payload = {}) {
        await this.historyReady;
        const displayText = payload.display_text || payload.speech_text || '';
        if (!displayText) {
            return;
        }
        const eventId = String(payload.backgroundEventId || '').trim();
        if (eventId && this.backgroundMessageIds.has(eventId)) {
            return;
        }
        if (eventId) {
            this.backgroundMessageIds.add(eventId);
            if (this.backgroundMessageIds.size > 160) {
                this.backgroundMessageIds.delete(this.backgroundMessageIds.values().next().value);
            }
        }

        const aiMessageDiv = this.createAIMessage();
        this.executeAvatarCue(payload, aiMessageDiv);
        this.updateMessageContent(aiMessageDiv, displayText);
        this.scrollToBottom();
        this.messageHistory.push({
            role: 'assistant',
            content: displayText,
            source: payload.source || 'task_result_persona_actor',
            taskEventKind: payload.backgroundTaskKind || 'progress',
            createdAt: new Date().toISOString()
        });
        await this.persistConversation();
        this.proactiveCompanion.noteAssistantTurn();
        this.stopLingeringSpeech('background-assistant-message');
        this.startCommittedBubbleSpeech(payload, aiMessageDiv, null);
        this.startAutoChatTimer(
            payload.backgroundTaskKind === 'result' ? 'task_result' : 'task_progress'
        );
    }

    async triggerAutoChat(opportunity = null) {
        await this.historyReady;
        if (this.chatService?.supportsAutoChat === false) {
            return;
        }

        if (this.isBusy) {
            console.log('🤫 当前正忙，跳过本次主动对话');
            return { ok: false, reason: 'busy' };
        }

        console.log('✨ AILIS 尝试主动发起对话...');
        this.setBusy(true);
        const turn = this.createTurnState('auto');
        const aiMessageDiv = this.createAIMessage();
        const chunkedSpeechSession = this.createChunkedSpeechSession(aiMessageDiv);
        turn.aiMessageDiv = aiMessageDiv;
        turn.chunkedSpeechSession = chunkedSpeechSession;
        const messageHistorySnapshot = this.createMessageHistorySnapshot();

        try {
            const payload = opportunity?.payload || await this.fetchAssistantTurnWithFallback(true, (partialPayload) => {
                    if (!this.isTurnActive(turn)) {
                        return;
                    }
                    this.renderStreamingAssistantReply(partialPayload, aiMessageDiv);
                }, {
                    messageHistory: messageHistorySnapshot,
                    shouldContinue: () => this.isTurnActive(turn),
                    proactiveContext: opportunity?.context || null
                });
            if (!this.isTurnActive(turn)) {
                return;
            }
            this.executeAvatarCue(payload, aiMessageDiv);
            this.updateMessageContent(aiMessageDiv, payload.display_text || payload.speech_text || '...');
            this.scrollToBottom();
            this.messageHistory.push({
                role: 'assistant',
                content: payload.display_text,
                source: 'proactive_companion',
                createdAt: new Date().toISOString()
            });
            await this.persistConversation();
            this.startCommittedBubbleSpeech(payload, aiMessageDiv, chunkedSpeechSession);
            return { ok: true };
        } catch (error) {
            await chunkedSpeechSession?.cancel?.('auto-chat-error');
            this.removeMessageElement(aiMessageDiv);
            if (!this.isTurnCancelled(turn)) {
                console.error('主动对话请求失败：', error);
            }
            return { ok: false, reason: 'delivery_failed', error: error?.message || String(error) };
        } finally {
            this.releaseChunkedSpeechSessionWhenDone(chunkedSpeechSession);
            if (this.activeTurn?.id === turn.id) {
                this.interruptRequested = false;
                this.interruptInFlight = false;
                this.setBusy(false);
            }
            this.releaseTurn(turn);
        }
    }

    async sendMessage(contentOverride = null, options = {}) {
        await this.historyReady;
        if (this.isBusy) {
            return;
        }

        const hasOverride = typeof contentOverride === 'string';
        const content = String(hasOverride ? contentOverride : this.inputEl.value).trim();
        const attachments = normalizeChatAttachments(options.attachments);
        if (!content && !attachments.length) {
            return;
        }
        const messageContent = content || getDefaultMessageForAttachments(attachments);

        this.stopLingeringSpeech('new-chat-turn');
        this.setBusy(true);
        this.proactiveCompanion.stop();

        if (!hasOverride) {
            this.inputEl.value = '';
        }
        this.addUserMessage(messageContent, attachments);
        this.messageHistory.push({
            role: 'user',
            content: messageContent,
            attachments,
            createdAt: new Date().toISOString()
        });
        await this.persistConversation();
        this.proactiveCompanion.noteUserTurn();

        const loadingEl = this.addLoadingMessage();
        const aiMessageDiv = this.createAIMessage();
        const chunkedSpeechSession = this.createChunkedSpeechSession(aiMessageDiv);
        const turn = this.createTurnState('chat');
        turn.loadingEl = loadingEl;
        turn.aiMessageDiv = aiMessageDiv;
        turn.chunkedSpeechSession = chunkedSpeechSession;
        const messageHistorySnapshot = this.createMessageHistorySnapshot();

        try {
            const payload = await this.fetchAssistantTurnWithFallback(false, (partialPayload) => {
                if (!this.isTurnActive(turn)) {
                    return;
                }
                this.removeMessageElement(loadingEl);
                this.renderStreamingAssistantReply(partialPayload, aiMessageDiv);
            }, {
                messageHistory: messageHistorySnapshot,
                shouldContinue: () => this.isTurnActive(turn)
            });
            if (!this.isTurnActive(turn)) {
                return;
            }
            this.removeMessageElement(loadingEl);
            this.executeAvatarCue(payload, aiMessageDiv);
            this.updateMessageContent(aiMessageDiv, payload.display_text || payload.speech_text || '...');
            this.scrollToBottom();
            this.messageHistory.push({
                role: 'assistant',
                content: payload.display_text,
                createdAt: new Date().toISOString()
            });
            await this.persistConversation();
            this.proactiveCompanion.noteAssistantTurn();
            this.startCommittedBubbleSpeech(payload, aiMessageDiv, chunkedSpeechSession);
        } catch (error) {
            await chunkedSpeechSession?.cancel?.('chat-turn-error');
            this.removeMessageElement(loadingEl);
            this.removeMessageElement(aiMessageDiv);
            this.vrmSystem.stopSpeaking();
            if (!this.isTurnCancelled(turn)) {
                this.showSystemNotice(`请求失败：${error.message}`, {
                    level: 'error',
                    code: 'chat_request_failed'
                });
                console.error('后端请求失败：', error);
            }
        } finally {
            this.releaseChunkedSpeechSessionWhenDone(chunkedSpeechSession);
            if (this.activeTurn?.id === turn.id) {
                this.interruptRequested = false;
                this.interruptInFlight = false;
                this.setBusy(false);
                const latestMessage = this.messageHistory.at(-1);
                this.startAutoChatTimer(latestMessage?.role === 'assistant' ? 'assistant_turn' : 'chat_finished');
            }
            this.releaseTurn(turn);
        }
    }

    async interruptCurrentTurn() {
        if (!this.isBusy) {
            return {
                ok: false,
                status: 'idle',
                error: '当前没有正在执行的对话。'
            };
        }
        if (this.interruptInFlight) {
            return {
                ok: true,
                status: 'interrupt_pending'
            };
        }

        this.interruptInFlight = true;
        this.interruptRequested = true;
        const interruptedTurn = this.activeTurn;
        this.markTurnCancelled(interruptedTurn);
        if (this.activeTurn?.id === interruptedTurn?.id) {
            this.activeTurn = null;
        }
        this.vrmSystem.stopSpeaking();
        try {
            Promise.resolve(this.activeChunkedSpeechSession?.cancel?.('chat_user_interrupt')).catch((error) => {
                console.warn('分段语音中断失败：', error);
            });
            Promise.resolve(this.audioPlayer?.stop?.()).catch((error) => {
                console.warn('音频中断失败：', error);
            });
        } catch {}
        this.removeMessageElement(interruptedTurn?.loadingEl);
        this.removeMessageElement(interruptedTurn?.aiMessageDiv);
        this.showSystemNotice('已停止当前回复，后台会继续保存上下文和工具记录。你可以继续发送新消息。', {
            level: 'info',
            code: 'chat_interrupted',
            durationMs: 5500
        });
        this.interruptRequested = false;
        this.interruptInFlight = false;
        this.setBusy(false);
        this.startAutoChatTimer();

        Promise.resolve(this.chatService?.abortCurrentTurn?.({
            sessionId: this.sessionId,
            reason: 'chat_user_interrupt'
        })).then((result) => {
            if (!result?.ok && result?.status !== 'unsupported' && result?.status !== 'no_active_run') {
                console.warn('后台中断请求未成功：', result);
            }
        }).catch((error) => {
            console.warn('后台中断请求失败：', error);
        });

        return {
            ok: true,
            status: 'interrupt_backgrounded',
            sessionId: this.sessionId
        };
    }

    async fetchAssistantTurn(isAutoChat = false, onProgress, messageHistory = this.messageHistory, options = {}) {
        return this.chatService.fetchAssistantTurn({
            sessionId: this.sessionId,
            messageHistory,
            is_auto_chat: isAutoChat,
            isAutoChat,
            replyMode: 'stream_text',
            onProgress,
            proactiveContext: options.proactiveContext || null
        });
    }

    async fetchAssistantTurnWithFallback(isAutoChat = false, onProgress, options = {}) {
        const replyModes = this.speechProvider?.replyModeFallbackChain || ['stream_text'];
        const messageHistory = options.messageHistory || this.messageHistory;
        const shouldContinue = typeof options.shouldContinue === 'function'
            ? options.shouldContinue
            : () => true;
        let lastError = null;

        for (let index = 0; index < replyModes.length; index += 1) {
            if (!shouldContinue()) {
                throw new Error('turn_cancelled');
            }
            const replyMode = replyModes[index];

            try {
                return await this.chatService.fetchAssistantTurn({
                    sessionId: this.sessionId,
                    messageHistory,
                    is_auto_chat: isAutoChat,
                    isAutoChat,
                    replyMode,
                    onProgress: replyMode === 'stream_text' ? onProgress : null,
                    proactiveContext: options.proactiveContext || null
                });
            } catch (error) {
                if (!shouldContinue()) {
                    throw error;
                }
                lastError = error;
                console.warn(`语音回复模式 ${replyMode} 失败：`, error);
            }
        }

        throw lastError || new Error('获取回复失败');
    }

    async renderAssistantReply(payload, aiMessageDiv) {
        const displayText = payload.display_text || payload.speech_text || '...';
        const alignment = payload.normalized_alignment || payload.alignment || null;

        if (payload.streamMode) {
            this.updateMessageContent(aiMessageDiv, displayText);
            this.scrollToBottom();
            await this.playPreferredSpeech({
                payload,
                displayText,
                alignment,
                aiMessageDiv
            });
            return;
        }

        this.executeAvatarCue(payload, aiMessageDiv);
        await this.playPreferredSpeech({
            payload,
            displayText,
            alignment,
            aiMessageDiv
        });
    }

    renderStreamingAssistantReply(payload, aiMessageDiv) {
        const displayText = payload.display_text || payload.speech_text || '';

        this.executeAvatarCue(payload, aiMessageDiv);
        this.updateMessageContent(aiMessageDiv, displayText);
        this.scrollToBottom();
    }

    executeAvatarCue(payload, aiMessageDiv) {
        const cueSignature = JSON.stringify({
            surface: getPayloadSurface(payload),
            action: payload.action || null,
            expression: payload.expression || null
        });
        if (aiMessageDiv?.dataset.surfaceCue === cueSignature) {
            return;
        }

        const allowChatMotion = shouldAllowChatMotion(payload);
        this.vrmSystem.applyPersonaSurfacePayload?.(payload, {
            messageId: aiMessageDiv?.dataset?.messageId || '',
            source: 'chat_tts',
            allowExpressiveMotion: allowChatMotion,
            allowExperimentalMotion: allowChatMotion
        });

        if (aiMessageDiv) {
            aiMessageDiv.dataset.surfaceCue = cueSignature;
            aiMessageDiv.dataset.actionCue = payload.action || '';
            aiMessageDiv.dataset.expressionCue = payload.expression || '';
        }
    }

    async playPreferredSpeech({ payload, displayText, alignment, aiMessageDiv, preserveMessageContent = false }) {
        const speechText = deriveTtsSpeechText(payload, displayText);
        const speechPayload = {
            ...payload,
            speech_text: speechText
        };
        if (this.speechProvider?.isSpeechDisabled) {
            await this.playFallbackSpeech(displayText, aiMessageDiv, speechPayload, {
                revealText: !payload.streamMode,
                preserveMessageContent
            });
            return;
        }

        const updateSpeechDisplay = preserveMessageContent
            ? () => {}
            : (text) => this.updateMessageContent(aiMessageDiv, text);
        const scrollSpeechDisplay = preserveMessageContent
            ? () => {}
            : () => this.scrollToBottom();

        const speechResult = await this.speechProvider?.playSpeech?.({
            payload: speechPayload,
            displayText,
            alignment,
            audioPlayer: this.audioPlayer,
            vrmSystem: this.vrmSystem,
            updateMessageContent: updateSpeechDisplay,
            scrollToBottom: scrollSpeechDisplay,
            onAvatarPlaybackStart: () => this.startAvatarPlayback(speechPayload, displayText, aiMessageDiv)
        });

        if (speechResult?.played) {
            this.endAvatarSpeech(aiMessageDiv);
            return;
        }

        this.endAvatarSpeech(aiMessageDiv);

        if (this.speechProvider?.supportsTTS && !speechResult?.played) {
            const failureMessage = this.speechProvider.getLastTTSFailureMessage();
            if (failureMessage && !this.hasShownSpeechProviderHint) {
                this.showSystemNotice(t('语音播放暂时不可用：{reason}', { reason: failureMessage }), {
                    level: 'warning',
                    source: 'speech',
                    code: 'tts_provider_failed'
                });
                this.hasShownSpeechProviderHint = true;
            }
        }

        if (payload.fallbackMode || !payload.audio_base64 || !this.speechProvider?.supportsTTS) {
            await this.playFallbackSpeech(displayText, aiMessageDiv, speechPayload, {
                revealText: !payload.streamMode,
                animateMouth: false,
                preserveMessageContent
            });
            if (!this.hasShownTextFallbackHint) {
                this.showSystemNotice(t('当前语音服务不可用，已自动切换为纯文本回复。'), {
                    level: 'info',
                    source: 'speech',
                    code: 'tts_text_fallback',
                    durationMs: 5500
                });
                this.hasShownTextFallbackHint = true;
            }
            return;
        }

        try {
            await this.audioPlayer.playSpeech({
                audioBase64: payload.audio_base64,
                mimeType: payload.mime_type,
                displayText,
                alignment,
                onTextProgress: (text) => {
                    if (!preserveMessageContent) {
                        this.updateMessageContent(aiMessageDiv, text || '');
                        this.scrollToBottom();
                    }
                },
                onPlaybackStart: () => {
                    if (!preserveMessageContent) {
                        if (alignment?.characters?.length) {
                            this.updateMessageContent(aiMessageDiv, '');
                        } else {
                            this.updateMessageContent(aiMessageDiv, displayText);
                        }
                    }
                    this.startAvatarPlayback(speechPayload, displayText, aiMessageDiv);
                    if (!preserveMessageContent) {
                        this.scrollToBottom();
                    }
                },
                onPlaybackEnd: () => {
                    this.endAvatarSpeech(aiMessageDiv);
                    if (!preserveMessageContent) {
                        this.updateMessageContent(aiMessageDiv, displayText);
                        this.scrollToBottom();
                    }
                }
            });
        } catch (error) {
            if (!preserveMessageContent) {
                this.updateMessageContent(aiMessageDiv, displayText);
            }
            this.vrmSystem.stopSpeaking();
            this.endAvatarSpeech(aiMessageDiv);

            this.showAutoplayHintOnce(error);
            console.error('音频播放失败：', error);
        }
    }

    async playFallbackSpeech(displayText, aiMessageDiv, payload = {}, options = {}) {
        const speechText = deriveTtsSpeechText(payload, displayText);
        const durationMs = Math.min(
            CONFIG.TEXT_ONLY_SPEECH_MAX_MS,
            Math.max(CONFIG.TEXT_ONLY_SPEECH_MIN_MS, (speechText || displayText).length * CONFIG.TEXT_ONLY_SPEECH_CHAR_MS)
        );
        const revealText = options.revealText !== false;
        const animateMouth = options.animateMouth !== false;
        const preserveMessageContent = options.preserveMessageContent === true;

        if (animateMouth) {
            this.vrmSystem.startFallbackSpeech();
        } else {
            this.vrmSystem.stopSpeaking();
        }
        this.executeAvatarCue(payload, aiMessageDiv);
        if (animateMouth) {
            this.startAvatarSpeech({
                ...payload,
                speech_text: speechText
            }, displayText, aiMessageDiv);
        }

        if (!revealText || preserveMessageContent) {
            if (!preserveMessageContent) {
                this.updateMessageContent(aiMessageDiv, displayText);
                this.scrollToBottom();
            }
            await new Promise((resolve) => window.setTimeout(resolve, durationMs));
            if (animateMouth) {
                this.vrmSystem.stopSpeaking();
                this.endAvatarSpeech(aiMessageDiv);
            }
            return;
        }

        await new Promise((resolve) => {
            const startTime = performance.now();

            const renderFrame = (now) => {
                const elapsedMs = now - startTime;
                const progress = Math.min(1, elapsedMs / durationMs);
                const visibleLength = Math.max(1, Math.round(displayText.length * progress));

                this.updateMessageContent(aiMessageDiv, displayText.slice(0, visibleLength));
                this.scrollToBottom();

                if (progress >= 1) {
                    resolve();
                    return;
                }

                window.requestAnimationFrame(renderFrame);
            };

            window.requestAnimationFrame(renderFrame);
        });

        if (animateMouth) {
            this.vrmSystem.stopSpeaking();
            this.endAvatarSpeech(aiMessageDiv);
        }
    }

    showAutoplayHintOnce(error) {
        if (this.hasShownAutoplayHint) {
            return;
        }

        const errorMessage = String(error?.message || error || '').toLowerCase();
        if (
            errorMessage.includes('gesture') ||
            errorMessage.includes('interact') ||
            errorMessage.includes('play')
        ) {
            this.showSystemNotice('浏览器还没解锁音频，请先点击页面任意位置，再试一次语音播放。', {
                level: 'warning',
                source: 'speech',
                code: 'audio_autoplay_blocked'
            });
            this.hasShownAutoplayHint = true;
        }
    }

    createAIMessage() {
        const div = document.createElement('div');
        div.className = 'message-item message-ai';
        div.dataset.surfaceCue = '';
        div.dataset.actionCue = '';
        div.dataset.expressionCue = '';
        div.dataset.contentFormat = 'markdown';
        div.__ailisMessageContent = '';
        this.messageListEl.appendChild(div);
        this.notifyMessageAdded(div, 'assistant');
        this.scrollToBottom();
        return div;
    }

    addUserMessage(content, attachments = []) {
        const div = document.createElement('div');
        div.className = 'message-item message-user';
        div.__ailisAttachments = normalizeChatAttachments(attachments);
        this.renderMessageContent(div, buildAttachmentHint(content, div.__ailisAttachments), 'markdown');
        this.messageListEl.appendChild(div);
        this.notifyMessageAdded(div, 'user');
        this.scrollToBottom();
    }

    addSystemMessage(content) {
        const div = document.createElement('div');
        div.className = 'message-item message-system';
        this.renderMessageContent(div, content, 'markdown');
        this.messageListEl.appendChild(div);
        this.notifyMessageAdded(div, 'system');
        this.scrollToBottom();
    }

    addLoadingMessage() {
        const div = document.createElement('div');
        div.className = 'message-loading';
        this.renderMessageContent(div, t('AILIS正在思考...'), 'text');
        this.messageListEl.appendChild(div);
        this.notifyMessageAdded(div, 'loading');
        this.scrollToBottom();
        return div;
    }

    scrollToBottom() {
        this.messageListEl.scrollTop = this.messageListEl.scrollHeight;
    }
}
