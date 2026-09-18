const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('ailisDesktop', { wake: {
    start: () => ipcRenderer.invoke('ailis:wake-start'),
    frame: payload => ipcRenderer.invoke('ailis:wake-frame', payload),
    stop: () => ipcRenderer.invoke('ailis:wake-stop')
} });
