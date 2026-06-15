const { contextBridge, ipcRenderer, webUtils } = require('electron');

const initialPreferences = ipcRenderer.sendSync('aigril:get-preferences-sync');

function createResourceUrl(relativePath = '') {
    const cleanPath = String(relativePath || '')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join('/');
    return `aigril-resource:///${cleanPath}`;
}

contextBridge.exposeInMainWorld('aigrilDesktop', {
    platform: 'electron',
    preferences: initialPreferences,
    resourceUrl: createResourceUrl,
    versions: {
        chrome: process.versions.chrome,
        electron: process.versions.electron,
        node: process.versions.node
    },
    getControlPanelState: () => ipcRenderer.invoke('aigril:get-control-panel-state'),
    savePreferences: (payload) => ipcRenderer.invoke('aigril:save-preferences', payload),
    restoreDefaultPreferences: () => ipcRenderer.invoke('aigril:restore-default-preferences'),
    chooseHumanClawStateDir: () => ipcRenderer.invoke('aigril:choose-humanclaw-state-dir'),
    toggleChatWindow: () => ipcRenderer.invoke('aigril:toggle-chat-window'),
    showChatWindow: () => ipcRenderer.invoke('aigril:show-chat-window'),
    hideChatWindow: () => ipcRenderer.invoke('aigril:hide-chat-window'),
    showControlPanel: () => ipcRenderer.invoke('aigril:show-control-panel'),
    showAgentLab: () => ipcRenderer.invoke('aigril:show-agent-lab'),
    showControlMenu: () => ipcRenderer.invoke('aigril:show-control-menu'),
    showTextEditMenu: (payload) => ipcRenderer.invoke('aigril:show-text-edit-menu', payload || {}),
    closeCurrentWindow: () => ipcRenderer.invoke('aigril:close-current-window'),
    setSpeechMode: (mode) => ipcRenderer.invoke('aigril:set-speech-mode', mode),
    setRecognitionMode: (mode) => ipcRenderer.invoke('aigril:set-recognition-mode', mode),
    setPreferredMicDevice: (deviceId) => ipcRenderer.invoke('aigril:set-preferred-mic-device', deviceId),
    llm: {
        chat: (payload) => ipcRenderer.invoke('aigril:llm-chat', payload || {}),
        healthCheck: (payload) => ipcRenderer.invoke('aigril:llm-health-check', payload || {})
    },
    files: {
        choose: (payload) => ipcRenderer.invoke('aigril:chat-files-choose', payload || {}),
        describe: (payload) => ipcRenderer.invoke('aigril:chat-files-describe', payload || {}),
        getPathForFile: (file) => {
            try {
                if (webUtils?.getPathForFile && file) {
                    return webUtils.getPathForFile(file) || '';
                }
            } catch {
                return '';
            }
            return file?.path || '';
        }
    },
    memory: {
        getSnapshot: (payload) => ipcRenderer.invoke('aigril:memory-snapshot', payload || {}),
        search: (payload) => ipcRenderer.invoke('aigril:memory-search', payload || {}),
        updateBlock: (payload) => ipcRenderer.invoke('aigril:memory-update-block', payload || {}),
        resetAffinity: (payload) => ipcRenderer.invoke('aigril:memory-reset-affinity', payload || {}),
        forget: (payload) => ipcRenderer.invoke('aigril:memory-forget', payload || {}),
        saveSecret: (payload) => ipcRenderer.invoke('aigril:memory-save-secret', payload || {}),
        deleteSecret: (payload) => ipcRenderer.invoke('aigril:memory-delete-secret', payload || {})
    },
    vision: {
        capture: (payload) => ipcRenderer.invoke('aigril:vision-capture', payload || {}),
        finishRegionSelection: (payload) => {
            ipcRenderer.send('aigril:vision-region-selected', payload || {});
        },
        cancelRegionSelection: () => {
            ipcRenderer.send('aigril:vision-region-cancelled');
        }
    },
    tts: {
        synthesize: (payload) => ipcRenderer.invoke('aigril:tts-synthesize', payload || {})
    },
    transcribeAudio: (audioBytes) => ipcRenderer.invoke('aigril:asr-transcribe', audioBytes),
    beginDragPetWindow: () => {
        ipcRenderer.send('aigril:begin-drag-pet-window', {});
    },
    dragPetWindow: (payloadOrDeltaX = {}, deltaY = 0) => {
        if (payloadOrDeltaX && typeof payloadOrDeltaX === 'object') {
            ipcRenderer.send('aigril:drag-pet-window', payloadOrDeltaX);
            return;
        }
        ipcRenderer.send('aigril:drag-pet-window', { deltaX: payloadOrDeltaX, deltaY });
    },
    endDragPetWindow: () => {
        ipcRenderer.send('aigril:end-drag-pet-window', {});
    },
    setPetMousePassthrough: (enabled) => {
        ipcRenderer.send('aigril:set-pet-mouse-passthrough', { enabled: Boolean(enabled) });
    },
    setPetDialogueExpanded: (payload) =>
        ipcRenderer.invoke('aigril:set-pet-dialogue-expanded', payload || {}),
    sendChatMessage: (content, options = {}) => {
        if (content && typeof content === 'object') {
            ipcRenderer.send('aigril:chat-send-message', content);
            return;
        }
        ipcRenderer.send('aigril:chat-send-message', { content, ...(options || {}) });
    },
    sendChatControl: (payload) => {
        ipcRenderer.send('aigril:chat-control', payload || {});
    },
    emitChatEvent: (payload) => {
        ipcRenderer.send('aigril:pet-chat-event', payload || {});
    },
    requestChatStateSync: () => {
        ipcRenderer.send('aigril:chat-state-sync-request');
    },
    onChatMessageRequest: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('aigril:chat-send-message', wrapped);
        return () => ipcRenderer.removeListener('aigril:chat-send-message', wrapped);
    },
    onChatStateSyncRequest: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('aigril:chat-state-sync-request', wrapped);
        return () => ipcRenderer.removeListener('aigril:chat-state-sync-request', wrapped);
    },
    onChatControlRequest: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('aigril:chat-control', wrapped);
        return () => ipcRenderer.removeListener('aigril:chat-control', wrapped);
    },
    onPetCursorPoint: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('aigril:pet-cursor-point', wrapped);
        return () => ipcRenderer.removeListener('aigril:pet-cursor-point', wrapped);
    },
    onChatEvent: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('aigril:chat-event', wrapped);
        return () => ipcRenderer.removeListener('aigril:chat-event', wrapped);
    },
    onPreferencesUpdated: (listener) => {
        const wrapped = (_event, payload = {}) => {
            if (payload?.preferences && typeof payload.preferences === 'object') {
                Object.assign(initialPreferences, payload.preferences);
            }
            listener(payload);
        };
        ipcRenderer.on('aigril:preferences-updated', wrapped);
        return () => ipcRenderer.removeListener('aigril:preferences-updated', wrapped);
    },
    onCharacterLabToggle: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('aigril:character-lab-toggle', wrapped);
        return () => ipcRenderer.removeListener('aigril:character-lab-toggle', wrapped);
    },
    assistant: {
        isSupported: true,
        getStatus: () => ipcRenderer.invoke('aigril:assistant-status'),
        getToolSurface: () => ipcRenderer.invoke('aigril:assistant-tool-surface'),
        validateToolSurface: () => ipcRenderer.invoke('aigril:assistant-validate-tool-surface'),
        getHistory: (limit) => ipcRenderer.invoke('aigril:assistant-history', { limit }),
        sendMessage: (content, timeoutMs) =>
            ipcRenderer.invoke('aigril:assistant-send-message', { content, timeoutMs }),
        abortRun: (runId) => ipcRenderer.invoke('aigril:assistant-abort-run', { runId }),
        listSessions: (limit) => ipcRenderer.invoke('aigril:assistant-list-sessions', { limit }),
        setSessionKey: (sessionKey) =>
            ipcRenderer.invoke('aigril:assistant-set-session-key', { sessionKey }),
        patchSession: (patch) => ipcRenderer.invoke('aigril:assistant-patch-session', patch || {}),
        onEvent: (listener) => {
            const wrapped = (_event, payload = {}) => listener(payload);
            ipcRenderer.on('aigril:assistant-event', wrapped);
            return () => ipcRenderer.removeListener('aigril:assistant-event', wrapped);
        }
    },
    gateway: {
        isSupported: true,
        getStatus: () => ipcRenderer.invoke('aigril:gateway-status'),
        listTools: () => ipcRenderer.invoke('aigril:gateway-tools-list'),
        callTool: (payload) => ipcRenderer.invoke('aigril:gateway-tools-call', payload || {}),
        runAgent: (payload) => ipcRenderer.invoke('aigril:gateway-agent-run', payload || {}),
        interruptAgentRun: (payload) => ipcRenderer.invoke('aigril:gateway-agent-interrupt', payload || {}),
        listAudit: (limit) => ipcRenderer.invoke('aigril:gateway-audit-list', { limit }),
        onEvent: (listener) => {
            const wrapped = (_event, payload = {}) => listener(payload);
            ipcRenderer.on('aigril:gateway-event', wrapped);
            return () => ipcRenderer.removeListener('aigril:gateway-event', wrapped);
        }
    },
    agentLab: {
        isSupported: true,
        listRuns: (payload) => ipcRenderer.invoke('aigril:agent-lab-runs', payload || {}),
        getRunAnalysis: (payload) => ipcRenderer.invoke('aigril:agent-lab-analysis', payload || {}),
        runTask: (payload) => ipcRenderer.invoke('aigril:agent-lab-run', payload || {}),
        continueTask: (payload) => ipcRenderer.invoke('aigril:agent-lab-continue', payload || {}),
        interruptTask: (payload) => ipcRenderer.invoke('aigril:agent-lab-interrupt', payload || {})
    }
});
