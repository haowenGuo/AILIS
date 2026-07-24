// Architecture adapted from pixiv/ChatVRM and semperai/amica (MIT License).
// This module keeps the LLM-facing persona protocol separate from concrete VRM controls.

export const CHATVRM_EMOTIONS = Object.freeze([
    'neutral',
    'happy',
    'angry',
    'sad',
    'relaxed'
]);

export const AMICA_EMOTIONS = Object.freeze([
    'neutral',
    'happy',
    'angry',
    'sad',
    'relaxed',
    'surprised',
    'shy',
    'jealous',
    'bored',
    'serious',
    'suspicious',
    'victory',
    'sleep',
    'love'
]);

export const TALK_STYLES = Object.freeze([
    'talk',
    'happy',
    'sad',
    'angry',
    'fear',
    'surprised'
]);

const EMOTION_ALIASES = Object.freeze({
    calm: 'relaxed',
    comfort: 'relaxed',
    comforting: 'relaxed',
    focused: 'serious',
    thinking: 'serious',
    think: 'serious',
    anxious: 'suspicious',
    worried: 'suspicious',
    tired: 'sleep',
    sleepy: 'sleep',
    success: 'victory',
    celebrate: 'victory',
    pleased: 'happy',
    joy: 'happy',
    surprise: 'surprised',
    blush: 'shy'
});

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

export function normalizeAmicaEmotion(value, fallback = 'relaxed') {
    const normalized = normalizeText(value).toLowerCase().replace(/[-\s]+/g, '_');
    if (!normalized) {
        return fallback;
    }
    const aliased = EMOTION_ALIASES[normalized] || normalized;
    return AMICA_EMOTIONS.includes(aliased) ? aliased : fallback;
}

export function emotionToTalkStyle(emotion) {
    switch (normalizeAmicaEmotion(emotion, 'neutral')) {
        case 'angry':
        case 'jealous':
        case 'suspicious':
            return 'angry';
        case 'happy':
        case 'victory':
        case 'love':
            return 'happy';
        case 'sad':
        case 'sleep':
            return 'sad';
        case 'surprised':
            return 'surprised';
        default:
            return 'talk';
    }
}

export function splitScreenplaySentences(text = '') {
    const normalized = normalizeText(text);
    if (!normalized) {
        return [];
    }
    return normalized
        .split(/(?<=[。．！？!?；;\n])/g)
        .map((item) => item.trim())
        .filter(Boolean);
}

export function parseEmotionTaggedText(text = '', fallbackEmotion = 'relaxed') {
    const rawText = normalizeText(text);
    const tagMatch = rawText.match(/^\s*\[([^\]]+)\]\s*/);
    const emotion = normalizeAmicaEmotion(tagMatch?.[1], fallbackEmotion);
    const message = tagMatch
        ? rawText.slice(tagMatch[0].length).trim()
        : rawText;

    return {
        emotion,
        message,
        rawText
    };
}

export function textsToScreenplay(texts = [], { previousEmotion = 'relaxed' } = {}) {
    const screenplays = [];
    let activeEmotion = normalizeAmicaEmotion(previousEmotion, 'relaxed');

    for (const text of Array.isArray(texts) ? texts : [texts]) {
        const parsed = parseEmotionTaggedText(text, activeEmotion);
        activeEmotion = parsed.emotion;
        screenplays.push({
            expression: activeEmotion,
            talk: {
                style: emotionToTalkStyle(activeEmotion),
                message: parsed.message
            },
            text: parsed.rawText
        });
    }

    return screenplays;
}

export function surfaceToScreenplay(surface = {}, fallbackText = '') {
    const emotion = normalizeAmicaEmotion(surface.emotion, 'relaxed');
    const text = normalizeText(surface.text || fallbackText);
    return {
        expression: emotion,
        talk: {
            style: emotionToTalkStyle(emotion),
            message: text
        },
        text,
        surface
    };
}

