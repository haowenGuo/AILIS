import crypto from 'node:crypto';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
    const args = { input: '', candidate: 'mmr-prf-d5-t8-p0.2', samples: 10000 };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];
        if (token === '--input' && next) {
            args.input = path.resolve(next);
            index += 1;
        } else if (token === '--candidate' && next) {
            args.candidate = next;
            index += 1;
        } else if (token === '--samples' && next) {
            args.samples = Math.max(1000, Math.trunc(Number(next) || 10000));
            index += 1;
        } else {
            throw new Error(`Unknown argument: ${token}`);
        }
    }
    if (!args.input) throw new Error('--input is required');
    return args;
}

function parseJsonl(raw) {
    return String(raw || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function mean(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function seededRandom(seedText) {
    let state = crypto.createHash('sha256').update(seedText).digest().readUInt32LE(0) || 1;
    return () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / 0x100000000;
    };
}

function pairedBootstrap(rows, metric, samples, seed) {
    const deltas = rows.map((row) =>
        Number(row.results[metric.candidate]?.[metric.key] || 0) -
        Number(row.results.baseline?.[metric.key] || 0)
    );
    const random = seededRandom(seed);
    const estimates = [];
    for (let sample = 0; sample < samples; sample += 1) {
        let total = 0;
        for (let index = 0; index < deltas.length; index += 1) {
            total += deltas[Math.floor(random() * deltas.length)];
        }
        estimates.push(total / deltas.length);
    }
    estimates.sort((left, right) => left - right);
    return {
        delta: mean(deltas),
        ci95: [
            estimates[Math.floor(estimates.length * 0.025)],
            estimates[Math.floor(estimates.length * 0.975)]
        ],
        probabilityPositive: estimates.filter((value) => value > 0).length / estimates.length
    };
}

function movement(rows, candidate, key) {
    let improved = 0;
    let regressed = 0;
    let unchanged = 0;
    for (const row of rows) {
        const before = Number(row.results.baseline?.[key] || 0);
        const after = Number(row.results[candidate]?.[key] || 0);
        if (after > before) improved += 1;
        else if (after < before) regressed += 1;
        else unchanged += 1;
    }
    return { improved, regressed, unchanged };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const rows = parseJsonl(await fsPromises.readFile(args.input, 'utf8'))
        .filter((row) => row.answerable);
    if (!rows.length || !rows[0].results?.[args.candidate]) {
        throw new Error(`Candidate not found: ${args.candidate}`);
    }
    const groups = {
        full: rows,
        development: rows.filter((row) => row.split === 'development'),
        holdout: rows.filter((row) => row.split === 'holdout')
    };
    for (const questionType of [...new Set(rows.map((row) => row.questionType))]) {
        groups[`type:${questionType}`] = rows.filter((row) => row.questionType === questionType);
    }
    const output = {
        schema: 'ailis.lexical_candidate_analysis.v1',
        candidate: args.candidate,
        bootstrapSamples: args.samples,
        groups: {}
    };
    for (const [groupName, groupRows] of Object.entries(groups)) {
        output.groups[groupName] = { n: groupRows.length };
        for (const key of ['sessionAt8', 'turnAt8']) {
            output.groups[groupName][key] = {
                baseline: mean(groupRows.map((row) => Number(row.results.baseline?.[key] || 0))),
                candidate: mean(groupRows.map((row) => Number(row.results[args.candidate]?.[key] || 0))),
                movement: movement(groupRows, args.candidate, key),
                bootstrap: pairedBootstrap(
                    groupRows,
                    { candidate: args.candidate, key },
                    args.samples,
                    `${args.candidate}:${groupName}:${key}`
                )
            };
        }
    }
    const outputPath = path.join(path.dirname(args.input), `analysis-${args.candidate}.json`);
    await fsPromises.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
    console.log(JSON.stringify({ outputPath, ...output }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
