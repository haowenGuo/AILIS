function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function clampNumber(value, fallback = 0, min = 0, max = 1) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
}

class AIGAME3WorldMemoryProvider {
    constructor(options = {}) {
        this.id = 'aigame3_world_memory';
        this.readOnly = true;
        this.maxItems = Math.max(1, Math.min(Number(options.maxItems) || 10, 20));
        this.maxChars = Math.max(1000, Math.min(Number(options.maxChars) || 7000, 16000));
    }

    getStatus() {
        return {
            id: this.id,
            readOnly: true,
            maxItems: this.maxItems,
            maxChars: this.maxChars
        };
    }

    compileContext(turn = {}) {
        const raw = Array.isArray(turn.relevantWorldMemories)
            ? turn.relevantWorldMemories.slice(0, this.maxItems)
            : [];
        const memories = raw.map((memory) => ({
            memoryId: normalizeText(memory?.memoryId),
            summary: normalizeText(memory?.summary).slice(0, 600),
            evidenceEventIds: [...new Set(
                (Array.isArray(memory?.evidenceEventIds) ? memory.evidenceEventIds : [])
                    .map((entry) => normalizeText(entry))
                    .filter(Boolean)
            )].slice(0, 16),
            occurredAt: normalizeText(memory?.occurredAt),
            salience: clampNumber(memory?.salience)
        })).filter((memory) =>
            memory.memoryId && memory.summary && memory.evidenceEventIds.length > 0
        );
        const payload = {
            provider: this.id,
            readOnly: true,
            saveId: normalizeText(turn?.worldSnapshot?.saveId),
            memories
        };
        while (payload.memories.length > 0) {
            const serialized = JSON.stringify(payload);
            if (serialized.length <= this.maxChars) return serialized;
            payload.memories.pop();
        }
        return JSON.stringify(payload);
    }

    write() {
        const error = new Error('External world memory providers are read-only inside AILIS.');
        error.code = 'external_memory_read_only';
        throw error;
    }
}

module.exports = {
    AIGAME3WorldMemoryProvider
};
