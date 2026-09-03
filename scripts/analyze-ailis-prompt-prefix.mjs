import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

function parseArgs(argv) {
    const transcripts = [];
    let output = '';
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--transcript') transcripts.push(argv[++index]);
        else if (arg === '--output') output = argv[++index];
        else throw new Error(`Unknown argument: ${arg}`);
    }
    if (!transcripts.length) {
        throw new Error('At least one --transcript [label=]<path> is required');
    }
    return { transcripts, output };
}

function parseTranscriptSpec(spec) {
    const separator = spec.indexOf('=');
    if (separator > 0 && !/^[A-Za-z]:[\\/]/.test(spec)) {
        return { label: spec.slice(0, separator), filePath: spec.slice(separator + 1) };
    }
    return { label: path.basename(spec, path.extname(spec)), filePath: spec };
}

function exactJson(value) {
    return JSON.stringify(value);
}

function sha256(value) {
    return createHash('sha256').update(String(value ?? '')).digest('hex');
}

function stableRequestProjection(request = {}) {
    return {
        instructions: request.instructions ?? '',
        tools: request.tools ?? [],
        tool_choice: request.tool_choice,
        parallel_tool_calls: request.parallel_tool_calls
    };
}

function compareModelInputs(previousRequest = {}, currentRequest = {}) {
    const previousInput = Array.isArray(previousRequest.input) ? previousRequest.input : [];
    const currentInput = Array.isArray(currentRequest.input) ? currentRequest.input : [];
    const stableEqual = exactJson(stableRequestProjection(previousRequest)) ===
        exactJson(stableRequestProjection(currentRequest));
    let commonItems = 0;
    while (
        commonItems < previousInput.length &&
        commonItems < currentInput.length &&
        exactJson(previousInput[commonItems]) === exactJson(currentInput[commonItems])
    ) {
        commonItems += 1;
    }
    return {
        stableEqual,
        commonItems,
        previousItems: previousInput.length,
        currentItems: currentInput.length,
        appendOnly: stableEqual && commonItems === previousInput.length,
        firstDifferentItem: commonItems < Math.min(previousInput.length, currentInput.length)
            ? commonItems
            : null
    };
}

function markdown(report) {
    const lines = [
        '# AILIS exact prompt-prefix audit',
        '',
        `- Runs: ${report.aggregate.runs}`,
        `- Model rounds: ${report.aggregate.rounds}`,
        `- Exact append-only transitions: ${report.aggregate.appendOnlyTransitions}/${report.aggregate.transitions}`,
        `- Stable prompt-cache-key transitions: ${report.aggregate.stableCacheKeyTransitions}/${report.aggregate.transitions}`,
        `- Exact-prefix cacheable coverage: ${report.aggregate.exactPrefixCoveragePercent}%`,
        `- Server weighted cache rate: ${report.aggregate.actualCacheRatePercent}%`,
        `- Server realization of exact-prefix opportunity: ${report.aggregate.realizedPrefixPercent}%`,
        `- Zero-cache rounds after round 1 despite exact append-only input: ${report.aggregate.unexpectedZeroCacheRounds}`,
        '',
        '> Exact append-only means instructions, tool schemas, tool choice, parallel-tool setting, and every previous input item are byte-for-byte identical under JSON serialization. Exact-prefix cacheable coverage is sum(previous-round input tokens for append-only transitions) / sum(current-round input tokens, including each run\'s uncached first round). It is a structural opportunity, not a server cache measurement.',
        ''
    ];
    for (const run of report.runs) {
        lines.push(`## ${run.label}`, '');
        lines.push(
            `- Rounds: ${run.summary.rounds}`,
            `- Append-only: ${run.summary.appendOnlyTransitions}/${run.summary.transitions}`,
            `- Exact-prefix cacheable coverage: ${run.summary.exactPrefixCoveragePercent}%`,
            `- Actual cache: ${run.summary.actualCacheRatePercent}%`,
            `- Prefix realization: ${run.summary.realizedPrefixPercent}%`,
            `- Unexpected zero-cache rounds: ${run.summary.unexpectedZeroCacheRounds}`,
            ''
        );
        lines.push('| Round | Items | Common | Append-only | Cache key stable | Input tokens | Cached | Cache rate | Exact-prefix tokens | Prefix coverage | Prefix realized |');
        lines.push('|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
        for (const row of run.rows) {
            lines.push(`| ${row.round} | ${row.inputItems} | ${row.commonInputItems} | ${row.appendOnly ? 'yes' : 'no'} | ${row.cacheKeyStable === null ? '-' : row.cacheKeyStable ? 'yes' : 'no'} | ${row.inputTokens} | ${row.cachedTokens} | ${row.actualCacheRatePercent}% | ${row.prefixUpperBoundTokens} | ${row.exactPrefixCoveragePercent}% | ${row.prefixRealizedPercent}% |`);
        }
        lines.push('');
    }
    return `${lines.join('\n')}\n`;
}

async function analyzeTranscript(spec) {
    const { label, filePath } = parseTranscriptSpec(spec);
    const resolvedPath = path.resolve(filePath);
    const records = (await fs.readFile(resolvedPath, 'utf8'))
        .split(/\r?\n/)
        .filter(Boolean)
        .map(JSON.parse);
    const snapshots = new Map(
        records
            .filter((record) => record.type === 'agent.context_snapshot')
            .map((record) => [Number(record.payload?.iteration), record.payload])
    );
    const calls = records
        .filter((record) => record.type === 'agent.llm_call')
        .map((record) => record.payload)
        .sort((left, right) => Number(left.iteration) - Number(right.iteration));
    const rows = [];
    let previous = null;
    for (const call of calls) {
        const iteration = Number(call.iteration);
        const snapshot = snapshots.get(iteration);
        const request = snapshot?.model_input_request;
        if (!request) continue;
        const inputTokens = Number(call.usage?.promptTokens || 0);
        const cachedTokens = Number(call.usage?.cachedTokens || 0);
        const comparison = previous ? compareModelInputs(previous.request, request) : null;
        const prefixUpperBoundTokens = comparison?.appendOnly ? previous.inputTokens : 0;
        const cacheKey = String(request.prompt_cache_key || '');
        const cacheKeyStable = previous ? cacheKey === previous.cacheKey : null;
        rows.push({
            round: iteration + 1,
            inputItems: Array.isArray(request.input) ? request.input.length : 0,
            commonInputItems: comparison?.commonItems || 0,
            stableRequestPrefix: comparison?.stableEqual || false,
            appendOnly: comparison?.appendOnly || false,
            firstDifferentItem: comparison?.firstDifferentItem ?? null,
            cacheKeyStable,
            cacheKeyHash: cacheKey ? sha256(cacheKey) : '',
            instructionsHash: sha256(request.instructions || ''),
            toolsHash: sha256(exactJson(request.tools || [])),
            inputTokens,
            cachedTokens,
            actualCacheRatePercent: inputTokens
                ? Number((cachedTokens / inputTokens * 100).toFixed(2))
                : 0,
            prefixUpperBoundTokens,
            exactPrefixCoveragePercent: inputTokens
                ? Number((prefixUpperBoundTokens / inputTokens * 100).toFixed(2))
                : 0,
            prefixRealizedPercent: prefixUpperBoundTokens
                ? Number((cachedTokens / prefixUpperBoundTokens * 100).toFixed(2))
                : 0
        });
        previous = { request, inputTokens, cacheKey };
    }
    const totalInput = rows.reduce((sum, row) => sum + row.inputTokens, 0);
    const totalCached = rows.reduce((sum, row) => sum + row.cachedTokens, 0);
    const prefixUpperBound = rows.reduce((sum, row) => sum + row.prefixUpperBoundTokens, 0);
    return {
        label,
        transcript: resolvedPath,
        rows,
        summary: {
            rounds: rows.length,
            transitions: Math.max(0, rows.length - 1),
            appendOnlyTransitions: rows.filter((row) => row.appendOnly).length,
            stableCacheKeyTransitions: rows.filter((row) => row.cacheKeyStable === true).length,
            inputTokens: totalInput,
            cachedTokens: totalCached,
            actualCacheRatePercent: totalInput
                ? Number((totalCached / totalInput * 100).toFixed(2))
                : 0,
            prefixUpperBoundTokens: prefixUpperBound,
            exactPrefixCoveragePercent: totalInput
                ? Number((prefixUpperBound / totalInput * 100).toFixed(2))
                : 0,
            realizedPrefixPercent: prefixUpperBound
                ? Number((totalCached / prefixUpperBound * 100).toFixed(2))
                : 0,
            unexpectedZeroCacheRounds: rows.filter((row) => row.appendOnly && row.cachedTokens === 0).length
        }
    };
}

const options = parseArgs(process.argv.slice(2));
const runs = [];
for (const spec of options.transcripts) runs.push(await analyzeTranscript(spec));
const allRows = runs.flatMap((run) => run.rows);
const aggregate = {
    runs: runs.length,
    rounds: allRows.length,
    transitions: runs.reduce((sum, run) => sum + run.summary.transitions, 0),
    appendOnlyTransitions: runs.reduce((sum, run) => sum + run.summary.appendOnlyTransitions, 0),
    stableCacheKeyTransitions: runs.reduce((sum, run) => sum + run.summary.stableCacheKeyTransitions, 0),
    inputTokens: runs.reduce((sum, run) => sum + run.summary.inputTokens, 0),
    cachedTokens: runs.reduce((sum, run) => sum + run.summary.cachedTokens, 0),
    prefixUpperBoundTokens: runs.reduce((sum, run) => sum + run.summary.prefixUpperBoundTokens, 0),
    unexpectedZeroCacheRounds: runs.reduce((sum, run) => sum + run.summary.unexpectedZeroCacheRounds, 0)
};
aggregate.actualCacheRatePercent = aggregate.inputTokens
    ? Number((aggregate.cachedTokens / aggregate.inputTokens * 100).toFixed(2))
    : 0;
aggregate.exactPrefixCoveragePercent = aggregate.inputTokens
    ? Number((aggregate.prefixUpperBoundTokens / aggregate.inputTokens * 100).toFixed(2))
    : 0;
aggregate.realizedPrefixPercent = aggregate.prefixUpperBoundTokens
    ? Number((aggregate.cachedTokens / aggregate.prefixUpperBoundTokens * 100).toFixed(2))
    : 0;

const report = {
    schema: 'ailis.exact_prompt_prefix_audit.v1',
    createdAt: new Date().toISOString(),
    aggregate,
    runs
};
const outputBase = path.resolve(options.output || 'ailis-prompt-prefix-audit');
await fs.mkdir(path.dirname(outputBase), { recursive: true });
await fs.writeFile(`${outputBase}.json`, `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(`${outputBase}.md`, markdown(report));
process.stdout.write(`${JSON.stringify({ outputBase, aggregate }, null, 2)}\n`);
