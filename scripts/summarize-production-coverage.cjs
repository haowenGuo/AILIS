'use strict';

// V8 evidence is positive evidence only. Never turn an unobserved file into a
// deletion candidate without reviewing entries, external consumers and features.
const fs = require('node:fs');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { ROOT, audit, assertValid } = require('./production-closure.cjs');

function summarize(directories, { report = assertValid(audit()) } = {}) {
    const files = new Map(report.files.filter(file => /\.(?:cjs|mjs|js)$/.test(file)).map(file => [file, new Set()]));
    let recordings = 0;
    for (const directory of directories) {
        for (const name of fs.readdirSync(directory).filter(name => name.endsWith('.json'))) {
            const data = JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
            if (!Array.isArray(data.result)) continue;
            recordings++;
            for (const script of data.result) {
                let absolute;
                try { absolute = script.url.startsWith('file:') ? fileURLToPath(script.url) : script.url; } catch { continue; }
                const normalized = absolute.replace(/\\/g, '/');
                let file = path.relative(ROOT, absolute).replace(/\\/g, '/');
                const asar = normalized.match(/\/resources\/app\.asar(?:\.unpacked)?\/(.+)$/);
                if (asar) file = asar[1];
                if (!files.has(file)) continue;
                const hits = files.get(file);
                for (const fn of script.functions || []) {
                    if (fn.ranges?.some(range => range.count > 0)) hits.add(`${fn.functionName}:${fn.ranges[0].startOffset}`);
                }
            }
        }
    }
    const rows = [...files].map(([file, hits]) => ({ file, observed: hits.size > 0, observedFunctions: hits.size }));
    return { scope: 'Node tests and packaged offline probe only; not renderer, Python, branch or end-to-end product coverage',
        interpretation: 'Unobserved means no hits collected, not unused or necessarily unexecuted (permission-restricted workers may not write coverage). Function counts are V8-reported observations, not a static denominator.',
        recordings, eligibleFiles: rows.length, observedFiles: rows.filter(row => row.observed).length,
        unobservedFiles: rows.filter(row => !row.observed).map(row => row.file), files: rows };
}

module.exports = { summarize };
if (require.main === module) {
    const [output, ...directories] = process.argv.slice(2);
    if (!output || !directories.length) throw new Error('Usage: node scripts/summarize-production-coverage.cjs <output.json> <V8 directory>...');
    const result = summarize(directories);
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify({ recordings: result.recordings, eligibleFiles: result.eligibleFiles, observedFiles: result.observedFiles, scope: result.scope }));
}
