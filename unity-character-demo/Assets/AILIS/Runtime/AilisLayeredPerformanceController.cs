using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Animations;
using UnityEngine.Playables;

namespace Ailis.CharacterDemo
{
    public sealed class AilisLayeredPerformanceController : MonoBehaviour
    {
        private const string ControllerResource =
            "AILIS/Animation/AILIS_Performance";
        private const string GestureMaskResource =
            "AILIS/Animation/AILIS_GestureMask";

        private sealed class OverlayChannel
        {
            public int LayerIndex;
            public string Id;
            public string Label;
            public string MotionId = "";
            public string ClipName = "";
            public AnimationMixerPlayable Mixer;
            public readonly AnimationClipPlayable[] Slots =
                new AnimationClipPlayable[3];
            public readonly float[] SlotDurations = new float[3];
            public readonly bool[] SlotLoops = new bool[3];
            public readonly float[] TransitionStartWeights = new float[3];
            public int ActiveSlot = -1;
            public int IncomingSlot = -1;
            public float TransitionSeconds = 0.32f;
            public float TransitionElapsed;
            public float LayerWeight;
            public float FadeTarget;
            public float FadeSmoothTime = 0.24f;
            public float FadeVelocity;
            public float EndAt;
            public float DurationSeconds;
            public bool Loop;
        }

        private Animator _animator;
        private AnimatorOverrideController _overrideController;
        private PlayableGraph _graph;
        private AnimatorControllerPlayable _controllerPlayable;
        private AnimationLayerMixerPlayable _layerMixer;
        private OverlayChannel _base;
        private OverlayChannel _additive;
        private OverlayChannel _gesture;
        private OverlayChannel _action;
        private Vector2 _currentMotion;
        private Vector2 _targetMotion;
        private float _currentIntensity;
        private float _targetIntensity = 0.35f;
        private float _currentSpeaking;
        private float _targetSpeaking;
        private int _emotion;
        private string _emotionId = "relaxed";
        private string _taskState = "idle";
        private string _gestureIntent = "none";
        private string _baseMotionId = "";
        private string _baseClipName = "";
        private bool _debugPaused;
        private float _debugPausedAt;

        public bool IsReady => _graph.IsValid();
        public bool IsActionActive =>
            _action != null && _action.LayerWeight > 0.01f;
        public float ActionWeight => _action?.LayerWeight ?? 0f;

        public void Initialize(
            Animator animator,
            IReadOnlyDictionary<string, AnimationClip> baseClips)
        {
            _animator = animator != null
                ? animator
                : throw new ArgumentNullException(nameof(animator));
            if (_animator.avatar == null || !_animator.avatar.isHuman)
            {
                throw new InvalidOperationException(
                    "AILIS layered performance requires a Humanoid Animator.");
            }

            var template =
                Resources.Load<RuntimeAnimatorController>(ControllerResource);
            if (template == null)
            {
                throw new InvalidOperationException(
                    "AILIS Animator template is missing from Resources: " +
                    ControllerResource);
            }
            var gestureMask = Resources.Load<AvatarMask>(GestureMaskResource);
            if (gestureMask == null)
            {
                throw new InvalidOperationException(
                    "AILIS gesture AvatarMask is missing from Resources: " +
                    GestureMaskResource);
            }

            _overrideController = new AnimatorOverrideController(template)
            {
                name = "AILIS Runtime Performance"
            };
            ApplyBaseOverrides(baseClips);

            _animator.applyRootMotion = false;
            _animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
            _animator.runtimeAnimatorController = null;

            _graph = PlayableGraph.Create("AILIS Layered Character Performance");
            _graph.SetTimeUpdateMode(DirectorUpdateMode.GameTime);
            _controllerPlayable =
                AnimatorControllerPlayable.Create(_graph, _overrideController);
            _layerMixer = AnimationLayerMixerPlayable.Create(_graph, 5);
            _graph.Connect(_controllerPlayable, 0, _layerMixer, 0);
            _layerMixer.SetInputWeight(0, 1f);

            _base = CreateChannel(
                1,
                "base",
                "Base",
                null,
                false);
            _additive = CreateChannel(
                2,
                "additive",
                "Additive",
                gestureMask,
                true);
            _gesture = CreateChannel(
                3,
                "gesture",
                "Gesture",
                gestureMask,
                false);
            _action = CreateChannel(
                4,
                "action",
                "Action",
                null,
                false);

            var output = AnimationPlayableOutput.Create(
                _graph,
                "AILIS Performance Output",
                _animator);
            output.SetSourcePlayable(_layerMixer);
            _graph.Play();
            ApplyAnimatorParameters();
            Debug.Log(
                "[AILIS Animation] PlayableGraph ready: " +
                "AnimatorController(Base/Additive/Gesture/Action/Face) + " +
                "interrupt-safe Base/Additive/Gesture/Action buses.");
        }

        public void ApplySurface(AilisPersonaSurface surface)
        {
            _targetMotion =
                AilisPerformanceAnimatorParameters.ResolveMotionBlend(surface);
            _targetIntensity = Mathf.Clamp01(surface?.intensity ?? 0.35f);
            _targetSpeaking = surface != null &&
                              (!string.IsNullOrWhiteSpace(surface.speechText) ||
                               surface.speechEnergy > 0.01f ||
                               string.Equals(
                                   surface.taskState,
                                   "speaking",
                                   StringComparison.OrdinalIgnoreCase))
                ? Mathf.Max(0.35f, Mathf.Clamp01(surface.speechEnergy))
                : 0f;
            _emotion =
                AilisPerformanceAnimatorParameters.ResolveEmotion(surface);
            _emotionId = string.IsNullOrWhiteSpace(surface?.emotion)
                ? "relaxed"
                : surface.emotion;
            _taskState = string.IsNullOrWhiteSpace(surface?.taskState)
                ? "idle"
                : surface.taskState;
            _gestureIntent = string.IsNullOrWhiteSpace(surface?.gestureIntent)
                ? "none"
                : surface.gestureIntent;
        }

        public void SetBaseClip(string slotName, AnimationClip clip)
        {
            if (_overrideController == null ||
                string.IsNullOrWhiteSpace(slotName) ||
                clip == null)
            {
                return;
            }
            var overrides =
                new List<KeyValuePair<AnimationClip, AnimationClip>>();
            _overrideController.GetOverrides(overrides);
            for (var index = 0; index < overrides.Count; index += 1)
            {
                if (!string.Equals(
                        overrides[index].Key?.name,
                        slotName,
                        StringComparison.Ordinal))
                {
                    continue;
                }
                overrides[index] =
                    new KeyValuePair<AnimationClip, AnimationClip>(
                        overrides[index].Key,
                        clip);
                _overrideController.ApplyOverrides(overrides);
                _baseClipName = clip.name;
                return;
            }
        }

        public bool Play(
            AilisMotionDefinition motion,
            AnimationClip clip)
        {
            if (!IsReady || motion == null || clip == null)
            {
                return false;
            }
            switch (motion.ResolvePerformanceLayer())
            {
                case "base":
                    _baseMotionId = motion.id ?? "";
                    StartOverlay(_base, clip, motion);
                    return true;
                case "additive":
                    StartOverlay(_additive, clip, motion);
                    return true;
                case "action":
                    StartOverlay(_action, clip, motion);
                    return true;
                default:
                    StartOverlay(_gesture, clip, motion);
                    return true;
            }
        }

        private OverlayChannel CreateChannel(
            int layerIndex,
            string id,
            string label,
            AvatarMask mask,
            bool additive)
        {
            var channel = new OverlayChannel
            {
                LayerIndex = layerIndex,
                Id = id,
                Label = label,
                Mixer = AnimationMixerPlayable.Create(_graph, 3)
            };
            _graph.Connect(channel.Mixer, 0, _layerMixer, layerIndex);
            _layerMixer.SetInputWeight(layerIndex, 0f);
            _layerMixer.SetLayerAdditive((uint)layerIndex, additive);
            if (mask != null)
            {
                _layerMixer.SetLayerMaskFromAvatarMask((uint)layerIndex, mask);
            }
            return channel;
        }

        private void StartOverlay(
            OverlayChannel channel,
            AnimationClip clip,
            AilisMotionDefinition motion)
        {
            var incoming = FindIncomingSlot(channel);
            var matchedTime = ResolveMatchedStartTime(channel, motion, clip);

            var playable = AnimationClipPlayable.Create(_graph, clip);
            // Animation Rigging owns IK after the animation graph. Enabling the
            // Animator IK pass here makes two solvers fight over the same limbs.
            playable.SetApplyFootIK(false);
            playable.SetApplyPlayableIK(false);
            playable.SetDuration(Math.Max(0.2d, clip.length));
            playable.SetTime(matchedTime);
            playable.Play();
            channel.Slots[incoming] = playable;
            channel.SlotDurations[incoming] = Mathf.Max(0.2f, clip.length);
            channel.SlotLoops[incoming] = motion.loop;
            _graph.Connect(playable, 0, channel.Mixer, incoming);
            channel.Mixer.SetInputWeight(incoming, 0f);

            for (var slot = 0; slot < channel.Slots.Length; slot += 1)
            {
                channel.TransitionStartWeights[slot] =
                    slot == incoming || !channel.Slots[slot].IsValid()
                        ? 0f
                        : channel.Mixer.GetInputWeight(slot);
            }

            channel.IncomingSlot = incoming;
            channel.MotionId = motion.id ?? "";
            channel.ClipName = clip.name;
            channel.TransitionElapsed = 0f;
            channel.TransitionSeconds = ResolveTransitionSeconds(channel, motion, clip);
            channel.FadeTarget = 1f;
            channel.FadeSmoothTime = channel.TransitionSeconds;
            channel.Loop = motion.loop;
            channel.DurationSeconds = Mathf.Max(0.2f, clip.length);
            channel.EndAt = Time.unscaledTime +
                            channel.DurationSeconds;
        }

        private void Update()
        {
            if (!IsReady || _debugPaused)
            {
                return;
            }
            var delta = Mathf.Max(0f, Time.unscaledDeltaTime);
            _currentMotion = Vector2.MoveTowards(
                _currentMotion,
                _targetMotion,
                delta * 3.5f);
            _currentIntensity = Mathf.MoveTowards(
                _currentIntensity,
                _targetIntensity,
                delta * 3.5f);
            _currentSpeaking = Mathf.MoveTowards(
                _currentSpeaking,
                _targetSpeaking,
                delta * 5f);

            UpdateChannel(_base, delta);
            UpdateChannel(_additive, delta);
            UpdateChannel(_gesture, delta);
            UpdateChannel(_action, delta);
            ApplyAnimatorParameters();
        }

        private void UpdateChannel(OverlayChannel channel, float delta)
        {
            if (channel == null)
            {
                return;
            }
            if (channel.IncomingSlot >= 0)
            {
                channel.TransitionElapsed += delta;
                var amount = Mathf.Clamp01(
                    channel.TransitionElapsed /
                    Mathf.Max(0.01f, channel.TransitionSeconds));
                var eased = SmootherStep(amount);
                for (var slot = 0; slot < channel.Slots.Length; slot += 1)
                {
                    if (!channel.Slots[slot].IsValid())
                    {
                        continue;
                    }
                    channel.Mixer.SetInputWeight(
                        slot,
                        slot == channel.IncomingSlot
                            ? eased
                            : channel.TransitionStartWeights[slot] * (1f - eased));
                }
                if (amount >= 1f)
                {
                    for (var slot = 0; slot < channel.Slots.Length; slot += 1)
                    {
                        if (slot != channel.IncomingSlot)
                        {
                            DestroySlot(channel, slot);
                        }
                    }
                    channel.ActiveSlot = channel.IncomingSlot;
                    channel.IncomingSlot = -1;
                }
            }

            if (!channel.Loop &&
                channel.ActiveSlot >= 0 &&
                Time.unscaledTime >=
                channel.EndAt - channel.TransitionSeconds)
            {
                channel.FadeTarget = 0f;
            }
            channel.LayerWeight = Mathf.SmoothDamp(
                channel.LayerWeight,
                channel.FadeTarget,
                ref channel.FadeVelocity,
                Mathf.Max(0.04f, channel.FadeSmoothTime),
                Mathf.Infinity,
                delta);
            if (Mathf.Abs(channel.LayerWeight - channel.FadeTarget) <= 0.001f)
            {
                channel.LayerWeight = channel.FadeTarget;
                channel.FadeVelocity = 0f;
            }
            _layerMixer.SetInputWeight(
                channel.LayerIndex,
                channel.LayerWeight);
            if (channel.LayerWeight <= 0.005f &&
                channel.FadeTarget <= 0f &&
                HasAnySlot(channel))
            {
                for (var slot = 0; slot < channel.Slots.Length; slot += 1)
                {
                    DestroySlot(channel, slot);
                }
                channel.ActiveSlot = -1;
                channel.IncomingSlot = -1;
                channel.MotionId = "";
                channel.ClipName = "";
                channel.DurationSeconds = 0f;
            }
        }

        public AilisAnimationDebugSnapshot GetDebugSnapshot(
            string adapterId,
            string status)
        {
            return new AilisAnimationDebugSnapshot
            {
                supported = true,
                ready = IsReady,
                paused = _debugPaused,
                adapterId = adapterId ?? "",
                status = status ?? "",
                emotion = _emotionId,
                taskState = _taskState,
                gestureIntent = _gestureIntent,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                layers = new[]
                {
                    CreateBaseDebugLayer(),
                    CreateDebugLayer(_additive),
                    CreateDebugLayer(_gesture),
                    CreateDebugLayer(_action),
                    new AilisAnimationDebugLayer
                    {
                        id = "face",
                        label = "Face",
                        motionId = _emotionId,
                        clipName = _emotionId,
                        active = _currentIntensity > 0.01f,
                        loop = true,
                        weight = Mathf.Clamp01(_currentIntensity),
                        normalizedTime = Mathf.Repeat(Time.unscaledTime, 1f)
                    }
                }
            };
        }

        public bool ApplyDebugControl(AilisAnimationDebugControl control)
        {
            if (!IsReady || control == null)
            {
                return false;
            }
            var operation = (control.operation ?? "").Trim().ToLowerInvariant();
            switch (operation)
            {
                case "pause":
                    if (!_debugPaused)
                    {
                        _debugPaused = true;
                        _debugPausedAt = Time.unscaledTime;
                        _graph.Stop();
                    }
                    return true;
                case "resume":
                    if (_debugPaused)
                    {
                        var pausedSeconds =
                            Mathf.Max(0f, Time.unscaledTime - _debugPausedAt);
                        ShiftChannelEnd(_additive, pausedSeconds);
                        ShiftChannelEnd(_gesture, pausedSeconds);
                        ShiftChannelEnd(_action, pausedSeconds);
                        ShiftChannelEnd(_base, pausedSeconds);
                        _debugPaused = false;
                        _graph.Play();
                    }
                    return true;
                case "seek":
                    return SeekChannel(
                        ResolveChannel(control.layer),
                        Mathf.Clamp01(control.normalizedTime));
                case "stop":
                    return StopChannel(ResolveChannel(control.layer));
                default:
                    return false;
            }
        }

        private static bool StopChannel(OverlayChannel channel)
        {
            if (channel == null)
            {
                return false;
            }
            channel.FadeTarget = 0f;
            channel.FadeSmoothTime = 0.12f;
            channel.Loop = false;
            channel.EndAt = Time.unscaledTime;
            return true;
        }

        private float GetBaseNormalizedTime()
        {
            var slot = _base?.IncomingSlot >= 0
                ? _base.IncomingSlot
                : _base?.ActiveSlot ?? -1;
            if (_base != null &&
                slot >= 0 &&
                slot < _base.Slots.Length &&
                _base.Slots[slot].IsValid() &&
                _base.SlotDurations[slot] > 0f)
            {
                return Mathf.Repeat(
                    (float)(_base.Slots[slot].GetTime() /
                            _base.SlotDurations[slot]),
                    1f);
            }
            if (!_controllerPlayable.IsValid())
            {
                return 0f;
            }
            var state = _controllerPlayable.GetCurrentAnimatorStateInfo(0);
            return Mathf.Repeat(state.normalizedTime, 1f);
        }

        private static AilisAnimationDebugLayer CreateDebugLayer(
            OverlayChannel channel)
        {
            if (channel == null)
            {
                return new AilisAnimationDebugLayer();
            }
            var slot = channel.IncomingSlot >= 0
                ? channel.IncomingSlot
                : channel.ActiveSlot;
            var normalizedTime = 0f;
            if (slot >= 0 &&
                slot < channel.Slots.Length &&
                channel.Slots[slot].IsValid() &&
                channel.DurationSeconds > 0f)
            {
                normalizedTime = Mathf.Clamp01(
                    (float)(channel.Slots[slot].GetTime() /
                            channel.DurationSeconds));
            }
            return new AilisAnimationDebugLayer
            {
                id = channel.Id,
                label = channel.Label,
                motionId = channel.MotionId,
                clipName = channel.ClipName,
                active = channel.LayerWeight > 0.001f ||
                    channel.IncomingSlot >= 0,
                loop = channel.Loop,
                transitioning = channel.IncomingSlot >= 0,
                weight = Mathf.Clamp01(channel.LayerWeight),
                normalizedTime = normalizedTime,
                durationSeconds = channel.DurationSeconds
            };
        }

        private OverlayChannel ResolveChannel(string layer)
        {
            switch ((layer ?? "").Trim().ToLowerInvariant())
            {
                case "base":
                    return _base;
                case "additive":
                    return _additive;
                case "gesture":
                    return _gesture;
                case "action":
                    return _action;
                default:
                    return null;
            }
        }

        private static bool SeekChannel(
            OverlayChannel channel,
            float normalizedTime)
        {
            if (channel == null || channel.DurationSeconds <= 0f)
            {
                return false;
            }
            var slot = channel.IncomingSlot >= 0
                ? channel.IncomingSlot
                : channel.ActiveSlot;
            if (slot < 0 ||
                slot >= channel.Slots.Length ||
                !channel.Slots[slot].IsValid())
            {
                return false;
            }
            channel.Slots[slot].SetTime(
                channel.DurationSeconds * normalizedTime);
            if (!channel.Loop)
            {
                channel.EndAt = Time.unscaledTime +
                    channel.DurationSeconds * (1f - normalizedTime);
                channel.FadeTarget = 1f;
            }
            return true;
        }

        private static void ShiftChannelEnd(
            OverlayChannel channel,
            float seconds)
        {
            if (channel != null && !channel.Loop && channel.ActiveSlot >= 0)
            {
                channel.EndAt += seconds;
            }
        }

        private void ApplyAnimatorParameters()
        {
            if (!_controllerPlayable.IsValid())
            {
                return;
            }
            _controllerPlayable.SetFloat(
                AilisPerformanceAnimatorParameters.MotionX,
                _currentMotion.x);
            _controllerPlayable.SetFloat(
                AilisPerformanceAnimatorParameters.MotionY,
                _currentMotion.y);
            _controllerPlayable.SetFloat(
                AilisPerformanceAnimatorParameters.Intensity,
                _currentIntensity);
            _controllerPlayable.SetFloat(
                AilisPerformanceAnimatorParameters.Speaking,
                _currentSpeaking);
            _controllerPlayable.SetInteger(
                AilisPerformanceAnimatorParameters.Emotion,
                _emotion);
            _controllerPlayable.SetFloat(
                AilisPerformanceAnimatorParameters.GestureWeight,
                _gesture?.LayerWeight ?? 0f);
            _controllerPlayable.SetFloat(
                AilisPerformanceAnimatorParameters.ActionWeight,
                _action?.LayerWeight ?? 0f);
            _controllerPlayable.SetFloat(
                AilisPerformanceAnimatorParameters.FaceWeight,
                _currentIntensity);
        }

        private void ApplyBaseOverrides(
            IReadOnlyDictionary<string, AnimationClip> baseClips)
        {
            if (baseClips == null || baseClips.Count == 0)
            {
                return;
            }
            baseClips.TryGetValue(
                AilisPerformanceAnimatorParameters.IdleClip,
                out var idle);
            var overrides =
                new List<KeyValuePair<AnimationClip, AnimationClip>>();
            _overrideController.GetOverrides(overrides);
            for (var index = 0; index < overrides.Count; index += 1)
            {
                var placeholder = overrides[index].Key;
                if (placeholder == null)
                {
                    continue;
                }
                if (!baseClips.TryGetValue(placeholder.name, out var replacement))
                {
                    replacement = idle;
                }
                if (replacement != null)
                {
                    overrides[index] =
                        new KeyValuePair<AnimationClip, AnimationClip>(
                            placeholder,
                            replacement);
                }
            }
            _overrideController.ApplyOverrides(overrides);
        }

        private void DestroySlot(OverlayChannel channel, int slot)
        {
            if (slot < 0 || slot >= channel.Slots.Length)
            {
                return;
            }
            var playable = channel.Slots[slot];
            if (!playable.IsValid())
            {
                return;
            }
            channel.Mixer.DisconnectInput(slot);
            playable.Destroy();
            channel.Slots[slot] = default;
            channel.SlotDurations[slot] = 0f;
            channel.SlotLoops[slot] = false;
            channel.TransitionStartWeights[slot] = 0f;
        }

        private AilisAnimationDebugLayer CreateBaseDebugLayer()
        {
            if (_base != null &&
                (HasAnySlot(_base) || _base.IncomingSlot >= 0))
            {
                return CreateDebugLayer(_base);
            }
            return new AilisAnimationDebugLayer
            {
                id = "base",
                label = "Base",
                motionId = _baseMotionId,
                clipName = _baseClipName,
                active = IsReady,
                loop = true,
                weight = IsReady ? 1f : 0f,
                normalizedTime = GetBaseNormalizedTime()
            };
        }

        private int FindIncomingSlot(OverlayChannel channel)
        {
            for (var slot = 0; slot < channel.Slots.Length; slot += 1)
            {
                if (!channel.Slots[slot].IsValid())
                {
                    return slot;
                }
            }

            var weakestSlot = 0;
            var weakestWeight = float.PositiveInfinity;
            for (var slot = 0; slot < channel.Slots.Length; slot += 1)
            {
                var weight = channel.Mixer.GetInputWeight(slot);
                if (weight < weakestWeight)
                {
                    weakestWeight = weight;
                    weakestSlot = slot;
                }
            }
            DestroySlot(channel, weakestSlot);
            if (channel.ActiveSlot == weakestSlot)
            {
                channel.ActiveSlot = -1;
            }
            if (channel.IncomingSlot == weakestSlot)
            {
                channel.IncomingSlot = -1;
            }
            return weakestSlot;
        }

        private static double ResolveMatchedStartTime(
            OverlayChannel channel,
            AilisMotionDefinition motion,
            AnimationClip clip)
        {
            if (channel == null || motion?.loop != true || clip == null)
            {
                return 0d;
            }

            var referenceSlot = channel.IncomingSlot >= 0
                ? channel.IncomingSlot
                : channel.ActiveSlot;
            if (referenceSlot < 0 ||
                referenceSlot >= channel.Slots.Length ||
                !channel.Slots[referenceSlot].IsValid() ||
                !channel.SlotLoops[referenceSlot] ||
                channel.SlotDurations[referenceSlot] <= 0f)
            {
                return 0d;
            }
            var normalized = Mathf.Repeat(
                (float)(channel.Slots[referenceSlot].GetTime() /
                        channel.SlotDurations[referenceSlot]),
                1f);
            return normalized * Math.Max(0.2d, clip.length);
        }

        private static float ResolveTransitionSeconds(
            OverlayChannel channel,
            AilisMotionDefinition motion,
            AnimationClip clip)
        {
            var layerDefault = 0.32f;
            switch (channel?.Id)
            {
                case "base":
                    layerDefault = 0.42f;
                    break;
                case "action":
                    layerDefault = 0.4f;
                    break;
                case "additive":
                    layerDefault = 0.26f;
                    break;
            }
            var requested = Mathf.Max(0f, motion?.transitionSeconds ?? 0f);
            var duration = Mathf.Max(0.2f, clip?.length ?? 0.2f);
            var durationLimit = motion?.loop == true
                ? 0.65f
                : Mathf.Max(0.18f, duration * 0.28f);
            return Mathf.Clamp(
                Mathf.Max(requested, Mathf.Min(layerDefault, durationLimit)),
                0.18f,
                0.65f);
        }

        private static float SmootherStep(float value)
        {
            var amount = Mathf.Clamp01(value);
            return amount * amount * amount *
                   (amount * (amount * 6f - 15f) + 10f);
        }

        private static bool HasAnySlot(OverlayChannel channel)
        {
            if (channel == null)
            {
                return false;
            }
            foreach (var playable in channel.Slots)
            {
                if (playable.IsValid())
                {
                    return true;
                }
            }
            return false;
        }

        public void DisposePerformance()
        {
            if (_graph.IsValid())
            {
                _graph.Destroy();
            }
            if (_animator != null)
            {
                _animator.runtimeAnimatorController = null;
            }
        }

        private void OnDestroy()
        {
            DisposePerformance();
        }
    }
}
