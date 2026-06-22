import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    buildHuggingFaceUrl,
    buildModelScopeUrl,
    searchVllmModelCatalog
} = require('../electron/vllm-model-catalog.cjs');

function createJsonResponse(payload, overrides = {}) {
    return {
        ok: true,
        status: 200,
        statusText: 'OK',
        async json() {
            return payload;
        },
        ...overrides
    };
}

test('builds live Hugging Face text-generation catalog URL', () => {
    const url = new URL(buildHuggingFaceUrl({ query: 'Qwen3', limit: 12 }));
    assert.equal(url.origin, 'https://huggingface.co');
    assert.equal(url.pathname, '/api/models');
    assert.equal(url.searchParams.get('search'), 'Qwen3');
    assert.equal(url.searchParams.get('pipeline_tag'), 'text-generation');
    assert.equal(url.searchParams.get('sort'), 'downloads');
    assert.equal(url.searchParams.get('limit'), '12');
});

test('builds live ModelScope OpenAPI catalog URL', () => {
    const url = new URL(buildModelScopeUrl({ query: 'DeepSeek', limit: 20 }));
    assert.equal(url.origin, 'https://modelscope.cn');
    assert.equal(url.pathname, '/openapi/v1/models');
    assert.equal(url.searchParams.get('search'), 'DeepSeek');
    assert.equal(url.searchParams.get('sort'), 'downloads');
    assert.equal(url.searchParams.get('filter.task'), 'text-generation');
    assert.equal(url.searchParams.get('page_size'), '20');
});

test('normalizes Hugging Face search results for vLLM selection', async () => {
    const calls = [];
    const fetchImpl = async (url) => {
        calls.push(String(url));
        return createJsonResponse([
            {
                id: 'Qwen/Qwen3-8B',
                downloads: 1000,
                likes: 50,
                tags: ['transformers', 'safetensors', 'text-generation', 'license:apache-2.0'],
                pipeline_tag: 'text-generation'
            },
            {
                id: 'Qwen/Qwen2.5-7B-Instruct',
                downloads: 900,
                likes: 40,
                tags: ['transformers', 'safetensors', 'chat', 'text-generation'],
                pipeline_tag: 'text-generation'
            }
        ]);
    };

    const result = await searchVllmModelCatalog(
        { source: 'hf', query: 'Qwen', limit: 5 },
        { fetchImpl }
    );

    assert.equal(result.ok, true);
    assert.equal(result.sources[0].source, 'hf');
    assert.equal(result.models[0].id, 'Qwen/Qwen2.5-7B-Instruct');
    assert.equal(result.models[0].source, 'hf');
    assert.equal(result.models[0].url, 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct');
    assert.equal(result.models[0].fit.level, 'good');
    assert.match(calls[0], /huggingface\.co\/api\/models/);
});

test('normalizes ModelScope OpenAPI search results for vLLM selection', async () => {
    const fetchImpl = async () => createJsonResponse({
        success: true,
        data: {
            total_count: 2,
            models: [
                {
                    id: 'Qwen/Qwen2.5-7B-Instruct',
                    display_name: '千问2.5-7B-Instruct',
                    downloads: 2000,
                    likes: 70,
                    license: 'apache-2.0',
                    tasks: ['text-generation'],
                    tags: ['library:transformer', 'library:safetensors', 'task:text-generation', 'custom_tag:chat'],
                    file_size: 15242807272,
                    params: 7615616512
                }
            ]
        }
    });

    const result = await searchVllmModelCatalog(
        { source: 'modelscope', query: 'Qwen', limit: 5 },
        { fetchImpl }
    );

    assert.equal(result.ok, true);
    assert.equal(result.sources[0].source, 'modelscope');
    assert.equal(result.sources[0].total, 2);
    assert.equal(result.models[0].source, 'modelscope');
    assert.equal(result.models[0].sourceLabel, 'ModelScope');
    assert.equal(result.models[0].sizeBytes, 15242807272);
    assert.equal(result.models[0].fit.level, 'good');
});

test('keeps working when one live catalog source fails', async () => {
    const fetchImpl = async (url) => {
        if (String(url).includes('huggingface.co')) {
            return createJsonResponse({}, {
                ok: false,
                status: 503,
                statusText: 'Service Unavailable'
            });
        }
        return createJsonResponse({
            data: {
                total_count: 1,
                models: [
                    {
                        id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
                        downloads: 3000,
                        likes: 90,
                        tasks: ['text-generation'],
                        tags: ['library:transformer', 'library:safetensors', 'task:text-generation', 'custom_tag:chat']
                    }
                ]
            }
        });
    };

    const result = await searchVllmModelCatalog(
        { source: 'both', query: 'DeepSeek', limit: 5 },
        { fetchImpl }
    );

    assert.equal(result.ok, true);
    assert.equal(result.models.length, 1);
    assert.equal(result.models[0].source, 'modelscope');
    assert.equal(result.errors.length, 1);
    assert.match(result.errors[0].message, /503/);
});
