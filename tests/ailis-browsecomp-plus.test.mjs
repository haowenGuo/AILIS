import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import {
    OFFICIAL_QUERY_TEMPLATE,
    auditToolCalls,
    buildBrowseCompPrompt,
    buildOfficialRunRecord,
    extractTranscriptToolCalls,
    loadBrowseCompQueries
} from '../scripts/browsecomp-plus/ailis-browsecomp-plus-lib.mjs';
import { buildRunManifest, parseArgs } from '../scripts/run-ailis-browsecomp-plus.mjs';

const require = createRequire(import.meta.url);
const { AILISRuntime } = require('../electron/ailis-runtime.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE_DATASET = path.join(ROOT, 'evals', 'browsecomp-plus', 'fixtures', 'ground-truth.jsonl');
const FIXTURE_SERVER = path.join(ROOT, 'scripts', 'browsecomp-plus', 'fixture-mcp-server.cjs');

test('BrowseComp-Plus prompt preserves the official response contract without answer leakage', () => {
    const prompt = buildBrowseCompPrompt('Which person is named?', { withGetDocument: true });
    assert.equal(prompt, OFFICIAL_QUERY_TEMPLATE.replace('{Question}', 'Which person is named?'));
    assert.match(prompt, /Explanation:/);
    assert.match(prompt, /Exact Answer:/);
    assert.match(prompt, /Confidence:/);
    assert.doesNotMatch(prompt, /Elias Noor/);
});

test('fixture queries load deterministically and retain qrels', async () => {
    const records = await loadBrowseCompQueries(FIXTURE_DATASET, { offset: 0, limit: 1 });
    assert.equal(records.length, 1);
    assert.equal(records[0].query_id, 'fixture-q1');
    assert.deepEqual(records[0].evidence_docids, ['fixture-101']);
    assert.equal(records[0].answer, '17 May 2018');
});

test('explicit query selection validates IDs and preserves dataset order', async () => {
    const records = await loadBrowseCompQueries(FIXTURE_DATASET, {
        queryIds: ['fixture-q2', 'fixture-q1']
    });
    assert.deepEqual(records.map((record) => record.query_id), ['fixture-q1', 'fixture-q2']);
    await assert.rejects(
        loadBrowseCompQueries(FIXTURE_DATASET, { queryIds: ['missing-query'] }),
        /query IDs not found/
    );
});

test('deterministic sampling freezes a cohort and rejects ambiguous selectors', async () => {
    const first = await loadBrowseCompQueries(FIXTURE_DATASET, {
        sampleSize: 1,
        sampleSeed: 'balanced-pilot-v1'
    });
    const repeated = await loadBrowseCompQueries(FIXTURE_DATASET, {
        sampleSize: 1,
        sampleSeed: 'balanced-pilot-v1'
    });
    assert.equal(first.length, 1);
    assert.deepEqual(first.map((record) => record.query_id), repeated.map((record) => record.query_id));
    await assert.rejects(
        loadBrowseCompQueries(FIXTURE_DATASET, { sampleSize: 1, limit: 1 }),
        /cannot be combined/
    );
    await assert.rejects(
        loadBrowseCompQueries(FIXTURE_DATASET, { sampleSize: 3 }),
        /exceeds dataset size/
    );
});

test('tool audit counts fixed-corpus calls, extracts docids, and rejects public web', () => {
    const audit = auditToolCalls([
        {
            callId: 'a',
            tool: 'mcp__browsecomp_plus__search',
            status: 'completed',
            ok: true,
            resultPreview: JSON.stringify({ content: [{ type: 'text', text: JSON.stringify([{ docid: 'fixture-101' }]) }] })
        },
        { callId: 'b', tool: 'web_run', status: 'completed', ok: true }
    ]);
    assert.equal(audit.counts.mcp__browsecomp_plus__search, 1);
    assert.deepEqual(audit.retrievedDocIds, ['fixture-101']);
    assert.equal(audit.fixedCorpusValid, false);
    assert.equal(audit.violations[0].tool, 'web_run');
});

test('official run adapter produces the upstream minimum schema', () => {
    const record = buildOfficialRunRecord({
        query: { query_id: 'fixture-q1' },
        responseText: 'Explanation: Evidence [fixture-101].\nExact Answer: 17 May 2018\nConfidence: 99%',
        response: { ok: true },
        analysis: {
            summary: { durationMs: 10, rounds: 2, llmCalls: 2, usage: { totalTokens: 30 } },
            toolCalls: [{
                callId: 'a',
                tool: 'mcp__browsecomp_plus__search',
                ok: true,
                resultPreview: JSON.stringify([{ docid: 'fixture-101' }])
            }]
        },
        model: 'test-model',
        retriever: 'fixture'
    });
    assert.equal(record.status, 'completed');
    assert.equal(record.query_id, 'fixture-q1');
    assert.equal(record.tool_call_counts.search, 1);
    assert.deepEqual(record.retrieved_docids, ['fixture-101']);
    assert.equal(record.result.at(-1).type, 'output_text');
});

test('transcript adapter keeps full structured MCP results for retrieval recall', () => {
    const calls = extractTranscriptToolCalls([
        { type: 'tool.call', payload: { callId: 'call-1', toolName: 'mcp__browsecomp_plus__search', args: { query: 'clock' } } },
        {
            type: 'tool.result',
            payload: {
                callId: 'call-1',
                toolName: 'mcp__browsecomp_plus__search',
                ok: true,
                status: 'completed',
                result: { structuredContent: [{ docid: '101' }, { docid: '102' }] },
                outputPreview: 'truncated'
            }
        }
    ]);
    assert.equal(calls.length, 1);
    assert.deepEqual(auditToolCalls(calls).retrievedDocIds, ['101', '102']);
});

test('runner fixture arguments select the isolated test transport', () => {
    const args = parseArgs(['--fixture', '--plan-only', '--limit', '2']);
    assert.equal(args.fixture, true);
    assert.equal(args.limit, 2);
    assert.equal(args.mcpCommand, process.execPath);
    assert.deepEqual(args.mcpArgs, [FIXTURE_SERVER]);
});

test('runner parses the frozen deterministic sample selector', () => {
    const args = parseArgs(['--fixture', '--plan-only', '--sample-size', '1', '--sample-seed', 'pilot-seed']);
    assert.equal(args.sampleSize, 1);
    assert.equal(args.sampleSeed, 'pilot-seed');
});

test('run manifest fingerprints endpoint credentials instead of persisting them', async () => {
    const args = parseArgs(['--fixture', '--run-id', 'manifest-test']);
    const queries = await loadBrowseCompQueries(FIXTURE_DATASET, { limit: 1 });
    const manifest = await buildRunManifest(
        args,
        queries,
        { provider: 'codex-model-bridge', model: 'test', reasoningEffort: 'medium', temperature: 0 },
        { transport: 'http', url: 'https://example.test/mcp/private-token', args: ['--token', 'secret-value'] }
    );
    const serialized = JSON.stringify(manifest);
    assert.doesNotMatch(serialized, /private-token|secret-value/);
    assert.equal(manifest.mcp.urlOrigin, 'https://example.test');
    assert.equal(manifest.mcp.args[1], '[REDACTED]');
});

test('AILIS MCP manager can list and call the fixture BrowseComp-Plus contract', async () => {
    const runtime = new AILISRuntime({
        projectRoot: ROOT,
        workspaceRoot: ROOT,
        disableBuiltinAilisResearchMcp: true,
        mcpServers: {
            browsecomp_plus: {
                transport: 'stdio',
                command: process.execPath,
                args: [FIXTURE_SERVER],
                cwd: ROOT
            }
        }
    });
    try {
        const specs = await runtime.mcpManager.listToolSpecs('browsecomp_plus', 15000);
        assert.deepEqual(specs.map((item) => item.tool).sort(), ['get_document', 'search']);
        const result = await runtime.mcpManager.callTool({
            server: 'browsecomp_plus',
            tool: 'search',
            args: { query: 'North Harbor clock operation date', k: 2 },
            timeoutMs: 15000
        });
        assert.equal(result.isError, false);
        assert.equal(result.structuredContent[0].docid, 'fixture-101');
        const document = await runtime.mcpManager.callTool({
            server: 'browsecomp_plus',
            tool: 'get_document',
            args: { docid: 'fixture-101' },
            timeoutMs: 15000
        });
        assert.equal(document.isError, false);
        assert.equal(document.structuredContent.docid, 'fixture-101');
        assert.match(document.structuredContent.text, /North Harbor/);
    } finally {
        await runtime.mcpManager.shutdown();
    }
});

test('AILIS Gateway propagates fixed-corpus MCP isolation to the runtime', async () => {
    const gateway = new AILISGateway({
        projectRoot: ROOT,
        workspaceRoot: ROOT,
        disableBuiltinAilisResearchMcp: true,
        mcpServers: {
            browsecomp_plus: {
                transport: 'stdio',
                command: process.execPath,
                args: [FIXTURE_SERVER],
                cwd: ROOT
            }
        }
    });
    assert.equal(gateway.runtime.mcpManager.serverConfigs.has('ailis_research'), false);
    assert.equal(gateway.runtime.mcpManager.serverConfigs.has('browsecomp_plus'), true);
    await gateway.runtime.mcpManager.shutdown();
});
