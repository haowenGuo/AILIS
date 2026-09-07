import { applyI18n, t } from './i18n.js';

export function installSettingsSearch({ navigate }) {
    const trigger = document.getElementById('settings-search-btn');
    const dialog = document.getElementById('settings-search');
    const input = document.getElementById('settings-search-input');
    const results = document.getElementById('settings-search-results');
    let entries = [];
    let selected = 0;
    let matches = [];

    function buildIndex() {
        // Index labels and navigation only. Never read input values, credentials, memory or runtime logs.
        return [...document.querySelectorAll('.control-page .field-label, .control-page .section-title, .control-page details > summary')]
            .filter(label => {
                for (let parent = label; parent && !parent.classList.contains('control-page'); parent = parent.parentElement) {
                    if (parent.hidden || parent.style.display === 'none') return false;
                }
                return label.textContent.trim();
            }).map(label => {
                const page = label.closest('.control-page');
                const heading = page.querySelector('.page-intro h2')?.textContent || '';
                return { label, page: page.dataset.controlPage, title: label.textContent.trim(), heading };
            });
    }
    function activate(entry) {
        dialog.close();
        navigate(entry.page);
        for (let parent = entry.label.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            if (parent.tagName === 'DETAILS') parent.open = true;
        }
        requestAnimationFrame(() => {
            const target = entry.label.closest('.field') || entry.label;
            document.querySelectorAll('.settings-search-target').forEach(el => el.classList.remove('settings-search-target'));
            target.classList.add('settings-search-target');
            target.scrollIntoView({ block: 'center', behavior: 'auto' });
            const control = target.querySelector('input, select, textarea, button') || target;
            if (!control.matches('input, select, textarea, button, summary')) control.tabIndex = -1;
            control.focus({ preventScroll: true });
            window.setTimeout(() => target.classList.remove('settings-search-target'), 2200);
        });
    }
    function select(index) {
        selected = index;
        [...results.children].forEach((item, i) => item.setAttribute('aria-selected', String(i === selected)));
        const current = results.children[selected];
        if (current) {
            input.setAttribute('aria-activedescendant', current.id);
            current.scrollIntoView({ block: 'nearest' });
        } else input.removeAttribute('aria-activedescendant');
    }
    function search() {
        const query = input.value.trim().toLocaleLowerCase();
        const words = query.split(/\s+/).filter(Boolean);
        matches = entries.filter(entry => words.every(word => `${entry.title} ${entry.heading}`.toLocaleLowerCase().includes(word)));
        if (!query) matches = matches.filter(entry => entry.label.classList.contains('section-title'));
        else matches.sort((a,b) => Number(b.title.toLocaleLowerCase().includes(query)) - Number(a.title.toLocaleLowerCase().includes(query)));
        results.replaceChildren(...matches.map((entry, i) => {
            const button = document.createElement('button'); button.type = 'button';
            button.id = `settings-result-${i}`; button.setAttribute('role', 'option'); button.tabIndex = -1;
            const title = document.createElement('strong'); title.textContent = entry.title;
            const detail = document.createElement('span'); detail.textContent = entry.heading;
            button.append(title, detail); button.addEventListener('click', () => activate(entry));
            return button;
        }));
        document.getElementById('settings-search-empty').hidden = matches.length > 0;
        document.getElementById('settings-search-count').textContent = t('找到 {count} 项设置', { count: matches.length });
        select(0);
    }
    function open() {
        if (dialog.open) { input.focus(); return; }
        entries = buildIndex(); input.value = '';
        applyI18n(dialog); dialog.showModal(); search(); input.focus();
    }
    trigger.addEventListener('click', open);
    input.addEventListener('input', search);
    input.addEventListener('keydown', event => {
        if (event.isComposing) return;
        if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            if (matches.length) select((selected + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length);
        } else if (event.key === 'Enter' && matches[selected]) {
            event.preventDefault(); activate(matches[selected]);
        }
    });
    document.getElementById('settings-search-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    document.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
    });
}
