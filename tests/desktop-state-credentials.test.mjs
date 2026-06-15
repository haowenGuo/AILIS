import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getDefaultState,
    saveDesktopState
} = require('../electron/store.cjs');

let stateDir;
let app;

beforeEach(() => {
    stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aigril-state-test-'));
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
