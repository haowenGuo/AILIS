import assert from 'node:assert/strict';
import test from 'node:test';
import { chatPalette, normalizeChatColor, DEFAULT_CHAT_BACKGROUND } from '../src/chat-appearance.js';

test('chat defaults to pale blue and accepts only complete hex colors', () => {
    assert.equal(DEFAULT_CHAT_BACKGROUND, '#edf5fc');
    for (const value of [null, undefined, '', '#fff', 'red', 'url(x)', '#gggggg']) {
        assert.equal(normalizeChatColor(value), DEFAULT_CHAT_BACKGROUND);
    }
    assert.equal(normalizeChatColor('#A0B1C2'), '#a0b1c2');
});

test('custom backgrounds retain readable text in light and dark modes', () => {
    const luminance = hex => hex.slice(1).match(/../g).map(v => {
        const c = parseInt(v, 16) / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    for (const color of ['#edf5fc', '#fff2f5', '#eef7f2', '#ffffff', '#182a3b', '#000000', '#777777', '#ffff00']) {
        const palette = chatPalette(color);
        assert.equal(palette['--paper'], color);
        for (const key of ['--text-main', '--text-muted']) {
            const a = luminance(color), b = luminance(palette[key]);
            assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5);
        }
    }
    assert.equal(chatPalette('#182a3b')['--chat-color-scheme'], 'dark');
    assert.equal(chatPalette('#edf5fc')['--chat-color-scheme'], 'light');
});
