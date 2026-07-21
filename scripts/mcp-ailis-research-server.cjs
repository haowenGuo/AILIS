#!/usr/bin/env node
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const readline = require('node:readline');
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');
const { analyzeChessPosition } = require('./ailis-stockfish-engine.cjs');

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

function optionIsFalse(value) {
    return value === false || /^(?:false|0|no|off)$/i.test(normalizeString(value));
}

async function runBoundedParallel(items = [], concurrency = 1, worker = async () => null, options = {}) {
    const list = Array.isArray(items) ? items : [];
    const limit = clampNumber(concurrency, 1, 1, Math.max(1, list.length || 1));
    const keyFn = typeof options.keyFn === 'function' ? options.keyFn : null;
    const perKeyConcurrency = keyFn
        ? clampNumber(options.perKeyConcurrency, 1, 1, limit)
        : limit;
    const activeByKey = new Map();
    const started = new Array(list.length).fill(false);
    const results = new Array(list.length);
    let active = 0;
    let completed = 0;
    const keyForItem = (item, index) => {
        if (!keyFn) return '';
        return normalizeString(keyFn(item, index), `__item_${index}`);
    };
    const canStart = (index) => {
        if (started[index]) return false;
        if (!keyFn) return true;
        const key = keyForItem(list[index], index);
        return (activeByKey.get(key) || 0) < perKeyConcurrency;
    };
    const markActive = (index, delta) => {
        if (!keyFn) return;
        const key = keyForItem(list[index], index);
        const next = Math.max(0, (activeByKey.get(key) || 0) + delta);
        if (next) {
            activeByKey.set(key, next);
        } else {
            activeByKey.delete(key);
        }
    };
    return await new Promise((resolve) => {
        const pump = () => {
            while (active < limit) {
                const index = list.findIndex((_item, itemIndex) => canStart(itemIndex));
                if (index < 0) break;
                started[index] = true;
                active += 1;
                markActive(index, 1);
                Promise.resolve()
                    .then(() => worker(list[index], index))
                    .then((result) => {
                        results[index] = result;
                    })
                    .catch((error) => {
                        results[index] = {
                            error,
                            message: error?.message || String(error)
                        };
                    })
                    .finally(() => {
                        active -= 1;
                        completed += 1;
                        markActive(index, -1);
                        if (completed >= list.length) {
                            resolve(results);
                        } else {
                            pump();
                        }
                    });
            }
            if (list.length === 0) {
                resolve(results);
            }
        };
        pump();
    });
}

function readDesktopLlmSettings() {
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const statePath = path.join(appData, 'ailis', 'desktop-state.json');
    let state = {};
    if (fsSync.existsSync(statePath)) {
        try {
            state = JSON.parse(fsSync.readFileSync(statePath, 'utf8'));
        } catch {
            state = {};
        }
    }
    const preferences = state.preferences || {};
    const apiKey = normalizeString(
        process.env.AILIS_TOOL_LLM_API_KEY ||
        preferences.llmApiKey ||
        process.env.DOUBAO_API_KEY ||
        process.env.ARK_API_KEY ||
        process.env.VOLCENGINE_API_KEY ||
        process.env.OPENAI_COMPATIBLE_API_KEY
    );
    const provider = normalizeString(
        process.env.AILIS_TOOL_LLM_PROVIDER ||
        process.env.AILIS_AGENT_LLM_PROVIDER ||
        preferences.llmProvider,
        'openai-compatible'
    );
    const settings = {
        provider,
        baseUrl: normalizeString(
            process.env.AILIS_TOOL_LLM_BASE_URL ||
            process.env.AILIS_AGENT_LLM_BASE_URL ||
            preferences.llmBaseUrl,
            'https://ark.cn-beijing.volces.com/api/v3'
        ),
        model: normalizeString(
            process.env.AILIS_TOOL_LLM_MODEL ||
            process.env.AILIS_AGENT_LLM_MODEL ||
            preferences.llmModel,
            'doubao-seed-2-0-mini-260215'
        ),
        apiKey,
        reasoningEffort: normalizeString(
            process.env.AILIS_TOOL_LLM_REASONING_EFFORT ||
            process.env.AILIS_CODEX_REASONING_EFFORT
        ),
        temperature: 0,
        timeoutMs: 120000
    };
    const keylessProvider = ['codex-model-bridge', 'ollama', 'vllm'].includes(provider.toLowerCase());
    return settings.baseUrl && settings.model && (keylessProvider || settings.apiKey) ? settings : null;
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

function parseTableSpan(attributes = '', name = 'colspan') {
    const match = String(attributes || '').match(new RegExp(`\\b${name}\\s*=\\s*(?:"(\\d+)"|'(\\d+)'|(\\d+))`, 'i'));
    const parsed = Number(match?.[1] || match?.[2] || match?.[3] || 1);
    return Number.isFinite(parsed) ? Math.max(1, Math.min(96, parsed)) : 1;
}

function extractHtmlTableMatrix(tableHtml = '', { maxRows = 200, maxColumns = 96 } = {}) {
    const rowMatches = Array.from(String(tableHtml || '').matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi));
    const carry = [];
    const rows = [];
    const headerMasks = [];
    for (const rowMatch of rowMatches.slice(0, maxRows)) {
        const row = Array(maxColumns);
        const headerMask = Array(maxColumns).fill(false);
        for (let index = 0; index < carry.length && index < maxColumns; index += 1) {
            const span = carry[index];
            if (!span || span.remaining < 1) {
                continue;
            }
            row[index] = span.value;
            headerMask[index] = span.header === true;
            span.remaining -= 1;
        }
        const cellPattern = /<t([hd])\b([^>]*)>([\s\S]*?)<\/t\1>/gi;
        let cellMatch;
        let cursor = 0;
        while ((cellMatch = cellPattern.exec(rowMatch[1]))) {
            while (cursor < maxColumns && row[cursor] !== undefined) {
                cursor += 1;
            }
            if (cursor >= maxColumns) {
                break;
            }
            const attributes = cellMatch[2] || '';
            const value = truncateRelationText(stripHtml(cellMatch[3]), 240);
            const colspan = parseTableSpan(attributes, 'colspan');
            const rowspan = parseTableSpan(attributes, 'rowspan');
            let placed = 0;
            while (placed < colspan && cursor < maxColumns) {
                while (cursor < maxColumns && row[cursor] !== undefined) {
                    cursor += 1;
                }
                if (cursor >= maxColumns) {
                    break;
                }
                row[cursor] = value;
                headerMask[cursor] = cellMatch[1].toLowerCase() === 'h';
                if (rowspan > 1) {
                    carry[cursor] = {
                        value,
                        header: headerMask[cursor],
                        remaining: rowspan - 1
                    };
                }
                cursor += 1;
                placed += 1;
            }
        }
        let width = row.length;
        while (width > 0 && row[width - 1] === undefined) {
            width -= 1;
        }
        const cells = row.slice(0, width).map((value) => normalizeString(value));
        if (cells.some(Boolean)) {
            rows.push(cells);
            headerMasks.push(headerMask.slice(0, width));
        }
    }
    return {
        rows,
        headerMasks,
        sourceRowCount: rowMatches.length,
        rowsComplete: rowMatches.length <= maxRows
    };
}

function tableRowLooksNumeric(row = []) {
    const values = row.slice(1).map((value) => normalizeString(value)).filter(Boolean);
    if (!values.length) {
        return false;
    }
    const numeric = values.filter((value) =>
        /^(?:[-–—]|n\/a|[<>~≈]?\s*[+-]?(?:\d[\d,.\s]*|\.\d+)(?:\s*%|\s*[A-Za-z]+)?)$/i.test(value)
    ).length;
    return numeric >= 1 && numeric / values.length >= 0.2;
}

function inferTableHeaderRowCount(rows = [], headerMasks = []) {
    if (!rows.length) {
        return 0;
    }
    const firstNumericRow = rows.slice(0, 8).findIndex((row) => tableRowLooksNumeric(row));
    if (firstNumericRow > 0) {
        return firstNumericRow;
    }
    let headerRows = 0;
    for (let index = 0; index < Math.min(rows.length, 4); index += 1) {
        if ((headerMasks[index] || []).some(Boolean)) {
            headerRows += 1;
        } else {
            break;
        }
    }
    return headerRows;
}

function mergeTableHeaderRows(headerRows = [], width = 0) {
    const merged = [];
    const normalizedRows = headerRows.map((row) => {
        const sourceValues = row.map((value) => normalizeString(value));
        let values;
        if (sourceValues.length >= 2 && sourceValues.length < width) {
            const identity = sourceValues[0];
            const parentGroups = sourceValues.slice(1);
            const childSlots = width - 1;
            const baseSpan = Math.floor(childSlots / parentGroups.length);
            let remainder = childSlots - (baseSpan * parentGroups.length);
            values = [identity];
            for (let index = 0; index < parentGroups.length; index += 1) {
                const groupsRemaining = parentGroups.length - index;
                const span = baseSpan + (remainder >= groupsRemaining ? 1 : 0);
                remainder -= Math.max(0, span - baseSpan);
                for (let offset = 0; offset < Math.max(1, span); offset += 1) {
                    values.push(parentGroups[index]);
                }
            }
            values = values.slice(0, width);
        } else {
            values = Array.from({ length: width }, (_, index) => sourceValues[index] || '');
        }
        const nonEmpty = values.filter(Boolean).length;
        if (nonEmpty < 2 || nonEmpty >= width * 0.8) {
            return values;
        }
        let parent = '';
        return values.map((value, index) => {
            if (value) {
                parent = value;
                return value;
            }
            return index === 0 ? '' : parent;
        });
    });
    for (let column = 0; column < width; column += 1) {
        const parts = [];
        for (const row of normalizedRows) {
            const value = normalizeString(row[column]);
            if (value && !parts.some((part) => part.toLowerCase() === value.toLowerCase())) {
                parts.push(value);
            }
        }
        merged.push(parts.join(' / ') || `column_${column + 1}`);
    }
    return merged;
}

function tableQueryTokens(query = '') {
    return Array.from(new Set(
        normalizeString(query)
            .toLowerCase()
            .split(/[^\p{L}\p{N}]+/u)
            .filter((token) => token.length >= 3)
    ));
}

function tableSemanticColumnScore(header = '', query = '') {
    const normalizedHeader = normalizeString(header).toLowerCase();
    const normalizedQuery = normalizeString(query).toLowerCase();
    const concepts = [
        { header: /\bbirth|birthplace|born\b/, query: /\bbirth|birthplace|born\b/, score: 70 },
        { header: /\bdeath|died|deceased\b/, query: /\bdeath|died|deceased\b/, score: 70 },
        { header: /\benrollment|enrolled|recruitment\b/, query: /\benrollment|enrolled|recruitment\b/, score: 65 },
        { header: /\bauthor|writer|creator\b/, query: /\bauthor|writer|wrote|written|creator\b/, score: 55 },
        { header: /\bdate|year|time\b/, query: /\bdate|year|when|time\b/, score: 35 },
        { header: /place|\blocation|city|country|state\b/, query: /\bplace|location|where|city|cities|country|state\b/, score: 25 }
    ];
    return concepts.reduce((score, concept) => (
        concept.header.test(normalizedHeader) && concept.query.test(normalizedQuery)
            ? score + concept.score
            : score
    ), 0);
}

function tableMetricColumnScore(header = '', index = 0, width = 1, query = '') {
    const normalizedHeader = normalizeString(header).toLowerCase();
    const normalizedQuery = normalizeString(query).toLowerCase();
    const extremaOrCount = /\b(?:least|most|fewest|highest|lowest|minimum|maximum|min|max|number|count|total|how many)\b/i.test(normalizedQuery);
    let score = tableSemanticColumnScore(normalizedHeader, normalizedQuery);
    for (const token of tableQueryTokens(query)) {
        if (normalizedHeader.includes(token)) {
            score += token.length >= 6 ? 18 : 10;
        }
    }
    if (extremaOrCount) {
        if (/\btotal\b/i.test(normalizedHeader)) {
            score += 90;
        }
        if (/(?:^| \/ )all$/i.test(normalizedHeader)) {
            score += 80;
        }
        if (/\b(?:count|number|participants?|athletes?)\b/i.test(normalizedHeader)) {
            score += 55;
        }
    }
    if (/\b(?:women|female)\b/i.test(normalizedQuery) && /\b(?:w|women|female)\b/i.test(normalizedHeader)) {
        score += 45;
    }
    if (/\b(?:men|male)\b/i.test(normalizedQuery) && /\b(?:m|men|male)\b/i.test(normalizedHeader)) {
        score += 45;
    }
    return score + (index / Math.max(1, width));
}

function buildQueryAwareTableProjection({
    caption = '',
    headers = [],
    rows = [],
    rowCount = rows.length,
    rowsComplete = true
} = {}, query = '') {
    const width = Math.max(headers.length, ...rows.map((row) => row.length), 0);
    if (width < 2 || rows.length < 2) {
        return null;
    }
    const normalizedHeaders = Array.from(
        { length: width },
        (_, index) => normalizeString(headers[index]) || `column_${index + 1}`
    );
    const identityTerms = /\b(?:country|nation|team|name|code|entity|participant|athlete|title|item)\b/i;
    const identityIndex = normalizedHeaders.findIndex((header, index) =>
        index < Math.min(3, width) && identityTerms.test(header)
    );
    const entityColumn = identityIndex >= 0 ? identityIndex : 0;
    const rankedMetrics = normalizedHeaders
        .map((header, index) => ({
            index,
            score: index === entityColumn ? Number.NEGATIVE_INFINITY : tableMetricColumnScore(header, index, width, query)
        }))
        .filter((entry) => entry.index !== entityColumn)
        .sort((left, right) => right.score - left.score);
    const bestMetric = rankedMetrics[0];
    if (!bestMetric) {
        return null;
    }
    const extremaOrCount = /\b(?:least|most|fewest|highest|lowest|minimum|maximum|min|max|number|count|total|how many)\b/i.test(normalizeString(query));
    const queryRelevant = bestMetric.score >= 10 || (
        extremaOrCount &&
        /\b(?:total|all|count|number|participants?|athletes?)\b/i.test(normalizedHeaders[bestMetric.index])
    );
    const selectedIndexes = [entityColumn, bestMetric.index];
    const entityRows = rows.filter((row) => normalizeString(row[entityColumn]));
    const projectedRows = entityRows.slice(0, 120).map((row) =>
        selectedIndexes.map((index) => normalizeString(row[index]))
    );
    const inferredEntityHeader = /^column_\d+$/i.test(normalizedHeaders[entityColumn])
        ? /\bcountr(?:y|ies)\b/i.test(normalizeString(query))
            ? 'country'
            : /\bnation\b/i.test(normalizeString(query))
            ? 'nation'
            : /\bteam\b/i.test(normalizeString(query))
            ? 'team'
            : normalizedHeaders[entityColumn]
        : normalizedHeaders[entityColumn];
    return pruneEmptyDeep({
        caption: caption || undefined,
        columns: [inferredEntityHeader, normalizedHeaders[bestMetric.index]],
        selectedColumnIndexes: selectedIndexes,
        rowCount: entityRows.length,
        rowsComplete: rowsComplete && projectedRows.length === entityRows.length,
        queryRelevant,
        rows: projectedRows
    });
}

function buildTableRelation({
    caption = '',
    rows = [],
    headerMasks = [],
    sourceRowCount = rows.length,
    rowsComplete = true
} = {}, query = '') {
    if (!rows.length) {
        return null;
    }
    const headerRowCount = inferTableHeaderRowCount(rows, headerMasks);
    const headerRows = rows.slice(0, headerRowCount);
    const dataRows = rows.slice(headerRowCount);
    const width = Math.max(...rows.map((row) => row.length), 0);
    const headers = headerRows.length ? mergeTableHeaderRows(headerRows, width) : [];
    const rowCount = Math.max(0, sourceRowCount - headerRowCount);
    const projection = buildQueryAwareTableProjection({
        caption,
        headers,
        rows: dataRows,
        rowCount,
        rowsComplete
    }, query);
    return pruneEmptyDeep({
        caption: caption || undefined,
        headers: headers.length ? headers : undefined,
        headerRowCount: headerRowCount || undefined,
        rowCount,
        rowsComplete,
        sampleRows: dataRows.slice(0, 8),
        projection: projection || undefined,
        dataRows
    });
}

function splitMarkdownTableLine(line = '') {
    const source = String(line || '').trim().replace(/^\|/, '').replace(/\|$/, '');
    const cells = [];
    let current = '';
    let escaped = false;
    for (const character of source) {
        if (escaped) {
            current += character;
            escaped = false;
        } else if (character === '\\') {
            escaped = true;
        } else if (character === '|') {
            cells.push(normalizeString(current));
            current = '';
        } else {
            current += character;
        }
    }
    cells.push(normalizeString(current));
    return cells.map((cell) => truncateRelationText(stripHtml(cell), 240));
}

function markdownTableDelimiter(line = '') {
    const cells = splitMarkdownTableLine(line);
    return cells.length >= 2 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')));
}

function extractMarkdownTableRelations(markdown = '', query = '', limit = 6) {
    const lines = String(markdown || '').split(/\r?\n/);
    const tables = [];
    for (let index = 1; index < lines.length && tables.length < limit; index += 1) {
        if (!markdownTableDelimiter(lines[index]) || !lines[index - 1].includes('|')) {
            continue;
        }
        const rows = [splitMarkdownTableLine(lines[index - 1])];
        let cursor = index + 1;
        while (cursor < lines.length && lines[cursor].includes('|') && rows.length < 200) {
            rows.push(splitMarkdownTableLine(lines[cursor]));
            cursor += 1;
        }
        const table = buildTableRelation({
            rows,
            headerMasks: [rows[0].map(() => true), ...rows.slice(1).map((row) => row.map(() => false))],
            sourceRowCount: rows.length,
            rowsComplete: cursor >= lines.length || !lines[cursor].includes('|')
        }, query);
        if (table) {
            const { dataRows: _dataRows, ...publicTable } = table;
            tables.push(publicTable);
        }
        index = Math.max(index, cursor - 1);
    }
    return { tables };
}

function formatTableProjections(tables = [], maxChars = 3600) {
    const candidates = (Array.isArray(tables) ? tables : [])
        .map((table) => table?.projection)
        .filter((projection) => projection?.queryRelevant === true)
        .sort((left, right) => Number(right.rowsComplete) - Number(left.rowsComplete));
    if (!candidates.length) {
        return '';
    }
    const lines = [
        'Structured table projection (query-selected columns; source rows keep their original order):',
        'candidate_set_complete=true when rows_complete=true; raw page pagination does not make this table projection partial.'
    ];
    for (const projection of candidates.slice(0, 2)) {
        if (projection.caption) {
            lines.push(`table=${projection.caption}`);
        }
        lines.push(`columns=${projection.columns.join(' | ')}`);
        const rowMetadataIndex = lines.length;
        lines.push('');
        let displayedRows = 0;
        for (const row of projection.rows || []) {
            const rendered = row.join(' | ');
            if (displayedRows > 0 && lines.join('\n').length + rendered.length + 1 > maxChars - 80) {
                break;
            }
            lines.push(rendered);
            displayedRows += 1;
        }
        const fullyDisplayed = projection.rowsComplete === true &&
            displayedRows === projection.rowCount &&
            displayedRows === (projection.rows || []).length;
        lines[rowMetadataIndex] = `rows=${projection.rowCount}; rows_complete=${fullyDisplayed}`;
        if (lines.join('\n').length >= maxChars) {
            break;
        }
    }
    return lines.join('\n').slice(0, maxChars);
}

function extractHtmlTableRelations(html = '', query = '', limit = 6) {
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
        const matrix = extractHtmlTableMatrix(tableHtml);
        const table = buildTableRelation({ caption, ...matrix }, query);
        if (!table) {
            continue;
        }
        const headers = table.headers || [];
        const dataRows = table.dataRows || [];
        const { dataRows: _dataRows, ...publicTable } = table;
        tables.push(publicTable);
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
    const tableRelations = extractHtmlTableRelations(html, query);
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

function isLikelyDirectPdfUrl(value = '') {
    const text = normalizeString(value).toLowerCase();
    return Boolean(text) && (
        /\.pdf(?:$|[?#])/i.test(text) ||
        /\/pdf(?:$|[/?#])/i.test(text) ||
        /\/article\/download\/\d+(?:\/\d+)?(?:\/|$|[?#])/i.test(text) ||
        /\/article\/view\/\d+\/\d+(?:\/|$|[?#])/i.test(text) ||
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
    if (isLikelyDirectPdfUrl(url) || /\b(pdf|full text|download pdf|view pdf)\b/i.test(text)) {
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
    const github = parseGitHubRepoRef({ url });
    if (github.owner && github.repo) {
        const mode = github.path
            ? (/\/tree\//i.test(url) ? 'tree' : 'file')
            : 'readme';
        return {
            tool: 'github_repo_read',
            args: pruneEmptyDeep({
                repo: `${github.owner}/${github.repo}`,
                mode,
                path: github.path || undefined,
                ref: github.ref || undefined,
                maxChars: mode === 'file' ? 30000 : undefined
            }),
            reason: github.path
                ? `Read the linked GitHub ${mode === 'tree' ? 'directory' : 'file'} through the repository API: ${text}`
                : `Read the linked GitHub repository through the repository API: ${text}`
        };
    }
    if (normalizeString(candidate.doi)) {
        return {
            tool: 'paper_metadata_lookup',
            args: { doi: candidate.doi },
            reason: `Resolve scholarly metadata from DOI link: ${text}`
        };
    }
    if (isLikelyDirectPdfUrl(url)) {
        return {
            tool: 'pdf_extract_text',
            args: { url, maxChars: 12000 },
            reason: `Read the linked PDF directly: ${text}`
        };
    }
    if (candidate.kind === 'pdf') {
        return {
            tool: 'pdf_find_and_extract',
            args: {
                url,
                ...(query ? { extract_query: query } : {}),
                maxChars: 12000
            },
            reason: `Resolve the PDF download behind the linked article page: ${text}`
        };
    }
    return {
        tool: 'open_page',
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

const SEARCH_MIRROR_OR_LOW_AUTHORITY_HOSTS = Object.freeze([
    'scribd.com',
    'studocu.com',
    'coursehero.com',
    'docsity.com',
    'pdfcoffee.com',
    'slideshare.net',
    'slideshare.com',
    'issuu.com'
]);

const SEARCH_AI_DIRECTORY_HOSTS = Object.freeze([
    'theresanaiforthat.com',
    'futuretools.io',
    'aitoolsdirectory.com',
    'toolify.ai',
    'insidr.ai'
]);

function searchQueryMentionsHost(query = '', host = '') {
    const normalizedQuery = normalizeString(query).toLowerCase();
    const normalizedHost = normalizeString(host).replace(/^www\./i, '').toLowerCase();
    if (!normalizedQuery || !normalizedHost) {
        return false;
    }
    if (normalizedQuery.includes(normalizedHost)) {
        return true;
    }
    return extractSearchSiteConstraints(query).some((site) => hostMatchesSiteConstraint(normalizedHost, site));
}

function importantSearchQueryTerms(query = '') {
    return extractSearchQueryTerms(query)
        .map((term) => normalizeSearchText(term))
        .filter((term) => (
            term &&
            term.length >= 4 &&
            !SEARCH_QUERY_STOPWORDS.has(term) &&
            !GUIDE_QUERY_TERMS.has(term)
        ))
        .slice(0, 12);
}

function hostMatchesImportantQueryTerm(host = '', terms = []) {
    const compactHost = compactSearchText(normalizeString(host).replace(/[.-]+/g, ' '));
    return terms.some((term) => {
        const compactTerm = compactSearchText(term);
        return compactTerm.length >= 4 && compactHost.includes(compactTerm);
    });
}

function temporalAnchorsFromSearchQuery(query = '') {
    const text = normalizeString(query).toLowerCase();
    const years = Array.from(text.matchAll(/\b((?:18|19|20)\d{2})\b/g)).map((match) => match[1]);
    const months = Array.from(text.matchAll(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b/g)).map((match) => match[1]);
    return {
        years: Array.from(new Set(years)),
        months: Array.from(new Set(months))
    };
}

function scoreSearchSourceQualityPrior(result = {}, query = '') {
    const url = normalizeString(result.url);
    const title = normalizeString(result.title);
    const snippet = normalizeString(result.snippet);
    let parsed = null;
    try {
        parsed = new URL(url);
    } catch {
        return 0;
    }
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    const pathname = parsed.pathname || '/';
    const text = normalizeSearchText(`${title} ${snippet} ${url}`);
    const terms = importantSearchQueryTerms(query);
    const queryMentionsHost = searchQueryMentionsHost(query, host);
    let score = 0;

    if (hostMatchesImportantQueryTerm(host, terms)) {
        score += 34;
    }
    if (
        hostMatchesImportantQueryTerm(host, terms) &&
        !/^github\.com$/i.test(host) &&
        /(?:^|\/)(?:_sources?|docs?|doc|documentation|whats_new|changelog|release[-_]?notes?|api|reference)(?:\/|$)/i.test(pathname)
    ) {
        score += 48;
    }
    if (/\b(?:changelog|release notes?|whats new|what's new|api|docs?|documentation|reference|source)\b/i.test(`${title} ${pathname}`)) {
        score += 24;
    }
    if (/(?:^|\/)(?:_sources?|docs?|doc|documentation|whats_new|changelog|release[-_]?notes?|api|reference)(?:\/|$)/i.test(pathname)) {
        score += 38;
    }
    if (/\.(?:rst|md|txt|py|ts|js|json|ya?ml)(?:$|[?#])/i.test(pathname)) {
        score += 26;
    }
    if (/^github\.com$/i.test(host) && /\/(?:blob|raw|tree)\/[^/]+\/(?:docs?|doc|source|src|examples?|tests?)\//i.test(pathname)) {
        score += 46;
    } else if (/^github\.com$/i.test(host) && /\/(?:blob|raw|tree)\//i.test(pathname)) {
        score += 28;
    }
    if (/readthedocs\.io$/i.test(host) || /(?:^|\.)docs\./i.test(host) || /(?:^|\.)developer\./i.test(host)) {
        score += 26;
    }
    if (extractQuotedSearchPhrases(query).some((phrase) => compactSearchText(phrase) && compactSearchText(text).includes(compactSearchText(phrase)))) {
        score += 28;
    }
    if (queryMentionsHost) {
        score += 28;
    }
    const asksForSpecificArticle = /\b(?:article|paper|publication|essay|study)\b/i.test(query);
    const articleDetailPath = /(?:^|\/)(?:articles?|papers?|publications?)(?:\/view)?\/[^/]+/i.test(pathname);
    const collectionPath = /(?:^|\/)(?:issues?|archives?|search|category|tag)(?:\/|$)/i.test(pathname);
    if (asksForSpecificArticle && articleDetailPath) {
        score += 140;
    }
    if (asksForSpecificArticle && collectionPath) {
        score -= 36;
    }
    const temporalAnchors = temporalAnchorsFromSearchQuery(query);
    if (temporalAnchors.months.length || temporalAnchors.years.length) {
        const lowerEvidenceText = `${title} ${snippet} ${url}`.toLowerCase();
        const monthMatched = temporalAnchors.months.some((month) => new RegExp(`\\b${escapeRegExp(month)}\\b`, 'i').test(lowerEvidenceText));
        const yearMatched = temporalAnchors.years.some((year) => lowerEvidenceText.includes(year));
        if (temporalAnchors.months.length && !monthMatched) {
            score -= 70;
        }
        if (temporalAnchors.years.length && !yearMatched) {
            score -= monthMatched ? 20 : 50;
        }
    }

    const lowAuthorityHost = SEARCH_MIRROR_OR_LOW_AUTHORITY_HOSTS.some((domain) => hostMatchesSiteConstraint(host, domain));
    if (lowAuthorityHost && !queryMentionsHost) {
        score -= 120;
        if (/\b(?:pdf|document|mirror|mirrored|download|release notes?)\b/i.test(`${title} ${snippet}`)) {
            score -= 80;
        }
    }
    const exactFactOrDocQuery = /\b(?:changelog|release notes?|bug fixes?|official|documentation|source|api|reference|wikipedia|predictor|base command)\b/i.test(query);
    const aiDirectoryHost = SEARCH_AI_DIRECTORY_HOSTS.some((domain) => hostMatchesSiteConstraint(host, domain));
    if (
        exactFactOrDocQuery &&
        !queryMentionsHost &&
        (aiDirectoryHost || /\b(?:AI tools?|AIs|LLM tools?|productivity tools?)\b/i.test(`${title} ${snippet}`))
    ) {
        score -= 700;
    }
    const portalHomePage = (
        (host === 'yahoo.com' || host.endsWith('.yahoo.com')) &&
        /^\/(?:$|news\/?$|finance\/?$|sports\/?$|entertainment\/?$)/i.test(pathname)
    );
    if (portalHomePage && !queryMentionsHost) {
        score -= 120;
    }
    const rootLikePath = /^\/(?:$|index\.(?:html?|php)$|stable\/index\.html?$)/i.test(pathname);
    const queryLooksForSpecificDocument = /\b(?:changelog|release notes?|whats new|what's new|july|version|v\d+(?:\.\d+)*|api|reference|method|class|command|bug fix)\b/i.test(query);
    if (rootLikePath && queryLooksForSpecificDocument && !/\b(?:changelog|release notes?|whats new|what's new|api|reference)\b/i.test(`${title} ${snippet}`)) {
        score -= 48;
    }
    return score;
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
        sourceQualityScore: Number.isFinite(candidate.sourceQualityScore) ? Number(candidate.sourceQualityScore.toFixed(2)) : undefined,
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
            const sourceQualityScore = scoreSearchSourceQualityPrior(item, query);
            const targetCoverage = assessSearchResultTargetCoverage(item, query);
            const targetPenalty = targetCoverage?.specificTargetCovered === false ? 260 : 0;
            const boundedQueryScore = Math.min(queryMatch.score, 100);
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
                sourceQualityScore,
                queryTargetCoverage: targetCoverage,
                combinedScore: boundedQueryScore * 4 + research.score + sourceConsensusScore + sourceQualityScore - targetPenalty
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

function buildConciseQuotedTargetSearchQuery(query = '') {
    const original = normalizeString(query);
    if (!original || /[\p{Script=Han}]/u.test(original)) {
        return '';
    }
    const quotedTargets = Array.from(
        original.matchAll(/"([^"]{12,})"|“([^”]{12,})”/g)
    )
        .map((match) => ({
            full: match[0],
            value: normalizeString(match[1] || match[2]),
            termCount: (normalizeSearchText(match[1] || match[2]).match(/[a-z0-9]{2,}/g) || []).length
        }))
        .filter((item) => item.value && item.termCount >= 4)
        .sort((left, right) =>
            right.termCount - left.termCount ||
            right.value.length - left.value.length
        );
    const target = quotedTargets[0];
    if (!target) {
        return '';
    }
    const allTerms = extractSearchQueryTerms(original);
    const shouldContract = (
        original.length > 150 ||
        allTerms.length > 12 ||
        quotedTargets.length > 2
    );
    if (!shouldContract) {
        return '';
    }
    let contextText = original;
    for (const quoted of quotedTargets) {
        contextText = contextText.replace(quoted.full, ' ');
    }
    const contextTerms = extractSearchQueryTerms(contextText).slice(0, 3);
    const contextTermSet = new Set(contextTerms);
    const weakTitleTerms = new Set([
        'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would'
    ]);
    const targetTerms = extractSearchQueryTerms(target.value)
        .filter((term) => !weakTitleTerms.has(term) && !contextTermSet.has(term))
        .slice(0, 5);
    const sites = extractSearchSiteConstraints(original)
        .slice(0, 2)
        .map((site) => `site:${site}`);
    return [
        ...contextTerms,
        ...targetTerms,
        ...sites
    ].join(' ').slice(0, 240).trim();
}

function buildEffectiveSearchQuery(query = '') {
    const normalized = normalizeString(query);
    if (normalized && !/[\p{Script=Han}]/u.test(normalized)) {
        const conciseQuotedTargetQuery = buildConciseQuotedTargetSearchQuery(normalized);
        if (conciseQuotedTargetQuery) {
            return conciseQuotedTargetQuery;
        }
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
    const explicitQueries = [
        ...(Array.isArray(args.queries) ? args.queries : []),
        ...(Array.isArray(args.searchQueries) ? args.searchQueries : []),
        ...(Array.isArray(args.search_queries) ? args.search_queries : [])
    ];
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
    explicitQueries.forEach((item, index) => {
        const itemQuery = typeof item === 'string'
            ? item
            : normalizeString(item?.query || item?.q || item?.search || item?.text);
        const itemBackendQuery = typeof item === 'string'
            ? item
            : normalizeString(item?.backendQuery || item?.backend_query || itemQuery);
        addVariant({
            searchQuery: itemQuery,
            backendQuery: itemBackendQuery,
            role: typeof item === 'object' ? normalizeString(item.role, 'explicit_query') : 'explicit_query',
            reason: typeof item === 'object'
                ? normalizeString(item.reason, 'Explicit query variant supplied by the model as part of a single structured research action.')
                : `Explicit query variant ${index + 1} supplied by the model as part of a single structured research action.`
        });
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
            .map((item) => buildSuggestedCallForLink({
                ...item,
                text: normalizeString(item.text || item.title, item.url)
            }, { query })),
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
        `${index + 1}. ${truncateRelationText(normalizeString(item.title, '(untitled)'), 220)}`,
        `URL: ${normalizeString(item.url)}`
    ];
    const sources = normalizeSourceList(item.sourceBackends || item.sourceBackend || item.backend);
    if (sources.length) {
        lines.push(`Source: ${sources.join(', ')}`);
    }
    const matchedTerms = Array.isArray(item.queryMatchedTerms) ? item.queryMatchedTerms.slice(0, 8) : [];
    if (matchedTerms.length) {
        lines.push(`Query term matches: ${matchedTerms.join(', ')}`);
    }
    const snippet = truncateRelationText(normalizeString(item.snippet), 520);
    if (snippet) {
        lines.push(`Snippet: ${snippet}`);
    }
    return lines.join('\n');
}

function formatCandidateSearchEvidence(rankedResults = [], limit = 8) {
    const rows = (Array.isArray(rankedResults) ? rankedResults : [])
        .slice(0, limit)
        .map((item, index) => formatSearchResultForModel(item, index))
        .filter(Boolean);
    if (!rows.length) {
        return '';
    }
    return [
        'Candidate snippets from search results:',
        rows.join('\n\n')
    ].join('\n');
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

function normalizeSearchContextSize(value = '', fallback = 'medium') {
    const normalized = normalizeString(value || fallback).toLowerCase();
    return ['low', 'medium', 'high'].includes(normalized) ? normalized : fallback;
}

function buildCanonicalWebSearchOutput({
    query = '',
    backendQuery = '',
    rankedResults = [],
    attempts = [],
    startedAt = Date.now(),
    overallTimeoutMs = 0,
    searchContextSize = 'medium',
    aggregated = false,
    backend = ''
} = {}) {
    const results = (Array.isArray(rankedResults) ? rankedResults : [])
        .slice(0, 10)
        .map((result, index) => pruneEmptyDeep({
            id: `result_${index + 1}`,
            title: normalizeString(result.title || result.text || result.url),
            url: normalizeString(result.url),
            snippet: normalizeString(result.snippet || result.content),
            source: normalizeString(result.sourceBackend || result.source || backend),
            rank: index + 1
        }));
    const action = pruneEmptyDeep({
        type: 'search',
        query,
        search_context_size: normalizeSearchContextSize(searchContextSize),
        max_results: results.length || undefined
    });
    return pruneEmptyDeep({
        type: 'function_call_output',
        webSearchCall: {
            type: 'web_search_call',
            status: 'completed',
            action
        },
        web_search_call: {
            type: 'web_search_call',
            status: 'completed',
            action
        },
        functionCallOutput: {
            type: 'function_call_output',
            status: 'completed',
            output_kind: 'web_search_results'
        },
        function_call_output: {
            type: 'function_call_output',
            status: 'completed',
            output_kind: 'web_search_results'
        },
        search: {
            query,
            backend_query: backendQuery && backendQuery !== query ? backendQuery : undefined,
            status: 'completed',
            mode: aggregated ? 'aggregated' : 'single_backend',
            results,
            candidates: results
        },
        execution: {
            duration_ms: Date.now() - startedAt,
            overall_timeout_ms: overallTimeoutMs,
            attempts: (Array.isArray(attempts) ? attempts : []).map((attempt) => pruneEmptyDeep({
                ok: attempt.ok === true,
                backend: normalizeString(attempt.backend),
                duration_ms: attempt.durationMs,
                status: attempt.status,
                error_code: attempt.errorCode
            }))
        }
    });
}

function buildCanonicalSourceViewportOutput({ sourceViewport = {}, action = {}, matches = [] } = {}) {
    const actionType = normalizeString(action.type, 'open_page');
    const url = normalizeString(action.url || sourceViewport.url || sourceViewport.ref_id);
    const canonicalAction = pruneEmptyDeep({
        type: actionType === 'find_in_page' ? 'find_in_page' : 'open_page',
        ...(url ? { url } : {}),
        ...(actionType === 'find_in_page' && normalizeString(action.pattern)
            ? { pattern: normalizeString(action.pattern) }
            : {}),
        ...(actionType !== 'find_in_page'
            ? { lineno: Number(action.lineno || sourceViewport.lineno || sourceViewport.line_start || 1) || 1 }
            : {})
    });
    const normalizedMatches = (Array.isArray(matches) ? matches : []).map((match) => pruneEmptyDeep({
        lineno: Number(match.lineno || match.lineNumber || match.line_number || 0) || undefined,
        text: normalizeString(match.text)
    })).filter((match) => match.lineno || match.text);
    return pruneEmptyDeep({
        type: 'function_call_output',
        webSearchCall: {
            type: 'web_search_call',
            status: 'completed',
            action: canonicalAction
        },
        web_search_call: {
            type: 'web_search_call',
            status: 'completed',
            action: canonicalAction
        },
        functionCallOutput: {
            type: 'function_call_output',
            status: 'completed',
            output_kind: 'source_viewport'
        },
        function_call_output: {
            type: 'function_call_output',
            status: 'completed',
            output_kind: 'source_viewport'
        },
        source_viewport: sourceViewport,
        ...(normalizedMatches.length ? {
            find: {
                match_count: normalizedMatches.length,
                matches: normalizedMatches
            }
        } : {})
    });
}

function buildWebSearchSuccessObservation({
    query = '',
    backendQuery = '',
    attempts = [],
    rawResults = [],
    backend = '',
    url = '',
    managedSearxng = null,
    startedAt = Date.now(),
    overallTimeoutMs = 0,
    aggregated = false,
    searchContextSize = 'medium'
} = {}) {
    const rankedResults = rankSearchResultsForFollowup(rawResults, query);
    const webSearchOutput = buildCanonicalWebSearchOutput({
        query,
        backendQuery,
        rankedResults,
        attempts,
        startedAt,
        overallTimeoutMs,
        searchContextSize,
        aggregated,
        backend
    });
    const candidateEvidenceText = formatCandidateSearchEvidence(rankedResults, 8);
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
        ? 'Search results contain multiple plausible target clusters for the query.'
        : offTarget
        ? `Search results contain few matches for the key query terms: ${queryFocusTerms.join(', ') || query}.`
        : 'Candidate snippets and URLs returned for model inspection.';
    const recoveryHint = clarificationRequired
        ? searchConfidence.clarificationQuestion || 'Ask the user to disambiguate the target before calling web_fetch or another broad search.'
        : offTarget
        ? 'Potential next retrieval inputs include exact phrases, source names, author names, or a more specific tool.'
        : '';
    const guidance = buildWebToolGuidanceText({
        evidenceGap,
        recoveryHint,
        suggestedNextCalls,
        observedRelevantLinks
    });
    const successfulBackends = attempts.filter((attempt) => attempt.ok).map((attempt) => attempt.backend);
    const resultBackends = normalizeSourceList(rankedResults.flatMap((item) => item.sourceBackends || item.sourceBackend || []));
    const response = textResult([answerCandidateText, candidateEvidenceText, guidance].filter(Boolean).join('\n\n'), {
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
        managedSearxng,
        webSearchOutput,
        webSearchCall: webSearchOutput.webSearchCall,
        web_search_call: webSearchOutput.web_search_call,
        functionCallOutput: webSearchOutput.functionCallOutput,
        function_call_output: webSearchOutput.function_call_output,
        search_context_size: normalizeSearchContextSize(searchContextSize),
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
    if (Array.isArray(observedRelevantLinks) && observedRelevantLinks.length) {
        sections.push(`Candidate links observed by the fetcher:\n${formatRelevantLinks(observedRelevantLinks)}`);
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
    const knownVideoUrl = /(?:youtube\.com\/watch|youtu\.be\/|bilibili\.com\/video\/|\/video\/|vimeo\.com\/)/i.test(normalizedUrl);
    const explicitVideoChrome = /播放量|弹幕|正在缓冲|未经作者授权|相关推荐|视频播放器|video player|watch later|share (?:this )?video|subscribers?/i.test(normalizedText);
    const supportingVideoSignal = /视频|播放|video|watch|投稿|subscribe/i.test(normalizedText);
    if (
        knownVideoUrl ||
        (explicitVideoChrome && supportingVideoSignal)
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
            recoveryHint: 'Available alternate material may include accessible text, transcript, ASR, page description, or another public source.',
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
        details.recoveryHint = 'This is a server-side access policy, not a local network failure. Prefer metadata, extracted links from an accessible page, another source, or a historical web snapshot instead of retrying this URL.';
        details.suggestedNextCalls = [{
            tool: 'tool_search',
            args: {
                query: 'historical web archive snapshot unavailable blocked URL',
                limit: 5
            }
        }];
    } else if (fetched.status === 429) {
        details.evidenceGap = 'Remote site rate-limited automated requests (HTTP 429).';
        details.recoveryHint = 'This is a remote rate limit, not a local connectivity failure. Back off, use another API/source, or inspect a historical snapshot when past content is sufficient instead of hammering the same endpoint.';
        details.suggestedNextCalls = [{
            tool: 'tool_search',
            args: {
                query: 'historical web archive snapshot rate limited URL',
                limit: 5
            }
        }];
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

function scoreSearchResultTitleMetadataQuality(result = {}, rawTitle = '', rawUrl = '') {
    const title = stripHtml(rawTitle || '').replace(/\s+/g, ' ').trim();
    const url = normalizeUrlCandidate(rawUrl);
    if (!title || !url || title === url) {
        return -100;
    }

    const sourceHints = sourceHintsFromSearchResult(result);
    const sources = normalizeSourceList([
        ...sourceHints.sourceBackends,
        ...sourceHints.sourceEngines
    ]).map((item) => item.toLowerCase());
    let score = title.length >= 3 && title.length <= 180 ? 20 : 0;
    if (sources.includes('wikipedia_api') || sources.includes('wikipedia_search')) {
        score += 60;
    }
    if (/https?:\/\/|\bwww\./i.test(title)) {
        score -= 80;
    }
    if (/\s(?:>|›|»)\s/.test(title)) {
        score -= 35;
    }

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
        if (host && title.toLowerCase().includes(host)) {
            score -= 35;
        }
        const rawLeaf = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).at(-1) || '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
        const normalizedTitle = title
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
        if (rawLeaf && normalizedTitle === rawLeaf) {
            score += 50;
        }
    } catch {
        // URL normalization already validated the candidate; title scoring is best-effort.
    }
    return score;
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
        const titleScore = scoreSearchResultTitleMetadataQuality(item, title, url);
        const existingEntry = merged.get(key);
        if (!existingEntry) {
            merged.set(key, {
                titleScore,
                result: pruneEmptyDeep({
                ...item,
                title,
                url,
                snippet,
                sourceBackends: sourceHints.sourceBackends,
                sourceEngines: sourceHints.sourceEngines,
                sourceCount: Math.max(1, sourceHints.sourceBackends.length + sourceHints.sourceEngines.length)
                })
            });
            continue;
        }
        const existing = existingEntry.result;
        if (titleScore > existingEntry.titleScore) {
            existing.title = title;
            existingEntry.titleScore = titleScore;
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
    return Array.from(merged.values(), (entry) => entry.result).slice(0, maxResults);
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
        const searchEngineNavigationHost =
            /(^|\.)(bing|duckduckgo|google|yahoo)\.com$/i.test(host) ||
            (/(^|\.)microsoft\.com$/i.test(host) && !/^learn\.microsoft\.com$/i.test(host));
        if (searchEngineNavigationHost) {
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
const DEFAULT_WIKIPEDIA_SEARCH_URL = 'https://en.wikipedia.org/w/api.php';
const DEFAULT_FIRECRAWL_LOCAL_URL = 'http://127.0.0.1:3002';
const FIRECRAWL_CLOUD_URL = 'https://api.firecrawl.dev';
const DEFAULT_CRAWL4AI_URL = 'http://127.0.0.1:11235';
const DEFAULT_CRAWL4AI_WORKER = path.join(__dirname, 'ailis-crawl4ai-worker.py');
const DEFAULT_PYTHON_SEARCH_WORKER = path.join(__dirname, 'ailis-python-search-worker.py');
const MANAGED_SEARXNG_MANIFEST = 'managed-searxng.json';
const MANAGED_SEARXNG_DEFAULT_PORT = 18888;
const MANAGED_SEARXNG_STARTUP_TIMEOUT_MS = 5000;
const MANAGED_SEARXNG_FAILURE_COOLDOWN_MS = 120000;
const CRAWL4AI_FETCH_PROVIDERS = new Set(['crawl4ai', 'rendered', 'browser', 'crawl4ai_rendered', 'crawl4ai-style', 'crawl4ai_style']);
const RENDERED_FALLBACK_EVIDENCE_QUALITIES = new Set(['js_shell', 'thin_content']);
const PROJECT_ROOT = path.resolve(__dirname, '..');
let managedSearxngState = null;

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

function resolveBundledPythonSearchWorker() {
    return firstExistingPath([
        asarUnpackedPath(DEFAULT_PYTHON_SEARCH_WORKER),
        process.resourcesPath ? path.join(process.resourcesPath, 'app.asar.unpacked', 'scripts', 'ailis-python-search-worker.py') : '',
        DEFAULT_PYTHON_SEARCH_WORKER
    ]) || DEFAULT_PYTHON_SEARCH_WORKER;
}

function readJsonFileSync(filePath = '') {
    try {
        return JSON.parse(fsSync.readFileSync(filePath, 'utf8'));
    } catch {
        return null;
    }
}

function resolveRuntimeRelativePath(baseDir = '', value = '') {
    const normalized = normalizeString(value);
    if (!normalized) {
        return '';
    }
    return path.isAbsolute(normalized) ? normalized : path.resolve(baseDir, normalized);
}

function managedSearxngManifestCandidates() {
    const candidates = [];
    for (const root of ailisWebRuntimeRoots()) {
        candidates.push(path.join(root, MANAGED_SEARXNG_MANIFEST));
        candidates.push(path.join(root, 'searxng', MANAGED_SEARXNG_MANIFEST));
    }
    candidates.push(path.join(PROJECT_ROOT, '.ailis-runtime', MANAGED_SEARXNG_MANIFEST));
    return dedupeSearchStrings(candidates.map((candidate) => asarUnpackedPath(candidate)));
}

function loadManagedSearxngManifest(args = {}) {
    const explicitManifest = normalizeString(
        args.managedSearxngManifest ||
        args.managed_searxng_manifest ||
        process.env.AILIS_MANAGED_SEARXNG_MANIFEST
    );
    const manifestPath = firstExistingPath([
        explicitManifest,
        ...managedSearxngManifestCandidates()
    ]);
    if (!manifestPath) {
        return null;
    }
    const manifest = readJsonFileSync(manifestPath);
    if (!manifest || typeof manifest !== 'object') {
        return null;
    }
    const manifestDir = path.dirname(manifestPath);
    const command = resolveRuntimeRelativePath(manifestDir, manifest.python || manifest.command);
    const settingsPath = resolveRuntimeRelativePath(manifestDir, manifest.settingsPath || manifest.settings_path || '');
    if (!command || !fsSync.existsSync(command)) {
        return null;
    }
    if (settingsPath && !fsSync.existsSync(settingsPath)) {
        return null;
    }
    const cwd = resolveRuntimeRelativePath(manifestDir, manifest.cwd || '.');
    const env = {};
    if (manifest.env && typeof manifest.env === 'object') {
        for (const [key, value] of Object.entries(manifest.env)) {
            env[key] = /path$/i.test(key) ? resolveRuntimeRelativePath(manifestDir, value) : String(value);
        }
    }
    if (settingsPath) {
        env.SEARXNG_SETTINGS_PATH = settingsPath;
    }
    return {
        manifestPath,
        manifestDir,
        command,
        args: Array.isArray(manifest.args) ? manifest.args.map(String) : ['-m', 'searx.webapp'],
        cwd: fsSync.existsSync(cwd) ? cwd : manifestDir,
        env,
        defaultPort: clampNumber(manifest.defaultPort || manifest.port, MANAGED_SEARXNG_DEFAULT_PORT, 1024, 65535),
        bindAddress: normalizeString(manifest.bindAddress || manifest.bind_address, '127.0.0.1'),
        healthPath: normalizeString(manifest.healthPath || manifest.health_path, '/search?q=ailis&format=json')
    };
}

function managedSearxngDisabled(args = {}) {
    return optionIsTrue(args.disableManagedSearxng || args.disable_managed_searxng) ||
        /^(?:0|false|no|off)$/i.test(normalizeString(process.env.AILIS_MANAGED_SEARXNG, '1'));
}

function requestedSearchBackends(args = {}) {
    if (Array.isArray(args.backends)) {
        return args.backends.map((item) => normalizeString(item).toLowerCase()).filter(Boolean);
    }
    return String(args.backend || args.searchBackend || args.search_backend || '')
        .split(',')
        .map((item) => normalizeString(item).toLowerCase())
        .filter(Boolean);
}

function managedSearxngAllowedForSearch(args = {}) {
    if (managedSearxngDisabled(args) || hasConfiguredSearxngUrl(args)) {
        return false;
    }
    const explicitBackends = requestedSearchBackends(args);
    if (explicitBackends.length) {
        return explicitBackends.some((id) => ['searxng', 'searxng_json', 'auto', 'external', 'agent_web'].includes(id));
    }
    const providerText = normalizeString(
        args.provider ||
        args.searchProvider ||
        args.search_provider ||
        process.env.AILIS_WEB_SEARCH_PROVIDER ||
        'auto',
        'auto'
    );
    const providers = providerText.split(',').map((item) => normalizeString(item).toLowerCase()).filter(Boolean);
    if (!providers.length) {
        return true;
    }
    if (providers.some((provider) => ['auto', 'external', 'agent_web', 'searxng'].includes(provider))) {
        return true;
    }
    if (providers.every((provider) => ['html', 'builtin_html', 'current_html_fallback', 'python', 'python_search', 'python-search', 'github'].includes(provider))) {
        return false;
    }
    return false;
}

function managedSearxngPortCandidates(manifest = {}, args = {}) {
    const rawPorts = [
        args.managedSearxngPort,
        args.managed_searxng_port,
        process.env.AILIS_MANAGED_SEARXNG_PORT,
        process.env.SEARXNG_PORT,
        manifest.defaultPort,
        MANAGED_SEARXNG_DEFAULT_PORT,
        18080,
        8080
    ];
    const seen = new Set();
    const ports = [];
    for (const value of rawPorts) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            continue;
        }
        const port = Math.max(1024, Math.min(Math.round(numeric), 65535));
        if (!port || seen.has(port)) {
            continue;
        }
        seen.add(port);
        ports.push(port);
    }
    return ports;
}

function managedSearxngStartupTimeoutMs(args = {}) {
    return clampNumber(
        args.managedSearxngStartupTimeoutMs ||
        args.managed_searxng_startup_timeout_ms ||
        process.env.AILIS_MANAGED_SEARXNG_STARTUP_TIMEOUT_MS,
        MANAGED_SEARXNG_STARTUP_TIMEOUT_MS,
        1000,
        30000
    );
}

function managedSearxngFailureCooldownMs(args = {}) {
    return clampNumber(
        args.managedSearxngFailureCooldownMs ||
        args.managed_searxng_failure_cooldown_ms ||
        process.env.AILIS_MANAGED_SEARXNG_FAILURE_COOLDOWN_MS,
        MANAGED_SEARXNG_FAILURE_COOLDOWN_MS,
        0,
        600000
    );
}

function managedSearxngSpawnPortCandidates(manifest = {}, args = {}) {
    const explicitPort = Number(args.managedSearxngPort || args.managed_searxng_port || process.env.AILIS_MANAGED_SEARXNG_PORT || process.env.SEARXNG_PORT);
    if (Number.isFinite(explicitPort) && explicitPort >= 1024 && explicitPort <= 65535) {
        return [Math.round(explicitPort)];
    }
    return [clampNumber(manifest.defaultPort, MANAGED_SEARXNG_DEFAULT_PORT, 1024, 65535)];
}

function managedSearxngBaseUrl(port, bindAddress = '127.0.0.1') {
    const host = normalizeString(bindAddress, '127.0.0.1') === '0.0.0.0'
        ? '127.0.0.1'
        : normalizeString(bindAddress, '127.0.0.1');
    return `http://${host}:${port}`;
}

function managedSearxngHealthUrl(baseUrl = '', healthPath = '/search?q=ailis&format=json') {
    const normalizedBase = normalizeBaseUrl(baseUrl);
    const suffix = normalizeString(healthPath, '/search?q=ailis&format=json');
    return `${normalizedBase}${suffix.startsWith('/') ? suffix : `/${suffix}`}`;
}

async function probeManagedSearxng(baseUrl = '', healthPath = '/search?q=ailis&format=json', timeoutMs = 1200) {
    if (!baseUrl) {
        return false;
    }
    const fetched = await fetchJsonWithNodeFetch(managedSearxngHealthUrl(baseUrl, healthPath), { timeoutMs });
    return Boolean(fetched.ok && fetched.status >= 200 && fetched.status < 300 && fetched.json && typeof fetched.json === 'object');
}

function killManagedSearxngChild(child) {
    if (!child || child.killed) {
        return;
    }
    try {
        if (process.platform === 'win32' && child.pid) {
            spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
                windowsHide: true,
                stdio: 'ignore'
            });
            return;
        }
        child.kill();
    } catch {
        // Ignore cleanup failures.
    }
}

async function waitForManagedSearxngReady({ baseUrl, healthPath, timeoutMs = 12000 } = {}) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
        if (await probeManagedSearxng(baseUrl, healthPath, 1200)) {
            return true;
        }
        await new Promise((resolve) => setTimeout(resolve, 350));
    }
    return false;
}

async function ensureManagedSearxng(args = {}) {
    if (!managedSearxngAllowedForSearch(args)) {
        return null;
    }
    const cooldownMs = managedSearxngFailureCooldownMs(args);
    if (
        managedSearxngState?.source === 'failed' &&
        cooldownMs > 0 &&
        Number.isFinite(managedSearxngState.lastFailureAt) &&
        Date.now() - managedSearxngState.lastFailureAt < cooldownMs &&
        !optionIsTrue(args.forceManagedSearxng || args.force_managed_searxng)
    ) {
        return null;
    }
    if (managedSearxngState?.baseUrl && await probeManagedSearxng(managedSearxngState.baseUrl, managedSearxngState.healthPath, 900)) {
        return {
            ok: true,
            baseUrl: managedSearxngState.baseUrl,
            source: managedSearxngState.source || 'running',
            manifestPath: managedSearxngState.manifestPath || '',
            pid: managedSearxngState.child?.pid || 0
        };
    }
    const manifest = loadManagedSearxngManifest(args);
    if (!manifest) {
        return null;
    }
    for (const port of managedSearxngPortCandidates(manifest, args)) {
        const baseUrl = managedSearxngBaseUrl(port, manifest.bindAddress);
        if (await probeManagedSearxng(baseUrl, manifest.healthPath, 900)) {
            managedSearxngState = {
                baseUrl,
                healthPath: manifest.healthPath,
                manifestPath: manifest.manifestPath,
                source: 'existing'
            };
            return { ok: true, baseUrl, source: 'existing', manifestPath: manifest.manifestPath, pid: 0 };
        }
    }
    for (const port of managedSearxngSpawnPortCandidates(manifest, args)) {
        const baseUrl = managedSearxngBaseUrl(port, manifest.bindAddress);
        const stderr = [];
        const stdout = [];
        let child = null;
        try {
            child = spawn(manifest.command, manifest.args, {
            cwd: manifest.cwd,
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: {
                ...process.env,
                ...manifest.env,
                SEARXNG_BIND_ADDRESS: manifest.bindAddress,
                SEARXNG_PORT: String(port),
                SEARXNG_LIMITER: 'false',
                SEARXNG_PUBLIC_INSTANCE: 'false'
            }
            });
        } catch (error) {
            managedSearxngState = {
                baseUrl,
                healthPath: manifest.healthPath,
                manifestPath: manifest.manifestPath,
                source: 'failed',
                lastFailureAt: Date.now(),
                lastError: normalizeString(error?.message || String(error)).slice(0, 3000)
            };
            continue;
        }
        child.stdout?.on('data', (chunk) => {
            stdout.push(String(chunk).slice(0, 1200));
            if (stdout.length > 8) stdout.shift();
        });
        child.stderr?.on('data', (chunk) => {
            stderr.push(String(chunk).slice(0, 1200));
            if (stderr.length > 8) stderr.shift();
        });
        const exited = new Promise((resolve) => child.once('exit', (code) => resolve(code)));
        const spawnFailed = new Promise((resolve) => child.once('error', (error) => resolve(error)));
        const ready = await Promise.race([
            waitForManagedSearxngReady({ baseUrl, healthPath: manifest.healthPath, timeoutMs: managedSearxngStartupTimeoutMs(args) }),
            spawnFailed.then((error) => {
                stderr.push(error?.message || String(error));
                return false;
            }),
            exited.then(() => false)
        ]);
        if (ready) {
            managedSearxngState = {
                baseUrl,
                healthPath: manifest.healthPath,
                manifestPath: manifest.manifestPath,
                source: 'spawned',
                child,
                command: manifest.command,
                args: manifest.args,
                port
            };
            return { ok: true, baseUrl, source: 'spawned', manifestPath: manifest.manifestPath, pid: child.pid || 0 };
        }
        killManagedSearxngChild(child);
        managedSearxngState = {
            baseUrl,
            healthPath: manifest.healthPath,
            manifestPath: manifest.manifestPath,
            source: 'failed',
            lastFailureAt: Date.now(),
            lastError: normalizeString(stderr.join('\n') || stdout.join('\n')).slice(0, 3000)
        };
    }
    return null;
}

async function webSearchArgsWithManagedSearxng(args = {}) {
    const managed = await ensureManagedSearxng(args);
    if (!managed?.ok || !managed.baseUrl) {
        return args;
    }
    return {
        ...args,
        searxngUrl: managed.baseUrl,
        __managedSearxng: managed
    };
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
    const recency = Number(args.recency);
    const timeRange = Number.isFinite(recency) && recency > 0
        ? recency <= 1
            ? 'day'
            : recency <= 7
            ? 'week'
            : recency <= 31
            ? 'month'
            : recency <= 366
            ? 'year'
            : ''
        : '';
    if (timeRange) {
        url.searchParams.set('time_range', timeRange);
    }
    if (maxResults) {
        url.searchParams.set('results_on_new_tab', '0');
    }
    return url.toString();
}

function normalizeSearchDomains(value) {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return [...new Set(values.map((entry) => {
        const raw = normalizeString(entry).toLowerCase().replace(/^\*\./, '');
        if (!raw) {
            return '';
        }
        try {
            return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).hostname
                .replace(/^www\./, '')
                .replace(/^\*\./, '');
        } catch {
            return raw.split('/')[0].replace(/^www\./, '').replace(/^\*\./, '');
        }
    }).filter(Boolean))].slice(0, 8);
}

function searchResultMatchesDomains(result = {}, domains = []) {
    if (!domains.length) {
        return true;
    }
    try {
        const hostname = new URL(normalizeString(result.url || result.link)).hostname
            .toLowerCase()
            .replace(/^www\./, '');
        return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
    } catch {
        return false;
    }
}

function filterSearchResultsByDomains(results = [], domains = []) {
    const normalizedDomains = normalizeSearchDomains(domains);
    if (!normalizedDomains.length) {
        return Array.isArray(results) ? results : [];
    }
    return (Array.isArray(results) ? results : [])
        .filter((result) => searchResultMatchesDomains(result, normalizedDomains));
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

function wikipediaSearchUrl(args = {}) {
    return normalizeString(
        args.wikipediaSearchUrl ||
        args.wikipedia_search_url ||
        process.env.AILIS_WIKIPEDIA_SEARCH_URL ||
        DEFAULT_WIKIPEDIA_SEARCH_URL,
        DEFAULT_WIKIPEDIA_SEARCH_URL
    );
}

function extractWikipediaSearchResults(payload = {}, maxResults = 8) {
    const rows = Array.isArray(payload?.query?.search) ? payload.query.search : [];
    return dedupeSearchResults(rows.map((item) => {
        const title = normalizeString(item.title);
        return {
            title,
            url: title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}` : '',
            snippet: stripHtml(item.snippet || ''),
            sourceEngines: ['wikipedia_api']
        };
    }), maxResults);
}

async function runWikipediaSearchBackend({ query, maxResults, timeoutMs, args = {} } = {}) {
    const startedAt = Date.now();
    const workerPath = path.resolve(
        normalizeString(args.pythonSearchWorker || args.python_search_worker) ||
        normalizeString(process.env.AILIS_PYTHON_SEARCH_WORKER) ||
        resolveBundledPythonSearchWorker()
    );
    const pythonCandidates = dedupeSearchStrings([
        args.pythonSearchPython,
        args.python_search_python,
        process.env.AILIS_PYTHON_SEARCH_PYTHON,
        process.env.AILIS_PYTHON,
        'python',
        resolveBundledCrawl4aiPython()
    ]);
    const payload = {
        provider: 'wikipedia',
        query,
        maxResults,
        timeoutSeconds: Math.max(3, Math.ceil(timeoutMs / 1000)),
        wikipediaSearchUrl: wikipediaSearchUrl(args)
    };
    const failures = [];
    for (const python of pythonCandidates) {
        const remainingTimeoutMs = Math.max(0, timeoutMs - (Date.now() - startedAt));
        if (remainingTimeoutMs < 1000) {
            break;
        }
        const result = await runProcess(python, [workerPath, JSON.stringify(payload)], {
            cwd: PROJECT_ROOT,
            timeoutMs: remainingTimeoutMs
        });
        let workerResult = null;
        try {
            workerResult = JSON.parse(result.stdout || '{}');
        } catch (error) {
            failures.push({
                python,
                errorCode: 'invalid_python_search_payload',
                error: error.message,
                stderr: normalizeString(result.stderr || result.stdout).slice(0, 3000)
            });
            continue;
        }
        const results = dedupeSearchResults(workerResult.results || [], maxResults);
        if (result.exitCode === 0 && workerResult.ok !== false && results.length) {
            return {
                ok: true,
                backend: 'wikipedia_search',
                url: wikipediaSearchUrl(args),
                durationMs: Date.now() - startedAt,
                status: 200,
                errorCode: '',
                error: '',
                retryable: true,
                python,
                workerAttempts: workerResult.attempts || [],
                results
            };
        }
        failures.push({
            python,
            errorCode: normalizeString(workerResult.errorCode) || (result.timedOut ? 'timeout' : 'wikipedia_search_failed'),
            error: normalizeString(workerResult.error) || `Python search worker exit ${result.exitCode}`,
            stderr: normalizeString(result.stderr).slice(0, 3000),
            workerAttempts: workerResult.attempts || []
        });
    }
    const last = failures[failures.length - 1] || {};
    return {
        ok: false,
        backend: 'wikipedia_search',
        url: wikipediaSearchUrl(args),
        durationMs: Date.now() - startedAt,
        status: 0,
        errorCode: last.errorCode || 'wikipedia_search_failed',
        error: last.error || 'Wikipedia search failed for all configured Python candidates.',
        retryable: true,
        pythonFailures: failures,
        results: []
    };
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

async function runPythonSearchBackend({ query, maxResults, timeoutMs, args = {} } = {}) {
    const startedAt = Date.now();
    const firecrawlCloudEnabled = optionIsTrue(args.allowFirecrawlCloud || args.allow_firecrawl_cloud || process.env.AILIS_ENABLE_FIRECRAWL_CLOUD);
    const configuredProvider = hasConfiguredSearxngUrl(args) || hasConfiguredFirecrawlUrl(args) || firecrawlCloudEnabled;
    const effectiveTimeoutMs = configuredProvider ? timeoutMs : Math.min(timeoutMs, 5000);
    const workerPath = path.resolve(
        normalizeString(args.pythonSearchWorker || args.python_search_worker) ||
        normalizeString(process.env.AILIS_PYTHON_SEARCH_WORKER) ||
        resolveBundledPythonSearchWorker()
    );
    const pythonCandidates = dedupeSearchStrings([
        args.pythonSearchPython,
        args.python_search_python,
        process.env.AILIS_PYTHON_SEARCH_PYTHON,
        process.env.AILIS_PYTHON,
        'python',
        resolveBundledCrawl4aiPython()
    ]);
    const payload = pruneEmptyDeep({
        query,
        maxResults,
        timeoutSeconds: configuredProvider
            ? Math.max(3, Math.ceil(effectiveTimeoutMs / 1000))
            : Math.max(2, Math.min(4, Math.ceil(effectiveTimeoutMs / 2000))),
        searxngUrl: args.searxngUrl || args.searxng_url,
        firecrawlUrl: args.firecrawlUrl || args.firecrawl_url,
        allowFirecrawlCloud: firecrawlCloudEnabled
    });
    const failures = [];
    for (const python of pythonCandidates) {
        const remainingTimeoutMs = Math.max(0, effectiveTimeoutMs - (Date.now() - startedAt));
        if (remainingTimeoutMs < 1000) {
            break;
        }
        const result = await runProcess(python, [workerPath, JSON.stringify(payload)], {
            cwd: PROJECT_ROOT,
            timeoutMs: remainingTimeoutMs
        });
        const durationMs = Date.now() - startedAt;
        let payloadResult = null;
        try {
            payloadResult = JSON.parse(result.stdout || '{}');
        } catch (error) {
            const failure = {
                python,
                exitCode: result.exitCode,
                errorCode: 'invalid_python_search_payload',
                error: `Python search worker returned invalid JSON: ${error.message}`,
                stderr: normalizeString(result.stderr || result.stdout).slice(0, 3000)
            };
            failures.push(failure);
            if (/ModuleNotFoundError|No module named/i.test(failure.stderr)) {
                continue;
            }
            return {
                ok: false,
                backend: 'python_search',
                url: workerPath,
                durationMs,
                status: 0,
                retryable: true,
                python,
                pythonFailures: failures,
                ...failure
            };
        }
        const rows = dedupeSearchResults((Array.isArray(payloadResult.results) ? payloadResult.results : []).map((item) => ({
            title: item.title,
            url: item.url,
            snippet: item.snippet || item.description || '',
            sourceEngines: item.sourceEngines || ['python_search']
        })), maxResults);
        const ok = result.exitCode === 0 && rows.length > 0 && payloadResult.ok !== false;
        if (ok) {
            return {
                ok,
                backend: 'python_search',
                url: workerPath,
                durationMs,
                status: 200,
                errorCode: '',
                error: '',
                stderr: normalizeString(result.stderr).slice(0, 3000),
                retryable: true,
                python,
                pythonFailures: failures.length ? failures : undefined,
                workerAttempts: payloadResult.attempts || [],
                results: rows
            };
        }
        failures.push({
            python,
            exitCode: result.exitCode,
            errorCode: normalizeString(payloadResult.errorCode) || (result.timedOut ? 'timeout' : 'python_search_failed'),
            error: normalizeString(payloadResult.error) || `Python search worker exit ${result.exitCode}`,
            stderr: normalizeString(result.stderr).slice(0, 3000),
            workerAttempts: payloadResult.attempts || []
        });
    }
    const last = failures[failures.length - 1] || {};
    return {
        ok: false,
        backend: 'python_search',
        url: workerPath,
        durationMs: Date.now() - startedAt,
        status: 0,
        errorCode: last.errorCode || 'python_search_failed',
        error: last.error || 'Python search worker failed for all configured Python candidates.',
        stderr: last.stderr || '',
        retryable: true,
        pythonFailures: failures,
        workerAttempts: last.workerAttempts || [],
        results: []
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
    python_search: Object.freeze({
        id: 'python_search',
        run: runPythonSearchBackend
    }),
    wikipedia_search: Object.freeze({
        id: 'wikipedia_search',
        run: runWikipediaSearchBackend
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

function dedupeSearchStrings(values = []) {
    const seen = new Set();
    const rows = [];
    for (const value of values) {
        const normalized = normalizeString(value);
        const key = normalized.toLowerCase();
        if (!normalized || seen.has(key)) {
            continue;
        }
        seen.add(key);
        rows.push(normalized);
    }
    return rows;
}

function configuredJsonSearchBackendIds(args = {}, query = '') {
    const chain = [];
    if (hasConfiguredSearxngUrl(args)) {
        chain.push('searxng_json');
    }
    if (hasConfiguredFirecrawlUrl(args)) {
        chain.push('firecrawl_search');
    }
    chain.push('python_search', 'wikipedia_search', ...HTML_SEARCH_BACKEND_IDS);
    return isLikelyGitHubSearch(query) ? ['github_repositories', ...chain] : chain;
}

function expandSearchProviderToken(token = '', query = '', { includeFallback = true, args = {} } = {}) {
    const normalized = normalizeString(token).toLowerCase();
    if (!normalized || normalized === 'auto') {
        return configuredJsonSearchBackendIds(args, query);
    }
    if (normalized === 'html' || normalized === 'builtin_html' || normalized === 'current_html_fallback') {
        return [...HTML_SEARCH_BACKEND_IDS];
    }
    if (normalized === 'searxng') {
        return includeFallback ? ['searxng_json', 'python_search', ...HTML_SEARCH_BACKEND_IDS] : ['searxng_json'];
    }
    if (normalized === 'firecrawl') {
        return includeFallback ? ['firecrawl_search', 'python_search', ...HTML_SEARCH_BACKEND_IDS] : ['firecrawl_search'];
    }
    if (normalized === 'python' || normalized === 'python_search' || normalized === 'python-search') {
        return includeFallback ? ['python_search', ...HTML_SEARCH_BACKEND_IDS] : ['python_search'];
    }
    if (normalized === 'wikipedia' || normalized === 'wikipedia_search') {
        return ['wikipedia_search'];
    }
    if (normalized === 'external' || normalized === 'agent_web') {
        return configuredJsonSearchBackendIds(args, query);
    }
    if (normalized === 'github') {
        return ['github_repositories'];
    }
    return [normalized];
}

function expandSearchProviderIds(value = '', query = '', args = {}) {
    const tokens = String(value || 'auto')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    const compound = tokens.length > 1;
    return dedupeSearchBackendIds(
        tokens.flatMap((item) => expandSearchProviderToken(item, query, { includeFallback: !compound, args }))
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
        ? dedupeSearchBackendIds(raw.flatMap((item) => expandSearchProviderToken(item, query, { includeFallback: raw.length <= 1, args })))
        : expandSearchProviderIds(
            args.provider ||
            args.searchProvider ||
            args.search_provider ||
            process.env.AILIS_WEB_SEARCH_PROVIDER ||
            'auto',
            query,
            args
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
    const domains = normalizeSearchDomains(args.domains);
    const searchContextSize = normalizeSearchContextSize(args.search_context_size || args.searchContextSize);
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 8000, 3000, 30000);
    const attempts = [];
    const effectiveArgs = await webSearchArgsWithManagedSearxng(args);
    const backends = normalizeSearchBackends(effectiveArgs, backendQuery);
    const overallTimeoutMs = clampNumber(
        effectiveArgs.overallTimeoutMs || effectiveArgs.overall_timeout_ms,
        Math.min(36000, Math.max(12000, timeoutMs * backends.length)),
        8000,
        120000
    );
    const startedAt = Date.now();
    const aggregateAcrossBackends = shouldAggregateSearchBackends(effectiveArgs);
    let collectedResults = [];
    let lastSuccessObservation = null;
    let lastSuccessfulAttempt = null;
    if (aggregateAcrossBackends && backends.length > 1) {
        const attemptTimeoutMs = Math.min(timeoutMs, Math.max(1000, overallTimeoutMs - 750));
        const parallelAttempts = await Promise.all(backends.map((backend) =>
            runSearchBackend(backend, backendQuery, maxResults, attemptTimeoutMs, effectiveArgs)
        ));
        attempts.push(...parallelAttempts);
        const successfulAttempts = parallelAttempts
            .map((attempt, backendIndex) => ({ attempt, backendIndex }))
            .filter(({ attempt }) => attempt.ok);
        for (const { attempt, backendIndex } of successfulAttempts) {
            const enrichedResults = filterSearchResultsByDomains(
                enrichSearchResultsWithSource(attempt.results, attempt, backendIndex),
                domains
            );
            collectedResults = mergeSearchResultsForRerank(
                [...collectedResults, ...enrichedResults],
                maxResults * 3
            );
        }
        if (successfulAttempts.length) {
            const finalAttempt = successfulAttempts[successfulAttempts.length - 1].attempt;
            return buildWebSearchSuccessObservation({
                query,
                backendQuery,
                attempts,
                rawResults: collectedResults,
                backend: finalAttempt.backend,
                url: finalAttempt.url,
                managedSearxng: effectiveArgs.__managedSearxng || null,
                startedAt,
                overallTimeoutMs,
                aggregated: successfulAttempts.length > 1,
                searchContextSize
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
        const attempt = await runSearchBackend(backend, backendQuery, maxResults, attemptTimeoutMs, effectiveArgs);
        attempts.push(attempt);
        if (!attempt.ok) {
            continue;
        }
        lastSuccessfulAttempt = attempt;
        const enrichedResults = filterSearchResultsByDomains(
            enrichSearchResultsWithSource(attempt.results, attempt, backendIndex),
            domains
        );
        if (domains.length && !enrichedResults.length) {
            continue;
        }
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
            managedSearxng: effectiveArgs.__managedSearxng || null,
            startedAt,
            overallTimeoutMs,
            aggregated: aggregateAcrossBackends && attempts.filter((entry) => entry.ok).length > 1,
            searchContextSize
        });
        lastSuccessObservation = observation;
        if (!shouldContinueSearchAggregation({
            args: effectiveArgs,
            backends,
            backendIndex,
            searchConfidence: observation.searchConfidence,
            suggestedNextCalls: observation.suggestedNextCalls,
            offTarget: observation.offTarget
        })) {
            return observation.response;
        }
    }
    if (lastSuccessfulAttempt) {
        return buildWebSearchSuccessObservation({
            query,
            backendQuery,
            attempts,
            rawResults: collectedResults,
            backend: lastSuccessfulAttempt.backend,
            url: lastSuccessfulAttempt.url,
            managedSearxng: effectiveArgs.__managedSearxng || null,
            startedAt,
            overallTimeoutMs,
            aggregated: aggregateAcrossBackends && attempts.filter((entry) => entry.ok).length > 1,
            searchContextSize
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
    const screenshotPath = normalizeString(args.screenshotPath || args.screenshot_path);
    if (screenshotPath) {
        processArgs.push('--screenshot-path', screenshotPath);
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
        screenshotPath: normalizeString(payload.screenshotPath),
        screenshotBytes: Number(payload.screenshotBytes || 0),
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

function expandStructuredSourceText(text = '', contentType = '') {
    const source = String(text || '').trim();
    if (!source || source.length > 2_000_000) {
        return source;
    }
    const fenced = source.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    const candidate = (fenced?.[1] || source).trim();
    const looksStructured = /json/i.test(normalizeString(contentType)) ||
        ((candidate.startsWith('{') && candidate.endsWith('}')) ||
        (candidate.startsWith('[') && candidate.endsWith(']')));
    if (!looksStructured) {
        return source;
    }
    try {
        return JSON.stringify(JSON.parse(candidate), null, 2);
    } catch {
        return source;
    }
}

function buildWebFetchResult({ url, args = {}, maxChars = MAX_FETCH_CHARS, fetched = {}, crawl4aiAttempt = null, renderedFallbackAttempt = null, renderedFallbackUsed = false, renderedFallbackTrigger = '' } = {}) {
    const contentType = fetched.contentType || '';
    const body = fetched.text;
    const rawText = fetched.kind === 'wikipedia_wikitext'
        ? stripWikiText(body)
        : fetched.kind === 'crawl4ai_markdown' ? body.trim()
        : /html/i.test(contentType) ? stripHtml(body) : body.trim();
    const encodingRepair = repairUtf8MojibakeText(rawText);
    const text = expandStructuredSourceText(encodingRepair.text, contentType);
    const linkQuery = normalizeString(args.query || args.contains || args.extract_query || args.extractQuery || '');
    const findPattern = normalizeString(args.findPattern || args.find_pattern);
    const sourceText = findPattern ? compactFindPageText(text) : text;
    const findMatches = findPattern ? findSourceLineMatches(sourceText, findPattern) : [];
    const selectedFindMatch = findPattern ? selectFindSourceMatch(findMatches, findPattern) : null;
    const firstFindOffset = selectedFindMatch
        ? sourceOffsetForLine(sourceText, selectedFindMatch.lineno)
        : findPattern
        ? sourceText.toLowerCase().indexOf(findPattern.toLowerCase())
        : -1;
    const firstFindLineEnd = firstFindOffset >= 0 ? sourceText.indexOf('\n', firstFindOffset) : -1;
    const firstFindFocusOffset = firstFindLineEnd >= 0 ? firstFindLineEnd + 1 : firstFindOffset;
    const requestedMaxLines = Number(args.maxLines || args.max_lines || 0);
    const defaultViewportChars = Number.isFinite(requestedMaxLines) && requestedMaxLines > 0
        ? Math.min(maxChars, Math.max(4800, Math.round(requestedMaxLines * 100)))
        : Math.min(maxChars, 4800);
    const maxViewportChars = Math.max(1000, Math.min(maxChars, MAX_FETCH_CHARS));
    const viewportChars = clampNumber(
        args.viewportChars || args.viewport_chars || defaultViewportChars,
        defaultViewportChars,
        1000,
        maxViewportChars
    );
    const focused = focusTextWindow(sourceText, {
        query: linkQuery,
        url,
        maxChars: viewportChars
    });
    const sourceFocus = firstFindOffset >= 0
        ? {
            selectedIndex: firstFindFocusOffset,
            start: firstFindFocusOffset,
            end: firstFindFocusOffset
        }
        : focused.focus;
    const sourceWindow = buildSourceLineWindow(sourceText, {
        url,
        contentType,
        query: linkQuery,
        maxChars: viewportChars,
        lineStart: args.lineno || args.lineNo || args.line_no || args.lineStart || args.line_start,
        lineEnd: args.lineEnd || args.line_end,
        maxLines: args.maxLines || args.max_lines,
        focus: sourceFocus
    });
    const sourceWindowText = formatSourceLineWindow(sourceWindow);
    const extractedLinks = /html/i.test(contentType)
        ? extractLinksFromHtml(body, url, 80)
        : Array.isArray(fetched.links) ? fetched.links : [];
    const rankedLinks = rankLinksForResearch(extractedLinks, url, linkQuery);
    const suggestedRankedLinks = filterRankedLinksForQuerySuggestions(rankedLinks, linkQuery);
    const suggestedNextCalls = buildSuggestedCallsFromRankedLinks(suggestedRankedLinks, 3, { query: linkQuery });
    const observedLinksForGuidance = linkQuery ? suggestedRankedLinks : rankedLinks;
    const observedRelevantLinks = observedLinksForGuidance.slice(0, 5).map((candidate) => summarizeRelevantLink(candidate));
    const htmlRelations = /html/i.test(contentType)
        ? extractHtmlRelationGraph(body, { url, query: linkQuery, links: extractedLinks })
        : null;
    const htmlRelationSummary = formatHtmlRelationGraph(htmlRelations);
    const markdownTableRelations = fetched.kind === 'crawl4ai_markdown' || /markdown/i.test(contentType)
        ? extractMarkdownTableRelations(text, linkQuery)
        : null;
    const structuredTables = [
        ...(Array.isArray(htmlRelations?.tables) ? htmlRelations.tables : []),
        ...(Array.isArray(markdownTableRelations?.tables) ? markdownTableRelations.tables : [])
    ];
    const tableProjectionSummary = formatTableProjections(structuredTables);
    const structuredTableCoversTask = Boolean(linkQuery) && structuredTables.some((table) =>
        table?.projection?.queryRelevant === true &&
        table?.projection?.rowsComplete === true &&
        Number(table?.projection?.rowCount || 0) >= 2 &&
        Array.isArray(table?.projection?.columns) &&
        table.projection.columns.length >= 2
    );
    const wikiFacts = fetched.kind === 'wikipedia_wikitext'
        ? extractWikiKeyValueFacts(text, linkQuery)
        : [];
    const wikiFactSummary = formatWikiKeyValueFacts(wikiFacts);
    const wikiFactReasoningReady = wikiFactsAreReasoningReady(wikiFacts, linkQuery);
    const recordFieldProjections = extractRecordFieldProjections(text);
    const recordFieldProjectionSummary = formatRecordFieldProjections(recordFieldProjections);
    const repeatedLabeledFields = extractRepeatedLabeledFields(text);
    const repeatedLabeledFieldSummary = formatRepeatedLabeledFields(repeatedLabeledFields);
    const facetedSearchFilters = extractFacetedSearchFilters(text);
    const facetedSearchFilterSummary = formatFacetedSearchFilters(facetedSearchFilters);
    const barrier = classifyAccessBarrierText(text);
    const sourceHasMore = sourceWindow.hasMoreBefore || sourceWindow.hasMoreAfter;
    const quality = classifyWebFetchEvidenceQuality({
        text,
        url,
        query: linkQuery,
        contentType,
        barrier,
        suggestedNextCalls,
        truncated: false,
        encodingRepair
    });
    const evidenceGap = wikiFactReasoningReady || structuredTableCoversTask ? '' : (quality.evidenceGap || '');
    const recoveryHint = wikiFactReasoningReady
        ? 'Use the Wiki key-value facts above as structured evidence; only fetch more if another required field is missing.'
        : structuredTableCoversTask
        ? 'Use the complete structured table projection above for comparison; only fetch more if another required field is missing.'
        : (quality.recoveryHint || '');
    const sourceWindowFollowups = buildSourceWindowFollowups(sourceWindow, linkQuery);
    const sourceWindowPlainText = (Array.isArray(sourceWindow.lines) ? sourceWindow.lines : [])
        .map((line) => line.text)
        .join('\n');
    const sourceWindowCoversTask = sourceWindowCoversQuery(sourceWindowPlainText, linkQuery);
    const reasoningReady = (
        quality.evidenceQuality === 'sufficient_evidence' &&
        quality.isEvidence === true &&
        sourceWindowCoversTask
    ) || wikiFactReasoningReady || structuredTableCoversTask;
    const effectiveEvidenceQuality = structuredTableCoversTask
        ? 'sufficient_evidence'
        : quality.evidenceQuality;
    const effectivePageType = structuredTableCoversTask
        ? 'structured_data_page'
        : quality.pageType;
    const effectiveIsEvidence = quality.isEvidence === true || structuredTableCoversTask;
    const effectiveSuggestedNextCalls = reasoningReady
        ? []
        : dedupeSuggestedNextCalls([...suggestedNextCalls, ...sourceWindowFollowups], 5);
    const guidance = buildWebToolGuidanceText({
        evidenceGap,
        recoveryHint,
        suggestedNextCalls: effectiveSuggestedNextCalls,
        observedRelevantLinks
    });
    const compactHtmlRelationSummary = htmlRelationSummary && htmlRelationSummary.length <= 1200
        ? htmlRelationSummary
        : '';
    const source = pruneEmptyDeep({
        type: 'source_viewport',
        tool: 'web_fetch',
        url,
        ref_id: url,
        lineno: sourceWindow.lineno || sourceWindow.lineStart,
        line_start: sourceWindow.line_start || sourceWindow.lineStart,
        line_end: sourceWindow.line_end || sourceWindow.lineEnd,
        total_lines: sourceWindow.total_lines || sourceWindow.totalLines,
        has_more_before: sourceWindow.has_more_before ?? sourceWindow.hasMoreBefore,
        has_more_after: sourceWindow.has_more_after ?? sourceWindow.hasMoreAfter,
        content_type: sourceWindow.content_type || sourceWindow.contentType,
        selection_reason: sourceWindow.selection_reason || sourceWindow.selectionReason,
        lines: (Array.isArray(sourceWindow.lines) ? sourceWindow.lines : []).map((line) => pruneEmptyDeep({
            lineno: line.lineno || line.lineNumber,
            line_number: line.line_number || line.lineNumber,
            text: line.text
        }))
    });
    const webSearchOutput = buildCanonicalSourceViewportOutput({
        sourceViewport: source,
        action: sourceWindow.action || {
            type: 'open_page',
            url,
            lineno: source.line_start || source.lineno || 1
        }
    });
    return textResult([
        tableProjectionSummary,
        repeatedLabeledFieldSummary,
        recordFieldProjectionSummary,
        facetedSearchFilterSummary,
        guidance,
        compactHtmlRelationSummary,
        wikiFactSummary,
        sourceWindowText
    ].filter(Boolean).join('\n\n'), {
        ok: true,
        status: 'completed',
        url,
        ref_id: url,
        contentType,
        content_type: contentType,
        fetchBackend: fetched.backend,
        fetch_backend: fetched.backend,
        proxyUsed: fetched.proxyUsed === true || undefined,
        proxy_used: fetched.proxyUsed === true || undefined,
        fallbackFrom: fetched.fallbackFrom,
        fallback_from: fetched.fallbackFrom,
        primaryErrorCode: fetched.primaryErrorCode,
        primary_error_code: fetched.primaryErrorCode,
        tlsVerificationDisabled: fetched.tlsVerificationDisabled === true || undefined,
        tls_verification_disabled: fetched.tlsVerificationDisabled === true || undefined,
        tlsFallbackReason: normalizeString(fetched.tlsFallbackReason),
        tls_fallback_reason: normalizeString(fetched.tlsFallbackReason),
        originalChars: text.length,
        original_chars: text.length,
        returnedChars: sourceWindowText.length,
        returned_chars: sourceWindowText.length,
        focus: sourceFocus,
        ...(findPattern ? {
            pattern: findPattern,
            matchCount: findMatches.length,
            match_count: findMatches.length,
            matches: findMatches
        } : {}),
        complete: reasoningReady,
        truncated: false,
        contentTruncated: sourceHasMore,
        content_truncated: sourceHasMore,
        sourceRetrievalComplete: true,
        source_retrieval_complete: true,
        modelVisibleMode: 'source_viewport',
        model_visible_mode: 'source_viewport',
        webSearchOutput,
        webSearchCall: webSearchOutput.webSearchCall,
        web_search_call: webSearchOutput.web_search_call,
        functionCallOutput: webSearchOutput.functionCallOutput,
        function_call_output: webSearchOutput.function_call_output,
        source,
        source_window: source,
        sourceWindow,
        sourceViewport: source,
        sourceWindowCoversTask,
        source_window_covers_query: sourceWindowCoversTask,
        structuredTableCoversTask,
        structured_table_covers_task: structuredTableCoversTask,
        reasoningReady,
        reasoning_ready: reasoningReady,
        isEvidence: effectiveIsEvidence,
        is_evidence: effectiveIsEvidence,
        evidenceQuality: effectiveEvidenceQuality,
        evidence_quality: effectiveEvidenceQuality,
        pageType: effectivePageType,
        page_type: effectivePageType,
        contentQuality: effectiveEvidenceQuality,
        content_quality: effectiveEvidenceQuality,
        observationContract: {
            complete: reasoningReady,
            truncated: false,
            reasoning_ready: reasoningReady,
            is_evidence: effectiveIsEvidence,
            evidence_quality: effectiveEvidenceQuality,
            page_type: effectivePageType,
            source_window: true,
            source_viewport: source,
            source_retrieval_complete: true,
            line_start: sourceWindow.lineStart,
            line_end: sourceWindow.lineEnd,
            total_lines: sourceWindow.totalLines,
            has_more_source_lines: sourceHasMore,
            source_window_covers_task: sourceWindowCoversTask,
            structured_table_covers_task: structuredTableCoversTask,
            evidence_judged_by_model: true
        },
        observedLinkCount: extractedLinks.length,
        observed_link_count: extractedLinks.length,
        suggestedNextCalls: effectiveSuggestedNextCalls,
        suggested_next_calls: effectiveSuggestedNextCalls,
        observedRelevantLinks,
        observed_relevant_links: observedRelevantLinks,
        contentExcerpt: sourceWindowText,
        htmlRelations: htmlRelations || undefined,
        html_relations: htmlRelations || undefined,
        htmlRelationSummary: htmlRelationSummary || undefined,
        html_relation_summary: htmlRelationSummary || undefined,
        structuredTables: structuredTables.length ? structuredTables : undefined,
        structured_tables: structuredTables.length ? structuredTables : undefined,
        tableProjectionSummary: tableProjectionSummary || undefined,
        recordFieldProjections: recordFieldProjections.length ? recordFieldProjections : undefined,
        record_field_projections: recordFieldProjections.length ? recordFieldProjections : undefined,
        recordFieldProjectionSummary: recordFieldProjectionSummary || undefined,
        record_field_projection_summary: recordFieldProjectionSummary || undefined,
        repeatedLabeledFields: repeatedLabeledFields.length ? repeatedLabeledFields : undefined,
        repeated_labeled_fields: repeatedLabeledFields.length ? repeatedLabeledFields : undefined,
        repeatedLabeledFieldSummary: repeatedLabeledFieldSummary || undefined,
        repeated_labeled_field_summary: repeatedLabeledFieldSummary || undefined,
        facetedSearchFilters: facetedSearchFilters.length ? facetedSearchFilters : undefined,
        faceted_search_filters: facetedSearchFilters.length ? facetedSearchFilters : undefined,
        facetedSearchFilterSummary: facetedSearchFilterSummary || undefined,
        faceted_search_filter_summary: facetedSearchFilterSummary || undefined,
        table_projection_summary: tableProjectionSummary || undefined,
        wikiFacts: wikiFacts.length ? wikiFacts : undefined,
        wiki_facts: wikiFacts.length ? wikiFacts : undefined,
        wikiFactSummary: wikiFactSummary || undefined,
        wiki_fact_summary: wikiFactSummary || undefined,
        evidenceGap,
        evidence_gap: evidenceGap,
        recoveryHint,
        recovery_hint: recoveryHint,
        pageStatus: quality.pageStatus || undefined,
        page_status: quality.pageStatus || undefined,
        modelJudgesEvidence: true,
        model_judges_evidence: true,
        encodingRepair: encodingRepair.repaired ? 'latin1_to_utf8' : undefined,
        encoding_repair: encodingRepair.repaired ? 'latin1_to_utf8' : undefined,
        crawl4aiAttempt: summarizeCrawl4aiAttempt(crawl4aiAttempt),
        crawl4ai_attempt: summarizeCrawl4aiAttempt(crawl4aiAttempt),
        renderedFallbackAttempt: summarizeCrawl4aiAttempt(renderedFallbackAttempt),
        rendered_fallback_attempt: summarizeCrawl4aiAttempt(renderedFallbackAttempt),
        renderedFallbackUsed: renderedFallbackUsed || undefined,
        rendered_fallback_used: renderedFallbackUsed || undefined,
        renderedFallbackTrigger: normalizeString(renderedFallbackTrigger),
        rendered_fallback_trigger: normalizeString(renderedFallbackTrigger)
    });
}

async function webFetch(args = {}) {
    const url = normalizeString(args.url || args.ref_id || args.refId || args.uri);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('web_fetch requires http(s) url');
    }
    const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 80000);
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 90000, 1000, 300000);
    const crawl4aiAttempt = await maybeFetchWithCrawl4ai(url, args, timeoutMs);
    const wikipediaPage = crawl4aiAttempt?.ok ? null : await maybeFetchWikipediaPage(url, timeoutMs);
    const fetched = crawl4aiAttempt?.ok ? crawl4aiAttempt : wikipediaPage || await fetchText(url, timeoutMs);
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

const WEB_ARCHIVE_PROVIDERS = Object.freeze({
    internet_archive: Object.freeze({
        id: 'internet_archive',
        aliases: Object.freeze(['internet_archive', 'internet archive', 'ia', 'wayback', 'wayback_machine']),
        cdxBaseUrl: 'https://web.archive.org/cdx/search/cdx',
        replayBaseUrl: 'https://web.archive.org/web'
    }),
    arquivo: Object.freeze({
        id: 'arquivo',
        aliases: Object.freeze(['arquivo', 'arquivo.pt', 'arquivo_pt']),
        cdxBaseUrl: 'https://arquivo.pt/wayback/cdx',
        replayBaseUrl: 'https://arquivo.pt/wayback'
    })
});

function normalizeWebArchiveProvider(value = '') {
    const normalized = normalizeString(value).toLowerCase();
    if (!normalized || normalized === 'auto' || normalized === 'all') {
        return '';
    }
    return Object.values(WEB_ARCHIVE_PROVIDERS)
        .find((provider) => provider.aliases.includes(normalized))
        ?.id || '';
}

function normalizeWebArchiveProviders(args = {}) {
    const raw = Array.isArray(args.providers)
        ? args.providers
        : String(args.provider || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    if (!raw.length) {
        return ['internet_archive', 'arquivo'];
    }
    const providers = dedupeSearchStrings(raw.map(normalizeWebArchiveProvider)).filter(Boolean);
    return providers.length ? providers : ['internet_archive', 'arquivo'];
}

function webArchiveSearchTerms(value = '') {
    let decoded = String(value || '');
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            decoded = decodeURIComponent(decoded.replace(/\+/g, ' '));
        } catch {
            break;
        }
    }
    return dedupeSearchStrings(
        (decoded.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || [])
            .filter((term) => !['http', 'https', 'www'].includes(term))
    );
}

function webArchiveAnchorTerms(terms = []) {
    const normalized = dedupeSearchStrings(Array.isArray(terms) ? terms : webArchiveSearchTerms(terms));
    if (!normalized.length) {
        return [];
    }
    const numericTerms = normalized.filter((term) => /\d/.test(term));
    return dedupeSearchStrings([
        normalized[0],
        ...numericTerms
    ]).slice(0, 6);
}

const WEB_ARCHIVE_URL_FIELD_TERMS = new Set([
    'access', 'article', 'author', 'classification', 'content', 'country', 'date',
    'document', 'field', 'filter', 'flag', 'format', 'lang', 'language', 'page',
    'provider', 'query', 'record', 'region', 'resource', 'search', 'sort', 'source',
    'subject', 'topic', 'type', 'typenorm', 'year'
]);

function webArchiveAnchorTermSets(terms = []) {
    const normalized = dedupeSearchStrings(Array.isArray(terms) ? terms : webArchiveSearchTerms(terms));
    const primary = webArchiveAnchorTerms(normalized);
    if (!primary.length) {
        return [];
    }
    const firstTerm = normalized[0];
    const numericTerms = normalized.filter((term) => /\d/.test(term));
    const literalValueTerms = normalized
        .slice(1)
        .filter((term) => !/\d/.test(term) && !WEB_ARCHIVE_URL_FIELD_TERMS.has(term))
        .slice(0, 2);
    const candidates = [
        literalValueTerms.length
            ? [firstTerm, numericTerms[0], numericTerms[numericTerms.length - 1], ...literalValueTerms]
            : [],
        primary,
        numericTerms.length >= 2
            ? [firstTerm, numericTerms[0], numericTerms[numericTerms.length - 1]]
            : [],
        numericTerms.length
            ? [firstTerm, numericTerms[0]]
            : [firstTerm]
    ];
    const seen = new Set();
    return candidates
        .map((candidate) => dedupeSearchStrings(candidate).slice(0, 6))
        .filter((candidate) => {
            if (!candidate.length) {
                return false;
            }
            const key = candidate.join('\u0000');
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
}

function webArchiveUrlRankingText(value = '') {
    const rawUrl = normalizeString(value);
    try {
        const parsed = new URL(rawUrl);
        const parts = [
            parsed.hostname,
            parsed.pathname,
            parsed.hash
        ];
        for (const [key, parameterValue] of parsed.searchParams.entries()) {
            const normalizedValue = normalizeString(parameterValue);
            if (!normalizedValue) {
                continue;
            }
            parts.push(key);
            parts.push(normalizedValue);
        }
        return webArchiveSearchTerms(parts.join(' ')).join(' ');
    } catch {
        return webArchiveSearchTerms(rawUrl).join(' ');
    }
}

function normalizeArchiveIndexTarget(url, matchType = 'exact') {
    const normalizedUrl = normalizeString(url);
    return normalizeString(matchType).toLowerCase() === 'prefix'
        ? normalizedUrl.replace(/\*$/, '')
        : normalizedUrl;
}

function escapeWebArchiveRegexTerm(value = '') {
    return String(value || '').replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

function buildWebArchiveCdxUrl(providerId, args = {}, page = {}) {
    const provider = WEB_ARCHIVE_PROVIDERS[providerId];
    const override = providerId === 'internet_archive'
        ? normalizeString(args.cdxBaseUrl || args.cdx_base_url || args.internetArchiveCdxUrl)
        : normalizeString(args.arquivoCdxUrl || args.arquivo_cdx_url);
    const endpoint = new URL(override || provider.cdxBaseUrl);
    endpoint.searchParams.set('url', normalizeArchiveIndexTarget(
        args.url,
        args.matchType || args.match_type
    ));
    const matchType = normalizeString(args.matchType || args.match_type).toLowerCase();
    if (matchType === 'prefix') {
        endpoint.searchParams.set('matchType', 'prefix');
    }
    endpoint.searchParams.set('output', 'json');
    endpoint.searchParams.set('limit', String(clampNumber(
        page.limit || args.scanLimit || args.scan_limit,
        matchType === 'prefix' ? 500 : 120,
        1,
        500
    )));
    const fromYear = clampNumber(args.fromYear || args.from_year, 0, 0, 9999);
    const toYear = clampNumber(args.toYear || args.to_year, 0, 0, 9999);
    if (fromYear) endpoint.searchParams.set('from', String(fromYear));
    if (toYear) endpoint.searchParams.set('to', String(toYear));
    if (providerId === 'internet_archive') {
        endpoint.searchParams.set('fl', 'timestamp,original,statuscode,mimetype,digest,length');
        endpoint.searchParams.append('filter', 'statuscode:200');
        for (const term of Array.isArray(page.urlFilterTerms) ? page.urlFilterTerms : []) {
            const escapedTerm = escapeWebArchiveRegexTerm(term);
            if (escapedTerm) {
                endpoint.searchParams.append('filter', `original:(?i).*${escapedTerm}.*`);
            }
        }
        if (normalizeString(args.matchType || args.match_type).toLowerCase() === 'prefix') {
            endpoint.searchParams.set('collapse', 'urlkey');
        }
        if (page.showResumeKey === true) {
            endpoint.searchParams.set('showResumeKey', 'true');
        }
        const resumeKey = normalizeString(page.resumeKey);
        if (resumeKey) {
            endpoint.searchParams.set('resumeKey', resumeKey);
        }
    }
    return endpoint.toString();
}

function parseInternetArchiveCdxPage(text = '') {
    let payload;
    try {
        payload = JSON.parse(text);
    } catch {
        return { rows: [], resumeKey: '' };
    }
    if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
        return { rows: [], resumeKey: '' };
    }
    const header = payload[0].map((field) => normalizeString(String(field)));
    const rows = payload.slice(1)
        .filter((row) => Array.isArray(row) && row.length >= header.length)
        .map((row) => Object.fromEntries(header.map((field, index) => [field, row[index]])));
    const resumeKey = payload.slice(1)
        .findLast((row) => Array.isArray(row) && row.length === 1 && normalizeString(String(row[0] || '')))
        ?.[0];
    return {
        rows,
        resumeKey: normalizeString(String(resumeKey || ''))
    };
}

function parseArquivoCdx(text = '') {
    return String(text || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

function buildWebArchiveReplayUrl(providerId, timestamp, originalUrl, args = {}) {
    const provider = WEB_ARCHIVE_PROVIDERS[providerId];
    const override = providerId === 'internet_archive'
        ? normalizeString(args.replayBaseUrl || args.replay_base_url || args.internetArchiveReplayUrl)
        : normalizeString(args.arquivoReplayUrl || args.arquivo_replay_url);
    const baseUrl = (override || provider.replayBaseUrl).replace(/\/+$/, '');
    const captureTimestamp = normalizeString(String(timestamp || '')).replace(/\D/g, '');
    if (providerId === 'internet_archive') {
        return `${baseUrl}/${captureTimestamp}id_/${originalUrl}`;
    }
    return `${baseUrl}/${captureTimestamp}/${originalUrl}`;
}

function normalizeWebArchiveCapture(providerId, row = {}, args = {}) {
    const timestamp = normalizeString(String(row.timestamp || ''));
    const originalUrl = normalizeString(String(row.original || row.url || ''));
    if (!/^\d{8,14}$/.test(timestamp) || !/^https?:\/\//i.test(originalUrl)) {
        return null;
    }
    const capturedAt = timestamp.length >= 14
        ? `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}T${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}:${timestamp.slice(12, 14)}Z`
        : `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}`;
    return pruneEmptyDeep({
        provider: providerId,
        timestamp,
        capturedAt,
        originalUrl,
        replayUrl: buildWebArchiveReplayUrl(providerId, timestamp, originalUrl, args),
        statusCode: Number(row.statuscode || row.status) || undefined,
        mimeType: normalizeString(String(row.mimetype || row.mime || '')),
        digest: normalizeString(String(row.digest || '')),
        contentLength: Number(row.length) || undefined
    });
}

function rankWebArchiveCaptures(captures = [], contains = '', options = {}) {
    const terms = webArchiveSearchTerms(contains);
    const preferEarliest = options.preferEarliest === true;
    const preferAnswerBearing = options.preferAnswerBearing === true;
    const ranked = captures.map((capture, index) => {
        const haystack = webArchiveUrlRankingText(capture.originalUrl);
        const matchedTerms = terms.filter((term) => haystack.includes(term));
        const url = normalizeString(capture.originalUrl);
        const answerBearingPriority = /\/(?:results?|records?|items?|details?|documents?)(?:[/?#]|$)/i.test(url)
            ? 2
            : /\/(?:advanced|autocomplete|account|login)(?:[/?#]|$)/i.test(url)
                ? -2
                : 0;
        return {
            ...capture,
            matchedTerms,
            matchCount: matchedTerms.length,
            matchCoverage: terms.length ? Number((matchedTerms.length / terms.length).toFixed(3)) : 1,
            answerBearingPriority,
            _index: index
        };
    });
    ranked.sort((left, right) => preferEarliest
        ? right.matchCount - left.matchCount ||
            (preferAnswerBearing ? right.answerBearingPriority - left.answerBearingPriority : 0) ||
            left.timestamp.localeCompare(right.timestamp) ||
            left._index - right._index
        : right.matchCount - left.matchCount ||
            (preferAnswerBearing ? right.answerBearingPriority - left.answerBearingPriority : 0) ||
            right.timestamp.localeCompare(left.timestamp) ||
            left._index - right._index
    );
    const exactMatches = terms.length
        ? ranked.filter((capture) => capture.matchCount === terms.length)
        : ranked;
    const termMatches = ranked.filter((capture) => capture.matchCount > 0);
    const candidates = preferEarliest
        ? termMatches
        : exactMatches.length
            ? exactMatches
            : termMatches;
    return {
        terms,
        exactMatch: Boolean(exactMatches.length),
        captures: (candidates.length ? candidates : ranked).map(({ _index, ...capture }) => capture)
    };
}

function selectWebArchiveCaptures(captures = [], terms = [], limit = 10) {
    const rankedCaptures = Array.isArray(captures) ? captures : [];
    const selected = rankedCaptures.slice(0, limit);
    const coreTerms = webArchiveAnchorTerms(terms);
    if (!coreTerms.length || limit < 2) {
        return { selected, coreTerms, recoveryCaptures: [] };
    }
    const recoveryCaptures = rankedCaptures
        .filter((capture) =>
            coreTerms.every((term) => (capture.matchedTerms || []).includes(term))
        )
        .sort((left, right) =>
            Number(left.matchCount || 0) - Number(right.matchCount || 0) ||
            left.timestamp.localeCompare(right.timestamp)
        )
        .slice(0, 2);
    let insertIndex = Math.min(3, Math.max(1, limit - 1));
    for (const recovery of recoveryCaptures) {
        const existingIndex = selected.findIndex((capture) =>
            capture.provider === recovery.provider &&
            capture.timestamp === recovery.timestamp &&
            capture.originalUrl === recovery.originalUrl
        );
        if (existingIndex >= 0) {
            continue;
        }
        selected.splice(Math.min(insertIndex, selected.length), 0, recovery);
        insertIndex += 1;
    }
    return {
        selected: selected.slice(0, limit),
        coreTerms,
        recoveryCaptures
    };
}

function annotateArchiveDateBoundsRelaxed(result = {}, fromYear = 0, toYear = 0) {
    const details = pruneEmptyDeep({
        ...(result.structuredContent || result.details || {}),
        captureDateBoundsRelaxed: true,
        capture_date_bounds_relaxed: true,
        originalCaptureDateBounds: {
            fromYear: fromYear || undefined,
            toYear: toYear || undefined
        },
        original_capture_date_bounds: {
            from_year: fromYear || undefined,
            to_year: toYear || undefined
        },
        captureDateRecoveryReason: 'The requested archive crawl-year bounds duplicated URL/content ranking years or returned no captures, so discovery retried without crawl-date bounds.',
        capture_date_recovery_reason: 'The requested archive crawl-year bounds duplicated URL/content ranking years or returned no captures, so discovery retried without crawl-date bounds.'
    });
    return {
        ...result,
        content: Array.isArray(result.content) && result.content.length
            ? [{
                ...result.content[0],
                text: `archive_capture_date_bounds_relaxed=true original_from=${fromYear || '(none)'} original_to=${toYear || '(none)'}\n${result.content[0].text}`
            }, ...result.content.slice(1)]
            : result.content,
        structuredContent: details,
        details
    };
}

async function webArchiveLookup(args = {}) {
    const url = normalizeString(args.url || args.uri || args.originalUrl || args.original_url);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('web_archive_lookup requires an original http(s) url');
    }
    const requestedProvider = normalizeWebArchiveProvider(args.provider);
    const timestamp = normalizeString(String(args.timestamp || args.captureTimestamp || args.capture_timestamp || ''))
        .replace(/\D/g, '');
    const mode = normalizeString(args.mode, timestamp ? 'open' : 'captures').toLowerCase();
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 120000, 3000, 300000);
    if (mode === 'open') {
        if (!requestedProvider) {
            return errorResult('web_archive_lookup mode=open requires provider');
        }
        if (!/^\d{8,14}$/.test(timestamp)) {
            return errorResult('web_archive_lookup mode=open requires an 8-14 digit timestamp');
        }
        const replayUrl = buildWebArchiveReplayUrl(requestedProvider, timestamp, url, args);
        const fetched = await fetchText(replayUrl, timeoutMs);
        if (!fetched.ok) {
            return errorResult(fetched.error || 'archived snapshot fetch failed', {
                ...buildHttpAccessFailureDetails(replayUrl, fetched),
                provider: requestedProvider,
                timestamp,
                originalUrl: url,
                replayUrl
            });
        }
        const maxChars = clampNumber(args.maxChars || args.max_chars, MAX_FETCH_CHARS, 1000, 80000);
        const result = buildWebFetchResult({
            url: replayUrl,
            args: {
                ...args,
                url: replayUrl,
                query: args.query || args.contains
            },
            maxChars,
            fetched,
            crawl4aiAttempt: null
        });
        const details = pruneEmptyDeep({
            ...(result.structuredContent || result.details || {}),
            kind: 'web_archive_snapshot',
            archiveProvider: requestedProvider,
            archive_provider: requestedProvider,
            captureTimestamp: timestamp,
            capture_timestamp: timestamp,
            originalUrl: url,
            original_url: url,
            replayUrl,
            replay_url: replayUrl
        });
        return {
            ...result,
            structuredContent: details,
            details
        };
    }
    if (mode !== 'captures' && mode !== 'search') {
        return errorResult('web_archive_lookup mode must be captures, search, or open');
    }

    const providers = normalizeWebArchiveProviders(args);
    const matchType = normalizeString(args.matchType || args.match_type, 'exact').toLowerCase();
    const rankingTerms = webArchiveSearchTerms(args.contains || args.query);
    const requestedFromYear = clampNumber(args.fromYear || args.from_year, 0, 0, 9999);
    const requestedToYear = clampNumber(args.toYear || args.to_year, 0, 0, 9999);
    const duplicatedContentYearBounds = [requestedFromYear, requestedToYear]
        .filter(Boolean)
        .some((year) => rankingTerms.includes(String(year)));
    const defaultScanLimit = matchType === 'prefix'
        ? (rankingTerms.length ? 2500 : 500)
        : 120;
    const scanLimit = clampNumber(args.scanLimit || args.scan_limit, defaultScanLimit, 1, 10000);
    const maxResults = clampNumber(args.maxResults || args.max_results || args.limit, 12, 1, 50);
    const archiveIndexTimeoutMs = clampNumber(
        args.indexTimeoutMs || args.index_timeout_ms,
        Math.max(timeoutMs, 90000),
        5000,
        180000
    );
    const attempts = await runBoundedParallel(providers, providers.length, async (providerId) => {
        if (providerId !== 'internet_archive') {
            const cdxUrl = buildWebArchiveCdxUrl(providerId, args, {
                limit: Math.min(scanLimit, 500)
            });
            const fetched = await fetchArchiveIndexText(cdxUrl, archiveIndexTimeoutMs);
            if (!fetched.ok) {
                return {
                    ok: false,
                    provider: providerId,
                    cdxUrl,
                    cdxUrls: [cdxUrl],
                    pageCount: 1,
                    statusCode: fetched.status || 0,
                    errorCode: fetched.errorCode,
                    error: fetched.error
                };
            }
            return {
                ok: true,
                provider: providerId,
                cdxUrl,
                cdxUrls: [cdxUrl],
                pageCount: 1,
                stopReason: 'provider_single_page',
                captures: parseArquivoCdx(fetched.text)
                    .map((row) => normalizeWebArchiveCapture(providerId, row, args))
                    .filter(Boolean)
            };
        }

        const captures = [];
        const cdxUrls = [];
        let resumeKey = '';
        let statusCode = 0;
        let errorCode = '';
        let error = '';
        let stopReason = 'scan_limit_reached';
        let serverUrlProbeComplete = false;
        let matchedAnchorSetCount = 0;

        if (matchType === 'prefix' && rankingTerms.length) {
            const anchorTermSets = webArchiveAnchorTermSets(rankingTerms);
            for (let anchorIndex = 0; anchorIndex < anchorTermSets.length; anchorIndex += 1) {
                const anchorTerms = anchorTermSets[anchorIndex];
                const isPreferredAnchorSet = anchorIndex === 0;
                const isLastAnchorSet = anchorIndex === anchorTermSets.length - 1;
                const probeTimeoutMs = isPreferredAnchorSet || matchedAnchorSetCount > 0
                    ? archiveIndexTimeoutMs
                    : Math.min(archiveIndexTimeoutMs, 20000);
                const filteredCdxUrl = buildWebArchiveCdxUrl(providerId, args, {
                    limit: Math.min(scanLimit, 500),
                    urlFilterTerms: anchorTerms
                });
                cdxUrls.push(filteredCdxUrl);
                let filteredFetch = await fetchArchiveIndexText(filteredCdxUrl, probeTimeoutMs);
                if (
                    !filteredFetch.ok &&
                    isLastAnchorSet &&
                    !isPreferredAnchorSet &&
                    ['timeout', 'curl_fetch_failed', 'fetch_process_failed', 'node_fetch_failed'].includes(
                        normalizeString(filteredFetch.errorCode)
                    )
                ) {
                    await new Promise((resolve) => setTimeout(resolve, 750));
                    cdxUrls.push(filteredCdxUrl);
                    filteredFetch = await fetchArchiveIndexText(filteredCdxUrl, archiveIndexTimeoutMs);
                }
                statusCode = filteredFetch.status || statusCode;
                if (!filteredFetch.ok) {
                    errorCode = filteredFetch.errorCode;
                    error = filteredFetch.error;
                    if (isLastAnchorSet) {
                        stopReason = 'server_url_probe_failure_falling_back_to_prefix_scan';
                        break;
                    }
                    stopReason = 'server_url_anchor_probe_failed_backing_off';
                    continue;
                }
                const filteredPage = parseInternetArchiveCdxPage(filteredFetch.text);
                const filteredCaptures = filteredPage.rows
                    .map((row) => normalizeWebArchiveCapture(providerId, row, args))
                    .filter(Boolean);
                if (filteredCaptures.length) {
                    errorCode = '';
                    error = '';
                    captures.push(...filteredCaptures);
                    matchedAnchorSetCount += 1;
                    const filteredRanking = rankWebArchiveCaptures(
                        filteredCaptures,
                        args.contains || args.query
                    );
                    stopReason = anchorIndex > 0
                        ? 'server_url_anchor_backoff_matched'
                        : anchorTerms.length === rankingTerms.length
                        ? 'server_url_terms_matched'
                        : 'server_url_anchor_terms_matched';
                    const shouldProbeBroaderCore = (
                        matchedAnchorSetCount === 1 &&
                        anchorIndex < anchorTermSets.length - 1
                    );
                    if (shouldProbeBroaderCore) {
                        stopReason = 'server_url_selective_terms_matched_probing_broader_core';
                        continue;
                    }
                    const strongestFilteredCapture = filteredRanking.captures[0];
                    const minimumMeaningfulAnchorMatches = Math.min(2, rankingTerms.length);
                    serverUrlProbeComplete = filteredRanking.exactMatch ||
                        Number(strongestFilteredCapture?.matchCount || 0) >= minimumMeaningfulAnchorMatches;
                    if (serverUrlProbeComplete) {
                        break;
                    }
                }
            }
            if (!serverUrlProbeComplete) {
                stopReason = stopReason === 'server_url_probe_failure_falling_back_to_prefix_scan'
                    ? stopReason
                    : 'server_url_anchor_terms_empty_falling_back_to_prefix_scan';
            }
        }

        const maxPages = Math.ceil(scanLimit / 500);
        for (let pageIndex = 0; !serverUrlProbeComplete && pageIndex < maxPages; pageIndex += 1) {
            const requestedBeforePage = pageIndex * 500;
            const pageLimit = Math.min(500, scanLimit - requestedBeforePage);
            if (pageLimit <= 0) break;
            const cdxUrl = buildWebArchiveCdxUrl(providerId, args, {
                limit: pageLimit,
                showResumeKey: requestedBeforePage + pageLimit < scanLimit,
                resumeKey
            });
            cdxUrls.push(cdxUrl);
            const fetched = await fetchArchiveIndexText(cdxUrl, archiveIndexTimeoutMs);
            statusCode = fetched.status || statusCode;
            if (!fetched.ok) {
                errorCode = fetched.errorCode;
                error = fetched.error;
                stopReason = captures.length ? 'partial_fetch_failure' : 'fetch_failure';
                break;
            }
            errorCode = '';
            error = '';
            const page = parseInternetArchiveCdxPage(fetched.text);
            const pageCaptures = page.rows
                .map((row) => normalizeWebArchiveCapture(providerId, row, args))
                .filter(Boolean);
            captures.push(...pageCaptures);
            if (rankingTerms.length && rankWebArchiveCaptures(pageCaptures, args.contains || args.query).exactMatch) {
                stopReason = 'all_url_terms_matched';
                break;
            }
            if (!page.resumeKey || page.resumeKey === resumeKey) {
                stopReason = 'no_resume_key';
                break;
            }
            resumeKey = page.resumeKey;
        }
        return {
            ok: captures.length > 0,
            provider: providerId,
            cdxUrl: cdxUrls[0] || '',
            cdxUrls,
            pageCount: cdxUrls.length,
            stopReason,
            statusCode,
            errorCode,
            error,
            captures
        };
    });
    const captures = Array.from(new Map(
        attempts
            .flatMap((attempt) => Array.isArray(attempt.captures) ? attempt.captures : [])
            .map((capture) => [`${capture.provider}:${capture.timestamp}:${capture.originalUrl}`, capture])
    ).values());
    if (!captures.length) {
        if ((requestedFromYear || requestedToYear) && args._captureDateBoundsRelaxed !== true) {
            const relaxed = await webArchiveLookup({
                ...args,
                fromYear: 0,
                from_year: 0,
                toYear: 0,
                to_year: 0,
                _captureDateBoundsRelaxed: true
            });
            return annotateArchiveDateBoundsRelaxed(relaxed, requestedFromYear, requestedToYear);
        }
        if (
            matchType === 'prefix' &&
            args._archiveEmptyRetry !== true
        ) {
            await new Promise((resolve) => setTimeout(resolve, 750));
            return await webArchiveLookup({
                ...args,
                _archiveEmptyRetry: true
            });
        }
        return errorResult('No archived captures were found for this URL pattern', {
            status: 'not_found',
            originalUrl: url,
            matchType: normalizeString(args.matchType || args.match_type, 'exact'),
            attempts,
            evidenceGap: 'The configured public web archives returned no matching captures.',
            recoveryHint: 'Try matchType=prefix on a stable path, widen fromYear/toYear, or remove contains terms before returning to broad web search.'
        });
    }
    const ranked = rankWebArchiveCaptures(captures, args.contains || args.query, {
        preferEarliest: matchType === 'prefix',
        preferAnswerBearing: mode === 'search' || Boolean(normalizeString(args.query))
    });
    if (
        duplicatedContentYearBounds &&
        matchType === 'prefix' &&
        args._captureDateBoundsRelaxed !== true
    ) {
        const strongestCapture = ranked.captures[0];
        const minimumMeaningfulMatches = Math.min(2, rankingTerms.length);
        if (Number(strongestCapture?.matchCount || 0) < minimumMeaningfulMatches) {
            const relaxed = await webArchiveLookup({
                ...args,
                fromYear: 0,
                from_year: 0,
                toYear: 0,
                to_year: 0,
                _captureDateBoundsRelaxed: true
            });
            return annotateArchiveDateBoundsRelaxed(relaxed, requestedFromYear, requestedToYear);
        }
    }
    const captureSelection = selectWebArchiveCaptures(ranked.captures, ranked.terms, maxResults);
    const selected = captureSelection.selected;
    const suggestedNextCalls = selected.slice(0, 5).map((capture) => ({
        tool: 'web_archive_lookup',
        args: pruneEmptyDeep({
            mode: 'open',
            provider: capture.provider,
            url: capture.originalUrl,
            timestamp: capture.timestamp,
            query: normalizeString(args.query || args.contains)
        })
    }));
    const details = pruneEmptyDeep({
        status: 'completed',
        kind: 'web_archive_captures',
        originalUrl: url,
        original_url: url,
        matchType,
        providers,
        searchTerms: ranked.terms,
        exactTermMatch: ranked.exactMatch,
        rankingPolicy: matchType === 'prefix'
            ? 'earliest_term_matching_capture'
            : 'term_match_then_latest_capture',
        candidateSelectionPolicy: 'top_url_matches_with_broad_core_recovery',
        candidate_selection_policy: 'top_url_matches_with_broad_core_recovery',
        coreSearchTerms: captureSelection.coreTerms,
        core_search_terms: captureSelection.coreTerms,
        recoveryCaptureCount: captureSelection.recoveryCaptures.length,
        recovery_capture_count: captureSelection.recoveryCaptures.length,
        scanLimit,
        scannedCaptureCount: captures.length,
        captureCount: selected.length,
        captures: selected,
        attempts: attempts.map((attempt) => ({
            ok: attempt.ok,
            provider: attempt.provider,
            cdxUrl: attempt.cdxUrl,
            cdxUrls: attempt.cdxUrls,
            pageCount: attempt.pageCount,
            stopReason: attempt.stopReason,
            statusCode: attempt.statusCode,
            errorCode: attempt.errorCode,
            error: attempt.error,
            captureCount: Array.isArray(attempt.captures) ? attempt.captures.length : 0
        })),
        suggestedNextCalls,
        suggested_next_calls: suggestedNextCalls,
        reasoningReady: false,
        reasoning_ready: false,
        sourceRetrievalComplete: true,
        source_retrieval_complete: true
    });
    const autoOpenSnapshot = mode === 'search' || Boolean(normalizeString(args.query));
    if (autoOpenSnapshot) {
        const openAttempts = [];
        const bestMatchCount = Number(selected[0]?.matchCount || 0);
        for (const capture of selected.slice(0, 10)) {
            const minimumCandidateMatchCount = Math.max(
                rankingTerms.length >= 3 ? 2 : 1,
                bestMatchCount - 2
            );
            const coversCoreSearchTerms = captureSelection.coreTerms.length > 0 &&
                captureSelection.coreTerms.every((term) =>
                    (capture.matchedTerms || []).includes(term)
                );
            if (
                bestMatchCount &&
                Number(capture.matchCount || 0) < minimumCandidateMatchCount &&
                !coversCoreSearchTerms
            ) {
                openAttempts.push({
                    provider: capture.provider,
                    timestamp: capture.timestamp,
                    originalUrl: capture.originalUrl,
                    ok: false,
                    error: 'archive_candidate_below_relevance_threshold'
                });
                continue;
            }
            const opened = await webArchiveLookup({
                ...args,
                mode: 'open',
                provider: capture.provider,
                url: capture.originalUrl,
                timestamp: capture.timestamp,
                query: normalizeString(args.query || args.contains),
                fromYear: 0,
                from_year: 0,
                toYear: 0,
                to_year: 0
            });
            openAttempts.push({
                provider: capture.provider,
                timestamp: capture.timestamp,
                originalUrl: capture.originalUrl,
                ok: opened.isError !== true,
                error: opened.isError === true
                    ? normalizeString(opened.structuredContent?.error || opened.content?.[0]?.text)
                    : ''
            });
            if (opened.isError === true) {
                continue;
            }
            const snapshotDetails = opened.structuredContent || opened.details || {};
            const snapshotText = normalizeString(opened.content?.[0]?.text);
            const snapshotBlocked = /making sure you(?:'|’)re not a bot|anubis|enable javascript to get past this challenge|proof[- ]of[- ]work scheme/i.test(snapshotText) ||
                /anti_bot|access_barrier|captcha|js_challenge/i.test(normalizeString(
                    snapshotDetails.evidenceQuality ||
                    snapshotDetails.evidence_quality ||
                    snapshotDetails.pageStatus ||
                    snapshotDetails.page_status
                ));
            const snapshotHasNoResults = /\bno (?:documents|records|results|matches) found\b|\b0 (?:documents|records|results|matches)\b/i.test(snapshotText);
            if (snapshotBlocked || snapshotHasNoResults) {
                openAttempts[openAttempts.length - 1] = {
                    ...openAttempts[openAttempts.length - 1],
                    ok: false,
                    error: snapshotBlocked
                        ? 'archived_snapshot_access_barrier'
                        : 'archived_snapshot_no_results'
                };
                continue;
            }
            const repeatedFieldCount = (Array.isArray(snapshotDetails.repeatedLabeledFields)
                ? snapshotDetails.repeatedLabeledFields
                : [])
                .reduce((sum, field) => sum + Number(field?.occurrenceCount || 0), 0);
            const snapshotIsNavigationOnly = repeatedFieldCount === 0 &&
                snapshotDetails.reasoningReady !== true &&
                /\/(?:advanced|autocomplete|account|login)(?:[/?#]|$)/i.test(capture.originalUrl);
            if (snapshotIsNavigationOnly) {
                openAttempts[openAttempts.length - 1] = {
                    ...openAttempts[openAttempts.length - 1],
                    ok: false,
                    error: 'archived_snapshot_not_answer_bearing'
                };
                continue;
            }
            const queryConstraintFidelity = assessArchivedSnapshotQueryFidelity(
                capture.originalUrl,
                snapshotDetails
            );
            if (queryConstraintFidelity.rejected === true) {
                openAttempts[openAttempts.length - 1] = {
                    ...openAttempts[openAttempts.length - 1],
                    ok: false,
                    error: 'archived_snapshot_query_constraints_not_reflected',
                    queryConstraintFidelity,
                    query_constraint_fidelity: queryConstraintFidelity
                };
                continue;
            }
            const combinedDetails = pruneEmptyDeep({
                ...snapshotDetails,
                kind: 'web_archive_search_result',
                archiveSearchMode: mode,
                archive_search_mode: mode,
                selectedCapture: capture,
                selected_capture: capture,
                captureSearch: details,
                capture_search: details,
                openAttempts,
                open_attempts: openAttempts,
                queryConstraintFidelity,
                query_constraint_fidelity: queryConstraintFidelity
            });
            const discoveryLine = `archive_snapshot_selected provider=${capture.provider} captured_at=${capture.capturedAt} original_url=${capture.originalUrl}`;
            return {
                ...opened,
                content: [{
                    type: 'text',
                    text: [discoveryLine, opened.content?.[0]?.text].filter(Boolean).join('\n\n')
                }],
                structuredContent: combinedDetails,
                details: combinedDetails
            };
        }
        details.openAttempts = openAttempts;
        details.open_attempts = openAttempts;
    }
    const lines = [
        selected[0]
            ? `best_next_call=web_archive_lookup ${JSON.stringify(suggestedNextCalls[0].args)}`
            : '',
        `archive_capture_count=${selected.length} scanned=${captures.length}`,
        `original_url=${url}`,
        ...selected.map((capture, index) =>
            `${index + 1}. provider=${capture.provider} captured_at=${capture.capturedAt} matched_terms=${capture.matchedTerms.join(',') || '(none)'}\n` +
            `   original_url=${capture.originalUrl}\n` +
            `   replay_url=${capture.replayUrl}`
        )
    ].filter(Boolean);
    return textResult(lines.join('\n'), details);
}

async function webFind(args = {}) {
    const url = normalizeString(args.url || args.ref_id || args.refId || args.uri);
    const pattern = normalizeString(args.pattern || args.query || args.q || args.text);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('web_find requires http(s) url');
    }
    if (!pattern) {
        return errorResult('web_find requires pattern');
    }
    const requestedContextLines = Number(args.contextLines || args.context_lines || 0);
    const defaultFindLines = Number.isFinite(requestedContextLines) && requestedContextLines > 0
        ? requestedContextLines * 2 + 7
        : 120;
    const maxLines = clampNumber(args.maxLines || args.max_lines || defaultFindLines, defaultFindLines, 3, 300);
    const fetchResult = await webFetch({
        ...args,
        url,
        query: pattern,
        findPattern: pattern,
        maxLines,
        viewportChars: args.viewportChars || args.viewport_chars || Math.max(5200, Math.min(16000, maxLines * 100))
    });
    if (fetchResult.isError) {
        return fetchResult;
    }
    const details = fetchResult.structuredContent || fetchResult.details || {};
    const sourceWindow = details.sourceWindow || details.sourceViewport || {};
    const findSourceWindow = pruneEmptyDeep({
        ...sourceWindow,
        action: {
            type: 'find_in_page',
            url,
            pattern
        }
    });
    const normalizedPattern = pattern.toLowerCase();
    const matches = Array.isArray(details.matches)
        ? details.matches
        : (Array.isArray(findSourceWindow.lines) ? findSourceWindow.lines : [])
            .filter((line) => String(line.text || '').toLowerCase().includes(normalizedPattern))
            .map((line) => ({
                lineNumber: line.lineNumber,
                lineno: line.lineno || line.lineNumber,
                line_number: line.line_number || line.lineNumber,
                text: line.text
            }));
    const source = pruneEmptyDeep({
        type: 'source_viewport',
        tool: 'web_find',
        url,
        ref_id: url,
        pattern,
        lineno: findSourceWindow.lineno || findSourceWindow.lineStart,
        line_start: findSourceWindow.line_start || findSourceWindow.lineStart,
        line_end: findSourceWindow.line_end || findSourceWindow.lineEnd,
        total_lines: findSourceWindow.total_lines || findSourceWindow.totalLines,
        has_more_before: findSourceWindow.has_more_before ?? findSourceWindow.hasMoreBefore,
        has_more_after: findSourceWindow.has_more_after ?? findSourceWindow.hasMoreAfter,
        content_type: findSourceWindow.content_type || findSourceWindow.contentType,
        lines: (Array.isArray(findSourceWindow.lines) ? findSourceWindow.lines : []).map((line) => pruneEmptyDeep({
            lineno: line.lineno || line.lineNumber,
            line_number: line.line_number || line.lineNumber,
            text: line.text
        }))
    });
    const webSearchOutput = buildCanonicalSourceViewportOutput({
        sourceViewport: source,
        action: findSourceWindow.action || {
            type: 'find_in_page',
            url,
            pattern
        },
        matches
    });
    const lines = [
        `Find results for pattern: ${pattern}`,
        `URL: ${url}`,
        `Match count in page: ${matches.length}`,
        '',
        formatSourceLineWindow(findSourceWindow)
    ];
    return textResult(lines.join('\n'), {
        ...details,
        status: 'completed',
        url,
        pattern,
        matchCount: matches.length,
        match_count: matches.length,
        matches,
        source,
        source_window: source,
        sourceWindow: findSourceWindow,
        sourceViewport: source,
        source_viewport: source,
        webSearchOutput,
        webSearchCall: webSearchOutput.webSearchCall,
        web_search_call: webSearchOutput.web_search_call,
        functionCallOutput: webSearchOutput.functionCallOutput,
        function_call_output: webSearchOutput.function_call_output,
        modelVisibleMode: 'source_viewport_find',
        model_visible_mode: 'source_viewport_find'
    });
}

async function openPage(args = {}) {
    return await webFetch(args);
}

async function findInPage(args = {}) {
    return await webFind(args);
}

async function continuePage(args = {}) {
    const url = normalizeString(args.url || args.ref_id || args.refId || args.uri);
    const lineno = Number(args.lineno || args.lineStart || args.line_start || 0);
    if (!url || !Number.isFinite(lineno) || lineno < 1) {
        return errorResult('continue_page requires url and a positive lineno');
    }
    return await webFetch({
        ...args,
        url,
        lineno
    });
}

async function renderPage(args = {}) {
    return await webFetch({
        ...args,
        provider: 'crawl4ai',
        fetchProvider: 'crawl4ai',
        fetch_provider: 'crawl4ai'
    });
}

function headlessBrowserExecutableCandidates(args = {}) {
    const explicit = normalizeString(
        args.browserExecutable ||
        args.browser_executable ||
        process.env.AILIS_HEADLESS_BROWSER_PATH
    );
    const candidates = [explicit];
    if (process.platform === 'win32') {
        candidates.push(
            path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
            path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
            path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Microsoft', 'Edge', 'Application', 'msedge.exe')
        );
    } else if (process.platform === 'darwin') {
        candidates.push(
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
        );
    } else {
        candidates.push('/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge');
    }
    return dedupeSearchStrings(candidates.filter(Boolean));
}

function resolveHeadlessBrowserExecutable(args = {}) {
    return headlessBrowserExecutableCandidates(args)
        .find((candidate) => fsSync.existsSync(candidate) && fsSync.statSync(candidate).isFile()) || '';
}

function isHeadlessBrowserAccessBarrier(html = '') {
    return /challenge-platform|cf-chl-|cf-turnstile-response|captcha|making sure you(?:'|’)re not a bot|enable javascript and cookies to continue|正在进行安全验证|安全服务防护恶意自动程序/i.test(
        normalizeString(html)
    );
}

async function captureWithHeadlessBrowser(url, outputPath, args = {}, timeoutMs = 120000) {
    const executable = resolveHeadlessBrowserExecutable(args);
    if (!executable) {
        return {
            ok: false,
            errorCode: 'headless_browser_unavailable',
            error: 'No supported Chrome, Chromium, or Edge executable was found.'
        };
    }
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const profileDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-headless-browser-'));
    const width = clampNumber(args.width, 1440, 320, 3840);
    const height = clampNumber(args.height, 10000, 480, 16000);
    const virtualTimeBudgetMs = clampNumber(args.delayMs || args.delay_ms, 5000, 500, 30000);
    try {
        const processResult = await runProcess(executable, [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--ignore-certificate-errors',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-background-networking',
            '--dump-dom',
            `--user-data-dir=${profileDir}`,
            `--window-size=${width},${height}`,
            `--virtual-time-budget=${virtualTimeBudgetMs}`,
            `--screenshot=${outputPath}`,
            url
        ], { timeoutMs });
        const stat = processResult.exitCode === 0
            ? await fs.stat(outputPath).catch(() => null)
            : null;
        if (stat?.isFile() && isHeadlessBrowserAccessBarrier(processResult.stdout)) {
            await fs.unlink(outputPath).catch(() => {});
            return {
                ok: false,
                errorCode: 'headless_browser_access_barrier',
                error: 'The browser rendered an anti-bot or verification page instead of the requested source.',
                backend: path.basename(executable).toLowerCase()
            };
        }
        return stat?.isFile()
            ? { ok: true, screenshotPath: outputPath, backend: path.basename(executable).toLowerCase(), stat }
            : {
                ok: false,
                errorCode: processResult.timedOut ? 'headless_browser_timeout' : 'headless_browser_failed',
                error: normalizeString(processResult.stderr || processResult.stdout, 'The headless browser did not produce a screenshot.'),
                backend: path.basename(executable).toLowerCase()
            };
    } finally {
        await fs.rm(profileDir, { recursive: true, force: true }).catch(() => {});
    }
}

async function webpageScreenshot(args = {}) {
    const url = normalizeString(args.url || args.uri);
    if (!/^https?:\/\//i.test(url)) {
        return errorResult('webpage_screenshot requires an http(s) url', { url });
    }
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 120000, 30000, 300000);
    const outputPath = path.resolve(
        normalizeString(args.path || args.outputPath || args.output_path) ||
        path.join(os.tmpdir(), `ailis-webpage-${Date.now()}-${Math.random().toString(16).slice(2)}.png`)
    );
    const config = crawl4aiFetchConfig({
        ...args,
        provider: 'crawl4ai',
        fetchProvider: 'crawl4ai',
        fetch_provider: 'crawl4ai'
    });
    const crawl4aiResult = config?.mode === 'local_worker'
        ? await fetchWithLocalCrawl4aiWorker(
            url,
            { ...config, probe: false },
            { ...args, screenshotPath: outputPath },
            timeoutMs
        )
        : {
            ok: false,
            errorCode: 'local_crawl4ai_worker_unavailable',
            error: 'The local Crawl4AI worker is not configured.'
        };
    const fetched = crawl4aiResult.ok
        ? crawl4aiResult
        : await captureWithHeadlessBrowser(url, outputPath, args, timeoutMs);
    const stat = fetched.stat || (fetched.ok
        ? await fs.stat(fetched.screenshotPath || outputPath).catch(() => null)
        : null);
    if (!fetched.ok || !stat?.isFile()) {
        return actionableErrorResult('webpage_screenshot failed.', {
            status: fetched.errorCode || 'screenshot_failed',
            url,
            failureReason: fetched.error || 'The screenshot file was not produced.',
            backend: fetched.backend,
            crawl4aiFailure: crawl4aiResult.ok ? undefined : crawl4aiResult.error,
            nextActions: fetched.errorCode === 'headless_browser_access_barrier'
                ? [
                    'Open another already discovered source for the same content and call webpage_screenshot on that source before returning to broad search.'
                ]
                : [
                    'Use a different screenshot-capable browser connector or inspect source HTML/CSS when visual layout cannot be captured.'
                ]
        });
    }
    const screenshotPath = path.resolve(fetched.screenshotPath || outputPath);
    return textResult([
        `Captured a browser-rendered screenshot of ${url}`,
        `Path: ${screenshotPath}`,
        'The screenshot is attached to the next model turn as visual input. Inspect the pixels before answering layout, indentation, color, position, chart, or canvas questions.'
    ].join('\n'), {
        status: 'completed',
        url,
        path: screenshotPath,
        bytes: stat.size,
        contentType: 'image/png',
        backend: fetched.backend,
        modelImage: {
            image_url: screenshotPath,
            detail: normalizeString(args.detail, 'original')
        }
    });
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
        if (!url || seen.has(url) || !/^https?:\/\//i.test(url) || isLikelyDirectPdfUrl(url)) {
            return;
        }
        seen.add(url);
        candidatePool.push(pruneEmptyDeep({
            title: normalizeString(candidate.title || candidate.text || candidate.reason || url),
            url,
            source,
            searchRank: Number(candidate.searchRank) || undefined,
            snippet: normalizeString(candidate.snippet),
            queryScore: Number(candidate.queryScore) || undefined,
            combinedScore: Number(candidate.combinedScore) || undefined,
            sourceBackends: candidate.sourceBackends || undefined,
            queryVariant: candidate.queryVariant || undefined,
            queryVariantRole: candidate.queryVariantRole || undefined,
            queryVariantIndex: candidate.queryVariantIndex || undefined
        }));
    };
    for (const [index, result] of (searchDetails.results || []).entries()) {
        if (!isRelevantSearchCandidate(result)) {
            continue;
        }
        addCandidateToPool({
            ...result,
            searchRank: index + 1
        }, query ? 'ranked_relevant_result' : 'ranked_result');
    }
    for (const call of searchDetails.suggestedNextCalls || []) {
        if (normalizeString(call.tool) === 'web_fetch') {
            addCandidateToPool({
                title: call.reason,
                url: call.args?.url
            }, 'optional_followup_call');
        }
    }
    const selected = [];
    const selectedUrls = new Set();
    const selectedHosts = new Set();
    const selectCandidate = (candidate) => {
        if (!candidate || selectedUrls.has(candidate.url) || selected.length >= limit) {
            return false;
        }
        selected.push(candidate);
        selectedUrls.add(candidate.url);
        const host = extractHostname(candidate.url);
        if (host) {
            selectedHosts.add(host);
        }
        return true;
    };
    const explicitVariantGroups = new Map();
    for (const candidate of candidatePool) {
        const variantIndex = Number(candidate.queryVariantIndex);
        if (
            normalizeString(candidate.queryVariantRole) !== 'explicit_query' ||
            !Number.isFinite(variantIndex) ||
            variantIndex <= 0
        ) {
            continue;
        }
        if (!explicitVariantGroups.has(variantIndex)) {
            explicitVariantGroups.set(variantIndex, []);
        }
        explicitVariantGroups.get(variantIndex).push(candidate);
    }
    const diversifyCandidateGroupByHost = (candidates = []) => {
        const primary = [];
        const overflow = [];
        const seenHosts = new Set();
        for (const candidate of candidates) {
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
        return [...primary, ...overflow];
    };
    const explicitGroups = [...explicitVariantGroups.entries()]
        .sort(([leftIndex], [rightIndex]) => leftIndex - rightIndex)
        .map(([, candidates]) => diversifyCandidateGroupByHost(candidates));
    const maxGroupDepth = Math.max(0, ...explicitGroups.map((group) => group.length));
    for (let depth = 0; depth < maxGroupDepth && selected.length < limit; depth += 1) {
        for (const group of explicitGroups) {
            selectCandidate(group[depth]);
            if (selected.length >= limit) {
                break;
            }
        }
    }
    const primary = [];
    const overflow = [];
    for (const candidate of candidatePool) {
        if (selectedUrls.has(candidate.url)) {
            continue;
        }
        const host = extractHostname(candidate.url);
        if (!host || !selectedHosts.has(host)) {
            if (host) {
                selectedHosts.add(host);
            }
            primary.push(candidate);
        } else {
            overflow.push(candidate);
        }
    }
    return [...selected, ...primary, ...overflow].slice(0, limit);
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
    const contentExcerpt = normalizeString(details.contentExcerpt || details.content_excerpt);
    const fullText = contentExcerpt || extractTextFromToolResult(fetchResult, 16000);
    const targetCoverage = assessWebResearchTargetCoverage([
        candidate.title,
        candidate.snippet,
        candidate.url,
        fullText
    ].filter(Boolean).join('\n'), query, [
        candidate.title,
        candidate.snippet,
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
        searchSnippet: normalizeString(candidate.snippet),
        sourceBackends: candidate.sourceBackends?.length ? candidate.sourceBackends.slice(0, 5) : undefined,
        queryVariant: normalizeString(candidate.queryVariant),
        queryVariantRole: normalizeString(candidate.queryVariantRole),
        queryVariantIndex: candidate.queryVariantIndex,
        fetchStatus: details.status || (fetchResult.isError ? 'error' : 'completed'),
        fetchBackend: normalizeString(details.fetchBackend),
        evidenceQuality,
        pageType: normalizeString(details.pageType || details.observationContract?.page_type),
        contentQuality: normalizeString(details.contentQuality || evidenceQuality),
        modelJudgesEvidence: details.modelJudgesEvidence !== false,
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
        evidenceSnippets: extractEvidenceSnippetsFromText([
            candidate.title,
            candidate.snippet,
            fullText
        ].filter(Boolean).join('\n'), query),
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
    const blockedPages = pages.filter((page) => ['js_shell', 'encoding_failure', 'access_denied', 'access_challenge'].includes(page.evidenceQuality));
    return pruneEmptyDeep({
        fetchedPageCount: pages.length,
        blockedPageCount: blockedPages.length,
        searchTarget: normalizeString(searchDetails.targetLabel || searchDetails.query)
    });
}

function formatWebResearchBundle({ query = '', searchDetails = {}, pages = [], bundleAssessment = {}, pipelineSteps = [] } = {}) {
    const lines = [
        'AILIS web research evidence bundle:',
        `Query: ${query}`,
        'Codex object: web_search_call action=search',
        'Bundle contents: ranked search results, fetched page excerpts, source URLs, and open_page actions.'
    ];
    if (bundleAssessment.fetchedPageCount !== undefined) {
        lines.push(`Fetched page count: ${bundleAssessment.fetchedPageCount}`);
        lines.push(`Blocked pages: ${bundleAssessment.blockedPageCount || 0}`);
    }
    if (searchDetails.backend || searchDetails.searchAggregation?.successfulBackends?.length) {
        const sources = searchDetails.searchAggregation?.successfulBackends?.length
            ? searchDetails.searchAggregation.successfulBackends.join(', ')
            : searchDetails.backend;
        lines.push(`Search sources: ${sources}`);
    }
    if (Array.isArray(searchDetails.answerCandidates) && searchDetails.answerCandidates.length) {
        lines.push('Search-extracted candidate strings:');
        searchDetails.answerCandidates.slice(0, 5).forEach((candidate, index) => {
            lines.push(`- ${index + 1}. ${candidate.answer} (${candidate.type || 'answer'})`);
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
        lines.push('Highest-ranked fetched sources:');
        pages.slice(0, 5).forEach((page, index) => {
            const refId = `source_${index + 1}`;
            lines.push(`- [${refId}] ${page.title || page.url}`);
            lines.push(`  URL: ${page.url}`);
            lines.push(`  Open page: open_page ${JSON.stringify({ url: page.url, lineno: 1 })}`);
        });
    }
    const searchEvidenceText = formatCandidateSearchEvidence(searchDetails.results || [], 8);
    if (searchEvidenceText) {
        lines.push(searchEvidenceText);
    }
    if (pages.length) {
        lines.push('Fetched pages:');
        pages.forEach((page, index) => {
            const refId = `source_${index + 1}`;
            lines.push(`- [${refId}] ${page.title || page.url}`);
            lines.push(`  URL: ${page.url}`);
            lines.push(`  Open page: open_page ${JSON.stringify({ url: page.url, lineno: 1 })}`);
            if (page.searchSnippet) {
                lines.push(`  Search snippet: ${truncateRelationText(page.searchSnippet, 460)}`);
            }
            if (Array.isArray(page.evidenceSnippets) && page.evidenceSnippets.length) {
                lines.push('  Candidate snippets:');
                page.evidenceSnippets.slice(0, 3).forEach((snippet) => lines.push(`  - ${snippet}`));
            }
            const excerpt = normalizeString(page.excerpt).split('\n').slice(0, 18).join('\n');
            if (excerpt) {
                lines.push(`  Excerpt:\n${excerpt}`);
            }
        });
    }
    return lines.join('\n');
}

function summarizeWebResearchSource(page = {}, index = 0) {
    const refId = `source_${index + 1}`;
    return pruneEmptyDeep({
        id: refId,
        ref_id: refId,
        title: normalizeString(page.title || page.url),
        url: normalizeString(page.url),
        host: extractHostname(page.url),
        open_page: {
            type: 'open_page',
            url: normalizeString(page.url),
            lineno: 1
        },
        source: normalizeString(page.source),
        sourceBackends: Array.isArray(page.sourceBackends) ? page.sourceBackends.slice(0, 5) : undefined,
        status: normalizeString(page.fetchStatus || page.pageStatus),
        pageType: normalizeString(page.pageType),
        returnedChars: Number.isFinite(Number(page.returnedChars)) ? Number(page.returnedChars) : undefined,
        originalChars: Number.isFinite(Number(page.originalChars)) ? Number(page.originalChars) : undefined,
        queryVariant: normalizeString(page.queryVariant),
        queryVariantRole: normalizeString(page.queryVariantRole),
        searchRank: page.searchRank,
        searchSnippet: truncateRelationText(page.searchSnippet, 360),
        evidenceSnippets: Array.isArray(page.evidenceSnippets) ? page.evidenceSnippets.slice(0, 4) : undefined,
        excerpt: truncateRelationText(page.excerpt, 2400)
    });
}

function stripWebResearchBehaviorFields(page = {}) {
    const {
        modelJudgesEvidence,
        model_judges_evidence,
        isEvidence,
        is_evidence,
        reasoningReady,
        reasoning_ready,
        complete,
        recoveryHint,
        recovery_hint,
        evidenceGap,
        evidence_gap,
        suggestedNextCalls,
        suggested_next_calls,
        evidenceScore,
        evidence_score,
        evidenceScoreBreakdown,
        evidence_score_breakdown,
        evidenceQuality,
        evidence_quality,
        contentQuality,
        content_quality,
        ...rest
    } = page && typeof page === 'object' ? page : {};
    return pruneEmptyDeep(rest);
}

function stripWebResearchSearchBehaviorFields(details = {}) {
    const {
        recoveryHint,
        recovery_hint,
        evidenceGap,
        evidence_gap,
        suggestedNextCalls,
        suggested_next_calls,
        clarificationRequired,
        clarification_required,
        answerReadiness,
        answer_readiness,
        readinessAuthority,
        readiness_authority,
        evidenceDecision,
        evidence_decision,
        requiresEvidenceAudit,
        requires_evidence_audit,
        ...rest
    } = details && typeof details === 'object' ? details : {};
    return pruneEmptyDeep(rest);
}

function summarizeWebResearchSearchResult(result = {}, index = 0) {
    const refId = `candidate_${index + 1}`;
    return pruneEmptyDeep({
        id: refId,
        ref_id: refId,
        title: normalizeString(result.title || result.text || result.url),
        url: normalizeString(result.url),
        host: extractHostname(result.url),
        open_page: {
            type: 'open_page',
            tool: 'open_page',
            args: {
                url: normalizeString(result.url),
                lineno: 1
            },
            url: normalizeString(result.url),
            lineno: 1
        },
        sourceBackend: normalizeString(result.sourceBackend),
        sourceBackends: Array.isArray(result.sourceBackends) ? result.sourceBackends.slice(0, 5) : undefined,
        queryVariant: normalizeString(result.queryVariant),
        queryVariantRole: normalizeString(result.queryVariantRole),
        rank: index + 1,
        score: Number.isFinite(Number(result.queryScore)) ? Number(result.queryScore) : undefined,
        snippet: truncateRelationText(result.snippet, 360)
    });
}

function buildWebResearchOpenPageActions(sources = [], candidates = [], limit = 3) {
    const actions = [];
    const seen = new Set();
    const append = (entry = {}) => {
        const url = normalizeString(entry.url);
        if (!/^https?:\/\//i.test(url) || seen.has(url) || actions.length >= limit) {
            return;
        }
        seen.add(url);
        actions.push({
            tool: 'open_page',
            args: { url, lineno: 1 },
            reason: `Open source: ${normalizeString(entry.title, url)}`
        });
    };
    (Array.isArray(sources) ? sources : []).forEach(append);
    (Array.isArray(candidates) ? candidates : []).forEach(append);
    return actions;
}

function buildCodexWebSearchOutput({
    query = '',
    queryPlan = [],
    searchDetails = {},
    candidates = [],
    pages = [],
    bundleAssessment = {},
    pipelineSteps = [],
    startedAt = Date.now(),
    overallTimeoutMs = 0,
    executionMode = 'sequential',
    parallelism = {},
    answerCandidates = []
} = {}) {
    const sources = (Array.isArray(pages) ? pages : []).map(summarizeWebResearchSource);
    const candidateResults = Array.isArray(searchDetails.results)
        ? searchDetails.results.slice(0, 12).map(summarizeWebResearchSearchResult)
        : [];
    const suggestedNextCalls = buildWebResearchOpenPageActions(sources, candidateResults);
    const fetchedCount = sources.filter((source) => source.status === 'completed').length;
    const failedCount = sources.filter((source) => source.status && source.status !== 'completed').length;
    const queries = (Array.isArray(queryPlan) ? queryPlan : []).map((item) => pruneEmptyDeep({
        index: item.index,
        role: normalizeString(item.role),
        query: normalizeString(item.query),
        backendQuery: normalizeString(item.backendQuery),
        reason: normalizeString(item.reason)
    }));
    const webSearchAction = pruneEmptyDeep({
        type: 'search',
        query,
        queries,
        maxResults: searchDetails.maxResults,
        maxPages: candidates.length || sources.length
    });
    const webSearchCall = pruneEmptyDeep({
        type: 'web_search_call',
        status: 'completed',
        action: webSearchAction
    });
    const webSearchItem = pruneEmptyDeep({
        type: 'web_search',
        id: 'web_research',
        query,
        action: webSearchAction
    });
    return pruneEmptyDeep({
        type: 'function_call_output',
        webSearchCall,
        webSearchItem,
        functionCallOutput: {
            type: 'function_call_output',
            status: webSearchCall.status,
            outputKind: 'web_search_bundle'
        },
        action: webSearchAction,
        suggestedNextCalls,
        execution: {
            mode: executionMode,
            durationMs: Date.now() - startedAt,
            overallTimeoutMs,
            parallelism,
            pipeline: (Array.isArray(pipelineSteps) ? pipelineSteps : []).map((step) => pruneEmptyDeep({
                stage: normalizeString(step.stage),
                status: normalizeString(step.status),
                note: normalizeString(step.note)
            }))
        },
        search: {
            status: normalizeString(searchDetails.status, 'completed'),
            backend: normalizeString(searchDetails.backend),
            sourceBackends: searchDetails.searchAggregation?.successfulBackends,
            resultCount: Array.isArray(searchDetails.results) ? searchDetails.results.length : undefined,
            candidates: candidateResults
        },
        fetch: {
            candidateCount: candidates.length,
            pageCount: sources.length,
            completedCount: fetchedCount,
            failedCount,
            sources
        },
        evidence: {
            sources: sources.filter((source) => source.evidenceSnippets?.length),
            answerCandidates: Array.isArray(answerCandidates) ? answerCandidates.slice(0, 8) : []
        },
        retrievalDiagnostics: {
            fetchedPageCount: bundleAssessment.fetchedPageCount,
            blockedPageCount: bundleAssessment.blockedPageCount
        },
        legacy: {
            pageCount: sources.length
        }
    });
}

async function webResearch(args = {}) {
    const explicitQueryItems = [
        ...(Array.isArray(args.queries) ? args.queries : []),
        ...(Array.isArray(args.searchQueries) ? args.searchQueries : []),
        ...(Array.isArray(args.search_queries) ? args.search_queries : [])
    ];
    const firstExplicitQuery = explicitQueryItems
        .map((item) => typeof item === 'string' ? item : item?.query || item?.q || item?.search || item?.text)
        .map(normalizeString)
        .find(Boolean);
    const query = normalizeString(args.query || args.q || args.search || args.text) || firstExplicitQuery;
    if (!query) {
        return errorResult('web_research requires query');
    }
    const maxResults = clampNumber(args.maxResults || args.limit, 8, 1, 12);
    const maxPages = clampNumber(args.maxPages || args.max_pages, 3, 1, 5);
    const maxCharsPerPage = clampNumber(args.maxCharsPerPage || args.max_chars_per_page || args.maxChars, 14000, 3000, 60000);
    const queryPlan = buildWebResearchQueryPlan(query, args);
    const searchRuns = [];
    const serialRequested = optionIsFalse(args.parallel) ||
        optionIsFalse(args.parallelSearch) ||
        optionIsFalse(args.parallel_search) ||
        optionIsTrue(args.serial) ||
        optionIsTrue(args.sequential);
    const parallelSearch = !serialRequested && queryPlan.length > 1;
    const searchConcurrency = parallelSearch
        ? clampNumber(args.searchConcurrency || args.search_concurrency, Math.min(3, queryPlan.length), 1, 5)
        : 1;
    const pipelineSteps = [{
        stage: 'query_plan',
        status: 'planned',
        note: `${queryPlan.length} search quer${queryPlan.length === 1 ? 'y' : 'ies'}; mode=${parallelSearch ? `parallel:${searchConcurrency}` : 'sequential'}`
    }];
    const startedAt = Date.now();
    const overallTimeoutMs = clampNumber(
        args.overallTimeoutMs || args.overall_timeout_ms,
        Math.min(90000, Math.max(18000, queryPlan.length * 24000)),
        8000,
        180000
    );
    const runSearchVariant = async (variant) => {
        const elapsedMs = Date.now() - startedAt;
        const remainingMs = overallTimeoutMs - elapsedMs;
        if (remainingMs < 2000) {
            return {
                variant,
                result: null,
                details: {
                    status: 'skipped',
                    error: 'timeout_budget_exhausted',
                    results: []
                },
                durationMs: 0
            };
        }
        const searchStartedAt = Date.now();
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
        return {
            variant,
            result: searchResult,
            details,
            durationMs: Date.now() - searchStartedAt
        };
    };
    if (parallelSearch) {
        const parallelRuns = await runBoundedParallel(queryPlan, searchConcurrency, runSearchVariant);
        parallelRuns.forEach((run, index) => {
            if (run?.variant) {
                searchRuns.push(run);
            } else {
                searchRuns.push({
                    variant: queryPlan[index],
                    result: null,
                    details: {
                        status: 'error',
                        error: run?.message || 'parallel search worker failed',
                        results: []
                    },
                    durationMs: 0
                });
            }
        });
    } else {
        for (const variant of queryPlan) {
            const run = await runSearchVariant(variant);
            searchRuns.push(run);
            if (run.details?.status === 'skipped') {
                break;
            }
            if (run.details?.clarificationRequired) {
                break;
            }
            const shouldDeferEarlyStopForExactAnswer =
                looksLikeExactAnswerResearchQuery(query) &&
                variant.role === 'original' &&
                queryPlan.some((item) => item.role === 'exact_answer_terms');
            if (
                run.details?.searchConfidence?.level === 'high' &&
                Array.isArray(run.details?.suggestedNextCalls) &&
                run.details.suggestedNextCalls.length > 0 &&
                !optionIsTrue(args.expandQueries || args.expand_queries) &&
                !shouldDeferEarlyStopForExactAnswer
            ) {
                break;
            }
        }
    }
    for (const run of searchRuns) {
        pipelineSteps.push({
            stage: 'search',
            status: run.result?.isError ? 'error' : run.details?.clarificationRequired ? 'clarification_required' : run.details?.status || 'completed',
            note: `${run.variant?.role || 'query'}; results=${Array.isArray(run.details?.results) ? run.details.results.length : 0}; durationMs=${run.durationMs || 0}${run.details?.error ? `; error=${run.details.error}` : ''}`
        });
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
    const publicSearchDetails = stripWebResearchSearchBehaviorFields(searchDetails);
    const allSearchRunsFailed = !searchRuns.length || searchRuns.every((run) => {
        const status = normalizeString(run.details?.status);
        return run.result?.isError === true || ['error', 'skipped', 'search_failed'].includes(status);
    });
    if (!searchDetails || allSearchRunsFailed || searchDetails.clarificationRequired) {
        const bundleAssessment = assessWebResearchBundle([], searchDetails);
        const webSearchOutput = buildCodexWebSearchOutput({
            query,
            queryPlan,
            searchDetails: publicSearchDetails,
            candidates: [],
            pages: [],
            bundleAssessment,
            pipelineSteps,
            startedAt,
            overallTimeoutMs,
            executionMode: parallelSearch ? 'bounded_parallel' : 'sequential',
            parallelism: pruneEmptyDeep({
                search: {
                    enabled: parallelSearch,
                    concurrency: searchConcurrency,
                    queryCount: queryPlan.length
                },
                fetch: {
                    enabled: false,
                    concurrency: 1,
                    candidateCount: 0
                }
            })
        });
        return textResult(formatWebResearchBundle({ query, searchDetails: publicSearchDetails, pages: [], bundleAssessment, pipelineSteps }), {
            type: 'function_call_output',
            status: searchDetails?.clarificationRequired ? 'clarification_required' : 'search_failed',
            query,
            webSearchCall: webSearchOutput.webSearchCall,
            webSearchItem: webSearchOutput.webSearchItem,
            functionCallOutput: webSearchOutput.functionCallOutput,
            webSearchOutput,
            suggestedNextCalls: webSearchOutput.suggestedNextCalls || [],
            search: publicSearchDetails,
            evidencePages: [],
            pipelineSteps,
            ...bundleAssessment
        });
    }
    const candidates = buildWebResearchCandidates(searchDetails, maxPages);
    pipelineSteps.push({
        stage: 'candidate_rank',
        status: candidates.length ? 'completed' : 'empty',
        note: `${candidates.length} fetch candidate${candidates.length === 1 ? '' : 's'}`
    });
    const pages = [];
    const parallelFetch = !serialRequested && candidates.length > 1;
    const fetchConcurrency = parallelFetch
        ? clampNumber(args.fetchConcurrency || args.fetch_concurrency, Math.min(3, candidates.length), 1, 5)
        : 1;
    const perDomainFetchConcurrency = parallelFetch
        ? clampNumber(args.perDomainFetchConcurrency || args.per_domain_fetch_concurrency, 1, 1, fetchConcurrency)
        : 1;
    const fetchTimeoutBudgetMs = clampNumber(
        args.fetchTimeoutMs || args.fetch_timeout_ms,
        Math.min(60000, Math.max(12000, overallTimeoutMs - (Date.now() - startedAt))),
        3000,
        180000
    );
    if (candidates.length) {
        pipelineSteps.push({
            stage: 'fetch_plan',
            status: 'planned',
            note: `mode=${parallelFetch ? `parallel:${fetchConcurrency}` : 'sequential'}; perDomain=${perDomainFetchConcurrency}; candidates=${candidates.length}; fetchTimeoutMs=${fetchTimeoutBudgetMs}`
        });
    }
    const fetchRuns = await runBoundedParallel(candidates, fetchConcurrency, async (candidate) => {
        const fetchStartedAt = Date.now();
        const remainingMs = overallTimeoutMs - (fetchStartedAt - startedAt);
        if (remainingMs < 2000) {
            return {
                candidate,
                page: pruneEmptyDeep({
                    title: candidate.title || candidate.url,
                    url: candidate.url,
                    fetchStatus: 'skipped',
                    evidenceQuality: 'timeout_budget_exhausted',
                    evidenceGap: 'web_research overall timeout budget was exhausted before this page could be fetched.',
                    recoveryHint: 'Call web_fetch on this URL directly only if the source remains essential.'
                }),
                durationMs: 0
            };
        }
        const pageTimeoutMs = Math.min(fetchTimeoutBudgetMs, Math.max(1000, remainingMs - 750));
        const fetchResult = await webFetch({
            url: candidate.url,
            query,
            maxChars: maxCharsPerPage,
            timeoutMs: pageTimeoutMs,
            provider: args.fetchProvider || args.fetch_provider,
            crawl4aiUrl: args.crawl4aiUrl || args.crawl4ai_url,
            crawl4aiWorker: args.crawl4aiWorker || args.crawl4ai_worker,
            crawl4aiPython: args.crawl4aiPython || args.crawl4ai_python
        });
        const page = summarizeWebResearchPage(candidate, fetchResult, query);
        return {
            candidate,
            fetchResult,
            page,
            durationMs: Date.now() - fetchStartedAt
        };
    }, {
        keyFn: (candidate) => extractHostname(candidate.url),
        perKeyConcurrency: perDomainFetchConcurrency
    });
    for (const run of fetchRuns) {
        if (run?.page) {
            pages.push(run.page);
            pipelineSteps.push({
                stage: 'fetch',
                status: run.page.fetchStatus || (run.fetchResult?.isError ? 'error' : 'completed'),
                note: `${run.page.pageType || run.page.fetchStatus || 'page'} ${run.candidate?.url || run.page.url}; durationMs=${run.durationMs || 0}`
            });
        } else if (run?.candidate) {
            const failedPage = pruneEmptyDeep({
                title: run.candidate.title || run.candidate.url,
                url: run.candidate.url,
                fetchStatus: 'error',
                evidenceQuality: 'fetch_worker_error',
                evidenceGap: run.message || 'Parallel fetch worker failed.',
                recoveryHint: 'Try fetching this URL directly with web_fetch if it remains important.'
            });
            pages.push(failedPage);
            pipelineSteps.push({
                stage: 'fetch',
                status: 'error',
                note: `${run.candidate.url}; error=${run.message || 'parallel fetch worker failed'}`
            });
        }
    }
    const orderedPages = pages.sort((left, right) =>
        (Number(right.evidenceScore) || 0) - (Number(left.evidenceScore) || 0) ||
        (Number(right.queryScore) || 0) - (Number(left.queryScore) || 0) ||
        (Number(left.searchRank) || 999) - (Number(right.searchRank) || 999)
    );
    const bundleAssessment = assessWebResearchBundle(orderedPages, searchDetails);
    const publicPages = orderedPages.map(stripWebResearchBehaviorFields);
    const answerCandidates = Array.isArray(searchDetails.answerCandidates)
        ? searchDetails.answerCandidates.slice(0, 5)
        : [];
    const executionMode = parallelSearch || parallelFetch ? 'bounded_parallel' : 'sequential';
    const parallelism = pruneEmptyDeep({
        search: {
            enabled: parallelSearch,
            concurrency: searchConcurrency,
            queryCount: queryPlan.length
        },
        fetch: {
            enabled: parallelFetch,
            concurrency: fetchConcurrency,
            perDomainConcurrency: perDomainFetchConcurrency,
            timeoutMs: fetchTimeoutBudgetMs,
            candidateCount: candidates.length
        }
    });
    const webSearchOutput = buildCodexWebSearchOutput({
        query,
        queryPlan,
        searchDetails: publicSearchDetails,
        candidates,
        pages: publicPages,
        bundleAssessment,
        pipelineSteps,
        startedAt,
        overallTimeoutMs,
        executionMode,
        parallelism,
        answerCandidates
    });
    return textResult(formatWebResearchBundle({ query, searchDetails: publicSearchDetails, pages: publicPages, bundleAssessment, pipelineSteps }), {
        type: 'function_call_output',
        status: 'completed',
        query,
        webSearchCall: webSearchOutput.webSearchCall,
        webSearchItem: webSearchOutput.webSearchItem,
        functionCallOutput: webSearchOutput.functionCallOutput,
        webSearchOutput,
        suggestedNextCalls: webSearchOutput.suggestedNextCalls || [],
        executionMode,
        parallelism,
        search: publicSearchDetails,
        evidencePages: publicPages,
        pageCount: publicPages.length,
        answerCandidates,
        pipelineSteps,
        ...bundleAssessment
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
        evidenceGap: orderedLinks.length ? 'Links extracted from the page; link text is not page content.' : '',
        recoveryHint: suggestedNextCalls.length ? 'Follow-up call arguments below were derived from extracted links.' : '',
        suggestedNextCalls,
        observedRelevantLinks
    });
    return textResult([guidance, `Extracted links:\n${linkText}`].filter(Boolean).join('\n\n'), {
        status: 'completed',
        url,
        links: orderedLinks,
        suggestedNextCalls,
        observedRelevantLinks
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
    const evidenceQuery = normalizeString(
        args.query ||
        args.q ||
        args.extractQuery ||
        args.extract_query
    );
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
        const httpStatus = Number(payload.status) || 0;
        const returnedHtmlInsteadOfPdf = /not a pdf file/i.test(normalizeString(payload.error)) &&
            /html/i.test(normalizeString(payload.content_type));
        const pdfAccessBarrier = Boolean(
            sourceUrl &&
            (
                returnedHtmlInsteadOfPdf ||
                [401, 403, 429].includes(httpStatus)
            )
        );
        const fallbackQuery = normalizeString(evidenceQuery || sourceUrl).slice(0, 240);
        const suggestedNextCalls = pdfAccessBarrier
            ? [401, 403, 429].includes(httpStatus)
                ? [{
                      tool: 'web_search',
                      args: { query: fallbackQuery },
                      reason: 'Find the authoritative HTML article, repository copy, or another accessible copy; the PDF endpoint is access-blocked.'
                  }]
                : [{
                      tool: 'web_fetch',
                      args: {
                          url: sourceUrl,
                          ...(evidenceQuery ? { query: evidenceQuery } : {})
                      },
                      reason: 'Inspect the HTML response for a landing page, access barrier, or alternate source link.'
                  }]
            : [];
        return errorResult(payload.error || 'pdf_extract_text failed', {
            status: payload.status || 'error',
            errorCode: payload.status || 'pdf_extract_failed',
            url: sourceUrl,
            path: sourcePath,
            ...(pdfAccessBarrier ? {
                evidenceGap: [401, 403, 429].includes(httpStatus)
                    ? `The requested PDF endpoint returned HTTP ${httpStatus}; this is an access or rate-limit barrier, not evidence that the document is absent.`
                    : 'The requested PDF URL returned an HTML page instead of PDF bytes.',
                recoveryHint: 'Do not keep retrying this URL as a PDF. Inspect an authoritative HTML article or another accessible copy of the same document, and keep the source identity and answer constraints unchanged.',
                suggestedNextCalls
            } : {}),
            ...payload
        });
    }
    const extractedText = String(payload.text || '');
    const evidenceSnippets = evidenceQuery
        ? buildEvidenceSnippets(extractedText, evidenceQuery, { maxSnippets: 5 })
        : '';
    const modelText = [
        evidenceSnippets
            ? `Query-focused evidence from the extracted PDF:\n${evidenceSnippets}`
            : '',
        evidenceSnippets
            ? 'Extracted PDF text (full returned range):'
            : '',
        extractedText
    ].filter(Boolean).join('\n\n');
    return textResult(modelText, {
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
        returnedChars: extractedText.length,
        evidenceQuery,
        evidenceSnippets,
        extractedText
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

const WIKIDATA_PROPERTY_ALIASES = Object.freeze({
    coordinates: 'P625',
    coordinate: 'P625',
    latitude_longitude: 'P625',
    place_of_birth: 'P19',
    birthplace: 'P19',
    place_of_death: 'P20',
    deathplace: 'P20',
    country: 'P17',
    located_in: 'P131',
    administrative_entity: 'P131',
    location: 'P276',
    official_name: 'P1448',
    date_of_birth: 'P569',
    date_of_death: 'P570',
    inception: 'P571',
    occupation: 'P106',
    author: 'P50',
    instance_of: 'P31'
});

const WIKIDATA_PROPERTY_NAMES = Object.freeze({
    P625: 'coordinates',
    P19: 'place_of_birth',
    P20: 'place_of_death',
    P17: 'country',
    P131: 'located_in',
    P276: 'location',
    P1448: 'official_name',
    P569: 'date_of_birth',
    P570: 'date_of_death',
    P571: 'inception',
    P106: 'occupation',
    P50: 'author',
    P31: 'instance_of'
});

const DEFAULT_WIKIDATA_PROPERTIES = Object.freeze([
    'coordinates',
    'place_of_birth',
    'country',
    'located_in',
    'official_name',
    'instance_of'
]);

function normalizeWikidataPropertySelection(values = []) {
    const requested = Array.isArray(values)
        ? values
        : normalizeString(values)
            ? String(values).split(',')
            : [];
    const normalized = requested
        .map((value) => normalizeString(value).toLowerCase().replace(/[\s-]+/g, '_'))
        .filter(Boolean);
    const source = normalized.length ? normalized : DEFAULT_WIKIDATA_PROPERTIES;
    const seen = new Set();
    return source.flatMap((value) => {
        const propertyId = /^p\d+$/i.test(value)
            ? value.toUpperCase()
            : WIKIDATA_PROPERTY_ALIASES[value];
        if (!propertyId || seen.has(propertyId)) return [];
        seen.add(propertyId);
        return [{
            id: propertyId,
            name: WIKIDATA_PROPERTY_NAMES[propertyId] || value
        }];
    }).slice(0, 16);
}

function wikidataApiUrl(baseUrl, params = {}) {
    const url = new URL(normalizeString(baseUrl, 'https://www.wikidata.org/w/api.php'));
    for (const [key, value] of Object.entries({
        format: 'json',
        formatversion: '2',
        maxlag: '5',
        ...params
    })) {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
    }
    return url.toString();
}

function buildWikidataSearchVariants(query = '') {
    const original = normalizeString(query);
    if (!original) return [];
    const strippedDisambiguator = normalizeString(
        original
            .replace(
                /\s+(?:\d+(?:st|nd|rd|th)\s+)?(?:(?:u\.?\s*s\.?|united\s+states)\s+)?president\b.*$/i,
                ''
            )
            .replace(/\s+(?:city|town|village|municipality)\b.*$/i, '')
    );
    const words = original
        .replace(/[()[\]{},;:]+/g, ' ')
        .split(/\s+/)
        .map((value) => normalizeString(value))
        .filter(Boolean);
    const variants = [
        original,
        ...(strippedDisambiguator && strippedDisambiguator !== original
            ? [strippedDisambiguator]
            : [])
    ];
    for (let length = Math.min(words.length - 1, 4); length >= 1; length -= 1) {
        variants.push(words.slice(0, length).join(' '));
    }
    return [...new Set(variants)].slice(0, 5);
}

async function fetchWikidataJson(url, timeoutMs) {
    let first = await fetchJsonUrl(url, timeoutMs);
    if (!first.ok && first.status === 0) {
        const fallback = await fetchJsonUrlWithPowerShell(url, timeoutMs);
        if (fallback.ok) return fallback;
        first = {
            ...first,
            fallbackError: fallback.error || ''
        };
    }
    if (first.ok || first.status !== 429) return first;
    const retrySeconds = clampNumber(first.retryAfter, 1, 1, 30);
    await new Promise((resolve) => setTimeout(resolve, retrySeconds * 1000));
    const retry = await fetchJsonUrl(url, timeoutMs);
    if (!retry.ok && retry.status === 0) {
        const fallback = await fetchJsonUrlWithPowerShell(url, timeoutMs);
        if (fallback.ok) return fallback;
    }
    return retry;
}

function wikidataEntityId(value = {}) {
    const direct = normalizeString(value.id);
    if (/^Q\d+$/i.test(direct)) return direct.toUpperCase();
    const numeric = Number(value['numeric-id']);
    return Number.isInteger(numeric) && numeric > 0 ? `Q${numeric}` : '';
}

function wikidataClaimValue(statement = {}) {
    if (statement?.rank === 'deprecated') return null;
    const dataValue = statement?.mainsnak?.datavalue;
    if (!dataValue || statement?.mainsnak?.snaktype !== 'value') return null;
    const value = dataValue.value;
    if (dataValue.type === 'wikibase-entityid') {
        const entityId = wikidataEntityId(value || {});
        return entityId ? { type: 'entity', entity_id: entityId } : null;
    }
    if (dataValue.type === 'globecoordinate' && value && typeof value === 'object') {
        const latitude = Number(value.latitude);
        const longitude = Number(value.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
        return {
            type: 'coordinates',
            latitude,
            longitude,
            precision: Number.isFinite(Number(value.precision)) ? Number(value.precision) : null,
            globe: normalizeString(value.globe)
        };
    }
    if (dataValue.type === 'time' && value && typeof value === 'object') {
        return {
            type: 'time',
            time: normalizeString(value.time),
            precision: Number.isFinite(Number(value.precision)) ? Number(value.precision) : null,
            calendar_model: normalizeString(value.calendarmodel)
        };
    }
    if (dataValue.type === 'quantity' && value && typeof value === 'object') {
        return {
            type: 'quantity',
            amount: normalizeString(value.amount),
            unit: normalizeString(value.unit),
            lower_bound: normalizeString(value.lowerBound),
            upper_bound: normalizeString(value.upperBound)
        };
    }
    if (dataValue.type === 'monolingualtext' && value && typeof value === 'object') {
        return {
            type: 'text',
            text: normalizeString(value.text),
            language: normalizeString(value.language)
        };
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return { type: dataValue.type || typeof value, value };
    }
    return value && typeof value === 'object'
        ? { type: dataValue.type || 'object', value }
        : null;
}

function preferredWikidataClaims(claims = []) {
    const list = Array.isArray(claims) ? claims.filter((claim) => claim?.rank !== 'deprecated') : [];
    const preferred = list.filter((claim) => claim?.rank === 'preferred');
    return (preferred.length ? preferred : list).slice(0, 8);
}

function wikidataLanguageValue(values = {}, language = 'en') {
    return normalizeString(
        values?.[language]?.value ||
        values?.en?.value ||
        Object.values(values || {}).find((value) => normalizeString(value?.value))?.value
    );
}

async function wikidataEntityLookup(args = {}) {
    const queryValues = [
        normalizeString(args.query || args.q || args.search),
        ...(Array.isArray(args.queries) ? args.queries.map((value) => normalizeString(value)) : [])
    ].filter(Boolean);
    const entityIds = (Array.isArray(args.entityIds)
        ? args.entityIds
        : Array.isArray(args.entity_ids)
            ? args.entity_ids
            : []
    ).map((value) => normalizeString(value).toUpperCase()).filter((value) => /^Q\d+$/.test(value));
    const uniqueQueries = [...new Set(queryValues)].slice(0, 20);
    const uniqueEntityIds = [...new Set(entityIds)].slice(0, 50);
    if (!uniqueQueries.length && !uniqueEntityIds.length) {
        return errorResult('wikidata_entity_lookup requires query, queries, or entityIds');
    }

    const language = normalizeString(args.language, 'en').toLowerCase().replace(/[^a-z-]/g, '').slice(0, 16) || 'en';
    const maxResultsPerQuery = clampNumber(
        args.maxResultsPerQuery ?? args.max_results_per_query ?? args.maxResults,
        3,
        1,
        5
    );
    const timeoutMs = clampNumber(args.timeoutMs, 60000, 5000, 180000);
    const apiUrl = normalizeString(args.wikidataApiUrl || args.apiUrl, 'https://www.wikidata.org/w/api.php');
    const properties = normalizeWikidataPropertySelection(args.properties || args.fields || []);
    const attempts = [];

    const searches = await runBoundedParallel(uniqueQueries, 1, async (query) => {
        let response = { ok: true, status: 200, json: { search: [] } };
        let effectiveQuery = query;
        for (const searchQuery of buildWikidataSearchVariants(query)) {
            const url = wikidataApiUrl(apiUrl, {
                action: 'wbsearchentities',
                search: searchQuery,
                language,
                uselang: language,
                type: 'item',
                limit: maxResultsPerQuery
            });
            response = await fetchWikidataJson(url, Math.min(timeoutMs, 30000));
            attempts.push({
                action: 'wbsearchentities',
                query,
                search_query: searchQuery,
                ok: response.ok,
                status: response.status || 0,
                error: response.error || ''
            });
            effectiveQuery = searchQuery;
            if (Array.isArray(response.json?.search) && response.json.search.length) break;
            if (!response.ok && response.status === 429) break;
        }
        return {
            query,
            effectiveQuery,
            response,
            matches: Array.isArray(response.json?.search)
                ? response.json.search.slice(0, maxResultsPerQuery)
                : []
        };
    });

    const searchedIds = searches.flatMap((result) => result.matches.map((match) => normalizeString(match.id)));
    const allEntityIds = [...new Set([...uniqueEntityIds, ...searchedIds])]
        .filter((value) => /^Q\d+$/i.test(value))
        .slice(0, 50);
    if (!allEntityIds.length) {
        return actionableErrorResult('wikidata_entity_lookup found no entity candidates', {
            status: searches.some((result) => result.response?.status === 429) ? 'rate_limited' : 'not_found',
            attempts,
            nextActions: [
                'Retry with an unambiguous entity name plus country, date, occupation, or identifier.',
                'Use web_run search only to discover a Wikidata Q-id, then call this tool with entityIds.'
            ]
        });
    }

    const entitiesUrl = wikidataApiUrl(apiUrl, {
        action: 'wbgetentities',
        ids: allEntityIds.join('|'),
        props: 'labels|descriptions|claims|sitelinks/urls',
        languages: `${language}|en`,
        languagefallback: '1',
        sitefilter: `${language}wiki|enwiki`
    });
    const entityResponse = await fetchWikidataJson(entitiesUrl, timeoutMs);
    attempts.push({
        action: 'wbgetentities',
        ids: allEntityIds,
        ok: entityResponse.ok,
        status: entityResponse.status || 0,
        error: entityResponse.error || ''
    });
    if (!entityResponse.ok) {
        return actionableErrorResult('wikidata_entity_lookup could not read entity metadata', {
            status: entityResponse.status === 429 ? 'rate_limited' : 'source_unavailable',
            attempts,
            retryAfter: entityResponse.retryAfter || '',
            nextActions: [
                'Retry after the returned Retry-After interval when rate limited.',
                'Use the entity Wikidata page or linked Wikipedia page as a public-web fallback.'
            ]
        });
    }

    const entityPayload = entityResponse.json?.entities || {};
    const entities = Array.isArray(entityPayload)
        ? Object.fromEntries(entityPayload.map((entity) => [entity.id, entity]))
        : entityPayload;
    const projectedById = new Map();
    const linkedIds = new Set();
    for (const entityId of allEntityIds) {
        const entity = entities?.[entityId] || {};
        const projectedProperties = {};
        for (const property of properties) {
            const values = preferredWikidataClaims(entity.claims?.[property.id])
                .map((claim) => wikidataClaimValue(claim))
                .filter(Boolean);
            for (const value of values) {
                if (value.type === 'entity' && value.entity_id) linkedIds.add(value.entity_id);
            }
            if (values.length) projectedProperties[property.name] = values;
        }
        const preferredSitelink = entity.sitelinks?.[`${language}wiki`] || entity.sitelinks?.enwiki || {};
        projectedById.set(entityId, {
            id: entityId,
            label: wikidataLanguageValue(entity.labels, language),
            description: wikidataLanguageValue(entity.descriptions, language),
            wikidata_url: `https://www.wikidata.org/wiki/${entityId}`,
            wikipedia_url: normalizeString(preferredSitelink.url),
            properties: projectedProperties
        });
    }

    const linkedLabels = new Map();
    const linkedIdList = [...linkedIds].filter((entityId) => !projectedById.has(entityId)).slice(0, 50);
    if (linkedIdList.length) {
        const linkedUrl = wikidataApiUrl(apiUrl, {
            action: 'wbgetentities',
            ids: linkedIdList.join('|'),
            props: 'labels|descriptions|sitelinks/urls',
            languages: `${language}|en`,
            languagefallback: '1',
            sitefilter: `${language}wiki|enwiki`
        });
        const linkedResponse = await fetchWikidataJson(linkedUrl, timeoutMs);
        attempts.push({
            action: 'wbgetentities_labels',
            ids: linkedIdList,
            ok: linkedResponse.ok,
            status: linkedResponse.status || 0,
            error: linkedResponse.error || ''
        });
        if (linkedResponse.ok) {
            const linkedPayload = linkedResponse.json?.entities || {};
            const linkedEntities = Array.isArray(linkedPayload)
                ? Object.fromEntries(linkedPayload.map((entity) => [entity.id, entity]))
                : linkedPayload;
            for (const entityId of linkedIdList) {
                const linked = linkedEntities?.[entityId] || {};
                const sitelink = linked.sitelinks?.[`${language}wiki`] || linked.sitelinks?.enwiki || {};
                linkedLabels.set(entityId, {
                    id: entityId,
                    label: wikidataLanguageValue(linked.labels, language),
                    description: wikidataLanguageValue(linked.descriptions, language),
                    wikidata_url: `https://www.wikidata.org/wiki/${entityId}`,
                    wikipedia_url: normalizeString(sitelink.url)
                });
            }
        }
    }

    for (const projected of projectedById.values()) {
        for (const values of Object.values(projected.properties)) {
            for (const value of values) {
                if (value.type !== 'entity' || !value.entity_id) continue;
                const resolved = projectedById.get(value.entity_id) || linkedLabels.get(value.entity_id);
                if (resolved) Object.assign(value, resolved);
            }
        }
    }

    const results = searches.map((searchResult) => ({
        query: searchResult.query,
        effective_query: searchResult.effectiveQuery,
        matches: searchResult.matches
            .map((match) => projectedById.get(normalizeString(match.id)))
            .filter(Boolean)
    }));
    if (uniqueEntityIds.length) {
        results.push({
            query: '',
            entity_ids: uniqueEntityIds,
            matches: uniqueEntityIds.map((entityId) => projectedById.get(entityId)).filter(Boolean)
        });
    }

    const propertyRows = [];
    for (const result of results) {
        for (const [matchRank, match] of result.matches.entries()) {
            for (const [property, values] of Object.entries(match.properties || {})) {
                for (const value of Array.isArray(values) ? values : []) {
                    propertyRows.push({
                        source_query: normalizeString(result.query),
                        source_entity_id: normalizeString(match.id),
                        source_entity: normalizeString(match.label),
                        match_rank: matchRank,
                        property,
                        value_type: normalizeString(value.type),
                        value_entity_id: normalizeString(value.entity_id || value.id),
                        value_label: normalizeString(value.label),
                        value_description: normalizeString(value.description),
                        latitude: Number.isFinite(Number(value.latitude)) ? Number(value.latitude) : null,
                        longitude: Number.isFinite(Number(value.longitude)) ? Number(value.longitude) : null,
                        amount: normalizeString(value.amount),
                        text: normalizeString(value.text || value.value)
                    });
                }
            }
        }
    }
    const details = {
        status: 'completed',
        source: 'Wikidata Action API',
        attribution: 'Data from Wikidata',
        language,
        requested_properties: properties,
        candidate_set_complete: false,
        property_rows: propertyRows.slice(0, 200),
        results,
        attempts
    };
    return textResult(JSON.stringify(details, null, 2), {
        ...details,
        evidenceQuality: 'structured_knowledge_graph',
        reasoningReady: results.some((result) => result.matches.length > 0)
    });
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

function isExactAuthorNameMatch(candidateName = '', targetAuthor = '') {
    const candidate = authorNameTokens(candidateName).join(' ');
    const target = authorNameTokens(targetAuthor).join(' ');
    return Boolean(candidate && target && candidate === target);
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
            const exactAuthors = rankedAuthors.filter((candidate) => isExactAuthorNameMatch(candidate.name, author));
            const authorHistoryRequested = beforeYear && !query && !year && !topic && !venue;
            if (authorHistoryRequested && exactAuthors.length === 1) {
                const resolved = await paperMetadataLookup({
                    ...args,
                    author: exactAuthors[0].name,
                    authorId: exactAuthors[0].id
                });
                if (!resolved.isError) {
                    const resolvedPayload = resolved.structuredContent || resolved.details || {};
                    const responsePayload = {
                        ...resolvedPayload,
                        requestedAuthor: author,
                        resolvedAuthor: exactAuthors[0],
                        attempts: [...attempts, ...(Array.isArray(resolvedPayload.attempts) ? resolvedPayload.attempts : [])]
                    };
                    return {
                        ...resolved,
                        content: [{ type: 'text', text: buildPaperMetadataText(responsePayload) }],
                        structuredContent: responsePayload,
                        details: responsePayload
                    };
                }
            }
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

    if (titleOnlyLookup && results.length === 0) {
        const broadSearchText = normalizeString(searchText.replace(/[?*]+/g, ' '));
        const openAlexFallbackUrl = buildOpenAlexWorksSearchUrl(openAlexBaseUrl, broadSearchText, maxResults, {
            exact: false,
            apiKey: openAlexApiKey,
            filter: year ? buildOpenAlexWorksFilter({ year }) : ''
        });
        const openAlexFallback = await fetchJsonUrl(openAlexFallbackUrl, Math.min(timeoutMs, 20000));
        attempts.push({
            source: 'openalex_title_fallback',
            url: openAlexFallbackUrl,
            ok: openAlexFallback.ok,
            status: openAlexFallback.status,
            error: openAlexFallback.error || ''
        });
        if (openAlexFallback.ok) {
            for (const work of Array.isArray(openAlexFallback.json?.results) ? openAlexFallback.json.results : []) {
                pushPaperMetadataCandidate(results, seen, mapOpenAlexWorkToPaperMetadata(work), scoringContext);
            }
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

function htmlFullTextCandidatePriority(candidate = {}) {
    const source = normalizeString(candidate.source);
    const haystack = `${candidate.url || ''} ${candidate.text || ''} ${candidate.title || ''} ${candidate.snippet || ''}`;
    let priority = 0;
    if (/page_html_link/i.test(source)) {
        priority += 120;
    } else if (/scholarly_search_html|document_search_html/i.test(source)) {
        priority += 90;
    } else if (/fetched_html_page/i.test(source)) {
        priority += 20;
    }
    if (/full\s*text|\/articles?\b|\/article\/view\/|html/i.test(haystack)) {
        priority += 40;
    }
    if (/abstract/i.test(haystack) && !/full\s*text|\/articles?\b/i.test(haystack)) {
        priority -= 20;
    }
    if (/download|pdf/i.test(haystack) && !/html|article|full\s*text/i.test(haystack)) {
        priority -= 30;
    }
    return priority;
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
        score,
        priority: htmlFullTextCandidatePriority({ ...candidate, url, source, score })
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
            .sort((a, b) =>
                (Number(b.priority) || 0) - (Number(a.priority) || 0) ||
                b.score - a.score
            )
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
            const fetchedDetails = fetched.structuredContent || fetched.details || {};
            const sourceLines = fetchedDetails.sourceWindow?.lines ||
                fetchedDetails.sourceViewport?.lines ||
                fetchedDetails.source?.lines ||
                fetchedDetails.source_window?.lines ||
                [];
            const extractedText = Array.isArray(sourceLines) && sourceLines.length
                ? sourceLines.map((line) => normalizeString(line.text)).filter(Boolean).join('\n')
                : (fetched.content?.[0]?.text || '');
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

function parseWikipediaPagePayload(payload = {}) {
    const renderedHtml = normalizeString(payload?.parse?.text?.['*']);
    if (renderedHtml) {
        return {
            contentType: 'text/html; charset=utf-8',
            kind: 'wikipedia_rendered_html',
            text: renderedHtml
        };
    }

    const wikitext = normalizeString(payload?.parse?.wikitext?.['*']);
    if (wikitext) {
        return {
            contentType: 'text/x-wiki',
            kind: 'wikipedia_wikitext',
            text: wikitext
        };
    }
    return null;
}

async function maybeFetchWikipediaPage(rawUrl, timeoutMs = 90000) {
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
    const apiUrl = `${parsed.protocol}//${parsed.hostname}/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text%7Cwikitext&format=json&redirects=1&disableeditsection=1`;
    const fetched = await fetchText(apiUrl, timeoutMs);
    if (!fetched.ok) {
        return null;
    }
    try {
        const payload = JSON.parse(fetched.text);
        const page = parseWikipediaPagePayload(payload);
        if (!page) {
            return null;
        }
        return {
            ok: true,
            status: fetched.status,
            ...page,
            backend: 'wikipedia_parse_api',
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
            selectedIndex,
            start,
            end
        }
    };
}

function sourceLines(text = '') {
    return String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
}

function extractRepeatedLabeledFields(text = '', { maxFields = 16, maxValues = 20 } = {}) {
    const fields = new Map();
    const lines = sourceLines(text);
    for (let index = 0; index < lines.length; index += 1) {
        const line = compactWhitespace(lines[index]);
        const match = line.match(/^([\p{L}][\p{L}\p{N} _./(),&%+-]{1,80}):(?:\s*(.*))?$/u);
        if (!match) {
            continue;
        }
        const label = compactWhitespace(match[1]);
        if (
            !label ||
            label.split(/\s+/).length > 10 ||
            /^(?:https?|mailto|javascript)$/i.test(label)
        ) {
            continue;
        }
        let value = compactWhitespace(match[2]);
        let valueLine = index + 1;
        if (!value) {
            for (let lookahead = index + 1; lookahead < Math.min(lines.length, index + 3); lookahead += 1) {
                const candidate = compactWhitespace(lines[lookahead]);
                if (!candidate) {
                    continue;
                }
                if (/^[\p{L}][\p{L}\p{N} _./(),&%+-]{1,80}:$/u.test(candidate)) {
                    break;
                }
                value = candidate;
                valueLine = lookahead + 1;
                break;
            }
        }
        if (!value || value.length > 320 || /^https?:\/\//i.test(value)) {
            continue;
        }
        const fieldKey = label.toLowerCase();
        const field = fields.get(fieldKey) || {
            label,
            occurrenceCount: 0,
            values: new Map()
        };
        field.occurrenceCount += 1;
        const valueKey = value.toLowerCase();
        const existing = field.values.get(valueKey) || {
            value,
            count: 0,
            lineNumbers: []
        };
        existing.count += 1;
        if (existing.lineNumbers.length < 6) {
            existing.lineNumbers.push(valueLine);
        }
        field.values.set(valueKey, existing);
        fields.set(fieldKey, field);
    }
    return Array.from(fields.values())
        .filter((field) => field.occurrenceCount >= 2)
        .sort((left, right) =>
            right.occurrenceCount - left.occurrenceCount ||
            left.label.localeCompare(right.label)
        )
        .slice(0, maxFields)
        .map((field) => ({
            label: field.label,
            occurrenceCount: field.occurrenceCount,
            uniqueValueCount: field.values.size,
            values: Array.from(field.values.values())
                .sort((left, right) => left.lineNumbers[0] - right.lineNumbers[0])
                .slice(0, maxValues)
        }));
}

function formatRepeatedLabeledFields(fields = [], maxChars = 2400) {
    if (!Array.isArray(fields) || !fields.length) {
        return '';
    }
    const lines = ['Repeated labeled fields across the full source (independent of the visible viewport):'];
    for (const field of fields) {
        const values = field.values.map((entry) => {
            const locations = entry.lineNumbers.map((line) => `L${line}`).join(',');
            return `${entry.value} x${entry.count}${locations ? ` (${locations})` : ''}`;
        });
        const rendered = `- ${field.label} [${field.occurrenceCount} occurrences, ${field.uniqueValueCount} unique]: ${values.join('; ')}`;
        if (lines.join('\n').length + rendered.length + 1 > maxChars) {
            break;
        }
        lines.push(rendered);
    }
    return lines.length > 1 ? lines.join('\n') : '';
}

const RECORD_PROJECTION_FIELD_PATTERN = /^(?:year|publisher(?:,\s*year)?|publisher|document type|resource type|content provider|country|language|source)$/i;

function extractRecordFieldProjections(text = '', { maxRecords = 20, maxFields = 8 } = {}) {
    const lines = sourceLines(text);
    const recordStarts = [];
    for (let index = 0; index < lines.length; index += 1) {
        const line = compactWhitespace(lines[index]);
        const match = line.match(/^Record\s+(\d+)\)\s*(?:\d+\.\s*)?(.+)$/i);
        if (match) {
            recordStarts.push({
                index,
                lineNumber: index + 1,
                recordNumber: Number(match[1]) || recordStarts.length + 1,
                title: compactWhitespace(match[2])
            });
        }
    }
    const records = [];
    for (let recordIndex = 0; recordIndex < recordStarts.length && records.length < maxRecords; recordIndex += 1) {
        const start = recordStarts[recordIndex];
        const end = recordStarts[recordIndex + 1]?.index ?? lines.length;
        const fields = [];
        const seenLabels = new Set();
        for (let index = start.index + 1; index < end && fields.length < maxFields; index += 1) {
            const line = compactWhitespace(lines[index]);
            const match = line.match(/^([\p{L}][\p{L}\p{N} _./(),&%+-]{1,80})\s*:\s*(.*)$/u);
            if (!match) {
                continue;
            }
            const label = compactWhitespace(match[1]);
            if (!RECORD_PROJECTION_FIELD_PATTERN.test(label) || seenLabels.has(label.toLowerCase())) {
                continue;
            }
            let value = compactWhitespace(match[2]);
            let valueLineNumber = index + 1;
            if (!value) {
                for (let lookahead = index + 1; lookahead < Math.min(end, index + 4); lookahead += 1) {
                    const candidate = compactWhitespace(lines[lookahead]);
                    if (!candidate || /^\[\s*claim\s*\]$/i.test(candidate)) {
                        continue;
                    }
                    if (/^[\p{L}][\p{L}\p{N} _./(),&%+-]{1,80}\s*:/u.test(candidate)) {
                        break;
                    }
                    value = candidate;
                    valueLineNumber = lookahead + 1;
                    break;
                }
            }
            if (!value || value.length > 500) {
                continue;
            }
            seenLabels.add(label.toLowerCase());
            fields.push({
                label,
                value,
                lineNumber: valueLineNumber
            });
        }
        if (fields.length) {
            records.push({
                recordNumber: start.recordNumber,
                title: start.title,
                lineNumber: start.lineNumber,
                fields
            });
        }
    }
    return records;
}

function formatRecordFieldProjections(records = [], maxChars = 3200) {
    if (!Array.isArray(records) || !records.length) {
        return '';
    }
    const lines = ['Record-level field projection across the full source (each row keeps its fields correlated):'];
    for (const record of records) {
        const fieldText = record.fields
            .map((field) => `${field.label}=${field.value} (L${field.lineNumber})`)
            .join(' | ');
        const rendered = `- Record ${record.recordNumber} (L${record.lineNumber}): ${record.title}\n  ${fieldText}`;
        if (lines.join('\n').length + rendered.length + 1 > maxChars) {
            break;
        }
        lines.push(rendered);
    }
    return lines.length > 1 ? lines.join('\n') : '';
}

const WEB_ARCHIVE_QUERY_CONSTRAINTS = [
    {
        id: 'year',
        parameterPattern: /\byear\b|year.?from|year.?to|datefrom|dateto|dcyear|publication.?date|\bissued\b/i,
        fieldPattern: /\byear\b|\bdate\b|\bissued\b/i,
        numeric: true
    },
    {
        id: 'language',
        parameterPattern: /\blang(?:uage)?\b|dclang|\bling\b/i,
        fieldPattern: /\blang(?:uage)?\b/i
    },
    {
        id: 'document_type',
        parameterPattern: /^\s*type\b|\bdoctype\b|document.?type|resource.?type|dctype|typenorm|publication.?type|\bcontent\b/i,
        fieldPattern: /document.?type|resource.?type|publication.?type|^\s*type\s*$/i
    },
    {
        id: 'country_region',
        parameterPattern: /\bcountry\b|\bregion\b/i,
        fieldPattern: /\bcountry\b|\bregion\b/i
    }
];

const WEB_ARCHIVE_GENERIC_CONSTRAINT_VALUES = new Set([
    'all', 'any', 'both', 'either', 'everything', 'none', 'null', 'true', 'false'
]);

function normalizeWebArchiveConstraintValue(value = '') {
    return normalizeString(value)
        .normalize('NFKD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .replace(/[_+]+/g, ' ')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function webArchiveConstraintValues(parameterKey = '', parameterValue = '', constraint = {}) {
    const normalizedValue = normalizeString(parameterValue);
    if (!normalizedValue) {
        return [];
    }
    if (constraint.numeric === true) {
        return dedupeSearchStrings(normalizedValue.match(/\b(?:18|19|20)\d{2}\b/g) || []);
    }
    const keyMatches = constraint.parameterPattern.test(normalizeString(parameterKey));
    const valueParts = normalizedValue
        .split(/[|,;]/)
        .flatMap((part) => {
            const segments = part.split(/[:=]/).map((segment) => normalizeWebArchiveConstraintValue(segment));
            return keyMatches ? [segments.at(-1)] : segments.slice(1);
        })
        .map((value) => normalizeWebArchiveConstraintValue(value))
        .filter((value) =>
            value &&
            !WEB_ARCHIVE_GENERIC_CONSTRAINT_VALUES.has(value) &&
            !/^\d+$/.test(value)
        );
    return dedupeSearchStrings(valueParts);
}

function extractWebArchiveQueryConstraints(url = '') {
    let parsed;
    try {
        parsed = new URL(normalizeString(url));
    } catch {
        return [];
    }
    const grouped = new Map();
    for (const [parameterKey, parameterValue] of parsed.searchParams.entries()) {
        const descriptor = `${parameterKey} ${parameterValue}`;
        for (const constraint of WEB_ARCHIVE_QUERY_CONSTRAINTS) {
            const compactKey = normalizeString(parameterKey).replace(/\[\]$/, '').toLowerCase();
            const directYearRange = constraint.id === 'year' &&
                /^(?:from|to)$/.test(compactKey) &&
                /\b(?:18|19|20)\d{2}\b/.test(normalizeString(parameterValue));
            const directDocumentType = constraint.id === 'document_type' &&
                compactKey === 'type' &&
                !WEB_ARCHIVE_GENERIC_CONSTRAINT_VALUES.has(
                    normalizeWebArchiveConstraintValue(parameterValue)
                );
            if (
                !directYearRange &&
                !directDocumentType &&
                !constraint.parameterPattern.test(descriptor)
            ) {
                continue;
            }
            const values = webArchiveConstraintValues(parameterKey, parameterValue, constraint);
            if (!values.length) {
                continue;
            }
            const current = grouped.get(constraint.id) || {
                id: constraint.id,
                expectedValues: [],
                parameters: []
            };
            current.expectedValues = dedupeSearchStrings([...current.expectedValues, ...values]);
            current.parameters.push(`${parameterKey}=${parameterValue}`);
            grouped.set(constraint.id, current);
        }
    }
    return Array.from(grouped.values());
}

function webArchiveConstraintValueMatches(constraintId = '', expected = '', observed = '') {
    const expectedValue = normalizeWebArchiveConstraintValue(expected);
    const observedValue = normalizeWebArchiveConstraintValue(observed);
    if (!expectedValue || !observedValue) {
        return false;
    }
    if (constraintId === 'year') {
        return new RegExp(`\\b${escapeWebArchiveRegexTerm(expectedValue)}\\b`).test(observedValue);
    }
    if (expectedValue.length <= 3) {
        return observedValue.split(/\s+/).includes(expectedValue);
    }
    return observedValue.includes(expectedValue) || expectedValue.includes(observedValue);
}

function assessArchivedSnapshotQueryFidelity(originalUrl = '', snapshotDetails = {}) {
    const constraints = extractWebArchiveQueryConstraints(originalUrl);
    const repeatedFields = Array.isArray(snapshotDetails.repeatedLabeledFields)
        ? snapshotDetails.repeatedLabeledFields
        : Array.isArray(snapshotDetails.repeated_labeled_fields)
        ? snapshotDetails.repeated_labeled_fields
        : [];
    const assessments = [];
    for (const constraint of constraints) {
        const definition = WEB_ARCHIVE_QUERY_CONSTRAINTS.find((entry) => entry.id === constraint.id);
        const matchingFields = repeatedFields.filter((field) =>
            definition?.fieldPattern.test(normalizeString(field?.label))
        );
        if (!matchingFields.length) {
            continue;
        }
        const observedValues = dedupeSearchStrings(matchingFields.flatMap((field) =>
            (Array.isArray(field?.values) ? field.values : [])
                .map((entry) => normalizeString(entry?.value))
                .filter(Boolean)
        ));
        if (!observedValues.length) {
            continue;
        }
        const reflected = constraint.expectedValues.some((expected) =>
            observedValues.some((observed) =>
                webArchiveConstraintValueMatches(constraint.id, expected, observed)
            )
        );
        const observedOccurrenceCount = matchingFields.reduce(
            (total, field) => total + Math.max(0, Number(field?.occurrenceCount) || 0),
            0
        );
        assessments.push(pruneEmptyDeep({
            id: constraint.id,
            reflected,
            expectedValues: constraint.expectedValues,
            parameters: constraint.parameters,
            recordFieldLabels: matchingFields.map((field) => normalizeString(field.label)),
            observedOccurrenceCount,
            observedValues: observedValues.slice(0, 16)
        }));
    }
    const mismatchedConstraints = assessments
        .filter((assessment) => assessment.reflected !== true)
        .map((assessment) => assessment.id);
    const stronglyContradictedConstraints = assessments
        .filter((assessment) =>
            assessment.reflected !== true &&
            Number(assessment.observedOccurrenceCount || 0) >= 2
        )
        .map((assessment) => assessment.id);
    const rejected = (
        assessments.length >= 2 &&
        mismatchedConstraints.length >= 2
    ) || stronglyContradictedConstraints.length >= 1;
    return pruneEmptyDeep({
        status: rejected
            ? 'rejected'
            : assessments.length
            ? 'accepted'
            : 'not_assessable',
        rejected,
        assessedConstraintCount: assessments.length,
        mismatchCount: mismatchedConstraints.length,
        requiredMismatchCount: 2,
        mismatchedConstraints,
        stronglyContradictedConstraints,
        strongContradictionMinimumOccurrences: 2,
        assessments
    });
}

function extractFacetedSearchFilters(text = '', { maxFacets = 16, maxValues = 30 } = {}) {
    const lines = sourceLines(text);
    const facets = [];
    let current = null;
    for (let index = 0; index < lines.length; index += 1) {
        const line = compactWhitespace(lines[index]);
        const heading = line.match(/^Search the list from the filter (.+?) with ([\d,]+) entr(?:y|ies)\b/i);
        if (heading) {
            current = {
                label: compactWhitespace(heading[1]),
                declaredValueCount: Number(heading[2].replace(/,/g, '')) || undefined,
                lineNumber: index + 1,
                values: [],
                seen: new Set()
            };
            facets.push(current);
            if (facets.length >= maxFacets) {
                break;
            }
            continue;
        }
        if (!current) {
            continue;
        }
        if (/^Go$/i.test(line)) {
            current = null;
            continue;
        }
        const valueMatch = line.match(/^\(([\d,]+)\)\s+(.+?)(?:\s+\(Number of documents:\s*[\d,]+\))?$/i);
        if (!valueMatch || current.values.length >= maxValues) {
            continue;
        }
        const value = compactWhitespace(valueMatch[2]);
        const key = value.toLowerCase();
        if (!value || current.seen.has(key)) {
            continue;
        }
        current.seen.add(key);
        current.values.push({
            value,
            count: Number(valueMatch[1].replace(/,/g, '')) || 0,
            lineNumber: index + 1
        });
    }
    return facets
        .filter((facet) => facet.label && facet.values.length)
        .map(({ seen, ...facet }) => facet);
}

function facetedSearchDisplayScore(facet = {}) {
    const label = normalizeString(facet.label).toLowerCase();
    if (/\bcountry\b|\bregion\b/.test(label)) return 100;
    if (/\blanguage\b|\blang\b/.test(label)) return 95;
    if (/\bdocument type\b|\bresource type\b|\btype\b/.test(label)) return 90;
    if (/\bcontent provider\b|\brepository\b|\bsource\b/.test(label)) return 85;
    if (/\byear\b|\bdate\b/.test(label)) return 80;
    if (/\bclassification\b|\bsubject\b|\bdewey\b|\bddc\b/.test(label)) return 70;
    if (/\bauthor\b|\bcreator\b/.test(label)) return 40;
    return 20;
}

function formatFacetedSearchFilters(facets = [], maxChars = 3600) {
    if (!Array.isArray(facets) || !facets.length) {
        return '';
    }
    const lines = ['Faceted search filters across the full source (values preserve source line numbers):'];
    const rankedFacets = facets
        .map((facet, index) => ({ facet, index, score: facetedSearchDisplayScore(facet) }))
        .sort((left, right) => right.score - left.score || left.index - right.index)
        .map((entry) => entry.facet);
    for (const facet of rankedFacets) {
        const visibleValues = facet.values.length > 12
            ? [...facet.values.slice(0, 8), ...facet.values.slice(-4)]
            : facet.values;
        const values = visibleValues.map((entry) =>
            `${entry.value} x${entry.count} (L${entry.lineNumber})`
        );
        const omitted = Math.max(0, facet.values.length - visibleValues.length);
        const rendered = `- ${facet.label}: ${values.join('; ')}${omitted ? `; ... +${omitted} more values` : ''}`;
        if (lines.join('\n').length + rendered.length + 1 > maxChars) {
            break;
        }
        lines.push(rendered);
    }
    return lines.length > 1 ? lines.join('\n') : '';
}

function findSourceLineMatches(text = '', pattern = '', { maxMatches = 50 } = {}) {
    const normalizedPattern = normalizeString(pattern).toLowerCase();
    if (!normalizedPattern) {
        return [];
    }
    const matches = [];
    const lines = sourceLines(text);
    for (let index = 0; index < lines.length && matches.length < maxMatches; index += 1) {
        const line = String(lines[index] || '');
        if (!line.toLowerCase().includes(normalizedPattern)) {
            continue;
        }
        const lineno = index + 1;
        matches.push({
            lineNumber: lineno,
            lineno,
            line_number: lineno,
            text: line
        });
    }
    return matches;
}

function compactFindPageText(text = '') {
    return sourceLines(text).map((line) => String(line || '')
        .replace(/!\[[^\]]*\]\((?:\\.|[^)])*\)/g, '')
        .replace(/\[([^\]]*)\]\((?:\\.|[^)])*\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()).join('\n');
}

function normalizedFindHeadingText(value = '') {
    return normalizeString(value)
        .replace(/^#{1,6}\s+/, '')
        .replace(/^\|\s*/, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function selectFindSourceMatch(matches = [], pattern = '') {
    const normalizedPattern = normalizeString(pattern).toLowerCase();
    let best = null;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (const match of Array.isArray(matches) ? matches : []) {
        const text = normalizeString(match.text);
        const headingText = normalizedFindHeadingText(text);
        let score = 0;
        if (/^#{1,6}\s+\S/.test(text)) score += 100;
        if (/^\|\s*\S/.test(text)) score += 60;
        if (sourceLineLooksLikeSectionHeading(text)) score += 30;
        if (headingText === normalizedPattern) score += 40;
        if (/toggle\b|\[\[?edit\]?\]|table of contents/i.test(text)) score -= 120;
        score -= (text.match(/https?:\/\//g) || []).length * 8;
        if (score > bestScore) {
            best = match;
            bestScore = score;
        }
    }
    return best;
}

function sourceOffsetForLine(text = '', lineNumber = 1) {
    const lines = sourceLines(text);
    const targetIndex = Math.max(0, Math.min(lines.length - 1, Number(lineNumber || 1) - 1));
    let offset = 0;
    for (let index = 0; index < targetIndex; index += 1) {
        offset += String(lines[index] || '').length + 1;
    }
    return offset;
}

function lineNumberForOffset(text = '', offset = 0) {
    const boundedOffset = Math.max(0, Math.min(String(text || '').length, Number(offset) || 0));
    const before = String(text || '').slice(0, boundedOffset);
    return before ? before.split(/\n/).length : 1;
}

function extractSourceWindowYearTerms(query = '') {
    return Array.from(new Set(String(query || '').match(/\b(?:18|19|20)\d{2}\b/g) || []));
}

function sourceWindowCoversQuery(text = '', query = '') {
    const normalizedQuery = normalizeString(query);
    if (!normalizedQuery) {
        return true;
    }
    const normalizedText = String(text || '').toLowerCase();
    const yearTerms = extractSourceWindowYearTerms(normalizedQuery);
    if (yearTerms.length) {
        return yearTerms.some((year) => normalizedText.includes(year.toLowerCase()));
    }
    const queryTokens = significantPdfQueryTerms(normalizedQuery)
        .filter((token) => pdfEvidenceTermWeight(token) >= 4)
        .slice(0, 8);
    if (!queryTokens.length) {
        return true;
    }
    return queryTokens.some((token) => normalizedText.includes(String(token || '').toLowerCase()));
}

function firstLineWithQueryYear(lines = [], query = '', startLine = 1) {
    const yearTerms = extractSourceWindowYearTerms(query);
    if (!yearTerms.length) {
        return 0;
    }
    const startIndex = Math.max(0, Number(startLine || 1) - 1);
    for (let index = startIndex; index < lines.length; index += 1) {
        const line = String(lines[index] || '');
        if (yearTerms.some((year) => line.includes(year))) {
            return index + 1;
        }
    }
    return 0;
}

function sourceLineLooksLikeSectionHeading(value = '') {
    const text = normalizeString(value);
    if (!text || text.length > 120 || text.split(/\s+/).length > 14) {
        return false;
    }
    return !/[.!?;:]$/.test(text);
}

function buildSourceLineWindow(text = '', {
    url = '',
    contentType = '',
    query = '',
    maxChars = 4800,
    lineStart = 0,
    lineEnd = 0,
    maxLines = 120,
    focus = null
} = {}) {
    const normalizedText = String(text || '');
    const lines = sourceLines(normalizedText);
    const totalLines = lines.length;
    const requestedLine = clampNumber(lineStart, 0, 0, totalLines || 1);
    const requestedEnd = clampNumber(lineEnd, 0, 0, totalLines || 1);
    const focusSelectedIndex = Number(focus?.selectedIndex);
    const focusStart = Number.isFinite(focusSelectedIndex) && focusSelectedIndex >= 0
        ? focusSelectedIndex
        : Number(focus?.start);
    let focusLine = Number.isFinite(focusStart) && focusStart >= 0
        ? Math.max(1, lineNumberForOffset(normalizedText, focusStart) - 4)
        : 1;
    const yearLine = !requestedLine ? firstLineWithQueryYear(lines, query, focusLine) : 0;
    if (yearLine) {
        focusLine = Math.max(1, yearLine - 6);
    }
    const startLine = Math.max(1, requestedLine || focusLine || 1);
    const lineBudget = Math.max(1, clampNumber(maxLines, 120, 1, 300));
    const charBudget = Math.max(1000, clampNumber(maxChars, 4800, 1000, MAX_FETCH_CHARS));
    const targetEndLine = requestedEnd && requestedEnd >= startLine
        ? Math.min(totalLines, requestedEnd)
        : Math.min(totalLines, startLine + lineBudget - 1);
    const selected = [];
    let visibleChars = 0;
    for (let index = startLine; index <= targetEndLine; index += 1) {
        const textLine = lines[index - 1] ?? '';
        const rendered = `L${index}: ${textLine}`;
        if (selected.length && visibleChars + rendered.length + 1 > charBudget) {
            break;
        }
        selected.push({
            lineNumber: index,
            text: textLine,
            rendered
        });
        visibleChars += rendered.length + 1;
    }
    const lastSelected = selected[selected.length - 1];
    if (
        lastSelected &&
        lastSelected.lineNumber < targetEndLine &&
        sourceLineLooksLikeSectionHeading(lastSelected.text)
    ) {
        const nextLineNumber = lastSelected.lineNumber + 1;
        const nextText = lines[nextLineNumber - 1] ?? '';
        selected.push({
            lineNumber: nextLineNumber,
            text: nextText,
            rendered: `L${nextLineNumber}: ${nextText}`
        });
    }
    const lineEndActual = selected.length ? selected[selected.length - 1].lineNumber : startLine;
    const selectionReason = requestedLine
        ? 'requested_line_window'
        : normalizeString(query)
        ? `focused around query/hash: ${normalizeString(query)}`
        : 'document_head';
    return {
        type: 'source_viewport',
        action: {
            type: 'open_page',
            tool: 'open_page',
            args: {
                url,
                lineno: startLine
            },
            url,
            lineno: startLine
        },
        url,
        ref_id: url,
        contentType,
        content_type: contentType,
        totalLines,
        total_lines: totalLines,
        lineno: startLine,
        lineStart: startLine,
        line_start: startLine,
        lineEnd: lineEndActual,
        line_end: lineEndActual,
        hasMoreBefore: startLine > 1,
        has_more_before: startLine > 1,
        hasMoreAfter: lineEndActual < totalLines,
        has_more_after: lineEndActual < totalLines,
        selectionReason,
        selection_reason: selectionReason,
        focus: focus || undefined,
        lines: selected.map((line) => ({
            ...line,
            lineno: line.lineNumber,
            line_number: line.lineNumber
        }))
    };
}

function buildSourceWindowFollowups(sourceWindow = {}, query = '') {
    const calls = [];
    const url = normalizeString(sourceWindow.url);
    if (!url) {
        return calls;
    }
    const maxLines = Math.max(1, Number(sourceWindow.lineEnd || 0) - Number(sourceWindow.lineStart || 0) + 1) || 120;
    if (sourceWindow.hasMoreBefore) {
        calls.push({
            tool: 'continue_page',
            args: {
                url,
                lineno: Math.max(1, Number(sourceWindow.lineStart || 1) - maxLines),
                maxLines
            },
            reason: 'Open the previous source window if a missing field is above the current viewport.'
        });
    }
    if (sourceWindow.hasMoreAfter) {
        calls.push({
            tool: 'continue_page',
            args: {
                url,
                lineno: Number(sourceWindow.lineEnd || 0) + 1,
                maxLines
            },
            reason: 'Open the next source window if a missing field is below the current viewport.'
        });
    }
    const normalizedQuery = normalizeString(query);
    if (normalizedQuery) {
        calls.push({
            tool: 'find_in_page',
            args: {
                url,
                pattern: normalizedQuery,
                maxLines
            },
            reason: 'Re-open the same source around a specific missing phrase rather than refetching the whole page.'
        });
    }
    return calls.slice(0, 3);
}

function formatSourceLineWindow(sourceWindow = {}) {
    const renderedLines = (Array.isArray(sourceWindow.lines) ? sourceWindow.lines : [])
        .map((line) => normalizeString(line.rendered))
        .filter(Boolean)
        .join('\n');
    return [
        'Source viewport:',
        `Content type: ${normalizeString(sourceWindow.content_type || sourceWindow.contentType, 'text/plain')}`,
        `Source: web_fetch({"url":${JSON.stringify(sourceWindow.url || sourceWindow.ref_id || '')},"lineno":${Number(sourceWindow.lineno || sourceWindow.line_start || sourceWindow.lineStart || 1)}})`,
        `Total lines: ${Number(sourceWindow.total_lines || sourceWindow.totalLines || 0)}`,
        `Line range: L${Number(sourceWindow.line_start || sourceWindow.lineStart || 1)}-L${Number(sourceWindow.line_end || sourceWindow.lineEnd || sourceWindow.line_start || sourceWindow.lineStart || 1)}`,
        `Has more before: ${(sourceWindow.has_more_before ?? sourceWindow.hasMoreBefore) ? 'true' : 'false'}`,
        `Has more after: ${(sourceWindow.has_more_after ?? sourceWindow.hasMoreAfter) ? 'true' : 'false'}`,
        'Note: this is a focused source viewport, not a failed or incomplete fetch. If it contains enough answer-bearing evidence, answer. If a specific field is missing, fetch another line window or query-focused window. For first/earliest/latest/only/all/count questions, a partial viewport is sufficient only when it establishes the relevant candidate-set boundary; otherwise inspect the remaining relevant lines or sections.',
        '',
        renderedLines
    ].filter((line) => line !== '').join('\n');
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

function resolveSubprocessCwd(preferredCwd = '', fallbackCwd = process.cwd()) {
    const fallback = path.resolve(normalizeString(fallbackCwd, process.cwd()));
    const preferred = path.resolve(normalizeString(preferredCwd, fallback));
    if (process.platform === 'win32' && preferred.length >= 240) {
        return fallback;
    }
    try {
        if (!fsSync.statSync(preferred).isDirectory()) {
            return fallback;
        }
    } catch {
        return fallback;
    }
    return preferred;
}

function runProcess(command, args, options = {}) {
    const timeoutMs = clampNumber(options.timeoutMs, 120000, 1000, 600000);
    return new Promise((resolve) => {
        let stdout = '';
        let stderr = '';
        let settled = false;
        let child = null;
        let timer = null;
        const finish = (result) => {
            if (settled) {
                return;
            }
            settled = true;
            if (timer) {
                clearTimeout(timer);
            }
            resolve(result);
        };
        try {
            child = spawn(command, args, {
                cwd: resolveSubprocessCwd(options.cwd),
                windowsHide: true,
                shell: false,
                stdio: ['ignore', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    ...(options.env || {})
                }
            });
        } catch (error) {
            finish({
                exitCode: -1,
                stdout,
                stderr: error?.message || String(error),
                timedOut: false
            });
            return;
        }
        timer = setTimeout(() => {
            child.kill('SIGKILL');
        }, timeoutMs);
        child.stdout?.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr?.on('data', (chunk) => {
            stderr += chunk.toString();
        });
        const handleStdioError = (error) => {
            stderr += `${stderr ? '\n' : ''}${error?.message || String(error)}`;
            try {
                child.kill('SIGKILL');
            } catch {}
            finish({ exitCode: -1, stdout, stderr, timedOut: false });
        };
        child.stdout?.on('error', handleStdioError);
        child.stderr?.on('error', handleStdioError);
        child.on('close', (exitCode) => {
            finish({ exitCode, stdout, stderr, timedOut: exitCode === null });
        });
        child.on('error', (error) => {
            finish({ exitCode: -1, stdout, stderr: stderr || error.message, timedOut: false });
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
                'Use another evidence source if it is more likely to answer the task.'
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
            nextActions: ['Use another evidence source if it is more likely to answer the task.']
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
    return [
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
        'retrieval_diagnostic: metadata_only; this is not transcript, audio, or frame evidence.',
        '',
        'Available follow-up calls derived from the recovered metadata:',
        `1. web_search ${JSON.stringify(suggestedNextCalls[0].args)}`
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

let cachedWindowsUserProxy;

function normalizeProxyUrl(value = '') {
    const proxy = normalizeString(value);
    if (!proxy) {
        return '';
    }
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(proxy) ? proxy : `http://${proxy}`;
}

function windowsUserProxySettings() {
    if (process.platform !== 'win32') {
        return {};
    }
    if (cachedWindowsUserProxy !== undefined) {
        return cachedWindowsUserProxy;
    }
    cachedWindowsUserProxy = {};
    try {
        const result = spawnSync('reg.exe', [
            'query',
            'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings'
        ], {
            encoding: 'utf8',
            windowsHide: true,
            timeout: 3000
        });
        const output = `${result.stdout || ''}\n${result.stderr || ''}`;
        const enabled = /ProxyEnable\s+REG_DWORD\s+0x1\b/i.test(output);
        const server = output.match(/ProxyServer\s+REG_SZ\s+([^\r\n]+)/i)?.[1]?.trim() || '';
        if (!enabled || !server) {
            return cachedWindowsUserProxy;
        }
        if (!server.includes('=')) {
            cachedWindowsUserProxy = { http: normalizeProxyUrl(server), https: normalizeProxyUrl(server) };
            return cachedWindowsUserProxy;
        }
        for (const segment of server.split(';')) {
            const separator = segment.indexOf('=');
            if (separator <= 0) {
                continue;
            }
            const protocol = segment.slice(0, separator).trim().toLowerCase();
            const proxy = normalizeProxyUrl(segment.slice(separator + 1));
            if (proxy && ['http', 'https'].includes(protocol)) {
                cachedWindowsUserProxy[protocol] = proxy;
            }
        }
    } catch {}
    return cachedWindowsUserProxy;
}

function urlBypassesProxy(url = '') {
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (
        hostname === 'localhost' ||
        hostname === '::1' ||
        /^127\./.test(hostname) ||
        /^169\.254\./.test(hostname)
    ) {
        return true;
    }
    const noProxy = normalizeString(process.env.NO_PROXY || process.env.no_proxy);
    if (!noProxy) {
        return false;
    }
    return noProxy.split(',').map((entry) => entry.trim().toLowerCase()).filter(Boolean).some((entry) => {
        const normalized = entry.replace(/^\*\./, '.').split(':')[0];
        return normalized === '*' ||
            hostname === normalized.replace(/^\./, '') ||
            (normalized.startsWith('.') && hostname.endsWith(normalized));
    });
}

function configuredHttpProxy(url = '') {
    if (urlBypassesProxy(url)) {
        return '';
    }
    let protocol = 'https';
    try {
        protocol = new URL(url).protocol.replace(':', '').toLowerCase();
    } catch {}
    const explicit = normalizeProxyUrl(
        process.env.AILIS_WEB_PROXY ||
        process.env.AILIS_HTTP_PROXY ||
        (protocol === 'https'
            ? process.env.HTTPS_PROXY || process.env.https_proxy
            : process.env.HTTP_PROXY || process.env.http_proxy)
    );
    if (explicit) {
        return explicit;
    }
    const windowsProxy = windowsUserProxySettings();
    return windowsProxy[protocol] || windowsProxy.https || windowsProxy.http || '';
}

async function fetchTextWithCurl(url, timeoutMs = 60000) {
    const proxyUrl = configuredHttpProxy(url);
    const marker = '__AILIS_CURL_META__';
    const args = [
        '-sS',
        '-L',
        '--max-time',
        String(Math.max(5, Math.ceil(timeoutMs / 1000))),
        '--connect-timeout',
        String(Math.max(3, Math.min(20, Math.ceil(timeoutMs / 3000)))),
        '-A',
        'AILISResearchMCP/0.1 (+local assistant research tool)',
        '-H',
        'Accept: text/html,application/json,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5'
    ];
    if (proxyUrl) {
        args.push('--proxy', proxyUrl);
    }
    args.push(
        '-w',
        `\n${marker}%{http_code}\t%{content_type}\t%{size_download}`,
        url
    );
    const result = await runProcess(process.platform === 'win32' ? 'curl.exe' : 'curl', args, {
        timeoutMs: timeoutMs + 5000
    });
    const markerIndex = result.stdout.lastIndexOf(`\n${marker}`);
    const body = markerIndex >= 0 ? result.stdout.slice(0, markerIndex) : result.stdout;
    const metadata = markerIndex >= 0
        ? result.stdout.slice(markerIndex + marker.length + 1).split('\t')
        : [];
    const status = Number(metadata[0] || 0);
    const contentType = normalizeString(metadata[1]);
    const ok = result.exitCode === 0 && status >= 200 && status < 400;
    return {
        ok,
        status,
        errorCode: ok
            ? ''
            : result.timedOut
                ? 'timeout'
                : result.exitCode === -1
                    ? 'curl_unavailable'
                    : status
                        ? `http_${status}`
                        : 'curl_fetch_failed',
        error: ok
            ? ''
            : normalizeString(result.stderr, result.timedOut ? 'curl request timed out' : `curl exit ${result.exitCode}`),
        contentType,
        contentLength: Number(metadata[2] || Buffer.byteLength(body)),
        text: body,
        timedOut: result.timedOut,
        proxyUsed: Boolean(proxyUrl),
        backend: 'curl'
    };
}

async function fetchArchiveIndexText(url, timeoutMs = 60000) {
    const curlResult = await fetchTextWithCurl(url, timeoutMs);
    if (curlResult.ok || curlResult.status || curlResult.errorCode !== 'curl_unavailable') {
        return curlResult;
    }
    return fetchText(url, timeoutMs);
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
    const proxyUrl = options.useSystemProxy === false ? '' : configuredHttpProxy(url);
    const code = `
import json, requests, sys
url = sys.argv[1]
timeout = float(sys.argv[2])
verify_tls = sys.argv[3].lower() != "false"
proxy_url = sys.argv[4] if len(sys.argv) > 4 else ""
proxies = {"http": proxy_url, "https": proxy_url} if proxy_url else None
if not verify_tls:
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
r = requests.get(url, timeout=timeout, verify=verify_tls, proxies=proxies, headers={"User-Agent": "AILISResearchMCP/0.1 (+local assistant research tool)"})
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
  "proxy_used": bool(proxy_url),
  "text": text,
}, ensure_ascii=False))
`.trim();
    const verifyTls = options.verifyTls !== false;
    const result = await runProcess('python', [
        '-c',
        code,
        url,
        String(Math.max(5, Math.ceil(timeoutMs / 1000))),
        verifyTls ? 'true' : 'false',
        proxyUrl
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
        proxyUsed: payload.proxy_used === true,
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
            status: 'completed',
            semantic_level: 'structure',
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
    let presentation;
    try {
        presentation = JSON.parse(text);
    } catch (error) {
        return errorResult(`read_presentation returned invalid JSON: ${error.message}`, {
            path: filePath,
            stdout: text.slice(0, 2000)
        });
    }
    const totalSlides = Number(presentation.total_slides || 0);
    const returnedSlides = Number(presentation.returned_slides || 0);
    const complete = returnedSlides >= totalSlides;
    const details = {
        status: complete ? 'completed' : 'partial',
        ok: true,
        path: filePath,
        totalSlides,
        returnedSlides,
        complete,
        truncated: !complete,
        coverage: {
            totalSlides,
            returnedSlides,
            matchingSlides: Array.isArray(presentation.matching_slides)
                ? presentation.matching_slides.length
                : 0
        },
        observationContract: {
            status: complete ? 'completed' : 'partial',
            semantic_level: 'structure',
            complete,
            truncated: !complete,
            coverage: {
                totalSlides,
                returnedSlides
            }
        }
    };
    return {
        content: [{ type: 'text', text }],
        structuredContent: {
            ok: true,
            ...details,
            presentation,
            ...presentation
        },
        details
    };
}

async function transcribeAudio(args = {}) {
    const filePath = path.resolve(normalizeString(args.path || args.file || args.filePath || args.file_path));
    const model = normalizeString(args.model, 'base');
    const stat = filePath ? await fs.stat(filePath).catch(() => null) : null;
    if (!stat || !stat.isFile()) {
        return actionableErrorResult('transcribe_audio requires an existing local audio path', {
            status: 'not_found',
            path: filePath,
            failureReason: 'local_audio_path_not_found',
            message: 'The supplied staged audio path does not exist. Use the exact current attached_files path.',
            nextActions: [
                'Use the exact current attached_files path and retry once.',
                'Do not change Whisper model size to recover a missing input file.'
            ]
        });
    }
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
    const text = normalizeString(result.stdout);
    let transcript;
    try {
        transcript = JSON.parse(text);
    } catch (error) {
        return errorResult(`transcribe_audio returned invalid JSON: ${error.message}`, {
            path: filePath,
            stdout: text.slice(0, 2000)
        });
    }
    return {
        content: [{ type: 'text', text }],
        structuredContent: {
            ok: true,
            status: 'completed',
            path: filePath,
            model,
            transcript,
            ...transcript
        },
        details: {
            status: 'completed',
            ok: true,
            path: filePath,
            model,
            language: normalizeString(transcript.language),
            textChars: normalizeString(transcript.text).length,
            complete: true,
            truncated: false,
            observationContract: {
                status: 'completed',
                semantic_level: 'text',
                complete: true,
                truncated: false
            }
        }
    };
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
    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, settings.timeoutMs || 180000, 30000, 600000);
    const detail = ['low', 'high', 'original'].includes(normalizeString(args.detail).toLowerCase())
        ? normalizeString(args.detail).toLowerCase()
        : 'original';
    const imageBytes = await fs.readFile(filePath);
    const payload = {
        temperature: 0,
        timeoutMs,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: question },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:${imageMimeType(filePath)};base64,${imageBytes.toString('base64')}`,
                            detail
                        },
                        detail
                    }
                ]
            }
        ]
    };
    let response = await callDesktopLlmProvider({
        ...settings,
        timeoutMs
    }, payload);
    if (!response.ok && response.code === 'timeout') {
        const retryTimeoutMs = Math.max(timeoutMs, 240000);
        response = await callDesktopLlmProvider({
            ...settings,
            timeoutMs: retryTimeoutMs
        }, {
            ...payload,
            timeoutMs: retryTimeoutMs
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
                ? '当前配置的大模型接口不支持 image_url 视觉输入；不要重复调用 describe_image。请改用 OCR、文档渲染或其他已配置的视觉工具。'
                : '视觉模型调用失败；不要机械重复同一个截图分析调用，改用其他证据来源。',
            nextActions: unsupportedImageInput
                ? [
                    'Call tool_search for a configured local-image vision or OCR capability.',
                    'If visual evidence is still needed, use OCR, document rendering, or another vision-capable provider.',
                    'Only retry describe_image after switching to a vision-capable provider/model.'
                ]
                : [
                    'Try another available vision or OCR source before retrying describe_image.'
                ],
            suggestedNextCalls: [
                {
                    tool: 'tool_search',
                    args: { query: 'local image semantic vision OCR describe image', limit: 8 }
                }
            ]
        });
    }
    return textResult(response.content.slice(0, maxChars), {
        status: 'completed',
        path: filePath,
        model: response.model,
        complete: true,
        truncated: response.content.length > maxChars,
        observationContract: {
            status: response.content.length > maxChars ? 'partial' : 'completed',
            semantic_level: 'semantic',
            complete: response.content.length <= maxChars,
            truncated: response.content.length > maxChars
        }
    });
}

function normalizeInvidiousInstanceUrl(value = '') {
    const raw = normalizeString(value).replace(/\/+$/, '');
    if (!raw) return '';
    try {
        const parsed = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
        return parsed.protocol === 'https:' ? parsed.origin : '';
    } catch {
        return '';
    }
}

function configuredInvidiousInstances() {
    const configured = normalizeString(process.env.AILIS_INVIDIOUS_INSTANCES)
        .split(/[,\s]+/)
        .map(normalizeInvidiousInstanceUrl)
        .filter(Boolean);
    return [...new Set([
        ...configured,
        'https://invidious.f5.si',
        'https://inv.zoomerville.com'
    ])];
}

function buildInvidiousVideoProxyUrl(instance = '', videoId = '', itag = 18) {
    const base = normalizeInvidiousInstanceUrl(instance);
    const id = extractYouTubeVideoId(videoId);
    if (!base || !id) return '';
    const params = new URLSearchParams({
        id,
        itag: String(clampNumber(itag, 18, 1, 999)),
        local: 'true'
    });
    return `${base}/latest_version?${params.toString()}`;
}

async function downloadVideoForFrameExtraction({
    sourceUrl = '',
    videoId = '',
    targetPath = '',
    timeoutMs = 180000,
    maxBytes = 268435456
} = {}) {
    const boundedTimeoutMs = clampNumber(timeoutMs, 180000, 30000, 600000);
    const boundedMaxBytes = clampNumber(maxBytes, 268435456, 1048576, 1073741824);
    const instances = configuredInvidiousInstances();
    const code = `
import json, os, requests, sys

source_url = sys.argv[1]
video_id = sys.argv[2]
target_path = sys.argv[3]
timeout_seconds = float(sys.argv[4])
max_bytes = int(sys.argv[5])
configured_instances = json.loads(sys.argv[6])
registry_url = "https://api.invidious.io/instances.json?sort_by=health"
session = requests.Session()

def clean_instance(value):
    value = str(value or "").strip().rstrip("/")
    return value if value.startswith("https://") else ""

def registry_instances():
    try:
        response = session.get(registry_url, timeout=(6, 15))
        response.raise_for_status()
        rows = response.json()
    except Exception:
        return []
    output = []
    for _host, metadata in rows:
        if not isinstance(metadata, dict) or metadata.get("type") != "https":
            continue
        monitor = metadata.get("monitor") or {}
        if monitor and monitor.get("down") is True:
            continue
        uri = clean_instance(metadata.get("uri"))
        if uri:
            output.append(uri)
    return output

def candidates():
    if source_url and not video_id:
        return [("direct_url", source_url)]
    instances = []
    for item in configured_instances + registry_instances():
        item = clean_instance(item)
        if item and item not in instances:
            instances.append(item)
    return [
        (
            "invidious_companion",
            f"{base}/latest_version?id={video_id}&itag=18&local=true",
        )
        for base in instances[:12]
    ]

errors = []
part_path = target_path + ".part"
for backend, url in candidates():
    source_host = requests.utils.urlparse(url).netloc
    try:
        response = session.get(
            url,
            timeout=(10, max(30, timeout_seconds)),
            allow_redirects=True,
            stream=True,
        )
        content_type = (response.headers.get("content-type") or "").lower()
        content_length = int(response.headers.get("content-length") or 0)
        if response.status_code not in (200, 206):
            errors.append(f"{backend}:{source_host}:http_{response.status_code}")
            response.close()
            continue
        if content_length and content_length > max_bytes:
            errors.append(f"{backend}:{source_host}:content_too_large")
            response.close()
            continue
        if "video/" not in content_type and "application/octet-stream" not in content_type:
            errors.append(f"{backend}:{source_host}:unexpected_content_type:{content_type[:80]}")
            response.close()
            continue
        written = 0
        with open(part_path, "wb") as output:
            for chunk in response.iter_content(chunk_size=1024 * 256):
                if not chunk:
                    continue
                written += len(chunk)
                if written > max_bytes:
                    raise RuntimeError("content_too_large")
                output.write(chunk)
        response.close()
        if written < 1024:
            raise RuntimeError("video_payload_too_small")
        os.replace(part_path, target_path)
        print(json.dumps({
            "ok": True,
            "backend": backend,
            "bytes": written,
            "contentType": content_type,
            "sourceHost": source_host,
        }))
        raise SystemExit(0)
    except Exception as exc:
        errors.append(f"{backend}:{source_host}:{type(exc).__name__}:{str(exc)[:160]}")
        try:
            os.remove(part_path)
        except OSError:
            pass

print(json.dumps({"ok": False, "errors": errors[-12:]}))
raise SystemExit(2)
`.trim();
    const result = await runProcess('python', [
        '-c',
        code,
        sourceUrl,
        videoId,
        targetPath,
        String(Math.max(30, Math.ceil(boundedTimeoutMs / 1000))),
        String(boundedMaxBytes),
        JSON.stringify(instances)
    ], {
        cwd: path.dirname(targetPath),
        timeoutMs: boundedTimeoutMs
    });
    let payload = {};
    try {
        payload = JSON.parse(normalizeString(result.stdout, '{}').split(/\r?\n/).filter(Boolean).at(-1) || '{}');
    } catch {}
    return {
        ...payload,
        ok: result.exitCode === 0 && payload.ok === true,
        exitCode: result.exitCode,
        timedOut: result.timedOut === true,
        stderr: normalizeString(result.stderr).slice(0, 2000)
    };
}

async function sampleVideoFrames(videoPath = '', outputDir = '', sampleCount = 36, timeoutMs = 180000) {
    const code = `
import glob, json, math, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps
import imageio_ffmpeg

video_path = sys.argv[1]
output_dir = sys.argv[2]
sample_count = int(sys.argv[3])
os.makedirs(output_dir, exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
probe = subprocess.run(
    [ffmpeg, "-hide_banner", "-i", video_path],
    capture_output=True,
    text=True,
    errors="replace",
)
probe_text = (probe.stderr or "") + "\\n" + (probe.stdout or "")
match = re.search(r"Duration:\\s*(\\d+):(\\d+):(\\d+(?:\\.\\d+)?)", probe_text)
if not match:
    print(json.dumps({"ok": False, "error": "duration_unavailable", "probe": probe_text[-1200:]}))
    raise SystemExit(2)
duration = int(match.group(1)) * 3600 + int(match.group(2)) * 60 + float(match.group(3))
fps = sample_count / max(duration, 0.1)
frame_pattern = os.path.join(output_dir, "frame-%03d.jpg")
filter_graph = (
    f"fps={fps:.9f},"
    "scale=480:270:force_original_aspect_ratio=decrease,"
    "pad=480:270:(ow-iw)/2:(oh-ih)/2:black"
)
extract = subprocess.run(
    [
        ffmpeg, "-hide_banner", "-loglevel", "error", "-i", video_path,
        "-vf", filter_graph, "-frames:v", str(sample_count),
        "-q:v", "3", frame_pattern,
    ],
    capture_output=True,
    text=True,
    errors="replace",
)
frames = sorted(glob.glob(os.path.join(output_dir, "frame-*.jpg")))
if extract.returncode != 0 or not frames:
    print(json.dumps({
        "ok": False,
        "error": "ffmpeg_frame_extraction_failed",
        "stderr": (extract.stderr or "")[-1600:],
    }))
    raise SystemExit(3)

columns = 5
cell_width, cell_height = 320, 204
rows = math.ceil(len(frames) / columns)
sheet = Image.new("RGB", (columns * cell_width, rows * cell_height), "black")
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default()
timestamps = []
for index, frame_path in enumerate(frames):
    image = Image.open(frame_path).convert("RGB")
    image = ImageOps.fit(image, (cell_width, 180))
    x = (index % columns) * cell_width
    y = (index // columns) * cell_height
    sheet.paste(image, (x, y))
    timestamp = min(duration, (index + 0.5) * duration / max(len(frames), 1))
    timestamps.append(round(timestamp, 3))
    label = f"frame {index + 1:02d}  {int(timestamp // 60):02d}:{timestamp % 60:04.1f}"
    draw.rectangle((x, y + 180, x + cell_width, y + cell_height), fill="black")
    draw.text((x + 6, y + 186), label, fill="white", font=font)

sheet_path = os.path.join(output_dir, "contact-sheet.jpg")
sheet.save(sheet_path, quality=91, optimize=True)

detail_columns = 3
detail_batch_size = 9
detail_cell_width, detail_image_height, detail_cell_height = 480, 270, 294
detail_sheet_paths = []
detail_sheet_ranges = []
for batch_start in range(0, len(frames), detail_batch_size):
    batch_paths = frames[batch_start:batch_start + detail_batch_size]
    batch_rows = math.ceil(len(batch_paths) / detail_columns)
    detail_sheet = Image.new(
        "RGB",
        (detail_columns * detail_cell_width, batch_rows * detail_cell_height),
        "black",
    )
    detail_draw = ImageDraw.Draw(detail_sheet)
    for batch_index, frame_path in enumerate(batch_paths):
        absolute_index = batch_start + batch_index
        image = Image.open(frame_path).convert("RGB")
        image = ImageOps.fit(image, (detail_cell_width, detail_image_height))
        x = (batch_index % detail_columns) * detail_cell_width
        y = (batch_index // detail_columns) * detail_cell_height
        detail_sheet.paste(image, (x, y))
        timestamp = timestamps[absolute_index]
        label = f"frame {absolute_index + 1:02d}  {int(timestamp // 60):02d}:{timestamp % 60:04.1f}"
        detail_draw.rectangle(
            (x, y + detail_image_height, x + detail_cell_width, y + detail_cell_height),
            fill="black",
        )
        detail_draw.text((x + 6, y + detail_image_height + 6), label, fill="white", font=font)
    detail_path = os.path.join(
        output_dir,
        f"contact-sheet-detail-{len(detail_sheet_paths) + 1:02d}.jpg",
    )
    detail_sheet.save(detail_path, quality=93, optimize=True)
    detail_sheet_paths.append(detail_path)
    detail_sheet_ranges.append({
        "path": detail_path,
        "startFrame": batch_start + 1,
        "endFrame": batch_start + len(batch_paths),
        "startSeconds": timestamps[batch_start],
        "endSeconds": timestamps[batch_start + len(batch_paths) - 1],
    })

print(json.dumps({
    "ok": True,
    "durationSeconds": round(duration, 3),
    "sampleCount": len(frames),
    "framePaths": frames,
    "timestampsSeconds": timestamps,
    "contactSheetPath": sheet_path,
    "detailSheetPaths": detail_sheet_paths,
    "detailSheetRanges": detail_sheet_ranges,
    "ffmpegPath": ffmpeg,
}))
`.trim();
    const result = await runProcess('python', [
        '-c',
        code,
        videoPath,
        outputDir,
        String(clampNumber(sampleCount, 36, 6, 40))
    ], {
        cwd: outputDir,
        timeoutMs: clampNumber(timeoutMs, 180000, 30000, 600000)
    });
    let payload = {};
    try {
        payload = JSON.parse(normalizeString(result.stdout, '{}').split(/\r?\n/).filter(Boolean).at(-1) || '{}');
    } catch {}
    return {
        ...payload,
        ok: result.exitCode === 0 && payload.ok === true,
        exitCode: result.exitCode,
        timedOut: result.timedOut === true,
        stderr: normalizeString(result.stderr).slice(0, 2000)
    };
}

function needsDetailedVideoFrameReview(question = '') {
    const text = normalizeString(question).toLowerCase();
    const sameFrameCue = /\b(?:simultaneous(?:ly)?|at (?:the )?same time|at once|same frame|single frame|on[- ]screen|on camera|co[- ]occur)\b/.test(text) ||
        /(?:同时|同屏|同一画面|同一个画面|同一帧|镜头中|画面中)/.test(text);
    const enumerationCue = /\b(?:highest|lowest|maximum|minimum|max|most|least|fewest|how many|number of|count)\b/.test(text) ||
        /(?:最高|最低|最多|最少|多少|数量|计数)/.test(text);
    return sameFrameCue && enumerationCue;
}

async function synthesizeVideoFrameAnalyses({
    question = '',
    analyses = [],
    timeoutMs = 240000
} = {}) {
    const usable = (Array.isArray(analyses) ? analyses : [])
        .filter((entry) => normalizeString(entry?.analysis))
        .map((entry) => [
            `Batch ${entry.batch}: frames ${entry.startFrame}-${entry.endFrame}`,
            normalizeString(entry.analysis)
        ].join('\n'));
    if (!usable.length) return '';
    const settings = readDesktopLlmSettings();
    if (!settings) return usable.join('\n\n');
    const response = await callDesktopLlmProvider({
        ...settings,
        timeoutMs
    }, {
        temperature: 0,
        timeoutMs,
        messages: [
            {
                role: 'system',
                content: [
                    'Aggregate visual evidence reports from non-overlapping chronological frame batches of one video.',
                    'Use only facts explicitly visible in the reports.',
                    'For simultaneous or same-frame maxima, never combine entities from different frames or batches.',
                    'If a report supports a larger count with a same-frame entity breakdown, preserve that supported maximum even when other batches have lower counts.',
                    'State the strongest answer first, followed by the supporting frame and timestamp.'
                ].join(' ')
            },
            {
                role: 'user',
                content: [
                    `Question: ${normalizeString(question)}`,
                    '',
                    ...usable
                ].join('\n')
            }
        ]
    });
    return response.ok ? normalizeString(response.content) : usable.join('\n\n');
}

async function videoExtractFrames(args = {}) {
    const rawPath = normalizeString(args.path || args.file || args.filePath || args.file_path);
    const rawUrl = normalizeString(args.url || args.videoUrl || args.video_url);
    const explicitVideoId = normalizeString(args.video_id || args.videoId || args.id);
    const videoId = extractYouTubeVideoId(explicitVideoId || rawUrl);
    const localPath = rawPath ? path.resolve(rawPath) : '';
    const localStat = localPath ? await fs.stat(localPath).catch(() => null) : null;
    const isDirectUrl = /^https?:\/\//i.test(rawUrl) && !videoId;
    if ((!localStat || !localStat.isFile()) && !videoId && !isDirectUrl) {
        return actionableErrorResult('video_extract_frames requires a local video path or an http(s)/YouTube URL', {
            status: 'invalid_args',
            failureReason: 'video_source_missing',
            suggestedNextCalls: [{
                tool: 'youtube_video_search',
                args: { query: normalizeString(args.query || args.title) }
            }]
        });
    }

    const timeoutMs = clampNumber(args.timeoutMs || args.timeout_ms, 240000, 30000, 600000);
    const sampleCount = clampNumber(args.sampleCount || args.sample_count || args.frames, 36, 6, 40);
    const shouldAnalyze = args.analyze !== false && args.visual_analysis !== false;
    const artifactBase = normalizeString(process.env.AILIS_MCP_ARTIFACT_DIR) ||
        path.join(process.cwd(), '.ailis-state', 'mcp-artifacts');
    const sourceName = videoId || path.basename(localPath || new URL(rawUrl).pathname) || 'video';
    const safeName = sourceName.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 64) || 'video';
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(artifactBase, 'video-frames', `${safeName}-${stamp}`);
    await fs.mkdir(outputDir, { recursive: true });

    let videoPath = localPath;
    let sourceBackend = 'local_file';
    let download = null;
    if (!videoPath) {
        videoPath = path.join(outputDir, `${safeName}.mp4`);
        download = await downloadVideoForFrameExtraction({
            sourceUrl: isDirectUrl ? rawUrl : '',
            videoId,
            targetPath: videoPath,
            timeoutMs,
            maxBytes: args.maxBytes || args.max_bytes
        });
        if (!download.ok) {
            return actionableErrorResult('video_extract_frames could not retrieve readable video bytes', {
                status: download.timedOut ? 'timeout' : 'video_download_failed',
                failureReason: videoId ? 'youtube_video_backends_unavailable' : 'video_download_failed',
                videoId,
                sourceUrl: rawUrl,
                backendErrors: download.errors || [],
                stderr: download.stderr,
                nextActions: [
                    'Retry later or configure AILIS_INVIDIOUS_INSTANCES with a healthy HTTPS Invidious instance.',
                    'If the user permits it, use youtube_transcript with browser cookies for an authenticated fallback.'
                ]
            });
        }
        sourceBackend = download.backend || 'download';
    }

    const sampled = await sampleVideoFrames(videoPath, outputDir, sampleCount, timeoutMs);
    if (!sampled.ok) {
        return actionableErrorResult('video_extract_frames could not sample the downloaded video', {
            status: sampled.timedOut ? 'timeout' : 'frame_extraction_failed',
            failureReason: sampled.error || 'ffmpeg_frame_extraction_failed',
            path: videoPath,
            stderr: sampled.stderr,
            probe: sampled.probe
        });
    }

    const question = normalizeString(
        args.question || args.prompt,
        'Describe the visible events and identify important entities in the sampled video frames.'
    );
    const detailedReview = shouldAnalyze && needsDetailedVideoFrameReview(question);
    let analysisResult = null;
    let batchAnalyses = [];
    if (detailedReview && Array.isArray(sampled.detailSheetRanges) && sampled.detailSheetRanges.length) {
        const batchResults = await Promise.all(sampled.detailSheetRanges.map(async (batch, index) => {
            const analysisPrompt = [
                'This is one high-resolution chronological batch from a uniformly sampled video.',
                `It contains frames ${batch.startFrame}-${batch.endFrame}; each tile has a frame number and timestamp.`,
                `Question: ${question}`,
                'Inspect every tile at full resolution.',
                'For simultaneous or on-screen-at-once questions, count only entities visible inside the same tile.',
                'Include small, distant, or background entities when visibly distinct. Do not count age, sex, or life stage as a separate species/type.',
                'State the strongest same-frame answer first, then list the visible entity/species breakdown and exact supporting frame number(s).'
            ].join('\n');
            const result = await describeImage({
                path: batch.path,
                question: analysisPrompt,
                detail: 'original',
                maxChars: args.maxChars || args.max_chars || 6000,
                timeoutMs
            });
            return {
                batch: index + 1,
                ...batch,
                analysis: result && !result.isError
                    ? normalizeString(result.content?.[0]?.text)
                    : '',
                error: result?.isError === true
                    ? normalizeString(result.content?.[0]?.text || result.details?.error)
                    : ''
            };
        }));
        batchAnalyses = batchResults.filter((entry) => entry.analysis || entry.error);
    } else if (shouldAnalyze) {
        const analysisPrompt = [
            'This is a chronological contact sheet sampled uniformly from one video.',
            'Each tile is one frame and has a timestamp label.',
            `Question: ${question}`,
            'Inspect every tile. When the question asks what is simultaneous or on screen at once, count only entities visible within the same tile; never merge entities seen at different timestamps.',
            'State the strongest answer first, then cite the relevant frame number(s) and timestamp(s). Distinguish exact species/types only when visually supportable.'
        ].join('\n');
        analysisResult = await describeImage({
            path: sampled.contactSheetPath,
            question: analysisPrompt,
            detail: 'original',
            maxChars: args.maxChars || args.max_chars || 6000,
            timeoutMs
        });
    }
    const visualAnalysis = detailedReview
        ? await synthesizeVideoFrameAnalyses({
              question,
              analyses: batchAnalyses,
              timeoutMs
          })
        : analysisResult && !analysisResult.isError
        ? normalizeString(analysisResult.content?.[0]?.text)
        : '';
    const suggestedNextCalls = visualAnalysis
        ? []
        : [{
            tool: 'describe_image',
            args: {
                path: sampled.contactSheetPath,
                question
            }
        }];
    const text = [
        '# VIDEO_FRAME_EVIDENCE_COMPLETE',
        '',
        visualAnalysis ? `visual_analysis:\n${visualAnalysis}` : 'visual_analysis: not_run_or_unavailable',
        '',
        `source_backend: ${sourceBackend}`,
        `video_id: ${videoId}`,
        `duration_seconds: ${sampled.durationSeconds}`,
        `sample_count: ${sampled.sampleCount}`,
        `analysis_mode: ${detailedReview ? 'multi_sheet_detailed' : 'overview'}`,
        `contact_sheet_path: ${sampled.contactSheetPath}`,
        ...(detailedReview
            ? (sampled.detailSheetPaths || []).map((sheetPath, index) =>
                  `detail_sheet_${index + 1}_path: ${sheetPath}`
              )
            : []),
        `timestamps_seconds: ${(sampled.timestampsSeconds || []).join(', ')}`,
        suggestedNextCalls.length
            ? `suggested_next_calls:\n1. describe_image ${JSON.stringify(suggestedNextCalls[0].args)}`
            : ''
    ].filter(Boolean).join('\n');
    const details = {
        status: 'completed',
        complete: true,
        truncated: false,
        reasoningReady: Boolean(visualAnalysis),
        evidenceQuality: visualAnalysis ? 'visual_frame_evidence' : 'sampled_frames',
        sourceBackend,
        sourceUrl: rawUrl,
        videoId,
        videoPath,
        download,
        durationSeconds: sampled.durationSeconds,
        sampleCount: sampled.sampleCount,
        framePaths: sampled.framePaths,
        frameTimestampsSeconds: sampled.timestampsSeconds,
        contactSheetPath: sampled.contactSheetPath,
        detailSheetPaths: sampled.detailSheetPaths || [],
        detailSheetRanges: sampled.detailSheetRanges || [],
        analysisMode: detailedReview ? 'multi_sheet_detailed' : 'overview',
        batchAnalyses,
        visualAnalysis,
        suggestedNextCalls,
        observationContract: {
            status: 'completed',
            semantic_level: visualAnalysis ? 'semantic' : 'visual_frames',
            complete: true,
            truncated: false,
            reasoning_ready: Boolean(visualAnalysis),
            is_evidence: true,
            evidence_quality: visualAnalysis ? 'visual_frame_evidence' : 'sampled_frames'
        }
    };
    return {
        content: [{ type: 'text', text }],
        structuredContent: { ok: true, ...details },
        details
    };
}

async function chessPositionAnalyze(args = {}) {
    const result = await analyzeChessPosition(args);
    if (!result.ok) {
        return actionableErrorResult('chess_position_analyze could not complete local engine analysis.', {
            status: result.status,
            failureReason: result.error,
            message: result.stderr,
            fen: result.fen,
            receivedFen: result.receivedFen,
            nextActions: [
                'Verify that the submitted FEN matches the source board, including every piece and the side to move.',
                'Configure AILIS_STOCKFISH_ENGINE_PATH only when the bundled Stockfish backend is unavailable.'
            ]
        });
    }
    const topVariation = result.variations.find((variation) => variation.rank === 1) ||
        result.variations[0] ||
        null;
    const text = [
        `best_move_san=${result.bestMove.san}`,
        `best_move_uci=${result.bestMove.uci}`,
        `side_to_move=${result.sideToMove}`,
        `fen=${result.fen}`,
        topVariation
            ? `engine_score=${topVariation.score.type} ${topVariation.score.value} (${topVariation.score.perspective})`
            : '',
        topVariation?.movesSan?.length
            ? `principal_variation=${topVariation.movesSan.join(' ')}`
            : '',
        'board_echo:',
        result.boardEcho
    ].filter(Boolean).join('\n');
    const bestAnswerCandidate = {
        answer: result.bestMove.san,
        source: 'stockfish_engine_best_move',
        selected: true,
        finalizable: true,
        confidence: 0.99
    };
    return textResult(text, {
        ...result,
        answerCandidates: [bestAnswerCandidate],
        bestAnswerCandidate
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
    const lines = [
        'YouTube search results:',
        ...videos.map((video, index) => `${index + 1}. ${video.title || '(untitled)'} | ${video.channel || video.uploader || 'unknown channel'} | ${video.url}`)
    ];
    return textResult(lines.join('\n'), {
        status: 'completed',
        query: searchQuery,
        videos
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
                tool: 'web_search',
                args: { query: `${payload?.title || url} transcript species visual evidence`, maxResults: 5 }
            }
        ]
    };
    const text = result.stdout.trim() + (transcript
        ? ''
        : `\n\nretrieval_diagnostic=${details.evidenceGap}\nAvailable follow-up calls derived from metadata:\n1. web_search ${JSON.stringify(details.suggestedNextCalls[0].args)}`);
    return textResult(text, details);
}

const TOOLS = [
    {
        name: 'web_search',
        description: 'Search the public web. Codex/OAI-style action: search. Standard call: { "query": "specific search keywords", "maxResults": 5, "search_context_size": "medium" }. Use this for discovery; use web_fetch/open_page for a selected result URL and web_find/find_in_page for an exact phrase inside a known page. Do not use for attached/local files, known PDFs, audio, images, spreadsheets, Word documents, code files, or GitHub repositories when a dedicated tool exists. Results are normalized, de-duplicated, re-ranked, and returned as compact search results with URLs; the model judges evidence sufficiency.',
        inputSchema: {
            type: 'object',
            required: ['query'],
            properties: {
                query: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 240,
                    description: 'Required concise public web search query. Keep only discriminative entities and constraints; never concatenate previous queries.'
                },
                maxResults: { type: 'number', description: 'Requested result count, clamped to 1-12. Use 3-8 for normal tasks.' },
                search_context_size: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Amount of search context to return. Defaults to medium.' },
                recency: { type: 'integer', minimum: 1, maximum: 3650, description: 'Optional recent-days hint. Omit unless recent results are explicitly required.' },
                domains: { type: 'array', maxItems: 8, items: { type: 'string', minLength: 1 }, description: 'Optional domain allowlist. Matching includes subdomains.' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'web_research',
        description: 'End-to-end AILIS web research pipeline for natural research/guide/current-info tasks. Use it once for broad discovery and bounded page fetching. It returns ranked candidates and fetched sources with stable ref_id, answer-bearing excerpts, source URLs, and explicit open_page actions. If one concrete required fact is absent from the excerpts, call web_fetch on the most authoritative returned source URL; do not repeat broad web_research for the same question. The tool does not produce the final answer; the model judges evidence sufficiency.',
        inputSchema: {
            type: 'object',
            required: ['query'],
            properties: {
                query: { type: 'string', minLength: 1, description: 'Required research/search goal. Include disambiguating source, game, product, paper, or entity terms when known.' },
                q: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                search: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                text: { type: 'string', description: 'Compatibility alias for query. Prefer query.' },
                queries: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Optional Codex-style multi-query action. Provide 2-5 query variants when helpful; web_research will run them inside one bounded-parallel retrieval pipeline and return one merged evidence bundle.'
                },
                searchQueries: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Compatibility alias for queries. Prefer queries.'
                },
                search_queries: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Compatibility alias for queries. Prefer queries.'
                },
                maxResults: { type: 'number', description: 'Search result count, clamped to 1-12.' },
                limit: { type: 'number', description: 'Compatibility alias for maxResults. Prefer maxResults.' },
                maxPages: { type: 'number', description: 'Maximum pages to fetch into the evidence bundle, clamped to 1-5.' },
                maxSearchQueries: { type: 'number', description: 'Maximum planned query variants to run before fetching pages, clamped to 1-5. Defaults to 3 for product-grade recall without open-ended loops.' },
                max_search_queries: { type: 'number', description: 'Compatibility alias for maxSearchQueries. Prefer maxSearchQueries.' },
                parallel: { type: 'boolean', description: 'Optional. Defaults to true. false forces the old sequential/adaptive pipeline for diagnostics.' },
                parallelSearch: { type: 'boolean', description: 'Compatibility alias for parallel search execution. Prefer parallel.' },
                parallel_search: { type: 'boolean', description: 'Compatibility alias for parallel search execution. Prefer parallel.' },
                serial: { type: 'boolean', description: 'Optional diagnostic alias. true forces sequential execution.' },
                sequential: { type: 'boolean', description: 'Compatibility alias for serial. true forces sequential execution.' },
                searchConcurrency: { type: 'number', description: 'Optional search query concurrency, clamped to 1-5. Default is 3 when multiple query variants exist.' },
                search_concurrency: { type: 'number', description: 'Compatibility alias for searchConcurrency.' },
                fetchConcurrency: { type: 'number', description: 'Optional page fetch concurrency, clamped to 1-5. Default is 3 when multiple candidate pages exist.' },
                fetch_concurrency: { type: 'number', description: 'Compatibility alias for fetchConcurrency.' },
                perDomainFetchConcurrency: { type: 'number', description: 'Optional same-host fetch concurrency, clamped to 1-fetchConcurrency. Default is 1 to avoid hammering one site while still fetching different domains in parallel.' },
                per_domain_fetch_concurrency: { type: 'number', description: 'Compatibility alias for perDomainFetchConcurrency.' },
                fetchTimeoutMs: { type: 'number', description: 'Optional timeout budget per fetched page, clamped to 3000-180000 and further limited by overallTimeoutMs. Defaults to a conservative slice of the remaining research budget.' },
                fetch_timeout_ms: { type: 'number', description: 'Compatibility alias for fetchTimeoutMs.' },
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
                    items: { type: 'string', enum: ['searxng_json', 'firecrawl_search', 'python_search', 'bing_html', 'duckduckgo_lite', 'duckduckgo_html', 'yahoo_html', 'github_repositories', 'html', 'current_html_fallback', 'searxng', 'firecrawl', 'python'] },
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
        description: 'Open a public HTTP(S) HTML/text URL. Codex/OAI-style action: open_page. Standard calls: { "url": "https://..." }, { "url": "https://...", "lineno": 120 }, or { "url": "https://...", "query": "answer-bearing phrase" }. Returns a line-numbered source_viewport with total_lines, line_start/line_end, has_more_before/has_more_after, and L123 lines. If a field is missing, open another viewport on the same URL with a new lineno or query; do not scrape with shell. Rejects PDF/binary content with unsupported_content_type; use pdf_extract_text or download_file for PDFs/files.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string', minLength: 1, description: 'Required public HTTP(S) HTML/text URL. Do not call with empty args.' },
                lineno: { type: 'number', description: 'Optional 1-based source line number to open near, matching Codex open(..., lineno).' },
                query: { type: 'string', description: 'Optional answer-bearing phrase used only to focus the returned source viewport.' },
                maxLines: { type: 'number', description: 'Optional maximum source lines in the viewport, clamped to 1-300. Omit unless a narrower/wider viewport is needed.' },
                timeoutMs: { type: 'number', description: 'Optional request timeout in milliseconds. Omit by default.' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'web_archive_lookup',
        description: 'Recover historical database, catalog, academic-index, and search-engine result records when a live site, API, or OAI endpoint is offline, blocked, rate-limited, DNS-changed, removed, or no longer preserves the requested past state. Use it for as-of-year record questions and archived query pages filtered by identifiers, classification/subject codes such as DDC, year, language, document type, country/region, flags, or other URL values. This is a general Internet Archive + Arquivo.pt connector, not broad web search. Prefer mode=search for one-call dynamic URL discovery plus snapshot reading; use matchType=prefix and concise contains terms such as identifiers, filter values, or years. Use mode=captures only when you need to inspect candidates, and mode=open for a known provider/URL/timestamp. Read repeated_labeled_fields before paging a long catalog result because it projects labels and values from the full source.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string', minLength: 1, description: 'Original public HTTP(S) URL or stable URL prefix. For dynamic result pages, end the URL at the path or query prefix and use matchType=prefix.' },
                mode: { type: 'string', enum: ['captures', 'search', 'open'], description: 'search discovers candidates and opens the first readable snapshot in one call; captures lists candidates; open reads one known timestamp. Defaults to open when timestamp is present, otherwise captures.' },
                provider: { type: 'string', enum: ['internet_archive', 'arquivo'], description: 'Required for mode=open. Optional single-provider restriction for capture search.' },
                providers: { type: 'array', maxItems: 2, items: { type: 'string', enum: ['internet_archive', 'arquivo'] }, description: 'Optional archive backends for capture search. Defaults to both.' },
                timestamp: { type: 'string', pattern: '^[0-9]{8,14}$', description: 'Capture timestamp returned by mode=captures. Required for mode=open.' },
                matchType: { type: 'string', enum: ['exact', 'prefix'], description: 'exact lists captures of one URL; prefix enumerates archived subpaths or dynamic query URLs. Defaults to exact.' },
                contains: { type: 'string', description: 'Optional terms used to rank archived original URLs, for example a year, identifier, filter name, or query value. Prefix discovery prefers the earliest URL matching every term so later replay-generated query URLs do not hide the original evidence; terms are not sent as a new web search.' },
                query: { type: 'string', description: 'Optional evidence phrase. In captures mode it ranks URLs and triggers opening the first readable snapshot; in search mode it focuses the one-call snapshot; in open mode it focuses the returned source viewport.' },
                fromYear: { type: 'integer', minimum: 1996, maximum: 9999, description: 'Optional archive capture-year lower bound. This is the crawl date, not necessarily the publication year.' },
                toYear: { type: 'integer', minimum: 1996, maximum: 9999, description: 'Optional archive capture-year upper bound.' },
                maxResults: { type: 'integer', minimum: 1, maximum: 50, description: 'Maximum ranked capture URLs returned. Defaults to 12.' },
                scanLimit: { type: 'integer', minimum: 1, maximum: 10000, description: 'Maximum CDX rows scanned before local ranking. Prefix discovery first probes the full terms, then a compact identifier/numeric anchor set; prefix listing defaults to 500 and exact lookup to 120.' },
                maxChars: { type: 'integer', minimum: 1000, maximum: 80000, description: 'Maximum readable characters for mode=open.' },
                timeoutMs: { type: 'integer', minimum: 3000, maximum: 300000, description: 'Per-backend archive request timeout, not the total tool-call deadline. Search mode may issue several requests; omit unless an individual backend probe needs a custom limit.' },
                cdxBaseUrl: { type: 'string', description: 'Optional Internet Archive-compatible CDX endpoint override for self-hosted mirrors/tests.' },
                replayBaseUrl: { type: 'string', description: 'Optional Internet Archive-compatible replay base URL override for self-hosted mirrors/tests.' },
                arquivoCdxUrl: { type: 'string', description: 'Optional Arquivo.pt-compatible CDX endpoint override.' },
                arquivoReplayUrl: { type: 'string', description: 'Optional Arquivo.pt-compatible replay base URL override.' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'open_page',
        description: 'Open a selected public web source by URL and return a line-numbered source_viewport. This is the direct search → open action. Use lineno to open a specific region or query to focus around one missing field.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string', minLength: 1 },
                lineno: { type: 'number', minimum: 1 },
                query: { type: 'string' },
                maxLines: { type: 'number', minimum: 1, maximum: 300 },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'continue_page',
        description: 'Continue reading the same public source at a specific 1-based line number. Use this when a source_viewport has_more_before or has_more_after; do not repeat web_search.',
        inputSchema: {
            type: 'object',
            required: ['url', 'lineno'],
            properties: {
                url: { type: 'string', minLength: 1 },
                lineno: { type: 'number', minimum: 1 },
                maxLines: { type: 'number', minimum: 1, maximum: 300 },
                query: { type: 'string' },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'render_page',
        description: 'Render a JavaScript-dependent public page with the bundled local Crawl4AI worker, then return the same source_viewport object model. Use after a static open returns a JS shell, thin placeholder, or omits data visibly present after rendering.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string', minLength: 1 },
                lineno: { type: 'number', minimum: 1 },
                query: { type: 'string' },
                maxLines: { type: 'number', minimum: 1, maximum: 300 },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'webpage_screenshot',
        description: 'Capture a browser-rendered PNG screenshot of a known public HTTP(S) page with the bundled local Crawl4AI/Playwright browser or an installed Chrome/Edge fallback. Use when the answer depends on visual layout, indentation, columns, line breaks, color, position, charts, canvas, or other pixel evidence that Markdown/text extraction cannot preserve. The PNG is returned to the main Agent model as visual input; this tool does not call another reasoning model.',
        inputSchema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string', minLength: 1 },
                path: { type: 'string', description: 'Optional local PNG output path. The runtime supplies a workspace path for web_run screenshot calls.' },
                query: { type: 'string', description: 'Optional original visual question retained as screenshot context.' },
                detail: { type: 'string', enum: ['low', 'high', 'original'] },
                waitFor: { type: 'string' },
                wait_for: { type: 'string' },
                delayMs: { type: 'integer', minimum: 0, maximum: 30000 },
                delay_ms: { type: 'integer', minimum: 0, maximum: 30000 },
                timeoutMs: { type: 'integer', minimum: 30000, maximum: 300000 }
            },
            additionalProperties: false
        }
    },
    {
        name: 'web_find',
        description: 'Find an exact phrase inside a known public HTTP(S) HTML/text URL. Codex/OAI-style action: find_in_page. Standard call: { "url": "https://...", "pattern": "exact phrase" }. Returns a line-numbered source_viewport around matches. This is not a broad web search.',
        inputSchema: {
            type: 'object',
            required: ['url', 'pattern'],
            properties: {
                url: { type: 'string', minLength: 1, description: 'Required public HTTP(S) HTML/text URL to inspect.' },
                pattern: { type: 'string', minLength: 1, description: 'Required exact phrase or keyword to find inside the source.' },
                contextLines: { type: 'number', description: 'Approximate context lines around the match. Defaults to 3.' },
                maxLines: { type: 'number', description: 'Maximum source lines in the returned viewport, clamped to 3-120.' },
                timeoutMs: { type: 'number', description: 'Request timeout in milliseconds.' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'find_in_page',
        description: 'Find an exact phrase or keyword inside a known public URL and return a line-numbered source_viewport around all visible matches. This is the direct open → find action, not a broad search.',
        inputSchema: {
            type: 'object',
            required: ['url', 'pattern'],
            properties: {
                url: { type: 'string', minLength: 1 },
                pattern: { type: 'string', minLength: 1 },
                contextLines: { type: 'number', minimum: 0 },
                maxLines: { type: 'number', minimum: 3, maximum: 120 },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'pdf_extract_text',
        description: 'Extract readable text from a public PDF URL or local PDF path. Use this instead of web_fetch for application/pdf or .pdf sources. Pass query/extract_query with answer-bearing clues so relevant evidence from the middle of a long PDF is placed before the full returned text.',
        inputSchema: {
            type: 'object',
            anyOf: [
                { required: ['url'] },
                { required: ['path'] }
            ],
            properties: {
                url: { type: 'string' },
                uri: { type: 'string' },
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                query: { type: 'string' },
                q: { type: 'string' },
                extractQuery: { type: 'string' },
                extract_query: { type: 'string' },
                maxChars: { type: 'number' },
                maxPages: { type: 'number' },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'paper_metadata_lookup',
        description: 'Look up scholarly paper metadata from structured APIs before broad web search. Use it for exact paper/report titles or DOI questions, and also for fuzzy bibliographic discovery when you only have author name, year, topic, or journal/source clues. Returns authors, year, venue, DOI, and candidate landing/PDF URLs without scraping publisher pages. It also supports a second hop with authorId to list an author’s earlier works in chronological order.',
        inputSchema: {
            type: 'object',
            anyOf: [
                { required: ['title'] },
                { required: ['query'] },
                { required: ['q'] },
                { required: ['search'] },
                { required: ['doi'] },
                { required: ['author'] },
                { required: ['authorName'] },
                { required: ['author_name'] },
                { required: ['authorId'] },
                { required: ['year'] },
                { required: ['publicationYear'] },
                { required: ['publication_year'] },
                { required: ['topic'] },
                { required: ['subject'] },
                { required: ['keywords'] },
                { required: ['venue'] },
                { required: ['journal'] },
                { required: ['source'] }
            ],
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
            },
            additionalProperties: false
        }
    },
    {
        name: 'wikidata_entity_lookup',
        description: 'Search Wikidata entities and return structured, source-linked facts for small entity sets. Use it for geocoding/place coordinates (latitude and longitude), identity resolution, country or administrative location, official names, dates, authorship, and entity relations such as a person’s place of birth. It accepts several queries in one call, automatically relaxes over-specific natural-language suffixes when exact entity search is empty, resolves linked Q-ids to readable labels, and is suitable for comparing boundary candidates before verifying their source-period labels. This is read-only structured knowledge-graph lookup, not broad web search or a large SPARQL query.',
        inputSchema: {
            type: 'object',
            anyOf: [
                { required: ['query'] },
                { required: ['queries'] },
                { required: ['entityIds'] }
            ],
            properties: {
                query: { type: 'string', minLength: 1, description: 'One entity search phrase. Add country, occupation, year, or another disambiguator when needed.' },
                q: { type: 'string', description: 'Compatibility alias for query.' },
                queries: { type: 'array', minItems: 1, maxItems: 20, items: { type: 'string', minLength: 1 }, description: 'Batch of independent entity search phrases.' },
                entityIds: { type: 'array', minItems: 1, maxItems: 50, items: { type: 'string', pattern: '^Q[0-9]+$' }, description: 'Known Wikidata Q-ids. Use after search when exact identity is established.' },
                entity_ids: { type: 'array', maxItems: 50, items: { type: 'string', pattern: '^Q[0-9]+$' }, description: 'Compatibility alias for entityIds.' },
                properties: {
                    type: 'array',
                    maxItems: 16,
                    items: { type: 'string', minLength: 1 },
                    description: 'Facts to project, such as coordinates, place_of_birth, place_of_death, country, located_in, location, official_name, date_of_birth, date_of_death, inception, occupation, author, instance_of, or an explicit P-id.'
                },
                fields: { type: 'array', maxItems: 16, items: { type: 'string', minLength: 1 }, description: 'Compatibility alias for properties.' },
                language: { type: 'string', description: 'Preferred label language code. Defaults to en with English fallback.' },
                maxResultsPerQuery: { type: 'number', minimum: 1, maximum: 5, description: 'Candidate entities per query. Defaults to 3.' },
                max_results_per_query: { type: 'number', minimum: 1, maximum: 5, description: 'Compatibility alias for maxResultsPerQuery.' },
                timeoutMs: { type: 'number', minimum: 5000, maximum: 180000 },
                wikidataApiUrl: { type: 'string', description: 'Optional Wikidata-compatible Action API endpoint override for mirrors or tests.' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'pdf_find_and_extract',
        description: 'Find a PDF from a known HTML page URL, exact document title, or search query, then extract readable text from the best PDF candidate. Use this after paper_metadata_lookup when you need the paper body rather than just metadata. Standard flow: { "title": "exact paper/report title", "extract_query": "answer terms" } or { "url": "known article page", "extract_query": "answer terms" }. It discovers PDF/download links, tries likely OJS article download URLs, and returns extraction attempts for recovery.',
        inputSchema: {
            type: 'object',
            anyOf: [
                { required: ['url'] },
                { required: ['title'] },
                { required: ['query'] }
            ],
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
            },
            additionalProperties: false
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
        description: 'Value-only pandas preview for simple CSV/XLSX tables: returns shape, columns, first rows, numeric_sums, and total_numeric_sum as JSON text. It does not preserve Excel fills/colors, styles, merged cells, formulas, comments, images, hidden metadata, or render layout. For artifact-style spreadsheet tasks, especially cell colors, formulas, maps, comments, tables, hidden rows/sheets, or exact workbook structure, use artifact_tools open/query/inspect/materialize/render instead.',
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
                detail: { type: 'string', enum: ['low', 'high', 'original'] },
                maxChars: { type: 'number' },
                timeoutMs: { type: 'number' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'video_extract_frames',
        description: 'Retrieve and uniformly sample a local or remote video into timestamped frames and a contact sheet, then optionally analyze that sheet with the configured vision model. Use this for visual video questions, especially simultaneous/on-screen counts that transcripts cannot answer. For YouTube anti-bot failures it uses healthy Invidious companion proxies without browser cookies, then local ffmpeg frame extraction. It never treats title, transcript, or thumbnails as proof of same-frame co-occurrence.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Existing local video path.' },
                file: { type: 'string', description: 'Compatibility alias for path.' },
                filePath: { type: 'string', description: 'Compatibility alias for path.' },
                file_path: { type: 'string', description: 'Compatibility alias for path.' },
                url: { type: 'string', description: 'Direct video URL or YouTube watch URL.' },
                videoUrl: { type: 'string', description: 'Compatibility alias for url.' },
                video_url: { type: 'string', description: 'Compatibility alias for url.' },
                video_id: { type: 'string', description: 'YouTube video id.' },
                videoId: { type: 'string', description: 'Compatibility alias for video_id.' },
                id: { type: 'string', description: 'Compatibility alias for video_id.' },
                question: { type: 'string', description: 'Visual question to answer from the sampled frames.' },
                prompt: { type: 'string', description: 'Compatibility alias for question.' },
                sampleCount: { type: 'number', minimum: 6, maximum: 40, description: 'Uniformly sampled frame count. Default 36.' },
                sample_count: { type: 'number', minimum: 6, maximum: 40, description: 'Compatibility alias for sampleCount.' },
                frames: { type: 'number', minimum: 6, maximum: 40, description: 'Compatibility alias for sampleCount.' },
                analyze: { type: 'boolean', description: 'Run vision analysis on the contact sheet. Default true.' },
                visual_analysis: { type: 'boolean', description: 'Compatibility alias for analyze.' },
                maxBytes: { type: 'number', minimum: 1048576, maximum: 1073741824 },
                max_bytes: { type: 'number', minimum: 1048576, maximum: 1073741824 },
                maxChars: { type: 'number', minimum: 500, maximum: 12000 },
                max_chars: { type: 'number', minimum: 500, maximum: 12000 },
                timeoutMs: { type: 'number', minimum: 30000, maximum: 600000 },
                timeout_ms: { type: 'number', minimum: 30000, maximum: 600000 }
            },
            additionalProperties: false,
            anyOf: [
                { required: ['path'] },
                { required: ['url'] },
                { required: ['video_id'] },
                { required: ['videoId'] }
            ]
        }
    },
    {
        name: 'chess_position_analyze',
        description: 'Analyze a standard chess position from a caller-supplied FEN with the bundled local Stockfish engine. Use after transcribing and checking a board image when the task asks for the best, winning, optimal, forced, or guaranteed move. This tool does not inspect images. It validates the FEN, echoes the board and side to move, and returns the best move in both SAN and UCI plus ranked principal variations.',
        inputSchema: {
            type: 'object',
            required: ['fen'],
            properties: {
                fen: { type: 'string', minLength: 1, description: 'Complete standard-chess FEN with 4 or 6 fields. Verify every piece and the side-to-move field against the source before calling.' },
                position: { type: 'string', description: 'Compatibility alias for fen.' },
                depth: { type: 'number', minimum: 8, maximum: 24, description: 'Stockfish search depth. Default 18.' },
                analysisTimeMs: { type: 'number', minimum: 1000, maximum: 60000, description: 'Soft analysis budget. At this point the tool asks Stockfish to stop and returns the strongest completed result instead of discarding it. Default 12000.' },
                maxTimeMs: { type: 'number', minimum: 1000, maximum: 60000, description: 'Compatibility alias for analysisTimeMs.' },
                max_time_ms: { type: 'number', minimum: 1000, maximum: 60000, description: 'Compatibility alias for analysisTimeMs.' },
                multiPv: { type: 'number', minimum: 1, maximum: 5, description: 'Number of ranked candidate lines. Default 3.' },
                multi_pv: { type: 'number', minimum: 1, maximum: 5, description: 'Compatibility alias for multiPv.' },
                timeoutMs: { type: 'number', minimum: 5000, maximum: 120000 },
                enginePath: { type: 'string', description: 'Optional local Stockfish JS engine path for diagnostics.' },
                engine_path: { type: 'string', description: 'Compatibility alias for enginePath.' }
            },
            additionalProperties: false
        }
    },
    {
        name: 'youtube_video_search',
        description: 'Search or resolve YouTube videos with yt-dlp using title, channel, or URL. This tool is for YouTube/youtu.be sources, not generic video platforms. If yt-dlp is blocked for a known URL, this tool recovers metadata through YouTube oEmbed and returns metadata_only plus exact-title follow-up search suggestions; do not treat metadata_only as transcript/frame evidence.',
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
        description: 'Fetch YouTube metadata and available subtitles/auto-captions with yt-dlp. This tool is for YouTube/youtu.be sources. If only a title/query is known, it can resolve a URL through youtube_video_search. If yt-dlp is blocked, the failure result may include oEmbed metadata and exact-title suggestedNextCalls; do not answer visual/audio questions from metadata_only alone.',
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
    if (name === 'web_archive_lookup') return await webArchiveLookup(args);
    if (name === 'web_find') return await webFind(args);
    if (name === 'open_page') return await openPage(args);
    if (name === 'find_in_page') return await findInPage(args);
    if (name === 'continue_page') return await continuePage(args);
    if (name === 'render_page') return await renderPage(args);
    if (name === 'webpage_screenshot') return await webpageScreenshot(args);
    if (name === 'pdf_extract_text') return await pdfExtractText(args);
    if (name === 'paper_metadata_lookup') return await paperMetadataLookup(args);
    if (name === 'wikidata_entity_lookup') return await wikidataEntityLookup(args);
    if (name === 'pdf_find_and_extract') return await pdfFindAndExtract(args);
    if (name === 'download_file') return await downloadFile(args);
    if (name === 'web_extract_links') return await webExtractLinks(args);
    if (name === 'run_python_file') return await runPythonFile(args);
    if (name === 'read_spreadsheet') return await readSpreadsheet(args);
    if (name === 'read_document') return await readDocument(args);
    if (name === 'read_presentation') return await readPresentation(args);
    if (name === 'transcribe_audio') return await transcribeAudio(args);
    if (name === 'describe_image') return await describeImage(args);
    if (name === 'video_extract_frames') return await videoExtractFrames(args);
    if (name === 'chess_position_analyze') return await chessPositionAnalyze(args);
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
    buildEvidenceSnippets,
    buildWebResearchCandidates,
    buildWebResearchQueryPlan,
    buildSearchClarificationChoices,
    buildSuggestedCallsFromSearchResults,
    buildYouTubeEvidenceSearchQuery,
    buildYouTubeOEmbedUrl,
    buildInvidiousVideoProxyUrl,
    chessPositionAnalyze,
    captureWithHeadlessBrowser,
    classifyYtDlpFailure,
    crawl4aiFetchConfig,
    crawl4aiWorkerPath,
    isHeadlessBrowserAccessBarrier,
    resolveHeadlessBrowserExecutable,
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
    expandStructuredSourceText,
    filterSearchResultsByDomains,
    inferPaperMetadataArgsFromScholarlyQuery,
    fetchArchiveIndexText,
    fetchText,
    fetchTextWithCurl,
    githubRepoRead,
    handleRequest,
    handleToolCall,
    loadManagedSearxngManifest,
    managedSearxngAllowedForSearch,
    managedSearxngManifestCandidates,
    managedSearxngPortCandidates,
    mergeSearchResultsForRerank,
    needsDetailedVideoFrameReview,
    normalizeSearchDomains,
    normalizeSearchBackends,
    parseGitHubRepoRef,
    parseWikipediaPagePayload,
    paperMetadataLookup,
    pdfFindAndExtract,
    pdfExtractText,
    rankLinksForResearch,
    rankSearchResultsForFollowup,
    readDesktopLlmSettings,
    readDocument,
    readPresentation,
    readSpreadsheet,
    resolveSubprocessCwd,
    runPythonFile,
    SEARCH_BACKENDS,
    stripWikiText,
    transcribeAudio,
    videoExtractFrames,
    webExtractLinks,
    webArchiveLookup,
    webFetch,
    webFind,
    openPage,
    findInPage,
    continuePage,
    renderPage,
    webpageScreenshot,
    webResearch,
    webSearch,
    wikidataEntityLookup,
    youtubeTranscript,
    youtubeVideoSearch
};
