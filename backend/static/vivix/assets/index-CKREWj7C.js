(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{key:`explore`,label:`Explore`,icon:`◎`},{key:`turbo`,label:`Turbo`,icon:`▣`},{key:`live`,label:`Live`,icon:`◉`},{key:`play`,label:`Play`,icon:`↻`},{key:`api`,label:`API`,icon:`</>`},{key:`about`,label:`About`,icon:`⌘`}],t=[{title:`Turbo`,image:`https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80`,route:`turbo`},{title:`Live`,image:`https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80`,route:`live`},{title:`Play`,image:`https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80`,route:`play`},{title:`Work`,image:`https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80`,route:`about`}],n=[`Founder launch sequence`,`Streetwear reveal storyboard`,`Product drop in 9:16, 1:1, 16:9`],r=[{title:`Language Practice`,text:`Instant replies, persistent memory, and full-body delivery for tutoring and cultural roleplay.`},{title:`Music Stage`,text:`Realtime co-performance mode for creators who want a host, singer, or pianist to stay in sync.`},{title:`Whisper Space`,text:`Soft-tone avatar presets for ASMR, intimacy, and late-night live rooms.`},{title:`Video Crush`,text:`Character-driven conversations built for playful social experiences and fan communities.`}],i=[`Real-world interaction`,`Cross-content interaction`,`Dance move clone`,`Visual clone`,`Intuitive interface`,`Multi-subject motion`,`Diverse gestures`,`All-elements interactive`],a=`import { Vivix } from "@vivix/sdk";

const client = new Vivix({
  apiKey: process.env.VIVIX_API_KEY,
});

const reel = await client.turbo.create({
  prompt: "Midnight launch film for a new audio device",
  aspectRatio: "9:16",
  duration: 12,
});

console.log(reel.status, reel.outputUrl);`,o={prompt:`Midnight campaign film for a translucent audio device. Slick reflections, slow orbit camera, warm chrome, clean studio floor, rising tension, reveal at second 8.`,imageUrl:``,ratio:`16:9`,duration:`5`,model:`seedance-1-0-pro-250528`,status:`idle`,taskId:``,error:``,videoUrl:``},s={explore:d,turbo:f,live:p,play:m,api:h,about:g},c=document.querySelector(`#app`);if(!c)throw Error(`App root not found`);var l=()=>{let t=window.location.hash.replace(`#`,``);return e.some(e=>e.key===t)?t:`explore`},u=t=>`
  <aside class="sidebar">
    <div>
      <div class="brand">Vivix</div>
      <nav class="sidebar-nav" aria-label="Primary">
        ${e.map(e=>`
              <a href="#${e.key}" class="nav-item ${e.key===t?`is-active`:``}">
                <span class="nav-icon">${e.icon}</span>
                <span>${e.label}</span>
              </a>
            `).join(``)}
      </nav>
    </div>

    <div class="sidebar-bottom">
      <div class="profile-card">
        <div class="profile-avatar">G</div>
        <div>
          <div class="profile-name">Guohaowen</div>
          <div class="profile-tier">Free</div>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <div class="socials" aria-label="Social links">
        <a href="#" aria-label="X">X</a>
        <a href="#" aria-label="Discord">◉</a>
        <a href="#" aria-label="Email">✉</a>
      </div>
    </div>
  </aside>
`;function d(){return`
    <section class="hero hero-center">
      <div class="hero-kicker">
        <span>Welcome to</span>
        <span class="hero-brand">Vivix</span>
      </div>
      <h1>Where content is live, interactive, and yours</h1>
      <p class="hero-subtitle">
        Presenting our capabilities: real-time interaction, instant video generation, and immersive collaboration.
      </p>
    </section>

    <section class="card-grid" aria-label="Capabilities">
      ${t.map(e=>`
            <a
              href="#${e.route}"
              class="feature-card"
              style="background-image: linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), url('${e.image}')"
            >
              <span>${e.title}</span>
            </a>
          `).join(``)}
    </section>
  `}function f(){return`
    <section class="page-hero page-hero-left">
      <p class="section-tag">Introducing Vivix Turbo</p>
      <h1 class="page-title">Generate any story in seconds, then keep iterating like an editor.</h1>
      <p class="page-copy">
        A long-video generation workspace inspired by Vivix Turbo: prompt, reference, output count, and a rolling feed of production-ready reels all in one surface.
      </p>
    </section>

    <section class="turbo-layout">
      <article class="panel compose-panel">
        <div class="panel-head">
          <h2>Compose</h2>
          <span class="pill pill-orange">Turbo mode</span>
        </div>
        <p class="panel-note">
          This panel is wired for Doubao Seedance through the AILIS backend proxy. Local development can still use <code>.env.local</code>.
        </p>

        <label class="field-label" for="turbo-model">Model / Endpoint ID</label>
        <input id="turbo-model" class="text-input" value="${b(o.model)}" placeholder="seedance-1-0-pro-250528" />

        <label class="field-label" for="turbo-image">Reference image URL (optional)</label>
        <input id="turbo-image" class="text-input" value="${b(o.imageUrl)}" placeholder="https://example.com/reference.png" />

        <label class="field-label" for="turbo-prompt">Prompt</label>
        <textarea id="turbo-prompt" class="prompt-box" rows="6" placeholder="Describe your video...">${b(o.prompt)}</textarea>

        <div class="control-row">
          <label class="mini-input mini-input-form">
            <span>Ratio</span>
            <select id="turbo-ratio" class="select-input">
              ${[`16:9`,`9:16`,`1:1`,`4:3`].map(e=>`<option value="${e}" ${o.ratio===e?`selected`:``}>${e}</option>`).join(``)}
            </select>
          </label>
          <label class="mini-input mini-input-form">
            <span>Duration</span>
            <select id="turbo-duration" class="select-input">
              ${[`5`,`10`].map(e=>`<option value="${e}" ${o.duration===e?`selected`:``}>${e}s</option>`).join(``)}
            </select>
          </label>
          <div class="mini-input">
            <span>Status</span>
            <strong>${y()}</strong>
          </div>
        </div>

        <button class="action-button" id="turbo-generate" ${o.status===`submitting`||o.status===`polling`?`disabled`:``}>
          ${o.status===`submitting`?`Submitting...`:o.status===`polling`?`Generating...`:`Generate with Seedance`}
        </button>

        <div class="turbo-feedback ${o.error?`is-error`:``}">
          ${o.error?b(o.error):o.taskId?`Task ID: ${b(o.taskId)}`:`Ready to submit a Seedance task.`}
        </div>
      </article>

      <article class="panel feed-panel">
        <div class="panel-head">
          <h2>Generation result</h2>
          <span class="panel-meta">${o.videoUrl?`Latest result`:`Demo feed`}</span>
        </div>
        ${o.videoUrl?`
              <div class="result-card">
                <video class="result-video" src="${b(o.videoUrl)}" controls playsinline></video>
                <div class="result-meta">
                  <strong>Seedance generation completed</strong>
                  <span>Model: ${b(o.model)}</span>
                  <span>Ratio: ${b(o.ratio)} / Duration: ${b(o.duration)}s</span>
                  <a class="result-link" href="${b(o.videoUrl)}" target="_blank" rel="noreferrer">Open video URL</a>
                </div>
              </div>
            `:`
              <div class="feed-grid">
                ${n.map((e,t)=>`
                      <div class="reel-card">
                        <div class="reel-frame reel-${t+1}"></div>
                        <div class="reel-copy">
                          <strong>${e}</strong>
                          <span>${t===0?`Queued 14s ago`:t===1?`Rendered in 2m 11s`:`Draft saved`}</span>
                        </div>
                      </div>
                    `).join(``)}
              </div>
            `}
      </article>
    </section>
  `}function p(){return`
    <section class="page-hero page-hero-left">
      <p class="section-tag">Introducing Vivix Live</p>
      <h1 class="page-title">A streaming digital soul with instant replies and full-body presence.</h1>
      <p class="page-copy">
        Similar to the reference product’s Live area, this page focuses on use-case discovery: conversational avatars, performance scenes, and persistent interaction modes.
      </p>
    </section>

    <section class="live-grid">
      ${r.map((e,t)=>`
            <article class="panel live-card">
              <div class="live-preview live-preview-${t+1}">
                <div class="live-status">${t%2==0?`Realtime`:`Interactive`}</div>
              </div>
              <h2>${e.title}</h2>
              <p>${e.text}</p>
            </article>
          `).join(``)}
    </section>
  `}function m(){return`
    <section class="page-hero page-hero-left">
      <p class="section-tag">Introducing Vivix Play</p>
      <h1 class="page-title">Touch the path, bend the motion, and direct video without prompt fatigue.</h1>
      <p class="page-copy">
        The Play surface in vivix.ai behaves like an experiment gallery. Here we mirror that idea with a grid of motion cases that feels like a creative playground rather than a docs page.
      </p>
    </section>

    <section class="play-grid">
      ${i.map((e,t)=>`
            <article class="panel play-card">
              <div class="play-thumb play-thumb-${t%4+1}">
                <div class="scribble scribble-${t%3+1}"></div>
              </div>
              <strong>${e}</strong>
            </article>
          `).join(``)}
    </section>
  `}function h(){return`
    <section class="page-hero page-hero-left">
      <p class="section-tag">API Platform</p>
      <h1 class="page-title">Ship the generation engine inside your own product.</h1>
      <p class="page-copy">
        A practical API page completes the product story: endpoints, auth, usage, and a quick-start sample for teams embedding Turbo, Live, or Play into their workflow.
      </p>
    </section>

    <section class="api-layout">
      <article class="panel api-sidebar-card">
        <h2>Endpoints</h2>
        <div class="endpoint-list">
          <div><span class="method post">POST</span><strong>/v1/turbo/create</strong></div>
          <div><span class="method post">POST</span><strong>/v1/live/session</strong></div>
          <div><span class="method post">POST</span><strong>/v1/play/direct</strong></div>
          <div><span class="method get">GET</span><strong>/v1/jobs/:id</strong></div>
        </div>
        <div class="usage-box">
          <span>Current balance</span>
          <strong>1,280 credits</strong>
        </div>
      </article>

      <article class="panel code-panel">
        <div class="panel-head">
          <h2>Quick start</h2>
          <span class="pill">TypeScript</span>
        </div>
        <pre><code>${a}</code></pre>
      </article>
    </section>
  `}function g(){return`
    <section class="page-hero page-hero-left">
      <p class="section-tag">About the system</p>
      <h1 class="page-title">Built for media teams that want speed, personality, and reusable output.</h1>
      <p class="page-copy">
        Instead of stopping at a visual clone, this prototype turns the reference into a fuller product concept: an AI media OS with generation, realtime interaction, playful direction, and developer access.
      </p>
    </section>

    <section class="about-grid">
      <article class="panel stat-panel">
        <span class="big-stat">3s</span>
        <p>cold-open generation target for social-first launch reels</p>
      </article>
      <article class="panel stat-panel">
        <span class="big-stat">24/7</span>
        <p>avatar presence for classes, creators, communities, and support surfaces</p>
      </article>
      <article class="panel text-panel">
        <h2>Why this direction</h2>
        <p>
          Vivix.ai is strongest when it feels like a family of creative tools rather than a generic SaaS site. This implementation follows that lesson by giving each route its own interaction center and emotional tone.
        </p>
      </article>
    </section>
  `}var _=()=>{let e=l();c.innerHTML=`
    <div class="layout">
      ${u(e)}
      <main class="content">
        <div class="content-shell">
          ${s[e]()}
          <footer class="footer">
            <span>Copyright ©vivix.ai</span>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </footer>
        </div>
      </main>
    </div>
  `,e===`turbo`&&x()};window.addEventListener(`hashchange`,_);var v=e=>new Promise(t=>setTimeout(t,e));function y(){switch(o.status){case`submitting`:return`Submitting`;case`polling`:return`Generating`;case`succeeded`:return`Succeeded`;case`failed`:return`Failed`;default:return`Idle`}}function b(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function x(){let e=document.querySelector(`#turbo-prompt`),t=document.querySelector(`#turbo-image`),n=document.querySelector(`#turbo-ratio`),r=document.querySelector(`#turbo-duration`),i=document.querySelector(`#turbo-model`),a=document.querySelector(`#turbo-generate`);e?.addEventListener(`input`,()=>{o.prompt=e.value}),t?.addEventListener(`input`,()=>{o.imageUrl=t.value}),n?.addEventListener(`change`,()=>{o.ratio=n.value}),r?.addEventListener(`change`,()=>{o.duration=r.value}),i?.addEventListener(`input`,()=>{o.model=i.value}),a?.addEventListener(`click`,async()=>{await S()})}async function S(){o.error=``,o.videoUrl=``,o.taskId=``,o.status=`submitting`,_();try{let e=[{type:`text`,text:`${o.prompt} --ratio ${o.ratio} --dur ${o.duration}`}];o.imageUrl.trim()&&e.push({type:`image_url`,image_url:{url:o.imageUrl.trim()}});let t=await fetch(`/api/vivix/seedance/tasks`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({model:o.model.trim(),content:e})}),n=await t.json();if(!t.ok||!n.id)throw Error(n.error?.message||`Failed to create Seedance task`);o.taskId=n.id,o.status=`polling`,_(),await C(n.id)}catch(e){o.status=`failed`,o.error=e instanceof Error?e.message:`Unknown error`,_()}}async function C(e){for(let t=0;t<60;t+=1){let t=await fetch(`/api/vivix/seedance/tasks/${e}`),n=await t.json();if(!t.ok)throw Error(n.error?.message||`Failed to query Seedance task`);if(n.status===`succeeded`&&n.content?.video_url){o.status=`succeeded`,o.videoUrl=n.content.video_url,_();return}if(n.status===`failed`||n.status===`canceled`)throw Error(`Seedance task ended with status: ${n.status}`);await v(5e3)}throw Error(`Seedance task polling timed out after 5 minutes`)}window.location.hash?_():window.location.hash=`#explore`;