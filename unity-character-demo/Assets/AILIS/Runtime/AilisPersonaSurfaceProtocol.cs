using System;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    [Serializable]
    public sealed class AilisPersonaSurface
    {
        public string emotion = "relaxed";
        public string taskState = "idle";
        public string gestureIntent = "none";
        public string[] gestureFallbacks = Array.Empty<string>();
        public string gazeTarget = "user";
        public string socialTone = "soft";
        public string durationHint = "short";
        public float intensity = 0.35f;
        public float speechEnergy;
        public string speechText = "";
        public float speechDurationSeconds;
    }

    [Serializable]
    public sealed class AilisPersonaSurfaceMessage
    {
        public string type = "persona.surface";
        public string requestId = "";
        public AilisPersonaSurface surface = new AilisPersonaSurface();
    }

    [Serializable]
    public sealed class AilisActionPayload
    {
        public string motionId = "";
    }

    [Serializable]
    public sealed class AilisRendererWindow
    {
        public int x;
        public int y;
        public int width;
        public int height;
        public string phase = "sync";
    }

    [Serializable]
    public sealed class AilisRendererCapture
    {
        public string path = "";
        public int superSize = 1;
    }

    [Serializable]
    public sealed class AilisCharacterMessage
    {
        public string type = "";
        public string requestId = "";
        public string mode = "";
        public AilisPersonaSurface surface;
        public AilisActionPayload action;
        public AilisLipFrame lip;
        public AilisAudioSampleFrame audio;
        public AilisRendererSettings renderer;
        public AilisRendererWindow window;
        public AilisRendererCapture capture;
        public AilisAnimationDebugControl animationDebug;
    }

    [Serializable]
    public sealed class AilisRendererEvent
    {
        public string type;
        public string action;
        public string source;
        public string shape;
        public string requestId;
        public string status;
        public string detail;
        public bool complete;
        public long timestamp;
        public float x;
        public float y;
        public float width;
        public float height;
        public string maskEncoding;
        public string mask;
        public int maskWidth;
        public int maskHeight;
        public AilisAnimationDebugSnapshot animation;
    }

    public static class AilisPersonaSurfaceProtocol
    {
        public const int DefaultPort = 19131;

        public static bool TryParse(string json, out AilisCharacterMessage message)
        {
            message = null;
            if (string.IsNullOrWhiteSpace(json))
            {
                return false;
            }

            try
            {
                message = JsonUtility.FromJson<AilisCharacterMessage>(json);
                if (message == null || string.IsNullOrWhiteSpace(message.type))
                {
                    return false;
                }

                switch (message.type)
                {
                    case "persona.surface":
                        return message.surface != null;
                    case "persona.lip":
                        return message.lip != null;
                    case "persona.audio.samples":
                        return message.audio != null &&
                            !string.IsNullOrWhiteSpace(message.audio.samplesBase64);
                    case "persona.speech.start":
                    case "persona.speech.stop":
                        return true;
                    case "character.action":
                        return message.action != null && !string.IsNullOrWhiteSpace(message.action.motionId);
                    case "character.animation.state.request":
                        return true;
                    case "character.animation.control":
                        return message.animationDebug != null &&
                            !string.IsNullOrWhiteSpace(message.animationDebug.operation);
                    case "renderer.configure":
                        return message.renderer != null;
                    case "renderer.window":
                        return message.window != null;
                    case "renderer.capture.request":
                        return message.capture != null &&
                            !string.IsNullOrWhiteSpace(message.capture.path);
                    case "renderer.status.request":
                        return true;
                    default:
                        return false;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
