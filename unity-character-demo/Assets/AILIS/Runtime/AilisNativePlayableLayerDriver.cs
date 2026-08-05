using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Animations;
using UnityEngine.Playables;

namespace Ailis.CharacterDemo
{
    public sealed class AilisNativePlayableLayerDriver : MonoBehaviour
    {
        private sealed class RuntimeLayer
        {
            public AilisNativePlayableLayer Definition;
            public AnimatorControllerPlayable Playable;
            public readonly Dictionary<string, AnimatorControllerParameterType>
                Parameters =
                    new Dictionary<string, AnimatorControllerParameterType>(
                        StringComparer.OrdinalIgnoreCase);
        }

        private sealed class ParameterReset
        {
            public string LayerId = "";
            public string Name = "";
            public string Type = "";
            public float Value;
            public float At;
        }

        private readonly List<RuntimeLayer> _layers =
            new List<RuntimeLayer>();
        private readonly List<ParameterReset> _resets =
            new List<ParameterReset>();
        private Animator _animator;
        private PlayableGraph _graph;
        private AnimationLayerMixerPlayable _mixer;
        private AnimationMixerPlayable _externalMotionMixer;
        private readonly AnimationClipPlayable[] _externalMotionSlots =
            new AnimationClipPlayable[2];
        private int _externalLayerIndex = -1;
        private int _externalActiveSlot = -1;
        private int _externalIncomingSlot = -1;
        private float _externalTransitionSeconds = 0.18f;
        private float _externalTransitionElapsed;
        private float _externalLayerWeight;
        private float _externalFadeTarget;
        private float _externalFadeSpeed = 6f;
        private float _externalEndAt;
        private bool _externalLoop;

        public bool IsReady =>
            _animator != null &&
            _graph.IsValid() &&
            _layers.Count > 0;

        public string Status { get; private set; } = "not_configured";

        public bool Configure(
            Animator animator,
            AilisNativePlayableLayerSet layerSet)
        {
            DisposeGraph();
            if (animator == null || layerSet?.layers == null)
            {
                Status = "native_layers_unavailable";
                return false;
            }

            var definitions = new List<AilisNativePlayableLayer>();
            foreach (var layer in layerSet.layers)
            {
                if (layer?.enabled == true && layer.controller != null)
                {
                    definitions.Add(layer);
                }
            }
            if (definitions.Count == 0)
            {
                Status = "native_layers_empty";
                return false;
            }

            _animator = animator;
            _animator.applyRootMotion = false;
            _animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
            _animator.runtimeAnimatorController = null;

            _graph = PlayableGraph.Create(
                "AILIS Native UnityPackage Playable Layers");
            _graph.SetTimeUpdateMode(DirectorUpdateMode.GameTime);
            _mixer = AnimationLayerMixerPlayable.Create(
                _graph,
                definitions.Count + 1);

            for (var index = 0; index < definitions.Count; index += 1)
            {
                var definition = definitions[index];
                var playable = AnimatorControllerPlayable.Create(
                    _graph,
                    definition.controller);
                var runtime = new RuntimeLayer
                {
                    Definition = definition,
                    Playable = playable
                };
                IndexParameters(runtime);
                _layers.Add(runtime);

                _graph.Connect(playable, 0, _mixer, index);
                _mixer.SetInputWeight(
                    index,
                    Mathf.Clamp01(definition.weight));
                _mixer.SetLayerAdditive(
                    (uint)index,
                    definition.additive);
                if (definition.mask != null)
                {
                    _mixer.SetLayerMaskFromAvatarMask(
                        (uint)index,
                        definition.mask);
                }
            }

            _externalLayerIndex = definitions.Count;
            _externalMotionMixer =
                AnimationMixerPlayable.Create(_graph, 2);
            _graph.Connect(
                _externalMotionMixer,
                0,
                _mixer,
                _externalLayerIndex);
            _mixer.SetInputWeight(_externalLayerIndex, 0f);
            _mixer.SetLayerAdditive(
                (uint)_externalLayerIndex,
                false);

            var output = AnimationPlayableOutput.Create(
                _graph,
                "AILIS Native Playable Layers Output",
                _animator);
            output.SetSourcePlayable(_mixer);
            _graph.Play();
            ApplyDesktopDefaults();
            Status =
                "ready:" +
                layerSet.sourceSystem +
                ":" +
                _layers.Count;
            Debug.Log(
                "[AILIS Native Animation] Preserved UnityPackage controllers: " +
                string.Join(
                    ", ",
                    _layers.ConvertAll(
                        layer =>
                            layer.Definition.id +
                            "=" +
                            layer.Definition.controller.name)));
            return true;
        }

        public void ApplySurface(AilisPersonaSurface surface)
        {
            if (!IsReady)
            {
                return;
            }
            ApplyDesktopDefaults();
            SetParameter(
                "",
                "AILIS_Speaking",
                "float",
                Mathf.Clamp01(surface?.speechEnergy ?? 0f));
            SetParameter(
                "",
                "AILIS_EmotionIntensity",
                "float",
                Mathf.Clamp01(surface?.intensity ?? 0f));
        }

        public Task<bool> PlayMotionAsync(AilisMotionDefinition motion)
        {
            if (!IsReady || motion == null)
            {
                return Task.FromResult(false);
            }

            FadeOutExternalMotion();
            if (!string.IsNullOrWhiteSpace(motion.nativeParameter))
            {
                var applied = SetParameter(
                    motion.nativeLayerId,
                    motion.nativeParameter,
                    motion.nativeParameterType,
                    motion.nativeParameterValue);
                if (applied && !motion.loop)
                {
                    _resets.RemoveAll(
                        reset =>
                            string.Equals(
                                reset.LayerId,
                                motion.nativeLayerId,
                                StringComparison.OrdinalIgnoreCase) &&
                            string.Equals(
                                reset.Name,
                                motion.nativeParameter,
                                StringComparison.OrdinalIgnoreCase));
                    _resets.Add(new ParameterReset
                    {
                        LayerId = motion.nativeLayerId,
                        Name = motion.nativeParameter,
                        Type = motion.nativeParameterType,
                        Value = motion.nativeResetValue,
                        At =
                            Time.unscaledTime +
                            Mathf.Max(
                                0.25f,
                                motion.fallbackDurationSeconds)
                    });
                }
                if (applied)
                {
                    Status = "playing_parameter:" + motion.id;
                    Debug.Log(
                        "[AILIS Native Animation] Parameter motion: " +
                        motion.id +
                        " -> " +
                        motion.nativeLayerId +
                        "." +
                        motion.nativeParameter +
                        "=" +
                        motion.nativeParameterValue);
                }
                return Task.FromResult(applied);
            }

            if (!string.IsNullOrWhiteSpace(motion.stateName))
            {
                foreach (var layer in FindLayers(motion.nativeLayerId))
                {
                    for (
                        var animatorLayer = 0;
                        animatorLayer < layer.Playable.GetLayerCount();
                        animatorLayer += 1)
                    {
                        var stateHash =
                            Animator.StringToHash(motion.stateName);
                        if (!layer.Playable.HasState(
                                animatorLayer,
                                stateHash))
                        {
                            continue;
                        }
                        layer.Playable.CrossFade(
                            stateHash,
                            Mathf.Clamp(
                                motion.transitionSeconds,
                                0.04f,
                                1.2f),
                            animatorLayer,
                            0f);
                        Status = "playing_state:" + motion.id;
                        return Task.FromResult(true);
                    }
                }
            }

            // Native controllers already own their idle/locomotion state.
            return Task.FromResult(motion.loop);
        }

        public Task<bool> PlayExternalMotionAsync(
            AilisMotionDefinition motion,
            AnimationClip clip)
        {
            if (!IsReady || motion == null || clip == null)
            {
                return Task.FromResult(false);
            }

            var incoming = _externalActiveSlot == 0 ? 1 : 0;
            DestroyExternalSlot(incoming);
            var playable = AnimationClipPlayable.Create(_graph, clip);
            playable.SetApplyFootIK(false);
            playable.SetApplyPlayableIK(false);
            playable.SetDuration(Math.Max(0.2d, clip.length));
            playable.SetTime(0d);
            playable.Play();
            _externalMotionSlots[incoming] = playable;
            _graph.Connect(
                playable,
                0,
                _externalMotionMixer,
                incoming);
            _externalMotionMixer.SetInputWeight(incoming, 0f);
            if (_externalActiveSlot >= 0)
            {
                _externalMotionMixer.SetInputWeight(
                    _externalActiveSlot,
                    1f);
            }

            _externalIncomingSlot = incoming;
            _externalTransitionElapsed = 0f;
            _externalTransitionSeconds = Mathf.Clamp(
                motion.transitionSeconds,
                0.06f,
                1.2f);
            _externalFadeTarget = 1f;
            _externalFadeSpeed = 1f / _externalTransitionSeconds;
            _externalLoop = motion.loop;
            _externalEndAt =
                Time.unscaledTime +
                Mathf.Max(
                    0.2f,
                    clip.length > 0f
                        ? clip.length
                        : motion.fallbackDurationSeconds);
            Status = "playing_external_clip:" + motion.id;
            Debug.Log(
                "[AILIS Native Animation] External Humanoid motion: " +
                motion.id +
                " -> " +
                clip.name);
            return Task.FromResult(true);
        }

        private void Update()
        {
            for (var index = _resets.Count - 1; index >= 0; index -= 1)
            {
                var reset = _resets[index];
                if (Time.unscaledTime < reset.At)
                {
                    continue;
                }
                SetParameter(
                    reset.LayerId,
                    reset.Name,
                    reset.Type,
                    reset.Value);
                _resets.RemoveAt(index);
            }
            UpdateExternalMotion(Mathf.Max(0f, Time.unscaledDeltaTime));
        }

        private void UpdateExternalMotion(float delta)
        {
            if (!_graph.IsValid() ||
                _externalLayerIndex < 0 ||
                !_externalMotionMixer.IsValid())
            {
                return;
            }

            if (_externalIncomingSlot >= 0)
            {
                _externalTransitionElapsed += delta;
                var amount = Mathf.Clamp01(
                    _externalTransitionElapsed /
                    Mathf.Max(0.01f, _externalTransitionSeconds));
                _externalMotionMixer.SetInputWeight(
                    _externalIncomingSlot,
                    amount);
                if (_externalActiveSlot >= 0)
                {
                    _externalMotionMixer.SetInputWeight(
                        _externalActiveSlot,
                        1f - amount);
                }
                if (amount >= 1f)
                {
                    if (_externalActiveSlot >= 0)
                    {
                        DestroyExternalSlot(_externalActiveSlot);
                    }
                    _externalActiveSlot = _externalIncomingSlot;
                    _externalIncomingSlot = -1;
                }
            }

            if (!_externalLoop &&
                _externalActiveSlot >= 0 &&
                Time.unscaledTime >=
                _externalEndAt - _externalTransitionSeconds)
            {
                _externalFadeTarget = 0f;
            }
            _externalLayerWeight = Mathf.MoveTowards(
                _externalLayerWeight,
                _externalFadeTarget,
                delta * _externalFadeSpeed);
            _mixer.SetInputWeight(
                _externalLayerIndex,
                _externalLayerWeight);
            if (_externalLayerWeight <= 0.001f &&
                _externalFadeTarget <= 0f)
            {
                DestroyExternalSlot(_externalActiveSlot);
                DestroyExternalSlot(_externalIncomingSlot);
                _externalActiveSlot = -1;
                _externalIncomingSlot = -1;
                _externalLoop = false;
            }
        }

        private void FadeOutExternalMotion()
        {
            if (_externalActiveSlot < 0 &&
                _externalIncomingSlot < 0)
            {
                return;
            }
            _externalFadeTarget = 0f;
            _externalFadeSpeed =
                1f / Mathf.Max(0.06f, _externalTransitionSeconds);
        }

        private void DestroyExternalSlot(int slot)
        {
            if (slot < 0 || slot >= _externalMotionSlots.Length)
            {
                return;
            }
            var playable = _externalMotionSlots[slot];
            if (playable.IsValid())
            {
                _externalMotionMixer.DisconnectInput(slot);
                playable.Destroy();
            }
            _externalMotionSlots[slot] = default;
        }

        private void ApplyDesktopDefaults()
        {
            SetParameter("", "IsLocal", "bool", 1f);
            SetParameter("", "Grounded", "bool", 1f);
            SetParameter("", "Seated", "bool", 0f);
            SetParameter("", "AFK", "bool", 0f);
            SetParameter("", "InStation", "bool", 0f);
            SetParameter("", "Upright", "float", 1f);
            SetParameter("", "VelocityX", "float", 0f);
            SetParameter("", "VelocityY", "float", 0f);
            SetParameter("", "VelocityZ", "float", 0f);
            SetParameter("", "AngularY", "float", 0f);
            SetParameter("", "GestureLeftWeight", "float", 0f);
            SetParameter("", "GestureRightWeight", "float", 0f);
            SetParameter("", "VRMode", "int", 0f);
            SetParameter("", "TrackingType", "int", 3f);
        }

        private bool SetParameter(
            string layerId,
            string name,
            string type,
            float value)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return false;
            }

            var applied = false;
            foreach (var layer in FindLayers(layerId))
            {
                if (!layer.Parameters.TryGetValue(
                        name,
                        out var declaredType))
                {
                    continue;
                }
                var requestedType =
                    NormalizeParameterType(type, declaredType);
                switch (requestedType)
                {
                    case AnimatorControllerParameterType.Bool:
                        layer.Playable.SetBool(name, value >= 0.5f);
                        break;
                    case AnimatorControllerParameterType.Int:
                        layer.Playable.SetInteger(
                            name,
                            Mathf.RoundToInt(value));
                        break;
                    case AnimatorControllerParameterType.Trigger:
                        if (value >= 0.5f)
                        {
                            layer.Playable.SetTrigger(name);
                        }
                        else
                        {
                            layer.Playable.ResetTrigger(name);
                        }
                        break;
                    default:
                        layer.Playable.SetFloat(name, value);
                        break;
                }
                applied = true;
            }
            return applied;
        }

        private IEnumerable<RuntimeLayer> FindLayers(string layerId)
        {
            if (string.IsNullOrWhiteSpace(layerId))
            {
                return _layers;
            }
            return _layers.FindAll(
                layer =>
                    string.Equals(
                        layer.Definition.id,
                        layerId,
                        StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(
                        layer.Definition.role,
                        layerId,
                        StringComparison.OrdinalIgnoreCase));
        }

        private static AnimatorControllerParameterType
            NormalizeParameterType(
                string requested,
                AnimatorControllerParameterType declared)
        {
            var normalized = (requested ?? "")
                .Trim()
                .ToLowerInvariant();
            switch (normalized)
            {
                case "bool":
                case "boolean":
                    return AnimatorControllerParameterType.Bool;
                case "int":
                case "integer":
                    return AnimatorControllerParameterType.Int;
                case "trigger":
                    return AnimatorControllerParameterType.Trigger;
                case "float":
                    return AnimatorControllerParameterType.Float;
                default:
                    return declared;
            }
        }

        private static void IndexParameters(RuntimeLayer layer)
        {
            var count = layer.Playable.GetParameterCount();
            for (var index = 0; index < count; index += 1)
            {
                var parameter = layer.Playable.GetParameter(index);
                if (parameter != null &&
                    !string.IsNullOrWhiteSpace(parameter.name))
                {
                    layer.Parameters[parameter.name] = parameter.type;
                }
            }
        }

        public void DisposeGraph()
        {
            _resets.Clear();
            _layers.Clear();
            if (_graph.IsValid())
            {
                _graph.Destroy();
            }
            _animator = null;
            _externalLayerIndex = -1;
            _externalActiveSlot = -1;
            _externalIncomingSlot = -1;
            _externalLayerWeight = 0f;
            _externalFadeTarget = 0f;
            _externalLoop = false;
            Status = "disposed";
        }

        private void OnDestroy()
        {
            DisposeGraph();
        }
    }
}
