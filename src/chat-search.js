import { t } from './i18n.js';

export function installChatSearch({ list, onNavigate }) {
    const bar = document.getElementById('chat-search-bar');
    const input = document.getElementById('chat-search-input');
    const count = document.getElementById('chat-search-count');
    let matches = [];
    let active = -1;
    let timer;
    function paint() {
        if (globalThis.CSS?.highlights && globalThis.Highlight) {
            CSS.highlights.set('chat-find', new Highlight(...matches.map(item => item.range)));
            CSS.highlights.set('chat-find-current', new Highlight(...(matches[active] ? [matches[active].range] : [])));
        }
        count.textContent = input.value.trim() ? matches.length ? `${active + 1} / ${matches.length}${matches.length === 1000 ? '+' : ''}` : t('没有找到') : '';
        document.getElementById('chat-search-prev').disabled = !matches.length;
        document.getElementById('chat-search-next').disabled = !matches.length;
    }
    function search() {
        matches = [];
        const query = input.value.trim();
        if (query) {
            // Literal search; regex metacharacters in the query have no special meaning.
            const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu');
            for (const element of list.children) {
                const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
                    acceptNode: node => node.parentElement.closest('.message-tools') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
                });
                const nodes = []; let text = ''; let node;
                while ((node = walker.nextNode())) { nodes.push({ node, start: text.length }); text += node.textContent; }
                for (const match of text.matchAll(pattern)) {
                    const start = match.index, end = start + match[0].length;
                    const first = nodes.find(item => item.start + item.node.length > start);
                    const last = nodes.find(item => item.start + item.node.length >= end);
                    if (!first || !last) continue;
                    const range = document.createRange();
                    range.setStart(first.node, start - first.start); range.setEnd(last.node, end - last.start);
                    matches.push({ range, element });
                    if (matches.length === 1000) break;
                }
                if (matches.length === 1000) break;
            }
        }
        active = matches.length ? Math.max(0, Math.min(active, matches.length - 1)) : -1;
        paint();
    }
    function go(direction) {
        if (!matches.length) return;
        active = (active + direction + matches.length) % matches.length;
        paint(); onNavigate();
        const bounds = matches[active].range.getBoundingClientRect();
        list.scrollTop += bounds.top - list.getBoundingClientRect().top - list.clientHeight / 2;
    }
    function open() { bar.hidden = false; search(); input.focus(); input.select(); }
    function close() {
        bar.hidden = true; clearTimeout(timer); matches = []; active = -1;
        CSS.highlights?.delete('chat-find'); CSS.highlights?.delete('chat-find-current');
        document.getElementById('message-input').focus();
    }
    document.getElementById('search-chat-btn').addEventListener('click', open);
    document.getElementById('chat-search-close').addEventListener('click', close);
    document.getElementById('chat-search-prev').addEventListener('click', () => go(-1));
    document.getElementById('chat-search-next').addEventListener('click', () => go(1));
    input.addEventListener('input', () => { active = 0; search(); go(0); });
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); go(event.shiftKey ? -1 : 1); }
    });
    document.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') { event.preventDefault(); open(); }
        if (event.key === 'Escape' && !bar.hidden) { event.preventDefault(); close(); }
    });
    const observer = new MutationObserver(() => {
        if (!bar.hidden) { clearTimeout(timer); timer = setTimeout(search, 150); }
    });
    observer.observe(list, { childList: true, characterData: true, subtree: true });
    return () => { observer.disconnect(); clearTimeout(timer); };
}
