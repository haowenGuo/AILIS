import assert from 'node:assert/strict';
import test from 'node:test';

import { ChatTTSSystem } from '../src/chat-tts-system.js';

function createStreamingFallbackHarness({ speechDisabled = true } = {}) {
    const calls = [];
    const system = Object.create(ChatTTSSystem.prototype);
    system.speechProvider = { isSpeechDisabled: speechDisabled };
    system.activeChunkedSpeechSession = null;
    system.activeStreamingFallbackSpeech = null;
    system.getAvatarSpeechText = () => '正在流式回复';
    system.vrmSystem = {
        startFallbackSpeech() {
            calls.push('mouth-start');
        },
        stopSpeaking() {
            calls.push('mouth-stop');
        }
    };
    system.startAvatarSpeech = () => calls.push('avatar-start');
    system.endAvatarSpeech = () => calls.push('avatar-stop');
    return { system, calls };
}

test('text-only streaming starts fallback lip sync once and stops it at reply completion', () => {
    const { system, calls } = createStreamingFallbackHarness();
    const message = { dataset: { messageId: 'assistant-1' } };

    assert.equal(system.startStreamingFallbackSpeech({}, '第一段', message), true);
    assert.equal(system.startStreamingFallbackSpeech({}, '第二段', message), false);
    assert.deepEqual(calls, ['mouth-start', 'avatar-start']);

    assert.equal(system.stopStreamingFallbackSpeech(message), true);
    assert.equal(system.stopStreamingFallbackSpeech(message), false);
    assert.deepEqual(calls, ['mouth-start', 'avatar-start', 'mouth-stop', 'avatar-stop']);
});

test('streaming fallback lip sync stays disabled when a real speech provider is active', () => {
    const { system, calls } = createStreamingFallbackHarness({ speechDisabled: false });

    assert.equal(system.startStreamingFallbackSpeech({}, '语音回复', {}), false);
    assert.deepEqual(calls, []);
});
