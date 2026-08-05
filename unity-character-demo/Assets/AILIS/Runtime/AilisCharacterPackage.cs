using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    [Serializable]
    public sealed class AilisCharacterPackageManifest
    {
        public string schema = "ailis.character-package.v2";
        public string id = "ailis-default";
        public string displayName = "AILIS";
        public string adapter = "vrm";
        public string model = "AILIS.vrm";
        public string prefabAsset = "";
        public float scale = 1f;
        public float positionX;
        public float positionY;
        public float positionZ;
        public AilisArtProfile art = new AilisArtProfile();
        public AilisRigProfile rig = new AilisRigProfile();
        public AilisBlendShapeChannel[] visemes = Array.Empty<AilisBlendShapeChannel>();
        public string[] blinkBlendShapeNames = Array.Empty<string>();
        public AilisVrmExpressionProfile vrmExpressionProfile =
            new AilisVrmExpressionProfile();
        public AilisExpressionDefinition[] expressions = Array.Empty<AilisExpressionDefinition>();
        public AilisMotionDefinition[] motions = Array.Empty<AilisMotionDefinition>();
    }

    [Serializable]
    public sealed class AilisBlendShapeChannel
    {
        public string id = "";
        public string[] blendShapeNames = Array.Empty<string>();
    }

    [Serializable]
    public sealed class AilisExpressionDefinition
    {
        public string id = "relaxed";
        public string driver = "animator-state";
        public string stateName = "";
        public int layerIndex = 1;
        public string[] blendShapeNames = Array.Empty<string>();
        public string[] semanticChannels = Array.Empty<string>();
        public float weight = 1f;
        public float transitionSeconds = 0.18f;
        public int priority;

        public float Score(IReadOnlyDictionary<string, float> expressionMix)
        {
            var bestWeight = 0f;
            foreach (var channel in semanticChannels ?? Array.Empty<string>())
            {
                if (!string.IsNullOrWhiteSpace(channel) &&
                    expressionMix.TryGetValue(channel, out var channelWeight))
                {
                    bestWeight = Mathf.Max(bestWeight, channelWeight);
                }
            }
            if (bestWeight <= 0.01f &&
                !string.IsNullOrWhiteSpace(id) &&
                expressionMix.TryGetValue(id, out var directWeight))
            {
                bestWeight = directWeight;
            }
            return bestWeight <= 0.01f
                ? 0f
                : bestWeight * 1000f + priority;
        }
    }

    public sealed class AilisExpressionSelection
    {
        public AilisExpressionDefinition Definition;
        public float Weight;
    }

    [Serializable]
    public sealed class AilisArtProfile
    {
        public string id = "soft-toon";
        public float cameraFieldOfView = 38f;
        public float cameraHeight = 1.3f;
        public float cameraDistance = 2.15f;
        public float cameraLookAtHeight = 1.18f;
        public string framingMode = "full-body";
        public float framingPadding = 1.14f;
        public float framingVerticalBias = 0.02f;
        public float ambientIntensity = 0.72f;
        public float keyLightIntensity = 0.92f;
        public float fillLightIntensity = 0.4f;
        public float rimLightIntensity = 0.52f;
    }

    [Serializable]
    public sealed class AilisRigProfile
    {
        public bool enabled = true;
        public float footGroundingWeight = 0.45f;
        public float handIkWeight;
        public float gazeWeight = 0.18f;
        public float groundOffset;
        public float groundProbeHeight = 0.24f;
        public float groundProbeDistance = 0.48f;
        public float groundContactDistance = 0.08f;
        public float groundingBlendSeconds = 0.12f;
        public int groundLayerMask = -1;
        public float gazeDistance = 2.4f;
        public float headAngleLimit = 28f;

        public void Normalize()
        {
            footGroundingWeight = Mathf.Clamp01(footGroundingWeight);
            handIkWeight = Mathf.Clamp01(handIkWeight);
            gazeWeight = Mathf.Clamp01(gazeWeight);
            groundOffset = Mathf.Clamp(groundOffset, -0.2f, 0.2f);
            groundProbeHeight = Mathf.Clamp(groundProbeHeight, 0.05f, 1f);
            groundProbeDistance = Mathf.Clamp(groundProbeDistance, 0.1f, 2f);
            groundContactDistance = Mathf.Clamp(groundContactDistance, 0.01f, 0.3f);
            groundingBlendSeconds = Mathf.Clamp(groundingBlendSeconds, 0.02f, 1f);
            gazeDistance = Mathf.Clamp(gazeDistance, 0.5f, 8f);
            headAngleLimit = Mathf.Clamp(headAngleLimit, 5f, 60f);
        }
    }

    [Serializable]
    public sealed class AilisMotionDefinition
    {
        public string id = "idle";
        public string displayName = "";
        public string sourceId = "";
        public string license = "";
        public string[] styleTags = Array.Empty<string>();
        public string file = "";
        public string stateName = "";
        public string bakedClipResource = "";
        public string performanceLayer = "";
        public string nativeLayerId = "";
        public string nativeParameter = "";
        public string nativeParameterType = "";
        public float nativeParameterValue;
        public float nativeResetValue;
        public bool loop = true;
        public float fallbackDurationSeconds = 2.5f;
        public float transitionSeconds = 0.2f;
        public int priority;
        public string compatibility = "approved";
        public string fallbackMotionId = "";
        public string[] collisionZones = Array.Empty<string>();
        public string[] gestureIntents = Array.Empty<string>();
        public string[] emotions = Array.Empty<string>();
        public string[] taskStates = Array.Empty<string>();

        public int Score(AilisPersonaSurface surface)
        {
            if (surface == null)
            {
                return 0;
            }

            var gestureScore = GetGestureMatchScore(surface);
            var taskMatched = Match(taskStates, surface.taskState);
            var emotionMatched = Match(emotions, surface.emotion);

            var score = 0;
            score += gestureScore;
            score += taskMatched ? 20 : 0;
            score += emotionMatched ? 10 : 0;
            return score == 0 ? 0 : score + priority;
        }

        public int GetGestureMatchScore(
            AilisPersonaSurface surface,
            int maximumScore = 100,
            int rankDecay = 8)
        {
            var intents = AilisPersonaSemantics.ResolveGestureIntents(surface);
            for (var rank = 0; rank < intents.Count; rank++)
            {
                if (Match(gestureIntents, intents[rank]))
                {
                    return Math.Max(1, maximumScore - rank * rankDecay);
                }
            }
            return 0;
        }

        public bool MatchesGestureIntent(string gestureIntent)
        {
            return Match(gestureIntents, gestureIntent);
        }

        public bool MatchesTaskState(string taskState)
        {
            return Match(taskStates, taskState);
        }

        public bool MatchesEmotion(string emotion)
        {
            return Match(emotions, emotion);
        }

        public bool IsApproved =>
            string.IsNullOrWhiteSpace(compatibility) ||
            string.Equals(
                compatibility,
                "approved",
                StringComparison.OrdinalIgnoreCase);

        public string ResolvePerformanceLayer()
        {
            var configured = (performanceLayer ?? "").Trim().ToLowerInvariant();
            if (configured == "base" ||
                configured == "additive" ||
                configured == "gesture" ||
                configured == "action")
            {
                return configured;
            }
            return loop ? "base" : "gesture";
        }

        private static bool Match(string[] candidates, string value)
        {
            if (candidates == null || string.IsNullOrWhiteSpace(value))
            {
                return false;
            }
            foreach (var candidate in candidates)
            {
                if (string.Equals(candidate, value, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }
    }

    public sealed class AilisCharacterPackage
    {
        private string _lastBaseMotionId = "";
        private string _lastOneShotMotionId = "";
        private string _lastExpressionId = "";
        private AilisVrmExpressionProfile _legacyExpressionProfile;

        public string ManifestPath { get; private set; }
        public string RootDirectory { get; private set; }
        public AilisCharacterPackageManifest Manifest { get; private set; }

        public string ModelPath => ResolvePath(Manifest.model);

        public static AilisCharacterPackage Load(
            string manifestPath,
            string fallbackModelPath,
            string fallbackMotionPath)
        {
            AilisCharacterPackageManifest manifest;
            var resolvedManifest = string.IsNullOrWhiteSpace(manifestPath)
                ? ""
                : Path.GetFullPath(manifestPath);
            if (!string.IsNullOrWhiteSpace(resolvedManifest) && File.Exists(resolvedManifest))
            {
                manifest = JsonUtility.FromJson<AilisCharacterPackageManifest>(
                    File.ReadAllText(resolvedManifest));
                if (manifest == null)
                {
                    throw new InvalidDataException("Character package manifest is invalid: " + resolvedManifest);
                }
                if (manifest.vrmExpressionProfile?.bindings?.Length > 0)
                {
                    try
                    {
                        AilisVrmExpressionProtocol.ValidateProfile(
                            manifest.vrmExpressionProfile);
                    }
                    catch (ArgumentException error)
                    {
                        throw new InvalidDataException(
                            "Character package VRM expression profile is invalid: " +
                            resolvedManifest,
                            error);
                    }
                }
            }
            else
            {
                manifest = CreateFallback(fallbackModelPath, fallbackMotionPath);
                resolvedManifest = Path.Combine(
                    Path.GetDirectoryName(Path.GetFullPath(fallbackModelPath)) ?? Application.streamingAssetsPath,
                    "ailis-character.json");
            }

            return new AilisCharacterPackage
            {
                ManifestPath = resolvedManifest,
                RootDirectory = Path.GetDirectoryName(resolvedManifest) ?? Application.streamingAssetsPath,
                Manifest = manifest
            };
        }

        public string ResolvePath(string relativeOrAbsolutePath)
        {
            if (string.IsNullOrWhiteSpace(relativeOrAbsolutePath))
            {
                return "";
            }
            return Path.GetFullPath(
                Path.IsPathRooted(relativeOrAbsolutePath)
                    ? relativeOrAbsolutePath
                    : Path.Combine(RootDirectory, relativeOrAbsolutePath));
        }

        public AilisMotionDefinition FindMotion(string motionId)
        {
            foreach (var motion in Manifest.motions ?? Array.Empty<AilisMotionDefinition>())
            {
                if (motion != null && string.Equals(motion.id, motionId, StringComparison.OrdinalIgnoreCase))
                {
                    return motion;
                }
            }
            return null;
        }

        public AilisVrmExpressionProfile GetVrmExpressionProfile()
        {
            if (Manifest.vrmExpressionProfile?.bindings?.Length > 0)
            {
                return Manifest.vrmExpressionProfile;
            }
            if (_legacyExpressionProfile != null)
            {
                return _legacyExpressionProfile;
            }

            var bindings = new List<AilisVrmExpressionBinding>();
            foreach (var expression in Manifest.expressions ??
                     Array.Empty<AilisExpressionDefinition>())
            {
                if (expression == null)
                {
                    continue;
                }

                var preset = AilisVrmExpressionProtocol.IsPreset(expression.id)
                    ? expression.id
                    : FindFirstVrmPreset(expression.semanticChannels);
                bindings.Add(new AilisVrmExpressionBinding
                {
                    id = expression.id,
                    preset = string.IsNullOrWhiteSpace(preset)
                        ? "custom"
                        : preset,
                    customName = string.IsNullOrWhiteSpace(preset)
                        ? expression.id
                        : "",
                    driver = expression.driver,
                    stateName = expression.stateName,
                    layerIndex = expression.layerIndex,
                    blendShapeNames = expression.blendShapeNames,
                    weight = expression.weight,
                    transitionSeconds = expression.transitionSeconds,
                    priority = expression.priority
                });
            }

            _legacyExpressionProfile = new AilisVrmExpressionProfile
            {
                bindings = bindings.ToArray()
            };
            return _legacyExpressionProfile;
        }

        public AilisVrmExpressionFrame ResolveExpressionFrame(
            AilisPersonaSurface surface)
        {
            return AilisVrmExpressionProtocol.Resolve(surface);
        }

        public AilisMotionDefinition SelectBaseMotion(AilisPersonaSurface surface)
        {
            var candidates = new List<AilisMotionDefinition>();
            var selectedScore = 0;
            foreach (var motion in Manifest.motions ?? Array.Empty<AilisMotionDefinition>())
            {
                if (motion == null || !motion.loop || !motion.IsApproved)
                {
                    continue;
                }
                var score = 0;
                score += motion.MatchesTaskState(surface?.taskState) ? 100 : 0;
                score += motion.MatchesEmotion(surface?.emotion) ? 20 : 0;
                score += motion.GetGestureMatchScore(surface, 40, 4);
                if (score > 0)
                {
                    score += motion.priority;
                }
                if (score > selectedScore)
                {
                    selectedScore = score;
                    candidates.Clear();
                    candidates.Add(motion);
                }
                else if (score > 0 && score == selectedScore)
                {
                    candidates.Add(motion);
                }
            }

            if (candidates.Count == 0)
            {
                foreach (var motion in Manifest.motions ?? Array.Empty<AilisMotionDefinition>())
                {
                    if (motion != null &&
                        motion.IsApproved &&
                        motion.loop &&
                        (motion.id.StartsWith("idle", StringComparison.OrdinalIgnoreCase) ||
                         motion.MatchesTaskState("idle") ||
                         motion.MatchesTaskState("listening")))
                    {
                        candidates.Add(motion);
                    }
                }
            }

            var selected = PickVariant(candidates, _lastBaseMotionId) ?? FindMotion("idle");
            _lastBaseMotionId = selected?.id ?? "";
            return selected;
        }

        public AilisMotionDefinition SelectOneShotMotion(AilisPersonaSurface surface)
        {
            var gestureIntents = AilisPersonaSemantics.ResolveGestureIntents(surface);
            if (gestureIntents.Count == 0)
            {
                return null;
            }

            var candidates = new List<AilisMotionDefinition>();
            var fallbackCandidates = new List<AilisMotionDefinition>();
            var selectedScore = int.MinValue;
            foreach (var motion in Manifest.motions ?? Array.Empty<AilisMotionDefinition>())
            {
                var gestureScore = motion?.GetGestureMatchScore(surface) ?? 0;
                if (motion == null ||
                    motion.loop ||
                    gestureScore <= 0)
                {
                    continue;
                }
                if (!motion.IsApproved)
                {
                    var fallback = FindMotion(motion.fallbackMotionId);
                    if (fallback != null &&
                        fallback.IsApproved &&
                        !fallbackCandidates.Contains(fallback))
                    {
                        fallbackCandidates.Add(fallback);
                    }
                    continue;
                }
                var motionScore = gestureScore + motion.priority;
                if (motionScore > selectedScore)
                {
                    selectedScore = motionScore;
                    candidates.Clear();
                }
                if (motionScore == selectedScore)
                {
                    candidates.Add(motion);
                }
            }

            var selected = PickVariant(candidates, _lastOneShotMotionId) ??
                           PickVariant(
                               fallbackCandidates,
                               _lastOneShotMotionId);
            _lastOneShotMotionId = selected?.id ?? "";
            return selected;
        }

        public AilisExpressionSelection SelectExpression(AilisPersonaSurface surface)
        {
            var expressionMix = AilisPersonaSemantics.CreateExpressionMix(surface);
            var candidates = new List<AilisExpressionDefinition>();
            var selectedScore = 0f;
            foreach (var expression in Manifest.expressions ?? Array.Empty<AilisExpressionDefinition>())
            {
                if (expression == null)
                {
                    continue;
                }
                var score = expression.Score(expressionMix);
                if (score > selectedScore + 0.001f)
                {
                    selectedScore = score;
                    candidates.Clear();
                    candidates.Add(expression);
                }
                else if (score > 0f && Mathf.Abs(score - selectedScore) <= 0.001f)
                {
                    candidates.Add(expression);
                }
            }

            var selected = PickVariant(candidates, _lastExpressionId);
            if (selected == null)
            {
                selected = FindExpression("relaxed") ?? FindExpression("neutral");
            }
            if (selected == null)
            {
                return null;
            }

            _lastExpressionId = selected.id ?? "";
            var channelWeight = Mathf.Max(0.18f, (selectedScore - selected.priority) / 1000f);
            var requestedIntensity = Mathf.Clamp(surface?.intensity ?? 0.35f, 0.1f, 1f);
            var selectedWeight = IsAnimatorStateExpression(selected)
                ? Mathf.Lerp(0.58f, 1f, requestedIntensity)
                : channelWeight;
            return new AilisExpressionSelection
            {
                Definition = selected,
                Weight = Mathf.Clamp01(selectedWeight * Mathf.Max(0.05f, selected.weight))
            };
        }

        private static bool IsAnimatorStateExpression(AilisExpressionDefinition expression)
        {
            return expression != null &&
                !string.Equals(
                    expression.driver,
                    "blendshape",
                    StringComparison.OrdinalIgnoreCase);
        }

        public AilisExpressionDefinition FindExpression(string expressionId)
        {
            foreach (var expression in Manifest.expressions ?? Array.Empty<AilisExpressionDefinition>())
            {
                if (expression != null &&
                    string.Equals(expression.id, expressionId, StringComparison.OrdinalIgnoreCase))
                {
                    return expression;
                }
            }
            return null;
        }

        private static string FindFirstVrmPreset(string[] channels)
        {
            foreach (var channel in channels ?? Array.Empty<string>())
            {
                if (AilisVrmExpressionProtocol.IsPreset(channel))
                {
                    return channel;
                }
            }
            return "";
        }

        private static T PickVariant<T>(List<T> candidates, string previousId) where T : class
        {
            if (candidates == null || candidates.Count == 0)
            {
                return null;
            }
            if (candidates.Count == 1)
            {
                return candidates[0];
            }

            var alternatives = new List<T>();
            foreach (var candidate in candidates)
            {
                var candidateId = candidate is AilisMotionDefinition motion
                    ? motion.id
                    : (candidate as AilisExpressionDefinition)?.id;
                if (!string.Equals(candidateId, previousId, StringComparison.OrdinalIgnoreCase))
                {
                    alternatives.Add(candidate);
                }
            }
            var pool = alternatives.Count > 0 ? alternatives : candidates;
            return pool[UnityEngine.Random.Range(0, pool.Count)];
        }

        private static AilisCharacterPackageManifest CreateFallback(
            string modelPath,
            string motionPath)
        {
            return new AilisCharacterPackageManifest
            {
                model = Path.GetFullPath(modelPath),
                motions = new[]
                {
                    new AilisMotionDefinition
                    {
                        id = "idle",
                        file = Path.GetFullPath(motionPath),
                        loop = true
                    }
                }
            };
        }
    }

    public static class AilisPersonaSemantics
    {
        public static List<string> ResolveGestureIntents(AilisPersonaSurface surface)
        {
            var resolved = new List<string>();
            AddUnique(resolved, ResolveGestureIntent(surface));
            foreach (var fallback in surface?.gestureFallbacks ?? Array.Empty<string>())
            {
                AddUnique(resolved, Normalize(fallback));
            }
            resolved.RemoveAll((intent) =>
                string.IsNullOrWhiteSpace(intent) ||
                string.Equals(intent, "none", StringComparison.OrdinalIgnoreCase));
            return resolved;
        }

        public static string ResolveGestureIntent(AilisPersonaSurface surface)
        {
            var explicitGesture = Normalize(surface?.gestureIntent);
            if (!string.IsNullOrWhiteSpace(explicitGesture) && explicitGesture != "none")
            {
                return explicitGesture;
            }

            switch (Normalize(surface?.taskState))
            {
                case "thinking":
                case "blocked":
                    return "thinking";
                case "working":
                    return "working";
                case "waiting_approval":
                    return "approval";
                case "happy_success":
                    return "success";
                case "apologizing":
                case "failed":
                    return "apologize";
                case "comforting":
                    return "comfort";
            }

            switch (Normalize(surface?.emotion))
            {
                case "happy":
                case "victory":
                    return "success";
                case "shy":
                case "love":
                    return "shy";
                case "sad":
                case "tired":
                case "comforting":
                    return "comfort";
                case "angry":
                case "jealous":
                    return "angry";
                case "surprised":
                    return "surprised";
                case "thinking":
                case "anxious":
                case "suspicious":
                    return "thinking";
                case "focused":
                case "serious":
                    return "working";
                default:
                    return explicitGesture;
            }
        }

        private static void AddUnique(ICollection<string> values, string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return;
            }
            foreach (var existing in values)
            {
                if (string.Equals(existing, value, StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }
            }
            values.Add(value);
        }

        public static Dictionary<string, float> CreateExpressionMix(AilisPersonaSurface surface)
        {
            var mix = new Dictionary<string, float>(StringComparer.OrdinalIgnoreCase);
            var intensity = Mathf.Clamp(surface?.intensity ?? 0.35f, 0.25f, 0.9f);
            var emotionWeight = 0.72f + intensity * 0.45f;
            AddEmotionMix(mix, Normalize(surface?.emotion), emotionWeight);
            AddTaskMix(mix, Normalize(surface?.taskState), 0.45f);

            var socialTone = Normalize(surface?.socialTone);
            if (socialTone == "soft" || socialTone == "quiet")
            {
                ScaleMix(mix, 0.85f);
            }
            return mix;
        }

        private static void AddEmotionMix(
            IDictionary<string, float> mix,
            string emotion,
            float weight)
        {
            switch (emotion)
            {
                case "neutral":
                    Add(mix, "relaxed", 0.18f, weight);
                    break;
                case "happy":
                    Add(mix, "happy", 0.34f, weight);
                    Add(mix, "relaxed", 0.24f, weight);
                    break;
                case "shy":
                    Add(mix, "shy", 0.42f, weight);
                    Add(mix, "happy", 0.16f, weight);
                    Add(mix, "relaxed", 0.24f, weight);
                    break;
                case "sad":
                    Add(mix, "sad", 0.48f, weight);
                    Add(mix, "relaxed", 0.16f, weight);
                    break;
                case "angry":
                    Add(mix, "angry", 0.46f, weight);
                    break;
                case "surprised":
                    Add(mix, "surprised", 0.48f, weight);
                    Add(mix, "relaxed", 0.1f, weight);
                    break;
                case "jealous":
                    Add(mix, "angry", 0.2f, weight);
                    Add(mix, "sad", 0.12f, weight);
                    break;
                case "bored":
                    Add(mix, "bored", 0.32f, weight);
                    Add(mix, "relaxed", 0.24f, weight);
                    break;
                case "serious":
                case "focused":
                    Add(mix, "focused", 0.4f, weight);
                    Add(mix, "relaxed", 0.22f, weight);
                    break;
                case "suspicious":
                    Add(mix, "thinking", 0.28f, weight);
                    Add(mix, "angry", 0.12f, weight);
                    break;
                case "victory":
                    Add(mix, "victory", 0.5f, weight);
                    Add(mix, "happy", 0.36f, weight);
                    break;
                case "sleep":
                    Add(mix, "tired", 0.36f, weight);
                    Add(mix, "relaxed", 0.28f, weight);
                    break;
                case "love":
                    Add(mix, "love", 0.44f, weight);
                    Add(mix, "happy", 0.18f, weight);
                    break;
                case "anxious":
                    Add(mix, "anxious", 0.38f, weight);
                    Add(mix, "sad", 0.2f, weight);
                    break;
                case "tired":
                    Add(mix, "tired", 0.36f, weight);
                    Add(mix, "sad", 0.2f, weight);
                    break;
                case "thinking":
                    Add(mix, "thinking", 0.4f, weight);
                    Add(mix, "relaxed", 0.2f, weight);
                    break;
                case "comforting":
                    Add(mix, "comforting", 0.44f, weight);
                    Add(mix, "relaxed", 0.3f, weight);
                    break;
                default:
                    Add(mix, "relaxed", 0.42f, weight);
                    break;
            }
        }

        private static void AddTaskMix(
            IDictionary<string, float> mix,
            string taskState,
            float weight)
        {
            switch (taskState)
            {
                case "thinking":
                    Add(mix, "thinking", 0.34f, weight);
                    break;
                case "working":
                    Add(mix, "focused", 0.36f, weight);
                    break;
                case "waiting_approval":
                    Add(mix, "thinking", 0.22f, weight);
                    Add(mix, "relaxed", 0.28f, weight);
                    break;
                case "happy_success":
                    Add(mix, "victory", 0.36f, weight);
                    Add(mix, "happy", 0.3f, weight);
                    break;
                case "apologizing":
                case "failed":
                    Add(mix, "sad", 0.28f, weight);
                    break;
                case "comforting":
                    Add(mix, "comforting", 0.4f, weight);
                    break;
                case "blocked":
                    Add(mix, "anxious", 0.3f, weight);
                    break;
                case "idle":
                case "listening":
                    Add(mix, "relaxed", 0.3f, weight);
                    break;
            }
        }

        private static void Add(
            IDictionary<string, float> mix,
            string channel,
            float value,
            float weight)
        {
            mix.TryGetValue(channel, out var current);
            mix[channel] = Mathf.Clamp01(current + value * weight);
        }

        private static void ScaleMix(IDictionary<string, float> mix, float scale)
        {
            var keys = new List<string>(mix.Keys);
            foreach (var key in keys)
            {
                mix[key] = Mathf.Clamp01(mix[key] * scale);
            }
        }

        private static string Normalize(string value)
        {
            return (value ?? "").Trim().ToLowerInvariant().Replace('-', '_').Replace(' ', '_');
        }
    }
}
