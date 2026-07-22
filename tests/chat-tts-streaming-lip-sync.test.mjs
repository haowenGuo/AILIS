import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { ChatTTSSystem } from '../src/chat-tts-system.js';

function createStreamingHarness() {
    const calls = [];
    const system = Object.create(ChatTTSSystem.prototype);
    system.vrmSystem = {
        startFallbackSpeech() {
            calls.push('mouth-start');
        }
    };
    system.executeAvatarCue = () => calls.push('cue');
    system.updateMessageContent = () => calls.push('text');
    system.scrollToBottom = () => calls.push('scroll');
    return { system, calls };
}

test('streaming text does not move the mouth before real audio playback starts', () => {
    const { system, calls } = createStreamingHarness();
    system.renderStreamingAssistantReply({ display_text: '正在流式回复' }, {});
    assert.deepEqual(calls, ['cue', 'text', 'scroll']);
});

test('failed TTS text fallback can explicitly keep the mouth closed', async () => {
    const { system, calls } = createStreamingHarness();
    system.vrmSystem.stopSpeaking = () => calls.push('mouth-stop');
    system.startAvatarSpeech = () => calls.push('avatar-start');
    system.endAvatarSpeech = () => calls.push('avatar-stop');
    globalThis.window = { setTimeout: (callback) => callback() };
    try {
        await system.playFallbackSpeech('失败降级', {}, {}, {
            revealText: false,
            animateMouth: false
        });
    } finally {
        delete globalThis.window;
    }
    assert.deepEqual(calls, ['mouth-stop', 'cue', 'text', 'scroll']);
});

test('web experience enables server TTS and unlocks audio from the send gesture', async () => {
    const source = await readFile(new URL('../Test/app.js', import.meta.url), 'utf8');
    assert.match(source, /petUrl\.searchParams\.set\('speechMode', 'server'\)/);
    assert.match(source, /__AILIS_BUILD_REVISION__/);
    assert.match(source, /petUrl\.searchParams\.set\('assetVersion', assetVersion\)/);
    assert.match(
        source,
        /await petWindow\.audioPlayer\?\.unlock\?\.\(\);\s+await petWindow\.chatSystem\.sendExternalMessage\(text\)/
    );
});
