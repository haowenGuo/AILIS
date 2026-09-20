// Actual host resource storage + actual renderer, synthetic final reply. No model/API spend.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { AILISTaskInteraction } = require('../electron/ailis-task-interaction.cjs');

(async () => {
    const base = process.env.AILIS_PREVIEW_URL || 'http://127.0.0.1:5191';
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-rich-output-'));
    const workspace = path.join(root, 'workspace'); fs.mkdirSync(workspace);
    const output = path.resolve('tmp/rich-output-smoke'); fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
    const context = await browser.newContext({ viewport: { width: 1050, height: 1000 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage(); const errors = []; const external = [];
    page.on('pageerror', error => errors.push(error.message));
    const image = await page.evaluate(() => {
        const canvas = document.createElement('canvas'); canvas.width = 720; canvas.height = 220;
        const ctx = canvas.getContext('2d'); ctx.fillStyle = '#f1f5f3'; ctx.fillRect(0, 0, 720, 220);
        ctx.fillStyle = '#355446'; ctx.font = '24px sans-serif'; ctx.fillText('AILIS · Markdown + resource preview', 28, 42);
        ctx.fillStyle = '#93b7a0'; [125, 190, 280, 390].forEach((width, i) => ctx.fillRect(30, 65 + 33 * i, width, 18));
        return canvas.toDataURL('image/png');
    });
    fs.writeFileSync(path.join(workspace, 'plot.png'), Buffer.from(image.split(',')[1], 'base64'));
    const html = '<!doctype html><html><head><style>body{color:#253d32;background:#f4f7f5}h1{font-size:32px}.card{padding:20px;border:1px solid #cad9cf;border-radius:12px}</style></head><body><h1>成果文档预览</h1><div class="card">HTML 保留布局；下载保留原始文件。</div><script>parent.__previewEscaped=true;fetch("https://unsafe.test/script")</script><meta http-equiv="refresh" content="0;url=https://unsafe.test/nav"><img src="https://unsafe.test/img" onerror="parent.__previewEscaped=true"><a href="https://unsafe.test/link">跳转</a><iframe src="https://unsafe.test/frame"></iframe><svg onload="parent.__previewEscaped=true"></svg><form action="https://unsafe.test/form"><input></form></body></html>';
    fs.writeFileSync(path.join(workspace, 'report.html'), html);
    const binary = Buffer.from([80, 75, 0, 255, 128, 10]); fs.writeFileSync(path.join(workspace, 'data.xlsx'), binary);
    const final = '# 任务完成\n\n已生成[成果文档](report.html)、[表格](data.xlsx)。\n\n| 内容 | 状态 | 说明 |\n| :-- | :--: | --: |\n| Markdown | 完成 | 保留原文 |\n| 资源 | 完成 | 快照预览 |\n\n![结果图](plot.png)\n\n- 第一项\n  - 嵌套项目\n\n```js\nconst message = "<script>not executed</script>";\n```\n\n<script>window.__markdownEscaped=true</script>\n\n[危险链接](javascript:alert(1))\n\n![外部图片](https://images.test/plot.png)\n\n[来源](https://example.com)';
    const gateway = new EventEmitter(); gateway.workspaceRoot = workspace; gateway.resolveToolPath = target => target;
    gateway.runAgent = async () => ({ ok: true, status: 'completed', displayText: final });
    const host = new AILISTaskInteraction({ rootDir: path.join(root, 'state'), gateway });
    const receipt = await host.submit({ sessionId: 'rich-smoke', clientMessageId: 'rich-smoke-user', text: '生成一个含文档、图片、表格和下载的回复（合成测试）' });
    await host.active.get('rich-smoke').promise;
    const snapshot = host.snapshot('rich-smoke');
    await page.route('**/*', route => {
        const url = route.request().url();
        if (url.startsWith(base) || /^(?:data:|blob:)/.test(url)) return route.continue();
        external.push(url);
        if (url === 'https://images.test/plot.png') return route.fulfill({ contentType: 'image/png', body: Buffer.from(image.split(',')[1], 'base64') });
        return route.abort();
    });
    await page.exposeFunction('readTaskResource', payload => host.readResource(payload));
    await page.addInitScript(snapshot => {
        if (window !== window.top) return; // Test bridge belongs only to the app, never its sandboxed preview.
        localStorage.setItem('session_id', 'rich-smoke'); window.fixtureSnapshot = snapshot;
        window.ailisDesktop = { platform: 'electron', preferences: { uiLanguage: 'zh-CN', recognitionMode: 'manual', speechMode: 'off' },
            onChatEvent() {}, onPreferencesUpdated() {}, requestChatStateSync() {}, tasks: {
                snapshot: async () => window.fixtureSnapshot, onEvent: () => () => {}, resource: payload => window.readTaskResource(payload)
            } };
    }, snapshot);
    try {
        await page.goto(`${base}/chat.html`); await page.waitForSelector('.task-answer .markdown-image img');
        assert.equal(await page.locator('.task-answer table tbody tr').count(), 2);
        assert.equal(await page.locator('.task-answer ul ul li').textContent(), '嵌套项目');
        assert.equal(await page.locator('.task-answer script, .task-answer iframe, .task-answer a[href^="javascript:"]').count(), 0);
        assert.equal(await page.evaluate(() => Boolean(window.__markdownEscaped)), false);
        assert.equal(await page.locator('.task-answer a[href="https://example.com"]').getAttribute('rel'), 'noopener noreferrer');
        assert.equal(external.length, 0, 'restoring Markdown does not automatically fetch remote images');
        await page.getByRole('button', { name: '复制代码', exact: true }).click();
        assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n'), 'const message = "<script>not executed</script>";\n');
        const doc = page.locator('.task-artifact-card').filter({ hasText: 'report.html' });
        assert.equal(await page.locator('.task-artifact-card').count(), 3);
        await page.locator('.markdown-resource-link').filter({ hasText: '成果文档' }).click();
        await page.waitForSelector('.task-html-preview');
        const iframe = page.frameLocator('.task-html-preview'); await iframe.getByText('成果文档预览').waitFor();
        assert.equal(await page.locator('.task-html-preview').getAttribute('sandbox'), '');
        assert.equal(await iframe.locator('script, iframe, form, svg, img[src^="http"], a[href]').count(), 0);
        assert.equal(await page.evaluate(() => Boolean(window.__previewEscaped)), false);
        assert.equal(external.length, 0, 'HTML preview has no external requests');
        await page.screenshot({ path: path.join(output, 'html-preview.png') });
        await page.getByRole('button', { name: '源码', exact: true }).click();
        assert.equal(await page.locator('.task-artifact-body pre').textContent(), html);
        const downloadEvent = page.waitForEvent('download'); await page.getByRole('button', { name: '下载原文件', exact: true }).click();
        const download = await downloadEvent; assert.equal(download.suggestedFilename(), 'report.html');
        assert.equal(fs.readFileSync(await download.path(), 'utf8'), html);
        await page.getByRole('button', { name: '关闭', exact: true }).click();
        const binaryEvent = page.waitForEvent('download');
        await page.locator('.task-artifact-card').filter({ hasText: 'data.xlsx' }).getByRole('button', { name: '下载', exact: true }).click();
        assert.deepEqual(fs.readFileSync(await (await binaryEvent).path()), binary);
        await page.getByRole('button', { name: '加载外部图片：外部图片', exact: true }).click();
        await page.waitForFunction(() => document.querySelector('img[alt="外部图片"]')?.naturalWidth > 0);
        assert.deepEqual(external, ['https://images.test/plot.png']);
        await page.locator('.task-answer').screenshot({ path: path.join(output, 'markdown-reply.png') });
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile table/code scroll locally');
        await page.screenshot({ path: path.join(output, 'mobile.png') });
        // Restore exact Markdown + persisted metadata, including after original file changes.
        fs.writeFileSync(path.join(workspace, 'report.html'), 'changed'); await page.reload();
        await doc.getByRole('button', { name: '预览', exact: true }).click();
        await page.frameLocator('.task-html-preview').getByText('成果文档预览').waitFor();
        assert.equal(host.snapshot('rich-smoke').runs[0].items.find(item => item.kind === 'assistant').text, final);
        const staleRead = await page.evaluate(async () => {
            const { TaskResourcePresenter } = await import('/src/task-resource-presenter.js');
            let session = 'old'; let complete;
            const presenter = new TaskResourcePresenter({ session: () => session, api: { resource: () => new Promise(resolve => { complete = resolve; }) }, notice() {}, showViewer() {} });
            const pending = presenter.read({ id: 'old-run' }, { id: 'old-resource' }).catch(error => error.message);
            session = 'new'; complete({ text: 'must not display in new session' });
            const result = await pending; presenter.dispose(); return result;
        });
        assert.match(staleRead, /会话已切换/);
        assert.equal(receipt.ok, true); assert.deepEqual(errors, []);
        console.log(`Rich output smoke passed: Markdown, scoped snapshots, HTML isolation, exact HTML/binary downloads, persistence, mobile. Screenshots: ${output}`);
    } finally { host.dispose(); await browser.close(); fs.rmSync(root, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
