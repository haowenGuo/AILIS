using System;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    public static class AilisPerformanceAnimatorParameters
    {
        public const string MotionX = "AILIS.MotionX";
        public const string MotionY = "AILIS.MotionY";
        public const string Intensity = "AILIS.Intensity";
        public const string Speaking = "AILIS.Speaking";
        public const string Emotion = "AILIS.Emotion";
        public const string GestureWeight = "AILIS.GestureWeight";
        public const string ActionWeight = "AILIS.ActionWeight";
        public const string FaceWeight = "AILIS.FaceWeight";

        public const string IdleClip = "AILIS_Idle";
        public const string SpeakingClip = "AILIS_Speaking";
        public const string ThinkingClip = "AILIS_Thinking";
        public const string WorkingClip = "AILIS_Working";
        public const string AdditiveClip = "AILIS_Additive";
        public const string GestureClip = "AILIS_Gesture";
        public const string ActionClip = "AILIS_Action";
        public const string FaceClip = "AILIS_Face";

        public static Vector2 ResolveMotionBlend(AilisPersonaSurface surface)
        {
            var taskState = (surface?.taskState ?? "idle").Trim().ToLowerInvariant();
            switch (taskState)
            {
                case "speaking":
                case "presenting":
                    return new Vector2(1f, 0f);
                case "thinking":
                case "planning":
                    return new Vector2(0f, 1f);
                case "working":
                case "executing":
                case "processing":
                    return new Vector2(-1f, 0f);
                default:
                    return Vector2.zero;
            }
        }

        public static int ResolveEmotion(AilisPersonaSurface surface)
        {
            switch ((surface?.emotion ?? "relaxed").Trim().ToLowerInvariant())
            {
                case "happy":
                case "joy":
                case "excited":
                    return 1;
                case "sad":
                case "sorrow":
                    return 2;
                case "angry":
                    return 3;
                case "surprised":
                    return 4;
                case "shy":
                    return 5;
                case "thinking":
                case "curious":
                    return 6;
                default:
                    return 0;
            }
        }

        public static string ResolveBaseSlot(AilisMotionDefinition motion)
        {
            if (motion == null)
            {
                return IdleClip;
            }
            if (motion.MatchesTaskState("thinking") ||
                motion.MatchesTaskState("planning"))
            {
                return ThinkingClip;
            }
            if (motion.MatchesTaskState("working") ||
                motion.MatchesTaskState("executing") ||
                motion.MatchesTaskState("processing"))
            {
                return WorkingClip;
            }
            if (motion.MatchesTaskState("speaking") ||
                motion.MatchesTaskState("presenting"))
            {
                return SpeakingClip;
            }
            return IdleClip;
        }

        public static string ResolveVrmaClipResource(
            string packageId,
            string motionId)
        {
            return "AILIS/Animation/VRMA/" +
                   SanitizeResourceSegment(packageId) + "/" +
                   SanitizeResourceSegment(motionId);
        }

        private static string SanitizeResourceSegment(string value)
        {
            var source = string.IsNullOrWhiteSpace(value)
                ? "default"
                : value.Trim();
            var characters = source.ToCharArray();
            for (var index = 0; index < characters.Length; index += 1)
            {
                var character = characters[index];
                if (!char.IsLetterOrDigit(character) &&
                    character != '-' &&
                    character != '_')
                {
                    characters[index] = '_';
                }
            }
            return new string(characters);
        }
    }
}
