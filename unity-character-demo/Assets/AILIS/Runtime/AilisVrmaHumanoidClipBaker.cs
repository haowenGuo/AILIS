#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    public static class AilisVrmaHumanoidClipBaker
    {
        private static readonly IReadOnlyDictionary<string, string> TraitPropertyMap =
            new Dictionary<string, string>
            {
                ["Left Thumb 1 Stretched"] = "LeftHand.Thumb.1 Stretched",
                ["Left Thumb Spread"] = "LeftHand.Thumb Spread",
                ["Left Thumb 2 Stretched"] = "LeftHand.Thumb.2 Stretched",
                ["Left Thumb 3 Stretched"] = "LeftHand.Thumb.3 Stretched",
                ["Left Index 1 Stretched"] = "LeftHand.Index.1 Stretched",
                ["Left Index Spread"] = "LeftHand.Index Spread",
                ["Left Index 2 Stretched"] = "LeftHand.Index.2 Stretched",
                ["Left Index 3 Stretched"] = "LeftHand.Index.3 Stretched",
                ["Left Middle 1 Stretched"] = "LeftHand.Middle.1 Stretched",
                ["Left Middle Spread"] = "LeftHand.Middle Spread",
                ["Left Middle 2 Stretched"] = "LeftHand.Middle.2 Stretched",
                ["Left Middle 3 Stretched"] = "LeftHand.Middle.3 Stretched",
                ["Left Ring 1 Stretched"] = "LeftHand.Ring.1 Stretched",
                ["Left Ring Spread"] = "LeftHand.Ring Spread",
                ["Left Ring 2 Stretched"] = "LeftHand.Ring.2 Stretched",
                ["Left Ring 3 Stretched"] = "LeftHand.Ring.3 Stretched",
                ["Left Little 1 Stretched"] = "LeftHand.Little.1 Stretched",
                ["Left Little Spread"] = "LeftHand.Little Spread",
                ["Left Little 2 Stretched"] = "LeftHand.Little.2 Stretched",
                ["Left Little 3 Stretched"] = "LeftHand.Little.3 Stretched",
                ["Right Thumb 1 Stretched"] = "RightHand.Thumb.1 Stretched",
                ["Right Thumb Spread"] = "RightHand.Thumb Spread",
                ["Right Thumb 2 Stretched"] = "RightHand.Thumb.2 Stretched",
                ["Right Thumb 3 Stretched"] = "RightHand.Thumb.3 Stretched",
                ["Right Index 1 Stretched"] = "RightHand.Index.1 Stretched",
                ["Right Index Spread"] = "RightHand.Index Spread",
                ["Right Index 2 Stretched"] = "RightHand.Index.2 Stretched",
                ["Right Index 3 Stretched"] = "RightHand.Index.3 Stretched",
                ["Right Middle 1 Stretched"] = "RightHand.Middle.1 Stretched",
                ["Right Middle Spread"] = "RightHand.Middle Spread",
                ["Right Middle 2 Stretched"] = "RightHand.Middle.2 Stretched",
                ["Right Middle 3 Stretched"] = "RightHand.Middle.3 Stretched",
                ["Right Ring 1 Stretched"] = "RightHand.Ring.1 Stretched",
                ["Right Ring Spread"] = "RightHand.Ring Spread",
                ["Right Ring 2 Stretched"] = "RightHand.Ring.2 Stretched",
                ["Right Ring 3 Stretched"] = "RightHand.Ring.3 Stretched",
                ["Right Little 1 Stretched"] = "RightHand.Little.1 Stretched",
                ["Right Little Spread"] = "RightHand.Little Spread",
                ["Right Little 2 Stretched"] = "RightHand.Little.2 Stretched",
                ["Right Little 3 Stretched"] = "RightHand.Little.3 Stretched"
            };

        public static AnimationClip Bake(
            GameObject sourceRoot,
            Animation sourceAnimation,
            string clipName,
            bool loop,
            float fallbackDurationSeconds)
        {
            if (sourceRoot == null || sourceAnimation == null)
            {
                throw new ArgumentNullException(nameof(sourceRoot));
            }

            var sourceAnimator = sourceRoot.GetComponent<Animator>();
            if (sourceAnimator == null ||
                sourceAnimator.avatar == null ||
                !sourceAnimator.avatar.isHuman)
            {
                throw new InvalidOperationException(
                    "VRMA source does not contain a Humanoid Animator.");
            }

            var sourceClip = ResolveSourceClip(sourceAnimation);
            if (sourceClip == null)
            {
                throw new InvalidOperationException(
                    "VRMA source does not contain an AnimationClip.");
            }

            var duration = sourceClip.length > 0.01f
                ? sourceClip.length
                : Mathf.Max(0.2f, fallbackDurationSeconds);
            var frameRate = Mathf.Clamp(
                sourceClip.frameRate > 1f ? sourceClip.frameRate : 30f,
                24f,
                60f);
            var frameCount = Mathf.Max(2, Mathf.CeilToInt(duration * frameRate) + 1);
            var rootCurves = CreateCurves(7);
            var muscleCurves = CreateCurves(HumanTrait.MuscleCount);
            var pose = new HumanPose();
            var firstPosition = Vector3.zero;
            var hasFirstPosition = false;

            sourceRoot.SetActive(true);
            sourceAnimation.Stop();
            sourceAnimator.enabled = false;
            using (var poseHandler =
                   new HumanPoseHandler(sourceAnimator.avatar, sourceAnimator.transform))
            {
                for (var frame = 0; frame < frameCount; frame += 1)
                {
                    var time = Mathf.Min(duration, frame / frameRate);
                    sourceClip.SampleAnimation(sourceRoot, Mathf.Min(time, sourceClip.length));
                    poseHandler.GetHumanPose(ref pose);
                    if (!hasFirstPosition)
                    {
                        firstPosition = pose.bodyPosition;
                        hasFirstPosition = true;
                    }

                    AddKey(rootCurves[0], time, firstPosition.x);
                    AddKey(rootCurves[1], time, pose.bodyPosition.y);
                    AddKey(rootCurves[2], time, firstPosition.z);
                    AddKey(rootCurves[3], time, pose.bodyRotation.x);
                    AddKey(rootCurves[4], time, pose.bodyRotation.y);
                    AddKey(rootCurves[5], time, pose.bodyRotation.z);
                    AddKey(rootCurves[6], time, pose.bodyRotation.w);
                    for (var muscle = 0;
                         muscle < HumanTrait.MuscleCount;
                         muscle += 1)
                    {
                        AddKey(muscleCurves[muscle], time, pose.muscles[muscle]);
                    }
                }
            }

            foreach (var curve in rootCurves)
            {
                ApplyLinearTangents(curve);
            }
            foreach (var curve in muscleCurves)
            {
                ApplyLinearTangents(curve);
            }

            var result = new AnimationClip
            {
                name = string.IsNullOrWhiteSpace(clipName)
                    ? sourceClip.name
                    : clipName,
                frameRate = frameRate,
                legacy = false,
                wrapMode = loop ? WrapMode.Loop : WrapMode.Once
            };
            SetAnimatorCurve(result, "RootT.x", rootCurves[0]);
            SetAnimatorCurve(result, "RootT.y", rootCurves[1]);
            SetAnimatorCurve(result, "RootT.z", rootCurves[2]);
            SetAnimatorCurve(result, "RootQ.x", rootCurves[3]);
            SetAnimatorCurve(result, "RootQ.y", rootCurves[4]);
            SetAnimatorCurve(result, "RootQ.z", rootCurves[5]);
            SetAnimatorCurve(result, "RootQ.w", rootCurves[6]);
            for (var muscle = 0; muscle < HumanTrait.MuscleCount; muscle += 1)
            {
                var propertyName = HumanTrait.MuscleName[muscle];
                if (TraitPropertyMap.TryGetValue(propertyName, out var mapped))
                {
                    propertyName = mapped;
                }
                SetAnimatorCurve(result, propertyName, muscleCurves[muscle]);
            }
            result.EnsureQuaternionContinuity();
            sourceRoot.SetActive(false);
            return result;
        }

        private static AnimationClip ResolveSourceClip(Animation animation)
        {
            if (animation.clip != null)
            {
                return animation.clip;
            }
            foreach (AnimationState state in animation)
            {
                if (state?.clip != null)
                {
                    return state.clip;
                }
            }
            return null;
        }

        private static AnimationCurve[] CreateCurves(int count)
        {
            var curves = new AnimationCurve[count];
            for (var index = 0; index < count; index += 1)
            {
                curves[index] = new AnimationCurve();
            }
            return curves;
        }

        private static void AddKey(AnimationCurve curve, float time, float value)
        {
            curve.AddKey(new Keyframe(time, value));
        }

        private static void ApplyLinearTangents(AnimationCurve curve)
        {
            if (curve == null || curve.length < 2)
            {
                return;
            }

            var keys = curve.keys;
            for (var index = 0; index < keys.Length; index += 1)
            {
                var incoming = index > 0
                    ? CalculateSlope(keys[index - 1], keys[index])
                    : CalculateSlope(keys[index], keys[index + 1]);
                var outgoing = index < keys.Length - 1
                    ? CalculateSlope(keys[index], keys[index + 1])
                    : CalculateSlope(keys[index - 1], keys[index]);
                keys[index].inTangent = incoming;
                keys[index].outTangent = outgoing;
                keys[index].weightedMode = WeightedMode.None;
            }
            curve.keys = keys;
        }

        private static float CalculateSlope(Keyframe from, Keyframe to)
        {
            var duration = to.time - from.time;
            return Mathf.Abs(duration) <= 0.000001f
                ? 0f
                : (to.value - from.value) / duration;
        }

        private static void SetAnimatorCurve(
            AnimationClip clip,
            string propertyName,
            AnimationCurve curve)
        {
            clip.SetCurve(string.Empty, typeof(Animator), propertyName, curve);
        }
    }
}
#endif
