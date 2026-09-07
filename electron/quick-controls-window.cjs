const path = require('node:path');

function popupBounds(point, workArea, preferred = { width: 316, height: 496 }) {
    const width = Math.min(preferred.width, workArea.width);
    const height = Math.min(preferred.height, workArea.height);
    return {
        x: Math.round(Math.max(workArea.x, Math.min(point.x - 12, workArea.x + workArea.width - width))),
        y: Math.round(Math.max(workArea.y, Math.min(point.y - 12, workArea.y + workArea.height - height))),
        width, height
    };
}

// An independent popup: never resizes, parents, or moves the avatar/chat windows.
function createQuickControls({ BrowserWindow, ipcMain, screen, loadContent, getState, applyAction }) {
    let window = null;
    let ready = null;
    let generation = 0;
    let applying = false;
    const authorized = event => window && !window.isDestroyed() &&
        event.sender === window.webContents && event.senderFrame === window.webContents.mainFrame;
    const hide = () => { generation++; window?.hide(); };
    const refresh = () => {
        if (window && !window.isDestroyed() && !window.webContents.isLoading()) {
            window.webContents.send('quick-controls:state', getState());
        }
    };
    ipcMain.handle('quick-controls:get', event => authorized(event) ? getState() : null);
    ipcMain.handle('quick-controls:hide', event => { if (authorized(event)) hide(); });
    ipcMain.handle('quick-controls:apply', async (event, action) => {
        if (!authorized(event) || applying) return { ok: false, error: 'Action unavailable' };
        applying = true;
        try {
            if (['chat', 'controlPanel', 'quit'].includes(action?.id)) hide();
            await applyAction(action);
            return { ok: true, state: getState() };
        } catch (error) {
            return { ok: false, error: String(error.message || error), state: getState() };
        } finally { applying = false; }
    });
    screen.on('display-metrics-changed', hide);
    return {
        async show() {
            const ticket = ++generation;
            const point = screen.getCursorScreenPoint();
            if (!window || window.isDestroyed()) {
                window = new BrowserWindow({
                    width: 316, height: 496, show: false, frame: false, transparent: true,
                    resizable: false, minimizable: false, maximizable: false, skipTaskbar: true,
                    alwaysOnTop: true, hasShadow: false, backgroundColor: '#00000000',
                    title: 'AILIS Quick Controls',
                    webPreferences: {
                        preload: path.join(__dirname, 'quick-controls-preload.cjs'),
                        sandbox: true, contextIsolation: true, nodeIntegration: false,
                        partition: 'ailis-quick-controls'
                    }
                });
                const current = window;
                current.on('blur', hide);
                current.on('closed', () => { if (window === current) { window = null; ready = null; } });
                current.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
                current.webContents.on('will-navigate', event => event.preventDefault());
                current.webContents.session.setPermissionRequestHandler((_web, _permission, cb) => cb(false));
                ready = loadContent(current, 'quick-controls.html');
            }
            try { await ready; }
            catch (error) { window?.destroy(); throw error; }
            if (ticket !== generation || !window || window.isDestroyed()) return;
            window.setBounds(popupBounds(point, screen.getDisplayNearestPoint(point).workArea));
            refresh();
            window.show();
            window.focus();
            window.webContents.send('quick-controls:focus');
        },
        refresh,
        dispose() {
            generation++;
            screen.removeListener('display-metrics-changed', hide);
            for (const suffix of ['get', 'hide', 'apply']) ipcMain.removeHandler(`quick-controls:${suffix}`);
            window?.destroy();
        }
    };
}

module.exports = { createQuickControls, popupBounds };
