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
    assessSearchConfidence,
    buildEffectiveSearchQuery,
    buildSearchClarificationChoices,
    buildSuggestedCallsFromSearchResults,
    buildYouTubeEvidenceSearchQuery,
    buildYouTubeOEmbedUrl,
    classifyYtDlpFailure,
    crawl4aiFetchConfig,
    extractArxivCandidatesFromAtom,
    extractBingResults,
    extractDuckDuckGoHtmlResults,
    extractGenericAnchorResults,
    extractGitHubRepositoryResults,
    extractShortCjkEntityTerms,
    extractYouTubeVideoId,
    extractWikipediaPageTitle,
    extractYahooResults,
    githubRepoRead,
    inferPaperMetadataArgsFromScholarlyQuery,
    normalizeSearchBackends,
    paperMetadataLookup,
    parseGitHubRepoRef,
    pdfFindAndExtract,
    rankLinksForResearch,
    rankSearchResultsForFollowup,
    readDocument,
    runPythonFile,
    stripWikiText,
    webExtractLinks,
    webFetch,
    webResearch,
    webSearch,
    youtubeTranscript,
    youtubeVideoSearch
} = require('../scripts/mcp-ailis-research-server.cjs');

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

test('AILIS research MCP exposes Codex-aligned PDF/file tools', () => {
    const names = TOOLS.map((tool) => tool.name);
    const searchTool = TOOLS.find((tool) => tool.name === 'web_search');
    const fetchTool = TOOLS.find((tool) => tool.name === 'web_fetch');
    const pythonTool = TOOLS.find((tool) => tool.name === 'run_python_file');
    const youtubeSearchTool = TOOLS.find((tool) => tool.name === 'youtube_video_search');
    const youtubeTranscriptTool = TOOLS.find((tool) => tool.name === 'youtube_transcript');

    assert.ok(names.includes('web_search'));
    assert.ok(names.includes('web_research'));
    assert.ok(names.includes('github_repo_read'));
    assert.ok(names.includes('web_fetch'));
    assert.ok(names.includes('pdf_extract_text'));
    assert.ok(names.includes('paper_metadata_lookup'));
    assert.ok(names.includes('pdf_find_and_extract'));
    assert.ok(names.includes('download_file'));
    assert.ok(names.includes('read_document'));
    assert.ok(names.includes('read_presentation'));
    assert.ok(names.includes('youtube_video_search'));
    assert.ok(names.includes('youtube_transcript'));
    assert.ok(searchTool.inputSchema.properties.backend);
    assert.ok(searchTool.inputSchema.properties.backends);
    assert.ok(searchTool.inputSchema.properties.provider);
    assert.ok(searchTool.inputSchema.properties.searxngUrl);
    assert.ok(searchTool.inputSchema.properties.exact_keywords);
    assert.ok(searchTool.inputSchema.properties.exactKeywords);
    assert.ok(searchTool.inputSchema.properties.backends.items.enum.includes('duckduckgo_html'));
    assert.ok(searchTool.inputSchema.properties.backends.items.enum.includes('github_repositories'));
    assert.ok(searchTool.inputSchema.properties.backends.items.enum.includes('searxng_json'));
    assert.ok(searchTool.inputSchema.properties.backends.items.enum.includes('firecrawl_search'));
    assert.ok(searchTool.description.includes('managed search backends'));
    assert.ok(searchTool.description.includes('AILIS_SEARXNG_URL'));
    assert.ok(fetchTool.inputSchema.properties.extract_query);
    assert.ok(fetchTool.inputSchema.properties.extractQuery);
    assert.ok(pythonTool.inputSchema.properties.code);
    assert.ok(pythonTool.inputSchema.properties.inline_code);
    assert.ok(pythonTool.inputSchema.properties.inlineCode);
    assert.ok(pythonTool.inputSchema.properties.source);
    assert.ok(pythonTool.inputSchema.properties.python);
    assert.equal(youtubeSearchTool.inputSchema.additionalProperties, false);
    assert.equal(youtubeTranscriptTool.inputSchema.additionalProperties, false);
    assert.ok(youtubeSearchTool.inputSchema.properties.video_id);
    assert.ok(youtubeTranscriptTool.inputSchema.properties.video_id);
    assert.match(youtubeSearchTool.description, /oEmbed/);
    assert.match(youtubeTranscriptTool.description, /metadata_only/);
});

test('run_python_file supports inline Python code for one-off benchmark calculations', async () => {
    const result = await runPythonFile({
        code: 'print(6 * 7)'
    });

    assert.equal(result.isError, false);
    assert.match(result.content[0].text, /42/);
    assert.equal(result.structuredContent.status, 'completed');
    assert.equal(result.structuredContent.inlineCode, true);
});

test('run_python_file supports common inline_code aliases', async () => {
    const snake = await runPythonFile({
        inline_code: 'print(7 * 8)'
    });
    const camel = await runPythonFile({
        inlineCode: 'print(9 * 9)'
    });

    assert.equal(snake.isError, false);
    assert.equal(camel.isError, false);
    assert.match(snake.content[0].text, /56/);
    assert.match(camel.content[0].text, /81/);
    assert.equal(snake.structuredContent.inlineCode, true);
    assert.equal(camel.structuredContent.inlineCode, true);
});

test('YouTube tools expose recovery affordance before broad web search', async () => {
    const search = await youtubeVideoSearch({});
    assert.equal(search.isError, true);
    assert.equal(search.structuredContent.status, 'invalid_args');
    assert.equal(search.structuredContent.suggestedNextCalls[0].tool, 'youtube_video_search');

    const transcript = await youtubeTranscript({});
    assert.equal(transcript.isError, true);
    assert.equal(transcript.structuredContent.status, 'invalid_args');
    assert.equal(transcript.structuredContent.suggestedNextCalls[0].tool, 'youtube_video_search');
    assert.match(transcript.content[0].text, /suggested_next_calls/);
});

test('YouTube oEmbed helpers preserve exact video identity and task terms', () => {
    assert.equal(extractYouTubeVideoId('https://www.youtube.com/watch?v=L1vXCYZAYYM&t=12s'), 'L1vXCYZAYYM');
    assert.equal(extractYouTubeVideoId('https://youtu.be/L1vXCYZAYYM?si=abc'), 'L1vXCYZAYYM');

    const oembedUrl = buildYouTubeOEmbedUrl('https://www.youtube.com/watch?v=L1vXCYZAYYM');
    assert.match(oembedUrl, /^https:\/\/www\.youtube\.com\/oembed\?/);
    assert.match(decodeURIComponent(oembedUrl), /watch\?v=L1vXCYZAYYM/);

    const evidenceQuery = buildYouTubeEvidenceSearchQuery({
        title: 'Penguin Chicks Stand Up To Giant Petrel',
        uploader: 'John Downer Productions'
    }, {
        question: 'highest number of bird species on camera simultaneously'
    });
    assert.match(evidenceQuery, /"Penguin Chicks Stand Up To Giant Petrel"/);
    assert.match(evidenceQuery, /"John Downer Productions"/);
    assert.match(evidenceQuery, /highest number of bird species/);
});

test('yt-dlp failures classify YouTube anti-bot blocks as non-query problems', () => {
    const failure = classifyYtDlpFailure('Sign in to confirm you are not a bot. Use --cookies-from-browser.');

    assert.equal(failure.status, 'anti_bot_blocked');
    assert.equal(failure.failureReason, 'anti_bot_blocked');
    assert.match(failure.nextActions.join(' '), /cookies/i);
});

test('read_document extracts Word paragraphs and tables as structured JSON', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-docx-'));
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
        assert.match(result.content[0].text, /DOCUMENT_READ_COMPLETE/);
        assert.match(result.content[0].text, /fullTextPath:/);
        const payload = result.structuredContent.document;
        assert.equal(payload.paragraphs[0].text, 'Employees');
        assert.deepEqual(payload.tables[0].rows[0], ['Giver', 'Recipient']);
        assert.deepEqual(payload.tables[0].rows[1], ['Fred', 'Rebecca']);
        assert.equal(result.structuredContent.document.paragraphs[0].text, 'Employees');
        assert.deepEqual(result.structuredContent.document.tables[0].rows[1], ['Fred', 'Rebecca']);
        assert.equal(result.structuredContent.completeness.fullDocumentRead, true);
        assert.equal(result.structuredContent.complete, true);
        assert.equal(result.structuredContent.truncated, false);
        assert.equal(result.structuredContent.reasoningReady, true);
        assert.equal(result.structuredContent.observationContract.reasoning_ready, true);
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
        assert.ok(payload.authorHistoryNextCalls.some((call) => call.args?.author === 'Antti Oulasvirta'));
        assert.match(payload.authorDisambiguationHint, /bestMatch\.authors/);
        assert.equal(payload.suggestedNextCalls[0].tool, 'pdf_find_and_extract');
        assert.match(payload.suggestedNextCalls[0].args.query, /10\.1145\/2702613\.2732927/);
        assert.ok(payload.suggestedNextCalls.some((call) => call.args?.authorId === 'https://openalex.org/A1'));
        assert.ok(payload.results[0].authorsSummary.includes('Antti Oulasvirta'));
        assert.equal(payload.results[0].authors, undefined);
        assert.equal(result.structuredContent.results[0].authors[1].name, 'Jussi Jokinen');
        assert.match(result.structuredContent.nextActionHint, /prior papers/);
        assert.ok(result.structuredContent.authorHistoryNextCalls.some((call) => call.args?.authorId === 'https://openalex.org/A1'));
        assert.ok(result.structuredContent.authorHistoryNextCalls.some((call) => call.args?.author === 'Antti Oulasvirta'));
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
        assert.equal(payload.answerCandidate.answer, 'Mapping Human Oriented Information to Software Agents for Online Systems Usage');
        assert.equal(payload.answerCandidate.earliestWorkTitle, 'Mapping human-oriented information to software agents for online systems usage');
        assert.deepEqual(payload.answerCandidate.titleVariants, [
            'Mapping human-oriented information to software agents for online systems usage',
            'Mapping Human Oriented Information to Software Agents for Online Systems Usage'
        ]);
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

test('web_search chooses provider chain while keeping GitHub backend first for repository queries', () => {
    const previousProvider = process.env.AILIS_WEB_SEARCH_PROVIDER;
    delete process.env.AILIS_WEB_SEARCH_PROVIDER;
    try {
        const githubBackends = normalizeSearchBackends({}, 'site:github.com Attention Is All You Need implementation').map((backend) => backend.id);
        assert.equal(githubBackends[0], 'github_repositories');
        assert.equal(githubBackends[1], 'searxng_json');
        assert.ok(githubBackends.includes('firecrawl_search'));
        assert.ok(githubBackends.includes('duckduckgo_lite'));

        const generalBackends = normalizeSearchBackends({}, 'Playwright locator waitFor official docs').map((backend) => backend.id);
        assert.equal(generalBackends[0], 'searxng_json');
        assert.equal(generalBackends[1], 'firecrawl_search');
        assert.ok(generalBackends.includes('bing_html'));

        const htmlBackends = normalizeSearchBackends({ provider: 'html' }, 'Playwright locator waitFor official docs').map((backend) => backend.id);
        assert.deepEqual(htmlBackends, ['bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'yahoo_html']);
    } finally {
        if (previousProvider === undefined) {
            delete process.env.AILIS_WEB_SEARCH_PROVIDER;
        } else {
            process.env.AILIS_WEB_SEARCH_PROVIDER = previousProvider;
        }
    }
});

test('web_search uses SearXNG JSON provider before HTML fallback', async () => {
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        assert.equal(url.pathname, '/search');
        assert.equal(url.searchParams.get('format'), 'json');
        assert.match(url.searchParams.get('q') || '', /叶瞬光/);
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({
            results: [
                {
                    title: '【绝区零】叶瞬光角色攻略',
                    url: 'https://www.bilibili.com/video/BV1rXBoBoEv1/',
                    content: '小光攻略，技能机制，输出手法，配队配装，驱动盘和音擎。'
                }
            ]
        }));
    }, async (baseUrl) => {
        const result = await webSearch({
            query: '绝区零 叶瞬光 小光 攻略',
            provider: 'searxng',
            searxngUrl: baseUrl,
            maxResults: 5
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.backend, 'searxng_json');
        assert.equal(result.structuredContent.attempts[0].backend, 'searxng_json');
        assert.equal(result.structuredContent.results[0].url, 'https://www.bilibili.com/video/BV1rXBoBoEv1/');
        assert.equal(result.structuredContent.suggestedNextCalls[0].tool, 'web_fetch');
    });
});

test('web_search extracts typed country answer candidates from high-coverage search results', async () => {
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        assert.equal(url.pathname, '/search');
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({
            results: [
                {
                    title: 'DDC 633 BASE unknown language flag unique country Guatemala answer',
                    url: 'https://example.test/search?topic=DDC+633+BASE+unknown+language+unique+flag&country=Guatemala',
                    content: 'Under DDC 633 on Bielefeld University Library BASE as of 2020, the unknown language article with the unique flag was from country Guatemala.'
                },
                {
                    title: 'BASE home',
                    url: 'https://openscience.ub.uni-bielefeld.de/',
                    content: "BASE is one of the world's most voluminous search engines."
                }
            ]
        }));
    }, async (baseUrl) => {
        const result = await webSearch({
            query: "Under DDC 633 on Bielefeld University Library's BASE, as of 2020, from what country was the unknown language article with a flag unique from the others?",
            provider: 'searxng',
            searxngUrl: baseUrl,
            maxResults: 5
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerCandidates[0].answer, 'Guatemala');
        assert.equal(result.structuredContent.answerCandidates[0].type, 'country');
        assert.ok(result.structuredContent.answerCandidates[0].score >= 60);
        assert.match(result.content[0].text, /Structured answer candidates from search results/);
    });
});

test('web_search falls from failed SearXNG JSON to Firecrawl search provider', async () => {
    const requests = [];
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        requests.push({ method: request.method, pathname: url.pathname });
        if (url.pathname === '/search') {
            response.writeHead(503, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ error: 'searxng unavailable' }));
            return;
        }
        if (url.pathname === '/v1/search') {
            let body = '';
            request.on('data', (chunk) => {
                body += chunk;
            });
            request.on('end', () => {
                const payload = JSON.parse(body);
                assert.match(payload.query, /Crawl4AI|agent/i);
                response.writeHead(200, { 'content-type': 'application/json' });
                response.end(JSON.stringify({
                    success: true,
                    data: [
                        {
                            title: 'Crawl4AI agent web extraction guide',
                            url: 'https://docs.crawl4ai.com/core/quickstart/',
                            description: 'Crawl4AI extracts Markdown for LLM and agent web tasks.'
                        }
                    ]
                }));
            });
            return;
        }
        response.writeHead(404, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ error: 'not found' }));
    }, async (baseUrl) => {
        const result = await webSearch({
            query: 'Crawl4AI agent web extraction guide',
            provider: 'searxng,firecrawl',
            searxngUrl: baseUrl,
            firecrawlUrl: baseUrl,
            maxResults: 5
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.backend, 'firecrawl_search');
        assert.equal(result.structuredContent.attempts[0].backend, 'searxng_json');
        assert.equal(result.structuredContent.attempts[0].ok, false);
        assert.equal(result.structuredContent.attempts[1].backend, 'firecrawl_search');
        assert.equal(result.structuredContent.results[0].url, 'https://docs.crawl4ai.com/core/quickstart/');
        assert.deepEqual(requests.map((item) => item.pathname), ['/search', '/v1/search']);
    });
});

test('web_search aggregates provider chain when the first successful backend is off-target', async () => {
    const requests = [];
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        requests.push({ method: request.method, pathname: url.pathname });
        if (url.pathname === '/search') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                results: [
                    {
                        title: 'Date Calculator : Add to or Subtract From a Date',
                        url: 'https://www.timeanddate.com/date/dateadd.html',
                        content: 'The Date Calculator adds or subtracts days, weeks, months and years.'
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/v1/search') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                success: true,
                data: [
                    {
                        title: 'Crawl4AI agent web extraction guide',
                        url: 'https://docs.crawl4ai.com/core/quickstart/',
                        description: 'Crawl4AI extracts Markdown for LLM agent web tasks and preserves useful links.'
                    }
                ]
            }));
            return;
        }
        response.writeHead(404, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ error: 'not found' }));
    }, async (baseUrl) => {
        const result = await webSearch({
            query: 'Crawl4AI agent web extraction guide',
            provider: 'searxng,firecrawl',
            searxngUrl: baseUrl,
            firecrawlUrl: baseUrl,
            maxResults: 5
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.backend, 'aggregated');
        assert.deepEqual(requests.map((item) => item.pathname), ['/search', '/v1/search']);
        assert.equal(result.structuredContent.results[0].url, 'https://docs.crawl4ai.com/core/quickstart/');
        assert.ok(result.structuredContent.results[0].sourceBackends.includes('firecrawl_search'));
        assert.ok(result.structuredContent.searchAggregation.enabled);
        assert.ok(result.structuredContent.searchAggregation.successfulBackends.includes('searxng_json'));
        assert.ok(result.structuredContent.searchAggregation.successfulBackends.includes('firecrawl_search'));
        assert.equal(result.structuredContent.suggestedNextCalls[0].tool, 'web_fetch');
    });
});

test('web_search Firecrawl backend defaults to local self-hosted service without API keys', async () => {
    const result = await webSearch({
        query: 'local open source web search smoke',
        backends: ['firecrawl_search'],
        maxResults: 3
    });

    assert.equal(result.isError, true);
    assert.equal(result.structuredContent.attempts[0].backend, 'firecrawl_search');
    assert.match(result.structuredContent.attempts[0].url, /^http:\/\/127\.0\.0\.1:3002\/v1\/search/);
    assert.notEqual(result.structuredContent.attempts[0].errorCode, 'missing_firecrawl_api_key');
});

test('web_search Firecrawl backend refuses hosted cloud endpoint in local open-source mode', async () => {
    const result = await webSearch({
        query: 'hosted firecrawl should be disabled',
        backends: ['firecrawl_search'],
        firecrawlUrl: 'https://api.firecrawl.dev',
        maxResults: 3
    });

    assert.equal(result.isError, true);
    assert.equal(result.structuredContent.attempts[0].backend, 'firecrawl_search');
    assert.equal(result.structuredContent.attempts[0].errorCode, 'firecrawl_cloud_disabled');
    assert.match(result.structuredContent.attempts[0].error, /self-hosted Firecrawl/);
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

test('web_search reranks Chinese game guide results ahead of unrelated popular pages', () => {
    const results = [
        {
            title: 'Date Calculator : Add to or Subtract From a Date',
            url: 'https://www.timeanddate.com/date/dateadd.html',
            snippet: 'The Date Calculator adds or subtracts days, weeks, months and years.'
        },
        {
            title: '【绝区零】叶瞬光角色攻略!技能机制|输出手法|配队配装|驱动盘|音擎|毕业面板',
            url: 'https://www.bilibili.com/video/BV1rXBoBoEv1/',
            snippet: '小光攻略来了，白毛红瞳，国风剑仙，更多实用攻略教学。'
        },
        {
            title: '小光游戏解说的个人空间',
            url: 'https://space.bilibili.com/3546657828375410/channel/collectiondetail',
            snippet: '小光游戏解说分享的视频、音频、文章、动态、收藏等内容。'
        }
    ];
    const ranked = rankSearchResultsForFollowup(results, '游戏 小光 角色 攻略 site:bilibili.com');
    const calls = buildSuggestedCallsFromSearchResults(results, {
        query: '游戏 小光 角色 攻略 site:bilibili.com'
    });

    assert.equal(ranked[0].url, 'https://www.bilibili.com/video/BV1rXBoBoEv1/');
    assert.ok(ranked[0].queryScore >= 30);
    assert.ok(ranked[0].queryMatchedTerms.includes('小光'));
    assert.ok(ranked[0].queryMatchedTerms.includes('攻略'));
    assert.deepEqual(ranked[0].queryMatchedSites, ['bilibili.com']);
    assert.equal(calls[0].tool, 'web_fetch');
    assert.equal(calls[0].args.url, 'https://www.bilibili.com/video/BV1rXBoBoEv1/');
});

test('web_search extracts short Chinese guide targets and asks before following ambiguous results', async () => {
    assert.deepEqual(extractShortCjkEntityTerms('做一个小光的攻略'), ['小光']);
    assert.equal(buildEffectiveSearchQuery('做一个小光的攻略'), '小光 攻略');

    const requestedQueries = [];
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        assert.equal(url.pathname, '/search');
        assert.equal(url.searchParams.get('format'), 'json');
        requestedQueries.push(url.searchParams.get('q'));
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({
            results: [
                {
                    title: '【绝区零】叶瞬光角色攻略',
                    url: 'https://www.bilibili.com/video/BV1rXBoBoEv1/',
                    content: '小光攻略，技能机制、输出手法、配队配装、驱动盘和音擎。'
                },
                {
                    title: '《光遇》小光新手攻略',
                    url: 'https://example.com/sky/xiaoguang-guide',
                    content: '光遇小光任务路线、蜡烛和每日玩法攻略。'
                },
                {
                    title: '小光游戏解说的个人空间',
                    url: 'https://space.bilibili.com/3546657828375410/',
                    content: '小光游戏解说分享的视频、文章和动态。'
                }
            ]
        }));
    }, async (baseUrl) => {
        const result = await webSearch({
            query: '做一个小光的攻略',
            provider: 'searxng',
            searxngUrl: baseUrl,
            maxResults: 5
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.backend, 'searxng_json');
        assert.equal(result.structuredContent.backendQuery, '小光 攻略');
        assert.deepEqual(requestedQueries, ['小光 攻略']);
        assert.equal(result.structuredContent.clarificationRequired, true);
        assert.equal(result.structuredContent.searchConfidence.shouldAskUser, true);
        assert.equal(result.structuredContent.searchConfidence.level, 'low');
        assert.equal(result.structuredContent.suggestedNextCalls.length, 0);
        assert.ok(result.structuredContent.candidateChoices.length >= 2);
        assert.match(result.content[0].text, /具体指哪一个|should be clarified/);
    });
});

test('search confidence stays high when a short nickname has explicit game context', () => {
    const ranked = rankSearchResultsForFollowup([
        {
            title: '【绝区零】叶瞬光角色攻略',
            url: 'https://www.bilibili.com/video/BV1rXBoBoEv1/',
            snippet: '小光攻略，技能机制、输出手法、配队配装、驱动盘和音擎。'
        },
        {
            title: '《光遇》小光新手攻略',
            url: 'https://example.com/sky/xiaoguang-guide',
            snippet: '光遇小光任务路线、蜡烛和每日玩法攻略。'
        }
    ], '绝区零 叶瞬光 小光 攻略');
    const confidence = assessSearchConfidence(ranked, '绝区零 叶瞬光 小光 攻略');
    const choices = buildSearchClarificationChoices(ranked, '绝区零 叶瞬光 小光 攻略');

    assert.equal(confidence.clarificationRequired, false);
    assert.equal(confidence.shouldAskUser, false);
    assert.equal(confidence.level, 'high');
    assert.ok(choices.length >= 1);
});

test('web_search does not treat a site match alone as relevant evidence', () => {
    const calls = buildSuggestedCallsFromSearchResults([
        {
            title: '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili',
            url: 'https://www.bilibili.com/',
            snippet: '国内知名的视频弹幕网站，这里有及时的动漫新番和活跃的 ACG 氛围。'
        },
        {
            title: '《流水》管平湖(全版本)_哔哩哔哩_bilibili',
            url: 'https://www.bilibili.com/video/BV1GW41157xT/',
            snippet: '古琴曲集和演奏视频。'
        }
    ], { query: '游戏 小光 角色 攻略 site:bilibili.com' });

    assert.deepEqual(calls, []);
});

test('web_search site-constrained rerank prefers high-signal NGA guide threads', () => {
    const results = [
        {
            title: '《绝区零》官网-3.0全新版本',
            url: 'https://zzz.mihoyo.com/main/',
            snippet: '《绝区零》是米哈游自研的全新都市动作冒险游戏。'
        },
        {
            title: '[强度氵]平民叶瞬光照耀组队讲解大全 Nga玩家社区',
            url: 'https://bbs.nga.cn/read.php?tid=45897738',
            snippet: '平民叶瞬光照耀组队讲解大全，配队和养成讨论。'
        },
        {
            title: '[攻略]V5叶瞬光最佳驱动盘组合 Nga玩家社区',
            url: 'https://bbs.nga.cn/read.php?tid=45766924',
            snippet: '叶瞬光驱动盘组合、配装和队伍建议。'
        }
    ];
    const ranked = rankSearchResultsForFollowup(
        results,
        '绝区零 叶瞬光 小光 完整攻略 技能 配装 配队 site:nga.cn'
    );
    const calls = buildSuggestedCallsFromSearchResults(results, {
        query: '绝区零 叶瞬光 小光 完整攻略 技能 配装 配队 site:nga.cn'
    });

    assert.match(ranked[0].url, /bbs\.nga\.cn/);
    assert.deepEqual(ranked[0].queryMatchedSites, ['nga.cn']);
    assert.ok(ranked[0].queryMatchedTerms.includes('叶瞬光'));
    assert.equal(calls[0].tool, 'web_fetch');
    assert.match(calls[0].args.url, /bbs\.nga\.cn/);
});

test('web_research builds an evidence bundle from search and fetched pages', async () => {
    const requests = [];
    const guideBody = [
        '<h1>莱特 - 绝区零WIKI_BWIKI</h1>',
        '<p>莱特攻略包含技能加点、驱动盘、音擎、配队和养成材料。</p>',
        `<p>${'莱特是一名适合火属性队伍的击破角色，攻略正文提供技能说明、配队建议、驱动盘选择和实战手法。'.repeat(80)}</p>`,
        '<h2>配队建议</h2>',
        '<p>推荐火属性队伍，搭配辅助角色提升输出窗口。</p>'
    ].join('');
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        requests.push(url.pathname);
        if (url.pathname === '/search') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                results: [
                    {
                        title: '莱特 - 绝区零WIKI_BWIKI',
                        url: `http://${request.headers.host}/guide`,
                        content: '莱特攻略，技能加点、驱动盘、音擎、配队和养成材料。'
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/guide') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end(`<html><head><title>莱特攻略</title><meta name="description" content="绝区零莱特养成攻略"></head><body>${guideBody}</body></html>`);
            return;
        }
        response.writeHead(404);
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: '绝区零 莱特 攻略 配队 驱动盘',
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxPages: 1,
            maxCharsPerPage: 12000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.status, 'completed');
        assert.equal(result.structuredContent.answerReadiness, 'ready');
        assert.equal(result.structuredContent.evidencePages.length, 1);
        assert.equal(result.structuredContent.evidencePages[0].url, `${baseUrl}/guide`);
        assert.equal(result.structuredContent.evidencePages[0].evidenceQuality, 'sufficient_evidence');
        assert.equal(result.structuredContent.evidencePages[0].reasoningReady, true);
        assert.ok(result.structuredContent.evidencePages[0].evidenceScore >= 70);
        assert.ok(result.structuredContent.evidencePages[0].evidenceSnippets.length >= 1);
        assert.equal(result.structuredContent.pipelineSteps[0].stage, 'query_plan');
        assert.equal(result.structuredContent.search.searchQueries[0].role, 'original');
        assert.ok(result.structuredContent.evidencePages[0].htmlRelations.sections.some((section) => section.heading === '配队建议'));
        assert.match(result.content[0].text, /AILIS web research evidence bundle/);
        assert.deepEqual(requests, ['/search', '/guide']);
    });
});

test('web_research expands query variants and fetches the high-signal result', async () => {
    const searchQueries = [];
    const fetchedPaths = [];
    const guideBody = [
        '<h1>绝区零莱特攻略</h1>',
        '<p>莱特攻略包含技能机制、配队、驱动盘、音擎和输出手法。</p>',
        `<p>${'莱特是击破角色，攻略正文提供配队思路、驱动盘词条、音擎选择和实战循环。'.repeat(90)}</p>`
    ].join('');
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/search') {
            const query = url.searchParams.get('q') || '';
            searchQueries.push(query);
            response.writeHead(200, { 'content-type': 'application/json' });
            if (/帮我做一个/.test(query)) {
                response.end(JSON.stringify({
                    results: [
                        {
                            title: '莱特咖啡店活动资讯',
                            url: `http://${request.headers.host}/noise`,
                            content: '活动新闻、门店优惠和无关资讯。'
                        }
                    ]
                }));
                return;
            }
            response.end(JSON.stringify({
                results: [
                    {
                        title: '绝区零莱特完整攻略',
                        url: `http://${request.headers.host}/guide`,
                        content: '莱特攻略，技能机制、配队、驱动盘、音擎和输出手法。'
                    }
                ]
            }));
            return;
        }
        fetchedPaths.push(url.pathname);
        if (url.pathname === '/guide') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end(`<html><head><title>绝区零莱特攻略</title></head><body>${guideBody}</body></html>`);
            return;
        }
        if (url.pathname === '/noise') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end('<html><body><p>无关新闻。</p></body></html>');
            return;
        }
        response.writeHead(404);
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: '帮我做一个绝区零 莱特 攻略 配队',
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxSearchQueries: 2,
            maxPages: 1,
            maxCharsPerPage: 12000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerReadiness, 'ready');
        assert.deepEqual(searchQueries, ['帮我做一个绝区零 莱特 攻略 配队', '绝区零 "莱特" 攻略']);
        assert.deepEqual(fetchedPaths, ['/guide']);
        assert.equal(result.structuredContent.search.searchAggregation.queryPlan, true);
        assert.equal(result.structuredContent.search.searchQueries.length, 2);
        assert.equal(result.structuredContent.evidencePages[0].url, `${baseUrl}/guide`);
    });
});

test('web_research exact entity planning preserves specific target terms', async () => {
    const searchQueries = [];
    const guideBody = [
        '<h1>叶瞬光小光完整攻略</h1>',
        '<p>叶瞬光也被玩家称为小光，攻略包含技能机制、驱动盘、音擎、配队和输出手法。</p>',
        `<p>${'叶瞬光的队伍需要围绕核心技能窗口规划输出，驱动盘选择和音擎搭配会影响循环稳定性。'.repeat(90)}</p>`
    ].join('');
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/search') {
            const query = url.searchParams.get('q') || '';
            searchQueries.push(query);
            response.writeHead(200, { 'content-type': 'application/json' });
            if (query.includes('"叶瞬光"') && query.includes('"小光"')) {
                response.end(JSON.stringify({
                    results: [
                        {
                            title: '叶瞬光小光完整攻略',
                            url: `http://${request.headers.host}/xiaoguang-guide`,
                            content: '叶瞬光也叫小光，技能机制、驱动盘、音擎、配队和输出手法攻略。'
                        }
                    ]
                }));
                return;
            }
            response.end(JSON.stringify({
                results: [
                    {
                        title: '《绝区零》官网',
                        url: `http://${request.headers.host}/official-home`,
                        content: '绝区零官方首页，新闻、版本动态和活动公告。'
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/xiaoguang-guide') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end(`<html><head><title>叶瞬光小光完整攻略</title></head><body>${guideBody}</body></html>`);
            return;
        }
        if (url.pathname === '/official-home') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end('<html><body><h1>绝区零官网</h1><p>官方新闻和活动。</p></body></html>');
            return;
        }
        response.writeHead(404);
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: '绝区零 叶瞬光 小光 攻略',
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxSearchQueries: 3,
            maxPages: 1,
            maxCharsPerPage: 12000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerReadiness, 'ready');
        assert.ok(searchQueries.includes('绝区零 "叶瞬光" "小光" 攻略'));
        assert.equal(result.structuredContent.evidencePages[0].url, `${baseUrl}/xiaoguang-guide`);
        assert.equal(result.structuredContent.evidencePages[0].evidenceQuality, 'sufficient_evidence');
    });
});

test('web_research exact-answer planning preserves classification and answer-bearing phrases', async () => {
    const searchQueries = [];
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/search') {
            const query = url.searchParams.get('q') || '';
            searchQueries.push(query);
            response.writeHead(200, { 'content-type': 'application/json' });
            if (query.includes('DDC 633') && query.includes('"unknown language"') && query.includes('"unique flag"')) {
                response.end(JSON.stringify({
                    results: [{
                        title: 'DDC 633 BASE unknown language flag unique country Guatemala answer',
                        url: `http://${request.headers.host}/answer`,
                        content: 'Bielefeld BASE DDC 633 2020 unknown language unique flag country Guatemala.'
                    }]
                }));
                return;
            }
            response.end(JSON.stringify({
                results: [{
                    title: 'Bielefeld University Library BASE',
                    url: `http://${request.headers.host}/broad`,
                    content: 'BASE search portal and library discovery page.'
                }]
            }));
            return;
        }
        if (url.pathname === '/answer') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end('<html><body><h1>Answer</h1><p>Under DDC 633 on Bielefeld University Library BASE as of 2020, the unknown language article with the unique flag was from country Guatemala.</p></body></html>');
            return;
        }
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end('<html><body><h1>BASE</h1><p>General BASE portal page.</p></body></html>');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: "Under DDC 633 on Bielefeld University Library's BASE, as of 2020, from what country was the unknown language article with a flag unique from the others?",
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxSearchQueries: 3,
            maxPages: 1,
            maxCharsPerPage: 12000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.ok(searchQueries.some((query) => query.includes('DDC 633') && query.includes('"unknown language"') && query.includes('"unique flag"')));
        const exactVariant = result.structuredContent.search.searchQueries.find((item) => item.role === 'exact_answer_terms');
        assert.ok(exactVariant);
        assert.match(exactVariant.backendQuery, /DDC 633/);
        assert.doesNotMatch(exactVariant.backendQuery, /^"?under bielefeld university/i);
        assert.equal(result.structuredContent.answerCandidates[0].answer, 'Guatemala');
    });
});

test('web_research does not mark broad source pages ready when target terms are missing', async () => {
    const requests = [];
    const broadBody = [
        '<h1>绝区零 WIKI 首页</h1>',
        '<p>这里包含绝区零新闻、角色索引、版本活动、基础玩法和社区入口。</p>',
        `<p>${'绝区零是一款动作游戏，这个页面介绍游戏背景、官网入口、基础系统和版本动态。'.repeat(120)}</p>`
    ].join('');
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        requests.push(url.pathname);
        if (url.pathname === '/search') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                results: [
                    {
                        title: '绝区零 WIKI 首页',
                        url: `http://${request.headers.host}/broad-wiki`,
                        content: '绝区零新闻、角色索引、版本活动和基础系统。'
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/broad-wiki') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end(`<html><head><title>绝区零 WIKI 首页</title></head><body>${broadBody}</body></html>`);
            return;
        }
        response.writeHead(404);
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: '绝区零 叶瞬光 小光 攻略',
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxSearchQueries: 2,
            maxPages: 1,
            maxCharsPerPage: 12000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerReadiness, 'needs_followup');
        assert.deepEqual(result.structuredContent.evidencePages, []);
        assert.equal(result.structuredContent.search.searchConfidence.level, 'low');
        assert.ok(result.structuredContent.search.searchConfidence.reasons.includes('top_result_missing_specific_target_terms'));
        assert.equal(requests.includes('/broad-wiki'), false);
    });
});

test('web_research diversifies fetch candidates across hosts before retrying one host', async () => {
    const shellServer = http.createServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end('<html><head><title>Loading</title></head><body><div id="root">Loading...</div><script src="/app.js"></script></body></html>');
    });
    const guideServer = http.createServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end([
            '<html><head><title>叶瞬光小光攻略</title></head><body>',
            '<h1>叶瞬光小光完整攻略</h1>',
            '<p>叶瞬光也叫小光，攻略包含技能机制、驱动盘、音擎、配队和输出手法。</p>',
            `<p>${'叶瞬光攻略正文提供配队、驱动盘、音擎、技能机制和输出循环建议。'.repeat(90)}</p>`,
            '</body></html>'
        ].join(''));
    });
    await new Promise((resolve) => shellServer.listen(0, '127.0.0.1', resolve));
    await new Promise((resolve) => guideServer.listen(0, '0.0.0.0', resolve));
    const shellPort = shellServer.address().port;
    const guidePort = guideServer.address().port;
    try {
        await withServer((request, response) => {
            const url = new URL(request.url || '/', 'http://127.0.0.1');
            if (url.pathname === '/search') {
                response.writeHead(200, { 'content-type': 'application/json' });
                response.end(JSON.stringify({
                    results: [
                        {
                            title: '叶瞬光小光攻略 - App Shell 1',
                            url: `http://127.0.0.1:${shellPort}/shell-one`,
                            content: '叶瞬光小光攻略，技能机制、驱动盘、音擎、配队。'
                        },
                        {
                            title: '叶瞬光小光攻略 - App Shell 2',
                            url: `http://127.0.0.1:${shellPort}/shell-two`,
                            content: '叶瞬光小光攻略，技能机制、驱动盘、音擎、配队。'
                        },
                        {
                            title: '叶瞬光小光完整攻略',
                            url: `http://localhost:${guidePort}/guide`,
                            content: '叶瞬光也叫小光，攻略包含技能机制、驱动盘、音擎、配队和输出手法。'
                        }
                    ]
                }));
                return;
            }
            response.writeHead(404);
            response.end('not found');
        }, async (baseUrl) => {
            const result = await webResearch({
                query: '绝区零 叶瞬光 小光 攻略',
                provider: 'searxng',
                fetchProvider: 'builtin',
                searxngUrl: baseUrl,
                maxSearchQueries: 1,
                maxPages: 2,
                maxCharsPerPage: 12000
            });

            assert.equal(result.isError, undefined, result.content[0].text);
            assert.equal(result.structuredContent.answerReadiness, 'ready');
            assert.equal(result.structuredContent.evidencePages.some((page) => page.url === `http://localhost:${guidePort}/guide`), true);
            assert.equal(result.structuredContent.evidencePages.filter((page) => page.url.includes(`127.0.0.1:${shellPort}`)).length, 1);
        });
    } finally {
        await new Promise((resolve) => shellServer.close(resolve));
        await new Promise((resolve) => guideServer.close(resolve));
    }
});

test('web_research reranks fetched pages by evidence score instead of search order', async () => {
    const guideBody = [
        '<h1>星见雅攻略</h1>',
        '<p>星见雅攻略包含技能加点、驱动盘、音擎、配队和输出循环。</p>',
        '<h2>驱动盘</h2>',
        '<p>推荐优先强化核心输出词条，并根据队伍选择暴击、异常或攻击属性。</p>',
        `<p>${'星见雅配队需要兼顾站场输出、增益覆盖和异常积蓄，攻略给出不同队伍的打法。'.repeat(100)}</p>`
    ].join('');
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/search') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                results: [
                    {
                        title: '星见雅攻略 - 加载中',
                        url: `http://${request.headers.host}/shell`,
                        content: '星见雅攻略、驱动盘、配队。'
                    },
                    {
                        title: '星见雅完整攻略',
                        url: `http://${request.headers.host}/guide`,
                        content: '星见雅攻略包含技能加点、驱动盘、音擎、配队和输出循环。'
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/shell') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end('<html><head><title>星见雅攻略</title></head><body><div id="app">Loading...</div><script src="/app.js"></script></body></html>');
            return;
        }
        if (url.pathname === '/guide') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end(`<html><head><title>星见雅完整攻略</title></head><body>${guideBody}</body></html>`);
            return;
        }
        response.writeHead(404);
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: '绝区零 星见雅 攻略 驱动盘 配队',
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxPages: 2,
            maxCharsPerPage: 12000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerReadiness, 'ready');
        assert.equal(result.structuredContent.evidencePages.length, 2);
        assert.equal(result.structuredContent.evidencePages[0].url, `${baseUrl}/guide`);
        assert.equal(result.structuredContent.evidencePages[0].evidenceQuality, 'sufficient_evidence');
        assert.equal(result.structuredContent.evidencePages[1].url, `${baseUrl}/shell`);
        assert.ok(result.structuredContent.evidencePages[0].evidenceScore > result.structuredContent.evidencePages[1].evidenceScore);
    });
});

test('web_research stops before fetching pages when search target is ambiguous', async () => {
    const requests = [];
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        requests.push(url.pathname);
        if (url.pathname === '/search') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                results: [
                    {
                        title: '【绝区零】叶瞬光角色攻略',
                        url: `http://${request.headers.host}/zzz-xiaoguang`,
                        content: '小光攻略，技能机制、输出手法、配队配装、驱动盘和音擎。'
                    },
                    {
                        title: '《光遇》小光新手攻略',
                        url: `http://${request.headers.host}/sky-xiaoguang`,
                        content: '光遇小光任务路线、蜡烛和每日玩法攻略。'
                    }
                ]
            }));
            return;
        }
        response.writeHead(500);
        response.end('web_research should not fetch ambiguous candidates');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: '做一个小光的攻略',
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxPages: 2
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.status, 'clarification_required');
        assert.equal(result.structuredContent.answerReadiness, 'needs_clarification');
        assert.equal(result.structuredContent.evidencePages.length, 0);
        assert.equal(result.structuredContent.search.clarificationRequired, true);
        assert.deepEqual(requests, ['/search']);
    });
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

test('web_research requires audit instead of marking video metadata pages ready', async () => {
    const videoBody = [
        '<html><head><title>【绝区零】叶瞬光 超详细养成攻略教学_攻略</title></head><body>',
        '<nav>首页 番剧 直播 游戏中心 会员购 漫画 赛事 投稿</nav>',
        '<h1>【绝区零】叶瞬光 超详细养成攻略教学</h1>',
        '<p>31.2万 654 2025-12-30 09:37:12 未经作者授权，禁止转载 正在缓冲...</p>',
        '<p>叶瞬光 小光 攻略 绝区零 推荐视频 相关推荐 搜索更多视频。</p>',
        `<section>${'相关推荐 视频播放 弹幕 投稿 收藏 转发 评论。'.repeat(80)}</section>`,
        '</body></html>'
    ].join('');
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/search') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                results: [
                    {
                        title: '【绝区零】叶瞬光 超详细养成攻略教学_攻略',
                        url: `http://${request.headers.host}/video/BV1GevbBxEs8/`,
                        content: '叶瞬光小光攻略视频，技能、驱动盘、音擎、配队。'
                    }
                ]
            }));
            return;
        }
        if (url.pathname === '/video/BV1GevbBxEs8/') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end(videoBody);
            return;
        }
        response.writeHead(404);
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webResearch({
            query: '绝区零 叶瞬光 小光 攻略 技能 配队 音擎 驱动盘',
            provider: 'searxng',
            fetchProvider: 'builtin',
            searxngUrl: baseUrl,
            maxPages: 1,
            maxCharsPerPage: 12000
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.answerReadiness, 'partial');
        assert.equal(result.structuredContent.requiresEvidenceAudit, true);
        assert.match(result.structuredContent.evidenceAuditInstruction, /LLM evidence audit/i);
        assert.equal(result.structuredContent.evidencePages.length, 1);
        assert.equal(result.structuredContent.evidencePages[0].pageType, 'video_page');
        assert.equal(result.structuredContent.evidencePages[0].evidenceQuality, 'metadata_only');
        assert.equal(result.structuredContent.evidencePages[0].reasoningReady, false);
        assert.match(result.structuredContent.evidencePages[0].recoveryHint, /transcript|video-specific|ASR/i);
        assert.match(result.content[0].text, /Retrieval readiness: partial/);
        assert.match(result.content[0].text, /Evidence audit required: true/);
    });
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

test('web_fetch uses Crawl4AI Markdown when configured', async () => {
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/crawl') {
            let body = '';
            request.on('data', (chunk) => {
                body += chunk;
            });
            request.on('end', () => {
                const payload = JSON.parse(body);
                assert.equal(payload.url.endsWith('/guide'), true);
                response.writeHead(200, { 'content-type': 'application/json' });
                response.end(JSON.stringify({
                    markdown: [
                        '# 绝区零 叶瞬光攻略',
                        '',
                        '叶瞬光也被玩家叫作小光。这个攻略覆盖技能机制、输出手法、配队配装、驱动盘和音擎。',
                        '为了让证据足够长，这里继续说明养成优先级、队伍循环、异常积蓄和实战注意事项。',
                        '建议先确认角色定位，再查看[配队详解](/teams)。'
                    ].join('\n')
                }));
            });
            return;
        }
        response.writeHead(500, { 'content-type': 'text/plain' });
        response.end('web_fetch should not hit the original page when Crawl4AI succeeds');
    }, async (baseUrl) => {
        const result = await webFetch({
            url: `${baseUrl}/guide`,
            query: '绝区零 叶瞬光 小光 攻略 配队',
            provider: 'crawl4ai',
            crawl4aiUrl: baseUrl
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.fetchBackend, 'crawl4ai');
        assert.equal(result.structuredContent.contentType, 'text/markdown; charset=utf-8');
        assert.equal(result.structuredContent.crawl4aiAttempt.ok, true);
        assert.equal(result.structuredContent.observedLinkCount, 1);
        assert.match(result.content[0].text, /叶瞬光也被玩家叫作小光/);
    });
});

test('web_fetch can use the local Crawl4AI worker without Docker or HTTP service', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-crawl4ai-worker-'));
    const workerPath = path.join(tempDir, 'fake-crawl4ai-worker.py');
    fs.writeFileSync(workerPath, `
import argparse, json
parser = argparse.ArgumentParser()
parser.add_argument("--url", required=True)
parser.add_argument("--query", default="")
parser.add_argument("--timeout-ms", default="90000")
parser.add_argument("--max-links", default="80")
args = parser.parse_args()
assert args.url.endswith("/guide")
print(json.dumps({
  "ok": True,
  "status": 200,
  "contentType": "text/markdown; charset=utf-8",
  "markdown": "# Local Crawl4AI guide\\n\\nThis page was extracted by the local Crawl4AI worker. It includes target terms and answer evidence.",
  "links": [{"text": "Team details", "url": "/teams"}],
  "metadata": {"title": "Local Crawl4AI guide"}
}, ensure_ascii=False))
`.trim(), 'utf8');

    await withServer((request, response) => {
        response.writeHead(500, { 'content-type': 'text/plain' });
        response.end('web_fetch should not hit the original page when the local Crawl4AI worker succeeds');
    }, async (baseUrl) => {
        const result = await webFetch({
            url: `${baseUrl}/guide`,
            query: 'local Crawl4AI guide target terms',
            provider: 'crawl4ai',
            crawl4aiWorker: workerPath
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.fetchBackend, 'crawl4ai_local');
        assert.equal(result.structuredContent.crawl4aiAttempt.ok, true);
        assert.equal(result.structuredContent.crawl4aiAttempt.mode, 'local_worker');
        assert.equal(result.structuredContent.observedLinkCount, 1);
        assert.match(result.content[0].text, /local Crawl4AI worker/);
    });
});

test('web_fetch Crawl4AI config prefers packaged private web runtime Python', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-web-runtime-'));
    const runtimeDir = path.join(tempDir, 'ailis-web-runtime');
    const workerPath = path.join(tempDir, 'fake-crawl4ai-worker.py');
    const browsersPath = path.join(runtimeDir, 'ms-playwright');
    const venvPython = process.platform === 'win32'
        ? path.join(runtimeDir, 'crawl4ai-venv', 'Scripts', 'python.exe')
        : path.join(runtimeDir, 'crawl4ai-venv', 'bin', 'python');
    fs.mkdirSync(path.dirname(venvPython), { recursive: true });
    fs.mkdirSync(path.dirname(workerPath), { recursive: true });
    fs.mkdirSync(browsersPath, { recursive: true });
    fs.writeFileSync(venvPython, '', 'utf8');
    fs.writeFileSync(workerPath, '', 'utf8');

    const previousRuntimeDir = process.env.AILIS_WEB_RUNTIME_DIR;
    const previousCrawl4aiPython = process.env.AILIS_CRAWL4AI_PYTHON;
    const previousAilisPython = process.env.AILIS_PYTHON;
    const previousAilisPlaywrightBrowsersPath = process.env.AILIS_PLAYWRIGHT_BROWSERS_PATH;
    const previousPlaywrightBrowsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH;
    try {
        process.env.AILIS_WEB_RUNTIME_DIR = runtimeDir;
        delete process.env.AILIS_CRAWL4AI_PYTHON;
        delete process.env.AILIS_PYTHON;
        delete process.env.AILIS_PLAYWRIGHT_BROWSERS_PATH;
        delete process.env.PLAYWRIGHT_BROWSERS_PATH;

        const config = crawl4aiFetchConfig({
            provider: 'crawl4ai',
            crawl4aiWorker: workerPath
        });

        assert.equal(config.mode, 'local_worker');
        assert.equal(path.normalize(config.workerPath), path.normalize(workerPath));
        assert.equal(path.normalize(config.python), path.normalize(venvPython));
        assert.equal(path.normalize(config.playwrightBrowsersPath), path.normalize(browsersPath));
    } finally {
        if (previousRuntimeDir === undefined) delete process.env.AILIS_WEB_RUNTIME_DIR;
        else process.env.AILIS_WEB_RUNTIME_DIR = previousRuntimeDir;
        if (previousCrawl4aiPython === undefined) delete process.env.AILIS_CRAWL4AI_PYTHON;
        else process.env.AILIS_CRAWL4AI_PYTHON = previousCrawl4aiPython;
        if (previousAilisPython === undefined) delete process.env.AILIS_PYTHON;
        else process.env.AILIS_PYTHON = previousAilisPython;
        if (previousAilisPlaywrightBrowsersPath === undefined) delete process.env.AILIS_PLAYWRIGHT_BROWSERS_PATH;
        else process.env.AILIS_PLAYWRIGHT_BROWSERS_PATH = previousAilisPlaywrightBrowsersPath;
        if (previousPlaywrightBrowsersPath === undefined) delete process.env.PLAYWRIGHT_BROWSERS_PATH;
        else process.env.PLAYWRIGHT_BROWSERS_PATH = previousPlaywrightBrowsersPath;
    }
});

test('web_fetch Crawl4AI config can resolve uv-managed packaged Python layout', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-web-runtime-managed-python-'));
    const runtimeDir = path.join(tempDir, 'ailis-web-runtime');
    const workerPath = path.join(tempDir, 'fake-crawl4ai-worker.py');
    const managedPython = process.platform === 'win32'
        ? path.join(runtimeDir, 'python', 'cpython-3.12-windows-x86_64-none', 'python.exe')
        : path.join(runtimeDir, 'python', 'cpython-3.12-linux-x86_64-gnu', 'bin', 'python');
    fs.mkdirSync(path.dirname(managedPython), { recursive: true });
    fs.mkdirSync(path.dirname(workerPath), { recursive: true });
    fs.writeFileSync(managedPython, '', 'utf8');
    fs.writeFileSync(workerPath, '', 'utf8');

    const previousRuntimeDir = process.env.AILIS_WEB_RUNTIME_DIR;
    const previousCrawl4aiPython = process.env.AILIS_CRAWL4AI_PYTHON;
    const previousAilisPython = process.env.AILIS_PYTHON;
    try {
        process.env.AILIS_WEB_RUNTIME_DIR = runtimeDir;
        delete process.env.AILIS_CRAWL4AI_PYTHON;
        delete process.env.AILIS_PYTHON;

        const config = crawl4aiFetchConfig({
            provider: 'crawl4ai',
            crawl4aiWorker: workerPath
        });

        assert.equal(config.mode, 'local_worker');
        assert.equal(path.normalize(config.python), path.normalize(managedPython));
    } finally {
        if (previousRuntimeDir === undefined) delete process.env.AILIS_WEB_RUNTIME_DIR;
        else process.env.AILIS_WEB_RUNTIME_DIR = previousRuntimeDir;
        if (previousCrawl4aiPython === undefined) delete process.env.AILIS_CRAWL4AI_PYTHON;
        else process.env.AILIS_CRAWL4AI_PYTHON = previousCrawl4aiPython;
        if (previousAilisPython === undefined) delete process.env.AILIS_PYTHON;
        else process.env.AILIS_PYTHON = previousAilisPython;
    }
});

test('web_fetch reports local Crawl4AI missing dependency and falls back safely', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-crawl4ai-missing-'));
    const workerPath = path.join(tempDir, 'missing-crawl4ai-worker.py');
    fs.writeFileSync(workerPath, `
import json
print(json.dumps({
  "ok": False,
  "status": 0,
  "errorCode": "crawl4ai_missing_dependency",
  "error": "ModuleNotFoundError: No module named crawl4ai",
  "backend": "crawl4ai_local",
  "installCommands": [
    "python -m pip install -U crawl4ai",
    "python -m playwright install chromium"
  ],
  "recoveryHint": "Install Crawl4AI in the configured Python environment, then retry web_fetch."
}, ensure_ascii=False))
raise SystemExit(2)
`.trim(), 'utf8');

    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end('<html><body><h1>Fallback page</h1><p>Built-in fetch remains available after Crawl4AI dependency failure.</p></body></html>');
    }, async (baseUrl) => {
        const result = await webFetch({
            url: `${baseUrl}/fallback`,
            query: 'Fallback page Crawl4AI dependency failure',
            provider: 'crawl4ai',
            crawl4aiWorker: workerPath
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.notEqual(result.structuredContent.fetchBackend, 'crawl4ai_local');
        assert.equal(result.structuredContent.crawl4aiAttempt.ok, false);
        assert.equal(result.structuredContent.crawl4aiAttempt.errorCode, 'crawl4ai_missing_dependency');
        assert.deepEqual(result.structuredContent.crawl4aiAttempt.installCommands, [
            'python -m pip install -U crawl4ai',
            'python -m playwright install chromium'
        ]);
        assert.match(result.content[0].text, /Built-in fetch remains available/);
    });
});

test('web_fetch falls back to current HTML extraction when Crawl4AI is unavailable', async () => {
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/crawl') {
            response.writeHead(503, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ error: 'crawl4ai unavailable' }));
            return;
        }
        if (url.pathname === '/guide') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end([
                '<html><body>',
                '<h1>绝区零 叶瞬光攻略</h1>',
                '<p>小光攻略包含技能机制、配队配装、驱动盘、音擎和输出手法。</p>',
                '<p>这是 Crawl4AI 不可用时的内置 HTML 抽取 fallback 内容。</p>',
                '</body></html>'
            ].join(''));
            return;
        }
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webFetch({
            url: `${baseUrl}/guide`,
            query: '绝区零 叶瞬光 小光 攻略',
            provider: 'crawl4ai',
            crawl4aiUrl: baseUrl
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.notEqual(result.structuredContent.fetchBackend, 'crawl4ai');
        assert.equal(result.structuredContent.crawl4aiAttempt.ok, false);
        assert.equal(result.structuredContent.crawl4aiAttempt.errorCode, 'http_503');
        assert.match(result.content[0].text, /内置 HTML 抽取 fallback 内容/);
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

test('web_fetch extracts HTML relationship map for model reasoning', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end([
            '<!doctype html>',
            '<html lang="zh-CN">',
            '<head>',
            '<title>绝区零 叶瞬光攻略</title>',
            '<link rel="canonical" href="/guides/ye-shunguang">',
            '<meta name="description" content="叶瞬光抽取建议、驱动盘、配队和技能优先级。">',
            '<script type="application/ld+json">',
            JSON.stringify({
                '@type': 'Article',
                headline: '叶瞬光攻略',
                author: { '@type': 'Person', name: '攻略组' },
                about: { '@type': 'Thing', name: '绝区零' },
                datePublished: '2026-06-19'
            }),
            '</script>',
            '</head>',
            '<body>',
            '<h1>叶瞬光攻略</h1>',
            '<p>叶瞬光适合电属性异常队伍，今天复刻可以抽。</p>',
            '<h2>抽取建议</h2>',
            '<p>如果缺少电属性主C，可以优先考虑。</p>',
            '<a href="/guides/team">配队方案</a>',
            '<dl><dt>角色定位</dt><dd>电属性输出</dd></dl>',
            '<table><caption>养成优先级</caption><tr><th>项目</th><th>建议</th></tr><tr><td>技能</td><td>核心技优先</td></tr></table>',
            '</body></html>'
        ].join(''));
    }, async (baseUrl) => {
        const result = await webFetch({
            url: `${baseUrl}/guide`,
            query: '绝区零 叶瞬光 攻略 配队 技能',
            provider: 'builtin'
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.match(result.content[0].text, /HTML relationship map:/);
        assert.match(result.content[0].text, /Relations:/);
        assert.equal(result.structuredContent.htmlRelations.title, '绝区零 叶瞬光攻略');
        assert.equal(result.structuredContent.htmlRelations.canonicalUrl, `${baseUrl}/guides/ye-shunguang`);
        assert.ok(result.structuredContent.htmlRelations.metadata.some((entry) => entry.name === 'description'));
        assert.ok(result.structuredContent.htmlRelations.sections.some((section) => section.heading === '抽取建议'));
        assert.ok(result.structuredContent.htmlRelations.linkRelations.some((link) => link.url === `${baseUrl}/guides/team`));
        assert.ok(result.structuredContent.htmlRelations.keyValues.some((pair) => pair.key === '角色定位' && pair.value === '电属性输出'));
        assert.ok(result.structuredContent.htmlRelations.tables.some((table) => table.caption === '养成优先级'));
        assert.ok(result.structuredContent.htmlRelations.jsonLdEntities.some((entity) => entity.name === '叶瞬光攻略'));
        assert.ok(result.structuredContent.htmlRelations.relationTriples.some((triple) => triple.predicate === '建议' && triple.object === '核心技优先'));
    });
});

test('stripWikiText preserves MediaWiki infobox convert facts for numeric reasoning', () => {
    const wikiText = [
        '{{Infobox planet',
        '| name = Moon',
        '| periapsis = {{gaps |362 |600}}&nbsp;km<br />({{gaps |356 |400}}-{{gaps |370 |400}}&nbsp;km)',
        '| apoapsis = {{convert|405400|km|mi|abbr=on}}',
        '| orbital_period = {{nowrap|27.321661 d}}',
        '}}',
        'The Moon is Earth\'s only natural satellite.'
    ].join('\n');

    const text = stripWikiText(wikiText);

    assert.match(text, /periapsis:\s*362600 km;\s*\(?356400-370400 km\)?/i);
    assert.match(text, /apoapsis:\s*405400 km/i);
    assert.match(text, /orbital_period:\s*27\.321661 d/i);
});

test('extractWikipediaPageTitle handles canonical and language-variant article paths', () => {
    assert.equal(extractWikipediaPageTitle('https://en.wikipedia.org/wiki/Moon'), 'Moon');
    assert.equal(extractWikipediaPageTitle('https://zh.wikipedia.org/zh-hans/%E6%9C%88%E7%90%83'), '月球');
    assert.equal(extractWikipediaPageTitle('https://zh.wikipedia.org/w/index.php?title=%E6%9C%88%E7%90%83'), '');
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

test('web_fetch classifies JavaScript loading shells as non-evidence', async () => {
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end('<html><body><div id="root">米游社 Loading...</div></body></html>');
    }, async (baseUrl) => {
        const result = await webFetch({ url: `${baseUrl}/zzz/article/59714036` });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.evidenceQuality, 'js_shell');
        assert.equal(result.structuredContent.isEvidence, false);
        assert.equal(result.structuredContent.observationContract.reasoning_ready, false);
        assert.match(result.structuredContent.evidenceGap, /JavaScript loading shell/i);
        assert.match(result.structuredContent.recoveryHint, /Do not refetch/i);
    });
});

test('web_fetch retries rendered Crawl4AI-style extraction after static JavaScript shell', async () => {
    let crawlCalls = 0;
    await withServer((request, response) => {
        const url = new URL(request.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/crawl') {
            crawlCalls += 1;
            request.resume();
            if (crawlCalls === 1) {
                response.writeHead(503, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ error: 'renderer warming up' }));
                return;
            }
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                markdown: [
                    '# 绝区零 叶瞬光小光攻略',
                    '',
                    '叶瞬光也被玩家叫作小光。这个攻略覆盖技能机制、输出手法、配队配装、驱动盘和音擎。',
                    '叶瞬光在绝区零中需要围绕技能循环、资源管理和队伍协同来规划。',
                    '为了让证据足够长，这里继续说明养成优先级、队伍循环、异常积蓄和实战注意事项。'.repeat(80)
                ].join('\n')
            }));
            return;
        }
        if (url.pathname === '/zzz/article/59714036') {
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end('<html><body><div id="root">米游社 Loading...</div><script src="/app.js"></script></body></html>');
            return;
        }
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
    }, async (baseUrl) => {
        const result = await webFetch({
            url: `${baseUrl}/zzz/article/59714036`,
            query: '绝区零 叶瞬光 小光 攻略',
            provider: 'crawl4ai',
            crawl4aiUrl: baseUrl
        });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(crawlCalls, 2);
        assert.equal(result.structuredContent.fetchBackend, 'crawl4ai');
        assert.equal(result.structuredContent.evidenceQuality, 'sufficient_evidence');
        assert.equal(result.structuredContent.renderedFallbackUsed, true);
        assert.equal(result.structuredContent.renderedFallbackTrigger, 'js_shell');
        assert.equal(result.structuredContent.crawl4aiAttempt.ok, false);
        assert.equal(result.structuredContent.crawl4aiAttempt.errorCode, 'http_503');
        assert.equal(result.structuredContent.renderedFallbackAttempt.ok, true);
        assert.match(result.content[0].text, /叶瞬光也被玩家叫作小光/);
    });
});

test('web_fetch repairs common UTF-8 mojibake before evidence classification', async () => {
    const mojibake = Buffer.from('绝区零莱特攻略：技能加点、配队、驱动盘推荐。', 'utf8').toString('latin1');
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html' });
        response.end(`<html><body><article>${mojibake}</article></body></html>`);
    }, async (baseUrl) => {
        const result = await webFetch({ url: `${baseUrl}/guide`, query: '绝区零 莱特 攻略', provider: 'builtin' });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.match(result.content[0].text, /绝区零莱特攻略/);
        assert.equal(result.structuredContent.encodingRepair, 'latin1_to_utf8');
        assert.notEqual(result.structuredContent.evidenceQuality, 'encoding_failure');
    });
});

test('web_fetch marks long relevant HTML text as reasoning-ready evidence', async () => {
    const guideBody = [
        '<h1>莱特 - 绝区零WIKI_BWIKI</h1>',
        '<p>莱特攻略包含技能加点、驱动盘、音擎、配队和养成材料。</p>',
        `<p>${'莱特是一名适合火属性队伍的角色，攻略正文提供技能说明和配队建议。'.repeat(80)}</p>`,
        '<a href="/zzz/other">其他角色</a>'
    ].join('');
    await withServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end(`<html><body>${guideBody}</body></html>`);
    }, async (baseUrl) => {
        const result = await webFetch({ url: `${baseUrl}/zzz/lighter`, query: '绝区零 莱特 攻略 配队 驱动盘' });

        assert.equal(result.isError, undefined, result.content[0].text);
        assert.equal(result.structuredContent.evidenceQuality, 'sufficient_evidence');
        assert.equal(result.structuredContent.isEvidence, true);
        assert.equal(result.structuredContent.complete, true);
        assert.equal(result.structuredContent.reasoningReady, true);
        assert.equal(result.structuredContent.observationContract.reasoning_ready, true);
        assert.equal(result.structuredContent.evidenceGap, '');
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

test('pdf_find_and_extract falls back to full-text HTML when discovered PDFs are unreadable', async () => {
    const htmlText = [
        '<html><body>',
        '<a href="/files/challenge.pdf">Download PDF</a>',
        '<a href="/articles/dragons-are-tricksy">Full text HTML</a>',
        '<article>',
        '<h1>"Dragons are Tricksy": The Uncanny Dragons of Children Literature</h1>',
        '<p>Earlier dragon lore describes guardians and conflicts without the target evidence.</p>',
        '<p>Ruth Stein in 1968 and Margaret Blount in 1974 both comment with distaste on the increasingly cuddly, "fluffy" nature of dragons in children literature.</p>',
        '</article>',
        '</body></html>'
    ].join('');
    await withServer((request, response) => {
        if (request.url === '/paper') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end([
                '<html><body>',
                '<a href="/files/challenge.pdf">PDF</a>',
                '<a href="/articles/dragons-are-tricksy">"Dragons are Tricksy" full text article</a>',
                '</body></html>'
            ].join(''));
            return;
        }
        if (request.url === '/files/challenge.pdf') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end('<html><title>Making sure you are not a bot</title><body>not a PDF file</body></html>');
            return;
        }
        if (request.url === '/articles/dragons-are-tricksy') {
            response.writeHead(200, { 'content-type': 'text/html' });
            response.end(htmlText);
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
        assert.equal(result.structuredContent.htmlFallback, true);
        assert.equal(result.structuredContent.htmlUrl, `${baseUrl}/articles/dragons-are-tricksy`);
        assert.equal(result.structuredContent.answerCandidates[0].answer, 'fluffy');
        assert.match(result.content[0].text, /^HTML answer candidates:/);
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
