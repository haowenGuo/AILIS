import {
    env,
    pipeline
} from '@xenova/transformers';
import { pinyin } from 'pinyin-pro';

import ortWasmUrl from '@xenova/transformers/dist/ort-wasm.wasm?url';
import ortWasmSimdUrl from '@xenova/transformers/dist/ort-wasm-simd.wasm?url';
import ortWasmThreadedUrl from '@xenova/transformers/dist/ort-wasm-threaded.wasm?url';
import ortWasmSimdThreadedUrl from '@xenova/transformers/dist/ort-wasm-simd-threaded.wasm?url';

const VITS_MODEL_ID = 'BricksDisplay/vits-cmn';
const VITS_SAMPLE_RATE = 16000;
const MAX_CHUNK_LENGTH = 90;
const SILENCE_SECONDS_BETWEEN_CHUNKS = 0.16;

let synthesizerPromise = null;

function configureTransformersRuntime() {
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = 'ailis-model://modelscope/';
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.wasmPaths = {
        'ort-wasm.wasm': ortWasmUrl,
        'ort-wasm-simd.wasm': ortWasmSimdUrl,
        'ort-wasm-threaded.wasm': ortWasmThreadedUrl,
        'ort-wasm-simd-threaded.wasm': ortWasmSimdThreadedUrl
    };
}

function getSynthesizer() {
    if (!synthesizerPromise) {
        configureTransformersRuntime();
        synthesizerPromise = pipeline('text-to-audio', VITS_MODEL_ID, {
            quantized: true,
            local_files_only: true
        });
    }
    return synthesizerPromise;
}

function normalizeSpeechText(text) {
    return String(text || '')
        .replace(/\s+/g, ' ')
        .replace(/[“”"「」『』（）()【】[\]{}<>《》]/g, ' ')
        .trim();
}

function splitTextIntoChunks(text) {
    const chunks = [];
    const sentences = normalizeSpeechText(text)
        .split(/(?<=[。！？!?；;，,、])/u)
        .map((part) => part.trim())
        .filter(Boolean);

    for (const sentence of sentences.length ? sentences : [normalizeSpeechText(text)]) {
        if (sentence.length <= MAX_CHUNK_LENGTH) {
            chunks.push(sentence);
            continue;
        }

        for (let index = 0; index < sentence.length; index += MAX_CHUNK_LENGTH) {
            chunks.push(sentence.slice(index, index + MAX_CHUNK_LENGTH));
        }
    }

    return chunks.filter(Boolean);
}

function textToPinyinPayload(text) {
    return pinyin(text, {
        toneType: 'symbol',
        type: 'array',
        nonZh: 'consecutive'
    })
        .map((part) => String(part || '').trim())
        .filter(Boolean)
        .join(' ')
        .replace(/[^ a-züàáèéìíòóùúāēěīńōūǎǐǒǔǘǚǜḿ]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function concatAudioSegments(segments, sampleRate = VITS_SAMPLE_RATE) {
    const silenceLength = Math.round(sampleRate * SILENCE_SECONDS_BETWEEN_CHUNKS);
    const totalLength = segments.reduce((sum, segment, index) => {
        return sum + segment.length + (index > 0 ? silenceLength : 0);
    }, 0);
    const output = new Float32Array(totalLength);
    let offset = 0;

    segments.forEach((segment, index) => {
        if (index > 0) {
            offset += silenceLength;
        }
        output.set(segment, offset);
        offset += segment.length;
    });

    return output;
}

function writeAscii(view, offset, value) {
    for (let index = 0; index < value.length; index += 1) {
        view.setUint8(offset + index, value.charCodeAt(index));
    }
}

function float32AudioToWavBytes(audio, sampleRate = VITS_SAMPLE_RATE) {
    const bytesPerSample = 2;
    const channelCount = 1;
    const dataLength = audio.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    writeAscii(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeAscii(view, 8, 'WAVE');
    writeAscii(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channelCount, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channelCount * bytesPerSample, true);
    view.setUint16(32, channelCount * bytesPerSample, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (const sample of audio) {
        const clamped = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
        offset += 2;
    }

    return new Uint8Array(buffer);
}

function bytesToBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
        const chunk = bytes.subarray(index, index + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

export async function synthesizeLocalVitsSpeech(text) {
    const cleanText = normalizeSpeechText(text);
    if (!cleanText) {
        throw new Error('VITS 输入文本不能为空');
    }

    const synthesizer = await getSynthesizer();
    const chunks = splitTextIntoChunks(cleanText);
    const audioSegments = [];
    let samplingRate = VITS_SAMPLE_RATE;

    for (const chunk of chunks) {
        const pinyinPayload = textToPinyinPayload(chunk);
        if (!pinyinPayload) {
            continue;
        }

        const result = await synthesizer(pinyinPayload);
        if (!result?.audio?.length) {
            continue;
        }

        samplingRate = result.sampling_rate || samplingRate;
        audioSegments.push(result.audio instanceof Float32Array
            ? result.audio
            : new Float32Array(result.audio)
        );
    }

    if (!audioSegments.length) {
        throw new Error('VITS 没有生成可播放音频');
    }

    const audio = concatAudioSegments(audioSegments, samplingRate);
    const wavBytes = float32AudioToWavBytes(audio, samplingRate);

    return {
        audioBase64: bytesToBase64(wavBytes),
        mimeType: 'audio/wav',
        samplingRate,
        durationSeconds: audio.length / samplingRate
    };
}
