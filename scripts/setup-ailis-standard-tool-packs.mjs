#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISToolAcquisitionGateway
} = require('../electron/ailis-tool-acquisition-gateway.cjs');
const {
    listStandardToolPacks
} = require('../electron/ailis-standard-tool-packs.cjs');

function parseArgs(argv = []) {
    const args = {
        write: false,
        dryRun: true,
        packs: [],
        reportDir: '',
        includeAuthRequired: true,
        includeLocalContracts: true,
        includePublicReadonly: true,
        enableAuthRequiredAdapters: false,
        enableLocalAdapters: false,
        verifyAdapters: false,
        liveSmoke: false,
        liveSmokeAll: false,
        liveSmokeTools: [],
        limit: 100
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--write' || arg === '--expose') {
            args.write = true;
            args.dryRun = false;
        } else if (arg === '--dry-run') {
            args.write = false;
            args.dryRun = true;
        } else if (arg === '--pack' || arg === '--packs') {
            args.packs.push(...String(argv[index + 1] || '').split(',').map((entry) => entry.trim()).filter(Boolean));
            index += 1;
        } else if (arg === '--report-dir') {
            args.reportDir = String(argv[index + 1] || '').trim();
            index += 1;
        } else if (arg === '--limit') {
            args.limit = Number(argv[index + 1] || args.limit);
            index += 1;
        } else if (arg === '--public-only') {
            args.includeAuthRequired = false;
            args.includeLocalContracts = false;
        } else if (arg === '--enable-auth-adapters') {
            args.enableAuthRequiredAdapters = true;
        } else if (arg === '--enable-local-adapters') {
            args.enableLocalAdapters = true;
        } else if (arg === '--verify-adapters' || arg === '--smoke-adapters') {
            args.verifyAdapters = true;
        } else if (arg === '--live-smoke') {
            args.verifyAdapters = true;
            args.liveSmoke = true;
        } else if (arg === '--live-smoke-all') {
            args.verifyAdapters = true;
            args.liveSmoke = true;
            args.liveSmokeAll = true;
        } else if (arg === '--live-smoke-tool' || arg === '--live-tool') {
            args.verifyAdapters = true;
            args.liveSmoke = true;
            args.liveSmokeTools.push(...String(argv[index + 1] || '').split(',').map((entry) => entry.trim()).filter(Boolean));
            index += 1;
        } else if (arg === '--skip-auth-required') {
            args.includeAuthRequired = false;
        } else if (arg === '--skip-local-contracts') {
            args.includeLocalContracts = false;
        }
    }
    return args;
}

function markdownTable(headers, rows) {
    const escapeCell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
    return [
        `| ${headers.map(escapeCell).join(' | ')} |`,
        `| ${headers.map(() => '---').join(' | ')} |`,
        ...rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`)
    ].join('\n');
}

async function writeReport({ reportDir, result, packs, searched }) {
    await fs.mkdir(reportDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonPath = path.join(reportDir, `standard-tool-packs-${timestamp}.json`);
    const mdPath = path.join(reportDir, `standard-tool-packs-${timestamp}.md`);
    await fs.writeFile(jsonPath, `${JSON.stringify({ result, packs, searched }, null, 2)}\n`, 'utf8');
    const rows = result.exposures.map((entry) => [
        entry.toolId || entry.id,
        entry.source?.type || '',
        entry.callable ? 'yes' : 'no',
        entry.verification || '',
        entry.score ?? '',
        entry.standardToolPack ? 'standard' : ''
    ]);
    const md = [
        '# AILIS Standard Tool Packs Report',
        '',
        `Generated: ${new Date().toISOString()}`,
        `Mode: ${result.dryRun ? 'dry-run' : 'write'}`,
        `Selected packs: ${(result.selectedPacks || []).map((pack) => pack.id).join(', ') || 'all'}`,
        `Added/exposed: ${result.added}; callable: ${result.callable}; non-callable: ${result.nonCallable}; rejected skipped: ${result.rejectedSkipped}`,
        `Auth profiles: ${(result.configuredAuthProfiles || result.authProfiles || []).length}; smoke checks: ${(result.smokeResults || []).length}`,
        '',
        '## Packs',
        markdownTable(
            ['Pack', 'Category', 'Tools'],
            packs.map((pack) => [pack.id, pack.category, pack.toolCount || (pack.tools || []).length])
        ),
        '',
        '## Exposures',
        rows.length ? markdownTable(['Tool', 'Source', 'Callable', 'Verification', 'Score', 'Origin'], rows) : '_No exposures._',
        '',
        '## Auth Profiles',
        (result.configuredAuthProfiles || result.authProfiles || []).length
            ? markdownTable(
                ['Profile', 'Provider', 'Env', 'Readiness', 'Issues'],
                (result.configuredAuthProfiles || result.authProfiles || []).map((profile) => [
                    profile.id || '',
                    profile.provider || '',
                    profile.envVar || '',
                    profile.readiness || '',
                    (profile.issues || []).join(', ')
                ])
            )
            : '_No auth profiles._',
        '',
        '## Adapter Smoke',
        (result.smokeResults || []).length
            ? markdownTable(
                ['Tool', 'Status', 'OK', 'Mode', 'Verification', 'Reason'],
                (result.smokeResults || []).map((entry) => [
                    entry.toolId || '',
                    entry.status || '',
                    entry.ok ? 'yes' : 'no',
                    entry.mode || '',
                    entry.verification || '',
                    entry.reason || ''
                ])
            )
            : '_No adapter smoke requested._',
        '',
        '## Tool Search Smoke',
        markdownTable(
            ['Tool', 'Type', 'Callable', 'Virtual Tool'],
            (searched.tools || []).slice(0, 12).map((entry) => [
                entry.toolId || entry.id,
                entry.type || '',
                entry.callable ? 'yes' : 'no',
                entry.virtualToolId || entry.call_pattern?.tool || ''
            ])
        )
    ].join('\n');
    await fs.writeFile(mdPath, `${md}\n`, 'utf8');
    return { jsonPath, mdPath };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const workspaceRoot = process.cwd();
    const stateDir = process.env.AILIS_TOOL_ACQUISITION_STATE_DIR ||
        path.join(workspaceRoot, '.ailis-state', 'tool-acquisition');
    const reportDir = args.reportDir || path.join(workspaceRoot, 'eval-results', 'engineering', 'standard-tool-packs');
    const gateway = new AILISToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir
    });
    const result = await gateway.exposeStandardToolPacks({
        dryRun: args.dryRun,
        standardToolPacks: args.packs,
        includeAuthRequired: args.includeAuthRequired,
        includeLocalContracts: args.includeLocalContracts,
        includePublicReadonly: args.includePublicReadonly,
        enableAuthRequiredAdapters: args.enableAuthRequiredAdapters,
        enableLocalAdapters: args.enableLocalAdapters,
        verifyAdapters: args.verifyAdapters,
        liveSmoke: args.liveSmoke,
        liveSmokeAll: args.liveSmokeAll,
        liveSmokeTools: args.liveSmokeTools,
        limit: args.limit,
        includeRejected: false
    });
    const packs = listStandardToolPacks({ includeTools: false });
    const searched = await gateway.searchExternalToolEntries({
        query: 'paper author doi academic metadata',
        limit: 10
    });
    const report = await writeReport({ reportDir, result, packs, searched });
    console.log(JSON.stringify({
        status: result.status,
        mode: result.dryRun ? 'dry-run' : 'write',
        selectedPacks: result.selectedPacks?.map((pack) => pack.id) || [],
        added: result.added,
        callable: result.callable,
        nonCallable: result.nonCallable,
        rejectedSkipped: result.rejectedSkipped,
        authProfiles: (result.configuredAuthProfiles || result.authProfiles || []).map((profile) => ({
            id: profile.id,
            provider: profile.provider,
            envVar: profile.envVar,
            readiness: profile.readiness || '',
            issues: profile.issues || []
        })),
        smokeResults: result.smokeResults || [],
        externalExposurePath: result.externalExposurePath || '',
        report
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
