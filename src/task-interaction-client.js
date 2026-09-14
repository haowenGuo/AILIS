// Shared acknowledgment/retry rules for chat, avatar and voice input surfaces.
export async function submitTaskInput({ api, sessionId, expectedRunId = '', text, attachments = [] }) {
    const key = `ailis-unsent-${sessionId}`;
    let saved; try { saved = JSON.parse(sessionStorage.getItem(key)); } catch {}
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({ text, attachments })));
    const signature = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
    const identity = saved?.signature === signature ? saved : { signature, expectedRunId, clientMessageId: crypto.randomUUID() };
    const payload = { sessionId, expectedRunId: identity.expectedRunId, clientMessageId: identity.clientMessageId, text, attachments };
    // Keep only retry identity, not multi-megabyte images, in sessionStorage.
    sessionStorage.setItem(key, JSON.stringify(identity));
    let result;
    try { result = await api.submit(payload); }
    catch (error) {
        try { result = await api.receipt(payload); } catch {}
        if (!result || result.status === 'not_received') throw new Error(`发送状态尚未确认，草稿已保留：${error.message}`);
    }
    if (!result.ok) { sessionStorage.removeItem(key); throw new Error(result.error || '消息未接收'); }
    sessionStorage.removeItem(key);
    return result;
}
