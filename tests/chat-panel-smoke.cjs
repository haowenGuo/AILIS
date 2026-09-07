// Hidden Electron window, synthetic messages, no model calls or user state.
const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron');

if (process.type === 'renderer') {
    window.chatTestErrors = [];
    window.chatTestSent = [];
    window.chatTestControls = [];
    window.addEventListener('error', e => window.chatTestErrors.push(e.message));
    window.addEventListener('unhandledrejection', e => window.chatTestErrors.push(String(e.reason)));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.chatTestCopied = text; } } });
    window.confirm = () => false;
    window.ailisDesktop = {
        platform: 'electron', preferences: { uiLanguage: 'zh-CN', recognitionMode: 'manual', speechMode: 'off' },
        onChatEvent: fn => { window.deliverChatEvent = fn; },
        onPreferencesUpdated: fn => { window.deliverPreferences = fn; },
        requestChatStateSync: () => {},
        sendChatMessage: message => window.chatTestSent.push(message),
        sendChatControl: message => window.chatTestControls.push(message),
        minimizeCurrentWindow: () => ipcRenderer.invoke('chat-test:action', 'minimize'),
        toggleMaximizeCurrentWindow: () => ipcRenderer.invoke('chat-test:action', 'maximize'),
        hideChatWindow: () => ipcRenderer.invoke('chat-test:action', 'hide-chat'),
        showControlPanel: () => ipcRenderer.invoke('chat-test:action', 'settings'),
        transcribeAudio: async () => { throw new Error('must not record'); },
        files: { choose: async () => ({ files: [{ type: 'file', path: 'C:/test/notes.md', name: 'notes.md', size: 1234, extension: '.md' }] }) },
        vision: { capture: async () => ({ ok: false, error: 'Synthetic capture failure' }) }
    };
} else {
    const assert = require('node:assert/strict');
    const fs = require('node:fs');
    const path = require('node:path');
    const os = require('node:os');
    const http = require('node:http');
    // Exercise the same bundled modules shipped to the desktop window.
    const root = path.resolve(__dirname, '..', 'dist');
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-chat-test-'));
    app.setPath('userData', temp);
    app.disableHardwareAcceleration();
    let server, win;
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    app.whenReady().then(async () => {
        const actions = [];
        ipcMain.handle('chat-test:action', (_event, action) => { actions.push(action); return { ok: true, isMaximized: true }; });
        server = http.createServer((req, res) => {
            const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
            if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
                res.writeHead(404).end(); return;
            }
            res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream');
            fs.createReadStream(file).pipe(res);
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        const base = `http://127.0.0.1:${server.address().port}`;
        win = new BrowserWindow({ show: false, width: 860, height: 780,
            webPreferences: { preload: __filename, contextIsolation: false, sandbox: false, offscreen: true, backgroundThrottling: false } });
        let externalRequests = 0;
        win.webContents.session.webRequest.onBeforeRequest((details, callback) => {
            const external = !details.url.startsWith(base) && !details.url.startsWith('data:');
            if (external) externalRequests++;
            callback({ cancel: external });
        });
        const evaluate = fn => win.webContents.executeJavaScript(`(${fn})()`);
        const deliver = event => win.webContents.executeJavaScript(`window.deliverChatEvent(${JSON.stringify(event)})`);
        await win.loadURL(`${base}/chat.html`);
        for (let i = 0; i < 80 && !await evaluate(() => typeof window.deliverChatEvent === 'function'); i++) await wait(50);
        assert.ok(await evaluate(() => typeof window.deliverChatEvent === 'function'), 'panel initialized');
        await wait(150);
        assert.ok(await evaluate(() => document.getElementById('chat-empty-state').checkVisibility()), 'empty welcome visible');
        fs.writeFileSync(path.join(temp, 'empty.png'), (await win.webContents.capturePage()).toPNG());

        const messages = [
            { id: 'user-1', role: 'user', content: '今天终于把桌面整理好了，感觉清爽多了。' },
            { id: 'ai-1', role: 'assistant', content: '那种终于整理好的轻松感，我懂！😊\n\n今天就先享受一下干净的桌面吧。有什么想聊的，我都在。' },
            { id: 'user-2', role: 'user', content: '帮我把明天要做的事情整理成一个简单的清单。' },
            { id: 'ai-2', role: 'assistant', content: '可以，我们把事情分成小块，就不会觉得乱了。\n\n### 明天的小清单\n- **上午**：先完成最重要的一件事。\n- **下午**：集中处理邮件和零散工作。\n- **晚上**：留一点时间给自己，散散步或听首歌。\n\n你也可以把具体安排发给我，我们一起补全。' },
        ];
        await deliver({ type: 'snapshot', messages, isBusy: false });
        await wait(150);
        assert.ok(await evaluate(() => {
            const sticker = document.querySelector('.ailis-emote-sticker');
            return sticker?.complete && sticker.naturalWidth > 0 && sticker.getBoundingClientRect().height < 28;
        }), 'inline character sticker loads without inflating the message');
        fs.writeFileSync(path.join(temp, 'conversation.png'), (await win.webContents.capturePage()).toPNG());
        const layouts = [];
        for (const [width, height] of [[1180, 820], [860, 780], [540, 650], [360, 620], [320, 420]]) {
            win.setSize(width, height);
            await wait(120);
            const layout = await evaluate(() => {
                const $ = id => document.getElementById(id);
                const rect = id => $(id).getBoundingClientRect();
                const within = r => r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1;
                $('chat-more-actions').open = true;
                const menu = within(document.querySelector('.chat-actions-menu').getBoundingClientRect());
                $('chat-more-actions').open = false;
                return { controls: ['minimize-btn','maximize-btn','close-btn','file-btn','vision-btn','voice-btn','send-btn'].every(id => within(rect(id))),
                    menu, compactComposer: rect('composer-dock').height <= 145,
                    emptyHidden: !$('chat-empty-state').checkVisibility(),
                    noOverflow: $('message-list').scrollWidth <= $('message-list').clientWidth + 1,
                    noShrink: [...document.querySelectorAll('.message-item')].every(el => getComputedStyle(el).flexShrink === '0') };
            });
            for (const [name, value] of Object.entries(layout)) assert.ok(value, `${name} at ${width}x${height}`);
            layouts.push(`${width}x${height}`);
            if (width === 360) fs.writeFileSync(path.join(temp, 'narrow.png'), (await win.webContents.capturePage()).toPNG());
        }
        win.setSize(860,780);
        await wait(80);
        const inputChecks = await evaluate(() => {
            const input = document.getElementById('message-input');
            input.value = '你好'; input.dispatchEvent(new Event('input'));
            const initial = input.getBoundingClientRect().height;
            const composing = new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true });
            input.dispatchEvent(composing);
            const imeSafe = !composing.defaultPrevented && window.chatTestSent.length === 0;
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }));
            const shiftSafe = window.chatTestSent.length === 0;
            input.value = Array(30).fill('这是一行输入内容').join('\n'); input.dispatchEvent(new Event('input'));
            const expanded = input.getBoundingClientRect().height;
            const grows = expanded > initial && expanded <= 160 && getComputedStyle(input).overflowY === 'auto';
            input.value = '你好'; input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
            return { imeSafe, shiftSafe, grows, sent: window.chatTestSent[0]?.content === '你好', shrunk: input.getBoundingClientRect().height === initial && input.value === '' };
        });
        for (const [name,value] of Object.entries(inputChecks)) assert.ok(value,name);
        await deliver({ type:'state', isBusy:true });
        await evaluate(() => {
            const input = document.getElementById('message-input'); input.value='下一条草稿';
            input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
        });
        assert.equal(await evaluate(() => window.chatTestControls.length),0,'typing Enter never interrupts the current answer');
        await evaluate(() => document.getElementById('send-btn').click());
        assert.equal(await evaluate(() => window.chatTestControls[0]?.type),'interrupt-conversation');
        await deliver({ type:'state', isBusy:false });

        const longMessages = Array.from({length: 40},(_,i) => ({ id: `long-${i}`, role: i%2 ? 'assistant':'user', content: `第 ${i} 条消息。` + '用于验证长会话滚动和持续回复。'.repeat(6) }));
        await deliver({type:'snapshot', messages:longMessages});
        await evaluate(() => document.getElementById('scroll-to-latest').click());
        await wait(80);
        await evaluate(() => {
            const list=document.getElementById('message-list'); list.scrollTop=300; list.dispatchEvent(new Event('scroll'));
            window.savedMessageNode=list.children[3].firstChild;
        });
        const before = await evaluate(() => document.getElementById('message-list').scrollTop);
        for(let i=0;i<12;i++) await deliver({type:'message-updated',message:{...longMessages[39],content:longMessages[39].content+'新增内容。'.repeat(i+1)}});
        await wait(100);
        assert.equal(await evaluate(() => document.getElementById('message-list').scrollTop),before,'streaming does not pull reader away');
        assert.ok(await evaluate(() => document.getElementById('scroll-to-latest').checkVisibility()),'latest button appears');
        await deliver({type:'snapshot',messages:longMessages});
        await wait(100);
        assert.equal(await evaluate(() => document.getElementById('message-list').scrollTop),before,'snapshot preserves scroll');
        assert.ok(await evaluate(() => window.savedMessageNode === document.getElementById('message-list').children[3].firstChild),'snapshot preserves unchanged DOM');
        await evaluate(() => document.getElementById('scroll-to-latest').click());
        await wait(100);
        assert.ok(await evaluate(() => { const e=document.getElementById('message-list'); return e.scrollHeight-e.clientHeight-e.scrollTop<2; }),'latest button jumps to bottom');
        const special = {id:'id-with-"-and-]-characters',role:'assistant',content:'```js\n'+ 'const long_value = "'+'x'.repeat(350)+'";\n```\n\n<iframe src="https://not-allowed.example"></iframe>\n\n跨**样式**查找与字面量 a+b[0].*'};
        await deliver({type:'message-added',message:special});
        await wait(80);
        assert.equal(await evaluate(() => document.querySelectorAll('#message-list iframe').length),0,'unsafe HTML stays text');
        assert.ok(await evaluate(() => { const e=document.querySelector('#message-list pre');return e.scrollWidth>e.clientWidth; }),'long code scrolls within bubble');
        assert.ok(await evaluate(() => {const e=document.getElementById('message-list');return e.scrollWidth<=e.clientWidth+1}),'code does not widen the page');
        const searchChecks = await evaluate(() => {
            const $=id=>document.getElementById(id);
            const textBefore=$('message-list').textContent;
            document.dispatchEvent(new KeyboardEvent('keydown',{key:'f',ctrlKey:true,bubbles:true,cancelable:true}));
            const opened=!$('chat-search-bar').hidden && document.activeElement===$('chat-search-input');
            $('chat-search-input').value='跨样式查找'; $('chat-search-input').dispatchEvent(new Event('input'));
            const acrossMarkup=$('chat-search-count').textContent==='1 / 1' && CSS.highlights.get('chat-find-current').size===1;
            const highlightStyle=getComputedStyle(document.querySelector('.message-ai'),'::highlight(chat-find)').backgroundColor;
            $('chat-search-input').value='a+b[0].*'; $('chat-search-input').dispatchEvent(new Event('input'));
            const literal=$('chat-search-count').textContent==='1 / 1';
            $('chat-search-input').value='第'; $('chat-search-input').dispatchEvent(new Event('input'));
            $('chat-search-next').click();
            const next=$('chat-search-count').textContent==='2 / 40';
            document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
            return {opened,acrossMarkup,literal,next,closed:$('chat-search-bar').hidden,
                highlightStyle:highlightStyle==='rgb(241, 231, 181)',unaltered:textBefore===$('message-list').textContent};
        });
        for (const [name,value] of Object.entries(searchChecks)) assert.ok(value, `chat search: ${name}`);
        await evaluate(() => document.querySelector('.message-tools button').click());
        await wait(20);
        assert.equal(await evaluate(() => window.chatTestCopied),longMessages[0].content,'single message copies raw content only');
        await evaluate(() => document.getElementById('file-btn').click());
        await wait(60);
        assert.ok(await evaluate(() => document.querySelector('.file-preview-title')?.textContent === 'notes.md'),'file attachment retained');
        await evaluate(() => {document.getElementById('message-input').value='附带文件';document.getElementById('message-input').dispatchEvent(new Event('input'));document.getElementById('send-btn').click()});
        assert.equal(await evaluate(() => window.chatTestSent.at(-1).attachments[0].path),'C:/test/notes.md');
        await evaluate(() => {document.getElementById('chat-more-actions').open=true;document.getElementById('copy-chat-btn').click()});
        assert.ok(await evaluate(() => window.chatTestCopied.includes('第 0 条消息') && !window.chatTestCopied.includes('回到最新')),'copy is message data, not UI chrome');
        await evaluate(() => { document.getElementById('chat-more-actions').open=true; document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); });
        assert.ok(await evaluate(() => !document.getElementById('chat-more-actions').open),'Escape closes menu');
        for(const language of ['en','ja','ko','zh-CN']) {
            await win.webContents.executeJavaScript(`window.deliverPreferences({preferences:{uiLanguage:'${language}',recognitionMode:'manual'}})`);
            assert.ok(await evaluate(() => document.getElementById('composer-hint').textContent.trim()),'translated hint');
        }
        await evaluate(() => { for(const id of ['minimize-btn','maximize-btn','close-btn','settings-btn']) document.getElementById(id).click(); });
        await wait(80);
        assert.deepEqual(actions,['minimize','maximize','hide-chat','settings']);
        await deliver({type:'snapshot',messages:[]});
        assert.ok(await evaluate(() => document.getElementById('chat-empty-state').checkVisibility()),'clear shows empty state');
        assert.deepEqual(await evaluate(() => window.chatTestErrors),[],'no renderer exceptions');
        assert.equal(externalRequests,0,'no external traffic');
        console.log(JSON.stringify({ok:true,layouts,inputChecks,scrollAndSnapshot:true,attachments:true,windowActions:actions,externalRequests,screenshots:temp}));
        win.destroy();server.close();app.exit(0);
    }).catch(error => { console.error(error); win?.destroy();server?.close();app.exit(1); });
}
