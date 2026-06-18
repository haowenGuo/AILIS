import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getDefaultState,
    normalizeElevenLabsVoiceProfiles,
    saveDesktopState
} = require('../electron/store.cjs');

let stateDir;
let app;

beforeEach(() => {
    stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-state-test-'));
    app = {
        getPath(name) {
            assert.equal(name, 'userData');
            return stateDir;
        }
    };
});

afterEach(() => {
    fs.rmSync(stateDir, { recursive: true, force: true });
});

test('desktop state preserves saved credentials when a stale runtime saves empty values', () => {
    const existingState = getDefaultState();
    existingState.preferences.elevenLabsApiKey = 'elevenlabs-existing-key';
    existingState.preferences.elevenLabsVoiceId = 'elevenlabs-existing-voice';
    existingState.preferences.llmApiKey = 'llm-existing-key';
    existingState.preferences.emailProfiles.qq.secret = 'email-existing-secret';

    saveDesktopState(app, existingState, { preserveExistingCredentials: false });

    const staleState = getDefaultState();
    staleState.preferences.elevenLabsApiKey = '';
    staleState.preferences.elevenLabsVoiceId = '';
    staleState.preferences.llmApiKey = '';
    staleState.preferences.emailProfiles.qq.secret = '';

    const savedState = saveDesktopState(app, staleState);

    assert.equal(savedState.preferences.elevenLabsApiKey, 'elevenlabs-existing-key');
    assert.equal(savedState.preferences.elevenLabsVoiceId, 'elevenlabs-existing-voice');
    assert.equal(savedState.preferences.llmApiKey, 'llm-existing-key');
    assert.equal(savedState.preferences.emailProfiles.qq.secret, 'email-existing-secret');
});

test('desktop state allows explicit credential clearing', () => {
    const existingState = getDefaultState();
    existingState.preferences.elevenLabsApiKey = 'elevenlabs-existing-key';
    existingState.preferences.elevenLabsVoiceId = 'elevenlabs-existing-voice';

    saveDesktopState(app, existingState, { preserveExistingCredentials: false });

    const nextState = getDefaultState();
    nextState.preferences.elevenLabsApiKey = '';
    nextState.preferences.elevenLabsVoiceId = '';

    const savedState = saveDesktopState(app, nextState, {
        allowBlankCredentials: ['elevenLabsApiKey']
    });

    assert.equal(savedState.preferences.elevenLabsApiKey, '');
    assert.equal(savedState.preferences.elevenLabsVoiceId, 'elevenlabs-existing-voice');
});

test('desktop state normalizes ElevenLabs voice tuning preferences', () => {
    const state = getDefaultState();
    state.preferences.elevenLabsLanguageCode = 'JA';
    state.preferences.elevenLabsOptimizeStreamingLatency = 9;
    state.preferences.elevenLabsStability = -1;
    state.preferences.elevenLabsSimilarityBoost = 2;
    state.preferences.elevenLabsStyle = 0.333;
    state.preferences.elevenLabsSpeed = 2;
    state.preferences.elevenLabsUseSpeakerBoost = false;

    const savedState = saveDesktopState(app, state, { preserveExistingCredentials: false });

    assert.equal(savedState.preferences.elevenLabsLanguageCode, 'ja');
    assert.equal(savedState.preferences.elevenLabsOptimizeStreamingLatency, 4);
    assert.equal(savedState.preferences.elevenLabsStability, 0);
    assert.equal(savedState.preferences.elevenLabsSimilarityBoost, 1);
    assert.equal(savedState.preferences.elevenLabsStyle, 0.33);
    assert.equal(savedState.preferences.elevenLabsSpeed, 1.2);
    assert.equal(savedState.preferences.elevenLabsUseSpeakerBoost, false);
});

test('desktop state defaults ElevenLabs to Chinese gentle anime quality preset', () => {
    const state = getDefaultState();

    assert.equal(state.preferences.elevenLabsModelId, 'eleven_multilingual_v2');
    assert.equal(state.preferences.elevenLabsLanguageCode, 'zh');
    assert.equal(state.preferences.elevenLabsOptimizeStreamingLatency, 0);
    assert.equal(state.preferences.elevenLabsStability, 0.58);
    assert.equal(state.preferences.elevenLabsSimilarityBoost, 0.78);
    assert.equal(state.preferences.elevenLabsStyle, 0.05);
    assert.equal(state.preferences.elevenLabsSpeed, 0.9);
    assert.equal(state.preferences.elevenLabsVoiceProfiles.zh.languageCode, 'zh');
    assert.equal(state.preferences.elevenLabsVoiceProfiles.en.languageCode, 'en');
    assert.equal(state.preferences.elevenLabsVoiceProfiles.ja.languageCode, 'ja');
    assert.equal(state.preferences.elevenLabsVoiceProfiles.en.speed, 0.92);
    assert.equal(state.preferences.elevenLabsVoiceProfiles.ja.speed, 0.88);
});

test('desktop state migrates a legacy single ElevenLabs voice into language profiles', () => {
    const profiles = normalizeElevenLabsVoiceProfiles({}, {
        elevenLabsVoiceId: 'legacy-voice',
        elevenLabsLanguageCode: 'ja',
        elevenLabsSpeed: 0.83
    });

    assert.equal(profiles.zh.voiceId, 'legacy-voice');
    assert.equal(profiles.en.voiceId, 'legacy-voice');
    assert.equal(profiles.ja.voiceId, 'legacy-voice');
    assert.equal(profiles.ja.speed, 0.83);
    assert.equal(profiles.en.speed, 0.92);
});

test('desktop state preserves saved ElevenLabs profile voice ids when stale runtime saves blanks', () => {
    const existingState = getDefaultState();
    existingState.preferences.elevenLabsVoiceProfiles.zh.voiceId = 'zh-voice';
    existingState.preferences.elevenLabsVoiceProfiles.en.voiceId = 'en-voice';
    existingState.preferences.elevenLabsVoiceProfiles.ja.voiceId = 'ja-voice';

    saveDesktopState(app, existingState, { preserveExistingCredentials: false });

    const staleState = getDefaultState();
    staleState.preferences.elevenLabsVoiceProfiles.zh.voiceId = '';
    staleState.preferences.elevenLabsVoiceProfiles.en.voiceId = '';
    staleState.preferences.elevenLabsVoiceProfiles.ja.voiceId = '';

    const savedState = saveDesktopState(app, staleState);

    assert.equal(savedState.preferences.elevenLabsVoiceProfiles.zh.voiceId, 'zh-voice');
    assert.equal(savedState.preferences.elevenLabsVoiceProfiles.en.voiceId, 'en-voice');
    assert.equal(savedState.preferences.elevenLabsVoiceProfiles.ja.voiceId, 'ja-voice');
});

test('desktop state falls back to Chinese ElevenLabs language preset for unsupported languages', () => {
    const state = getDefaultState();
    state.preferences.elevenLabsLanguageCode = 'fr';

    const savedState = saveDesktopState(app, state, { preserveExistingCredentials: false });

    assert.equal(savedState.preferences.elevenLabsLanguageCode, 'zh');
});

test('desktop state preserves chunked TTS preference for quality comparison', () => {
    const state = getDefaultState();
    assert.equal(state.preferences.chunkedTtsEnabled, true);

    state.preferences.chunkedTtsEnabled = false;
    const savedState = saveDesktopState(app, state, { preserveExistingCredentials: false });

    assert.equal(savedState.preferences.chunkedTtsEnabled, false);
});
