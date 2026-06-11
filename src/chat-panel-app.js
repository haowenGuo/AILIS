import { CONFIG } from './config.js';
import { createDesktopSpeechRecognitionService } from './desktop-speech-recognition.js';
import {
    getDefaultMessageForAttachments,
    normalizeChatAttachments,
    splitChatAttachments
} from './chat-attachments.js';
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
    const chatShellEl = document.getElementById('chat-shell');
    const copyChatBtnEl = document.getElementById('copy-chat-btn');
    const clearChatBtnEl = document.getElementById('clear-chat-btn');
    const fileBtnEl = document.getElementById('file-btn');
    const filePreviewEl = document.getElementById('file-preview');
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
    let pendingFileAttachments = [];
    let fileDragDepth = 0;
    let currentMessages = [];
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

    function setIconButtonLabel(button, label) {
        if (!button) {
            return;
        }
        button.setAttribute('aria-label', label);
        button.title = label;
        const screenReaderLabel = button.querySelector('.sr-only');
        if (screenReaderLabel) {
            screenReaderLabel.textContent = label;
        }
    }

    function updateComposerState() {
        const hasDraft = Boolean(inputEl.value.trim() || pendingVisionAttachment || pendingFileAttachments.length);
        sendBtnEl.dataset.mode = isBusy ? 'interrupt' : 'send';
        setIconButtonLabel(sendBtnEl, isBusy ? '中断对话' : '发送');
        sendBtnEl.disabled = isRecording || isTranscribing || isCapturingVision || (!isBusy && !hasDraft);
        statusEl.textContent = getStatusText();

        if (voiceBtnEl) {
            voiceBtnEl.hidden = !speechRecognition.supportsRecognition;
            voiceBtnEl.disabled = !speechRecognition.supportsRecognition ||
                isTranscribing ||
                isCapturingVision ||
                (!isRecording && isBusy);
            voiceBtnEl.dataset.recording = isRecording ? 'true' : 'false';
            if (getRecognitionMode() === 'continuous') {
                voiceBtnEl.dataset.state = 'pause';
                setIconButtonLabel(voiceBtnEl, '暂停自动听');
            } else if (isRecording) {
                const isAutoVad = getRecognitionMode() === 'auto-vad';
                voiceBtnEl.dataset.state = isAutoVad ? 'cancel' : 'stop';
                setIconButtonLabel(voiceBtnEl, isAutoVad ? '取消语音输入' : '停止录音');
            } else {
                voiceBtnEl.dataset.state = 'mic';
                setIconButtonLabel(voiceBtnEl, getRecognitionMode() === 'auto-vad' ? '自动听' : '语音输入');
            }
        }

        if (visionBtnEl) {
            visionBtnEl.disabled = isBusy || isRecording || isTranscribing || isCapturingVision ||
                typeof window.aigrilDesktop?.vision?.capture !== 'function';
        }

        if (fileBtnEl) {
            fileBtnEl.disabled = isBusy || isRecording || isTranscribing || isCapturingVision ||
                typeof window.aigrilDesktop?.files?.choose !== 'function';
        }

        if (clearChatBtnEl) {
            clearChatBtnEl.disabled = isBusy || isRecording || isTranscribing || isCapturingVision;
        }

        if (copyChatBtnEl) {
            copyChatBtnEl.disabled = currentMessages.filter((message) => !message.pending).length === 0;
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

    function formatFileMeta(attachment) {
        const chunks = [
            attachment.kind === 'directory' ? '文件夹' : (attachment.sizeText || '文件'),
            attachment.extension || attachment.mimeType || '',
            attachment.path || ''
        ].filter(Boolean);
        return chunks.join(' · ');
    }

    function renderFilePreview() {
        if (!filePreviewEl) {
            return;
        }
        filePreviewEl.innerHTML = '';
        filePreviewEl.hidden = pendingFileAttachments.length === 0;
        pendingFileAttachments.forEach((attachment) => {
            const card = document.createElement('div');
            card.className = 'file-preview-card';

            const textWrap = document.createElement('div');
            textWrap.style.minWidth = '0';

            const title = document.createElement('div');
            title.className = 'file-preview-title';
            title.textContent = attachment.name || attachment.label || '文件';
            textWrap.appendChild(title);

            const meta = document.createElement('div');
            meta.className = 'file-preview-meta';
            meta.title = attachment.path || '';
            meta.textContent = formatFileMeta(attachment);
            textWrap.appendChild(meta);

            const removeButton = document.createElement('button');
            removeButton.className = 'file-preview-remove';
            removeButton.type = 'button';
            removeButton.textContent = '×';
            removeButton.setAttribute('aria-label', `移除 ${attachment.name || '文件'}`);
            removeButton.addEventListener('click', () => {
                pendingFileAttachments = pendingFileAttachments.filter((item) => item.path !== attachment.path);
                renderFilePreview();
                updateComposerState();
            });

            card.appendChild(textWrap);
            card.appendChild(removeButton);
            filePreviewEl.appendChild(card);
        });
    }

    function mergePendingFileAttachments(files = []) {
        const normalizedFiles = splitChatAttachments(files).files;
        if (!normalizedFiles.length) {
            return 0;
        }
        const byPath = new Map(pendingFileAttachments.map((attachment) => [attachment.path, attachment]));
        normalizedFiles.forEach((attachment) => {
            byPath.set(attachment.path, attachment);
        });
        pendingFileAttachments = [...byPath.values()].slice(0, 12);
        renderFilePreview();
        updateComposerState();
        return normalizedFiles.length;
    }

    async function addLocalFilePaths(paths = [], { source = 'drop' } = {}) {
        const cleanPaths = [...new Set((Array.isArray(paths) ? paths : [])
            .map((filePath) => String(filePath || '').trim())
            .filter(Boolean))];
        if (!cleanPaths.length || typeof window.aigrilDesktop?.files?.describe !== 'function') {
            return 0;
        }
        try {
            const result = await window.aigrilDesktop.files.describe({ paths: cleanPaths, source });
            const addedCount = mergePendingFileAttachments(result?.files || []);
            if (result?.skipped?.length) {
                setTransientStatus(`有 ${result.skipped.length} 个文件无法添加`);
            } else if (addedCount > 0) {
                setTransientStatus(`已添加 ${addedCount} 个文件`);
            }
            return addedCount;
        } catch (error) {
            console.error('添加文件失败：', error);
            setTransientStatus(`添加文件失败：${error.message || '无法读取文件路径'}`);
            return 0;
        }
    }

    async function chooseLocalFiles() {
        if (typeof window.aigrilDesktop?.files?.choose !== 'function') {
            return;
        }
        try {
            const result = await window.aigrilDesktop.files.choose({});
            if (result?.canceled) {
                return;
            }
            mergePendingFileAttachments(result?.files || []);
            if (result?.files?.length) {
                setTransientStatus(`已添加 ${result.files.length} 个文件`);
            }
        } catch (error) {
            console.error('选择文件失败：', error);
            setTransientStatus(`选择文件失败：${error.message || '系统文件选择器不可用'}`);
        }
    }

    function hasDraggedFiles(event) {
        return Array.from(event?.dataTransfer?.types || []).includes('Files');
    }

    function getPathForDraggedFile(file) {
        if (!file) {
            return '';
        }
        try {
            const electronPath = window.aigrilDesktop?.files?.getPathForFile?.(file);
            if (electronPath) {
                return electronPath;
            }
        } catch {
            // Fall through to legacy Electron file.path.
        }
        return file.path || '';
    }

    async function addDroppedFiles(fileList) {
        const files = Array.from(fileList || []);
        const paths = files.map(getPathForDraggedFile).filter(Boolean);
        await addLocalFilePaths(paths, { source: 'drop' });
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
        const normalizedAttachments = normalizeChatAttachments(attachments);
        if (!normalizedAttachments.length) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'message-attachments';

        const splitAttachments = splitChatAttachments(normalizedAttachments);

        splitAttachments.vision.forEach((attachment) => {
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

        splitAttachments.files.forEach((attachment) => {
            const card = document.createElement('div');
            card.className = 'message-attachment-card';

            const title = document.createElement('div');
            title.className = 'message-attachment-meta';
            title.style.marginTop = '0';
            title.style.fontWeight = '600';
            title.textContent = attachment.name || attachment.label || '文件';
            card.appendChild(title);

            const meta = document.createElement('div');
            meta.className = 'message-attachment-meta';
            meta.title = attachment.path || '';
            meta.textContent = formatFileMeta(attachment);
            card.appendChild(meta);

            wrapper.appendChild(card);
        });

        element.appendChild(wrapper);
    }

    function upsertMessage(message) {
        if (!message?.id) {
            return;
        }
        currentMessages = [
            ...currentMessages.filter((entry) => entry.id !== message.id),
            message
        ];

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
        currentMessages = currentMessages.filter((message) => message.id !== messageId);
        element.remove();
        scrollToBottom();
        updateComposerState();
    }

    function renderSnapshot(messages = []) {
        currentMessages = [];
        messageListEl.innerHTML = '';
        messages.forEach((message) => upsertMessage(message));
        scrollToBottom();
        updateComposerState();
    }

    function formatMessageForCopy(message) {
        if (message.pending) {
            return '';
        }
        const roleLabel = message.role === 'user'
            ? 'User'
            : message.role === 'assistant'
                ? 'AIGL'
                : message.role === 'system'
                    ? 'System'
                    : message.role || 'Message';
        const attachmentText = splitChatAttachments(message.attachments || []);
        const attachmentLines = [
            ...attachmentText.vision.map((attachment) => `- 截图：${attachment.label || attachment.source || '截图'}`),
            ...attachmentText.files.map((attachment) => `- 文件：${attachment.name || attachment.label || '文件'} ${attachment.path || ''}`.trim())
        ];
        return [
            `## ${roleLabel}`,
            String(message.content || '').trim(),
            attachmentLines.length ? ['附件：', ...attachmentLines].join('\n') : ''
        ].filter(Boolean).join('\n\n');
    }

    async function copyConversation() {
        const text = currentMessages
            .map(formatMessageForCopy)
            .filter(Boolean)
            .join('\n\n---\n\n')
            .trim();
        if (!text) {
            setTransientStatus('当前没有可复制的会话');
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            setTransientStatus('会话已复制到剪贴板');
        } catch (error) {
            console.error('复制会话失败：', error);
            setTransientStatus(`复制失败：${error.message || '剪贴板不可用'}`);
        }
    }

    function clearConversation() {
        if (isBusy || isRecording || isTranscribing || isCapturingVision) {
            setTransientStatus('当前正在处理，稍后再清空');
            return;
        }
        if (!window.confirm('清空当前对话窗口？长期记忆不会被删除。')) {
            return;
        }
        pendingVisionAttachment = null;
        pendingFileAttachments = [];
        renderVisionPreview();
        renderFilePreview();
        window.aigrilDesktop?.sendChatControl?.({ type: 'clear-conversation' });
    }

    function sendCurrentMessage() {
        if (isBusy) {
            window.aigrilDesktop?.sendChatControl?.({
                type: 'interrupt-conversation',
                source: 'chat-panel'
            });
            setTransientStatus('正在中断当前对话...');
            return;
        }
        const content = inputEl.value.trim();
        if (
            (!content && !pendingVisionAttachment && !pendingFileAttachments.length) ||
            isRecording ||
            isTranscribing ||
            isCapturingVision
        ) {
            return;
        }

        const attachments = normalizeChatAttachments([
            ...(pendingVisionAttachment ? [pendingVisionAttachment] : []),
            ...pendingFileAttachments
        ]);
        window.aigrilDesktop?.sendChatMessage?.({
            content: content || getDefaultMessageForAttachments(attachments),
            attachments,
            source: 'chat-panel'
        });
        if (getRecognitionMode() === 'continuous') {
            continuousPausedUntil = Date.now() + 2500;
            clearContinuousRestart();
        }
        inputEl.value = '';
        pendingVisionAttachment = null;
        pendingFileAttachments = [];
        renderVisionPreview();
        renderFilePreview();
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
    copyChatBtnEl?.addEventListener('click', () => {
        void copyConversation();
    });
    clearChatBtnEl?.addEventListener('click', clearConversation);
    fileBtnEl?.addEventListener('click', () => {
        void chooseLocalFiles();
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

    window.addEventListener('dragenter', (event) => {
        if (!hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        fileDragDepth += 1;
        if (chatShellEl) {
            chatShellEl.dataset.draggingFiles = 'true';
        }
    });
    window.addEventListener('dragover', (event) => {
        if (!hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
    window.addEventListener('dragleave', (event) => {
        if (!hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        fileDragDepth = Math.max(0, fileDragDepth - 1);
        if (fileDragDepth === 0 && chatShellEl) {
            chatShellEl.dataset.draggingFiles = 'false';
        }
    });
    window.addEventListener('drop', (event) => {
        if (!hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        fileDragDepth = 0;
        if (chatShellEl) {
            chatShellEl.dataset.draggingFiles = 'false';
        }
        void addDroppedFiles(event.dataTransfer?.files);
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
