using System;
using UnityEngine;
using ULipSyncComponent = uLipSync.uLipSync;
using ULipSyncInfo = uLipSync.LipSyncInfo;
using ULipSyncProfile = uLipSync.Profile;

namespace Ailis.CharacterDemo
{
    public sealed class AilisPcmLipSyncDriver : MonoBehaviour
    {
        private const string ProfileResourcePath =
            "AILIS/LipSync/uLipSync-Profile-Female";
        private const float SilenceTimeoutSeconds = 0.24f;

        private IAilisAvatarAdapter _avatar;
        private ULipSyncComponent _lipSync;
        private long _lastSequence = -1;
        private float _lastSamplesAt;
        private bool _speechActive;
        private bool _loggedSamplesForSpeech;

        public string Status { get; private set; } = "not_configured";

        public bool Configure(IAilisAvatarAdapter avatar)
        {
            _avatar = avatar;
            var profile = Resources.Load<ULipSyncProfile>(ProfileResourcePath);
            if (profile == null)
            {
                Status = "profile_missing";
                return false;
            }

            _lipSync = gameObject.AddComponent<ULipSyncComponent>();
            _lipSync.enabled = false;
            _lipSync.profile = profile;
            _lipSync.outputSoundGain = 0f;
            _lipSync.onLipSyncUpdate.AddListener(HandleLipSyncUpdate);
            _lipSync.enabled = true;
            Status = "ready";
            Debug.Log(
                "[AILIS LipSync] uLipSync ready: profile=" +
                profile.name +
                ", outputSampleRate=" +
                AudioSettings.outputSampleRate);
            return true;
        }

        public void BeginSpeech()
        {
            _speechActive = true;
            _lastSequence = -1;
            _lastSamplesAt = Time.unscaledTime;
            _loggedSamplesForSpeech = false;
            ApplySilence();
        }

        public void PushSamples(AilisAudioSampleFrame frame)
        {
            if (_lipSync == null ||
                frame == null ||
                string.IsNullOrWhiteSpace(frame.samplesBase64) ||
                frame.sequence <= _lastSequence)
            {
                return;
            }

            try
            {
                var bytes = Convert.FromBase64String(frame.samplesBase64);
                if (bytes.Length < 2)
                {
                    return;
                }
                var samples = DecodePcm16(bytes);
                var sourceRate = Mathf.Max(8000, frame.sampleRate);
                if (sourceRate != AudioSettings.outputSampleRate)
                {
                    samples = ResampleLinear(
                        samples,
                        sourceRate,
                        AudioSettings.outputSampleRate);
                }
                _lastSequence = frame.sequence;
                _lastSamplesAt = Time.unscaledTime;
                _speechActive = true;
                _lipSync.OnDataReceived(samples, 1);
                if (!_loggedSamplesForSpeech)
                {
                    _loggedSamplesForSpeech = true;
                    Debug.Log(
                        "[AILIS LipSync] PCM stream received: samples=" +
                        samples.Length +
                        ", sourceRate=" +
                        sourceRate +
                        ", analysisRate=" +
                        AudioSettings.outputSampleRate);
                }
            }
            catch (Exception error)
            {
                Status = "sample_error:" + error.Message;
            }
        }

        public void EndSpeech()
        {
            _speechActive = false;
            _lastSequence = -1;
            ApplySilence();
        }

        private void Update()
        {
            if (_speechActive &&
                Time.unscaledTime - _lastSamplesAt > SilenceTimeoutSeconds)
            {
                ApplySilence();
            }
        }

        private void HandleLipSyncUpdate(ULipSyncInfo info)
        {
            if (!_speechActive || _avatar == null)
            {
                return;
            }

            var weight = Mathf.Clamp01(info.volume);
            _avatar.ApplyLip(new AilisLipFrame
            {
                mode = "viseme",
                viseme = MapPhoneme(info.phoneme),
                weight = weight,
                durationSeconds = 0.12f,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            });
        }

        private void ApplySilence()
        {
            _avatar?.ApplyLip(new AilisLipFrame
            {
                mode = "viseme",
                viseme = "aa",
                weight = 0f,
                durationSeconds = 0.08f,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            });
        }

        private static float[] DecodePcm16(byte[] bytes)
        {
            var samples = new float[bytes.Length / 2];
            for (var index = 0; index < samples.Length; index++)
            {
                var value = (short)(bytes[index * 2] | bytes[index * 2 + 1] << 8);
                samples[index] = value / 32768f;
            }
            return samples;
        }

        private static float[] ResampleLinear(float[] source, int sourceRate, int targetRate)
        {
            if (source.Length < 2 || sourceRate == targetRate)
            {
                return source;
            }
            var targetLength = Mathf.Max(
                1,
                Mathf.RoundToInt(source.Length * (float)targetRate / sourceRate));
            var target = new float[targetLength];
            var scale = (source.Length - 1f) / Mathf.Max(1, targetLength - 1);
            for (var index = 0; index < targetLength; index++)
            {
                var position = index * scale;
                var left = Mathf.FloorToInt(position);
                var right = Mathf.Min(source.Length - 1, left + 1);
                target[index] = Mathf.Lerp(source[left], source[right], position - left);
            }
            return target;
        }

        private static string MapPhoneme(string phoneme)
        {
            switch ((phoneme ?? "").Trim().ToUpperInvariant())
            {
                case "I": return "ih";
                case "U": return "ou";
                case "E": return "ee";
                case "O": return "oh";
                default: return "aa";
            }
        }

        private void OnDestroy()
        {
            if (_lipSync != null)
            {
                _lipSync.onLipSyncUpdate.RemoveListener(HandleLipSyncUpdate);
            }
        }
    }
}
