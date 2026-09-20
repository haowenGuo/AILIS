import { setMarkdownContent } from './markdown-renderer.js';
import { createStaticHtmlPreview } from './html-preview.js';
import { classifyMarkdownHref } from '../shared/markdown.mjs';
export { createStaticHtmlPreview } from './html-preview.js';

const node = (tag, className = '', text) => {
    const element = document.createElement(tag); element.className = className;
    if (text !== undefined) element.textContent = text; return element;
};
const button = (label, callback) => {
    const element = node('button', 'task-button', label); element.type = 'button'; element.addEventListener('click', callback); return element;
};
const rasterData = value => /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value || '');
export const resourceSize = bytes => bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MiB` : `${Math.ceil(bytes / 1024)} KiB`;


export class TaskResourcePresenter {
    constructor({ api, session, showViewer, notice }) {
        Object.assign(this, { api, session, showViewer, notice }); this.cache = new Map(); this.downloads = new Map();
    }
    async read(run, ref, format = 'preview') {
        if (this.disposed || !ref?.id) throw new Error('资源不可用');
        const sessionId = this.session(); const key = `${sessionId}/${run.id}/${ref.id}/${format}`;
        let result = format === 'preview' && this.cache.get(key);
        if (!result) {
            result = this.api.resource({ sessionId, runId: run.id, resourceId: ref.id, format });
            if (format === 'preview') {
                this.cache.set(key, result);
                if (this.cache.size > 8) this.cache.delete(this.cache.keys().next().value);
                result.catch(() => this.cache.delete(key));
            }
        }
        const data = await result;
        if (this.disposed || this.session() !== sessionId) throw new Error('会话已切换，已取消读取');
        return data;
    }
    lookup(run, href) {
        const item = run.items.find(item => item.hrefs?.includes(href));
        if (!item?.artifactRef) throw new Error(item?.artifactError || '这个链接还没有可用的任务资源快照');
        return item;
    }
    markdownOptions(run) {
        return {
            previewWebsite: href => this.openWebsite(href),
            openResource: href => { try { void this.open(run, this.lookup(run, href)); } catch (error) { this.notice(error.message); } },
            readImage: async href => {
                const data = await this.read(run, this.lookup(run, href).artifactRef);
                if (!rasterData(data.dataUrl)) throw new Error('此文件不是支持的图片');
                return data.dataUrl;
            },
            previewImage: (src, label) => {
                const image = node('img'); image.src = src; image.alt = label; image.referrerPolicy = 'no-referrer';
                this.showViewer(label, image);
            }
        };
    }
    actions(run, item) {
        return [button('预览', () => this.open(run, item)), button('下载', () => this.download(run, item))];
    }
    openWebsite(href) {
        if (classifyMarkdownHref(href) !== 'remote') { this.notice('仅支持 HTTP/HTTPS 网页'); return; }
        const content = node('div', 'task-website-preview');
        const link = node('a', 'task-button', '在浏览器中打开');
        link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
        const frame = node('iframe', 'task-html-preview'); frame.title = `网页预览：${new URL(href).hostname}`;
        // Deliberately no scripts, same-origin, forms, popups, downloads or host bridge.
        frame.setAttribute('sandbox', ''); frame.referrerPolicy = 'no-referrer';
        frame.setAttribute('allow', "camera 'none'; microphone 'none'; geolocation 'none'; clipboard-read 'none'; clipboard-write 'none'");
        frame.src = href;
        content.append(node('p', 'task-receipt', href), link,
            node('p', 'task-receipt', '只读网页预览会联网，但禁用脚本、登录和表单。若页面空白、内容不完整或网站禁止嵌入，请在浏览器中打开。'), frame);
        this.showViewer('网页预览', content);
    }
    async open(run, item) {
        const content = node('div', 'task-artifact-preview');
        content.append(node('p', 'task-receipt', '正在读取成果快照…')); this.showViewer(item.name, content);
        try {
            const data = await this.read(run, item.artifactRef);
            if (!content.isConnected || !content.closest('dialog')?.open) return;
            const toolbar = node('div', 'task-artifact-toolbar');
            toolbar.append(node('span', 'task-receipt', `${item.artifactRef.mime} · ${resourceSize(data.bytes)} · 文件快照`), button('下载原文件', () => this.download(run, item)));
            const preview = node('div', 'task-artifact-body'); content.replaceChildren(toolbar, preview);
            const render = () => {
                preview.replaceChildren();
                if (rasterData(data.dataUrl)) { const image = node('img'); image.src = data.dataUrl; image.alt = item.name; preview.append(image); }
                else if (item.artifactRef.mime === 'text/html') {
                    preview.append(node('p', 'task-receipt', '静态预览：脚本、表单、跳转与外部资源已禁用。'), createStaticHtmlPreview(data.text || ''));
                } else if (item.artifactRef.mime === 'text/markdown') {
                    const markdown = node('div'); setMarkdownContent(markdown, data.text || '', this.markdownOptions(run)); preview.append(markdown);
                } else if (typeof data.text === 'string') preview.append(node('pre', 'task-output', data.text));
                else preview.append(node('p', '', '此格式暂不支持内嵌预览，请下载原文件查看。'));
                if (data.truncated) preview.prepend(node('p', 'task-receipt', '预览仅显示前 1 MiB；下载保留完整原文件。'));
            };
            if (['text/html', 'text/markdown'].includes(item.artifactRef.mime)) toolbar.prepend(
                button('预览', render), button('源码', () => {
                    preview.replaceChildren(node('pre', 'task-output', data.text || ''));
                    if (data.truncated) preview.prepend(node('p', 'task-receipt', '源码预览仅显示前 1 MiB；下载保留完整原文件。'));
                }));
            render();
        } catch (error) { content.replaceChildren(node('p', 'task-error', `预览失败：${error.message}`)); }
    }
    async download(run, item) {
        try {
            const data = await this.read(run, item.artifactRef, 'base64');
            if (typeof data.base64 !== 'string' || data.base64.length > 24 * 1024 * 1024) throw new Error('下载数据无效或超过限制');
            const bytes = Uint8Array.from(atob(data.base64), char => char.charCodeAt(0));
            if (bytes.length !== data.bytes) throw new Error('下载字节数与记录不符');
            const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
            const link = node('a'); link.href = url; link.download = item.name; document.body.append(link); link.click(); link.remove();
            this.downloads.set(url, setTimeout(() => { URL.revokeObjectURL(url); this.downloads.delete(url); }, 60000));
        } catch (error) { if (!this.disposed) this.notice(`下载失败：${error.message}`); }
    }
    clear() { this.cache.clear(); }
    dispose() {
        this.disposed = true; this.clear();
        for (const [url, timer] of this.downloads) { clearTimeout(timer); URL.revokeObjectURL(url); }
        this.downloads.clear();
    }
}
