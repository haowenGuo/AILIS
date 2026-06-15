const DEFAULT_OPTIONS = Object.freeze({
    firstMinChars: 10,
    minChars: 18,
    maxChars: 52,
    forceMinChars: 6
});

const HARD_BOUNDARY_PATTERN = /[。！？!?]\s*|\n+/u;
const SOFT_BOUNDARY_PATTERN = /[，、；：,;:]\s*/u;
const URL_PATTERN = /https?:\/\/\S*$/i;

function normalizeDeltaText(text) {
    return String(text || '')
        .replace(/\r\n?/g, '\n')
        .replace(/\u00a0/g, ' ');
}

function compactChunkText(text) {
    return String(text || '')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function countFenceMarkers(text) {
    return (String(text || '').match(/```/g) || []).length;
}

function hasOpenCodeFence(text) {
    return countFenceMarkers(text) % 2 === 1;
}

function findCompleteCodeFenceCut(buffer) {
    const markers = [...String(buffer || '').matchAll(/```/g)];
    if (markers.length < 2) {
        return -1;
    }
    const closeEnd = markers[1].index + markers[1][0].length;
    const nextNewline = buffer.indexOf('\n', closeEnd);
    return nextNewline >= 0 ? nextNewline + 1 : closeEnd;
}

function isUnsafeBoundary(buffer, boundaryIndex) {
    const prefix = buffer.slice(0, boundaryIndex + 1);
    return URL_PATTERN.test(prefix);
}

function findBoundary(buffer, pattern, minimumChars) {
    const source = String(buffer || '');
    for (let index = 0; index < source.length; index += 1) {
        const slice = source.slice(index);
        const match = slice.match(pattern);
        if (!match || match.index !== 0) {
            continue;
        }
        const endIndex = index + match[0].length;
        if (endIndex < minimumChars || isUnsafeBoundary(source, endIndex - 1)) {
            continue;
        }
        return endIndex;
    }
    return -1;
}

function findLastSoftBoundaryBefore(buffer, maxChars) {
    const limit = Math.min(buffer.length, maxChars);
    for (let index = limit - 1; index >= 0; index -= 1) {
        const char = buffer[index];
        if (/[，、；：,;:\s]/u.test(char) && !isUnsafeBoundary(buffer, index)) {
            return index + 1;
        }
    }
    return limit;
}

export class TtsTextChunker {
    constructor(options = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        };
        this.buffer = '';
        this.emittedCount = 0;
    }

    append(deltaText) {
        const nextText = normalizeDeltaText(deltaText);
        if (!nextText) {
            return [];
        }
        this.buffer += nextText;
        return this.drain(false);
    }

    flush() {
        return this.drain(true);
    }

    reset() {
        this.buffer = '';
        this.emittedCount = 0;
    }

    hasPendingText() {
        return compactChunkText(this.buffer).length > 0;
    }

    drain(force = false) {
        const chunks = [];
        while (compactChunkText(this.buffer)) {
            if (!force && hasOpenCodeFence(this.buffer)) {
                break;
            }

            const minChars = this.emittedCount === 0
                ? this.options.firstMinChars
                : this.options.minChars;
            const codeFenceCut = this.buffer.includes('```') && !force
                ? findCompleteCodeFenceCut(this.buffer)
                : -1;
            const hardBoundary = codeFenceCut > 0 ? -1 : findBoundary(this.buffer, HARD_BOUNDARY_PATTERN, Math.max(1, minChars));
            const softBoundary = codeFenceCut > 0 ? -1 : findBoundary(this.buffer, SOFT_BOUNDARY_PATTERN, Math.max(1, minChars));
            let cutIndex = -1;

            if (codeFenceCut > 0) {
                cutIndex = codeFenceCut;
            } else if (hardBoundary > 0) {
                cutIndex = hardBoundary;
            } else if (softBoundary > 0) {
                cutIndex = softBoundary;
            } else if (this.buffer.length >= this.options.maxChars) {
                cutIndex = findLastSoftBoundaryBefore(this.buffer, this.options.maxChars);
            } else if (force && (this.buffer.length >= this.options.forceMinChars || this.emittedCount > 0)) {
                cutIndex = this.buffer.length;
            } else if (force && this.emittedCount === 0) {
                cutIndex = this.buffer.length;
            }

            if (cutIndex <= 0) {
                break;
            }

            const chunk = compactChunkText(this.buffer.slice(0, cutIndex));
            this.buffer = this.buffer.slice(cutIndex);
            if (chunk) {
                chunks.push(chunk);
                this.emittedCount += 1;
            }
        }
        return chunks;
    }
}

export function createTtsTextChunker(options = {}) {
    return new TtsTextChunker(options);
}
