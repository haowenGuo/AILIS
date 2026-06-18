import { markdownToPlainText, normalizeMarkdownSource } from './markdown-renderer.js';

const CONTROL_TAG_PATTERN = /\[(?:action|expression|emotion|gesture|gestureIntent|taskState|tts_style|ttsStyle)\s*:[^\]]*]/gi;
const PERSONA_BLOCK_PATTERN = /<\s*(?:persona_output|persona_surface|personaOutput|personaSurface|ailis_persona_output|ailis_persona_surface)\b[^>]*>[\s\S]*?(?:<\s*\/\s*(?:persona_output|persona_surface|personaOutput|personaSurface|ailis_persona_output|ailis_persona_surface)\s*>|$)/gi;
const INTERNAL_JSON_KEY_PATTERN = /["']?(?:persona_output|persona_surface|personaOutput|personaSurface|ailis_persona_output|ailis_persona_surface)["']?\s*:/i;
const MARKDOWN_IMAGE_PATTERN = /!\[[^\]]*]\([^)]+\)/g;
const FENCED_CODE_PATTERN = /```[\s\S]*?```/g;
const INLINE_CODE_PATTERN = /`([^`\n]+)`/g;
const HTML_TAG_PATTERN = /<[^>\n]+>/g;
const EMOJI_PATTERN = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
const ACTION_PREFIX_PATTERN = /^\s*[*_~\-\s]*(?:我|她|他|AILIS|爱丽丝)?\s*(?:轻轻|慢慢|悄悄|微微|忽然|突然|认真|温柔|小心|抬头|低头|歪头|眨眼|笑|看|伸手|坐|站|靠|握|拉|摸|整理|捂脸|闭上眼|睁开眼|耳尖|脸颊|眼神|指尖|声音|动作|表情)/;
const ACTION_HINT_PATTERN = /(?:轻轻|慢慢|微微|歪头|眨眼|伸手|坐下|站起|低头|抬头|耳尖|脸颊|眼神|指尖|动作|表情|星光|云床|跳舞|转身|摆手|托腮|捂脸|闭上眼|睁开眼)/;
const SPEAKABLE_LINE_PATTERN = /[\u4e00-\u9fffA-Za-z0-9]/;

function normalizeWhitespace(value) {
    return String(value || '')
        .replace(/\r\n?/g, '\n')
        .replace(/\u00a0/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function removeInternalJsonTail(text) {
    const source = String(text || '');
    const keyMatch = source.search(INTERNAL_JSON_KEY_PATTERN);
    if (keyMatch < 0) {
        return source;
    }
    const braceStart = source.lastIndexOf('{', keyMatch);
    if (braceStart < 0) {
        return source.slice(0, keyMatch);
    }
    return source.slice(0, braceStart);
}

function isActionOnlyLine(line) {
    const text = String(line || '').trim();
    if (!text) {
        return true;
    }
    const unwrapped = text
        .replace(/^>\s*/, '')
        .replace(/^[-*+]\s+/, '')
        .replace(/^\d+[.)]\s+/, '')
        .trim();
    if (!SPEAKABLE_LINE_PATTERN.test(unwrapped)) {
        return true;
    }
    if (/^[(（【\[][\s\S]*[)）】\]]$/.test(unwrapped) && ACTION_HINT_PATTERN.test(unwrapped)) {
        return true;
    }
    if (/^\*[^*\n]{1,160}\*$/.test(unwrapped) && ACTION_HINT_PATTERN.test(unwrapped)) {
        return true;
    }
    if (ACTION_PREFIX_PATTERN.test(unwrapped) && /[。.!！~～…)]$/.test(unwrapped) && unwrapped.length <= 180) {
        return true;
    }
    return false;
}

function stripInlineActionCues(text) {
    let output = String(text || '');
    for (let guard = 0; guard < 12; guard += 1) {
        const next = output
            .replace(/[（(][^（）()\n]{0,180}(?:轻轻|慢慢|微微|歪头|眨眼|伸手|坐下|站起|低头|抬头|耳尖|脸颊|眼神|指尖|动作|表情|捂脸|闭上眼|睁开眼)[^（）()\n]{0,180}[）)]/g, '')
            .replace(/\*[^*\n]{0,180}(?:轻轻|慢慢|微微|歪头|眨眼|伸手|坐下|站起|低头|抬头|耳尖|脸颊|眼神|指尖|动作|表情|捂脸|闭上眼|睁开眼)[^*\n]{0,180}\*/g, '');
        if (next === output) {
            return output;
        }
        output = next;
    }
    return output;
}

export function extractTtsSpeechTextFromDisplay(displayText, { maxChars = 900 } = {}) {
    const withoutControls = removeInternalJsonTail(String(displayText || '')
        .replace(PERSONA_BLOCK_PATTERN, '')
        .replace(CONTROL_TAG_PATTERN, '')
        .replace(MARKDOWN_IMAGE_PATTERN, '')
        .replace(FENCED_CODE_PATTERN, '')
        .replace(HTML_TAG_PATTERN, ' '));

    const actionStripped = stripInlineActionCues(withoutControls);
    const speakableMarkdown = actionStripped
        .split('\n')
        .filter((line) => !isActionOnlyLine(line))
        .join('\n');
    const plain = markdownToPlainText(normalizeMarkdownSource(speakableMarkdown))
        .replace(INLINE_CODE_PATTERN, '$1')
        .replace(EMOJI_PATTERN, '')
        .replace(/^[\s\-*+>]+/gm, '')
        .replace(/[ \t]*([。！？，、；：])[ \t]*/g, '$1')
        .replace(/[~～]{2,}/g, '～')
        .replace(/([。！？!?]){3,}/g, '$1$1')
        .replace(/\n+/g, ' ');

    const normalized = normalizeWhitespace(plain);
    if (!normalized || normalized.length <= maxChars) {
        return normalized;
    }
    return `${normalized.slice(0, Math.max(0, maxChars - 1))}…`;
}

export function normalizeTtsSpeechText(value, options = {}) {
    return extractTtsSpeechTextFromDisplay(value, options);
}

export function deriveTtsSpeechText(payload = {}, displayText = '', options = {}) {
    const candidates = [
        payload?.speech_text,
        payload?.speechText,
        payload?.surface?.speechText,
        payload?.surface?.speech_text,
        payload?.personaSurface?.speechText,
        payload?.persona_surface?.speech_text,
        displayText,
        payload?.display_text,
        payload?.displayText
    ];
    for (const candidate of candidates) {
        const speech = normalizeTtsSpeechText(candidate, options);
        if (speech) {
            return speech;
        }
    }
    return '';
}
