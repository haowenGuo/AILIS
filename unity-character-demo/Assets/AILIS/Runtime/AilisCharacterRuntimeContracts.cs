using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    public interface IAilisAvatarAdapter
    {
        string AdapterId { get; }
        string Status { get; }
        bool IsLoaded { get; }
        Task LoadAsync(AilisCharacterPackage package);
        void ApplySurface(AilisPersonaSurface surface);
        void ApplyLip(AilisLipFrame frame);
        Task<bool> PlayMotionAsync(AilisMotionDefinition motion);
        bool TryGetWorldBounds(out Bounds bounds);
        Vector3 GetBubbleAnchorWorldPosition();
        void DisposeAvatar();
    }

    public interface IAilisAvatarRenderingAdapter
    {
        void ApplyRenderingSettings(AilisRendererSettings settings);
    }

    public interface IAilisAnimationDebugAdapter
    {
        AilisAnimationDebugSnapshot GetAnimationDebugSnapshot();
        bool ApplyAnimationDebugControl(AilisAnimationDebugControl control);
    }

    [Serializable]
    public sealed class AilisAnimationDebugLayer
    {
        public string id = "";
        public string label = "";
        public string motionId = "";
        public string clipName = "";
        public bool active;
        public bool loop;
        public bool transitioning;
        public float weight;
        public float normalizedTime;
        public float durationSeconds;
    }

    [Serializable]
    public sealed class AilisAnimationDebugWeight
    {
        public string id = "";
        public float weight;
    }

    [Serializable]
    public sealed class AilisAnimationDebugSnapshot
    {
        public string schema = "ailis.animation-debug.v1";
        public bool supported;
        public bool ready;
        public bool paused;
        public string adapterId = "";
        public string status = "";
        public string emotion = "";
        public string taskState = "";
        public string gestureIntent = "";
        public bool speechActive;
        public string lipMode = "";
        public string activeViseme = "";
        public float activeVisemeWeight;
        public long timestamp;
        public AilisAnimationDebugLayer[] layers =
            Array.Empty<AilisAnimationDebugLayer>();
        public AilisAnimationDebugWeight[] expressionWeights =
            Array.Empty<AilisAnimationDebugWeight>();
        public AilisAnimationDebugWeight[] visemeWeights =
            Array.Empty<AilisAnimationDebugWeight>();
    }

    [Serializable]
    public sealed class AilisAnimationDebugControl
    {
        public string operation = "";
        public string layer = "";
        public float normalizedTime;
    }

    public static class AilisAvatarAdapterRegistry
    {
        private static readonly Dictionary<string, Func<GameObject, IAilisAvatarAdapter>> Factories =
            new Dictionary<string, Func<GameObject, IAilisAvatarAdapter>>(StringComparer.OrdinalIgnoreCase);

        public static void Register(string adapterId, Func<GameObject, IAilisAvatarAdapter> factory)
        {
            if (string.IsNullOrWhiteSpace(adapterId))
            {
                throw new ArgumentException("Adapter id is required.", nameof(adapterId));
            }
            Factories[adapterId.Trim()] = factory ?? throw new ArgumentNullException(nameof(factory));
        }

        public static IAilisAvatarAdapter Create(string adapterId, GameObject host)
        {
            var normalized = string.IsNullOrWhiteSpace(adapterId) ? "vrm" : adapterId.Trim();
            if (!Factories.TryGetValue(normalized, out var factory))
            {
                throw new NotSupportedException(
                    "Character adapter is not installed: " + normalized +
                    ". Install an adapter package or use a registered package type.");
            }
            return factory(host);
        }

        public static string[] GetRegisteredAdapterIds()
        {
            var ids = new string[Factories.Count];
            Factories.Keys.CopyTo(ids, 0);
            Array.Sort(ids, StringComparer.OrdinalIgnoreCase);
            return ids;
        }
    }

    [Serializable]
    public sealed class AilisLipFrame
    {
        public string mode = "energy";
        public string viseme = "aa";
        public float weight;
        public float durationSeconds = 0.12f;
        public long timestamp;
    }

    [Serializable]
    public sealed class AilisAudioSampleFrame
    {
        public string encoding = "pcm_s16le_base64";
        public string samplesBase64 = "";
        public int sampleRate = 48000;
        public int channels = 1;
        public long sequence;
        public long timestamp;
    }
}
