import { CONFIG } from './config.js';
import {
    buildAttachmentHint,
    getDefaultMessageForAttachments,
    normalizeChatAttachments
} from './chat-attachments.js';
import { markdownToPlainText, setMarkdownContent, setPlainTextContent } from './markdown-renderer.js';
import { AVATAR_SPEECH_EVENT_NAME } from './avatar-dialogue-bubble.js';

const CHAT_UI_EVENT_NAME = 'aigril-chat-ui-event';

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
    constructor(vrmSystem, audioPlayer, chatService, { speechProvider = null } = {}) {
        this.vrmSystem = vrmSystem;
        this.audioPlayer = audioPlayer;
        this.chatService = chatService;
        this.speechProvider = speechProvider;

        this.messageHistory = [];
        this.messageListEl = document.getElementById('message-list');
        this.inputEl = document.getElementById('message-input');
        this.sendBtnEl = document.getElementById('send-btn');
        this.sessionId = this.getOrCreateSessionId();

        this.isBusy = false;
        this.autoChatTimer = null;
        this.hasShownAutoplayHint = false;
        this.hasShownTextFallbackHint = false;
        this.hasShownSpeechProviderHint = false;
        this.messageCounter = 0;
        this.interruptRequested = false;

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

    bindEvents() {
        this.sendBtnEl.addEventListener('click', () => this.sendMessage());
        this.inputEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });

        window.addEventListener('modelLoaded', () => {
            const welcomeMessage = this.chatService?.getWelcomeMessage?.() ||
                'AIGL到啦！现在可以聊天啦~';
            this.addSystemMessage(welcomeMessage);
            this.inputEl.disabled = false;
            this.sendBtnEl.disabled = false;
            this.startAutoChatTimer();
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

    startAutoChatTimer() {
        if (this.autoChatTimer) {
            clearTimeout(this.autoChatTimer);
            this.autoChatTimer = null;
        }

        if (!CONFIG.AUTO_CHAT_ENABLED) {
            console.log('⏸️ 主动搭话已关闭');
            return;
        }

        if (this.chatService?.supportsAutoChat === false) {
            console.log('⏸️ 当前聊天后端不支持主动搭话');
            return;
        }

        const randomDelay = CONFIG.AUTO_CHAT_MIN_INTERVAL +
            Math.random() * (CONFIG.AUTO_CHAT_MAX_INTERVAL - CONFIG.AUTO_CHAT_MIN_INTERVAL);

        console.log(`⏱️ 下一次主动对话将在 ${(randomDelay / 1000).toFixed(1)} 秒后`);
        this.autoChatTimer = setTimeout(() => this.triggerAutoChat(), randomDelay);
    }

    applyRuntimePreferences() {
        if (this.inputEl.disabled) {
            return;
        }

        this.startAutoChatTimer();
    }

    createMessageId(role = 'message') {
        this.messageCounter += 1;
        return `${role}-${Date.now()}-${this.messageCounter}`;
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
            content: element.__aigrilMessageContent ?? element.textContent ?? '',
            contentFormat: element.dataset.contentFormat || 'markdown',
            attachments: element.__aigrilAttachments || [],
            pending: role === 'loading'
        };
    }

    emitChatUiEvent(payload) {
        window.dispatchEvent(new CustomEvent(CHAT_UI_EVENT_NAME, { detail: payload }));
    }

    emitAvatarSpeechEvent(payload) {
        window.dispatchEvent(new CustomEvent(AVATAR_SPEECH_EVENT_NAME, { detail: payload }));
    }

    getAvatarSpeechText(payload, displayText) {
        const source = payload?.bubble_text || payload?.speech_text || displayText || payload?.display_text || '';
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

    startAvatarPlayback(payload, displayText, aiMessageDiv) {
        this.executeAvatarCue(payload, aiMessageDiv);
        this.startAvatarSpeech(payload, displayText, aiMessageDiv);
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
            this.addSystemMessage('AIGL 正在执行当前请求，完成后再清空会话。');
            return false;
        }
        this.messageHistory = [];
        this.messageListEl.innerHTML = '';
        this.addSystemMessage('当前会话已清空。');
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
    }

    setChatService(nextChatService) {
        this.chatService = nextChatService;
        this.startAutoChatTimer();
    }

    async triggerAutoChat() {
        if (this.chatService?.supportsAutoChat === false) {
            return;
        }

        if (this.isBusy) {
            console.log('🤫 当前正忙，跳过本次主动对话');
            this.startAutoChatTimer();
            return;
        }

        console.log('✨ AIGL 尝试主动发起对话...');
        this.setBusy(true);
        const aiMessageDiv = this.createAIMessage();

        try {
            const payload = await this.fetchAssistantTurnWithFallback(true, (partialPayload) => {
                this.renderStreamingAssistantReply(partialPayload, aiMessageDiv);
            });
            await this.renderAssistantReply(payload, aiMessageDiv);
            this.messageHistory.push({ role: 'assistant', content: payload.display_text });
        } catch (error) {
            this.removeMessageElement(aiMessageDiv);
            console.error('主动对话请求失败：', error);
        } finally {
            this.setBusy(false);
            this.startAutoChatTimer();
        }
    }

    async sendMessage(contentOverride = null, options = {}) {
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

        this.setBusy(true);
        this.startAutoChatTimer();

        if (!hasOverride) {
            this.inputEl.value = '';
        }
        this.addUserMessage(messageContent, attachments);
        this.messageHistory.push({
            role: 'user',
            content: messageContent,
            attachments
        });

        const loadingEl = this.addLoadingMessage();
        const aiMessageDiv = this.createAIMessage();

        try {
            const payload = await this.fetchAssistantTurnWithFallback(false, (partialPayload) => {
                this.removeMessageElement(loadingEl);
                this.renderStreamingAssistantReply(partialPayload, aiMessageDiv);
            });
            this.removeMessageElement(loadingEl);
            await this.renderAssistantReply(payload, aiMessageDiv);
            this.messageHistory.push({ role: 'assistant', content: payload.display_text });
        } catch (error) {
            this.removeMessageElement(loadingEl);
            this.removeMessageElement(aiMessageDiv);
            this.vrmSystem.stopSpeaking();
            if (this.interruptRequested) {
                this.addSystemMessage('已中断当前对话，已生成的数据会保留在 Agent transcript 里。');
            } else {
                this.addSystemMessage(`请求失败：${error.message}`);
                console.error('后端请求失败：', error);
            }
        } finally {
            this.interruptRequested = false;
            this.setBusy(false);
            this.startAutoChatTimer();
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
        this.interruptRequested = true;
        this.vrmSystem.stopSpeaking();
        try {
            await this.audioPlayer?.stop?.();
        } catch {}
        this.addSystemMessage('正在中断当前对话，已产生的上下文和工具记录会保留。');
        try {
            return await this.chatService?.abortCurrentTurn?.({
                sessionId: this.sessionId,
                reason: 'chat_user_interrupt'
            });
        } catch (error) {
            this.addSystemMessage(`中断请求失败：${error.message || error}`);
            return {
                ok: false,
                status: 'interrupt_failed',
                error: error.message || String(error)
            };
        }
    }

    async fetchAssistantTurn(isAutoChat = false, onProgress) {
        return this.chatService.fetchAssistantTurn({
            sessionId: this.sessionId,
            messageHistory: this.messageHistory,
            is_auto_chat: isAutoChat,
            isAutoChat,
            replyMode: 'stream_text',
            onProgress
        });
    }

    async fetchAssistantTurnWithFallback(isAutoChat = false, onProgress) {
        const replyModes = this.speechProvider?.replyModeFallbackChain || ['stream_text'];
        let lastError = null;

        for (let index = 0; index < replyModes.length; index += 1) {
            const replyMode = replyModes[index];

            try {
                return await this.chatService.fetchAssistantTurn({
                    sessionId: this.sessionId,
                    messageHistory: this.messageHistory,
                    is_auto_chat: isAutoChat,
                    isAutoChat,
                    replyMode,
                    onProgress: replyMode === 'stream_text' ? onProgress : null
                });
            } catch (error) {
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
            surface: payload.surface || payload.personaSurface || null,
            action: payload.action || null,
            expression: payload.expression || null
        });
        if (aiMessageDiv?.dataset.surfaceCue === cueSignature) {
            return;
        }

        this.vrmSystem.applyPersonaSurfacePayload?.(payload, {
            messageId: aiMessageDiv?.dataset?.messageId || '',
            source: 'chat_tts'
        });

        if (aiMessageDiv) {
            aiMessageDiv.dataset.surfaceCue = cueSignature;
            aiMessageDiv.dataset.actionCue = payload.action || '';
            aiMessageDiv.dataset.expressionCue = payload.expression || '';
        }
    }

    async playPreferredSpeech({ payload, displayText, alignment, aiMessageDiv }) {
        if (this.speechProvider?.isSpeechDisabled) {
            this.vrmSystem.stopSpeaking();
            this.executeAvatarCue(payload, aiMessageDiv);
            this.updateMessageContent(aiMessageDiv, displayText);
            this.scrollToBottom();
            return;
        }

        const speechResult = await this.speechProvider?.playSpeech?.({
            payload,
            displayText,
            alignment,
            audioPlayer: this.audioPlayer,
            vrmSystem: this.vrmSystem,
            updateMessageContent: (text) => this.updateMessageContent(aiMessageDiv, text),
            scrollToBottom: () => this.scrollToBottom(),
            onAvatarPlaybackStart: () => this.startAvatarPlayback(payload, displayText, aiMessageDiv)
        });

        if (speechResult?.played) {
            this.endAvatarSpeech(aiMessageDiv);
            return;
        }

        this.endAvatarSpeech(aiMessageDiv);

        if (this.speechProvider?.supportsTTS && !speechResult?.played) {
            const failureMessage = this.speechProvider.getLastTTSFailureMessage();
            if (failureMessage && !this.hasShownSpeechProviderHint) {
                this.addSystemMessage(`语音播放暂时不可用：${failureMessage}`);
                this.hasShownSpeechProviderHint = true;
            }
        }

        if (payload.fallbackMode || !payload.audio_base64 || !this.speechProvider?.supportsTTS) {
            await this.playFallbackSpeech(displayText, aiMessageDiv, payload);
            if (!this.hasShownTextFallbackHint) {
                this.addSystemMessage('当前语音服务不可用，已自动切换为纯文本回复。');
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
                    this.updateMessageContent(aiMessageDiv, text || '');
                    this.scrollToBottom();
                },
                onPlaybackStart: () => {
                    if (alignment?.characters?.length) {
                        this.updateMessageContent(aiMessageDiv, '');
                    } else {
                        this.updateMessageContent(aiMessageDiv, displayText);
                    }
                    this.startAvatarPlayback(payload, displayText, aiMessageDiv);
                    this.scrollToBottom();
                },
                onPlaybackEnd: () => {
                    this.endAvatarSpeech(aiMessageDiv);
                    this.updateMessageContent(aiMessageDiv, displayText);
                    this.scrollToBottom();
                }
            });
        } catch (error) {
            this.updateMessageContent(aiMessageDiv, displayText);
            this.vrmSystem.stopSpeaking();
            this.endAvatarSpeech(aiMessageDiv);

            this.showAutoplayHintOnce(error);
            console.error('音频播放失败：', error);
        }
    }

    async playFallbackSpeech(displayText, aiMessageDiv, payload = {}) {
        const durationMs = Math.min(
            CONFIG.TEXT_ONLY_SPEECH_MAX_MS,
            Math.max(CONFIG.TEXT_ONLY_SPEECH_MIN_MS, displayText.length * CONFIG.TEXT_ONLY_SPEECH_CHAR_MS)
        );

        this.vrmSystem.startFallbackSpeech();
        this.executeAvatarCue(payload, aiMessageDiv);
        this.startAvatarSpeech(payload, displayText, aiMessageDiv);

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

        this.vrmSystem.stopSpeaking();
        this.endAvatarSpeech(aiMessageDiv);
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
            this.addSystemMessage('浏览器还没解锁音频，请先点击页面任意位置，再试一次语音播放。');
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
        div.__aigrilMessageContent = '';
        this.messageListEl.appendChild(div);
        this.notifyMessageAdded(div, 'assistant');
        this.scrollToBottom();
        return div;
    }

    addUserMessage(content, attachments = []) {
        const div = document.createElement('div');
        div.className = 'message-item message-user';
        div.__aigrilAttachments = normalizeChatAttachments(attachments);
        this.renderMessageContent(div, buildAttachmentHint(content, div.__aigrilAttachments), 'markdown');
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
        this.renderMessageContent(div, 'AIGL正在思考...', 'text');
        this.messageListEl.appendChild(div);
        this.notifyMessageAdded(div, 'loading');
        this.scrollToBottom();
        return div;
    }

    scrollToBottom() {
        this.messageListEl.scrollTop = this.messageListEl.scrollHeight;
    }
}
