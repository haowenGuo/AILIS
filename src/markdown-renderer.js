import { appendTextWithAilisEmotes } from './ailis-emote-stickers.js';

const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

export function normalizeMarkdownSource(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.replace(/\r\n?/g, '\n').trim();
    return normalized || fallback;
}

export function markdownToPlainText(value) {
    const source = normalizeMarkdownSource(value);
    if (!source) {
        return '';
    }

    return source
        .replace(/```[a-zA-Z0-9_+.-]*\n([\s\S]*?)```/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
        .replace(/^\s{0,3}#{1,6}\s+/gm, '')
        .replace(/^\s{0,3}>\s?/gm, '')
        .replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

export function setPlainTextContent(target, value) {
    if (!target) {
        return;
    }
    const text = typeof value === 'string' ? value : '';
    target.__ailisMessageContent = text;
    target.dataset.contentFormat = 'text';
    target.classList.remove('message-markdown');
    target.textContent = text;
}

export function setMarkdownContent(target, value) {
    if (!target) {
        return;
    }

    const markdown = normalizeMarkdownSource(value);
    const enableAilisEmotes = target.classList?.contains('message-ai') ||
        target.dataset?.enableAilisEmotes === 'true';
    target.__ailisMessageContent = markdown;
    target.dataset.contentFormat = 'markdown';
    target.classList.add('message-markdown');
    target.replaceChildren(renderMarkdown(markdown, { enableAilisEmotes }));
}

function renderMarkdown(markdown, options = {}) {
    const fragment = document.createDocumentFragment();
    if (!markdown) {
        return fragment;
    }

    const lines = markdown.split('\n');
    let index = 0;

    while (index < lines.length) {
        const line = lines[index];

        if (isBlank(line)) {
            index += 1;
            continue;
        }

        const fence = line.match(/^\s*```([a-zA-Z0-9_+.-]*)?\s*$/);
        if (fence) {
            const language = fence[1] || '';
            const codeLines = [];
            index += 1;
            while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
                codeLines.push(lines[index]);
                index += 1;
            }
            if (index < lines.length) {
                index += 1;
            }
            fragment.appendChild(createCodeBlock(codeLines.join('\n'), language));
            continue;
        }

        const heading = line.match(/^\s{0,3}(#{1,4})\s+(.+?)\s*#*\s*$/);
        if (heading) {
            const level = Math.min(heading[1].length, 4);
            const element = document.createElement(`h${level}`);
            appendInlineMarkdown(element, heading[2], options);
            fragment.appendChild(element);
            index += 1;
            continue;
        }

        if (/^\s{0,3}---+\s*$/.test(line)) {
            fragment.appendChild(document.createElement('hr'));
            index += 1;
            continue;
        }

        if (/^\s{0,3}[-*+]\s+/.test(line)) {
            const list = document.createElement('ul');
            while (index < lines.length) {
                const match = lines[index].match(/^\s{0,3}[-*+]\s+(.+)$/);
                if (!match) {
                    break;
                }
                const item = document.createElement('li');
                appendInlineMarkdown(item, match[1], options);
                list.appendChild(item);
                index += 1;
            }
            fragment.appendChild(list);
            continue;
        }

        if (/^\s{0,3}\d+[.)]\s+/.test(line)) {
            const list = document.createElement('ol');
            while (index < lines.length) {
                const match = lines[index].match(/^\s{0,3}\d+[.)]\s+(.+)$/);
                if (!match) {
                    break;
                }
                const item = document.createElement('li');
                appendInlineMarkdown(item, match[1], options);
                list.appendChild(item);
                index += 1;
            }
            fragment.appendChild(list);
            continue;
        }

        if (/^\s{0,3}>\s?/.test(line)) {
            const quote = document.createElement('blockquote');
            const quoteLines = [];
            while (index < lines.length) {
                const match = lines[index].match(/^\s{0,3}>\s?(.*)$/);
                if (!match) {
                    break;
                }
                quoteLines.push(match[1]);
                index += 1;
            }
            appendInlineMarkdown(quote, quoteLines.join('\n'), options);
            fragment.appendChild(quote);
            continue;
        }

        const paragraphLines = [line];
        index += 1;
        while (index < lines.length && !isBlank(lines[index]) && !isBlockStart(lines[index])) {
            paragraphLines.push(lines[index]);
            index += 1;
        }
        const paragraph = document.createElement('p');
        appendInlineMarkdown(paragraph, paragraphLines.join('\n'), options);
        fragment.appendChild(paragraph);
    }

    return fragment;
}

function createCodeBlock(codeText, language) {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    if (language) {
        code.dataset.language = language;
    }
    code.textContent = codeText;
    pre.appendChild(code);
    return pre;
}

function appendText(parent, text, options = {}) {
    appendTextWithAilisEmotes(parent, text, {
        enabled: Boolean(options.enableAilisEmotes)
    });
}

function appendInlineMarkdown(parent, source, options = {}) {
    const tokenPattern = /(`[^`\n]+`|\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\n)/g;
    let cursor = 0;
    let match = tokenPattern.exec(source);

    while (match) {
        if (match.index > cursor) {
            appendText(parent, source.slice(cursor, match.index), options);
        }

        const token = match[0];
        if (token === '\n') {
            parent.appendChild(document.createElement('br'));
        } else if (token.startsWith('`')) {
            const code = document.createElement('code');
            code.textContent = token.slice(1, -1);
            parent.appendChild(code);
        } else if (match[2] && match[3]) {
            const href = getSafeHref(match[3]);
            if (href) {
                const anchor = document.createElement('a');
                anchor.href = href;
                anchor.target = '_blank';
                anchor.rel = 'noreferrer';
                anchor.textContent = match[2];
                parent.appendChild(anchor);
            } else {
                appendText(parent, match[2], options);
            }
        } else if (match[4]) {
            const strong = document.createElement('strong');
            appendText(strong, match[4], options);
            parent.appendChild(strong);
        } else if (match[5]) {
            const emphasis = document.createElement('em');
            appendText(emphasis, match[5], options);
            parent.appendChild(emphasis);
        }

        cursor = match.index + token.length;
        match = tokenPattern.exec(source);
    }

    if (cursor < source.length) {
        appendText(parent, source.slice(cursor), options);
    }
}

function getSafeHref(rawHref) {
    try {
        const url = new URL(rawHref, window.location.href);
        if (!SAFE_LINK_PROTOCOLS.has(url.protocol)) {
            return '';
        }
        return url.href;
    } catch {
        return '';
    }
}

function isBlank(line) {
    return !line || !line.trim();
}

function isBlockStart(line) {
    return (
        /^\s*```/.test(line) ||
        /^\s{0,3}#{1,4}\s+/.test(line) ||
        /^\s{0,3}---+\s*$/.test(line) ||
        /^\s{0,3}[-*+]\s+/.test(line) ||
        /^\s{0,3}\d+[.)]\s+/.test(line) ||
        /^\s{0,3}>\s?/.test(line)
    );
}
