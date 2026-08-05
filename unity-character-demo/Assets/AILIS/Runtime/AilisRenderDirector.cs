using System;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace Ailis.CharacterDemo
{
    public sealed class AilisRenderDirector : MonoBehaviour
    {
        private const string PipelineResourcePrefix = "AILIS/Rendering/AILIS_URP_";
        private const string VolumeResourcePath = "AILIS/Rendering/AILIS_Volume";
        private const float SupersamplingReferenceHeight = 960f;

        private GameObject _lightRoot;
        private GameObject _volumeRoot;
        private UniversalRenderPipelineAsset _runtimePipeline;
        private VolumeProfile _runtimeVolumeProfile;
        private UniversalAdditionalCameraData _cameraData;
        private ColorAdjustments _colorAdjustments;
        private Bloom _bloom;
        private int _outputWidth = 720;
        private int _outputHeight = 960;
        private int _effectiveMsaa = 4;

        public Camera PortraitCamera { get; private set; }
        public AilisRendererSettings Settings { get; private set; }

        public bool SetOutputSize(int width, int height)
        {
            var nextWidth = Mathf.Max(1, width);
            var nextHeight = Mathf.Max(1, height);
            if (_outputWidth == nextWidth && _outputHeight == nextHeight)
            {
                return false;
            }
            _outputWidth = nextWidth;
            _outputHeight = nextHeight;
            return true;
        }

        public Camera Initialize(AilisRendererSettings settings, AilisArtProfile art)
        {
            Settings = settings ?? new AilisRendererSettings();
            Settings.Normalize();
            PortraitCamera = CreateCamera();
            CreateGlobalVolume();
            Apply(Settings, art ?? new AilisArtProfile(), resizeWindow: false);
            return PortraitCamera;
        }

        public void Apply(AilisRendererSettings settings, AilisArtProfile art, bool resizeWindow)
        {
            Settings = settings ?? Settings ?? new AilisRendererSettings();
            Settings.Normalize();
            Application.runInBackground = true;
            Application.targetFrameRate = Settings.targetFrameRate;
            QualitySettings.vSyncCount = 0;
            QualitySettings.anisotropicFiltering = AnisotropicFiltering.ForceEnable;
            QualitySettings.globalTextureMipmapLimit = 0;
            var preserveFrameAlpha = !Application.isEditor &&
                AilisTransparentWindowBridge.SupportsFrameAlphaComposition();
            ApplyRenderPipeline(Settings, preserveFrameAlpha);
            ApplyCameraRendering(Settings, preserveFrameAlpha);
            ApplyVolume(Settings);
            ApplyArtProfile(art ?? new AilisArtProfile());
        }

        private void ApplyRenderPipeline(
            AilisRendererSettings settings,
            bool transparentComposition)
        {
            var profileName = char.ToUpperInvariant(settings.pipelineAsset[0]) +
                settings.pipelineAsset.Substring(1).ToLowerInvariant();
            var source = Resources.Load<UniversalRenderPipelineAsset>(
                PipelineResourcePrefix + profileName);
            if (source == null)
            {
                throw new InvalidOperationException(
                    "URP pipeline asset is missing: " + PipelineResourcePrefix + profileName);
            }

            if (_runtimePipeline == null ||
                !string.Equals(
                    _runtimePipeline.name,
                    source.name + " (Runtime)",
                    StringComparison.Ordinal))
            {
                if (_runtimePipeline != null)
                {
                    Destroy(_runtimePipeline);
                }
                _runtimePipeline = Instantiate(source);
                _runtimePipeline.name = source.name + " (Runtime)";
            }

            var adaptiveScale = settings.adaptiveSupersampling
                ? Mathf.Clamp(SupersamplingReferenceHeight / _outputHeight, 1f, 2f)
                : 1f;
            var effectiveRenderScale = Mathf.Clamp(
                Mathf.Max(settings.renderScale, adaptiveScale),
                0.5f,
                2f);
            // Supersampling already resolves silhouette edges. Combining it with forced
            // 4x MSAA multiplies the small transparent window's sample cost without a
            // visible gain and made the performance profile more expensive than named.
            _effectiveMsaa = transparentComposition || effectiveRenderScale >= 1.5f
                ? 1
                : settings.msaaSampleCount;
            _runtimePipeline.renderScale = effectiveRenderScale;
            _runtimePipeline.msaaSampleCount = _effectiveMsaa;
            _runtimePipeline.shadowDistance = settings.shadowDistance;
            _runtimePipeline.shadowCascadeCount = settings.shadowCascadeCount;
            // UniWindow's DWM alpha path requires an RGBA backbuffer. HDR targets can
            // select formats without alpha, so transparent presentation keeps HDR off.
            _runtimePipeline.supportsHDR = !transparentComposition && settings.renderPostProcessing;
            _runtimePipeline.hdrColorBufferPrecision = HDRColorBufferPrecision._32Bits;
            if (transparentComposition)
            {
                EnableFrameAlphaOutputIfAvailable(_runtimePipeline);
            }
            GraphicsSettings.defaultRenderPipeline = _runtimePipeline;
            QualitySettings.renderPipeline = _runtimePipeline;
            Debug.Log(
                "[AILIS Renderer] URP applied: asset=" + source.name +
                ", renderScale=" + effectiveRenderScale.ToString("0.00") +
                ", requestedRenderScale=" + settings.renderScale.ToString("0.00") +
                ", msaa=" + _effectiveMsaa +
                ", output=" + _outputWidth + "x" + _outputHeight +
                ", adaptiveSupersampling=" + settings.adaptiveSupersampling +
                ", transparentComposition=" + transparentComposition +
                ", shadowDistance=" + settings.shadowDistance.ToString("0.0") +
                ", cascades=" + settings.shadowCascadeCount);
        }

        private static void EnableFrameAlphaOutputIfAvailable(
            UniversalRenderPipelineAsset pipeline)
        {
            var property = pipeline?.GetType().GetProperty("allowPostProcessAlphaOutput");
            if (property != null && property.CanWrite)
            {
                property.SetValue(pipeline, true);
            }
        }

        private Camera CreateCamera()
        {
            var cameraObject = new GameObject("Portrait Camera");
            cameraObject.tag = "MainCamera";
            cameraObject.transform.SetParent(transform, false);
            var camera = cameraObject.AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = Color.clear;
            camera.nearClipPlane = 0.05f;
            camera.farClipPlane = 50f;
            _cameraData = cameraObject.AddComponent<UniversalAdditionalCameraData>();
            _cameraData.SetRenderer(0);
            return camera;
        }

        private void ApplyCameraRendering(
            AilisRendererSettings settings,
            bool transparentComposition)
        {
            if (PortraitCamera == null || _cameraData == null)
            {
                return;
            }
            var effectivePostProcessing = !transparentComposition && settings.renderPostProcessing;
            PortraitCamera.allowHDR = !transparentComposition && effectivePostProcessing;
            PortraitCamera.allowMSAA = !transparentComposition && _effectiveMsaa > 1;
            _cameraData.renderPostProcessing = effectivePostProcessing;
            _cameraData.antialiasing = ParseAntialiasing(settings.cameraAntialiasing);
            _cameraData.antialiasingQuality = ParseAntialiasingQuality(
                settings.cameraAntialiasingQuality);
            _cameraData.stopNaN = false;
            _cameraData.dithering = settings.renderPostProcessing;
            Debug.Log(
                "[AILIS Renderer] URP camera applied: antialiasing=" +
                settings.cameraAntialiasing +
                ", postProcessing=" + effectivePostProcessing +
                ", transparentComposition=" + transparentComposition);
        }

        private void CreateGlobalVolume()
        {
            var source = Resources.Load<VolumeProfile>(VolumeResourcePath);
            if (source == null)
            {
                throw new InvalidOperationException(
                    "URP VolumeProfile asset is missing: " + VolumeResourcePath);
            }
            _runtimeVolumeProfile = Instantiate(source);
            _runtimeVolumeProfile.name = source.name + " (Runtime)";
            if (!_runtimeVolumeProfile.TryGet(out _colorAdjustments) ||
                !_runtimeVolumeProfile.TryGet(out _bloom))
            {
                throw new InvalidOperationException(
                    "AILIS VolumeProfile must contain ColorAdjustments and Bloom.");
            }

            _volumeRoot = new GameObject("AILIS Global Volume");
            _volumeRoot.transform.SetParent(transform, false);
            var volume = _volumeRoot.AddComponent<Volume>();
            volume.isGlobal = true;
            volume.priority = 100f;
            volume.sharedProfile = _runtimeVolumeProfile;
        }

        private void ApplyVolume(AilisRendererSettings settings)
        {
            if (_colorAdjustments == null || _bloom == null)
            {
                return;
            }
            _colorAdjustments.active = settings.renderPostProcessing;
            SetVolumeParameter(_colorAdjustments.postExposure, settings.postExposure);
            SetVolumeParameter(_colorAdjustments.contrast, settings.contrast);
            SetVolumeParameter(_colorAdjustments.saturation, settings.saturation);
            _bloom.active = settings.renderPostProcessing && settings.bloomIntensity > 0f;
            SetVolumeParameter(_bloom.intensity, settings.bloomIntensity);
            Debug.Log(
                "[AILIS Renderer] Global Volume applied: exposure=" +
                settings.postExposure.ToString("0.00") +
                ", contrast=" + settings.contrast.ToString("0") +
                ", saturation=" + settings.saturation.ToString("0") +
                ", bloom=" + settings.bloomIntensity.ToString("0.00"));
        }

        private void ApplyArtProfile(AilisArtProfile art)
        {
            ApplyManualCamera();

            RenderSettings.ambientMode = AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.96f, 0.97f, 1f);
            RenderSettings.ambientEquatorColor = new Color(0.72f, 0.78f, 0.88f);
            RenderSettings.ambientGroundColor = new Color(0.48f, 0.5f, 0.58f);
            RenderSettings.ambientIntensity = Settings.ambientIntensity;

            if (_lightRoot != null)
            {
                Destroy(_lightRoot);
            }
            _lightRoot = new GameObject("AILIS Lighting - " + art.id);
            _lightRoot.transform.SetParent(transform, false);
            CreateDirectionalLight(
                "Main Directional Light",
                new Vector3(Settings.keyLightPitch, Settings.keyLightYaw, 0f),
                ParseColor(Settings.keyLightColor, new Color(1f, 0.93f, 0.86f)),
                Settings.keyLightIntensity,
                Settings.mainLightShadows ? LightShadows.Soft : LightShadows.None,
                Settings.mainLightShadowStrength);
            CreateDirectionalLight(
                "Front Fill Directional Light",
                new Vector3(18f, 205f, 0f),
                ParseColor(Settings.fillLightColor, new Color(0.66f, 0.76f, 1f)),
                Settings.fillLightIntensity,
                LightShadows.None,
                0f);
            CreateDirectionalLight(
                "Back Rim Directional Light",
                new Vector3(12f, 15f, 0f),
                ParseColor(Settings.rimLightColor, new Color(0.72f, 0.88f, 1f)),
                Settings.rimLightIntensity,
                LightShadows.None,
                0f);
        }

        private void ApplyManualCamera()
        {
            PortraitCamera.fieldOfView = Settings.cameraFieldOfView;
            PortraitCamera.transform.position = new Vector3(
                Settings.cameraHorizontalOffset,
                Settings.cameraHeight,
                Settings.cameraDistance);
            PortraitCamera.transform.LookAt(new Vector3(
                Settings.cameraHorizontalOffset,
                Settings.cameraTargetHeight,
                0f));
        }

        public void FrameAvatar(Bounds bounds, AilisArtProfile art)
        {
            if (PortraitCamera == null || bounds.size.sqrMagnitude <= 0.0001f)
            {
                return;
            }
            art = art ?? new AilisArtProfile();
            PortraitCamera.fieldOfView = Settings.cameraFieldOfView;
            if (!string.Equals(
                    Settings.cameraFramingMode,
                    "full-body",
                    StringComparison.OrdinalIgnoreCase))
            {
                ApplyManualCamera();
                return;
            }

            var padding = Settings.framingPadding;
            var aspect = Mathf.Max(0.25f, PortraitCamera.aspect);
            var verticalHalfFov = PortraitCamera.fieldOfView * Mathf.Deg2Rad * 0.5f;
            var horizontalHalfFov = Mathf.Atan(Mathf.Tan(verticalHalfFov) * aspect);
            var fitHeight = bounds.extents.y * padding / Mathf.Max(0.05f, Mathf.Tan(verticalHalfFov));
            var fitWidth = bounds.extents.x * padding / Mathf.Max(0.05f, Mathf.Tan(horizontalHalfFov));
            var distance = Mathf.Max(fitHeight, fitWidth) + bounds.extents.z;
            var packageDistance = Mathf.Max(0.1f, art.cameraDistance);
            var distanceScale = Mathf.Clamp(Settings.cameraDistance / packageDistance, 0.5f, 2f);
            var target = bounds.center +
                Vector3.right * Settings.cameraHorizontalOffset +
                Vector3.up * (
                    bounds.size.y * Settings.framingVerticalBias +
                    Settings.cameraTargetHeight - art.cameraLookAtHeight);
            var cameraHeightOffset = Settings.cameraHeight - art.cameraHeight;
            var actualDistance = distance * distanceScale;
            PortraitCamera.transform.position = target +
                Vector3.up * cameraHeightOffset +
                Vector3.forward * actualDistance;
            PortraitCamera.transform.LookAt(target);
            PortraitCamera.nearClipPlane = Mathf.Max(
                0.02f,
                actualDistance - bounds.extents.z * 2f - 0.5f);
        }

        private void CreateDirectionalLight(
            string lightName,
            Vector3 eulerAngles,
            Color color,
            float intensity,
            LightShadows shadows,
            float shadowStrength)
        {
            var lightObject = new GameObject(lightName);
            lightObject.transform.SetParent(_lightRoot.transform, false);
            lightObject.transform.rotation = Quaternion.Euler(eulerAngles);
            var light = lightObject.AddComponent<Light>();
            light.type = LightType.Directional;
            light.color = color;
            light.intensity = Mathf.Max(0f, intensity);
            light.shadows = shadows;
            light.shadowStrength = Mathf.Clamp01(shadowStrength);
            light.shadowBias = 0.03f;
            light.shadowNormalBias = 0.35f;
        }

        private static AntialiasingMode ParseAntialiasing(string value)
        {
            switch ((value ?? "none").Trim().ToLowerInvariant())
            {
                case "fxaa":
                    return AntialiasingMode.FastApproximateAntialiasing;
                case "smaa":
                    return AntialiasingMode.SubpixelMorphologicalAntiAliasing;
                default:
                    return AntialiasingMode.None;
            }
        }

        private static AntialiasingQuality ParseAntialiasingQuality(string value)
        {
            switch ((value ?? "medium").Trim().ToLowerInvariant())
            {
                case "low":
                    return AntialiasingQuality.Low;
                case "high":
                    return AntialiasingQuality.High;
                default:
                    return AntialiasingQuality.Medium;
            }
        }

        private static void SetVolumeParameter(FloatParameter parameter, float value)
        {
            parameter.overrideState = true;
            parameter.value = value;
        }

        private static Color ParseColor(string value, Color fallback)
        {
            return ColorUtility.TryParseHtmlString(value, out var parsed) ? parsed : fallback;
        }

        private void OnDestroy()
        {
            if (_runtimePipeline != null)
            {
                Destroy(_runtimePipeline);
            }
            if (_runtimeVolumeProfile != null)
            {
                Destroy(_runtimeVolumeProfile);
            }
        }
    }
}
