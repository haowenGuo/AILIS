const {
    callDesktopLlmProvider,
    getProviderCapabilities
} = require('./desktop-llm-provider.cjs');

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function describeSettings(settings = {}) {
    return {
        provider: normalizeString(settings.provider),
        model: normalizeString(settings.model),
        capabilities: getProviderCapabilities(settings)
    };
}

function hasAuxiliaryVisionModel(settings = null) {
    return Boolean(
        settings &&
        settings.enabled !== false &&
        normalizeString(settings.provider) &&
        normalizeString(settings.model)
    );
}

function resolveVisionModelRoute({ mainSettings = {}, auxiliarySettings = null } = {}) {
    if (hasAuxiliaryVisionModel(auxiliarySettings)) {
        return {
            ok: true,
            source: 'auxiliary',
            settings: auxiliarySettings,
            model: describeSettings(auxiliarySettings)
        };
    }

    const mainModel = describeSettings(mainSettings);
    if (mainModel.capabilities.vision === true) {
        return {
            ok: true,
            source: 'main',
            settings: mainSettings,
            model: mainModel
        };
    }

    return {
        ok: false,
        code: 'vision_not_configured',
        error: [
            '当前主模型不支持图片输入，且尚未配置独立视觉模型。',
            '请在 AILIS 控制面板的“视觉模型”区域启用一个支持图片输入的模型。'
        ].join(''),
        mainModel
    };
}

async function callVisionModel({
    mainSettings = {},
    auxiliarySettings = null,
    request = {},
    callLlm = callDesktopLlmProvider
} = {}) {
    const route = resolveVisionModelRoute({
        mainSettings,
        auxiliarySettings
    });
    if (!route.ok) {
        return route;
    }

    const response = await callLlm(route.settings, request);
    return {
        ...response,
        route: {
            source: route.source,
            provider: route.model.provider,
            model: route.model.model,
            capabilities: route.model.capabilities
        }
    };
}

module.exports = {
    callVisionModel,
    hasAuxiliaryVisionModel,
    resolveVisionModelRoute
};
