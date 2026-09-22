import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const provider = require('../electron/desktop-llm-provider.cjs');
const research = require('../scripts/mcp-ailis-research-server.cjs');
const { resolveVisionModelRoute, callVisionModel } = require('../electron/ailis-vision-model-router.cjs');
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const messages = [{ role: 'user', content: [{ type: 'text', text: 'Describe this image' }, { type: 'image_url', image_url: { url: image } }] }];
let counter = 0;
const cloud = () => ({ provider: 'ailis-cloud', model: 'ailis-cloud', baseUrl: `https://vision-${++counter}.invalid/api/llm/v1` });
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
const completion = () => json({ choices: [{ message: { role: 'assistant', content: 'image received' } }] });

function settingsFixture(t, selectedProvider = 'ailis-cloud') {
    const dir = mkdtempSync(path.join(tmpdir(), 'ailis-cloud-vision-'));
    const saved = {};
    for (const key of Object.keys(process.env)) {
        if (/^(AILIS_TOOL_LLM_|AILIS_AGENT_LLM_|DOUBAO_API_KEY$|ARK_API_KEY$|VOLCENGINE_API_KEY$|OPENAI_COMPATIBLE_API_KEY$|APPDATA$)/.test(key)) {
            saved[key] = process.env[key]; delete process.env[key];
        }
    }
    process.env.APPDATA = dir;
    mkdirSync(path.join(dir, 'ailis'));
    const settings = cloud();
    const statePath = path.join(dir, 'ailis', 'desktop-state.json');
    const prefs = { llmProvider: selectedProvider, llmBaseUrl: settings.baseUrl, llmModel: settings.model, llmApiKey: '' };
    writeFileSync(statePath, JSON.stringify({ preferences: prefs }));
    t.after(() => {
        delete process.env.APPDATA;
        for (const [key, value] of Object.entries(saved)) process.env[key] = value;
        rmSync(dir, { recursive: true, force: true });
    });
    return { dir, settings, prefs, statePath };
}

test('research resolves managed cloud without a personal key and does not forward a stale key', t => {
    const { prefs, statePath } = settingsFixture(t);
    assert.equal(research.readDesktopLlmSettings().provider, 'ailis-cloud');
    assert.equal(research.readDesktopLlmSettings().apiKey, '');
    prefs.llmApiKey = 'stale-personal-secret';
    writeFileSync(statePath, JSON.stringify({ preferences: prefs }));
    assert.equal(research.readDesktopLlmSettings().apiKey, '');
});

test('personal API providers still require their credentials', t => {
    settingsFixture(t, 'openai-compatible');
    assert.equal(research.readDesktopLlmSettings(), null);
});

test('cloud alias is unconfirmed, not vision false; route permits server validation', () => {
    const settings = cloud();
    assert.equal(provider.getProviderCapabilities(settings).vision, null);
    assert.equal(resolveVisionModelRoute({ mainSettings: settings }).ok, true);
    assert.equal(provider.getProviderCapabilities({ ...settings, model: 'gpt-5.6-luna' }).vision, null);
});

test('real describe_image performs session auth then POSTs the complete inline image', async t => {
    const { dir, settings } = settingsFixture(t);
    const file = path.join(dir, 'sample.png');
    writeFileSync(file, Buffer.from(image.split(',')[1], 'base64'));
    const requests = [];
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        requests.push({ url: String(url), options });
        return String(url).endsWith('/session') ? json({ token: 'managed-session-token' }) : completion();
    });
    const result = await research.handleToolCall({ params: { name: 'describe_image', arguments: { path: file, question: 'Describe the image' } } });
    assert.notEqual(result.isError, true);
    assert.equal(requests.length, 2);
    assert.equal(requests[0].options.method, 'GET');
    assert.equal(requests[0].options.headers.Authorization, undefined);
    assert.equal(requests[1].url, `${settings.baseUrl}/chat/completions`);
    assert.equal(requests[1].options.headers.Authorization, 'Bearer managed-session-token');
    assert.equal(JSON.parse(requests[1].options.body).messages[0].content[1].image_url.url, image);
});

for (const declared of [true, false, undefined, 'false']) {
    test(`cloud vision declaration ${String(declared)} is applied without alias guessing`, async t => {
        const settings = cloud();
        let posts = 0;
        t.mock.method(globalThis, 'fetch', async (url) => {
            if (String(url).endsWith('/session')) return json({ token: 'session', capabilities: { vision: declared } });
            posts++; return completion();
        });
        const result = await callVisionModel({ mainSettings: settings, request: { messages } });
        assert.equal(posts, declared === false ? 0 : 1);
        assert.equal(result.ok, declared !== false);
        const capability = provider.getProviderCapabilities(settings);
        assert.equal(capability.vision, typeof declared === 'boolean' ? declared : null);
        assert.equal(resolveVisionModelRoute({ mainSettings: settings }).ok, declared !== false);
        if (declared === false) assert.equal(result.code, 'vision_unsupported');
    });
}

test('expired server declaration is not reused to reject a new vision request', async t => {
    const settings = cloud();
    t.mock.method(globalThis, 'fetch', async () => json({ token: 'expired', expiresAt: '2000-01-01T00:00:00Z', capabilities: { vision: false } }));
    await provider.callDesktopLlmProvider(settings, { messages });
    assert.equal(provider.getProviderCapabilities(settings).vision, null);
});

test('session auth failure remains HTTP 401 and never submits image inference', async t => {
    let calls = 0;
    t.mock.method(globalThis, 'fetch', async () => { calls++; return json({ error: 'session rejected' }, 401); });
    const result = await callVisionModel({ mainSettings: cloud(), request: { messages } });
    assert.equal(calls, 1);
    assert.equal(result.ok, false);
    assert.equal(result.status, 401);
    assert.notEqual(result.code, 'vision_not_configured');
});

test('renewed session declaring no vision blocks the retried image POST', async t => {
    const settings = cloud();
    let sessions = 0, posts = 0;
    t.mock.method(globalThis, 'fetch', async url => {
        if (String(url).endsWith('/session')) return json({ token: `session-${++sessions}`, capabilities: { vision: sessions === 1 } });
        posts++; return json({ error: 'expired' }, 401);
    });
    const result = await provider.callDesktopLlmProvider(settings, { messages });
    assert.equal(result.code, 'vision_unsupported');
    assert.equal(sessions, 2);
    assert.equal(posts, 1);
});

test('managed UI mode ignores hidden legacy auxiliary configuration', () => {
    const source = readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
    const fn = source.slice(source.indexOf('function getResolvedVisionLlmSettings()'), source.indexOf('function buildTemporaryVisionLlmSettings('));
    let reads = 0;
    const resolved = vm.runInNewContext(`${fn}\ngetResolvedVisionLlmSettings()`, {
        getResolvedLlmSettings: () => ({ provider: 'ailis-cloud' }),
        getPersistedVisionLlmSettings: () => { reads++; throw new Error('hidden settings must not be read'); }
    });
    assert.equal(resolved, null);
    assert.equal(reads, 0);
});
