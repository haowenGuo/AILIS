import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { getLlmConnectionMode, normalizeLlmConnectionProfiles, getDefaultState,
    loadDesktopState, saveDesktopState } = require('../electron/store.cjs');

test('mode is derived from the active transport, not a conflicting second flag', () => {
    assert.equal(getLlmConnectionMode('deepseek'), 'direct');
    assert.equal(getLlmConnectionMode('anthropic'), 'direct');
    assert.equal(getLlmConnectionMode('ailis-cloud'), 'server');
    assert.equal(getLlmConnectionMode('ollama'), 'local');
});

test('connection history strips credentials and rejects mismatched transports', () => {
    assert.deepEqual(normalizeLlmConnectionProfiles({
        direct: { provider: 'deepseek', baseUrl: ' https://example.test ', model: 'ds', apiKey: 'fake-secret', token: 'fake-token' },
        server: { provider: 'deepseek', baseUrl: 'wrong' },
        local: { provider: 'unknown', model: 'wrong' }
    }), { direct: { provider: 'deepseek', baseUrl: 'https://example.test', model: 'ds' } });
});

test('legacy active configuration migrates without changing the selected provider', () => {
    const prefs = { llmProvider: 'deepseek', llmBaseUrl: 'https://example.test/v1', llmModel: 'saved-model' };
    assert.deepEqual(normalizeLlmConnectionProfiles(undefined, prefs).direct, {
        provider: 'deepseek', baseUrl: prefs.llmBaseUrl, model: 'saved-model'
    });
});

test('managed AILIS Cloud profile always uses the official endpoint and model', () => {
    const profiles = normalizeLlmConnectionProfiles({
        server: {
            provider: 'ailis-cloud',
            baseUrl: 'https://private.example/api/llm/v1',
            model: 'user-selected-model'
        }
    });
    assert.deepEqual(profiles.server, {
        provider: 'ailis-cloud',
        baseUrl: 'https://150.109.13.189/api/llm/v1',
        model: 'ailis-cloud'
    });

    const normalized = getDefaultState();
    Object.assign(normalized.preferences, {
        llmProvider: 'ailis-cloud',
        llmBaseUrl: 'https://private.example/api/llm/v1',
        llmModel: 'user-selected-model'
    });
    const saved = normalizeLlmConnectionProfiles({}, normalized.preferences);
    assert.equal(saved.server.baseUrl, 'https://150.109.13.189/api/llm/v1');
    assert.equal(saved.server.model, 'ailis-cloud');
});

test('all three profiles survive disk reload; key and Ollama histories stay separate', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-mode-test-'));
    const app = { getPath: () => root };
    try {
        let state = getDefaultState();
        Object.assign(state.preferences, {
            llmProvider: 'deepseek', llmBaseUrl: 'https://direct.example/v1', llmModel: 'direct-model',
            llmApiKey: 'test-only-key', ollamaUsedModels: ['local-model'],
            ollamaTarget: { source: 'installed', modelId: 'local-model' }
        });
        state = saveDesktopState(app, state);
        for (const [provider, baseUrl, model] of [
            ['ailis-cloud', 'https://server.example/api/llm/v1', 'user-selected-model'],
            ['ollama', 'http://127.0.0.1:11434', 'local-model']
        ]) {
            Object.assign(state.preferences, { llmProvider: provider, llmBaseUrl: baseUrl, llmModel: model, llmApiKey: '' });
            state = saveDesktopState(app, state);
            state = loadDesktopState(app);
        }
        assert.equal(state.preferences.llmProvider, 'ollama');
        assert.equal(state.preferences.llmConnectionProfiles.direct.model, 'direct-model');
        assert.equal(state.preferences.llmConnectionProfiles.server.baseUrl, 'https://150.109.13.189/api/llm/v1');
        assert.equal(state.preferences.llmConnectionProfiles.server.model, 'ailis-cloud');
        assert.equal(state.preferences.llmConnectionProfiles.local.model, 'local-model');
        assert.equal(state.preferences.llmApiKeyProfiles.deepseek.keys[0].value, 'test-only-key');
        assert.equal(state.preferences.ollamaTarget.modelId, 'local-model');
        assert.deepEqual(state.preferences.ollamaUsedModels, ['local-model']);
        assert.ok(!JSON.stringify(state.preferences.llmConnectionProfiles).includes('test-only-key'));
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
});
