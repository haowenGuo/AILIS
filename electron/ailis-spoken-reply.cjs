'use strict';

const REWRITE_INSTRUCTION = '将以下回答改写成适合 AILIS 人物自然朗读的口播。保留核心结论、重要提醒和原有称呼，不添加事实。省略代码、链接、路径和 Markdown 标记；长内容简要概括。只输出口播正文。';

function needsSpokenRewrite(text) {
    const value = String(text || '').trim();
    return Array.from(value).length > 150 || /[`*_#|~]|https?:\/\/|www\.|[A-Za-z]:[\\/]|(?:^|\s)\/[\w.-]+\/|\[[^\]]*\]\(|^\s*(?:[-+>]\s|\d+[.)、]\s?)/m.test(value);
}

async function prepareSpokenReply({ text, persona, callModel }) {
    const original = String(text || '').trim();
    if (!original || !needsSpokenRewrite(original)) {
        return { ok: true, text: original, rewritten: false };
    }
    if (!String(persona || '').trim()) throw new Error('口播重写缺少 AILIS 完整人设');
    const result = await callModel({
        messages: [
            { role: 'system', content: `${persona}\n\n${REWRITE_INSTRUCTION}` },
            { role: 'user', content: original }
        ],
        tools: [],
        recordMemory: false,
        includeAilisMemory: false,
        timeoutMs: 45000
    });
    if (!result?.ok || !String(result.content || '').trim() || result.toolCalls?.length) {
        throw new Error(result?.error || '口播重写没有返回正文');
    }
    return { ok: true, text: result.content.trim(), rewritten: true };
}

module.exports = { needsSpokenRewrite, prepareSpokenReply, REWRITE_INSTRUCTION };
