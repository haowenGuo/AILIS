import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { normalizeElevenLabsLanguageCode, normalizeElevenLabsVoiceProfiles } = require('../electron/store.cjs');

test('saved voice language codes survive desktop upgrades for every supported locale', () => {
    for (const language of ['zh', 'en', 'ja', 'ko']) {
        assert.equal(normalizeElevenLabsLanguageCode(language), language);
        assert.equal(normalizeElevenLabsLanguageCode(` ${language.toUpperCase()} `), language);
    }
    assert.equal(normalizeElevenLabsLanguageCode('unsupported'), 'zh');
});

test('a saved Korean voice profile is not rewritten to the global Chinese language', () => {
    const profiles = normalizeElevenLabsVoiceProfiles({
        ko: { voiceId: 'saved-korean-voice', languageCode: 'ko' }
    }, { elevenLabsLanguageCode: 'zh' });
    assert.equal(profiles.ko.languageCode, 'ko');
    assert.equal(profiles.ko.voiceId, 'saved-korean-voice');
    assert.equal(profiles.zh.languageCode, 'zh');
});
