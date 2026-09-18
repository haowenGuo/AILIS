class WakePCM extends AudioWorkletProcessor {
    constructor() { super(); this.buffer = new Float32Array(4096); this.offset = 0; }
    process(inputs) {
        const input = inputs[0]?.[0];
        if (input) for (const sample of input) {
            this.buffer[this.offset++] = sample;
            if (this.offset === this.buffer.length) {
                this.port.postMessage(this.buffer, [this.buffer.buffer]);
                this.buffer = new Float32Array(4096); this.offset = 0;
            }
        }
        // Outputs stay silent: never feed microphone audio back into speakers.
        return true;
    }
}
registerProcessor('ailis-wake-pcm', WakePCM);
