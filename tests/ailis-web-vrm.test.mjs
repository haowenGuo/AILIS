import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

import { parseGlb } from '../scripts/build-ailis-web-vrm.mjs';

const sourcePath = resolve('Resources', 'AILIS.vrm');
const webPath = resolve('Resources', 'AILIS.web.vrm');

function getBufferViewPayload(glb, bufferViewIndex) {
    const bufferView = glb.json.bufferViews[bufferViewIndex];
    return glb.binary.subarray(
        bufferView.byteOffset || 0,
        (bufferView.byteOffset || 0) + bufferView.byteLength
    );
}

function readPngSize(payload) {
    const pngSignature = '89504e470d0a1a0a';
    assert.equal(payload.subarray(0, 8).toString('hex'), pngSignature);
    return { width: payload.readUInt32BE(16), height: payload.readUInt32BE(20) };
}

test('web VRM keeps the VRM contract while reducing transfer payload', () => {
    const sourceBuffer = readFileSync(sourcePath);
    const webBuffer = readFileSync(webPath);
    const source = parseGlb(sourceBuffer);
    const web = parseGlb(webBuffer);

    assert.ok(webBuffer.length < sourceBuffer.length * 0.6, 'web model should be at least 40% smaller');
    for (const collection of ['nodes', 'meshes', 'materials', 'skins', 'accessors', 'bufferViews', 'images', 'textures']) {
        assert.equal(web.json[collection]?.length, source.json[collection]?.length, `${collection} indices must remain stable`);
    }
    for (const extensionName of ['VRMC_vrm', 'VRMC_springBone', 'VRMC_materials_mtoon']) {
        assert.deepEqual(web.json.extensions?.[extensionName], source.json.extensions?.[extensionName]);
    }
    assert.ok(web.json.extensionsUsed.includes('KHR_mesh_quantization'));
    assert.ok(web.json.extensionsRequired.includes('KHR_mesh_quantization'));

    const thumbnailIndex = web.json.extensions.VRMC_vrm.meta.thumbnailImage;
    const thumbnailPayload = getBufferViewPayload(web, web.json.images[thumbnailIndex].bufferView);
    assert.ok(thumbnailPayload.length < 100, 'the embedded 1.91 MB thumbnail should be replaced by a tiny placeholder');
    assert.deepEqual(readPngSize(thumbnailPayload), { width: 1, height: 1 });

    let originalLargeTextureCount = 0;
    for (let imageIndex = 0; imageIndex < web.json.images.length; imageIndex += 1) {
        const sourceImage = source.json.images[imageIndex];
        const webImage = web.json.images[imageIndex];
        assert.equal(webImage.bufferView, sourceImage.bufferView, 'image bufferView indices must remain stable');
        if (sourceImage.mimeType !== 'image/png') continue;
        const sourceSize = readPngSize(getBufferViewPayload(source, sourceImage.bufferView));
        const webSize = readPngSize(getBufferViewPayload(web, webImage.bufferView));
        if (Math.max(sourceSize.width, sourceSize.height) > 1024) originalLargeTextureCount += 1;
        assert.ok(Math.max(webSize.width, webSize.height) <= 1024, `image ${imageIndex} should be web-sized`);
    }
    assert.ok(originalLargeTextureCount >= 4);

    const quantizedAccessorCount = web.json.accessors.filter((accessor, index) => (
        accessor.componentType !== source.json.accessors[index].componentType
    )).length;
    assert.ok(quantizedAccessorCount >= 8, 'geometry attributes and indices should be quantized');
});
