#!/usr/bin/env node
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');

const SERVER_INFO = { name: 'aigl_research', version: '0.1.0' };
const PROTOCOL_VERSION = '2025-06-18';
const MAX_FETCH_CHARS = 24000;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function clampNumber(value, fallback, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(min, Math.min(Math.round(numeric), max));
}

function readDesktopLlmSettings() {
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const statePath = path.join(appData, 'humanclaw', 'desktop-state.json');
    if (!fsSync.existsSync(statePath)) {
        return null;
    }
    const state = JSON.parse(fsSync.readFileSync(statePath, 'utf8'));
    const preferences = state.preferences || {};
    const apiKey = normalizeString(
        preferences.llmApiKey ||
        process.env.DOUBAO_API_KEY ||
        process.env.ARK_API_KEY ||
        process.env.VOLCENGINE_API_KEY ||
        process.env.OPENAI_COMPATIBLE_API_KEY
    );
    const settings = {
        provider: normalizeString(preferences.llmProvider, 'openai-compatible'),
        baseUrl: normalizeString(preferences.llmBaseUrl, 'https://ark.cn-beijing.volces.com/api/v3'),
        model: normalizeString(preferences.llmModel, 'doubao-seed-2-0-mini-260215'),
        apiKey,
        temperature: 0,
        timeoutMs: 120000
    };
    return settings.baseUrl && settings.model && settings.apiKey ? settings : null;
}

function imageMimeType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
    if (extension === '.webp') return 'image/webp';
    return 'image/png';
}

function send(message) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);
}

function textResult(text, details = {}) {
    const structuredContent = {
        ok: details.ok !== false,
        ...details
    };
    return {
        content: [{ type: 'text', text: normalizeString(text, JSON.stringify(details, null, 2)) }],
        structuredContent,
        details
    };
}

function errorResult(message, details = {}) {
    const structuredContent = {
        ok: false,
        status: 'error',
        error: message,
        ...details
    };
    return {
        content: [{ type: 'text', text: message }],
        isError: true,
        structuredContent,
        details: structuredContent
    };
}

function isPdfContentType(contentType = '') {
    return /application\/pdf|application\/x-pdf/i.test(contentType);
}

function isHtmlContentType(contentType = '') {
    return /text\/html|application\/xhtml\+xml/i.test(contentType);
}

function isReadableTextContentType(contentType = '') {
    if (!contentType) {
        return true;
    }
    return /(^|\b)text\/|application\/(json|xml|javascript|xhtml\+xml)|\+json|\+xml/i.test(contentType);
}

function unsupportedContentTypeResult(toolName, url, fetched = {}, suggestedTools = []) {
    const contentType = fetched.contentType || 'unknown';
    return errorResult(
        `${toolName} only returns readable HTML or text. Unsupported content type: ${contentType}.`,
        {
            status: 'unsupported_content_type',
            errorCode: 'unsupported_content_type',
            tool: toolName,
            url,
            contentType,
            isBinary: Boolean(fetched.isBinary),
            suggestedTools
        }
    );
}

function safeDownloadName(rawUrl = '', fallback = 'download') {
    let basename = fallback;
    try {
        const parsed = new URL(rawUrl);
        basename = path.basename(parsed.pathname) || fallback;
    } catch {}
    basename = basename.replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '') || fallback;
    if (basename.length > 120) {
        const extension = path.extname(basename);
        basename = `${basename.slice(0, 100)}${extension}`;
    }
    return basename;
}

function decodeHtml(value = '') {
    return String(value)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(html = '') {
    return decodeHtml(String(html)
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<\/(p|div|li|tr|h[1-6]|section|article)>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+\n/g, '\n')
        .replace(/\n\s+/g, '\n')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n'))
        .trim();
}

function extractDuckDuckGoResults(html = '', maxResults = 8) {
    const rows = [];
    const linkPattern = /<a\s+rel="nofollow"\s+href="([^"]+)"[^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>[\s\S]*?<td\s+class=['"]result-snippet['"]>([\s\S]*?)<\/td>/gi;
    let match;
    while ((match = linkPattern.exec(html)) && rows.length < maxResults) {
        const href = decodeHtml(match[1]);
        let url = href;
        try {
            const parsed = new URL(href.startsWith('//') ? `https:${href}` : href);
            const uddg = parsed.searchParams.get('uddg');
            if (uddg) {
                url = decodeURIComponent(uddg);
            }
        } catch {
            url = href;
        }
        rows.push({
            title: stripHtml(match[2]).replace(/\s+/g, ' '),
            url,
            snippet: stripHtml(match[3]).replace(/\s+/g, ' ')
        });
    }
    return rows;
}

function extractDuckDuckGoHtmlResults(html = '', maxResults = 8) {
    const rows = [];
    const blockPattern = /<div\b[^>]*class=["'][^"']*\bresult\b[^"']*["'][^>]*>([\s\S]*?)(?=<div\b[^>]*class=["'][^"']*\bresult\b|<\/body>|$)/gi;
    let blockMatch;
    while ((blockMatch = blockPattern.exec(html)) && rows.length < maxResults * 2) {
        const block = blockMatch[1];
        const linkMatch = block.match(/<a\b[^>]*class=["'][^"']*\bresult__a\b[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i) ||
            block.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*class=["'][^"']*\bresult__a\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
        if (!linkMatch) {
            continue;
        }
        const snippetMatch = block.match(/<a\b[^>]*class=["'][^"']*\bresult__snippet\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/i) ||
            block.match(/<div\b[^>]*class=["'][^"']*\bresult__snippet\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
        rows.push({
            title: linkMatch[2],
            url: linkMatch[1],
            snippet: snippetMatch ? snippetMatch[1] : ''
        });
    }
    return dedupeSearchResults(rows, maxResults);
}

function normalizeUrlCandidate(value = '') {
    const url = decodeHtml(String(value || '').trim());
    if (!url) {
        return '';
    }
    try {
        const parsed = new URL(url.startsWith('//') ? `https:${url}` : url);
        const target = parsed.searchParams.get('u') ||
            parsed.searchParams.get('url') ||
            parsed.searchParams.get('uddg');
        if (target) {
            const decodedTarget = decodeSearchRedirectTarget(target);
            return decodedTarget || decodeURIComponent(target);
        }
        return parsed.toString();
    } catch {
        return /^https?:\/\//i.test(url) ? url : '';
    }
}

function decodeSearchRedirectTarget(value = '') {
    const raw = decodeHtml(String(value || '').trim());
    if (!raw) {
        return '';
    }
    const decoded = decodeURIComponent(raw);
    if (/^https?:\/\//i.test(decoded)) {
        return decoded;
    }
    const candidates = [decoded, decoded.replace(/^a1/i, '')];
    for (const candidate of candidates) {
        if (!candidate || candidate.length < 8) {
            continue;
        }
        try {
            const padded = candidate.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(candidate.length / 4) * 4, '=');
            const text = Buffer.from(padded, 'base64').toString('utf8');
            if (/^https?:\/\//i.test(text)) {
                return text;
            }
        } catch {}
    }
    return '';
}

function dedupeSearchResults(results = [], maxResults = 8) {
    const seen = new Set();
    const rows = [];
    for (const result of results) {
        const url = normalizeUrlCandidate(result.url);
        if (!url || seen.has(url)) {
            continue;
        }
        const title = stripHtml(result.title || '').replace(/\s+/g, ' ').trim();
        const snippet = stripHtml(result.snippet || '').replace(/\s+/g, ' ').trim();
        if (!title && !snippet) {
            continue;
        }
        seen.add(url);
        rows.push({ title: title || url, url, snippet });
        if (rows.length >= maxResults) {
            break;
        }
    }
    return rows;
}

function extractGenericAnchorResults(html = '', maxResults = 8) {
    const rows = [];
    const pattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = pattern.exec(html)) && rows.length < maxResults * 8) {
        const url = normalizeUrlCandidate(match[1]);
        const title = stripHtml(match[2]).replace(/\s+/g, ' ').trim();
        if (!url || title.length < 3) {
            continue;
        }
        let host = '';
        try {
            host = new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
        } catch {
            continue;
        }
        if (['bing.com', 'duckduckgo.com', 'google.com', 'microsoft.com'].includes(host) && !/learn\.microsoft\.com/i.test(url)) {
            continue;
        }
        if (/privacy|terms|settings|help|account|login|images|videos|maps/i.test(`${title} ${url}`)) {
            continue;
        }
        rows.push({ title, url, snippet: '' });
    }
    return dedupeSearchResults(rows, maxResults);
}

function extractBingResults(html = '', maxResults = 8) {
    const rows = [];
    const blockPattern = /<li\s+class=["'][^"']*\bb_algo\b[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi;
    let blockMatch;
    while ((blockMatch = blockPattern.exec(html)) && rows.length < maxResults * 2) {
        const block = blockMatch[1];
        const linkMatch = block.match(/<h2[^>]*>\s*<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h2>/i) ||
            block.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
        if (!linkMatch) {
            continue;
        }
        const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i) ||
            block.match(/<div[^>]*class=["'][^"']*\bb_caption\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
        rows.push({
            title: linkMatch[2],
            url: linkMatch[1],
            snippet: snippetMatch ? snippetMatch[1] : ''
        });
    }
    const parsed = dedupeSearchResults(rows, maxResults);
    return parsed.length ? parsed : extractGenericAnchorResults(html, maxResults);
}

function githubQueryTerms(query = '') {
    const stopWords = new Set([
        'site', 'github', 'com', 'official', 'implementation', 'reproduction', 'repository',
        'repo', 'high', 'star', 'starred', 'code', 'with', 'from', 'paper', 'need', 'all', 'you', 'the'
    ]);
    return normalizeGitHubSearchQuery(query)
        .toLowerCase()
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 4 && !stopWords.has(term));
}

function isRelevantGitHubRepository(repo = {}, query = '') {
    const terms = githubQueryTerms(query);
    if (!terms.length) {
        return true;
    }
    const haystack = [
        repo.full_name,
        repo.name,
        repo.description,
        repo.language,
        ...(Array.isArray(repo.topics) ? repo.topics : [])
    ].filter(Boolean).join(' ').toLowerCase();
    const hits = terms.filter((term) => haystack.includes(term));
    const requiredHits = Math.min(2, terms.length);
    return hits.length >= requiredHits;
}

function extractGitHubRepositoryResults(jsonText = '', maxResults = 8, query = '') {
    let payload;
    try {
        payload = JSON.parse(jsonText || '{}');
    } catch {
        return [];
    }
    const items = Array.isArray(payload.items) ? payload.items : [];
    return items.filter((repo) => isRelevantGitHubRepository(repo, query)).slice(0, maxResults).map((repo) => ({
        title: `${repo.full_name || repo.name || 'GitHub repository'}${repo.stargazers_count ? ` (${repo.stargazers_count} stars)` : ''}`,
        url: repo.html_url || '',
        snippet: [
            repo.description || '',
            repo.language ? `Language: ${repo.language}` : '',
            repo.updated_at ? `Updated: ${repo.updated_at}` : ''
        ].filter(Boolean).join(' | ')
    })).filter((item) => item.url);
}

function cleanGitHubRepoName(value = '') {
    return normalizeString(value)
        .replace(/\.git$/i, '')
        .replace(/^\/+|\/+$/g, '');
}

function parseGitHubRepoRef(args = {}) {
    const explicitOwner = normalizeString(args.owner || args.org || args.organization);
    const explicitRepoName = cleanGitHubRepoName(args.repoName || args.repo_name || args.name);
    const repository = normalizeString(args.fullName || args.full_name || args.repository || args.repo);
    let owner = explicitOwner;
    let repo = explicitRepoName;
    let ref = normalizeString(args.ref || args.branch || args.tag);
    let repoPath = normalizeString(args.path || args.file || args.filePath || args.file_path);
    const sourceUrl = normalizeString(args.url || args.htmlUrl || args.html_url || args.repositoryUrl || args.repository_url);

    if ((!owner || !repo) && repository.includes('/')) {
        const parts = repository.replace(/^https?:\/\/github\.com\//i, '').split('/').filter(Boolean);
        owner = owner || normalizeString(parts[0]);
        repo = repo || cleanGitHubRepoName(parts[1]);
    } else if (!repo && repository && !repository.includes('/')) {
        repo = cleanGitHubRepoName(repository);
    }

    if ((!owner || !repo) && sourceUrl) {
        try {
            const parsed = new URL(sourceUrl);
            if (/^github\.com$/i.test(parsed.hostname) || /(^|\.)github\.com$/i.test(parsed.hostname)) {
                const parts = parsed.pathname.split('/').filter(Boolean);
                owner = owner || normalizeString(parts[0]);
                repo = repo || cleanGitHubRepoName(parts[1]);
                const marker = normalizeString(parts[2]).toLowerCase();
                if ((marker === 'blob' || marker === 'tree') && parts[3]) {
                    ref = ref || decodeURIComponent(parts[3]);
                    repoPath = repoPath || parts.slice(4).map((part) => decodeURIComponent(part)).join('/');
                }
            }
        } catch {}
    }

    return {
        owner,
        repo,
        ref,
        path: repoPath.replace(/^\/+/, ''),
        url: sourceUrl
    };
}

function normalizeGitHubSearchQuery(query = '') {
    const normalized = normalizeString(query)
        .replace(/\bsite:github\.com\b/ig, ' ')
        .replace(/\bgithub\b/ig, ' ')
        .replace(/\b\d{4}\.\d{4,5}(?:v\d+)?\b/ig, ' ')
        .replace(/\b(high|star|starred|official|implementation|reproduction|repository|repo)\b/ig, ' ')
        .replace(/(高星|官方|复现|代码仓库|仓库|实现)/g, ' ')
        .replace(/[^\p{L}\p{N}._\-\/ ]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return normalized;
}

function isLikelyGitHubSearch(query = '') {
    return /github\.com|site:github\.com|\bgithub\b|repository|repo|代码仓库|复现代码|implementation|pytorch|tensorflow/i.test(query);
}

const SEARCH_BACKENDS = Object.freeze({
    duckduckgo_lite: Object.freeze({
        id: 'duckduckgo_lite',
        buildUrl: (query) => `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
        extract: extractDuckDuckGoResults
    }),
    duckduckgo_html: Object.freeze({
        id: 'duckduckgo_html',
        buildUrl: (query) => `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
        extract: extractDuckDuckGoHtmlResults
    }),
    bing_html: Object.freeze({
        id: 'bing_html',
        buildUrl: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
        extract: extractBingResults
    }),
    github_repositories: Object.freeze({
        id: 'github_repositories',
        buildUrl: (query) => {
            const normalized = normalizeGitHubSearchQuery(query);
            const q = `${normalized || query} in:name,description,readme`.trim();
            return `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=12`;
        },
        extract: extractGitHubRepositoryResults
    })
});

function normalizeSearchBackends(args = {}, query = '') {
    const raw = Array.isArray(args.backends)
        ? args.backends
        : String(args.backend || args.searchBackend || args.search_backend || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    const requested = raw.length
        ? raw
        : isLikelyGitHubSearch(query)
            ? ['github_repositories', 'duckduckgo_lite', 'duckduckgo_html', 'bing_html']
            : ['bing_html', 'duckduckgo_lite', 'duckduckgo_html'];
    const backends = requested
        .map((id) => SEARCH_BACKENDS[normalizeString(id).toLowerCase()])
        .filter(Boolean);
    return backends.length ? backends : [SEARCH_BACKENDS.bing_html, SEARCH_BACKENDS.duckduckgo_lite, SEARCH_BACKENDS.duckduckgo_html];
}

async function runSearchBackend(backend, query, maxResults, timeoutMs) {
    const startedAt = Date.now();
    const url = backend.buildUrl(query);
    const fetched = await fetchText(url, timeoutMs);
    const durationMs = Date.now() - startedAt;
    if (!fetched.ok) {
        return {
            ok: false,
            backend: backend.id,
            url,
            durationMs,
            status: fetched.status || 0,
            errorCode: fetched.errorCode || (fetched.timedOut ? 'timeout' : 'fetch_failed'),
            error: fetched.error || 'search fetch failed',
            stderr: fetched.stderr || '',
            retryable: true
        };
    }
    const results = backend.extract(fetched.text || '', maxResults, query);
    if (!results.length) {
        return {
            ok: false,
            backend: backend.id,
            url,
            durationMs,
            status: fetched.status || 0,
            errorCode: 'no_results_parsed',
            error: 'Search backend returned a page, but no result rows were parsed.',
            retryable: true
        };
    }
    return {
        ok: true,
        backend: backend.id,
        url,
        durationMs,
        status: fetched.status || 0,
        results
    };
}

async function webSearch(args = {}) {
    const query = normalizeString(args.query || args.q || args.search || args.text);
    if (!query) {
        return errorResult('web_search requires query');
    }
    const maxResults = clampNumber(args.maxResults || args.limit, 8, 1, 12);
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 15000, 5000, 120000);
    const attempts = [];
    for (const backend of normalizeSearchBackends(args, query)) {
        const attempt = await runSearchBackend(backend, query, maxResults, timeoutMs);
        attempts.push(attempt);
        if (!attempt.ok) {
            continue;
        }
        const text = attempt.results.map((item, index) => [
            `${index + 1}. ${item.title}`,
            `URL: ${item.url}`,
            `Snippet: ${item.snippet}`
        ].join('\n')).join('\n\n');
        return textResult(text, {
            status: 'completed',
            query,
            backend: attempt.backend,
            url: attempt.url,
            durationMs: attempt.durationMs,
            attempts,
            results: attempt.results
        });
    }
    return errorResult('web_search failed across all configured search backends', {
        status: 'search_failed',
        errorCode: 'search_backends_failed',
        query,
        retryable: true,
        attempts,
        suggestedTools: ['web_fetch', 'web_extract_links']
    });
}

function githubApiBase(args = {}) {
    return normalizeString(args.apiBaseUrl || args.api_base_url || process.env.AIGL_GITHUB_API_BASE_URL, 'https://api.github.com').replace(/\/+$/g, '');
}

function githubApiPath(pathname = '') {
    return String(pathname || '').split('/').map((part) => encodeURIComponent(part)).join('/');
}

function buildGitHubApiUrl(baseUrl, pathname, query = {}) {
    const url = new URL(`${baseUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`);
    for (const [key, value] of Object.entries(query)) {
        const normalized = normalizeString(value);
        if (normalized) {
            url.searchParams.set(key, normalized);
        }
    }
    return url.toString();
}

function decodeGitHubFileContent(payload = {}) {
    const encoding = normalizeString(payload.encoding, 'base64').toLowerCase();
    const raw = String(payload.content || '').replace(/\s+/g, '');
    if (!raw) {
        return '';
    }
    if (encoding === 'base64') {
        return Buffer.from(raw, 'base64').toString('utf8');
    }
    return raw;
}

async function getGitHubDefaultBranch({ baseUrl, owner, repo, timeoutMs }) {
    const url = buildGitHubApiUrl(baseUrl, `/repos/${githubApiPath(owner)}/${githubApiPath(repo)}`);
    const fetched = await fetchGitHubJson(url, timeoutMs);
    if (!fetched.ok) {
        return { ok: false, error: fetched.error || `GitHub repo metadata HTTP ${fetched.status || 0}`, details: fetched };
    }
    return {
        ok: true,
        branch: normalizeString(fetched.json?.default_branch, 'main'),
        repoUrl: fetched.json?.html_url || `https://github.com/${owner}/${repo}`
    };
}

function formatGitHubFileResult({ owner, repo, mode, ref, path: filePath, url, apiUrl, text, maxChars, originalPath = '' }) {
    const focused = focusTextWindow(text, { query: originalPath || filePath, url, maxChars });
    const header = [
        `Repository: ${owner}/${repo}`,
        `Mode: ${mode}`,
        ref ? `Ref: ${ref}` : '',
        filePath ? `Path: ${filePath}` : '',
        url ? `URL: ${url}` : ''
    ].filter(Boolean).join('\n');
    return textResult(`${header}\n\n${focused.text}`, {
        status: 'completed',
        owner,
        repo,
        mode,
        ref,
        path: filePath,
        url,
        apiUrl,
        originalChars: String(text || '').length,
        returnedChars: focused.text.length,
        focus: focused.focus
    });
}

function githubRawBase(args = {}) {
    return normalizeString(args.rawBaseUrl || args.raw_base_url || process.env.AIGL_GITHUB_RAW_BASE_URL, 'https://raw.githubusercontent.com').replace(/\/+$/g, '');
}

function buildGitHubRawUrl(baseUrl, owner, repo, ref, filePath) {
    return `${baseUrl}/${githubApiPath(owner)}/${githubApiPath(repo)}/${githubApiPath(ref)}/${githubApiPath(filePath)}`;
}

async function fetchGitHubRawTextCandidates({ owner, repo, refs = [], paths = [], maxChars, timeoutMs, args = {} } = {}) {
    const attempts = [];
    const baseUrl = githubRawBase(args);
    for (const ref of refs.map(normalizeString).filter(Boolean)) {
        for (const filePath of paths.map(normalizeString).filter(Boolean)) {
            const url = buildGitHubRawUrl(baseUrl, owner, repo, ref, filePath);
            const fetched = await fetchText(url, timeoutMs);
            attempts.push({
                url,
                ref,
                path: filePath,
                ok: fetched.ok,
                status: fetched.status,
                contentType: fetched.contentType,
                errorCode: fetched.errorCode
            });
            if (!fetched.ok || fetched.isBinary || !isReadableTextContentType(fetched.contentType)) {
                continue;
            }
            const text = String(fetched.text || '').trim();
            if (!text) {
                continue;
            }
            return {
                ok: true,
                ref,
                path: filePath,
                url,
                text: text.slice(0, Math.max(maxChars, 1000)),
                attempts
            };
        }
    }
    return { ok: false, attempts };
}

function extractGitHubTreeLinks(html = '', { owner = '', repo = '', ref = '', path: pathPrefix = '', maxEntries = 120 } = {}) {
    const rows = [];
    const seen = new Set();
    const pattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = pattern.exec(html)) && rows.length < maxEntries * 4) {
        let href = decodeHtml(match[1]);
        if (!href || !href.startsWith('/')) {
            continue;
        }
        href = href.split(/[?#]/)[0];
        const parts = href.split('/').filter(Boolean).map((part) => decodeURIComponent(part));
        if (parts[0] !== owner || parts[1] !== repo || !['blob', 'tree'].includes(parts[2]) || parts[3] !== ref) {
            continue;
        }
        const entryPath = parts.slice(4).join('/');
        if (!entryPath || (pathPrefix && entryPath !== pathPrefix && !entryPath.startsWith(`${pathPrefix}/`))) {
            continue;
        }
        if (seen.has(entryPath)) {
            continue;
        }
        seen.add(entryPath);
        rows.push({
            path: entryPath,
            type: parts[2] === 'tree' ? 'tree' : 'blob',
            url: `https://github.com/${owner}/${repo}/${parts[2]}/${ref}/${entryPath}`
        });
    }
    return rows.slice(0, maxEntries);
}

async function fetchGitHubTreeHtmlFallback({ owner, repo, refs = [], path: treePath = '', maxEntries, timeoutMs } = {}) {
    const attempts = [];
    for (const ref of refs.map(normalizeString).filter(Boolean)) {
        const url = `https://github.com/${githubApiPath(owner)}/${githubApiPath(repo)}/tree/${githubApiPath(ref)}${treePath ? `/${githubApiPath(treePath)}` : ''}`;
        const fetched = await fetchText(url, timeoutMs);
        attempts.push({
            url,
            ref,
            ok: fetched.ok,
            status: fetched.status,
            contentType: fetched.contentType,
            errorCode: fetched.errorCode
        });
        if (!fetched.ok || !isHtmlContentType(fetched.contentType)) {
            continue;
        }
        const entries = extractGitHubTreeLinks(fetched.text, { owner, repo, ref, path: treePath, maxEntries });
        if (entries.length) {
            return { ok: true, ref, url, entries, attempts };
        }
    }
    return { ok: false, attempts };
}

async function githubRepoRead(args = {}) {
    const parsed = parseGitHubRepoRef(args);
    if (!parsed.owner || !parsed.repo) {
        return errorResult('github_repo_read requires repo as owner/repo, owner + repoName, or a github.com repository URL', {
            status: 'invalid_arguments',
            accepted: ['repo: "owner/name"', 'owner + repoName', 'url: "https://github.com/owner/name"']
        });
    }
    const mode = normalizeString(args.mode || args.kind || (parsed.path ? 'file' : 'readme'), 'readme').toLowerCase().replace(/_/g, '-');
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 60000, 5000, 180000);
    const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 120000);
    const maxEntries = clampNumber(args.maxEntries || args.max_entries || args.limit, 120, 1, 1000);
    const baseUrl = githubApiBase(args);
    const owner = parsed.owner;
    const repo = parsed.repo;
    let ref = parsed.ref;
    const fallbackRefs = () => ref ? [ref] : ['main', 'master'];

    if (!['readme', 'tree', 'file'].includes(mode)) {
        return errorResult('github_repo_read mode must be readme, tree, or file', {
            status: 'invalid_arguments',
            mode
        });
    }

    if (mode === 'tree' && !ref) {
        const metadata = await getGitHubDefaultBranch({ baseUrl, owner, repo, timeoutMs });
        if (metadata.ok) {
            ref = metadata.branch;
        }
    }

    if (mode === 'readme') {
        const apiUrl = buildGitHubApiUrl(baseUrl, `/repos/${githubApiPath(owner)}/${githubApiPath(repo)}/readme`, { ref });
        const fetched = await fetchGitHubJson(apiUrl, timeoutMs);
        if (!fetched.ok) {
            const fallback = await fetchGitHubRawTextCandidates({
                owner,
                repo,
                refs: fallbackRefs(),
                paths: parsed.path ? [parsed.path] : ['README.md', 'README.rst', 'README.txt', 'README'],
                maxChars,
                timeoutMs,
                args
            });
            if (fallback.ok) {
                return formatGitHubFileResult({
                    owner,
                    repo,
                    mode,
                    ref: fallback.ref,
                    path: fallback.path,
                    url: fallback.url,
                    apiUrl,
                    text: fallback.text,
                    maxChars
                });
            }
            return errorResult(fetched.error || `GitHub README HTTP ${fetched.status || 0}`, {
                status: 'github_readme_failed',
                owner,
                repo,
                ref,
                apiUrl,
                fallbackAttempts: fallback.attempts,
                ...fetched
            });
        }
        const payload = fetched.json || {};
        const text = decodeGitHubFileContent(payload);
        if (!text.trim()) {
            return errorResult('github_repo_read README returned no readable text', {
                status: 'empty_text',
                owner,
                repo,
                ref,
                apiUrl,
                path: payload.path
            });
        }
        return formatGitHubFileResult({
            owner,
            repo,
            mode,
            ref,
            path: payload.path || 'README',
            url: payload.html_url || `https://github.com/${owner}/${repo}`,
            apiUrl,
            text,
            maxChars
        });
    }

    if (mode === 'file') {
        const filePath = normalizeString(parsed.path);
        if (!filePath) {
            return errorResult('github_repo_read mode=file requires path', {
                status: 'invalid_arguments',
                owner,
                repo,
                ref
            });
        }
        const apiUrl = buildGitHubApiUrl(baseUrl, `/repos/${githubApiPath(owner)}/${githubApiPath(repo)}/contents/${githubApiPath(filePath)}`, { ref });
        const fetched = await fetchGitHubJson(apiUrl, timeoutMs);
        if (!fetched.ok) {
            const fallback = await fetchGitHubRawTextCandidates({
                owner,
                repo,
                refs: fallbackRefs(),
                paths: [filePath],
                maxChars,
                timeoutMs,
                args
            });
            if (fallback.ok) {
                return formatGitHubFileResult({
                    owner,
                    repo,
                    mode,
                    ref: fallback.ref,
                    path: fallback.path,
                    url: fallback.url,
                    apiUrl,
                    text: fallback.text,
                    maxChars,
                    originalPath: filePath
                });
            }
            return errorResult(fetched.error || `GitHub file HTTP ${fetched.status || 0}`, {
                status: 'github_file_failed',
                owner,
                repo,
                ref,
                path: filePath,
                apiUrl,
                fallbackAttempts: fallback.attempts,
                ...fetched
            });
        }
        const payload = fetched.json || {};
        if (Array.isArray(payload)) {
            return errorResult('github_repo_read mode=file received a directory. Use mode=tree for directory listing.', {
                status: 'github_path_is_directory',
                owner,
                repo,
                ref,
                path: filePath,
                apiUrl,
                suggestedTools: ['github_repo_read mode=tree']
            });
        }
        const text = decodeGitHubFileContent(payload);
        if (!text.trim()) {
            return errorResult('github_repo_read file returned no readable text', {
                status: 'empty_text',
                owner,
                repo,
                ref,
                path: filePath,
                apiUrl
            });
        }
        return formatGitHubFileResult({
            owner,
            repo,
            mode,
            ref,
            path: payload.path || filePath,
            url: payload.html_url || `https://github.com/${owner}/${repo}/blob/${ref || 'HEAD'}/${filePath}`,
            apiUrl,
            text,
            maxChars,
            originalPath: filePath
        });
    }

    const treePath = normalizeString(parsed.path).replace(/\/+$/g, '');
    const treeRef = ref || 'main';
    const apiUrl = buildGitHubApiUrl(baseUrl, `/repos/${githubApiPath(owner)}/${githubApiPath(repo)}/git/trees/${encodeURIComponent(treeRef)}`, { recursive: '1' });
    const fetched = await fetchGitHubJson(apiUrl, timeoutMs);
    if (!fetched.ok) {
        const fallback = await fetchGitHubTreeHtmlFallback({
            owner,
            repo,
            refs: fallbackRefs(),
            path: treePath,
            maxEntries,
            timeoutMs
        });
        if (fallback.ok) {
            const lines = fallback.entries.map((entry, index) => `${index + 1}. [${entry.type || 'entry'}] ${entry.path}`);
            return textResult([
                `Repository: ${owner}/${repo}`,
                `Mode: tree`,
                `Ref: ${fallback.ref}`,
                treePath ? `Path filter: ${treePath}` : '',
                `Entries returned: ${fallback.entries.length}`,
                '',
                lines.join('\n')
            ].filter((line) => line !== '').join('\n'), {
                status: 'completed',
                owner,
                repo,
                mode,
                ref: fallback.ref,
                path: treePath,
                apiUrl,
                fallbackUrl: fallback.url,
                fallbackAttempts: fallback.attempts,
                source: 'github_html_tree',
                truncated: false,
                totalEntries: fallback.entries.length,
                returnedEntries: fallback.entries.length,
                entries: fallback.entries
            });
        }
        return errorResult(fetched.error || `GitHub tree HTTP ${fetched.status || 0}`, {
            status: 'github_tree_failed',
            owner,
            repo,
            ref: treeRef,
            apiUrl,
            fallbackAttempts: fallback.attempts,
            ...fetched
        });
    }
    const entries = Array.isArray(fetched.json?.tree) ? fetched.json.tree : [];
    const filtered = entries
        .filter((entry) => entry && typeof entry.path === 'string')
        .filter((entry) => !treePath || entry.path === treePath || entry.path.startsWith(`${treePath}/`))
        .slice(0, maxEntries)
        .map((entry) => ({
            path: entry.path,
            type: entry.type,
            size: typeof entry.size === 'number' ? entry.size : undefined,
            url: entry.url || ''
        }));
    const lines = filtered.map((entry, index) => {
        const size = typeof entry.size === 'number' ? ` (${entry.size} bytes)` : '';
        return `${index + 1}. [${entry.type || 'entry'}] ${entry.path}${size}`;
    });
    const text = lines.length ? lines.join('\n') : `No tree entries found for ${owner}/${repo}${treePath ? ` under ${treePath}` : ''}.`;
    return textResult([
        `Repository: ${owner}/${repo}`,
        `Mode: tree`,
        `Ref: ${treeRef}`,
        treePath ? `Path filter: ${treePath}` : '',
        `Entries returned: ${filtered.length}/${entries.length}`,
        '',
        text
    ].filter((line) => line !== '').join('\n'), {
        status: 'completed',
        owner,
        repo,
        mode,
        ref: treeRef,
        path: treePath,
        apiUrl,
        truncated: entries.length > filtered.length,
        totalEntries: entries.length,
        returnedEntries: filtered.length,
        entries: filtered
    });
}

async function webFetch(args = {}) {
    const url = normalizeString(args.url || args.uri);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('web_fetch requires http(s) url');
    }
    const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 80000);
    const wikiText = await maybeFetchWikipediaWikitext(url, 90000);
    const fetched = wikiText || await fetchText(url, 90000);
    if (!fetched.ok) {
        return errorResult(fetched.error || 'web_fetch fetch failed', { url, stderr: fetched.stderr });
    }
    const contentType = fetched.contentType || '';
    if (isPdfContentType(contentType) || fetched.isPdf || fetched.isBinary || !isReadableTextContentType(contentType)) {
        return unsupportedContentTypeResult('web_fetch', url, fetched, ['pdf_extract_text', 'download_file']);
    }
    const body = fetched.text;
    const text = fetched.kind === 'wikipedia_wikitext'
        ? stripWikiText(body)
        : /html/i.test(contentType) ? stripHtml(body) : body.trim();
    const focused = focusTextWindow(text, {
        query: args.query || args.contains || '',
        url,
        maxChars
    });
    return textResult(focused.text, {
        status: 'completed',
        url,
        contentType,
        originalChars: text.length,
        returnedChars: focused.text.length,
        focus: focused.focus
    });
}

async function webExtractLinks(args = {}) {
    const url = normalizeString(args.url || args.uri);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('web_extract_links requires http(s) url');
    }
    const maxLinks = clampNumber(args.maxLinks || args.max_links || args.limit, 80, 1, 300);
    const fetched = await fetchText(url, args.timeoutMs || 90000);
    if (!fetched.ok) {
        return errorResult(fetched.error || 'web_extract_links fetch failed', { url, stderr: fetched.stderr });
    }
    if ((fetched.contentType && !isHtmlContentType(fetched.contentType)) || fetched.isBinary) {
        return unsupportedContentTypeResult('web_extract_links', url, fetched, ['web_fetch', 'download_file']);
    }
    const links = extractLinksFromHtml(fetched.text, url, maxLinks);
    const text = links.length
        ? links.map((link, index) => `${index + 1}. ${link.text || '(no text)'}\nURL: ${link.url}`).join('\n\n')
        : `No links extracted from: ${url}`;
    return textResult(text, { status: 'completed', url, links });
}

async function downloadFile(args = {}) {
    const url = normalizeString(args.url || args.uri);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('download_file requires http(s) url');
    }
    const outputDir = path.resolve(normalizeString(args.outputDir || args.output_dir, path.join(process.cwd(), 'tmp', 'aigl-research-downloads')));
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.resolve(outputDir, safeDownloadName(url, 'download.bin'));
    if (!outputPath.startsWith(outputDir + path.sep) && outputPath !== outputDir) {
        return errorResult('download_file output path escaped output directory', { url, outputDir, outputPath });
    }
    const code = `
import json, pathlib, requests, sys
url = sys.argv[1]
output_path = pathlib.Path(sys.argv[2])
timeout = float(sys.argv[3])
r = requests.get(url, timeout=timeout, headers={"User-Agent": "AIGLResearchMCP/0.1 (+local assistant research tool)"})
output_path.parent.mkdir(parents=True, exist_ok=True)
if 200 <= r.status_code < 400:
    output_path.write_bytes(r.content)
print(json.dumps({
  "status": r.status_code,
  "content_type": r.headers.get("content-type", ""),
  "content_length": len(r.content),
  "path": str(output_path),
}, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, url, outputPath, String(Math.max(5, Math.ceil((args.timeoutMs || 90000) / 1000)))], {
        timeoutMs: args.timeoutMs || 90000
    });
    if (result.exitCode !== 0) {
        return errorResult('download_file failed', { url, outputPath, stderr: result.stderr.slice(0, 3000) });
    }
    let payload;
    try {
        payload = JSON.parse(result.stdout);
    } catch (error) {
        return errorResult(`download_file invalid payload: ${error.message}`, { url, outputPath, stderr: result.stderr });
    }
    if (!(payload.status >= 200 && payload.status < 400)) {
        return errorResult(`download_file HTTP ${payload.status || 0}`, { url, outputPath, ...payload });
    }
    return textResult(`Downloaded ${url}\nPath: ${payload.path}\nContent-Type: ${payload.content_type}\nBytes: ${payload.content_length}`, {
        status: 'completed',
        url,
        path: payload.path,
        contentType: payload.content_type,
        bytes: payload.content_length
    });
}

async function pdfExtractText(args = {}) {
    const sourceUrl = normalizeString(args.url || args.uri);
    const sourcePath = normalizeString(args.path || args.file || args.filePath || args.file_path);
    if (!sourceUrl && !sourcePath) {
        return errorResult('pdf_extract_text requires url or path');
    }
    if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) {
        return errorResult('pdf_extract_text url must be http(s)', { url: sourceUrl });
    }
    const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 120000);
    const maxPages = clampNumber(args.maxPages || args.max_pages, 24, 1, 300);
    const code = `
import json, os, pathlib, sys, tempfile
source_url = sys.argv[1]
source_path = sys.argv[2]
max_chars = int(sys.argv[3])
max_pages = int(sys.argv[4])
timeout = float(sys.argv[5])
content_type = ""
download_path = ""
path = pathlib.Path(source_path) if source_path else None
if source_url:
    import requests
    r = requests.get(source_url, timeout=timeout, headers={"User-Agent": "AIGLResearchMCP/0.1 (+local assistant research tool)"})
    content_type = r.headers.get("content-type", "")
    if not (200 <= r.status_code < 400):
        print(json.dumps({"ok": False, "status": r.status_code, "error": f"HTTP {r.status_code}", "content_type": content_type}, ensure_ascii=False))
        raise SystemExit(0)
    fd, tmp_name = tempfile.mkstemp(prefix="aigl_pdf_", suffix=".pdf")
    os.close(fd)
    path = pathlib.Path(tmp_name)
    path.write_bytes(r.content)
    download_path = str(path)
if not path or not path.exists():
    print(json.dumps({"ok": False, "error": "pdf path does not exist", "path": str(path or "")}, ensure_ascii=False))
    raise SystemExit(0)
data = path.read_bytes()[:8]
if not data.startswith(b"%PDF"):
    print(json.dumps({"ok": False, "error": "not a PDF file", "path": str(path), "content_type": content_type}, ensure_ascii=False))
    raise SystemExit(0)
engine = ""
pages = 0
parts = []
errors = []
try:
    try:
        from pypdf import PdfReader
        engine = "pypdf"
    except Exception:
        from PyPDF2 import PdfReader
        engine = "PyPDF2"
    reader = PdfReader(str(path))
    pages = len(reader.pages)
    for page in reader.pages[:max_pages]:
        try:
            parts.append(page.extract_text() or "")
        except Exception as exc:
            errors.append(str(exc))
except Exception as exc:
    try:
        import pdfplumber
        engine = "pdfplumber"
        with pdfplumber.open(str(path)) as pdf:
            pages = len(pdf.pages)
            for page in pdf.pages[:max_pages]:
                parts.append(page.extract_text() or "")
    except Exception as second:
        print(json.dumps({
            "ok": False,
            "error": "pdf parser unavailable or extraction failed",
            "parser_errors": [str(exc), str(second)],
            "path": str(path),
            "content_type": content_type,
        }, ensure_ascii=False))
        raise SystemExit(0)
text = "\\n\\n".join(part.strip() for part in parts if part and part.strip())
print(json.dumps({
    "ok": bool(text.strip()),
    "status": "completed" if text.strip() else "empty_text",
    "error": "" if text.strip() else "PDF extraction returned empty text",
    "source_url": source_url,
    "path": str(path),
    "download_path": download_path,
    "content_type": content_type,
    "engine": engine,
    "pages": pages,
    "max_pages": max_pages,
    "original_chars": len(text),
    "text": text[:max_chars],
}, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', [
        '-c',
        code,
        sourceUrl,
        sourcePath,
        String(maxChars),
        String(maxPages),
        String(Math.max(5, Math.ceil((args.timeoutMs || 120000) / 1000)))
    ], {
        timeoutMs: args.timeoutMs || 120000
    });
    if (result.exitCode !== 0) {
        return errorResult('pdf_extract_text failed', { url: sourceUrl, path: sourcePath, stderr: result.stderr.slice(0, 3000) });
    }
    let payload;
    try {
        payload = JSON.parse(result.stdout);
    } catch (error) {
        return errorResult(`pdf_extract_text invalid payload: ${error.message}`, { url: sourceUrl, path: sourcePath, stderr: result.stderr });
    }
    if (!payload.ok) {
        return errorResult(payload.error || 'pdf_extract_text failed', {
            status: payload.status || 'error',
            errorCode: payload.status || 'pdf_extract_failed',
            url: sourceUrl,
            path: sourcePath,
            ...payload
        });
    }
    return textResult(payload.text, {
        status: 'completed',
        source: sourceUrl || sourcePath,
        url: sourceUrl,
        path: payload.path,
        downloadPath: payload.download_path,
        contentType: payload.content_type || 'application/pdf',
        engine: payload.engine,
        pages: payload.pages,
        maxPages: payload.max_pages,
        originalChars: payload.original_chars,
        returnedChars: String(payload.text || '').length
    });
}

function tokenizePdfQuery(value = '') {
    return String(value || '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .split(/\s+/)
        .filter((term) => term.length >= 3)
        .slice(0, 24);
}

const PDF_QUERY_STOPWORDS = new Set([
    'the',
    'and',
    'for',
    'with',
    'from',
    'that',
    'this',
    'what',
    'which',
    'where',
    'when',
    'does',
    'into',
    'onto',
    'enough',
    'maintain',
    'supply',
    'filetype',
    'pdf',
    'article',
    'paper',
    'report'
]);

function significantPdfQueryTerms(value = '') {
    return tokenizePdfQuery(value)
        .filter((term) => !PDF_QUERY_STOPWORDS.has(term))
        .slice(0, 16);
}

function normalizePdfSearchPhrase(value = '') {
    return normalizeString(String(value || '')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/\bfiletype:pdf\b/ig, ' ')
        .replace(/\bsite:[^\s]+/ig, ' ')
        .replace(/\s+/g, ' ')
        .trim());
}

function quoteSearchPhrase(value = '') {
    const phrase = normalizePdfSearchPhrase(value)
        .replace(/^["']+|["']+$/g, '')
        .replace(/"/g, '');
    return phrase ? `"${phrase}"` : '';
}

function buildPdfSearchQueries(query = '') {
    const phrase = normalizePdfSearchPhrase(query);
    if (!phrase) {
        return [];
    }
    const unquoted = phrase.replace(/^["']+|["']+$/g, '');
    const withoutLeadingModal = unquoted.replace(/^(can|could|would|should|will|does|do|did|is|are)\s+/i, '');
    const terms = significantPdfQueryTerms(unquoted);
    const compactTerms = terms.slice(0, 8).join(' ');
    const variants = [
        phrase,
        quoteSearchPhrase(phrase),
        quoteSearchPhrase(withoutLeadingModal),
        `${quoteSearchPhrase(phrase)} pdf`,
        `${quoteSearchPhrase(phrase)} article`,
        `${quoteSearchPhrase(withoutLeadingModal)} pdf`,
        compactTerms,
        compactTerms ? `${compactTerms} pdf` : '',
        compactTerms ? `${compactTerms} journal` : ''
    ];
    const seen = new Set();
    return variants
        .map((item) => normalizeString(item))
        .filter(Boolean)
        .filter((item) => {
            const key = item.toLowerCase();
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        })
        .slice(0, 8);
}

function buildKnownOjsSearchUrls(query = '') {
    const phrase = normalizePdfSearchPhrase(query).replace(/^["']+|["']+$/g, '');
    const terms = significantPdfQueryTerms(phrase);
    const searchText = terms.length ? terms.slice(0, 8).join(' ') : phrase;
    if (!searchText) {
        return [];
    }
    const encoded = encodeURIComponent(searchText);
    return [
        `https://journals.le.ac.uk/index.php/jist/search?query=${encoded}`,
        `https://journals.le.ac.uk/index.php/pst/search?query=${encoded}`
    ];
}

function scoreDocumentSearchResult(result = {}, query = '') {
    const haystack = `${result.title || ''} ${result.snippet || ''} ${result.url || ''}`.toLowerCase();
    const terms = significantPdfQueryTerms(query);
    let score = scorePdfCandidate(result, query);
    let matched = 0;
    for (const term of terms) {
        if (haystack.includes(term)) {
            matched += 1;
            score += 16;
        }
    }
    if (terms.length) {
        score += Math.round((matched / terms.length) * 120);
    }
    if (terms.length >= 4 && matched < 3) {
        score -= 220;
    } else if (terms.length >= 2 && matched === 0) {
        score -= 220;
    }
    if (/canva\.com|dictionary\.com|merriam-webster|cambridge\.org\/dictionary|collinsdictionary|mayoclinic|clevelandclinic|verywellhealth|britannica\.com|amazon\.com|jstor\.org\/?$/i.test(result.url || '')) {
        score -= 180;
    }
    if (/pdf|article\/view|article\/download|download|journal|repository|doi\.org|openalex|crossref/i.test(haystack)) {
        score += 45;
    }
    return score;
}

function pushDocumentSearchResult(candidates, seen, result = {}, query = '', source = '') {
    const url = normalizeString(result.url);
    if (!/^https?:\/\//i.test(url) || seen.has(url)) {
        return;
    }
    const score = scoreDocumentSearchResult(result, query);
    if (score < 45) {
        return;
    }
    seen.add(url);
    candidates.push({
        ...result,
        url,
        source,
        score
    });
}

async function searchDocumentCandidates(query = '', { maxResults = 8, timeoutMs = 60000 } = {}) {
    const queries = buildPdfSearchQueries(query);
    const backends = [
        SEARCH_BACKENDS.bing_html,
        SEARCH_BACKENDS.duckduckgo_lite,
        SEARCH_BACKENDS.duckduckgo_html
    ];
    const seen = new Set();
    const candidates = [];
    const attempts = [];
    const startedAt = Date.now();
    for (const searchQuery of queries) {
        for (const backend of backends) {
            const remainingMs = timeoutMs - (Date.now() - startedAt);
            if (remainingMs < 3000) {
                attempts.push({
                    ok: false,
                    backend: backend.id,
                    query: searchQuery,
                    status: 0,
                    errorCode: 'search_budget_exhausted',
                    error: 'Document search time budget exhausted before this backend could run.',
                    results: []
                });
                return {
                    queries,
                    attempts,
                    results: candidates
                        .sort((a, b) => b.score - a.score)
                        .slice(0, maxResults)
                };
            }
            const attemptTimeoutMs = Math.min(remainingMs, backend.id.startsWith('duckduckgo') ? 10000 : 12000);
            const attempt = await runSearchBackend(backend, searchQuery, maxResults, attemptTimeoutMs);
            attempts.push({
                ...attempt,
                query: searchQuery,
                results: attempt.results || []
            });
            if (!attempt.ok) {
                continue;
            }
            for (const result of attempt.results || []) {
                pushDocumentSearchResult(candidates, seen, result, query, `search:${backend.id}:${searchQuery}`);
            }
            if (candidates.some((candidate) => candidate.score >= 260 && /\/index\.php\/[^/]+\/article\/view\/|\/index\.php\/[^/]+\/article\/download\/|\.pdf(?:$|[?#])/i.test(candidate.url || ''))) {
                return {
                    queries,
                    attempts,
                    results: candidates
                        .sort((a, b) => b.score - a.score)
                        .slice(0, maxResults)
                };
            }
        }
        if (candidates.length >= maxResults * 2) {
            break;
        }
    }
    return {
        queries,
        attempts,
        results: candidates
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults)
    };
}

function pushScholarlyCandidate(rows, seen, candidate = {}, query = '', source = '') {
    const url = normalizeString(candidate.url);
    if (!/^https?:\/\//i.test(url) || seen.has(url)) {
        return;
    }
    const score = scoreDocumentSearchResult(candidate, query);
    if (score < 55) {
        return;
    }
    seen.add(url);
    rows.push({
        ...candidate,
        url,
        score,
        source
    });
}

async function fetchJsonUrl(url, timeoutMs = 30000) {
    const fetched = await fetchText(url, timeoutMs);
    if (!fetched.ok) {
        return { ok: false, error: fetched.error || 'fetch failed', status: fetched.status || 0 };
    }
    try {
        return { ok: true, json: JSON.parse(fetched.text || '{}'), status: fetched.status || 0 };
    } catch (error) {
        return { ok: false, error: `invalid JSON: ${error.message}`, status: fetched.status || 0 };
    }
}

async function searchScholarlyCandidates(query = '', { maxResults = 8, timeoutMs = 60000 } = {}) {
    const phrase = normalizePdfSearchPhrase(query);
    if (!phrase) {
        return { attempts: [], results: [] };
    }
    const startedAt = Date.now();
    const remainingBudgetMs = () => timeoutMs - (Date.now() - startedAt);
    const seen = new Set();
    const results = [];
    const attempts = [];
    const encoded = encodeURIComponent(phrase.replace(/^["']+|["']+$/g, ''));

    const openAlexUrl = `https://api.openalex.org/works?search=${encoded}&per-page=${Math.min(maxResults, 10)}`;
    const openAlex = remainingBudgetMs() >= 3000
        ? await fetchJsonUrl(openAlexUrl, Math.min(remainingBudgetMs(), 20000))
        : { ok: false, status: 0, error: 'scholarly_search_budget_exhausted' };
    attempts.push({ source: 'openalex', url: openAlexUrl, ok: openAlex.ok, status: openAlex.status, error: openAlex.error || '' });
    if (openAlex.ok) {
        for (const work of Array.isArray(openAlex.json?.results) ? openAlex.json.results : []) {
            const title = normalizeString(work.display_name || work.title);
            const snippet = normalizeString(work.primary_location?.source?.display_name || work.type);
            const pdfUrl = normalizeString(work.best_oa_location?.pdf_url || work.primary_location?.pdf_url || work.open_access?.oa_url);
            const landingUrl = normalizeString(work.best_oa_location?.landing_page_url || work.primary_location?.landing_page_url || work.doi || work.id);
            pushScholarlyCandidate(results, seen, { title, snippet, url: pdfUrl }, query, 'openalex:pdf');
            pushScholarlyCandidate(results, seen, { title, snippet, url: landingUrl }, query, 'openalex:landing');
            for (const location of Array.isArray(work.locations) ? work.locations : []) {
                pushScholarlyCandidate(results, seen, {
                    title,
                    snippet: normalizeString(location.source?.display_name || snippet),
                    url: location.pdf_url || location.landing_page_url
                }, query, 'openalex:location');
            }
        }
    }

    const crossrefUrl = `https://api.crossref.org/works?query.title=${encoded}&rows=${Math.min(maxResults, 10)}`;
    const crossref = remainingBudgetMs() >= 3000
        ? await fetchJsonUrl(crossrefUrl, Math.min(remainingBudgetMs(), 20000))
        : { ok: false, status: 0, error: 'scholarly_search_budget_exhausted' };
    attempts.push({ source: 'crossref', url: crossrefUrl, ok: crossref.ok, status: crossref.status, error: crossref.error || '' });
    if (crossref.ok) {
        for (const item of Array.isArray(crossref.json?.message?.items) ? crossref.json.message.items : []) {
            const title = normalizeString(Array.isArray(item.title) ? item.title[0] : item.title);
            const snippet = normalizeString(Array.isArray(item['container-title']) ? item['container-title'][0] : item.publisher);
            pushScholarlyCandidate(results, seen, { title, snippet, url: item.URL }, query, 'crossref:doi');
            const primaryUrl = item.resource?.primary?.URL;
            pushScholarlyCandidate(results, seen, { title, snippet, url: primaryUrl }, query, 'crossref:primary');
            for (const link of Array.isArray(item.link) ? item.link : []) {
                pushScholarlyCandidate(results, seen, {
                    title,
                    snippet: `${snippet} ${link['content-type'] || ''}`,
                    url: link.URL
                }, query, 'crossref:link');
            }
        }
    }

    return {
        attempts,
        results: results.sort((a, b) => b.score - a.score).slice(0, maxResults)
    };
}

function isLikelyPdfUrl(url = '', text = '') {
    const combined = `${url} ${text}`;
    if (/citationstylelanguage\/download/i.test(url)) {
        return false;
    }
    return /\.pdf(?:$|[?#])/i.test(url) ||
        /\/pdf(?:$|[?#/])|article\/download/i.test(url) ||
        (/pdf/i.test(text) && /article\/view|download|file/i.test(combined));
}

function scorePdfCandidate(candidate = {}, query = '') {
    const haystack = `${candidate.url || ''} ${candidate.text || ''} ${candidate.title || ''} ${candidate.snippet || ''}`.toLowerCase();
    const terms = significantPdfQueryTerms(query);
    let score = 0;
    if (/\.pdf(?:$|[?#])/i.test(candidate.url || '')) score += 120;
    if (/article\/download|\/download|download/i.test(candidate.url || '')) score += 80;
    if (/pdf/i.test(haystack)) score += 50;
    if (/citationstylelanguage\/download/i.test(candidate.url || '')) score -= 180;
    if (/full\s*text|article|paper|download/i.test(haystack)) score += 20;
    let matched = 0;
    for (const term of terms) {
        if (haystack.includes(term)) {
            matched += 1;
            score += 8;
        }
    }
    if (terms.length >= 4 && matched < 3) {
        score -= 220;
    } else if (terms.length >= 2 && matched === 0) {
        score -= 180;
    }
    return score;
}

function pushPdfCandidate(candidates, seen, candidate = {}, query = '', source = '') {
    const url = normalizeString(candidate.url);
    if (!/^https?:\/\//i.test(url) || seen.has(url)) {
        return;
    }
    let score = scorePdfCandidate(candidate, query);
    if (Number.isFinite(Number(candidate.score))) {
        score = Math.max(score, Number(candidate.score));
    }
    if (/\/index\.php\/[^/]+\/article\/download\/\d+\/\d+/i.test(url)) {
        score += 260;
    } else if (/\/index\.php\/[^/]+\/article\/download\//i.test(url)) {
        score += 140;
    } else if (/\/index\.php\/[^/]+\/article\/viewFile\//i.test(url)) {
        score += 100;
    } else if (/\/index\.php\/[^/]+\/article\/view\//i.test(url)) {
        score += 80;
    }
    if (/scispace\.com|semanticscholar\.org|facebook\.com/i.test(url)) {
        score -= 180;
    }
    if (source === 'search_result' && score < 45) {
        return;
    }
    seen.add(url);
    candidates.push({
        ...candidate,
        url,
        source,
        score
    });
}

function buildOjsPdfGuesses(pageUrl = '') {
    try {
        const parsed = new URL(pageUrl);
        const match = parsed.pathname.match(/^(.*\/article)\/view\/(\d+)(?:\/(\d+))?/i);
        if (!match) {
            return [];
        }
        const prefix = match[1];
        const articleId = match[2];
        const fileId = match[3];
        const paths = [
            `${prefix}/download/${articleId}`,
            fileId ? `${prefix}/download/${articleId}/${fileId}` : '',
            `${prefix}/viewFile/${articleId}/${fileId || articleId}`
        ].filter(Boolean);
        return paths.map((pathname) => new URL(pathname, parsed.origin).href);
    } catch {
        return [];
    }
}

async function addPdfCandidatesFromUrl({ url, query, candidates, seen, maxLinks, timeoutMs, depth = 0 }) {
    if (isLikelyPdfUrl(url)) {
        pushPdfCandidate(candidates, seen, { url, text: 'direct PDF-like URL' }, query, 'direct_url');
    }
    for (const guess of buildOjsPdfGuesses(url)) {
        pushPdfCandidate(candidates, seen, { url: guess, text: `OJS PDF download guess for ${query}` }, query, 'ojs_guess');
    }

    const fetched = await fetchText(url, timeoutMs);
    if (!fetched.ok) {
        return {
            ok: false,
            url,
            status: fetched.status || 0,
            error: fetched.error || 'fetch failed'
        };
    }
    if (isPdfContentType(fetched.contentType) || fetched.isPdf) {
        pushPdfCandidate(candidates, seen, { url, text: 'PDF content type' }, query, 'content_type');
        return { ok: true, url, kind: 'pdf' };
    }
    if (!isHtmlContentType(fetched.contentType) && fetched.contentType && !isReadableTextContentType(fetched.contentType)) {
        return { ok: false, url, status: fetched.status || 0, error: `unsupported content type: ${fetched.contentType}` };
    }
    const rawLinks = extractLinksFromHtml(fetched.text || '', url, maxLinks)
        .map((link) => ({
            ...link,
            score: scorePdfCandidate(link, query)
        }));
    const links = rawLinks
        .filter((link) => isLikelyPdfUrl(link.url, link.text) || /pdf|full\s*text/i.test(`${link.text} ${link.url}`))
        .sort((a, b) => b.score - a.score);
    for (const link of links) {
        pushPdfCandidate(candidates, seen, link, query, 'page_link');
    }
    if (depth < 2) {
        const articleLinks = rawLinks
            .filter((link) => /\/index\.php\/[^/]+\/article\/view\/\d+|\/article\/view\/\d+|\/article\/abstract\/\d+/i.test(link.url || ''))
            .map((link) => ({
                ...link,
                score: Math.max(link.score, scoreDocumentSearchResult(link, query))
            }))
            .filter((link) => link.score >= 55)
            .sort((a, b) => b.score - a.score);
        for (const link of [...links, ...articleLinks].slice(0, 6)) {
            if (/\.pdf(?:$|[?#])/i.test(link.url) || /article\/download/i.test(link.url)) {
                continue;
            }
            await addPdfCandidatesFromUrl({
                url: link.url,
                query,
                candidates,
                seen,
                maxLinks,
                timeoutMs,
                depth: depth + 1
            });
        }
    }
    return { ok: true, url, kind: 'html', links: links.slice(0, 20) };
}

async function pdfFindAndExtract(args = {}) {
    const sourceUrl = normalizeString(args.url || args.uri || args.pageUrl || args.page_url);
    const titleQuery = normalizeString(args.title || args.documentTitle || args.document_title);
    const freeformQuery = normalizeString(args.query || args.q || args.search || args.text);
    const query = normalizeString(titleQuery || freeformQuery);
    const evidenceQuery = normalizeString(args.extractQuery || args.extract_query || args.contains || freeformQuery || query);
    if (!sourceUrl && !query) {
        return errorResult('pdf_find_and_extract requires url/pageUrl or query');
    }
    if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) {
        return errorResult('pdf_find_and_extract url must be http(s)', { url: sourceUrl });
    }
    const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 120000);
    const maxPages = clampNumber(args.maxPages || args.max_pages, 30, 1, 300);
    const maxCandidates = clampNumber(args.maxCandidates || args.max_candidates, 8, 1, 24);
    const maxLinks = clampNumber(args.maxLinks || args.max_links, 120, 1, 300);
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 120000, 5000, 300000);
    const candidates = [];
    const seen = new Set();
    const discovery = [];
    const attempts = [];
    const attemptedUrls = new Set();
    const startedAt = Date.now();

    function remainingBudgetMs() {
        return timeoutMs - (Date.now() - startedAt);
    }

    async function tryExtractRankedCandidates() {
        const rankedCandidates = candidates
            .sort((a, b) => b.score - a.score)
            .slice(0, maxCandidates);
        for (const candidate of rankedCandidates) {
            if (attemptedUrls.has(candidate.url)) {
                continue;
            }
            const remainingMs = remainingBudgetMs();
            if (remainingMs < 5000) {
                attempts.push({
                    url: candidate.url,
                    source: candidate.source,
                    score: candidate.score,
                    ok: false,
                    status: 'timeout_budget_exhausted',
                    error: 'PDF extraction skipped because pdf_find_and_extract time budget was exhausted.'
                });
                break;
            }
            attemptedUrls.add(candidate.url);
            const extracted = await pdfExtractText({
                url: candidate.url,
                maxChars,
                maxPages,
                timeoutMs: Math.min(timeoutMs, remainingMs)
            });
            attempts.push({
                url: candidate.url,
                source: candidate.source,
                score: candidate.score,
                ok: !extracted.isError,
                status: extracted.details?.status || '',
                error: extracted.isError ? (extracted.details?.error || extracted.content?.[0]?.text || '') : ''
            });
            if (!extracted.isError) {
                const extractedText = extracted.content?.[0]?.text || '';
                const focused = focusTextWindow(extractedText, {
                    query: evidenceQuery || query,
                    url: candidate.url,
                    maxChars
                });
                const evidenceSnippets = buildEvidenceSnippets(focused.text, evidenceQuery || query);
                const returnedText = evidenceSnippets
                    ? [
                        'PDF focused evidence snippets:',
                        evidenceSnippets,
                        '',
                        '--- Extracted text window ---',
                        focused.text
                    ].join('\n')
                    : focused.text;
                return textResult(returnedText, {
                    status: 'completed',
                    query,
                    evidenceQuery,
                    sourceUrl,
                    pdfUrl: candidate.url,
                    candidate,
                    attempts,
                    discovery,
                    engine: extracted.details?.engine,
                    pages: extracted.details?.pages,
                    originalChars: extracted.details?.originalChars,
                    returnedChars: returnedText.length,
                    focus: focused.focus,
                    evidenceSnippets
                });
            }
        }
        return null;
    }

    if (sourceUrl) {
        discovery.push(await addPdfCandidatesFromUrl({ url: sourceUrl, query, candidates, seen, maxLinks, timeoutMs }));
        const extracted = await tryExtractRankedCandidates();
        if (extracted) {
            return extracted;
        }
    }

    if (query) {
        for (const knownOjsUrl of buildKnownOjsSearchUrls(query)) {
            discovery.push(await addPdfCandidatesFromUrl({
                url: knownOjsUrl,
                query,
                candidates,
                seen,
                maxLinks,
                timeoutMs: Math.max(5000, Math.min(remainingBudgetMs(), 30000))
            }));
        }
        const knownOjsExtracted = await tryExtractRankedCandidates();
        if (knownOjsExtracted) {
            return knownOjsExtracted;
        }

        const maxSearchResults = clampNumber(args.maxResults || args.max_results, 8, 1, 12);
        const scholarlyBudgetMs = Math.max(5000, Math.min(30000, remainingBudgetMs() - 5000));
        const scholarly = await searchScholarlyCandidates(query, {
            maxResults: maxSearchResults,
            timeoutMs: scholarlyBudgetMs
        });
        discovery.push({
            ok: true,
            kind: 'scholarly_search',
            query,
            attempts: scholarly.attempts,
            results: scholarly.results
        });
        for (const result of scholarly.results || []) {
            if (isLikelyPdfUrl(result.url, `${result.title || ''} ${result.snippet || ''}`)) {
                pushPdfCandidate(candidates, seen, result, query, 'search_result');
            }
            discovery.push(await addPdfCandidatesFromUrl({
                url: result.url,
                query,
                candidates,
                seen,
                maxLinks,
                timeoutMs: Math.max(5000, Math.min(remainingBudgetMs(), 30000))
            }));
            if (candidates.length >= maxCandidates * 2) {
                break;
            }
        }
        const documentBudgetMs = Math.max(5000, Math.min(45000, remainingBudgetMs() - 5000));
        const search = await searchDocumentCandidates(query, {
            maxResults: maxSearchResults,
            timeoutMs: documentBudgetMs
        });
        discovery.push({
            ok: true,
            kind: 'document_search',
            query,
            queries: search.queries,
            attempts: search.attempts.map((attempt) => ({
                ok: attempt.ok,
                backend: attempt.backend,
                query: attempt.query,
                status: attempt.status,
                durationMs: attempt.durationMs,
                errorCode: attempt.errorCode,
                error: attempt.error,
                resultCount: Array.isArray(attempt.results) ? attempt.results.length : 0
            })),
            results: search.results
        });
        for (const result of search.results || []) {
            if (isLikelyPdfUrl(result.url, `${result.title || ''} ${result.snippet || ''}`)) {
                pushPdfCandidate(candidates, seen, result, query, 'search_result');
            }
            discovery.push(await addPdfCandidatesFromUrl({
                url: result.url,
                query,
                candidates,
                seen,
                maxLinks,
                timeoutMs: Math.max(5000, Math.min(remainingBudgetMs(), 30000))
            }));
            if (candidates.length >= maxCandidates * 2) {
                break;
            }
        }
    }

    const extracted = await tryExtractRankedCandidates();
    if (extracted) {
        return extracted;
    }
    const ranked = candidates
        .sort((a, b) => b.score - a.score)
        .slice(0, maxCandidates);

    return errorResult('pdf_find_and_extract could not find and extract a readable PDF', {
        status: 'not_found',
        query,
        sourceUrl,
        candidates: ranked,
        attempts,
        discovery,
        evidenceGap: 'No high-confidence PDF/article candidate was found or extracted. Try a known article URL, DOI, author name, journal/source name, or a quoted exact title.',
        suggestedTools: ['web_search', 'web_extract_links', 'download_file', 'pdf_extract_text']
    });
}

async function maybeFetchWikipediaWikitext(rawUrl, timeoutMs = 90000) {
    let parsed;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return null;
    }
    if (!/\.wikipedia\.org$/i.test(parsed.hostname) || !parsed.pathname.startsWith('/wiki/')) {
        return null;
    }
    const pageTitle = decodeURIComponent(parsed.pathname.replace(/^\/wiki\//, '')).split('#')[0];
    if (!pageTitle || /Special:|File:|Category:/i.test(pageTitle)) {
        return null;
    }
    const apiUrl = `${parsed.protocol}//${parsed.hostname}/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json`;
    const fetched = await fetchText(apiUrl, timeoutMs);
    if (!fetched.ok) {
        return null;
    }
    try {
        const payload = JSON.parse(fetched.text);
        const text = payload?.parse?.wikitext?.['*'];
        if (!text) {
            return null;
        }
        return {
            ok: true,
            status: fetched.status,
            contentType: 'text/x-wiki',
            kind: 'wikipedia_wikitext',
            text,
            stderr: ''
        };
    } catch {
        return null;
    }
}

function stripWikiText(value = '') {
    return decodeHtml(String(value)
        .replace(/<ref[\s\S]*?<\/ref>/gi, ' ')
        .replace(/<ref[^>]*\/>/gi, ' ')
        .replace(/\{\{[\s\S]*?\}\}/g, ' ')
        .replace(/\[\[File:[^\]]+\]\]/gi, ' ')
        .replace(/\[\[Category:[^\]]+\]\]/gi, ' ')
        .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
        .replace(/\[\[([^\]]+)\]\]/g, '$1')
        .replace(/''+/g, '')
        .replace(/\|-/g, '\n')
        .replace(/^\|[+!]?/gm, '')
        .replace(/^\|/gm, '')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n'))
        .trim();
}

function focusTextWindow(text, { query = '', url = '', maxChars = MAX_FETCH_CHARS } = {}) {
    const normalizedText = String(text || '');
    const terms = [];
    const explicitQuery = normalizeString(query);
    if (explicitQuery) {
        terms.push(explicitQuery);
    }
    try {
        const parsed = new URL(url);
        const hash = decodeURIComponent(parsed.hash || '').replace(/^#/, '').replace(/[_-]+/g, ' ').trim();
        if (hash) {
            terms.push(hash);
        }
    } catch {}
    const lower = normalizedText.toLowerCase();
    let selectedIndex = -1;
    let selectedTerm = '';
    for (const term of terms) {
        const lowerTerm = term.toLowerCase();
        if (!lowerTerm) {
            continue;
        }
        let index = lower.indexOf(lowerTerm);
        while (index >= 0) {
            selectedIndex = index;
            selectedTerm = term;
            index = lower.indexOf(lowerTerm, index + lowerTerm.length);
        }
        if (selectedIndex >= 0) {
            break;
        }
    }
    if (selectedIndex < 0 && explicitQuery) {
        const queryTokens = significantPdfQueryTerms(explicitQuery);
        if (queryTokens.length) {
            const windowSize = Math.min(Math.max(maxChars, 2500), 8000);
            const step = Math.max(500, Math.floor(windowSize / 3));
            let best = { score: 0, index: -1 };
            for (let index = 0; index < lower.length; index += step) {
                const chunk = lower.slice(index, index + windowSize);
                let score = 0;
                for (const token of queryTokens) {
                    const matches = chunk.match(new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'));
                    score += Math.min(matches ? matches.length : 0, 5) * 3;
                }
                if (/\b\d+(?:\.\d+)?\b/.test(chunk) && /volume|capacity|mass|count|number|total|m\^?3|m3/i.test(explicitQuery)) {
                    score += 2;
                }
                if (/(?:m\^?3|m3|𝑚𝑚3|capacity|volume|∴|=)/i.test(chunk) && /volume|capacity|m\^?3|m3/i.test(explicitQuery)) {
                    score += 4;
                }
                if (score > best.score || (score === best.score && score > 0 && index > best.index)) {
                    best = { score, index };
                }
            }
            if (best.index >= 0 && best.score > 0) {
                selectedIndex = best.index;
                selectedTerm = queryTokens.join(' ');
            }
        }
    }
    if (selectedIndex < 0) {
        return {
            text: normalizedText.slice(0, maxChars),
            focus: terms.length ? { mode: 'not_found', terms } : { mode: 'head' }
        };
    }
    const start = Math.max(0, selectedIndex - 900);
    const end = Math.min(normalizedText.length, selectedIndex + maxChars);
    return {
        text: normalizedText.slice(start, end),
        focus: {
            mode: 'window',
            term: selectedTerm,
            start,
            end
        }
    };
}

function buildEvidenceSnippets(text = '', query = '', { maxSnippets = 3 } = {}) {
    const lines = String(text || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    if (!lines.length) {
        return '';
    }
    const queryTokens = significantPdfQueryTerms(query);
    const wantsNumeric = /volume|capacity|mass|count|number|total|m\^?3|m3|value|amount|how many|how much/i.test(query);
    const scored = lines.map((line, index) => {
        const lowerLine = line.toLowerCase();
        let score = 0;
        for (const token of queryTokens) {
            if (lowerLine.includes(token)) {
                score += 4;
            }
        }
        if (wantsNumeric && /\d+(?:\.\d+)?/.test(line)) {
            score += 3;
        }
        if (/(?:m\^?3|m3|𝑚𝑚3|capacity|volume|∴|=)/i.test(line)) {
            score += 4;
        }
        return { line, index, score };
    }).filter((item) => item.score > 0);
    if (!scored.length) {
        return '';
    }
    scored.sort((a, b) => b.score - a.score || a.index - b.index);
    const selectedIndexes = new Set();
    const snippets = [];
    for (const item of scored) {
        if (snippets.length >= maxSnippets) {
            break;
        }
        if (selectedIndexes.has(item.index)) {
            continue;
        }
        const start = Math.max(0, item.index - 2);
        const end = Math.min(lines.length, item.index + 3);
        for (let index = start; index < end; index += 1) {
            selectedIndexes.add(index);
        }
        snippets.push(lines.slice(start, end).join('\n'));
    }
    return snippets.join('\n\n');
}

function extractLinksFromHtml(html = '', baseUrl = '', maxLinks = 80) {
    const links = [];
    const seen = new Set();
    const pattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = pattern.exec(html)) && links.length < maxLinks) {
        let href = decodeHtml(match[1]).trim();
        if (!href || href.startsWith('#') || /^javascript:/i.test(href)) {
            continue;
        }
        try {
            href = new URL(href, baseUrl).href;
        } catch {
            continue;
        }
        if (seen.has(href)) {
            continue;
        }
        seen.add(href);
        links.push({
            url: href,
            text: stripHtml(match[2]).slice(0, 240)
        });
    }
    return links;
}

function runProcess(command, args, options = {}) {
    const timeoutMs = clampNumber(options.timeoutMs, 120000, 1000, 600000);
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd: options.cwd || process.cwd(),
            windowsHide: true,
            shell: false
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            child.kill('SIGKILL');
        }, timeoutMs);
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });
        child.on('close', (exitCode) => {
            clearTimeout(timer);
            resolve({ exitCode, stdout, stderr, timedOut: exitCode === null });
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            resolve({ exitCode: -1, stdout, stderr: stderr || error.message, timedOut: false });
        });
    });
}

async function fetchText(url, timeoutMs = 60000) {
    const code = `
import json, requests, sys
url = sys.argv[1]
timeout = float(sys.argv[2])
r = requests.get(url, timeout=timeout, headers={"User-Agent": "AIGLResearchMCP/0.1 (+local assistant research tool)"})
content = r.content or b""
content_type = r.headers.get("content-type", "")
prefix = content[:16]
is_pdf = content.startswith(b"%PDF") or "application/pdf" in content_type.lower()
has_nul = b"\\x00" in content[:2048]
is_binary = is_pdf or has_nul
text = "" if is_binary else r.text
print(json.dumps({
  "status": r.status_code,
  "content_type": content_type,
  "content_length": len(content),
  "is_pdf": is_pdf,
  "is_binary": is_binary,
  "prefix_hex": prefix.hex(),
  "text": text,
}, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, url, String(Math.max(5, Math.ceil(timeoutMs / 1000)))], { timeoutMs });
    if (result.exitCode !== 0) {
        return {
            ok: false,
            timedOut: result.timedOut === true,
            errorCode: result.timedOut === true ? 'timeout' : 'fetch_process_failed',
            error: `python requests exit ${result.exitCode}`,
            stderr: result.stderr
        };
    }
    let payload;
    try {
        payload = JSON.parse(result.stdout);
    } catch (error) {
        return {
            ok: false,
            error: `invalid requests payload: ${error.message}`,
            stderr: result.stderr
        };
    }
    const status = Number(payload.status || 0);
    const contentType = normalizeString(payload.content_type);
    return {
        ok: status >= 200 && status < 400,
        status,
        errorCode: status >= 200 && status < 400 ? '' : `http_${status || 'unknown'}`,
        contentType,
        contentLength: Number(payload.content_length || 0),
        isPdf: payload.is_pdf === true,
        isBinary: payload.is_binary === true,
        prefixHex: normalizeString(payload.prefix_hex),
        text: String(payload.text || ''),
        stderr: result.stderr,
        error: status ? `HTTP ${status}` : ''
    };
}

async function fetchGitHubJson(url, timeoutMs = 60000) {
    const code = `
import json, os, requests, sys
url = sys.argv[1]
timeout = float(sys.argv[2])
headers = {
    "User-Agent": "AIGLResearchMCP/0.1 (+local assistant research tool)",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
if token:
    headers["Authorization"] = f"Bearer {token}"
r = requests.get(url, timeout=timeout, headers=headers)
print(json.dumps({
  "status": r.status_code,
  "content_type": r.headers.get("content-type", ""),
  "rate_limit_remaining": r.headers.get("x-ratelimit-remaining", ""),
  "rate_limit_reset": r.headers.get("x-ratelimit-reset", ""),
  "text": r.text,
}, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, url, String(Math.max(5, Math.ceil(timeoutMs / 1000)))], { timeoutMs });
    if (result.exitCode !== 0) {
        return {
            ok: false,
            timedOut: result.timedOut === true,
            status: 0,
            errorCode: result.timedOut === true ? 'timeout' : 'github_fetch_process_failed',
            error: `python requests exit ${result.exitCode}`,
            stderr: result.stderr
        };
    }
    let payload;
    try {
        payload = JSON.parse(result.stdout);
    } catch (error) {
        return {
            ok: false,
            status: 0,
            errorCode: 'invalid_github_requests_payload',
            error: `invalid GitHub requests payload: ${error.message}`,
            stderr: result.stderr
        };
    }
    let json;
    try {
        json = JSON.parse(payload.text || '{}');
    } catch (error) {
        return {
            ok: false,
            status: Number(payload.status || 0),
            contentType: normalizeString(payload.content_type),
            errorCode: 'invalid_github_json',
            error: `GitHub API returned non-JSON response: ${error.message}`,
            text: String(payload.text || '').slice(0, 1000),
            stderr: result.stderr
        };
    }
    const status = Number(payload.status || 0);
    const message = normalizeString(json?.message);
    return {
        ok: status >= 200 && status < 400,
        status,
        contentType: normalizeString(payload.content_type),
        rateLimitRemaining: normalizeString(payload.rate_limit_remaining),
        rateLimitReset: normalizeString(payload.rate_limit_reset),
        json,
        text: payload.text || '',
        errorCode: status >= 200 && status < 400 ? '' : `github_http_${status || 'unknown'}`,
        error: status >= 200 && status < 400 ? '' : message || `GitHub API HTTP ${status || 0}`,
        stderr: result.stderr
    };
}

async function runPythonFile(args = {}) {
    const filePath = path.resolve(normalizeString(args.path || args.file || args.filePath || args.file_path));
    const stat = filePath ? await fs.stat(filePath).catch(() => null) : null;
    if (!stat || !stat.isFile()) {
        return errorResult('run_python_file requires an existing path', { path: filePath });
    }
    const result = await runProcess('python', [filePath], {
        cwd: path.dirname(filePath),
        timeoutMs: args.timeoutMs || 120000
    });
    const text = [
        result.stdout ? `STDOUT:\n${result.stdout.trim()}` : '',
        result.stderr ? `STDERR:\n${result.stderr.trim()}` : ''
    ].filter(Boolean).join('\n\n') || `exitCode=${result.exitCode}`;
    return {
        ...textResult(text, { status: result.exitCode === 0 ? 'completed' : 'error', ...result }),
        isError: result.exitCode !== 0
    };
}

async function readSpreadsheet(args = {}) {
    const filePath = path.resolve(normalizeString(args.path || args.file || args.filePath || args.file_path));
    const maxRows = clampNumber(args.maxRows || args.max_rows, 80, 1, 500);
    const code = `
import json, sys, pandas as pd
path = sys.argv[1]
max_rows = int(sys.argv[2])
df = pd.read_excel(path) if path.lower().endswith(('.xlsx', '.xls')) else pd.read_csv(path)
numeric = df.select_dtypes(include="number")
payload = {
  "shape": list(df.shape),
  "columns": [str(c) for c in df.columns],
  "rows": df.head(max_rows).where(pd.notnull(df), None).to_dict(orient="records"),
  "numeric_sums": {str(k): float(v) for k, v in numeric.sum(numeric_only=True).items()},
  "total_numeric_sum": float(numeric.to_numpy().sum()) if len(numeric.columns) else 0.0,
}
print(json.dumps(payload, ensure_ascii=False, default=str))
`.trim();
    const result = await runProcess('python', ['-c', code, filePath, String(maxRows)], {
        cwd: path.dirname(filePath),
        timeoutMs: args.timeoutMs || 120000
    });
    if (result.exitCode !== 0) {
        return errorResult('read_spreadsheet failed', { path: filePath, stderr: result.stderr });
    }
    return textResult(result.stdout.trim(), { status: 'completed', path: filePath });
}

async function readPresentation(args = {}) {
    const filePath = path.resolve(normalizeString(args.path || args.file || args.filePath || args.file_path));
    const maxSlides = clampNumber(args.maxSlides || args.max_slides, 120, 1, 500);
    const query = normalizeString(args.query || args.contains || '');
    const stat = filePath ? await fs.stat(filePath).catch(() => null) : null;
    if (!stat || !stat.isFile()) {
        return errorResult('read_presentation requires an existing ppt/pptx file path', { path: filePath });
    }
    const code = `
import json, sys
from pptx import Presentation

path = sys.argv[1]
max_slides = int(sys.argv[2])
query = sys.argv[3].lower().strip()
prs = Presentation(path)
slides = []

for index, slide in enumerate(prs.slides, 1):
    if index > max_slides:
        break
    pieces = []
    shapes = []
    for shape in slide.shapes:
        shape_pieces = []
        text = getattr(shape, "text", "") or ""
        if text.strip():
            shape_pieces.append(text.strip())
        try:
            if getattr(shape, "has_table", False):
                for row in shape.table.rows:
                    row_text = " | ".join((cell.text or "").strip() for cell in row.cells)
                    if row_text.strip():
                        shape_pieces.append(row_text.strip())
        except Exception:
            pass
        try:
            for node in shape.element.xpath(".//p:cNvPr"):
                alt = " ".join(filter(None, [node.get("title") or "", node.get("descr") or ""]))
                if alt.strip():
                    shape_pieces.append(alt.strip())
        except Exception:
            pass
        clean = "\\n".join(dict.fromkeys(item for item in shape_pieces if item))
        if clean:
            shapes.append({"shape_id": getattr(shape, "shape_id", None), "name": getattr(shape, "name", ""), "text": clean})
            pieces.append(clean)
    slide_text = "\\n".join(pieces)
    slides.append({
        "slide_number": index,
        "text": slide_text,
        "matches_query": bool(query and query in slide_text.lower()),
        "shapes": shapes
    })

payload = {
    "path": path,
    "total_slides": len(prs.slides),
    "returned_slides": len(slides),
    "query": query,
    "matching_slides": [slide["slide_number"] for slide in slides if slide["matches_query"]],
    "slides": slides
}
print(json.dumps(payload, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, filePath, String(maxSlides), query], {
        cwd: path.dirname(filePath),
        timeoutMs: args.timeoutMs || 120000
    });
    if (result.exitCode !== 0) {
        return errorResult('read_presentation failed', { path: filePath, stderr: result.stderr.slice(0, 3000) });
    }
    const text = normalizeString(result.stdout);
    return textResult(text, { status: 'completed', path: filePath });
}

async function transcribeAudio(args = {}) {
    const filePath = path.resolve(normalizeString(args.path || args.file || args.filePath || args.file_path));
    const model = normalizeString(args.model, 'base');
    const code = `
import json, os, sys, whisper
try:
    import imageio_ffmpeg
    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
    if ffmpeg_path:
        os.environ["PATH"] = os.path.dirname(ffmpeg_path) + os.pathsep + os.environ.get("PATH", "")
        import numpy as np
        import whisper.audio as whisper_audio
        from subprocess import CalledProcessError, run
        def load_audio_with_explicit_ffmpeg(file, sr=whisper_audio.SAMPLE_RATE):
            cmd = [
                ffmpeg_path,
                "-nostdin",
                "-threads", "0",
                "-i", file,
                "-f", "s16le",
                "-ac", "1",
                "-acodec", "pcm_s16le",
                "-ar", str(sr),
                "-"
            ]
            try:
                out = run(cmd, capture_output=True, check=True).stdout
            except CalledProcessError as exc:
                raise RuntimeError(f"Failed to load audio: {exc.stderr.decode()}") from exc
            return np.frombuffer(out, np.int16).flatten().astype(np.float32) / 32768.0
        whisper_audio.load_audio = load_audio_with_explicit_ffmpeg
except Exception:
    pass
path = sys.argv[1]
model_name = sys.argv[2]
model = whisper.load_model(model_name)
result = model.transcribe(path)
print(json.dumps({"text": result.get("text", ""), "language": result.get("language", "")}, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, filePath, model], {
        cwd: path.dirname(filePath),
        timeoutMs: args.timeoutMs || 300000
    });
    if (result.exitCode !== 0) {
        return errorResult('transcribe_audio failed', { path: filePath, stderr: result.stderr.slice(0, 2000) });
    }
    return textResult(result.stdout.trim(), { status: 'completed', path: filePath, model });
}

async function describeImage(args = {}) {
    const filePath = path.resolve(normalizeString(args.path || args.file || args.filePath || args.file_path || args.imagePath || args.image_path));
    const stat = filePath ? await fs.stat(filePath).catch(() => null) : null;
    if (!stat || !stat.isFile()) {
        return errorResult('describe_image requires an existing image path', { path: filePath });
    }
    const settings = readDesktopLlmSettings();
    if (!settings) {
        return errorResult('describe_image requires local LLM settings with vision support', { path: filePath });
    }
    const question = normalizeString(args.question || args.prompt, 'Describe the image and answer any visible question.');
    const maxChars = clampNumber(args.maxChars || args.max_chars, 4000, 500, 12000);
    const imageBytes = await fs.readFile(filePath);
    const payload = {
        temperature: 0,
        timeoutMs: args.timeoutMs || 180000,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: question },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:${imageMimeType(filePath)};base64,${imageBytes.toString('base64')}`
                        }
                    }
                ]
            }
        ]
    };
    let response = await callDesktopLlmProvider(settings, payload);
    if (!response.ok && response.code === 'timeout') {
        response = await callDesktopLlmProvider(settings, {
            ...payload,
            timeoutMs: Math.max(Number(args.timeoutMs) || 180000, 240000)
        });
    }
    if (!response.ok) {
        return errorResult('describe_image failed', {
            path: filePath,
            status: response.code || 'vision_model_error',
            error: response.error || ''
        });
    }
    return textResult(response.content.slice(0, maxChars), {
        status: 'completed',
        path: filePath,
        model: response.model
    });
}

async function youtubeTranscript(args = {}) {
    const url = normalizeString(args.url || args.videoUrl || args.video_url);
    if (!/^https?:\/\//i.test(url) || !/youtu\.be|youtube\.com/i.test(url)) {
        return errorResult('youtube_transcript requires a YouTube URL');
    }
    const language = normalizeString(args.language || args.lang, 'en');
    const maxChars = clampNumber(args.maxChars || args.max_chars, 12000, 1000, 60000);
    const code = `
import json, re, sys, requests, yt_dlp
url = sys.argv[1]
language = sys.argv[2]
max_chars = int(sys.argv[3])
ydl_opts = {"quiet": True, "skip_download": True, "noplaylist": True}
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(url, download=False)
def pick_caption(captions):
    if not captions:
        return None
    keys = list(captions.keys())
    preferred = [language, language.split("-")[0], "en", "en-US", "en-GB"]
    for key in preferred:
        if key in captions:
            return captions[key]
    for key in keys:
        if key.startswith(language.split("-")[0]):
            return captions[key]
    return captions[keys[0]]
tracks = pick_caption(info.get("subtitles")) or pick_caption(info.get("automatic_captions"))
track = None
if tracks:
    for item in tracks:
        if item.get("ext") in ("vtt", "srv3", "ttml", "json3"):
            track = item
            break
    track = track or tracks[0]
transcript = ""
if track and track.get("url"):
    text = requests.get(track["url"], timeout=60).text
    if track.get("ext") == "json3":
        payload = json.loads(text)
        parts = []
        for event in payload.get("events", []):
            segs = event.get("segs") or []
            parts.append("".join(seg.get("utf8", "") for seg in segs))
        transcript = " ".join(parts)
    else:
        lines = []
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("WEBVTT") or "-->" in line or re.match(r"^\\d+$", line):
                continue
            line = re.sub(r"<[^>]+>", "", line)
            lines.append(line)
        transcript = " ".join(lines)
    transcript = re.sub(r"\\s+", " ", transcript).strip()
payload = {
    "title": info.get("title", ""),
    "duration": info.get("duration"),
    "uploader": info.get("uploader", ""),
    "description": (info.get("description") or "")[:2000],
    "transcript_language": track.get("name") if track else "",
    "transcript": transcript[:max_chars]
}
print(json.dumps(payload, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, url, language, String(maxChars)], {
        timeoutMs: args.timeoutMs || 240000
    });
    if (result.exitCode !== 0) {
        return errorResult('youtube_transcript failed', { url, stderr: result.stderr.slice(0, 3000) });
    }
    return textResult(result.stdout.trim(), { status: 'completed', url });
}

const TOOLS = [
    {
        name: 'web_search',
        description: 'Search the public web for evidence through AIGL managed search backends. Standard call: { "query": "specific search keywords", "maxResults": 5 }. Use web_fetch for a known HTML/text URL, pdf_extract_text for a known PDF URL, and github_repo_read for GitHub README/tree/file evidence. General web queries default to Bing first; GitHub/code repository queries default to GitHub repository search first, then DuckDuckGo, then Bing. Returns titles, URLs, snippets, and structured backend attempts.',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Required search keywords. Prefer this field over q/search/text. Example: "Playwright wait for selector timeout official docs".' },
                q: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                search: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                text: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                maxResults: { type: 'number', description: 'Requested result count, clamped to 1-12. Use 3-8 for normal tasks.' },
                limit: { type: 'number', description: 'Compatibility alias for maxResults. Prefer maxResults.' },
                timeoutMs: { type: 'number', description: 'Per-backend timeout in milliseconds, clamped to 5000-120000. Default is 15000. Omit unless a task needs a longer wait.' },
                backend: { type: 'string', description: 'Optional backend id: bing_html, duckduckgo_lite, duckduckgo_html, or github_repositories. Omit for automatic fallback.' },
                backends: {
                    type: 'array',
                    items: { type: 'string', enum: ['bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'github_repositories'] },
                    description: 'Optional ordered backend ids. Omit for automatic fallback.'
                }
            }
        }
    },
    {
        name: 'github_repo_read',
        description: 'Read evidence from a public GitHub repository after search finds a repo. Use mode=readme for README, mode=tree for repository file map, and mode=file with path for a specific source/docs/config file. This reads repository contents through the GitHub API; it is not a web search, browser, or git clone tool.',
        inputSchema: {
            type: 'object',
            properties: {
                repo: { type: 'string', description: 'Repository full name, for example "microsoft/playwright". Prefer this when known.' },
                repository: { type: 'string', description: 'Compatibility alias for repo.' },
                owner: { type: 'string', description: 'Repository owner when repoName is provided separately.' },
                repoName: { type: 'string', description: 'Repository name when owner is provided separately.' },
                url: { type: 'string', description: 'GitHub repository, tree, or blob URL. Example: https://github.com/microsoft/playwright/blob/main/README.md.' },
                mode: { type: 'string', enum: ['readme', 'tree', 'file'], description: 'readme returns README text; tree returns file paths; file returns one specific file. Defaults to file when path is present, otherwise readme.' },
                path: { type: 'string', description: 'Repository-relative path. Required for mode=file; optional filter for mode=tree.' },
                ref: { type: 'string', description: 'Branch, tag, or commit SHA. Omit to use GitHub default for readme/file; tree resolves default branch when omitted.' },
                branch: { type: 'string', description: 'Compatibility alias for ref.' },
                maxChars: { type: 'number', description: 'Maximum text chars for readme/file, clamped to 1000-120000.' },
                maxEntries: { type: 'number', description: 'Maximum tree entries for mode=tree, clamped to 1-1000.' },
                timeoutMs: { type: 'number', description: 'Request timeout in milliseconds, clamped to 5000-180000.' }
            }
        }
    },
    {
        name: 'web_fetch',
        description: 'Fetch a public HTTP(S) HTML or text resource and return readable text. Rejects PDF/binary content with unsupported_content_type; use pdf_extract_text or download_file for PDFs/files.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string' },
                maxChars: { type: 'number' },
                query: { type: 'string' },
                contains: { type: 'string' }
            }
        }
    },
    {
        name: 'pdf_extract_text',
        description: 'Extract readable text from a public PDF URL or local PDF path. Use this instead of web_fetch for application/pdf or .pdf sources.',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                uri: { type: 'string' },
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                maxChars: { type: 'number' },
                maxPages: { type: 'number' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'pdf_find_and_extract',
        description: 'Find a PDF from a known HTML page URL, exact document title, or search query, then extract readable text from the best PDF candidate. Use this for papers/reports when you do not already have a direct .pdf URL. Standard flow: { "title": "exact paper/report title", "extract_query": "answer terms" } or { "url": "known article page", "extract_query": "answer terms" }. It discovers PDF/download links, tries likely OJS article download URLs, and returns extraction attempts for recovery.',
        inputSchema: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Exact paper/report/document title. When known, use this as the primary discovery field.' },
                query: { type: 'string', description: 'General search query or answer/evidence terms. If title is also provided, title is used for discovery and query is treated as supporting evidence text.' },
                q: { type: 'string', description: 'Compatibility alias for query.' },
                search: { type: 'string', description: 'Compatibility alias for query.' },
                extract_query: { type: 'string', description: 'Answer/evidence terms to look for inside the PDF after discovery, e.g. "fish bag volume m^3".' },
                extractQuery: { type: 'string', description: 'Compatibility alias for extract_query.' },
                url: { type: 'string', description: 'Known article/report HTML page or direct PDF URL.' },
                uri: { type: 'string', description: 'Compatibility alias for url.' },
                pageUrl: { type: 'string', description: 'Compatibility alias for url.' },
                page_url: { type: 'string', description: 'Compatibility alias for url.' },
                maxChars: { type: 'number', description: 'Maximum extracted text chars, clamped to 1000-120000.' },
                maxPages: { type: 'number', description: 'Maximum pages to parse, clamped to 1-300.' },
                maxCandidates: { type: 'number', description: 'Maximum candidate PDF URLs to try, clamped to 1-24.' },
                maxLinks: { type: 'number', description: 'Maximum page links to inspect, clamped to 1-300.' },
                timeoutMs: { type: 'number', description: 'Overall extraction timeout per candidate in milliseconds.' }
            }
        }
    },
    {
        name: 'download_file',
        description: 'Download a public HTTP(S) resource to a local file and return path, content type, and byte count. Use for binary files or when another parser needs a local path.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string' },
                uri: { type: 'string' },
                outputDir: { type: 'string' },
                output_dir: { type: 'string' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'web_extract_links',
        description: 'Fetch a public HTTP(S) HTML page and extract normalized outbound links with anchor text. Rejects PDF/binary content.',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                maxLinks: { type: 'number' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'run_python_file',
        description: 'Run a local Python file and return stdout/stderr. Use for benchmark code-output questions.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'read_spreadsheet',
        description: 'Read an xlsx/xls/csv file and return shape, columns, rows, numeric_sums, and total_numeric_sum as JSON text. Set maxRows high enough when the full table is needed.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                maxRows: { type: 'number' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'read_presentation',
        description: 'Read a local PowerPoint .pptx/.ppt presentation and return JSON with total slide count, per-slide text, table text, and image alt text. Use this for attached presentation questions before writing custom scripts. For category questions, inspect the returned slide labels semantically rather than only substring matching the category word.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                query: { type: 'string', description: 'Optional literal query for matches_query. Category questions still require semantic classification by the model/finalizer.' },
                contains: { type: 'string', description: 'Compatibility alias for query.' },
                maxSlides: { type: 'number' },
                max_slides: { type: 'number' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'transcribe_audio',
        description: 'Transcribe a local audio file with local Whisper and return recognized text.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                model: { type: 'string' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'describe_image',
        description: 'Describe or answer a question about a local image file using the configured vision-capable LLM. Use for attached PNG/JPG/WebP images.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                imagePath: { type: 'string' },
                image_path: { type: 'string' },
                question: { type: 'string' },
                maxChars: { type: 'number' },
                timeoutMs: { type: 'number' }
            }
        }
    },
    {
        name: 'youtube_transcript',
        description: 'Fetch YouTube metadata and available subtitles/auto-captions with yt-dlp. Use for YouTube questions before guessing from search snippets.',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                videoUrl: { type: 'string' },
                video_url: { type: 'string' },
                language: { type: 'string' },
                maxChars: { type: 'number' },
                timeoutMs: { type: 'number' }
            }
        }
    }
];

async function handleToolCall(request) {
    const name = normalizeString(request.params?.name);
    const args = request.params?.arguments && typeof request.params.arguments === 'object'
        ? request.params.arguments
        : {};
    if (name === 'web_search') return await webSearch(args);
    if (name === 'github_repo_read') return await githubRepoRead(args);
    if (name === 'web_fetch') return await webFetch(args);
    if (name === 'pdf_extract_text') return await pdfExtractText(args);
    if (name === 'pdf_find_and_extract') return await pdfFindAndExtract(args);
    if (name === 'download_file') return await downloadFile(args);
    if (name === 'web_extract_links') return await webExtractLinks(args);
    if (name === 'run_python_file') return await runPythonFile(args);
    if (name === 'read_spreadsheet') return await readSpreadsheet(args);
    if (name === 'read_presentation') return await readPresentation(args);
    if (name === 'transcribe_audio') return await transcribeAudio(args);
    if (name === 'describe_image') return await describeImage(args);
    if (name === 'youtube_transcript') return await youtubeTranscript(args);
    return errorResult(`Unknown tool: ${name}`);
}

async function handleRequest(request) {
    if (!request.id) {
        return null;
    }
    if (request.method === 'initialize') {
        return {
            id: request.id,
            result: {
                protocolVersion: PROTOCOL_VERSION,
                capabilities: { tools: {} },
                serverInfo: SERVER_INFO
            }
        };
    }
    if (request.method === 'tools/list') {
        return { id: request.id, result: { tools: TOOLS } };
    }
    if (request.method === 'tools/call') {
        return { id: request.id, result: await handleToolCall(request) };
    }
    return {
        id: request.id,
        error: { code: -32601, message: `Unknown method: ${request.method}` }
    };
}

function startStdioServer() {
    const rl = readline.createInterface({ input: process.stdin });
    rl.on('line', async (line) => {
        let request;
        try {
            request = JSON.parse(line);
        } catch {
            return;
        }
        try {
            const response = await handleRequest(request);
            if (response) {
                send(response);
            }
        } catch (error) {
            if (request.id) {
                send({
                    id: request.id,
                    error: { code: -32000, message: error?.message || String(error) }
                });
            }
        }
    });
}

if (require.main === module) {
    startStdioServer();
}

module.exports = {
    TOOLS,
    downloadFile,
    extractBingResults,
    extractDuckDuckGoHtmlResults,
    extractGenericAnchorResults,
    extractGitHubRepositoryResults,
    fetchText,
    githubRepoRead,
    handleRequest,
    handleToolCall,
    normalizeSearchBackends,
    parseGitHubRepoRef,
    pdfFindAndExtract,
    pdfExtractText,
    readPresentation,
    SEARCH_BACKENDS,
    webExtractLinks,
    webFetch,
    webSearch
};
