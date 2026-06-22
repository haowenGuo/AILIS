const { contextBridge, ipcRenderer, webUtils } = require('electron');

const initialPreferences = ipcRenderer.sendSync('ailis:get-preferences-sync');

function createResourceUrl(relativePath = '') {
    const cleanPath = String(relativePath || '')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join('/');
    return `ailis-resource:///${cleanPath}`;
}

contextBridge.exposeInMainWorld('ailisDesktop', {
    platform: 'electron',
    preferences: initialPreferences,
    resourceUrl: createResourceUrl,
    versions: {
        chrome: process.versions.chrome,
        electron: process.versions.electron,
        node: process.versions.node
    },
    getControlPanelState: () => ipcRenderer.invoke('ailis:get-control-panel-state'),
    savePreferences: (payload) => ipcRenderer.invoke('ailis:save-preferences', payload),
    restoreDefaultPreferences: () => ipcRenderer.invoke('ailis:restore-default-preferences'),
    chooseAILISStateDir: () => ipcRenderer.invoke('ailis:choose-ailis-state-dir'),
    toggleChatWindow: () => ipcRenderer.invoke('ailis:toggle-chat-window'),
    showChatWindow: () => ipcRenderer.invoke('ailis:show-chat-window'),
    hideChatWindow: () => ipcRenderer.invoke('ailis:hide-chat-window'),
    showControlPanel: () => ipcRenderer.invoke('ailis:show-control-panel'),
    showAgentLab: () => ipcRenderer.invoke('ailis:show-agent-lab'),
    showControlMenu: () => ipcRenderer.invoke('ailis:show-control-menu'),
    showTextEditMenu: (payload) => ipcRenderer.invoke('ailis:show-text-edit-menu', payload || {}),
    closeCurrentWindow: () => ipcRenderer.invoke('ailis:close-current-window'),
    setSpeechMode: (mode) => ipcRenderer.invoke('ailis:set-speech-mode', mode),
    setRecognitionMode: (mode) => ipcRenderer.invoke('ailis:set-recognition-mode', mode),
    setPreferredMicDevice: (deviceId) => ipcRenderer.invoke('ailis:set-preferred-mic-device', deviceId),
    llm: {
        chat: (payload) => ipcRenderer.invoke('ailis:llm-chat', payload || {}),
        healthCheck: (payload) => ipcRenderer.invoke('ailis:llm-health-check', payload || {}),
        searchVllmModels: (payload) => ipcRenderer.invoke('ailis:vllm-model-catalog-search', payload || {})
    },
    files: {
        choose: (payload) => ipcRenderer.invoke('ailis:chat-files-choose', payload || {}),
        describe: (payload) => ipcRenderer.invoke('ailis:chat-files-describe', payload || {}),
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
        getSnapshot: (payload) => ipcRenderer.invoke('ailis:memory-snapshot', payload || {}),
        search: (payload) => ipcRenderer.invoke('ailis:memory-search', payload || {}),
        updateBlock: (payload) => ipcRenderer.invoke('ailis:memory-update-block', payload || {}),
        resetAffinity: (payload) => ipcRenderer.invoke('ailis:memory-reset-affinity', payload || {}),
        clear: (payload) => ipcRenderer.invoke('ailis:memory-clear', payload || {}),
        forget: (payload) => ipcRenderer.invoke('ailis:memory-forget', payload || {}),
        saveSecret: (payload) => ipcRenderer.invoke('ailis:memory-save-secret', payload || {}),
        deleteSecret: (payload) => ipcRenderer.invoke('ailis:memory-delete-secret', payload || {})
    },
    vision: {
        capture: (payload) => ipcRenderer.invoke('ailis:vision-capture', payload || {}),
        finishRegionSelection: (payload) => {
            ipcRenderer.send('ailis:vision-region-selected', payload || {});
        },
        cancelRegionSelection: () => {
            ipcRenderer.send('ailis:vision-region-cancelled');
        }
    },
    tts: {
        synthesize: (payload) => ipcRenderer.invoke('ailis:tts-synthesize', payload || {})
    },
    voiceRuntime: {
        diagnose: () => ipcRenderer.invoke('ailis:voice-runtime-diagnose'),
        getStatus: () => ipcRenderer.invoke('ailis:voice-runtime-status'),
        bootstrap: (payload) => ipcRenderer.invoke('ailis:voice-runtime-bootstrap', payload || {})
    },
    vllmRuntime: {
        diagnose: (payload) => ipcRenderer.invoke('ailis:vllm-runtime-diagnose', payload || {}),
        getStatus: () => ipcRenderer.invoke('ailis:vllm-runtime-status'),
        deploy: (payload) => ipcRenderer.invoke('ailis:vllm-runtime-deploy', payload || {}),
        cancel: () => ipcRenderer.invoke('ailis:vllm-runtime-cancel')
    },
    transcribeAudio: (audioBytes) => ipcRenderer.invoke('ailis:asr-transcribe', audioBytes),
    beginDragPetWindow: () => {
        ipcRenderer.send('ailis:begin-drag-pet-window', {});
    },
    dragPetWindow: (payloadOrDeltaX = {}, deltaY = 0) => {
        if (payloadOrDeltaX && typeof payloadOrDeltaX === 'object') {
            ipcRenderer.send('ailis:drag-pet-window', payloadOrDeltaX);
            return;
        }
        ipcRenderer.send('ailis:drag-pet-window', { deltaX: payloadOrDeltaX, deltaY });
    },
    endDragPetWindow: () => {
        ipcRenderer.send('ailis:end-drag-pet-window', {});
    },
    setPetMousePassthrough: (enabled) => {
        ipcRenderer.send('ailis:set-pet-mouse-passthrough', { enabled: Boolean(enabled) });
    },
    setPetDialogueExpanded: (payload) =>
        ipcRenderer.invoke('ailis:set-pet-dialogue-expanded', payload || {}),
    sendChatMessage: (content, options = {}) => {
        if (content && typeof content === 'object') {
            ipcRenderer.send('ailis:chat-send-message', content);
            return;
        }
        ipcRenderer.send('ailis:chat-send-message', { content, ...(options || {}) });
    },
    sendChatControl: (payload) => {
        ipcRenderer.send('ailis:chat-control', payload || {});
    },
    emitChatEvent: (payload) => {
        ipcRenderer.send('ailis:pet-chat-event', payload || {});
    },
    requestChatStateSync: () => {
        ipcRenderer.send('ailis:chat-state-sync-request');
    },
    onChatMessageRequest: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('ailis:chat-send-message', wrapped);
        return () => ipcRenderer.removeListener('ailis:chat-send-message', wrapped);
    },
    onChatStateSyncRequest: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('ailis:chat-state-sync-request', wrapped);
        return () => ipcRenderer.removeListener('ailis:chat-state-sync-request', wrapped);
    },
    onChatControlRequest: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('ailis:chat-control', wrapped);
        return () => ipcRenderer.removeListener('ailis:chat-control', wrapped);
    },
    onPetCursorPoint: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('ailis:pet-cursor-point', wrapped);
        return () => ipcRenderer.removeListener('ailis:pet-cursor-point', wrapped);
    },
    onChatEvent: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('ailis:chat-event', wrapped);
        return () => ipcRenderer.removeListener('ailis:chat-event', wrapped);
    },
    onPreferencesUpdated: (listener) => {
        const wrapped = (_event, payload = {}) => {
            if (payload?.preferences && typeof payload.preferences === 'object') {
                Object.assign(initialPreferences, payload.preferences);
            }
            listener(payload);
        };
        ipcRenderer.on('ailis:preferences-updated', wrapped);
        return () => ipcRenderer.removeListener('ailis:preferences-updated', wrapped);
    },
    onCharacterLabToggle: (listener) => {
        const wrapped = (_event, payload = {}) => listener(payload);
        ipcRenderer.on('ailis:character-lab-toggle', wrapped);
        return () => ipcRenderer.removeListener('ailis:character-lab-toggle', wrapped);
    },
    assistant: {
        isSupported: true,
        getStatus: () => ipcRenderer.invoke('ailis:assistant-status'),
        getToolSurface: () => ipcRenderer.invoke('ailis:assistant-tool-surface'),
        validateToolSurface: () => ipcRenderer.invoke('ailis:assistant-validate-tool-surface'),
        getHistory: (limit) => ipcRenderer.invoke('ailis:assistant-history', { limit }),
        sendMessage: (content, timeoutMs) =>
            ipcRenderer.invoke('ailis:assistant-send-message', { content, timeoutMs }),
        abortRun: (runId) => ipcRenderer.invoke('ailis:assistant-abort-run', { runId }),
        listSessions: (limit) => ipcRenderer.invoke('ailis:assistant-list-sessions', { limit }),
        setSessionKey: (sessionKey) =>
            ipcRenderer.invoke('ailis:assistant-set-session-key', { sessionKey }),
        patchSession: (patch) => ipcRenderer.invoke('ailis:assistant-patch-session', patch || {}),
        onEvent: (listener) => {
            const wrapped = (_event, payload = {}) => listener(payload);
            ipcRenderer.on('ailis:assistant-event', wrapped);
            return () => ipcRenderer.removeListener('ailis:assistant-event', wrapped);
        }
    },
    gateway: {
        isSupported: true,
        getStatus: () => ipcRenderer.invoke('ailis:gateway-status'),
        listTools: () => ipcRenderer.invoke('ailis:gateway-tools-list'),
        callTool: (payload) => ipcRenderer.invoke('ailis:gateway-tools-call', payload || {}),
        runAgent: (payload) => ipcRenderer.invoke('ailis:gateway-agent-run', payload || {}),
        interruptAgentRun: (payload) => ipcRenderer.invoke('ailis:gateway-agent-interrupt', payload || {}),
        listAudit: (limit) => ipcRenderer.invoke('ailis:gateway-audit-list', { limit }),
        onEvent: (listener) => {
            const wrapped = (_event, payload = {}) => listener(payload);
            ipcRenderer.on('ailis:gateway-event', wrapped);
            return () => ipcRenderer.removeListener('ailis:gateway-event', wrapped);
        }
    },
    agentLab: {
        isSupported: true,
        listRuns: (payload) => ipcRenderer.invoke('ailis:agent-lab-runs', payload || {}),
        getRunAnalysis: (payload) => ipcRenderer.invoke('ailis:agent-lab-analysis', payload || {}),
        runTask: (payload) => ipcRenderer.invoke('ailis:agent-lab-run', payload || {}),
        continueTask: (payload) => ipcRenderer.invoke('ailis:agent-lab-continue', payload || {}),
        interruptTask: (payload) => ipcRenderer.invoke('ailis:agent-lab-interrupt', payload || {})
    }
});
