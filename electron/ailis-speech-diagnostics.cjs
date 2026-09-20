'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
// Allowlisted metadata only: never serialize provider errors, settings or speech text.
function speechDiagnostic(event = {}) {
    const row = { at: new Date().toISOString() };
    for (const key of ['stage', 'traceId', 'reason', 'inputChars', 'outputChars', 'personaChars', 'durationMs', 'unchanged', 'rewritten', 'bridgeAvailable', 'speechDisabled', 'generation', 'provider']) {
        const value = event[key];
        if (['string', 'number', 'boolean'].includes(typeof value)) row[key] = typeof value === 'string' ? value.slice(0, 96) : value;
    }
    if (typeof event.text === 'string') {
        row.textChars = event.text.length;
        row.textHash = createHash('sha256').update(event.text).digest('hex');
    }
    return row;
}
function appendSpeechDiagnostic(root, event) {
    const row = speechDiagnostic(event);
    try {
        const dir = path.join(root, 'diagnostics');
        fs.mkdirSync(dir, { recursive: true });
        const file = path.join(dir, 'spoken-reply.jsonl');
        if (fs.existsSync(file) && fs.statSync(file).size > 1024 * 1024) fs.renameSync(file, `${file}.previous`);
        fs.appendFileSync(file, `${JSON.stringify(row)}\n`);
    } catch { /* Diagnostics must not break playback. */ }
    console.info('[spoken-reply]', JSON.stringify(row));
}
module.exports = { speechDiagnostic, appendSpeechDiagnostic };
