const { app, BrowserWindow, session } = require('electron');
const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { registerWakeWord } = require('../electron/wake-word-host.cjs');
const root = path.resolve(__dirname, '..');
const watchdog = setTimeout(() => { fs.writeFileSync(path.join(root, 'build-cache/wake-electron-result.json'), JSON.stringify({ ok: false, error: 'whole-test timeout' })); app.exit(1); }, 40000);
app.setPath('userData', path.join(root, 'build-cache/wake-electron-profile'));
app.commandLine.appendSwitch('use-fake-ui-for-media-stream');
app.commandLine.appendSwitch('use-fake-device-for-media-stream');
app.commandLine.appendSwitch('use-file-for-fake-audio-capture', path.join(root, 'build-cache/wake-download/catalog-2.wav'));
const server = createServer((req, res) => {
    const files = {
        '/wake-recorder.js': 'src/realtime-voice/wake-recorder.js',
        '/wake-audio-worklet.js': 'src/realtime-voice/wake-audio-worklet.js'
    };
    if (files[req.url]) { res.setHeader('content-type', 'text/javascript'); res.end(fs.readFileSync(path.join(root, files[req.url]))); }
    else { res.setHeader('content-type', 'text/html'); res.end('<!doctype html><title>Wake smoke</title>'); }
});
let mode = 'fast-vad', closeWake;
app.whenReady().then(async () => {
    try {
        const { normalizeState } = require('../electron/store.cjs');
        const state = normalizeState({ preferences: { wakeWords: ['艾莉丝', '老婆'] } });
        assert.deepEqual(normalizeState(JSON.parse(JSON.stringify(state))).preferences.wakeWords, ['艾莉丝', '老婆']);
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        session.defaultSession.setPermissionRequestHandler((_, __, callback) => callback(true));
        closeWake = registerWakeWord({ ipcMain: require('electron').ipcMain, getMode: () => mode, root: path.join(root, 'build-cache/ailis-wake-model') });
        const win = new BrowserWindow({ show: false, webPreferences: { preload: path.join(__dirname, 'wake-electron-preload.cjs'), contextIsolation: true, backgroundThrottling: false } });
        await win.loadURL(`http://127.0.0.1:${server.address().port}`);
        win.webContents.on('console-message', (_event, _level, message) => console.log('renderer', message));
        assert.equal(await win.webContents.executeJavaScript("window.ailisDesktop.wake.start().then(()=>false,()=>true)"), true);
        mode = 'continuous';
        console.log('manual gate passed');
        const result = await win.webContents.executeJavaScript(`(async () => {
            const { createWakeRecorder } = await import('/wake-recorder.js');
            let recorder;
            try { recorder = await createWakeRecorder(); }
            catch (error) { return { failure: 'create', message: String(error), name: error?.name }; }
            const started = Date.now();
            try {
                while (Date.now() - started < 20000) {
                    const state = recorder.getWakeState();
                    if (state.failure) throw state.failure;
                    if (state.keyword) {
                        await new Promise(r => setTimeout(r, 2000));
                        const blob = await recorder.stop();
                        const bytes = new DataView(await blob.arrayBuffer());
                        return { keyword: state.keyword, size: blob.size, sampleRate: bytes.getUint32(24, true) };
                    }
                    await new Promise(r => setTimeout(r, 100));
                }
                throw new Error('wake timeout');
            } catch (error) { return { failure: 'capture', message: String(error), name: error?.name }; }
            finally { await recorder.cancel(); }
        })().catch(error => ({ failure: 'outer-renderer', message: String(error), name: error?.name }))`, true);
        console.log('WAKE_ELECTRON_RESULT', JSON.stringify(result));
        assert.equal(result.keyword, '你好助手');
        assert.equal(result.sampleRate, 16000);
        assert.ok(result.size > 32000);
        console.log('WAKE_ELECTRON_PASS', JSON.stringify(result));
        fs.writeFileSync(path.join(root, 'build-cache/wake-electron-result.json'), JSON.stringify({ ok: true, ...result }));
    } catch (error) {
        fs.writeFileSync(path.join(root, 'build-cache/wake-electron-result.json'), JSON.stringify({ ok: false, error: String(error), details: JSON.stringify(error, Object.getOwnPropertyNames(error)) }));
        console.error(String(error), JSON.stringify(error, Object.getOwnPropertyNames(error))); process.exitCode = 1;
    }
    finally { clearTimeout(watchdog); closeWake?.(); server.close(); app.exit(process.exitCode || 0); }
});
