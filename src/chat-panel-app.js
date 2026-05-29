import { CONFIG } from './config.js';
import { createDesktopSpeechRecognitionService } from './desktop-speech-recognition.js';
import { setMarkdownContent, setPlainTextContent } from './markdown-renderer.js';

function getMessageClassName(role) {
    if (role === 'user') {
        return 'message-item message-user';
    }
    if (role === 'assistant') {
        return 'message-item message-ai';
    }
    if (role === 'loading') {
        return 'message-loading';
    }
    return 'message-item message-system';
}

window.addEventListener('DOMContentLoaded', () => {
    const messageListEl = document.getElementById('message-list');
    const inputEl = document.getElementById('message-input');
    const sendBtnEl = document.getElementById('send-btn');
    const voiceBtnEl = document.getElementById('voice-btn');
    const visionBtnEl = document.getElementById('vision-btn');
    const visionMenuEl = document.getElementById('vision-menu');
    const visionPreviewEl = document.getElementById('vision-preview');
    const visionPreviewImgEl = document.getElementById('vision-preview-img');
    const visionPreviewTitleEl = document.getElementById('vision-preview-title');
    const visionPreviewMetaEl = document.getElementById('vision-preview-meta');
    const visionPreviewClearEl = document.getElementById('vision-preview-clear');
    const closeBtnEl = document.getElementById('close-btn');
    const settingsBtnEl = document.getElementById('settings-btn');
    const statusEl = document.getElementById('chat-status');

    let isBusy = false;
    let isRecording = false;
    let isTranscribing = false;
    let isCapturingVision = false;
    let pendingVisionAttachment = null;
    let speechStatusText = '';
    let currentRecognitionMode = window.aigrilDesktop?.preferences?.recognitionMode || 'auto-vad';
    let currentPreferredMicDeviceId = window.aigrilDesktop?.preferences?.preferredMicDeviceId || '';
    let recorderController = null;
    let recordingTimeoutId = 0;
    let levelPollingId = 0;
    let continuousRestartId = 0;
    let continuousPausedUntil = 0;
    let activeContinuousRecording = false;
    const speechRecognition = createDesktopSpeechRecognitionService();

    function scrollToBottom() {
        messageListEl.scrollTop = messageListEl.scrollHeight;
    }

    function getStatusText() {
        if (isCapturingVision) {
            return 'AIGL 正在看截图...';
        }
        if (isRecording) {
            return speechStatusText || '正在听你说话...';
        }
        if (isTranscribing) {
            return speechStatusText || '正在本地识别语音...';
        }
        if (speechStatusText) {
            return speechStatusText;
        }
        if (isBusy) {
            return 'AIGL 正在思考或说话...';
        }
        if (getRecognitionMode() === 'continuous') {
            return '自动 ASR 已开启，等待你说话...';
        }
        return '已连接桌宠';
    }

    function updateComposerState() {
        const hasDraft = Boolean(inputEl.value.trim() || pendingVisionAttachment);
        sendBtnEl.disabled = isBusy || isRecording || isTranscribing || isCapturingVision || !hasDraft;
        statusEl.textContent = getStatusText();

        if (voiceBtnEl) {
            voiceBtnEl.hidden = !speechRecognition.supportsRecognition;
            voiceBtnEl.disabled = !speechRecognition.supportsRecognition ||
                isTranscribing ||
                isCapturingVision ||
                (!isRecording && isBusy);
            voiceBtnEl.dataset.recording = isRecording ? 'true' : 'false';
            if (getRecognitionMode() === 'continuous') {
                voiceBtnEl.textContent = '暂停';
            } else if (isRecording) {
                voiceBtnEl.textContent = getRecognitionMode() === 'auto-vad' ? '取消' : '停止';
            } else {
                voiceBtnEl.textContent = getRecognitionMode() === 'auto-vad' ? '自动听' : '语音';
            }
        }

        if (visionBtnEl) {
            visionBtnEl.disabled = isBusy || isRecording || isTranscribing || isCapturingVision ||
                typeof window.aigrilDesktop?.vision?.capture !== 'function';
        }
    }

    function normalizeVisionAttachment(attachment) {
        if (!attachment?.dataUrl) {
            return null;
        }
        const mimeType = String(attachment.mimeType || 'image/png');
        if (!mimeType.startsWith('image/')) {
            return null;
        }
        return {
            type: 'vision',
            id: String(attachment.id || ''),
            source: String(attachment.source || ''),
            label: String(attachment.label || '截图'),
            dataUrl: String(attachment.dataUrl || ''),
            thumbnailDataUrl: String(attachment.thumbnailDataUrl || attachment.dataUrl || ''),
            mimeType,
            width: Number(attachment.width) || 0,
            height: Number(attachment.height) || 0,
            createdAt: String(attachment.createdAt || '')
        };
    }

    function normalizeVisionAttachments(attachments = []) {
        if (!Array.isArray(attachments)) {
            return [];
        }
        return attachments
            .map(normalizeVisionAttachment)
            .filter(Boolean);
    }

    function getVisionTargetLabel(target) {
        if (target === 'region') {
            return '矩形截图';
        }
        if (target === 'screen') {
            return '全屏截图';
        }
        if (target === 'pet-window') {
            return '桌宠截图';
        }
        if (target === 'control-window') {
            return '控制面板截图';
        }
        return '对话窗截图';
    }

    function formatVisionMeta(attachment) {
        const sizeText = attachment.width && attachment.height
            ? `${attachment.width} × ${attachment.height}`
            : '已捕获';
        return `${getVisionTargetLabel(attachment.source)} · ${sizeText}`;
    }

    function renderVisionPreview() {
        if (!visionPreviewEl || !pendingVisionAttachment) {
            if (visionPreviewEl) {
                visionPreviewEl.hidden = true;
            }
            return;
        }

        visionPreviewEl.hidden = false;
        if (visionPreviewImgEl) {
            visionPreviewImgEl.src = pendingVisionAttachment.thumbnailDataUrl || pendingVisionAttachment.dataUrl;
        }
        if (visionPreviewTitleEl) {
            visionPreviewTitleEl.textContent = pendingVisionAttachment.label || '已准备截图';
        }
        if (visionPreviewMetaEl) {
            visionPreviewMetaEl.textContent = formatVisionMeta(pendingVisionAttachment);
        }
    }

    function clearVisionAttachment() {
        pendingVisionAttachment = null;
        renderVisionPreview();
        updateComposerState();
    }

    function closeVisionMenu() {
        if (visionMenuEl) {
            visionMenuEl.hidden = true;
        }
    }

    function toggleVisionMenu() {
        if (!visionMenuEl || visionBtnEl?.disabled) {
            return;
        }
        visionMenuEl.hidden = !visionMenuEl.hidden;
    }

    function inferVisionTargetFromText(text) {
        const source = String(text || '').trim();
        if (!source) {
            return '';
        }

        const wantsVision = /(看一下|看看|帮我看|帮我瞧|识别|截图|屏幕|页面|窗口|报错)/.test(source) ||
            (/(这个|这里)/.test(source) && /(看|识别|屏幕|页面|窗口|截图|报错)/.test(source));
        if (!wantsVision) {
            return '';
        }
        if (/对话窗|聊天窗|这个窗口|窗口/.test(source)) {
            return 'chat-window';
        }
        if (/桌宠|人物/.test(source)) {
            return 'pet-window';
        }
        if (/控制面板|设置/.test(source)) {
            return 'control-window';
        }
        return 'screen';
    }

    async function captureVision(target = 'chat-window', { transientStatus = true } = {}) {
        if (isCapturingVision || typeof window.aigrilDesktop?.vision?.capture !== 'function') {
            return null;
        }

        closeVisionMenu();
        isCapturingVision = true;
        updateComposerState();

        try {
            const payload = await window.aigrilDesktop.vision.capture({ target });
            if (!payload?.ok || !payload.snapshot) {
                throw new Error(payload?.error || '截图失败');
            }

            const attachment = normalizeVisionAttachment(payload.snapshot);
            if (!attachment) {
                throw new Error('截图数据为空');
            }

            pendingVisionAttachment = attachment;
            renderVisionPreview();
            if (transientStatus) {
                setTransientStatus('截图已经准备好了，可以直接问我');
            }
            return attachment;
        } catch (error) {
            console.error('视觉截图失败：', error);
            setTransientStatus(`截图失败：${error.message || '无法读取屏幕'}`);
            return null;
        } finally {
            isCapturingVision = false;
            updateComposerState();
            syncContinuousAsr();
        }
    }

    function appendMessageAttachments(element, attachments = []) {
        const normalizedAttachments = normalizeVisionAttachments(attachments);
        if (!normalizedAttachments.length) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'message-attachments';

        normalizedAttachments.forEach((attachment) => {
            const card = document.createElement('div');
            card.className = 'message-attachment-card';

            const image = document.createElement('img');
            image.alt = attachment.label || '截图';
            image.src = attachment.thumbnailDataUrl || attachment.dataUrl;
            card.appendChild(image);

            const meta = document.createElement('div');
            meta.className = 'message-attachment-meta';
            meta.textContent = formatVisionMeta(attachment);
            card.appendChild(meta);

            wrapper.appendChild(card);
        });

        element.appendChild(wrapper);
    }

    function upsertMessage(message) {
        if (!message?.id) {
            return;
        }

        let element = messageListEl.querySelector(`[data-message-id="${message.id}"]`);
        if (!element) {
            element = document.createElement('div');
            element.dataset.messageId = message.id;
            messageListEl.appendChild(element);
        }

        element.className = getMessageClassName(message.role);
        element.dataset.messageRole = message.role || 'system';
        const contentFormat = message.contentFormat || message.content_format || message.format || 'markdown';
        if (contentFormat === 'text') {
            setPlainTextContent(element, message.content || '');
        } else {
            setMarkdownContent(element, message.content || '');
        }
        appendMessageAttachments(element, message.attachments || []);
        scrollToBottom();
    }

    function removeMessage(messageId) {
        const element = messageListEl.querySelector(`[data-message-id="${messageId}"]`);
        if (!element) {
            return;
        }
        element.remove();
        scrollToBottom();
    }

    function renderSnapshot(messages = []) {
        messageListEl.innerHTML = '';
        messages.forEach((message) => upsertMessage(message));
        scrollToBottom();
    }

    function sendCurrentMessage() {
        const content = inputEl.value.trim();
        if ((!content && !pendingVisionAttachment) || isBusy || isRecording || isTranscribing || isCapturingVision) {
            return;
        }

        const attachments = pendingVisionAttachment ? [pendingVisionAttachment] : [];
        window.aigrilDesktop?.sendChatMessage?.({
            content: content || '帮我看一下这张截图。',
            attachments,
            source: 'chat-panel'
        });
        if (getRecognitionMode() === 'continuous') {
            continuousPausedUntil = Date.now() + 2500;
            clearContinuousRestart();
        }
        inputEl.value = '';
        pendingVisionAttachment = null;
        renderVisionPreview();
        updateComposerState();
    }

    function clearRecordingTimeout() {
        if (recordingTimeoutId) {
            window.clearTimeout(recordingTimeoutId);
            recordingTimeoutId = 0;
        }
    }

    function clearLevelPolling() {
        if (levelPollingId) {
            window.clearInterval(levelPollingId);
            levelPollingId = 0;
        }
    }

    function clearContinuousRestart() {
        if (continuousRestartId) {
            window.clearTimeout(continuousRestartId);
            continuousRestartId = 0;
        }
    }

    function getRecognitionMode() {
        if (currentRecognitionMode === 'manual') {
            return 'manual';
        }
        if (currentRecognitionMode === 'continuous') {
            return 'continuous';
        }
        return 'auto-vad';
    }

    function canStartContinuousAsr() {
        return speechRecognition.supportsRecognition &&
            getRecognitionMode() === 'continuous' &&
            !isBusy &&
            !isRecording &&
            !isTranscribing &&
            !isCapturingVision &&
            Date.now() >= continuousPausedUntil;
    }

    function scheduleContinuousAsr(delayMs = CONFIG.ASR_CONTINUOUS_RESTART_MS) {
        clearContinuousRestart();
        if (!canStartContinuousAsr()) {
            return;
        }

        continuousRestartId = window.setTimeout(() => {
            continuousRestartId = 0;
            if (canStartContinuousAsr()) {
                void startVoiceInput({ continuous: true });
            }
        }, delayMs);
    }

    function syncContinuousAsr(delayMs = CONFIG.ASR_CONTINUOUS_RESTART_MS) {
        if (getRecognitionMode() !== 'continuous') {
            clearContinuousRestart();
            return;
        }

        if ((isBusy || isCapturingVision) && activeContinuousRecording && recorderController) {
            void stopVoiceInput({ cancel: true });
            return;
        }

        scheduleContinuousAsr(delayMs);
    }

    function pauseContinuousAsr(durationMs = 20000) {
        continuousPausedUntil = Date.now() + durationMs;
        clearContinuousRestart();
        if (recorderController) {
            void stopVoiceInput({ cancel: true });
        }
        setTransientStatus('自动 ASR 已暂停一小会儿');
        window.setTimeout(() => {
            syncContinuousAsr(0);
        }, durationMs + 50);
    }

    function isLikelyTranscriptNoise(transcript, result = {}) {
        const text = String(transcript || '').trim();
        if (!text) {
            return true;
        }
        if (/(字幕|谢谢观看|订阅|转发|点赞|Amara\.org|明镜与点点)/i.test(text)) {
            return true;
        }
        const compact = text.replace(/[\s，。！？,.!?~～…、]/g, '');
        if (!compact) {
            return true;
        }
        const durationSeconds = Number(result.duration_seconds || result.durationSeconds || 0);
        if (durationSeconds > 0 && durationSeconds < 0.45 && compact.length <= 2) {
            return true;
        }
        if (/^(.)\1{2,}$/.test(compact)) {
            return true;
        }
        return false;
    }

    function setTransientStatus(text, timeoutMs = 2200) {
        speechStatusText = text;
        updateComposerState();

        if (!text) {
            return;
        }

        window.setTimeout(() => {
            if (speechStatusText === text) {
                speechStatusText = '';
                updateComposerState();
            }
        }, timeoutMs);
    }

    async function startVoiceInput({ continuous = false } = {}) {
        if (!speechRecognition.supportsRecognition || isBusy || isRecording || isTranscribing) {
            return;
        }
        if (continuous && getRecognitionMode() !== 'continuous') {
            return;
        }

        const autoVadMode = getRecognitionMode() === 'auto-vad' || getRecognitionMode() === 'continuous';
        activeContinuousRecording = Boolean(continuous);
        speechStatusText = '正在请求麦克风权限...';
        updateComposerState();

        try {
            recorderController = await speechRecognition.createRecorder({
                preferredDeviceId: currentPreferredMicDeviceId
            });
            isRecording = true;
            speechStatusText = continuous
                ? '自动 ASR 监听中...'
                : autoVadMode
                ? '我在听，直接开口就好...'
                : '正在听你说话...';

            if (recorderController.usedFallbackDevice?.()) {
                currentPreferredMicDeviceId = '';
                setTransientStatus('已切回系统默认麦克风', 2200);
            }

            updateComposerState();
            clearRecordingTimeout();
            clearLevelPolling();

            const listenStartedAt = Date.now();
            const speechLevel = Math.max(CONFIG.ASR_CONTINUOUS_SPEECH_LEVEL, CONFIG.ASR_MIN_INPUT_LEVEL * 1.6);
            const silenceLevel = CONFIG.ASR_MIN_INPUT_LEVEL;
            let speechStarted = false;
            let speechStartAt = 0;
            let lastVoiceAt = 0;
            let voicedFrameCount = 0;
            let stopQueued = false;

            const finishAutoVad = (options = {}) => {
                if (stopQueued) {
                    return;
                }
                stopQueued = true;
                void stopVoiceInput(options);
            };

            levelPollingId = window.setInterval(() => {
                if (!recorderController) {
                    return;
                }

                const voiceActivity = recorderController.getVoiceActivity?.();
                const currentLevel = voiceActivity?.level ?? recorderController.getLevel?.() ?? 0;
                if (autoVadMode) {
                    const now = Date.now();
                    const voiceLike = voiceActivity
                        ? voiceActivity.voiceLike ||
                            (
                                currentLevel >= speechLevel * 1.35 &&
                                voiceActivity.voiceScore >= CONFIG.ASR_CONTINUOUS_VOICE_SCORE - 0.08 &&
                                voiceActivity.highRatio <= 0.48
                            )
                        : currentLevel >= speechLevel;

                    if (!speechStarted) {
                        if (voiceLike) {
                            voicedFrameCount += 1;
                            if (voicedFrameCount >= CONFIG.ASR_CONTINUOUS_VOICE_FRAMES) {
                                speechStarted = true;
                                speechStartAt = now;
                                lastVoiceAt = now;
                                speechStatusText = continuous ? '听到了，继续说...' : '听到了，继续说...';
                            } else {
                                speechStatusText = continuous ? '检测到疑似人声...' : '听到一点声音了...';
                            }
                        } else {
                            voicedFrameCount = 0;
                            speechStatusText = currentLevel >= silenceLevel
                                ? (continuous ? '自动 ASR：过滤环境声...' : '我在听，声音有点小...')
                                : (continuous ? '自动 ASR 监听中...' : '我在听，直接开口就好...');
                        }

                        if (!speechStarted && now - listenStartedAt >= CONFIG.ASR_CONTINUOUS_IDLE_MS) {
                            if (!continuous) {
                                setTransientStatus('这次没有听到你说话');
                            }
                            finishAutoVad({ cancel: true });
                            return;
                        }

                        updateComposerState();
                        return;
                    }

                    const stillVoiceLike = voiceLike ||
                        (
                            currentLevel >= silenceLevel &&
                            (!voiceActivity || voiceActivity.voiceScore >= 0.28)
                        );
                    if (stillVoiceLike) {
                        lastVoiceAt = now;
                    }

                    const speechDurationMs = now - speechStartAt;
                    const silenceDurationMs = now - lastVoiceAt;
                    if (
                        speechDurationMs >= CONFIG.ASR_CONTINUOUS_MIN_SPEECH_MS &&
                        silenceDurationMs >= CONFIG.ASR_CONTINUOUS_SILENCE_MS
                    ) {
                        speechStatusText = '收到，我来识别...';
                        updateComposerState();
                        finishAutoVad();
                        return;
                    }

                    speechStatusText = silenceDurationMs >= 420
                        ? '检测到停顿，马上收尾...'
                        : '正在听你说...';
                    updateComposerState();
                    return;
                }

                if (currentLevel >= 0.04) {
                    speechStatusText = '正在听你说话... 音量正常';
                } else if (currentLevel >= CONFIG.ASR_MIN_INPUT_LEVEL) {
                    speechStatusText = '正在听你说话... 声音有点小';
                } else {
                    speechStatusText = '正在听你说话... 目前几乎没有收到声音';
                }
                updateComposerState();
            }, 120);

            recordingTimeoutId = window.setTimeout(() => {
                void stopVoiceInput({ cancel: autoVadMode && !speechStarted });
            }, CONFIG.ASR_MAX_RECORD_MS);
        } catch (error) {
            console.error('启动本地语音识别失败：', error);
            setTransientStatus(`语音识别失败：${error.message || '无法打开麦克风'}`);
            activeContinuousRecording = false;
            syncContinuousAsr(3000);
        }
    }

    async function stopVoiceInput({ cancel = false } = {}) {
        if (!recorderController) {
            return;
        }

        const activeRecorder = recorderController;
        const wasContinuousRecording = activeContinuousRecording;
        recorderController = null;
        activeContinuousRecording = false;
        clearRecordingTimeout();
        clearLevelPolling();
        isRecording = false;
        isTranscribing = !cancel;

        if (!cancel) {
            speechStatusText = '正在本地识别语音，首次加载会稍慢...';
        } else {
            speechStatusText = '';
        }
        updateComposerState();

        try {
            const audioBlob = cancel
                ? await activeRecorder.cancel()
                : await activeRecorder.stop();

            if (cancel || !audioBlob) {
                speechStatusText = '';
                return;
            }

            const result = await speechRecognition.transcribeAudioBlob(audioBlob);
            const transcript = String(result?.text || '').trim();

            if (!transcript || isLikelyTranscriptNoise(transcript, result)) {
                if (!wasContinuousRecording) {
                    setTransientStatus('没有听清楚，再说一次吧');
                }
                return;
            }

            const visionTarget = inferVisionTargetFromText(transcript);
            if (visionTarget) {
                speechStatusText = '我先看一眼屏幕...';
                updateComposerState();
                await captureVision(visionTarget, { transientStatus: false });
            }

            inputEl.value = transcript;
            isTranscribing = false;
            speechStatusText = '';
            updateComposerState();
            sendCurrentMessage();
        } catch (error) {
            console.error('本地语音识别失败：', error);
            if (!wasContinuousRecording) {
                setTransientStatus(`语音识别失败：${error.message || '本地模型未完成识别'}`);
            }
        } finally {
            isTranscribing = false;
            updateComposerState();
            syncContinuousAsr(wasContinuousRecording ? CONFIG.ASR_CONTINUOUS_RESTART_MS : 0);
        }
    }

    async function toggleVoiceInput() {
        if (getRecognitionMode() === 'continuous') {
            pauseContinuousAsr();
            return;
        }
        if (isRecording) {
            await stopVoiceInput({ cancel: getRecognitionMode() === 'auto-vad' });
            return;
        }

        await startVoiceInput();
    }

    sendBtnEl.addEventListener('click', () => {
        sendCurrentMessage();
    });
    visionBtnEl?.addEventListener('click', toggleVisionMenu);
    visionPreviewClearEl?.addEventListener('click', clearVisionAttachment);
    visionMenuEl?.addEventListener('click', (event) => {
        const button = event.target?.closest?.('[data-vision-target]');
        if (!button) {
            return;
        }
        void captureVision(button.dataset.visionTarget || 'chat-window');
    });
    document.addEventListener('pointerdown', (event) => {
        if (
            visionMenuEl?.hidden ||
            visionMenuEl?.contains(event.target) ||
            visionBtnEl?.contains(event.target)
        ) {
            return;
        }
        closeVisionMenu();
    });
    voiceBtnEl?.addEventListener('click', () => {
        void toggleVoiceInput();
    });
    inputEl.addEventListener('input', updateComposerState);
    inputEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendCurrentMessage();
        }
    });

    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        void window.aigrilDesktop?.showControlMenu?.();
    });

    closeBtnEl.addEventListener('click', async () => {
        if (recorderController) {
            await stopVoiceInput({ cancel: true });
        }
        await window.aigrilDesktop?.hideChatWindow?.();
    });

    settingsBtnEl?.addEventListener('click', () => {
        void window.aigrilDesktop?.showControlPanel?.();
    });

    window.aigrilDesktop?.onChatEvent?.((payload = {}) => {
        if (payload.type === 'snapshot') {
            renderSnapshot(payload.messages || []);
            if (typeof payload.isBusy === 'boolean') {
                isBusy = payload.isBusy;
            }
            updateComposerState();
            syncContinuousAsr();
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
            isBusy = payload.isBusy;
            updateComposerState();
            syncContinuousAsr();
        }
    });

    window.aigrilDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) => {
        const previousMode = getRecognitionMode();
        currentRecognitionMode = preferences.recognitionMode || 'auto-vad';
        currentPreferredMicDeviceId = preferences.preferredMicDeviceId || '';
        if (previousMode === 'continuous' && getRecognitionMode() !== 'continuous' && recorderController) {
            void stopVoiceInput({ cancel: true });
        }
        updateComposerState();
        syncContinuousAsr(0);
    });

    window.addEventListener('focus', () => {
        window.aigrilDesktop?.requestChatStateSync?.();
    });

    window.addEventListener('beforeunload', () => {
        clearLevelPolling();
        clearContinuousRestart();
        if (recorderController) {
            void stopVoiceInput({ cancel: true });
        }
    });

    updateComposerState();
    syncContinuousAsr(700);
});
