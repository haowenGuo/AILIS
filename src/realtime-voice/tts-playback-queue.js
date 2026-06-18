export class TtsPlaybackQueue {
    constructor({
        audioPlayer,
        onPlaybackStart = null,
        onPlaybackEnd = null,
        onError = null
    } = {}) {
        this.audioPlayer = audioPlayer;
        this.onPlaybackStart = onPlaybackStart;
        this.onPlaybackEnd = onPlaybackEnd;
        this.onError = onError;
        this.items = new Map();
        this.skipped = new Set();
        this.nextSequence = 0;
        this.expectedCount = null;
        this.playing = false;
        this.cancelled = false;
        this.started = false;
        this.startedSettled = false;
        this.startedPromise = new Promise((resolve) => {
            this.resolveStarted = resolve;
        });
        this.donePromise = new Promise((resolve) => {
            this.resolveDone = resolve;
        });
    }

    enqueue(item) {
        if (this.cancelled || !item || !Number.isFinite(item.sequence)) {
            return;
        }
        this.items.set(item.sequence, item);
        void this.pump();
    }

    skip(sequence) {
        if (this.cancelled || !Number.isFinite(sequence)) {
            return;
        }
        this.skipped.add(sequence);
        void this.pump();
    }

    finish(expectedCount = this.expectedCount) {
        if (Number.isFinite(expectedCount)) {
            this.expectedCount = expectedCount;
        }
        void this.pump();
        return this.donePromise;
    }

    async cancel(reason = 'cancelled') {
        if (this.cancelled) {
            return;
        }
        this.cancelled = true;
        this.items.clear();
        this.skipped.clear();
        try {
            await this.audioPlayer?.stop?.();
        } catch (error) {
            this.onError?.(error, { phase: 'cancel', reason });
        } finally {
            this.resolveStartedOnce(false);
            this.resolveDone?.();
        }
    }

    waitUntilDone() {
        return this.donePromise;
    }

    waitUntilStartedOrDone() {
        return this.startedPromise;
    }

    hasStarted() {
        return this.started;
    }

    resolveStartedOnce(started) {
        if (this.startedSettled) {
            return;
        }
        this.startedSettled = true;
        this.resolveStarted?.(Boolean(started));
    }

    isComplete() {
        return Number.isFinite(this.expectedCount) &&
            this.nextSequence >= this.expectedCount &&
            !this.items.size &&
            !this.playing;
    }

    resolveIfComplete() {
        if (this.isComplete()) {
            this.resolveStartedOnce(false);
            this.onPlaybackEnd?.();
            this.resolveDone?.();
        }
    }

    async pump() {
        if (this.playing || this.cancelled) {
            return;
        }

        while (!this.cancelled) {
            if (this.skipped.has(this.nextSequence)) {
                this.skipped.delete(this.nextSequence);
                this.nextSequence += 1;
                continue;
            }

            const item = this.items.get(this.nextSequence);
            if (!item) {
                break;
            }

            this.items.delete(this.nextSequence);
            this.playing = true;
            try {
                const handlePlaybackStart = () => {
                    if (!this.started) {
                        this.started = true;
                        this.onPlaybackStart?.(item);
                        this.resolveStartedOnce(true);
                    }
                };
                if (typeof item.play === 'function') {
                    await item.play({
                        displayText: item.text,
                        text: item.text,
                        onPlaybackStart: handlePlaybackStart
                    });
                } else {
                    await this.audioPlayer.playSpeech({
                        audioBase64: item.audioBase64,
                        audioBlob: item.audioBlob,
                        mimeType: item.mimeType || 'audio/wav',
                        displayText: item.text,
                        alignment: item.alignment || null,
                        onPlaybackStart: handlePlaybackStart
                    });
                }
            } catch (error) {
                this.onError?.(error, { phase: 'playback', item });
            } finally {
                this.playing = false;
                this.nextSequence += 1;
            }
        }

        this.resolveIfComplete();
    }
}

export function createTtsPlaybackQueue(options = {}) {
    return new TtsPlaybackQueue(options);
}
