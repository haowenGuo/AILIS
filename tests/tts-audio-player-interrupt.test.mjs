import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

function withTimeout(promise, timeoutMs = 250) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs);
        })
    ]);
}

async function waitUntil(predicate, timeoutMs = 250) {
    const startedAt = Date.now();
    while (!predicate()) {
        if (Date.now() - startedAt > timeoutMs) {
            throw new Error(`condition not met after ${timeoutMs}ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
}

test('TTS audio player stop resolves pending playback promise', async () => {
    const previousWindow = globalThis.window;
    const previousAudio = globalThis.Audio;
    const previousCreateObjectURL = globalThis.URL.createObjectURL;
    const previousRevokeObjectURL = globalThis.URL.revokeObjectURL;

    class FakeAudio {
        constructor() {
            this.currentTime = 0;
            this.paused = true;
            this.preload = '';
            this.src = '';
            this.onended = null;
            this.onerror = null;
            this.pauseCount = 0;
        }

        load() {}

        play() {
            this.paused = false;
            return Promise.resolve();
        }

        pause() {
            this.pauseCount += 1;
            this.paused = true;
        }
    }

    globalThis.window = {
        ailisDesktop: {
            platform: 'electron',
            preferences: {}
        },
        location: {
            href: 'http://127.0.0.1:5173/pet.html',
            hostname: '127.0.0.1'
        },
        localStorage: {
            getItem() {
                return '';
            },
            setItem() {}
        },
        atob(value) {
            return Buffer.from(value, 'base64').toString('binary');
        },
        requestAnimationFrame() {
            return 1;
        },
        cancelAnimationFrame() {}
    };
    globalThis.Audio = FakeAudio;
    globalThis.URL.createObjectURL = () => 'blob:ailis-test-audio';
    globalThis.URL.revokeObjectURL = () => {};

    try {
        const moduleUrl = `${pathToFileURL(path.join(process.cwd(), 'src/tts-audio-player.js')).href}?test=${Date.now()}`;
        const { TTSAudioPlayer } = await import(moduleUrl);
        let stopSpeakingCount = 0;
        const player = new TTSAudioPlayer({
            startAudioDrivenSpeech() {},
            startFallbackSpeech() {},
            stopSpeaking() {
                stopSpeakingCount += 1;
            },
            setLipSyncValue() {}
        });

        const playback = player.playSpeech({
            audioBase64: Buffer.from('fake-audio').toString('base64'),
            mimeType: 'audio/wav',
            displayText: '正在播放的语音',
            alignment: null
        });

        await waitUntil(() => typeof player.activePlaybackStop === 'function');
        await player.stop();
        await withTimeout(playback);

        assert.ok(stopSpeakingCount >= 1);
    } finally {
        globalThis.URL.createObjectURL = previousCreateObjectURL;
        globalThis.URL.revokeObjectURL = previousRevokeObjectURL;
        if (previousAudio === undefined) {
            delete globalThis.Audio;
        } else {
            globalThis.Audio = previousAudio;
        }
        if (previousWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = previousWindow;
        }
    }
});
