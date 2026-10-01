'use strict';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

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

module.exports = { MAX_IMAGE_BYTES, imageToolResult };
