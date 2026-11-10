// Real renderer with synthetic host records. No user data, microphone or model calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
    const base = process.env.AILIS_PREVIEW_URL || 'http://127.0.0.1:5173';
    const output = path.resolve('tmp/chat-companion-smoke');
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
    const page = await browser.newPage({ viewport: { width: 1672, height: 941 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.addInitScript(() => {
        localStorage.setItem('session_id', 'companion-layout');
        let listener;
        window.fixture = {
            state: { sessionId: 'companion-layout', seq: 1, runs: [{ id: 'welcome', kind: 'history', items: [
                { kind: 'user', text: '早安，AILIS。今天状态有点一般，感觉有点累。' },
                { kind: 'assistant', text: '早安。\n\n辛苦啦，最近一直挺忙的吧。先喝点水，慢慢来。\n\n今天不用一下子做完所有事，我们先挑最重要的一件。' },
                { kind: 'user', text: '那先帮我整理一下今天的安排吧，晚上还想去健身。' },
                { kind: 'assistant', text: '好呀。上午把手头的文档收尾，下午留一段不被打扰的时间。\n\n晚上就把电脑合上，去运动一下。你想先从哪件事开始？' }
            ] }], activeRunId: '' },
            submitted: [],
            emit() { this.state.seq++; listener?.({ sessionId: this.state.sessionId, type: 'changed' }); }
        };
        const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT1cAAAAASUVORK5CYII=';
        window.ailisDesktop = {
            platform: 'electron', preferences: { uiLanguage: 'zh-CN', recognitionMode: 'manual', speechMode: 'off' },
            onChatEvent() {}, onPreferencesUpdated() {}, requestChatStateSync() {},
            transcribeAudio: async () => ({ text: '' }),
            showControlPanel() { window.fixture.settingsOpened = true; },
            files: { choose: async () => ({ files: [{ path: 'C:/fixture/notes.md', name: 'notes.md', size: 1234 }] }) },
            vision: { capture: async () => ({ ok: true, snapshot: { dataUrl: pixel, width: 100, height: 100, label: '测试截图' } }) },
            tasks: {
                snapshot: async () => structuredClone(window.fixture.state),
                onEvent: callback => { listener = callback; return () => {}; },
                submit: async payload => {
                    window.fixture.submitted.push(payload);
                    const run = { id: 'submitted', status: 'running', startedAt: Date.now(), items: [{ id: payload.clientMessageId, kind: 'user', text: payload.text }] };
                    window.fixture.state.runs.push(run); window.fixture.state.activeRunId = run.id; window.fixture.emit();
                    return { ok: true, runId: run.id, status: 'accepted' };
                },
                stop: async () => { window.fixture.stopped = true; return { ok: true }; }
            }
        };
    });

    async function checkLayout(label) {
        const metrics = await page.evaluate(() => {
            const rect = selector => {
                const { x, y, width, height, bottom, right } = document.querySelector(selector).getBoundingClientRect();
                return { x, y, width, height, bottom, right };
            };
            const image = document.querySelector('#companion-scene img');
            const controls = ['#file-btn', '#message-input', '#vision-btn', '#voice-btn', '#send-btn'].map(rect);
            return {
                viewport: { width: innerWidth, height: innerHeight }, overflow: document.documentElement.scrollWidth > innerWidth,
                sceneVisible: getComputedStyle(document.querySelector('#companion-scene')).display !== 'none',
                sceneLoaded: image.complete && image.naturalWidth > 100,
                scene: rect('#companion-scene'), pane: rect('#chat-pane'), conversation: rect('#conversation'),
                composer: rect('#composer'), input: rect('#message-input'), controls,
                outside: [...document.querySelectorAll('.message-item')].some(el => {
                    const box = el.getBoundingClientRect(); return box.left < rect('#chat-pane').x || box.right > innerWidth;
                })
            };
        });
        assert.equal(metrics.overflow, false, `${label}: no document overflow`);
        assert.equal(metrics.outside, false, `${label}: messages fit the pane`);
        assert.ok(metrics.input.width >= 100, `${label}: usable input width`);
        assert.ok(metrics.conversation.height > 100, `${label}: conversation remains readable`);
        assert.ok(metrics.composer.bottom <= metrics.viewport.height, `${label}: composer fits`);
        assert.ok(metrics.conversation.bottom <= metrics.composer.y, `${label}: composer does not cover messages`);
        assert.equal(metrics.sceneLoaded, true, `${label}: illustration loaded`);
        assert.equal(metrics.sceneVisible, metrics.viewport.width >= 800, `${label}: responsive illustration`);
        for (let i = 1; i < metrics.controls.length; i++) {
            assert.ok(metrics.controls[i - 1].right <= metrics.controls[i].x + 1, `${label}: controls do not overlap`);
        }
        if (metrics.sceneVisible) assert.ok(metrics.scene.right <= metrics.pane.x + 1, `${label}: scene and chat separated`);
        return metrics;
    }

    try {
        await page.goto(`${base}/chat.html`);
        await page.waitForSelector('.task-answer');
        assert.equal(await page.locator('#voice-btn').isVisible(), true, 'ASR entry is preserved');
        await page.waitForFunction(() => document.querySelector('#companion-scene img').naturalWidth > 0);
        const background = () => page.locator('#chat-shell').evaluate(el => getComputedStyle(el).backgroundColor);
        assert.equal(await background(), 'rgb(237, 245, 252)', 'fresh profile defaults to pale blue');
        await page.locator('#chat-more-actions summary').click();
        await page.locator('[data-chat-color="#fff2f5"]').click();
        assert.equal(await background(), 'rgb(255, 242, 245)', 'pink preset applies');
        assert.equal(await page.locator('#chat-more-actions').getAttribute('open'), '', 'color selection keeps menu open');
        assert.equal(await page.locator('[data-chat-color="#fff2f5"]').getAttribute('aria-pressed'), 'true');
        await page.reload();
        await page.waitForSelector('.task-answer');
        assert.equal(await background(), 'rgb(255, 242, 245)', 'preset survives reload');
        await page.locator('#chat-more-actions summary').click();
        await page.locator('#chat-background-color').fill('#182a3b');
        await page.locator('#chat-background-color').dispatchEvent('change');
        assert.equal(await background(), 'rgb(24, 42, 59)', 'custom background applies');
        assert.equal(await page.locator('[data-chat-color][aria-pressed="true"]').count(), 0, 'custom color deselects presets');
        assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme), 'dark');
        await page.screenshot({ path: path.join(output, 'custom-dark.png') });
        await page.reload();
        await page.waitForSelector('.task-answer');
        assert.equal(await background(), 'rgb(24, 42, 59)', 'custom color survives reload');
        await page.setViewportSize({ width: 360, height: 640 });
        await page.locator('#chat-more-actions summary').click();
        const menu = await page.locator('.chat-actions-menu').boundingBox();
        assert.ok(menu.x >= 0 && menu.x + menu.width <= 360 && menu.y + menu.height <= 640, 'color panel fits mobile');
        await page.locator('[data-chat-color="#eef7f2"]').click();
        assert.equal(await background(), 'rgb(238, 247, 242)', 'mint preset applies');
        await page.locator('[data-chat-color="#ffffff"]').click();
        assert.equal(await background(), 'rgb(255, 255, 255)', 'white preset applies');
        await page.locator('[data-chat-color="#edf5fc"]').click();
        await page.screenshot({ path: path.join(output, 'color-menu-mobile.png') });
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#chat-more-actions').getAttribute('open'), null, 'escape closes appearance menu');
        await page.evaluate(() => localStorage.setItem('ailis.chat.background.v1', 'invalid-color'));
        await page.reload();
        await page.waitForSelector('.task-answer');
        assert.equal(await background(), 'rgb(237, 245, 252)', 'invalid stored color falls back safely');
        await page.locator('#chat-more-actions summary').click();
        await page.evaluate(() => {
            window.originalStorageSet = Storage.prototype.setItem;
            Storage.prototype.setItem = function(key, value) {
                if (key === 'ailis.chat.background.v1') throw new DOMException('storage unavailable', 'QuotaExceededError');
                return window.originalStorageSet.call(this, key, value);
            };
        });
        await page.locator('[data-chat-color="#fff2f5"]').click();
        assert.equal(await page.locator('#chat-color-notice').isVisible(), true, 'failed persistence is visible');
        assert.equal(await background(), 'rgb(255, 242, 245)', 'storage failure does not block appearance');
        await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSet; });
        await page.locator('[data-chat-color="#edf5fc"]').click();
        assert.equal(await page.locator('#chat-color-notice').isVisible(), false, 'successful save clears error');
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.querySelector('#companion-scene img').naturalWidth > 0);
        await page.evaluate(() => { window.fixture.sceneNode = document.querySelector('#companion-scene img'); });
        const metrics = {};
        for (const [label, width, height] of [['desktop', 1672, 941], ['laptop', 1280, 800], ['compact', 1024, 768], ['mobile', 390, 844], ['small', 360, 640]]) {
            await page.setViewportSize({ width, height });
            metrics[label] = await checkLayout(label);
            await page.screenshot({ path: path.join(output, `${label}.png`) });
        }
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.locator('#vision-btn').click();
        assert.equal(await page.locator('#vision-menu').isVisible(), true);
        await page.locator('[data-vision-target="screen"]').click();
        await page.locator('#vision-preview').waitFor();
        await page.locator('#file-btn').click();
        await page.locator('.file-preview-card').waitFor();
        await checkLayout('attachments');
        await page.setViewportSize({ width: 390, height: 844 });
        await checkLayout('mobile-attachments');
        await page.screenshot({ path: path.join(output, 'mobile-attachments.png') });
        await page.locator('#vision-preview-clear').click();
        await page.locator('.file-preview-remove').click();
        await page.locator('#settings-btn').click();
        assert.equal(await page.evaluate(() => window.fixture.settingsOpened), true);
        await page.locator('#chat-more-actions summary').click();
        await page.locator('#search-chat-btn').click();
        await page.locator('#chat-search-input').fill('早安');
        await page.waitForFunction(() => document.querySelector('#chat-search-count').textContent.includes('2'));
        await page.locator('#chat-search-close').click();
        await page.locator('#message-input').fill('请先整理文档');
        await page.locator('#send-btn').click();
        await page.waitForFunction(() => window.fixture.submitted.length === 1);
        assert.equal(await page.locator('#message-input').inputValue(), '');
        await page.locator('#task-stop-button').waitFor();
        await checkLayout('running-mobile');
        await page.locator('#task-stop-button').click();
        assert.equal(await page.evaluate(() => window.fixture.stopped), true);

        await page.evaluate(() => {
            const run = window.fixture.state.runs.at(-1);
            run.status = 'completed'; run.endedAt = Date.now();
            run.items.push({ id: 'answer', kind: 'assistant', status: 'final', text: '已整理好。\n\n| 文件 | 状态 |\n| --- | --- |\n| notes.md | 完成 |\n\n```python\n' + 'print("long line")  '.repeat(40) + '\n```\n\n' + '这是一段用于检查滚动和换行的长回复。'.repeat(160) });
            window.fixture.state.activeRunId = ''; window.fixture.emit();
        });
        await page.locator('.task-answer pre').waitFor();
        assert.equal(await page.evaluate(() => window.fixture.sceneNode === document.querySelector('#companion-scene img')), true,
            'message updates do not recreate the scene');
        for (const [label, width, height] of [['rich-desktop', 1672, 941], ['rich-mobile', 390, 844], ['short-window', 900, 520]]) {
            await page.setViewportSize({ width, height });
            await checkLayout(label);
            await page.locator('#message-list').evaluate(el => { el.scrollTop = 0; });
            await page.screenshot({ path: path.join(output, `${label}.png`) });
        }
        assert.deepEqual(errors, []);
        fs.writeFileSync(path.join(output, 'layout.json'), JSON.stringify(metrics, null, 2));
        console.log(`Companion layout passed: colors, persistence, storage failure, responsive scene, chat, local scrolling, send/stop, search, settings, attachments. ${output}`);
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
