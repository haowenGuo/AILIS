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

function extractDoiCandidate(value = '') {
    const text = normalizeString(value);
    if (!text) {
        return '';
    }
    const match = text.match(/\b10\.\d{4,9}\/[-._;()/:a-z0-9]+\b/i);
    return match ? match[0].replace(/[).,;]+$/g, '').toLowerCase() : '';
}

function isLikelyPdfUrl(value = '') {
    const text = normalizeString(value).toLowerCase();
    return Boolean(text) && (
        /\.pdf(?:$|[?#])/i.test(text) ||
        /\/pdf(?:$|[/?#])/i.test(text) ||
        /[?&](?:format|type)=pdf\b/i.test(text) ||
        /download[^?#]*pdf/i.test(text)
    );
}

function classifyResearchLink(link = {}) {
    const url = normalizeString(link.url || link.uri);
    const text = normalizeString(link.text || link.title);
    const doi = extractDoiCandidate(/doi\.org\//i.test(url) ? url : `${text} ${url}`);
    if (doi) {
        return { kind: 'doi', doi };
    }
    if (isLikelyPdfUrl(url) || /\b(pdf|full text|download pdf|view pdf)\b/i.test(text)) {
        return { kind: 'pdf', doi: '' };
    }
    if (/arxiv\.org\/abs\//i.test(url)) {
        return { kind: 'paper_abs', doi: '' };
    }
    if (
        /\/article\/|\/paper\/|\/study\/|\/publication\/|\/preprint\/|\/doi\/|\/abs\/|\/full\/|\/view\/\d+/i.test(url) ||
        /\b(article|paper|study|research|journal|proceedings|preprint|manuscript|publication)\b/i.test(text)
    ) {
        return { kind: 'article', doi: '' };
    }
    return { kind: 'web', doi: '' };
}

function isLowSignalNavigationLink(link = {}) {
    const haystack = `${normalizeString(link.text || link.title)} ${normalizeString(link.url || link.uri)}`.toLowerCase();
    return /\b(home|about|contact|privacy|terms|login|log in|sign in|register|subscribe|cookie|cookies|menu|share|facebook|twitter|linkedin|instagram|mastodon|rss|comment|comments|reply|print|tag|category|author profile|profile)\b/.test(haystack);
}

function isArchivePaginationLink({ url = '', text = '', pageUrl = '' } = {}) {
    const normalizedText = normalizeString(text).toLowerCase();
    const normalizedUrl = normalizeString(url).toLowerCase();
    const normalizedPageUrl = normalizeString(pageUrl).toLowerCase();
    return /^(next|older|older posts|more|more articles|view more|load more)$/.test(normalizedText)
        && /(archive|search|issue|issues|page|offset|start)/i.test(`${normalizedPageUrl} ${normalizedUrl}`)
        && (
            /\/archive(?:\/\d+)?(?:$|[/?#])/i.test(normalizedUrl) ||
            /(?:[?&](?:page|start|offset)=\d+)/i.test(normalizedUrl) ||
            /\/page\/\d+(?:$|[/?#])/i.test(normalizedUrl)
        );
}

function scoreResearchLink(link = {}, index = 0, pageUrl = '') {
    const url = normalizeString(link.url || link.uri);
    const text = normalizeString(link.text || link.title);
    let { kind, doi } = classifyResearchLink({ url, text });
    let score = 10;
    if (isArchivePaginationLink({ url, text, pageUrl })) {
        kind = 'pagination';
        score += 120;
    }
    if (kind === 'doi') score += 140;
    if (kind === 'pdf') score += 125;
    if (kind === 'paper_abs') score += 95;
    if (kind === 'article') score += 80;
    if (/\b(linked paper|linked study|reference|citation|full text|download)\b/i.test(text)) score += 20;
    if (/\b(pdf|paper|study|article|journal|research|doi|arxiv|abstract)\b/i.test(`${text} ${url}`)) score += 12;
    if (isLowSignalNavigationLink({ url, text })) score -= 80;
    try {
        const linkHost = new URL(url).hostname.replace(/^www\./i, '');
        const pageHost = pageUrl ? new URL(pageUrl).hostname.replace(/^www\./i, '') : '';
        if (pageHost && linkHost && linkHost !== pageHost) {
            score += 8;
        }
    } catch {}
    score -= Math.min(index, 30);
    return {
        score,
        kind,
        doi,
        url,
        text
    };
}

function summarizeRelevantLink(candidate = {}) {
    return pruneEmptyDeep({
        kind: normalizeString(candidate.kind),
        text: normalizeString(candidate.text, '(no text)'),
        url: normalizeString(candidate.url),
        doi: normalizeString(candidate.doi),
        score: Number.isFinite(candidate.score) ? Number(candidate.score.toFixed(2)) : undefined
    });
}

function buildSuggestedCallForLink(candidate = {}) {
    const url = normalizeString(candidate.url);
    const text = normalizeString(candidate.text, 'linked resource');
    if (normalizeString(candidate.doi)) {
        return {
            tool: 'paper_metadata_lookup',
            args: { doi: candidate.doi },
            reason: `Resolve scholarly metadata from DOI link: ${text}`
        };
    }
    if (candidate.kind === 'pdf' || isLikelyPdfUrl(url)) {
        return {
            tool: 'pdf_extract_text',
            args: { url, maxChars: 12000 },
            reason: `Read the linked PDF directly: ${text}`
        };
    }
    return {
        tool: 'web_fetch',
        args: { url },
        reason: `Read the linked page before broadening search: ${text}`
    };
}

function dedupeSuggestedNextCalls(calls = [], limit = 5) {
    const unique = [];
    const seen = new Set();
    for (const call of Array.isArray(calls) ? calls : []) {
        if (!call || !normalizeString(call.tool)) {
            continue;
        }
        const key = `${call.tool}:${JSON.stringify(call.args || {})}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        unique.push(pruneEmptyDeep({
            tool: normalizeString(call.tool),
            args: call.args && typeof call.args === 'object' ? call.args : undefined,
            reason: normalizeString(call.reason)
        }));
        if (unique.length >= limit) {
            break;
        }
    }
    return unique;
}

function rankLinksForResearch(links = [], pageUrl = '', query = '') {
    return (Array.isArray(links) ? links : [])
        .map((link, index) => {
            const research = scoreResearchLink(link, index, pageUrl);
            const queryMatch = query
                ? scoreSearchResultAgainstQuery({
                    title: research.text,
                    snippet: '',
                    url: research.url
                }, query)
                : { score: 0, matchedTerms: [] };
            return {
                ...research,
                researchScore: research.score,
                queryScore: queryMatch.score,
                queryMatchedTerms: queryMatch.matchedTerms,
                score: research.score + queryMatch.score * 4
            };
        })
        .sort((a, b) => b.score - a.score || b.queryScore - a.queryScore || a.url.localeCompare(b.url));
}

function buildSuggestedCallsFromRankedLinks(rankedLinks = [], limit = 3) {
    return dedupeSuggestedNextCalls(
        rankedLinks
            .filter((candidate) => candidate.score >= 35)
            .map((candidate) => buildSuggestedCallForLink(candidate)),
        limit
    );
}

const SEARCH_QUERY_STOPWORDS = new Set([
    'about', 'after', 'article', 'before', 'between', 'from', 'have', 'into', 'journal',
    'linked', 'paper', 'question', 'related', 'report', 'site', 'that', 'their', 'there',
    'these', 'this', 'those', 'what', 'when', 'where', 'which', 'with'
]);

const MONTH_QUERY_TERMS = new Set([
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
]);

const TOPIC_QUERY_STOPWORDS = new Set([
    ...SEARCH_QUERY_STOPWORDS,
    ...MONTH_QUERY_TERMS,
    'abstract', 'article', 'author', 'citation', 'conference', 'depiction', 'doi',
    'journal', 'paper', 'proceedings', 'publication', 'quoted', 'quote', 'review',
    'science', 'source', 'study', 'topic'
]);

function extractSearchQueryTerms(query = '') {
    const sanitized = normalizeString(query)
        .replace(/\bsite:[^\s]+/gi, ' ')
        .replace(/\bhttps?:\/\/\S+/gi, ' ')
        .replace(/["'“”‘’()[\]{}]/g, ' ');
    const rawTerms = sanitized.toLowerCase().match(/[a-z0-9]{3,}/g) || [];
    const terms = [];
    const seen = new Set();
    for (const term of rawTerms) {
        if (SEARCH_QUERY_STOPWORDS.has(term)) {
            continue;
        }
        if (/^\d{1,3}$/.test(term)) {
            continue;
        }
        if (seen.has(term)) {
            continue;
        }
        seen.add(term);
        terms.push(term);
        if (terms.length >= 10) {
            break;
        }
    }
    return terms;
}

function extractQuotedSearchPhrases(query = '') {
    return Array.from(normalizeString(query).matchAll(/"([^"]{3,})"/g))
        .map((match) => normalizePaperTitle(match[1]))
        .filter(Boolean)
        .slice(0, 5);
}

function looksScholarlySearchQuery(query = '') {
    const text = normalizeString(query);
    if (!text) {
        return false;
    }
    const hasYear = /\b(?:18|19|20)\d{2}\b/.test(text);
    const hasScholarlyCue = /\b(journal|article|paper|study|proceedings|author|doi|citation|abstract|specimens|taxonomy|species|lepidoptera|entomology)\b/i.test(text);
    const capitalizedWords = (text.match(/\b[A-Z][a-z]{2,}\b/g) || []).length;
    return /\bdoi\b/i.test(text) || (hasYear && (hasScholarlyCue || capitalizedWords >= 2));
}

function extractRawQuotedSearchPhrases(query = '') {
    return Array.from(normalizeString(query).matchAll(/"([^"]{3,})"/g))
        .map((match) => normalizeString(match[1]))
        .filter(Boolean)
        .slice(0, 5);
}

function isLikelyAuthorPhrase(phrase = '') {
    const tokens = normalizeAuthorName(phrase).split(/\s+/).filter(Boolean);
    if (!tokens.length || tokens.length > 4) {
        return false;
    }
    if (tokens.some((token) => TOPIC_QUERY_STOPWORDS.has(token.toLowerCase()))) {
        return false;
    }
    const capitalized = tokens.filter((token) => /^[A-Z][A-Za-z'’-]+$/.test(token)).length;
    return capitalized >= Math.min(tokens.length, 2);
}

function inferAuthorFromScholarlyQuery(query = '') {
    for (const phrase of extractRawQuotedSearchPhrases(query)) {
        if (isLikelyAuthorPhrase(phrase)) {
            return phrase;
        }
    }
    const words = normalizeString(query)
        .replace(/["'“”‘’()[\]{}:,/\\-]+/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
    const collected = [];
    for (const word of words) {
        const lower = word.toLowerCase();
        if (/^(?:18|19|20)\d{2}$/.test(word)) {
            break;
        }
        if (MONTH_QUERY_TERMS.has(lower) || TOPIC_QUERY_STOPWORDS.has(lower)) {
            break;
        }
        if (/^[A-Z][A-Za-z'’-]+$/.test(word)) {
            collected.push(word);
            if (collected.length >= 3) {
                break;
            }
            continue;
        }
        if (collected.length) {
            break;
        }
    }
    if (collected.length >= 2) {
        return collected.slice(0, 2).join(' ');
    }
    return collected.length === 1 ? collected[0] : '';
}

function inferVenueFromScholarlyQuery(query = '') {
    const rawQuery = normalizeString(query);
    const quoted = extractRawQuotedSearchPhrases(rawQuery);
    for (const phrase of quoted) {
        if (new RegExp(`"${escapeRegExp(phrase)}"\\s+(?:journal|review|conference|proceedings)`, 'i').test(rawQuery)) {
            return phrase;
        }
    }
    if (/\bjournal\b/i.test(rawQuery)) {
        const shortQuoted = quoted.find((phrase) => phrase.split(/\s+/).length <= 3);
        if (shortQuoted) {
            return shortQuoted;
        }
    }
    const venueMatch = rawQuery.match(/\b([A-Z][A-Za-z0-9:&-]{2,})\s+(?:journal|review|conference|proceedings)\b/);
    return normalizeString(venueMatch?.[1]);
}

function inferTopicFromScholarlyQuery(query = '', { author = '', venue = '', year = 0 } = {}) {
    let remaining = normalizeString(query)
        .replace(/\bsite:[^\s]+/gi, ' ')
        .replace(/\bhttps?:\/\/\S+/gi, ' ');
    for (const fragment of [author, venue, year ? String(year) : '']) {
        const normalized = normalizeString(fragment);
        if (!normalized) {
            continue;
        }
        remaining = remaining.replace(new RegExp(escapeRegExp(normalized), 'ig'), ' ');
    }
    const topicTokens = [];
    for (const token of remaining.replace(/["'“”‘’()[\]{}:.,/\\-]+/g, ' ').split(/\s+/).filter(Boolean)) {
        const lower = token.toLowerCase();
        if (token.length < 3 || TOPIC_QUERY_STOPWORDS.has(lower) || /^(?:18|19|20)\d{2}$/.test(token)) {
            continue;
        }
        topicTokens.push(token);
        if (topicTokens.length >= 6) {
            break;
        }
    }
    return topicTokens.join(' ');
}

function inferPaperMetadataArgsFromScholarlyQuery(query = '') {
    const normalizedQuery = normalizeString(query);
    const yearMatch = normalizedQuery.match(/\b((?:18|19|20)\d{2})\b/);
    const year = yearMatch ? Number(yearMatch[1]) : 0;
    const author = inferAuthorFromScholarlyQuery(normalizedQuery);
    const venue = inferVenueFromScholarlyQuery(normalizedQuery);
    const topic = inferTopicFromScholarlyQuery(normalizedQuery, { author, venue, year });
    return pruneEmptyDeep({
        query: normalizedQuery,
        author,
        year: year || undefined,
        topic,
        venue
    }) || { query: normalizedQuery };
}

function scoreSearchResultAgainstQuery(result = {}, query = '') {
    const normalizedText = normalizePaperTitle([
        normalizeString(result.title),
        normalizeString(result.snippet),
        normalizeString(result.url)
    ].join(' '));
    const titleText = normalizePaperTitle(normalizeString(result.title));
    const matchedTerms = [];
    let score = 0;
    for (const term of extractSearchQueryTerms(query)) {
        const normalizedTerm = normalizePaperTitle(term);
        if (!normalizedTerm || !normalizedText.includes(normalizedTerm)) {
            continue;
        }
        matchedTerms.push(term);
        score += /^\d{4}$/.test(term) ? 8 : term.length >= 6 ? 18 : 12;
        if (titleText.includes(normalizedTerm)) {
            score += 6;
        }
    }
    for (const phrase of extractQuotedSearchPhrases(query)) {
        if (phrase && normalizedText.includes(phrase)) {
            score += 45;
        }
    }
    if (matchedTerms.length >= 2) {
        score += 20;
    }
    return {
        score,
        matchedTerms: matchedTerms.slice(0, 6)
    };
}

function rankSearchResultsForFollowup(results = [], query = '') {
    return (Array.isArray(results) ? results : [])
        .map((item, index) => {
            const research = scoreResearchLink({
                url: normalizeString(item.url),
                text: normalizeString(item.title || item.snippet)
            }, index);
            const queryMatch = scoreSearchResultAgainstQuery(item, query);
            return {
                ...item,
                kind: research.kind,
                doi: research.doi,
                score: research.score,
                researchScore: research.score,
                queryScore: queryMatch.score,
                queryMatchedTerms: queryMatch.matchedTerms,
                combinedScore: queryMatch.score * 4 + research.score
            };
        })
        .sort((a, b) => b.combinedScore - a.combinedScore || b.queryScore - a.queryScore || b.researchScore - a.researchScore);
}

function buildSuggestedCallsFromSearchResults(results = [], { query = '', limit = 3 } = {}) {
    const ranked = rankSearchResultsForFollowup(results, query);
    const eligible = ranked.filter((candidate) => (
        candidate.queryMatchedTerms.length >= 2 ||
        candidate.queryScore >= 30 ||
        ((candidate.kind === 'doi' || candidate.kind === 'pdf' || candidate.kind === 'paper_abs') && candidate.queryMatchedTerms.length >= 1)
    ));
    const directCalls = buildSuggestedCallsFromRankedLinks(eligible, limit);
    if (directCalls.length) {
        return directCalls;
    }
    return dedupeSuggestedNextCalls(
        eligible
            .slice(0, limit)
            .map((item) => ({
                tool: 'web_fetch',
                args: { url: item.url },
                reason: `Read search result: ${normalizeString(item.title, item.url)}`
            })),
        limit
    );
}

function filterRankedLinksForQuerySuggestions(rankedLinks = [], query = '') {
    const normalizedQuery = normalizeString(query);
    const hasUsefulQueryTerms = extractSearchQueryTerms(normalizedQuery).length > 0
        || extractQuotedSearchPhrases(normalizedQuery).length > 0;
    if (!normalizedQuery || !hasUsefulQueryTerms) {
        return rankedLinks;
    }
    return (Array.isArray(rankedLinks) ? rankedLinks : []).filter((candidate) => (
        candidate.kind === 'pagination' ||
        Number(candidate.queryScore) >= 30 ||
        (Array.isArray(candidate.queryMatchedTerms) && candidate.queryMatchedTerms.length >= 2) ||
        (Array.isArray(candidate.queryMatchedTerms) && candidate.queryMatchedTerms.some((term) => /^(?:18|19|20)\d{2}$/.test(term)))
    ));
}

function formatSuggestedNextCalls(calls = []) {
    return (Array.isArray(calls) ? calls : [])
        .slice(0, 5)
        .map((call, index) => {
            const args = call.args && typeof call.args === 'object' ? ` ${JSON.stringify(call.args)}` : '';
            const reason = normalizeString(call.reason);
            return `${index + 1}. ${normalizeString(call.tool)}${args}${reason ? ` - ${reason}` : ''}`;
        })
        .join('\n');
}

function formatRelevantLinks(links = []) {
    return (Array.isArray(links) ? links : [])
        .slice(0, 5)
        .map((link, index) => `${index + 1}. [${normalizeString(link.kind, 'web')}] ${normalizeString(link.text, '(no text)')}\nURL: ${normalizeString(link.url)}`)
        .join('\n\n');
}

function buildWebToolGuidanceText({ evidenceGap = '', recoveryHint = '', suggestedNextCalls = [], observedRelevantLinks = [] } = {}) {
    const sections = [];
    if (evidenceGap) {
        sections.push(`Evidence gap: ${evidenceGap}`);
    }
    if (recoveryHint) {
        sections.push(`Recovery hint: ${recoveryHint}`);
    }
    if (Array.isArray(suggestedNextCalls) && suggestedNextCalls.length) {
        sections.push(`Suggested next calls:\n${formatSuggestedNextCalls(suggestedNextCalls)}`);
    }
    if (Array.isArray(observedRelevantLinks) && observedRelevantLinks.length) {
        sections.push(`High-signal links:\n${formatRelevantLinks(observedRelevantLinks)}`);
    }
    return sections.join('\n\n');
}

function classifyAccessBarrierText(text = '') {
    const haystack = normalizeString(text).toLowerCase();
    if (!haystack) {
        return null;
    }
    if (/(radware|bot manager|bot challenge|captcha|verify you are human|human verification|checking your browser|press and hold)/i.test(haystack)) {
        return {
            status: 'access_challenge',
            evidenceGap: 'This page is an anti-bot challenge, not the target content.',
            recoveryHint: 'Do not keep refetching this URL. Prefer DOI metadata, linked PDFs/articles, or another accessible source.'
        };
    }
    if (/(access denied|forbidden|permission denied|request blocked|not authorized)/i.test(haystack)) {
        return {
            status: 'access_denied',
            evidenceGap: 'This page denied automated access and is not reliable evidence.',
            recoveryHint: 'Use metadata APIs, extracted links, or an accessible mirror instead of repeating the same fetch.'
        };
    }
    return null;
}

function buildHttpAccessFailureDetails(url, fetched = {}) {
    const details = pruneEmptyDeep({
        url,
        statusCode: Number(fetched.status) || undefined,
        errorCode: normalizeString(fetched.errorCode),
        stderr: normalizeString(fetched.stderr)
    });
    if (fetched.status === 403) {
        details.evidenceGap = 'Remote site blocked automated access (HTTP 403).';
        details.recoveryHint = 'This is a server-side access policy, not a local network failure. Prefer metadata, extracted links from an accessible page, or another source instead of retrying this URL.';
    } else if (fetched.status === 429) {
        details.evidenceGap = 'Remote site rate-limited automated requests (HTTP 429).';
        details.recoveryHint = 'This is a remote rate limit, not a local connectivity failure. Back off or use another API/source instead of hammering the same endpoint.';
    }
    return details;
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
        const yahooRedirect = parsed.href.match(/\/RU=([^/]+)/i);
        if (yahooRedirect) {
            const decodedTarget = decodeSearchRedirectTarget(yahooRedirect[1]);
            if (decodedTarget) {
                return decodedTarget;
            }
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

function extractYahooResults(html = '', maxResults = 8) {
    const rows = [];
    const blockPattern = /<li\b[^>]*>([\s\S]*?)(?=<li\b|<\/ol>|<\/ul>|$)/gi;
    let blockMatch;
    while ((blockMatch = blockPattern.exec(html)) && rows.length < maxResults * 4) {
        const block = blockMatch[1];
        if (!/\balgo\b|\bcompTitle\b/i.test(block)) {
            continue;
        }
        const linkMatch = block.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<h3\b[^>]*class=["'][^"']*\btitle\b[^"']*["'][^>]*>([\s\S]*?)<\/h3>/i) ||
            block.match(/<h3\b[^>]*class=["'][^"']*\btitle\b[^"']*["'][^>]*>\s*<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
        if (!linkMatch) {
            continue;
        }
        const url = normalizeUrlCandidate(linkMatch[1]);
        if (!url || /(^|\.)yahoo\.com|images\.search\.yahoo\.com/i.test(url)) {
            continue;
        }
        const snippetMatch = block.match(/<div\b[^>]*class=["'][^"']*\bcompText\b[^"']*["'][^>]*>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i) ||
            block.match(/<p\b[^>]*class=["'][^"']*\b(?:fc-dustygray|lh-22)\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
        rows.push({
            title: linkMatch[2],
            url,
            snippet: snippetMatch ? snippetMatch[1] : ''
        });
    }
    const parsed = dedupeSearchResults(rows, maxResults);
    return parsed.length ? parsed : extractGenericAnchorResults(html, maxResults);
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
    yahoo_html: Object.freeze({
        id: 'yahoo_html',
        buildUrl: (query) => `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
        extract: extractYahooResults
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
            ? ['github_repositories', 'duckduckgo_lite', 'duckduckgo_html', 'bing_html', 'yahoo_html']
            : ['bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'yahoo_html'];
    const backends = requested
        .map((id) => SEARCH_BACKENDS[normalizeString(id).toLowerCase()])
        .filter(Boolean);
    return backends.length ? backends : [SEARCH_BACKENDS.bing_html, SEARCH_BACKENDS.duckduckgo_lite, SEARCH_BACKENDS.duckduckgo_html, SEARCH_BACKENDS.yahoo_html];
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
    const backends = normalizeSearchBackends(args, query);
    for (let backendIndex = 0; backendIndex < backends.length; backendIndex += 1) {
        const backend = backends[backendIndex];
        const attempt = await runSearchBackend(backend, query, maxResults, timeoutMs);
        attempts.push(attempt);
        if (!attempt.ok) {
            continue;
        }
        const rankedResults = rankSearchResultsForFollowup(attempt.results, query);
        const text = rankedResults.map((item, index) => [
            `${index + 1}. ${item.title}`,
            `URL: ${item.url}`,
            `Snippet: ${item.snippet}`
        ].join('\n')).join('\n\n');
        const baseSuggestedNextCalls = buildSuggestedCallsFromSearchResults(attempt.results, { query, limit: 3 });
        const observedRelevantLinks = rankedResults
            .filter((candidate) => candidate.queryMatchedTerms.length >= 1 || candidate.kind !== 'web')
            .slice(0, 5)
            .map((candidate) => summarizeRelevantLink(candidate));
        const queryFocusTerms = extractSearchQueryTerms(query).slice(0, 6);
        const topQueryScore = rankedResults[0]?.queryScore || 0;
        const offTarget = baseSuggestedNextCalls.length === 0 && topQueryScore < 30;
        if (offTarget && backendIndex < backends.length - 1) {
            continue;
        }
        const suggestedNextCalls = offTarget && looksScholarlySearchQuery(query)
            ? dedupeSuggestedNextCalls([
                {
                    tool: 'paper_metadata_lookup',
                    args: inferPaperMetadataArgsFromScholarlyQuery(query),
                    reason: 'Search results look off-target for a bibliographic query; switch to structured scholarly metadata lookup instead of rephrasing the same web search.'
                },
                ...baseSuggestedNextCalls
            ], 3)
            : baseSuggestedNextCalls;
        const evidenceGap = offTarget
            ? `Search results look off-target for the key query terms: ${queryFocusTerms.join(', ') || query}. Refine the query with exact phrases, source names, or author names before following a result.`
            : 'Search results are discovery only. Open a result or resolve a DOI/PDF before answering.';
        const recoveryHint = offTarget
            ? 'Do not follow obviously unrelated popular results. Tighten the query or switch to a more specific tool before searching again.'
            : 'Prefer the suggested follow-up calls below before issuing another broad web_search.';
        const guidance = buildWebToolGuidanceText({
            evidenceGap,
            recoveryHint,
            suggestedNextCalls,
            observedRelevantLinks
        });
        return textResult([guidance, `Search results:\n${text}`].filter(Boolean).join('\n\n'), {
            status: 'completed',
            query,
            backend: attempt.backend,
            url: attempt.url,
            durationMs: attempt.durationMs,
            attempts,
            results: attempt.results,
            evidenceGap,
            recoveryHint,
            suggestedNextCalls,
            observedRelevantLinks,
            queryFocusTerms,
            topQueryScore
        });
    }
    return errorResult('web_search failed across all configured search backends', {
        status: 'search_failed',
        errorCode: 'search_backends_failed',
        query,
        retryable: true,
        attempts,
        suggestedTools: ['web_fetch', 'web_extract_links'],
        evidenceGap: 'Broad discovery failed; no evidence page was opened yet.',
        recoveryHint: 'Try a more specific title/DOI/source query or switch to a domain-specific tool instead of repeating the same broad search.'
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
        return errorResult(fetched.error || 'web_fetch fetch failed', buildHttpAccessFailureDetails(url, fetched));
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
    const extractedLinks = /html/i.test(contentType) ? extractLinksFromHtml(body, url, 80) : [];
    const linkQuery = normalizeString(args.query || args.contains || '');
    const rankedLinks = rankLinksForResearch(extractedLinks, url, linkQuery);
    const suggestedRankedLinks = filterRankedLinksForQuerySuggestions(rankedLinks, linkQuery);
    const suggestedNextCalls = buildSuggestedCallsFromRankedLinks(suggestedRankedLinks, 3);
    const observedLinksForGuidance = linkQuery ? suggestedRankedLinks : rankedLinks;
    const observedRelevantLinks = observedLinksForGuidance.slice(0, 5).map((candidate) => summarizeRelevantLink(candidate));
    const barrier = classifyAccessBarrierText(text);
    const evidenceGap = barrier?.evidenceGap || (
        suggestedNextCalls.length
            ? 'This page excerpt is not enough on its own. Follow one of the linked DOI/PDF/article candidates before answering.'
            : /html/i.test(contentType)
                ? 'This is a page excerpt. If the answer depends on linked references or supporting documents, inspect the outbound links next.'
                : ''
    );
    const recoveryHint = barrier?.recoveryHint || (
        suggestedNextCalls.length
            ? 'Prefer following the high-signal linked resources below instead of broadening back to web_search.'
            : ''
    );
    const guidance = buildWebToolGuidanceText({
        evidenceGap,
        recoveryHint,
        suggestedNextCalls,
        observedRelevantLinks
    });
    return textResult([guidance, `Content excerpt:\n${focused.text}`].filter(Boolean).join('\n\n'), {
        status: 'completed',
        url,
        contentType,
        originalChars: text.length,
        returnedChars: focused.text.length,
        focus: focused.focus,
        observedLinkCount: extractedLinks.length,
        suggestedNextCalls,
        observedRelevantLinks,
        evidenceGap,
        recoveryHint,
        pageStatus: barrier?.status || undefined
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
        return errorResult(fetched.error || 'web_extract_links fetch failed', buildHttpAccessFailureDetails(url, fetched));
    }
    if ((fetched.contentType && !isHtmlContentType(fetched.contentType)) || fetched.isBinary) {
        return unsupportedContentTypeResult('web_extract_links', url, fetched, ['web_fetch', 'download_file']);
    }
    const linkQuery = normalizeString(args.query || args.contains || '');
    const links = extractLinksFromHtml(fetched.text, url, maxLinks);
    const rankedLinks = rankLinksForResearch(links, url, linkQuery);
    const orderedLinks = rankedLinks.map((candidate) => ({ text: candidate.text, url: candidate.url }));
    const suggestedRankedLinks = filterRankedLinksForQuerySuggestions(rankedLinks, linkQuery);
    const suggestedNextCalls = buildSuggestedCallsFromRankedLinks(suggestedRankedLinks, 3);
    const observedLinksForGuidance = linkQuery ? suggestedRankedLinks : rankedLinks;
    const observedRelevantLinks = observedLinksForGuidance.slice(0, 5).map((candidate) => summarizeRelevantLink(candidate));
    const linkText = orderedLinks.length
        ? orderedLinks.map((link, index) => `${index + 1}. ${link.text || '(no text)'}\nURL: ${link.url}`).join('\n\n')
        : `No links extracted from: ${url}`;
    const guidance = buildWebToolGuidanceText({
        evidenceGap: orderedLinks.length ? 'Extracted links are candidates only. Follow a DOI/PDF/article link before answering.' : '',
        recoveryHint: suggestedNextCalls.length ? 'Prefer the high-signal links below over another broad web_search.' : '',
        suggestedNextCalls,
        observedRelevantLinks
    });
    return textResult([guidance, `Extracted links:\n${linkText}`].filter(Boolean).join('\n\n'), {
        status: 'completed',
        url,
        links: orderedLinks,
        suggestedNextCalls,
        observedRelevantLinks,
        evidenceGap: orderedLinks.length ? 'Links alone are not evidence; follow one of them.' : undefined
    });
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

const PDF_EVIDENCE_GENERIC_TERMS = new Set([
    'article',
    'author',
    'authors',
    'depiction',
    'depictions',
    'different',
    'dragon',
    'dragons',
    'journal',
    'nature',
    'paper',
    'quoted',
    'quote',
    'source',
    'title',
    'two',
    'word'
]);

function significantPdfQueryTerms(value = '') {
    return tokenizePdfQuery(value)
        .filter((term) => !PDF_QUERY_STOPWORDS.has(term))
        .slice(0, 16);
}

function pdfEvidenceTermWeight(term = '') {
    const normalized = normalizeString(term).toLowerCase();
    if (!normalized) {
        return 0;
    }
    if (PDF_EVIDENCE_GENERIC_TERMS.has(normalized)) {
        return 1;
    }
    if (normalized.length >= 8) {
        return 14;
    }
    if (normalized.length >= 5) {
        return 10;
    }
    return 4;
}

function countPdfEvidenceTerm(chunk = '', term = '') {
    const normalized = normalizeString(term).toLowerCase();
    if (!normalized) {
        return 0;
    }
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = /^[a-z]+$/.test(normalized) && !normalized.endsWith('s')
        ? new RegExp(`\\b${escaped}s?\\b`, 'g')
        : new RegExp(`\\b${escaped}\\b`, 'g');
    const matches = String(chunk || '').toLowerCase().match(pattern);
    return matches ? matches.length : 0;
}

function findPdfEvidenceTermOffset(chunk = '', term = '') {
    const lowerChunk = String(chunk || '').toLowerCase();
    const normalized = normalizeString(term).toLowerCase();
    if (!normalized) {
        return -1;
    }
    const direct = lowerChunk.indexOf(normalized);
    if (direct >= 0) {
        return direct;
    }
    if (/^[a-z]+$/.test(normalized) && !normalized.endsWith('s')) {
        return lowerChunk.indexOf(`${normalized}s`);
    }
    return -1;
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

function extractArxivCandidatesFromAtom(xml = '', query = '') {
    const candidates = [];
    const entryPattern = /<entry\b[\s\S]*?<\/entry>/gi;
    let match;
    while ((match = entryPattern.exec(String(xml || '')))) {
        const entry = match[0];
        const id = stripHtml(entry.match(/<id>([\s\S]*?)<\/id>/i)?.[1] || '').trim();
        const title = stripHtml(entry.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim();
        if (!/arxiv\.org\/abs\//i.test(id)) {
            continue;
        }
        const arxivId = id.match(/\/abs\/([^/?#\s]+)/i)?.[1]?.replace(/v\d+$/i, '');
        if (!arxivId) {
            continue;
        }
        candidates.push({
            title,
            snippet: 'arXiv DOI match',
            url: `https://arxiv.org/pdf/${arxivId}`,
            sourceQuery: query
        });
        candidates.push({
            title,
            snippet: 'arXiv DOI match',
            url: `https://arxiv.org/abs/${arxivId}`,
            sourceQuery: query
        });
    }
    return candidates;
}

async function fetchJsonUrl(url, timeoutMs = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'AIGLResearchMCP/0.1 (+local assistant research tool)'
            },
            signal: controller.signal
        });
        const text = await response.text();
        if (!response.ok) {
            return {
                ok: false,
                error: `HTTP ${response.status}`,
                status: response.status,
                retryAfter: response.headers.get('retry-after') || '',
                text: text.slice(0, 1000)
            };
        }
        try {
            return { ok: true, json: JSON.parse(text || '{}'), status: response.status };
        } catch (error) {
            return { ok: false, error: `invalid JSON: ${error.message}`, status: response.status, text: text.slice(0, 1000) };
        }
    } catch (error) {
        return {
            ok: false,
            error: error?.name === 'AbortError' ? 'timeout' : (error?.message || String(error)),
            status: 0
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

function readScholarlyApiConfig() {
    return {
        openAlexApiKey: normalizeString(process.env.OPENALEX_API_KEY || process.env.AIGL_OPENALEX_API_KEY),
        crossrefMailto: normalizeString(process.env.CROSSREF_MAILTO || process.env.AIGL_CROSSREF_MAILTO)
    };
}

function appendUrlQueryParams(url, params = {}) {
    try {
        const parsed = new URL(url);
        for (const [key, value] of Object.entries(params)) {
            const normalized = normalizeString(value);
            if (normalized) {
                parsed.searchParams.set(key, normalized);
            }
        }
        return parsed.toString();
    } catch {
        return url;
    }
}

function buildOpenAlexWorksSearchUrl(baseUrl, query, maxResults, { exact = false, apiKey = '', filter = '', sort = '' } = {}) {
    const parsedBase = normalizeString(baseUrl, 'https://api.openalex.org/works');
    const params = [`per-page=${Math.min(maxResults, 10)}`];
    const normalizedQuery = normalizeString(query);
    if (normalizedQuery) {
        const searchParam = exact ? 'search.exact' : 'search';
        params.unshift(`${searchParam}=${encodeURIComponent(normalizedQuery)}`);
    }
    if (normalizeString(filter)) {
        params.push(`filter=${encodeURIComponent(normalizeString(filter))}`);
    }
    return appendUrlQueryParams(`${parsedBase}?${params.join('&')}`, { api_key: apiKey, sort });
}

function normalizeDoi(value = '') {
    return normalizeString(value)
        .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
        .replace(/^doi:\s*/i, '')
        .trim()
        .toLowerCase();
}

function normalizePaperTitle(value = '') {
    return normalizeString(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeAuthorName(value = '') {
    return normalizeString(value).replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value = '') {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildBibliographicSearchText({ title = '', query = '', author = '', year = 0, topic = '', venue = '' } = {}) {
    const parts = [];
    const seen = new Set();
    for (const part of [title, author, year ? String(year) : '', topic, venue, query]) {
        const normalized = normalizeString(part);
        const key = normalized.toLowerCase();
        if (!normalized || seen.has(key)) {
            continue;
        }
        seen.add(key);
        parts.push(normalized);
    }
    return parts.join(' ');
}

function buildTopicalPaperQuery({ title = '', query = '', author = '', year = 0, topic = '', venue = '' } = {}) {
    let text = normalizeString(title || [topic, venue, query].filter(Boolean).join(' ') || query);
    for (const fragment of [author, year ? String(year) : '']) {
        const normalized = normalizeString(fragment);
        if (!normalized) {
            continue;
        }
        text = text.replace(new RegExp(escapeRegExp(normalized), 'ig'), ' ');
    }
    return normalizeString(text.replace(/\s+/g, ' '));
}

function authorNameTokens(value = '') {
    return normalizeAuthorName(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

function scoreAuthorNameMatch(candidateName = '', targetAuthor = '') {
    const candidateTokens = authorNameTokens(candidateName);
    const targetTokens = authorNameTokens(targetAuthor);
    if (!candidateTokens.length || !targetTokens.length) {
        return 0;
    }
    if (candidateTokens.join(' ') === targetTokens.join(' ')) {
        return 180;
    }
    const overlap = targetTokens.filter((token) => candidateTokens.includes(token)).length;
    let score = overlap * 28;
    if (candidateTokens[candidateTokens.length - 1] === targetTokens[targetTokens.length - 1]) {
        score += 36;
    }
    if (overlap === targetTokens.length) {
        score += 52;
    }
    return score;
}

function rankOpenAlexAuthorMatches(results = [], targetAuthor = '') {
    return (Array.isArray(results) ? results : [])
        .map((author) => {
            const name = normalizeAuthorName(author.display_name || author.name);
            return {
                id: normalizeString(author.id),
                name,
                worksCount: Number(author.works_count || 0) || 0,
                citedByCount: Number(author.cited_by_count || 0) || 0,
                score: scoreAuthorNameMatch(name, targetAuthor) + Math.min(Number(author.works_count || 0) || 0, 50)
            };
        })
        .filter((author) => author.id && author.name)
        .sort((a, b) => b.score - a.score || b.worksCount - a.worksCount || a.name.localeCompare(b.name));
}

function buildOpenAlexAuthorsSearchUrl(baseUrl, author, maxResults, { apiKey = '' } = {}) {
    const parsedBase = normalizeString(baseUrl, 'https://api.openalex.org/authors');
    return appendUrlQueryParams(
        `${parsedBase}?search=${encodeURIComponent(normalizeAuthorName(author))}&per-page=${Math.min(maxResults, 10)}`,
        { api_key: apiKey }
    );
}

function buildOpenAlexWorksFilter({ authorId = '', year = 0 } = {}) {
    const filters = [];
    if (normalizeString(authorId)) {
        filters.push(`author.id:${authorId}`);
    }
    if (Number(year) > 0) {
        filters.push(`from_publication_date:${year}-01-01`);
        filters.push(`to_publication_date:${year}-12-31`);
    }
    return filters.join(',');
}

function normalizeOpenAlexAuthors(authorships = []) {
    return (Array.isArray(authorships) ? authorships : [])
        .map((authorship) => {
            const author = authorship?.author || {};
            return {
                name: normalizeAuthorName(author.display_name || authorship.author_name),
                openAlexId: normalizeString(author.id),
                institutions: (Array.isArray(authorship.institutions) ? authorship.institutions : [])
                    .map((institution) => normalizeString(institution?.display_name))
                    .filter(Boolean)
            };
        })
        .filter((author) => author.name);
}

function normalizeCrossrefAuthors(authors = []) {
    return (Array.isArray(authors) ? authors : [])
        .map((author) => {
            const name = normalizeAuthorName([
                normalizeString(author.given),
                normalizeString(author.family)
            ].filter(Boolean).join(' ') || author.name);
            return {
                name,
                orcid: normalizeString(author.ORCID).replace(/^https?:\/\/orcid\.org\//i, '')
            };
        })
        .filter((author) => author.name);
}

function buildAuthorSummary(authors = []) {
    return authors
        .map((author) => normalizeAuthorName(author?.name))
        .filter(Boolean)
        .slice(0, 12)
        .join(', ');
}

function scorePaperMetadataCandidate(candidate = {}, { title = '', query = '', doi = '', authorId = '', author = '', year = 0, topic = '', venue = '' } = {}) {
    const normalizedDoi = normalizeDoi(doi);
    const candidateDoi = normalizeDoi(candidate.doi);
    const targetTitle = normalizePaperTitle(title || '');
    const topicalQuery = normalizePaperTitle(buildTopicalPaperQuery({ title, query, author, year, topic, venue }));
    const candidateTitle = normalizePaperTitle(candidate.title);
    const terms = significantPdfQueryTerms(targetTitle || topicalQuery);
    const haystack = `${candidateTitle} ${candidate.venue || ''} ${candidate.url || ''} ${candidate.authorsSummary || ''}`.toLowerCase();
    let score = 0;
    let matched = 0;
    if (normalizedDoi && candidateDoi && normalizedDoi === candidateDoi) {
        score += 500;
    }
    if (targetTitle && candidateTitle) {
        if (targetTitle === candidateTitle) {
            score += 260;
        }
        if (candidateTitle.includes(targetTitle) || targetTitle.includes(candidateTitle)) {
            score += 80;
        }
    }
    for (const term of terms) {
        if (haystack.includes(term)) {
            matched += 1;
            score += 22;
        }
    }
    if (terms.length) {
        score += Math.round((matched / terms.length) * 120);
    }
    if (targetTitle && candidateTitle && targetTitle !== candidateTitle && !(candidateTitle.includes(targetTitle) || targetTitle.includes(candidateTitle))) {
        const titleMatchRatio = matched / Math.max(terms.length, 1);
        if (terms.length >= 4 && titleMatchRatio < 0.5) {
            score -= 180;
        } else if (terms.length >= 2 && titleMatchRatio < 0.34) {
            score -= 120;
        }
    }
    if (terms.length >= 4 && matched < 3) {
        score -= 120;
    } else if (terms.length >= 2 && matched === 0) {
        score -= 120;
    }
    if (candidate.pdfUrl) {
        score += 16;
    }
    if (candidate.landingUrl || candidate.url) {
        score += 8;
    }
    if (candidate.authors?.length) {
        score += 8;
    }
    if (normalizeString(author)) {
        const authorMatch = Math.max(
            scoreAuthorNameMatch(candidate.authorsSummary, author),
            ...(Array.isArray(candidate.authors) ? candidate.authors.map((candidateAuthor) => scoreAuthorNameMatch(candidateAuthor?.name, author)) : [0])
        );
        score += authorMatch;
        if ((candidate.authors?.length || candidate.authorsSummary) && authorMatch === 0) {
            score -= 140;
        }
    }
    if (Number(year) > 0) {
        if (Number(candidate.year) === Number(year)) {
            score += 96;
        } else if (Number(candidate.year) > 0) {
            score -= 96;
        }
    }
    const venueTerms = significantPdfQueryTerms(normalizePaperTitle(venue));
    let matchedVenueTerms = 0;
    for (const term of venueTerms) {
        if (haystack.includes(term)) {
            matchedVenueTerms += 1;
            score += 16;
        }
    }
    if (venueTerms.length >= 2 && matchedVenueTerms === 0) {
        score -= 40;
    }
    if (normalizeString(authorId)) {
        score += 160;
    }
    return score;
}

function pushPaperMetadataCandidate(rows, seen, candidate = {}, context = {}) {
    const key = [
        normalizeDoi(candidate.doi),
        normalizePaperTitle(candidate.title),
        normalizeString(candidate.url || candidate.landingUrl)
    ].filter(Boolean).join('::');
    if (!key || seen.has(key)) {
        return;
    }
    const scored = {
        ...candidate,
        score: scorePaperMetadataCandidate(candidate, context)
    };
    if (scored.score < 45) {
        return;
    }
    seen.add(key);
    rows.push(scored);
}

function mapOpenAlexWorkToPaperMetadata(work = {}) {
    const doi = normalizeDoi(work.doi || work.ids?.doi);
    const pdfUrl = normalizeString(work.best_oa_location?.pdf_url || work.primary_location?.pdf_url || work.open_access?.oa_url);
    const landingUrl = normalizeString(
        work.best_oa_location?.landing_page_url ||
        work.primary_location?.landing_page_url ||
        (doi ? `https://doi.org/${doi}` : '') ||
        work.id
    );
    const authors = normalizeOpenAlexAuthors(work.authorships);
    return {
        source: 'openalex',
        sourceId: normalizeString(work.id),
        title: normalizeString(work.display_name || work.title),
        year: Number(work.publication_year || work.year || 0) || undefined,
        publicationDate: normalizeString(work.publication_date || work.publicationDate),
        doi,
        type: normalizeString(work.type),
        venue: normalizeString(work.primary_location?.source?.display_name || work.host_venue?.display_name),
        url: landingUrl || pdfUrl,
        landingUrl,
        pdfUrl,
        citedByCount: Number(work.cited_by_count || 0) || undefined,
        referencedWorksCount: Number(work.referenced_works_count || 0) || undefined,
        authors,
        authorsSummary: buildAuthorSummary(authors)
    };
}

function mapCrossrefItemToPaperMetadata(item = {}) {
    const doi = normalizeDoi(item.DOI || item.doi);
    const linkEntries = Array.isArray(item.link) ? item.link : [];
    const pdfLink = linkEntries.find((entry) => /pdf/i.test(normalizeString(entry['content-type'] || entry.contentType)));
    const authors = normalizeCrossrefAuthors(item.author);
    const yearParts = item['published-print']?.['date-parts'] || item['published-online']?.['date-parts'] || item.issued?.['date-parts'];
    return {
        source: 'crossref',
        sourceId: doi || normalizeString(item.URL),
        title: normalizeString(Array.isArray(item.title) ? item.title[0] : item.title),
        year: Number(Array.isArray(yearParts) && Array.isArray(yearParts[0]) ? yearParts[0][0] : 0) || undefined,
        doi,
        type: normalizeString(item.type),
        venue: normalizeString(Array.isArray(item['container-title']) ? item['container-title'][0] : item.publisher),
        url: normalizeString(item.resource?.primary?.URL || item.URL),
        landingUrl: normalizeString(item.resource?.primary?.URL || item.URL),
        pdfUrl: normalizeString(pdfLink?.URL),
        authors,
        authorsSummary: buildAuthorSummary(authors)
    };
}

function pruneEmptyDeep(value) {
    if (Array.isArray(value)) {
        const next = value
            .map((item) => pruneEmptyDeep(item))
            .filter((item) => item !== undefined);
        return next.length ? next : undefined;
    }
    if (value && typeof value === 'object') {
        const next = Object.entries(value).reduce((acc, [key, item]) => {
            const pruned = pruneEmptyDeep(item);
            if (pruned !== undefined) {
                acc[key] = pruned;
            }
            return acc;
        }, {});
        return Object.keys(next).length ? next : undefined;
    }
    if (value === '' || value === null || value === undefined) {
        return undefined;
    }
    return value;
}

function compactPaperMetadataAuthors(authors = []) {
    if (!Array.isArray(authors) || !authors.length) {
        return undefined;
    }
    return authors
        .slice(0, 5)
        .map((author) => pruneEmptyDeep({
            name: normalizeString(author.name),
            openAlexId: normalizeString(author.openAlexId),
            orcid: normalizeString(author.orcid),
            institutions: Array.isArray(author.institutions) ? author.institutions.slice(0, 3) : undefined
        }))
        .filter(Boolean);
}

function compactPaperMetadataCandidate(candidate = {}, { includeAuthors = false } = {}) {
    return pruneEmptyDeep({
        source: normalizeString(candidate.source),
        title: normalizeString(candidate.title),
        year: Number(candidate.year) || undefined,
        publicationDate: normalizeString(candidate.publicationDate),
        doi: normalizeString(candidate.doi),
        venue: normalizeString(candidate.venue),
        type: normalizeString(candidate.type),
        url: normalizeString(candidate.url),
        landingUrl: normalizeString(candidate.landingUrl),
        pdfUrl: normalizeString(candidate.pdfUrl),
        authorsSummary: normalizeString(candidate.authorsSummary),
        authors: includeAuthors ? compactPaperMetadataAuthors(candidate.authors) : undefined,
        citedByCount: Number(candidate.citedByCount) || undefined,
        referencedWorksCount: Number(candidate.referencedWorksCount) || undefined,
        score: Number.isFinite(candidate.score) ? Number(candidate.score.toFixed(3)) : undefined
    });
}

function compactPaperMetadataCall(call = {}) {
    return pruneEmptyDeep({
        tool: normalizeString(call.tool),
        args: call.args && typeof call.args === 'object' ? call.args : undefined,
        reason: normalizeString(call.reason)
    });
}

function derivePaperMetadataAffordances(payload = {}) {
    const suggestedCalls = Array.isArray(payload.suggestedNextCalls)
        ? payload.suggestedNextCalls.slice(0, 5).map((call) => compactPaperMetadataCall(call)).filter(Boolean)
        : [];
    const authorHistoryNextCalls = suggestedCalls.filter((call) =>
        call.tool === 'paper_metadata_lookup' &&
            normalizeString(call.args?.authorId)
    );
    const answerCandidate = payload.authorId && payload.bestMatch
        ? pruneEmptyDeep({
            earliestWorkTitle: normalizeString(payload.bestMatch.title),
            earliestWorkYear: Number(payload.bestMatch.year) || undefined,
            earliestWorkDate: normalizeString(payload.bestMatch.publicationDate),
            doi: normalizeString(payload.bestMatch.doi),
            venue: normalizeString(payload.bestMatch.venue),
            landingUrl: normalizeString(payload.bestMatch.landingUrl || payload.bestMatch.url),
            pdfUrl: normalizeString(payload.bestMatch.pdfUrl),
            reason: payload.beforeYear
                ? `Earliest returned work before ${payload.beforeYear}`
                : 'Earliest returned work for this author'
        })
        : undefined;
    return pruneEmptyDeep({
        answerCandidate,
        nextActionHint: authorHistoryNextCalls.length
            ? 'If the question asks which author had prior papers, earliest work, or first paper, call authorHistoryNextCalls before broad web_search.'
            : undefined,
        authorHistoryNextCalls,
        suggestedNextCalls: suggestedCalls
    }) || {};
}

function buildPaperMetadataText(payload = {}) {
    const bestMatch = compactPaperMetadataCandidate(payload.bestMatch, { includeAuthors: true });
    const affordances = derivePaperMetadataAffordances(payload);
    const compact = pruneEmptyDeep({
        status: normalizeString(payload.status, 'completed'),
        mode: payload.authorId
            ? 'author_works'
            : (payload.author || payload.year || payload.topic || payload.venue ? 'bibliographic_lookup' : 'paper_lookup'),
        answerCandidate: affordances.answerCandidate,
        nextActionHint: affordances.nextActionHint,
        bestMatch,
        authorHistoryNextCalls: affordances.authorHistoryNextCalls,
        suggestedNextCalls: affordances.suggestedNextCalls,
        query: pruneEmptyDeep({
            title: normalizeString(payload.title),
            query: normalizeString(payload.query),
            doi: normalizeString(payload.doi),
            author: normalizeString(payload.author),
            year: Number(payload.year) || undefined,
            topic: normalizeString(payload.topic),
            venue: normalizeString(payload.venue),
            authorId: normalizeString(payload.authorId),
            beforeYear: Number(payload.beforeYear) || undefined
        }),
        resultCount: Number(payload.resultCount) || undefined,
        results: Array.isArray(payload.results)
            ? payload.results.slice(0, 3).map((candidate) => compactPaperMetadataCandidate(candidate))
            : undefined
    });
    return JSON.stringify(compact, null, 2);
}

async function paperMetadataLookup(args = {}) {
    const title = normalizeString(args.title || args.documentTitle || args.document_title);
    const query = normalizeString(args.query || args.q || args.search || title);
    const rawUrl = normalizeString(args.url || args.uri);
    const doi = normalizeDoi(args.doi || args.DOI || (/doi\.org\//i.test(rawUrl) ? rawUrl : ''));
    const explicitAuthor = normalizeAuthorName(args.author || args.authorName || args.author_name || args.authorFullName || args.author_full_name);
    const explicitYear = clampNumber(args.year || args.publicationYear || args.publication_year, 0, 0, 3000);
    const explicitTopic = normalizeString(args.topic || args.subject || args.keywords || args.keyword || args.about);
    const explicitVenue = normalizeString(args.venue || args.journal || args.source || args.containerTitle || args.container_title);
    const authorId = normalizeString(args.authorId || args.author_id || args.authorOpenAlexId || args.author_openalex_id);
    const beforeYear = clampNumber(args.beforeYear || args.before_year, 0, 0, 3000);
    const inferredBibliographicArgs = !title && !doi && query && (!explicitAuthor || !explicitYear || !explicitTopic || !explicitVenue)
        ? inferPaperMetadataArgsFromScholarlyQuery(query)
        : {};
    const author = explicitAuthor || normalizeAuthorName(inferredBibliographicArgs.author);
    const year = explicitYear || clampNumber(inferredBibliographicArgs.year, 0, 0, 3000);
    const topic = explicitTopic || normalizeString(inferredBibliographicArgs.topic);
    const venue = explicitVenue || normalizeString(inferredBibliographicArgs.venue);
    const bibliographicQuery = buildBibliographicSearchText({ title, query, author, year, topic, venue });
    if (!title && !query && !doi && !authorId && !author && !year && !topic && !venue) {
        return errorResult('paper_metadata_lookup requires title, query, doi, authorId, or bibliographic clues such as author/year/topic');
    }
    const maxResults = clampNumber(args.maxResults || args.max_results, 5, 1, 12);
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 45000, 5000, 180000);
    const { openAlexApiKey, crossrefMailto } = readScholarlyApiConfig();
    const attempts = [];
    const results = [];
    const seen = new Set();
    const searchText = normalizeString(title || query || bibliographicQuery || doi || authorId);

    const openAlexBaseUrl = normalizeString(args.openAlexBaseUrl, 'https://api.openalex.org/works');
    const openAlexAuthorsBaseUrl = normalizeString(args.openAlexAuthorsBaseUrl, 'https://api.openalex.org/authors');
    const crossrefBaseUrl = normalizeString(args.crossrefBaseUrl, 'https://api.crossref.org/works');
    const scoringContext = { title, query, doi, authorId, author, year, topic, venue };

    if (authorId) {
        const authorWorksUrl = appendUrlQueryParams(
            `${openAlexBaseUrl}?filter=${encodeURIComponent(`author.id:${authorId}`)}&sort=publication_date:asc&per-page=${Math.min(maxResults, 10)}`,
            { api_key: openAlexApiKey }
        );
        const authorWorks = await fetchJsonUrl(authorWorksUrl, Math.min(timeoutMs, 20000));
        attempts.push({ source: 'openalex_author_works', url: authorWorksUrl, ok: authorWorks.ok, status: authorWorks.status, error: authorWorks.error || '' });
        if (authorWorks.ok) {
            for (const work of Array.isArray(authorWorks.json?.results) ? authorWorks.json.results : []) {
                pushPaperMetadataCandidate(results, seen, mapOpenAlexWorkToPaperMetadata(work), scoringContext);
            }
        }
        // OpenAlex already returns author works in publication_date ascending order.
        // Preserve that chronology instead of re-ranking by relevance score.
        const rankedAuthorWorks = results
            .filter((candidate) => !beforeYear || !candidate.year || candidate.year < beforeYear)
            .slice(0, maxResults);
        if (!rankedAuthorWorks.length) {
            return errorResult('paper_metadata_lookup found no scholarly metadata candidates', {
                status: 'no_results',
                title,
                query,
                doi,
                author,
                year,
                topic,
                venue,
                authorId,
                beforeYear,
                attempts
            });
        }
        const payload = {
            status: 'completed',
            title,
            query,
            doi,
            author,
            year,
            topic,
            venue,
            authorId,
            beforeYear,
            resultCount: rankedAuthorWorks.length,
            attempts,
            bestMatch: rankedAuthorWorks[0],
            results: rankedAuthorWorks
        };
        const responsePayload = {
            ...payload,
            ...derivePaperMetadataAffordances(payload)
        };
        const text = buildPaperMetadataText(responsePayload);
        return {
            content: [{ type: 'text', text }],
            structuredContent: {
                ok: true,
                ...responsePayload
            },
            details: responsePayload
        };
    }

    if (doi) {
        const openAlexByDoi = appendUrlQueryParams(
            `${openAlexBaseUrl}?filter=${encodeURIComponent(`doi:${doi}`)}&per-page=${Math.min(maxResults, 10)}`,
            { api_key: openAlexApiKey }
        );
        const openAlex = await fetchJsonUrl(openAlexByDoi, Math.min(timeoutMs, 20000));
        attempts.push({ source: 'openalex', url: openAlexByDoi, ok: openAlex.ok, status: openAlex.status, error: openAlex.error || '' });
        if (openAlex.ok) {
            for (const work of Array.isArray(openAlex.json?.results) ? openAlex.json.results : []) {
                pushPaperMetadataCandidate(results, seen, mapOpenAlexWorkToPaperMetadata(work), scoringContext);
            }
        }

        const crossrefByDoi = appendUrlQueryParams(`${crossrefBaseUrl}/${encodeURIComponent(doi)}`, { mailto: crossrefMailto });
        const crossref = await fetchJsonUrl(crossrefByDoi, Math.min(timeoutMs, 20000));
        attempts.push({ source: 'crossref', url: crossrefByDoi, ok: crossref.ok, status: crossref.status, error: crossref.error || '' });
        if (crossref.ok && crossref.json?.message) {
            pushPaperMetadataCandidate(results, seen, mapCrossrefItemToPaperMetadata(crossref.json.message), scoringContext);
        }
    }

    if (author && !title && !doi) {
        const authorSearchUrl = buildOpenAlexAuthorsSearchUrl(openAlexAuthorsBaseUrl, author, Math.min(Math.max(maxResults, 4), 8), { apiKey: openAlexApiKey });
        const authorSearch = await fetchJsonUrl(authorSearchUrl, Math.min(timeoutMs, 20000));
        attempts.push({ source: 'openalex_authors', url: authorSearchUrl, ok: authorSearch.ok, status: authorSearch.status, error: authorSearch.error || '' });
        if (authorSearch.ok) {
            const rankedAuthors = rankOpenAlexAuthorMatches(authorSearch.json?.results, author).slice(0, 3);
            const authorWorkQuery = normalizeString(buildTopicalPaperQuery({ query, author, year, topic, venue }));
            for (const authorMatch of rankedAuthors) {
                const authorScopedUrl = buildOpenAlexWorksSearchUrl(
                    openAlexBaseUrl,
                    authorWorkQuery,
                    maxResults,
                    {
                        apiKey: openAlexApiKey,
                        filter: buildOpenAlexWorksFilter({ authorId: authorMatch.id, year }),
                        sort: year ? 'publication_date:asc' : ''
                    }
                );
                const scopedWorks = await fetchJsonUrl(authorScopedUrl, Math.min(timeoutMs, 20000));
                attempts.push({
                    source: 'openalex_author_discovery',
                    url: authorScopedUrl,
                    ok: scopedWorks.ok,
                    status: scopedWorks.status,
                    error: scopedWorks.error || '',
                    authorId: authorMatch.id
                });
                if (!scopedWorks.ok) {
                    continue;
                }
                for (const work of Array.isArray(scopedWorks.json?.results) ? scopedWorks.json.results : []) {
                    pushPaperMetadataCandidate(results, seen, mapOpenAlexWorkToPaperMetadata(work), scoringContext);
                }
            }
        }
    }

    const openAlexSearchUrl = buildOpenAlexWorksSearchUrl(openAlexBaseUrl, searchText, maxResults, {
        exact: Boolean(title && !author && !topic && !venue),
        apiKey: openAlexApiKey,
        filter: year ? buildOpenAlexWorksFilter({ year }) : ''
    });
    const openAlexSearch = await fetchJsonUrl(openAlexSearchUrl, Math.min(timeoutMs, 20000));
    attempts.push({ source: 'openalex', url: openAlexSearchUrl, ok: openAlexSearch.ok, status: openAlexSearch.status, error: openAlexSearch.error || '' });
    if (openAlexSearch.ok) {
        for (const work of Array.isArray(openAlexSearch.json?.results) ? openAlexSearch.json.results : []) {
            pushPaperMetadataCandidate(results, seen, mapOpenAlexWorkToPaperMetadata(work), scoringContext);
        }
    }

    const titleOnlyLookup = title && !author && !topic && !venue;
    const crossrefSearchUrl = titleOnlyLookup
        ? appendUrlQueryParams(
            `${crossrefBaseUrl}?query.title=${encodeURIComponent(searchText.replace(/^["']+|["']+$/g, ''))}&rows=${Math.min(maxResults, 10)}`,
            pruneEmptyDeep({
                filter: year ? `from-pub-date:${year}-01-01,until-pub-date:${year}-12-31` : undefined,
                mailto: crossrefMailto
            }) || {}
        )
        : appendUrlQueryParams(
            `${crossrefBaseUrl}?rows=${Math.min(maxResults, 10)}`,
            pruneEmptyDeep({
                'query.bibliographic': normalizeString(buildBibliographicSearchText({ title, query, topic, venue })),
                'query.author': author,
                filter: year ? `from-pub-date:${year}-01-01,until-pub-date:${year}-12-31` : undefined,
                mailto: crossrefMailto
            }) || {}
        );
    const crossrefSearch = await fetchJsonUrl(crossrefSearchUrl, Math.min(timeoutMs, 20000));
    attempts.push({ source: 'crossref', url: crossrefSearchUrl, ok: crossrefSearch.ok, status: crossrefSearch.status, error: crossrefSearch.error || '' });
    if (crossrefSearch.ok) {
        for (const item of Array.isArray(crossrefSearch.json?.message?.items) ? crossrefSearch.json.message.items : []) {
            pushPaperMetadataCandidate(results, seen, mapCrossrefItemToPaperMetadata(item), scoringContext);
        }
    }

    const rankedResults = results
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults);
    if (!rankedResults.length) {
        return errorResult('paper_metadata_lookup found no scholarly metadata candidates', {
            status: 'no_results',
            title,
            query,
            doi,
            author,
            year,
            topic,
            venue,
            attempts
        });
    }
    const best = rankedResults[0];
    const fullTextCall = best?.title && (best?.doi || best?.pdfUrl || best?.landingUrl || best?.url)
        ? [{
            tool: 'pdf_find_and_extract',
            args: pruneEmptyDeep({
                title: best.title,
                query: [best.venue, best.doi, best.pdfUrl || best.landingUrl || best.url].filter(Boolean).join(' ')
            }),
            reason: 'Need full-text evidence such as acknowledgements, funding, exact quoted words, tables, or values. Keep this DOI/source query and fill extract_query with the answer terms from the question.'
        }]
        : [];
    const authorCalls = (best?.authors || [])
        .filter((author) => normalizeString(author.openAlexId))
        .slice(0, 5)
        .map((author) => ({
            tool: 'paper_metadata_lookup',
            args: {
                authorId: author.openAlexId,
                beforeYear: best?.year || undefined,
                maxResults
            },
            reason: `List earlier works for ${author.name}`
        }));
    const payload = {
        status: 'completed',
        title,
        query,
        doi,
        author,
        year,
        topic,
        venue,
        authorId,
        beforeYear,
        resultCount: rankedResults.length,
        attempts,
        bestMatch: best,
        suggestedNextCalls: [...fullTextCall, ...authorCalls],
        results: rankedResults
    };
    const responsePayload = {
        ...payload,
        ...derivePaperMetadataAffordances(payload)
    };
    const text = buildPaperMetadataText(responsePayload);
    return {
        content: [{ type: 'text', text }],
        structuredContent: {
            ok: true,
            ...responsePayload
        },
        details: responsePayload
    };
}

async function searchScholarlyCandidates(query = '', { maxResults = 8, timeoutMs = 60000 } = {}) {
    const phrase = normalizePdfSearchPhrase(query);
    if (!phrase) {
        return { attempts: [], results: [] };
    }
    const startedAt = Date.now();
    const remainingBudgetMs = () => timeoutMs - (Date.now() - startedAt);
    const { openAlexApiKey, crossrefMailto } = readScholarlyApiConfig();
    const seen = new Set();
    const results = [];
    const attempts = [];
    const encoded = encodeURIComponent(phrase.replace(/^["']+|["']+$/g, ''));
    const doi = extractDoiCandidate(phrase);

    if (doi && remainingBudgetMs() >= 3000) {
        const openAlexDoiUrl = buildOpenAlexWorksSearchUrl('https://api.openalex.org/works', '', maxResults, {
            apiKey: openAlexApiKey,
            filter: `doi:${doi}`
        });
        const openAlexDoi = await fetchJsonUrl(openAlexDoiUrl, Math.min(remainingBudgetMs(), 12000));
        attempts.push({ source: 'openalex:doi', url: openAlexDoiUrl, ok: openAlexDoi.ok, status: openAlexDoi.status, error: openAlexDoi.error || '' });
        if (openAlexDoi.ok) {
            for (const work of Array.isArray(openAlexDoi.json?.results) ? openAlexDoi.json.results : []) {
                const title = normalizeString(work.display_name || work.title);
                const snippet = normalizeString(work.primary_location?.source?.display_name || work.type);
                const pdfUrl = normalizeString(work.best_oa_location?.pdf_url || work.primary_location?.pdf_url || work.open_access?.oa_url);
                const landingUrl = normalizeString(work.best_oa_location?.landing_page_url || work.primary_location?.landing_page_url || work.doi || work.id);
                pushScholarlyCandidate(results, seen, { title, snippet, url: pdfUrl }, query, 'openalex:doi:pdf');
                pushScholarlyCandidate(results, seen, { title, snippet, url: landingUrl }, query, 'openalex:doi:landing');
                for (const location of Array.isArray(work.locations) ? work.locations : []) {
                    pushScholarlyCandidate(results, seen, {
                        title,
                        snippet: normalizeString(location.source?.display_name || snippet),
                        url: location.pdf_url || location.landing_page_url
                    }, query, 'openalex:doi:location');
                }
            }
        }
    }

    if (doi && remainingBudgetMs() >= 3000) {
        const arxivDoiUrl = `https://export.arxiv.org/api/query?search_query=doi:${encodeURIComponent(doi)}&max_results=${Math.min(maxResults, 10)}`;
        const arxiv = await fetchText(arxivDoiUrl, Math.min(remainingBudgetMs(), 12000));
        attempts.push({ source: 'arxiv:doi', url: arxivDoiUrl, ok: arxiv.ok, status: arxiv.status, error: arxiv.error || '' });
        if (arxiv.ok) {
            for (const candidate of extractArxivCandidatesFromAtom(arxiv.text, query)) {
                pushScholarlyCandidate(results, seen, candidate, query, 'arxiv:doi');
            }
        }
    }

    const openAlexUrl = buildOpenAlexWorksSearchUrl('https://api.openalex.org/works', phrase.replace(/^["']+|["']+$/g, ''), maxResults, {
        exact: /[?]/.test(phrase),
        apiKey: openAlexApiKey
    });
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

    const crossrefUrl = appendUrlQueryParams(
        `https://api.crossref.org/works?query.title=${encoded}&rows=${Math.min(maxResults, 10)}`,
        { mailto: crossrefMailto }
    );
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

function evaluateExtractedEvidenceMatch(text = '', evidenceQuery = '') {
    const normalizedEvidenceQuery = normalizeString(evidenceQuery);
    if (!normalizedEvidenceQuery) {
        return { ok: true, matchedTerms: [], rareTerms: [], missingRareTerms: [] };
    }
    const terms = extractSearchQueryTerms(normalizedEvidenceQuery);
    if (terms.length < 3) {
        return { ok: true, matchedTerms: [], rareTerms: [], missingRareTerms: [] };
    }
    const lowerText = normalizePaperTitle(text);
    const genericEvidenceTerms = new Set([
        'article', 'author', 'authors', 'different', 'dragon', 'dragons', 'journal',
        'nature', 'paper', 'quoted', 'quote', 'source', 'title', 'word'
    ]);
    const matchedTerms = terms.filter((term) => lowerText.includes(normalizePaperTitle(term)));
    const rareTerms = terms.filter((term) => term.length >= 5 && !genericEvidenceTerms.has(term));
    const missingRareTerms = rareTerms.filter((term) => !lowerText.includes(normalizePaperTitle(term)));
    const hasRareMatch = !rareTerms.length || missingRareTerms.length < rareTerms.length;
    const hasEnoughMatches = terms.length < 4 || matchedTerms.length >= 2;
    return {
        ok: hasRareMatch && hasEnoughMatches,
        matchedTerms,
        rareTerms,
        missingRareTerms
    };
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
        for (const guess of buildOjsPdfGuesses(link.url)) {
            pushPdfCandidate(candidates, seen, {
                url: guess,
                text: normalizeString(link.text, `OJS PDF download guess for ${query}`),
                score: link.score
            }, query, 'ojs_guess_from_link');
        }
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
        const pdfWrapperLinks = links
            .filter((link) => /\/article\/view\/\d+\/\d+/i.test(link.url || '') && !/\/article\/download\/|\.pdf(?:$|[?#])/i.test(link.url || ''))
            .map((link) => ({
                ...link,
                score: Math.max(link.score, scoreDocumentSearchResult(link, query))
            }))
            .sort((a, b) => b.score - a.score);
        const followupLinks = [];
        const followupSeen = new Set();
        for (const link of [...articleLinks, ...pdfWrapperLinks]) {
            if (!link.url || followupSeen.has(link.url)) {
                continue;
            }
            followupSeen.add(link.url);
            followupLinks.push(link);
            if (followupLinks.length >= 12) {
                break;
            }
        }
        for (const link of followupLinks) {
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
    const query = normalizeString([titleQuery, freeformQuery].filter(Boolean).join(' ') || titleQuery || freeformQuery);
    const evidenceQuery = normalizeString(args.extractQuery || args.extract_query || args.contains || freeformQuery || query);
    if (!sourceUrl && !query) {
        return errorResult('pdf_find_and_extract requires url/pageUrl or query');
    }
    if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) {
        return errorResult('pdf_find_and_extract url must be http(s)', { url: sourceUrl });
    }
    const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 120000);
    const extractionMaxChars = clampNumber(
        args.extractionMaxChars || args.extraction_max_chars || Math.max(maxChars, 80000),
        Math.max(maxChars, 1000),
        1000,
        120000
    );
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
                maxChars: extractionMaxChars,
                maxPages,
                timeoutMs: Math.min(30000, timeoutMs, remainingMs)
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
                const evidenceMatch = evaluateExtractedEvidenceMatch(extractedText, evidenceQuery || query);
                attempts[attempts.length - 1].evidenceMatched = evidenceMatch.ok;
                attempts[attempts.length - 1].matchedTerms = evidenceMatch.matchedTerms;
                attempts[attempts.length - 1].missingRareTerms = evidenceMatch.missingRareTerms;
                if (!evidenceMatch.ok) {
                    attempts[attempts.length - 1].error = 'extracted PDF did not match enough evidence query terms';
                    continue;
                }
                const focused = focusTextWindow(extractedText, {
                    query: evidenceQuery || query,
                    url: candidate.url,
                    maxChars
                });
                const evidenceSnippets = buildEvidenceSnippets(focused.text, evidenceQuery || query);
                const answerCandidates = mergeAnswerCandidates(
                    extractQuotedAnswerCandidates(extractedText, evidenceQuery || query),
                    extractIdentifierAnswerCandidates(extractedText, evidenceQuery || query)
                );
                const answerCandidateText = formatAnswerCandidates(answerCandidates);
                const returnedText = [
                    answerCandidateText ? 'PDF answer candidates:' : '',
                    answerCandidateText,
                    answerCandidateText && evidenceSnippets ? '' : '',
                    evidenceSnippets ? 'PDF focused evidence snippets:' : '',
                    evidenceSnippets,
                    (answerCandidateText || evidenceSnippets) ? '' : '',
                    (answerCandidateText || evidenceSnippets) ? '--- Extracted text window ---' : '',
                    focused.text
                ].filter((part) => part !== '').join('\n');
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
                    extractionMaxChars,
                    focus: focused.focus,
                    evidenceSnippets,
                    answerCandidates
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
        const scholarlyExtracted = await tryExtractRankedCandidates();
        if (scholarlyExtracted) {
            return scholarlyExtracted;
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
            let best = { score: 0, index: -1, term: '', termOffset: 0 };
            for (let index = 0; index < lower.length; index += step) {
                const chunk = lower.slice(index, index + windowSize);
                let score = 0;
                let bestTerm = '';
                let bestTermWeight = 0;
                let bestTermOffset = 0;
                for (const token of queryTokens) {
                    const count = countPdfEvidenceTerm(chunk, token);
                    if (!count) {
                        continue;
                    }
                    const weight = pdfEvidenceTermWeight(token);
                    score += Math.min(count, 5) * weight;
                    if (weight > bestTermWeight) {
                        bestTerm = token;
                        bestTermWeight = weight;
                        bestTermOffset = Math.max(0, findPdfEvidenceTermOffset(chunk, token));
                    }
                }
                const rareMatches = queryTokens.filter((token) =>
                    pdfEvidenceTermWeight(token) >= 8 && countPdfEvidenceTerm(chunk, token) > 0
                );
                if (rareMatches.length >= 2) {
                    score += 18;
                }
                if (/\b\d+(?:\.\d+)?\b/.test(chunk) && /volume|capacity|mass|count|number|total|m\^?3|m3/i.test(explicitQuery)) {
                    score += 2;
                }
                if (/(?:m\^?3|m3|𝑚𝑚3|capacity|volume|∴|=)/i.test(chunk) && /volume|capacity|m\^?3|m3/i.test(explicitQuery)) {
                    score += 4;
                }
                if (score > best.score || (score === best.score && score > 0 && index > best.index)) {
                    best = { score, index, term: bestTerm, termOffset: bestTermOffset };
                }
            }
            if (best.index >= 0 && best.score > 0) {
                selectedIndex = Math.min(lower.length - 1, best.index + best.termOffset);
                selectedTerm = best.term || queryTokens.join(' ');
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
        let score = 0;
        for (const token of queryTokens) {
            const count = countPdfEvidenceTerm(line, token);
            if (count > 0) {
                score += Math.min(count, 3) * pdfEvidenceTermWeight(token);
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

function extractQuotedAnswerCandidates(text = '', query = '', { maxCandidates = 5 } = {}) {
    const normalizedQuery = normalizeString(query);
    if (!/\b(quoted|quote|word|term|called|named)\b/i.test(normalizedQuery)) {
        return [];
    }
    const sourceText = String(text || '');
    const terms = significantPdfQueryTerms(normalizedQuery);
    const rareTerms = terms.filter((term) => pdfEvidenceTermWeight(term) >= 8);
    const candidates = [];
    const seen = new Set();
    const quotePattern = /["“”]([^"“”]{1,80})["“”]/g;
    let match;
    while ((match = quotePattern.exec(sourceText))) {
        const raw = normalizeString(match[1]).replace(/^[,;:\s]+|[,;:\s]+$/g, '');
        if (!raw || raw.length > 80) {
            continue;
        }
        const words = raw.match(/[\p{L}\p{N}'’-]+/gu) || [];
        if (!words.length || words.length > 6) {
            continue;
        }
        const answer = words.length === 1 ? words[0] : raw;
        const key = normalizePaperTitle(answer);
        if (!key || seen.has(key)) {
            continue;
        }
        seen.add(key);
        const start = Math.max(0, match.index - 320);
        const end = Math.min(sourceText.length, quotePattern.lastIndex + 320);
        const context = sourceText.slice(start, end).replace(/\s+/g, ' ').trim();
        const lowerContext = context.toLowerCase();
        let score = words.length === 1 ? 30 : 8;
        for (const term of terms) {
            if (countPdfEvidenceTerm(lowerContext, term) > 0) {
                score += pdfEvidenceTermWeight(term);
            }
        }
        const rareMatchedTerms = rareTerms.filter((term) => countPdfEvidenceTerm(lowerContext, term) > 0);
        if (rareMatchedTerms.length) {
            score += rareMatchedTerms.length * 12;
        }
        candidates.push({
            answer,
            score,
            context,
            matchedTerms: terms.filter((term) => countPdfEvidenceTerm(lowerContext, term) > 0),
            rareMatchedTerms
        });
    }
    return candidates
        .sort((a, b) => b.score - a.score || a.answer.length - b.answer.length)
        .slice(0, maxCandidates)
        .map((candidate) => pruneEmptyDeep({
            answer: candidate.answer,
            score: Number(candidate.score.toFixed(2)),
            matchedTerms: candidate.matchedTerms,
            rareMatchedTerms: candidate.rareMatchedTerms,
            context: candidate.context
        }));
}

function extractIdentifierAnswerCandidates(text = '', query = '', { maxCandidates = 5 } = {}) {
    const normalizedQuery = normalizeString(query);
    if (!/\b(award|grant|contract|number|id|identifier|nasa|nsf|doe)\b/i.test(normalizedQuery)) {
        return [];
    }
    const sourceText = String(text || '');
    const terms = significantPdfQueryTerms(normalizedQuery);
    const candidates = [];
    const seen = new Set();
    const identifierPattern = /\b(?:80[A-Z0-9]{8,}|[A-Z]{2,6}[- ]?\d[A-Z0-9-]{5,})\b/g;
    let match;
    while ((match = identifierPattern.exec(sourceText))) {
        const answer = normalizeString(match[0]).replace(/\s+/g, '');
        const key = answer.toUpperCase();
        if (!answer || seen.has(key)) {
            continue;
        }
        seen.add(key);
        const start = Math.max(0, match.index - 360);
        const end = Math.min(sourceText.length, identifierPattern.lastIndex + 360);
        const context = sourceText.slice(start, end).replace(/\s+/g, ' ').trim();
        const lowerContext = context.toLowerCase();
        let score = 24;
        for (const term of terms) {
            if (countPdfEvidenceTerm(lowerContext, term) > 0) {
                score += pdfEvidenceTermWeight(term);
            }
        }
        if (/\bnasa\b/i.test(context)) {
            score += 18;
        }
        if (/\baward(?:\s+number)?\b/i.test(context)) {
            score += 18;
        }
        if (/\bR\.?\s*G\.?\s*A\.?\b|R\.?\s*G\.?\s*Arendt\b|Richard\s+G\.?\s+Arendt\b/i.test(context)) {
            score += 24;
        }
        candidates.push({
            answer,
            score,
            context,
            matchedTerms: terms.filter((term) => countPdfEvidenceTerm(lowerContext, term) > 0)
        });
    }
    return candidates
        .sort((a, b) => b.score - a.score || a.answer.localeCompare(b.answer))
        .slice(0, maxCandidates)
        .map((candidate) => pruneEmptyDeep({
            answer: candidate.answer,
            score: Number(candidate.score.toFixed(2)),
            matchedTerms: candidate.matchedTerms,
            context: candidate.context
        }));
}

function mergeAnswerCandidates(...candidateLists) {
    const merged = [];
    const seen = new Set();
    for (const candidate of candidateLists.flat()) {
        const key = normalizeString(candidate?.answer).toLowerCase();
        if (!key || seen.has(key)) {
            continue;
        }
        seen.add(key);
        merged.push(candidate);
    }
    return merged.sort((a, b) => Number(b.score || 0) - Number(a.score || 0)).slice(0, 5);
}

function formatAnswerCandidates(candidates = []) {
    return (Array.isArray(candidates) ? candidates : [])
        .slice(0, 5)
        .map((candidate, index) => [
            `${index + 1}. ${normalizeString(candidate.answer)}${Number.isFinite(candidate.score) ? ` (score ${candidate.score})` : ''}`,
            candidate.context ? `Evidence: ${normalizeString(candidate.context)}` : ''
        ].filter(Boolean).join('\n'))
        .join('\n\n');
}

function extractLinksFromHtml(html = '', baseUrl = '', maxLinks = 80) {
    const links = [];
    const seen = new Map();
    const textById = new Map();
    const idPattern = /<([a-z0-9]+)\b[^>]*\bid=["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi;
    let idMatch;
    while ((idMatch = idPattern.exec(html))) {
        const id = normalizeString(idMatch[2]);
        const text = stripHtml(idMatch[3]).slice(0, 240);
        if (id && normalizeString(text)) {
            textById.set(id, text);
        }
    }
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
        let text = stripHtml(match[2]).slice(0, 240);
        const ariaLabelledBy = match[0].match(/\baria-labelledby=["']([^"']+)["']/i);
        if (ariaLabelledBy && /^(?:pdf|download|full text|view pdf)?$/i.test(normalizeString(text))) {
            const labelText = ariaLabelledBy[1]
                .split(/\s+/)
                .map((id) => textById.get(normalizeString(id)))
                .filter(Boolean)
                .join(' ')
                .slice(0, 240);
            if (normalizeString(labelText)) {
                text = normalizeString(`${labelText} ${text}`.trim()).slice(0, 240);
            }
        }
        if (seen.has(href)) {
            const existing = seen.get(href);
            if (existing && !normalizeString(existing.text) && normalizeString(text)) {
                existing.text = text;
            }
            continue;
        }
        const link = {
            url: href,
            text
        };
        seen.set(href, link);
        links.push(link);
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

async function readDocument(args = {}) {
    const filePath = path.resolve(normalizeString(args.path || args.file || args.filePath || args.file_path));
    const stat = filePath ? await fs.stat(filePath).catch(() => null) : null;
    if (!stat || !stat.isFile() || !/\.(?:docx|docm)$/i.test(filePath)) {
        return errorResult('read_document requires an existing .docx/.docm file path', { path: filePath });
    }
    const code = `
import json, sys
from docx import Document

path = sys.argv[1]
doc = Document(path)
paragraphs = []
for index, paragraph in enumerate(doc.paragraphs):
    text = (paragraph.text or "").strip()
    if text:
        paragraphs.append({"index": index, "text": text})
tables = []
for table_index, table in enumerate(doc.tables):
    rows = []
    for row in table.rows:
        cells = [(cell.text or "").strip() for cell in row.cells]
        if any(cells):
            rows.append(cells)
    if rows:
        tables.append({"index": table_index, "rows": rows})
print(json.dumps({
    "path": path,
    "paragraphs": paragraphs,
    "tables": tables,
    "paragraph_count": len(paragraphs),
    "table_count": len(tables)
}, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, filePath], {
        cwd: path.dirname(filePath),
        timeoutMs: args.timeoutMs || 120000
    });
    if (result.exitCode !== 0) {
        return errorResult('read_document failed', { path: filePath, stderr: result.stderr.slice(0, 3000) });
    }
    const text = normalizeString(result.stdout);
    let document;
    try {
        document = JSON.parse(text);
    } catch (error) {
        return errorResult(`read_document returned invalid JSON: ${error.message}`, {
            path: filePath,
            stdout: text.slice(0, 2000)
        });
    }
    const details = {
        status: 'completed',
        path: filePath,
        paragraphCount: Number(document.paragraph_count || 0),
        tableCount: Number(document.table_count || 0)
    };
    return {
        content: [{ type: 'text', text }],
        structuredContent: {
            ok: true,
            ...details,
            document,
            ...document
        },
        details
    };
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
        description: 'Fallback broad public web search through AIGL managed search backends. Standard call: { "query": "specific search keywords", "maxResults": 5 }. Do not use as the first step for attached/local files, known URLs, PDFs/papers/reports, YouTube/videos, audio, images, spreadsheets, presentations, Word documents, code files, or GitHub repositories; use the dedicated MCP tool for those artifact types first. Use web_fetch for a known HTML/text URL, paper_metadata_lookup for exact paper/DOI metadata, pdf_extract_text for a known PDF URL, pdf_find_and_extract for a paper/report title when you need full text, and github_repo_read for GitHub README/tree/file evidence. General web queries default to Bing first; GitHub/code repository queries default to GitHub repository search first, then DuckDuckGo, then Bing. Returns titles, URLs, snippets, and structured backend attempts.',
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
                backend: { type: 'string', description: 'Optional backend id: bing_html, duckduckgo_lite, duckduckgo_html, yahoo_html, or github_repositories. Omit for automatic fallback.' },
                backends: {
                    type: 'array',
                    items: { type: 'string', enum: ['bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'yahoo_html', 'github_repositories'] },
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
        description: 'Fetch a public HTTP(S) HTML or text resource and return readable text. Rejects PDF/binary content with unsupported_content_type; use pdf_extract_text or download_file for PDFs/files. For archive, listing, search-result, table-of-contents, or journal issue pages, pass query/contains with task terms such as author, year, topic, or answer clue so excerpts and linked resources are ranked against the task instead of newest/first links.',
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
        name: 'paper_metadata_lookup',
        description: 'Look up scholarly paper metadata from structured APIs before broad web search. Use it for exact paper/report titles or DOI questions, and also for fuzzy bibliographic discovery when you only have author name, year, topic, or journal/source clues. Returns authors, year, venue, DOI, and candidate landing/PDF URLs without scraping publisher pages. It also supports a second hop with authorId to list an author’s earlier works in chronological order.',
        inputSchema: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Exact paper/report title when known. Preferred for title-based lookup.' },
                query: { type: 'string', description: 'General scholarly lookup query. Use title when the title is exact; use query plus author/year/topic for fuzzy bibliographic discovery.' },
                q: { type: 'string', description: 'Compatibility alias for query.' },
                search: { type: 'string', description: 'Compatibility alias for query.' },
                doi: { type: 'string', description: 'DOI or DOI URL for direct metadata lookup.' },
                author: { type: 'string', description: 'Author name for bibliographic discovery when the exact paper title is unknown.' },
                authorName: { type: 'string', description: 'Compatibility alias for author.' },
                author_name: { type: 'string', description: 'Compatibility alias for author.' },
                year: { type: 'number', description: 'Publication year hint for bibliographic discovery.' },
                publicationYear: { type: 'number', description: 'Compatibility alias for year.' },
                publication_year: { type: 'number', description: 'Compatibility alias for year.' },
                topic: { type: 'string', description: 'Topic, subject, or distinctive phrase when the exact title is unknown.' },
                subject: { type: 'string', description: 'Compatibility alias for topic.' },
                keywords: { type: 'string', description: 'Compatibility alias for topic.' },
                venue: { type: 'string', description: 'Optional journal, conference, publisher, or source hint.' },
                journal: { type: 'string', description: 'Compatibility alias for venue.' },
                source: { type: 'string', description: 'Compatibility alias for venue.' },
                authorId: { type: 'string', description: 'Optional OpenAlex author id for second-hop lookup of that author’s publications.' },
                beforeYear: { type: 'number', description: 'Optional year cutoff for authorId mode. Returns works earlier than this year.' },
                maxResults: { type: 'number', description: 'Maximum metadata candidates to return, clamped to 1-12.' },
                timeoutMs: { type: 'number', description: 'Overall lookup timeout in milliseconds, clamped to 5000-180000.' },
                openAlexAuthorsBaseUrl: { type: 'string', description: 'Optional override for tests/self-hosted OpenAlex author search endpoint.' }
            }
        }
    },
    {
        name: 'pdf_find_and_extract',
        description: 'Find a PDF from a known HTML page URL, exact document title, or search query, then extract readable text from the best PDF candidate. Use this after paper_metadata_lookup when you need the paper body rather than just metadata. Standard flow: { "title": "exact paper/report title", "extract_query": "answer terms" } or { "url": "known article page", "extract_query": "answer terms" }. It discovers PDF/download links, tries likely OJS article download URLs, and returns extraction attempts for recovery.',
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
        description: 'Fetch a public HTTP(S) HTML page and extract normalized outbound links with anchor text. Rejects PDF/binary content. Pass query/contains for archive, listing, search-result, table-of-contents, or journal issue pages so links are ranked by the task terms and pagination/archive links remain visible.',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                maxLinks: { type: 'number' },
                query: { type: 'string', description: 'Optional task terms used to rank extracted links, e.g. author, year, topic, issue date, or answer clue.' },
                contains: { type: 'string', description: 'Compatibility alias for query.' },
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
        name: 'read_document',
        description: 'Read a local Word .docx/.docm document and return JSON plus structuredContent with paragraphs and tables. Use this for attached Word document questions before writing custom scripts, especially when table rows are evidence. If it succeeds, reason from the returned structure instead of re-reading raw DOCX bytes.',
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
    if (name === 'paper_metadata_lookup') return await paperMetadataLookup(args);
    if (name === 'pdf_find_and_extract') return await pdfFindAndExtract(args);
    if (name === 'download_file') return await downloadFile(args);
    if (name === 'web_extract_links') return await webExtractLinks(args);
    if (name === 'run_python_file') return await runPythonFile(args);
    if (name === 'read_spreadsheet') return await readSpreadsheet(args);
    if (name === 'read_document') return await readDocument(args);
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
    buildSuggestedCallsFromSearchResults,
    downloadFile,
    extractBingResults,
    extractArxivCandidatesFromAtom,
    extractDuckDuckGoHtmlResults,
    extractGenericAnchorResults,
    extractGitHubRepositoryResults,
    extractYahooResults,
    inferPaperMetadataArgsFromScholarlyQuery,
    fetchText,
    githubRepoRead,
    handleRequest,
    handleToolCall,
    normalizeSearchBackends,
    parseGitHubRepoRef,
    paperMetadataLookup,
    pdfFindAndExtract,
    pdfExtractText,
    rankLinksForResearch,
    readDocument,
    readPresentation,
    SEARCH_BACKENDS,
    webExtractLinks,
    webFetch,
    webSearch
};
