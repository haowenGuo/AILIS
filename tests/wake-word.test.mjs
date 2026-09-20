import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pcmToWav, createWakeRecorder } from '../src/realtime-voice/wake-recorder.js';
import { registerWakeWord } from '../electron/wake-word-host.cjs';

import { normalizeWakeWords, keywordText, catalog } from '../electron/wake-word-catalog.cjs';

test('default words include 帮我 and keep intimate names opt-in', () => {
    assert.deepEqual(normalizeWakeWords(), ['艾莉丝', '小艾同学', '你好助手', '帮我']);
    assert.match(keywordText(), /b āng w ǒ @帮我/);
    assert.ok(!keywordText().includes('@老婆'));
    assert.equal(catalog.length, 11);
});

test('word selection is sanitized', () => {
    const selected = normalizeWakeWords(['老婆', '老婆', 'unknown', '艾莉丝']);
    assert.deepEqual(selected, ['艾莉丝', '老婆']);
    assert.throws(() => keywordText([]), /至少/);
});

test('manual modes reject wake model loading and audio', async () => {
    const calls = new Map();
    registerWakeWord({ ipcMain: { handle: (name, fn) => calls.set(name, fn) }, getMode: () => 'fast-vad', root: '/missing' });
    const event = { sender: { id: 1 } };
    await assert.rejects(calls.get('ailis:wake-start')(event), /自动 ASR/);
    assert.throws(() => calls.get('ailis:wake-frame')(event, {}), /已关闭/);
});

test('PCM output is valid mono 16k WAV and clips samples', async () => {
    const blob = pcmToWav(new Float32Array([0, 1, -1, 2]));
    const view = new DataView(await blob.arrayBuffer());
    assert.equal(blob.type, 'audio/wav');
    assert.equal(view.getUint32(24, true), 16000);
    assert.equal(view.getUint32(40, true), 8);
    assert.equal(view.getInt16(50, true), 32767);
});

test('microphone failure releases the native wake session', async () => {
    let stopped = 0;
    const priorWindow = globalThis.window;
    const priorNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    globalThis.window = { ailisDesktop: { wake: { start: async () => {}, stop: async () => { stopped++; } } } };
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaDevices: { getUserMedia: async () => { throw new Error('denied'); } } } });
    try { await assert.rejects(createWakeRecorder(), /denied/); assert.equal(stopped, 1); }
    finally { globalThis.window = priorWindow; if (priorNavigator) Object.defineProperty(globalThis, 'navigator', priorNavigator); else delete globalThis.navigator; }
});

test('only continuous route requests wake recording; delayed results have generation guard', () => {
    const source = readFileSync(new URL('../src/chat-panel-app.js', import.meta.url), 'utf8');
    assert.match(source, /wake: continuous/);
    assert.match(source, /if \(!continuous\) recordingTimeoutId/);
    assert.match(source, /generation !== voiceGeneration/);
    assert.match(source, /!voiceStarting && !avatarSpeaking/);
});
