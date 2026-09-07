import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { createSpeechProvider } from '../src/speech-provider.js';

const require = createRequire(import.meta.url);
const { synthesizeHostedSpeech, normalizeHostedTtsBaseUrl, DEFAULT_HOSTED_TTS_BASE_URL } =
    require('../electron/desktop-hosted-tts.cjs');
const { getDefaultState, saveDesktopState, loadDesktopState, normalizeSpeechMode } = require('../electron/store.cjs');
const audio = Buffer.from('test-audio').toString('base64');
const response = (body, status = 200) => new Response(JSON.stringify(body), { status });

test('hosted TTS uses the web protocol and sends no keys or memory', async () => {
    let request;
    const alignment = { characters: ['h', 'i'], character_start_times_seconds: [0, 0.1] };
    const result = await synthesizeHostedSpeech({ baseUrl: 'https://voice.example/prefix/', apiKey: 'not-sent' },
        { text: '  hi\nthere  ', history: ['private'], apiKey: 'not-sent' }, {
            fetchImpl: async (url, options) => {
                request = { url, options };
                return response({ audio_base64: audio, mime_type: 'audio/mpeg', provider: 'edge',
                    voice: 'zh-CN-XiaoyiNeural', normalized_alignment: alignment, cache_hit: true });
            }
        });
    assert.equal(request.url, 'https://voice.example/prefix/api/tts/synthesize');
    assert.equal(request.options.method, 'POST');
    assert.deepEqual(JSON.parse(request.options.body), { text: 'hi there' });
    assert.deepEqual(request.options.headers, { 'Content-Type': 'application/json' });
    assert.equal(result.ok, true);
    assert.equal(result.audioBase64, audio);
    assert.equal(result.mimeType, 'audio/mpeg');
    assert.equal(result.voice, 'zh-CN-XiaoyiNeural');
    assert.deepEqual(result.alignment, alignment);
    assert.equal(result.cacheHit, true);
});

test('invalid addresses and empty text do not trigger a request', async () => {
    assert.equal(normalizeHostedTtsBaseUrl(''), DEFAULT_HOSTED_TTS_BASE_URL);
    for (const baseUrl of ['file:///tmp', 'https://user:password@example.com', 'https://example.com/?key=secret', 'invalid']) {
        assert.equal(normalizeHostedTtsBaseUrl(baseUrl), '');
        const result = await synthesizeHostedSpeech({ baseUrl }, { text: 'hi' }, {
            fetchImpl: () => assert.fail('must not send')
        });
        assert.equal(result.code, 'invalid_tts_request');
    }
    assert.equal((await synthesizeHostedSpeech({}, { text: '  ' }, {
        fetchImpl: () => assert.fail('must not send')
    })).code, 'invalid_tts_request');
});

test('service, network, empty audio and timeout failures preserve their cause', async () => {
    const failed = await synthesizeHostedSpeech({}, { text: 'hi' }, {
        fetchImpl: async () => response({ detail: { message: 'edge provider unavailable' } }, 503)
    });
    assert.equal(failed.ok, false);
    assert.equal(failed.error, 'edge provider unavailable');
    const empty = await synthesizeHostedSpeech({}, { text: 'hi' }, { fetchImpl: async () => response({}) });
    assert.equal(empty.code, 'empty_tts_audio');
    const invalid = await synthesizeHostedSpeech({}, { text: 'hi' }, { fetchImpl: async () => new Response('<html>proxy error</html>', { status: 502 }) });
    assert.match(invalid.error, /502/);
    const network = await synthesizeHostedSpeech({}, { text: 'hi' }, {
        fetchImpl: async () => { throw new Error('fetch failed', { cause: new Error('ECONNRESET') }); }
    });
    assert.match(network.error, /ECONNRESET/);
    const timeout = await synthesizeHostedSpeech({ timeoutMs: 10 }, { text: 'hi' }, {
        fetchImpl: (_url, { signal }) => new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
        })
    });
    assert.equal(timeout.code, 'tts_timeout');
});

test('hosted voice and custom address survive reload without touching LLM or ElevenLabs settings', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-hosted-tts-test-'));
    const app = { getPath: () => root };
    try {
        const state = getDefaultState();
        Object.assign(state.preferences, { speechMode: 'hosted', hostedTtsBaseUrl: 'https://voice.example/',
            llmProvider: 'deepseek', llmApiKey: 'fake-llm-key', elevenLabsApiKey: 'fake-voice-key' });
        saveDesktopState(app, state);
        const loaded = loadDesktopState(app);
        assert.equal(loaded.preferences.speechMode, 'hosted');
        assert.equal(loaded.preferences.hostedTtsBaseUrl, 'https://voice.example');
        assert.equal(loaded.preferences.llmProvider, 'deepseek');
        assert.equal(loaded.preferences.llmApiKey, 'fake-llm-key');
        assert.equal(loaded.preferences.elevenLabsApiKey, 'fake-voice-key');
        assert.equal(normalizeSpeechMode('server'), 'server');
        assert.equal(normalizeSpeechMode('cosyvoice3'), 'cosyvoice3');
        assert.equal(normalizeSpeechMode('off'), 'off');
    } finally {
        assert.ok(root.startsWith(path.join(os.tmpdir(), 'ailis-hosted-tts-test-')));
        fs.rmSync(root, { recursive: true, force: true });
    }
});

test('desktop IPC dispatch keeps hosted voice separate from paid and local providers', async () => {
    const source = fs.readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
    const start = source.indexOf('async function callDesktopTts(');
    const end = source.indexOf('\nfunction warmupDesktopSpeechMode(', start);
    const calls = [];
    const callDesktopTts = vm.runInNewContext(`${source.slice(start, end)}; callDesktopTts`, {
        desktopState: { preferences: { hostedTtsBaseUrl: 'https://saved.example' } },
        synthesizeHostedSpeech: (settings, payload) => { calls.push({ settings, payload }); return { ok: true, provider: 'edge' }; },
        callDesktopElevenLabsTts: () => ({ ok: true, provider: 'elevenlabs' }),
        getVoiceRuntimeBootstrap: () => { throw new Error('local runtime should not be touched'); }
    });
    assert.equal((await callDesktopTts({ provider: 'hosted', text: 'hi' })).provider, 'edge');
    assert.equal(calls[0].settings.baseUrl, 'https://saved.example');
    assert.equal((await callDesktopTts({ text: 'hi' })).provider, 'elevenlabs');
    assert.equal((await callDesktopTts({ provider: 'server', text: 'hi' })).provider, 'elevenlabs');
    assert.equal(calls.length, 1);
});

test('desktop hosted speech uses shared chunk playback and off mode makes zero calls', async () => {
    const previousWindow = globalThis.window;
    const calls = [];
    const played = [];
    let playbackStarts = 0;
    globalThis.window = { ailisDesktop: { platform: 'electron', tts: {
        synthesize: async (payload) => { calls.push(payload); return { ok: true, audioBase64: audio, mimeType: 'audio/mpeg' }; }
    } } };
    try {
        const provider = createSpeechProvider({ speechMode: 'hosted' });
        assert.equal(provider.mode, 'hosted');
        assert.equal(provider.getPrimaryModeLabel(), 'hosted-tts');
        assert.equal(provider.ttsCandidates.length, 1);
        assert.equal(provider.supportsChunkedTTS, true);
        const session = provider.createChunkedSession({
            audioPlayer: { playSpeech: async (item) => {
                played.push(item.displayText);
                assert.equal(item.audioBase64, audio);
                assert.equal(item.mimeType, 'audio/mpeg');
                item.onPlaybackStart?.();
            }, stop: async () => {} },
            onPlaybackStart: () => playbackStarts++
        });
        session.appendText('这是网页同款语音的第一句话。这里是第二句话。');
        session.finish();
        await session.waitUntilDone();
        assert.ok(calls.length > 0);
        assert.ok(calls.every(call => call.provider === 'hosted'));
        assert.equal(played.join(''), '这是网页同款语音的第一句话。这里是第二句话。');
        assert.equal(playbackStarts, 1);
        const count = calls.length;
        for (const options of [{ speechMode: 'off' }, { speechMode: 'hosted', enableTTS: false }]) {
            const off = createSpeechProvider(options);
            assert.equal(off.createChunkedSession({}), null);
            assert.equal((await off.playSpeech({ displayText: 'must not synthesize' })).played, false);
        }
        assert.equal(calls.length, count);
    } finally { globalThis.window = previousWindow; }
});
