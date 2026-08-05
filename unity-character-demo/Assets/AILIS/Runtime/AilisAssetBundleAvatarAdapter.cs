using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    // FBX and unitypackage assets are editor formats. This adapter consumes the
    // runtime-safe AssetBundle produced from either source format.
    public sealed class AilisAssetBundleAvatarAdapter : MonoBehaviour, IAilisAvatarAdapter
    {
        private sealed class VisemeBinding
        {
            public SkinnedMeshRenderer Renderer;
            public int Index;
            public float Weight = 100f;
        }

        private sealed class AnimatorExpressionSelection
        {
            public AilisVrmExpressionBinding Binding;
            public float Weight;
        }

        private readonly Dictionary<string, List<VisemeBinding>> _visemes =
            new Dictionary<string, List<VisemeBinding>>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, List<VisemeBinding>> _expressions =
            new Dictionary<string, List<VisemeBinding>>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, float> _visemeValues =
            new Dictionary<string, float>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, float> _expressionTargets =
            new Dictionary<string, float>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, float> _expressionValues =
            new Dictionary<string, float>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<SkinnedMeshRenderer, Dictionary<int, float>>
            _expressionBaseWeights =
                new Dictionary<SkinnedMeshRenderer, Dictionary<int, float>>();
        private readonly Dictionary<int, float> _expressionLayerTargets =
            new Dictionary<int, float>();
        private readonly Dictionary<int, float> _expressionLayerValues =
            new Dictionary<int, float>();
        private readonly Dictionary<string, AnimationClip> _bakedMotionClips =
            new Dictionary<string, AnimationClip>(
                StringComparer.OrdinalIgnoreCase);
        private readonly List<VisemeBinding> _blinkBindings = new List<VisemeBinding>();
        private AilisCharacterPackage _package;
        private AssetBundle _bundle;
        private GameObject _instance;
        private Animator _animator;
        private AilisChatdollKitPerformanceBridge _performanceBridge;
        private AilisNativePlayableLayerDriver _nativePlayableLayers;
        private AilisPersonaSurface _surface = new AilisPersonaSurface();
        private AilisLipFrame _lip;
        private float _lipUntil;
        private float _surfaceSpeechUntil;
        private float _speechPhase;
        private float _nextBlinkAt;
        private float _blinkStartedAt = -1f;
        private float _expressionHoldUntil = float.PositiveInfinity;
        private bool _expressionCanExpire;
        private bool _expressionResetApplied;
        private readonly Dictionary<int, string> _activeAnimatorExpressionIds =
            new Dictionary<int, string>();
        private float _blinkOverrideRate;
        private float _lookAtOverrideRate;
        private float _mouthOverrideRate;
        private bool _applicationIsQuitting;

        public string AdapterId => "asset-bundle";
        public string Status { get; private set; } = "not_loaded";
        public bool IsLoaded => _instance != null;

        public static void RegisterAdapter()
        {
            AilisAvatarAdapterRegistry.Register(
                "asset-bundle",
                host => host.AddComponent<AilisAssetBundleAvatarAdapter>());
        }

        public Task LoadAsync(AilisCharacterPackage package)
        {
            _package = package ?? throw new ArgumentNullException(nameof(package));
            var bundlePath = package.ModelPath;
            if (!File.Exists(bundlePath))
            {
                throw new FileNotFoundException("Character AssetBundle was not found.", bundlePath);
            }

            Status = "loading_asset_bundle";
            _bundle = AssetBundle.LoadFromFile(bundlePath);
            if (_bundle == null)
            {
                throw new InvalidDataException("Unity could not load the character AssetBundle: " + bundlePath);
            }

            var assetName = package.Manifest.prefabAsset;
            GameObject prefab = null;
            if (!string.IsNullOrWhiteSpace(assetName))
            {
                prefab = _bundle.LoadAsset<GameObject>(assetName);
            }
            if (prefab == null)
            {
                var names = _bundle.GetAllAssetNames();
                foreach (var name in names)
                {
                    prefab = _bundle.LoadAsset<GameObject>(name);
                    if (prefab != null)
                    {
                        break;
                    }
                }
            }
            if (prefab == null)
            {
                throw new InvalidDataException("Character AssetBundle contains no GameObject prefab.");
            }

            _instance = Instantiate(prefab, transform);
            _instance.name = package.Manifest.displayName;
            _instance.transform.localPosition = new Vector3(
                package.Manifest.positionX,
                package.Manifest.positionY,
                package.Manifest.positionZ);
            _instance.transform.localScale = Vector3.one * Mathf.Max(0.01f, package.Manifest.scale);
            _animator = _instance.GetComponentInChildren<Animator>();
            IndexBlendShapes(
                package.Manifest,
                package.GetVrmExpressionProfile());
            ScheduleNextBlink();
            var nativeLayerSet =
                _instance.GetComponentInChildren<
                    AilisNativePlayableLayerSet>(true);
            if (nativeLayerSet != null)
            {
                _nativePlayableLayers =
                    GetComponent<AilisNativePlayableLayerDriver>() ??
                    gameObject.AddComponent<
                        AilisNativePlayableLayerDriver>();
                if (!_nativePlayableLayers.Configure(
                        _animator,
                        nativeLayerSet))
                {
                    Debug.LogWarning(
                        "[AILIS Native Animation] Native Playable Layers " +
                        "could not start: " +
                        _nativePlayableLayers.Status);
                }
            }
            if (_nativePlayableLayers?.IsReady != true)
            {
                IndexExpressionLayers(package.GetVrmExpressionProfile());
            }
            if (_nativePlayableLayers?.IsReady != true)
            {
                _performanceBridge =
                    GetComponent<AilisChatdollKitPerformanceBridge>() ??
                    gameObject.AddComponent<
                        AilisChatdollKitPerformanceBridge>();
                if (!_performanceBridge.Configure(_instance, package))
                {
                    Debug.LogWarning(
                        "[AILIS ChatdollKit] Falling back to the built-in " +
                        "motion driver: " +
                        _performanceBridge.Status);
                }
            }
            var renderers = _instance.GetComponentsInChildren<Renderer>(true);
            var enabledRenderers = 0;
            foreach (var renderer in renderers)
            {
                if (renderer.enabled && renderer.gameObject.activeInHierarchy)
                {
                    enabledRenderers++;
                }
            }
            if (TryGetWorldBounds(out var loadedBounds))
            {
                Debug.Log(
                    "[AILIS Renderer] Avatar geometry: renderers=" +
                    renderers.Length +
                    ", enabled=" +
                    enabledRenderers +
                    ", center=" +
                    loadedBounds.center.ToString("F3") +
                    ", size=" +
                    loadedBounds.size.ToString("F3") +
                    ", root=" +
                    _instance.transform.position.ToString("F3"));
            }
            else
            {
                Debug.LogWarning(
                    "[AILIS Renderer] Avatar geometry has no enabled Renderer bounds: total=" +
                    renderers.Length +
                    ", enabled=" +
                    enabledRenderers);
            }
            Status = "ready";
            Debug.Log("[AILIS Renderer] AssetBundle character ready: " + bundlePath);
            return Task.CompletedTask;
        }

        public void ApplySurface(AilisPersonaSurface surface)
        {
            _surface = surface ?? new AilisPersonaSurface();
            _nativePlayableLayers?.ApplySurface(_surface);
            _performanceBridge?.ApplySurface(_surface);
            ApplyExpressionFrame(_package?.ResolveExpressionFrame(_surface));
            ConfigureExpressionLifetime(_surface.durationHint);
            if (!string.IsNullOrWhiteSpace(_surface.speechText))
            {
                var estimated = _surface.speechDurationSeconds > 0f
                    ? _surface.speechDurationSeconds
                    : Mathf.Clamp(_surface.speechText.Length * 0.075f, 1.2f, 18f);
                _surfaceSpeechUntil = Time.unscaledTime + estimated;
            }
        }

        public void ApplyLip(AilisLipFrame frame)
        {
            _lip = frame;
            _lipUntil = Time.unscaledTime + Mathf.Clamp(frame?.durationSeconds ?? 0.12f, 0.03f, 3f);
            if (frame == null || frame.weight <= 0.001f)
            {
                _surface.speechEnergy = 0f;
                _surface.speechText = "";
                _surface.speechDurationSeconds = 0f;
                _surfaceSpeechUntil = 0f;
            }
        }

        public async Task<bool> PlayMotionAsync(AilisMotionDefinition motion)
        {
            if (_animator == null || motion == null)
            {
                return false;
            }
            if (_nativePlayableLayers?.IsReady == true &&
                !string.IsNullOrWhiteSpace(motion.bakedClipResource))
            {
                var clip = GetBakedMotionClip(motion);
                if (clip != null &&
                    await _nativePlayableLayers.PlayExternalMotionAsync(
                        motion,
                        clip))
                {
                    Status = "ready:external:" + motion.id;
                    return true;
                }
            }
            if (_nativePlayableLayers?.IsReady == true &&
                await _nativePlayableLayers.PlayMotionAsync(motion))
            {
                Status = "ready:native:" + motion.id;
                return true;
            }
            if (_performanceBridge != null &&
                await _performanceBridge.PlayMotionAsync(motion))
            {
                Status = "ready:" + motion.id;
                return true;
            }
            var stateName = string.IsNullOrWhiteSpace(motion.stateName) ? motion.id : motion.stateName;
            var stateHash = Animator.StringToHash(stateName);
            if (!_animator.HasState(0, stateHash))
            {
                Debug.LogWarning("[AILIS Renderer] Animator state is missing: " + stateName);
                return false;
            }
            _animator.CrossFade(
                stateHash,
                Mathf.Clamp(motion.transitionSeconds, 0.04f, 1.2f),
                0,
                0f);
            Status = "ready:" + motion.id;
            Debug.Log("[AILIS Renderer] Animator state started: " + stateName);
            return true;
        }

        private AnimationClip GetBakedMotionClip(
            AilisMotionDefinition motion)
        {
            var resourcePath =
                (motion?.bakedClipResource ?? "").Trim();
            if (string.IsNullOrWhiteSpace(resourcePath))
            {
                return null;
            }
            if (_bakedMotionClips.TryGetValue(
                    resourcePath,
                    out var cached))
            {
                return cached;
            }
            var clip = Resources.Load<AnimationClip>(resourcePath);
            if (clip == null)
            {
                Debug.LogWarning(
                    "[AILIS Native Animation] Baked Humanoid clip is " +
                    "missing: " +
                    resourcePath);
                return null;
            }
            _bakedMotionClips[resourcePath] = clip;
            return clip;
        }

        public Vector3 GetBubbleAnchorWorldPosition()
        {
            if (_animator != null && _animator.isHuman)
            {
                var head = _animator.GetBoneTransform(HumanBodyBones.Head);
                if (head != null)
                {
                    return head.position + Vector3.up * 0.28f;
                }
            }
            return _instance != null
                ? _instance.transform.position + Vector3.up * 1.8f
                : transform.position + Vector3.up * 1.8f;
        }

        public bool TryGetWorldBounds(out Bounds bounds)
        {
            bounds = default;
            if (_instance == null)
            {
                return false;
            }
            var renderers = _instance.GetComponentsInChildren<Renderer>(true);
            var initialized = false;
            foreach (var renderer in renderers)
            {
                if (!renderer.enabled || !renderer.gameObject.activeInHierarchy)
                {
                    continue;
                }
                if (!initialized)
                {
                    bounds = renderer.bounds;
                    initialized = true;
                }
                else
                {
                    bounds.Encapsulate(renderer.bounds);
                }
            }
            return initialized;
        }

        private void LateUpdate()
        {
            if (_instance == null)
            {
                return;
            }
            UpdateExpressionLifetime();
            UpdateExpressionLayers();
            UpdateBlendShapeExpressions();

            var viseme = "aa";
            var weight = 0f;
            if (_lip != null && Time.unscaledTime <= _lipUntil)
            {
                weight = Mathf.Clamp01(_lip.weight);
                viseme = string.Equals(
                    _lip.mode,
                    "viseme",
                    StringComparison.OrdinalIgnoreCase)
                    ? NormalizeViseme(_lip.viseme)
                    : "aa";
            }
            else
            {
                var energy = Mathf.Clamp01(_surface.speechEnergy);
                if (energy <= 0.01f && Time.unscaledTime <= _surfaceSpeechUntil)
                {
                    energy = 0.42f;
                }
                _speechPhase += Time.deltaTime * Mathf.Lerp(7f, 13f, energy);
                weight = energy > 0.01f
                    ? (0.2f + 0.45f * (Mathf.Sin(_speechPhase) * 0.5f + 0.5f)) * energy
                    : 0f;
                viseme = "aa";
            }
            ApplyViseme(viseme, weight);
            if (_performanceBridge == null || !_performanceBridge.OwnsBlink)
            {
                UpdateBlink();
            }
        }

        private void IndexBlendShapes(
            AilisCharacterPackageManifest manifest,
            AilisVrmExpressionProfile expressionProfile)
        {
            foreach (var renderer in _instance.GetComponentsInChildren<SkinnedMeshRenderer>(true))
            {
                var mesh = renderer.sharedMesh;
                if (mesh == null)
                {
                    continue;
                }
                var rendererPath = GetRelativePath(renderer.transform, _instance.transform);
                for (var index = 0; index < mesh.blendShapeCount; index += 1)
                {
                    var blendShapeName = mesh.GetBlendShapeName(index);
                    var viseme = FindConfiguredChannel(manifest.visemes, blendShapeName);
                    if (string.IsNullOrWhiteSpace(viseme))
                    {
                        viseme = InferViseme(blendShapeName);
                    }
                    if (!string.IsNullOrWhiteSpace(viseme))
                    {
                        if (!_visemes.TryGetValue(viseme, out var bindings))
                        {
                            bindings = new List<VisemeBinding>();
                            _visemes[viseme] = bindings;
                        }
                        bindings.Add(new VisemeBinding { Renderer = renderer, Index = index });
                    }

                    if (MatchesAny(blendShapeName, manifest.blinkBlendShapeNames))
                    {
                        _blinkBindings.Add(new VisemeBinding
                        {
                            Renderer = renderer,
                            Index = index
                        });
                    }

                    foreach (var expression in expressionProfile?.bindings ??
                             Array.Empty<AilisVrmExpressionBinding>())
                    {
                        if (expression == null || !IsBlendShapeExpression(expression))
                        {
                            continue;
                        }
                        var authoredWeight = ResolveMorphTargetWeight(
                            expression,
                            rendererPath,
                            blendShapeName);
                        if (authoredWeight <= 0f)
                        {
                            continue;
                        }
                        if (!_expressions.TryGetValue(expression.id, out var expressionBindings))
                        {
                            expressionBindings = new List<VisemeBinding>();
                            _expressions[expression.id] = expressionBindings;
                        }
                        expressionBindings.Add(new VisemeBinding
                        {
                            Renderer = renderer,
                            Index = index,
                            Weight = authoredWeight
                        });
                        _expressionTargets[expression.id] = 0f;
                        _expressionValues[expression.id] = 0f;
                    }
                }
            }

            foreach (var expression in expressionProfile?.bindings ??
                     Array.Empty<AilisVrmExpressionBinding>())
            {
                if (expression == null || !IsBlendShapeExpression(expression))
                {
                    continue;
                }
                if (_expressions.TryGetValue(
                        expression.id,
                        out var indexedBindings) &&
                    indexedBindings.Count > 0)
                {
                    Debug.Log(
                        "[AILIS Renderer] VRM morph expression indexed: " +
                        expression.ExpressionKey + " targets=" +
                        indexedBindings.Count);
                }
                else
                {
                    Debug.LogWarning(
                        "[AILIS Renderer] VRM morph expression has no matching " +
                        "runtime targets: " + expression.ExpressionKey);
                }
            }
        }

        private static float ResolveMorphTargetWeight(
            AilisVrmExpressionBinding expression,
            string rendererPath,
            string blendShapeName)
        {
            if (expression?.morphTargetBindings?.Length > 0)
            {
                var normalizedPath = NormalizePath(rendererPath);
                var normalizedName = NormalizeBlendShapeName(blendShapeName);
                foreach (var target in expression.morphTargetBindings)
                {
                    if (target != null &&
                        NormalizePath(target.path) == normalizedPath &&
                        NormalizeBlendShapeName(target.blendShapeName) == normalizedName)
                    {
                        return Mathf.Clamp(target.weight, 0f, 100f);
                    }
                }
                return 0f;
            }

            return MatchesAny(blendShapeName, expression?.blendShapeNames)
                ? 100f
                : 0f;
        }

        private static string GetRelativePath(Transform target, Transform root)
        {
            if (target == null || root == null || target == root)
            {
                return "";
            }

            var parts = new List<string>();
            var cursor = target;
            while (cursor != null && cursor != root)
            {
                parts.Add(cursor.name);
                cursor = cursor.parent;
            }
            if (cursor != root)
            {
                return "";
            }
            parts.Reverse();
            return string.Join("/", parts);
        }

        private static string NormalizePath(string value)
        {
            return (value ?? "")
                .Trim()
                .Replace('\\', '/')
                .Trim('/');
        }

        private void IndexExpressionLayers(
            AilisVrmExpressionProfile expressionProfile)
        {
            foreach (var expression in expressionProfile?.bindings ??
                     Array.Empty<AilisVrmExpressionBinding>())
            {
                if (expression == null || IsBlendShapeExpression(expression))
                {
                    continue;
                }
                if (expression.layerIndex < 0 ||
                    _animator == null ||
                    expression.layerIndex >= _animator.layerCount)
                {
                    Debug.LogWarning(
                        "[AILIS Renderer] Expression layer is unavailable: " +
                        expression.id + " -> " + expression.layerIndex);
                    continue;
                }
                _expressionLayerTargets[expression.layerIndex] = 0f;
                _expressionLayerValues[expression.layerIndex] =
                    _animator.GetLayerWeight(expression.layerIndex);
            }
        }

        private static string FindConfiguredChannel(
            AilisBlendShapeChannel[] channels,
            string blendShapeName)
        {
            foreach (var channel in channels ?? Array.Empty<AilisBlendShapeChannel>())
            {
                if (channel != null && MatchesAny(blendShapeName, channel.blendShapeNames))
                {
                    return NormalizeViseme(channel.id);
                }
            }
            return "";
        }

        private static bool MatchesAny(string actualName, string[] configuredNames)
        {
            var actual = NormalizeBlendShapeName(actualName);
            foreach (var configuredName in configuredNames ?? Array.Empty<string>())
            {
                var configured = NormalizeBlendShapeName(configuredName);
                if (!string.IsNullOrWhiteSpace(configured) &&
                    (actual == configured || actual.EndsWith("." + configured)))
                {
                    return true;
                }
            }
            return false;
        }

        private static string NormalizeBlendShapeName(string value)
        {
            return (value ?? "").Trim().Replace('\\', '/').ToLowerInvariant();
        }

        private void ApplyViseme(string viseme, float weight)
        {
            weight *= 1f - Mathf.Clamp01(_mouthOverrideRate);
            var alpha = GetSmoothingAlpha(Time.unscaledDeltaTime, 20f);
            foreach (var pair in _visemes)
            {
                var target = string.Equals(pair.Key, viseme, StringComparison.OrdinalIgnoreCase)
                    ? weight * 100f
                    : 0f;
                _visemeValues.TryGetValue(pair.Key, out var current);
                var next = current + (target - current) * alpha;
                _visemeValues[pair.Key] = next;
                foreach (var binding in pair.Value)
                {
                    binding.Renderer.SetBlendShapeWeight(
                        binding.Index,
                        Mathf.Max(
                            GetExpressionBaseWeight(binding),
                            next));
                }
            }
        }

        private void ApplyExpressionFrame(AilisVrmExpressionFrame frame)
        {
            foreach (var key in new List<string>(_expressionTargets.Keys))
            {
                _expressionTargets[key] = 0f;
            }
            foreach (var layer in new List<int>(_expressionLayerTargets.Keys))
            {
                _expressionLayerTargets[layer] = 0f;
            }

            _blinkOverrideRate = 0f;
            _lookAtOverrideRate = 0f;
            _mouthOverrideRate = 0f;
            if (frame == null)
            {
                return;
            }

            var animatorSelections =
                new Dictionary<int, AnimatorExpressionSelection>();
            foreach (var expression in _package
                         ?.GetVrmExpressionProfile()
                         ?.bindings ??
                     Array.Empty<AilisVrmExpressionBinding>())
            {
                if (expression == null)
                {
                    continue;
                }

                var targetWeight =
                    AilisVrmExpressionProtocol.ResolveBindingWeight(
                        expression,
                        frame);
                if (targetWeight <= 0f)
                {
                    continue;
                }

                _blinkOverrideRate = Mathf.Max(
                    _blinkOverrideRate,
                    AilisVrmExpressionProtocol.ResolveOverrideRate(
                        expression.overrideBlink,
                        targetWeight));
                _lookAtOverrideRate = Mathf.Max(
                    _lookAtOverrideRate,
                    AilisVrmExpressionProtocol.ResolveOverrideRate(
                        expression.overrideLookAt,
                        targetWeight));
                _mouthOverrideRate = Mathf.Max(
                    _mouthOverrideRate,
                    AilisVrmExpressionProtocol.ResolveOverrideRate(
                        expression.overrideMouth,
                        targetWeight));

                if (IsBlendShapeExpression(expression))
                {
                    if (_expressions.ContainsKey(expression.id))
                    {
                        _expressionTargets[expression.id] =
                            targetWeight;
                    }
                    continue;
                }

                if (!animatorSelections.TryGetValue(
                        expression.layerIndex,
                        out var current) ||
                    targetWeight > current.Weight + 0.001f ||
                    (Mathf.Abs(targetWeight - current.Weight) <= 0.001f &&
                     expression.priority > current.Binding.priority))
                {
                    animatorSelections[expression.layerIndex] =
                        new AnimatorExpressionSelection
                        {
                            Binding = expression,
                            Weight = targetWeight
                        };
                }
            }

            foreach (var selection in animatorSelections.Values)
            {
                ApplyAnimatorExpression(
                    selection.Binding,
                    selection.Weight);
            }
        }

        private void ApplyAnimatorExpression(
            AilisVrmExpressionBinding expression,
            float targetWeight)
        {
            if (_animator == null ||
                expression.layerIndex < 0 ||
                expression.layerIndex >= _animator.layerCount ||
                string.IsNullOrWhiteSpace(expression.stateName))
            {
                return;
            }

            var stateHash = Animator.StringToHash(expression.stateName);
            if (!_animator.HasState(expression.layerIndex, stateHash))
            {
                Debug.LogWarning(
                    "[AILIS Renderer] VRM expression state is missing: " +
                    expression.ExpressionKey + " -> " +
                    expression.stateName + " on layer " +
                    expression.layerIndex);
                return;
            }

            _expressionLayerTargets[expression.layerIndex] =
                Mathf.Clamp(targetWeight, 0.18f, 1f);
            _activeAnimatorExpressionIds.TryGetValue(
                expression.layerIndex,
                out var activeExpressionId);
            if (!string.Equals(
                    activeExpressionId,
                    expression.id,
                    StringComparison.OrdinalIgnoreCase))
            {
                _animator.CrossFade(
                    stateHash,
                    Mathf.Clamp(expression.transitionSeconds, 0.04f, 1.2f),
                    expression.layerIndex,
                    0f);
                _activeAnimatorExpressionIds[expression.layerIndex] =
                    expression.id ?? "";
            }
            Debug.Log(
                "[AILIS Renderer] VRM expression selected: " +
                expression.ExpressionKey + " -> " +
                expression.stateName +
                " (layer " + expression.layerIndex + ")");
        }

        private void ConfigureExpressionLifetime(string durationHint)
        {
            var normalized = (durationHint ?? "short").Trim().ToLowerInvariant();
            if (normalized == "hold")
            {
                _expressionCanExpire = false;
                _expressionHoldUntil = float.PositiveInfinity;
            }
            else
            {
                _expressionCanExpire = true;
                var duration = normalized == "long"
                    ? 5.2f
                    : normalized == "medium"
                        ? 3.6f
                        : 2.4f;
                _expressionHoldUntil = Time.unscaledTime + duration;
            }
            _expressionResetApplied = false;
        }

        private void UpdateExpressionLifetime()
        {
            if (!_expressionCanExpire ||
                _expressionResetApplied ||
                Time.unscaledTime < _expressionHoldUntil)
            {
                return;
            }
            _expressionResetApplied = true;
            ApplyExpressionFrame(_package?.ResolveExpressionFrame(new AilisPersonaSurface
            {
                emotion = "relaxed",
                taskState = "idle",
                gestureIntent = "none",
                socialTone = "soft",
                durationHint = "hold",
                intensity = 0.3f
            }));
        }

        private void UpdateExpressionLayers()
        {
            if (_animator == null)
            {
                return;
            }
            var alpha = GetSmoothingAlpha(Time.unscaledDeltaTime, 14f);
            foreach (var pair in _expressionLayerTargets)
            {
                _expressionLayerValues.TryGetValue(pair.Key, out var current);
                var next = current + (pair.Value - current) * alpha;
                _expressionLayerValues[pair.Key] = next;
                if (pair.Key >= 0 && pair.Key < _animator.layerCount)
                {
                    _animator.SetLayerWeight(pair.Key, next);
                }
            }
        }

        private void UpdateBlendShapeExpressions()
        {
            var alpha = GetSmoothingAlpha(Time.unscaledDeltaTime, 14f);
            _expressionBaseWeights.Clear();
            foreach (var pair in _expressions)
            {
                _expressionTargets.TryGetValue(pair.Key, out var target);
                _expressionValues.TryGetValue(pair.Key, out var current);
                var next = current + (target - current) * alpha;
                _expressionValues[pair.Key] = next;
                foreach (var binding in pair.Value)
                {
                    AddExpressionBaseWeight(
                        binding,
                        next * binding.Weight);
                }
            }

            foreach (var pair in _expressions)
            {
                foreach (var binding in pair.Value)
                {
                    binding.Renderer.SetBlendShapeWeight(
                        binding.Index,
                        GetExpressionBaseWeight(binding));
                }
            }
        }

        private void AddExpressionBaseWeight(
            VisemeBinding binding,
            float weight)
        {
            if (binding?.Renderer == null)
            {
                return;
            }
            if (!_expressionBaseWeights.TryGetValue(
                    binding.Renderer,
                    out var rendererWeights))
            {
                rendererWeights = new Dictionary<int, float>();
                _expressionBaseWeights[binding.Renderer] = rendererWeights;
            }
            rendererWeights.TryGetValue(binding.Index, out var current);
            rendererWeights[binding.Index] =
                Mathf.Clamp(current + weight, 0f, 100f);
        }

        private float GetExpressionBaseWeight(VisemeBinding binding)
        {
            if (binding?.Renderer != null &&
                _expressionBaseWeights.TryGetValue(
                    binding.Renderer,
                    out var rendererWeights) &&
                rendererWeights.TryGetValue(binding.Index, out var weight))
            {
                return weight;
            }
            return 0f;
        }

        private void UpdateBlink()
        {
            if (_blinkBindings.Count == 0)
            {
                return;
            }

            var now = Time.unscaledTime;
            if (_blinkStartedAt < 0f && now >= _nextBlinkAt)
            {
                _blinkStartedAt = now;
            }

            var weight = 0f;
            if (_blinkStartedAt >= 0f)
            {
                var progress = (now - _blinkStartedAt) / 0.16f;
                if (progress >= 1f)
                {
                    _blinkStartedAt = -1f;
                    ScheduleNextBlink();
                }
                else
                {
                    weight = 1f - Mathf.Abs(progress * 2f - 1f);
                }
            }

            foreach (var binding in _blinkBindings)
            {
                binding.Renderer.SetBlendShapeWeight(
                    binding.Index,
                    Mathf.Max(
                        GetExpressionBaseWeight(binding),
                        weight *
                        (1f - Mathf.Clamp01(_blinkOverrideRate)) *
                        100f));
            }
        }

        private void ScheduleNextBlink()
        {
            _nextBlinkAt = Time.unscaledTime + UnityEngine.Random.Range(2.4f, 5.2f);
        }

        private static string InferViseme(string blendShapeName)
        {
            var name = (blendShapeName ?? "").Trim().ToLowerInvariant();
            foreach (var viseme in new[] { "aa", "ih", "ou", "ee", "oh" })
            {
                if (name == viseme || name.EndsWith("_" + viseme) || name.EndsWith("." + viseme))
                {
                    return viseme;
                }
            }
            return "";
        }

        private static string NormalizeViseme(string value)
        {
            var normalized = (value ?? "aa").Trim().ToLowerInvariant();
            return normalized == "ih" || normalized == "ou" || normalized == "ee" || normalized == "oh"
                ? normalized
                : "aa";
        }

        private static bool IsBlendShapeExpression(
            AilisVrmExpressionBinding expression)
        {
            return string.Equals(
                       expression?.driver,
                       "blend-shape",
                       StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(
                       expression?.driver,
                       "morph-targets",
                       StringComparison.OrdinalIgnoreCase);
        }

        private static float GetSmoothingAlpha(float deltaTime, float smoothing)
        {
            return 1f - Mathf.Exp(-Mathf.Max(0f, deltaTime) * smoothing);
        }

        public void DisposeAvatar()
        {
            if (_instance != null)
            {
                Destroy(_instance);
                _instance = null;
            }
            var bundle = _bundle;
            _bundle = null;
            if (bundle != null && !_applicationIsQuitting)
            {
                bundle.Unload(false);
            }
            _package = null;
            if (_performanceBridge != null)
            {
                Destroy(_performanceBridge);
                _performanceBridge = null;
            }
            if (_nativePlayableLayers != null)
            {
                _nativePlayableLayers.DisposeGraph();
                Destroy(_nativePlayableLayers);
                _nativePlayableLayers = null;
            }
            _visemes.Clear();
            _expressions.Clear();
            _visemeValues.Clear();
            _expressionTargets.Clear();
            _expressionValues.Clear();
            _expressionBaseWeights.Clear();
            _expressionLayerTargets.Clear();
            _expressionLayerValues.Clear();
            _bakedMotionClips.Clear();
            _activeAnimatorExpressionIds.Clear();
            _blinkOverrideRate = 0f;
            _lookAtOverrideRate = 0f;
            _mouthOverrideRate = 0f;
            _blinkBindings.Clear();
        }

        private void OnDestroy()
        {
            DisposeAvatar();
        }

        private void OnApplicationQuit()
        {
            // Unity tears down native AssetBundle state before all MonoBehaviour
            // OnDestroy callbacks have completed. The process is already
            // releasing those resources, so avoid calling the native unload API.
            _applicationIsQuitting = true;
        }
    }
}
