import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

import { mapAudioEnvelopeToMouthValue, TTSAudioPlayer } from '../src/tts-audio-player.js';

test('audio envelope mapping keeps speech visible without over-opening the mouth', () => {
    assert.equal(mapAudioEnvelopeToMouthValue(0), 0);
    assert.equal(mapAudioEnvelopeToMouthValue(0.03), 0);
    assert.ok(mapAudioEnvelopeToMouthValue(0.08) >= 0.25);
    assert.ok(mapAudioEnvelopeToMouthValue(0.08) <= 0.3);
    assert.ok(mapAudioEnvelopeToMouthValue(0.25) >= 0.5);
    assert.ok(mapAudioEnvelopeToMouthValue(0.25) <= 0.57);
    assert.equal(mapAudioEnvelopeToMouthValue(1), 0.86);
});

test('audio envelope mapping preserves visible articulation during sustained speech', () => {
    const closedSyllable = mapAudioEnvelopeToMouthValue(0.25, 0);
    const midSyllable = mapAudioEnvelopeToMouthValue(0.25, 0.5);
    const openSyllable = mapAudioEnvelopeToMouthValue(0.25, 1);

    assert.ok(closedSyllable >= 0.07);
    assert.ok(closedSyllable <= 0.1);
    assert.ok(closedSyllable < midSyllable);
    assert.ok(midSyllable < openSyllable);
    assert.ok(openSyllable - closedSyllable >= 0.4);
    assert.equal(mapAudioEnvelopeToMouthValue(1, 1), 0.86);
});

test('audio player keeps opening and closing under a sustained audio envelope', () => {
    const previousAudio = globalThis.Audio;
    globalThis.Audio = class FakeAudio {
        constructor() {
            this.currentTime = 0;
            this.preload = '';
        }
    };

    try {
        const mouthValues = [];
        const player = new TTSAudioPlayer({
            setLipSyncValue(value) {
                mouthValues.push(value);
            }
        });
        player.timeDomainData = new Uint8Array(64);
        player.analyserNode = {
            getByteTimeDomainData(buffer) {
                for (let index = 0; index < buffer.length; index += 1) {
                    buffer[index] = index % 2 === 0 ? 160 : 96;
                }
            }
        };

        for (let frame = 1; frame <= 60; frame += 1) {
            player.audioElement.currentTime = frame / 60;
            player.updateLipSyncFromAudio();
        }

        const stableValues = mouthValues.slice(10);
        assert.ok(Math.max(...stableValues) <= 0.86);
        assert.ok(Math.max(...stableValues) >= 0.8);
        assert.ok(Math.min(...stableValues) <= 0.2);
        assert.ok(Math.max(...stableValues) - Math.min(...stableValues) >= 0.6);
    } finally {
        if (previousAudio === undefined) {
            delete globalThis.Audio;
        } else {
            globalThis.Audio = previousAudio;
        }
    }
});

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
