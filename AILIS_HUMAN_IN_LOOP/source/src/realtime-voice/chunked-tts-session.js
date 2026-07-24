import { createTtsTextChunker } from './tts-text-chunker.js';
import { createTtsPlaybackQueue } from './tts-playback-queue.js';

const DEFAULT_OPTIONS = Object.freeze({
    maxConcurrentTts: 2,
    flushDelayMs: 650
});

function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

export class ChunkedTtsSession {
    constructor({
        synthesize,
        audioPlayer,
        providerId = 'unknown',
        onPlaybackStart = null,
        onPlaybackEnd = null,
        onError = null,
        chunkerOptions = {},
        maxConcurrentTts = DEFAULT_OPTIONS.maxConcurrentTts,
        flushDelayMs = DEFAULT_OPTIONS.flushDelayMs
    } = {}) {
        if (typeof synthesize !== 'function') {
            throw new Error('ChunkedTtsSession requires a synthesize function');
        }
        this.synthesize = synthesize;
        this.audioPlayer = audioPlayer;
        this.providerId = providerId;
        this.onError = onError;
        this.maxConcurrentTts = Math.max(1, maxConcurrentTts);
        this.flushDelayMs = Math.max(120, flushDelayMs);
        this.chunker = createTtsTextChunker(chunkerOptions);
        this.playbackQueue = createTtsPlaybackQueue({
            audioPlayer,
            onPlaybackStart,
            onPlaybackEnd,
            onError
        });
        this.pending = [];
        this.inFlight = 0;
        this.nextSequence = 0;
        this.inputFinished = false;
        this.cancelled = false;
        this.flushTimer = 0;
        this.enqueuedSpeech = false;
        this.playbackStarted = false;
    }

    appendText(deltaText) {
        if (this.cancelled || this.inputFinished) {
            return;
        }
        const text = normalizeText(deltaText);
        if (!text) {
            return;
        }
        this.enqueueChunks(this.chunker.append(text));
        this.scheduleFlush();
    }

    flushPending() {
        if (this.cancelled) {
            return;
        }
        this.clearFlushTimer();
        this.enqueueChunks(this.chunker.flush());
    }

    finish() {
        if (this.cancelled || this.inputFinished) {
            return this.waitUntilDone();
        }
        this.inputFinished = true;
        this.flushPending();
        this.maybeFinishPlayback();
        return this.waitUntilDone();
    }

    async cancel(reason = 'cancelled') {
        if (this.cancelled) {
            return;
        }
        this.cancelled = true;
        this.clearFlushTimer();
        this.pending.length = 0;
        await this.playbackQueue.cancel(reason);
    }

    waitUntilDone() {
        return this.playbackQueue.waitUntilDone();
    }

    waitUntilPlaybackStartedOrDone() {
        if (typeof this.playbackQueue.waitUntilStartedOrDone === 'function') {
            return this.playbackQueue.waitUntilStartedOrDone();
        }
        return this.waitUntilDone().then(() => this.hasPlaybackStarted());
    }

    hasPlaybackStarted() {
        return this.playbackQueue.hasStarted();
    }

    hasActivity() {
        return this.enqueuedSpeech || this.chunker.hasPendingText() || this.pending.length > 0 || this.inFlight > 0;
    }

    scheduleFlush() {
        this.clearFlushTimer();
        if (!this.chunker.hasPendingText()) {
            return;
        }
        this.flushTimer = globalThis.setTimeout(() => {
            this.flushTimer = 0;
            this.flushPending();
            this.pumpSynthesis();
        }, this.flushDelayMs);
    }

    clearFlushTimer() {
        if (this.flushTimer) {
            globalThis.clearTimeout(this.flushTimer);
            this.flushTimer = 0;
        }
    }

    enqueueChunks(chunks = []) {
        for (const chunk of chunks) {
            const text = normalizeText(chunk);
            if (!text) {
                continue;
            }
            this.pending.push({
                sequence: this.nextSequence,
                text
            });
            this.nextSequence += 1;
            this.enqueuedSpeech = true;
        }
        this.pumpSynthesis();
    }

    pumpSynthesis() {
        if (this.cancelled) {
            return;
        }
        while (this.inFlight < this.maxConcurrentTts && this.pending.length) {
            const request = this.pending.shift();
            this.inFlight += 1;
            void this.runSynthesis(request)
                .catch((error) => {
                    this.onError?.(error, {
                        phase: 'synthesis',
                        provider: this.providerId,
                        request
                    });
                    this.playbackQueue.skip(request.sequence);
                })
                .finally(() => {
                    this.inFlight -= 1;
                    this.pumpSynthesis();
                    this.maybeFinishPlayback();
                });
        }
        this.maybeFinishPlayback();
    }

    async runSynthesis(request) {
        const result = await this.synthesize(request.text, {
            sequence: request.sequence,
            providerId: this.providerId
        });
        if (this.cancelled) {
            return;
        }
        if (!result?.audioBase64 && !result?.audioBlob && typeof result?.play !== 'function') {
            this.playbackQueue.skip(request.sequence);
            return;
        }
        this.playbackQueue.enqueue({
            sequence: request.sequence,
            text: request.text,
            audioBase64: result.audioBase64,
            audioBlob: result.audioBlob,
            mimeType: result.mimeType || result.mime_type || 'audio/wav',
            alignment: result.alignment || result.normalizedAlignment || result.normalized_alignment || null,
            play: typeof result.play === 'function' ? result.play : null
        });
    }

    maybeFinishPlayback() {
        if (!this.inputFinished || this.cancelled) {
            return;
        }
        if (this.pending.length || this.inFlight > 0) {
            return;
        }
        this.playbackQueue.finish(this.nextSequence);
    }
}

export function createChunkedTtsSession(options = {}) {
    return new ChunkedTtsSession(options);
}
