import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

function parseArgs(argv) {
    const options = {
        transcripts: [],
        bridge: '',
        output: '',
        dumpDir: '',
        model: 'gpt-5.6-luna',
        reasoningEffort: 'max'
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--transcript') options.transcripts.push(argv[++index]);
        else if (arg === '--bridge') options.bridge = argv[++index];
        else if (arg === '--output') options.output = argv[++index];
        else if (arg === '--dump-dir') options.dumpDir = argv[++index];
        else if (arg === '--model') options.model = argv[++index];
        else if (arg === '--reasoning-effort') options.reasoningEffort = argv[++index];
        else throw new Error(`Unknown argument: ${arg}`);
    }
    if (!options.transcripts.length || !options.bridge || !options.output) {
        throw new Error('Required: --transcript [label=]<path> --bridge <codex-model-bridge.cjs> --output <base> [--dump-dir <dir>]');
    }
    return options;
}

function transcriptSpec(value) {
    const separator = value.indexOf('=');
    if (separator > 0 && !/^[A-Za-z]:[\\/]/.test(value)) {
        return { label: value.slice(0, separator), filePath: value.slice(separator + 1) };
    }
    return { label: path.basename(value, path.extname(value)), filePath: value };
}

function exact(value) {
    return JSON.stringify(value);
}

function usageFromCall(call = {}) {
    return {
        inputTokens: Number(call.usage?.promptTokens || 0),
        cachedTokens: Number(call.usage?.cachedTokens || 0)
    };
}

function compareBodies(previous = {}, current = {}) {
    const previousInput = Array.isArray(previous.input) ? previous.input : [];
    const currentInput = Array.isArray(current.input) ? current.input : [];
    let commonItems = 0;
    while (
        commonItems < previousInput.length &&
        commonItems < currentInput.length &&
        exact(previousInput[commonItems]) === exact(currentInput[commonItems])
    ) commonItems += 1;

    const keys = Array.from(new Set([...Object.keys(previous), ...Object.keys(current)])).sort();
    const changedFields = keys.filter((key) => key !== 'input' && exact(previous[key]) !== exact(current[key]));
    return {
        previousItems: previousInput.length,
        currentItems: currentInput.length,
        commonItems,
        changedFields,
        appendOnly: changedFields.length === 0 && commonItems === previousInput.length
    };
}

function markdown(report) {
    const lines = [
        '# AILIS final wire-request prefix audit',
        '',
        `- Runs: ${report.aggregate.runs}`,
        `- Requests reconstructed: ${report.aggregate.rounds}`,
        `- Exact final-body append-only transitions: ${report.aggregate.appendOnlyTransitions}/${report.aggregate.transitions}`,
        `- Transitions with non-input field changes: ${report.aggregate.transitionsWithFieldChanges}`,
        `- Server weighted cache rate: ${report.aggregate.cacheRatePercent}%`,
        '',
        '> This report reconstructs the final Responses API JSON body with the immutable bridge source used by the evaluated run. It compares every top-level body field and every prior input item. HTTP headers and server-injected hidden context are not available in historical TaskAgent transcripts.',
        ''
    ];
    for (const run of report.runs) {
        lines.push(`## ${run.label}`, '');
        lines.push('| Round | Items | Common | Final body append-only | Changed non-input fields | Input | Cached | Cache rate |');
        lines.push('|---:|---:|---:|---:|---|---:|---:|---:|');
        for (const row of run.rows) {
            lines.push(`| ${row.round} | ${row.inputItems} | ${row.commonItems} | ${row.appendOnly === null ? '-' : row.appendOnly ? 'yes' : 'no'} | ${row.changedFields.length ? row.changedFields.join(', ') : '-'} | ${row.inputTokens} | ${row.cachedTokens} | ${row.cacheRatePercent}% |`);
        }
        lines.push('');
    }
    return `${lines.join('\n')}\n`;
}

const options = parseArgs(process.argv.slice(2));
const bridgePath = path.resolve(options.bridge);
const require = createRequire(import.meta.url);
const { buildCodexResponsesRequest } = require(bridgePath);
const runs = [];

for (const rawSpec of options.transcripts) {
    const spec = transcriptSpec(rawSpec);
    const records = (await fs.readFile(path.resolve(spec.filePath), 'utf8'))
        .split(/\r?\n/)
        .filter(Boolean)
        .map(JSON.parse);
    const callByIteration = new Map(
        records
            .filter((record) => record.type === 'agent.llm_call')
            .map((record) => [Number(record.payload?.iteration), record.payload])
    );
    const snapshots = records
        .filter((record) => record.type === 'agent.context_snapshot' && record.payload?.model_input_request)
        .sort((left, right) => Number(left.payload.iteration) - Number(right.payload.iteration));
    const rows = [];
    const bodies = [];
    let previousBody = null;
    for (const snapshot of snapshots) {
        const iteration = Number(snapshot.payload.iteration);
        const body = buildCodexResponsesRequest(
            { model: options.model, reasoningEffort: options.reasoningEffort },
            snapshot.payload.model_input_request,
            snapshot.payload.messages || []
        );
        const comparison = previousBody ? compareBodies(previousBody, body) : null;
        const usage = usageFromCall(callByIteration.get(iteration));
        rows.push({
            round: iteration + 1,
            topLevelKeys: Object.keys(body),
            inputItems: Array.isArray(body.input) ? body.input.length : 0,
            commonItems: comparison?.commonItems || 0,
            appendOnly: comparison?.appendOnly ?? null,
            changedFields: comparison?.changedFields || [],
            inputTokens: usage.inputTokens,
            cachedTokens: usage.cachedTokens,
            cacheRatePercent: usage.inputTokens
                ? Number((usage.cachedTokens / usage.inputTokens * 100).toFixed(2))
                : 0
        });
        bodies.push({ round: iteration + 1, body });
        previousBody = body;
    }
    runs.push({
        label: spec.label,
        transcript: path.resolve(spec.filePath),
        rows,
        bodies
    });
}

const allRows = runs.flatMap((run) => run.rows);
const transitions = runs.reduce((sum, run) => sum + Math.max(0, run.rows.length - 1), 0);
const totalInput = allRows.reduce((sum, row) => sum + row.inputTokens, 0);
const totalCached = allRows.reduce((sum, row) => sum + row.cachedTokens, 0);
const report = {
    schema: 'ailis.final_wire_prefix_audit.v1',
    createdAt: new Date().toISOString(),
    bridgePath,
    settings: { model: options.model, reasoningEffort: options.reasoningEffort },
    aggregate: {
        runs: runs.length,
        rounds: allRows.length,
        transitions,
        appendOnlyTransitions: allRows.filter((row) => row.appendOnly === true).length,
        transitionsWithFieldChanges: allRows.filter((row) => row.changedFields.length > 0).length,
        inputTokens: totalInput,
        cachedTokens: totalCached,
        cacheRatePercent: totalInput ? Number((totalCached / totalInput * 100).toFixed(2)) : 0
    },
    runs: runs.map(({ bodies, ...run }) => run)
};

const outputBase = path.resolve(options.output);
await fs.mkdir(path.dirname(outputBase), { recursive: true });
await fs.writeFile(`${outputBase}.json`, `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(`${outputBase}.md`, markdown(report));
if (options.dumpDir) {
    const dumpDir = path.resolve(options.dumpDir);
    await fs.mkdir(dumpDir, { recursive: true });
    for (const run of runs) {
        const runDir = path.join(dumpDir, run.label.replace(/[^A-Za-z0-9._-]+/g, '_'));
        await fs.mkdir(runDir, { recursive: true });
        for (const { round, body } of run.bodies) {
            const fileName = `request-${String(round).padStart(3, '0')}.json`;
            await fs.writeFile(path.join(runDir, fileName), `${JSON.stringify(body, null, 2)}\n`);
        }
    }
}
process.stdout.write(`${JSON.stringify({ outputBase, aggregate: report.aggregate }, null, 2)}\n`);
