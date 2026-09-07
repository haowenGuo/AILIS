const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ailisQuickControls', {
    getState: () => ipcRenderer.invoke('quick-controls:get'),
    apply: action => ipcRenderer.invoke('quick-controls:apply', action),
    hide: () => ipcRenderer.invoke('quick-controls:hide'),
    onState: callback => ipcRenderer.on('quick-controls:state', (_event, state) => callback(state)),
    onFocus: callback => ipcRenderer.on('quick-controls:focus', () => callback())
});
