import { appendTextWithAilisEmotes } from './ailis-emote-stickers.js';
import { markdownParser, classifyMarkdownHref } from '../shared/markdown.mjs';
import { createStaticHtmlPreview } from './html-preview.js';

export function normalizeMarkdownSource(value, fallback = '') {
    return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() || fallback : fallback;
}

export function markdownToPlainText(value) {
    const text = tokens => tokens.map(token => token.children ? text(token.children)
        : ['text', 'code_inline', 'fence', 'code_block', 'image'].includes(token.type) ? token.content
            : token.block || ['softbreak', 'hardbreak'].includes(token.type) ? '\n' : '').join('');
    return text(markdownParser.parse(normalizeMarkdownSource(value), {})).replace(/\n{3,}/g, '\n\n').trim();
}

export function setPlainTextContent(target, value) {
    if (!target) return;
    target.__ailisMessageContent = typeof value === 'string' ? value : '';
    target.dataset.contentFormat = 'text'; target.classList.remove('message-markdown');
    target.textContent = target.__ailisMessageContent;
}

export function setMarkdownContent(target, value, options = {}) {
    if (!target) return;
    const markdown = normalizeMarkdownSource(value);
    target.__ailisMessageContent = markdown;
    target.dataset.contentFormat = 'markdown'; target.classList.add('message-markdown');
    const fragment = document.createDocumentFragment();
    appendTokens(fragment, markdownParser.parse(markdown, {}), {
        enableAilisEmotes: target.classList.contains('message-ai') || target.dataset.enableAilisEmotes === 'true', ...options
    });
    target.replaceChildren(fragment);
}

const element = (tag, className, text) => {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text !== undefined) result.textContent = text;
    return result;
};
const action = (label, callback) => {
    const button = element('button', 'markdown-action', label); button.type = 'button';
    button.addEventListener('click', callback); return button;
};
const safeTags = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 's', 'table', 'thead', 'tbody', 'tr', 'th', 'td']);

function appendTokens(root, tokens, options) {
    const stack = [root];
    for (const token of tokens) {
        const parent = stack.at(-1);
        if (token.hidden) continue;
        if (token.type === 'inline') { appendTokens(parent, token.children || [], options); continue; }
        if (token.type === 'text') { appendTextWithAilisEmotes(parent, token.content, { enabled: Boolean(options.enableAilisEmotes) }); continue; }
        if (token.type === 'fence' || token.type === 'code_block') {
            const block = element('div', 'markdown-code-block'); const header = element('div', 'markdown-code-header');
            const language = token.info.trim().split(/\s+/)[0];
            header.append(element('span', '', language || '代码'), action('复制代码', async event => {
                try { await navigator.clipboard.writeText(token.content); event.target.textContent = '已复制'; }
                catch { event.target.textContent = '复制失败，请手动选择'; }
            }));
            const pre = element('pre'); const code = element('code', '', token.content);
            if (language) code.dataset.language = language;
            pre.append(code); block.append(header, pre);
            if (['html', 'htm'].includes(language.toLowerCase()) && token.content.length <= 1024 * 1024) {
                let preview;
                const toggle = action('预览 HTML', () => {
                    if (preview) { preview.remove(); preview = null; pre.hidden = false; toggle.textContent = '预览 HTML'; return; }
                    preview = element('div', 'markdown-html-panel');
                    preview.append(element('p', 'markdown-preview-note', '安全静态预览：不执行脚本，不加载外部资源。'), createStaticHtmlPreview(token.content));
                    block.append(preview); pre.hidden = true; toggle.textContent = '查看源码';
                });
                header.append(toggle, action('下载 HTML', () => {
                    const url = URL.createObjectURL(new Blob([token.content], { type: 'application/octet-stream' }));
                    const link = element('a'); link.href = url; link.download = 'ailis-preview.html';
                    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
                }));
            }
            parent.append(block); continue;
        }
        if (token.type === 'code_inline') { parent.append(element('code', '', token.content)); continue; }
        if (token.type === 'softbreak' || token.type === 'hardbreak') { parent.append(element('br')); continue; }
        if (token.type === 'hr') { parent.append(element('hr')); continue; }
        if (token.type === 'image') { parent.append(markdownImage(token, options)); continue; }
        if (token.nesting === -1) { if (stack.length > 1) stack.pop(); continue; }
        if (token.type === 'link_open') {
            const href = token.attrGet('href'); const kind = classifyMarkdownHref(href); let link;
            if (kind === 'remote' || kind === 'email') {
                link = element('a'); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
                if (kind === 'remote' && options.previewWebsite) {
                    const group = element('span', 'markdown-web-link');
                    const preview = action('预览网页', () => options.previewWebsite(href));
                    preview.setAttribute('aria-label', `预览网页：${new URL(href).hostname}`);
                    group.append(link, preview); parent.append(group); stack.push(link); continue;
                }
            } else if (kind === 'local' && options.openResource) {
                link = action('', () => options.openResource(href)); link.classList.add('markdown-resource-link');
            } else {
                link = element('span', 'markdown-unavailable'); link.title = '此入口没有可读取的本地资源，未打开任意文件路径';
            }
            if (token.attrGet('title')) link.title = token.attrGet('title');
            parent.append(link); stack.push(link); continue;
        }
        if (token.nesting === 1 && safeTags.has(token.tag)) {
            const child = element(token.tag);
            if (token.tag === 'ol' && token.attrGet('start')) child.start = Number(token.attrGet('start'));
            if (token.tag === 'td' || token.tag === 'th') {
                const alignment = /^text-align:(left|center|right)$/.exec(token.attrGet('style') || '');
                if (alignment) child.style.textAlign = alignment[1];
            }
            if (token.tag === 'table') {
                const scroll = element('div', 'markdown-table-scroll'); scroll.tabIndex = 0; scroll.setAttribute('aria-label', '表格（可横向滚动）');
                scroll.append(child); parent.append(scroll);
            } else parent.append(child);
            stack.push(child);
        }
    }
}

function markdownImage(token, options) {
    const href = token.attrGet('src'); const kind = classifyMarkdownHref(href);
    const label = token.content || '图片'; const container = element('span', 'markdown-image');
    const show = src => {
        const image = element('img'); image.alt = label; image.loading = 'lazy'; image.decoding = 'async'; image.referrerPolicy = 'no-referrer';
        image.addEventListener('error', () => { container.textContent = `${label}（图片无法加载）`; }, { once: true }); image.src = src;
        const enlarge = action('', () => options.previewImage ? options.previewImage(src, label) : image.classList.toggle('markdown-image-expanded'));
        enlarge.setAttribute('aria-label', `放大图片：${label}`); enlarge.classList.add('markdown-image-open');
        enlarge.append(image); container.replaceChildren(enlarge);
    };
    if (kind === 'remote') {
        // Explicit fetch: a restored conversation must not become a tracking beacon.
        container.append(action(`加载外部图片：${label}`, () => show(href)));
    } else if (kind === 'local' && options.readImage) {
        container.textContent = `正在读取图片：${label}`;
        Promise.resolve().then(() => options.readImage(href)).then(src => {
            if (!/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(src || '')) throw new Error('没有可用的图片快照');
            show(src);
        }).catch(error => { container.textContent = `${label}（${error.message}）`; });
    } else container.textContent = `${label}（图片资源不可用）`;
    return container;
}
