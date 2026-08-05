using System;
using System.Collections.Generic;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    [Serializable]
    public sealed class AilisVrmExpressionProfile
    {
        public string schema = "ailis.vrm-expression-profile.v1";
        public string standard = "VRM-1.0";
        public AilisVrmExpressionBinding[] bindings =
            Array.Empty<AilisVrmExpressionBinding>();
    }

    [Serializable]
    public sealed class AilisVrmMorphTargetBinding
    {
        public string path = "";
        public string blendShapeName = "";
        public float weight;
    }

    [Serializable]
    public sealed class AilisVrmExpressionBinding
    {
        public string id = "";
        public string preset = "custom";
        public string customName = "";
        public string driver = "animator-state";
        public string stateName = "";
        public int layerIndex = 1;
        public string[] blendShapeNames = Array.Empty<string>();
        public AilisVrmMorphTargetBinding[] morphTargetBindings =
            Array.Empty<AilisVrmMorphTargetBinding>();
        public float poseSampleTimeNormalized = -1f;
        public bool isBinary;
        public string overrideBlink = "none";
        public string overrideLookAt = "none";
        public string overrideMouth = "none";
        public float weight = 1f;
        public float transitionSeconds = 0.18f;
        public int priority;

        public string ExpressionKey =>
            AilisVrmExpressionProtocol.NormalizeExpressionKey(
                preset,
                customName);
    }

    public sealed class AilisVrmExpressionFrame
    {
        private readonly Dictionary<string, float> _weights =
            new Dictionary<string, float>(StringComparer.OrdinalIgnoreCase);

        public IReadOnlyDictionary<string, float> Weights => _weights;
        public string PrimaryKey { get; private set; } = "";

        public void Set(string expressionKey, float weight, bool primary = false)
        {
            var normalized =
                AilisVrmExpressionProtocol.NormalizeExpressionKey(expressionKey);
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return;
            }

            var clamped = Mathf.Clamp01(weight);
            if (!_weights.TryGetValue(normalized, out var existing) ||
                clamped > existing)
            {
                _weights[normalized] = clamped;
            }
            if (primary || string.IsNullOrWhiteSpace(PrimaryKey))
            {
                PrimaryKey = normalized;
            }
        }

        public float GetWeight(string expressionKey)
        {
            var normalized =
                AilisVrmExpressionProtocol.NormalizeExpressionKey(expressionKey);
            return _weights.TryGetValue(normalized, out var weight)
                ? weight
                : 0f;
        }
    }

    public static class AilisVrmExpressionProtocol
    {
        public const string ProfileSchema = "ailis.vrm-expression-profile.v1";
        public const string Standard = "VRM-1.0";

        private static readonly HashSet<string> PresetKeys =
            new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "happy",
                "angry",
                "sad",
                "relaxed",
                "surprised",
                "aa",
                "ih",
                "ou",
                "ee",
                "oh",
                "blink",
                "blinkLeft",
                "blinkRight",
                "lookUp",
                "lookDown",
                "lookLeft",
                "lookRight",
                "neutral"
            };

        public static AilisVrmExpressionFrame Resolve(AilisPersonaSurface surface)
        {
            var frame = new AilisVrmExpressionFrame();
            var emotion = Normalize(surface?.emotion);
            var intensity = Mathf.Clamp(surface?.intensity ?? 0.35f, 0.1f, 1f);
            var strong = Mathf.Lerp(0.46f, 1f, intensity);
            var medium = Mathf.Lerp(0.28f, 0.78f, intensity);
            var soft = Mathf.Lerp(0.12f, 0.42f, intensity);

            switch (emotion)
            {
                case "neutral":
                    frame.Set("neutral", strong, true);
                    frame.Set("relaxed", soft);
                    break;
                case "happy":
                    frame.Set("happy", strong, true);
                    frame.Set("relaxed", soft);
                    break;
                case "victory":
                    frame.Set("victory", strong, true);
                    frame.Set("happy", medium);
                    break;
                case "love":
                    frame.Set("love", strong, true);
                    frame.Set("happy", medium);
                    break;
                case "shy":
                    frame.Set("shy", strong, true);
                    frame.Set("happy", medium * 0.72f);
                    frame.Set("relaxed", soft);
                    break;
                case "sad":
                    frame.Set("sad", strong, true);
                    break;
                case "tired":
                case "sleep":
                    frame.Set("tired", strong, true);
                    frame.Set("sad", medium * 0.55f);
                    break;
                case "angry":
                    frame.Set("angry", strong, true);
                    break;
                case "jealous":
                    frame.Set("jealous", strong, true);
                    frame.Set("angry", medium);
                    break;
                case "surprised":
                    frame.Set("surprised", strong, true);
                    break;
                case "thinking":
                    frame.Set("thinking", strong, true);
                    frame.Set("relaxed", soft);
                    break;
                case "focused":
                case "serious":
                    frame.Set("focused", strong, true);
                    frame.Set("relaxed", soft);
                    break;
                case "suspicious":
                    frame.Set("suspicious", strong, true);
                    frame.Set("angry", soft * 0.55f);
                    break;
                case "bored":
                    frame.Set("bored", strong, true);
                    frame.Set("relaxed", soft);
                    break;
                case "anxious":
                    frame.Set("anxious", strong, true);
                    frame.Set("sad", medium * 0.6f);
                    break;
                case "comforting":
                    frame.Set("comforting", strong, true);
                    frame.Set("relaxed", medium * 0.65f);
                    break;
                case "relaxed":
                    frame.Set("relaxed", strong, true);
                    break;
                default:
                    if (!string.IsNullOrWhiteSpace(emotion))
                    {
                        frame.Set(emotion, strong, true);
                    }
                    frame.Set("relaxed", soft, string.IsNullOrWhiteSpace(emotion));
                    break;
            }

            ApplyTaskFallback(frame, Normalize(surface?.taskState), medium, soft);
            return frame;
        }

        public static bool IsPreset(string expressionKey)
        {
            return PresetKeys.Contains(
                NormalizeExpressionKey(expressionKey));
        }

        public static string NormalizeExpressionKey(
            string preset,
            string customName)
        {
            var normalizedPreset = NormalizeExpressionKey(preset);
            if (PresetKeys.Contains(normalizedPreset))
            {
                return normalizedPreset;
            }
            return NormalizeExpressionKey(customName);
        }

        public static string NormalizeExpressionKey(string value)
        {
            var normalized = (value ?? "").Trim();
            if (string.Equals(
                    normalized,
                    "custom",
                    StringComparison.OrdinalIgnoreCase))
            {
                return "";
            }
            return normalized;
        }

        public static float ResolveBindingWeight(
            AilisVrmExpressionBinding binding,
            AilisVrmExpressionFrame frame)
        {
            if (binding == null || frame == null)
            {
                return 0f;
            }

            var weight = frame.GetWeight(binding.ExpressionKey) *
                         Mathf.Clamp01(binding.weight);
            return binding.isBinary
                ? weight >= 0.5f ? 1f : 0f
                : Mathf.Clamp01(weight);
        }

        public static float ResolveOverrideRate(
            string overrideMode,
            float expressionWeight)
        {
            switch (Normalize(overrideMode))
            {
                case "block":
                    return expressionWeight > 0f ? 1f : 0f;
                case "blend":
                    return Mathf.Clamp01(expressionWeight);
                default:
                    return 0f;
            }
        }

        public static void ValidateProfile(AilisVrmExpressionProfile profile)
        {
            if (profile == null ||
                !string.Equals(
                    profile.schema,
                    ProfileSchema,
                    StringComparison.Ordinal) ||
                !string.Equals(
                    profile.standard,
                    Standard,
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException(
                    "Expression profile must declare the AILIS VRM 1.0 profile schema.");
            }

            var ids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var binding in profile.bindings ??
                     Array.Empty<AilisVrmExpressionBinding>())
            {
                if (binding == null ||
                    string.IsNullOrWhiteSpace(binding.id) ||
                    string.IsNullOrWhiteSpace(binding.ExpressionKey))
                {
                    throw new ArgumentException(
                        "Every VRM expression binding requires id and preset/customName.");
                }
                if (!ids.Add(binding.id))
                {
                    throw new ArgumentException(
                        "Duplicate VRM expression binding id: " + binding.id);
                }
                ValidateOverrideMode(binding.overrideBlink);
                ValidateOverrideMode(binding.overrideLookAt);
                ValidateOverrideMode(binding.overrideMouth);
            }
        }

        private static void ApplyTaskFallback(
            AilisVrmExpressionFrame frame,
            string taskState,
            float medium,
            float soft)
        {
            switch (taskState)
            {
                case "thinking":
                case "waiting_approval":
                    frame.Set("thinking", medium);
                    break;
                case "working":
                    frame.Set("focused", medium);
                    break;
                case "happy_success":
                    frame.Set("victory", medium);
                    frame.Set("happy", soft);
                    break;
                case "apologizing":
                case "failed":
                    frame.Set("sad", medium);
                    break;
                case "comforting":
                    frame.Set("comforting", medium);
                    break;
            }
        }

        private static void ValidateOverrideMode(string value)
        {
            var normalized = Normalize(value);
            if (normalized != "none" &&
                normalized != "block" &&
                normalized != "blend")
            {
                throw new ArgumentException(
                    "VRM expression override must be none, block, or blend.");
            }
        }

        private static string Normalize(string value)
        {
            return (value ?? "").Trim().ToLowerInvariant();
        }
    }
}
