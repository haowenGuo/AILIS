import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const distRoot = resolve(projectRoot, 'dist');
const blogRoot = resolve(projectRoot, 'backend', 'blog_content');
const sitePath = resolve(blogRoot, 'site.json');
const postsPath = resolve(blogRoot, 'posts.json');
const basePath = normalizeBasePath(
    process.env.AILIS_BLOG_BASE_PATH || process.env.AIGRIL_BLOG_BASE_PATH || '/AIGL-Assistant'
);

if (!existsSync(sitePath) || !existsSync(postsPath)) {
    console.warn('[blog] skipped: backend/blog_content/site.json or posts.json is missing');
    process.exit(0);
}

const site = readJson(sitePath);
const posts = readJson(postsPath).sort((left, right) =>
    String(right.published_at || '').localeCompare(String(left.published_at || ''))
);

const locales = Object.keys(site.locales || {});

for (const locale of locales) {
    const labels = site.locales[locale]?.labels || {};
    const translatedPosts = posts.filter((post) => post.translations?.[locale]);

    writeBlogPage(locale, [], renderHomePage(locale, translatedPosts));
    writeBlogPage(locale, ['about'], renderAboutPage(locale));
    writeBlogPage(locale, ['projects'], renderProjectsPage(locale));
    writeBlogPage(locale, ['writing'], renderWritingPage(locale, translatedPosts));

    for (const post of translatedPosts) {
        writeBlogPage(locale, [post.slug], renderPostPage(locale, post));
    }

    writeBlogAsset(locale, 'posts.json', JSON.stringify(translatedPosts, null, 2));
    console.log(`[blog] generated ${translatedPosts.length} ${locale} posts at ${getBlogRootUrl(locale)}/`);
}

writeFileSync(resolve(distRoot, '.nojekyll'), '');
writeFileSync(resolve(distRoot, '404.html'), renderNotFoundPage());

function readJson(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

function normalizeBasePath(value) {
    const normalized = String(value || '').trim().replace(/\/+$/, '');
    if (!normalized) {
        return '';
    }
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function getBlogRootUrl(locale) {
    return locale === site.default_locale ? `${basePath}/blog` : `${basePath}/${locale}/blog`;
}

function writeBlogPage(locale, segments, html) {
    const localizedRoot = locale === site.default_locale ? ['blog'] : [locale, 'blog'];
    const outputDir = resolve(distRoot, ...localizedRoot, ...segments);
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(resolve(outputDir, 'index.html'), html);
}

function writeBlogAsset(locale, fileName, content) {
    const localizedRoot = locale === site.default_locale ? ['blog'] : [locale, 'blog'];
    const outputDir = resolve(distRoot, ...localizedRoot);
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(resolve(outputDir, fileName), content);
}

function renderHomePage(locale, translatedPosts) {
    const config = getLocaleConfig(locale);
    const labels = config.labels || {};
    const featuredPosts = translatedPosts.filter((post) => post.featured).slice(0, 3);
    const recentPosts = translatedPosts.slice(0, 6);

    return renderLayout(locale, {
        active: 'home',
        title: config.site_title,
        description: config.hero_intro,
        content: `
            <section class="hero">
                <p class="eyebrow">${escapeHtml(config.site_subtitle)}</p>
                <h1>${escapeHtml(config.hero_title)}</h1>
                <p class="hero-intro">${escapeHtml(config.hero_intro)}</p>
                <div class="hero-actions">
                    <a class="button primary" href="${getBlogRootUrl(locale)}/writing/">${escapeHtml(labels.read_writing || 'Writing')}</a>
                    <a class="button" href="${getBlogRootUrl(locale)}/projects/">${escapeHtml(labels.view_projects || 'Projects')}</a>
                </div>
            </section>
            ${renderPostSection(locale, labels.featured_writing || 'Featured writing', featuredPosts)}
            ${renderPostSection(locale, labels.recent_posts || 'Recent posts', recentPosts)}
            ${renderInspirationSection(config)}
        `
    });
}

function renderAboutPage(locale) {
    const config = getLocaleConfig(locale);
    const labels = config.labels || {};
    const sections = (config.about_sections || [])
        .map((section) => `
            <article class="panel">
                <h2>${escapeHtml(section.title)}</h2>
                <p>${escapeHtml(section.body)}</p>
            </article>
        `)
        .join('');

    return renderLayout(locale, {
        active: 'about',
        title: `${labels.about || 'About'} - ${config.site_title}`,
        description: config.bio,
        content: `
            <section class="page-heading">
                <p class="eyebrow">${escapeHtml(labels.about || 'About')}</p>
                <h1>${escapeHtml(config.site_title)}</h1>
                <p>${escapeHtml(config.bio)}</p>
            </section>
            <section class="grid two">${sections}</section>
            <section class="panel meta-panel">
                <h2>${escapeHtml(labels.base || 'Base')}</h2>
                <p>${escapeHtml(config.location || '')}</p>
                <p><a href="mailto:${escapeAttribute(config.email || '')}">${escapeHtml(config.email || '')}</a></p>
                <p><a href="${escapeAttribute(config.github || '#')}">${escapeHtml(config.github || '')}</a></p>
            </section>
        `
    });
}

function renderProjectsPage(locale) {
    const config = getLocaleConfig(locale);
    const labels = config.labels || {};
    const projects = (config.featured_projects || [])
        .map((project) => `
            <article class="post-card">
                <h2><a href="${escapeAttribute(project.link || '#')}">${escapeHtml(project.name)}</a></h2>
                <p>${escapeHtml(project.description || '')}</p>
                <a class="text-link" href="${escapeAttribute(project.link || '#')}">${escapeHtml(labels.read_more || 'Read more')}</a>
            </article>
        `)
        .join('');

    return renderLayout(locale, {
        active: 'projects',
        title: `${labels.projects || 'Projects'} - ${config.site_title}`,
        description: config.projects_intro,
        content: `
            <section class="page-heading">
                <p class="eyebrow">${escapeHtml(labels.selected_work || 'Selected work')}</p>
                <h1>${escapeHtml(labels.projects || 'Projects')}</h1>
                <p>${escapeHtml(config.projects_intro || '')}</p>
            </section>
            <section class="post-list">${projects}</section>
        `
    });
}

function renderWritingPage(locale, translatedPosts) {
    const config = getLocaleConfig(locale);
    const labels = config.labels || {};

    return renderLayout(locale, {
        active: 'writing',
        title: `${labels.writing || 'Writing'} - ${config.site_title}`,
        description: config.writing_intro,
        content: `
            <section class="page-heading">
                <p class="eyebrow">${escapeHtml(labels.all_writing || 'All writing')}</p>
                <h1>${escapeHtml(labels.writing || 'Writing')}</h1>
                <p>${escapeHtml(config.writing_intro || '')}</p>
            </section>
            ${renderPostList(locale, translatedPosts)}
        `
    });
}

function renderPostPage(locale, post) {
    const config = getLocaleConfig(locale);
    const labels = config.labels || {};
    const translation = post.translations[locale];
    const markdownPath = resolve(blogRoot, translation.body_file);
    const markdown = existsSync(markdownPath)
        ? readFileSync(markdownPath, 'utf8')
        : `# ${translation.title}\n\nMissing post body: ${translation.body_file}`;

    return renderLayout(locale, {
        active: 'writing',
        title: `${translation.title} - ${config.site_title}`,
        description: translation.summary,
        content: `
            <article class="article">
                <a class="back-link" href="${getBlogRootUrl(locale)}/writing/">${escapeHtml(labels.back_to_writing || 'Back to writing')}</a>
                <header class="article-header">
                    <p class="eyebrow">${escapeHtml(formatDate(post.published_at))} · ${escapeHtml(post.reading_time || '')}</p>
                    <h1>${escapeHtml(translation.title)}</h1>
                    <p>${escapeHtml(translation.summary || '')}</p>
                    ${renderTags(post.tags || [])}
                </header>
                <div class="article-body">${markdownToHtml(markdown)}</div>
            </article>
        `
    });
}

function renderPostSection(locale, title, sectionPosts) {
    if (!sectionPosts.length) {
        return '';
    }
    return `
        <section class="section-block">
            <div class="section-title">
                <p class="eyebrow">${escapeHtml(title)}</p>
                <a class="text-link" href="${getBlogRootUrl(locale)}/writing/">View all</a>
            </div>
            ${renderPostList(locale, sectionPosts)}
        </section>
    `;
}

function renderPostList(locale, listPosts) {
    const cards = listPosts.map((post) => renderPostCard(locale, post)).join('');
    return `<section class="post-list">${cards}</section>`;
}

function renderPostCard(locale, post) {
    const translation = post.translations[locale];
    return `
        <article class="post-card">
            <div class="post-meta">${escapeHtml(formatDate(post.published_at))} · ${escapeHtml(post.reading_time || '')}</div>
            <h2><a href="${getBlogRootUrl(locale)}/${escapeAttribute(post.slug)}/">${escapeHtml(translation.title)}</a></h2>
            <p>${escapeHtml(translation.summary || '')}</p>
            ${renderTags(post.tags || [])}
        </article>
    `;
}

function renderInspirationSection(config) {
    if (!config.inspirations?.length) {
        return '';
    }

    const labels = config.labels || {};
    const links = config.inspirations
        .map((item) => `
            <li>
                <a href="${escapeAttribute(item.url)}">${escapeHtml(item.name)}</a>
                <span>${escapeHtml(item.note || '')}</span>
            </li>
        `)
        .join('');

    return `
        <section class="panel inspiration">
            <p class="eyebrow">${escapeHtml(labels.inspiration || 'Inspiration')}</p>
            <h2>${escapeHtml(labels.blog_references || 'Blog references')}</h2>
            <ul>${links}</ul>
        </section>
    `;
}

function renderTags(tags) {
    if (!tags.length) {
        return '';
    }
    return `<div class="tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>`;
}

function renderLayout(locale, page) {
    const config = getLocaleConfig(locale);
    const title = page.title || config.site_title;
    const description = page.description || config.site_subtitle;
    const lang = locale === 'zh' ? 'zh-CN' : locale;

    return `<!doctype html>
<html lang="${escapeAttribute(lang)}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttribute(description)}">
    <style>${getStyles()}</style>
</head>
<body>
    <div class="site-shell">
        <header class="site-header">
            <a class="brand" href="${getBlogRootUrl(locale)}/">
                <span>${escapeHtml(config.site_title)}</span>
                <small>${escapeHtml(config.site_subtitle)}</small>
            </a>
            ${renderNavigation(locale, page.active)}
        </header>
        <main>${page.content}</main>
        <footer class="site-footer">
            <span>${escapeHtml(config.site_title)}</span>
            <a href="${basePath}/?backend=https://airi-backend.onrender.com">AIGL-Assistant Demo</a>
            <a href="${escapeAttribute(config.github || '#')}">GitHub</a>
        </footer>
    </div>
</body>
</html>`;
}

function renderNavigation(locale, active) {
    const config = getLocaleConfig(locale);
    const labels = config.nav || {};
    const root = getBlogRootUrl(locale);
    const switchLocale = locale === 'zh' ? 'en' : 'zh';
    const switchRoot = getBlogRootUrl(switchLocale);

    const items = [
        ['home', labels.home || 'Home', `${root}/`],
        ['about', labels.about || 'About', `${root}/about/`],
        ['projects', labels.projects || 'Projects', `${root}/projects/`],
        ['writing', labels.writing || 'Writing', `${root}/writing/`]
    ];

    return `
        <nav class="site-nav">
            ${items.map(([key, label, href]) => `<a class="${active === key ? 'active' : ''}" href="${href}">${escapeHtml(label)}</a>`).join('')}
            <a href="${switchRoot}/">${switchLocale.toUpperCase()}</a>
        </nav>
    `;
}

function renderNotFoundPage() {
    return `<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page not found</title>
    <script>
        window.location.replace('${basePath}/blog/');
    </script>
</head>
<body>
    <p>Redirecting to <a href="${basePath}/blog/">blog home</a>.</p>
</body>
</html>`;
}

function getLocaleConfig(locale) {
    return site.locales[locale] || site.locales[site.default_locale] || {};
}

function formatDate(value) {
    return value || '';
}

function markdownToHtml(markdown) {
    const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let paragraph = [];
    let listType = '';
    let codeLines = [];
    let inCode = false;

    const flushParagraph = () => {
        if (paragraph.length) {
            html.push(`<p>${paragraph.map(formatInline).join(' ')}</p>`);
            paragraph = [];
        }
    };

    const closeList = () => {
        if (listType) {
            html.push(`</${listType}>`);
            listType = '';
        }
    };

    const openList = (type) => {
        if (listType !== type) {
            closeList();
            html.push(`<${type}>`);
            listType = type;
        }
    };

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();

        if (line.startsWith('```')) {
            flushParagraph();
            closeList();
            if (inCode) {
                html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
                codeLines = [];
                inCode = false;
            } else {
                inCode = true;
            }
            continue;
        }

        if (inCode) {
            codeLines.push(rawLine);
            continue;
        }

        if (!line.trim()) {
            flushParagraph();
            closeList();
            continue;
        }

        const heading = /^(#{1,3})\s+(.+)$/.exec(line);
        if (heading) {
            flushParagraph();
            closeList();
            const level = heading[1].length;
            html.push(`<h${level}>${formatInline(heading[2])}</h${level}>`);
            continue;
        }

        const unorderedItem = /^[-*]\s+(.+)$/.exec(line);
        if (unorderedItem) {
            flushParagraph();
            openList('ul');
            html.push(`<li>${formatInline(unorderedItem[1])}</li>`);
            continue;
        }

        const orderedItem = /^\d+\.\s+(.+)$/.exec(line);
        if (orderedItem) {
            flushParagraph();
            openList('ol');
            html.push(`<li>${formatInline(orderedItem[1])}</li>`);
            continue;
        }

        const quote = /^>\s+(.+)$/.exec(line);
        if (quote) {
            flushParagraph();
            closeList();
            html.push(`<blockquote>${formatInline(quote[1])}</blockquote>`);
            continue;
        }

        closeList();
        paragraph.push(line.trim());
    }

    flushParagraph();
    closeList();
    if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    }
    return html.join('\n');
}

function formatInline(value) {
    return escapeHtml(value)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
            return `<a href="${escapeAttribute(href)}">${label}</a>`;
        });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
}

function getStyles() {
    return `
:root {
    color-scheme: light;
    --bg: #f7f1e8;
    --paper: rgba(255, 252, 245, 0.88);
    --ink: #27231f;
    --muted: #776d61;
    --line: rgba(68, 55, 40, 0.14);
    --accent: #a5532a;
    --accent-soft: #ead3bf;
    --shadow: 0 24px 80px rgba(56, 42, 27, 0.12);
}
* { box-sizing: border-box; }
body {
    margin: 0;
    min-height: 100vh;
    color: var(--ink);
    font-family: Georgia, "Times New Roman", "Noto Serif SC", serif;
    background:
        radial-gradient(circle at 12% 8%, rgba(234, 182, 125, 0.32), transparent 26rem),
        radial-gradient(circle at 80% 0%, rgba(125, 160, 136, 0.20), transparent 30rem),
        linear-gradient(135deg, #fbf6ed 0%, #efe3d3 100%);
}
a { color: inherit; text-decoration: none; }
a:hover { color: var(--accent); }
.site-shell { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 34px 0 46px; }
.site-header, .site-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 18px 0;
}
.brand { display: grid; gap: 4px; }
.brand span { font-size: 1.1rem; font-weight: 800; letter-spacing: 0.04em; }
.brand small, .post-meta, .eyebrow { color: var(--muted); font-size: 0.86rem; letter-spacing: 0.08em; text-transform: uppercase; }
.site-nav, .site-footer { display: flex; gap: 14px; flex-wrap: wrap; color: var(--muted); }
.site-nav a { padding: 8px 10px; border-radius: 999px; }
.site-nav a.active, .site-nav a:hover { color: var(--ink); background: rgba(255, 255, 255, 0.58); }
.hero, .page-heading, .article-header {
    padding: clamp(42px, 7vw, 82px);
    border: 1px solid var(--line);
    border-radius: 34px;
    background: var(--paper);
    box-shadow: var(--shadow);
    margin: 24px 0;
}
.hero h1, .page-heading h1, .article h1 {
    max-width: 860px;
    margin: 10px 0 18px;
    font-size: clamp(1.82rem, 3vw, 2.18rem);
    line-height: 1.18;
    letter-spacing: -0.025em;
}
.hero-intro, .page-heading p, .article-header p {
    max-width: 760px;
    color: var(--muted);
    font-size: 1.08rem;
    line-height: 1.85;
}
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
.button {
    display: inline-flex;
    padding: 12px 18px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(255,255,255,0.58);
}
.button.primary { background: var(--ink); color: #fffaf0; }
.section-block { margin: 42px 0; }
.section-title { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
.post-list, .grid.two {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 18px;
}
.post-card, .panel {
    border: 1px solid var(--line);
    border-radius: 26px;
    background: rgba(255, 252, 245, 0.72);
    padding: 24px;
}
.post-card h2, .panel h2 { margin: 10px 0; font-size: 1.45rem; line-height: 1.18; }
.post-card p, .panel p, .inspiration li { color: var(--muted); line-height: 1.75; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.tags span {
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 5px 9px;
    color: var(--muted);
    font-size: 0.82rem;
    background: rgba(255,255,255,0.44);
}
.text-link, .back-link { color: var(--accent); font-weight: 700; }
.article { max-width: 900px; margin: 0 auto; }
.article-header { padding: clamp(32px, 6vw, 68px); }
.article-body {
    margin: 28px 0;
    padding: clamp(28px, 6vw, 64px);
    border-radius: 30px;
    border: 1px solid var(--line);
    background: rgba(255, 252, 245, 0.78);
}
.article-body h1 { font-size: clamp(1.72rem, 2.8vw, 2.05rem); line-height: 1.22; letter-spacing: -0.02em; }
.article-body h2 { margin-top: 2.2em; font-size: 1.75rem; }
.article-body h3 { margin-top: 1.8em; font-size: 1.28rem; }
.article-body p, .article-body li, .article-body blockquote { color: #3f382f; font-size: 1.05rem; line-height: 1.95; }
.article-body ul, .article-body ol { padding-left: 1.35rem; }
.article-body code {
    font-family: "Cascadia Code", Consolas, monospace;
    background: rgba(165, 83, 42, 0.11);
    border-radius: 7px;
    padding: 0.12em 0.34em;
}
.article-body pre {
    overflow: auto;
    padding: 18px;
    border-radius: 18px;
    background: #25211d;
    color: #fff7e8;
}
.inspiration ul { display: grid; gap: 10px; padding-left: 1.1rem; }
.inspiration span { display: block; color: var(--muted); }
.site-footer { border-top: 1px solid var(--line); margin-top: 48px; color: var(--muted); }
@media (max-width: 720px) {
    .site-header { align-items: flex-start; flex-direction: column; }
    .hero, .page-heading, .article-header { border-radius: 24px; }
    .article-body { border-radius: 22px; }
}
`;
}
