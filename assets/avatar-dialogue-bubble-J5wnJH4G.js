var e=`ailis-avatar-speech-event`,t=`ailis-avatar-dialogue-bubble-style`,n=1400,r=`ailis-avatar-dialogue-bubble-position`,i=8,a=8,o=8,s=1,c=220,l=190,u=12,d=84,f=3;function p(e,t,n,r,i=2){let a=Number(e);return Number.isFinite(a)?Number(Math.min(Math.max(a,t),n).toFixed(i)):r}function m(e={}){return{left:Math.round(p(e.avatarDialogueBubbleLeft,0,640,a,0)),top:Math.round(p(e.avatarDialogueBubbleTop,0,480,o,0)),scale:p(e.avatarDialogueBubbleScale,.75,1.35,s,2),extraWidth:Math.round(p(e.avatarDialogueBubbleExtraWidth,0,520,c,0)),extraTop:Math.round(p(e.avatarDialogueBubbleExtraTop,0,360,l,0))}}function h(){if(document.getElementById(t))return;let e=document.createElement(`style`);e.id=t,e.textContent=`
        .avatar-dialogue-bubble {
            --avatar-dialogue-bubble-scale: 1;
            position: absolute;
            left: 32%;
            top: 34px;
            z-index: 30;
            width: max-content;
            min-width: min(220px, calc(100% - 40px));
            max-width: min(460px, calc(100% - 40px));
            padding: 13px 16px;
            border: 2px solid rgba(86, 143, 184, 0.52);
            border-radius: 8px;
            background:
                linear-gradient(90deg, rgba(123, 184, 223, 0.28), transparent 34px),
                linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 252, 255, 0.94)),
                radial-gradient(circle at 18px 14px, rgba(255, 255, 255, 0.9), transparent 36px);
            box-shadow:
                0 14px 34px rgba(55, 112, 151, 0.16),
                0 3px 0 rgba(123, 184, 223, 0.22),
                inset 4px 0 0 rgba(123, 184, 223, 0.34);
            color: #263847;
            font-size: 15px;
            line-height: 1.56;
            letter-spacing: 0;
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
            opacity: 0;
            transform: translateY(-8px) scale(var(--avatar-dialogue-bubble-scale)) scale(0.98);
            transform-origin: 28px 100%;
            transition: opacity 180ms ease, transform 180ms ease;
            filter: drop-shadow(0 8px 18px rgba(82, 137, 174, 0.14));
        }

        .avatar-dialogue-bubble--visible {
            cursor: grab;
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0) scale(var(--avatar-dialogue-bubble-scale));
        }

        .avatar-dialogue-bubble--dragging {
            cursor: grabbing;
            transition: opacity 120ms ease;
        }

        .avatar-dialogue-bubble__text {
            display: -webkit-box;
            -webkit-line-clamp: 7;
            -webkit-box-orient: vertical;
            max-height: 10.9em;
            overflow: hidden;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .avatar-dialogue-bubble--pet {
            left: 8px;
            top: 0;
            min-width: min(188px, calc(100% - 24px));
            max-width: min(260px, calc(100% - 24px));
            padding: 10px 12px;
            font-size: 13px;
            line-height: 1.48;
            box-shadow:
                0 10px 24px rgba(55, 112, 151, 0.18),
                0 3px 0 rgba(123, 184, 223, 0.22),
                inset 4px 0 0 rgba(123, 184, 223, 0.34);
        }

        .avatar-dialogue-bubble--pet .avatar-dialogue-bubble__text {
            -webkit-line-clamp: 4;
            max-height: 5.92em;
        }

        .avatar-dialogue-bubble--surface {
            left: 8px;
            top: 8px;
            width: max-content;
            min-width: min(220px, calc(100% - 16px));
            max-width: calc(100% - 16px);
            pointer-events: none !important;
        }

        .avatar-dialogue-bubble--pet.avatar-dialogue-bubble--long .avatar-dialogue-bubble__text {
            -webkit-line-clamp: ${f};
            max-height: 4.44em;
        }

        @media (max-width: 768px) {
            .avatar-dialogue-bubble:not(.avatar-dialogue-bubble--pet) {
                left: 18px;
                top: 28px;
                max-width: calc(100% - 28px);
                font-size: 14px;
            }
        }
    `,document.head.appendChild(e)}function g(e){return`${r}:${e}`}function _(e){try{let t=window.localStorage.getItem(g(e)),n=t?JSON.parse(t):null;if(n&&Number.isFinite(n.left)&&Number.isFinite(n.top))return{left:n.left,top:n.top}}catch(e){console.warn(`读取人物对话框位置失败：`,e)}return null}function v(e,t){try{window.localStorage.setItem(g(e),JSON.stringify({left:Math.round(t.left),top:Math.round(t.top)}))}catch(e){console.warn(`保存人物对话框位置失败：`,e)}}function y(e,t,n){let r=e.getBoundingClientRect(),a=t.getBoundingClientRect(),o=Math.max(i,r.width-a.width-i),s=Math.max(i,r.height-a.height-i);return{left:Math.min(Math.max(n.left,i),o),top:Math.min(Math.max(n.top,i),s)}}function b(e){if(!e||typeof e!=`object`)return null;let t=Number(e.left),n=Number(e.top),r=Number(e.right),i=Number(e.bottom),a=Number(e.width)||r-t,o=Number(e.height)||i-n;return!Number.isFinite(t)||!Number.isFinite(n)||!Number.isFinite(r)||!Number.isFinite(i)||a<=0||o<=0||r<=t||i<=n?null:{left:t,top:n,right:r,bottom:i,width:a,height:o,centerX:Number.isFinite(Number(e.centerX))?Number(e.centerX):t+a/2,centerY:Number.isFinite(Number(e.centerY))?Number(e.centerY):n+o/2}}function x({rootElement:t=document.body,variant:r=`main`,avatarBoundsProvider:a=null}={}){if(!t)return()=>{};h();let o=document.createElement(`div`);o.className=`avatar-dialogue-bubble avatar-dialogue-bubble--${r}`,o.setAttribute(`role`,`status`),o.setAttribute(`aria-live`,`polite`);let c=document.createElement(`div`);c.className=`avatar-dialogue-bubble__text`,o.appendChild(c),t.appendChild(o);let l=0,p=``,g=null,x=0,S=m(window.ailisDesktop?.preferences||{}),C=()=>(r===`pet`||r===`surface`)&&!!window.ailisDesktop,w=()=>{let e=C()?S.scale:s;o.style.setProperty(`--avatar-dialogue-bubble-scale`,String(e))},T=()=>{if(C()){if(r===`surface`){let e=t.getBoundingClientRect(),n=o.getBoundingClientRect();return{left:(e.width-n.width)/2,top:e.height-n.height-i}}return{left:S.left,top:S.top}}return _(r)},E=e=>{if(!C()){v(r,e);return}r!==`surface`&&(S={...S,left:Math.round(e.left),top:Math.round(e.top)},(window.ailisDesktop?.savePreferences?.({avatarDialogueBubbleLeft:S.left,avatarDialogueBubbleTop:S.top}))?.catch?.(e=>{console.warn(`保存人物对话框位置失败：`,e)}))},D=(e,{persist:n=!1}={})=>{let r=y(t,o,e);o.style.left=`${r.left}px`,o.style.top=`${r.top}px`,n&&E(r)},O=()=>{if(r!==`pet`||typeof a!=`function`)return null;try{return b(a())}catch{return null}},k=()=>{let e=o.getBoundingClientRect();return!e||e.width<=0||e.height<=0?null:e},A=()=>{let e=O();if(!e)return null;let n=t.getBoundingClientRect(),r=k();if(!n||!r)return null;let a={left:e.centerX-n.left-r.width/2,top:e.top-n.top-r.height-u};if(a.top>=i)return a;let o=e.left-n.left,s=e.right-n.left,c=n.width-s-u,l=o-u,d=Math.min(Math.max(e.top-n.top+e.height*.08,i),Math.max(i,n.height-r.height-i));return c>=r.width+i?{left:s+u,top:d}:l>=r.width+i?{left:o-r.width-u,top:d}:a},j=()=>A()||T(),M=()=>{let e=j();e&&window.requestAnimationFrame(()=>D(e))},N=()=>{window.requestAnimationFrame(()=>{M(),window.requestAnimationFrame(M)})};w();let P=T();P&&window.requestAnimationFrame(()=>D(P));let F=()=>{l&&=(window.clearTimeout(l),0)},I=({delay:e=n}={})=>{F();let t=++x;l=window.setTimeout(()=>{t===x&&(o.classList.remove(`avatar-dialogue-bubble--visible`),p=``)},e)},L=({id:e=``,text:t=``}={})=>{let n=String(t||``).trim();if(!n){I({delay:0});return}F();let i=++x;p=String(e||Date.now()),c.textContent=n;let a=n.split(/\r?\n/).length;o.classList.toggle(`avatar-dialogue-bubble--long`,r===`pet`&&(n.length>d||a>f)),i===x&&(o.classList.add(`avatar-dialogue-bubble--visible`),N())},R=e=>{if(e.button!==0)return;e.preventDefault(),e.stopPropagation();let n=t.getBoundingClientRect(),r=o.getBoundingClientRect();g={pointerId:e.pointerId,offsetX:e.clientX-r.left,offsetY:e.clientY-r.top,rootLeft:n.left,rootTop:n.top},o.classList.add(`avatar-dialogue-bubble--dragging`),o.setPointerCapture?.(e.pointerId)},z=e=>{!g||e.pointerId!==g.pointerId||(e.preventDefault(),e.stopPropagation(),D({left:e.clientX-g.rootLeft-g.offsetX,top:e.clientY-g.rootTop-g.offsetY}))},B=e=>{if(!g||e.pointerId!==g.pointerId)return;e.preventDefault(),e.stopPropagation();let t={left:o.offsetLeft,top:o.offsetTop};g=null,o.classList.remove(`avatar-dialogue-bubble--dragging`),o.releasePointerCapture?.(e.pointerId),D(t,{persist:!0})},V=e=>{let t=e.detail||{},n=t.phase||t.type;if(n===`start`||n===`update`){L(t);return}if(n===`end`){let e=String(t.id||``);(!e||!p||e===p)&&I()}},H=window.ailisDesktop?.onPreferencesUpdated?.(({preferences:e={}}={})=>{C()&&(S=m(e),w(),M())});return window.addEventListener(e,V),o.addEventListener(`pointerdown`,R),o.addEventListener(`pointermove`,z),o.addEventListener(`pointerup`,B),o.addEventListener(`pointercancel`,B),()=>{F(),x+=1,H?.(),window.removeEventListener(e,V),o.removeEventListener(`pointerdown`,R),o.removeEventListener(`pointermove`,z),o.removeEventListener(`pointerup`,B),o.removeEventListener(`pointercancel`,B),o.remove()}}export{x as n,e as t};