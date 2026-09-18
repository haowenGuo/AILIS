const path = require('node:path');
const { Worker } = require('node:worker_threads');

// One worker per microphone owner; no model exists outside the opt-in mode.
function registerWakeWord({ ipcMain, getMode, getWords = () => undefined, root }) {
    const sessions = new Map();
    const watched = new WeakSet();
    function close(owner) {
        const session = sessions.get(owner);
        if (!session) return;
        sessions.delete(owner);
        for (const call of session.pending.values()) call.reject(new Error('Wake listener stopped'));
        session.pending.clear();
        void session.worker.terminate();
    }
    ipcMain.handle('ailis:wake-start', async event => {
        if (getMode() !== 'continuous') throw new Error('请先在控制面板选择自动 ASR');
        const owner = event.sender.id;
        close(owner);
        const words = require('./wake-word-catalog.cjs').normalizeWakeWords(getWords());
        if (!words.length) throw new Error('请至少选择一个唤醒词');
        const worker = new Worker(path.join(__dirname, 'wake-word-worker.cjs'), { workerData: { root, words } });
        const session = { worker, pending: new Map(), sequence: 0 };
        sessions.set(owner, session);
        if (!watched.has(event.sender)) {
            watched.add(event.sender);
            event.sender.once('destroyed', () => close(owner));
        }
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => { close(owner); reject(new Error('唤醒模型加载超时')); }, 15000);
            session.pending.set('ready', { reject: error => { clearTimeout(timeout); reject(error); } });
            const failed = () => { if (sessions.get(owner) === session) close(owner); };
            worker.on('error', failed);
            worker.on('exit', failed);
            worker.on('message', message => {
                if (message.ready) { clearTimeout(timeout); session.pending.delete('ready'); resolve(); return; }
                const call = session.pending.get(message.id);
                if (!call) return;
                session.pending.delete(message.id);
                message.error ? call.reject(new Error(message.error)) : call.resolve(message.keyword || '');
            });
        });
        return true;
    });
    ipcMain.handle('ailis:wake-frame', (event, { samples, sampleRate } = {}) => {
        const owner = event.sender.id;
        if (getMode() !== 'continuous') { close(owner); throw new Error('自动 ASR 已关闭'); }
        const session = sessions.get(owner);
        if (!session || session.pending.size || !(samples instanceof Float32Array) || samples.length > 16384 || ![16000, 44100, 48000].includes(sampleRate)) throw new Error('Invalid wake audio frame');
        const id = ++session.sequence;
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => close(owner), 5000);
            session.pending.set(id, {
                resolve: value => { clearTimeout(timeout); resolve(value); },
                reject: error => { clearTimeout(timeout); reject(error); }
            });
            session.worker.postMessage({ id, samples, sampleRate });
        });
    });
    ipcMain.handle('ailis:wake-stop', event => { close(event.sender.id); });
    return () => { for (const owner of sessions.keys()) close(owner); };
}
module.exports = { registerWakeWord };
