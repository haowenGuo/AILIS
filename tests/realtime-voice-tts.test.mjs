import assert from 'node:assert/strict';
import test from 'node:test';

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
