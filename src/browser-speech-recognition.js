const ERROR_MESSAGES = Object.freeze({
    'not-allowed': '麦克风权限被拒绝，请在浏览器地址栏允许使用麦克风后重试。',
    'service-not-allowed': '浏览器已禁用语音识别服务，请检查浏览器权限设置。',
    'audio-capture': '没有找到可用的麦克风，请检查设备连接和系统权限。',
    'no-speech': '这次没有听到语音，请靠近麦克风再试一次。',
    network: '浏览器语音识别服务暂时不可用，请检查网络后重试。',
    aborted: '',
    language: '当前语音识别语言不可用。'
});

function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

export function getBrowserSpeechRecognitionConstructor(globalScope = globalThis) {
    return globalScope?.SpeechRecognition || globalScope?.webkitSpeechRecognition || null;
}

export function getBrowserSpeechRecognitionErrorMessage(error) {
    const code = String(error?.error || error?.code || '').trim().toLowerCase();
    if (code in ERROR_MESSAGES) {
        return ERROR_MESSAGES[code];
    }
    return String(error?.message || '').trim() || '语音识别没有成功，请稍后再试。';
}

export function mergeSpeechTranscript(baseText, transcript) {
    const base = String(baseText || '').trimEnd();
    const next = normalizeText(transcript);
    if (!base) {
        return next;
    }
    if (!next) {
        return base;
    }
    return `${base}${/[\s，。！？,.!?：:；;]$/.test(base) ? '' : ' '}${next}`;
}

export function createBrowserSpeechRecognition({
    globalScope = globalThis,
    language = 'zh-CN',
    onStateChange = () => {},
    onInterimResult = () => {},
    onFinalResult = () => {},
    onError = () => {}
} = {}) {
    const Recognition = getBrowserSpeechRecognitionConstructor(globalScope);
    let recognition = null;
    let state = 'idle';
    let finalTranscript = '';
    let stopRequested = false;

    const setState = (nextState, detail = {}) => {
        state = nextState;
        onStateChange({ state, ...detail });
    };

    const disposeRecognition = () => {
        if (!recognition) {
            return;
        }
        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition = null;
    };

    const finish = () => {
        disposeRecognition();
        setState('idle');
    };

    return {
        get supported() {
            return Boolean(Recognition);
        },
        get state() {
            return state;
        },
        start() {
            if (!Recognition) {
                const error = { error: 'unsupported', message: '当前浏览器不支持语音输入，请使用最新版 Chrome 或 Edge。' };
                onError(error);
                return false;
            }
            if (recognition || state !== 'idle') {
                return false;
            }

            finalTranscript = '';
            stopRequested = false;
            recognition = new Recognition();
            recognition.lang = language;
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setState('listening');
            };
            recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let index = event.resultIndex || 0; index < event.results.length; index += 1) {
                    const result = event.results[index];
                    const text = normalizeText(result?.[0]?.transcript);
                    if (!text) {
                        continue;
                    }
                    if (result.isFinal) {
                        finalTranscript = mergeSpeechTranscript(finalTranscript, text);
                    } else {
                        interimTranscript = mergeSpeechTranscript(interimTranscript, text);
                    }
                }

                if (interimTranscript) {
                    onInterimResult({ transcript: interimTranscript, finalTranscript });
                }
                if (finalTranscript) {
                    onFinalResult({ transcript: finalTranscript });
                    finalTranscript = '';
                }
            };
            recognition.onerror = (event) => {
                const code = String(event?.error || '').toLowerCase();
                if (code !== 'aborted' || !stopRequested) {
                    onError({
                        error: code || 'unknown',
                        message: getBrowserSpeechRecognitionErrorMessage(event),
                        sourceEvent: event
                    });
                }
                disposeRecognition();
                setState('idle');
            };
            recognition.onend = () => {
                finish();
            };

            setState('starting');
            try {
                recognition.start();
                return true;
            } catch (error) {
                disposeRecognition();
                setState('idle');
                onError({
                    error: error?.name || 'start-failed',
                    message: getBrowserSpeechRecognitionErrorMessage(error),
                    sourceError: error
                });
                return false;
            }
        },
        stop() {
            if (!recognition) {
                return false;
            }
            stopRequested = true;
            setState('processing');
            recognition.stop();
            return true;
        },
        cancel() {
            if (!recognition) {
                return false;
            }
            stopRequested = true;
            recognition.abort();
            finish();
            return true;
        }
    };
}
