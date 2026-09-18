const catalog = require('../shared/wake-words.json');
function normalizeWakeWords(value) {
    if (!Array.isArray(value)) return catalog.filter(row => row.default).map(row => row.word);
    return catalog.filter(row => value.includes(row.word)).map(row => row.word);
}
function keywordText(value) {
    const selected = normalizeWakeWords(value);
    if (!selected.length) throw new Error('请至少选择一个唤醒词');
    return catalog.filter(row => selected.includes(row.word)).map(row => `${row.tokens} @${row.word}`).join('\n') + '\n';
}
module.exports = { catalog, normalizeWakeWords, keywordText };
