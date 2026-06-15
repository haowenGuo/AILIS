import assert from 'node:assert/strict';
import test from 'node:test';

import {
    getAsrLatencyPreset,
    isFastAsrMode,
    isVadRecognitionMode,
    normalizeAsrRecognitionMode
} from '../src/realtime-voice/asr-latency-presets.js';

const BASE_CONFIG = Object.freeze({
    ASR_MAX_RECORD_MS: 12000,
    ASR_MIN_INPUT_LEVEL: 0.01,
    ASR_CONTINUOUS_SPEECH_LEVEL: 0.02,
    ASR_CONTINUOUS_SILENCE_MS: 1100,
    ASR_CONTINUOUS_IDLE_MS: 6500,
    ASR_CONTINUOUS_RESTART_MS: 450,
    ASR_CONTINUOUS_MIN_SPEECH_MS: 380,
    ASR_CONTINUOUS_VOICE_SCORE: 0.52,
    ASR_CONTINUOUS_VOICE_FRAMES: 3
});

test('ASR recognition mode normalization preserves existing modes', () => {
    assert.equal(normalizeAsrRecognitionMode('fast-vad'), 'fast-vad');
    assert.equal(normalizeAsrRecognitionMode('auto-vad'), 'auto-vad');
    assert.equal(normalizeAsrRecognitionMode('continuous'), 'continuous');
    assert.equal(normalizeAsrRecognitionMode('manual'), 'manual');
    assert.equal(normalizeAsrRecognitionMode('unknown'), 'auto-vad');
});

test('fast-vad lowers VAD latency without changing manual semantics', () => {
    const fast = getAsrLatencyPreset('fast-vad', BASE_CONFIG);
    const balanced = getAsrLatencyPreset('auto-vad', BASE_CONFIG);
    const manual = getAsrLatencyPreset('manual', BASE_CONFIG);

    assert.equal(fast.asrPreset, 'fast');
    assert.equal(balanced.asrPreset, 'balanced');
    assert.equal(manual.autoVad, false);
    assert.equal(isFastAsrMode('fast-vad'), true);
    assert.equal(isVadRecognitionMode('manual'), false);
    assert.ok(fast.silenceMs < balanced.silenceMs);
    assert.ok(fast.levelPollingMs < balanced.levelPollingMs);
    assert.ok(fast.recorderTimesliceMs < balanced.recorderTimesliceMs);
});
