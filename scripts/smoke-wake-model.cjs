const { Worker } = require('node:worker_threads');
const path = require('node:path');
const { readWave } = require('sherpa-onnx-node');
const root = path.join(__dirname, '..');
const words = process.argv[4] ? JSON.parse(process.argv[4]) : undefined;
const worker = new Worker(path.join(root, 'electron/wake-word-worker.cjs'), { workerData: { root: path.join(root, 'build-cache/ailis-wake-model'), words } });
const wave = readWave(process.argv[2]);
const samples = new Float32Array(wave.samples.length + wave.sampleRate);
samples.set(wave.samples);
let offset = 0, id = 0, started = 0;
const hits = [];
const timer = setTimeout(() => { console.error('timeout'); process.exitCode = 1; void worker.terminate(); }, 30000);
worker.on('error', error => { console.error(error); process.exitCode = 1; clearTimeout(timer); });
worker.on('message', message => {
    if (message.error) { console.error(message.error); process.exitCode = 1; clearTimeout(timer); void worker.terminate(); return; }
    if (message.ready) started = performance.now();
    if (message.keyword) hits.push(message.keyword);
    if (offset >= samples.length) {
        const elapsedMs = performance.now() - started;
        console.log(JSON.stringify({ hits, elapsedMs, audioSeconds: samples.length / wave.sampleRate, rtf: elapsedMs / 1000 / (samples.length / wave.sampleRate) }));
        if (process.argv[3] && !hits.includes(process.argv[3])) process.exitCode = 1;
        clearTimeout(timer); void worker.terminate(); return;
    }
    const frame = samples.slice(offset, offset + 4096); offset += frame.length;
    worker.postMessage({ id: ++id, samples: frame, sampleRate: wave.sampleRate });
});
