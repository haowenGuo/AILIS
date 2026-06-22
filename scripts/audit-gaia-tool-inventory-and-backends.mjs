import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    paperMetadataLookup,
    readDocument
} = require('./mcp-ailis-research-server.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-tool-inventory');
const DEFAULT_RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');
const DEFAULT_DOCX_SAMPLE = path.join(
    PROJECT_ROOT,
    'eval-results',
    'engineering',
    'gaia-official',
    'files',
    'cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb-cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb.docx'
);
const PAPER_TITLE = 'Pie Menus or Linear Menus, Which Is Better?';
const PAPER_QUERY = `${PAPER_TITLE} 2015`;
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=L1vXCYZAYYM';

const TOOL_SEARCH_QUERIES = Object.freeze([
    'docx Word document table Secret Santa',
    'paper DOI author year topic venue scholarly metadata',
    'YouTube transcript video frame sampling',
    'PDF report exact title extract evidence',
    'ClinicalTrials API NCT enrollment'
]);

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        outputDir: DEFAULT_OUTPUT_DIR,
        runId: DEFAULT_RUN_ID,
        includeBackendSmoke: true,
        timeoutMs: 30000,
        docxSample: DEFAULT_DOCX_SAMPLE
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = next() || args.runId;
        else if (token === '--timeout-ms') args.timeoutMs = Math.max(1000, Number(next()) || args.timeoutMs);
        else if (token === '--docx-sample') args.docxSample = path.resolve(next());
        else if (token === '--no-backend-smoke') args.includeBackendSmoke = false;
    }
    args.inventoryPath = path.join(args.outputDir, `${args.runId}.inventory.json`);
    args.reportPath = path.join(args.outputDir, `${args.runId}.report.md`);
    return args;
}

function truncateText(value, maxChars = 500) {
    const text = typeof value === 'string' ? value : value === undefined || value === null ? '' : String(value);
    return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
}

function redact(value) {
    if (Array.isArray(value)) {
        return value.map((item) => redact(item));
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [
        key,
        /token|secret|password|api[_-]?key|authorization|credential|auth[_-]?code/i.test(key)
            ? '__REDACTED__'
            : redact(entry)
    ]));
}

function compactSchema(schema = {}) {
    const props = schema?.properties && typeof schema.properties === 'object'
        ? Object.keys(schema.properties)
        : [];
    return {
        type: schema?.type || '',
        required: Array.isArray(schema?.required) ? schema.required : [],
        properties: props.slice(0, 20),
        propertyCount: props.length
    };
}

function compactSpec(spec = {}) {
    return {
        name: spec.name || spec.id || '',
        description: truncateText(spec.description || '', 220),
        parameters: compactSchema(spec.parameters || spec.inputSchema || spec.input_schema || {})
    };
}

function runProcess(command, args = [], { cwd = PROJECT_ROOT, timeoutMs = 30000 } = {}) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd,
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });
        let stdout = '';
        let stderr = '';
        const timeout = setTimeout(() => {
            child.kill('SIGKILL');
        }, timeoutMs);
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString('utf8');
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString('utf8');
        });
        child.on('error', (error) => {
            clearTimeout(timeout);
            resolve({
                ok: false,
                exitCode: -1,
                stdout,
                stderr: stderr || error.message,
                error: error.message
            });
        });
        child.on('close', (exitCode) => {
            clearTimeout(timeout);
            resolve({
                ok: exitCode === 0,
                exitCode,
                stdout: truncateText(stdout.trim(), 4000),
                stderr: truncateText(stderr.trim(), 4000)
            });
        });
    });
}

async function fetchJsonProbe(label, url, { headers = {}, timeoutMs = 30000 } = {}) {
    const controller = new AbortController();
    const startedAt = Date.now();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AILIS-GAIA-tool-inventory-audit/1.0',
                ...headers
            },
            signal: controller.signal
        });
        const text = await response.text();
        let parsed = null;
        try {
            parsed = text ? JSON.parse(text) : null;
        } catch {}
        return {
            label,
            url,
            ok: response.ok,
            status: response.status,
            durationMs: Date.now() - startedAt,
            contentType: response.headers.get('content-type') || '',
            retryAfter: response.headers.get('retry-after') || '',
            bodyPreview: truncateText(text.replace(/\s+/g, ' ').trim(), 700),
            parsedSummary: summarizeParsedJson(label, parsed)
        };
    } catch (error) {
        return {
            label,
            url,
            ok: false,
            status: 'error',
            durationMs: Date.now() - startedAt,
            error: error?.message || String(error)
        };
    } finally {
        clearTimeout(timeout);
    }
}

function summarizeParsedJson(label, parsed) {
    if (!parsed || typeof parsed !== 'object') {
        return null;
    }
    if (label === 'openalex') {
        const first = parsed.results?.[0] || {};
        return {
            count: parsed.meta?.count,
            firstTitle: first.title,
            firstYear: first.publication_year,
            firstAuthors: (first.authorships || []).slice(0, 5).map((entry) => entry.author?.display_name).filter(Boolean),
            firstOpenAlexId: first.id
        };
    }
    if (label === 'crossref') {
        const first = parsed.message?.items?.[0] || {};
        return {
            totalResults: parsed.message?.['total-results'],
            firstTitle: Array.isArray(first.title) ? first.title[0] : first.title,
            firstYear: first.published?.['date-parts']?.[0]?.[0],
            firstDoi: first.DOI,
            firstAuthors: (first.author || []).slice(0, 5).map((entry) => [entry.given, entry.family].filter(Boolean).join(' ')).filter(Boolean)
        };
    }
    if (label === 'semantic_scholar') {
        const first = parsed.data?.[0] || {};
        return {
            total: parsed.total,
            firstTitle: first.title,
            firstYear: first.year,
            firstAuthors: (first.authors || []).slice(0, 5).map((entry) => entry.name).filter(Boolean),
            firstPaperId: first.paperId
        };
    }
    return null;
}

async function collectGatewayInventory(args) {
    const gateway = new AILISGateway({
        host: '127.0.0.1',
        port: 0,
        workspaceDir: PROJECT_ROOT,
        auditDir: path.join(args.outputDir, 'gateway-audit', args.runId),
        mcpConfigPath: path.join(PROJECT_ROOT, '.ailis-state', 'mcp-servers.json')
    });
    const status = await gateway.start();
    try {
        const directSpecs = gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs({ includeDeferred: false });
        const allRuntimeDefinitions = gateway.gatewayToolRuntimeRegistry.listDefinitions();
        const servers = gateway.runtime.mcpManager.listServers();
        const mcpHealth = await gateway.runtime.mcpManager.healthCheck('', args.timeoutMs).catch((error) => ({
            status: 'error',
            error: error?.message || String(error)
        }));
        const mcpToolSpecs = await gateway.runtime.mcpManager.listToolSpecs('', args.timeoutMs).catch((error) => ({
            status: 'error',
            error: error?.message || String(error)
        }));
        const externalExposure = await gateway.runtime.capabilityManager.listExposedExternalTools({
            limit: 100
        }).catch((error) => ({
            status: 'error',
            error: error?.message || String(error),
            exposures: []
        }));
        const toolSearches = [];
        for (const query of TOOL_SEARCH_QUERIES) {
            const result = await gateway.executeGatewayToolSearch({
                query,
                limit: 12,
                timeoutMs: args.timeoutMs
            }).catch((error) => ({
                structuredContent: {
                    status: 'error',
                    error: error?.message || String(error),
                    tools: []
                }
            }));
            toolSearches.push({
                query,
                routingAdvice: result?.structuredContent?.routing_advice || '',
                tools: (result?.structuredContent?.tools || []).map((tool) => ({
                    id: tool.id,
                    type: tool.type,
                    callable: tool.callable,
                    server: tool.server,
                    tool: tool.tool,
                    callTool: tool.call_pattern?.tool,
                    description: truncateText(tool.description || tool.spec?.description || '', 220),
                    parameters: compactSchema(tool.input_schema || tool.spec?.parameters || {})
                }))
            });
        }
        return redact({
            gatewayStatus: status,
            gaiaRunnerSurface: {
                directToolExecutorEnv: process.env.AILIS_GAIA_DIRECT_TOOL_EXECUTOR || '',
                startupNativeDirectToolCountWithoutFinalAnswer: directSpecs.length,
                startupNativeDirectToolNamesWithoutFinalAnswer: directSpecs.map((spec) => spec.name),
                exactAnswerModeAdds: ['final_answer'],
                note: 'MCP and external direct tools are not all native tools at turn 0. They are surfaced through tool_search and become direct native tools on later turns after tool_search observations.'
            },
            runtimeTools: allRuntimeDefinitions.map((definition) => ({
                id: definition.id,
                exposure: definition.exposure,
                route: definition.route,
                status: definition.status,
                description: truncateText(definition.description || '', 220),
                spec: compactSpec(definition.spec || {})
            })),
            mcp: {
                configPath: path.join(PROJECT_ROOT, '.ailis-state', 'mcp-servers.json'),
                servers,
                health: mcpHealth,
                toolSpecs: Array.isArray(mcpToolSpecs)
                    ? mcpToolSpecs.map((spec) => ({
                        id: spec.id,
                        server: spec.server,
                        tool: spec.tool,
                        description: truncateText(spec.description || '', 260),
                        schema: compactSchema(spec.input_schema || spec.inputSchema || {})
                    }))
                    : mcpToolSpecs
            },
            external: {
                exposureStatus: externalExposure.status,
                total: externalExposure.total || externalExposure.exposures?.length || 0,
                exposures: (externalExposure.exposures || []).map((entry) => ({
                    id: entry.id,
                    toolId: entry.toolId,
                    virtualToolId: entry.virtualToolId,
                    callable: entry.callable,
                    verified: entry.verified,
                    verification: entry.verification,
                    source: entry.source,
                    title: entry.title || entry.name,
                    description: truncateText(entry.contract?.purpose || entry.modelFacing?.description || '', 220)
                }))
            },
            toolSearches
        });
    } finally {
        await gateway.stop().catch(() => {});
    }
}

async function smokeScholarlyBackends(args) {
    const encodedTitle = encodeURIComponent(PAPER_TITLE);
    const encodedQuery = encodeURIComponent(PAPER_QUERY);
    const semanticHeaders = {};
    const semanticKey = process.env.SEMANTIC_SCHOLAR_API_KEY || process.env.S2_API_KEY || '';
    if (semanticKey) {
        semanticHeaders['x-api-key'] = semanticKey;
    }
    const ailisCurrent = await paperMetadataLookup({
        title: PAPER_TITLE,
        year: 2015,
        timeoutMs: args.timeoutMs
    }).catch((error) => ({
        structuredContent: {
            ok: false,
            status: 'error',
            error: error?.message || String(error)
        }
    }));
    const currentPayload = ailisCurrent.structuredContent || ailisCurrent.details || {};
    const probes = [
        Promise.resolve({
            label: 'ailis_current_paper_metadata_lookup',
            ok: currentPayload.ok === true,
            status: currentPayload.status || '',
            parsedSummary: {
                bestTitle: currentPayload.bestMatch?.title,
                bestYear: currentPayload.bestMatch?.year,
                bestSource: currentPayload.bestMatch?.source,
                bestDoi: currentPayload.bestMatch?.doi,
                attempts: (currentPayload.attempts || []).map((attempt) => ({
                    source: attempt.source,
                    ok: attempt.ok,
                    status: attempt.status,
                    error: attempt.error
                }))
            },
            bodyPreview: truncateText(JSON.stringify(currentPayload), 900)
        }),
        fetchJsonProbe(
            'openalex_search_exact',
            `https://api.openalex.org/works?search.exact=${encodedTitle}&filter=from_publication_date:2015-01-01,to_publication_date:2015-12-31&per-page=3`,
            { timeoutMs: args.timeoutMs }
        ),
        fetchJsonProbe('crossref', `https://api.crossref.org/works?query.title=${encodedTitle}&rows=3&filter=from-pub-date:2015-01-01,until-pub-date:2015-12-31`, { timeoutMs: args.timeoutMs }),
        fetchJsonProbe(
            'semantic_scholar',
            `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&limit=3&fields=title,year,authors,venue,externalIds,url`,
            { headers: semanticHeaders, timeoutMs: args.timeoutMs }
        )
    ];
    return {
        failureType: 'paper metadata / scholarly lookup',
        sample: PAPER_QUERY,
        selectedBackends: ['OpenAlex Works API', 'Crossref Works API', 'Semantic Scholar Graph API'],
        notSelectedDefault: 'Google Scholar is intentionally not treated as a machine backend because automated access commonly hits anti-bot/429/challenge behavior.',
        semanticScholarApiKeyPresent: Boolean(semanticKey),
        results: await Promise.all(probes)
    };
}

async function smokeYoutubeBackends(args) {
    const ytdlp = await runProcess('yt-dlp', ['--dump-single-json', '--skip-download', '--no-warnings', YOUTUBE_URL], {
        timeoutMs: Math.max(args.timeoutMs, 45000)
    });
    const pythonYtdlp = ytdlp.ok ? null : await runProcess('python', ['-m', 'yt_dlp', '--dump-single-json', '--skip-download', '--no-warnings', YOUTUBE_URL], {
        timeoutMs: Math.max(args.timeoutMs, 45000)
    });
    const oembed = await fetchJsonProbe('youtube_oembed_metadata', `https://www.youtube.com/oembed?url=${encodeURIComponent(YOUTUBE_URL)}&format=json`, {
        timeoutMs: args.timeoutMs
    });
    return {
        failureType: 'YouTube transcript / video evidence',
        sample: YOUTUBE_URL,
        selectedBackends: ['yt-dlp metadata/subtitle downloader', 'YouTube oEmbed metadata endpoint'],
        note: 'oEmbed is only a metadata health check. It cannot answer frame-count questions; a useful backend still needs subtitle extraction, frame sampling, or ASR.',
        results: [
            {
                label: 'yt-dlp',
                ok: ytdlp.ok,
                exitCode: ytdlp.exitCode,
                stdoutPreview: truncateText(ytdlp.stdout, 700),
                stderrPreview: truncateText(ytdlp.stderr, 700)
            },
            ...(pythonYtdlp ? [{
                label: 'python -m yt_dlp',
                ok: pythonYtdlp.ok,
                exitCode: pythonYtdlp.exitCode,
                stdoutPreview: truncateText(pythonYtdlp.stdout, 700),
                stderrPreview: truncateText(pythonYtdlp.stderr, 700)
            }] : []),
            oembed
        ]
    };
}

function findBundledPythonCandidates() {
    const candidates = [];
    if (process.env.CODEX_PYTHON) {
        candidates.push(process.env.CODEX_PYTHON);
    }
    if (process.env.USERPROFILE) {
        candidates.push(path.join(
            process.env.USERPROFILE,
            '.cache',
            'codex-runtimes',
            'codex-primary-runtime',
            'dependencies',
            'python',
            'python.exe'
        ));
    }
    candidates.push('python');
    return [...new Set(candidates)].filter((entry) => entry === 'python' || fsSync.existsSync(entry));
}

async function smokeDocxBackends(args) {
    const samplePath = path.resolve(args.docxSample);
    const current = fsSync.existsSync(samplePath)
        ? await readDocument({ path: samplePath, timeoutMs: args.timeoutMs }).catch((error) => ({
            error: error?.message || String(error)
        }))
        : { error: 'sample file missing', path: samplePath };
    const currentStructured = current?.structuredContent || {};
    const pythonCode = `
import json, sys
from docx import Document
path = sys.argv[1]
doc = Document(path)
paragraphs = [p.text.strip() for p in doc.paragraphs if p.text and p.text.strip()]
tables = []
for table in doc.tables:
    rows = []
    for row in table.rows:
        cells = [(cell.text or "").strip() for cell in row.cells]
        if any(cells):
            rows.append(cells)
    if rows:
        tables.append(rows)
print(json.dumps({
    "paragraph_count": len(paragraphs),
    "table_count": len(tables),
    "first_paragraphs": paragraphs[:5],
    "table_shapes": [{"rows": len(t), "cols": max([len(r) for r in t] or [0])} for t in tables],
    "first_table_rows": tables[0][:5] if tables else []
}, ensure_ascii=False))
`.trim();
    const pythonResults = [];
    for (const python of findBundledPythonCandidates()) {
        const result = await runProcess(python, ['-c', pythonCode, samplePath], {
            cwd: path.dirname(samplePath),
            timeoutMs: args.timeoutMs
        });
        let parsed = null;
        try {
            parsed = result.stdout ? JSON.parse(result.stdout) : null;
        } catch {}
        pythonResults.push({
            label: python,
            ok: result.ok,
            exitCode: result.exitCode,
            parsed,
            stderrPreview: truncateText(result.stderr, 700)
        });
        if (result.ok) {
            break;
        }
    }
    return {
        failureType: 'DOCX structured extraction / Secret Santa',
        sample: samplePath,
        selectedBackends: ['current AILIS read_document', 'python-docx direct parse'],
        note: 'AILIS read_document already uses python-docx. If both return full tables, the failure is downstream evidence consumption/finalization, not raw DOCX parsing.',
        results: [
            {
                label: 'ailis_read_document',
                ok: currentStructured.ok === true,
                paragraphCount: currentStructured.paragraphCount,
                tableCount: currentStructured.tableCount,
                firstParagraphs: (currentStructured.paragraphs || []).slice(0, 5),
                firstTableRows: (currentStructured.tables?.[0]?.rows || []).slice(0, 5),
                error: current?.error || ''
            },
            ...pythonResults
        ]
    };
}

async function runBackendSmoke(args) {
    if (!args.includeBackendSmoke) {
        return [];
    }
    return [
        await smokeScholarlyBackends(args),
        await smokeYoutubeBackends(args),
        await smokeDocxBackends(args)
    ];
}

function markdownTable(headers, rows) {
    return [
        `| ${headers.join(' | ')} |`,
        `| ${headers.map(() => '---').join(' | ')} |`,
        ...rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|')).join(' | ')} |`)
    ].join('\n');
}

function buildReport({ args, inventory, backendSmoke }) {
    const mcpSpecs = Array.isArray(inventory.mcp.toolSpecs) ? inventory.mcp.toolSpecs : [];
    const serverRows = (inventory.mcp.servers || []).map((server) => [
        server.name,
        server.transport,
        server.command || server.url || '',
        server.status || ''
    ]);
    const directRows = (inventory.gaiaRunnerSurface.startupNativeDirectToolNamesWithoutFinalAnswer || []).map((name) => [name]);
    const mcpRows = mcpSpecs.map((spec) => [spec.id, spec.server, spec.tool, spec.schema.properties.join(', ')]);
    const externalRows = (inventory.external.exposures || []).map((entry) => [
        entry.virtualToolId || entry.id,
        entry.callable,
        entry.verified,
        entry.source?.type || '',
        entry.title || entry.toolId || ''
    ]);
    const searchSections = (inventory.toolSearches || []).map((search) => [
        `### tool_search: ${search.query}`,
        '',
        markdownTable(
            ['id', 'type', 'call tool', 'params'],
            search.tools.map((tool) => [
                tool.id,
                tool.type,
                tool.callTool || '',
                (tool.parameters?.properties || []).join(', ')
            ])
        )
    ].join('\n')).join('\n\n');
    const backendSections = (backendSmoke || []).map((group) => [
        `### ${group.failureType}`,
        '',
        `Sample: ${group.sample}`,
        '',
        `Selected backends: ${group.selectedBackends.join(', ')}`,
        '',
        group.note ? `Note: ${group.note}` : '',
        group.notSelectedDefault ? `Not selected by default: ${group.notSelectedDefault}` : '',
        '',
        markdownTable(
            ['backend', 'ok', 'status/exit', 'summary/error'],
            (group.results || []).map((result) => [
                result.label,
                result.ok,
                result.status ?? result.exitCode ?? '',
                truncateText(
                    JSON.stringify(result.parsedSummary || result.parsed || result.error || result.stderrPreview || result.bodyPreview || result.stdoutPreview || ''),
                    500
                )
            ])
        )
    ].filter(Boolean).join('\n')).join('\n\n');
    return [
        '# GAIA Tool Inventory and Backend Smoke',
        '',
        `Run id: ${args.runId}`,
        `Generated: ${new Date().toISOString()}`,
        `Inventory JSON: ${args.inventoryPath}`,
        '',
        '## Startup Tool Surface',
        '',
        `AILIS_GAIA_DIRECT_TOOL_EXECUTOR=${inventory.gaiaRunnerSurface.directToolExecutorEnv || '(empty)'}`,
        `Startup native direct tool count, excluding exact-answer finalizer: ${inventory.gaiaRunnerSurface.startupNativeDirectToolCountWithoutFinalAnswer}`,
        'Exact-answer mode adds native tool: final_answer.',
        '',
        markdownTable(['native direct tool at turn 0'], directRows),
        '',
        '## MCP Servers',
        '',
        markdownTable(['server', 'transport', 'command/url', 'status'], serverRows),
        '',
        '## MCP Direct Tool Specs',
        '',
        markdownTable(['direct id', 'server', 'tool', 'schema properties'], mcpRows),
        '',
        '## External Tool Exposure',
        '',
        markdownTable(['id', 'callable', 'verified', 'source', 'title'], externalRows),
        '',
        '## tool_search Probes',
        '',
        searchSections,
        '',
        '## Backend Smoke Tests',
        '',
        backendSections,
        ''
    ].join('\n');
}

async function main() {
    const args = parseArgs();
    await fs.mkdir(args.outputDir, { recursive: true });
    const inventory = await collectGatewayInventory(args);
    const backendSmoke = await runBackendSmoke(args);
    const payload = {
        status: 'completed',
        runId: args.runId,
        generatedAt: new Date().toISOString(),
        inventory,
        backendSmoke
    };
    await fs.writeFile(args.inventoryPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.reportPath, buildReport({ args, inventory, backendSmoke }), 'utf8');
    console.log(JSON.stringify({
        status: 'completed',
        inventoryPath: args.inventoryPath,
        reportPath: args.reportPath,
        nativeDirectToolsAtTurn0: inventory.gaiaRunnerSurface.startupNativeDirectToolCountWithoutFinalAnswer,
        mcpServers: inventory.mcp.servers?.length || 0,
        mcpToolSpecs: Array.isArray(inventory.mcp.toolSpecs) ? inventory.mcp.toolSpecs.length : 0,
        externalExposures: inventory.external.exposures?.length || 0,
        backendSmokeGroups: backendSmoke.length
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
