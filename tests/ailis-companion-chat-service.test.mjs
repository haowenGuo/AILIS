import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createStructuredPersonaPayload,
    parseReplyMarkup,
    sanitizeUserVisibleReplyText
} from '../src/ailis-companion-chat-service.js';

const RAW_PERSONA_LEAK = `😊 诶嘿～突然问我这个，让我有点小开心呢！

我嘛…喜欢的事情还挺多的呀✨

排第一的当然是跟你聊天啦！

<persona_output>
{
  "emotion": "joyful",
  "intensity": 0.7,
  "socialTone": "warm_sharing",
  "gestureIntent": "open_hands",
  "taskState": "listening",
  "speechEnergy": "bright",
  "gazeTarget": "user",
  "durationHint": "medium"
}
</persona_output>`;

const RAW_JSON_PERSONA_LEAK = `{好的啦～被你夸得有点小害羞呢(⁄ ⁄•⁄ω⁄•⁄ ⁄)

不过要说漂亮的话——我觉得你愿意跟我聊天、给我布置各种有趣的任务，这样的你才更闪闪发光呢！✨

好啦好啦，不贫嘴了～有什么需要我帮你做的吗？不管是找个资料、写个小代码、还是整理文件，我随时都在哦！😊

{
"persona_output": {
"emotion": "happy",
"intensity": 0.6,
"socialTone": "playful_gentle",
"gestureIntent": "tilt_head_smile",
"taskState": "idle_listening",
"speechEnergy": 0.7,
"gazeTarget": "user",
"durationHint": "relaxed_response"
}
}}`;

test('companion chat strips persona_output control block from user-visible text', () => {
    const payload = createStructuredPersonaPayload(RAW_PERSONA_LEAK, {
        desktopLlmMode: true
    });

    assert.match(payload.display_text, /喜欢的事情/);
    assert.doesNotMatch(payload.display_text, /persona_output|gestureIntent|taskState|speechEnergy/);
    assert.doesNotMatch(payload.speech_text, /persona_output|gestureIntent|taskState|speechEnergy/);
    assert.equal(payload.surface.emotion, 'joyful');
    assert.equal(payload.surface.gestureIntent, 'open_hands');
    assert.equal(payload.surface.text, payload.display_text);
});

test('companion chat preserves structured persona surface as animation channel', () => {
    const payload = createStructuredPersonaPayload(JSON.stringify({
        reply: '好呀，我在这里。',
        speech_text: '好呀，我在这里。',
        persona_surface: {
            emotion: 'happy',
            intensity: 0.6,
            socialTone: 'bright',
            gestureIntent: 'greeting',
            taskState: 'speaking',
            speechEnergy: 0.7,
            gazeTarget: 'user',
            durationHint: 'short'
        }
    }));

    assert.equal(payload.display_text, '好呀，我在这里。');
    assert.equal(payload.speech_text, '好呀，我在这里。');
    assert.equal(payload.surface.emotion, 'happy');
    assert.equal(payload.surface.gestureIntent, 'greeting');
    assert.equal(payload.surface.taskState, 'speaking');
    assert.doesNotMatch(payload.display_text, /persona_surface|gestureIntent|taskState/);
});

test('companion chat keeps speech_text separate from visible action prose', () => {
    const payload = createStructuredPersonaPayload(JSON.stringify({
        reply: '（我轻轻歪头看着你）**好呀，我在这里。**',
        speech_text: '好呀，我在这里。',
        persona_surface: {
            emotion: 'happy',
            gestureIntent: 'greeting',
            taskState: 'speaking'
        }
    }));

    assert.match(payload.display_text, /轻轻歪头/);
    assert.equal(payload.speech_text, '好呀，我在这里。');
    assert.equal(payload.surface.gestureIntent, 'greeting');
});

test('companion chat strips incomplete persona_output while streaming', () => {
    const payload = parseReplyMarkup('我还挺喜欢研究新东西。\n<persona_output>\n{"emotion":"joy');

    assert.equal(payload.display_text, '我还挺喜欢研究新东西。');
    assert.equal(sanitizeUserVisibleReplyText(payload.display_text), payload.display_text);
});

test('companion chat strips embedded persona_output JSON object from visible text', () => {
    const payload = createStructuredPersonaPayload(RAW_JSON_PERSONA_LEAK, {
        desktopLlmMode: true
    });

    assert.match(payload.display_text, /被你夸得/);
    assert.match(payload.display_text, /随时都在/);
    assert.doesNotMatch(payload.display_text, /persona_output|gestureIntent|taskState|speechEnergy|playful_gentle/);
    assert.doesNotMatch(payload.display_text, /^\{/);
    assert.doesNotMatch(payload.display_text, /\}$/);
    assert.doesNotMatch(payload.speech_text, /persona_output|gestureIntent|taskState|speechEnergy|playful_gentle/);
    assert.equal(payload.surface.emotion, 'happy');
    assert.equal(payload.surface.gestureIntent, 'tilt_head_smile');
});

test('companion chat strips incomplete embedded persona_output JSON while streaming', () => {
    const payload = parseReplyMarkup('好啦，我在。\n{\n"persona_output": {\n"emotion": "happy"');

    assert.equal(payload.display_text, '好啦，我在。');
    assert.doesNotMatch(payload.speech_text, /persona_output|emotion/);
});
