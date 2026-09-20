const { parentPort, workerData } = require('node:worker_threads');
const path = require('node:path');
const fs = require('node:fs');
const { KeywordSpotter } = require('sherpa-onnx-node');
const root = workerData.root;
const keywords = require('./wake-word-catalog.cjs').keywordText(workerData.words);
const tokens = new Set(fs.readFileSync(path.join(root, 'tokens.txt'), 'utf8').trim().split(/\r?\n/).map(line => line.split(' ')[0]));
for (const line of keywords.trim().split(/\r?\n/)) {
    for (const token of line.trim().split(/\s+/)) if (!token.startsWith('@') && !tokens.has(token)) throw new Error('Invalid wake word token');
}
for (const file of ['encoder-epoch-13-avg-2-chunk-8-left-64.int8.onnx', 'decoder-epoch-13-avg-2-chunk-8-left-64.onnx', 'joiner-epoch-13-avg-2-chunk-8-left-64.int8.onnx']) {
    if (!fs.existsSync(path.join(root, file))) throw new Error('请先准备本地唤醒模型');
}
const temporary = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'ailis-kws-'));
const keywordFile = path.join(temporary, 'keywords.txt');
fs.writeFileSync(keywordFile, keywords);
let kws;
try { kws = new KeywordSpotter({
    featConfig: { sampleRate: 16000, featureDim: 80 },
    modelConfig: { transducer: {
        encoder: path.join(root, 'encoder-epoch-13-avg-2-chunk-8-left-64.int8.onnx'),
        decoder: path.join(root, 'decoder-epoch-13-avg-2-chunk-8-left-64.onnx'),
        joiner: path.join(root, 'joiner-epoch-13-avg-2-chunk-8-left-64.int8.onnx')
    }, tokens: path.join(root, 'tokens.txt'), numThreads: 1, provider: 'cpu', debug: 0 },
    keywordsFile: keywordFile
}); } finally { fs.unlinkSync(keywordFile); fs.rmdirSync(temporary); }
const stream = kws.createStream();
parentPort.postMessage({ ready: true });
parentPort.on('message', ({ id, samples, sampleRate }) => {
    try {
        stream.acceptWaveform({ samples: new Float32Array(samples), sampleRate });
        let keyword = '';
        while (kws.isReady(stream)) {
            kws.decode(stream);
            keyword ||= kws.getResult(stream).keyword;
        }
        parentPort.postMessage({ id, keyword });
    } catch (error) { parentPort.postMessage({ id, error: error.message }); }
});
