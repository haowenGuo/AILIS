// Run with Electron. Hidden windows, isolated user data, no model or network calls.
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
if (process.type === 'renderer') {
    window.ailisDesktop = {
        preferences: { avatarDialogueBubbleScale: 1 },
        setPetDialogueExpanded: () => ipcRenderer.invoke('pet-test:layout'),
        onPetWindowLayout: (listener) => {
            const wrapped = (_event, payload) => listener(payload);
            ipcRenderer.on('pet-test:layout', wrapped);
            return () => ipcRenderer.removeListener('pet-test:layout', wrapped);
        },
        onPreferencesUpdated: () => () => {}
    };
} else {
    const fs = require('node:fs');
    const path = require('node:path');
    const os = require('node:os');
    const assert = require('node:assert/strict');
    const { pathToFileURL } = require('node:url');
    const { createAILISDesktopPlatformAdapter } = require('../electron/ailis-desktop-platform-adapter.cjs');
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-pet-layout-'));
    const root = path.resolve(__dirname, '..');
    app.setPath('userData', temp);
    app.disableHardwareAcceleration();
    const adapter = createAILISDesktopPlatformAdapter({ screen: {
        getDisplayMatching: () => ({ workArea: { x: 0, y: 0, width: 1707, height: 1019 } })
    } });
    const at = (x, y, width = 216, height = 288, top = 190, extraWidth = 220) => adapter.getExpandedWindowLayout({
        baseBounds: { x, y, width, height }, requestedExtraTop: top, requestedExtraWidth: extraWidth
    });
    let layout = at(0, 0);
    let win;
    const pause = ms => new Promise(r => setTimeout(r, ms));
    app.whenReady().then(async () => {
        ipcMain.handle('pet-test:layout', () => layout);
        win = new BrowserWindow({ ...layout.expandedBounds, show: false, frame: false, transparent: true,
            webPreferences: { preload: __filename, contextIsolation: false, sandbox: false,
                backgroundThrottling: false, offscreen: true } });
        // Load the real pet shell/CSS, but replace its application entrypoint with
        // a synthetic avatar. Do not boot chat, memory, voice, or provider clients.
        win.webContents.session.webRequest.onBeforeRequest((details, callback) => callback({
            cancel: !details.url.startsWith('file:') || /pet-app|\/assets\//.test(details.url)
        }));
        await win.loadFile(path.join(root, 'pet.html'));
        const moduleUrl = pathToFileURL(path.join(root, 'src/avatar-dialogue-bubble.js')).href;
        await win.webContents.executeJavaScript(`(async()=>{
            window.uiErrors=[]; addEventListener('error',e=>uiErrors.push(e.message));
            const module=await import(${JSON.stringify(moduleUrl)});
            const container=document.getElementById('canvas-container');
            container.style.background='rgba(30,120,100,.12)';
            const avatar=document.createElement('div'); avatar.id='test-avatar';
            avatar.style.cssText='position:absolute;left:20%;top:8%;width:60%;height:84%;background:#397f77;border-radius:40% 40% 25% 25%';
            container.appendChild(avatar);
            window.cleanup=module.installAvatarDialogueBubble({rootElement:document.getElementById('pet-shell'),variant:'pet',
                avatarBoundsProvider:()=>avatar.getBoundingClientRect()});
            window.readLayout=()=>{const b=document.querySelector('.avatar-dialogue-bubble');return {
                canvas:container.getBoundingClientRect().toJSON(),avatar:avatar.getBoundingClientRect().toJSON(),
                bubble:b.getBoundingClientRect().toJSON(),side:b.getAttribute('data-placement'),hidden:getComputedStyle(b).visibility==='hidden',
                textScroll:b.children[1].scrollHeight>b.children[1].clientHeight,errors:uiErrors
            }};
            window.say=(text)=>dispatchEvent(new CustomEvent(module.AVATAR_SPEECH_EVENT_NAME,{detail:{phase:'start',id:'test',text}}));
        })()`);
        await pause(80);
        const result = [];
        for (const [scale, w, h] of [[1, 216, 288], [1.35, 360, 480], [0.75, 216, 288]]) {
            await win.webContents.executeJavaScript(`ailisDesktop.preferences.avatarDialogueBubbleScale=${scale}; cleanup();
                import(${JSON.stringify(moduleUrl)}).then(m=>{window.cleanup=m.installAvatarDialogueBubble({rootElement:document.getElementById('pet-shell'),variant:'pet',avatarBoundsProvider:()=>document.getElementById('test-avatar').getBoundingClientRect()})})`);
            await pause(80);
            let original;
            for (const [x,y] of [[0,0],[700,400],[1491,0],[1491,731],[0,731],[700,100],[700,0]]) {
                layout = at(x,y,w,h);
                win.setBounds(layout.expandedBounds);
                win.webContents.send('pet-test:layout',layout);
                await win.webContents.executeJavaScript(`say(${JSON.stringify('测试人物移动时保持大小不变。'.repeat(50))})`);
                await pause(240);
                const state=await win.webContents.executeJavaScript('readLayout()');
                assert.equal(state.canvas.width,w);
                assert.equal(state.canvas.height,h);
                assert.equal(state.canvas.x,110);
                assert.equal(state.canvas.y,190);
                assert.equal(state.errors.length,0);
                if(!original) original={avatar:state.avatar,bounds:win.getBounds()};
                // Windows may round an edge by one DIP at 150% scaling; the
                // explicit avatar viewport below must still be exactly stable.
                assert.ok(Math.abs(win.getBounds().width-original.bounds.width)<=1,
                    JSON.stringify({x,y,w,h,actual:win.getBounds(),original:original.bounds,target:layout.expandedBounds}));
                assert.ok(Math.abs(win.getBounds().height-original.bounds.height)<=1);
                assert.equal(state.avatar.width,original.avatar.width);
                assert.equal(state.avatar.height,original.avatar.height);
                const b=state.bubble,a=state.avatar,v=layout.visibleBounds;
                assert.equal(state.hidden,false,JSON.stringify({x,y,state}));
                assert.ok(b.left>=v.left-1 && b.top>=v.top-1 && b.right<=v.right+1 && b.bottom<=v.bottom+1,
                    JSON.stringify({x,y,scale,b,v}));
                assert.ok(b.right<=a.left+1 || b.left>=a.right-1 || b.bottom<=a.top+1 || b.top>=a.bottom-1,
                    JSON.stringify({x,y,scale,b,a}));
                result.push({x,y,scale,canvas:`${w}x${h}`,side:state.side,scroll:state.textScroll});
                if(scale===1 && y===0) fs.writeFileSync(path.join(temp,`edge-${x}.png`),(await win.webContents.capturePage()).toPNG());
            }
        }
        console.log(JSON.stringify({ok:true,cases:result.length,result,temp},null,2));
        app.exit(0);
    }).catch(error=>{console.error(error);app.exit(1)});
    setTimeout(()=>{console.error('layout test timeout');app.exit(1)},30000).unref();
}
