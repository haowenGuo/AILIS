using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatdollKit.Model;
using UnityEngine;
using CdkAnimation = ChatdollKit.Model.Animation;

namespace Ailis.CharacterDemo
{
    public sealed class AilisChatdollKitPerformanceBridge : MonoBehaviour
    {
        private readonly HashSet<string> _registeredMotions =
            new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        private readonly HashSet<string> _idleModes =
            new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, HashSet<string>> _modeMotions =
            new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, float> _clipDurations =
            new Dictionary<string, float>(StringComparer.OrdinalIgnoreCase);
        private ModelController _modelController;
        private Animator _animator;
        private Blink _blink;
        private AilisPersonaSurface _surface = new AilisPersonaSurface();
        private string _currentIdleMode = "";

        public bool IsReady => _modelController != null && _animator != null;
        // AssetBundle characters use their package-authored blink BlendShapes.
        // ChatdollKit's face proxy is intentionally empty, so it must not claim
        // this channel and suppress the real avatar adapter blink driver.
        public bool OwnsBlink => false;
        public string Status { get; private set; } = "not_configured";

        public bool Configure(GameObject avatar, AilisCharacterPackage package)
        {
            if (avatar == null || package?.Manifest == null)
            {
                Status = "invalid_character";
                return false;
            }

            _animator = avatar.GetComponentInChildren<Animator>();
            if (_animator == null || _animator.layerCount == 0)
            {
                Status = "animator_unavailable";
                return false;
            }

            EnsureControllerComponents();
            _modelController.AvatarModel = avatar;
            _modelController.FollowAvatarPosition = false;
            _modelController.ResetAdditionalAnimatorLayers = false;
            _modelController.AnimationFadeLength = 0.2f;
            _modelController.AnimationStarted += OnAnimationStarted;

            IndexAnimatorClips();
            var baseLayerName = _animator.GetLayerName(0);
            foreach (var motion in package.Manifest.motions ?? Array.Empty<AilisMotionDefinition>())
            {
                RegisterMotion(motion, baseLayerName);
            }

            if (_registeredMotions.Count == 0)
            {
                Status = "no_compatible_motions";
                return false;
            }

            _modelController.ActivateAvatar(avatar, false);
            Status = "ready";
            Debug.Log(
                "[AILIS ChatdollKit] Performance runtime ready: motions=" +
                _registeredMotions.Count +
                ", idleModes=" +
                _idleModes.Count +
                ", blink=" +
                OwnsBlink);
            return true;
        }

        public void ApplySurface(AilisPersonaSurface surface)
        {
            _surface = surface ?? new AilisPersonaSurface();
        }

        public async Task<bool> PlayMotionAsync(AilisMotionDefinition motion)
        {
            if (!IsReady || motion == null || !_registeredMotions.Contains(motion.id))
            {
                return false;
            }

            _modelController.AnimationFadeLength = Mathf.Clamp(
                motion.transitionSeconds,
                0.04f,
                1.2f);

            if (motion.loop && _idleModes.Contains(motion.id))
            {
                var idleMode = ResolveIdleMode(motion);
                if (string.Equals(
                        idleMode,
                        _currentIdleMode,
                        StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
                await _modelController.ChangeIdlingModeAsync(idleMode);
                _currentIdleMode = idleMode;
            }
            else
            {
                _modelController.Animate(
                    new List<CdkAnimation>
                    {
                        _modelController.GetRegisteredAnimation(motion.id)
                    });
            }

            Status = "playing:" + motion.id;
            Debug.Log("[AILIS ChatdollKit] Motion scheduled: " + motion.id);
            return true;
        }

        private void EnsureControllerComponents()
        {
            if (GetComponent<AilisChatdollKitFaceProxy>() == null)
            {
                gameObject.AddComponent<AilisChatdollKitFaceProxy>();
            }
            if (GetComponent<AilisChatdollKitLipSyncProxy>() == null)
            {
                gameObject.AddComponent<AilisChatdollKitLipSyncProxy>();
            }

            _blink = GetComponent<Blink>() ?? gameObject.AddComponent<Blink>();
            if (GetComponent<FaceController>() == null)
            {
                gameObject.AddComponent<FaceController>();
            }

            _modelController =
                GetComponent<ModelController>() ?? gameObject.AddComponent<ModelController>();
        }

        private void RegisterMotion(AilisMotionDefinition motion, string baseLayerName)
        {
            if (motion == null || string.IsNullOrWhiteSpace(motion.id))
            {
                return;
            }

            var stateName = string.IsNullOrWhiteSpace(motion.stateName)
                ? motion.id
                : motion.stateName;
            var stateHash = Animator.StringToHash(stateName);
            if (!_animator.HasState(0, stateHash))
            {
                Debug.LogWarning(
                    "[AILIS ChatdollKit] Skipping missing Animator state: " + stateName);
                return;
            }

            var animation = new CdkAnimation(
                string.Empty,
                0,
                ResolveMotionDuration(motion, stateName),
                stateName,
                baseLayerName);
            _modelController.RegisterAnimation(motion.id, animation);
            _registeredMotions.Add(motion.id);

            if (!motion.loop)
            {
                return;
            }

            var weight = Mathf.Clamp(1 + motion.priority, 1, 8);
            // Review motions remain directly playable in Character Lab, but they
            // must not enter automatic semantic or ambient idle scheduling.
            AddIdleMode(motion.id, motion.id, animation, weight);
            if (!motion.IsApproved)
            {
                return;
            }
            AddSemanticIdleModes(
                "gesture",
                motion.gestureIntents,
                motion.id,
                animation,
                weight);
            AddSemanticIdleModes(
                "task",
                motion.taskStates,
                motion.id,
                animation,
                weight);
            AddSemanticIdleModes(
                "emotion",
                motion.emotions,
                motion.id,
                animation,
                weight);
            if (IsAmbientIdle(motion))
            {
                AddIdleMode("normal", motion.id, animation, weight);
            }
        }

        private void IndexAnimatorClips()
        {
            _clipDurations.Clear();
            foreach (var clip in _animator.runtimeAnimatorController?.animationClips ??
                     Array.Empty<AnimationClip>())
            {
                if (clip != null &&
                    !string.IsNullOrWhiteSpace(clip.name) &&
                    clip.length > 0f)
                {
                    _clipDurations[clip.name] = clip.length;
                }
            }
        }

        private float ResolveMotionDuration(
            AilisMotionDefinition motion,
            string stateName)
        {
            var fallback = Mathf.Max(0.25f, motion.fallbackDurationSeconds);
            if (!TryResolveClipDuration(stateName, out var clipDuration))
            {
                Debug.LogWarning(
                    "[AILIS ChatdollKit] Clip duration unavailable for state " +
                    stateName +
                    "; using manifest fallback " +
                    fallback.ToString("0.000") +
                    "s.");
                return fallback;
            }

            // Loop definitions use the manifest value as a minimum hold time.
            // One-shot actions use the authored clip length so they return to idle
            // when the source animation actually ends.
            var resolved = motion.loop
                ? Mathf.Max(fallback, clipDuration)
                : Mathf.Max(0.25f, clipDuration);
            Debug.Log(
                "[AILIS ChatdollKit] Motion duration resolved: " +
                motion.id +
                " -> " +
                resolved.ToString("0.000") +
                "s (clip=" +
                clipDuration.ToString("0.000") +
                "s).");
            return resolved;
        }

        private bool TryResolveClipDuration(string stateName, out float duration)
        {
            if (_clipDurations.TryGetValue(stateName, out duration))
            {
                return true;
            }

            var stateKey = NormalizeAnimationName(stateName);
            foreach (var pair in _clipDurations)
            {
                var clipKey = NormalizeAnimationName(pair.Key);
                if (clipKey == stateKey ||
                    clipKey.EndsWith(stateKey, StringComparison.Ordinal) ||
                    stateKey.EndsWith(clipKey, StringComparison.Ordinal))
                {
                    duration = pair.Value;
                    return true;
                }
            }

            duration = 0f;
            return false;
        }

        private static string NormalizeAnimationName(string value)
        {
            return new string((value ?? "")
                .Where(char.IsLetterOrDigit)
                .Select(char.ToLowerInvariant)
                .ToArray());
        }

        private void AddSemanticIdleModes(
            string category,
            IEnumerable<string> values,
            string motionId,
            CdkAnimation animation,
            int weight)
        {
            foreach (var value in values ?? Array.Empty<string>())
            {
                var normalized = NormalizeSemantic(value);
                if (!string.IsNullOrWhiteSpace(normalized))
                {
                    AddIdleMode(category + ":" + normalized, motionId, animation, weight);
                }
            }
        }

        private void AddIdleMode(
            string mode,
            string motionId,
            CdkAnimation animation,
            int weight)
        {
            if (!_modeMotions.TryGetValue(mode, out var motions))
            {
                motions = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                _modeMotions[mode] = motions;
            }
            if (!motions.Add(motionId))
            {
                return;
            }

            _modelController.AddIdleAnimation(animation, weight, mode);
            _idleModes.Add(mode);
        }

        private string ResolveIdleMode(AilisMotionDefinition motion)
        {
            if (IsAmbientIdle(motion) && IsAmbientSurface(_surface))
            {
                return "normal";
            }

            foreach (var gestureIntent in AilisPersonaSemantics.ResolveGestureIntents(_surface))
            {
                var gestureMode = "gesture:" + NormalizeSemantic(gestureIntent);
                if (ModeContainsMotion(gestureMode, motion.id))
                {
                    return gestureMode;
                }
            }

            var taskMode = "task:" + NormalizeSemantic(_surface?.taskState);
            if (ModeContainsMotion(taskMode, motion.id))
            {
                return taskMode;
            }

            var emotionMode = "emotion:" + NormalizeSemantic(_surface?.emotion);
            if (ModeContainsMotion(emotionMode, motion.id))
            {
                return emotionMode;
            }

            return motion.id;
        }

        private static bool IsAmbientSurface(AilisPersonaSurface surface)
        {
            var taskState = NormalizeSemantic(surface?.taskState);
            return string.IsNullOrWhiteSpace(taskState) ||
                taskState == "idle" ||
                taskState == "listening" ||
                taskState == "speaking";
        }

        private bool ModeContainsMotion(string mode, string motionId)
        {
            return _modeMotions.TryGetValue(mode, out var motions) &&
                   motions.Contains(motionId);
        }

        private static string NormalizeSemantic(string value)
        {
            return (value ?? "")
                .Trim()
                .ToLowerInvariant()
                .Replace('-', '_')
                .Replace(' ', '_');
        }

        private static void OnAnimationStarted(CdkAnimation animation, string mode)
        {
            Debug.Log(
                "[AILIS ChatdollKit] Animator state started: " +
                (animation?.LayeredAnimationName ?? "(parameter)") +
                ", mode=" +
                mode +
                ", duration=" +
                (animation?.Duration ?? 0f).ToString("0.000") +
                ", runtime=" +
                Time.realtimeSinceStartup.ToString("0.000"));
        }

        private static bool IsAmbientIdle(AilisMotionDefinition motion)
        {
            if (motion.id.StartsWith("idle", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return (motion.taskStates ?? Array.Empty<string>()).Any(
                state =>
                    string.Equals(state, "idle", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(state, "listening", StringComparison.OrdinalIgnoreCase));
        }

        private void OnDestroy()
        {
            if (_modelController != null)
            {
                _modelController.AnimationStarted -= OnAnimationStarted;
            }
        }
    }

    internal sealed class AilisChatdollKitFaceProxy : MonoBehaviour, IFaceExpressionProxy
    {
        public void Setup(GameObject avatarObject)
        {
        }

        public void SetExpression(string name = "Neutral", float value = 1f)
        {
        }

        public void SetExpressionSmoothly(string name = "Neutral", float value = 1f)
        {
        }
    }

    internal sealed class AilisChatdollKitLipSyncProxy : MonoBehaviour, ILipSyncHelper
    {
        public void ConfigureViseme(GameObject avatarObject)
        {
        }

        public void ResetViseme()
        {
        }
    }
}
