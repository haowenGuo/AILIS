import { applyI18n, setUiLanguage, t } from './i18n.js';

const api = window.ailisQuickControls;
const voice = document.getElementById('voice-options');
const scale = document.getElementById('quick-scale');
const language = document.getElementById('quick-language');
const status = document.getElementById('quick-status');
let busy = false;

function render(state) {
    if (!state) return;
    setUiLanguage(state.uiLanguage);
    applyI18n(document, { skipSelectors: ['#voice-options', '#quick-scale', '#quick-language', '#quick-status'] });
    // Update existing controls in place so preference broadcasts keep keyboard focus.
    for (const option of state.speech.options) {
        let button = [...voice.children].find(el => el.dataset.value === option.value);
        if (!button) {
            button = document.createElement('button');
            button.type = 'button'; button.className = 'voice-option'; button.dataset.value = option.value;
            button.addEventListener('click', () => apply({ id: 'speech', value: option.value }));
            voice.append(button);
        }
        button.textContent = option.label;
        button.setAttribute('aria-pressed', String(state.speech.value === option.value));
        button.disabled = busy;
    }
    for (const [select, group] of [[scale, state.scale], [language, state.language]]) {
        select.replaceChildren(...group.options.map(item => {
            const option = document.createElement('option'); option.value = item.value; option.textContent = item.label; return option;
        }));
        select.value = String(group.value);
    }
}

async function apply(action) {
    if (busy) return;
    busy = true; status.dataset.error = 'false'; status.textContent = t('正在应用…');
    document.querySelectorAll('[data-action], .voice-option, select').forEach(el => el.disabled = true);
    try {
        const result = await api.apply(action);
        render(result.state);
        if (!result.ok) throw new Error(result.error);
        status.textContent = t('已应用');
    } catch (error) { status.textContent = error.message; status.dataset.error = 'true'; }
    finally { busy = false; document.querySelectorAll('[data-action], .voice-option, select').forEach(el => el.disabled = false); }
}

document.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => apply({ id: el.dataset.action })));
scale.addEventListener('change', () => apply({ id: 'scale', value: Number(scale.value) }));
language.addEventListener('change', () => apply({ id: 'language', value: language.value }));
document.getElementById('dismiss').addEventListener('click', () => api.hide());
document.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); api.hide(); } });
api.onState(render);
api.onFocus(() => { status.textContent = t('选择后立即生效'); status.dataset.error = 'false'; document.getElementById('quick-chat').focus(); });
api.getState().then(render).catch(error => { status.textContent = error.message; status.dataset.error = 'true'; });
