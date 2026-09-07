// Real sandboxed preload and renderer; fake settings, hidden window, no avatar or network.
const { app, BrowserWindow, ipcMain } = require('electron');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const assert = require('node:assert/strict');
const { createQuickControls, popupBounds } = require('../electron/quick-controls-window.cjs');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-quick-test-'));
app.setPath('userData', temp);
app.disableHardwareAcceleration();
let popup, window, outsider;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
app.whenReady().then(async () => {
    const workArea = { x: -1920, y: 30, width: 1920, height: 1050 };
    for (const point of [{x:-1920,y:30},{x:-1,y:1079},{x:-900,y:700}]) {
        const b=popupBounds(point,workArea);
        assert.ok(b.x>=workArea.x && b.y>=workArea.y && b.x+b.width<=0 && b.y+b.height<=1080,'clamp negative-coordinate display');
    }
    assert.deepEqual(popupBounds({x:999,y:999},{x:0,y:0,width:280,height:360}),{x:0,y:0,width:280,height:360});
    const screen = new EventEmitter();
    screen.getCursorScreenPoint=()=>({x:400,y:400});
    screen.getDisplayNearestPoint=()=>({workArea:{x:0,y:0,width:1920,height:1080}});
    const state = {uiLanguage:'zh-CN',speech:{value:'hosted',options:[{value:'off',label:'关闭语音'},{value:'hosted',label:'普通语音模式'},{value:'server',label:'ElevenLabs 云端语音'},{value:'cosyvoice3',label:'CosyVoice3 本地高质量'}]},
        scale:{value:0.3,options:[.3,.4,.5,.6,.7,.85,1,1.15,1.3].map(value=>({value,label:`${Math.round(value*100)}%`}))},
        language:{value:'zh-CN',options:[{value:'zh-CN',label:'简体中文'},{value:'en',label:'English'},{value:'ja',label:'日本語'},{value:'ko',label:'한국어'}]}};
    let failNext=false, shown=0, hidden=0, external=0;
    const actions=[];
    popup=createQuickControls({
        BrowserWindow: function(options) {
            assert.equal(options.webPreferences.sandbox,true);
            assert.equal(options.webPreferences.contextIsolation,true);
            assert.equal(options.parent,undefined,'not coupled to avatar or chat');
            window=new BrowserWindow({...options,webPreferences:{...options.webPreferences,offscreen:true,backgroundThrottling:false}});
            window.show=()=>{shown++}; window.focus=()=>{}; window.hide=()=>{hidden++};
            window.webContents.session.webRequest.onBeforeRequest((details,callback)=>{const blocked=!details.url.startsWith('file:')&&!details.url.startsWith('data:');if(blocked)external++;callback({cancel:blocked})});
            return window;
        }, ipcMain,screen,
        loadContent:(win,page)=>win.loadFile(path.resolve(__dirname,'../dist',page)),
        getState:()=>structuredClone(state),
        applyAction:async action=>{
            if(failNext){failNext=false;throw new Error('synthetic_save_error')}
            if(['chat','controlPanel','quit'].includes(action?.id)){actions.push(action);return}
            const group=state[action?.id];
            if(!group?.options.some(option=>option.value===action.value))throw new Error('Unsupported action');
            group.value=action.value;if(action.id==='language')state.uiLanguage=action.value;
            actions.push(action);
        }
    });
    await popup.show();await wait(200);
    const evaluate=fn=>window.webContents.executeJavaScript(`(${fn})()`);
    assert.equal(shown,1);
    assert.equal(await evaluate(()=>document.querySelector('.voice-option[aria-pressed="true"]').dataset.value),'hosted');
    assert.ok(await evaluate(()=>document.getElementById('quick-panel').scrollHeight<=document.getElementById('quick-panel').clientHeight+1),'popup fits');
    fs.writeFileSync(path.join(temp,'quick-controls.png'),(await window.webContents.capturePage()).toPNG());
    await evaluate(()=>document.querySelector('.voice-option[data-value="off"]').click());await wait(60);
    assert.equal(state.speech.value,'off');
    failNext=true;
    await evaluate(()=>document.querySelector('.voice-option[data-value="server"]').click());await wait(60);
    assert.equal(state.speech.value,'off');
    assert.ok(await evaluate(()=>document.getElementById('quick-status').textContent.includes('synthetic_save_error')&&document.querySelector('.voice-option[aria-pressed="true"]').dataset.value==='off'),'failed save retains selection and reason');
    await evaluate(()=>{const e=document.getElementById('quick-scale');e.value='0.7';e.dispatchEvent(new Event('change'))});await wait(50);
    assert.equal(state.scale.value,.7);
    for(const lang of ['en','ja','ko','zh-CN']) {
        await window.webContents.executeJavaScript(`document.getElementById('quick-language').value='${lang}';document.getElementById('quick-language').dispatchEvent(new Event('change'))`);await wait(40);
        assert.equal(state.uiLanguage,lang);
    }
    const invalid=await evaluate(()=>window.ailisQuickControls.apply({id:'scale',value:999}));
    assert.equal(invalid.ok,false);assert.equal(state.scale.value,.7);
    state.scale.value=.5;popup.refresh();await wait(30);
    assert.equal(await evaluate(()=>document.getElementById('quick-scale').value),'0.5','external changes reflected');
    await evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));await wait(30);
    assert.ok(hidden>0,'Escape dismisses');
    const id=window.id;await popup.show();assert.equal(window.id,id,'reuse popup instead of spawning per click');
    window.emit('blur');assert.ok(hidden>1,'click outside dismisses');
    const count=actions.length;
    outsider=new BrowserWindow({show:false,webPreferences:{preload:path.resolve(__dirname,'../electron/quick-controls-preload.cjs'),sandbox:true,contextIsolation:true}});
    await outsider.loadURL('about:blank');
    assert.equal(await outsider.webContents.executeJavaScript('window.ailisQuickControls.getState()'),null,'unrelated renderer cannot read popup state');
    assert.equal((await outsider.webContents.executeJavaScript("window.ailisQuickControls.apply({id:'quit'})")).ok,false,'unrelated renderer cannot invoke actions');
    assert.equal(actions.length,count);
    await evaluate(()=>document.querySelector('[data-action="chat"]').click());await wait(30);
    assert.equal(actions.at(-1).id,'chat');
    assert.equal(external,0);
    console.log(JSON.stringify({ok:true,windowIsolation:true,sandboxedIPC:true,settingsPersisted:true,errorRollback:true,displayBounds:true,dismiss:true,external,screenshot:path.join(temp,'quick-controls.png')}));
    popup.dispose();outsider.destroy();app.exit(0);
}).catch(error=>{console.error(error);popup?.dispose();outsider?.destroy();app.exit(1)});
