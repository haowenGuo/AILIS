import { CONFIG } from './config.js';

const RECORDING_MIME_TYPES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4'
];

function isDesktopRuntime() {
    return window.ailisDesktop?.platform === 'electron';
}

function getRecordingMimeType() {
    if (typeof MediaRecorder === 'undefined') {
        return '';
    }

    for (const mimeType of RECORDING_MIME_TYPES) {
        if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(mimeType)) {
            return mimeType;
        }
    }

    return '';
}

function nowMs() {
    return typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();
}

function normalizeRecorderTimesliceMs(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return 200;
    }
    return Math.round(Math.min(Math.max(numericValue, 50), 1000));
}

function clampSample(sample) {
    if (sample > 1) {
        return 1;
    }
    if (sample < -1) {
        return -1;
    }
    return sample;
}

function writeAsciiString(view, offset, value) {
    for (let index = 0; index < value.length; index += 1) {
        view.setUint8(offset + index, value.charCodeAt(index));
    }
}

function mergeChannels(audioBuffer) {
    const channelCount = audioBuffer.numberOfChannels;
    const frameCount = audioBuffer.length;
    const merged = new Float32Array(frameCount);

    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
        const channelData = audioBuffer.getChannelData(channelIndex);
        for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
            merged[frameIndex] += channelData[frameIndex] / channelCount;
        }
    }

    return merged;
}

function resampleAudio(sourceSamples, sourceRate, targetRate) {
    if (sourceRate === targetRate) {
        return sourceSamples;
    }

    const targetLength = Math.max(1, Math.round(sourceSamples.length * targetRate / sourceRate));
    const result = new Float32Array(targetLength);
    const rate = sourceRate / targetRate;

    for (let index = 0; index < targetLength; index += 1) {
        const sourceIndex = index * rate;
        const leftIndex = Math.floor(sourceIndex);
        const rightIndex = Math.min(leftIndex + 1, sourceSamples.length - 1);
        const weight = sourceIndex - leftIndex;
        result[index] = sourceSamples[leftIndex] * (1 - weight) + sourceSamples[rightIndex] * weight;
    }

    return result;
}

async function decodeAudioBlobToMonoPcm(audioBlob, targetRate) {
    const audioContext = new AudioContext();

    try {
        const inputBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(inputBuffer.slice(0));
        const merged = mergeChannels(audioBuffer);
        return resampleAudio(merged, audioBuffer.sampleRate, targetRate);
    } finally {
        await audioContext.close();
    }
}

function encodePcmAsWav(samples, sampleRate) {
    const bytesPerSample = 2;
    const dataLength = samples.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    writeAsciiString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeAsciiString(view, 8, 'WAVE');
    writeAsciiString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * bytesPerSample, true);
    view.setUint16(32, bytesPerSample, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeAsciiString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let index = 0; index < samples.length; index += 1) {
        const sample = clampSample(samples[index]);
        view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
        offset += bytesPerSample;
    }

    return new Blob([buffer], { type: 'audio/wav' });
}

export function createDesktopSpeechRecognitionService() {
    const supportsRecognition = Boolean(
        isDesktopRuntime() &&
        window.ailisDesktop?.transcribeAudio &&
        navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== 'undefined' &&
        typeof AudioContext !== 'undefined'
    );

    return {
        supportsRecognition,
        async createRecorder({ preferredDeviceId = '', timesliceMs = 200 } = {}) {
            if (!supportsRecognition) {
                throw new Error('当前桌面环境不支持本地语音识别');
            }

            const buildAudioConstraints = (deviceId = '') => ({
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                ...(deviceId ? { deviceId: { exact: deviceId } } : {})
            });

            let stream = null;
            let resolvedDeviceId = '';
            let usedFallbackDevice = false;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: buildAudioConstraints(preferredDeviceId)
                });
                resolvedDeviceId = preferredDeviceId;
            } catch (error) {
                if (!preferredDeviceId) {
                    throw error;
                }

                stream = await navigator.mediaDevices.getUserMedia({
                    audio: buildAudioConstraints('')
                });
                resolvedDeviceId = '';
                usedFallbackDevice = true;
            }

            const chunks = [];
            const mimeType = getRecordingMimeType();
            const recorder = mimeType
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream);
            const recorderTimesliceMs = normalizeRecorderTimesliceMs(timesliceMs);
            const audioContext = new AudioContext();
            if (audioContext.state === 'suspended') {
                try {
                    await audioContext.resume();
                } catch (error) {
                    console.warn('恢复音频上下文失败：', error);
                }
            }
            const mediaSource = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.85;
            mediaSource.connect(analyser);
            const floatTimeDomainData = typeof analyser.getFloatTimeDomainData === 'function'
                ? new Float32Array(analyser.fftSize)
                : null;
            const byteTimeDomainData = floatTimeDomainData ? null : new Uint8Array(analyser.fftSize);
            const frequencyData = new Uint8Array(analyser.frequencyBinCount);

            let finalizeMode = 'stop';
            let isFinalized = false;
            let peakLevel = 0;

            const sampleLevel = () => {
                let maxDeviation = 0;
                let rmsAccumulator = 0;
                let sampleCount = 0;

                if (floatTimeDomainData) {
                    analyser.getFloatTimeDomainData(floatTimeDomainData);
                    sampleCount = floatTimeDomainData.length;
                    for (let index = 0; index < floatTimeDomainData.length; index += 1) {
                        const normalized = Math.abs(floatTimeDomainData[index]);
                        rmsAccumulator += normalized * normalized;
                        if (normalized > maxDeviation) {
                            maxDeviation = normalized;
                        }
                    }
                } else {
                    analyser.getByteTimeDomainData(byteTimeDomainData);
                    sampleCount = byteTimeDomainData.length;
                    for (let index = 0; index < byteTimeDomainData.length; index += 1) {
                        const normalized = Math.abs((byteTimeDomainData[index] - 128) / 128);
                        rmsAccumulator += normalized * normalized;
                        if (normalized > maxDeviation) {
                            maxDeviation = normalized;
                        }
                    }
                }

                const rms = sampleCount > 0
                    ? Math.sqrt(rmsAccumulator / sampleCount)
                    : 0;
                const measuredLevel = Math.max(maxDeviation, rms * 1.8);

                if (measuredLevel > peakLevel) {
                    peakLevel = measuredLevel;
                }

                return measuredLevel;
            };

            const sampleVoiceActivity = () => {
                const level = sampleLevel();
                analyser.getByteFrequencyData(frequencyData);

                let totalEnergy = 0;
                let voiceEnergy = 0;
                let coreVoiceEnergy = 0;
                let highEnergy = 0;
                const nyquist = audioContext.sampleRate / 2;

                for (let index = 1; index < frequencyData.length; index += 1) {
                    const frequency = index * nyquist / frequencyData.length;
                    const normalized = frequencyData[index] / 255;
                    const energy = normalized * normalized;
                    totalEnergy += energy;

                    if (frequency >= 85 && frequency <= 3600) {
                        voiceEnergy += energy;
                    }
                    if (frequency >= 160 && frequency <= 1400) {
                        coreVoiceEnergy += energy;
                    }
                    if (frequency >= 4200) {
                        highEnergy += energy;
                    }
                }

                const voiceRatio = totalEnergy > 0 ? voiceEnergy / totalEnergy : 0;
                const coreVoiceRatio = totalEnergy > 0 ? coreVoiceEnergy / totalEnergy : 0;
                const highRatio = totalEnergy > 0 ? highEnergy / totalEnergy : 0;
                const levelScore = Math.min(1, level / 0.065);
                const voiceScore = Math.max(
                    0,
                    Math.min(
                        1,
                        levelScore * 0.35 +
                            voiceRatio * 0.45 +
                            coreVoiceRatio * 0.35 -
                            highRatio * 0.35
                    )
                );

                return {
                    level,
                    voiceScore,
                    voiceLike: level >= CONFIG.ASR_MIN_INPUT_LEVEL &&
                        voiceScore >= CONFIG.ASR_CONTINUOUS_VOICE_SCORE &&
                        voiceRatio >= 0.36 &&
                        highRatio <= 0.42,
                    voiceRatio,
                    coreVoiceRatio,
                    highRatio
                };
            };

            const cleanup = () => {
                stream.getTracks().forEach((track) => track.stop());
                mediaSource.disconnect();
                analyser.disconnect();
                void audioContext.close();
            };

            const recordingPromise = new Promise((resolve, reject) => {
                recorder.addEventListener('dataavailable', (event) => {
                    if (event.data?.size) {
                        chunks.push(event.data);
                    }
                });

                recorder.addEventListener('error', (event) => {
                    cleanup();
                    reject(event.error || new Error('录音失败'));
                });

                recorder.addEventListener('stop', () => {
                    cleanup();
                    if (finalizeMode === 'cancel') {
                        resolve(null);
                        return;
                    }

                    resolve(new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' }));
                });
            });

            recorder.start(recorderTimesliceMs);

            async function finalize(mode) {
                if (isFinalized) {
                    return recordingPromise;
                }

                isFinalized = true;
                finalizeMode = mode;

                if (recorder.state !== 'inactive') {
                    recorder.stop();
                    return recordingPromise;
                }

                cleanup();
                return mode === 'cancel' ? null : new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' });
            }

            return {
                stop() {
                    return finalize('stop');
                },
                cancel() {
                    return finalize('cancel');
                },
                getLevel() {
                    return sampleLevel();
                },
                getVoiceActivity() {
                    return sampleVoiceActivity();
                },
                getPeakLevel() {
                    return peakLevel;
                },
                getResolvedDeviceId() {
                    return resolvedDeviceId;
                },
                usedFallbackDevice() {
                    return usedFallbackDevice;
                }
            };
        },
        async transcribeAudioBlob(audioBlob, options = {}) {
            if (!(audioBlob instanceof Blob) || !audioBlob.size) {
                throw new Error('录音内容为空');
            }

            const startedAt = nowMs();
            const pcmSamples = await decodeAudioBlobToMonoPcm(audioBlob, CONFIG.ASR_SAMPLE_RATE);
            const decodedAt = nowMs();
            const wavBlob = encodePcmAsWav(pcmSamples, CONFIG.ASR_SAMPLE_RATE);
            const wavBytes = new Uint8Array(await wavBlob.arrayBuffer());
            const encodedAt = nowMs();
            const preset = String(options?.preset || 'balanced').trim().toLowerCase() || 'balanced';
            const result = await window.ailisDesktop.transcribeAudio({
                audioBytes: wavBytes,
                preset
            });
            const finishedAt = nowMs();
            return {
                ...(result || {}),
                preset: result?.preset || preset,
                client_timing: {
                    decode_seconds: Number(((decodedAt - startedAt) / 1000).toFixed(3)),
                    encode_seconds: Number(((encodedAt - decodedAt) / 1000).toFixed(3)),
                    ipc_seconds: Number(((finishedAt - encodedAt) / 1000).toFixed(3)),
                    total_seconds: Number(((finishedAt - startedAt) / 1000).toFixed(3))
                }
            };
        }
    };
}
