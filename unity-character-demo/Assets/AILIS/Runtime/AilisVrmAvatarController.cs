using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using UniGLTF;
using UniVRM10;
using UnityEngine;
using VRM10.MToon10;

namespace Ailis.CharacterDemo
{
    public sealed class AilisVrmAvatarController : MonoBehaviour, IAilisAvatarAdapter,
        IAilisAvatarRenderingAdapter, IAilisAnimationDebugAdapter
    {
        private sealed class LoadedMotion
        {
            public AilisMotionDefinition Definition;
            public AnimationClip Clip;
            public float DurationSeconds;
        }

        private sealed class MToonOutlineBaseline
        {
            public float Width;
            public Color Color;
        }

        private static readonly ExpressionKey[] CoreExpressionKeys =
        {
            ExpressionKey.CreateFromPreset(ExpressionPreset.happy),
            ExpressionKey.CreateFromPreset(ExpressionPreset.angry),
            ExpressionKey.CreateFromPreset(ExpressionPreset.sad),
            ExpressionKey.CreateFromPreset(ExpressionPreset.relaxed),
            ExpressionKey.CreateFromPreset(ExpressionPreset.surprised),
            ExpressionKey.CreateFromPreset(ExpressionPreset.neutral)
        };

        private static readonly ExpressionPreset[] VisemeExpressions =
        {
            ExpressionPreset.aa,
            ExpressionPreset.ih,
            ExpressionPreset.ou,
            ExpressionPreset.ee,
            ExpressionPreset.oh
        };

        private readonly Dictionary<ExpressionKey, float> _currentWeights =
            new Dictionary<ExpressionKey, float>();
        private readonly Dictionary<ExpressionKey, float> _targetWeights =
            new Dictionary<ExpressionKey, float>();
        private readonly Dictionary<string, LoadedMotion> _motions =
            new Dictionary<string, LoadedMotion>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<Material, MToonOutlineBaseline> _mtoonOutlines =
            new Dictionary<Material, MToonOutlineBaseline>();

        private Vrm10Instance _vrm;
        private Animator _animator;
        private AilisCharacterPackage _package;
        private AilisLayeredPerformanceController _performance;
        private AilisAnimationRigController _animationRig;
        private AilisPersonaSurface _surface = new AilisPersonaSurface();
        private AilisLipFrame _externalLip;
        private float _externalLipUntil;
        private float _surfaceSpeechUntil;
        private string _lipMode = "idle";
        private string _activeViseme = "";
        private float _activeVisemeWeight;
        private float _speechPhase;
        private float _blinkTimer;
        private float _nextBlinkAt = 2.5f;
        private AilisRendererSettings _rendererSettings = new AilisRendererSettings();

        public string AdapterId => "vrm";
        public bool IsLoaded => _vrm != null;
        public string Status { get; private set; } = "not_loaded";

        public static void RegisterAdapter()
        {
            AilisAvatarAdapterRegistry.Register(
                "vrm",
                host => host.AddComponent<AilisVrmAvatarController>());
        }

        public async Task LoadAsync(AilisCharacterPackage package)
        {
            _package = package ?? throw new ArgumentNullException(nameof(package));
            var modelPath = package.ModelPath;
            if (!File.Exists(modelPath))
            {
                Status = "model_missing";
                throw new FileNotFoundException("AILIS VRM was not found.", modelPath);
            }

            Status = "loading_model";
            _vrm = await Vrm10.LoadPathAsync(
                modelPath,
                canLoadVrm0X: true,
                showMeshes: true,
                awaitCaller: new RuntimeOnlyAwaitCaller());
            _vrm.transform.SetParent(transform, false);
            _vrm.transform.localPosition = new Vector3(
                package.Manifest.positionX,
                package.Manifest.positionY,
                package.Manifest.positionZ);
            _vrm.transform.localScale = Vector3.one * Mathf.Max(0.01f, package.Manifest.scale);
            _animator = _vrm.GetComponent<Animator>();
            if (_animator == null || !_animator.isHuman)
            {
                throw new InvalidDataException(
                    "AILIS VRM model does not expose a Humanoid Animator.");
            }
            CacheMToonOutlineBaselines();
            ApplyRenderingSettings(_rendererSettings);

            foreach (var expressionKey in CoreExpressionKeys)
            {
                _currentWeights[expressionKey] = 0f;
                _targetWeights[expressionKey] = 0f;
            }

            var baseClips = new Dictionary<string, AnimationClip>(
                StringComparer.Ordinal);
            var basePriorities = new Dictionary<string, int>(
                StringComparer.Ordinal);
            foreach (var motion in package.Manifest.motions ??
                     Array.Empty<AilisMotionDefinition>())
            {
                if (motion == null ||
                    !motion.loop ||
                    !motion.IsApproved ||
                    !string.Equals(
                        motion.ResolvePerformanceLayer(),
                        "base",
                        StringComparison.Ordinal))
                {
                    continue;
                }
                var loaded = await GetOrLoadMotionAsync(motion);
                if (loaded == null)
                {
                    continue;
                }
                var slot =
                    AilisPerformanceAnimatorParameters.ResolveBaseSlot(motion);
                if (!basePriorities.TryGetValue(slot, out var priority) ||
                    motion.priority >= priority)
                {
                    basePriorities[slot] = motion.priority;
                    baseClips[slot] = loaded.Clip;
                }
            }

            _performance =
                _animator.gameObject.AddComponent<AilisLayeredPerformanceController>();
            _performance.Initialize(_animator, baseClips);
            _animationRig =
                _animator.gameObject.AddComponent<AilisAnimationRigController>();
            _animationRig.Configure(
                _animator,
                package.Manifest.rig,
                _performance);
            _vrm.Runtime.VrmAnimation = null;
            ApplySurface(_surface);
            Status = "ready";
            Debug.Log("[AILIS Renderer] VRM ready: " + modelPath);
        }

        public void ApplyRenderingSettings(AilisRendererSettings settings)
        {
            _rendererSettings = settings ?? new AilisRendererSettings();
            _rendererSettings.Normalize();
            if (_vrm == null)
            {
                return;
            }

            if (_mtoonOutlines.Count == 0)
            {
                CacheMToonOutlineBaselines();
            }

            foreach (var pair in _mtoonOutlines)
            {
                var material = pair.Key;
                if (material == null)
                {
                    continue;
                }
                var context = new MToon10Context(material);
                context.OutlineWidthFactor = pair.Value.Width *
                    _rendererSettings.mtoonOutlineWidthMultiplier;
                var softenedColor = Color.Lerp(
                    pair.Value.Color,
                    context.BaseColorFactorSrgb,
                    _rendererSettings.mtoonOutlineColorBlend);
                softenedColor.a = pair.Value.Color.a;
                context.OutlineColorFactorSrgb = softenedColor;
                context.Validate();
            }

            Debug.Log(
                "[AILIS Renderer] MToon outlines applied: materials=" +
                _mtoonOutlines.Count +
                ", widthMultiplier=" +
                _rendererSettings.mtoonOutlineWidthMultiplier.ToString("0.00") +
                ", colorBlend=" +
                _rendererSettings.mtoonOutlineColorBlend.ToString("0.00"));
        }

        private void CacheMToonOutlineBaselines()
        {
            _mtoonOutlines.Clear();
            if (_vrm == null)
            {
                return;
            }

            foreach (var renderer in _vrm.GetComponentsInChildren<Renderer>(true))
            {
                foreach (var material in renderer.sharedMaterials)
                {
                    if (material == null || _mtoonOutlines.ContainsKey(material) ||
                        material.shader == null ||
                        material.shader.name.IndexOf("MToon10", StringComparison.OrdinalIgnoreCase) < 0)
                    {
                        continue;
                    }
                    var context = new MToon10Context(material);
                    if (context.OutlineWidthMode == MToon10OutlineMode.None)
                    {
                        continue;
                    }
                    _mtoonOutlines[material] = new MToonOutlineBaseline
                    {
                        Width = context.OutlineWidthFactor,
                        Color = context.OutlineColorFactorSrgb
                    };
                }
            }
        }

        public async Task<bool> PlayMotionAsync(AilisMotionDefinition motion)
        {
            if (_vrm == null || motion == null || string.IsNullOrWhiteSpace(motion.id))
            {
                return false;
            }
            var loaded = await GetOrLoadMotionAsync(motion);
            if (loaded == null || _performance == null)
            {
                return false;
            }
            if (!_performance.Play(motion, loaded.Clip))
            {
                return false;
            }
            Status = "ready:" + motion.id;
            Debug.Log(
                "[AILIS Renderer] Motion started: " + motion.id +
                " [" + motion.ResolvePerformanceLayer() + "]" +
                (motion.loop ? " (loop)" : " (one-shot)"));
            return true;
        }

        public AilisAnimationDebugSnapshot GetAnimationDebugSnapshot()
        {
            AilisAnimationDebugSnapshot snapshot;
            if (_performance != null)
            {
                snapshot = _performance.GetDebugSnapshot(AdapterId, Status);
            }
            else
            {
                snapshot = new AilisAnimationDebugSnapshot
                {
                    supported = true,
                    ready = false,
                    adapterId = AdapterId,
                    status = Status,
                    emotion = _surface?.emotion ?? "",
                    taskState = _surface?.taskState ?? "",
                    gestureIntent = _surface?.gestureIntent ?? "",
                    timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                };
            }
            snapshot.speechActive =
                Time.unscaledTime <= _externalLipUntil ||
                Time.unscaledTime <= _surfaceSpeechUntil ||
                (_surface?.speechEnergy ?? 0f) > 0.01f;
            snapshot.lipMode = _lipMode;
            snapshot.activeViseme = _activeViseme;
            snapshot.activeVisemeWeight = _activeVisemeWeight;
            snapshot.expressionWeights = new[]
            {
                CreateDebugWeight("neutral", ExpressionPreset.neutral),
                CreateDebugWeight("happy", ExpressionPreset.happy),
                CreateDebugWeight("angry", ExpressionPreset.angry),
                CreateDebugWeight("sad", ExpressionPreset.sad),
                CreateDebugWeight("relaxed", ExpressionPreset.relaxed),
                CreateDebugWeight("surprised", ExpressionPreset.surprised)
            };
            snapshot.visemeWeights = new[]
            {
                CreateVisemeDebugWeight("aa"),
                CreateVisemeDebugWeight("ih"),
                CreateVisemeDebugWeight("ou"),
                CreateVisemeDebugWeight("ee"),
                CreateVisemeDebugWeight("oh")
            };
            return snapshot;
        }

        private AilisAnimationDebugWeight CreateDebugWeight(
            string id,
            ExpressionPreset preset)
        {
            _currentWeights.TryGetValue(
                ExpressionKey.CreateFromPreset(preset),
                out var weight);
            return new AilisAnimationDebugWeight
            {
                id = id,
                weight = weight
            };
        }

        private AilisAnimationDebugWeight CreateVisemeDebugWeight(string id)
        {
            return new AilisAnimationDebugWeight
            {
                id = id,
                weight = string.Equals(
                    _activeViseme,
                    id,
                    StringComparison.OrdinalIgnoreCase)
                    ? _activeVisemeWeight
                    : 0f
            };
        }

        public bool ApplyAnimationDebugControl(
            AilisAnimationDebugControl control)
        {
            return _performance != null &&
                _performance.ApplyDebugControl(control);
        }

        private async Task<LoadedMotion> GetOrLoadMotionAsync(
            AilisMotionDefinition motion)
        {
            if (_motions.TryGetValue(motion.id, out var loaded))
            {
                return loaded;
            }
            loaded = await LoadMotionAsync(motion);
            _motions[motion.id] = loaded;
            return loaded;
        }

        private Task<LoadedMotion> LoadMotionAsync(
            AilisMotionDefinition definition)
        {
            Status = "loading_motion:" + definition.id;
            var resourcePath =
                string.IsNullOrWhiteSpace(definition.bakedClipResource)
                    ? AilisPerformanceAnimatorParameters.ResolveVrmaClipResource(
                        _package.Manifest.id,
                        definition.id)
                    : definition.bakedClipResource.Trim();
            var clip = Resources.Load<AnimationClip>(resourcePath);
            if (clip == null)
            {
                throw new InvalidDataException(
                    "VRMA motion is not compiled into the AILIS Humanoid " +
                    "motion library: " + resourcePath +
                    ". Import the motion package before building the renderer.");
            }
            Debug.Log(
                "[AILIS Animation] Humanoid clip loaded: " +
                definition.id +
                ", duration=" + clip.length.ToString("0.00") +
                "s, layer=" + definition.ResolvePerformanceLayer());
            return Task.FromResult(new LoadedMotion
            {
                Definition = definition,
                Clip = clip,
                DurationSeconds = Mathf.Max(
                    0.2f,
                    clip.length > 0f
                        ? clip.length
                        : definition.fallbackDurationSeconds)
            });
        }

        public void ApplySurface(AilisPersonaSurface surface)
        {
            _surface = surface ?? new AilisPersonaSurface();
            _performance?.ApplySurface(_surface);
            _animationRig?.ApplySurface(_surface);
            foreach (var expressionKey in new List<ExpressionKey>(
                         _targetWeights.Keys))
            {
                _targetWeights[expressionKey] = 0f;
            }

            var frame = _package?.ResolveExpressionFrame(_surface) ??
                        AilisVrmExpressionProtocol.Resolve(_surface);
            foreach (var pair in frame.Weights)
            {
                var expressionKey = ParseExpressionKey(pair.Key);
                if (!_currentWeights.ContainsKey(expressionKey))
                {
                    _currentWeights[expressionKey] = 0f;
                }
                _targetWeights[expressionKey] = Mathf.Clamp01(pair.Value);
            }

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
            _externalLip = frame;
            _externalLipUntil = Time.unscaledTime + Mathf.Clamp(
                frame?.durationSeconds ?? 0.12f,
                0.03f,
                3f);
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
            return transform.position + Vector3.up * 1.85f;
        }

        public bool TryGetWorldBounds(out Bounds bounds)
        {
            bounds = default;
            if (_vrm == null)
            {
                return false;
            }
            var renderers = _vrm.GetComponentsInChildren<Renderer>(true);
            var initialized = false;
            foreach (var renderer in renderers)
            {
                if (!renderer.enabled)
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

        private void Update()
        {
            if (_vrm == null)
            {
                return;
            }

            var speed = 4.5f * Time.deltaTime;
            foreach (var pair in _targetWeights)
            {
                _currentWeights[pair.Key] = Mathf.MoveTowards(
                    _currentWeights[pair.Key],
                    pair.Value,
                    speed);
                _vrm.Runtime.Expression.SetWeight(
                    pair.Key,
                    _currentWeights[pair.Key]);
            }

            UpdateLip();
            ApplyGaze();
            UpdateBlink();
        }

        private void UpdateLip()
        {
            _lipMode = "idle";
            _activeViseme = "";
            _activeVisemeWeight = 0f;
            foreach (var preset in VisemeExpressions)
            {
                _vrm.Runtime.Expression.SetWeight(ExpressionKey.CreateFromPreset(preset), 0f);
            }

            if (_externalLip != null && Time.unscaledTime <= _externalLipUntil)
            {
                _lipMode = string.IsNullOrWhiteSpace(_externalLip.mode)
                    ? "viseme"
                    : _externalLip.mode;
                _activeViseme = ParseVisemeId(_externalLip.viseme);
                _activeVisemeWeight = Mathf.Clamp01(_externalLip.weight);
                _vrm.Runtime.Expression.SetWeight(
                    ExpressionKey.CreateFromPreset(ParseViseme(_activeViseme)),
                    _activeVisemeWeight);
                return;
            }

            var speechEnergy = Mathf.Clamp01(_surface.speechEnergy);
            if (speechEnergy <= 0.01f && Time.unscaledTime <= _surfaceSpeechUntil)
            {
                speechEnergy = 0.42f;
            }
            _speechPhase += Time.deltaTime * Mathf.Lerp(7f, 13f, speechEnergy);
            var mouthWeight = speechEnergy > 0.01f
                ? (0.18f + 0.42f * (Mathf.Sin(_speechPhase) * 0.5f + 0.5f)) * speechEnergy
                : 0f;
            if (mouthWeight > 0f)
            {
                _lipMode = "energy";
                _activeViseme = "aa";
                _activeVisemeWeight = mouthWeight;
            }
            _vrm.Runtime.Expression.SetWeight(
                ExpressionKey.CreateFromPreset(ExpressionPreset.aa),
                mouthWeight);
        }

        private void ApplyGaze()
        {
            var gaze = (_surface.gazeTarget ?? "user").Trim().ToLowerInvariant();
            float yaw;
            float pitch;
            switch (gaze)
            {
                case "side":
                    yaw = 10f;
                    pitch = 1f;
                    break;
                case "down":
                    yaw = 2f;
                    pitch = 8f;
                    break;
                case "screen":
                    yaw = -7f;
                    pitch = 4f;
                    break;
                default:
                    yaw = Mathf.Sin(Time.time * 0.32f) * 1.4f;
                    pitch = Mathf.Sin(Time.time * 0.21f + 0.7f) * 0.8f;
                    break;
            }

            _vrm.LookAtTargetType = VRM10ObjectLookAt.LookAtTargetTypes.YawPitchValue;
            _vrm.Runtime.LookAt.SetLookAtYawPitch(yaw, pitch);
        }

        private void UpdateBlink()
        {
            _blinkTimer += Time.deltaTime;
            var blinkWeight = 0f;
            if (_blinkTimer >= _nextBlinkAt)
            {
                const float blinkDuration = 0.16f;
                var blinkTime = _blinkTimer - _nextBlinkAt;
                if (blinkTime < blinkDuration)
                {
                    blinkWeight = Mathf.Sin(Mathf.PI * blinkTime / blinkDuration);
                }
                else
                {
                    _blinkTimer = 0f;
                    _nextBlinkAt = UnityEngine.Random.Range(2.2f, 5.8f);
                }
            }
            _vrm.Runtime.Expression.SetWeight(
                ExpressionKey.CreateFromPreset(ExpressionPreset.blink),
                blinkWeight);
        }

        public void DisposeAvatar()
        {
            _animationRig?.DisposeRig();
            _animationRig = null;
            _performance?.DisposePerformance();
            _performance = null;
            _motions.Clear();
            _mtoonOutlines.Clear();
            if (_vrm != null)
            {
                Destroy(_vrm.gameObject);
                _vrm = null;
            }
        }

        private static ExpressionPreset ParseViseme(string value)
        {
            switch ((value ?? "aa").Trim().ToLowerInvariant())
            {
                case "ih": return ExpressionPreset.ih;
                case "ou": return ExpressionPreset.ou;
                case "ee": return ExpressionPreset.ee;
                case "oh": return ExpressionPreset.oh;
                default: return ExpressionPreset.aa;
            }
        }

        private static string ParseVisemeId(string value)
        {
            switch ((value ?? "aa").Trim().ToLowerInvariant())
            {
                case "ih": return "ih";
                case "ou": return "ou";
                case "ee": return "ee";
                case "oh": return "oh";
                default: return "aa";
            }
        }

        private static ExpressionKey ParseExpressionKey(string value)
        {
            var normalized =
                AilisVrmExpressionProtocol.NormalizeExpressionKey(value);
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return ExpressionKey.CreateFromPreset(
                    ExpressionPreset.relaxed);
            }
            if (AilisVrmExpressionProtocol.IsPreset(normalized) &&
                Enum.TryParse(
                    normalized,
                    true,
                    out ExpressionPreset preset))
            {
                return ExpressionKey.CreateFromPreset(preset);
            }
            return ExpressionKey.CreateCustom(normalized);
        }

        private void OnDestroy()
        {
            DisposeAvatar();
        }
    }
}
