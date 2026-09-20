const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
    try {
        const page = await browser.newPage({ acceptDownloads: true });
        const errors = [], requests = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('https://preview.test/**', route => {
            requests.push(route.request().url());
            return route.fulfill({ contentType: 'text/html', body: '<h1>Remote page</h1><script>parent.hacked=true</script>' });
        });
        await page.goto(process.env.AILIS_PREVIEW_URL || 'http://127.0.0.1:5191/chat.html', { waitUntil: 'domcontentloaded' });
        await page.evaluate(async () => {
            const { setMarkdownContent } = await import('/src/markdown-renderer.js');
            const { TaskResourcePresenter } = await import('/src/task-resource-presenter.js');
            document.body.replaceChildren();
            const target = document.createElement('div'); target.id = 'fixture'; document.body.append(target);
            const presenter = new TaskResourcePresenter({ api: {}, session: () => 'test', notice: message => { throw Error(message); },
                showViewer: (_, content) => document.body.append(content) });
            const html = '<style>h1{color:rgb(12, 34, 56)}</style><h1>HTML sample</h1><script>parent.hacked=true</script><img src="https://preview.test/should-not-load"><a href="https://preview.test/nav">Link</a>';
            window.testHtml = html + '\n';
            setMarkdownContent(target, '```html\n' + html + '\n```\n\n[Website](https://preview.test/page)', presenter.markdownOptions({ id: 'run', items: [] }));
        });
        assert.equal(requests.length, 0);
        assert.equal(await page.locator('#fixture iframe').count(), 0);
        await page.getByRole('button', { name: '预览 HTML', exact: true }).click();
        const frame = page.frameLocator('#fixture iframe');
        await frame.getByText('HTML sample').waitFor();
        assert.equal(await frame.locator('h1').evaluate(e => getComputedStyle(e).color), 'rgb(12, 34, 56)');
        assert.equal(await frame.locator('script, a[href], img[src^="http"]').count(), 0);
        assert.equal(await page.locator('#fixture iframe').getAttribute('sandbox'), '');
        assert.equal(requests.length, 0);
        require('node:fs').mkdirSync('tmp/html-web-preview-smoke', { recursive: true });
        await page.screenshot({ path: 'tmp/html-web-preview-smoke/html.png' });
        await page.getByRole('button', { name: '查看源码', exact: true }).click();
        assert.equal(await page.locator('#fixture iframe').count(), 0);
        const downloadEvent = page.waitForEvent('download');
        await page.getByRole('button', { name: '下载 HTML', exact: true }).click();
        const download = await downloadEvent;
        assert.equal(download.suggestedFilename(), 'ailis-preview.html');
        assert.equal(require('node:fs').readFileSync(await download.path(), 'utf8'), await page.evaluate(() => window.testHtml));
        await page.getByRole('button', { name: '预览网页：preview.test', exact: true }).click();
        await page.frameLocator('.task-website-preview iframe').getByText('Remote page').waitFor();
        assert.deepEqual(requests, ['https://preview.test/page']);
        assert.equal(await page.evaluate(() => Boolean(window.hacked)), false);
        assert.equal(await page.locator('.task-website-preview iframe').getAttribute('sandbox'), '');
        assert.deepEqual(errors, []);
        console.log('PASS: HTML preview/source/download, CSS, isolation, explicit-only webpage fetch, blocked scripts.');
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
