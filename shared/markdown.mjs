import MarkdownIt from 'markdown-it';

// Presentation and final-reply resource registration use the same syntax.
export function classifyMarkdownHref(value) {
    const href = String(value || '').trim();
    if (!href || /[\u0000-\u001f\u007f]/.test(href)) return 'blocked';
    if (href.startsWith('#')) return 'fragment';
    if (/^(?:\/?[a-z]:[\\/]|file:\/\/)/i.test(href)) return 'local';
    if (href.startsWith('//') || href.startsWith('\\\\')) return 'blocked';
    if (/^https?:/i.test(href)) {
        try { const url = new URL(href); return url.hostname && !url.username && !url.password ? 'remote' : 'blocked'; }
        catch { return 'blocked'; }
    }
    if (/^mailto:/i.test(href)) return 'email';
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return 'blocked';
    return 'local';
}

export const markdownParser = new MarkdownIt({ html: false, breaks: true, linkify: false, typographer: false, maxNesting: 40 });
markdownParser.validateLink = href => classifyMarkdownHref(href) !== 'blocked';

export function markdownResourceLinks(text, limit = 20) {
    const links = new Map();
    const visit = tokens => {
        for (const token of tokens) {
            if (links.size >= limit) return;
            const href = token.type === 'link_open' ? token.attrGet('href') : token.type === 'image' ? token.attrGet('src') : '';
            if (href && classifyMarkdownHref(href) === 'local' && !links.has(href)) links.set(href, { href, image: token.type === 'image' });
            if (token.children) visit(token.children);
        }
    };
    visit(markdownParser.parse(String(text || '').slice(0, 200000), {}));
    return [...links.values()];
}
