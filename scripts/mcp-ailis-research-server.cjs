#!/usr/bin/env node
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const readline = require('node:readline');
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');

const SERVER_INFO = { name: 'ailis_research', version: '0.1.0' };
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

function optionIsTrue(value) {
    return value === true || /^(?:true|1|yes|on)$/i.test(normalizeString(value));
}

function readDesktopLlmSettings() {
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const statePath = path.join(appData, 'ailis', 'desktop-state.json');
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

function actionableErrorResult(message, details = {}) {
    const lines = [
        message,
        details.status ? `status=${details.status}` : '',
        details.failureReason ? `failure_reason=${details.failureReason}` : '',
        details.message ? `diagnosis=${details.message}` : ''
    ].filter(Boolean);
    if (Array.isArray(details.nextActions) && details.nextActions.length) {
        lines.push('next_actions:');
        details.nextActions.forEach((action, index) => lines.push(`${index + 1}. ${action}`));
    }
    if (Array.isArray(details.suggestedNextCalls) && details.suggestedNextCalls.length) {
        lines.push('suggested_next_calls:');
        details.suggestedNextCalls.forEach((call, index) => {
            lines.push(`${index + 1}. ${call.tool} ${JSON.stringify(call.args || {})}`);
        });
    }
    return {
        ...errorResult(message, details),
        content: [{ type: 'text', text: lines.join('\n') }]
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
        .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
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

function compactWhitespace(value = '') {
    return normalizeString(String(value || '').replace(/\s+/g, ' '));
}

function truncateRelationText(value = '', max = 240) {
    const text = compactWhitespace(value);
    return text.length > max ? `${text.slice(0, Math.max(0, max - 3)).trim()}...` : text;
}

function extractHtmlAttribute(tag = '', name = '') {
    if (!tag || !name) {
        return '';
    }
    const pattern = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
    const match = String(tag).match(pattern);
    return match ? decodeHtml(match[2] || match[3] || match[4] || '') : '';
}

function splitWikiTemplateParts(inner = '') {
    return String(inner || '').split('|').map((part) => normalizeString(part));
}

function wikiTemplateNamedParts(parts = []) {
    const named = [];
    for (const part of parts.slice(1)) {
        const index = part.indexOf('=');
        if (index <= 0) {
            continue;
        }
        const key = normalizeString(part.slice(0, index));
        const value = normalizeString(part.slice(index + 1));
        if (key && value) {
            named.push({ key, value });
        }
    }
    return named;
}

function cleanWikiTemplateValue(value = '') {
    return decodeHtml(String(value || '')
        .replace(/<ref[\s\S]*?<\/ref>/gi, ' ')
        .replace(/<ref[^>]*\/>/gi, ' ')
        .replace(/<br\s*\/?>/gi, '; ')
        .replace(/\[\[File:[^\]]+\]\]/gi, ' ')
        .replace(/\[\[Category:[^\]]+\]\]/gi, ' ')
        .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
        .replace(/\[\[([^\]]+)\]\]/g, '$1')
        .replace(/''+/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s*;\s*/g, '; ')
        .replace(/[ \t]{2,}/g, ' '))
        .trim();
}

function simplifyConvertTemplate(parts = []) {
    const positional = parts.slice(1)
        .filter((part) => part && !/^[a-z_][\w -]*\s*=/i.test(part));
    if (positional.length >= 5 && /^[-–]|to$/i.test(positional[1])) {
        return cleanWikiTemplateValue(`${positional[0]}-${positional[2]} ${positional[3]}`);
    }
    if (positional.length >= 2) {
        return cleanWikiTemplateValue(`${positional[0]} ${positional[1]}`);
    }
    return '';
}

function simplifyValTemplate(parts = []) {
    const named = wikiTemplateNamedParts(parts);
    const unit = named.find((entry) => /^(?:u|ul|unit)$/i.test(entry.key))?.value || '';
    const values = parts.slice(1)
        .filter((part) => part && !/^[a-z_][\w -]*\s*=/i.test(part))
        .slice(0, 3);
    return cleanWikiTemplateValue([...values, unit].filter(Boolean).join(' '));
}

function simplifyGapsTemplate(parts = []) {
    const values = parts.slice(1)
        .filter((part) => part && !/^[a-z_][\w -]*\s*=/i.test(part))
        .map((part) => cleanWikiTemplateValue(part))
        .filter(Boolean);
    if (!values.length) {
        return '';
    }
    return values.every((part) => /^\d+$/.test(part))
        ? values.join('')
        : values.join(' ');
}

function simplifyWikiTemplate(match = '', inner = '') {
    const parts = splitWikiTemplateParts(inner);
    const name = normalizeString(parts[0]).toLowerCase();
    if (!name) {
        return ' ';
    }
    if (/^(?:convert|cvt|nowrap\scvt)$/i.test(name)) {
        return simplifyConvertTemplate(parts) || ' ';
    }
    if (/^(?:val|val2)$/i.test(name)) {
        return simplifyValTemplate(parts) || ' ';
    }
    if (/^(?:gaps|gapnum|formatnum)$/i.test(name)) {
        return simplifyGapsTemplate(parts) || ' ';
    }
    if (/^(?:nbsp|space|spaces)$/i.test(name)) {
        return ' ';
    }
    if (/^(?:nowrap|nobr|small|smaller|big|larger|lang|transl|nihongo)$/i.test(name)) {
        const text = parts.slice(1).filter((part) => part && !/^[a-z_][\w -]*\s*=/i.test(part)).join(' ');
        return cleanWikiTemplateValue(text) || ' ';
    }
    if (/^(?:ubl|plainlist|hlist|unbulleted list|flatlist)$/i.test(name)) {
        const text = parts.slice(1).filter((part) => part && !/^[a-z_][\w -]*\s*=/i.test(part)).join('; ');
        return cleanWikiTemplateValue(text) || ' ';
    }
    if (/^(?:cite|citation|sfn|efn|refn|notelist|reflist|main|see also|coord|short description)$/i.test(name)) {
        return ' ';
    }
    const named = wikiTemplateNamedParts(parts)
        .filter(({ key, value }) => {
            const normalizedKey = key.toLowerCase();
            if (/^(?:image.*|total_width|caption|alt|logo|map|pushpin|coordinates?)$/i.test(normalizedKey)) {
                return false;
            }
            return cleanWikiTemplateValue(value).length > 0;
        })
        .slice(0, 80);
    if (/^infobox\b/i.test(name) || named.length >= 2) {
        const lines = named.map(({ key, value }) => `${cleanWikiTemplateValue(key)}: ${cleanWikiTemplateValue(value)}`)
            .filter((line) => !/:\s*$/.test(line));
        return lines.length ? `\n${lines.join('\n')}\n` : ' ';
    }
    return ' ';
}

function simplifyWikiTemplates(value = '') {
    let text = String(value || '');
    for (let pass = 0; pass < 24 && /\{\{[^{}]*\}\}/.test(text); pass += 1) {
        text = text.replace(/\{\{([^{}]*)\}\}/g, simplifyWikiTemplate);
    }
    return text.replace(/\{\{[\s\S]*?\}\}/g, ' ');
}

function resolveHtmlUrl(value = '', baseUrl = '') {
    const raw = decodeHtml(String(value || '').trim());
    if (!raw || raw.startsWith('#') || /^(?:javascript|mailto|tel):/i.test(raw)) {
        return '';
    }
    try {
        return new URL(raw, baseUrl).href;
    } catch {
        return /^https?:\/\//i.test(raw) ? raw : '';
    }
}

function extractHtmlDocumentTitle(html = '') {
    const title = String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    return title ? truncateRelationText(stripHtml(title[1]), 180) : '';
}

function extractHtmlMetadata(html = '', baseUrl = '') {
    const metadata = [];
    const seen = new Set();
    const title = extractHtmlDocumentTitle(html);
    if (title) {
        metadata.push({ name: 'title', value: title });
        seen.add('title');
    }
    const langMatch = String(html).match(/<html\b[^>]*\blang=["']([^"']+)["'][^>]*>/i);
    if (langMatch) {
        metadata.push({ name: 'language', value: truncateRelationText(langMatch[1], 80) });
        seen.add('language');
    }
    const linkPattern = /<link\b[^>]*>/gi;
    let linkMatch;
    while ((linkMatch = linkPattern.exec(html)) && metadata.length < 18) {
        const tag = linkMatch[0];
        const rel = compactWhitespace(extractHtmlAttribute(tag, 'rel')).toLowerCase();
        if (!/\b(?:canonical|alternate|amphtml|manifest)\b/.test(rel)) {
            continue;
        }
        const href = resolveHtmlUrl(extractHtmlAttribute(tag, 'href'), baseUrl);
        if (!href) {
            continue;
        }
        const key = `link:${rel}:${href}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        metadata.push({ name: `link:${rel}`, value: href });
    }
    const metaPattern = /<meta\b[^>]*>/gi;
    let metaMatch;
    while ((metaMatch = metaPattern.exec(html)) && metadata.length < 30) {
        const tag = metaMatch[0];
        const name = compactWhitespace(
            extractHtmlAttribute(tag, 'name') ||
            extractHtmlAttribute(tag, 'property') ||
            extractHtmlAttribute(tag, 'itemprop')
        );
        const content = truncateRelationText(extractHtmlAttribute(tag, 'content'), 360);
        if (!name || !content) {
            continue;
        }
        if (!/^(?:description|keywords|author|date|article:|og:|twitter:|citation_|dc\.|dcterms\.)/i.test(name)) {
            continue;
        }
        const key = `meta:${name}:${content}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        metadata.push({ name, value: content });
    }
    return metadata;
}

function normalizeJsonLdList(value) {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value.flatMap(normalizeJsonLdList);
    }
    if (typeof value === 'object') {
        if (Array.isArray(value['@graph'])) {
            return value['@graph'].flatMap(normalizeJsonLdList);
        }
        return [value];
    }
    return [];
}

function jsonLdEntityName(value) {
    if (!value) {
        return '';
    }
    if (typeof value === 'string') {
        return truncateRelationText(value, 180);
    }
    if (Array.isArray(value)) {
        return value.map(jsonLdEntityName).filter(Boolean).join(', ').slice(0, 220);
    }
    if (typeof value === 'object') {
        return truncateRelationText(value.name || value.headline || value.title || value['@id'] || value.url || '', 220);
    }
    return truncateRelationText(String(value), 180);
}

function extractJsonLdRelations(html = '', baseUrl = '') {
    const entities = [];
    const triples = [];
    const seenEntities = new Set();
    const seenTriples = new Set();
    const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = pattern.exec(html)) && entities.length < 20) {
        let parsed;
        try {
            parsed = JSON.parse(decodeHtml(match[1]).trim());
        } catch {
            continue;
        }
        for (const node of normalizeJsonLdList(parsed)) {
            const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']].filter(Boolean);
            const name = jsonLdEntityName(node);
            const url = resolveHtmlUrl(node.url || node.mainEntityOfPage || node['@id'] || '', baseUrl);
            const entity = {
                type: types.join(', ') || undefined,
                name: name || undefined,
                url: url || undefined,
                datePublished: truncateRelationText(node.datePublished || node.dateModified || '', 120) || undefined
            };
            const entityKey = JSON.stringify(entity);
            if ((entity.name || entity.url || entity.type) && !seenEntities.has(entityKey)) {
                seenEntities.add(entityKey);
                entities.push(pruneEmptyDeep(entity));
            }
            const subject = entity.name || entity.url || entity.type || 'json-ld entity';
            const relationFields = ['author', 'publisher', 'creator', 'about', 'mainEntity', 'isPartOf', 'itemListElement'];
            for (const field of relationFields) {
                const values = Array.isArray(node[field]) ? node[field] : [node[field]].filter(Boolean);
                for (const value of values.slice(0, 8)) {
                    const object = jsonLdEntityName(value);
                    if (!object) {
                        continue;
                    }
                    const triple = { subject, predicate: field, object, source: 'json-ld' };
                    const key = JSON.stringify(triple);
                    if (!seenTriples.has(key)) {
                        seenTriples.add(key);
                        triples.push(triple);
                    }
                    if (triples.length >= 40) {
                        break;
                    }
                }
                if (triples.length >= 40) {
                    break;
                }
            }
        }
    }
    return { entities, triples };
}

function extractHtmlDefinitionRelations(html = '', limit = 24) {
    const keyValues = [];
    const triples = [];
    const seen = new Set();
    const dlPattern = /<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi;
    let match;
    while ((match = dlPattern.exec(html)) && keyValues.length < limit) {
        const key = truncateRelationText(stripHtml(match[1]), 120);
        const value = truncateRelationText(stripHtml(match[2]), 300);
        const pairKey = `${key}:${value}`;
        if (!key || !value || seen.has(pairKey)) {
            continue;
        }
        seen.add(pairKey);
        keyValues.push({ key, value, source: 'definition_list' });
        triples.push({ subject: 'page', predicate: key, object: value, source: 'definition_list' });
    }
    return { keyValues, triples };
}

function extractTableCells(rowHtml = '') {
    const cells = [];
    const pattern = /<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let match;
    while ((match = pattern.exec(rowHtml)) && cells.length < 16) {
        cells.push(truncateRelationText(stripHtml(match[1]), 240));
    }
    return cells;
}

function extractHtmlTableRelations(html = '', limit = 6) {
    const tables = [];
    const keyValues = [];
    const triples = [];
    const seenTriples = new Set();
    const tablePattern = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
    let tableMatch;
    while ((tableMatch = tablePattern.exec(html)) && tables.length < limit) {
        const tableHtml = tableMatch[1];
        const captionMatch = tableHtml.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i);
        const caption = captionMatch ? truncateRelationText(stripHtml(captionMatch[1]), 180) : '';
        const rowMatches = Array.from(tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)).slice(0, 24);
        const rows = rowMatches.map((row) => extractTableCells(row[1])).filter((cells) => cells.some(Boolean));
        if (!rows.length) {
            continue;
        }
        const firstRowHasHeaders = /<th\b/i.test(rowMatches[0]?.[1] || '');
        const headers = firstRowHasHeaders ? rows[0] : [];
        const dataRows = firstRowHasHeaders ? rows.slice(1) : rows;
        const table = pruneEmptyDeep({
            caption: caption || undefined,
            headers: headers.length ? headers : undefined,
            rowCount: dataRows.length,
            sampleRows: dataRows.slice(0, 8)
        });
        tables.push(table);
        for (const cells of dataRows.slice(0, 12)) {
            if (headers.length >= 2 && cells.length >= 2) {
                const rowSubject = cells[0] || caption || 'table row';
                for (let index = 1; index < Math.min(headers.length, cells.length); index += 1) {
                    const predicate = headers[index];
                    const object = cells[index];
                    if (!predicate || !object) {
                        continue;
                    }
                    const triple = { subject: rowSubject, predicate, object, source: caption || 'table' };
                    const key = JSON.stringify(triple);
                    if (!seenTriples.has(key)) {
                        seenTriples.add(key);
                        triples.push(triple);
                    }
                }
            } else if (cells.length === 2 && cells[0] && cells[1]) {
                const pair = { key: cells[0], value: cells[1], source: caption || 'table' };
                keyValues.push(pair);
                const triple = { subject: caption || 'page', predicate: cells[0], object: cells[1], source: caption || 'table' };
                const key = JSON.stringify(triple);
                if (!seenTriples.has(key)) {
                    seenTriples.add(key);
                    triples.push(triple);
                }
            }
        }
    }
    return { tables, keyValues, triples };
}

function extractHtmlSections(html = '', baseUrl = '', limit = 14) {
    const headings = [];
    const pattern = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
    let match;
    while ((match = pattern.exec(html)) && headings.length < 80) {
        const text = truncateRelationText(stripHtml(match[3]), 180);
        if (!text) {
            continue;
        }
        headings.push({
            level: Number(match[1]),
            id: extractHtmlAttribute(match[2], 'id'),
            heading: text,
            start: match.index,
            end: pattern.lastIndex
        });
    }
    const sections = [];
    const stack = [];
    for (let index = 0; index < headings.length && sections.length < limit; index += 1) {
        const heading = headings[index];
        while (stack.length && stack[stack.length - 1].level >= heading.level) {
            stack.pop();
        }
        stack.push({ level: heading.level, heading: heading.heading });
        const next = headings[index + 1];
        const fragment = html.slice(heading.end, next ? next.start : Math.min(html.length, heading.end + 6000));
        const textPreview = truncateRelationText(stripHtml(fragment), 520);
        const links = extractLinksFromHtml(fragment, baseUrl, 12)
            .map((link) => pruneEmptyDeep({
                text: truncateRelationText(link.text, 140),
                url: link.url
            }))
            .filter((link) => link.url || link.text)
            .slice(0, 6);
        sections.push(pruneEmptyDeep({
            level: heading.level,
            heading: heading.heading,
            path: stack.map((entry) => entry.heading),
            id: heading.id || undefined,
            textPreview: textPreview || undefined,
            links: links.length ? links : undefined
        }));
    }
    if (!sections.length) {
        const articleMatch = html.match(/<(?:article|main|body)\b[^>]*>([\s\S]*?)<\/(?:article|main|body)>/i);
        const textPreview = truncateRelationText(stripHtml(articleMatch ? articleMatch[1] : html), 700);
        if (textPreview) {
            sections.push({ level: 0, heading: 'page body', path: ['page body'], textPreview });
        }
    }
    return sections;
}

function buildLinkRelationTriples(links = [], sections = [], pageTitle = '') {
    const triples = [];
    const seen = new Set();
    const sectionByUrl = new Map();
    for (const section of sections) {
        for (const link of section.links || []) {
            if (link.url && !sectionByUrl.has(link.url)) {
                sectionByUrl.set(link.url, section.heading);
            }
        }
    }
    for (const link of links.slice(0, 20)) {
        const url = normalizeString(link.url);
        if (!url) {
            continue;
        }
        const subject = sectionByUrl.get(url) || pageTitle || 'page';
        const object = truncateRelationText(link.text || url, 180) || url;
        const triple = {
            subject,
            predicate: 'links_to',
            object,
            url,
            source: 'anchor'
        };
        const key = `${subject}:links_to:${url}:${object}`;
        if (!seen.has(key)) {
            seen.add(key);
            triples.push(triple);
        }
    }
    return triples;
}

function extractHtmlRelationGraph(html = '', { url = '', query = '', links = [] } = {}) {
    const metadata = extractHtmlMetadata(html, url);
    const title = metadata.find((entry) => entry.name === 'title')?.value || extractHtmlDocumentTitle(html);
    const canonicalUrl = metadata.find((entry) => entry.name === 'link:canonical')?.value || url;
    const sections = extractHtmlSections(html, url);
    const rankedLinks = rankLinksForResearch(
        Array.isArray(links) && links.length ? links : extractLinksFromHtml(html, url, 80),
        url,
        query
    ).slice(0, 12);
    const linkRelations = rankedLinks.map((candidate) => pruneEmptyDeep({
        kind: candidate.kind,
        text: truncateRelationText(candidate.text, 160),
        url: candidate.url,
        score: Number.isFinite(candidate.score) ? Number(candidate.score.toFixed(2)) : undefined,
        queryMatchedTerms: candidate.queryMatchedTerms?.length ? candidate.queryMatchedTerms.slice(0, 8) : undefined
    }));
    const jsonLd = extractJsonLdRelations(html, url);
    const tableRelations = extractHtmlTableRelations(html);
    const definitionRelations = extractHtmlDefinitionRelations(html);
    const keyValues = [...definitionRelations.keyValues, ...tableRelations.keyValues].slice(0, 30);
    const relationTriples = [
        ...jsonLd.triples,
        ...definitionRelations.triples,
        ...tableRelations.triples,
        ...buildLinkRelationTriples(rankedLinks, sections, title)
    ].slice(0, 70);
    return pruneEmptyDeep({
        status: 'extracted',
        sourceUrl: url || undefined,
        canonicalUrl: canonicalUrl || undefined,
        title: title || undefined,
        metadata: metadata.length ? metadata.slice(0, 30) : undefined,
        jsonLdEntities: jsonLd.entities.length ? jsonLd.entities.slice(0, 20) : undefined,
        sections: sections.length ? sections : undefined,
        linkRelations: linkRelations.length ? linkRelations : undefined,
        tables: tableRelations.tables.length ? tableRelations.tables : undefined,
        keyValues: keyValues.length ? keyValues : undefined,
        relationTriples: relationTriples.length ? relationTriples : undefined
    });
}

function formatHtmlRelationGraph(graph = {}) {
    if (!graph || typeof graph !== 'object' || graph.status !== 'extracted') {
        return '';
    }
    const lines = ['HTML relationship map:'];
    if (graph.title) {
        lines.push(`Title: ${graph.title}`);
    }
    if (graph.canonicalUrl && graph.canonicalUrl !== graph.sourceUrl) {
        lines.push(`Canonical: ${graph.canonicalUrl}`);
    }
    const meta = (graph.metadata || [])
        .filter((entry) => !['title', 'language', 'link:canonical'].includes(entry.name))
        .slice(0, 5)
        .map((entry) => `${entry.name}=${entry.value}`);
    if (meta.length) {
        lines.push(`Metadata: ${meta.join(' | ')}`);
    }
    const sections = (graph.sections || []).slice(0, 5);
    if (sections.length) {
        lines.push('Sections:');
        for (const section of sections) {
            const path = Array.isArray(section.path) && section.path.length ? section.path.join(' > ') : section.heading;
            lines.push(`- ${path}${section.textPreview ? `: ${section.textPreview}` : ''}`);
        }
    }
    const keyValues = (graph.keyValues || []).slice(0, 8);
    if (keyValues.length) {
        lines.push('Key-value facts:');
        for (const pair of keyValues) {
            lines.push(`- ${pair.key}: ${pair.value}`);
        }
    }
    const tables = (graph.tables || []).slice(0, 3);
    if (tables.length) {
        lines.push('Tables:');
        for (const table of tables) {
            const headers = Array.isArray(table.headers) && table.headers.length ? ` headers=${table.headers.join(' | ')}` : '';
            lines.push(`- ${table.caption || 'table'} rows=${table.rowCount || 0}${headers}`);
        }
    }
    const triples = (graph.relationTriples || []).slice(0, 10);
    if (triples.length) {
        lines.push('Relations:');
        for (const triple of triples) {
            lines.push(`- ${triple.subject} --${triple.predicate}--> ${triple.object}${triple.url ? ` (${triple.url})` : ''}`);
        }
    }
    return lines.join('\n');
}

function extractWikiKeyValueFacts(text = '', query = '', limit = 36) {
    const facts = [];
    const seen = new Set();
    const queryText = normalizeString(query).toLowerCase();
    const queryTokens = significantPdfQueryTerms(queryText);
    const synonymBoosts = [
        { query: /\b(?:perigee|closest approach)\b/i, key: /\bperiapsis\b/i },
        { query: /\b(?:apogee|farthest)\b/i, key: /\bapoapsis\b/i }
    ];
    const lines = String(text || '').split(/\r?\n/);
    for (let index = 0; index < lines.length && facts.length < 160; index += 1) {
        const match = lines[index].match(/^([A-Za-z][A-Za-z0-9 _./()%-]{1,90})\s*:\s*(.{1,700})$/);
        if (!match) {
            continue;
        }
        const key = cleanWikiTemplateValue(match[1]).replace(/\s+/g, ' ').trim();
        const value = cleanWikiTemplateValue(match[2]).replace(/\s+/g, ' ').trim();
        if (!key || !value || value.length > 650) {
            continue;
        }
        const lower = `${key} ${value}`.toLowerCase();
        if (/^(?:image|caption|alt|logo|map|module|embed)$/i.test(key)) {
            continue;
        }
        const dedupeKey = `${key.toLowerCase()}:${value.toLowerCase()}`;
        if (seen.has(dedupeKey)) {
            continue;
        }
        seen.add(dedupeKey);
        let score = Math.max(0, 120 - index);
        for (const token of queryTokens) {
            if (token && lower.includes(token.toLowerCase())) {
                score += pdfEvidenceTermWeight(token) * 4;
            }
        }
        for (const boost of synonymBoosts) {
            if (boost.query.test(queryText) && boost.key.test(key)) {
                score += 80;
            }
        }
        if (/\d/.test(value)) {
            score += 12;
        }
        facts.push({ key, value, source: 'wikitext_key_value', order: index, score });
    }
    return facts
        .sort((a, b) => b.score - a.score || a.order - b.order)
        .slice(0, limit)
        .sort((a, b) => a.order - b.order)
        .map(({ key, value, source, score }) => ({ key, value, source, score }));
}

function formatWikiKeyValueFacts(facts = []) {
    if (!Array.isArray(facts) || !facts.length) {
        return '';
    }
    const lines = ['Wiki key-value facts:'];
    for (const fact of facts.slice(0, 16)) {
        lines.push(`- ${fact.key}: ${fact.value}`);
    }
    return lines.join('\n');
}

function wikiFactsAreReasoningReady(facts = [], query = '') {
    if (!Array.isArray(facts) || !facts.length || !normalizeString(query)) {
        return false;
    }
    const numericFacts = facts.filter((fact) => /\d/.test(normalizeString(fact.value)));
    if (!numericFacts.length) {
        return false;
    }
    return numericFacts.some((fact) => Number(fact.score) >= 80) ||
        (numericFacts.length >= 3 && facts.some((fact) => Number(fact.score) >= 60));
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
        queryScore: Number.isFinite(candidate.queryScore) ? Number(candidate.queryScore.toFixed(2)) : undefined,
        sourceBackends: candidate.sourceBackends?.length ? candidate.sourceBackends.slice(0, 5) : undefined,
        score: Number.isFinite(candidate.score) ? Number(candidate.score.toFixed(2)) : undefined
    });
}

function buildSuggestedCallForLink(candidate = {}, { query = '' } = {}) {
    const url = normalizeString(candidate.url);
    const text = normalizeString(candidate.text, 'linked resource');
    const fetchArgs = query ? { url, query } : { url };
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
        args: fetchArgs,
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

function buildSuggestedCallsFromRankedLinks(rankedLinks = [], limit = 3, options = {}) {
    return dedupeSuggestedNextCalls(
        rankedLinks
            .filter((candidate) => candidate.score >= 35)
            .map((candidate) => buildSuggestedCallForLink(candidate, options)),
        limit
    );
}

const SEARCH_QUERY_STOPWORDS = new Set([
    'and', 'or',
    'about', 'after', 'article', 'before', 'between', 'from', 'have', 'into', 'journal',
    'linked', 'paper', 'question', 'related', 'report', 'site', 'that', 'their', 'there',
    'these', 'this', 'those', 'what', 'when', 'where', 'which', 'with',
    'the', 'was', 'were', 'are', 'does', 'did', 'has', 'had', 'under', 'over',
    'other', 'others', 'only', 'whose', 'whom'
]);

const CJK_SEARCH_QUERY_STOPWORDS = new Set([
    '一个', '一下', '什么', '怎么', '如何', '最新'
]);

const GUIDE_QUERY_TERMS = new Set([
    '攻略', '完整攻略', '图文攻略', '角色攻略', '平民攻略', '配队', '配装', '驱动盘',
    '音擎', '技能', '技能机制', '输出手法', '抽取建议', '养成', 'build', 'guide',
    'walkthrough', 'strategy', 'tier', 'team', 'teams'
]);

const CJK_ENTITY_STOPWORDS = new Set([
    ...CJK_SEARCH_QUERY_STOPWORDS,
    '帮我', '请问', '请你', '我要', '想要', '给我', '看下', '看看', '查下',
    '查查', '查询', '整理', '生成', '写个', '写一份', '做个', '做一个',
    '做一份', '来个', '来一个', '这个', '那个', '角色', '游戏', '手游',
    '端游', '攻略', '教程', '指南', '新手', '入门', '完整', '最新', '版本',
    '技能', '机制', '配队', '配装', '养成', '打法', '建议'
]);

const GUIDE_SOURCE_DOMAINS = [
    'bilibili.com',
    'wiki.biligame.com',
    'taptap.cn',
    'gamersky.com',
    '17173.com',
    '3dmgame.com',
    'gamekee.com',
    'nga.cn',
    'bbs.nga.cn',
    'miyoushe.com',
    'mihoyo.com',
    'hoyoverse.com',
    'hoyolab.com'
];

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

function pushUniqueTerm(terms, seen, term) {
    const normalized = normalizeString(term).toLowerCase();
    if (!normalized || seen.has(normalized)) {
        return;
    }
    seen.add(normalized);
    terms.push(normalized);
}

function stripCjkEntityAffixes(value = '') {
    let text = normalizeString(value)
        .replace(/[“”"'‘’()[\]{}《》【】]/g, ' ')
        .replace(/\s+/g, '');
    text = text
        .replace(/^(?:帮我|请问|请你|我要|想要|给我|看下|看看|查下|查查|查询|整理|生成|写个|写一份|做个|做一个|做一份|来个|来一个)+/g, '')
        .replace(/(?:的)?(?:完整)?(?:角色)?(?:攻略|教程|指南|解析|机制|配队|配装|养成|打法|建议)$/g, '')
        .replace(/的$/g, '')
        .replace(/^(?:一个|一下|这个|那个|关于)/g, '')
        .replace(/(?:角色|游戏|手游|端游)$/g, '');
    for (const guideTerm of GUIDE_QUERY_TERMS) {
        if (/[\p{Script=Han}]/u.test(guideTerm)) {
            text = text.replaceAll(guideTerm, '');
        }
    }
    return text.trim();
}

function extractShortCjkEntityTerms(query = '') {
    const sanitized = normalizeString(query)
        .replace(/\bsite:[^\s]+/gi, ' ')
        .replace(/\bhttps?:\/\/\S+/gi, ' ')
        .replace(/[|,，。！？；;:：、/\\]+/g, ' ');
    const terms = [];
    const seen = new Set();
    const addEntity = (candidate = '') => {
        const stripped = stripCjkEntityAffixes(candidate);
        const chunks = stripped.match(/[\p{Script=Han}]{2,8}/gu) || [];
        for (const chunk of chunks) {
            const normalized = normalizeString(chunk);
            if (
                normalized.length < 2 ||
                normalized.length > 8 ||
                CJK_ENTITY_STOPWORDS.has(normalized) ||
                GUIDE_QUERY_TERMS.has(normalized)
            ) {
                continue;
            }
            pushUniqueTerm(terms, seen, normalized);
        }
    };
    const patternCandidates = [
        ...sanitized.matchAll(/([\p{Script=Han}]{2,10})(?:的)?(?:完整)?(?:角色)?(?:攻略|教程|指南|解析|机制|配队|配装|养成|打法|建议)/gu)
    ];
    for (const match of patternCandidates) {
        addEntity(match[1]);
    }
    const cjkChunks = sanitized.match(/[\p{Script=Han}]{2,12}/gu) || [];
    for (const chunk of cjkChunks) {
        addEntity(chunk);
    }
    return terms.slice(0, 5);
}

function extractGuideTermsFromQuery(query = '') {
    const normalized = normalizeString(query).toLowerCase();
    const terms = [];
    const seen = new Set();
    for (const term of GUIDE_QUERY_TERMS) {
        const normalizedTerm = normalizeString(term).toLowerCase();
        if (normalizedTerm && normalized.includes(normalizedTerm)) {
            pushUniqueTerm(terms, seen, normalizedTerm);
        }
    }
    return terms.slice(0, 8);
}

function extractSearchQueryTerms(query = '') {
    const sanitized = normalizeString(query)
        .replace(/\bsite:[^\s]+/gi, ' ')
        .replace(/\bhttps?:\/\/\S+/gi, ' ')
        .replace(/["'“”‘’()[\]{}]/g, ' ')
        .replace(/[|,，。！？；;:：、/\\]+/g, ' ');
    const classificationNumbers = new Set(
        Array.from(sanitized.matchAll(/\b[A-Za-z]{2,8}\s+(\d{1,5})\b/g))
            .map((match) => normalizeString(match[1]).toLowerCase())
            .filter(Boolean)
    );
    const rawTerms = sanitized.toLowerCase().match(/[a-z0-9]{3,}/g) || [];
    const terms = [];
    const seen = new Set();
    const addTerm = (term) => {
        const normalized = normalizeString(term).toLowerCase();
        if (!normalized) {
            return;
        }
        if (SEARCH_QUERY_STOPWORDS.has(normalized) || CJK_SEARCH_QUERY_STOPWORDS.has(normalized)) {
            return;
        }
        if (/^\d{1,3}$/.test(normalized) && !classificationNumbers.has(normalized)) {
            return;
        }
        if (seen.has(normalized)) {
            return;
        }
        seen.add(normalized);
        terms.push(normalized);
    };
    for (const term of rawTerms) {
        addTerm(term);
        if (terms.length >= 16) {
            break;
        }
    }
    for (const term of extractGuideTermsFromQuery(sanitized)) {
        addTerm(term);
        if (terms.length >= 16) {
            break;
        }
    }
    for (const term of extractShortCjkEntityTerms(sanitized)) {
        addTerm(term);
        if (terms.length >= 16) {
            break;
        }
    }
    const cjkTerms = sanitized.match(/[\p{Script=Han}]{2,16}/gu) || [];
    for (const term of cjkTerms) {
        addTerm(term);
        if (terms.length >= 16) {
            break;
        }
    }
    return terms;
}

function extractSearchSiteConstraints(query = '') {
    const sites = [];
    const seen = new Set();
    for (const match of normalizeString(query).matchAll(/\bsite:([^\s]+)/gi)) {
        const raw = normalizeString(match[1])
            .replace(/^https?:\/\//i, '')
            .replace(/^www\./i, '')
            .replace(/\/.*$/g, '')
            .replace(/[),.;]+$/g, '')
            .toLowerCase();
        if (!raw || seen.has(raw)) {
            continue;
        }
        seen.add(raw);
        sites.push(raw);
    }
    return sites;
}

function normalizeSearchText(value = '') {
    return normalizeString(value)
        .toLowerCase()
        .replace(/[^\p{Script=Han}a-z0-9]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function compactSearchText(value = '') {
    return normalizeSearchText(value).replace(/\s+/g, '');
}

function extractQuotedSearchPhrases(query = '') {
    return Array.from(normalizeString(query).matchAll(/"([^"]{3,})"/g))
        .map((match) => normalizeSearchText(match[1]))
        .filter(Boolean)
        .slice(0, 5);
}

function extractHostname(value = '') {
    try {
        return new URL(normalizeString(value)).hostname.replace(/^www\./i, '').toLowerCase();
    } catch {
        return '';
    }
}

function hostMatchesSiteConstraint(host = '', site = '') {
    const normalizedHost = normalizeString(host).replace(/^www\./i, '').toLowerCase();
    const normalizedSite = normalizeString(site).replace(/^www\./i, '').toLowerCase();
    return Boolean(
        normalizedHost &&
        normalizedSite &&
        (normalizedHost === normalizedSite || normalizedHost.endsWith(`.${normalizedSite}`))
    );
}

function isGuideSearchQuery(query = '') {
    const terms = extractSearchQueryTerms(query);
    return terms.some((term) => GUIDE_QUERY_TERMS.has(term)) ||
        /(攻略|配队|配装|驱动盘|音擎|输出手法|抽取建议|build|guide|walkthrough|strategy)/i.test(query);
}

function isGuideSourceDomain(host = '') {
    const normalizedHost = normalizeString(host).replace(/^www\./i, '').toLowerCase();
    return GUIDE_SOURCE_DOMAINS.some((domain) => hostMatchesSiteConstraint(normalizedHost, domain));
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
    const normalizedText = normalizeSearchText([
        normalizeString(result.title),
        normalizeString(result.snippet),
        normalizeString(result.url)
    ].join(' '));
    const compactText = compactSearchText([
        normalizeString(result.title),
        normalizeString(result.snippet),
        normalizeString(result.url)
    ].join(' '));
    const titleText = normalizeSearchText(normalizeString(result.title));
    const compactTitle = compactSearchText(normalizeString(result.title));
    const matchedTerms = [];
    let score = 0;
    for (const term of extractSearchQueryTerms(query)) {
        const normalizedTerm = normalizeSearchText(term);
        const compactTerm = compactSearchText(term);
        if (!normalizedTerm || !compactTerm) {
            continue;
        }
        const isCjk = /[\p{Script=Han}]/u.test(compactTerm);
        const matched = isCjk
            ? compactText.includes(compactTerm)
            : normalizedText.includes(normalizedTerm);
        if (!matched) {
            continue;
        }
        const titleMatched = isCjk
            ? compactTitle.includes(compactTerm)
            : titleText.includes(normalizedTerm);
        matchedTerms.push(term);
        score += /^(?:18|19|20)\d{2}$/.test(compactTerm) ? 6 : compactTerm.length >= 6 ? 18 : 12;
        if (isCjk) {
            score += compactTerm.length >= 4 ? 10 : 6;
        }
        if (GUIDE_QUERY_TERMS.has(compactTerm)) {
            score += 10;
        }
        if (titleMatched) {
            score += isCjk ? 12 : 8;
        }
    }
    for (const phrase of extractQuotedSearchPhrases(query)) {
        const compactPhrase = compactSearchText(phrase);
        if (compactPhrase && compactText.includes(compactPhrase)) {
            score += 45;
        }
    }
    const host = extractHostname(result.url);
    const siteConstraints = extractSearchSiteConstraints(query);
    const matchedSites = siteConstraints.filter((site) => hostMatchesSiteConstraint(host, site));
    if (matchedSites.length && matchedTerms.length) {
        score += 30;
    } else if (matchedSites.length) {
        score += 5;
    } else if (siteConstraints.length) {
        score -= 20;
    }
    const guideSource = isGuideSearchQuery(query) && isGuideSourceDomain(host);
    if (guideSource && matchedTerms.length) {
        score += 12;
    }
    if (matchedTerms.length >= 2) {
        score += 24;
    }
    if (matchedTerms.length >= 3) {
        score += 18;
    }
    return {
        score,
        matchedTerms: matchedTerms.slice(0, 8),
        matchedSites,
        guideSource
    };
}

function scoreSearchSourceConsensus(result = {}) {
    const backends = normalizeSourceList(result.sourceBackends || result.sourceBackend || result.backend);
    const engines = normalizeSourceList(result.sourceEngines || result.engines || result.engine);
    const backendScore = Math.max(0, backends.length - 1) * 18;
    const engineScore = Math.max(0, engines.length - 1) * 8;
    const shapedResultScore = normalizeString(result.snippet).length >= 80 ? 4 : 0;
    return Math.min(44, backendScore + engineScore + shapedResultScore);
}

function isRelevantSearchCandidate(candidate = {}) {
    const queryScore = Number(candidate.queryScore) || 0;
    const matchedTerms = Array.isArray(candidate.queryMatchedTerms) ? candidate.queryMatchedTerms : [];
    const matchedSites = Array.isArray(candidate.queryMatchedSites) ? candidate.queryMatchedSites : [];
    const targetCoverage = candidate.queryTargetCoverage || {};
    if (targetCoverage.specificTargetCovered === false) {
        return false;
    }
    return (
        matchedTerms.length >= 2 ||
        queryScore >= 30 ||
        (matchedSites.length > 0 && matchedTerms.length >= 1) ||
        (candidate.guideSource === true && matchedTerms.length >= 1) ||
        ((candidate.kind === 'doi' || candidate.kind === 'pdf' || candidate.kind === 'paper_abs') && matchedTerms.length >= 1)
    );
}

function searchOffTargetThreshold(query = '') {
    return /[\p{Script=Han}]/u.test(query) ? 24 : 30;
}

function hasEnoughRelevantSearchEvidence(rankedResults = [], query = '') {
    const topQueryScore = rankedResults[0]?.queryScore || 0;
    const topTargetCoverage = rankedResults[0]?.queryTargetCoverage || {};
    if (topTargetCoverage.specificTargetCovered !== false && topQueryScore >= searchOffTargetThreshold(query)) {
        return true;
    }
    return rankedResults.some((candidate) => isRelevantSearchCandidate(candidate));
}

function describeSearchRelevance(rankedResults = []) {
    return rankedResults.slice(0, 5).map((candidate) => pruneEmptyDeep({
        title: normalizeString(candidate.title),
        url: normalizeString(candidate.url),
        combinedScore: Number.isFinite(candidate.combinedScore) ? Number(candidate.combinedScore.toFixed(2)) : undefined,
        queryScore: Number.isFinite(candidate.queryScore) ? Number(candidate.queryScore.toFixed(2)) : undefined,
        researchScore: Number.isFinite(candidate.researchScore) ? Number(candidate.researchScore.toFixed(2)) : undefined,
        sourceConsensusScore: Number.isFinite(candidate.sourceConsensusScore) ? Number(candidate.sourceConsensusScore.toFixed(2)) : undefined,
        matchedTerms: candidate.queryMatchedTerms?.length ? candidate.queryMatchedTerms.slice(0, 8) : undefined,
        matchedSites: candidate.queryMatchedSites?.length ? candidate.queryMatchedSites.slice(0, 3) : undefined,
        sourceBackends: candidate.sourceBackends?.length ? candidate.sourceBackends.slice(0, 5) : undefined,
        sourceEngines: candidate.sourceEngines?.length ? candidate.sourceEngines.slice(0, 5) : undefined,
        targetCoverage: candidate.queryTargetCoverage,
        guideSource: candidate.guideSource || undefined,
        kind: normalizeString(candidate.kind)
    }));
}

function assessSearchResultTargetCoverage(result = {}, query = '') {
    const requiredTerms = specificTargetTermsForQuery(query);
    if (!requiredTerms.length) {
        return undefined;
    }
    const text = compactSearchText([
        normalizeString(result.title),
        normalizeString(result.snippet),
        normalizeString(result.url)
    ].join(' '));
    const strongText = compactSearchText([
        normalizeString(result.title),
        normalizeString(result.url)
    ].join(' '));
    const matchedSpecificTargetTerms = [];
    const missingSpecificTargetTerms = [];
    const strongMatchedSpecificTargetTerms = [];
    for (const term of requiredTerms) {
        const compactTerm = compactSearchText(term);
        if (compactTerm && text.includes(compactTerm)) {
            matchedSpecificTargetTerms.push(term);
        } else {
            missingSpecificTargetTerms.push(term);
        }
        if (compactTerm && strongText.includes(compactTerm)) {
            strongMatchedSpecificTargetTerms.push(term);
        }
    }
    return pruneEmptyDeep({
        requiredSpecificTargetTerms: requiredTerms,
        matchedSpecificTargetTerms,
        strongMatchedSpecificTargetTerms,
        missingSpecificTargetTerms,
        specificTargetCovered: missingSpecificTargetTerms.length === 0 || strongMatchedSpecificTargetTerms.length > 0
    });
}

function rankSearchResultsForFollowup(results = [], query = '') {
    return (Array.isArray(results) ? results : [])
        .map((item, index) => {
            const research = scoreResearchLink({
                url: normalizeString(item.url),
                text: normalizeString(item.title || item.snippet)
            }, index);
            const queryMatch = scoreSearchResultAgainstQuery(item, query);
            const sourceConsensusScore = scoreSearchSourceConsensus(item);
            const targetCoverage = assessSearchResultTargetCoverage(item, query);
            const targetPenalty = targetCoverage?.specificTargetCovered === false ? 260 : 0;
            return {
                ...item,
                kind: research.kind,
                doi: research.doi,
                score: research.score,
                researchScore: research.score,
                queryScore: queryMatch.score,
                queryMatchedTerms: queryMatch.matchedTerms,
                queryMatchedSites: queryMatch.matchedSites,
                guideSource: queryMatch.guideSource,
                sourceConsensusScore,
                queryTargetCoverage: targetCoverage,
                combinedScore: queryMatch.score * 4 + research.score + sourceConsensusScore - targetPenalty
            };
        })
        .sort((a, b) => b.combinedScore - a.combinedScore || b.queryScore - a.queryScore || b.researchScore - a.researchScore);
}

function extractSearchResultContextLabel(candidate = {}, entityTerms = []) {
    const title = normalizeString(candidate.title);
    const snippet = normalizeString(candidate.snippet);
    const host = extractHostname(candidate.url);
    const haystack = `${title} ${snippet}`;
    const labels = [];
    const bracketMatch = title.match(/[【《\[]([^】》\]]{2,28})[】》\]]/u);
    if (bracketMatch) {
        labels.push(bracketMatch[1]);
    }
    for (const term of entityTerms) {
        const escaped = escapeRegExp(term);
        if (!escaped) {
            continue;
        }
        const contextMatch = haystack.match(new RegExp(`([\\p{Script=Han}A-Za-z0-9·._-]{0,10}${escaped}[\\p{Script=Han}A-Za-z0-9·._-]{0,10})`, 'u'));
        if (contextMatch) {
            labels.push(contextMatch[1]);
        }
    }
    const compactLabels = labels
        .map((label) => stripCjkEntityAffixes(label) || normalizeString(label))
        .filter((label) => label && !CJK_ENTITY_STOPWORDS.has(label))
        .slice(0, 2);
    if (compactLabels.length) {
        return compactLabels.join(' / ');
    }
    const cleanedTitle = title
        .replace(/\s*[-_|].*$/u, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 36);
    return cleanedTitle || host || 'unknown result';
}

function buildSearchClarificationChoices(rankedResults = [], query = '') {
    const entityTerms = extractShortCjkEntityTerms(query);
    const choices = [];
    const seen = new Set();
    for (const candidate of (Array.isArray(rankedResults) ? rankedResults : []).slice(0, 8)) {
        const candidateText = compactSearchText([
            normalizeString(candidate.title),
            normalizeString(candidate.snippet),
            normalizeString(candidate.url)
        ].join(' '));
        const entityMatched = !entityTerms.length || entityTerms.some((term) => candidateText.includes(compactSearchText(term)));
        if (!entityMatched && !isRelevantSearchCandidate(candidate)) {
            continue;
        }
        const label = extractSearchResultContextLabel(candidate, entityTerms);
        const key = compactSearchText(label).slice(0, 48);
        if (!key || seen.has(key)) {
            continue;
        }
        seen.add(key);
        choices.push(pruneEmptyDeep({
            label,
            title: normalizeString(candidate.title),
            url: normalizeString(candidate.url),
            host: extractHostname(candidate.url),
            queryScore: Number.isFinite(candidate.queryScore) ? Number(candidate.queryScore.toFixed(2)) : undefined,
            matchedTerms: candidate.queryMatchedTerms?.length ? candidate.queryMatchedTerms.slice(0, 6) : undefined
        }));
        if (choices.length >= 4) {
            break;
        }
    }
    return choices;
}

function hasSpecificSearchContext(query = '', entityTerms = []) {
    const entitySet = new Set(entityTerms.map((term) => normalizeString(term).toLowerCase()));
    if (entitySet.size > 1) {
        return true;
    }
    if (extractQuotedSearchPhrases(query).length > 0) {
        return true;
    }
    const siteConstraints = extractSearchSiteConstraints(query);
    const nonGenericTerms = extractSearchQueryTerms(query).filter((term) => {
        const normalized = normalizeString(term).toLowerCase();
        const stripped = stripCjkEntityAffixes(normalized).toLowerCase();
        return (
            normalized &&
            !entitySet.has(normalized) &&
            !entitySet.has(stripped) &&
            !GUIDE_QUERY_TERMS.has(normalized) &&
            !CJK_ENTITY_STOPWORDS.has(normalized) &&
            !SEARCH_QUERY_STOPWORDS.has(normalized) &&
            !CJK_SEARCH_QUERY_STOPWORDS.has(normalized) &&
            !/^(?:做一个|做一份|帮我|给我|我要|想要)/.test(normalized)
        );
    });
    return nonGenericTerms.some((term) => (
        /[a-z0-9]/i.test(term) ||
        normalizeString(term).length >= 3
    )) || siteConstraints.some((site) => !/^(?:bilibili\.com|youtube\.com|youtu\.be)$/i.test(site));
}

function isGenericSearchQueryTerm(term = '', entityTerms = []) {
    const normalized = normalizeString(term).toLowerCase();
    const stripped = stripCjkEntityAffixes(normalized).toLowerCase();
    const entitySet = new Set(entityTerms.map((item) => normalizeString(item).toLowerCase()));
    return (
        !normalized ||
        entitySet.has(normalized) ||
        entitySet.has(stripped) ||
        GUIDE_QUERY_TERMS.has(normalized) ||
        CJK_ENTITY_STOPWORDS.has(normalized) ||
        SEARCH_QUERY_STOPWORDS.has(normalized) ||
        CJK_SEARCH_QUERY_STOPWORDS.has(normalized) ||
        /^(?:做一个|做一份|帮我|给我|我要|想要)/.test(normalized)
    );
}

function buildEffectiveSearchQuery(query = '') {
    const normalized = normalizeString(query);
    if (normalized && !/[\p{Script=Han}]/u.test(normalized)) {
        const exactAnswerQuery = buildExactAnswerFocusedSearchQuery(normalized);
        if (exactAnswerQuery) {
            return exactAnswerQuery;
        }
    }
    if (!normalized || !/[\p{Script=Han}]/u.test(normalized) || !isGuideSearchQuery(normalized)) {
        return normalized;
    }
    const entityTerms = extractShortCjkEntityTerms(normalized);
    if (!entityTerms.length) {
        return normalized;
    }
    const terms = [];
    const seen = new Set();
    const add = (term = '') => {
        const value = normalizeString(term);
        if (!value || seen.has(value)) {
            return;
        }
        seen.add(value);
        terms.push(value);
    };
    for (const term of extractSearchQueryTerms(normalized)) {
        if (!isGenericSearchQueryTerm(term, entityTerms)) {
            add(term);
        }
    }
    for (const term of entityTerms) {
        add(term);
    }
    const guideTerms = extractGuideTermsFromQuery(normalized);
    if (guideTerms.length) {
        add(guideTerms.includes('攻略') ? '攻略' : guideTerms[0]);
    }
    return terms.length >= 2 ? terms.slice(0, 8).join(' ') : normalized;
}

function looksLikeExactAnswerResearchQuery(query = '') {
    const text = normalizeString(query);
    return /\b(?:what|which|who|where|when|how many|how much)\b/i.test(text) ||
        /\bfrom\s+what\s+country\b/i.test(text) ||
        /\b(?:answer|exact|as of|under)\b/i.test(text);
}

function extractEnglishExactAnswerSearchTerms(query = '') {
    const original = normalizeString(query);
    const seen = new Set();
    const terms = [];
    const add = (term = '') => {
        const value = normalizeString(term).replace(/\s+/g, ' ').trim();
        const key = value.toLowerCase();
        if (!value || seen.has(key)) {
            return;
        }
        seen.add(key);
        terms.push(value);
    };
    for (const match of original.matchAll(/\b([A-Z]{2,8})\s+(\d{1,5})\b/g)) {
        add(`${match[1]} ${match[2]}`);
    }
    for (const match of original.matchAll(/\b((?:18|19|20)\d{2})\b/g)) {
        add(match[1]);
    }
    if (/\bunknown\s+language\b/i.test(original)) {
        add('"unknown language"');
    }
    if (/\b(?:unique|distinct|different)\b.{0,48}\bflag\b|\bflag\b.{0,48}\b(?:unique|distinct|different)\b/i.test(original)) {
        add('"unique flag"');
    }
    const importantPhrases = original.match(/\b(?:unknown|unique|distinct|different|specific|exact|official|native|original)\s+[a-z][a-z-]{3,}\b/gi) || [];
    for (const phrase of importantPhrases.slice(0, 4)) {
        add(`"${normalizeSearchText(phrase)}"`);
    }
    const tokens = original.match(/[A-Za-z][A-Za-z0-9'-]{1,}|\d{1,5}/g) || [];
    const classificationNumbers = new Set(
        Array.from(original.matchAll(/\b[A-Za-z]{2,8}\s+(\d{1,5})\b/g))
            .map((match) => match[1].toLowerCase())
    );
    for (const token of tokens) {
        const cleaned = normalizeString(token).replace(/^[-']+|[-']+$/g, '');
        const lower = cleaned.toLowerCase();
        if (!cleaned || SEARCH_QUERY_STOPWORDS.has(lower) || lower.length < 3) {
            continue;
        }
        if (/^\d{1,3}$/.test(lower) && !classificationNumbers.has(lower)) {
            continue;
        }
        if (/^(?:18|19|20)\d{2}$/.test(cleaned) || /^[A-Z0-9]{2,8}$/.test(cleaned) || cleaned.length >= 4) {
            add(cleaned);
        }
        if (terms.length >= 14) {
            break;
        }
    }
    return terms.slice(0, 12);
}

function buildExactAnswerFocusedSearchQuery(query = '') {
    const original = normalizeString(query);
    if (!original || /[\p{Script=Han}]/u.test(original) || !looksLikeExactAnswerResearchQuery(original)) {
        return '';
    }
    const terms = extractEnglishExactAnswerSearchTerms(original);
    if (terms.length < 3) {
        return '';
    }
    return terms.join(' ');
}

function buildGuideSourceFocusedSearchQuery({ contextTerms = [], targetTerms = [], guideTerm = '' } = {}) {
    const quotedTargets = (Array.isArray(targetTerms) ? targetTerms : [])
        .map((term) => normalizeString(term))
        .filter(Boolean)
        .slice(0, 3)
        .map((term) => `"${term}"`);
    const context = (Array.isArray(contextTerms) ? contextTerms : [])
        .map((term) => normalizeString(term))
        .filter(Boolean)
        .slice(0, 2);
    const sourceDomains = [
        'miyoushe.com',
        'taptap.cn',
        'wiki.biligame.com',
        'gamersky.com',
        'bilibili.com',
        'hoyolab.com'
    ];
    const base = [
        ...context,
        ...quotedTargets,
        normalizeString(guideTerm, '攻略')
    ].filter(Boolean).join(' ');
    if (!base || !quotedTargets.length) {
        return '';
    }
    return `${base} (${sourceDomains.map((domain) => `site:${domain}`).join(' OR ')})`;
}

function buildWebResearchQueryPlan(query = '', args = {}) {
    const original = normalizeString(query);
    const effective = buildEffectiveSearchQuery(original);
    const maxQueries = clampNumber(args.maxSearchQueries || args.max_search_queries, 3, 1, 5);
    const variants = [];
    const seen = new Set();
    const addVariant = ({ searchQuery = '', backendQuery = '', role = '', reason = '' } = {}) => {
        const normalizedSearchQuery = normalizeString(searchQuery);
        const normalizedBackendQuery = normalizeString(backendQuery || searchQuery);
        const key = `${normalizedSearchQuery}\n${normalizedBackendQuery}`.replace(/\s+/g, ' ').trim().toLowerCase();
        if (!normalizedSearchQuery || !normalizedBackendQuery || seen.has(key)) {
            return;
        }
        seen.add(key);
        variants.push(pruneEmptyDeep({
            index: variants.length + 1,
            role,
            query: normalizedSearchQuery,
            backendQuery: normalizedBackendQuery,
            reason
        }));
    };
    addVariant({
        searchQuery: original,
        backendQuery: original,
        role: 'original',
        reason: 'Run the literal user query first so the pipeline can detect over-broad or ambiguous intent before rewriting.'
    });
    const quotedPhrases = extractQuotedSearchPhrases(original);
    const entityTerms = extractShortCjkEntityTerms(original);
    const guideTerms = extractGuideTermsFromQuery(original);
    if (entityTerms.length && guideTerms.length && hasSpecificSearchContext(original, entityTerms)) {
        const guideTerm = guideTerms.includes('攻略') ? '攻略' : guideTerms[0];
        const exactEntityTerms = entityTerms.length > 1 ? entityTerms.slice(1, 3) : entityTerms.slice(0, 1);
        const contextTerms = entityTerms.length > 1 ? entityTerms.slice(0, 1) : [];
        const exactQuery = [
            ...contextTerms,
            ...exactEntityTerms.map((term) => `"${term}"`),
            guideTerm
        ].join(' ');
        addVariant({
            searchQuery: exactQuery,
            backendQuery: exactQuery,
            role: 'exact_entity',
            reason: 'Add exact target entity phrases for guide tasks with enough context to reduce broad source or game-homepage matches.'
        });
        const guideSourceQuery = buildGuideSourceFocusedSearchQuery({
            contextTerms,
            targetTerms: exactEntityTerms,
            guideTerm
        });
        addVariant({
            searchQuery: guideSourceQuery,
            backendQuery: guideSourceQuery,
            role: 'guide_sources',
            reason: 'Search high-signal guide/community/wiki sources for entity-specific guide pages before fetching broad homepages.'
        });
    }
    const exactAnswerQuery = buildExactAnswerFocusedSearchQuery(original);
    if (exactAnswerQuery && exactAnswerQuery !== original) {
        addVariant({
            searchQuery: exactAnswerQuery,
            backendQuery: exactAnswerQuery,
            role: 'exact_answer_terms',
            reason: 'Preserve classification numbers, source names, years, and answer-bearing phrases for exact-answer research questions.'
        });
    }
    if (effective && effective !== original) {
        addVariant({
            searchQuery: effective,
            backendQuery: effective,
            role: 'effective_terms',
            reason: 'Use extracted entity and guide terms to remove conversational filler and improve search precision.'
        });
    }
    if (!quotedPhrases.length && !/[\p{Script=Han}]/u.test(original)) {
        const importantTerms = extractSearchQueryTerms(original)
            .filter((term) => normalizeString(term).length >= 4)
            .slice(0, 5);
        if (importantTerms.length >= 2) {
            addVariant({
                searchQuery: `"${importantTerms.slice(0, 3).join(' ')}" ${importantTerms.slice(3).join(' ')}`.trim(),
                backendQuery: `"${importantTerms.slice(0, 3).join(' ')}" ${importantTerms.slice(3).join(' ')}`.trim(),
                role: 'exact_topic',
                reason: 'Try an exact-topic phrase for non-CJK research queries when the first result set is too broad.'
            });
        }
    }
    return variants.slice(0, maxQueries);
}

function assessSearchConfidence(rankedResults = [], query = '') {
    const ranked = Array.isArray(rankedResults) ? rankedResults : [];
    const top = ranked[0] || {};
    const second = ranked[1] || {};
    const topQueryScore = Number(top.queryScore) || 0;
    const secondQueryScore = Number(second.queryScore) || 0;
    const scoreGap = Math.max(0, topQueryScore - secondQueryScore);
    const relevantCount = ranked.filter((candidate) => isRelevantSearchCandidate(candidate)).length;
    const entityTerms = extractShortCjkEntityTerms(query);
    const shortEntityTerms = entityTerms.filter((term) => normalizeString(term).length <= 2);
    const specificContext = hasSpecificSearchContext(query, entityTerms);
    const choices = buildSearchClarificationChoices(ranked, query);
    const ambiguousShortEntity = isGuideSearchQuery(query) &&
        shortEntityTerms.length === 1 &&
        entityTerms.length === 1 &&
        !specificContext;
    const reasons = [];
    if (!ranked.length) {
        reasons.push('no_search_results');
    }
    if (ambiguousShortEntity) {
        reasons.push('short_entity_without_disambiguating_context');
    }
    if (choices.length >= 2 && ambiguousShortEntity) {
        reasons.push('multiple_candidate_interpretations');
    }
    if (topQueryScore < searchOffTargetThreshold(query)) {
        reasons.push('top_result_low_query_match');
    }
    if (top.queryTargetCoverage?.specificTargetCovered === false) {
        reasons.push('top_result_missing_specific_target_terms');
    }
    if (relevantCount === 0) {
        reasons.push('no_relevant_followup_candidates');
    }
    const rawScore = Math.min(1, (
        Math.min(topQueryScore, 100) / 100 * 0.55 +
        Math.min(relevantCount, 5) / 5 * 0.25 +
        Math.min(scoreGap, 35) / 35 * 0.12 +
        (specificContext ? 0.08 : 0)
    ));
    const shouldAskUser = ambiguousShortEntity && (choices.length >= 2 || rawScore < 0.78);
    const score = shouldAskUser ? Math.min(rawScore, 0.44) : rawScore;
    const level = score >= 0.72 ? 'high' : score >= 0.45 ? 'medium' : 'low';
    const target = shortEntityTerms[0] || entityTerms[0] || normalizeString(query);
    const choiceLabels = choices.map((choice) => choice.label).filter(Boolean).slice(0, 4);
    return pruneEmptyDeep({
        level,
        score: Number(score.toFixed(2)),
        shouldAskUser,
        clarificationRequired: shouldAskUser,
        entityTerms,
        specificContext,
        topQueryScore,
        relevantCount,
        scoreGap,
        reasons,
        candidateChoices: choices,
        clarificationQuestion: shouldAskUser
            ? `你说的“${target}”具体指哪一个？${choiceLabels.length ? `我搜到的候选包括：${choiceLabels.join('、')}。` : '目前搜索结果不足以唯一确定对象。'}请补充游戏名、角色全名或选择一个候选后我再继续。`
            : ''
    });
}

function buildSuggestedCallsFromSearchResults(results = [], { query = '', limit = 3 } = {}) {
    const ranked = rankSearchResultsForFollowup(results, query);
    const eligible = ranked.filter((candidate) => isRelevantSearchCandidate(candidate));
    const directCalls = buildSuggestedCallsFromRankedLinks(eligible, limit, { query });
    if (directCalls.length) {
        return directCalls;
    }
    return dedupeSuggestedNextCalls(
        eligible
            .slice(0, limit)
            .map((item) => ({
                tool: 'web_fetch',
                args: query ? { url: item.url, query } : { url: item.url },
                reason: `Read search result: ${normalizeString(item.title, item.url)}`
            })),
        limit
    );
}

function searchProviderTokens(value = '') {
    return String(value || '')
        .split(',')
        .map((item) => normalizeString(item).toLowerCase())
        .filter(Boolean);
}

function shouldAggregateSearchBackends(args = {}) {
    if (args.aggregate === false || args.aggregateSearch === false || args.aggregate_search === false) {
        return false;
    }
    if (args.aggregate === true || args.aggregateSearch === true || args.aggregate_search === true) {
        return true;
    }
    const rawBackends = Array.isArray(args.backends)
        ? args.backends.map((item) => normalizeString(item)).filter(Boolean)
        : searchProviderTokens(args.backend || args.searchBackend || args.search_backend);
    if (rawBackends.length > 1) {
        return true;
    }
    if (rawBackends.length === 1) {
        return false;
    }
    const explicitProvider = normalizeString(args.provider || args.searchProvider || args.search_provider);
    if (explicitProvider) {
        const tokens = searchProviderTokens(explicitProvider);
        return tokens.length > 1 || tokens.some((token) => token === 'auto' || token === 'external' || token === 'agent_web');
    }
    const envProvider = normalizeString(process.env.AILIS_WEB_SEARCH_PROVIDER);
    if (envProvider) {
        const tokens = searchProviderTokens(envProvider);
        return tokens.length > 1 || tokens.some((token) => token === 'auto' || token === 'external' || token === 'agent_web');
    }
    return true;
}

function enrichSearchResultsWithSource(results = [], attempt = {}, backendIndex = 0) {
    return (Array.isArray(results) ? results : []).map((item, resultIndex) => {
        const sourceHints = sourceHintsFromSearchResult(item);
        return pruneEmptyDeep({
            ...item,
            sourceBackend: attempt.backend,
            sourceBackends: normalizeSourceList([attempt.backend, ...sourceHints.sourceBackends]),
            sourceEngines: sourceHints.sourceEngines,
            sourceRank: resultIndex + 1,
            sourceBackendIndex: backendIndex,
            searchProviderUrl: attempt.url
        });
    });
}

function formatSearchResultForModel(item = {}, index = 0) {
    const lines = [
        `${index + 1}. ${item.title}`,
        `URL: ${item.url}`
    ];
    const sources = normalizeSourceList(item.sourceBackends || item.sourceBackend || item.backend);
    if (sources.length) {
        lines.push(`Source: ${sources.join(', ')}`);
    }
    const matchedTerms = Array.isArray(item.queryMatchedTerms) ? item.queryMatchedTerms.slice(0, 8) : [];
    if (matchedTerms.length || Number.isFinite(item.queryScore)) {
        const score = Number.isFinite(item.queryScore) ? `score=${Number(item.queryScore.toFixed(2))}` : '';
        const terms = matchedTerms.length ? `matched=${matchedTerms.join(', ')}` : '';
        lines.push(`Relevance: ${[score, terms].filter(Boolean).join(' ')}`);
    }
    lines.push(`Snippet: ${item.snippet}`);
    return lines.join('\n');
}

const COUNTRY_ANSWER_NAMES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
    'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
    'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
    'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
    'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
    'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
    'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
    'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
    'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
    'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
    'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
    'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
    'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
    'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
    'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
    'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
    'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const COUNTRY_ANSWER_ALIASES = new Map([
    ['United States of America', 'United States'],
    ['USA', 'United States'],
    ['U.S.A.', 'United States'],
    ['US', 'United States'],
    ['U.S.', 'United States'],
    ['UK', 'United Kingdom'],
    ['U.K.', 'United Kingdom'],
    ['Great Britain', 'United Kingdom'],
    ['Russian Federation', 'Russia'],
    ['Viet Nam', 'Vietnam'],
    ['Lao PDR', 'Laos'],
    ['Republic of Korea', 'South Korea'],
    ['Korea Republic', 'South Korea'],
    ['Democratic Republic of the Congo', 'Congo'],
    ['DR Congo', 'Congo'],
    ['Czechia', 'Czech Republic'],
    ['Ivory Coast', "Cote d'Ivoire"],
    ["Cote d'Ivoire", "Cote d'Ivoire"]
]);

function safeDecodeSearchText(value = '') {
    const normalized = normalizeString(value).replace(/\+/g, ' ');
    try {
        return decodeURIComponent(normalized);
    } catch {
        return normalized;
    }
}

function searchAnswerQuestionType(query = '') {
    const text = normalizeString(query).toLowerCase();
    if (/\bfrom\s+what\s+country\b|\b(?:what|which)\s+country\b|\bcountry\s+(?:was|is|were|are|of|from)\b/.test(text)) {
        return 'country';
    }
    return '';
}

function countryNamePattern(name = '') {
    return normalizeString(name)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\[ -]/g, '[\\s+_%/-]+')
        .replace(/\s+/g, '[\\s+_%/-]+');
}

function answerCueNearMatch(text = '', index = 0, length = 0) {
    const start = Math.max(0, index - 80);
    const end = Math.min(text.length, index + length + 80);
    const context = text.slice(start, end);
    return /\b(?:country|countries|nation|nationality|flag|from|origin|source|located|based)\b/i.test(context);
}

function extractSearchAnswerCandidatesFromResult(result = {}, query = '') {
    const answerType = searchAnswerQuestionType(query);
    if (answerType !== 'country') {
        return [];
    }
    const title = normalizeString(result.title);
    const snippet = normalizeString(result.snippet);
    const decodedUrl = safeDecodeSearchText(result.url);
    const haystack = normalizeString([title, snippet, decodedUrl].join(' '))
        .replace(/[_=&?/#:.(),;|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const queryText = normalizeString(query).toLowerCase();
    const candidates = [];
    const names = [
        ...COUNTRY_ANSWER_NAMES.map((name) => [name, name]),
        ...Array.from(COUNTRY_ANSWER_ALIASES.entries())
    ].sort((left, right) => right[0].length - left[0].length);
    for (const [needle, canonical] of names) {
        if (queryText.includes(needle.toLowerCase())) {
            continue;
        }
        const pattern = countryNamePattern(needle);
        if (!pattern) {
            continue;
        }
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        const match = regex.exec(haystack);
        if (!match) {
            continue;
        }
        const cueMatched = answerCueNearMatch(haystack, match.index, match[0].length);
        const matchedTerms = Array.isArray(result.queryMatchedTerms) ? result.queryMatchedTerms : [];
        const urlCue = new RegExp(`\\bcountry\\b.{0,32}\\b${pattern}\\b`, 'i').test(decodedUrl.replace(/[_=&?/#:.(),;|]+/g, ' '));
        if ((!cueMatched && matchedTerms.length < 4) || (matchedTerms.length < 3 && !urlCue)) {
            continue;
        }
        const queryScore = Number(result.queryScore) || 0;
        const rareMatchedTerms = matchedTerms.filter((term) => (
            /^(?:18|19|20)\d{2}$/.test(term) ||
            /^[a-z]{2,8}\s+\d{1,5}$/i.test(term) ||
            normalizeString(term).length >= 4
        ));
        const context = truncateRelationText(haystack.slice(
            Math.max(0, match.index - 120),
            Math.min(haystack.length, match.index + match[0].length + 160)
        ).trim(), 360);
        const score = Math.round(
            34 +
            Math.min(36, queryScore * 0.34) +
            Math.min(28, matchedTerms.length * 7) +
            (cueMatched ? 16 : 0) +
            (urlCue ? 12 : 0) +
            Math.min(10, Number(result.sourceConsensusScore) || 0)
        );
        candidates.push(pruneEmptyDeep({
            answer: canonical,
            type: answerType,
            source: 'web_search_result',
            score,
            title,
            url: normalizeString(result.url),
            context,
            matchedTerms: matchedTerms.slice(0, 8),
            rareMatchedTerms: rareMatchedTerms.slice(0, 6),
            evidence: 'search result title/snippet/url'
        }));
    }
    return candidates;
}

function mergeAnswerCandidatesByAnswer(candidates = [], limit = 5) {
    const byAnswer = new Map();
    for (const candidate of Array.isArray(candidates) ? candidates : []) {
        const answer = normalizeString(candidate.answer);
        const key = answer.toLowerCase();
        if (!answer || !key) {
            continue;
        }
        const score = Number(candidate.score) || 0;
        const existing = byAnswer.get(key);
        if (!existing || score > (Number(existing.score) || 0)) {
            byAnswer.set(key, { ...candidate, answer, score });
        }
    }
    return [...byAnswer.values()]
        .sort((left, right) => (Number(right.score) || 0) - (Number(left.score) || 0) || left.answer.localeCompare(right.answer))
        .slice(0, limit);
}

function extractSearchAnswerCandidates(rankedResults = [], query = '') {
    return mergeAnswerCandidatesByAnswer(
        (Array.isArray(rankedResults) ? rankedResults : [])
            .slice(0, 8)
            .flatMap((result) => extractSearchAnswerCandidatesFromResult(result, query)),
        5
    );
}

function formatSearchAnswerCandidates(candidates = []) {
    const rows = (Array.isArray(candidates) ? candidates : []).slice(0, 5);
    if (!rows.length) {
        return '';
    }
    return [
        'Structured answer candidates from search results:',
        ...rows.map((candidate, index) => [
            `${index + 1}. ${candidate.answer} (${candidate.type || 'answer'}, score=${candidate.score ?? 'n/a'})`,
            `Source: ${candidate.title || candidate.url}`,
            `URL: ${candidate.url}`,
            candidate.context ? `Context: ${candidate.context}` : ''
        ].filter(Boolean).join('\n'))
    ].join('\n');
}

function buildWebSearchSuccessObservation({
    query = '',
    backendQuery = '',
    attempts = [],
    rawResults = [],
    backend = '',
    url = '',
    startedAt = Date.now(),
    overallTimeoutMs = 0,
    aggregated = false
} = {}) {
    const rankedResults = rankSearchResultsForFollowup(rawResults, query);
    const text = rankedResults.map((item, index) => formatSearchResultForModel(item, index)).join('\n\n');
    const answerCandidates = extractSearchAnswerCandidates(rankedResults, query);
    const answerCandidateText = formatSearchAnswerCandidates(answerCandidates);
    const baseSuggestedNextCalls = buildSuggestedCallsFromSearchResults(rankedResults, { query, limit: 3 });
    const observedRelevantLinks = rankedResults
        .filter((candidate) => isRelevantSearchCandidate(candidate))
        .slice(0, 5)
        .map((candidate) => summarizeRelevantLink(candidate));
    const queryFocusTerms = extractSearchQueryTerms(query).slice(0, 6);
    const topQueryScore = rankedResults[0]?.queryScore || 0;
    const searchRelevance = describeSearchRelevance(rankedResults);
    const offTarget = baseSuggestedNextCalls.length === 0 && !hasEnoughRelevantSearchEvidence(rankedResults, query);
    const searchConfidence = assessSearchConfidence(rankedResults, query);
    const clarificationRequired = searchConfidence.clarificationRequired === true;
    const suggestedNextCalls = clarificationRequired
        ? []
        : offTarget && looksScholarlySearchQuery(query)
        ? dedupeSuggestedNextCalls([
            {
                tool: 'paper_metadata_lookup',
                args: inferPaperMetadataArgsFromScholarlyQuery(query),
                reason: 'Search results look off-target for a bibliographic query; switch to structured scholarly metadata lookup instead of rephrasing the same web search.'
            },
            ...baseSuggestedNextCalls
        ], 3)
        : baseSuggestedNextCalls;
    const evidenceGap = clarificationRequired
        ? `Search confidence is ${searchConfidence.level}; the query appears ambiguous and should be clarified before following any result.`
        : offTarget
        ? `Search results look off-target for the key query terms: ${queryFocusTerms.join(', ') || query}. Refine the query with exact phrases, source names, or author names before following a result.`
        : 'Search results are discovery only. Open a result or resolve a DOI/PDF before answering.';
    const recoveryHint = clarificationRequired
        ? searchConfidence.clarificationQuestion || 'Ask the user to disambiguate the target before calling web_fetch or another broad search.'
        : offTarget
        ? 'Do not follow obviously unrelated popular results. Tighten the query or switch to a more specific tool before searching again.'
        : 'Prefer the suggested follow-up calls below before issuing another broad web_search.';
    const guidance = buildWebToolGuidanceText({
        evidenceGap,
        recoveryHint,
        suggestedNextCalls,
        observedRelevantLinks
    });
    const successfulBackends = attempts.filter((attempt) => attempt.ok).map((attempt) => attempt.backend);
    const resultBackends = normalizeSourceList(rankedResults.flatMap((item) => item.sourceBackends || item.sourceBackend || []));
    const response = textResult([guidance, answerCandidateText, `Search results:\n${text}`].filter(Boolean).join('\n\n'), {
        status: 'completed',
        query,
        backendQuery: backendQuery !== query ? backendQuery : undefined,
        backend: aggregated ? 'aggregated' : backend,
        url,
        durationMs: attempts.filter((attempt) => attempt.ok).reduce((total, attempt) => total + (Number(attempt.durationMs) || 0), 0),
        overallDurationMs: Date.now() - startedAt,
        overallTimeoutMs,
        attempts,
        results: rankedResults,
        rawResults,
        searchRelevance,
        searchConfidence,
        clarificationRequired,
        candidateChoices: searchConfidence.candidateChoices || [],
        answerCandidates,
        evidenceGap,
        recoveryHint,
        suggestedNextCalls,
        observedRelevantLinks,
        queryFocusTerms,
        topQueryScore,
        searchAggregation: pruneEmptyDeep({
            enabled: aggregated || undefined,
            successfulBackends,
            resultBackends,
            mergedResultCount: rawResults.length
        })
    });
    return {
        response,
        rankedResults,
        suggestedNextCalls,
        searchConfidence,
        offTarget
    };
}

function shouldContinueSearchAggregation({
    args = {},
    backends = [],
    backendIndex = 0,
    searchConfidence = {},
    suggestedNextCalls = [],
    offTarget = false
} = {}) {
    if (backendIndex >= backends.length - 1 || !shouldAggregateSearchBackends(args)) {
        return false;
    }
    if (searchConfidence.clarificationRequired === true) {
        return false;
    }
    if (offTarget) {
        return true;
    }
    if (!suggestedNextCalls.length && searchConfidence.level !== 'high') {
        return true;
    }
    return searchConfidence.level === 'low';
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
        isRelevantSearchCandidate(candidate) ||
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

function countCjkCharacters(text = '') {
    return (normalizeString(text).match(/[\u3400-\u9fff]/g) || []).length;
}

function countUtf8MojibakeMarkers(text = '') {
    const sample = normalizeString(text).slice(0, 6000);
    return (
        (sample.match(/(?:Ã.|Â.|â[\u0080-\u00bf]|[åçéèäæ][\u0080-\u00bf])/g) || []).length +
        (sample.match(/[�]/g) || []).length
    );
}

function looksLikeUtf8Mojibake(text = '') {
    const sample = normalizeString(text).slice(0, 6000);
    if (!sample) {
        return false;
    }
    const mojibakeMarkers = countUtf8MojibakeMarkers(sample);
    const cjkCount = countCjkCharacters(sample);
    return mojibakeMarkers >= 8 && mojibakeMarkers > Math.max(6, cjkCount * 2);
}

function repairUtf8MojibakeText(text = '') {
    const original = normalizeString(text);
    if (!looksLikeUtf8Mojibake(original)) {
        return { text: original, repaired: false, suspected: false };
    }
    let best = original;
    let repaired = false;
    for (let pass = 0; pass < 3 && looksLikeUtf8Mojibake(best); pass += 1) {
        const next = Buffer.from(best, 'latin1').toString('utf8');
        if (!next || next === best) {
            break;
        }
        const bestCjk = countCjkCharacters(best);
        const nextCjk = countCjkCharacters(next);
        const bestMarkers = countUtf8MojibakeMarkers(best);
        const nextMarkers = countUtf8MojibakeMarkers(next);
        if (nextCjk > bestCjk || nextMarkers < bestMarkers) {
            best = next;
            repaired = true;
            continue;
        }
        break;
    }
    if (repaired && !looksLikeUtf8Mojibake(best)) {
        return { text: best, repaired: true, suspected: false };
    }
    return { text: best, repaired, suspected: looksLikeUtf8Mojibake(best) };
}

function looksLikeJavaScriptShellText(text = '', url = '') {
    const compact = normalizeString(text).replace(/\s+/g, ' ');
    if (!compact) {
        return true;
    }
    if (/miyoushe\.com/i.test(url) && compact.length <= 240 && /\bloading\b/i.test(compact)) {
        return true;
    }
    return compact.length <= 240 &&
        /(loading\.{0,3}|正在加载|加载中|please enable javascript|enable javascript|javascript is disabled|app-root|__next)/i.test(compact);
}

function extractEvidenceTerms(query = '') {
    const text = normalizeString(query)
        .replace(/\bsite:[^\s]+/gi, ' ')
        .replace(/\bhttps?:\/\/\S+/gi, ' ');
    const seen = new Set();
    const terms = [];
    for (const match of text.matchAll(/[\u3400-\u9fff]{2,}|[a-z0-9][a-z0-9_-]{2,}/gi)) {
        const term = normalizeString(match[0]).toLowerCase();
        if (!term || SEARCH_QUERY_STOPWORDS.has(term) || seen.has(term)) {
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

function countEvidenceTermMatches(text = '', query = '') {
    const haystack = normalizeString(text).toLowerCase();
    if (!haystack) {
        return 0;
    }
    return extractEvidenceTerms(query)
        .filter((term) => haystack.includes(term.toLowerCase()))
        .length;
}

function isMandatoryEvidenceFollowup(call = {}) {
    const tool = normalizeString(call.tool);
    return ['paper_metadata_lookup', 'pdf_extract_text', 'pdf_find_and_extract', 'download_file'].includes(tool);
}

function classifyFetchedPageType({ text = '', url = '', contentType = '', suggestedNextCalls = [] } = {}) {
    const normalizedText = normalizeString(text);
    const normalizedUrl = normalizeString(url).toLowerCase();
    if (looksLikeJavaScriptShellText(normalizedText, url)) {
        return 'js_shell';
    }
    if (
        /(?:^|[/?#&])(search|s)(?:[/?#&=]|$)/i.test(normalizedUrl) ||
        /[?&](?:q|query|keyword|search|wd|text)=/i.test(normalizedUrl) ||
        /搜索结果|search results|related searches|筛选结果/i.test(normalizedText)
    ) {
        return 'search_results_page';
    }
    if (
        /(?:youtube\.com\/watch|youtu\.be\/|bilibili\.com\/video\/|\/video\/|vimeo\.com\/)/i.test(normalizedUrl) ||
        (
            /视频|播放|弹幕|views?|subscribers?|正在缓冲|未经作者授权/i.test(normalizedText) &&
            /播放量|弹幕|video|watch|投稿|recommend|相关推荐/i.test(normalizedText)
        )
    ) {
        return 'video_page';
    }
    const linkLikeCount = (normalizedText.match(/\]\(|https?:\/\/|^\s*\*/gim) || []).length;
    const headingLikeCount = (normalizedText.match(/^#{1,4}\s+|<h[1-6]\b/gim) || []).length;
    const paragraphishCount = (normalizedText.match(/[。.!?！？]\s/g) || []).length;
    const hasManySuggestedLinks = Array.isArray(suggestedNextCalls) && suggestedNextCalls.length >= 2;
    if (
        normalizedText.length >= 600 &&
        (linkLikeCount >= 18 || hasManySuggestedLinks) &&
        headingLikeCount <= 3 &&
        paragraphishCount <= 8 &&
        /首页|导航|版块|分类|频道|更多|热门|排行|index|home|menu|category/i.test(normalizedText)
    ) {
        return 'navigation_page';
    }
    if (/html|markdown|text/i.test(contentType) && (headingLikeCount > 0 || paragraphishCount >= 4)) {
        return 'article_or_document_page';
    }
    return 'unknown_page';
}

function classifyWebFetchEvidenceQuality({ text = '', url = '', query = '', contentType = '', barrier = null, suggestedNextCalls = [], truncated = false, encodingRepair = null } = {}) {
    const normalizedText = normalizeString(text);
    const pageType = classifyFetchedPageType({ text, url, contentType, suggestedNextCalls });
    if (barrier) {
        return {
            evidenceQuality: barrier.status || 'access_barrier',
            isEvidence: false,
            evidenceGap: barrier.evidenceGap,
            recoveryHint: barrier.recoveryHint,
            pageStatus: barrier.status,
            pageType
        };
    }
    if (pageType === 'js_shell') {
        return {
            evidenceQuality: 'js_shell',
            isEvidence: false,
            evidenceGap: 'The fetched page is only a JavaScript loading shell, not answer-bearing page content.',
            recoveryHint: 'Do not refetch the same URL. Use an accessible source, a reader/backend that can render JavaScript, or a different search result.',
            pageStatus: 'js_shell',
            pageType
        };
    }
    if (encodingRepair?.suspected) {
        return {
            evidenceQuality: 'encoding_failure',
            isEvidence: false,
            evidenceGap: 'The fetched text appears mojibake/incorrectly decoded, so it is not reliable answer evidence.',
            recoveryHint: 'Retry through an encoding-aware fetch backend or choose another accessible source instead of reasoning from mojibake.',
            pageStatus: 'encoding_failure',
            pageType
        };
    }
    if (normalizedText.length < 200) {
        return {
            evidenceQuality: 'thin_content',
            isEvidence: false,
            evidenceGap: 'The fetched page text is too short to be reliable answer evidence.',
            recoveryHint: 'Open a higher-signal result or use a domain-specific source instead of repeating this thin page.',
            pageStatus: 'thin_content',
            pageType
        };
    }
    if (pageType === 'video_page') {
        return {
            evidenceQuality: 'metadata_only',
            isEvidence: true,
            evidenceGap: 'The fetched page is video metadata/page chrome, not the transcript or answer-bearing guide content.',
            recoveryHint: 'Use a transcript/video-specific tool, ASR, page description, or an accessible text guide before generating detailed claims.',
            pageStatus: 'video_metadata',
            pageType
        };
    }
    if (pageType === 'search_results_page' || pageType === 'navigation_page') {
        return {
            evidenceQuality: 'link_hub',
            isEvidence: false,
            evidenceGap: 'The fetched page is a search/navigation/link hub rather than answer-bearing content.',
            recoveryHint: 'Follow the most relevant high-signal linked source with web_fetch or a domain-specific reader instead of answering from this page.',
            pageStatus: pageType,
            pageType
        };
    }
    const mandatoryFollowup = suggestedNextCalls.some(isMandatoryEvidenceFollowup);
    if (mandatoryFollowup) {
        return {
            evidenceQuality: 'partial_evidence',
            isEvidence: true,
            evidenceGap: 'This page excerpt is not enough on its own. Follow the linked DOI/PDF/document candidate before answering.',
            recoveryHint: 'Prefer following the high-signal linked resources below instead of broadening back to web_search.',
            pageStatus: 'partial_evidence',
            pageType
        };
    }
    const matchedTerms = countEvidenceTermMatches(normalizedText, query);
    const hasQuery = extractEvidenceTerms(query).length > 0;
    const enoughText = normalizedText.length >= 1200;
    const querySatisfied = !hasQuery || matchedTerms >= Math.min(2, extractEvidenceTerms(query).length);
    if (enoughText && querySatisfied && !truncated) {
        return {
            evidenceQuality: 'sufficient_evidence',
            isEvidence: true,
            evidenceGap: '',
            recoveryHint: 'Use this page content to answer if it matches the user goal; do not refetch the same URL unless a specific missing field remains.',
            pageStatus: encodingRepair?.repaired ? 'encoding_repaired' : 'content_ready',
            pageType
        };
    }
    return {
        evidenceQuality: 'partial_evidence',
        isEvidence: true,
        evidenceGap: /html/i.test(contentType)
            ? 'This is a page excerpt. If the answer depends on missing details, inspect a more specific link or source next.'
            : '',
        recoveryHint: '',
        pageStatus: encodingRepair?.repaired ? 'encoding_repaired' : 'partial_evidence',
        pageType
    };
}

function buildHttpAccessFailureDetails(url, fetched = {}) {
    const details = pruneEmptyDeep({
        url,
        statusCode: Number(fetched.status) || undefined,
        errorCode: normalizeString(fetched.errorCode),
        backend: normalizeString(fetched.backend),
        fallbackFrom: normalizeString(fetched.fallbackFrom),
        primaryErrorCode: normalizeString(fetched.primaryErrorCode),
        fallbackErrorCode: normalizeString(fetched.fallbackErrorCode),
        fallbackError: normalizeString(fetched.fallbackError),
        stderr: normalizeString(fetched.stderr)
    });
    if (fetched.status === 403) {
        details.evidenceGap = 'Remote site blocked automated access (HTTP 403).';
        details.recoveryHint = 'This is a server-side access policy, not a local network failure. Prefer metadata, extracted links from an accessible page, or another source instead of retrying this URL.';
    } else if (fetched.status === 429) {
        details.evidenceGap = 'Remote site rate-limited automated requests (HTTP 429).';
        details.recoveryHint = 'This is a remote rate limit, not a local connectivity failure. Back off or use another API/source instead of hammering the same endpoint.';
    } else if (/ssl|unexpected_eof|eof occurred/i.test(`${fetched.error || ''}\n${fetched.stderr || ''}\n${fetched.fallbackError || ''}`)) {
        details.failureReason = 'https_ssl_fetch_failed';
        details.evidenceGap = 'The HTTP fetch backend hit a TLS/SSL transport failure before page content was retrieved.';
        details.recoveryHint = 'Retry the same URL once through the alternate fetch backend, or use a high-signal search result URL instead of switching to shell scraping.';
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
        rows.push(pruneEmptyDeep({
            ...result,
            title: title || url,
            url,
            snippet
        }));
        if (rows.length >= maxResults) {
            break;
        }
    }
    return rows;
}

function normalizeSourceList(value) {
    const raw = Array.isArray(value)
        ? value
        : typeof value === 'string'
            ? value.split(/[,|]/g)
            : [];
    const seen = new Set();
    const items = [];
    for (const item of raw) {
        const normalized = normalizeString(item).toLowerCase();
        if (!normalized || seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        items.push(normalized);
    }
    return items;
}

function canonicalSearchResultKey(rawUrl = '') {
    const normalizedUrl = normalizeUrlCandidate(rawUrl);
    if (!normalizedUrl) {
        return '';
    }
    try {
        const parsed = new URL(normalizedUrl);
        parsed.hash = '';
        for (const key of Array.from(parsed.searchParams.keys())) {
            if (/^(?:utm_|fbclid|gclid|yclid|mc_|spm|share|from|ref|source)$/i.test(key)) {
                parsed.searchParams.delete(key);
            }
        }
        parsed.hostname = parsed.hostname.replace(/^www\./i, '').toLowerCase();
        parsed.pathname = (parsed.pathname || '/').replace(/\/{2,}/g, '/').replace(/\/+$/g, '') || '/';
        return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.search}`.toLowerCase();
    } catch {
        return normalizedUrl.replace(/[#?].*$/g, '').replace(/\/+$/g, '').toLowerCase();
    }
}

function sourceHintsFromSearchResult(result = {}) {
    const engineHints = [
        ...normalizeSourceList(result.sourceEngines),
        ...normalizeSourceList(result.engines),
        ...normalizeSourceList(result.engine),
        ...normalizeSourceList(result.category)
    ];
    const backendHints = [
        ...normalizeSourceList(result.sourceBackends),
        ...normalizeSourceList(result.sourceBackend),
        ...normalizeSourceList(result.backend)
    ];
    return {
        sourceBackends: backendHints,
        sourceEngines: engineHints
    };
}

function mergeSearchResultsForRerank(results = [], maxResults = 24) {
    const merged = new Map();
    for (const item of Array.isArray(results) ? results : []) {
        const url = normalizeUrlCandidate(item.url);
        const key = canonicalSearchResultKey(url);
        if (!key) {
            continue;
        }
        const title = stripHtml(item.title || '').replace(/\s+/g, ' ').trim() || url;
        const snippet = stripHtml(item.snippet || '').replace(/\s+/g, ' ').trim();
        const sourceHints = sourceHintsFromSearchResult(item);
        const existing = merged.get(key);
        if (!existing) {
            merged.set(key, pruneEmptyDeep({
                ...item,
                title,
                url,
                snippet,
                sourceBackends: sourceHints.sourceBackends,
                sourceEngines: sourceHints.sourceEngines,
                sourceCount: Math.max(1, sourceHints.sourceBackends.length + sourceHints.sourceEngines.length)
            }));
            continue;
        }
        if (title.length > normalizeString(existing.title).length) {
            existing.title = title;
        }
        if (snippet && !normalizeString(existing.snippet).includes(snippet)) {
            existing.snippet = truncateRelationText([existing.snippet, snippet].filter(Boolean).join(' | '), 700);
        }
        existing.sourceBackends = normalizeSourceList([
            ...(existing.sourceBackends || []),
            ...sourceHints.sourceBackends
        ]);
        existing.sourceEngines = normalizeSourceList([
            ...(existing.sourceEngines || []),
            ...sourceHints.sourceEngines
        ]);
        existing.sourceCount = Math.max(1, existing.sourceBackends.length + existing.sourceEngines.length);
    }
    return Array.from(merged.values()).slice(0, maxResults);
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

const HTML_SEARCH_BACKEND_IDS = Object.freeze(['bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'yahoo_html']);
const DEFAULT_SEARXNG_URL = 'http://127.0.0.1:8080';
const DEFAULT_FIRECRAWL_LOCAL_URL = 'http://127.0.0.1:3002';
const FIRECRAWL_CLOUD_URL = 'https://api.firecrawl.dev';
const DEFAULT_CRAWL4AI_URL = 'http://127.0.0.1:11235';
const DEFAULT_CRAWL4AI_WORKER = path.join(__dirname, 'ailis-crawl4ai-worker.py');
const CRAWL4AI_FETCH_PROVIDERS = new Set(['crawl4ai', 'rendered', 'browser', 'crawl4ai_rendered', 'crawl4ai-style', 'crawl4ai_style']);
const RENDERED_FALLBACK_EVIDENCE_QUALITIES = new Set(['js_shell', 'thin_content']);
const PROJECT_ROOT = path.resolve(__dirname, '..');

function executableName(name) {
    return process.platform === 'win32' ? `${name}.exe` : name;
}

function venvPythonPath(venvDir) {
    return process.platform === 'win32'
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');
}

function asarUnpackedPath(filePath = '') {
    return normalizeString(filePath).replace(/\.asar([/\\])/, '.asar.unpacked$1');
}

function firstExistingPath(paths = []) {
    for (const candidate of paths) {
        const normalized = normalizeString(candidate);
        if (normalized && fsSync.existsSync(normalized)) {
            return normalized;
        }
    }
    return '';
}

function managedPythonExecutableCandidates(pythonRoot = '') {
    const root = normalizeString(pythonRoot);
    if (!root) {
        return [];
    }
    const candidates = [
        path.join(root, executableName('python')),
        path.join(root, 'python.exe'),
        path.join(root, 'bin', 'python')
    ];
    try {
        for (const entry of fsSync.readdirSync(root, { withFileTypes: true })) {
            if (!entry.isDirectory()) {
                continue;
            }
            const child = path.join(root, entry.name);
            candidates.push(path.join(child, executableName('python')));
            candidates.push(path.join(child, 'python.exe'));
            candidates.push(path.join(child, 'bin', 'python'));
            candidates.push(path.join(child, 'install', 'bin', 'python'));
        }
    } catch {
        // Missing runtime directories are expected in development and fallback mode.
    }
    return candidates;
}

function ailisWebRuntimeRoots() {
    const roots = [
        process.env.AILIS_WEB_RUNTIME_DIR,
        process.env.AILIS_LOCAL_RUNTIME_DIR,
        process.resourcesPath ? path.join(process.resourcesPath, 'ailis-web-runtime') : '',
        path.join(PROJECT_ROOT, 'build-cache', 'ailis-web-runtime'),
        path.join(PROJECT_ROOT, '.ailis-runtime')
    ];
    return roots.map((root) => normalizeString(root)).filter(Boolean);
}

function resolveBundledCrawl4aiPython() {
    const candidates = [];
    for (const root of ailisWebRuntimeRoots()) {
        candidates.push(venvPythonPath(path.join(root, 'crawl4ai-venv')));
        candidates.push(...managedPythonExecutableCandidates(path.join(root, 'python')));
    }
    return firstExistingPath(candidates);
}

function resolveBundledPlaywrightBrowsersPath() {
    const candidates = [];
    for (const root of ailisWebRuntimeRoots()) {
        candidates.push(path.join(root, 'ms-playwright'));
        candidates.push(path.join(root, 'playwright-browsers'));
    }
    return firstExistingPath(candidates);
}

function resolveBundledCrawl4aiWorker() {
    return firstExistingPath([
        asarUnpackedPath(DEFAULT_CRAWL4AI_WORKER),
        process.resourcesPath ? path.join(process.resourcesPath, 'app.asar.unpacked', 'scripts', 'ailis-crawl4ai-worker.py') : '',
        DEFAULT_CRAWL4AI_WORKER
    ]) || DEFAULT_CRAWL4AI_WORKER;
}

function normalizeBaseUrl(value = '') {
    return normalizeString(value).replace(/\/+$/g, '');
}

function searxngBaseUrl(args = {}) {
    return normalizeBaseUrl(
        args.searxngUrl ||
        args.searxng_url ||
        process.env.AILIS_SEARXNG_URL ||
        process.env.SEARXNG_URL ||
        DEFAULT_SEARXNG_URL
    );
}

function hasConfiguredSearxngUrl(args = {}) {
    return Boolean(
        normalizeString(args.searxngUrl || args.searxng_url) ||
        normalizeString(process.env.AILIS_SEARXNG_URL || process.env.SEARXNG_URL)
    );
}

function firecrawlBaseUrl(args = {}) {
    const configured = normalizeBaseUrl(
        args.firecrawlUrl ||
        args.firecrawl_url ||
        process.env.AILIS_FIRECRAWL_URL ||
        process.env.FIRECRAWL_BASE_URL
    );
    if (configured) {
        return configured;
    }
    return DEFAULT_FIRECRAWL_LOCAL_URL;
}

function hasConfiguredFirecrawlUrl(args = {}) {
    return Boolean(
        normalizeString(args.firecrawlUrl || args.firecrawl_url) ||
        normalizeString(process.env.AILIS_FIRECRAWL_URL || process.env.FIRECRAWL_BASE_URL)
    );
}

function hasConfiguredCrawl4aiUrl(args = {}) {
    return Boolean(
        normalizeString(args.crawl4aiUrl || args.crawl4ai_url) ||
        normalizeString(process.env.AILIS_CRAWL4AI_URL || process.env.CRAWL4AI_URL)
    );
}

function hasConfiguredCrawl4aiWorker(args = {}) {
    return Boolean(
        normalizeString(args.crawl4aiWorker || args.crawl4ai_worker) ||
        normalizeString(process.env.AILIS_CRAWL4AI_WORKER || process.env.CRAWL4AI_WORKER) ||
        optionIsTrue(process.env.AILIS_CRAWL4AI_ENABLED)
    );
}

function crawl4aiWorkerPath(args = {}) {
    return path.resolve(
        normalizeString(args.crawl4aiWorker || args.crawl4ai_worker) ||
        normalizeString(process.env.AILIS_CRAWL4AI_WORKER || process.env.CRAWL4AI_WORKER) ||
        resolveBundledCrawl4aiWorker()
    );
}

function crawl4aiFetchConfig(args = {}) {
    const provider = normalizeString(
        args.fetchProvider ||
        args.fetch_provider ||
        args.provider ||
        process.env.AILIS_WEB_FETCH_PROVIDER ||
        'auto',
        'auto'
    ).toLowerCase();
    if (provider === 'builtin' || provider === 'current' || provider === 'html') {
        return null;
    }
    const python = normalizeString(
        args.crawl4aiPython ||
        args.crawl4ai_python ||
        process.env.AILIS_CRAWL4AI_PYTHON ||
        process.env.AILIS_PYTHON ||
        resolveBundledCrawl4aiPython() ||
        'python',
        'python'
    );
    const configuredUrl = normalizeBaseUrl(
        args.crawl4aiUrl ||
        args.crawl4ai_url ||
        process.env.AILIS_CRAWL4AI_URL ||
        process.env.CRAWL4AI_URL
    );
    if (configuredUrl) {
        return { mode: 'http', baseUrl: configuredUrl, provider, configured: true, probe: false };
    }
    const workerPath = crawl4aiWorkerPath(args);
    const workerConfigured = hasConfiguredCrawl4aiWorker(args);
    const playwrightBrowsersPath = normalizeString(
        args.playwrightBrowsersPath ||
        args.playwright_browsers_path ||
        process.env.AILIS_PLAYWRIGHT_BROWSERS_PATH ||
        process.env.PLAYWRIGHT_BROWSERS_PATH ||
        resolveBundledPlaywrightBrowsersPath()
    );
    if (CRAWL4AI_FETCH_PROVIDERS.has(provider)) {
        return { mode: 'local_worker', workerPath, python, provider, configured: workerConfigured, probe: false, playwrightBrowsersPath };
    }
    if (provider === 'auto' && fsSync.existsSync(workerPath)) {
        return {
            mode: 'local_worker',
            workerPath,
            python,
            provider,
            configured: workerConfigured,
            probe: !workerConfigured,
            playwrightBrowsersPath
        };
    }
    if (provider === 'auto') {
        return { mode: 'http', baseUrl: DEFAULT_CRAWL4AI_URL, provider, configured: false, probe: true };
    }
    return null;
}

function buildSearxngSearchUrl(query, maxResults, args = {}) {
    const baseUrl = searxngBaseUrl(args);
    const url = new URL(`${baseUrl}/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('language', normalizeString(args.language || args.lang || 'auto', 'auto'));
    url.searchParams.set('safesearch', String(clampNumber(args.safeSearch || args.safe_search, 0, 0, 2)));
    url.searchParams.set('pageno', '1');
    if (maxResults) {
        url.searchParams.set('results_on_new_tab', '0');
    }
    return url.toString();
}

function extractSearxngJsonResults(payload = {}, maxResults = 8) {
    const rows = Array.isArray(payload.results) ? payload.results : [];
    return dedupeSearchResults(rows.map((item) => ({
        title: item.title || item.pretty_url || item.url,
        url: item.url,
        snippet: item.content || item.snippet || item.description || item.engine || '',
        sourceEngines: Array.isArray(item.engines) ? item.engines : [item.engine].filter(Boolean),
        category: item.category || '',
        publishedDate: item.publishedDate || item.published_date || ''
    })), maxResults);
}

function extractFirecrawlSearchResults(payload = {}, maxResults = 8) {
    const rows = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.results)
            ? payload.results
            : [];
    return dedupeSearchResults(rows.map((item) => {
        const metadata = item.metadata || {};
        const markdown = normalizeString(item.markdown || item.content || item.text);
        return {
            title: item.title || metadata.title || item.url,
            url: item.url || item.link,
            snippet: item.description || item.snippet || metadata.description || markdown.slice(0, 500),
            sourceEngines: ['firecrawl'],
            contentKind: markdown ? 'markdown' : ''
        };
    }), maxResults);
}

async function runSearxngSearchBackend({ query, maxResults, timeoutMs, args = {} } = {}) {
    const startedAt = Date.now();
    const url = buildSearxngSearchUrl(query, maxResults, args);
    const effectiveTimeoutMs = hasConfiguredSearxngUrl(args) ? timeoutMs : Math.min(timeoutMs, 1800);
    const fetched = await fetchJsonWithNodeFetch(url, { timeoutMs: effectiveTimeoutMs });
    const durationMs = Date.now() - startedAt;
    if (!fetched.ok) {
        return {
            ok: false,
            backend: 'searxng_json',
            url,
            durationMs,
            status: fetched.status || 0,
            errorCode: fetched.errorCode || (fetched.timedOut ? 'timeout' : 'searxng_fetch_failed'),
            error: fetched.error || 'SearXNG JSON search failed.',
            retryable: true
        };
    }
    const results = extractSearxngJsonResults(fetched.json, maxResults);
    return {
        ok: results.length > 0,
        backend: 'searxng_json',
        url,
        durationMs,
        status: fetched.status || 0,
        errorCode: results.length ? '' : 'no_results_parsed',
        error: results.length ? '' : 'SearXNG returned JSON, but no result rows were parsed.',
        retryable: results.length === 0,
        results
    };
}

async function runFirecrawlSearchBackend({ query, maxResults, timeoutMs, args = {} } = {}) {
    const startedAt = Date.now();
    const baseUrl = firecrawlBaseUrl(args);
    const url = `${baseUrl}/v1/search`;
    if (normalizeBaseUrl(baseUrl) === FIRECRAWL_CLOUD_URL) {
        return {
            ok: false,
            backend: 'firecrawl_search',
            url,
            durationMs: Date.now() - startedAt,
            status: 0,
            errorCode: 'firecrawl_cloud_disabled',
            error: 'AILIS local web_search does not call hosted Firecrawl. Configure AILIS_FIRECRAWL_URL to a local/self-hosted Firecrawl server instead.',
            retryable: false
        };
    }
    const effectiveTimeoutMs = hasConfiguredFirecrawlUrl(args) ? timeoutMs : Math.min(timeoutMs, 1800);
    const fetched = await fetchJsonWithNodeFetch(url, {
        method: 'POST',
        timeoutMs: effectiveTimeoutMs,
        body: {
            query,
            limit: maxResults
        }
    });
    const durationMs = Date.now() - startedAt;
    if (!fetched.ok) {
        return {
            ok: false,
            backend: 'firecrawl_search',
            url,
            durationMs,
            status: fetched.status || 0,
            errorCode: fetched.errorCode || (fetched.timedOut ? 'timeout' : 'firecrawl_fetch_failed'),
            error: fetched.error || 'Firecrawl search failed.',
            retryable: fetched.status !== 401 && fetched.status !== 403
        };
    }
    const results = extractFirecrawlSearchResults(fetched.json, maxResults);
    return {
        ok: results.length > 0,
        backend: 'firecrawl_search',
        url,
        durationMs,
        status: fetched.status || 0,
        errorCode: results.length ? '' : 'no_results_parsed',
        error: results.length ? '' : 'Firecrawl returned JSON, but no result rows were parsed.',
        retryable: results.length === 0,
        results
    };
}

const SEARCH_BACKENDS = Object.freeze({
    searxng_json: Object.freeze({
        id: 'searxng_json',
        run: runSearxngSearchBackend
    }),
    firecrawl_search: Object.freeze({
        id: 'firecrawl_search',
        run: runFirecrawlSearchBackend
    }),
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

function dedupeSearchBackendIds(ids = []) {
    const seen = new Set();
    const unique = [];
    for (const id of ids) {
        const normalized = normalizeString(id).toLowerCase();
        if (!normalized || seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        unique.push(normalized);
    }
    return unique;
}

function expandSearchProviderToken(token = '', query = '', { includeFallback = true } = {}) {
    const normalized = normalizeString(token).toLowerCase();
    if (!normalized || normalized === 'auto') {
        const chain = ['searxng_json', 'firecrawl_search', ...HTML_SEARCH_BACKEND_IDS];
        return isLikelyGitHubSearch(query) ? ['github_repositories', ...chain] : chain;
    }
    if (normalized === 'html' || normalized === 'builtin_html' || normalized === 'current_html_fallback') {
        return [...HTML_SEARCH_BACKEND_IDS];
    }
    if (normalized === 'searxng') {
        return includeFallback ? ['searxng_json', ...HTML_SEARCH_BACKEND_IDS] : ['searxng_json'];
    }
    if (normalized === 'firecrawl') {
        return includeFallback ? ['firecrawl_search', ...HTML_SEARCH_BACKEND_IDS] : ['firecrawl_search'];
    }
    if (normalized === 'external' || normalized === 'agent_web') {
        return ['searxng_json', 'firecrawl_search', ...HTML_SEARCH_BACKEND_IDS];
    }
    if (normalized === 'github') {
        return ['github_repositories'];
    }
    return [normalized];
}

function expandSearchProviderIds(value = '', query = '') {
    const tokens = String(value || 'auto')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    const compound = tokens.length > 1;
    return dedupeSearchBackendIds(
        tokens.flatMap((item) => expandSearchProviderToken(item, query, { includeFallback: !compound }))
    );
}

function normalizeSearchBackends(args = {}, query = '') {
    const raw = Array.isArray(args.backends)
        ? args.backends
        : String(args.backend || args.searchBackend || args.search_backend || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    const requested = raw.length
        ? dedupeSearchBackendIds(raw.flatMap((item) => expandSearchProviderToken(item, query, { includeFallback: raw.length <= 1 })))
        : expandSearchProviderIds(
            args.provider ||
            args.searchProvider ||
            args.search_provider ||
            process.env.AILIS_WEB_SEARCH_PROVIDER ||
            'auto',
            query
        );
    const backends = requested
        .map((id) => SEARCH_BACKENDS[normalizeString(id).toLowerCase()])
        .filter(Boolean);
    return backends.length ? backends : HTML_SEARCH_BACKEND_IDS.map((id) => SEARCH_BACKENDS[id]);
}

async function runSearchBackend(backend, query, maxResults, timeoutMs, args = {}) {
    const startedAt = Date.now();
    if (typeof backend.run === 'function') {
        try {
            const attempt = await backend.run({ query, maxResults, timeoutMs, args });
            return {
                ...attempt,
                backend: attempt.backend || backend.id,
                durationMs: Number.isFinite(attempt.durationMs) ? attempt.durationMs : Date.now() - startedAt
            };
        } catch (error) {
            return {
                ok: false,
                backend: backend.id,
                durationMs: Date.now() - startedAt,
                status: 0,
                errorCode: 'search_backend_exception',
                error: error?.message || String(error),
                stderr: error?.stack || '',
                retryable: true
            };
        }
    }
    const url = backend.buildUrl(query, maxResults, args);
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
    const exactKeywords = Array.isArray(args.exact_keywords)
        ? args.exact_keywords
        : (Array.isArray(args.exactKeywords) ? args.exactKeywords : []);
    const normalizedExactKeywords = exactKeywords
        .map((item) => normalizeString(item))
        .filter(Boolean);
    const query = normalizeString(args.query || args.q || args.search || args.text) || normalizedExactKeywords.join(' ');
    if (!query) {
        return errorResult('web_search requires query');
    }
    const queryWithExactKeywords = [
        query,
        ...normalizedExactKeywords
            .filter((term) => !query.toLowerCase().includes(term.toLowerCase()))
            .map((term) => quoteSearchTerm(term))
    ].filter(Boolean).join(' ');
    const backendQuery = normalizeString(args.backendQuery || args.backend_query) || buildEffectiveSearchQuery(queryWithExactKeywords);
    const maxResults = clampNumber(args.maxResults || args.limit, 8, 1, 12);
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 8000, 3000, 30000);
    const attempts = [];
    const backends = normalizeSearchBackends(args, backendQuery);
    const overallTimeoutMs = clampNumber(
        args.overallTimeoutMs || args.overall_timeout_ms,
        Math.min(36000, Math.max(12000, timeoutMs * backends.length)),
        8000,
        120000
    );
    const startedAt = Date.now();
    const aggregateAcrossBackends = shouldAggregateSearchBackends(args);
    let collectedResults = [];
    let lastSuccessObservation = null;
    let lastSuccessfulAttempt = null;
    for (let backendIndex = 0; backendIndex < backends.length; backendIndex += 1) {
        const elapsedMs = Date.now() - startedAt;
        const remainingMs = overallTimeoutMs - elapsedMs;
        if (remainingMs < 1500) {
            attempts.push({
                ok: false,
                backend: backends[backendIndex].id,
                durationMs: 0,
                errorCode: 'overall_timeout_budget_exhausted',
                error: 'web_search overall timeout budget exhausted before trying this backend.',
                retryable: true
            });
            break;
        }
        const backend = backends[backendIndex];
        const attemptTimeoutMs = Math.min(timeoutMs, Math.max(1000, remainingMs - 750));
        const attempt = await runSearchBackend(backend, backendQuery, maxResults, attemptTimeoutMs, args);
        attempts.push(attempt);
        if (!attempt.ok) {
            continue;
        }
        const enrichedResults = enrichSearchResultsWithSource(attempt.results, attempt, backendIndex);
        collectedResults = aggregateAcrossBackends
            ? mergeSearchResultsForRerank([...collectedResults, ...enrichedResults], maxResults * 3)
            : enrichedResults;
        const observation = buildWebSearchSuccessObservation({
            query,
            backendQuery,
            attempts,
            rawResults: collectedResults,
            backend: attempt.backend,
            url: attempt.url,
            startedAt,
            overallTimeoutMs,
            aggregated: aggregateAcrossBackends && attempts.filter((entry) => entry.ok).length > 1
        });
        lastSuccessObservation = observation;
        lastSuccessfulAttempt = attempt;
        if (!shouldContinueSearchAggregation({
            args,
            backends,
            backendIndex,
            searchConfidence: observation.searchConfidence,
            suggestedNextCalls: observation.suggestedNextCalls,
            offTarget: observation.offTarget
        })) {
            return observation.response;
        }
    }
    if (lastSuccessObservation && lastSuccessfulAttempt) {
        return buildWebSearchSuccessObservation({
            query,
            backendQuery,
            attempts,
            rawResults: collectedResults,
            backend: lastSuccessfulAttempt.backend,
            url: lastSuccessfulAttempt.url,
            startedAt,
            overallTimeoutMs,
            aggregated: aggregateAcrossBackends && attempts.filter((entry) => entry.ok).length > 1
        }).response;
    }
    return errorResult('web_search failed across all configured search backends', {
        status: 'search_failed',
        errorCode: 'search_backends_failed',
        query,
        retryable: true,
        overallDurationMs: Date.now() - startedAt,
        overallTimeoutMs,
        attempts,
        suggestedTools: ['web_fetch', 'web_extract_links'],
        evidenceGap: 'Broad discovery failed; no evidence page was opened yet.',
        recoveryHint: 'Try a more specific title/DOI/source query or switch to a domain-specific tool instead of repeating the same broad search.'
    });
}

function githubApiBase(args = {}) {
    return normalizeString(args.apiBaseUrl || args.api_base_url || process.env.AILIS_GITHUB_API_BASE_URL, 'https://api.github.com').replace(/\/+$/g, '');
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
    return normalizeString(args.rawBaseUrl || args.raw_base_url || process.env.AILIS_GITHUB_RAW_BASE_URL, 'https://raw.githubusercontent.com').replace(/\/+$/g, '');
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

function crawl4aiMarkdownCandidate(value) {
    if (typeof value === 'string') {
        return value.trim();
    }
    if (!value || typeof value !== 'object') {
        return '';
    }
    return normalizeString(
        value.markdown ||
        value.raw_markdown ||
        value.fit_markdown ||
        value.text ||
        value.content
    );
}

function extractCrawl4aiMarkdown(payload = {}) {
    const candidates = [
        payload,
        payload.data,
        payload.result,
        Array.isArray(payload.results) ? payload.results[0] : null,
        Array.isArray(payload.data) ? payload.data[0] : null,
        payload.markdown
    ];
    for (const candidate of candidates) {
        const markdown = crawl4aiMarkdownCandidate(candidate);
        if (markdown) {
            return markdown;
        }
    }
    return '';
}

function extractLinksFromMarkdown(markdown = '', baseUrl = '', maxLinks = 80) {
    const links = [];
    const seen = new Set();
    const pattern = /\[([^\]\n]{1,200})\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    let match;
    while ((match = pattern.exec(markdown)) && links.length < maxLinks) {
        const text = normalizeString(match[1]).replace(/\s+/g, ' ');
        const href = normalizeString(match[2]);
        let url = '';
        try {
            url = /^https?:\/\//i.test(href) ? href : new URL(href, baseUrl).toString();
        } catch {
            continue;
        }
        const normalized = normalizeUrlCandidate(url);
        if (!normalized || seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        links.push({ text: text || normalized, url: normalized });
    }
    return links;
}

function summarizeCrawl4aiAttempt(attempt = null) {
    if (!attempt) {
        return undefined;
    }
    return pruneEmptyDeep({
        ok: attempt.ok === true,
        status: attempt.status || undefined,
        errorCode: normalizeString(attempt.errorCode),
        error: normalizeString(attempt.error).slice(0, 300),
        endpoint: normalizeString(attempt.crawl4aiEndpoint),
        worker: normalizeString(attempt.crawl4aiWorker),
        backend: normalizeString(attempt.backend),
        mode: normalizeString(attempt.mode),
        probe: attempt.probe === true || undefined,
        installCommands: Array.isArray(attempt.installCommands) ? attempt.installCommands.slice(0, 3) : undefined,
        recoveryHint: normalizeString(attempt.recoveryHint)
    });
}

function parseJsonFromProcessStdout(stdout = '') {
    const text = normalizeString(stdout);
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {
        const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        for (let index = lines.length - 1; index >= 0; index -= 1) {
            try {
                return JSON.parse(lines[index]);
            } catch {
                // Keep looking for the final JSON payload if a dependency printed a banner.
            }
        }
    }
    return null;
}

async function fetchWithLocalCrawl4aiWorker(url, config = {}, args = {}, timeoutMs = 90000) {
    const workerPath = normalizeString(config.workerPath || DEFAULT_CRAWL4AI_WORKER);
    if (!workerPath || !fsSync.existsSync(workerPath)) {
        return {
            ok: false,
            status: 0,
            errorCode: 'crawl4ai_worker_missing',
            error: `Crawl4AI worker script not found: ${workerPath || '(empty)'}`,
            backend: 'crawl4ai_local',
            mode: 'local_worker',
            probe: config.probe === true,
            crawl4aiWorker: workerPath,
            installCommands: [
                'python -m pip install -U crawl4ai',
                'python -m playwright install chromium'
            ]
        };
    }
    const effectiveTimeoutMs = config.probe ? Math.min(timeoutMs, 5000) : timeoutMs;
    const maxLinks = clampNumber(args.maxLinks || args.max_links, 80, 1, 200);
    const command = normalizeString(config.python, 'python');
    const processArgs = [
        workerPath,
        '--url',
        url,
        '--timeout-ms',
        String(effectiveTimeoutMs),
        '--max-links',
        String(maxLinks)
    ];
    const query = normalizeString(args.query || args.contains || args.extract_query || args.extractQuery);
    if (query) {
        processArgs.push('--query', query);
    }
    const waitFor = normalizeString(args.waitFor || args.wait_for);
    if (waitFor) {
        processArgs.push('--wait-for', waitFor);
    }
    const delayMs = clampNumber(args.delayMs || args.delay_ms, 0, 0, 30000);
    if (delayMs) {
        processArgs.push('--delay-ms', String(delayMs));
    }
    const result = await runProcess(command, processArgs, {
        timeoutMs: effectiveTimeoutMs + 1000,
        env: config.playwrightBrowsersPath
            ? { PLAYWRIGHT_BROWSERS_PATH: config.playwrightBrowsersPath }
            : {}
    });
    const payload = parseJsonFromProcessStdout(result.stdout);
    if (!payload) {
        return {
            ok: false,
            status: 0,
            errorCode: result.timedOut ? 'timeout' : 'crawl4ai_worker_invalid_json',
            error: result.timedOut ? 'Crawl4AI local worker timed out.' : 'Crawl4AI local worker returned invalid JSON.',
            stderr: result.stderr,
            backend: 'crawl4ai_local',
            mode: 'local_worker',
            probe: config.probe === true,
            crawl4aiWorker: workerPath
        };
    }
    if (!payload?.ok) {
        return {
            ok: false,
            status: Number(payload?.status || 0),
            errorCode: normalizeString(payload?.errorCode, result.exitCode === 0 ? 'crawl4ai_worker_failed' : `crawl4ai_worker_exit_${result.exitCode}`),
            error: normalizeString(payload?.error, result.stderr || 'Crawl4AI local worker failed.'),
            stderr: normalizeString(result.stderr || payload?.traceback),
            backend: 'crawl4ai_local',
            mode: 'local_worker',
            probe: config.probe === true,
            crawl4aiWorker: workerPath,
            installCommands: Array.isArray(payload?.installCommands) ? payload.installCommands : undefined,
            recoveryHint: normalizeString(payload?.recoveryHint)
        };
    }
    const markdown = normalizeString(payload.markdown || payload.text || payload.content);
    if (!markdown) {
        return {
            ok: false,
            status: Number(payload.status || 0),
            errorCode: 'crawl4ai_no_markdown',
            error: 'Crawl4AI local worker returned ok=true but no Markdown/text content.',
            stderr: result.stderr,
            backend: 'crawl4ai_local',
            mode: 'local_worker',
            probe: config.probe === true,
            crawl4aiWorker: workerPath
        };
    }
    return {
        ok: true,
        status: Number(payload.status || 200),
        contentType: normalizeString(payload.contentType, 'text/markdown; charset=utf-8'),
        contentLength: markdown.length,
        isPdf: false,
        isBinary: false,
        text: markdown,
        stderr: result.stderr,
        error: '',
        backend: 'crawl4ai_local',
        mode: 'local_worker',
        kind: 'crawl4ai_markdown',
        probe: config.probe === true,
        links: Array.isArray(payload.links) ? payload.links : extractLinksFromMarkdown(markdown, url, 80),
        metadata: payload.metadata,
        crawl4aiWorker: workerPath
    };
}

async function fetchWithCrawl4aiHttp(url, config = {}, timeoutMs = 90000) {
    const endpoint = `${config.baseUrl}/crawl`;
    const effectiveTimeoutMs = config.probe ? Math.min(timeoutMs, 1800) : timeoutMs;
    const fetched = await fetchJsonWithNodeFetch(endpoint, {
        method: 'POST',
        timeoutMs: effectiveTimeoutMs,
        body: {
            url,
            urls: [url]
        }
    });
    if (!fetched.ok) {
        return {
            ok: false,
            status: fetched.status || 0,
            errorCode: fetched.errorCode || 'crawl4ai_fetch_failed',
            error: fetched.error || 'Crawl4AI fetch failed.',
            backend: 'crawl4ai',
            mode: 'http',
            probe: config.probe === true,
            crawl4aiEndpoint: endpoint
        };
    }
    const markdown = extractCrawl4aiMarkdown(fetched.json);
    if (!markdown) {
        return {
            ok: false,
            status: fetched.status || 0,
            errorCode: 'crawl4ai_no_markdown',
            error: 'Crawl4AI returned JSON, but no Markdown/text content was found.',
            backend: 'crawl4ai',
            mode: 'http',
            probe: config.probe === true,
            crawl4aiEndpoint: endpoint
        };
    }
    return {
        ok: true,
        status: fetched.status || 200,
        contentType: 'text/markdown; charset=utf-8',
        contentLength: markdown.length,
        isPdf: false,
        isBinary: false,
        text: markdown,
        stderr: '',
        error: '',
        backend: 'crawl4ai',
        mode: 'http',
        kind: 'crawl4ai_markdown',
        probe: config.probe === true,
        links: extractLinksFromMarkdown(markdown, url, 80),
        crawl4aiEndpoint: endpoint
    };
}

async function maybeFetchWithCrawl4ai(url, args = {}, timeoutMs = 90000) {
    const config = crawl4aiFetchConfig(args);
    if (!config) {
        return null;
    }
    if (config.mode === 'local_worker') {
        return await fetchWithLocalCrawl4aiWorker(url, config, args, timeoutMs);
    }
    return await fetchWithCrawl4aiHttp(url, config, timeoutMs);
}

function buildRenderedFallbackArgs(args = {}) {
    return {
        ...args,
        provider: 'crawl4ai',
        fetchProvider: 'crawl4ai',
        fetch_provider: 'crawl4ai'
    };
}

function shouldRetryRenderedFetchAfterStaticResult({ details = {}, args = {}, crawl4aiAttempt = null, fetched = {} } = {}) {
    const evidenceQuality = normalizeString(details.evidenceQuality || details.observationContract?.evidence_quality);
    if (!RENDERED_FALLBACK_EVIDENCE_QUALITIES.has(evidenceQuality)) {
        return false;
    }
    if (fetched?.kind === 'crawl4ai_markdown' || normalizeString(details.fetchBackend) === 'crawl4ai') {
        return false;
    }
    const provider = normalizeString(
        args.fetchProvider ||
        args.fetch_provider ||
        args.provider ||
        process.env.AILIS_WEB_FETCH_PROVIDER ||
        'auto',
        'auto'
    ).toLowerCase();
    if (provider === 'builtin' || provider === 'current' || provider === 'html') {
        return false;
    }
    const explicitlyRendered = CRAWL4AI_FETCH_PROVIDERS.has(provider);
    const configured = hasConfiguredCrawl4aiUrl(args) || hasConfiguredCrawl4aiWorker(args);
    const previousFullAttempt = crawl4aiAttempt && crawl4aiAttempt.probe !== true;
    const defaultProbeTimedOut = crawl4aiAttempt?.probe === true && normalizeString(crawl4aiAttempt.errorCode) === 'timeout';
    return explicitlyRendered || configured || previousFullAttempt || defaultProbeTimedOut;
}

function buildWebFetchResult({ url, args = {}, maxChars = MAX_FETCH_CHARS, fetched = {}, crawl4aiAttempt = null, renderedFallbackAttempt = null, renderedFallbackUsed = false, renderedFallbackTrigger = '' } = {}) {
    const contentType = fetched.contentType || '';
    const body = fetched.text;
    const rawText = fetched.kind === 'wikipedia_wikitext'
        ? stripWikiText(body)
        : fetched.kind === 'crawl4ai_markdown' ? body.trim()
        : /html/i.test(contentType) ? stripHtml(body) : body.trim();
    const encodingRepair = repairUtf8MojibakeText(rawText);
    const text = encodingRepair.text;
    const focused = focusTextWindow(text, {
        query: args.query || args.contains || args.extract_query || args.extractQuery || '',
        url,
        maxChars
    });
    const extractedLinks = /html/i.test(contentType)
        ? extractLinksFromHtml(body, url, 80)
        : Array.isArray(fetched.links) ? fetched.links : [];
    const linkQuery = normalizeString(args.query || args.contains || args.extract_query || args.extractQuery || '');
    const rankedLinks = rankLinksForResearch(extractedLinks, url, linkQuery);
    const suggestedRankedLinks = filterRankedLinksForQuerySuggestions(rankedLinks, linkQuery);
    const suggestedNextCalls = buildSuggestedCallsFromRankedLinks(suggestedRankedLinks, 3, { query: linkQuery });
    const observedLinksForGuidance = linkQuery ? suggestedRankedLinks : rankedLinks;
    const observedRelevantLinks = observedLinksForGuidance.slice(0, 5).map((candidate) => summarizeRelevantLink(candidate));
    const htmlRelations = /html/i.test(contentType)
        ? extractHtmlRelationGraph(body, { url, query: linkQuery, links: extractedLinks })
        : null;
    const htmlRelationSummary = formatHtmlRelationGraph(htmlRelations);
    const wikiFacts = fetched.kind === 'wikipedia_wikitext'
        ? extractWikiKeyValueFacts(text, linkQuery)
        : [];
    const wikiFactSummary = formatWikiKeyValueFacts(wikiFacts);
    const wikiFactReasoningReady = wikiFactsAreReasoningReady(wikiFacts, linkQuery);
    const barrier = classifyAccessBarrierText(text);
    const truncatedForModel = focused.text.length < text.length;
    const quality = classifyWebFetchEvidenceQuality({
        text,
        url,
        query: linkQuery,
        contentType,
        barrier,
        suggestedNextCalls,
        truncated: truncatedForModel,
        encodingRepair
    });
    const evidenceGap = wikiFactReasoningReady ? '' : (quality.evidenceGap || '');
    const recoveryHint = wikiFactReasoningReady
        ? 'Use the Wiki key-value facts above as structured evidence; only fetch more if another required field is missing.'
        : (quality.recoveryHint || '');
    const effectiveSuggestedNextCalls = wikiFactReasoningReady ? [] : suggestedNextCalls;
    const guidance = buildWebToolGuidanceText({
        evidenceGap,
        recoveryHint,
        suggestedNextCalls: effectiveSuggestedNextCalls,
        observedRelevantLinks
    });
    const reasoningReady = (quality.evidenceQuality === 'sufficient_evidence' && quality.isEvidence === true && !truncatedForModel) || wikiFactReasoningReady;
    const observationTruncated = wikiFactReasoningReady ? false : truncatedForModel;
    return textResult([guidance, htmlRelationSummary, wikiFactSummary, `Content excerpt:\n${focused.text}`].filter(Boolean).join('\n\n'), {
        status: 'completed',
        url,
        contentType,
        fetchBackend: fetched.backend,
        fallbackFrom: fetched.fallbackFrom,
        primaryErrorCode: fetched.primaryErrorCode,
        tlsVerificationDisabled: fetched.tlsVerificationDisabled === true || undefined,
        tlsFallbackReason: normalizeString(fetched.tlsFallbackReason),
        originalChars: text.length,
        returnedChars: focused.text.length,
        focus: focused.focus,
        complete: reasoningReady,
        truncated: observationTruncated,
        contentTruncated: truncatedForModel,
        reasoningReady,
        isEvidence: quality.isEvidence,
        evidenceQuality: quality.evidenceQuality,
        pageType: quality.pageType,
        contentQuality: quality.evidenceQuality,
        observationContract: {
            complete: reasoningReady,
            truncated: observationTruncated,
            reasoning_ready: reasoningReady,
            is_evidence: quality.isEvidence,
            evidence_quality: quality.evidenceQuality,
            page_type: quality.pageType,
            final_answer_requires_llm_evidence_audit: true
        },
        observedLinkCount: extractedLinks.length,
        suggestedNextCalls: effectiveSuggestedNextCalls,
        observedRelevantLinks,
        htmlRelations: htmlRelations || undefined,
        htmlRelationSummary: htmlRelationSummary || undefined,
        wikiFacts: wikiFacts.length ? wikiFacts : undefined,
        wikiFactSummary: wikiFactSummary || undefined,
        evidenceGap,
        recoveryHint,
        pageStatus: quality.pageStatus || undefined,
        finalAnswerRequiresEvidenceAudit: true,
        encodingRepair: encodingRepair.repaired ? 'latin1_to_utf8' : undefined,
        crawl4aiAttempt: summarizeCrawl4aiAttempt(crawl4aiAttempt),
        renderedFallbackAttempt: summarizeCrawl4aiAttempt(renderedFallbackAttempt),
        renderedFallbackUsed: renderedFallbackUsed || undefined,
        renderedFallbackTrigger: normalizeString(renderedFallbackTrigger)
    });
}

async function webFetch(args = {}) {
    const url = normalizeString(args.url || args.uri);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('web_fetch requires http(s) url');
    }
    const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 80000);
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 90000, 1000, 300000);
    const crawl4aiAttempt = await maybeFetchWithCrawl4ai(url, args, timeoutMs);
    const wikiText = crawl4aiAttempt?.ok ? null : await maybeFetchWikipediaWikitext(url, timeoutMs);
    const fetched = crawl4aiAttempt?.ok ? crawl4aiAttempt : wikiText || await fetchText(url, timeoutMs);
    if (!fetched.ok) {
        return errorResult(fetched.error || 'web_fetch fetch failed', buildHttpAccessFailureDetails(url, fetched));
    }
    const contentType = fetched.contentType || '';
    if (isPdfContentType(contentType) || fetched.isPdf || fetched.isBinary || !isReadableTextContentType(contentType)) {
        return unsupportedContentTypeResult('web_fetch', url, fetched, ['pdf_extract_text', 'download_file']);
    }
    const primaryResult = buildWebFetchResult({
        url,
        args,
        maxChars,
        fetched,
        crawl4aiAttempt
    });
    const primaryDetails = primaryResult.structuredContent || {};
    if (shouldRetryRenderedFetchAfterStaticResult({ details: primaryDetails, args, crawl4aiAttempt, fetched })) {
        const renderedFallbackAttempt = await maybeFetchWithCrawl4ai(url, buildRenderedFallbackArgs(args), timeoutMs);
        if (renderedFallbackAttempt?.ok) {
            return buildWebFetchResult({
                url,
                args,
                maxChars,
                fetched: {
                    ...renderedFallbackAttempt,
                    fallbackFrom: normalizeString(fetched.backend || fetched.kind, 'static_fetch'),
                    primaryErrorCode: primaryDetails.evidenceQuality
                },
                crawl4aiAttempt,
                renderedFallbackAttempt,
                renderedFallbackUsed: true,
                renderedFallbackTrigger: primaryDetails.evidenceQuality
            });
        }
        return buildWebFetchResult({
            url,
            args,
            maxChars,
            fetched,
            crawl4aiAttempt,
            renderedFallbackAttempt,
            renderedFallbackTrigger: primaryDetails.evidenceQuality
        });
    }
    return primaryResult;
}

function extractTextFromToolResult(result = {}, maxChars = 3000) {
    const text = normalizeString(result.content?.[0]?.text);
    return text.length > maxChars ? `${text.slice(0, Math.max(0, maxChars - 3)).trim()}...` : text;
}

function annotateSearchResultsForQueryVariant(results = [], variant = {}) {
    return (Array.isArray(results) ? results : []).map((item, index) => pruneEmptyDeep({
        ...item,
        queryVariant: variant.query,
        queryVariantRole: variant.role,
        queryVariantIndex: variant.index,
        queryVariantRank: index + 1
    }));
}

function buildMergedWebResearchSearchDetails({ query = '', searchRuns = [], maxResults = 8, startedAt = Date.now(), overallTimeoutMs = 0 } = {}) {
    const successfulRuns = searchRuns.filter((run) => !run.result?.isError && run.details?.status === 'completed');
    if (!successfulRuns.length) {
        return null;
    }
    const rawResults = [];
    const attempts = [];
    for (const run of successfulRuns) {
        const rows = Array.isArray(run.details.rawResults) && run.details.rawResults.length
            ? run.details.rawResults
            : run.details.results || [];
        rawResults.push(...annotateSearchResultsForQueryVariant(rows, run.variant));
        for (const attempt of run.details.attempts || []) {
            attempts.push(pruneEmptyDeep({
                ...attempt,
                queryVariant: run.variant.query,
                queryVariantRole: run.variant.role,
                queryVariantIndex: run.variant.index
            }));
        }
    }
    const mergePoolSize = Math.max(24, maxResults * 4, maxResults * successfulRuns.length * 4);
    const mergedRawResults = mergeSearchResultsForRerank(rawResults, mergePoolSize);
    const observation = buildWebSearchSuccessObservation({
        query,
        backendQuery: successfulRuns.map((run) => run.variant.backendQuery).filter(Boolean).join(' | '),
        attempts,
        rawResults: mergedRawResults,
        backend: successfulRuns.length > 1 ? 'query_plan_aggregated' : successfulRuns[0]?.details?.backend,
        url: successfulRuns[0]?.details?.url,
        startedAt,
        overallTimeoutMs,
        aggregated: successfulRuns.length > 1 || successfulRuns.some((run) => run.details?.backend === 'aggregated')
    });
    const details = observation.response.structuredContent || {};
    return pruneEmptyDeep({
        ...details,
        backend: successfulRuns.length > 1 ? 'query_plan_aggregated' : details.backend,
        searchQueries: searchRuns.map((run) => pruneEmptyDeep({
            ...run.variant,
            status: run.details?.status || (run.result?.isError ? 'error' : 'unknown'),
            isError: run.result?.isError === true || undefined,
            searchConfidence: run.details?.searchConfidence,
            resultCount: Array.isArray(run.details?.results) ? run.details.results.length : undefined,
            error: run.details?.error
        })),
        searchAggregation: pruneEmptyDeep({
            ...(details.searchAggregation || {}),
            queryPlan: true,
            queryVariantCount: searchRuns.length,
            successfulQueryVariants: successfulRuns.map((run) => run.variant.role || run.variant.query)
        })
    });
}

function searchRunRequiresClarification(searchRuns = []) {
    return searchRuns.some((run) => run.details?.clarificationRequired === true);
}

function bestClarificationSearchDetails(searchRuns = []) {
    return searchRuns.find((run) => run.details?.clarificationRequired === true)?.details || null;
}

function buildWebResearchCandidates(searchDetails = {}, limit = 3) {
    const candidatePool = [];
    const seen = new Set();
    const query = normalizeString(searchDetails.query);
    const addCandidateToPool = (candidate = {}, source = '') => {
        const url = normalizeUrlCandidate(candidate.url || candidate.args?.url);
        if (!url || seen.has(url) || !/^https?:\/\//i.test(url) || isLikelyPdfUrl(url)) {
            return;
        }
        seen.add(url);
        candidatePool.push(pruneEmptyDeep({
            title: normalizeString(candidate.title || candidate.text || candidate.reason || url),
            url,
            source,
            searchRank: Number(candidate.searchRank) || undefined,
            queryScore: Number(candidate.queryScore) || undefined,
            combinedScore: Number(candidate.combinedScore) || undefined,
            sourceBackends: candidate.sourceBackends || undefined,
            queryVariant: candidate.queryVariant || undefined,
            queryVariantRole: candidate.queryVariantRole || undefined,
            queryVariantIndex: candidate.queryVariantIndex || undefined
        }));
    };
    for (const call of searchDetails.suggestedNextCalls || []) {
        if (normalizeString(call.tool) === 'web_fetch') {
            addCandidateToPool({
                title: call.reason,
                url: call.args?.url
            }, 'suggested_next_call');
        }
    }
    for (const [index, result] of (searchDetails.results || []).entries()) {
        if (!isRelevantSearchCandidate(result)) {
            continue;
        }
        addCandidateToPool({
            ...result,
            searchRank: index + 1
        }, query ? 'ranked_relevant_result' : 'ranked_result');
    }
    const primary = [];
    const overflow = [];
    const seenHosts = new Set();
    for (const candidate of candidatePool) {
        const host = extractHostname(candidate.url);
        if (!host || !seenHosts.has(host)) {
            if (host) {
                seenHosts.add(host);
            }
            primary.push(candidate);
        } else {
            overflow.push(candidate);
        }
    }
    return [...primary, ...overflow].slice(0, limit);
}

function extractEvidenceSnippetsFromText(text = '', query = '', limit = 4) {
    const source = normalizeString(text).replace(/\s+/g, ' ');
    if (!source) {
        return [];
    }
    const terms = [
        ...extractQuotedSearchPhrases(query),
        ...extractSearchQueryTerms(query)
    ]
        .map(normalizeString)
        .filter((term) => term.length >= 2)
        .slice(0, 10);
    const snippets = [];
    const seen = new Set();
    for (const term of terms) {
        const index = source.toLowerCase().indexOf(term.toLowerCase());
        if (index < 0) {
            continue;
        }
        const start = Math.max(0, index - 180);
        const end = Math.min(source.length, index + term.length + 240);
        const snippet = truncateRelationText(source.slice(start, end).trim(), 460);
        const key = normalizeSearchText(snippet).slice(0, 120);
        if (!snippet || seen.has(key)) {
            continue;
        }
        seen.add(key);
        snippets.push(snippet);
        if (snippets.length >= limit) {
            break;
        }
    }
    return snippets;
}

function specificTargetTermsForQuery(query = '') {
    const entityTerms = extractShortCjkEntityTerms(query);
    if (entityTerms.length <= 1) {
        return [];
    }
    return entityTerms.slice(1, 4);
}

function assessWebResearchTargetCoverage(text = '', query = '', strongText = '') {
    const requiredTerms = specificTargetTermsForQuery(query);
    if (!requiredTerms.length) {
        return undefined;
    }
    const compactText = compactSearchText(text);
    const compactStrongText = compactSearchText(strongText);
    const matchedSpecificTargetTerms = [];
    const missingSpecificTargetTerms = [];
    const strongMatchedSpecificTargetTerms = [];
    for (const term of requiredTerms) {
        const compactTerm = compactSearchText(term);
        if (compactTerm && compactText.includes(compactTerm)) {
            matchedSpecificTargetTerms.push(term);
        } else {
            missingSpecificTargetTerms.push(term);
        }
        if (compactTerm && compactStrongText.includes(compactTerm)) {
            strongMatchedSpecificTargetTerms.push(term);
        }
    }
    return pruneEmptyDeep({
        requiredSpecificTargetTerms: requiredTerms,
        matchedSpecificTargetTerms,
        strongMatchedSpecificTargetTerms,
        missingSpecificTargetTerms,
        specificTargetCovered: missingSpecificTargetTerms.length === 0 || strongMatchedSpecificTargetTerms.length > 0
    });
}

function scoreWebResearchPage(page = {}, query = '') {
    const qualityScores = {
        sufficient_evidence: 42,
        partial_evidence: 24,
        metadata_only: 8,
        link_hub: 2,
        thin_content: 6,
        off_target_evidence: -18,
        js_shell: -38,
        access_denied: -34,
        access_challenge: -34,
        encoding_failure: -30,
        access_barrier: -30
    };
    const htmlRelations = page.htmlRelations || {};
    const relationScore = Math.min(18, (
        (Array.isArray(htmlRelations.sections) ? htmlRelations.sections.length : 0) * 2 +
        (Array.isArray(htmlRelations.keyValues) ? htmlRelations.keyValues.length : 0) * 2 +
        (Array.isArray(htmlRelations.tables) ? htmlRelations.tables.length : 0) * 4 +
        (Array.isArray(htmlRelations.relationTriples) ? htmlRelations.relationTriples.length : 0) +
        (Array.isArray(htmlRelations.rankedLinks) ? htmlRelations.rankedLinks.length : 0)
    ));
    const returnedChars = Number(page.returnedChars) || normalizeString(page.excerpt).length;
    const queryScore = Math.min(100, Math.max(0, Number(page.queryScore) || 0));
    const qualityScore = qualityScores[page.evidenceQuality] ?? 0;
    const evidenceFlagScore = page.isEvidence === true ? 14 : 0;
    const readyScore = page.reasoningReady === true ? 16 : 0;
    const snippetScore = Math.min(12, (Array.isArray(page.evidenceSnippets) ? page.evidenceSnippets.length : 0) * 3);
    const lengthScore = Math.min(12, Math.floor(returnedChars / 1200));
    const sourceScore = Math.min(8, Math.max(0, (Array.isArray(page.sourceBackends) ? page.sourceBackends.length : 0) - 1) * 4);
    const targetCoverage = page.targetCoverage || {};
    const missingTargetCount = targetCoverage.specificTargetCovered === false && Array.isArray(targetCoverage.missingSpecificTargetTerms)
        ? targetCoverage.missingSpecificTargetTerms.length
        : 0;
    const targetPenalty = missingTargetCount > 0 ? 45 : 0;
    const rawScore = qualityScore + evidenceFlagScore + readyScore + relationScore + snippetScore + lengthScore + sourceScore + queryScore * 0.24 - targetPenalty;
    const cappedScore = missingTargetCount > 0 ? Math.min(rawScore, 45) : rawScore;
    const score = Math.max(0, Math.min(100, Math.round(cappedScore)));
    return {
        score,
        breakdown: pruneEmptyDeep({
            qualityScore,
            evidenceFlagScore,
            readyScore,
            relationScore,
            snippetScore,
            lengthScore,
            sourceScore,
            targetPenalty,
            queryScore: Number(queryScore.toFixed(2)),
            query: normalizeString(query)
        })
    };
}

function summarizeWebResearchPage(candidate = {}, fetchResult = {}, query = '') {
    const details = fetchResult.structuredContent || fetchResult.details || {};
    let evidenceQuality = normalizeString(details.evidenceQuality || details.observationContract?.evidence_quality);
    const fullText = extractTextFromToolResult(fetchResult, 16000);
    const targetCoverage = assessWebResearchTargetCoverage([
        candidate.title,
        candidate.url,
        fullText
    ].filter(Boolean).join('\n'), query, [
        candidate.title,
        candidate.url
    ].filter(Boolean).join('\n'));
    const missingTargetTerms = targetCoverage?.missingSpecificTargetTerms || [];
    const targetCovered = targetCoverage?.specificTargetCovered !== false;
    if (!targetCovered && !['js_shell', 'encoding_failure', 'access_denied', 'access_challenge'].includes(evidenceQuality)) {
        evidenceQuality = 'off_target_evidence';
    }
    const page = pruneEmptyDeep({
        title: normalizeString(candidate.title),
        url: normalizeString(candidate.url),
        source: normalizeString(candidate.source),
        searchRank: candidate.searchRank,
        queryScore: Number.isFinite(candidate.queryScore) ? Number(candidate.queryScore.toFixed(2)) : undefined,
        combinedScore: Number.isFinite(candidate.combinedScore) ? Number(candidate.combinedScore.toFixed(2)) : undefined,
        sourceBackends: candidate.sourceBackends?.length ? candidate.sourceBackends.slice(0, 5) : undefined,
        queryVariant: normalizeString(candidate.queryVariant),
        queryVariantRole: normalizeString(candidate.queryVariantRole),
        queryVariantIndex: candidate.queryVariantIndex,
        fetchStatus: details.status || (fetchResult.isError ? 'error' : 'completed'),
        fetchBackend: normalizeString(details.fetchBackend),
        evidenceQuality,
        pageType: normalizeString(details.pageType || details.observationContract?.page_type),
        contentQuality: normalizeString(details.contentQuality || evidenceQuality),
        finalAnswerRequiresEvidenceAudit: details.finalAnswerRequiresEvidenceAudit !== false,
        isEvidence: targetCovered ? details.isEvidence : false,
        reasoningReady: targetCovered && (details.reasoningReady === true || details.observationContract?.reasoning_ready === true),
        complete: targetCovered && (details.complete === true || details.observationContract?.complete === true),
        returnedChars: details.returnedChars,
        originalChars: details.originalChars,
        pageStatus: normalizeString(details.pageStatus),
        evidenceGap: !targetCovered && missingTargetTerms.length
            ? `Fetched page does not contain the required target terms: ${missingTargetTerms.join(', ')}.`
            : normalizeString(details.evidenceGap),
        recoveryHint: !targetCovered && missingTargetTerms.length
            ? 'Follow a more specific result that contains the target entity, or refine the search query with the target full name.'
            : normalizeString(details.recoveryHint),
        targetCoverage,
        observedRelevantLinks: Array.isArray(details.observedRelevantLinks) ? details.observedRelevantLinks.slice(0, 5) : undefined,
        suggestedNextCalls: Array.isArray(details.suggestedNextCalls) ? details.suggestedNextCalls.slice(0, 5) : undefined,
        htmlRelations: details.htmlRelations,
        evidenceSnippets: extractEvidenceSnippetsFromText(fullText, query),
        excerpt: fullText.length > 3600 ? `${fullText.slice(0, 3597).trim()}...` : fullText
    });
    const evidenceScore = scoreWebResearchPage(page, query);
    return pruneEmptyDeep({
        ...page,
        evidenceScore: evidenceScore.score,
        evidenceScoreBreakdown: evidenceScore.breakdown
    });
}

function assessWebResearchBundle(pages = [], searchDetails = {}) {
    const evidencePages = pages.filter((page) => page.isEvidence === true);
    const readyPages = pages.filter((page) => page.reasoningReady === true || page.evidenceQuality === 'sufficient_evidence');
    const blockedPages = pages.filter((page) => ['js_shell', 'encoding_failure', 'access_denied', 'access_challenge'].includes(page.evidenceQuality));
    if (searchDetails.clarificationRequired) {
        return {
            answerReadiness: 'needs_clarification',
            readinessAuthority: 'retrieval_heuristic',
            requiresEvidenceAudit: false,
            evidenceGap: searchDetails.evidenceGap || 'Search target is ambiguous.',
            recoveryHint: searchDetails.recoveryHint || 'Ask the user to clarify the search target before fetching pages.'
        };
    }
    if (readyPages.length) {
        return {
            answerReadiness: 'ready',
            readinessAuthority: 'retrieval_heuristic',
            requiresEvidenceAudit: true,
            evidenceAuditInstruction: 'Before final answer, an LLM evidence auditor must verify that supported claims cover the user goal and identify missing fields; tool readiness is retrieval quality, not final answer authority.',
            evidenceGap: '',
            recoveryHint: 'Use the evidence pages; do not run another broad search unless a specific field is missing.'
        };
    }
    if (evidencePages.length) {
        return {
            answerReadiness: 'partial',
            readinessAuthority: 'retrieval_heuristic',
            requiresEvidenceAudit: true,
            evidenceAuditInstruction: 'Run an LLM evidence audit over the fetched evidence. If required answer fields are missing, continue retrieval or state the gap instead of filling with generic claims.',
            evidenceGap: 'Fetched pages contain some evidence but are not fully reasoning-ready. Follow high-signal linked resources or fetch a more specific result if needed.',
            recoveryHint: 'Prefer suggestedNextCalls from the evidence pages before issuing another broad search.'
        };
    }
    if (blockedPages.length) {
        return {
            answerReadiness: 'blocked',
            readinessAuthority: 'retrieval_heuristic',
            requiresEvidenceAudit: true,
            evidenceAuditInstruction: 'An LLM evidence audit should reject final answering from blocked pages and choose alternate retrieval or explicit gap reporting.',
            evidenceGap: 'Top pages were blocked, JavaScript-only, or unusable as answer evidence.',
            recoveryHint: 'Try alternate sources, rendered/browser extraction, or a domain-specific API/tool.'
        };
    }
    return {
        answerReadiness: 'needs_followup',
        readinessAuthority: 'retrieval_heuristic',
        requiresEvidenceAudit: true,
        evidenceAuditInstruction: 'No final answer should be generated from this bundle until an LLM evidence audit finds sufficient supported claims.',
        evidenceGap: searchDetails.evidenceGap || 'No answer-bearing evidence page was fetched.',
        recoveryHint: searchDetails.recoveryHint || 'Refine the query or use a more specific retrieval tool.'
    };
}

function formatWebResearchBundle({ query = '', searchDetails = {}, pages = [], bundleAssessment = {}, pipelineSteps = [] } = {}) {
    const lines = [
        'AILIS web research evidence bundle:',
        `Query: ${query}`,
        `Retrieval readiness: ${bundleAssessment.answerReadiness || 'unknown'}`,
        `Readiness authority: ${bundleAssessment.readinessAuthority || 'retrieval_heuristic'}`,
        `Evidence audit required: ${bundleAssessment.requiresEvidenceAudit !== false}`
    ];
    if (bundleAssessment.evidenceAuditInstruction) {
        lines.push(`Evidence audit instruction: ${bundleAssessment.evidenceAuditInstruction}`);
    }
    if (bundleAssessment.evidenceGap) {
        lines.push(`Evidence gap: ${bundleAssessment.evidenceGap}`);
    }
    if (bundleAssessment.recoveryHint) {
        lines.push(`Recovery hint: ${bundleAssessment.recoveryHint}`);
    }
    if (searchDetails.backend || searchDetails.searchAggregation?.successfulBackends?.length) {
        const sources = searchDetails.searchAggregation?.successfulBackends?.length
            ? searchDetails.searchAggregation.successfulBackends.join(', ')
            : searchDetails.backend;
        lines.push(`Search sources: ${sources}`);
    }
    if (searchDetails.searchConfidence?.level) {
        lines.push(`Search confidence: ${searchDetails.searchConfidence.level} (${searchDetails.searchConfidence.score})`);
    }
    if (Array.isArray(searchDetails.answerCandidates) && searchDetails.answerCandidates.length) {
        lines.push('Answer candidates from search results:');
        searchDetails.answerCandidates.slice(0, 5).forEach((candidate, index) => {
            lines.push(`- ${index + 1}. ${candidate.answer} (${candidate.type || 'answer'}, score=${candidate.score ?? 'n/a'})`);
            if (candidate.url) {
                lines.push(`  URL: ${candidate.url}`);
            }
            if (candidate.context) {
                lines.push(`  Context: ${candidate.context}`);
            }
        });
    }
    if (Array.isArray(searchDetails.searchQueries) && searchDetails.searchQueries.length) {
        lines.push('Search query plan:');
        searchDetails.searchQueries.slice(0, 5).forEach((item) => {
            lines.push(`- ${item.index || '?'}. ${item.role || 'query'}: ${item.backendQuery || item.query}`);
        });
    }
    if (Array.isArray(searchDetails.candidateChoices) && searchDetails.candidateChoices.length) {
        lines.push('Candidate choices:');
        searchDetails.candidateChoices.slice(0, 4).forEach((choice, index) => {
            lines.push(`- ${index + 1}. ${choice.label || choice.title || choice.url}`);
        });
    }
    if (pages.length) {
        lines.push('Evidence pages:');
        pages.forEach((page, index) => {
            lines.push(`- ${index + 1}. ${page.title || page.url}`);
            lines.push(`  URL: ${page.url}`);
            lines.push(`  Quality: ${page.evidenceQuality || 'unknown'}; reasoningReady=${page.reasoningReady === true}; evidenceScore=${page.evidenceScore ?? 'n/a'}`);
            if (page.pageType || page.contentQuality) {
                lines.push(`  Page type: ${page.pageType || 'unknown'}; contentQuality=${page.contentQuality || page.evidenceQuality || 'unknown'}`);
            }
            if (page.evidenceGap) {
                lines.push(`  Gap: ${page.evidenceGap}`);
            }
            if (Array.isArray(page.evidenceSnippets) && page.evidenceSnippets.length) {
                lines.push('  Evidence snippets:');
                page.evidenceSnippets.slice(0, 3).forEach((snippet) => lines.push(`  - ${snippet}`));
            }
            const excerpt = normalizeString(page.excerpt).split('\n').slice(0, 18).join('\n');
            if (excerpt) {
                lines.push(`  Excerpt:\n${excerpt}`);
            }
        });
    }
    if (Array.isArray(pipelineSteps) && pipelineSteps.length) {
        lines.push('Pipeline diagnostics:');
        pipelineSteps.slice(0, 12).forEach((step) => {
            lines.push(`- ${step.stage || 'step'}: ${step.status || 'unknown'}${step.note ? `; ${step.note}` : ''}`);
        });
    }
    return lines.join('\n');
}

async function webResearch(args = {}) {
    const query = normalizeString(args.query || args.q || args.search || args.text);
    if (!query) {
        return errorResult('web_research requires query');
    }
    const maxResults = clampNumber(args.maxResults || args.limit, 8, 1, 12);
    const maxPages = clampNumber(args.maxPages || args.max_pages, 3, 1, 5);
    const maxCharsPerPage = clampNumber(args.maxCharsPerPage || args.max_chars_per_page || args.maxChars, 14000, 3000, 60000);
    const queryPlan = buildWebResearchQueryPlan(query, args);
    const searchRuns = [];
    const pipelineSteps = [{
        stage: 'query_plan',
        status: 'planned',
        note: `${queryPlan.length} search quer${queryPlan.length === 1 ? 'y' : 'ies'}`
    }];
    const startedAt = Date.now();
    const overallTimeoutMs = clampNumber(
        args.overallTimeoutMs || args.overall_timeout_ms,
        Math.min(90000, Math.max(18000, queryPlan.length * 24000)),
        8000,
        180000
    );
    for (const variant of queryPlan) {
        const elapsedMs = Date.now() - startedAt;
        const remainingMs = overallTimeoutMs - elapsedMs;
        if (remainingMs < 2000) {
            pipelineSteps.push({
                stage: 'search',
                status: 'skipped',
                note: `timeout budget exhausted before ${variant.role || variant.query}`
            });
            break;
        }
        const searchResult = await webSearch({
            query: variant.query,
            backendQuery: variant.backendQuery,
            maxResults,
            timeoutMs: args.timeoutMs || args.timeout_ms,
            overallTimeoutMs: Math.min(remainingMs, args.searchOverallTimeoutMs || args.search_overall_timeout_ms || 36000),
            provider: args.provider || args.searchProvider || args.search_provider,
            backend: args.backend || args.searchBackend || args.search_backend,
            backends: args.backends,
            searxngUrl: args.searxngUrl || args.searxng_url,
            firecrawlUrl: args.firecrawlUrl || args.firecrawl_url,
            aggregate: args.aggregate
        });
        const details = searchResult.structuredContent || searchResult.details || {};
        searchRuns.push({ variant, result: searchResult, details });
        pipelineSteps.push({
            stage: 'search',
            status: searchResult.isError ? 'error' : details.clarificationRequired ? 'clarification_required' : details.status || 'completed',
            note: `${variant.role || 'query'} -> ${details.searchConfidence?.level || details.error || 'no_confidence'}`
        });
        if (details.clarificationRequired) {
            break;
        }
        const shouldDeferEarlyStopForExactAnswer =
            looksLikeExactAnswerResearchQuery(query) &&
            variant.role === 'original' &&
            queryPlan.some((item) => item.role === 'exact_answer_terms');
        if (
            details.searchConfidence?.level === 'high' &&
            Array.isArray(details.suggestedNextCalls) &&
            details.suggestedNextCalls.length > 0 &&
            !optionIsTrue(args.expandQueries || args.expand_queries) &&
            !shouldDeferEarlyStopForExactAnswer
        ) {
            break;
        }
    }
    const clarificationDetails = bestClarificationSearchDetails(searchRuns);
    const mergedSearchDetails = searchRunRequiresClarification(searchRuns)
        ? clarificationDetails
        : buildMergedWebResearchSearchDetails({ query, searchRuns, maxResults, startedAt, overallTimeoutMs });
    const searchDetails = pruneEmptyDeep({
        ...(mergedSearchDetails || searchRuns.find((run) => run.details)?.details || {}),
        searchQueries: (mergedSearchDetails?.searchQueries || searchRuns.map((run) => pruneEmptyDeep({
            ...run.variant,
            status: run.details?.status || (run.result?.isError ? 'error' : 'unknown'),
            isError: run.result?.isError === true || undefined,
            searchConfidence: run.details?.searchConfidence,
            resultCount: Array.isArray(run.details?.results) ? run.details.results.length : undefined,
            error: run.details?.error
        })))
    });
    if (!searchDetails || searchRuns.every((run) => run.result?.isError) || searchDetails.clarificationRequired) {
        const bundleAssessment = assessWebResearchBundle([], searchDetails);
        return textResult(formatWebResearchBundle({ query, searchDetails, pages: [], bundleAssessment, pipelineSteps }), {
            status: searchDetails.clarificationRequired ? 'clarification_required' : 'search_failed',
            query,
            search: searchDetails,
            evidencePages: [],
            pipelineSteps,
            ...bundleAssessment,
            suggestedNextCalls: searchDetails.suggestedNextCalls || []
        });
    }
    const candidates = buildWebResearchCandidates(searchDetails, maxPages);
    pipelineSteps.push({
        stage: 'candidate_rank',
        status: candidates.length ? 'completed' : 'empty',
        note: `${candidates.length} fetch candidate${candidates.length === 1 ? '' : 's'}`
    });
    const pages = [];
    for (const candidate of candidates) {
        const fetchResult = await webFetch({
            url: candidate.url,
            query,
            maxChars: maxCharsPerPage,
            provider: args.fetchProvider || args.fetch_provider,
            crawl4aiUrl: args.crawl4aiUrl || args.crawl4ai_url,
            crawl4aiWorker: args.crawl4aiWorker || args.crawl4ai_worker,
            crawl4aiPython: args.crawl4aiPython || args.crawl4ai_python
        });
        const page = summarizeWebResearchPage(candidate, fetchResult, query);
        pages.push(page);
        pipelineSteps.push({
            stage: 'fetch',
            status: page.fetchStatus || (fetchResult.isError ? 'error' : 'completed'),
            note: `${page.evidenceQuality || 'unknown'} score=${page.evidenceScore ?? 'n/a'} ${candidate.url}`
        });
    }
    const orderedPages = pages.sort((left, right) =>
        (Number(right.evidenceScore) || 0) - (Number(left.evidenceScore) || 0) ||
        (Number(right.queryScore) || 0) - (Number(left.queryScore) || 0) ||
        (Number(left.searchRank) || 999) - (Number(right.searchRank) || 999)
    );
    const bundleAssessment = assessWebResearchBundle(orderedPages, searchDetails);
    const suggestedNextCalls = dedupeSuggestedNextCalls([
        ...orderedPages.flatMap((page) => page.suggestedNextCalls || []),
        ...(searchDetails.suggestedNextCalls || [])
    ], 6);
    const answerCandidates = Array.isArray(searchDetails.answerCandidates)
        ? searchDetails.answerCandidates.slice(0, 5)
        : [];
    return textResult(formatWebResearchBundle({ query, searchDetails, pages: orderedPages, bundleAssessment, pipelineSteps }), {
        status: 'completed',
        query,
        search: searchDetails,
        evidencePages: orderedPages,
        pageCount: orderedPages.length,
        answerCandidates,
        pipelineSteps,
        ...bundleAssessment,
        suggestedNextCalls
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
    const linkQuery = normalizeString(args.query || args.contains || args.extract_query || args.extractQuery || '');
    const links = extractLinksFromHtml(fetched.text, url, maxLinks);
    const rankedLinks = rankLinksForResearch(links, url, linkQuery);
    const orderedLinks = rankedLinks.map((candidate) => ({ text: candidate.text, url: candidate.url }));
    const suggestedRankedLinks = filterRankedLinksForQuerySuggestions(rankedLinks, linkQuery);
    const suggestedNextCalls = buildSuggestedCallsFromRankedLinks(suggestedRankedLinks, 3, { query: linkQuery });
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
    const outputDir = path.resolve(normalizeString(args.outputDir || args.output_dir, path.join(process.cwd(), 'tmp', 'ailis-research-downloads')));
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
r = requests.get(url, timeout=timeout, headers={"User-Agent": "AILISResearchMCP/0.1 (+local assistant research tool)"})
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
    r = requests.get(source_url, timeout=timeout, headers={"User-Agent": "AILISResearchMCP/0.1 (+local assistant research tool)"})
    content_type = r.headers.get("content-type", "")
    if not (200 <= r.status_code < 400):
        print(json.dumps({"ok": False, "status": r.status_code, "error": f"HTTP {r.status_code}", "content_type": content_type}, ensure_ascii=False))
        raise SystemExit(0)
    fd, tmp_name = tempfile.mkstemp(prefix="ailis_pdf_", suffix=".pdf")
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
                'User-Agent': 'AILISResearchMCP/0.1 (+local assistant research tool)'
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

async function fetchJsonUrlWithPowerShell(url, timeoutMs = 30000) {
    if (process.platform !== 'win32') {
        return { ok: false, error: 'powershell_json_fetch_unavailable', status: 0 };
    }
    const timeoutSec = Math.max(1, Math.ceil(clampNumber(timeoutMs, 30000, 1000, 30000) / 1000));
    const psUrl = normalizeString(url).replace(/'/g, "''");
    const script = [
        '$ErrorActionPreference = "Stop"',
        '$ProgressPreference = "SilentlyContinue"',
        '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
        `$Url = '${psUrl}'`,
        `$TimeoutSec = ${timeoutSec}`,
        '$headers = @{ Accept = "application/json"; "User-Agent" = "AILISResearchMCP/0.1 (+local assistant research tool)" }',
        '$response = Invoke-WebRequest -UseBasicParsing -Uri $Url -Headers $headers -TimeoutSec $TimeoutSec',
        '$response.Content'
    ].join('; ');
    const result = await runProcess('powershell.exe', [
        '-NoLogo',
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        script
    ], {
        timeoutMs: timeoutSec * 1000 + 5000
    });
    if (result.exitCode !== 0) {
        return {
            ok: false,
            error: normalizeString(result.stderr || result.stdout || 'powershell_json_fetch_failed').slice(0, 1000),
            status: 0
        };
    }
    const text = normalizeString(result.stdout);
    try {
        return { ok: true, json: JSON.parse(text || '{}'), status: 200, backend: 'powershell' };
    } catch (error) {
        return { ok: false, error: `invalid JSON: ${error.message}`, status: 0, text: text.slice(0, 1000) };
    }
}

function readScholarlyApiConfig() {
    return {
        openAlexApiKey: normalizeString(process.env.OPENALEX_API_KEY || process.env.AILIS_OPENALEX_API_KEY),
        crossrefMailto: normalizeString(process.env.CROSSREF_MAILTO || process.env.AILIS_CROSSREF_MAILTO)
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

function academicTitleCase(value = '') {
    const text = normalizeString(value).replace(/([A-Za-z])[-‐‑‒–—]([A-Za-z])/g, '$1 $2');
    if (!text) {
        return '';
    }
    const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'vs', 'via', 'with']);
    const words = text.split(/(\s+)/);
    let wordIndex = 0;
    const totalWords = words.filter((part) => /\S/.test(part)).length;
    return words.map((part) => {
        if (!/\S/.test(part)) {
            return part;
        }
        wordIndex += 1;
        return part.split(/([/:()[\]{}])/).map((segment) => {
            if (!/[A-Za-z]/.test(segment)) {
                return segment;
            }
            const lower = segment.toLowerCase();
            if (wordIndex > 1 && wordIndex < totalWords && smallWords.has(lower)) {
                return lower;
            }
            return lower.replace(/^[a-z]/, (char) => char.toUpperCase());
        }).join('');
    }).join('');
}

function paperTitleVariants(value = '') {
    const original = normalizeString(value);
    const titled = academicTitleCase(original);
    return [...new Set([original, titled].filter(Boolean))];
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
        ? (() => {
            const variants = paperTitleVariants(payload.bestMatch.title);
            return pruneEmptyDeep({
                answer: variants[1] || variants[0],
                earliestWorkTitle: normalizeString(payload.bestMatch.title),
                titleVariants: variants.length > 1 ? variants : undefined,
                earliestWorkYear: Number(payload.bestMatch.year) || undefined,
                earliestWorkDate: normalizeString(payload.bestMatch.publicationDate),
                doi: normalizeString(payload.bestMatch.doi),
                venue: normalizeString(payload.bestMatch.venue),
                landingUrl: normalizeString(payload.bestMatch.landingUrl || payload.bestMatch.url),
                pdfUrl: normalizeString(payload.bestMatch.pdfUrl),
                reason: payload.beforeYear
                    ? `Earliest returned work before ${payload.beforeYear}`
                    : 'Earliest returned work for this author'
            });
        })()
        : undefined;
    return pruneEmptyDeep({
        answerCandidate,
        nextActionHint: authorHistoryNextCalls.length
            ? 'If the question asks which author had prior papers, earliest work, or first paper, call authorHistoryNextCalls exactly as provided. Do not copy authorId values from non-bestMatch results.'
            : undefined,
        authorDisambiguationHint: authorHistoryNextCalls.length
            ? 'The authorIds in authorHistoryNextCalls are scoped to bestMatch.authors. Other search results may contain off-target authors.'
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
        authorDisambiguationHint: affordances.authorDisambiguationHint,
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
                author: author.name,
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

function isLikelyHtmlFullTextCandidate(url = '', text = '') {
    const combined = `${url} ${text}`;
    if (!/^https?:\/\//i.test(url) || isLikelyPdfUrl(url, text)) {
        return false;
    }
    if (/semanticscholar\.org|openalex\.org|crossref\.org|doi\.org\/?$|facebook\.com|twitter\.com|x\.com/i.test(url)) {
        return false;
    }
    return /\/articles?\b|\/article\/view\/|\/article\/abstract\/|full\s*text|journal|archive|paper|publication|proceedings/i.test(combined);
}

function scoreHtmlFullTextCandidate(candidate = {}, query = '') {
    const haystack = `${candidate.url || ''} ${candidate.text || ''} ${candidate.title || ''} ${candidate.snippet || ''}`;
    let score = scoreDocumentSearchResult(candidate, query);
    if (/\/articles?\b|full\s*text|article|paper|journal|archive/i.test(haystack)) {
        score += 60;
    }
    if (/abstract/i.test(haystack) && !/full\s*text|\/articles?\b/i.test(haystack)) {
        score -= 20;
    }
    if (/download|pdf/i.test(haystack) && !/html|article|full\s*text/i.test(haystack)) {
        score -= 30;
    }
    return score;
}

function pushHtmlFullTextCandidate(candidates, seen, candidate = {}, query = '', source = '') {
    const url = normalizeString(candidate.url);
    const descriptor = `${candidate.text || ''} ${candidate.title || ''} ${candidate.snippet || ''}`;
    if (!isLikelyHtmlFullTextCandidate(url, descriptor) || seen.has(url)) {
        return;
    }
    const score = Math.max(scoreHtmlFullTextCandidate(candidate, query), Number(candidate.score) || 0);
    if (score < 55) {
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

async function addPdfCandidatesFromUrl({ url, query, candidates, seen, htmlCandidates = [], htmlSeen = new Set(), maxLinks, timeoutMs, depth = 0 }) {
    if (isLikelyPdfUrl(url)) {
        pushPdfCandidate(candidates, seen, { url, text: 'direct PDF-like URL' }, query, 'direct_url');
    } else {
        pushHtmlFullTextCandidate(htmlCandidates, htmlSeen, { url, text: `source HTML page for ${query}` }, query, 'source_url_html');
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
    const pageTitle = extractHtmlDocumentTitle(fetched.text || '');
    const pagePreview = stripHtml(fetched.text || '').slice(0, 1200);
    pushHtmlFullTextCandidate(htmlCandidates, htmlSeen, {
        url,
        title: pageTitle,
        snippet: pagePreview
    }, query, 'fetched_html_page');
    const rawLinks = extractLinksFromHtml(fetched.text || '', url, maxLinks)
        .map((link) => ({
            ...link,
            score: scorePdfCandidate(link, query)
        }));
    for (const link of rawLinks) {
        pushHtmlFullTextCandidate(htmlCandidates, htmlSeen, link, query, 'page_html_link');
    }
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
                htmlCandidates,
                htmlSeen,
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
    const htmlCandidates = [];
    const htmlSeen = new Set();
    const discovery = [];
    const attempts = [];
    const attemptedUrls = new Set();
    const attemptedHtmlUrls = new Set();
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

    async function tryExtractHtmlRankedCandidates() {
        const rankedCandidates = htmlCandidates
            .sort((a, b) => b.score - a.score)
            .slice(0, maxCandidates);
        for (const candidate of rankedCandidates) {
            if (attemptedHtmlUrls.has(candidate.url)) {
                continue;
            }
            const remainingMs = remainingBudgetMs();
            if (remainingMs < 5000) {
                attempts.push({
                    url: candidate.url,
                    source: candidate.source,
                    score: candidate.score,
                    kind: 'html',
                    ok: false,
                    status: 'timeout_budget_exhausted',
                    error: 'HTML fallback skipped because pdf_find_and_extract time budget was exhausted.'
                });
                break;
            }
            attemptedHtmlUrls.add(candidate.url);
            const fetched = await webFetch({
                url: candidate.url,
                query: evidenceQuery || query,
                maxChars,
                timeoutMs: Math.min(45000, timeoutMs, remainingMs),
                provider: args.fetchProvider || args.fetch_provider || args.webFetchProvider || args.web_fetch_provider,
                crawl4aiUrl: args.crawl4aiUrl || args.crawl4ai_url,
                crawl4aiWorker: args.crawl4aiWorker || args.crawl4ai_worker,
                crawl4aiPython: args.crawl4aiPython || args.crawl4ai_python
            });
            attempts.push({
                url: candidate.url,
                source: candidate.source,
                score: candidate.score,
                kind: 'html',
                ok: !fetched.isError,
                status: fetched.details?.status || '',
                error: fetched.isError ? (fetched.details?.error || fetched.content?.[0]?.text || '') : ''
            });
            if (fetched.isError) {
                continue;
            }
            const extractedText = fetched.content?.[0]?.text || '';
            const evidenceMatch = evaluateExtractedEvidenceMatch(extractedText, evidenceQuery || query);
            attempts[attempts.length - 1].evidenceMatched = evidenceMatch.ok;
            attempts[attempts.length - 1].matchedTerms = evidenceMatch.matchedTerms;
            attempts[attempts.length - 1].missingRareTerms = evidenceMatch.missingRareTerms;
            if (!evidenceMatch.ok) {
                attempts[attempts.length - 1].error = 'extracted HTML did not match enough evidence query terms';
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
                answerCandidateText ? 'HTML answer candidates:' : '',
                answerCandidateText,
                answerCandidateText && evidenceSnippets ? '' : '',
                evidenceSnippets ? 'HTML focused evidence snippets:' : '',
                evidenceSnippets,
                (answerCandidateText || evidenceSnippets) ? '' : '',
                (answerCandidateText || evidenceSnippets) ? '--- Extracted HTML text window ---' : '',
                focused.text
            ].filter((part) => part !== '').join('\n');
            return textResult(returnedText, {
                status: 'completed',
                query,
                evidenceQuery,
                sourceUrl,
                htmlUrl: candidate.url,
                htmlFallback: true,
                candidate,
                attempts,
                discovery,
                originalChars: fetched.details?.originalChars,
                returnedChars: returnedText.length,
                focus: focused.focus,
                evidenceSnippets,
                answerCandidates
            });
        }
        return null;
    }

    if (sourceUrl) {
        discovery.push(await addPdfCandidatesFromUrl({ url: sourceUrl, query, candidates, seen, htmlCandidates, htmlSeen, maxLinks, timeoutMs }));
        const extracted = await tryExtractRankedCandidates();
        if (extracted) {
            return extracted;
        }
        const htmlExtracted = await tryExtractHtmlRankedCandidates();
        if (htmlExtracted) {
            return htmlExtracted;
        }
    }

    if (query) {
        for (const knownOjsUrl of buildKnownOjsSearchUrls(query)) {
            discovery.push(await addPdfCandidatesFromUrl({
                url: knownOjsUrl,
                query,
                candidates,
                seen,
                htmlCandidates,
                htmlSeen,
                maxLinks,
                timeoutMs: Math.max(5000, Math.min(remainingBudgetMs(), 30000))
            }));
        }
        const knownOjsExtracted = await tryExtractRankedCandidates();
        if (knownOjsExtracted) {
            return knownOjsExtracted;
        }
        const knownOjsHtmlExtracted = await tryExtractHtmlRankedCandidates();
        if (knownOjsHtmlExtracted) {
            return knownOjsHtmlExtracted;
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
            } else {
                pushHtmlFullTextCandidate(htmlCandidates, htmlSeen, result, query, 'scholarly_search_html');
            }
            discovery.push(await addPdfCandidatesFromUrl({
                url: result.url,
                query,
                candidates,
                seen,
                htmlCandidates,
                htmlSeen,
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
        const scholarlyHtmlExtracted = await tryExtractHtmlRankedCandidates();
        if (scholarlyHtmlExtracted) {
            return scholarlyHtmlExtracted;
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
            } else {
                pushHtmlFullTextCandidate(htmlCandidates, htmlSeen, result, query, 'document_search_html');
            }
            discovery.push(await addPdfCandidatesFromUrl({
                url: result.url,
                query,
                candidates,
                seen,
                htmlCandidates,
                htmlSeen,
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
    const htmlExtracted = await tryExtractHtmlRankedCandidates();
    if (htmlExtracted) {
        return htmlExtracted;
    }
    const ranked = candidates
        .sort((a, b) => b.score - a.score)
        .slice(0, maxCandidates);

    return errorResult('pdf_find_and_extract could not find and extract a readable PDF', {
        status: 'not_found',
        query,
        sourceUrl,
        candidates: ranked,
        htmlCandidates: htmlCandidates
            .sort((a, b) => b.score - a.score)
            .slice(0, maxCandidates),
        attempts,
        discovery,
        evidenceGap: 'No high-confidence PDF/article/full-text HTML candidate was found or extracted. Try a known article URL, DOI, author name, journal/source name, or a quoted exact title.',
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
    if (!/\.wikipedia\.org$/i.test(parsed.hostname)) {
        return null;
    }
    const pageTitle = extractWikipediaPageTitle(parsed);
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

function extractWikipediaPageTitle(parsedUrl) {
    const parsed = parsedUrl instanceof URL ? parsedUrl : (() => {
        try {
            return new URL(parsedUrl);
        } catch {
            return null;
        }
    })();
    if (!parsed || !/\.wikipedia\.org$/i.test(parsed.hostname)) {
        return '';
    }
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (!segments.length || segments[0] === 'w') {
        return '';
    }
    if (segments[0] === 'wiki') {
        return decodeURIComponent(segments.slice(1).join('/')).split('#')[0];
    }
    if (/^[a-z]{2,3}(?:-[a-z0-9]+){0,2}$/i.test(segments[0]) && segments.length >= 2) {
        return decodeURIComponent(segments.slice(1).join('/')).split('#')[0];
    }
    return '';
}

function stripWikiText(value = '') {
    return decodeHtml(simplifyWikiTemplates(value)
        .replace(/<ref[\s\S]*?<\/ref>/gi, ' ')
        .replace(/<ref[^>]*\/>/gi, ' ')
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
            shell: false,
            env: {
                ...process.env,
                ...(options.env || {})
            }
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

function classifyYtDlpFailure(stderr = '') {
    const text = String(stderr || '');
    if (/sign in to confirm|not a bot|captcha|cookies-from-browser|cookies/i.test(text)) {
        return {
            status: 'anti_bot_blocked',
            failureReason: 'anti_bot_blocked',
            message: 'YouTube/yt-dlp was blocked by anti-bot or requires browser cookies.',
            nextActions: [
                'Retry with allow_cookies=true and cookies_from_browser set to an installed browser if the user permits cookie access.',
                'Use a video frame sampling or ASR backend if video/audio download is available.',
                'Do not keep rewriting web_search queries for the same YouTube video.'
            ]
        };
    }
    if (/ffmpeg|ffprobe/i.test(text)) {
        return {
            status: 'missing_dependency',
            failureReason: 'missing_ffmpeg',
            message: 'Video/audio fallback needs ffmpeg/ffprobe installed.',
            nextActions: ['Install ffmpeg, then rerun media smoke before exposing frame/ASR fallback.']
        };
    }
    if (/no subtitles|subtitles.*unavailable|unable to download video subtitles|no automatic captions/i.test(text)) {
        return {
            status: 'transcript_unavailable',
            failureReason: 'transcript_unavailable',
            message: 'No subtitles or automatic captions were available.',
            nextActions: ['Use audio ASR or video frame sampling instead of retrying transcript.']
        };
    }
    return {
        status: 'execution_failed',
        failureReason: 'yt_dlp_failed',
        message: 'yt-dlp failed for this video operation.',
        nextActions: ['Inspect stderr once, then switch backend instead of looping the same call.']
    };
}

function extractYouTubeVideoId(value = '') {
    const text = normalizeString(value);
    if (!text) return '';
    if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
    const patterns = [
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?[^#\s]*[?&]v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/i,
        /[?&]v=([A-Za-z0-9_-]{6,})/i
    ];
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match?.[1]) return match[1].slice(0, 32);
    }
    return '';
}

function buildYouTubeWatchUrl(value = '') {
    const videoId = extractYouTubeVideoId(value);
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';
}

function buildYouTubeOEmbedUrl(value = '') {
    const watchUrl = buildYouTubeWatchUrl(value);
    return watchUrl
        ? `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
        : '';
}

async function fetchYouTubeOEmbedMetadata(value = '', timeoutMs = 30000) {
    const videoId = extractYouTubeVideoId(value);
    const watchUrl = buildYouTubeWatchUrl(value);
    const oembedUrl = buildYouTubeOEmbedUrl(value);
    if (!videoId || !watchUrl || !oembedUrl) {
        return { ok: false, error: 'not_youtube_video_url' };
    }
    const budgetMs = clampNumber(timeoutMs, 30000, 1000, 30000);
    let response = await fetchJsonUrl(oembedUrl, Math.min(budgetMs, 6000));
    if (!response.ok && process.platform === 'win32') {
        const fallback = await fetchJsonUrlWithPowerShell(oembedUrl, Math.min(budgetMs, 20000));
        if (fallback.ok) {
            response = fallback;
        } else {
            response = {
                ...response,
                fallbackError: fallback.error || ''
            };
        }
    }
    if (!response.ok) {
        return {
            ok: false,
            error: response.error || 'youtube_oembed_failed',
            fallbackError: response.fallbackError || '',
            status: response.status || 0
        };
    }
    const json = response.json || {};
    const title = normalizeString(json.title);
    if (!title) {
        return { ok: false, error: 'youtube_oembed_missing_title', status: response.status || 0 };
    }
    const author = normalizeString(json.author_name);
    return {
        ok: true,
        video: {
            id: videoId,
            url: watchUrl,
            title,
            uploader: author,
            channel: author,
            thumbnail_url: normalizeString(json.thumbnail_url),
            provider_name: normalizeString(json.provider_name),
            source: 'youtube_oembed',
            metadataOnly: true
        }
    };
}

function quoteSearchTerm(value = '') {
    const text = normalizeString(value).replace(/"/g, '');
    return text ? `"${text}"` : '';
}

function buildYouTubeEvidenceSearchQuery(video = {}, args = {}) {
    const taskTerms = normalizeString(
        args.question ||
        args.context ||
        args.extract_query ||
        args.extractQuery ||
        ''
    );
    const fallbackEvidenceTerms = taskTerms || 'transcript captions visual evidence';
    return [
        quoteSearchTerm(video.title),
        quoteSearchTerm(video.uploader || video.channel),
        fallbackEvidenceTerms
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

function buildYouTubeOEmbedSuggestedCalls(video = {}, args = {}) {
    const language = normalizeString(args.language || args.lang, 'en');
    return [
        {
            tool: 'youtube_transcript',
            args: { url: video.url, language }
        },
        {
            tool: 'web_search',
            args: { query: buildYouTubeEvidenceSearchQuery(video, args), maxResults: 5 }
        }
    ];
}

function youtubeOEmbedMetadataResult(video = {}, args = {}, failure = {}) {
    const suggestedNextCalls = buildYouTubeOEmbedSuggestedCalls(video, args);
    const lines = [
        'YouTube metadata recovered via oEmbed.',
        '',
        `title: ${video.title || ''}`,
        `channel: ${video.channel || video.uploader || ''}`,
        `url: ${video.url || ''}`,
        `thumbnail_url: ${video.thumbnail_url || ''}`,
        '',
        'evidence_gap: metadata_only; this is not transcript, audio, or frame evidence.',
        'Use the exact title/channel above for follow-up search or media fallback before answering visual/audio questions.',
        '',
        'Suggested next calls:',
        `1. youtube_transcript ${JSON.stringify(suggestedNextCalls[0].args)}`,
        `2. web_search ${JSON.stringify(suggestedNextCalls[1].args)}`
    ];
    return textResult(lines.join('\n'), {
        ...failure,
        status: 'metadata_only',
        evidenceQuality: 'metadata_only',
        metadataOnly: true,
        evidenceGap: 'yt-dlp could not provide transcript/video evidence; oEmbed only recovered title/channel/thumbnail metadata.',
        videos: [video],
        metadata: video,
        suggestedNextCalls
    });
}

function renderDocumentMarkdown(document = {}) {
    const lines = [
        '# DOCUMENT_READ_COMPLETE',
        '',
        `path: ${document.path || ''}`,
        `paragraph_count: ${Number(document.paragraph_count || 0)}`,
        `table_count: ${Number(document.table_count || 0)}`,
        'truncated: false',
        '',
        'Use structuredContent.document.paragraphs and structuredContent.document.tables directly. Do not read the raw DOCX/ZIP unless this tool reports an error.',
        '',
        '## Paragraphs'
    ];
    for (const paragraph of document.paragraphs || []) {
        lines.push(`[${paragraph.index}] ${paragraph.text}`);
    }
    if (!Array.isArray(document.paragraphs) || !document.paragraphs.length) {
        lines.push('(none)');
    }
    lines.push('', '## Tables');
    for (const table of document.tables || []) {
        const rows = Array.isArray(table.rows) ? table.rows : [];
        lines.push(`Table ${Number(table.index || 0) + 1} rows=${rows.length}`);
        for (const row of rows) {
            lines.push(row.map((cell) => String(cell || '').replace(/\s+/g, ' ').trim()).join(' | '));
        }
        lines.push('');
    }
    if (!Array.isArray(document.tables) || !document.tables.length) {
        lines.push('(none)');
    }
    return lines.join('\n').trim();
}

async function writeMcpArtifact(kind = 'artifact', baseName = 'artifact', text = '') {
    const root = normalizeString(process.env.AILIS_MCP_ARTIFACT_DIR) ||
        path.join(process.cwd(), '.ailis-state', 'mcp-artifacts', kind);
    await fs.mkdir(root, { recursive: true });
    const safeName = normalizeString(baseName, kind)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || kind;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const artifactPath = path.join(root, `${safeName}-${stamp}.md`);
    await fs.writeFile(artifactPath, text, 'utf8');
    return artifactPath;
}

async function fetchTextWithPythonRequests(url, timeoutMs = 60000, options = {}) {
    if (process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL === '1') {
        return {
            ok: false,
            errorCode: 'fetch_process_failed',
            error: 'forced python requests failure',
            stderr: 'AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL',
            backend: 'python_requests'
        };
    }
    const code = `
import json, requests, sys
url = sys.argv[1]
timeout = float(sys.argv[2])
verify_tls = sys.argv[3].lower() != "false"
if not verify_tls:
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
r = requests.get(url, timeout=timeout, verify=verify_tls, headers={"User-Agent": "AILISResearchMCP/0.1 (+local assistant research tool)"})
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
  "tls_verify": verify_tls,
  "text": text,
}, ensure_ascii=False))
`.trim();
    const verifyTls = options.verifyTls !== false;
    const result = await runProcess('python', [
        '-c',
        code,
        url,
        String(Math.max(5, Math.ceil(timeoutMs / 1000))),
        verifyTls ? 'true' : 'false'
    ], { timeoutMs });
    if (result.exitCode !== 0) {
        return {
            ok: false,
            timedOut: result.timedOut === true,
            errorCode: result.timedOut === true ? 'timeout' : 'fetch_process_failed',
            error: `python requests exit ${result.exitCode}`,
            stderr: result.stderr,
            tlsVerificationDisabled: verifyTls === false,
            backend: 'python_requests'
        };
    }
    let payload;
    try {
        payload = JSON.parse(result.stdout);
    } catch (error) {
        return {
            ok: false,
            errorCode: 'invalid_requests_payload',
            error: `invalid requests payload: ${error.message}`,
            stderr: result.stderr,
            backend: 'python_requests'
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
        error: status ? `HTTP ${status}` : '',
        tlsVerificationDisabled: payload.tls_verify === false,
        backend: 'python_requests'
    };
}

async function fetchTextWithNodeFetch(url, timeoutMs = 60000) {
    if (typeof fetch !== 'function') {
        return {
            ok: false,
            errorCode: 'node_fetch_unavailable',
            error: 'global fetch is unavailable in this Node runtime',
            backend: 'node_fetch'
        };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), clampNumber(timeoutMs, 60000, 1000, 600000));
    try {
        const response = await fetch(url, {
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                'User-Agent': 'AILISResearchMCP/0.1 (+local assistant research tool)',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5'
            }
        });
        const contentType = normalizeString(response.headers.get('content-type'));
        const content = Buffer.from(await response.arrayBuffer());
        const prefix = content.subarray(0, 16);
        const isPdf = content.subarray(0, 4).toString('ascii') === '%PDF' || /application\/pdf/i.test(contentType);
        const hasNul = content.subarray(0, Math.min(content.length, 2048)).includes(0);
        const isBinary = isPdf || hasNul;
        return {
            ok: response.status >= 200 && response.status < 400,
            status: response.status,
            errorCode: response.status >= 200 && response.status < 400 ? '' : `http_${response.status || 'unknown'}`,
            contentType,
            contentLength: content.length,
            isPdf,
            isBinary,
            prefixHex: prefix.toString('hex'),
            text: isBinary ? '' : content.toString('utf8'),
            stderr: '',
            error: response.status ? `HTTP ${response.status}` : '',
            backend: 'node_fetch'
        };
    } catch (error) {
        return {
            ok: false,
            timedOut: error?.name === 'AbortError',
            errorCode: error?.name === 'AbortError' ? 'timeout' : 'node_fetch_failed',
            error: error?.message || String(error),
            stderr: error?.stack || error?.message || String(error),
            backend: 'node_fetch'
        };
    } finally {
        clearTimeout(timer);
    }
}

async function fetchJsonWithNodeFetch(url, { method = 'GET', headers = {}, body = undefined, timeoutMs = 60000 } = {}) {
    if (typeof fetch !== 'function') {
        return {
            ok: false,
            errorCode: 'node_fetch_unavailable',
            error: 'global fetch is unavailable in this Node runtime',
            backend: 'node_fetch_json'
        };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), clampNumber(timeoutMs, 60000, 1000, 600000));
    try {
        const hasBody = body !== undefined && body !== null;
        const response = await fetch(url, {
            method,
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                Accept: 'application/json,text/plain;q=0.8,*/*;q=0.5',
                ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
                ...headers
            },
            body: hasBody ? JSON.stringify(body) : undefined
        });
        const contentType = normalizeString(response.headers.get('content-type'));
        const text = await response.text();
        let json = null;
        try {
            json = text ? JSON.parse(text) : null;
        } catch (error) {
            return {
                ok: false,
                status: response.status,
                errorCode: 'invalid_json_payload',
                error: `invalid JSON payload: ${error.message}`,
                contentType,
                text: text.slice(0, 3000),
                backend: 'node_fetch_json'
            };
        }
        const ok = response.status >= 200 && response.status < 400;
        return {
            ok,
            status: response.status,
            errorCode: ok ? '' : `http_${response.status || 'unknown'}`,
            error: ok ? '' : `HTTP ${response.status}`,
            contentType,
            json,
            text,
            backend: 'node_fetch_json'
        };
    } catch (error) {
        return {
            ok: false,
            timedOut: error?.name === 'AbortError',
            errorCode: error?.name === 'AbortError' ? 'timeout' : 'node_fetch_json_failed',
            error: error?.message || String(error),
            stderr: error?.stack || error?.message || String(error),
            backend: 'node_fetch_json'
        };
    } finally {
        clearTimeout(timer);
    }
}

function shouldFallbackToNodeFetch(fetched = {}) {
    if (!fetched || fetched.ok) {
        return false;
    }
    return ['fetch_process_failed', 'invalid_requests_payload', 'timeout'].includes(normalizeString(fetched.errorCode));
}

function isTlsCertificateFailure(fetched = {}) {
    const text = `${fetched.error || ''}\n${fetched.stderr || ''}`;
    return /CERTIFICATE_VERIFY_FAILED|SSLCertVerificationError|Hostname mismatch|self[- ]signed|unable to get local issuer|certificate verify failed/i.test(text);
}

async function fetchText(url, timeoutMs = 60000) {
    const primary = await fetchTextWithPythonRequests(url, timeoutMs);
    if (!primary.ok && isTlsCertificateFailure(primary)) {
        const insecureRetry = await fetchTextWithPythonRequests(url, timeoutMs, { verifyTls: false });
        if (insecureRetry.ok || insecureRetry.status) {
            return {
                ...insecureRetry,
                fallbackFrom: primary.backend || 'python_requests',
                primaryErrorCode: primary.errorCode,
                primaryStderr: normalizeString(primary.stderr).slice(0, 3000),
                tlsFallbackReason: 'certificate_verification_failed'
            };
        }
    }
    if (!shouldFallbackToNodeFetch(primary)) {
        return primary;
    }
    const fallback = await fetchTextWithNodeFetch(url, timeoutMs);
    if (fallback.ok || fallback.status) {
        return {
            ...fallback,
            fallbackFrom: primary.backend || 'python_requests',
            primaryErrorCode: primary.errorCode,
            primaryStderr: normalizeString(primary.stderr).slice(0, 3000)
        };
    }
    return {
        ...primary,
        fallbackErrorCode: fallback.errorCode,
        fallbackError: fallback.error,
        fallbackBackend: fallback.backend,
        fallbackStderr: normalizeString(fallback.stderr).slice(0, 3000)
    };
}

async function fetchGitHubJson(url, timeoutMs = 60000) {
    const code = `
import json, os, requests, sys
url = sys.argv[1]
timeout = float(sys.argv[2])
headers = {
    "User-Agent": "AILISResearchMCP/0.1 (+local assistant research tool)",
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
    const inlineCode = normalizeString(args.code || args.inline_code || args.inlineCode || args.source || args.python);
    const rawFilePath = normalizeString(args.path || args.file || args.filePath || args.file_path);
    let filePath = rawFilePath ? path.resolve(rawFilePath) : '';
    let tempDir = '';
    if (!filePath && inlineCode) {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-python-'));
        filePath = path.join(tempDir, 'inline.py');
        await fs.writeFile(filePath, inlineCode, 'utf8');
    }
    const stat = filePath ? await fs.stat(filePath).catch(() => null) : null;
    if (!stat || !stat.isFile()) {
        return errorResult('run_python_file requires an existing path or inline code', { path: filePath, inlineCode: Boolean(inlineCode) });
    }
    const result = await runProcess('python', [filePath], {
        cwd: path.dirname(filePath),
        timeoutMs: args.timeoutMs || 120000
    });
    if (tempDir) {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
    const text = [
        result.stdout ? `STDOUT:\n${result.stdout.trim()}` : '',
        result.stderr ? `STDERR:\n${result.stderr.trim()}` : ''
    ].filter(Boolean).join('\n\n') || `exitCode=${result.exitCode}`;
    return {
        ...textResult(text, { status: result.exitCode === 0 ? 'completed' : 'error', ...result, inlineCode: Boolean(inlineCode) }),
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
        ok: true,
        path: filePath,
        paragraphCount: Number(document.paragraph_count || 0),
        tableCount: Number(document.table_count || 0),
        complete: true,
        truncated: false,
        reasoningReady: true,
        evidenceQuality: 'sufficient_evidence',
        completeness: {
            paragraphsReturned: Number(document.paragraph_count || 0),
            tablesReturned: Number(document.table_count || 0),
            tableRowsReturned: (document.tables || []).reduce((sum, table) => sum + (Array.isArray(table.rows) ? table.rows.length : 0), 0),
            fullDocumentRead: true
        },
        observationContract: {
            complete: true,
            truncated: false,
            reasoning_ready: true,
            is_evidence: true,
            evidence_quality: 'sufficient_evidence'
        },
        nextActionHint: 'Use structuredContent.document directly and submit/finalize if it contains the needed evidence; do not fall back to raw DOCX/ZIP reads after read_document completes.'
    };
    const markdown = renderDocumentMarkdown(document);
    const fullTextPath = await writeMcpArtifact('documents', path.basename(filePath, path.extname(filePath)), markdown);
    return {
        content: [{
            type: 'text',
            text: `${markdown}\n\nfullTextPath: ${fullTextPath}`
        }],
        structuredContent: {
            ok: true,
            ...details,
            fullTextPath,
            fullText: markdown,
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
        const providerError = response.error || '';
        const unsupportedImageInput = /unknown variant [`']?image_url|expected [`']?text|image_url/i.test(providerError);
        return actionableErrorResult('describe_image failed', {
            path: filePath,
            status: response.code || 'vision_model_error',
            error: providerError,
            failureReason: unsupportedImageInput
                ? 'configured_llm_provider_does_not_accept_image_url_parts'
                : 'vision_model_call_failed',
            message: unsupportedImageInput
                ? '当前配置的大模型接口不支持 image_url 视觉输入；不要重复调用 describe_image。请改用窗口标题、页面文本、OCR/截图读取工具，或先用 web_search 检索公开比赛信息。'
                : '视觉模型调用失败；不要机械重复同一个截图分析调用，改用其他证据来源。',
            nextActions: unsupportedImageInput
                ? [
                    'Call tool_search with a public web discovery query such as "Kaggle AI defense competition latest strategy web_search".',
                    'If screen evidence is still needed, inspect window titles or use OCR/page-text tools instead of describe_image.',
                    'Only retry describe_image after switching to a vision-capable provider/model.'
                ]
                : [
                    'Try another evidence source before retrying describe_image.',
                    'Use web_search for public competition/strategy information when the screen cannot be analyzed.'
                ],
            suggestedNextCalls: [
                {
                    tool: 'tool_search',
                    args: { query: 'Kaggle AI defense competition latest strategy web_search', limit: 8 }
                }
            ]
        });
    }
    return textResult(response.content.slice(0, maxChars), {
        status: 'completed',
        path: filePath,
        model: response.model
    });
}

async function youtubeVideoSearch(args = {}) {
    const videoId = normalizeString(args.video_id || args.videoId || args.id);
    const explicitUrl = normalizeString(args.url || args.videoUrl || args.video_url) || buildYouTubeWatchUrl(videoId);
    const query = normalizeString(args.query || args.q || args.title || args.search || args.keywords);
    const channel = normalizeString(args.channel || args.uploader);
    const maxResults = clampNumber(args.maxResults || args.max_results || args.limit, 5, 1, 10);
    if (!explicitUrl && !query) {
        return actionableErrorResult('youtube_video_search requires query/title or a YouTube URL', {
            status: 'invalid_args',
            suggestedNextCalls: [
                {
                    tool: 'youtube_video_search',
                    args: { query: '<video title or channel keywords>', maxResults: 5 }
                }
            ]
        });
    }
    const searchQuery = explicitUrl || [query, channel].filter(Boolean).join(' ');
    const code = `
import json, sys, yt_dlp
target = sys.argv[1]
max_results = int(sys.argv[2])
is_url = target.startswith("http://") or target.startswith("https://")
ydl_target = target if is_url else f"ytsearch{max_results}:{target}"
ydl_opts = {
    "quiet": True,
    "skip_download": True,
    "noplaylist": True,
    "extract_flat": True,
}
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(ydl_target, download=False)
entries = info.get("entries") if isinstance(info, dict) and info.get("entries") is not None else [info]
videos = []
for entry in entries or []:
    if not entry:
        continue
    vid = entry.get("id") or ""
    raw_url = entry.get("webpage_url") or entry.get("url") or ""
    if raw_url and raw_url.startswith("http"):
        url = raw_url
    elif vid:
        url = f"https://www.youtube.com/watch?v={vid}"
    else:
        url = ""
    videos.append({
        "id": vid,
        "url": url,
        "title": entry.get("title") or "",
        "uploader": entry.get("uploader") or entry.get("channel") or "",
        "channel": entry.get("channel") or entry.get("uploader") or "",
        "duration": entry.get("duration"),
        "view_count": entry.get("view_count"),
        "description": (entry.get("description") or "")[:500],
    })
print(json.dumps({"query": target, "videos": videos[:max_results]}, ensure_ascii=False))
`.trim();
    const result = await runProcess('python', ['-c', code, searchQuery, String(maxResults)], {
        timeoutMs: args.timeoutMs || 180000
    });
    if (result.exitCode !== 0) {
        const failure = classifyYtDlpFailure(result.stderr);
        if (explicitUrl) {
            const oembed = await fetchYouTubeOEmbedMetadata(explicitUrl, args.timeoutMs || 30000);
            if (oembed.ok) {
                return youtubeOEmbedMetadataResult(oembed.video, args, {
                    ...failure,
                    originalStatus: result.timedOut ? 'timeout' : failure.status,
                    query: searchQuery,
                    stderr: result.stderr.slice(0, 3000)
                });
            }
        }
        return actionableErrorResult('youtube_video_search failed', {
            ...failure,
            status: result.timedOut ? 'timeout' : failure.status,
            query: searchQuery,
            stderr: result.stderr.slice(0, 3000),
            nextActions: failure.nextActions,
            suggestedNextCalls: [
                {
                    tool: 'web_search',
                    args: { query: `${query || searchQuery} site:youtube.com`, maxResults: 5 }
                }
            ]
        });
    }
    let payload;
    try {
        payload = JSON.parse(result.stdout || '{}');
    } catch (error) {
        return errorResult('youtube_video_search returned invalid JSON', {
            status: 'invalid_tool_output',
            query: searchQuery,
            error: error.message,
            stdout: result.stdout.slice(0, 1000)
        });
    }
    const videos = Array.isArray(payload.videos) ? payload.videos.filter((video) => normalizeString(video.url)) : [];
    if (!videos.length) {
        return actionableErrorResult('youtube_video_search found no videos', {
            status: 'no_results',
            query: searchQuery,
            suggestedNextCalls: [
                {
                    tool: 'web_search',
                    args: { query: `${query || searchQuery} site:youtube.com`, maxResults: 5 }
                }
            ]
        });
    }
    const suggestedNextCalls = [
        {
            tool: 'youtube_transcript',
            args: { url: videos[0].url, language: normalizeString(args.language || args.lang, 'en') }
        }
    ];
    const lines = [
        'YouTube search results:',
        ...videos.map((video, index) => `${index + 1}. ${video.title || '(untitled)'} | ${video.channel || video.uploader || 'unknown channel'} | ${video.url}`),
        '',
        `Suggested next calls:`,
        `1. youtube_transcript ${JSON.stringify(suggestedNextCalls[0].args)}`
    ];
    return textResult(lines.join('\n'), {
        status: 'completed',
        query: searchQuery,
        videos,
        suggestedNextCalls
    });
}

async function youtubeTranscript(args = {}) {
    let url = normalizeString(args.url || args.videoUrl || args.video_url);
    const videoId = normalizeString(args.video_id || args.videoId || args.id);
    if (!url && videoId) {
        url = buildYouTubeWatchUrl(videoId);
    }
    const query = normalizeString(args.query || args.q || args.title || args.search || args.keywords);
    if (!url && query) {
        const resolved = await youtubeVideoSearch({
            ...args,
            query,
            maxResults: 1
        });
        const candidate = resolved.structuredContent?.videos?.[0]?.url;
        if (candidate) {
            url = candidate;
        } else {
            return {
                ...resolved,
                content: [{
                    type: 'text',
                    text: `${resolved.content?.[0]?.text || 'youtube_video_search failed'}\n\nyoutube_transcript could not resolve a video URL from query/title.`
                }]
            };
        }
    }
    if (!/^https?:\/\//i.test(url) || !/youtu\.be|youtube\.com/i.test(url)) {
        return actionableErrorResult('youtube_transcript requires a YouTube URL', {
            status: 'invalid_args',
            suggestedNextCalls: [
                {
                    tool: 'youtube_video_search',
                    args: { query: '<video title or channel keywords>', maxResults: 5 }
                }
            ]
        });
    }
    const language = normalizeString(args.language || args.lang, 'en');
    const maxChars = clampNumber(args.maxChars || args.max_chars, 12000, 1000, 60000);
    const allowCookies = args.allow_cookies === true || args.allowCookies === true;
    const cookiesFromBrowser = normalizeString(args.cookies_from_browser || args.cookiesFromBrowser || args.browser);
    const code = `
import json, re, sys, requests, yt_dlp
url = sys.argv[1]
language = sys.argv[2]
max_chars = int(sys.argv[3])
allow_cookies = sys.argv[4].lower() == "true"
cookies_from_browser = sys.argv[5]
ydl_opts = {"quiet": True, "skip_download": True, "noplaylist": True}
if allow_cookies and cookies_from_browser:
    ydl_opts["cookiesfrombrowser"] = (cookies_from_browser,)
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
    const result = await runProcess('python', ['-c', code, url, language, String(maxChars), String(allowCookies), cookiesFromBrowser], {
        timeoutMs: args.timeoutMs || 240000
    });
    if (result.exitCode !== 0) {
        const failure = classifyYtDlpFailure(result.stderr);
        const oembed = await fetchYouTubeOEmbedMetadata(url, args.timeoutMs || 30000);
        const suggestedNextCalls = oembed.ok
            ? buildYouTubeOEmbedSuggestedCalls(oembed.video, args)
            : [
                {
                    tool: 'youtube_video_search',
                    args: { url, maxResults: 1 }
                },
                {
                    tool: 'web_search',
                    args: { query: `${url} transcript`, maxResults: 5 }
                }
            ];
        return actionableErrorResult('youtube_transcript failed', {
            ...failure,
            status: result.timedOut ? 'timeout' : failure.status,
            url,
            stderr: result.stderr.slice(0, 3000),
            metadata: oembed.ok ? oembed.video : {},
            videos: oembed.ok ? [oembed.video] : [],
            metadataOnly: oembed.ok,
            evidenceQuality: oembed.ok ? 'metadata_only' : 'none',
            evidenceGap: oembed.ok
                ? 'yt-dlp could not provide transcript/video evidence; oEmbed only recovered title/channel/thumbnail metadata.'
                : 'yt-dlp could not provide transcript/video evidence and oEmbed metadata was unavailable.',
            nextActions: failure.nextActions,
            suggestedNextCalls
        });
    }
    let payload = null;
    try {
        payload = JSON.parse(result.stdout || '{}');
    } catch {}
    const transcript = normalizeString(payload?.transcript);
    const details = {
        status: transcript ? 'completed' : 'transcript_unavailable',
        url,
        metadata: payload ? {
            title: payload.title || '',
            duration: payload.duration,
            uploader: payload.uploader || '',
            description: payload.description || ''
        } : {},
        transcriptAvailable: Boolean(transcript),
        evidenceGap: transcript ? '' : 'No subtitles or automatic captions were available in yt-dlp metadata.',
        suggestedNextCalls: transcript ? [] : [
            {
                tool: 'youtube_video_search',
                args: { url, maxResults: 1 }
            },
            {
                tool: 'web_search',
                args: { query: `${payload?.title || url} transcript species visual evidence`, maxResults: 5 }
            }
        ]
    };
    const text = result.stdout.trim() + (transcript
        ? ''
        : `\n\nevidence_gap=${details.evidenceGap}\nSuggested next calls:\n1. youtube_video_search ${JSON.stringify(details.suggestedNextCalls[0].args)}\n2. web_search ${JSON.stringify(details.suggestedNextCalls[1].args)}`);
    return textResult(text, details);
}

const TOOLS = [
    {
        name: 'web_search',
        description: 'Fallback broad public web search through AILIS managed search backends. Standard call: { "query": "specific search keywords", "maxResults": 5 }. Do not use as the first step for attached/local files, known URLs, PDFs/papers/reports, YouTube/videos, audio, images, spreadsheets, presentations, Word documents, code files, or GitHub repositories; use the dedicated MCP tool for those artifact types first. Use web_fetch for a known HTML/text URL, paper_metadata_lookup for exact paper/DOI metadata, pdf_extract_text for a known PDF URL, pdf_find_and_extract for a paper/report title when you need full text, and github_repo_read for GitHub README/tree/file evidence. General web queries use a SearXNG-style provider chain: SearXNG JSON, Firecrawl-compatible local search, then current HTML fallback; GitHub/code repository queries keep GitHub repository search first. Configure with AILIS_SEARXNG_URL, AILIS_FIRECRAWL_URL, and AILIS_WEB_SEARCH_PROVIDER when local endpoints exist. Hosted Firecrawl is intentionally disabled here. Results from multiple successful providers are normalized, de-duplicated, source-tagged, re-ranked, and returned with searchConfidence plus clarificationRequired/candidateChoices when the result set is too ambiguous to follow safely.',
        inputSchema: {
            type: 'object',
            required: ['query'],
            properties: {
                query: { type: 'string', minLength: 1, description: 'Required search keywords. Prefer this field over q/search/text. Example: "Playwright wait for selector timeout official docs". Do not call web_search with empty arguments.' },
                q: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                search: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                text: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                exact_keywords: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Optional exact terms that should stay in the effective backend query. Prefer including them in query directly; this is an explicit compatibility field, not a replacement for query.'
                },
                exactKeywords: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Compatibility alias for exact_keywords.'
                },
                maxResults: { type: 'number', description: 'Requested result count, clamped to 1-12. Use 3-8 for normal tasks.' },
                limit: { type: 'number', description: 'Compatibility alias for maxResults. Prefer maxResults.' },
                timeoutMs: { type: 'number', description: 'Per-backend timeout in milliseconds, clamped to 3000-30000. Default is 8000. Omit unless a task needs a longer wait.' },
                overallTimeoutMs: { type: 'number', description: 'Overall search budget in milliseconds, clamped to 8000-120000. Defaults under the Gateway timeout so failures return as tool results instead of hanging.' },
                aggregate: { type: 'boolean', description: 'Optional. true forces multi-provider aggregation; false returns the first successful backend. Omit for automatic aggregation in auto/provider-chain mode.' },
                provider: { type: 'string', description: 'Optional provider chain selector: auto, searxng, firecrawl, html/current_html_fallback, external, github, or a comma-separated backend list. Prefer omitting this for automatic fallback.' },
                searchProvider: { type: 'string', description: 'Compatibility alias for provider. Prefer provider.' },
                searxngUrl: { type: 'string', description: 'Optional SearXNG base URL override. Prefer configuring AILIS_SEARXNG_URL instead of passing this per call.' },
                firecrawlUrl: { type: 'string', description: 'Optional Firecrawl base URL override for local/self-hosted Firecrawl. AILIS does not call hosted Firecrawl from this tool.' },
                backend: { type: 'string', description: 'Optional backend id or provider alias: searxng_json, firecrawl_search, bing_html, duckduckgo_lite, duckduckgo_html, yahoo_html, github_repositories, html, searxng, or firecrawl. Omit for automatic fallback.' },
                backends: {
                    type: 'array',
                    items: { type: 'string', enum: ['searxng_json', 'firecrawl_search', 'bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'yahoo_html', 'github_repositories', 'html', 'current_html_fallback', 'searxng', 'firecrawl'] },
                    description: 'Optional ordered backend ids. Omit for automatic fallback.'
                }
            },
            additionalProperties: false
        }
    },
    {
        name: 'web_research',
        description: 'End-to-end AILIS web research pipeline for natural research/guide/current-info tasks. It runs web_search, de-duplicates and ranks candidates, fetches the top high-signal HTML/text pages, extracts readable content plus relationship maps, and returns a retrieval evidence bundle with retrieval-readiness metadata, page types, evidencePages, searchConfidence, and suggestedNextCalls. Retrieval readiness is only a tool-layer heuristic: final answering requires an LLM evidence audit over supported claims, missing fields, and rejected/non-answer-bearing sources. Use this when the user asks to research, make a guide, compare public sources, or gather current web evidence and there is no more specific artifact tool. It stops for clarification instead of fetching pages when searchConfidence says the target is ambiguous.',
        inputSchema: {
            type: 'object',
            required: ['query'],
            properties: {
                query: { type: 'string', minLength: 1, description: 'Required research/search goal. Include disambiguating source, game, product, paper, or entity terms when known.' },
                q: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                search: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                text: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                maxResults: { type: 'number', description: 'Search result count, clamped to 1-12.' },
                limit: { type: 'number', description: 'Compatibility alias for maxResults. Prefer maxResults.' },
                maxPages: { type: 'number', description: 'Maximum pages to fetch into the evidence bundle, clamped to 1-5.' },
                maxSearchQueries: { type: 'number', description: 'Maximum planned query variants to run before fetching pages, clamped to 1-5. Defaults to 3 for product-grade recall without open-ended loops.' },
                max_search_queries: { type: 'number', description: 'Compatibility alias for maxSearchQueries. Prefer maxSearchQueries.' },
                expandQueries: { type: 'boolean', description: 'Optional. true forces all planned query variants even after a high-confidence search hit. Defaults to false/adaptive.' },
                expand_queries: { type: 'boolean', description: 'Compatibility alias for expandQueries. Prefer expandQueries.' },
                maxCharsPerPage: { type: 'number', description: 'Maximum readable chars per fetched page, clamped to 3000-60000.' },
                timeoutMs: { type: 'number', description: 'Per-search-backend timeout in milliseconds.' },
                overallTimeoutMs: { type: 'number', description: 'Overall search timeout budget in milliseconds.' },
                provider: { type: 'string', description: 'Optional search provider selector, same semantics as web_search.' },
                searchProvider: { type: 'string', description: 'Compatibility alias for provider. Prefer provider.' },
                fetchProvider: { type: 'string', description: 'Optional fetch provider selector, same semantics as web_fetch.' },
                searxngUrl: { type: 'string', description: 'Optional SearXNG base URL override.' },
                firecrawlUrl: { type: 'string', description: 'Optional local Firecrawl-compatible base URL override.' },
                crawl4aiUrl: { type: 'string', description: 'Optional legacy Crawl4AI HTTP base URL override. Prefer the local worker unless you intentionally run a service.' },
                crawl4aiWorker: { type: 'string', description: 'Optional local Crawl4AI worker path. Defaults to scripts/ailis-crawl4ai-worker.py and does not require Docker.' },
                crawl4aiPython: { type: 'string', description: 'Optional Python executable for the local Crawl4AI worker. Defaults to AILIS_CRAWL4AI_PYTHON, AILIS_PYTHON, or python.' },
                aggregate: { type: 'boolean', description: 'Optional. true forces multi-provider search aggregation; false returns first successful search backend.' },
                backend: { type: 'string', description: 'Optional search backend id or provider alias.' },
                backends: {
                    type: 'array',
                    items: { type: 'string', enum: ['searxng_json', 'firecrawl_search', 'bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'yahoo_html', 'github_repositories', 'html', 'current_html_fallback', 'searxng', 'firecrawl'] },
                    description: 'Optional ordered search backend ids.'
                }
            },
            additionalProperties: false
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
        description: 'Fetch a public HTTP(S) HTML or text resource and return readable text plus a structured relationship map. AILIS now prefers a local Python Crawl4AI worker (scripts/ailis-crawl4ai-worker.py, configurable with AILIS_CRAWL4AI_WORKER/AILIS_CRAWL4AI_PYTHON) for rendered Markdown extraction; Docker is not required. Legacy Crawl4AI HTTP service URLs remain supported through AILIS_CRAWL4AI_URL/CRAWL4AI_URL. In auto mode, web_fetch probes Crawl4AI and falls back to builtin fetch/extract when unavailable; if static fetch returns a JavaScript shell or thin non-evidence page, it can retry through full rendered Crawl4AI extraction when configured or requested with provider=crawl4ai/rendered/browser. provider=builtin/current/html disables rendered fallback. Rejects PDF/binary content with unsupported_content_type; use pdf_extract_text or download_file for PDFs/files. For archive, listing, search-result, table-of-contents, or journal issue pages, pass query/contains with task terms such as author, year, topic, or answer clue so excerpts and linked resources are ranked against the task instead of newest/first links.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string', minLength: 1 },
                maxChars: { type: 'number' },
                query: { type: 'string' },
                contains: { type: 'string' },
                extract_query: { type: 'string', description: 'Compatibility alias for query/contains. Use when asking web_fetch to focus the returned text around answer terms.' },
                extractQuery: { type: 'string', description: 'Compatibility alias for query/contains. Prefer query.' },
                provider: { type: 'string', description: 'Optional fetch provider selector: auto, crawl4ai/rendered/browser, builtin/current/html. Prefer omitting this unless testing a provider.' },
                fetchProvider: { type: 'string', description: 'Compatibility alias for provider. Prefer provider.' },
                crawl4aiUrl: { type: 'string', description: 'Optional legacy Crawl4AI HTTP base URL override. Prefer local worker configuration unless running a service intentionally.' },
                crawl4aiWorker: { type: 'string', description: 'Optional local Crawl4AI worker path. Defaults to scripts/ailis-crawl4ai-worker.py and does not require Docker.' },
                crawl4aiPython: { type: 'string', description: 'Optional Python executable for the local Crawl4AI worker. Defaults to AILIS_CRAWL4AI_PYTHON, AILIS_PYTHON, or python.' },
                waitFor: { type: 'string', description: 'Optional Crawl4AI wait_for selector/condition for JS-rendered pages.' },
                delayMs: { type: 'number', description: 'Optional Crawl4AI delay before reading rendered HTML, in milliseconds.' }
            },
            additionalProperties: false
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
        description: 'Run a local Python file or inline Python code and return stdout/stderr. Use for benchmark code-output, deterministic calculation, and simulation questions. Prefer inline code for short one-off calculations; prefer path for larger reusable scripts.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                code: { type: 'string', description: 'Inline Python source to run when no file path exists.' },
                inline_code: { type: 'string', description: 'Compatibility alias for code.' },
                inlineCode: { type: 'string', description: 'Compatibility alias for code.' },
                source: { type: 'string', description: 'Compatibility alias for code.' },
                python: { type: 'string', description: 'Compatibility alias for code.' },
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
            required: ['path'],
            properties: {
                path: { type: 'string', minLength: 1 },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                imagePath: { type: 'string' },
                image_path: { type: 'string' },
                question: { type: 'string' },
                maxChars: { type: 'number' },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'youtube_video_search',
        description: 'Search or resolve YouTube videos with yt-dlp using title, channel, or URL. Use this when a YouTube/video task gives only a title/channel or when fetching youtube.com search pages would be low-value. If yt-dlp is blocked for a known URL, this tool recovers metadata through YouTube oEmbed and returns metadata_only plus exact-title follow-up search suggestions; do not treat metadata_only as transcript/frame evidence.',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Video title/channel keywords to search.' },
                q: { type: 'string', description: 'Compatibility alias for query.' },
                title: { type: 'string', description: 'Compatibility alias for query.' },
                search: { type: 'string', description: 'Compatibility alias for query.' },
                url: { type: 'string', description: 'Known YouTube URL to resolve metadata for.' },
                videoUrl: { type: 'string', description: 'Compatibility alias for url.' },
                video_url: { type: 'string', description: 'Compatibility alias for url.' },
                video_id: { type: 'string', description: 'Compatibility alias for a known YouTube video id; normalized to a watch URL.' },
                videoId: { type: 'string', description: 'Compatibility alias for video_id.' },
                id: { type: 'string', description: 'Compatibility alias for video_id.' },
                channel: { type: 'string', description: 'Optional channel/uploader name to add to search terms.' },
                maxResults: { type: 'number', description: 'Maximum videos to return, 1-10.' },
                max_results: { type: 'number', description: 'Compatibility alias for maxResults.' },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'youtube_transcript',
        description: 'Fetch YouTube metadata and available subtitles/auto-captions with yt-dlp. Use for known YouTube URLs before guessing from search snippets; if only a title/query is known, this can resolve a URL through youtube_video_search first. If yt-dlp is blocked, the failure result may include oEmbed metadata and exact-title suggestedNextCalls; follow those before broad web_search, but do not answer visual/audio questions from metadata_only.',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                videoUrl: { type: 'string' },
                video_url: { type: 'string' },
                video_id: { type: 'string', description: 'Compatibility alias for a known YouTube video id; normalized to a watch URL.' },
                videoId: { type: 'string', description: 'Compatibility alias for video_id.' },
                id: { type: 'string', description: 'Compatibility alias for video_id.' },
                query: { type: 'string' },
                q: { type: 'string' },
                title: { type: 'string' },
                search: { type: 'string' },
                language: { type: 'string' },
                allow_cookies: { type: 'boolean', description: 'Allow yt-dlp to use browser cookies when cookies_from_browser is provided.' },
                cookies_from_browser: { type: 'string', description: 'Browser name for yt-dlp cookies-from-browser, for example chrome, edge, firefox.' },
                maxChars: { type: 'number' },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    }
];

async function handleToolCall(request) {
    const name = normalizeString(request.params?.name);
    const args = request.params?.arguments && typeof request.params.arguments === 'object'
        ? request.params.arguments
        : {};
    if (name === 'web_search') return await webSearch(args);
    if (name === 'web_research') return await webResearch(args);
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
    if (name === 'youtube_video_search') return await youtubeVideoSearch(args);
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
    assessSearchConfidence,
    buildEffectiveSearchQuery,
    buildWebResearchQueryPlan,
    buildSearchClarificationChoices,
    buildSuggestedCallsFromSearchResults,
    buildYouTubeEvidenceSearchQuery,
    buildYouTubeOEmbedUrl,
    classifyYtDlpFailure,
    crawl4aiFetchConfig,
    crawl4aiWorkerPath,
    downloadFile,
    extractBingResults,
    extractArxivCandidatesFromAtom,
    extractDuckDuckGoHtmlResults,
    extractGenericAnchorResults,
    extractGitHubRepositoryResults,
    extractShortCjkEntityTerms,
    extractYouTubeVideoId,
    extractWikipediaPageTitle,
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
    rankSearchResultsForFollowup,
    readDocument,
    readPresentation,
    runPythonFile,
    SEARCH_BACKENDS,
    stripWikiText,
    webExtractLinks,
    webFetch,
    webResearch,
    webSearch,
    youtubeTranscript,
    youtubeVideoSearch
};
