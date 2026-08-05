using System;
using System.IO;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    [Serializable]
    public sealed class AilisRendererSettings
    {
        public string schema = "ailis.character-renderer-settings.v4";
        public int performanceTuningVersion = 2;

        // UniversalRenderPipelineAsset
        public string pipelineAsset = "balanced";
        public float renderScale = 1f;
        public int msaaSampleCount = 4;
        public bool adaptiveSupersampling = true;
        public float shadowDistance = 12f;
        public int shadowCascadeCount = 2;

        // UniversalAdditionalCameraData and VolumeProfile
        public string cameraAntialiasing = "none";
        public string cameraAntialiasingQuality = "medium";
        public bool renderPostProcessing;
        public float postExposure;
        public float contrast;
        public float saturation;
        public float bloomIntensity;

        // UniVRM MToon material controls. Values are applied relative to each
        // material's authored outline so character-specific styling is retained.
        public float mtoonOutlineWidthMultiplier = 0.75f;
        public float mtoonOutlineColorBlend = 0.58f;

        // Application and Camera
        public int targetFrameRate = 60;
        public string cameraFramingMode = "full-body";
        public float cameraFieldOfView = 38f;
        public float cameraDistance = 2.15f;
        public float cameraHeight = 1.3f;
        public float cameraTargetHeight = 1.18f;
        public float cameraHorizontalOffset;
        public float framingPadding = 1.14f;
        public float framingVerticalBias = 0.02f;

        // RenderSettings and Light components
        public float ambientIntensity = 1.05f;
        public bool mainLightShadows = true;
        public float mainLightShadowStrength = 0.45f;
        public float keyLightIntensity = 1.1f;
        public float keyLightYaw = 160f;
        public float keyLightPitch = 30f;
        public string keyLightColor = "#FFF2E8";
        public float fillLightIntensity = 0.78f;
        public string fillLightColor = "#E8EEFF";
        public float rimLightIntensity = 0.58f;
        public string rimLightColor = "#CFE7FF";

        public bool showDebugOverlay;
        public string lipSyncMode = "energy";

        public void Normalize()
        {
            pipelineAsset = NormalizeOption(
                pipelineAsset,
                "balanced",
                "performance",
                "balanced",
                "quality");
            renderScale = Mathf.Clamp(renderScale, 0.5f, 2f);
            msaaSampleCount = NormalizeMsaa(msaaSampleCount);
            shadowDistance = Mathf.Clamp(shadowDistance, 0f, 100f);
            shadowCascadeCount = Mathf.Clamp(shadowCascadeCount, 1, 4);
            cameraAntialiasing = NormalizeOption(
                cameraAntialiasing,
                "none",
                "none",
                "fxaa",
                "smaa");
            cameraAntialiasingQuality = NormalizeOption(
                cameraAntialiasingQuality,
                "medium",
                "low",
                "medium",
                "high");
            postExposure = Mathf.Clamp(postExposure, -5f, 5f);
            contrast = Mathf.Clamp(contrast, -100f, 100f);
            saturation = Mathf.Clamp(saturation, -100f, 100f);
            bloomIntensity = Mathf.Clamp(bloomIntensity, 0f, 10f);
            mtoonOutlineWidthMultiplier = Mathf.Clamp(mtoonOutlineWidthMultiplier, 0f, 1.5f);
            mtoonOutlineColorBlend = Mathf.Clamp01(mtoonOutlineColorBlend);

            targetFrameRate = Mathf.Clamp(targetFrameRate, 24, 240);
            cameraFramingMode = NormalizeOption(
                cameraFramingMode,
                "full-body",
                "full-body",
                "manual");
            cameraFieldOfView = Mathf.Clamp(cameraFieldOfView, 20f, 70f);
            cameraDistance = Mathf.Clamp(cameraDistance, 0.8f, 5f);
            cameraHeight = Mathf.Clamp(cameraHeight, 0.2f, 3.5f);
            cameraTargetHeight = Mathf.Clamp(cameraTargetHeight, 0.1f, 3f);
            cameraHorizontalOffset = Mathf.Clamp(cameraHorizontalOffset, -1.5f, 1.5f);
            framingPadding = Mathf.Clamp(framingPadding, 1.01f, 2f);
            framingVerticalBias = Mathf.Clamp(framingVerticalBias, -0.5f, 0.5f);

            ambientIntensity = Mathf.Clamp(ambientIntensity, 0f, 2f);
            mainLightShadowStrength = Mathf.Clamp01(mainLightShadowStrength);
            keyLightIntensity = Mathf.Clamp(keyLightIntensity, 0f, 3f);
            keyLightYaw = Mathf.Clamp(keyLightYaw, -180f, 180f);
            keyLightPitch = Mathf.Clamp(keyLightPitch, -10f, 85f);
            fillLightIntensity = Mathf.Clamp(fillLightIntensity, 0f, 2f);
            rimLightIntensity = Mathf.Clamp(rimLightIntensity, 0f, 2f);
            keyLightColor = NormalizeColor(keyLightColor, "#FFF2E8");
            fillLightColor = NormalizeColor(fillLightColor, "#E8EEFF");
            rimLightColor = NormalizeColor(rimLightColor, "#CFE7FF");

        }

        public void ApplyPipelineProfile(string profile)
        {
            pipelineAsset = string.IsNullOrWhiteSpace(profile)
                ? pipelineAsset
                : profile.Trim().ToLowerInvariant();
            switch (pipelineAsset)
            {
                case "performance":
                    targetFrameRate = 60;
                    renderScale = 0.85f;
                    msaaSampleCount = 2;
                    shadowDistance = 8f;
                    shadowCascadeCount = 1;
                    break;
                case "quality":
                    targetFrameRate = 60;
                    renderScale = 1f;
                    msaaSampleCount = 4;
                    shadowDistance = 18f;
                    shadowCascadeCount = 4;
                    break;
                default:
                    pipelineAsset = "balanced";
                    targetFrameRate = 60;
                    renderScale = 1f;
                    msaaSampleCount = 4;
                    shadowDistance = 12f;
                    shadowCascadeCount = 2;
                    break;
            }
            Normalize();
        }

        private static int NormalizeMsaa(int value)
        {
            if (value >= 8) return 8;
            if (value >= 4) return 4;
            if (value >= 2) return 2;
            return 1;
        }

        private static string NormalizeOption(string value, string fallback, params string[] options)
        {
            var normalized = string.IsNullOrWhiteSpace(value) ? "" : value.Trim().ToLowerInvariant();
            foreach (var option in options)
            {
                if (string.Equals(normalized, option, StringComparison.OrdinalIgnoreCase))
                {
                    return option;
                }
            }
            return fallback;
        }

        private static string NormalizeColor(string value, string fallback)
        {
            return ColorUtility.TryParseHtmlString(value, out _) ? value.ToUpperInvariant() : fallback;
        }
    }

    public static class AilisRendererSettingsStore
    {
        private const string CurrentSchema = "ailis.character-renderer-settings.v3";

        public static string PersistentPath => Path.Combine(
            Application.persistentDataPath,
            "character-renderer-settings.json");

        public static AilisRendererSettings Load(string packagedDefaultsPath)
        {
            var persisted = LoadFromPath(PersistentPath);
            if (persisted != null)
            {
                return persisted;
            }
            return LoadFromPath(packagedDefaultsPath) ?? new AilisRendererSettings();
        }

        public static AilisRendererSettings LoadFromPath(string path)
        {
            AilisRendererSettings settings = null;
            if (!string.IsNullOrWhiteSpace(path) && File.Exists(path))
            {
                try
                {
                    settings = JsonUtility.FromJson<AilisRendererSettings>(File.ReadAllText(path));
                    if (!string.Equals(settings?.schema, CurrentSchema, StringComparison.Ordinal))
                    {
                        settings = null;
                    }
                }
                catch (Exception error)
                {
                    Debug.LogWarning("[AILIS Renderer] Settings load failed: " + error.Message);
                }
            }
            if (settings == null)
            {
                return null;
            }
            settings.Normalize();
            return settings;
        }

        public static void Save(AilisRendererSettings settings)
        {
            settings.Normalize();
            Directory.CreateDirectory(Path.GetDirectoryName(PersistentPath) ?? Application.persistentDataPath);
            File.WriteAllText(PersistentPath, JsonUtility.ToJson(settings, true));
        }
    }
}
