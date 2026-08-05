import {
    getCharacterActionFallbackChain,
    normalizeCharacterActionIntent
} from './character/action-catalog.js';

function getSurface(payload = {}) {
    return payload.persona_surface || payload.personaSurface || payload.surface || {};
}

function getMessageId(payload = {}, context = {}) {
    return String(context.messageId || payload.messageId || payload.id || '');
}

function int16ToBase64(samples) {
    const bytes = new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength);
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 1024) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 1024));
    }
    return window.btoa(binary);
}

export class CharacterRendererClient {
    constructor(transport = window.ailisDesktop?.characterRenderer) {
        this.transport = transport;
        this.lastLipValue = 0;
        this.lastLipSentAt = 0;
        this.audioSequence = 0;
    }

    send(message) {
        this.transport?.send?.(message);
    }

    applyPersonaSurfacePayload(payload = {}, context = {}) {
        const source = getSurface(payload);
        const displayText = String(payload.display_text || payload.displayText || '');
        const speechText = String(payload.speech_text || payload.speechText || displayText);
        const gestureIntent = normalizeCharacterActionIntent(
            source.gestureIntent || source.gesture_intent
        );
        this.send({
            type: 'persona.surface',
            requestId: getMessageId(payload, context),
            surface: {
                emotion: String(source.emotion || 'relaxed'),
                taskState: String(source.taskState || source.task_state || 'speaking'),
                gestureIntent,
                gestureFallbacks: getCharacterActionFallbackChain(
                    gestureIntent,
                    { includeSelf: false }
                ),
                gazeTarget: String(source.gazeTarget || source.gaze_target || 'user'),
                socialTone: String(source.socialTone || source.social_tone || 'soft'),
                durationHint: String(source.durationHint || source.duration_hint || 'short'),
                intensity: Number(source.intensity ?? 0.4),
                speechEnergy: Number(source.speechEnergy ?? source.speech_energy ?? (speechText ? 0.45 : 0)),
                speechText,
                speechDurationSeconds: Math.max(0, Math.min(60, speechText.length * 0.075))
            }
        });
        return true;
    }

    startAudioDrivenSpeech() {
        this.audioSequence = 0;
        this.send({ type: 'persona.speech.start', mode: 'audio' });
    }

    startFallbackSpeech() {
        this.send({ type: 'persona.speech.start', mode: 'fallback' });
    }

    setLipSyncValue(value) {
        const safeValue = Math.max(0, Math.min(1, Number(value) || 0));
        const now = performance.now();
        if (now - this.lastLipSentAt < 32 && Math.abs(safeValue - this.lastLipValue) < 0.08) {
            return;
        }
        this.lastLipValue = safeValue;
        this.lastLipSentAt = now;
        this.send({
            type: 'persona.lip',
            lip: {
                mode: 'energy',
                viseme: 'aa',
                weight: safeValue,
                durationSeconds: 0.12,
                timestamp: Date.now()
            }
        });
    }

    pushAudioSamples(samples, sampleRate) {
        if (!(samples instanceof Int16Array) || samples.length === 0) {
            return;
        }
        this.audioSequence += 1;
        this.send({
            type: 'persona.audio.samples',
            audio: {
                encoding: 'pcm_s16le_base64',
                samplesBase64: int16ToBase64(samples),
                sampleRate: Math.max(8000, Math.round(Number(sampleRate) || 48000)),
                channels: 1,
                sequence: this.audioSequence,
                timestamp: Date.now()
            }
        });
    }

    stopSpeaking() {
        this.lastLipValue = 0;
        this.lastLipSentAt = performance.now();
        this.send({ type: 'persona.speech.stop' });
        this.send({
            type: 'persona.lip',
            lip: {
                mode: 'energy',
                viseme: 'aa',
                weight: 0,
                durationSeconds: 0.08,
                timestamp: Date.now()
            }
        });
    }
}
