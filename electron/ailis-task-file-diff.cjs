'use strict';
// Bounded, deterministic line diff for read-only task evidence, not a patch engine.
function lineDiff(before, after, maxCells = 250000) {
    const lines = text => { const result = text.split('\n'); if (result.at(-1) === '') result.pop(); return result; };
    const a = before === null ? [] : lines(before), b = after === null ? [] : lines(after);
    if ((a.length + 1) * (b.length + 1) > maxCells) return null;
    const width = b.length + 1, table = new Uint32Array((a.length + 1) * width);
    for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) {
        table[i * width + j] = a[i] === b[j] ? table[(i + 1) * width + j + 1] + 1
            : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    }
    const entries = []; let i = 0, j = 0, added = 0, removed = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && a[i] === b[j]) { entries.push({ type: 'same', text: a[i], oldLine: ++i, newLine: ++j }); }
        else if (j < b.length && (i === a.length || table[i * width + j + 1] > table[(i + 1) * width + j])) {
            entries.push({ type: 'add', text: b[j], newLine: ++j }); added++;
        } else { entries.push({ type: 'remove', text: a[i], oldLine: ++i }); removed++; }
    }
    return { entries, added, removed, trailingNewlineChanged: before !== null && after !== null && before.endsWith('\n') !== after.endsWith('\n') };
}
module.exports = { lineDiff };
