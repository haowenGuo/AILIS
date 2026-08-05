import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readSource = (relativePath) => readFileSync(
    new URL(`../${relativePath}`, import.meta.url),
    'utf8'
);

test('VRMA baking preserves continuous velocity between sampled poses', () => {
    const source = readSource(
        'unity-character-demo/Assets/AILIS/Runtime/AilisVrmaHumanoidClipBaker.cs'
    );

    assert.equal(source.includes('new Keyframe(time, value, 0f, 0f)'), false);
    assert.match(source, /ApplyLinearTangents\(curve\)/);
    assert.match(source, /CalculateSlope\(Keyframe from, Keyframe to\)/);
});

test('Unity performance graph uses interruption-safe eased character transitions', () => {
    const source = readSource(
        'unity-character-demo/Assets/AILIS/Runtime/AilisLayeredPerformanceController.cs'
    );

    assert.match(source, /new AnimationClipPlayable\[3\]/);
    assert.match(source, /AnimationMixerPlayable\.Create\(_graph, 3\)/);
    assert.match(source, /"base",\s*"Base"/);
    assert.match(source, /TransitionStartWeights/);
    assert.match(source, /SmootherStep\(amount\)/);
    assert.match(source, /ResolveMatchedStartTime/);
    assert.match(source, /Mathf\.SmoothDamp/);
});
