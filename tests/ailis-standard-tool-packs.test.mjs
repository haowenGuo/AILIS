import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    STANDARD_TOOL_PACKS,
    listStandardToolPacks,
    searchStandardToolPacks,
    collectStandardToolPackContracts
} = require('../electron/ailis-standard-tool-packs.cjs');
const { compileAndLintAilisContract } = require('../electron/ailis-contract-compiler.cjs');
const { AILISToolAcquisitionGateway } = require('../electron/ailis-tool-acquisition-gateway.cjs');
const { validateToolContract } = require('../electron/ailis-tool-contracts.cjs');

async function makeWorkspace(prefix) {
    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

test('AILIS standard tool packs expose mature backend families with lintable contracts', () => {
    const ids = STANDARD_TOOL_PACKS.map((pack) => pack.id);
    assert.ok(ids.includes('email_productivity_pack'));
    assert.ok(ids.includes('document_reader_pack'));
    assert.ok(ids.includes('web_retrieval_pack'));
    assert.ok(ids.includes('academic_metadata_pack'));
    assert.ok(ids.includes('media_transcription_pack'));

    const listed = listStandardToolPacks({ includeTools: false });
    assert.equal(listed.length, STANDARD_TOOL_PACKS.length);
    assert.ok(listed.every((pack) => pack.toolCount >= 1));

    const academic = collectStandardToolPackContracts({
        packIds: ['academic_metadata_pack']
    });
    assert.equal(academic.counts.packs, 1);
    assert.ok(academic.groups.openapiOperations.length >= 2);
    for (const operation of academic.groups.openapiOperations) {
        const compiled = compileAndLintAilisContract(operation, {
            sourceType: 'openapi_operation',
            minScore: 60,
            id: operation.toolId || operation.operationId
        });
        assert.equal(compiled.lint.approved, true, `${operation.toolId}: ${JSON.stringify(compiled.lint.issues)}`);
        assert.ok(compiled.contract.whenToUse.length);
        assert.ok(Object.keys(compiled.contract.errors).length);
    }
});

test('AILIS standard tool packs are searchable by task shape', () => {
    const email = searchStandardToolPacks('latest 10 emails inbox', { limit: 3, includeTools: false });
    assert.equal(email[0].id, 'email_productivity_pack');

    const docs = searchStandardToolPacks('read docx table pdf ocr', { limit: 3, includeTools: false });
    assert.equal(docs[0].id, 'document_reader_pack');

    const academic = searchStandardToolPacks('paper author doi venue year', { limit: 3, includeTools: false });
    assert.equal(academic[0].id, 'academic_metadata_pack');
});

test('Tool Acquisition Gateway surfaces standard pack candidates and public academic tools', async () => {
    const workspaceRoot = await makeWorkspace('ailis-standard-packs-');
    const gateway = new AILISToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),
        registryFetcher: async () => ({ servers: [] })
    });

    const candidates = await gateway.searchCandidates({
        query: 'latest email inbox',
        includeRegistry: false,
        limit: 10
    });
    assert.equal(candidates.status, 'completed');
    assert.ok(candidates.candidates.some((candidate) =>
        candidate.type === 'standard_tool_pack' &&
        candidate.id === 'email_productivity_pack'
    ));

    const tools = await gateway.searchExternalToolEntries({
        query: 'paper author doi academic metadata',
        includeContracts: false,
        includeExposed: true,
        limit: 20
    });
    assert.equal(tools.status, 'completed');
    assert.ok(tools.tools.some((entry) =>
        entry.virtualToolId === 'external__openalex__search_works' &&
        entry.callable === true
    ));
    assert.ok(tools.tools.some((entry) =>
        entry.virtualToolId === 'external__crossref__search_works' &&
        entry.callable === true
    ));
});

test('Capability manager contract accepts standard tool pack actions', () => {
    const list = validateToolContract('capability_manager', {
        action: 'list_standard_tool_packs'
    });
    assert.equal(list.ok, true);

    const expose = validateToolContract('capability_manager', {
        action: 'expose_standard_tool_packs',
        standardToolPacks: ['academic_metadata_pack'],
        dryRun: true
    });
    assert.equal(expose.ok, true);
});

test('AILIS standard tool pack exposure writes verified public tools and contract-only backends', async () => {
    const workspaceRoot = await makeWorkspace('ailis-standard-pack-expose-');
    const gateway = new AILISToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),
        registryFetcher: async () => ({ servers: [] })
    });

    const dryRun = await gateway.exposeStandardToolPacks({
        standardToolPacks: ['academic_metadata_pack', 'document_reader_pack'],
        dryRun: true,
        includeRejected: false
    });
    assert.equal(dryRun.status, 'completed');
    assert.equal(dryRun.dryRun, true);
    assert.ok(dryRun.callable >= 2);
    assert.ok(dryRun.nonCallable >= 1);

    const exposed = await gateway.exposeStandardToolPacks({
        standardToolPacks: ['academic_metadata_pack', 'document_reader_pack'],
        includeRejected: false
    });
    assert.equal(exposed.status, 'completed');
    assert.ok(exposed.total >= exposed.added);

    const listed = await gateway.listExposedExternalTools({
        query: 'docling document',
        limit: 10
    });
    assert.ok(listed.exposures.some((entry) =>
        entry.toolId === 'docling_convert_document' &&
        entry.callable === false
    ));

    const searched = await gateway.searchExternalToolEntries({
        query: 'read docx secret santa table',
        limit: 10
    });
    assert.ok(searched.tools.some((entry) =>
        entry.toolId === 'docling_convert_document' &&
        entry.callable === false
    ), JSON.stringify(searched.tools, null, 2));
});

test('AILIS standard auth adapters configure env profiles but do not promote missing credentials', async () => {
    const workspaceRoot = await makeWorkspace('ailis-standard-auth-verify-');
    const previous = {
        GMAIL_ACCESS_TOKEN: process.env.GMAIL_ACCESS_TOKEN,
        MSGRAPH_ACCESS_TOKEN: process.env.MSGRAPH_ACCESS_TOKEN,
        COMPOSIO_API_KEY: process.env.COMPOSIO_API_KEY,
        FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
        TAVILY_API_KEY: process.env.TAVILY_API_KEY
    };
    delete process.env.GMAIL_ACCESS_TOKEN;
    delete process.env.MSGRAPH_ACCESS_TOKEN;
    delete process.env.COMPOSIO_API_KEY;
    delete process.env.FIRECRAWL_API_KEY;
    delete process.env.TAVILY_API_KEY;
    try {
        const gateway = new AILISToolAcquisitionGateway({
            workspaceRoot,
            projectRoot: workspaceRoot,
            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),
            registryFetcher: async () => ({ servers: [] })
        });
        const exposed = await gateway.exposeStandardToolPacks({
            standardToolPacks: ['email_productivity_pack', 'web_retrieval_pack'],
            enableAuthRequiredAdapters: true,
            includeLocalContracts: false,
            includePublicReadonly: false,
            verifyAdapters: true,
            includeRejected: false
        });
        assert.equal(exposed.status, 'completed');
        assert.ok(exposed.configuredAuthProfiles.some((profile) => profile.id === 'gmail-oauth'));
        assert.ok(exposed.configuredAuthProfiles.some((profile) => profile.id === 'tavily-api'));
        assert.ok(exposed.smokeResults.some((entry) => entry.toolId === 'gmail_list_messages' && entry.ok === false));
        const gmail = exposed.exposures.find((entry) => entry.toolId === 'gmail_list_messages');
        assert.equal(gmail.callable, false);
        assert.equal(gmail.verification, 'needs_config');
        const tavily = exposed.exposures.find((entry) => entry.toolId === 'tavily_search');
        assert.equal(tavily.callable, false);
        assert.equal(tavily.contract.readOnlyHint, true);
        assert.equal(tavily.mutates, false);
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    }
});

test('AILIS standard local document adapters promote only after dependency smoke', async () => {
    const workspaceRoot = await makeWorkspace('ailis-standard-local-adapters-');
    const samplePath = path.join(workspaceRoot, 'sample.txt');
    await fs.writeFile(samplePath, 'Secret Santa table: Alice gives to Bob.', 'utf8');
    const calls = [];
    const gateway = new AILISToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),
        registryFetcher: async () => ({ servers: [] }),
        localAdapterRunner: {
            check: async (adapter) => ({
                status: 'completed',
                ok: true,
                adapter,
                command: 'fake-python',
                packageName: adapter.packageName,
                importName: adapter.importName
            }),
            execute: async (exposure, params) => {
                calls.push({ toolId: exposure.toolId, path: params.path });
                return {
                    status: 'completed',
                    ok: true,
                    exposureId: exposure.id,
                    toolId: exposure.toolId,
                    text: 'Secret Santa table: Alice gives to Bob.',
                    fullTextPath: samplePath,
                    tables: []
                };
            }
        }
    });
    const exposed = await gateway.exposeStandardToolPacks({
        standardToolPacks: ['document_reader_pack'],
        enableLocalAdapters: true,
        verifyAdapters: true,
        includeRejected: false
    });
    assert.equal(exposed.status, 'completed');
    const markitdown = exposed.exposures.find((entry) => entry.toolId === 'markitdown_convert_document');
    assert.equal(markitdown.callable, true);
    assert.equal(markitdown.verification, 'static_smoke_passed');
    assert.equal(markitdown.virtualToolId, 'external__document_reader_pack__markitdown_convert_document');
    const fallback = exposed.exposures.find((entry) => entry.toolId === 'python_document_extract');
    assert.equal(fallback.callable, true);
    assert.equal(fallback.verification, 'static_smoke_passed');

    const executed = await gateway.executeExposedExternalTool({
        toolId: 'markitdown_convert_document',
        args: { path: samplePath }
    });
    assert.equal(executed.status, 'completed');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].path, samplePath);
});
