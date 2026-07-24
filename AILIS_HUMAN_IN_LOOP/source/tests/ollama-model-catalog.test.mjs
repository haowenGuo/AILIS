import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    buildOllamaSearchUrl,
    buildOllamaTagsUrl,
    parseOllamaSearchHtml,
    parseOllamaTagsHtml,
    searchOllamaModelCatalog
} = require('../electron/ollama-model-catalog.cjs');

function createHtmlResponse(html, overrides = {}) {
    return {
        ok: true,
        status: 200,
        statusText: 'OK',
        async text() {
            return html;
        },
        ...overrides
    };
}

const searchHtml = `
<a href="/library/qwen3" class="group w-full">
  <div title="qwen3">
    <span x-test-search-response-title>qwen3</span>
    <p>Qwen3 generation models.</p>
    <span x-test-capability>tools</span>
    <span x-test-size>0.6b</span>
    <span x-test-size>4b</span>
  </div>
</a>
<a href="/library/qwen3-embedding" class="group w-full">
  <span x-test-search-response-title>qwen3-embedding</span>
  <p>Text embedding models.</p>
  <span x-test-capability>embedding</span>
</a>
`;

const tagsHtml = `
<a href="/library/qwen3:latest" class="md:hidden flex flex-col space-y-[6px] group">
  <span>qwen3:latest</span>
  <span><span class="font-mono"> 500a1f067a9f</span> • 5.2GB • 40K context window</span>
</a>
<a href="/library/qwen3:4b" class="md:hidden flex flex-col space-y-[6px] group">
  <span>qwen3:4b</span>
  <span><span class="font-mono"> 359d7dd4bcda</span> • 2.5GB • 256K context window</span>
</a>
`;

test('builds Ollama official search and tags URLs', () => {
    assert.equal(buildOllamaSearchUrl({ query: 'Qwen3 Coder' }), 'https://ollama.com/search?q=Qwen3+Coder');
    assert.equal(buildOllamaSearchUrl({ query: '' }), 'https://ollama.com/library');
    assert.equal(buildOllamaTagsUrl('qwen3:4b'), 'https://ollama.com/library/qwen3/tags');
});

test('parses Ollama search HTML into model families', () => {
    const models = parseOllamaSearchHtml(searchHtml);
    assert.equal(models.length, 2);
    assert.equal(models[0].id, 'qwen3');
    assert.equal(models[0].description, 'Qwen3 generation models.');
    assert.deepEqual(models[0].capabilities, ['tools']);
    assert.deepEqual(models[0].sizes, ['0.6b', '4b']);
    assert.equal(models[1].fit.level, 'blocked');
});

test('parses Ollama tags HTML into pullable model IDs', () => {
    const tags = parseOllamaTagsHtml(tagsHtml, 'qwen3');
    assert.deepEqual(tags.map((tag) => tag.id), ['qwen3:latest', 'qwen3:4b']);
    assert.equal(tags[1].sizeText, '2.5GB');
    assert.equal(tags[1].contextWindow, '256K context');
});

test('expands Ollama search results into tag-level install choices', async () => {
    const fetchImpl = async (url) => {
        if (String(url).includes('/tags')) {
            return createHtmlResponse(tagsHtml);
        }
        return createHtmlResponse(searchHtml);
    };

    const result = await searchOllamaModelCatalog(
        { query: 'qwen', limit: 8 },
        { fetchImpl, allowNativeFallback: false }
    );

    assert.equal(result.ok, true);
    assert.equal(result.source, 'ollama');
    assert.equal(result.models.some((model) => model.id === 'qwen3:4b'), true);
    assert.equal(result.models.some((model) => model.id === 'qwen3-embedding'), false);
    assert.equal(result.sources[0].url, 'https://ollama.com/search?q=qwen');
});
