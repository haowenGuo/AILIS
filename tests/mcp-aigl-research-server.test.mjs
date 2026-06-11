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
    extractBingResults,
    extractDuckDuckGoHtmlResults,
    extractGenericAnchorResults,
    extractGitHubRepositoryResults,
    githubRepoRead,
    normalizeSearchBackends,
    paperMetadataLookup,
    parseGitHubRepoRef,
    pdfFindAndExtract,
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
        assert.equal(payload.results[0].title, 'Pie Menus or Linear Menus, Which Is Better?');
        assert.equal(payload.results[0].doi, '10.1145/2702613.2732927');
        assert.equal(payload.results[0].authors[0].name, 'Antti Oulasvirta');
        assert.equal(payload.results[0].pdfUrl, 'https://example.org/pie-menus.pdf');
        assert.equal(result.structuredContent.results[0].authors[1].name, 'Jussi Jokinen');
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
        assert.equal(payload.results.length, 1);
        assert.equal(payload.bestMatch.title, 'Mapping human-oriented information to software agents for online systems usage');
        assert.equal(payload.bestMatch.year, 2001);
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
