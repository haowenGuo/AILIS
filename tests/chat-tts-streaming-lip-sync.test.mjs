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

test('committed bubble speech never rewrites the visible message during playback', async () => {
    const calls = [];
    const system = Object.create(ChatTTSSystem.prototype);
    system.speechProvider = {
        isSpeechDisabled: false,
        supportsTTS: true,
        async playSpeech({ updateMessageContent, scrollToBottom, onAvatarPlaybackStart }) {
            updateMessageContent('partial text');
            scrollToBottom();
            onAvatarPlaybackStart();
            return { played: true };
        }
    };
    system.updateMessageContent = () => calls.push('text');
    system.scrollToBottom = () => calls.push('scroll');
    system.startAvatarPlayback = () => calls.push('avatar-start');
    system.endAvatarSpeech = () => calls.push('avatar-end');

    await system.playPreferredSpeech({
        payload: { display_text: '已经提交的回答' },
        displayText: '已经提交的回答',
        alignment: null,
        aiMessageDiv: {},
        preserveMessageContent: true
    });

    assert.deepEqual(calls, ['avatar-start', 'avatar-end']);
});

test('chat unlocks after committing text without awaiting background speech', async () => {
    const calls = [];
    let resolveSpeech;
    const pendingSpeech = new Promise((resolve) => {
        resolveSpeech = resolve;
    });
    const system = Object.create(ChatTTSSystem.prototype);
    system.historyReady = Promise.resolve();
    system.isBusy = false;
    system.inputEl = { value: '' };
    system.messageHistory = [];
    system.proactiveCompanion = {
        stop() {},
        noteUserTurn() {},
        noteAssistantTurn() {}
    };
    system.stopLingeringSpeech = () => {};
    system.setBusy = (value) => {
        system.isBusy = value;
        calls.push(value ? 'busy-on' : 'busy-off');
    };
    system.addUserMessage = () => {};
    system.persistConversation = async () => calls.push('persist');
    system.addLoadingMessage = () => ({ id: 'loading' });
    system.createAIMessage = () => ({ dataset: {} });
    system.createChunkedSpeechSession = () => null;
    system.createTurnState = () => {
        const turn = { id: 'turn-1' };
        system.activeTurn = turn;
        return turn;
    };
    system.createMessageHistorySnapshot = () => [];
    system.fetchAssistantTurnWithFallback = async () => ({
        display_text: '最终回答',
        speech_text: '最终回答'
    });
    system.isTurnActive = (turn) => system.activeTurn?.id === turn.id;
    system.isTurnCancelled = () => false;
    system.removeMessageElement = () => {};
    system.executeAvatarCue = () => {};
    system.updateMessageContent = (_element, text) => calls.push(`text:${text}`);
    system.scrollToBottom = () => {};
    system.startCommittedBubbleSpeech = () => {
        calls.push('speech-start');
        return pendingSpeech;
    };
    system.releaseChunkedSpeechSessionWhenDone = () => {};
    system.releaseTurn = () => {
        system.activeTurn = null;
    };
    system.startAutoChatTimer = () => {};

    await system.sendMessage('你好');

    assert.equal(system.isBusy, false);
    assert.equal(system.messageHistory.at(-1)?.content, '最终回答');
    assert.ok(calls.indexOf('text:最终回答') < calls.indexOf('speech-start'));
    assert.ok(calls.indexOf('speech-start') < calls.indexOf('busy-off'));
    resolveSpeech();
    await pendingSpeech;
});

test('streaming draft text is not queued for speech before the bubble is committed', async () => {
    const calls = [];
    const session = { id: 'bubble-session' };
    const system = Object.create(ChatTTSSystem.prototype);
    system.historyReady = Promise.resolve();
    system.isBusy = false;
    system.inputEl = { value: '' };
    system.messageHistory = [];
    system.proactiveCompanion = {
        stop() {},
        noteUserTurn() {},
        noteAssistantTurn() {}
    };
    system.stopLingeringSpeech = () => {};
    system.setBusy = (value) => {
        system.isBusy = value;
    };
    system.addUserMessage = () => {};
    system.persistConversation = async () => {};
    system.addLoadingMessage = () => ({ id: 'loading' });
    system.createAIMessage = () => ({ dataset: {} });
    system.createChunkedSpeechSession = () => session;
    system.createTurnState = () => {
        const turn = { id: 'turn-1' };
        system.activeTurn = turn;
        return turn;
    };
    system.createMessageHistorySnapshot = () => [];
    system.fetchAssistantTurnWithFallback = async (_proactive, onPartial) => {
        onPartial({ stream_delta_speech_text: '这是中间稿' });
        return { display_text: '最终气泡', speech_text: '不应优先的语音文本' };
    };
    system.isTurnActive = (turn) => system.activeTurn?.id === turn.id;
    system.isTurnCancelled = () => false;
    system.removeMessageElement = () => {};
    system.renderStreamingAssistantReply = () => calls.push('draft-rendered');
    system.appendChunkedSpeechProgress = () => calls.push('draft-spoken');
    system.executeAvatarCue = () => {};
    system.updateMessageContent = (_element, text) => calls.push(`committed:${text}`);
    system.scrollToBottom = () => {};
    system.startCommittedBubbleSpeech = (payload, _element, receivedSession) => {
        calls.push(`speech:${payload.display_text}:${receivedSession.id}`);
        return Promise.resolve();
    };
    system.releaseChunkedSpeechSessionWhenDone = () => {};
    system.releaseTurn = () => {
        system.activeTurn = null;
    };
    system.startAutoChatTimer = () => {};

    await system.sendMessage('你好');

    assert.deepEqual(calls, [
        'draft-rendered',
        'committed:最终气泡',
        'speech:最终气泡:bubble-session'
    ]);
});

test('web experience enables server TTS and unlocks audio from the send gesture', async () => {
    const source = await readFile(new URL('../Test/app.js', import.meta.url), 'utf8');
    const html = await readFile(new URL('../Test/index.html', import.meta.url), 'utf8');
    assert.match(html, /id="tts-voice-select"/);
    assert.match(source, /speechSynthesis\?\.getVoices/);
    assert.match(source, /speechMode: useCloudVoice \? 'server' : 'native'/);
    assert.match(source, /petUrl\.searchParams\.set\('ttsVoice', state\.ttsVoiceId\)/);
    assert.match(source, /__AILIS_BUILD_REVISION__/);
    assert.match(source, /petUrl\.searchParams\.set\('assetVersion', WEB_ASSET_VERSION\)/);
    assert.match(
        source,
        /await petWindow\.audioPlayer\?\.unlock\?\.\(\);\s+await petWindow\.chatSystem\.sendExternalMessage\(text\)/
    );
});
