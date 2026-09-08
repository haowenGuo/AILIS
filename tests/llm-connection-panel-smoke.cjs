// Run with Electron. This hidden test window uses synthetic state and blocks external traffic.
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');

if (process.type === 'renderer') {
    window.panelErrors = [];
    window.addEventListener('error', (event) => window.panelErrors.push(event.message));
    window.addEventListener('unhandledrejection', (event) => window.panelErrors.push(String(event.reason)));
    window.ailisDesktop = {
        platform: 'electron',
        getControlPanelState: () => ipcRenderer.invoke('mode-test:state'),
        savePreferences: (prefs) => ipcRenderer.invoke('mode-test:save', prefs),
        minimizeCurrentWindow: () => ipcRenderer.invoke('mode-test:action', 'minimize'),
        toggleMaximizeCurrentWindow: () => ipcRenderer.invoke('mode-test:action', 'maximize'),
        closeCurrentWindow: () => ipcRenderer.invoke('mode-test:action', 'close'),
        showAgentLab: () => ipcRenderer.invoke('mode-test:action', 'agent-lab')
    };
} else {
    const assert = require('node:assert/strict');
    const fs = require('node:fs');
    const path = require('node:path');
    const os = require('node:os');
    const http = require('node:http');
    const root = path.resolve(__dirname, '..', process.env.AILIS_PANEL_TEST_DIST === '1' ? 'dist' : '.');
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-panel-test-'));
    app.setPath('userData', temp);
    app.disableHardwareAcceleration();
    let server;
    let window;
    app.whenReady().then(async () => {
        const store = require('../electron/store.cjs');
        let prefs = {
            ...store.getDefaultState().preferences,
            llmProvider: 'deepseek', llmBaseUrl: 'https://direct.example/v1', llmModel: 'my-ds-model',
            llmApiKeyConfigured: true,
            llmApiKeyProfiles: { deepseek: { activeKeyId: 'ds-key', keys: [{ id: 'ds-key', label: 'Test Key', masked: '***test' }] } },
            ollamaTarget: { source: 'installed', modelId: 'local-test' },
            ollamaUsedModels: ['local-test'],
            desktopNativeTtsRate: 1.23, desktopNativeTtsPitch: 0.87, desktopNativeTtsVolume: 0.54,
            visionLlmModel: 'saved-vision-model', visionLlmBaseUrl: 'https://vision.example/v1',
            llmConnectionProfiles: {
                direct: { provider: 'deepseek', baseUrl: 'https://direct.example/v1', model: 'my-ds-model' },
                local: { provider: 'ollama', baseUrl: 'http://127.0.0.1:11434', model: 'local-test' }
            }
        };
        let saves = 0;
        let failNextSave = false;
        const actions = [];
        ipcMain.handle('mode-test:action', (_event, name) => {
            actions.push(name);
            return { ok: true, isMaximized: true };
        });
        ipcMain.handle('mode-test:state', () => ({
            preferences: prefs,
            options: {
                llmProviderOptions: store.LLM_PROVIDER_OPTIONS,
                petScaleOptions: store.PET_SCALE_OPTIONS,
                speechModeOptions: store.SPEECH_MODE_OPTIONS
            }, environment: { version: 'test', userDataPath: temp }
        }));
        ipcMain.handle('mode-test:save', (_event, next) => {
            if (failNextSave) {
                failNextSave = false;
                throw new Error('synthetic_save_failure');
            }
            saves++;
            prefs = { ...prefs, ...next, llmConnectionProfiles: store.normalizeLlmConnectionProfiles(next.llmConnectionProfiles, next) };
            return prefs;
        });
        server = http.createServer((req, res) => {
            const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
            if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
                res.writeHead(404).end(); return;
            }
            res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream');
            fs.createReadStream(file).pipe(res);
        });
        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        const base = `http://127.0.0.1:${server.address().port}`;
        window = new BrowserWindow({ show: false, width: 1280, height: 1000,
            webPreferences: { preload: __filename, contextIsolation: false, sandbox: false, backgroundThrottling: false, offscreen: true } });
        let externalRequests = 0;
        window.webContents.session.webRequest.onBeforeRequest((details, callback) => {
            const external = !details.url.startsWith(base) && !details.url.startsWith('data:');
            if (external) externalRequests++;
            callback({ cancel: external });
        });
        const evaluate = (fn) => window.webContents.executeJavaScript(`(${fn})()`);
        async function ready() {
            for (let i = 0; i < 80; i++) {
                if (await evaluate(() => document.querySelector('#llm-model')?.value === 'my-ds-model' &&
                    document.querySelector('#app-version')?.textContent === 'vtest')) return;
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
            throw new Error('panel initialization failed: ' + await evaluate(() => document.body.innerText.slice(-1200)));
        }
        await window.loadURL(`${base}/control.html`);
        await ready();
        const searchResult = await evaluate(() => {
            const $=id=>document.getElementById(id);
            $('llm-api-key').value='synthetic-private-do-not-index';
            document.dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true,cancelable:true}));
            const opened=$('settings-search').open && document.activeElement===$('settings-search-input');
            $('settings-search-input').value='synthetic-private-do-not-index'; $('settings-search-input').dispatchEvent(new Event('input'));
            const excludesSecrets=$('settings-search-results').children.length===0;
            $('settings-search-input').value='渲染分辨率'; $('settings-search-input').dispatchEvent(new Event('input'));
            const found=$('settings-search-results').children.length===1;
            $('settings-search-input').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
            $('llm-api-key').value='';
            return {opened,excludesSecrets,found,closed:!$('settings-search').open};
        });
        await new Promise(resolve=>setTimeout(resolve,80));
        assert.ok(await evaluate(() => document.getElementById('page-appearance').classList.contains('is-active') && document.activeElement.id==='render-resolution-scale' && document.activeElement.closest('details').open),'search opens page and nested setting');
        for (const [name,value] of Object.entries(searchResult)) assert.ok(value,`settings search: ${name}`);
        assert.equal(saves,0,'search never saves or changes preferences');
        fs.writeFileSync(path.join(temp,'search-target.png'),(await window.webContents.capturePage()).toPNG());
        await evaluate(() => {document.getElementById('content').scrollTop=120;document.getElementById('tab-model').click();document.getElementById('tab-appearance').click()});
        assert.equal(await evaluate(() => document.getElementById('content').scrollTop),120,'page switches preserve reading position');
        await evaluate(() => {document.querySelectorAll('details').forEach(el=>el.open=false);document.getElementById('tab-model').click();document.getElementById('settings-search-btn').click()});
        await new Promise(resolve=>setTimeout(resolve,120));
        assert.ok(await evaluate(() => {const box=document.getElementById('settings-search').getBoundingClientRect();return box.width>200&&box.height>100&&box.top>=0&&box.bottom<=innerHeight}),'search palette fits the viewport');
        fs.writeFileSync(path.join(temp,'settings-search.png'),(await window.webContents.capturePage()).toPNG());
        await evaluate(() => document.getElementById('settings-search').close());
        const layout = await evaluate(() => {
            const $ = (id) => document.getElementById(id);
            const visible = (id) => $(id).checkVisibility();
            const result = {
                fivePages: document.querySelectorAll('[data-control-page]').length === 5 &&
                    [...document.querySelectorAll('#control-nav button')].map(el => el.dataset.controlPageTarget).join(',') === 'model,appearance,voice,agent,advanced',
                defaultModel: $('page-model').classList.contains('is-active'),
                removedUnused: !$('page-overview') && !$('character-install-sample-btn') && !$('tts-rate'),
                compactStatus: document.querySelector('.model-status-board').getBoundingClientRect().height < 65,
                collapsedOptional: !$('vision-model-settings').open && !$('email-settings').open,
                pageHeadings: document.querySelectorAll('.page-intro h2').length === 5,
                readableLabels: Number.parseFloat(getComputedStyle(document.querySelector('#page-model .field-label')).fontSize) >= 14,
                characterFirst: document.querySelector('#page-appearance .section-grid').firstElementChild.id === 'section-character',
                advancedTools: $('open-agent-lab-btn').closest('[data-control-page]').id === 'page-advanced' &&
                    $('runtime-components-panel').closest('[data-control-page]').id === 'page-advanced'
            };
            $('tab-voice').click();
            const output = $('section-voice').getBoundingClientRect();
            const input = $('section-microphone').getBoundingClientRect();
            result.voiceReadingOrder = input.top >= output.bottom && Math.abs(input.left - output.left) < 1;
            const original = $('speech-mode').value;
            for (const mode of ['off', 'hosted', 'server', 'cosyvoice3']) {
                $('speech-mode').value = mode;
                $('speech-mode').dispatchEvent(new Event('change', { bubbles: true }));
                result[`voice_${mode}`] = visible('elevenlabs-settings') === (mode === 'server') &&
                    visible('hosted-tts-settings') === (mode === 'hosted') &&
                    visible('cosyvoice-settings') === (mode === 'cosyvoice3') &&
                    visible('chunked-tts-settings') === (mode !== 'off') && visible('preferred-mic');
            }
            $('speech-mode').value = original;
            $('speech-mode').dispatchEvent(new Event('change', { bubbles: true }));
            for (const tab of document.querySelectorAll('#control-nav button')) {
                tab.click();
                result[`page_${tab.dataset.controlPageTarget}`] = document.querySelectorAll('.control-page.is-active').length === 1 &&
                    [...document.querySelectorAll('.control-page')].filter(el => el.checkVisibility()).length === 1;
            }
            return result;
        });
        for (const [name, ok] of Object.entries(layout)) assert.ok(ok, name);
        await evaluate(() => document.querySelector('[data-control-page-target="model"]').click());
        const initialExternalRequests = externalRequests;
        const results = await evaluate(() => {
            const $ = (id) => document.getElementById(id);
            const mode = (value) => document.querySelector(`[data-llm-mode="${value}"]`).click();
            const visible = (id) => !!$(id).getClientRects().length;
            const result = {};
            result.direct = visible('llm-direct-fields') && visible('llm-credential-fields') && !visible('local-llm-runtime-panel');
            $('llm-api-key').value = 'unsaved-test-key';
            $('llm-api-key-label').value = 'Draft label';
            mode('server');
            result.server = !visible('llm-direct-fields') &&
                !visible('llm-credential-fields') &&
                !visible('local-llm-runtime-panel') &&
                !visible('llm-model-status-board') &&
                !visible('llm-base-field') &&
                !visible('llm-health-check-field') &&
                !visible('llm-advanced-settings') &&
                !visible('section-vision-model') &&
                $('llm-provider').value === 'ailis-cloud';
            result.noLeakedKey = $('llm-api-key').value === '';
            $('llm-base-url').value = 'https://private.example/api/llm/v1';
            mode('local');
            result.local = visible('local-llm-runtime-panel') && !visible('llm-direct-fields') && $('llm-model').value === 'local-test';
            mode('server');
            result.serverRestored = $('llm-base-url').value === 'https://101.133.239.56/api/llm/v1' &&
                $('llm-model').value === 'ailis-cloud';
            mode('direct');
            result.directRestored = $('llm-model').value === 'my-ds-model' && $('llm-base-url').value === 'https://direct.example/v1';
            result.draftRestored = $('llm-api-key').value === 'unsaved-test-key' && $('llm-api-key-label').value === 'Draft label' && $('llm-api-key-select').value === 'ds-key';
            $('llm-api-key').value = '';
            $('llm-api-key-label').value = '';
            result.activeButton = document.querySelectorAll('[data-llm-mode][aria-pressed="true"]').length === 1;
            return result;
        });
        for (const [name, ok] of Object.entries(results)) assert.ok(ok, name);
        assert.equal(await evaluate(() => document.getElementById('footer-bar').dataset.state), 'dirty');
        assert.equal(saves, 0, 'mode switches must not implicitly save or activate');
        assert.equal(externalRequests, initialExternalRequests, 'mode switches must not call remote services');
        await evaluate(() => document.getElementById('save-btn').click());
        for (let i = 0; i < 40 && !saves; i++) await new Promise((resolve) => setTimeout(resolve, 50));
        assert.equal(saves, 1);
        assert.equal(prefs.llmConnectionProfiles.server.baseUrl, 'https://101.133.239.56/api/llm/v1');
        assert.equal(prefs.llmConnectionProfiles.server.model, 'ailis-cloud');
        assert.equal(prefs.ollamaTarget.modelId, 'local-test');
        assert.equal(prefs.desktopNativeTtsRate, 1.23, 'removed legacy controls must not reset saved values');
        assert.equal(prefs.desktopNativeTtsPitch, 0.87);
        assert.equal(prefs.desktopNativeTtsVolume, 0.54);
        assert.equal(prefs.visionLlmModel, 'saved-vision-model', 'collapsed vision settings must be preserved');
        assert.equal(prefs.visionLlmBaseUrl, 'https://vision.example/v1');
        await new Promise((resolve) => {
            window.webContents.once('did-finish-load', resolve);
            window.reload();
        });
        await ready();
        assert.equal(await evaluate(() => document.getElementById('footer-bar').dataset.state), 'saved');
        const restored = await evaluate(() => {
            document.querySelector('[data-control-page-target="model"]').click();
            document.querySelector('[data-llm-mode="server"]').click();
            return document.getElementById('llm-base-url').value;
        });
        assert.equal(restored, 'https://101.133.239.56/api/llm/v1');
        assert.ok((await evaluate(() => document.getElementById('model-active-provider').textContent)).includes('AILIS Cloud'));
        await new Promise((resolve) => setTimeout(resolve, 500));
        const screenshot = path.join(temp, 'server-mode.png');
        fs.writeFileSync(screenshot, (await window.webContents.capturePage()).toPNG());
        await evaluate(() => document.querySelector('[data-llm-mode="direct"]').click());
        await new Promise((resolve) => setTimeout(resolve, 200));
        fs.writeFileSync(path.join(temp, 'direct-mode.png'), (await window.webContents.capturePage()).toPNG());
        await evaluate(() => document.getElementById('tab-voice').click());
        await new Promise((resolve) => setTimeout(resolve, 200));
        fs.writeFileSync(path.join(temp, 'voice-page.png'), (await window.webContents.capturePage()).toPNG());
        for (const page of ['appearance', 'agent', 'advanced']) {
            await window.webContents.executeJavaScript(`document.getElementById('tab-${page}').click()`);
            await new Promise((resolve) => setTimeout(resolve, 200));
            fs.writeFileSync(path.join(temp, `${page}-page.png`), (await window.webContents.capturePage()).toPNG());
        }
        await evaluate(() => {
            document.getElementById('tab-model').click();
            document.querySelector('[data-llm-mode="direct"]').click();
            document.getElementById('llm-base-url').value = 'https://draft.example/v1';
            document.getElementById('llm-base-url').dispatchEvent(new Event('input', { bubbles: true }));
        });
        await window.setSize(640, 900);
        const fits = await evaluate(() => [...document.querySelectorAll('[data-llm-mode]')].every((button) => {
            const rect = button.getBoundingClientRect();
            return rect.width > 0 && rect.right <= innerWidth;
        }));
        assert.ok(fits, 'mode cards should fit narrow windows');
        const viewportChecks = [];
        failNextSave = true;
        await evaluate(() => document.getElementById('save-btn').click());
        let reportedFailure = false;
        for (let i = 0; i < 40; i++) {
            reportedFailure = await evaluate(() => document.getElementById('status-text').textContent.includes('synthetic_save_failure'));
            if (reportedFailure) break;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        assert.ok(reportedFailure, 'save error should remain visible');
        assert.equal(await evaluate(() => document.getElementById('footer-bar').dataset.state), 'dirty');
        assert.equal(await evaluate(() => document.getElementById('llm-base-url').value), 'https://draft.example/v1', 'failed save must preserve direct-provider draft');
        for (const width of [1280, 960, 640, 400]) {
            window.setSize(width, 900);
            await new Promise((resolve) => setTimeout(resolve, 100));
            for (const page of ['model', 'appearance', 'voice', 'agent', 'advanced']) {
                await window.webContents.executeJavaScript(`document.getElementById('tab-${page}').click()`);
                const geometry = await evaluate(() => {
                    const content = document.getElementById('content');
                    const nav = document.getElementById('control-nav');
                    const footer = document.getElementById('footer-bar');
                    const details = [...document.querySelectorAll('.control-page.is-active details:not([hidden])')];
                    const previous = details.map(el => el.open);
                    details.forEach(el => el.open = true);
                    const result = {
                        noOverflow: content.scrollWidth <= content.clientWidth + 1 && nav.scrollWidth <= nav.clientWidth + 1,
                        unobscured: content.getBoundingClientRect().bottom <= footer.getBoundingClientRect().top + 1 &&
                            content.getBoundingClientRect().top >= nav.getBoundingClientRect().bottom - 1,
                        windowButtons: [...document.querySelectorAll('.window-control-btn')].every(el =>
                            el.checkVisibility() && getComputedStyle(el).webkitAppRegion === 'no-drag' && el.getBoundingClientRect().right <= innerWidth),
                        onePage: document.querySelectorAll('.control-page.is-active').length === 1
                    };
                    details.forEach((el, i) => el.open = previous[i]);
                    return result;
                });
                for (const [name, ok] of Object.entries(geometry)) assert.ok(ok, `${width}/${page}/${name}`);
                viewportChecks.push(`${width}/${page}`);
            }
        }
        const keyboard = await evaluate(() => {
            const model = document.getElementById('tab-model');
            model.click();
            model.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
            const end = document.activeElement.id === 'tab-advanced';
            document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
            const home = document.activeElement.id === 'tab-model';
            model.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            return end && home && document.activeElement.id === 'tab-appearance';
        });
        assert.ok(keyboard, 'keyboard tab navigation');
        const conditionalLayouts = [];
        for (const width of [1280, 640, 400]) {
            window.setSize(width, 900);
            await new Promise(resolve => setTimeout(resolve, 100));
            for (const source of ['installed', 'local', 'online']) {
                await window.webContents.executeJavaScript(`document.getElementById('tab-model').click(); document.querySelector('[data-llm-mode="local"]').click(); document.querySelector('[data-ollama-mode="${source}"]').click();`);
                assert.ok(await evaluate(() => {
                    const content = document.getElementById('content');
                    return content.scrollWidth <= content.clientWidth + 1;
                }), `Ollama ${source} fits ${width}`);
                conditionalLayouts.push(`${width}/ollama/${source}`);
            }
            for (const speech of ['server', 'cosyvoice3']) {
                await window.webContents.executeJavaScript(`document.getElementById('tab-voice').click(); document.getElementById('speech-mode').value='${speech}'; document.getElementById('speech-mode').dispatchEvent(new Event('change',{bubbles:true}));`);
                assert.ok(await evaluate(() => {
                    const content = document.getElementById('content');
                    return content.scrollWidth <= content.clientWidth + 1;
                }), `voice ${speech} fits ${width}`);
                conditionalLayouts.push(`${width}/voice/${speech}`);
            }
        }
        for (const [language, characterLabel] of Object.entries({ en: 'Character', ja: 'キャラクター', ko: '캐릭터', 'zh-CN': '角色' })) {
            await window.webContents.executeJavaScript(`document.getElementById('ui-language').value = '${language}'; document.getElementById('ui-language').dispatchEvent(new Event('change', { bubbles: true }));`);
            assert.ok(await evaluate(() => [...document.querySelectorAll('#control-nav button span')].every(el => el.textContent.trim())), 'translated tabs');
            assert.equal(await evaluate(() => document.querySelector('#tab-appearance span').textContent), characterLabel);
        }
        await evaluate(() => {
            document.getElementById('minimize-btn').click();
            document.getElementById('maximize-btn').click();
            document.getElementById('close-btn').click();
            document.getElementById('open-agent-lab-btn').click();
        });
        for (let i = 0; i < 20 && actions.length < 4; i++) await new Promise(resolve => setTimeout(resolve, 50));
        assert.deepEqual(actions, ['minimize', 'maximize', 'close', 'agent-lab']);
        assert.deepEqual(await evaluate(() => window.panelErrors), [], 'no renderer errors');
        window.setSize(400, 900);
        await evaluate(() => document.getElementById('tab-model').click());
        await new Promise(resolve => setTimeout(resolve, 200));
        fs.writeFileSync(path.join(temp, 'narrow-model.png'), (await window.webContents.capturePage()).toPNG());
        console.log(JSON.stringify({ ok: true, checks: Object.keys(results), layout: Object.keys(layout), persistence: true, failedSavePreservesDraft: reportedFailure, viewportChecks, conditionalLayouts, keyboard, windowActions: actions, screenshot }));
        window.destroy();
        server.close();
        app.exit(0);
    }).catch((error) => {
        console.error(error);
        window?.destroy();
        server?.close();
        app.exit(1);
    });
}
