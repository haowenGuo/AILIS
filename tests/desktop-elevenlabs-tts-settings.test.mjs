import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { synthesizeElevenLabsSpeech } = require('../electron/desktop-elevenlabs-tts.cjs');

const originalFetch = globalThis.fetch;
let capturedRequest = null;

afterEach(() => {
    globalThis.fetch = originalFetch;
    capturedRequest = null;
});

test('ElevenLabs desktop TTS forwards control-panel voice tuning settings', async () => {
    globalThis.fetch = async (url, options) => {
        capturedRequest = {
            url: String(url),
            body: JSON.parse(options.body)
        };
        return {
            ok: true,
            async json() {
                return {
                    audio_base64: Buffer.from('audio').toString('base64'),
                    alignment: {
                        characters: ['你'],
                        character_start_times_seconds: [0],
                        character_end_times_seconds: [0.2]
                    }
                };
            }
        };
    };

    const result = await synthesizeElevenLabsSpeech({
        apiBase: 'https://api.elevenlabs.io',
        apiKey: 'test-key',
        voiceId: 'voice-id',
        modelId: 'eleven_flash_v2_5',
        languageCode: 'zh',
        outputFormat: 'mp3_44100_128',
        optimizeStreamingLatency: 1,
        stability: 0.51,
        similarityBoost: 0.72,
        style: 0.18,
        speed: 0.92,
        useSpeakerBoost: true
    }, {
        text: '你好'
    });

    assert.equal(result.ok, true);
    assert.match(capturedRequest.url, /optimize_streaming_latency=1/);
    assert.equal(capturedRequest.body.model_id, 'eleven_flash_v2_5');
    assert.equal(capturedRequest.body.language_code, 'zh');
    assert.deepEqual(capturedRequest.body.voice_settings, {
        stability: 0.51,
        similarity_boost: 0.72,
        style: 0.18,
        speed: 0.92,
        use_speaker_boost: true
    });
});
