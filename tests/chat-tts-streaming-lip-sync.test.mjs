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

test('TTS failures use the system notice channel instead of adding chat messages', async () => {
    const notices = [];
    const system = Object.create(ChatTTSSystem.prototype);
    system.hasShownSpeechProviderHint = false;
    system.hasShownTextFallbackHint = false;
    system.speechProvider = {
        isSpeechDisabled: false,
        supportsTTS: true,
        async playSpeech() {
            return { played: false };
        },
        getLastTTSFailureMessage() {
            return "ElevenLabs 语音生成失败：HTTP 400: API key must start with 'sk_'.";
        }
    };
    system.showSystemNotice = (message, options) => notices.push({ message, options });
    system.addSystemMessage = () => {
        throw new Error('TTS failures must not enter the chat transcript');
    };
    system.endAvatarSpeech = () => {};
    system.playFallbackSpeech = async () => {};

    await system.playPreferredSpeech({
        payload: { display_text: '正常回答', fallbackMode: true },
        displayText: '正常回答',
        alignment: null,
        aiMessageDiv: {},
        preserveMessageContent: true
    });

    assert.equal(notices.length, 2);
    assert.match(notices[0].message, /API key must start/);
    assert.equal(notices[0].options.code, 'tts_provider_failed');
    assert.equal(notices[1].options.code, 'tts_text_fallback');
});

test('system notices emit outside transcript synchronization', () => {
    const events = [];
    const system = Object.create(ChatTTSSystem.prototype);
    system.emitChatUiEvent = (payload) => events.push(payload);
    system.showSystemNotice('语音服务配置异常', {
        level: 'warning',
        source: 'speech',
        code: 'tts_provider_failed'
    });

    assert.equal(events.length, 1);
    assert.equal(events[0].type, 'system-notice');
    assert.equal(events[0].notice.message, '语音服务配置异常');
    assert.equal(events[0].notice.code, 'tts_provider_failed');
    assert.equal('message' in events[0], false);
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

test('a deferred active Turn unlocks the composer without creating a fake assistant answer', async () => {
    const calls = [];
    const system = Object.create(ChatTTSSystem.prototype);
    system.historyReady = Promise.resolve();
    system.isBusy = false;
    system.inputEl = { value: '' };
    system.messageHistory = [];
    system.proactiveCompanion = {
        stop() {},
        noteUserTurn() {},
        noteAssistantTurn() {
            calls.push('assistant-turn');
        }
    };
    system.stopLingeringSpeech = () => {};
    system.setBusy = (value) => {
        system.isBusy = value;
        calls.push(value ? 'busy-on' : 'busy-off');
    };
    system.addUserMessage = () => {};
    system.persistConversation = async () => {};
    const loading = { id: 'loading' };
    const assistant = { id: 'assistant', dataset: {} };
    system.addLoadingMessage = () => loading;
    system.createAIMessage = () => assistant;
    system.createChunkedSpeechSession = () => ({
        cancel: async () => calls.push('speech-cancelled')
    });
    system.createTurnState = () => {
        const turn = { id: 'turn-deferred' };
        system.activeTurn = turn;
        return turn;
    };
    system.createMessageHistorySnapshot = () => [];
    system.fetchAssistantTurnWithFallback = async () => ({
        display_text: '',
        speech_text: '',
        deferAssistantCommit: true,
        ailis: { deferAssistantCommit: true }
    });
    system.isTurnActive = (turn) => system.activeTurn?.id === turn.id;
    system.isTurnCancelled = () => false;
    system.removeMessageElement = (element) => calls.push(`removed:${element.id}`);
    system.executeAvatarCue = () => calls.push('cue');
    system.updateMessageContent = () => calls.push('assistant-text');
    system.scrollToBottom = () => {};
    system.startCommittedBubbleSpeech = () => calls.push('speech-start');
    system.releaseChunkedSpeechSessionWhenDone = () => {};
    system.releaseTurn = () => {
        system.activeTurn = null;
    };
    system.startAutoChatTimer = () => {};

    await system.sendMessage('帮我查资料');

    assert.equal(system.isBusy, false);
    assert.deepEqual(system.messageHistory.map((entry) => entry.role), ['user']);
    assert.ok(calls.includes('removed:loading'));
    assert.ok(calls.includes('removed:assistant'));
    assert.ok(calls.includes('speech-cancelled'));
    assert.equal(calls.includes('assistant-text'), false);
    assert.equal(calls.includes('assistant-turn'), false);
    assert.equal(calls.includes('speech-start'), false);
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

test('background TaskResult appends a new Persona bubble without locking the active composer', async () => {
    const calls = [];
    const system = Object.create(ChatTTSSystem.prototype);
    system.historyReady = Promise.resolve();
    system.isBusy = false;
    system.backgroundMessageIds = new Set();
    system.messageHistory = [];
    system.proactiveCompanion = { noteAssistantTurn() {} };
    system.createAIMessage = () => ({ dataset: {} });
    system.executeAvatarCue = () => calls.push('cue');
    system.updateMessageContent = (_element, text) => calls.push(`text:${text}`);
    system.scrollToBottom = () => {};
    system.persistConversation = async () => calls.push('persist');
    system.stopLingeringSpeech = () => calls.push('speech-stop');
    system.startCommittedBubbleSpeech = (payload) => calls.push(`speech:${payload.display_text}`);
    system.startAutoChatTimer = () => {};

    await system.commitBackgroundAssistantMessage({
        display_text: '任务结果作为新消息到达。',
        speech_text: '任务结果作为新消息到达。',
        backgroundTaskKind: 'result',
        backgroundEventId: 'result-event-1',
        source: 'task_result_persona_actor'
    });

    assert.equal(system.isBusy, false);
    assert.equal(system.messageHistory.length, 1);
    assert.equal(system.messageHistory[0].content, '任务结果作为新消息到达。');
    assert.deepEqual(calls, [
        'cue',
        'text:任务结果作为新消息到达。',
        'persist',
        'speech-stop',
        'speech:任务结果作为新消息到达。'
    ]);
});

test('background Persona stream updates one bubble and persists only the committed answer', async () => {
    const calls = [];
    const bubble = { id: 'persona-stream-bubble', dataset: {} };
    const system = Object.create(ChatTTSSystem.prototype);
    system.historyReady = Promise.resolve();
    system.backgroundMessageIds = new Set();
    system.backgroundStreams = new Map();
    system.messageHistory = [];
    system.proactiveCompanion = { noteAssistantTurn() {} };
    system.createAIMessage = () => {
        calls.push('create');
        return bubble;
    };
    system.removeMessageElement = (element) => calls.push(`remove:${element.id}`);
    system.executeAvatarCue = () => {};
    system.updateMessageContent = (_element, text) => calls.push(`text:${text}`);
    system.scrollToBottom = () => {};
    system.persistConversation = async () => calls.push('persist');
    system.stopLingeringSpeech = () => {};
    system.startCommittedBubbleSpeech = (payload, element) => {
        calls.push(`speech:${payload.display_text}:${element.id}`);
    };
    system.startAutoChatTimer = () => {};

    await system.commitBackgroundAssistantMessage({
        display_text: '你',
        backgroundTaskKind: 'stream',
        backgroundRunId: 'run-stream',
        backgroundStreamId: 'stream-1',
        backgroundStreamState: 'delta',
        backgroundEventId: 'stream-event-1',
        streamMode: true
    });
    await system.commitBackgroundAssistantMessage({
        display_text: '你好呀',
        backgroundTaskKind: 'stream',
        backgroundRunId: 'run-stream',
        backgroundStreamId: 'stream-1',
        backgroundStreamState: 'delta',
        backgroundEventId: 'stream-event-2',
        streamMode: true
    });

    assert.equal(system.messageHistory.length, 0);
    assert.equal(system.backgroundStreams.size, 1);

    await system.commitBackgroundAssistantMessage({
        display_text: '你好呀。',
        speech_text: '你好呀。',
        backgroundTaskKind: 'result',
        backgroundRunId: 'run-stream',
        backgroundStreamId: 'stream-1',
        backgroundEventId: 'stream-final',
        source: 'persona_actor'
    });

    assert.equal(system.backgroundStreams.size, 0);
    assert.equal(system.messageHistory.length, 1);
    assert.equal(system.messageHistory[0].content, '你好呀。');
    assert.deepEqual(calls, [
        'create',
        'text:你',
        'text:你好呀',
        'text:你好呀。',
        'persist',
        'speech:你好呀。:persona-stream-bubble'
    ]);
});

test('discarded background Persona stream removes its uncommitted bubble', async () => {
    const calls = [];
    const bubble = { id: 'discarded-stream', dataset: {} };
    const system = Object.create(ChatTTSSystem.prototype);
    system.historyReady = Promise.resolve();
    system.backgroundMessageIds = new Set();
    system.backgroundStreams = new Map();
    system.messageHistory = [];
    system.createAIMessage = () => bubble;
    system.removeMessageElement = (element) => calls.push(`remove:${element.id}`);
    system.executeAvatarCue = () => {};
    system.updateMessageContent = () => {};
    system.scrollToBottom = () => {};

    await system.commitBackgroundAssistantMessage({
        display_text: '尚未提交',
        backgroundTaskKind: 'stream',
        backgroundRunId: 'run-discard',
        backgroundStreamId: 'stream-discard',
        backgroundStreamState: 'delta',
        backgroundEventId: 'discard-delta'
    });
    await system.commitBackgroundAssistantMessage({
        display_text: '',
        backgroundTaskKind: 'stream',
        backgroundRunId: 'run-discard',
        backgroundStreamId: 'stream-discard',
        backgroundStreamState: 'discarded',
        backgroundEventId: 'discard-final'
    });

    assert.equal(system.backgroundStreams.size, 0);
    assert.deepEqual(calls, ['remove:discarded-stream']);
    assert.equal(system.messageHistory.length, 0);
});

test('web experience uses one auto-ranked online voice and unlocks audio from the send gesture', async () => {
    const source = await readFile(new URL('../Test/app.js', import.meta.url), 'utf8');
    const html = await readFile(new URL('../Test/index.html', import.meta.url), 'utf8');
    assert.doesNotMatch(html, /id="tts-voice-select"/);
    assert.doesNotMatch(source, /speechSynthesis\?\.getVoices/);
    assert.match(source, /speechMode: 'native'/);
    assert.match(source, /petUrl\.searchParams\.set\('speechMode', 'native'\)/);
    assert.match(source, /localStorage\?\.removeItem\(LEGACY_TTS_VOICE_STORAGE_KEY\)/);
    assert.match(source, /__AILIS_BUILD_REVISION__/);
    assert.match(source, /petUrl\.searchParams\.set\('assetVersion', WEB_ASSET_VERSION\)/);
    assert.match(source, /payload\.type === 'system-notice'/);
    assert.match(source, /showSystemNotice\(payload\.notice \|\| \{\}\)/);
    const audioUnlockIndex = source.indexOf('await petWindow.audioPlayer?.unlock?.();');
    const messageSendIndex = source.indexOf(
        'const sendPromise = petWindow.chatSystem.sendExternalMessage(text, { attachments });'
    );
    assert.ok(audioUnlockIndex >= 0, 'the send gesture should unlock audio');
    assert.ok(messageSendIndex > audioUnlockIndex, 'audio should unlock before the message is sent');
});
