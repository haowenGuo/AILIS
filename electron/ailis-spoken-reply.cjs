'use strict';

const REWRITE_INSTRUCTION = '将以下回答改写成适合 AILIS 人物自然朗读的口播。保留核心结论、重要提醒和原有称呼，不添加事实。省略代码、链接、路径和 Markdown 标记；长内容简要概括。只输出口播正文。';

function needsSpokenRewrite(text) {
    const value = String(text || '').trim();
    return Array.from(value).length > 150 || /[`*_#|~]|https?:\/\/|www\.|[A-Za-z]:[\\/]|(?:^|\s)\/[\w.-]+\/|\[[^\]]*\]\(|^\s*(?:[-+>]\s|\d+[.)、]\s?)/m.test(value);
}

async function prepareSpokenReply({ text, persona, callModel, trace = () => {} }) {
    const original = String(text || '').trim();
    trace('decision', { inputChars: Array.from(original).length, personaChars: String(persona || '').length });
    if (!original || !needsSpokenRewrite(original)) {
        trace('skipped', { reason: original ? 'short_plain_text' : 'empty' });
        return { ok: true, text: original, rewritten: false };
    }
    if (!String(persona || '').trim()) {
        trace('failed', { reason: 'missing_persona' });
        throw new Error('口播重写缺少 AILIS 完整人设');
    }
    const startedAt = Date.now();
    trace('model_started', {});
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
        trace('failed', { reason: !result?.ok ? 'provider_failure' : result.toolCalls?.length ? 'unexpected_tool_call' : 'empty_response', durationMs: Date.now() - startedAt });
        throw new Error(result?.error || '口播重写没有返回正文');
    }
    trace('model_completed', { outputChars: result.content.trim().length, unchanged: result.content.trim() === original, durationMs: Date.now() - startedAt });
    return { ok: true, text: result.content.trim(), rewritten: true };
}

module.exports = { needsSpokenRewrite, prepareSpokenReply, REWRITE_INSTRUCTION };
