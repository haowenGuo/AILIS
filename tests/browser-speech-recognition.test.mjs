import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
    createBrowserSpeechRecognition,
    getBrowserSpeechRecognitionErrorMessage,
    mergeSpeechTranscript
} from '../src/browser-speech-recognition.js';

class MockSpeechRecognition {
    static latest = null;

    constructor() {
        MockSpeechRecognition.latest = this;
        this.started = false;
        this.stopped = false;
        this.aborted = false;
    }

    start() {
        this.started = true;
        this.onstart?.();
    }

    stop() {
        this.stopped = true;
    }

    abort() {
        this.aborted = true;
        this.onend?.();
    }
}

function speechResult(transcript, isFinal) {
    const result = [{ transcript }];
    result.isFinal = isFinal;
    return result;
}

test('browser speech recognition exposes interim text and an editable final transcript', () => {
    const states = [];
    const interim = [];
    const final = [];
    const service = createBrowserSpeechRecognition({
        globalScope: { SpeechRecognition: MockSpeechRecognition },
        onStateChange: ({ state }) => states.push(state),
        onInterimResult: ({ transcript }) => interim.push(transcript),
        onFinalResult: ({ transcript }) => final.push(transcript)
    });

    assert.equal(service.supported, true);
    assert.equal(service.start(), true);
    const recognition = MockSpeechRecognition.latest;
    assert.equal(recognition.lang, 'zh-CN');
    assert.equal(recognition.interimResults, true);
    assert.deepEqual(states, ['starting', 'listening']);

    recognition.onresult({
        resultIndex: 0,
        results: [speechResult('你好', false)]
    });
    recognition.onresult({
        resultIndex: 0,
        results: [speechResult('你好 AILIS', true)]
    });
    recognition.onend();

    assert.deepEqual(interim, ['你好']);
    assert.deepEqual(final, ['你好 AILIS']);
    assert.equal(service.state, 'idle');
});

test('browser speech recognition stops without discarding the pending final event', () => {
    const final = [];
    const service = createBrowserSpeechRecognition({
        globalScope: { webkitSpeechRecognition: MockSpeechRecognition },
        onFinalResult: ({ transcript }) => final.push(transcript)
    });

    service.start();
    const recognition = MockSpeechRecognition.latest;
    assert.equal(service.stop(), true);
    assert.equal(recognition.stopped, true);
    assert.equal(service.state, 'processing');

    recognition.onresult({
        resultIndex: 0,
        results: [speechResult('停止后返回的结果', true)]
    });
    recognition.onend();
    assert.deepEqual(final, ['停止后返回的结果']);
});

test('browser speech recognition explains permission and device failures', () => {
    assert.match(getBrowserSpeechRecognitionErrorMessage({ error: 'not-allowed' }), /麦克风权限/);
    assert.match(getBrowserSpeechRecognitionErrorMessage({ error: 'audio-capture' }), /麦克风/);
});

test('recognized speech appends to an existing draft without corrupting punctuation', () => {
    assert.equal(mergeSpeechTranscript('', ' 你好   AILIS '), '你好 AILIS');
    assert.equal(mergeSpeechTranscript('请帮我', '看看天气'), '请帮我 看看天气');
    assert.equal(mergeSpeechTranscript('请帮我，', '看看天气'), '请帮我，看看天气');
});

test('web experience exposes review-first voice input and keeps the fixed TTS switch', async () => {
    const [html, source] = await Promise.all([
        readFile(new URL('../Test/index.html', import.meta.url), 'utf8'),
        readFile(new URL('../Test/app.js', import.meta.url), 'utf8')
    ]);

    assert.match(html, /id="voice-input-button"/);
    assert.match(html, /id="tts-enabled-toggle"/);
    assert.match(source, /createBrowserSpeechRecognition/);
    assert.match(source, /已识别，可以修改后发送/);
    assert.doesNotMatch(source, /onFinalResult:[\s\S]{0,500}sendPrompt\(/);
    assert.doesNotMatch(html, /id="tts-voice-select"/);
});
