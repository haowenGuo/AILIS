import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    TOOLS,
    buildSuggestedCallsFromSearchResults,
    extractArxivCandidatesFromAtom,
    extractBingResults,
    extractDuckDuckGoHtmlResults,
    extractGenericAnchorResults,
    extractGitHubRepositoryResults,
    extractYahooResults,
    githubRepoRead,
    inferPaperMetadataArgsFromScholarlyQuery,
    normalizeSearchBackends,
    paperMetadataLookup,
    parseGitHubRepoRef,
    pdfFindAndExtract,
    rankLinksForResearch,
    readDocument,
    webExtractLinks,
    webFetch
} = require('../scripts/mcp-aigl-research-server.cjs');

async function withServer(handler, run) {
    const server = http.createServer(handler);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    try {
        return await run(`http://127.0.0.1:${port}`);
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
}

function buildSimplePdf(text = 'Hello PDF') {
    const escapedText = String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    const objects = [
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n',
        '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
    ];
    const stream = `BT /F1 18 Tf 72 720 Td (${escapedText}) Tj ET`;
    objects.push(`5 0 obj\n<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}\nendstream\nendobj\n`);
    let body = '%PDF-1.4\n';
    const offsets = [0];
    for (const object of objects) {
        offsets.push(Buffer.byteLength(body, 'ascii'));
        body += object;
    }
    const xrefOffset = Buffer.byteLength(body, 'ascii');
    body += `xref\n0 ${objects.length + 1}\n`;
    body += '0000000000 65535 f \n';
    for (const offset of offsets.slice(1)) {
        body += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }
    body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return Buffer.from(body, 'ascii');
}

test('AIGL research MCP exposes Codex-aligned PDF/file tools', () => {
    const names = TOOLS.map((tool) => tool.name);
    const searchTool = TOOLS.find((tool) => tool.name === 'web_search');

    assert.ok(names.includes('web_search'));
    assert.ok(names.includes('github_repo_read'));
    assert.ok(names.includes('web_fetch'));
    assert.ok(names.includes('pdf_extract_text'));
    assert.ok(names.includes('paper_metadata_lookup'));
    assert.ok(names.includes('pdf_find_and_extract'));
    assert.ok(names.includes('download_file'));
    assert.ok(names.includes('read_document'));
    assert.ok(names.includes('read_presentation'));
    assert.ok(searchTool.inputSchema.properties.backend);
    assert.ok(searchTool.inputSchema.properties.backends);
    assert.ok(searchTool.inputSchema.properties.backends.items.enum.includes('duckduckgo_html'));
    assert.ok(searchTool.inputSchema.properties.backends.items.enum.includes('github_repositories'));
    assert.ok(searchTool.description.includes('managed search backends'));
});

test('read_document extracts Word paragraphs and tables as structured JSON', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aigl-docx-'));
    try {
        const docxPath = path.join(tmpDir, 'sample.docx');
        const code = [
            'from docx import Document',
            'import sys',
            'doc = Document()',
            'doc.add_paragraph("Employees")',
            'table = doc.add_table(rows=2, cols=2)',
            'table.cell(0, 0).text = "Giver"',
            'table.cell(0, 1).text = "Recipient"',
            'table.cell(1, 0).text = "Fred"',
            'table.cell(1, 1).text = "Rebecca"',
            'doc.save(sys.argv[1])'
        ].join('\n');
        const created = spawnSync('python', ['-c', code, docxPath], { encoding: 'utf8' });
        assert.equal(created.status, 0, created.stderr || created.stdout);

        const result = await readDocument({ path: docxPath });
        assert.equal(result.isError, undefined, result.content[0].text);
        const payload = JSON.parse(result.content[0].text);
        assert.equal(payload.paragraphs[0].text, 'Employees');
        assert.deepEqual(payload.tables[0].rows[0], ['Giver', 'Recipient']);
        assert.deepEqual(payload.tables[0].rows[1], ['Fred', 'Rebecca']);
        assert.equal(result.structuredContent.document.paragraphs[0].text, 'Employees');
        assert.deepEqual(result.structuredContent.document.tables[0].rows[1], ['Fred', 'Rebecca']);
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
});

test('paper_metadata_lookup returns ranked scholarly metadata from OpenAlex and Crossref', async () => {
    let openAlexSearchExact = '';
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        response.setHeader('content-type', 'application/json');
        if (url.pathname === '/openalex/works') {
            openAlexSearchExact = url.searchParams.get('search.exact') || '';
            response.end(JSON.stringify({
                results: [
                    {
                        id: 'https://openalex.org/W123',
                        display_name: 'Pie Menus or Linear Menus, Which Is Better?',
                        publication_year: 2015,
                        doi: 'https://doi.org/10.1145/2702613.2732927',
                        type: 'article',
                        primary_location: {
                            source: { display_name: 'CHI EA 2015' },
                            landing_page_url: 'https://doi.org/10.1145/2702613.2732927'
                        },
                        best_oa_location: {
                            pdf_url: 'https://example.org/pie-menus.pdf',
                            landing_page_url: 'https://example.org/pie-menus'
                        },
                        authorships: [
                            { author: { display_name: 'Antti Oulasvirta', id: 'https://openalex.org/A1' } },
                            { author: { display_name: 'Jussi Jokinen', id: 'https://openalex.org/A2' } }
                        ],
                        cited_by_count: 17,
                        referenced_works_count: 21
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/crossref/works') {
            response.end(JSON.stringify({
                message: {
                    items: [
                        {
                            DOI: '10.1145/2702613.2732927',
                            title: ['Pie Menus or Linear Menus, Which Is Better?'],
                            URL: 'https://doi.org/10.1145/2702613.2732927',
                            type: 'proceedings-article',
                            publisher: 'ACM',
                            'container-title': ['CHI EA 2015'],
                            author: [
                                { given: 'Antti', family: 'Oulasvirta' },
                                { given: 'Jussi', family: 'Jokinen' }
                            ],
                            link: [
                                { URL: 'https://example.org/pie-menus.pdf', 'content-type': 'application/pdf' }
                            ]
                        }
                    ]
                }
            }));
            return;
        }
        response.writeHead(404);
        response.end(JSON.stringify({ message: `not found: ${url.pathname}` }));
    }, async (baseUrl) => {
        const result = await paperMetadataLookup({
            title: 'Pie Menus or Linear Menus, Which Is Better?',
            openAlexBaseUrl: `${baseUrl}/openalex/works`,
            crossrefBaseUrl: `${baseUrl}/crossref/works`
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        const payload = JSON.parse(result.content[0].text);
        assert.equal(openAlexSearchExact, 'Pie Menus or Linear Menus, Which Is Better?');
        assert.equal(payload.bestMatch.title, 'Pie Menus or Linear Menus, Which Is Better?');
        assert.equal(payload.bestMatch.doi, '10.1145/2702613.2732927');
        assert.equal(payload.bestMatch.authors[0].name, 'Antti Oulasvirta');
        assert.equal(payload.bestMatch.pdfUrl, 'https://example.org/pie-menus.pdf');
        assert.match(payload.nextActionHint, /prior papers/);
        assert.ok(payload.authorHistoryNextCalls.some((call) => call.args?.authorId === 'https://openalex.org/A1'));
        assert.equal(payload.suggestedNextCalls[0].tool, 'pdf_find_and_extract');
        assert.match(payload.suggestedNextCalls[0].args.query, /10\.1145\/2702613\.2732927/);
        assert.ok(payload.suggestedNextCalls.some((call) => call.args?.authorId === 'https://openalex.org/A1'));
        assert.ok(payload.results[0].authorsSummary.includes('Antti Oulasvirta'));
        assert.equal(payload.results[0].authors, undefined);
        assert.equal(result.structuredContent.results[0].authors[1].name, 'Jussi Jokinen');
        assert.match(result.structuredContent.nextActionHint, /prior papers/);
        assert.ok(result.structuredContent.authorHistoryNextCalls.some((call) => call.args?.authorId === 'https://openalex.org/A1'));
        assert.equal(result.structuredContent.suggestedNextCalls[0].tool, 'pdf_find_and_extract');
        assert.ok(result.content[0].text.indexOf('"bestMatch"') < result.content[0].text.indexOf('"suggestedNextCalls"'));
        assert.ok(result.content[0].text.indexOf('"authorHistoryNextCalls"') < result.content[0].text.indexOf('"suggestedNextCalls"'));
        assert.ok(result.content[0].text.indexOf('"suggestedNextCalls"') < result.content[0].text.indexOf('"results"'));
    });
});

test('paper_metadata_lookup keeps exact-title OpenAlex lookup when year is provided', async () => {
    let openAlexSearchExact = '';
    let openAlexFilter = '';
    let crossrefTitleQuery = '';
    let crossrefFilter = '';
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        response.setHeader('content-type', 'application/json');
        if (url.pathname === '/openalex/works') {
            openAlexSearchExact = url.searchParams.get('search.exact') || '';
            openAlexFilter = url.searchParams.get('filter') || '';
            response.end(JSON.stringify({
                results: [
                    {
                        id: 'https://openalex.org/W123',
                        display_name: 'Pie Menus or Linear Menus, Which Is Better?',
                        publication_year: 2015,
                        doi: 'https://doi.org/10.1145/2702613.2732927',
                        type: 'article',
                        primary_location: {
                            source: { display_name: 'CHI EA 2015' },
                            landing_page_url: 'https://doi.org/10.1145/2702613.2732927'
                        },
                        authorships: [
                            { author: { display_name: 'Antti Oulasvirta', id: 'https://openalex.org/A1' } }
                        ]
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/crossref/works') {
            crossrefTitleQuery = url.searchParams.get('query.title') || '';
            crossrefFilter = url.searchParams.get('filter') || '';
            response.end(JSON.stringify({
                message: {
                    items: [
                        {
                            DOI: '10.1007/978-1-4302-6581-8_7',
                            title: ['Creating Menus'],
                            URL: 'https://doi.org/10.1007/978-1-4302-6581-8_7',
                            type: 'book-chapter',
                            publisher: 'Apress',
                            'published-print': { 'date-parts': [[2015]] },
                            author: [{ given: 'Todd', family: 'Tomlinson' }]
                        }
                    ]
                }
            }));
            return;
        }
        response.writeHead(404);
        response.end(JSON.stringify({ message: `not found: ${url.pathname}` }));
    }, async (baseUrl) => {
        const result = await paperMetadataLookup({
            title: 'Pie Menus or Linear Menus, Which Is Better?',
            year: 2015,
            openAlexBaseUrl: `${baseUrl}/openalex/works`,
            crossrefBaseUrl: `${baseUrl}/crossref/works`
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        const payload = JSON.parse(result.content[0].text);
        assert.equal(openAlexSearchExact, 'Pie Menus or Linear Menus, Which Is Better?');
        assert.match(openAlexFilter, /from_publication_date:2015-01-01/);
        assert.match(openAlexFilter, /to_publication_date:2015-12-31/);
        assert.equal(crossrefTitleQuery, 'Pie Menus or Linear Menus, Which Is Better?');
        assert.match(crossrefFilter, /from-pub-date:2015-01-01/);
        assert.equal(payload.bestMatch.source, 'openalex');
        assert.equal(payload.bestMatch.title, 'Pie Menus or Linear Menus, Which Is Better?');
        assert.equal(payload.results.some((candidate) => candidate.title === 'Creating Menus'), false);
        assert.match(result.structuredContent.nextActionHint, /prior papers/);
        assert.ok(result.structuredContent.authorHistoryNextCalls.some((call) => call.args?.authorId === 'https://openalex.org/A1'));
    });
});

test('paper_metadata_lookup can list earlier works for an OpenAlex author id', async () => {
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        response.setHeader('content-type', 'application/json');
        if (url.pathname === '/openalex/works') {
            assert.equal(url.searchParams.get('filter'), 'author.id:https://openalex.org/A5047423326');
            assert.equal(url.searchParams.get('sort'), 'publication_date:asc');
            response.end(JSON.stringify({
                results: [
                    {
                        id: 'https://openalex.org/W1',
                        display_name: 'Mapping human-oriented information to software agents for online systems usage',
                        publication_year: 2001,
                        publication_date: '2001-01-01',
                        doi: 'https://doi.org/10.1049/cp:20010464',
                        type: 'proceedings-article',
                        primary_location: {
                            source: { display_name: 'IEE Colloquium on E-commerce: Netting the Opportunity' },
                            landing_page_url: 'https://doi.org/10.1049/cp:20010464'
                        },
                        authorships: [
                            { author: { display_name: 'Pietro Murano', id: 'https://openalex.org/A5047423326' } }
                        ]
                    },
                    {
                        id: 'https://openalex.org/W2',
                        display_name: 'A new software agent ?learning? algorithm',
                        publication_year: 2001,
                        publication_date: '2001-01-01',
                        doi: 'https://doi.org/10.1049/cp:20010478',
                        type: 'article',
                        primary_location: {
                            landing_page_url: 'http://usir.salford.ac.uk/id/eprint/916/'
                        },
                        best_oa_location: {
                            pdf_url: 'http://usir.salford.ac.uk/id/eprint/916/'
                        },
                        authorships: [
                            { author: { display_name: 'Pietro Murano', id: 'https://openalex.org/A5047423326' } }
                        ]
                    },
                    {
                        id: 'https://openalex.org/W3',
                        display_name: 'Later paper',
                        publication_year: 2016,
                        authorships: [
                            { author: { display_name: 'Pietro Murano', id: 'https://openalex.org/A5047423326' } }
                        ]
                    }
                ]
            }));
            return;
        }
        response.writeHead(404);
        response.end(JSON.stringify({ message: `not found: ${url.pathname}` }));
    }, async (baseUrl) => {
        const result = await paperMetadataLookup({
            authorId: 'https://openalex.org/A5047423326',
            beforeYear: 2015,
            openAlexBaseUrl: `${baseUrl}/openalex/works`
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        const payload = JSON.parse(result.content[0].text);
        assert.equal(payload.answerCandidate.earliestWorkTitle, 'Mapping human-oriented information to software agents for online systems usage');
        assert.equal(payload.answerCandidate.earliestWorkYear, 2001);
        assert.equal(payload.answerCandidate.earliestWorkDate, '2001-01-01');
        assert.equal(payload.results.length, 2);
        assert.equal(payload.bestMatch.title, 'Mapping human-oriented information to software agents for online systems usage');
        assert.equal(payload.bestMatch.year, 2001);
        assert.equal(payload.results[1].title, 'A new software agent ?learning? algorithm');
        assert.equal(result.structuredContent.answerCandidate.earliestWorkTitle, 'Mapping human-oriented information to software agents for online systems usage');
        assert.ok(result.content[0].text.indexOf('"answerCandidate"') < result.content[0].text.indexOf('"bestMatch"'));
    });
});

test('paper_metadata_lookup supports author-year-topic bibliographic discovery', async () => {
    let openAlexAuthorSearch = '';
    let openAlexScopedFilter = '';
    let openAlexScopedSearch = '';
    let crossrefAuthorQuery = '';
    let crossrefBibliographicQuery = '';
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        response.setHeader('content-type', 'application/json');
        if (url.pathname === '/openalex/authors') {
            openAlexAuthorSearch = url.searchParams.get('search') || '';
            response.end(JSON.stringify({
                results: [
                    {
                        id: 'https://openalex.org/A55',
                        display_name: 'Emily Midkiff',
                        works_count: 12,
                        cited_by_count: 90
                    },
                    {
                        id: 'https://openalex.org/A77',
                        display_name: 'Emily Berend',
                        works_count: 40,
                        cited_by_count: 120
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/openalex/works') {
            const filter = url.searchParams.get('filter') || '';
            const search = url.searchParams.get('search') || '';
            if (filter.includes('author.id:https://openalex.org/A55')) {
                openAlexScopedFilter = filter;
                openAlexScopedSearch = search;
                response.end(JSON.stringify({
                    results: [
                        {
                            id: 'https://openalex.org/W900',
                            display_name: 'The Problem of Dragons: The Struggle to Rehabilitate the Dragon in Children\'s Fantasy',
                            publication_year: 2014,
                            publication_date: '2014-06-01',
                            doi: 'https://doi.org/10.1234/dragons.2014',
                            type: 'journal-article',
                            primary_location: {
                                source: { display_name: 'Fafnir' },
                                landing_page_url: 'https://example.org/dragons'
                            },
                            best_oa_location: {
                                pdf_url: 'https://example.org/dragons.pdf'
                            },
                            authorships: [
                                { author: { display_name: 'Emily Midkiff', id: 'https://openalex.org/A55' } }
                            ]
                        }
                    ]
                }));
                return;
            }
            response.end(JSON.stringify({
                results: [
                    {
                        id: 'https://openalex.org/W901',
                        display_name: 'Unrelated dragon cartography paper',
                        publication_year: 2014,
                        type: 'journal-article',
                        primary_location: {
                            source: { display_name: 'Geographical Review' },
                            landing_page_url: 'https://example.org/noise'
                        },
                        authorships: [
                            { author: { display_name: 'Emily Berend', id: 'https://openalex.org/A77' } }
                        ]
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/crossref/works') {
            crossrefAuthorQuery = url.searchParams.get('query.author') || '';
            crossrefBibliographicQuery = url.searchParams.get('query.bibliographic') || '';
            response.end(JSON.stringify({
                message: {
                    items: [
                        {
                            DOI: '10.9999/noise',
                            title: ['Emily Berend Adult Reconstruction Symposium (2014)'],
                            URL: 'https://example.org/noise',
                            type: 'journal-article',
                            'container-title': ['The Duke Orthopaedic Journal'],
                            author: [
                                { given: 'Emily', family: 'Berend' }
                            ]
                        }
                    ]
                }
            }));
            return;
        }
        response.writeHead(404);
        response.end(JSON.stringify({ message: `not found: ${url.pathname}` }));
    }, async (baseUrl) => {
        const result = await paperMetadataLookup({
            author: 'Emily Midkiff',
            year: 2014,
            topic: 'dragon depictions',
            venue: 'Fafnir',
            openAlexBaseUrl: `${baseUrl}/openalex/works`,
            openAlexAuthorsBaseUrl: `${baseUrl}/openalex/authors`,
            crossrefBaseUrl: `${baseUrl}/crossref/works`
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        const payload = JSON.parse(result.content[0].text);
        assert.equal(openAlexAuthorSearch, 'Emily Midkiff');
        assert.match(openAlexScopedFilter, /author\.id:https:\/\/openalex\.org\/A55/);
        assert.match(openAlexScopedFilter, /from_publication_date:2014-01-01/);
        assert.match(openAlexScopedFilter, /to_publication_date:2014-12-31/);
        assert.match(openAlexScopedSearch, /dragon depictions/i);
        assert.equal(crossrefAuthorQuery, 'Emily Midkiff');
        assert.match(crossrefBibliographicQuery, /dragon depictions/i);
        assert.equal(payload.mode, 'bibliographic_lookup');
        assert.equal(payload.bestMatch.title, 'The Problem of Dragons: The Struggle to Rehabilitate the Dragon in Children\'s Fantasy');
        assert.equal(payload.bestMatch.year, 2014);
        assert.equal(payload.bestMatch.authors[0].name, 'Emily Midkiff');
        assert.equal(payload.bestMatch.venue, 'Fafnir');
        assert.equal(payload.bestMatch.pdfUrl, 'https://example.org/dragons.pdf');
    });
});

test('paper_metadata_lookup infers bibliographic discovery clues from raw scholarly query', async () => {
    let openAlexAuthorSearch = '';
    let openAlexScopedFilter = '';
    let openAlexScopedSearch = '';
    let crossrefAuthorQuery = '';
    let crossrefBibliographicQuery = '';
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        response.setHeader('content-type', 'application/json');
        if (url.pathname === '/openalex/authors') {
            openAlexAuthorSearch = url.searchParams.get('search') || '';
            response.end(JSON.stringify({
                results: [
                    {
                        id: 'https://openalex.org/A55',
                        display_name: 'Emily Midkiff',
                        works_count: 12,
                        cited_by_count: 90
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/openalex/works') {
            const filter = url.searchParams.get('filter') || '';
            const search = url.searchParams.get('search') || '';
            if (filter.includes('author.id:https://openalex.org/A55')) {
                openAlexScopedFilter = filter;
                openAlexScopedSearch = search;
                response.end(JSON.stringify({
                    results: [
                        {
                            id: 'https://openalex.org/W900',
                            display_name: 'The Problem of Dragons: The Struggle to Rehabilitate the Dragon in Children\'s Fantasy',
                            publication_year: 2014,
                            publication_date: '2014-06-01',
                            type: 'journal-article',
                            primary_location: {
                                source: { display_name: 'Fafnir' },
                                landing_page_url: 'https://example.org/dragons'
                            },
                            authorships: [
                                { author: { display_name: 'Emily Midkiff', id: 'https://openalex.org/A55' } }
                            ]
                        }
                    ]
                }));
                return;
            }
            response.end(JSON.stringify({ results: [] }));
            return;
        }
        if (url.pathname === '/crossref/works') {
            crossrefAuthorQuery = url.searchParams.get('query.author') || '';
            crossrefBibliographicQuery = url.searchParams.get('query.bibliographic') || '';
            response.end(JSON.stringify({ message: { items: [] } }));
            return;
        }
        response.writeHead(404);
        response.end(JSON.stringify({ message: `not found: ${url.pathname}` }));
    }, async (baseUrl) => {
        const result = await paperMetadataLookup({
            query: '"Emily Midkiff" "Fafnir" journal 2014 dragon depictions',
            openAlexBaseUrl: `${baseUrl}/openalex/works`,
            openAlexAuthorsBaseUrl: `${baseUrl}/openalex/authors`,
            crossrefBaseUrl: `${baseUrl}/crossref/works`
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        const payload = JSON.parse(result.content[0].text);
        assert.equal(openAlexAuthorSearch, 'Emily Midkiff');
        assert.match(openAlexScopedFilter, /author\.id:https:\/\/openalex\.org\/A55/);
        assert.match(openAlexScopedFilter, /from_publication_date:2014-01-01/);
        assert.match(openAlexScopedFilter, /to_publication_date:2014-12-31/);
        assert.match(openAlexScopedSearch, /dragon depictions/i);
        assert.equal(crossrefAuthorQuery, 'Emily Midkiff');
        assert.match(crossrefBibliographicQuery, /dragon depictions/i);
        assert.equal(payload.mode, 'bibliographic_lookup');
        assert.equal(payload.query.author, 'Emily Midkiff');
        assert.equal(payload.query.year, 2014);
        assert.equal(payload.query.venue, 'Fafnir');
        assert.match(payload.query.topic, /dragon/i);
        assert.equal(payload.bestMatch.title, 'The Problem of Dragons: The Struggle to Rehabilitate the Dragon in Children\'s Fantasy');
    });
});

test('github_repo_read parses common GitHub repository references', () => {
    assert.deepEqual(parseGitHubRepoRef({ repo: 'microsoft/playwright' }), {
        owner: 'microsoft',
        repo: 'playwright',
        ref: '',
        path: '',
        url: ''
    });
    assert.deepEqual(parseGitHubRepoRef({ url: 'https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/client/locator.ts' }), {
        owner: 'microsoft',
        repo: 'playwright',
        ref: 'main',
        path: 'packages/playwright-core/src/client/locator.ts',
        url: 'https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/client/locator.ts'
    });
});

test('web_search can parse Bing HTML result blocks for fallback search', () => {
    const html = `
        <html><body>
          <li class="b_algo">
            <h2><a href="https://playwright.dev/docs/actionability">Auto-waiting | Playwright</a></h2>
            <div class="b_caption"><p>Playwright performs actionability checks and auto-waits before actions.</p></div>
          </li>
          <li class="b_algo">
            <h2><a href="https://playwright.dev/docs/api/class-locator#locator-wait-for">locator.waitFor</a></h2>
            <p>Wait for a locator to satisfy state with timeout option.</p>
          </li>
        </body></html>
    `;
    const results = extractBingResults(html, 5);
    assert.equal(results.length, 2);
    assert.equal(results[0].url, 'https://playwright.dev/docs/actionability');
    assert.match(results[0].snippet, /auto-waits/i);
    assert.equal(results[1].title, 'locator.waitFor');
});

test('web_search fallback parsers handle DuckDuckGo HTML and generic anchors', () => {
    const duckHtml = `
        <div class="result">
          <a class="result__a" href="https://github.com/jadore801120/attention-is-all-you-need-pytorch">Attention is all you need: A Pytorch Implementation</a>
          <a class="result__snippet">Official Tensorflow implementation can be found in tensorflow/tensor2tensor.</a>
        </div>
    `;
    const duckResults = extractDuckDuckGoHtmlResults(duckHtml, 5);
    assert.equal(duckResults.length, 1);
    assert.equal(duckResults[0].url, 'https://github.com/jadore801120/attention-is-all-you-need-pytorch');
    assert.match(duckResults[0].snippet, /tensor2tensor/i);

    const genericHtml = '<a href="https://playwright.dev/docs/api/class-locator#locator-wait-for">locator.waitFor docs</a>';
    const genericResults = extractGenericAnchorResults(genericHtml, 5);
    assert.equal(genericResults.length, 1);
    assert.equal(genericResults[0].url, 'https://playwright.dev/docs/api/class-locator#locator-wait-for');
});

test('web_search can parse Yahoo result blocks and decode redirect URLs', () => {
    const html = `
        <ol class="reg searchCenterMiddle">
          <li class="first">
            <div class="dd algo">
              <div class="compTitle">
                <a href="https://r.search.yahoo.com/_ylt=abc/RV=2/RE=1/RO=10/RU=https%3a%2f%2fjournal.finfar.org%2fjournal%2farchive%2ffafnir-22014%2f/RK=2/RS=x">
                  <h3 class="title">Fafnir 2/2014 - Finfar</h3>
                </a>
              </div>
              <div class="compText"><p>Abstract: This article discusses the view of history.</p></div>
            </div>
          </li>
        </ol>
    `;
    const results = extractYahooResults(html, 5);
    assert.equal(results.length, 1);
    assert.equal(results[0].title, 'Fafnir 2/2014 - Finfar');
    assert.equal(results[0].url, 'https://journal.finfar.org/journal/archive/fafnir-22014/');
    assert.match(results[0].snippet, /view of history/i);
});

test('scholarly search can parse arXiv DOI API entries into PDF candidates', () => {
    const xml = `
        <feed>
          <entry>
            <id>http://arxiv.org/abs/2306.01071v1</id>
            <title>The Population of the Galactic Center Filaments</title>
          </entry>
        </feed>
    `;
    const candidates = extractArxivCandidatesFromAtom(xml, '10.3847/2041-8213/acd54b');

    assert.equal(candidates[0].url, 'https://arxiv.org/pdf/2306.01071');
    assert.equal(candidates[1].url, 'https://arxiv.org/abs/2306.01071');
    assert.match(candidates[0].title, /Galactic Center Filaments/);
});

test('web_search can parse GitHub repository API fallback results', () => {
    const json = JSON.stringify({
        items: [
            {
                full_name: 'tensorflow/tensor2tensor',
                html_url: 'https://github.com/tensorflow/tensor2tensor',
                description: 'Library of deep learning models including Transformer.',
                language: 'Python',
                stargazers_count: 13000,
                updated_at: '2026-01-01T00:00:00Z'
            }
        ]
    });
    const results = extractGitHubRepositoryResults(json, 5);
    assert.equal(results.length, 1);
    assert.equal(results[0].url, 'https://github.com/tensorflow/tensor2tensor');
    assert.match(results[0].title, /tensorflow\/tensor2tensor/);
    assert.match(results[0].snippet, /Python/);

    const irrelevant = JSON.stringify({
        items: [
            {
                full_name: 'mlabonne/llm-course',
                html_url: 'https://github.com/mlabonne/llm-course',
                description: 'Course to get into Large Language Models.',
                stargazers_count: 79912
            }
        ]
    });
    assert.equal(
        extractGitHubRepositoryResults(irrelevant, 5, 'Attention Is All You Need transformer reproduction').length,
        0
    );
});

test('web_search chooses GitHub backend first only for repository-oriented queries', () => {
    const githubBackends = normalizeSearchBackends({}, 'site:github.com Attention Is All You Need implementation').map((backend) => backend.id);
    assert.equal(githubBackends[0], 'github_repositories');
    assert.ok(githubBackends.includes('duckduckgo_lite'));

    const generalBackends = normalizeSearchBackends({}, 'Playwright locator waitFor official docs').map((backend) => backend.id);
    assert.equal(generalBackends[0], 'bing_html');
});

test('github_repo_read reads README, tree, and file evidence through GitHub API shape', async () => {
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        response.setHeader('content-type', 'application/json');
        if (url.pathname === '/repos/octo/hello/readme') {
            response.end(JSON.stringify({
                path: 'README.md',
                html_url: 'https://github.com/octo/hello/blob/main/README.md',
                encoding: 'base64',
                content: Buffer.from('# Hello\n\nMinimal demo repository.').toString('base64')
            }));
            return;
        }
        if (url.pathname === '/repos/octo/hello') {
            response.end(JSON.stringify({
                full_name: 'octo/hello',
                html_url: 'https://github.com/octo/hello',
                default_branch: 'main'
            }));
            return;
        }
        if (url.pathname === '/repos/octo/hello/git/trees/main') {
            response.end(JSON.stringify({
                tree: [
                    { path: 'README.md', type: 'blob', size: 32 },
                    { path: 'src/index.js', type: 'blob', size: 42 },
                    { path: 'src/runtime.js', type: 'blob', size: 24 }
                ]
            }));
            return;
        }
        if (url.pathname === '/repos/octo/hello/contents/src/index.js') {
            response.end(JSON.stringify({
                path: 'src/index.js',
                html_url: 'https://github.com/octo/hello/blob/main/src/index.js',
                encoding: 'base64',
                content: Buffer.from('export const answer = 42;\n').toString('base64')
            }));
            return;
        }
        response.writeHead(404);
        response.end(JSON.stringify({ message: `not found: ${url.pathname}` }));
    }, async (baseUrl) => {
        const readme = await githubRepoRead({ repo: 'octo/hello', mode: 'readme', ref: 'main', apiBaseUrl: baseUrl });
        assert.equal(readme.isError, undefined);
        assert.match(readme.content[0].text, /Minimal demo repository/);
        assert.equal(readme.details.path, 'README.md');

        const tree = await githubRepoRead({ repo: 'octo/hello', mode: 'tree', apiBaseUrl: baseUrl });
        assert.equal(tree.isError, undefined);
        assert.equal(tree.details.ref, 'main');
        assert.equal(tree.details.returnedEntries, 3);
        assert.match(tree.content[0].text, /src\/index\.js/);

        const file = await githubRepoRead({ url: 'https://github.com/octo/hello/blob/main/src/index.js', mode: 'file', apiBaseUrl: baseUrl });
        assert.equal(file.isError, undefined);
        assert.equal(file.details.path, 'src/index.js');
        assert.match(file.content[0].text, /answer = 42/);
    });
});

test('github_repo_read falls back to raw GitHub content when API file read is unavailable', async () => {
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/repos/octo/hello/contents/package.json') {
            response.writeHead(403, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ message: 'API rate limit exceeded' }));
            return;
        }
        if (url.pathname === '/raw/octo/hello/main/package.json') {
            response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
            response.end('{"name":"hello","version":"1.0.0"}\n');
            return;
        }
        response.writeHead(404, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ message: `not found: ${url.pathname}` }));
    }, async (baseUrl) => {
        const file = await githubRepoRead({
            repo: 'octo/hello',
            mode: 'file',
            path: 'package.json',
            ref: 'main',
            apiBaseUrl: baseUrl,
            rawBaseUrl: `${baseUrl}/raw`
        });
        assert.equal(file.isError, undefined);
        assert.equal(file.details.ref, 'main');
        assert.equal(file.details.path, 'package.json');
        assert.match(file.content[0].text, /"name":"hello"/);
    });
});

test('search follow-up suggestions prefer DOI and PDF candidates over generic fetches', () => {
    const calls = buildSuggestedCallsFromSearchResults([
        {
            title: 'Carolyn Collins Petersen: Mysterious galactic threads - linked paper',
            url: 'https://doi.org/10.3847/2041-8213/acd54b',
            snippet: 'Universe Today linked study by Carolyn Collins Petersen'
        },
        {
            title: 'Carolyn Collins Petersen linked paper PDF',
            url: 'https://example.org/files/paper.pdf',
            snippet: 'Full text PDF for the Universe Today article'
        },
        {
            title: 'Example home',
            url: 'https://example.org/',
            snippet: 'Home page'
        }
    ], { query: 'Carolyn Collins Petersen Universe Today June 2023 linked paper' });

    assert.equal(calls[0].tool, 'paper_metadata_lookup');
    assert.equal(calls[0].args.doi, '10.3847/2041-8213/acd54b');
    assert.equal(calls[1].tool, 'pdf_extract_text');
    assert.equal(calls[1].args.url, 'https://example.org/files/paper.pdf');
});

test('search follow-up suggestions stay empty for off-target popular results', () => {
    const calls = buildSuggestedCallsFromSearchResults([
        {
            title: 'Emily (2022 film) - Wikipedia',
            url: 'https://en.wikipedia.org/wiki/Emily_(2022_film)',
            snippet: 'Emily premiered at the Toronto International Film Festival.'
        },
        {
            title: 'Emily (2022) - IMDb',
            url: 'https://www.imdb.com/title/tt12374656/',
            snippet: 'Cast, plot, and reviews for the movie Emily.'
        }
    ], { query: '"Emily Midkiff" Fafnir journal June 2014 dragon' });

    assert.deepEqual(calls, []);
});

test('inferPaperMetadataArgsFromScholarlyQuery extracts author year venue and topic clues', () => {
    const args = inferPaperMetadataArgsFromScholarlyQuery('"Emily Midkiff" "Fafnir" journal 2014 dragon depictions');

    assert.equal(args.author, 'Emily Midkiff');
    assert.equal(args.year, 2014);
    assert.equal(args.venue, 'Fafnir');
    assert.match(args.topic, /dragon/i);
});

test('inferPaperMetadataArgsFromScholarlyQuery keeps single-author surname clues', () => {
    const args = inferPaperMetadataArgsFromScholarlyQuery('Nedoshivina 2010 Vietnam Lepidoptera specimens');

    assert.equal(args.author, 'Nedoshivina');
    assert.equal(args.year, 2010);
    assert.match(args.topic, /Vietnam/i);
    assert.match(args.topic, /Lepidoptera/i);
});

test('web_fetch rejects PDF/binary content instead of returning raw PDF bytes', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'application/pdf' });
        response.end('%PDF-1.5\n1 0 obj\n<< /Filter /FlateDecode >>\nstream\nbinary\nendstream');
    }, async (baseUrl) => {
        const result = await webFetch({ url: `${baseUrl}/paper.pdf` });

        assert.equal(result.isError, true);
        assert.equal(result.details.status, 'unsupported_content_type');
        assert.equal(result.details.contentType, 'application/pdf');
        assert.deepEqual(result.details.suggestedTools, ['pdf_extract_text', 'download_file']);
        assert.doesNotMatch(result.content[0].text, /%PDF-1\.5/);
    });
});

test('web_fetch surfaces linked DOI and PDF follow-up actions from HTML pages', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end([
            '<html><body>',
            '<a href="/about">About</a>',
            '<a href="https://doi.org/10.3847/2041-8213/acd54b">Linked paper</a>',
            '<a href="/files/paper.pdf">Download PDF</a>',
            '</body></html>'
        ].join(''));
    }, async (baseUrl) => {
        const result = await webFetch({ url: `${baseUrl}/article`, query: 'linked paper' });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.suggestedNextCalls[0].tool, 'paper_metadata_lookup');
        assert.equal(result.structuredContent.suggestedNextCalls[0].args.doi, '10.3847/2041-8213/acd54b');
        assert.equal(result.structuredContent.suggestedNextCalls[1].tool, 'pdf_extract_text');
        assert.equal(result.structuredContent.observedRelevantLinks[0].kind, 'doi');
        assert.match(result.content[0].text, /Suggested next calls:/);
        assert.match(result.content[0].text, /High-signal links:/);
    });
});

test('web_fetch does not suggest unrelated PDFs when query terms are absent', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end([
            '<html><body>',
            '<h1>Current issue</h1>',
            '<a href="/articles/current.pdf">PDF</a>',
            '<a href="/issue/archive/2">Next</a>',
            '<p>Mass surveillance and monomyth essays.</p>',
            '</body></html>'
        ].join(''));
    }, async (baseUrl) => {
        const result = await webFetch({
            url: `${baseUrl}/issue/archive`,
            query: 'Emily Midkiff June 2014 dragon'
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.suggestedNextCalls[0].tool, 'web_fetch');
        assert.equal(result.structuredContent.suggestedNextCalls[0].args.url, `${baseUrl}/issue/archive/2`);
        assert.ok(!result.structuredContent.suggestedNextCalls.some((call) => call.tool === 'pdf_extract_text'));
    });
});

test('web_fetch marks anti-bot challenge pages as low-value evidence', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end('<html><body><h1>Access denied</h1><p>Protected by Radware Bot Manager. Verify you are human.</p></body></html>');
    }, async (baseUrl) => {
        const result = await webFetch({ url: `${baseUrl}/blocked` });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.pageStatus, 'access_challenge');
        assert.match(result.structuredContent.evidenceGap, /anti-bot challenge/i);
        assert.match(result.structuredContent.recoveryHint, /Do not keep refetching/i);
    });
});

test('pdf_find_and_extract discovers PDF links from HTML pages and extracts text', async () => {
    await withServer((request, response) => {
        if (request.url === '/paper') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end('<html><body><a href="/files/paper.pdf">Download PDF</a></body></html>');
            return;
        }
        if (request.url === '/files/paper.pdf') {
            response.writeHead(200, { 'content-type': 'application/pdf' });
            response.end(buildSimplePdf('Fish bag volume is 0.1777 cubic meters'));
            return;
        }
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
    }, async (baseUrl) => {
        const result = await pdfFindAndExtract({
            url: `${baseUrl}/paper`,
            query: 'Fish bag volume',
            maxChars: 5000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.details.pdfUrl, `${baseUrl}/files/paper.pdf`);
        assert.match(result.content[0].text, /0\.1777 cubic meters/);
    });
});

test('pdf_find_and_extract follows OJS article search results before extracting PDFs', async () => {
    await withServer((request, response) => {
        if (request.url?.startsWith('/index.php/jist/search')) {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end([
                '<html><body>',
                '<h2>Search Results</h2>',
                '<a href="/index.php/jist/article/view/733">Can Hiccup Supply Enough Fish to Maintain a Dragon’s Diet?</a>',
                '</body></html>'
            ].join(''));
            return;
        }
        if (request.url === '/index.php/jist/article/view/733') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end('<html><body><a href="/index.php/jist/article/view/733/684">PDF</a></body></html>');
            return;
        }
        if (request.url === '/index.php/jist/article/view/733/684') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end('<html><body><a href="/index.php/jist/article/download/733/684/1496">Download PDF</a></body></html>');
            return;
        }
        if (request.url === '/index.php/jist/article/download/733/684/1496') {
            response.writeHead(200, { 'content-type': 'application/pdf' });
            response.end(buildSimplePdf('The fish bag volume is 0.1777 m^3'));
            return;
        }
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
    }, async (baseUrl) => {
        const result = await pdfFindAndExtract({
            url: `${baseUrl}/index.php/jist/search?query=Hiccup+Fish+Dragon`,
            title: 'Can Hiccup Supply Enough Fish to Maintain a Dragon’s Diet?',
            extract_query: 'fish bag volume m^3',
            maxChars: 5000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.details.pdfUrl, `${baseUrl}/index.php/jist/article/download/733/684/1496`);
        assert.match(result.content[0].text, /0\.1777 m\^3/);
    });
});

test('pdf_find_and_extract promotes quoted answer candidates near rare evidence terms', async () => {
    const pdfText = [
        'Title: "Dragons are Tricksy": The Uncanny Dragons of Children Literature.',
        'Earlier dragon lore describes two guardians and many dragon conflicts without the target evidence.',
        'Ruth Stein in 1968 and Margaret Blount in 1974 both comment with distaste on the increasingly cuddly, "fluffy" nature of dragons.'
    ].join('\n');
    await withServer((request, response) => {
        if (request.url === '/paper') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end('<html><body><a href="/files/paper.pdf">Download PDF</a></body></html>');
            return;
        }
        if (request.url === '/files/paper.pdf') {
            response.writeHead(200, { 'content-type': 'application/pdf' });
            response.end(buildSimplePdf(pdfText));
            return;
        }
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
    }, async (baseUrl) => {
        const result = await pdfFindAndExtract({
            url: `${baseUrl}/paper`,
            title: '"Dragons are Tricksy": The Uncanny Dragons of Children Literature',
            extract_query: 'quoted from two different authors distaste dragon depictions',
            maxChars: 5000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerCandidates[0].answer, 'fluffy');
        assert.match(result.content[0].text, /^PDF answer candidates:/);
        assert.ok(result.content[0].text.indexOf('fluffy') < result.content[0].text.indexOf('Dragons are Tricksy'));
        assert.match(result.structuredContent.evidenceSnippets, /distaste/i);
    });
});

test('pdf_find_and_extract searches beyond the returned text window for award identifiers', async () => {
    const longPrefix = 'background filament population discussion '.repeat(900);
    const pdfText = `${longPrefix}\nWork by R.G.A. was supported by NASA under award number 80GSFC21M0002.`;
    await withServer((request, response) => {
        if (request.url === '/paper') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end('<html><body><a href="/files/award.pdf">Download PDF</a></body></html>');
            return;
        }
        if (request.url === '/files/award.pdf') {
            response.writeHead(200, { 'content-type': 'application/pdf' });
            response.end(buildSimplePdf(pdfText));
            return;
        }
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
    }, async (baseUrl) => {
        const result = await pdfFindAndExtract({
            url: `${baseUrl}/paper`,
            query: 'Galactic Center Filaments',
            extract_query: 'NASA award number Arendt',
            maxChars: 5000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerCandidates[0].answer, '80GSFC21M0002');
        assert.match(result.content[0].text, /80GSFC21M0002/);
        assert.equal(result.structuredContent.extractionMaxChars >= 80000, true);
    });
});

test('web_extract_links rejects non-HTML content', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'application/pdf' });
        response.end('%PDF-1.5\nbinary');
    }, async (baseUrl) => {
        const result = await webExtractLinks({ url: `${baseUrl}/paper.pdf` });

        assert.equal(result.isError, true);
        assert.equal(result.details.status, 'unsupported_content_type');
    });
});

test('web_extract_links ranks research links ahead of navigation noise and suggests follow-up calls', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end([
            '<html><body>',
            '<a href="/about">About</a>',
            '<a href="/files/paper.pdf">PDF</a>',
            '<a href="https://doi.org/10.3847/2041-8213/acd54b">Linked study</a>',
            '<a href="/contact">Contact</a>',
            '</body></html>'
        ].join(''));
    }, async (baseUrl) => {
        const result = await webExtractLinks({ url: `${baseUrl}/article` });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.details.links[0].url, 'https://doi.org/10.3847/2041-8213/acd54b');
        assert.equal(result.details.links[1].url, `${baseUrl}/files/paper.pdf`);
        assert.equal(result.structuredContent.suggestedNextCalls[0].tool, 'paper_metadata_lookup');
        assert.equal(result.structuredContent.suggestedNextCalls[1].tool, 'pdf_extract_text');
        assert.ok(rankLinksForResearch(result.details.links, `${baseUrl}/article`)[0].score >= rankLinksForResearch(result.details.links, `${baseUrl}/article`)[1].score);
    });
});

test('web_extract_links preserves duplicate OJS issue titles and archive pagination', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end([
            '<html><body>',
            '<main><h1>Archives</h1><ul>',
            '<li><div class="obj_issue_summary">',
            '<a class="cover" href="/issue/view/12461"><img alt="Cover"></a>',
            '<h2><a class="title" href="/issue/view/12461">Vol. 1 No. 2/2014 (2014)</a></h2>',
            '</div></li>',
            '<li><div class="obj_issue_summary">',
            '<a class="cover" href="/issue/view/12457"><img alt="Cover"></a>',
            '<h2><a class="title" href="/issue/view/12457">Vol. 1 No. 1/2014 (2014)</a></h2>',
            '</div></li>',
            '</ul>',
            '<a class="next" href="/issue/archive/2">Next</a>',
            '</main>',
            '</body></html>'
        ].join(''));
    }, async (baseUrl) => {
        const result = await webExtractLinks({
            url: `${baseUrl}/issue/archive`,
            query: 'June 2014 Emily Midkiff dragon',
            maxLinks: 20
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        const issueLink = result.details.links.find((link) => link.url === `${baseUrl}/issue/view/12461`);
        assert.equal(issueLink.text, 'Vol. 1 No. 2/2014 (2014)');
        assert.ok(result.details.links.some((link) => link.url === `${baseUrl}/issue/archive/2` && link.text === 'Next'));
        assert.ok(result.structuredContent.suggestedNextCalls.some((call) => (
            call.tool === 'web_fetch' && call.args?.url === `${baseUrl}/issue/archive/2`
        )));
        assert.match(result.content[0].text, /Vol\. 1 No\. 2\/2014/);
    });
});

test('web_extract_links uses aria-labelled article titles for OJS PDF links', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end([
            '<html><body>',
            '<div class="obj_article_summary">',
            '<h3 class="title"><a id="article-164228" href="/article/view/164228">',
            '“Dragons are Tricksy” <span class="subtitle">The Uncanny Dragons of Children’s Literature</span>',
            '</a></h3>',
            '<a class="obj_galley_link pdf" href="/article/view/164228/106850" ',
            'id="article-164228-galley-106850" aria-labelledby="article-164228-galley-106850 article-164228">PDF</a>',
            '</div>',
            '</body></html>'
        ].join(''));
    }, async (baseUrl) => {
        const result = await webExtractLinks({
            url: `${baseUrl}/issue/view/12461`,
            query: 'Dragons are Tricksy Emily Midkiff',
            maxLinks: 20
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        const pdfLink = result.details.links.find((link) => link.url === `${baseUrl}/article/view/164228/106850`);
        assert.match(pdfLink.text, /Dragons are Tricksy/);
        assert.match(pdfLink.text, /PDF/);
        assert.equal(result.structuredContent.suggestedNextCalls[0].tool, 'pdf_extract_text');
        assert.equal(result.structuredContent.suggestedNextCalls[0].args.url, `${baseUrl}/article/view/164228/106850`);
    });
});
