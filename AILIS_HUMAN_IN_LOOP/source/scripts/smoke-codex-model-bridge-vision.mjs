import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');

const CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
    let crc = value;
    for (let bit = 0; bit < 8; bit += 1) {
        crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    return crc >>> 0;
});

function crc32(buffer) {
    let crc = 0xffffffff;
    for (const byte of buffer) {
        crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
    const name = Buffer.from(type, 'ascii');
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const checksum = Buffer.alloc(4);
    checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
    return Buffer.concat([length, name, data, checksum]);
}

function buildColorPanelPng(order, width = 360, height = 120) {
    const colors = {
        RED: [255, 0, 0],
        GREEN: [0, 200, 0],
        BLUE: [0, 60, 255]
    };
    const stride = 1 + (width * 3);
    const raw = Buffer.alloc(stride * height);
    const panelWidth = width / order.length;
    for (let y = 0; y < height; y += 1) {
        const rowOffset = y * stride;
        raw[rowOffset] = 0;
        for (let x = 0; x < width; x += 1) {
            const panel = Math.min(order.length - 1, Math.floor(x / panelWidth));
            const [red, green, blue] = colors[order[panel]];
            const offset = rowOffset + 1 + (x * 3);
            raw[offset] = red;
            raw[offset + 1] = green;
            raw[offset + 2] = blue;
        }
    }
    const header = Buffer.alloc(13);
    header.writeUInt32BE(width, 0);
    header.writeUInt32BE(height, 4);
    header[8] = 8;
    header[9] = 2;
    return Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        pngChunk('IHDR', header),
        pngChunk('IDAT', zlib.deflateSync(raw)),
        pngChunk('IEND', Buffer.alloc(0))
    ]);
}

function shuffledColors() {
    const values = ['RED', 'GREEN', 'BLUE'];
    for (let index = values.length - 1; index > 0; index -= 1) {
        const swap = crypto.randomInt(index + 1);
        [values[index], values[swap]] = [values[swap], values[index]];
    }
    return values;
}

const order = shuffledColors();
const image = buildColorPanelPng(order);
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-codex-vision-smoke-'));
const imagePath = path.join(tempDir, 'random-color-panels.png');
await fs.writeFile(imagePath, image);

try {
    const result = await callDesktopLlmProvider({
        provider: 'codex-model-bridge',
        baseUrl: 'codex://chatgpt-oauth',
        model: process.env.AILIS_CODEX_MODEL || 'gpt-5.5',
        reasoningEffort: process.env.AILIS_CODEX_REASONING_EFFORT || 'low',
        timeoutMs: 180000
    }, {
        messages: [{
            role: 'system',
            content: 'Inspect the supplied image. Return only the three visible panel color names from left to right, separated by commas.'
        }, {
            role: 'user',
            content: [
                { type: 'text', text: 'What is the left-to-right panel order?' },
                {
                    type: 'image_url',
                    image_url: {
                        url: `data:image/png;base64,${image.toString('base64')}`
                    },
                    detail: 'high'
                }
            ]
        }],
        tools: [],
        toolChoice: 'none'
    });
    const observed = String(result.content || '').toUpperCase().match(/\b(?:RED|GREEN|BLUE)\b/g) || [];
    const passed = result.ok === true &&
        observed.length >= 3 &&
        order.every((color, index) => observed[index] === color);
    console.log(JSON.stringify({
        ok: passed,
        expected: order,
        observed: observed.slice(0, 3),
        content: result.content || '',
        provider: result.provider || '',
        model: result.model || '',
        usage: result.usage || null,
        imagePath
    }, null, 2));
    if (!passed) {
        process.exitCode = 1;
    }
} finally {
    await fs.rm(tempDir, { recursive: true, force: true });
}
