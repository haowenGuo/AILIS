import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

import * as THREE from 'three';

import {
    DEFAULT_RENDER_PROFILE_ID,
    RENDER_PROFILE_IDS,
    getRenderProfile,
    listRenderProfiles,
    normalizeRenderProfileId
} from '../src/character/render-profiles.js';
import {
    MToonRenderProfileController,
    __renderProfileControllerInternals
} from '../src/character/mtoon-render-profile-controller.js';

const require = createRequire(import.meta.url);
const store = require('../electron/store.cjs');

class MockCloneableMToonMaterial extends THREE.MeshBasicMaterial {
    constructor({ name = 'Mock_MToon', outlineWidthFactor = 0.01 } = {}) {
        super({ color: '#ffffff' });
        this.name = name;
        this.shadeColorFactor = new THREE.Color('#111111');
        this.shadingShiftFactor = 0;
        this.shadingToonyFactor = 0.9;
        this.giEqualizationFactor = 0.9;
        this.parametricRimColorFactor = new THREE.Color('#000000');
        this.parametricRimLiftFactor = 0;
        this.parametricRimFresnelPowerFactor = 5;
        this.rimLightingMixFactor = 1;
        this.matcapFactor = new THREE.Color('#ffffff');
        this.outlineWidthFactor = outlineWidthFactor;
        this.outlineWidthMode = 'none';
        this.outlineColorFactor = new THREE.Color('#000000');
        this.outlineLightingMixFactor = 1;
        this.isOutline = false;
    }

    get isMToonMaterial() {
        return true;
    }

    clone() {
        const clone = new MockCloneableMToonMaterial({
            name: this.name,
            outlineWidthFactor: this.outlineWidthFactor
        });
        clone.copy(this);
        clone.shadeColorFactor.copy(this.shadeColorFactor);
        clone.shadingShiftFactor = this.shadingShiftFactor;
        clone.shadingToonyFactor = this.shadingToonyFactor;
        clone.giEqualizationFactor = this.giEqualizationFactor;
        clone.parametricRimColorFactor.copy(this.parametricRimColorFactor);
        clone.parametricRimLiftFactor = this.parametricRimLiftFactor;
        clone.parametricRimFresnelPowerFactor = this.parametricRimFresnelPowerFactor;
        clone.rimLightingMixFactor = this.rimLightingMixFactor;
        clone.matcapFactor.copy(this.matcapFactor);
        clone.outlineWidthFactor = this.outlineWidthFactor;
        clone.outlineWidthMode = this.outlineWidthMode;
        clone.outlineColorFactor.copy(this.outlineColorFactor);
        clone.outlineLightingMixFactor = this.outlineLightingMixFactor;
        clone.isOutline = this.isOutline;
        return clone;
    }
}

function createMockMToonMaterial(name, outlineWidthFactor = 0.01) {
    return {
        name,
        isMToonMaterial: true,
        shadeColorFactor: new THREE.Color('#111111'),
        shadingShiftFactor: 0,
        shadingToonyFactor: 0.9,
        giEqualizationFactor: 0.9,
        parametricRimColorFactor: new THREE.Color('#000000'),
        parametricRimLiftFactor: 0,
        parametricRimFresnelPowerFactor: 5,
        rimLightingMixFactor: 1,
        matcapFactor: new THREE.Color('#ffffff'),
        outlineWidthFactor,
        outlineWidthMode: 'none',
        outlineColorFactor: new THREE.Color('#000000'),
        outlineLightingMixFactor: 1,
        isOutline: false,
        needsUpdate: false
    };
}

test('AILIS exposes selectable render profiles including cel anime', () => {
    assert.deepEqual(RENDER_PROFILE_IDS, [
        'ailis_soft_anime_mtoon',
        'ailis_bright_companion_mtoon',
        'ailis_cinematic_rim_toon',
        'ailis_material_hybrid_npr',
        'ailis_hard_cel_mtoon'
    ]);
    assert.equal(listRenderProfiles().length, 5);
    assert.equal(normalizeRenderProfileId('unknown'), DEFAULT_RENDER_PROFILE_ID);

    for (const profileId of RENDER_PROFILE_IDS) {
        const profile = getRenderProfile(profileId);
        assert.equal(profile.id, profileId);
        assert.ok(profile.label);
        assert.ok(profile.lighting?.ambient?.color);
        assert.ok(profile.lighting?.key?.position);
        assert.ok(profile.materialDefaults?.shadeColor);
        assert.ok(profile.materialDefaults?.outlineWidth > 0);
        assert.ok(profile.materialGroups?.skin);
        assert.ok(profile.materialGroups?.hair);
        assert.ok(profile.materialGroups?.eyes);
    }
});

test('desktop store normalizes render profile preferences', () => {
    assert.deepEqual(store.RENDER_PROFILE_OPTIONS, RENDER_PROFILE_IDS);
    assert.equal(store.DEFAULT_RENDER_PROFILE_ID, DEFAULT_RENDER_PROFILE_ID);
    assert.equal(store.normalizeRenderProfileId('ailis_cinematic_rim_toon'), 'ailis_cinematic_rim_toon');
    assert.equal(store.normalizeRenderProfileId('ailis_hard_cel_mtoon'), 'ailis_hard_cel_mtoon');
    assert.equal(store.normalizeRenderProfileId('ailis_wuwa_cinematic'), 'ailis_cinematic_rim_toon');
    assert.equal(store.normalizeRenderProfileId('ailis_cel_anime_hard'), 'ailis_hard_cel_mtoon');
    assert.equal(store.normalizeRenderProfileId('bad-profile'), DEFAULT_RENDER_PROFILE_ID);
    assert.equal(store.DEFAULT_RENDER_OUTLINE_SCALE, 0.72);
    assert.equal(store.normalizeRenderOutlineScale(99), 1.2);
    assert.equal(store.normalizeRenderLightYawDeg(-99), -75);
    assert.equal(store.normalizeRenderShadowEnabled(false), false);
    assert.equal(store.DEFAULT_RENDER_RESOLUTION_SCALE, 2);
    assert.equal(store.normalizeRenderResolutionScale(0), 0.5);
    assert.equal(store.normalizeRenderResolutionScale(2.75), 2.75);
    assert.equal(store.normalizeRenderFpsLimit(28), 30);
    assert.equal(store.normalizeRenderFpsLimit(99), 60);
    assert.equal(store.normalizeRenderShadowQuality(2), 2);
    assert.equal(store.normalizeRenderOutlineEnabled(false), false);
    assert.equal(store.normalizeRenderAntialiasEnabled(false), false);
    assert.equal(store.normalizeState({}).preferences.renderResolutionScale, 2);
    assert.equal(store.normalizeState({
        version: 22,
        preferences: {
            renderResolutionScale: 3,
            renderFpsLimit: 2
        }
    }).preferences.renderResolutionScale, 2);
    assert.equal(store.normalizeState({
        version: 22,
        preferences: {
            renderResolutionScale: 3,
            renderFpsLimit: 2
        }
    }).preferences.renderFpsLimit, 45);
});

test('MToon render profile controller applies group-specific tuning and restores from original snapshot', () => {
    const skin = createMockMToonMaterial('AILIS_skin_face');
    const hair = createMockMToonMaterial('AILIS_hair_main');
    const root = {
        traverse(visitor) {
            visitor(root);
            visitor({ material: skin });
            visitor({ material: hair });
        }
    };

    const controller = new MToonRenderProfileController({
        vrm: {
            scene: root
        }
    });
    assert.equal(controller.bindVrm(controller.vrm), 2);
    assert.equal(__renderProfileControllerInternals.classifyMaterial(skin), 'skin');
    assert.equal(__renderProfileControllerInternals.classifyMaterial(hair), 'hair');

    const originalSkinShade = skin.shadeColorFactor.getHexString();
    const result = controller.apply('ailis_cinematic_rim_toon');
    assert.equal(result.id, 'ailis_cinematic_rim_toon');
    assert.equal(result.materialSummary.byGroup.skin, 1);
    assert.equal(result.materialSummary.byGroup.hair, 1);
    assert.notEqual(skin.shadeColorFactor.getHexString(), originalSkinShade);
    assert.equal(skin.needsUpdate, true);
    assert.ok(skin.outlineWidthFactor > 0);
    assert.equal(skin.outlineWidthMode, 'screenCoordinates');

    controller.restoreOriginal();
    assert.equal(skin.shadeColorFactor.getHexString(), originalSkinShade);
});

test('MToon render profile controller generates real outline material groups when the VRM has none', () => {
    const material = new MockCloneableMToonMaterial({
        name: 'AILIS_hair_main',
        outlineWidthFactor: 0
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    const root = new THREE.Group();
    root.add(mesh);

    const controller = new MToonRenderProfileController({
        vrm: {
            scene: root
        }
    });
    const result = controller.apply('ailis_hard_cel_mtoon');

    assert.equal(result.outlineSummary.generated, 1);
    assert.equal(Array.isArray(mesh.material), true);
    assert.equal(mesh.material.length, 2);
    assert.equal(mesh.material[1].isOutline, true);
    assert.equal(mesh.material[1].side, THREE.BackSide);
    assert.equal(mesh.material[0].outlineWidthMode, 'screenCoordinates');
    assert.ok(mesh.material[0].outlineWidthFactor >= 0.009);
    assert.ok(mesh.material[1].outlineWidthFactor >= 0.009);
    assert.ok(mesh.geometry.groups.some((group) => group.materialIndex === 1));
});

test('MToon render profile controller applies user look overrides to outline width only', () => {
    const soft = createMockMToonMaterial('AILIS_skin_face', 0);
    const root = {
        traverse(visitor) {
            visitor(root);
            visitor({ material: soft });
        }
    };

    const controller = new MToonRenderProfileController({
        vrm: {
            scene: root
        }
    });
    controller.bindVrm(controller.vrm);
    controller.apply('ailis_hard_cel_mtoon', {
        outlineScale: 0.5
    });

    assert.ok(soft.outlineWidthFactor <= 0.0041);
    assert.equal(soft.shadingShiftFactor, -0.055);
    assert.equal(soft.giEqualizationFactor, 0.72);
});

test('MToon render profile controller can disable outline for lower render cost', () => {
    const material = new MockCloneableMToonMaterial({
        name: 'AILIS_hair_main',
        outlineWidthFactor: 0.01
    });
    const mesh = {
        isMesh: true,
        geometry: { groups: [], index: { count: 3 }, attributes: { position: { count: 3 } }, addGroup() {} },
        material
    };
    const root = {
        traverse(visitor) {
            visitor(root);
            visitor(mesh);
        }
    };

    const controller = new MToonRenderProfileController({
        vrm: {
            scene: root
        }
    });
    controller.bindVrm(controller.vrm);
    controller.apply('ailis_hard_cel_mtoon', {
        outlineEnabled: false
    });

    assert.equal(material.outlineWidthFactor, 0);
    assert.equal(material.outlineWidthMode, 'none');
});

test('VRM model system exposes a safe default scene mood before model load', async () => {
    const { VRMModelSystem } = await import('../src/vrm-model-system.js');
    const vrmSystem = new VRMModelSystem();
    const mood = vrmSystem.getDefaultSceneMood();

    assert.equal(mood.state, 'idle');
    assert.equal(mood.camera.distance, 1.1);
    assert.equal(mood.background, '#f0f8ff');
});
