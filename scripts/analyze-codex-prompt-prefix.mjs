import fs from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
    const options = { audit: '', output: '' };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--audit') options.audit = argv[++index];
        else if (arg === '--output') options.output = argv[++index];
        else throw new Error(`Unknown argument: ${arg}`);
    }
    if (!options.audit) throw new Error('--audit <protocol-audit.jsonl> is required');
    return options;
}

function usageTokens(usage = {}) {
    const inputTokens = Number(usage.input_tokens ?? usage.prompt_tokens ?? 0) || 0;
    const cachedTokens = Number(
        usage.input_tokens_details?.cached_tokens ??
        usage.prompt_tokens_details?.cached_tokens ??
        0
    ) || 0;
    return { inputTokens, cachedTokens };
}

function stableConfiguration(body = {}) {
    return {
        model: body.model,
        instructions: body.instructions,
        tools: body.tools,
        reasoning: body.reasoning,
        text: body.text,
        tool_choice: body.tool_choice,
        parallel_tool_calls: body.parallel_tool_calls
    };
}

function lcpChars(left, right) {
    const limit = Math.min(left.length, right.length);
    let index = 0;
    while (index < limit && left.charCodeAt(index) === right.charCodeAt(index)) index += 1;
    return index;
}

function compareRequests(previous, current) {
    const previousBody = previous.requestBody || {};
    const currentBody = current.requestBody || {};
    const previousInput = Array.isArray(previousBody.input) ? previousBody.input : [];
    const currentInput = Array.isArray(currentBody.input) ? currentBody.input : [];
    const staticEqual = JSON.stringify(stableConfiguration(previousBody)) === JSON.stringify(stableConfiguration(currentBody));
    let commonItems = 0;
    while (
        commonItems < previousInput.length &&
        commonItems < currentInput.length &&
        JSON.stringify(previousInput[commonItems]) === JSON.stringify(currentInput[commonItems])
    ) commonItems += 1;
    const appendOnly = staticEqual && commonItems === previousInput.length && previousInput.length <= currentInput.length;
    const previousLogical = JSON.stringify([stableConfiguration(previousBody), ...previousInput]);
    const currentLogical = JSON.stringify([stableConfiguration(currentBody), ...currentInput]);
    const commonChars = lcpChars(previousLogical, currentLogical);
    return {
        staticEqual,
        commonItems,
        appendOnly,
        commonChars,
        currentLogicalChars: currentLogical.length,
        prefixCharRatio: currentLogical.length ? commonChars / currentLogical.length : 0
    };
}

function markdown(report) {
    const lines = [
        '# Codex Prompt Prefix Audit',
        '',
        `- Requests: ${report.aggregate.requests}`,
        `- Append-only transitions: ${report.aggregate.appendOnlyTransitions}/${Math.max(0, report.aggregate.requests - 1)}`,
        `- Actual weighted cache rate: ${report.aggregate.actualCacheRatePercent}%`,
        `- Estimated reusable-prefix utilization: ${report.aggregate.prefixUtilizationPercent}%`,
        '',
        '> The reusable-prefix token count is an upper-bound estimate derived from exact structural prefix matches and observed input-token counts. Only the server-reported cached token count is an actual cache measurement.',
        '',
        '| # | Input items | Same items | Static exact | Append-only | Input tokens | Cached | Actual rate | Prefix upper bound | Utilization |',
        '|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|'
    ];
    for (const row of report.rows) {
        lines.push(`| ${row.round} | ${row.inputItemCount} | ${row.commonInputItems} | ${row.staticEqual ? 'yes' : 'no'} | ${row.appendOnly ? 'yes' : 'no'} | ${row.inputTokens} | ${row.cachedTokens} | ${row.actualCacheRatePercent}% | ${row.prefixUpperBoundTokens} | ${row.prefixUtilizationPercent}% |`);
    }
    return `${lines.join('\n')}\n`;
}

const options = parseArgs(process.argv.slice(2));
const auditPath = path.resolve(options.audit);
const records = (await fs.readFile(auditPath, 'utf8')).split(/\r?\n/).filter(Boolean).map(JSON.parse);
const responseById = new Map(records.filter((record) => record.event === 'response').map((record) => [record.requestId, record]));
const requests = records.filter((record) => record.event === 'request' && record.requestBody?.input);
const previousByCacheKey = new Map();
const rows = [];

for (const [index, request] of requests.entries()) {
    const response = responseById.get(request.requestId) || {};
    const { inputTokens, cachedTokens } = usageTokens(response.usage);
    const cacheKey = String(request.promptCacheKey || request.requestBody?.prompt_cache_key || '(none)');
    const previousCandidates = previousByCacheKey.get(cacheKey) || [];
    let best = null;
    for (const previous of previousCandidates) {
        const comparison = compareRequests(previous.request, request);
        const previousInputTokens = previous.inputTokens;
        const prefixUpperBoundTokens = comparison.appendOnly
            ? Math.min(previousInputTokens, inputTokens)
            : Math.floor(inputTokens * comparison.prefixCharRatio);
        if (!best || prefixUpperBoundTokens > best.prefixUpperBoundTokens) {
            best = { ...comparison, prefixUpperBoundTokens };
        }
    }
    const prefixUpperBoundTokens = best?.prefixUpperBoundTokens || 0;
    rows.push({
        round: index + 1,
        requestId: request.requestId,
        cacheKey,
        inputItemCount: request.requestBody.input.length,
        commonInputItems: best?.commonItems || 0,
        staticEqual: best?.staticEqual || false,
        appendOnly: best?.appendOnly || false,
        inputTokens,
        cachedTokens,
        actualCacheRatePercent: inputTokens ? Number((cachedTokens / inputTokens * 100).toFixed(2)) : 0,
        prefixUpperBoundTokens,
        prefixUtilizationPercent: prefixUpperBoundTokens
            ? Number((Math.min(cachedTokens, prefixUpperBoundTokens) / prefixUpperBoundTokens * 100).toFixed(2))
            : 0
    });
    previousCandidates.push({ request, inputTokens });
    previousByCacheKey.set(cacheKey, previousCandidates);
}

const totalInput = rows.reduce((sum, row) => sum + row.inputTokens, 0);
const totalCached = rows.reduce((sum, row) => sum + row.cachedTokens, 0);
const totalPrefixUpperBound = rows.reduce((sum, row) => sum + row.prefixUpperBoundTokens, 0);
const report = {
    schema: 'ailis.codex_prompt_prefix_report.v1',
    createdAt: new Date().toISOString(),
    auditPath,
    rows,
    aggregate: {
        requests: rows.length,
        appendOnlyTransitions: rows.filter((row) => row.appendOnly).length,
        totalInputTokens: totalInput,
        totalCachedTokens: totalCached,
        actualCacheRatePercent: totalInput ? Number((totalCached / totalInput * 100).toFixed(2)) : 0,
        totalPrefixUpperBoundTokens: totalPrefixUpperBound,
        prefixUtilizationPercent: totalPrefixUpperBound
            ? Number((Math.min(totalCached, totalPrefixUpperBound) / totalPrefixUpperBound * 100).toFixed(2))
            : 0
    }
};

const outputBase = options.output ? path.resolve(options.output) : auditPath.replace(/\.jsonl$/i, '');
await fs.mkdir(path.dirname(outputBase), { recursive: true });
await fs.writeFile(`${outputBase}.json`, `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(`${outputBase}.md`, markdown(report));
process.stdout.write(`${JSON.stringify({ outputBase, aggregate: report.aggregate }, null, 2)}\n`);
