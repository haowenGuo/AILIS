// Real chat UI, synthetic host bridge. No model, shell, microphone or user profile.
let checks = 0;
const assert = new Proxy(require('node:assert/strict'), { get(target, name) {
    const method = target[name]; return typeof method === 'function' ? (...args) => { checks++; return method(...args); } : method;
} });
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
    const page = await browser.newPage({ viewport: { width: 1024, height: 900 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const base = process.env.AILIS_PREVIEW_URL || 'http://127.0.0.1:5187';
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.addInitScript(() => {
        localStorage.setItem('session_id', 'smoke-session');
        const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 260;
        const painter = canvas.getContext('2d'); painter.fillStyle = '#eef3f8'; painter.fillRect(0, 0, 640, 260);
        painter.fillStyle = '#fff'; painter.fillRect(24, 24, 592, 212); painter.fillStyle = '#263348'; painter.font = '26px sans-serif';
        painter.fillText('AILIS · 图片成果预览', 52, 80); painter.font = '18px sans-serif'; painter.fillStyle = '#667488';
        painter.fillText('测试图片，不是实际设置或运行结果', 52, 125); painter.fillStyle = '#d8e3f3'; painter.fillRect(52, 157, 300, 12); painter.fillRect(52, 186, 215, 12);
        const fixtureImage = canvas.toDataURL('image/png');
        let listener;
        window.mock = { snapshot: { sessionId: 'smoke-session', seq: 1, runs: [], activeRunId: '' }, submitted: [], stopped: [], receipts: {}, failNext: false };
        window.mock.emit = () => { window.mock.snapshot.seq++; listener?.({ sessionId: 'smoke-session', type: 'changed' }); };
        window.ailisDesktop = {
            platform: 'electron', preferences: { uiLanguage: 'zh-CN', recognitionMode: 'manual', speechMode: 'off' },
            onChatEvent() {}, onPreferencesUpdated() {}, requestChatStateSync() {},
            tasks: {
                snapshot: async () => structuredClone(window.mock.snapshot), onEvent: fn => { listener = fn; return () => {}; },
                receipt: async ({ clientMessageId }) => window.mock.receipts[clientMessageId] || { ok: false, status: 'not_received' },
                submit: async payload => {
                    window.mock.submitted.push(payload);
                    if (window.mock.failNext) { window.mock.failNext = false; throw new Error('模拟连接中断'); }
                    const s = window.mock.snapshot;
                    if (!s.activeRunId) { s.activeRunId = `run-${s.runs.length + 1}`; s.runs.push({ id: s.activeRunId, status: 'running', startedAt: Date.now(), model: '测试模型', provider: '本地模拟', items: [] }); }
                    s.runs.at(-1).items.push({ id: payload.clientMessageId, kind: 'user', text: payload.text, status: payload.expectedRunId ? 'queued' : 'included' });
                    const receipt = { ok: true, runId: s.activeRunId, status: payload.expectedRunId ? 'queued' : 'accepted' };
                    window.mock.receipts[payload.clientMessageId] = receipt; window.mock.emit(); return receipt;
                },
                stop: async payload => { window.mock.stopped.push(payload); window.mock.snapshot.runs.at(-1).status = 'stopping'; window.mock.emit(); return { ok: true }; },
                resource: async ({ resourceId }) => resourceId === 'image' ? { dataUrl: fixtureImage }
                    : resourceId === 'diff' ? { text: JSON.stringify({ added: 1, removed: 1, entries: [{ type: 'remove', text: 'const version = 1;', oldLine: 1 }, { type: 'add', text: 'const version = 2;', newLine: 1 }] }) }
                    : { text: resourceId === 'before' ? 'const version = 1;\n' : resourceId === 'after' ? 'const version = 2;\n' : '无法创建进程，错误 267：目录名称无效。' },
                revealFile: async () => ({ ok: true }), confirmRecovery: async () => ({ ok: true })
            }
        };
    });
    try {
        await page.goto(`${base}/chat.html`); await page.waitForSelector('.task-status-strip', { state: 'attached' });
        const baseline = await browser.newPage({ viewport: { width: 1024, height: 900 } });
        await baseline.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
        await baseline.goto(`${base}/chat.html`);
        const originalAppearance = () => {
            const fixture = document.createElement('div');
            fixture.innerHTML = '<div class="message-item message-user">用户</div><div class="message-item message-ai">回答</div>';
            document.getElementById('message-list').append(fixture);
            const selectors = ['#chat-shell', '#chat-header', '.chat-brand-avatar', '#chat-title', '#conversation', '#composer', '#message-input', '#send-btn', '.message-user', '.message-ai'];
            const styles = selectors.map(selector => {
                const element = document.querySelector(selector); const style = getComputedStyle(element);
                return [selector, ...['backgroundColor', 'backgroundImage', 'color', 'borderRadius', 'borderTopWidth', 'padding', 'fontFamily', 'fontSize', 'display'].map(key => style[key])];
            });
            fixture.remove(); return styles;
        };
        assert.deepEqual(await page.evaluate(originalAppearance), await baseline.evaluate(originalAppearance), 'original chat styling is unchanged when task functionality is enabled');
        await baseline.close();
        assert.equal(await page.title(), 'AILIS Chat');
        assert.equal(await page.locator('#chat-empty-state h1').innerText(), '今天，想聊点什么？');
        assert.equal(await page.locator('#chat-empty-state img').isVisible(), true);
        assert.equal(await page.locator('#composer-hint').isVisible(), true);
        assert.equal(await page.locator('#clear-chat-btn span').textContent(), '清空会话');
        await page.locator('#message-input').fill('检查一下源码'); await page.locator('#send-btn').click();
        await page.waitForSelector('.task-user');
        assert.equal(await page.locator('#message-input').inputValue(), '');
        assert.equal(await page.locator('#send-btn').getAttribute('data-mode'), 'send');
        assert.equal(await page.locator('#task-stop-button').isVisible(), true);
        assert.equal(await page.locator('#chat-subtitle').isVisible(), true);
        assert.equal(await page.locator('#chat-subtitle').textContent(), '陪你聊天，也陪你做事');
        assert.equal(await page.locator('#chat-status').textContent(), 'AILIS 正在思考或说话...');
        assert.equal(await page.locator('.task-user .task-receipt').count(), 0, 'success receipt is not repeated under every message');
        assert.equal(await page.locator('.task-status-strip').isVisible(), false, 'no duplicate status banner');
        assert.equal(await page.locator('.task-activity').textContent(), '思考中…');
        await page.evaluate(() => { window.mock.snapshot.runs[0].activity = '等待模型响应'; window.mock.emit(); });
        await page.waitForFunction(() => document.querySelector('.task-activity')?.textContent === 'AILIS正在思考');
        assert.equal(await page.locator('.task-activity').textContent(), 'AILIS正在思考');
        assert.equal(await page.locator('.task-process').count(), 0, 'no empty process disclosure');
        const out = process.env.AILIS_SMOKE_OUTPUT || path.resolve('tmp/task-interaction-smoke'); fs.mkdirSync(out, { recursive: true });
        await page.evaluate(() => {
            const run = window.mock.snapshot.runs[0];
            run.items.push({ id: 'progress-1', kind: 'progress', text: '已找到文档入口，正在检查引用。', status: 'observed' });
            run.items.push({ id: 'call-1', kind: 'tool', tool: 'apply_patch', status: 'running' }); window.mock.emit();
        });
        await page.waitForSelector('.task-progress');
        assert.equal(await page.locator('.task-progress').isVisible(), true, 'public progress is readable without expanding tool logs');
        assert.equal(await page.locator('.task-process .task-progress').count(), 0);
        assert.equal(await page.locator('.task-progress').textContent(), '已找到文档入口，正在检查引用。');
        await page.evaluate(() => {
            const run = window.mock.snapshot.runs[0];
            run.items.push({ id: 'progress-early', kind: 'progress', text: '引用已确认，继续验证。', status: 'observed' });
            run.items.push({ id: 'call-2', kind: 'tool', tool: 'exec_command', status: 'completed', durationMs: 100, outputRef: { id: 'output' } });
            run.items.push({ id: 'plan-1', kind: 'plan', explanation: '先检查，再验证。', plan: [
                { step: '检查引用', status: 'completed' }, { step: '验证结果', status: 'in_progress' }
            ] }); window.mock.emit();
        });
        await page.waitForSelector('.task-plan');
        assert.equal(await page.locator('.task-process, .task-step').count(), 0, 'tool records are absent, not merely collapsed');
        assert.equal(await page.getByRole('button', { name: /查看工具结果|完整输出/ }).count(), 0);
        assert.equal(await page.locator('.task-progress').count(), 2);
        assert.equal(await page.locator('.task-process .task-progress').count(), 0);
        assert.equal(await page.locator('.task-plan summary').textContent(), '计划 1/2 · 验证结果');
        await page.locator('.task-plan summary').click();
        assert.equal(await page.locator('.task-plan-steps li').count(), 2);
        await page.evaluate(() => {
            window.mock.snapshot.runs[0].items.find(item => item.kind === 'plan').plan[1].status = 'completed'; window.mock.emit();
        });
        await page.waitForFunction(() => document.querySelector('.task-plan summary')?.textContent === '计划 2/2');
        assert.equal(await page.locator('.task-plan').getAttribute('open'), '', 'plan expansion survives updates');
        assert.equal(await page.locator('#task-stop-button').isVisible(), true, 'a completed plan does not complete the run');
        assert.equal(await page.locator('#message-input').getAttribute('placeholder'), '说点什么，让 AILIS 陪你聊聊');
        await page.screenshot({ path: path.join(out, 'running.png') });
        assert.equal(await page.getByRole('button', { name: '任务详情', exact: true }).isVisible(), false, 'running details stay inside collapsed process');
        await page.locator('#message-input').fill('只改文档，不改执行逻辑');
        await page.locator('#message-input').press('Enter'); await page.waitForFunction(() => window.mock.submitted.length === 2);
        await page.waitForFunction(() => document.querySelector('.task-run')?.textContent.includes('待处理'));
        assert.equal(await page.evaluate(() => window.mock.stopped.length), 0);
        assert.equal(await page.evaluate(() => window.mock.submitted[1].expectedRunId), 'run-1');
        assert.equal(await page.evaluate(() => window.mock.snapshot.runs.length), 1, 'human correction stays in the existing run');
        assert.deepEqual(await page.locator('.task-run > [data-item-id]').evaluateAll(elements => elements.map(element => element.dataset.itemId)),
            [await page.evaluate(() => window.mock.submitted[0].clientMessageId), 'progress-1', 'progress-early', await page.evaluate(() => window.mock.submitted[1].clientMessageId), 'plan-1'],
            'public conversation preserves message order while plan and tool details stay separate');
        assert.equal(await page.locator('#message-input').inputValue(), '', 'acknowledged correction clears only its sent draft');
        await page.screenshot({ path: path.join(out, 'pending.png') });
        await page.evaluate(() => {
            const range = document.createRange(); range.selectNodeContents(document.querySelector('.task-user > div'));
            const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
            const run = window.mock.snapshot.runs[0]; run.items.at(-1).status = 'included'; run.items.find(item => item.kind === 'tool').status = 'completed'; run.activity = '后台仍在执行'; window.mock.emit();
        });
        await page.waitForFunction(() => Number(document.querySelector('#message-list').dataset.taskSeq) === window.mock.snapshot.seq);
        assert.equal(await page.evaluate(() => getSelection().toString()), '检查一下源码', 'stream refresh preserves selected text');
        await page.evaluate(() => getSelection().removeAllRanges());
        await page.waitForFunction(() => document.querySelector('.task-activity').textContent.includes('后台仍在执行'));
        await page.evaluate(() => { window.mock.snapshot.runs[0].activity = '正在收尾'; window.mock.emit(); });
        await page.waitForFunction(() => document.querySelector('.task-activity').textContent.includes('正在收尾'));
        assert.equal(await page.locator('.task-process, .task-step').count(), 0, 'updates do not restore tool rows');
        await page.evaluate(() => {
            const run = window.mock.snapshot.runs[0];
            run.items.push({ id: 'progress-2', kind: 'progress', text: '接下来只调整文档引用，执行逻辑保持不变。', status: 'observed' });
            // Unsupported internal content must never be promoted into public feedback.
            run.items.push({ id: 'internal', kind: 'reasoning', text: 'PRIVATE_REASONING_SENTINEL' });
            window.mock.emit();
        });
        await page.waitForSelector('.task-progress[data-item-id="progress-2"]');
        assert.equal(await page.locator('.task-progress').count(), 3, 'earlier public progress remains visible');
        assert.deepEqual(await page.locator('.task-run > [data-item-id]').evaluateAll(elements => elements.map(element => element.dataset.itemId)),
            [await page.evaluate(() => window.mock.submitted[0].clientMessageId), 'progress-1', 'progress-early', await page.evaluate(() => window.mock.submitted[1].clientMessageId), 'progress-2', 'plan-1']);
        assert.doesNotMatch(await page.locator('.task-run').textContent(), /PRIVATE_REASONING_SENTINEL/);
        await page.screenshot({ path: path.join(out, 'human-correction.png') });
        await page.evaluate(() => {
            const run = window.mock.snapshot.runs[0];
            Object.assign(run.items.find(item => item.kind === 'tool'), { status: 'completed', durationMs: 320, outputRef: { id: 'output' } });
            run.items.push({ id: 'f-1', kind: 'file', name: 'readme.md', path: 'C:/workspace/readme.md', action: 'edit', beforeRef: { id: 'before' }, afterRef: { id: 'after' }, diffRef: { id: 'diff' }, added: 1, removed: 1, afterBytes: 19, note: '本次写入快照' });
            run.items.push({ id: 'img-1', kind: 'image', imageRef: { id: 'image' }, name: '预览' });
            run.items.push({ id: 'final-1', kind: 'assistant', status: 'final', text: '文档已更新，执行逻辑没有修改。' });
            run.status = 'completed'; run.endedAt = Date.now(); window.mock.snapshot.activeRunId = ''; window.mock.emit();
        });
        await page.waitForSelector('.task-file-card'); await page.waitForSelector('.task-image img');
        assert.equal(await page.locator('#task-stop-button').isVisible(), false);
        assert.equal(await page.locator('.task-status-strip').isVisible(), false, 'completed turn leaves no persistent status bar');
        assert.equal(await page.locator('.task-user .task-receipt').count(), 0);
        assert.equal(await page.locator('.task-run .task-metadata').count(), 0, 'internal identifiers are not a permanent transcript row');
        assert.doesNotMatch(await page.locator('.task-file-card').textContent(), /字节|快照|原内容/);
        assert.equal(await page.locator('.task-file-card button').count(), 1);
        assert.equal(await page.locator('.task-image button').innerText(), '', 'image is its own zoom target, no extra instruction/button label');
        await page.getByRole('button', { name: '放大图片：预览', exact: true }).click();
        assert.equal(await page.locator('.task-viewer img').isVisible(), true);
        await page.getByRole('button', { name: '关闭', exact: true }).click();
        await page.getByRole('button', { name: '查看改动', exact: true }).click();
        assert.equal(await page.locator('.task-viewer').isVisible(), true);
        assert.match(await page.locator('.task-unified-diff').textContent(), /version = 1/); assert.match(await page.locator('.task-unified-diff').textContent(), /version = 2/);
        assert.equal(await page.getByRole('button', { name: '打开所在目录', exact: true }).isVisible(), true);
        await page.screenshot({ path: path.join(out, 'changes.png') }); await page.getByRole('button', { name: '关闭', exact: true }).click();
        await page.screenshot({ path: path.join(out, 'completed.png') });
        await page.locator('#message-input').fill('继续'); await page.evaluate(() => { window.mock.failNext = true; });
        await page.locator('#send-btn').click(); await page.waitForFunction(() => window.mock.submitted.length === 3);
        assert.equal(await page.locator('#message-input').inputValue(), '继续');
        assert.equal(await page.locator('#chat-status').isVisible(), true, 'unconfirmed send remains actionable');
        await page.locator('#send-btn').click(); await page.waitForFunction(() => window.mock.submitted.length === 4);
        await page.waitForFunction(() => !document.getElementById('chat-status').textContent.includes('模拟连接中断'));
        assert.equal(await page.locator('#chat-status').textContent(), 'AILIS 正在思考或说话...', 'confirmed retry clears the error and restores original activity status');
        assert.equal(await page.evaluate(() => window.mock.submitted[2].clientMessageId === window.mock.submitted[3].clientMessageId), true);
        await page.locator('#message-input').fill('停止后仍应保留的草稿');
        await page.locator('#task-stop-button').click();
        await page.waitForSelector('.task-activity[data-status="stopping"]');
        assert.equal(await page.locator('.task-activity[data-status="stopping"]').getAttribute('title'), '等待后台确认');
        assert.equal(await page.locator('#message-input').inputValue(), '停止后仍应保留的草稿');
        assert.equal(await page.locator('#task-stop-button').isDisabled(), true);
        await page.screenshot({ path: path.join(out, 'stopping.png') });
        await page.evaluate(() => { const run = window.mock.snapshot.runs.at(-1); run.status = 'failed'; run.error = '无法创建进程，错误 267：目录名称无效。'; run.endedAt = Date.now(); window.mock.snapshot.activeRunId = ''; window.mock.emit(); });
        await page.waitForSelector('.task-error'); assert.match(await page.locator('.task-error').last().textContent(), /267/);
        await page.setViewportSize({ width: 390, height: 844 }); await page.screenshot({ path: path.join(out, 'mobile-failed.png') });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no horizontal page overflow');
        await page.evaluate(() => {
            const s = window.mock.snapshot; s.storageError = '任务记录写入失败：ENOSPC。已关闭后续执行入口，请检查磁盘和旧进程。';
            const run = s.runs.at(-1); run.status = 'unknown'; run.storageError = s.storageError; run.error = s.storageError; s.activeRunId = run.id; window.mock.emit();
        });
        await page.waitForFunction(() => document.querySelector('.task-status-strip').textContent.includes('ENOSPC'));
        assert.equal(await page.locator('#send-btn').isDisabled(), true);
        assert.equal(await page.locator('#message-input').inputValue(), '停止后仍应保留的草稿');
        assert.equal(await page.getByRole('button', { name: '确认旧任务已退出', exact: true }).count(), 0, 'disk failure cannot be bypassed as process recovery');
        await page.screenshot({ path: path.join(out, 'storage-failed.png') });
        assert.deepEqual(errors, []);
        // An independent reader exercises a plain completed turn without changing the fault fixture.
        await page.evaluate(async () => {
            const { TaskInteractionView } = await import('/src/task-interaction-view.js');
            const list = document.createElement('div'); list.id = 'plain-fixture'; document.body.append(list);
            const plain = { seq: 1, activeRunId: '', runs: [{ id: 'plain-reply', status: 'completed', startedAt: Date.now() - 5000, endedAt: Date.now(), items: [
                { id: 'plain-user', kind: 'user', status: 'included', text: '你好' },
                { id: 'plain-final', kind: 'assistant', status: 'final', text: '你好。' }
            ] }] };
            const api = { ...window.ailisDesktop.tasks, snapshot: async () => plain, onEvent: () => () => {} };
            const view = new TaskInteractionView({ api, list, dock: document.createElement('div'), onState() {}, notice() {} });
            await view.refresh(); view.dispose();
        });
        assert.equal(await page.locator('#plain-fixture .task-process, #plain-fixture .task-activity, #plain-fixture .task-receipt').count(), 0, 'plain answer has no fake process or success boilerplate');
        assert.equal(await page.locator('#plain-fixture .task-answer').textContent(), '你好。');
        await page.evaluate(async () => {
            const { TaskInteractionView } = await import('/src/task-interaction-view.js');
            const list = document.createElement('div'); list.id = 'timeline-fixture'; document.body.append(list);
            const state = { seq: 1, activeRunId: 'timeline', runs: [{ id: 'timeline', status: 'running', items: [
                { id: 'u1', kind: 'user', text: '检查', status: 'included' },
                { id: 't1', kind: 'tool', tool: 'exec', status: 'completed' },
                { id: 'p1', kind: 'progress', text: '第一步结果。' },
                { id: 'u2', kind: 'user', text: '只读', status: 'queued' },
                { id: 't2', kind: 'tool', tool: 'exec_command', status: 'running' }
            ] }] };
            const api = { ...window.ailisDesktop.tasks, snapshot: async () => structuredClone(state), onEvent: () => () => {} };
            const view = new TaskInteractionView({ api, list, dock: document.createElement('div'), onState() {}, notice() {} });
            await view.refresh();
            state.seq++; state.runs[0].items[3].status = 'included'; await view.refresh(); view.dispose();
        });
        assert.deepEqual(await page.locator('#timeline-fixture .task-run > [data-item-id]').evaluateAll(elements => elements.map(element => element.dataset.itemId)), ['u1', 'p1', 'u2']);
        assert.equal(await page.locator('#timeline-fixture .task-process, #timeline-fixture .task-step').count(), 0, 'restored records do not render tool rows');
        assert.equal(await page.locator('#timeline-fixture .task-receipt').count(), 0, 'pending hint disappears after correction is included');
        console.log(`Task interaction browser smoke: ${checks} assertions passed; ${out}`);
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
