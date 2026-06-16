import { CONFIG } from './config.js';

const TWO_PI = Math.PI * 2;


function base64ToBlobUrl(base64Audio, mimeType) {
    const binaryString = window.atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);

    for (let index = 0; index < binaryString.length; index += 1) {
        bytes[index] = binaryString.charCodeAt(index);
    }

    return URL.createObjectURL(new Blob([bytes], { type: mimeType }));
}


function getSafeAlignment(alignment, displayText) {
    if (!alignment?.characters?.length) {
        return null;
    }

    const joinedText = alignment.characters.join('');
    if (joinedText !== displayText) {
        return null;
    }

    return alignment;
}


function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}


function lerp(start, end, amount) {
    return start + (end - start) * amount;
}


export class TTSAudioPlayer {
    constructor(vrmSystem) {
        this.vrmSystem = vrmSystem;

        this.audioElement = new Audio();
        this.audioElement.preload = 'auto';

        this.audioContext = null;
        this.mediaSourceNode = null;
        this.analyserNode = null;
        this.timeDomainData = null;

        this.currentObjectUrl = null;
        this.syncRafId = 0;
        this.lipSyncEnvelope = 0;
        this.lipSyncPulsePhase = 0;
        this.lastLipSyncAudioTime = 0;
        this.activePlaybackStop = null;
    }

    async unlock() {
        try {
            await this.ensureAudioGraph();
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        } catch (error) {
            console.warn('⚠️ 音频上下文解锁失败，将继续尝试浏览器原生播放：', error);
        }
    }

    async playSpeech({
        audioBase64,
        audioBlob,
        mimeType,
        displayText,
        alignment,
        onTextProgress,
        onPlaybackStart,
        onPlaybackEnd
    }) {
        await this.stop();
        await this.unlock();
        this.resetLipSyncState();

        const safeAlignment = getSafeAlignment(alignment, displayText);
        let visibleCharCount = 0;

        if (audioBlob instanceof Blob) {
            this.currentObjectUrl = URL.createObjectURL(audioBlob);
        } else if (audioBase64) {
            this.currentObjectUrl = base64ToBlobUrl(audioBase64, mimeType);
        } else {
            throw new Error('缺少可播放的音频数据');
        }

        this.audioElement.src = this.currentObjectUrl;
        this.audioElement.currentTime = 0;
        this.audioElement.load();

        if (!safeAlignment && onTextProgress) {
            onTextProgress(displayText);
        }

        return new Promise((resolve, reject) => {
            let settled = false;
            const cleanupListeners = () => {
                this.audioElement.onended = null;
                this.audioElement.onerror = null;
            };

            const settlePlayback = (callback) => {
                if (settled) {
                    return;
                }
                settled = true;
                cleanupListeners();
                this.activePlaybackStop = null;
                callback();
            };

            const finalizePlayback = () => {
                settlePlayback(() => {
                    this.stop({ settlePlayback: false }).finally(() => {
                        if (onTextProgress) {
                            onTextProgress(displayText);
                        }
                        if (onPlaybackEnd) {
                            onPlaybackEnd();
                        }
                        resolve();
                    });
                });
            };

            this.activePlaybackStop = () => {
                settlePlayback(() => resolve());
            };

            this.audioElement.onerror = () => {
                settlePlayback(() => {
                    this.stop({ settlePlayback: false }).finally(() => reject(new Error('音频资源播放失败')));
                });
            };

            this.audioElement.onended = () => {
                finalizePlayback();
            };

            this.audioElement.play()
                .then(() => {
                    if (settled) {
                        return;
                    }
                    if (this.analyserNode) {
                        this.vrmSystem.startAudioDrivenSpeech();
                    } else {
                        this.vrmSystem.startFallbackSpeech();
                    }
                    if (onPlaybackStart) {
                        onPlaybackStart();
                    }

                    const syncFrame = () => {
                        this.syncRafId = window.requestAnimationFrame(syncFrame);
                        this.updateLipSyncFromAudio();

                        if (safeAlignment && onTextProgress) {
                            visibleCharCount = this.findVisibleCharCount(
                                safeAlignment,
                                this.audioElement.currentTime,
                                visibleCharCount
                            );
                            onTextProgress(safeAlignment.characters.slice(0, visibleCharCount).join(''));
                        }
                    };

                    syncFrame();
                })
                .catch((error) => {
                    settlePlayback(() => {
                        this.stop({ settlePlayback: false }).finally(() => reject(error));
                    });
                });
        });
    }

    async stop({ settlePlayback = true } = {}) {
        if (settlePlayback && this.activePlaybackStop) {
            this.activePlaybackStop();
        }

        if (this.syncRafId) {
            window.cancelAnimationFrame(this.syncRafId);
            this.syncRafId = 0;
        }

        if (!this.audioElement.paused) {
            this.audioElement.pause();
        }

        this.audioElement.currentTime = 0;
        this.vrmSystem.stopSpeaking();
        this.resetLipSyncState();

        if (this.currentObjectUrl) {
            URL.revokeObjectURL(this.currentObjectUrl);
            this.currentObjectUrl = null;
        }
    }

    resetLipSyncState() {
        this.lipSyncEnvelope = 0;
        this.lipSyncPulsePhase = 0;
        this.lastLipSyncAudioTime = 0;
    }

    async ensureAudioGraph() {
        if (this.analyserNode) {
            return;
        }

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return;
        }

        this.audioContext = new AudioContextClass();
        this.mediaSourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 1024;
        this.analyserNode.smoothingTimeConstant = CONFIG.AUDIO_LIP_SYNC_ANALYSER_SMOOTHING;
        this.timeDomainData = new Uint8Array(this.analyserNode.fftSize);

        this.mediaSourceNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioContext.destination);
    }

    updateLipSyncFromAudio() {
        if (!this.analyserNode || !this.timeDomainData) {
            return;
        }

        this.analyserNode.getByteTimeDomainData(this.timeDomainData);

        let totalSquares = 0;
        for (const value of this.timeDomainData) {
            const sample = (value - 128) / 128;
            totalSquares += sample * sample;
        }

        const rms = Math.sqrt(totalSquares / this.timeDomainData.length);
        const rawEnergy = clamp(
            (rms - CONFIG.AUDIO_LIP_SYNC_NOISE_FLOOR) * CONFIG.AUDIO_LIP_SYNC_GAIN,
            0,
            1
        );
        const envelopeRate = rawEnergy > this.lipSyncEnvelope
            ? CONFIG.AUDIO_LIP_SYNC_ATTACK
            : CONFIG.AUDIO_LIP_SYNC_RELEASE;
        this.lipSyncEnvelope = lerp(this.lipSyncEnvelope, rawEnergy, envelopeRate);

        const audioTime = this.audioElement.currentTime || 0;
        let deltaTime = this.lastLipSyncAudioTime > 0
            ? audioTime - this.lastLipSyncAudioTime
            : 1 / 60;
        if (!Number.isFinite(deltaTime) || deltaTime <= 0 || deltaTime > 0.12) {
            deltaTime = 1 / 60;
        }
        this.lastLipSyncAudioTime = audioTime;

        const cadence = lerp(
            CONFIG.AUDIO_LIP_SYNC_MIN_CADENCE,
            CONFIG.AUDIO_LIP_SYNC_MAX_CADENCE,
            this.lipSyncEnvelope
        );
        this.lipSyncPulsePhase = (this.lipSyncPulsePhase + deltaTime * cadence) % 1;

        const pulse = Math.pow(
            0.5 - 0.5 * Math.cos(this.lipSyncPulsePhase * TWO_PI),
            CONFIG.AUDIO_LIP_SYNC_PULSE_SHAPE
        );
        const mouthValue = this.lipSyncEnvelope <= CONFIG.AUDIO_LIP_SYNC_SILENCE_THRESHOLD
            ? 0
            : this.lipSyncEnvelope *
                (CONFIG.AUDIO_LIP_SYNC_SUSTAIN + (1 - CONFIG.AUDIO_LIP_SYNC_SUSTAIN) * pulse) *
                CONFIG.AUDIO_LIP_SYNC_BOOST;

        this.vrmSystem.setLipSyncValue(clamp(mouthValue, 0, CONFIG.MAX_MOUTH_OPEN));
    }

    findVisibleCharCount(alignment, currentTime, lastVisibleCharCount) {
        const charStartTimes = alignment.character_start_times_seconds || [];
        let nextVisibleCharCount = lastVisibleCharCount;

        while (
            nextVisibleCharCount < charStartTimes.length &&
            charStartTimes[nextVisibleCharCount] <= currentTime + CONFIG.TEXT_SYNC_LEAD_SECONDS
        ) {
            nextVisibleCharCount += 1;
        }

        return nextVisibleCharCount;
    }
}
