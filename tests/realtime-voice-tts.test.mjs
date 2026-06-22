import assert from 'node:assert/strict';
import test from 'node:test';

import { createSpeechProvider, SpeechProvider } from '../src/speech-provider.js';
import { createChunkedTtsSession } from '../src/realtime-voice/chunked-tts-session.js';
import { createTtsTextChunker } from '../src/realtime-voice/tts-text-chunker.js';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

test('TTS text chunker emits early punctuation chunks and flushes tail text', () => {
    const chunker = createTtsTextChunker({
        firstMinChars: 8,
        minChars: 8,
        maxChars: 30
    });

    assert.deepEqual(chunker.append('我先把第一段说出来。然后继续'), ['我先把第一段说出来。']);
    assert.deepEqual(chunker.flush(), ['然后继续']);
});

test('TTS text chunker avoids splitting incomplete code fences', () => {
    const chunker = createTtsTextChunker({
        firstMinChars: 4,
        minChars: 4,
        maxChars: 20
    });

    assert.deepEqual(chunker.append('这里有代码：\n```js\nconsole.log("hi");\n'), []);
    assert.deepEqual(chunker.append('```\n讲完了。'), [
        '这里有代码：\n```js\nconsole.log("hi");\n```',
        '讲完了。'
    ]);
    assert.deepEqual(chunker.flush(), []);
});

test('Chunked TTS session plays synthesized chunks in source order', async () => {
    const synthCalls = [];
    const played = [];
    const starts = [];

    const session = createChunkedTtsSession({
        maxConcurrentTts: 2,
        flushDelayMs: 5000,
        synthesize: async (text, { sequence }) => {
            synthCalls.push({ sequence, text });
            await sleep(sequence === 0 ? 25 : 0);
            return {
                audioBase64: Buffer.from(`audio-${sequence}`).toString('base64'),
                mimeType: 'audio/wav'
            };
        },
        audioPlayer: {
            async playSpeech({ displayText, onPlaybackStart }) {
                onPlaybackStart?.();
                played.push(displayText);
            },
            async stop() {}
        },
        onPlaybackStart: (item) => {
            starts.push(item.sequence);
        }
    });

    session.appendText('第一段应该先播放出来。第二段虽然先合成完成也要排队。');
    session.finish();
    await session.waitUntilDone();

    assert.deepEqual(synthCalls.map((entry) => entry.sequence), [0, 1]);
    assert.deepEqual(played, ['第一段应该先播放出来。', '第二段虽然先合成完成也要排队。']);
    assert.deepEqual(starts, [0]);
    assert.equal(session.hasPlaybackStarted(), true);
});

test('Chunked TTS session reports first playback before the whole queue finishes', async () => {
    let finishPlayback = null;
    let playbackDone = false;
    let playCount = 0;
    const session = createChunkedTtsSession({
        flushDelayMs: 5000,
        synthesize: async (text) => ({
            audioBase64: Buffer.from(text).toString('base64'),
            mimeType: 'audio/wav'
        }),
        audioPlayer: {
            async playSpeech({ onPlaybackStart }) {
                playCount += 1;
                onPlaybackStart?.();
                if (playCount === 1) {
                    await new Promise((resolve) => {
                        finishPlayback = resolve;
                    });
                }
            },
            async stop() {}
        }
    });

    session.appendText('第一段先开始播放。第二段稍后播放。');
    session.finish();

    const started = await session.waitUntilPlaybackStartedOrDone();
    assert.equal(started, true);
    assert.equal(session.hasPlaybackStarted(), true);

    session.waitUntilDone().then(() => {
        playbackDone = true;
    });
    await sleep(20);
    assert.equal(playbackDone, false);

    finishPlayback();
    await session.waitUntilDone();
    assert.equal(playbackDone, true);
});

test('Chunked TTS session cancels queued playback', async () => {
    let stopCount = 0;
    const session = createChunkedTtsSession({
        flushDelayMs: 5000,
        synthesize: async () => {
            await sleep(50);
            return {
                audioBase64: Buffer.from('audio').toString('base64'),
                mimeType: 'audio/wav'
            };
        },
        audioPlayer: {
            async playSpeech() {
                throw new Error('playback should not start after cancel');
            },
            async stop() {
                stopCount += 1;
            }
        }
    });

    session.appendText('这一段还没合成完成就会被取消。');
    await session.cancel('test-cancel');
    await session.waitUntilDone();

    assert.equal(stopCount, 1);
    assert.equal(session.hasPlaybackStarted(), false);
});

test('Chunked TTS session can play provider-managed chunks without audio blobs', async () => {
    const played = [];
    const session = createChunkedTtsSession({
        flushDelayMs: 5000,
        synthesize: async (text) => ({
            play: async ({ displayText, onPlaybackStart }) => {
                onPlaybackStart?.();
                played.push(displayText);
            }
        }),
        audioPlayer: {
            async playSpeech() {
                throw new Error('audio player should not be used for provider-managed playback');
            },
            async stop() {}
        }
    });

    session.appendText('第一句直接由 provider 播放。第二句也一样。');
    session.finish();
    await session.waitUntilDone();

    assert.deepEqual(played, ['第一句直接由 provider 播放。', '第二句也一样。']);
    assert.equal(session.hasPlaybackStarted(), true);
});

test('SpeechProvider wraps any synthesizable TTS candidate as chunked TTS', async () => {
    const synthCalls = [];
    const played = [];
    const provider = new SpeechProvider({
        mode: 'server',
        ttsCandidates: [
            {
                id: 'generic-api-tts',
                replyMode: 'server_tts',
                get supportsTTS() {
                    return true;
                },
                async synthesizeSpeech(text) {
                    synthCalls.push(text);
                    return {
                        audioBase64: Buffer.from(`audio:${text}`).toString('base64'),
                        mimeType: 'audio/wav'
                    };
                },
                async speak() {
                    return false;
                }
            }
        ]
    });

    assert.equal(provider.supportsChunkedTTS, true);
    assert.deepEqual(provider.replyModeFallbackChain, ['stream_text', 'server_tts']);

    const session = provider.createChunkedSession({
        flushDelayMs: 5000,
        audioPlayer: {
            async playSpeech({ displayText, onPlaybackStart }) {
                onPlaybackStart?.();
                played.push(displayText);
            },
            async stop() {}
        }
    });

    session.appendText('API 第一段先播。API 第二段继续播。');
    session.finish();
    await session.waitUntilDone();

    assert.deepEqual(synthCalls, ['API 第一段先播。', 'API 第二段继续播。']);
    assert.deepEqual(played, synthCalls);
});

test('createSpeechProvider keeps disabled speech strictly text-only', () => {
    for (const speechMode of ['off', 'local', 'vits', 'kokoro', 'auto', 'unknown']) {
        const provider = createSpeechProvider({ speechMode });
        assert.equal(provider.isSpeechDisabled, true);
        assert.equal(provider.supportsTTS, false);
        assert.equal(provider.createChunkedSession({}), null);
        assert.deepEqual(provider.replyModeFallbackChain, ['stream_text']);
    }
});

test('createSpeechProvider exposes only approved high-quality modes', () => {
    const elevenLabsProvider = createSpeechProvider({ speechMode: 'elevenlabs' });
    assert.equal(elevenLabsProvider.isSpeechDisabled, false);
    assert.equal(elevenLabsProvider.getPrimaryModeLabel(), 'server-tts');

    const cosyProvider = createSpeechProvider({ speechMode: 'cosyvoice' });
    assert.equal(cosyProvider.isSpeechDisabled, true);
    assert.equal(cosyProvider.getPrimaryModeLabel(), 'off');
});

test('SpeechProvider chunk synthesis falls back across candidate chain', async () => {
    const played = [];
    const provider = new SpeechProvider({
        mode: 'local',
        ttsCandidates: [
            {
                id: 'broken-tts',
                replyMode: 'stream_text',
                get supportsTTS() {
                    return true;
                },
                async synthesizeSpeech() {
                    throw new Error('boom');
                },
                async speak() {
                    return false;
                }
            },
            {
                id: 'fallback-tts',
                replyMode: 'stream_text',
                get supportsTTS() {
                    return true;
                },
                async synthesizeSpeech(text) {
                    return {
                        audioBase64: Buffer.from(text).toString('base64'),
                        mimeType: 'audio/wav'
                    };
                },
                async speak() {
                    return false;
                }
            }
        ]
    });

    const session = provider.createChunkedSession({
        flushDelayMs: 5000,
        audioPlayer: {
            async playSpeech({ displayText, onPlaybackStart }) {
                onPlaybackStart?.();
                played.push(displayText);
            },
            async stop() {}
        }
    });

    session.appendText('主 TTS 坏了也应该播。');
    session.finish();
    await session.waitUntilDone();

    assert.deepEqual(played, ['主 TTS 坏了也应该播。']);
    assert.match(provider.getLastTTSFailureMessage(), /boom/);
});

test('server speech provider synthesizes final text when stream payload has no audio', async () => {
    const previousWindow = globalThis.window;
    const synthCalls = [];
    const played = [];

    globalThis.window = {
        ailisDesktop: {
            platform: 'electron',
            tts: {
                synthesize: async (payload) => {
                    synthCalls.push(payload.text);
                    return {
                        ok: true,
                        audio_base64: Buffer.from(`audio:${payload.text}`).toString('base64'),
                        mime_type: 'audio/mpeg'
                    };
                }
            }
        }
    };

    try {
        const provider = createSpeechProvider({
            speechMode: 'server'
        });

        const result = await provider.playSpeech({
            payload: {
                speech_text: '最终文本也要补语音。',
                fallbackMode: true
            },
            displayText: '最终文本也要补语音。',
            alignment: null,
            audioPlayer: {
                async playSpeech({ audioBase64, displayText, onPlaybackStart }) {
                    assert.ok(audioBase64);
                    onPlaybackStart?.();
                    played.push(displayText);
                },
                async stop() {}
            },
            updateMessageContent() {},
            scrollToBottom() {},
            onAvatarPlaybackStart() {}
        });

        assert.equal(result.played, true);
        assert.equal(result.provider, 'server-tts');
        assert.deepEqual(synthCalls, ['最终文本也要补语音。']);
        assert.deepEqual(played, ['最终文本也要补语音。']);
    } finally {
        if (previousWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = previousWindow;
        }
    }
});
