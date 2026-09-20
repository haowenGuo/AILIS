import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { needsSpokenRewrite, prepareSpokenReply, REWRITE_INSTRUCTION } = require('../electron/ailis-spoken-reply.cjs');
const { speechDiagnostic } = require('../electron/ailis-speech-diagnostics.cjs');

test('diagnostics exclude source text, keys and provider errors', () => {
    const row = speechDiagnostic({ stage: 'tts_dispatch', text: 'private sentence', apiKey: 'secret', error: 'private provider body' });
    assert.equal(row.textChars, 16);
    assert.equal(row.textHash.length, 64);
    assert.equal(row.text, undefined);
    assert.equal(row.apiKey, undefined);
    assert.equal(row.error, undefined);
});

test('short natural replies bypass the model; long and formatted replies do not', async () => {
    for (const text of ['', '好呀，陪你聊一会儿。', '字'.repeat(150)]) {
        assert.equal(needsSpokenRewrite(text), false);
        const result = await prepareSpokenReply({ text, callModel: () => assert.fail('unexpected model call') });
        assert.equal(result.text, text);
        assert.equal(result.rewritten, false);
    }
    for (const text of ['字'.repeat(151), '```js\n1\n```', '**完成**', 'https://example.com', 'D:\\test\\a.txt', '/tmp/test/a', '- 第一项', '1. 第一项', '| a | b |']) {
        assert.equal(needsSpokenRewrite(text), true, text);
    }
});

test('full persona is preserved and only the source answer is sent as user input', async () => {
    const persona = '完整人设\n'.repeat(1000);
    const original = '# 结果\n测试通过';
    const result = await prepareSpokenReply({ text: original, persona, callModel: async request => {
        assert.equal(request.messages[0].content, `${persona}\n\n${REWRITE_INSTRUCTION}`);
        assert.deepEqual(request.messages[1], { role: 'user', content: original });
        assert.deepEqual(request.tools, []);
        assert.equal(request.recordMemory, false);
        return { ok: true, content: ' 测试通过啦。 ' };
    } });
    assert.equal(result.text, '测试通过啦。');
    assert.equal(result.rewritten, true);
});

test('failed or empty rewrites do not silently fall back to reading the long original', async () => {
    for (const result of [{ ok: false, error: 'offline' }, { ok: true, content: '' }, { ok: true, content: 'hi', toolCalls: [{}] }]) {
        await assert.rejects(prepareSpokenReply({ text: '# long', persona: 'AILIS', callModel: async () => result }));
    }
});

// Exercise the actual final-delivery method without starting a browser or a TTS service.
const source = readFileSync(new URL('../src/chat-tts-system.js', import.meta.url), 'utf8');
const method = source.slice(source.indexOf('    startCommittedBubbleSpeech('), source.indexOf('    clearChunkedSpeechSession('));
const makeMethod = (prepare) => new Function('window', 'deriveTtsSpeechText', `return ({${method}}).startCommittedBubbleSpeech;`)(
    { ailisDesktop: { tts: { prepareSpokenReply: prepare } } }, (_, text) => text
);
function host() {
    return { speechPlaybackGeneration: 0, speechProvider: { isSpeechDisabled: false },
        finishChunkedSpeechSession: async () => false,
        playPreferredSpeech: async function (value) { this.played = value; },
        showSystemNotice: function () { this.failed = true; } };
}

test('bubble and speech share rewritten text, chat original remains untouched, old audio is discarded', async () => {
    const h = host();
    const payload = { display_text: '# Original', audio_base64: 'old-audio', surface: { text: '# Original' } };
    await makeMethod(async () => ({ ok: true, text: '口播' })).call(h, payload, {});
    assert.equal(payload.display_text, '# Original');
    assert.equal(h.played.payload.display_text, '# Original');
    assert.equal(h.played.payload.speech_text, '口播');
    assert.equal(h.played.payload.bubble_text, '口播');
    assert.equal(h.played.displayText, '口播');
    assert.equal(h.played.payload.audio_base64, null);
    assert.equal(h.played.preserveMessageContent, true);
});

test('new turn/stop suppresses a late rewrite; speech off skips model', async () => {
    const h = host();
    await makeMethod(async () => { h.speechPlaybackGeneration++; return { ok: true, text: 'late' }; }).call(h, { display_text: '原文' }, {});
    assert.equal(h.played, undefined);
    h.speechProvider.isSpeechDisabled = true;
    await makeMethod(() => assert.fail('speech off')).call(h, { display_text: '原文' }, {});
    assert.equal(h.played.displayText, '原文');
});
