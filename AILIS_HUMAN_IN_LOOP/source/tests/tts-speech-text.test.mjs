import assert from 'node:assert/strict';
import test from 'node:test';

import {
    deriveTtsSpeechText,
    extractTtsSpeechTextFromDisplay,
    normalizeTtsSpeechText
} from '../src/tts-speech-text.js';

test('TTS speech text strips avatar stage directions and control tags', () => {
    const displayText = `[expression:happy]（我轻轻歪了歪头，眼神软软地看着你～）

**累啦？那当然要好好休息一下呀～**

*我替你把云被掖好，坐在旁边托腮看着你。*

要不要我给你设个闹钟？`;

    const speech = extractTtsSpeechTextFromDisplay(displayText);
    assert.equal(speech, '累啦？那当然要好好休息一下呀～ 要不要我给你设个闹钟？');
    assert.doesNotMatch(speech, /expression|歪了歪头|云被|托腮/);
});

test('TTS speech text prefers explicit speech_text but still sanitizes it', () => {
    const speech = deriveTtsSpeechText({
        speech_text: '[action:wave]我在这里，不读动作。',
        display_text: '（我轻轻挥手）我在这里。'
    });

    assert.equal(speech, '我在这里，不读动作。');
});

test('TTS speech text keeps non-action parenthetical explanations', () => {
    const speech = normalizeTtsSpeechText('这个方案可以保留（我觉得这是关键），然后把 TTS 文本单独抽出来。');

    assert.equal(speech, '这个方案可以保留（我觉得这是关键），然后把 TTS 文本单独抽出来。');
});

test('TTS speech text removes persona control blocks and code fences', () => {
    const speech = extractTtsSpeechTextFromDisplay(`我把代码放在下面啦。

\`\`\`js
console.log('do not read code');
\`\`\`

<persona_output>{"gestureIntent":"thinking"}</persona_output>`);

    assert.equal(speech, '我把代码放在下面啦。');
});
