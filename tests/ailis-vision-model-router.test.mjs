import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    callVisionModel,
    resolveVisionModelRoute
} = require('../electron/ailis-vision-model-router.cjs');
const {
    executeVisionTool
} = require('../electron/ailis-vision-tool.cjs');

const deepSeekSettings = {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com',
    apiKey: 'main-secret',
    model: 'deepseek-v4-flash'
};

const auxiliaryVisionSettings = {
    enabled: true,
    provider: 'openai-compatible',
    baseUrl: 'https://vision.example/v1',
    apiKey: 'vision-secret',
    model: 'qwen2.5-vl-7b'
};

test('vision router rejects a text-only main model when no auxiliary vision model exists', () => {
    const route = resolveVisionModelRoute({
        mainSettings: deepSeekSettings
    });

    assert.equal(route.ok, false);
    assert.equal(route.code, 'vision_not_configured');
    assert.equal(route.mainModel.provider, 'deepseek');
    assert.equal(route.mainModel.capabilities.vision, false);
});

test('vision router sends screenshots to the configured auxiliary model without exposing its key', async () => {
    let receivedSettings = null;
    const result = await callVisionModel({
        mainSettings: deepSeekSettings,
        auxiliarySettings: auxiliaryVisionSettings,
        request: { messages: [{ role: 'user', content: 'image request' }] },
        callLlm: async (settings) => {
            receivedSettings = settings;
            return {
                ok: true,
                content: '看到了桌面。',
                model: settings.model
            };
        }
    });

    assert.equal(receivedSettings, auxiliaryVisionSettings);
    assert.equal(result.ok, true);
    assert.equal(result.route.source, 'auxiliary');
    assert.equal(result.route.model, 'qwen2.5-vl-7b');
    assert.equal(Object.hasOwn(result.route, 'apiKey'), false);
    assert.equal(JSON.stringify(result.route).includes('vision-secret'), false);
});

test('vision router directly uses a vision-capable main model when no auxiliary model is configured', async () => {
    const mainSettings = {
        provider: 'openai-compatible',
        baseUrl: 'https://multimodal.example/v1',
        apiKey: 'main-vision-secret',
        model: 'gpt-4.1-mini'
    };
    let receivedSettings = null;
    const result = await callVisionModel({
        mainSettings,
        request: { messages: [] },
        callLlm: async (settings) => {
            receivedSettings = settings;
            return { ok: true, content: 'direct vision' };
        }
    });

    assert.equal(receivedSettings, mainSettings);
    assert.equal(result.route.source, 'main');
    assert.equal(result.route.model, 'gpt-4.1-mini');
});

test('explicit auxiliary vision configuration takes priority over a multimodal main model', () => {
    const route = resolveVisionModelRoute({
        mainSettings: {
            provider: 'openai-compatible',
            model: 'gpt-4.1-mini'
        },
        auxiliarySettings: auxiliaryVisionSettings
    });

    assert.equal(route.ok, true);
    assert.equal(route.source, 'auxiliary');
    assert.equal(route.model.model, 'qwen2.5-vl-7b');
});

test('vision tool returns auxiliary textual observation to a DeepSeek TaskAgent', async () => {
    let requestMessages = null;
    const result = await executeVisionTool(
        {
            action: 'capture_context',
            target: 'screen',
            question: '登录按钮在哪里？'
        },
        {
            planner: 'llm-agentic-executor',
            visionPermissionPolicy: 'manual'
        },
        {
            capture: async () => ({
                id: 'snapshot-1',
                type: 'vision',
                source: 'screen',
                dataUrl: 'data:image/png;base64,AAAA',
                imagePath: 'C:\\tmp\\screen.png',
                mimeType: 'image/png',
                width: 1280,
                height: 720
            }),
            getLlmSettings: () => deepSeekSettings,
            getVisionLlmSettings: () => auxiliaryVisionSettings,
            callLlm: async (settings, request) => {
                assert.equal(settings, auxiliaryVisionSettings);
                requestMessages = request.messages;
                return {
                    ok: true,
                    content: '登录按钮位于页面中央偏下。',
                    model: settings.model,
                    usage: { totalTokens: 25 }
                };
            }
        }
    );

    assert.equal(result.isError, undefined);
    assert.equal(result.details.routing.source, 'auxiliary');
    assert.equal(result.details.understanding, '登录按钮位于页面中央偏下。');
    assert.ok(
        requestMessages.some((message) =>
            Array.isArray(message.content) &&
            message.content.some((part) => part.type === 'image_url')
        )
    );
});

test('vision tool respects the feature-level disabled policy without capturing', async () => {
    let captures = 0;
    const result = await executeVisionTool(
        { action: 'capture_context', target: 'screen' },
        { planner: 'llm-agentic-executor', visionPermissionPolicy: 'disabled' },
        {
            capture: async () => {
                captures += 1;
                return { dataUrl: 'data:image/png;base64,AAAA' };
            }
        }
    );

    assert.equal(captures, 0);
    assert.equal(result.isError, true);
    assert.equal(result.details.status, 'blocked');
    assert.equal(result.details.reason, 'vision_disabled');
});

test('vision tool fails closed before a model call when DeepSeek has no auxiliary vision model', async () => {
    let calls = 0;
    let captures = 0;
    const result = await executeVisionTool(
        { action: 'capture_context', target: 'screen' },
        { visionPermissionPolicy: 'auto' },
        {
            capture: async () => {
                captures += 1;
                return {
                    dataUrl: 'data:image/png;base64,AAAA',
                    width: 1,
                    height: 1
                };
            },
            getLlmSettings: () => deepSeekSettings,
            getVisionLlmSettings: () => null,
            callLlm: async () => {
                calls += 1;
                return { ok: true, content: 'should not run' };
            }
        }
    );

    assert.equal(calls, 0);
    assert.equal(captures, 0);
    assert.equal(result.isError, true);
    assert.equal(result.details.status, 'vision_not_configured');
    assert.match(result.content[0].text, /独立视觉模型/);
});
