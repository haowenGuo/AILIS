// Opt-in microphone path. Audio stays in a bounded RAM buffer until a keyword fires.
export function pcmToWav(samples, rate = 16000) {
    const bytes = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(bytes);
    const text = (offset, value) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    text(0, 'RIFF'); view.setUint32(4, bytes.byteLength - 8, true); text(8, 'WAVE');
    text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, samples.length * 2, true);
    samples.forEach((n, i) => view.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, n)) * 32767), true));
    return new Blob([bytes], { type: 'audio/wav' });
}

export async function createWakeRecorder({ preferredDeviceId = '' } = {}) {
    const api = window.ailisDesktop.wake;
    if (!api) throw new Error('当前版本未提供唤醒接口');
    await api.start();
    let stream, context, source, node;
    let stopped = false, keyword = '', failure = null, level = 0, pending = false;
    let chunks = [], length = 0;
    let cleanupTask;
    const cleanup = () => cleanupTask ||= (async () => {
        stopped = true;
        node?.disconnect(); source?.disconnect();
        stream?.getTracks().forEach(track => track.stop());
        if (context) await context.close();
        await api.stop().catch(() => {});
    })();
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: {
            channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true,
            ...(preferredDeviceId ? { deviceId: { exact: preferredDeviceId } } : {})
        } });
        context = new AudioContext({ sampleRate: 16000 });
        if (context.sampleRate !== 16000) throw new Error('唤醒录音需要 16kHz 音频');
        await context.audioWorklet.addModule(new URL('./wake-audio-worklet.js', import.meta.url));
        source = context.createMediaStreamSource(stream);
        node = new AudioWorkletNode(context, 'ailis-wake-pcm');
        node.port.onmessage = async ({ data }) => {
            if (stopped) return;
            let sum = 0;
            for (const sample of data) sum += sample * sample;
            level = Math.sqrt(sum / data.length) * 1.8;
            chunks.push(data); length += data.length;
            // Keep pre-roll including the trigger; retain the whole command after wake.
            while (!keyword && length > 16000 * 3 && chunks.length > 1) length -= chunks.shift().length;
            if (length > 16000 * 20) { failure = new Error('语音片段超长，请重试'); await cleanup(); return; }
            if (keyword) return;
            if (pending) { failure = new Error('唤醒检测处理过慢，请重试'); await cleanup(); return; }
            pending = true;
            try { const detected = await api.frame({ samples: data, sampleRate: 16000 }); if (!stopped) keyword = detected; }
            catch (error) { if (!stopped) { failure = error; await cleanup(); } }
            finally { pending = false; }
        };
        source.connect(node); node.connect(context.destination);
        await context.resume();
    } catch (error) { await cleanup(); throw error; }
    return {
        getWakeState: () => ({ keyword, failure }),
        getLevel: () => level,
        getVoiceActivity: () => ({ level, voiceLike: level >= 0.015, voiceScore: level >= 0.015 ? 1 : 0, highRatio: 0 }),
        usedFallbackDevice: () => false,
        async cancel() { await cleanup(); chunks = []; length = 0; return null; },
        async stop() {
            await cleanup();
            if (!keyword || failure) return null;
            const samples = new Float32Array(length);
            let offset = 0;
            for (const chunk of chunks) { samples.set(chunk, offset); offset += chunk.length; }
            chunks = []; length = 0;
            return pcmToWav(samples);
        }
    };
}
