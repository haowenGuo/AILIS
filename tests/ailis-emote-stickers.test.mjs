import assert from 'node:assert/strict';
import test from 'node:test';

import {
    AILIS_EMOTE_STICKERS,
    resolveAilisEmoteSticker,
    splitTextByAilisEmoteTokens
} from '../src/ailis-emote-stickers.js';

test('AILIS emote stickers replace common assistant emoji tokens', () => {
    const parts = splitTextByAilisEmoteTokens('你好呀😊我超喜欢这个方案💕');

    assert.deepEqual(
        parts.map((part) => part.type === 'sticker' ? `${part.type}:${part.sticker.id}` : `${part.type}:${part.text}`),
        [
            'text:你好呀',
            'sticker:happy',
            'text:我超喜欢这个方案',
            'sticker:love'
        ]
    );
    assert.equal(parts[1].sticker.asset.endsWith('/happy.png'), true);
    assert.equal(parts[3].sticker.asset.endsWith('/love.png'), true);
});

test('AILIS emote stickers prefer longest matching kaomoji tokens', () => {
    const parts = splitTextByAilisEmoteTokens('收到啦(*/ω＼*)');

    assert.equal(parts.length, 2);
    assert.equal(parts[1].type, 'sticker');
    assert.equal(parts[1].token, '(*/ω＼*)');
    assert.equal(parts[1].sticker.id, 'shy');
});

test('AILIS emote stickers cover common LLM emoji reactions', () => {
    const parts = splitTextByAilisEmoteTokens('太好了😂 这个思路很酷😎 我再想想🤔，晚点见👋');

    assert.deepEqual(
        parts.filter((part) => part.type === 'sticker').map((part) => part.sticker.id),
        ['laugh', 'cool', 'thinking', 'wave']
    );
});

test('AILIS emote stickers do not replace generic punctuation emphasis', () => {
    const parts = splitTextByAilisEmoteTokens('这个真的可以!! 也不是所有符号都要替换^^');

    assert.deepEqual(parts, [
        {
            type: 'text',
            text: '这个真的可以!! 也不是所有符号都要替换^^'
        }
    ]);
    assert.equal(resolveAilisEmoteSticker('!!'), null);
    assert.equal(resolveAilisEmoteSticker('^^'), null);
});

test('AILIS emote sticker manifest uses unique tokens and project PNG assets', () => {
    const allTokens = AILIS_EMOTE_STICKERS.flatMap((sticker) => sticker.tokens);
    assert.equal(new Set(allTokens).size, allTokens.length);
    assert.equal(AILIS_EMOTE_STICKERS.length, 30);
    for (const sticker of AILIS_EMOTE_STICKERS) {
        assert.match(sticker.asset, /^Resources\/Emotes\/ailis\/.+\.png$/);
    }
});
