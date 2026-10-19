'use strict';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

function imageDimensions(bytes) {
    if (bytes.length >= 24 && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') {
        return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), format: 'png' };
    }
    if (bytes.length >= 10 && ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString())) {
        return { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8), format: 'gif' };
    }
    if (bytes.length >= 30 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') {
        const kind = bytes.toString('ascii', 12, 16);
        if (kind === 'VP8X') return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1, format: 'webp' };
        if (kind === 'VP8 ' && bytes.toString('hex', 23, 26) === '9d012a') {
            return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff, format: 'webp' };
        }
        if (kind === 'VP8L' && bytes[20] === 0x2f) {
            const bits = bytes.readUInt32LE(21);
            return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1, format: 'webp' };
        }
    }
    if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
        let at = 2;
        while (at + 4 <= bytes.length && bytes[at] === 0xff) {
            while (bytes[at] === 0xff) at++;
            const marker = bytes[at++];
            if (marker === 0xda || marker === 0xd9) break;
            if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
            if (at + 2 > bytes.length) break;
            const length = bytes.readUInt16BE(at);
            if (length < 2 || at + length > bytes.length) break;
            if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 8) {
                return { width: bytes.readUInt16BE(at + 5), height: bytes.readUInt16BE(at + 3), format: 'jpeg' };
            }
            at += length;
        }
    }
    return null;
}

// Both the desktop filesystem and remote guests return this same data contract.
// No separate vision model is called: the Agent's next request sees the bytes.
function imageToolResult(bytes, { detail = 'high' } = {}) {
    if (!Buffer.isBuffer(bytes) || !bytes.length || bytes.length > MAX_IMAGE_BYTES) {
        throw new TypeError('Image must be a non-empty file of at most 20 MiB');
    }
    if (!['high', 'original'].includes(detail)) throw new TypeError('view_image detail must be high or original');
    const mimeType = bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) ? 'image/png'
        : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff ? 'image/jpeg'
        : ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString('ascii')) ? 'image/gif'
        : bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP' ? 'image/webp'
        : '';
    if (!mimeType) throw new TypeError('view_image supports PNG, JPEG, GIF and WebP; render other formats to an image first');
    const data = bytes.toString('base64');
    return {
        content: [
            { type: 'text', text: `Image loaded (${mimeType}, ${bytes.length} bytes).` },
            { type: 'image', data, mimeType, _meta: { 'codex/imageDetail': detail } }
        ],
        isError: false,
        details: { status: 'completed', bytes: bytes.length },
        structuredContent: { image_url: `data:${mimeType};base64,${data}`, detail }
    };
}

module.exports = { MAX_IMAGE_BYTES, imageToolResult, imageDimensions };
