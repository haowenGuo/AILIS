const PRODUCT_VARIANTS = Object.freeze({
    ailis: Object.freeze({
        id: 'ailis',
        productName: 'AILIS',
        appId: 'com.ailis.desktop',
        defaultCharacterRendererBackend: 'electron',
        characterRendererBackends: Object.freeze(['electron']),
        features: Object.freeze({
            unityCharacterRenderer: false
        })
    }),
    aigame: Object.freeze({
        id: 'aigame',
        productName: 'AIGAME',
        appId: 'com.ailis.aigame',
        defaultCharacterRendererBackend: 'unity',
        characterRendererBackends: Object.freeze(['unity', 'electron']),
        features: Object.freeze({
            unityCharacterRenderer: true
        })
    })
});

function normalizeProductVariantId(value) {
    return String(value || '').trim().toLowerCase() === 'aigame' ? 'aigame' : 'ailis';
}

function resolveProductVariant(options = {}) {
    const packageMetadata = options.packageMetadata || require('../package.json');
    const variantId = normalizeProductVariantId(
        options.variantId ||
        options.env?.AILIS_PRODUCT_VARIANT ||
        process.env.AILIS_PRODUCT_VARIANT ||
        packageMetadata.ailisProductVariant
    );
    return PRODUCT_VARIANTS[variantId];
}

function supportsCharacterRendererBackend(variant, backend) {
    const rendererBackend = String(backend || '').trim().toLowerCase();
    return Boolean(variant?.characterRendererBackends?.includes(rendererBackend));
}

function normalizeProductCharacterRendererBackend(value, variant = PRODUCT_VARIANTS.ailis) {
    const rendererBackend = String(value || '').trim().toLowerCase();
    if (supportsCharacterRendererBackend(variant, rendererBackend)) {
        return rendererBackend;
    }
    return variant.defaultCharacterRendererBackend;
}

module.exports = {
    PRODUCT_VARIANTS,
    normalizeProductCharacterRendererBackend,
    normalizeProductVariantId,
    resolveProductVariant,
    supportsCharacterRendererBackend
};
