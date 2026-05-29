const { contextBridge, ipcRenderer } = require('electron');

const initialPreferences = ipcRenderer.sendSync('aigril:get-preferences-sync');

contextBridge.exposeInMainWorld('aigrilDesktop', {
    platform: 'electron',
    preferences: initialPreferences,
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
    showControlMenu: () => ipcRenderer.invoke('aigril:show-control-menu'),
    closeCurrentWindow: () => ipcRenderer.invoke('aigril:close-current-window'),
    setSpeechMode: (mode) => ipcRenderer.invoke('aigril:set-speech-mode', mode),
    setRecognitionMode: (mode) => ipcRenderer.invoke('aigril:set-recognition-mode', mode),
    setPreferredMicDevice: (deviceId) => ipcRenderer.invoke('aigril:set-preferred-mic-device', deviceId),
    llm: {
        chat: (payload) => ipcRenderer.invoke('aigril:llm-chat', payload || {})
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
    dragPetWindow: (deltaX, deltaY) => {
        ipcRenderer.send('aigril:drag-pet-window', { deltaX, deltaY });
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
        listAudit: (limit) => ipcRenderer.invoke('aigril:gateway-audit-list', { limit }),
        onEvent: (listener) => {
            const wrapped = (_event, payload = {}) => listener(payload);
            ipcRenderer.on('aigril:gateway-event', wrapped);
            return () => ipcRenderer.removeListener('aigril:gateway-event', wrapped);
        }
    }
});
