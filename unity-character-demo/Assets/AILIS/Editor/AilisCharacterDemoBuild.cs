#if UNITY_EDITOR
using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace Ailis.CharacterDemo.Editor
{
    public static class AilisCharacterDemoBuild
    {
        private const string ScenePath = "Assets/AILIS/Generated/AilisCharacterDemo.unity";
        private const string BuildPath = "Build/Windows/AILISCharacterDemo.exe";
        private const string RenderingRoot = "Assets/Resources/AILIS/Rendering";
        private const string RendererPath = RenderingRoot + "/AILIS_UniversalRenderer.asset";
        private const string VolumePath = RenderingRoot + "/AILIS_Volume.asset";
        private const string VrmaGuideMaterialPath =
            RenderingRoot + "/AILIS_VrmaGuideMaterial.mat";
        private const string LipSyncRoot = "Assets/Resources/AILIS/LipSync";
        private const string LipSyncProfilePath =
            LipSyncRoot + "/uLipSync-Profile-Female.asset";
        private const string LipSyncSourceProfilePath =
            "Packages/com.hecomi.ulipsync/Assets/Profiles/uLipSync-Profile-Sample-Female.asset";
        private const string DefaultPostProcessDataPath =
            "Packages/com.unity.render-pipelines.universal/Runtime/Data/PostProcessData.asset";

        [MenuItem("AILIS/Build Character Renderer Demo")]
        public static void BuildWindowsDemo()
        {
            PrepareProject();
            var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = new[] { ScenePath },
                locationPathName = BuildPath,
                target = BuildTarget.StandaloneWindows64,
                options = BuildOptions.None
            });

            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new InvalidOperationException(
                    "AILIS Unity demo build failed: " + report.summary.result);
            }

            Debug.Log(
                "[AILIS Unity Demo] Build complete: " +
                Path.GetFullPath(BuildPath) +
                " (" + report.summary.totalSize + " bytes)");
        }

        public static void BuildWindowsDemoFromCommandLine()
        {
            try
            {
                BuildWindowsDemo();
                EditorApplication.Exit(0);
            }
            catch (Exception error)
            {
                Debug.LogException(error);
                EditorApplication.Exit(1);
            }
        }

        private static void PrepareProject()
        {
            PrepareUniversalRenderPipeline();
            PrepareLipSyncProfile();
            AilisPerformanceAnimatorTemplateBuilder.CreateOrUpdate();
            AilisVrmaMotionLibraryBuilder.CreateOrUpdate();
            AilisFreeMotionLibraryImporter.Prepare();
            Directory.CreateDirectory(Path.GetDirectoryName(ScenePath) ?? "Assets");
            var scene = EditorSceneManager.NewScene(
                NewSceneSetup.EmptyScene,
                NewSceneMode.Single);
            EditorSceneManager.SaveScene(scene, ScenePath);

            PlayerSettings.productName = "AILIS Character Renderer";
            PlayerSettings.companyName = "AILIS";
            PlayerSettings.defaultScreenWidth = 720;
            PlayerSettings.defaultScreenHeight = 960;
            PlayerSettings.fullScreenMode = FullScreenMode.Windowed;
            PlayerSettings.resizableWindow = false;
            PlayerSettings.runInBackground = true;
            PlayerSettings.colorSpace = ColorSpace.Linear;
            PlayerSettings.SetScriptingBackend(
                NamedBuildTarget.Standalone,
                ScriptingImplementation.Mono2x);
            PlayerSettings.SetGraphicsAPIs(
                BuildTarget.StandaloneWindows64,
                new[] { GraphicsDeviceType.Direct3D11 });

            TryDisableFlipModelSwapchain();
            IncludeRuntimeShaders();
            CopyRuntimeAsset("AILIS.vrm");
            foreach (var motionName in new[]
                     {
                         "Idle.vrma",
                         "Thinking.vrma",
                         "LookAround.vrma",
                         "Goodbye.vrma",
                         "Clapping.vrma",
                         "Jump.vrma",
                         "Blush.vrma",
                         "Angry.vrma",
                         "Sad.vrma",
                         "Sleepy.vrma",
                         "Surprised.vrma"
                     })
            {
                CopyRuntimeAsset(
                    Path.Combine("VRMA_MotionPack", "vrma", motionName),
                    Path.Combine("Motions", motionName));
            }
            AssetDatabase.Refresh();
            AssetDatabase.SaveAssets();
        }

        private static void PrepareLipSyncProfile()
        {
            EnsureAssetFolder(LipSyncRoot);
            if (AssetDatabase.LoadMainAssetAtPath(LipSyncSourceProfilePath) == null)
            {
                throw new InvalidOperationException(
                    "uLipSync female profile is unavailable: " + LipSyncSourceProfilePath);
            }
            AssetDatabase.DeleteAsset(LipSyncProfilePath);
            if (!AssetDatabase.CopyAsset(LipSyncSourceProfilePath, LipSyncProfilePath))
            {
                throw new InvalidOperationException(
                    "Could not copy the uLipSync profile into runtime Resources.");
            }
            AssetDatabase.ImportAsset(LipSyncProfilePath, ImportAssetOptions.ForceUpdate);
        }

        private static void PrepareUniversalRenderPipeline()
        {
            EnsureAssetFolder(RenderingRoot);

            var renderer = AssetDatabase.LoadAssetAtPath<UniversalRendererData>(RendererPath);
            if (renderer == null)
            {
                renderer = ScriptableObject.CreateInstance<UniversalRendererData>();
                renderer.name = "AILIS Universal Renderer";
                AssetDatabase.CreateAsset(renderer, RendererPath);
            }
            renderer.postProcessData = AssetDatabase.LoadAssetAtPath<PostProcessData>(
                DefaultPostProcessDataPath);
            if (renderer.postProcessData == null)
            {
                throw new InvalidOperationException(
                    "URP default PostProcessData asset is unavailable.");
            }
            EditorUtility.SetDirty(renderer);

            var performance = CreateOrUpdatePipelineAsset(
                renderer,
                "Performance",
                0.85f,
                2,
                8f,
                1,
                1024);
            var balanced = CreateOrUpdatePipelineAsset(
                renderer,
                "Balanced",
                1f,
                4,
                12f,
                2,
                2048);
            CreateOrUpdatePipelineAsset(
                renderer,
                "Quality",
                1f,
                4,
                18f,
                4,
                4096);
            CreateOrUpdateVolumeProfile();
            CreateOrUpdateVrmaGuideMaterial();

            GraphicsSettings.defaultRenderPipeline = balanced;
            QualitySettings.renderPipeline = balanced;
            EditorUtility.SetDirty(GraphicsSettings.GetGraphicsSettings());
            AssetDatabase.SaveAssets();

            Debug.Log(
                "[AILIS Unity Demo] URP 14 assets prepared: " +
                performance.name + ", " + balanced.name + ", AILIS URP Quality");
        }

        private static UniversalRenderPipelineAsset CreateOrUpdatePipelineAsset(
            UniversalRendererData renderer,
            string profileName,
            float renderScale,
            int msaaSampleCount,
            float shadowDistance,
            int shadowCascadeCount,
            int shadowResolution)
        {
            var path = RenderingRoot + "/AILIS_URP_" + profileName + ".asset";
            var pipeline = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>(path);
            if (pipeline == null)
            {
                pipeline = UniversalRenderPipelineAsset.Create(renderer);
                pipeline.name = "AILIS URP " + profileName;
                AssetDatabase.CreateAsset(pipeline, path);
            }

            pipeline.renderScale = renderScale;
            pipeline.msaaSampleCount = msaaSampleCount;
            pipeline.shadowDistance = shadowDistance;
            pipeline.shadowCascadeCount = shadowCascadeCount;
            pipeline.supportsHDR = false;
            pipeline.supportsCameraDepthTexture = false;
            pipeline.supportsCameraOpaqueTexture = false;
            pipeline.maxAdditionalLightsCount = 4;

            var serialized = new SerializedObject(pipeline);
            SetSerializedBool(serialized, "m_MainLightShadowsSupported", true);
            SetSerializedInt(serialized, "m_MainLightShadowmapResolution", shadowResolution);
            SetSerializedInt(serialized, "m_AdditionalLightsRenderingMode", 2);
            SetSerializedBool(serialized, "m_AdditionalLightShadowsSupported", false);
            serialized.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(pipeline);
            return pipeline;
        }

        private static void CreateOrUpdateVolumeProfile()
        {
            var profile = AssetDatabase.LoadAssetAtPath<VolumeProfile>(VolumePath);
            if (profile == null)
            {
                profile = ScriptableObject.CreateInstance<VolumeProfile>();
                profile.name = "AILIS Global Volume";
                AssetDatabase.CreateAsset(profile, VolumePath);
            }

            if (!profile.TryGet<ColorAdjustments>(out _))
            {
                var color = profile.Add<ColorAdjustments>(true);
                AssetDatabase.AddObjectToAsset(color, profile);
            }
            if (!profile.TryGet<Bloom>(out _))
            {
                var bloom = profile.Add<Bloom>(true);
                AssetDatabase.AddObjectToAsset(bloom, profile);
            }
            EditorUtility.SetDirty(profile);
        }

        private static void CreateOrUpdateVrmaGuideMaterial()
        {
            var shader = Shader.Find("Universal Render Pipeline/Lit");
            if (shader == null)
            {
                throw new InvalidOperationException(
                    "URP Lit shader is unavailable for VRMA import.");
            }

            var material = AssetDatabase.LoadAssetAtPath<Material>(VrmaGuideMaterialPath);
            if (material == null)
            {
                material = new Material(shader)
                {
                    name = "AILIS VRMA Guide Material"
                };
                AssetDatabase.CreateAsset(material, VrmaGuideMaterialPath);
            }
            else if (material.shader != shader)
            {
                material.shader = shader;
            }

            EditorUtility.SetDirty(material);
        }

        private static void EnsureAssetFolder(string path)
        {
            var current = "Assets";
            foreach (var segment in path.Substring("Assets/".Length).Split('/'))
            {
                var next = current + "/" + segment;
                if (!AssetDatabase.IsValidFolder(next))
                {
                    AssetDatabase.CreateFolder(current, segment);
                }
                current = next;
            }
        }

        private static void SetSerializedBool(
            SerializedObject target,
            string propertyName,
            bool value)
        {
            var property = target.FindProperty(propertyName);
            if (property == null)
            {
                throw new InvalidOperationException(
                    "URP property is unavailable: " + propertyName);
            }
            property.boolValue = value;
        }

        private static void SetSerializedInt(
            SerializedObject target,
            string propertyName,
            int value)
        {
            var property = target.FindProperty(propertyName);
            if (property == null)
            {
                throw new InvalidOperationException(
                    "URP property is unavailable: " + propertyName);
            }
            property.intValue = value;
        }

        private static void IncludeRuntimeShaders()
        {
            var graphicsSettingsAssets = AssetDatabase.LoadAllAssetsAtPath(
                "ProjectSettings/GraphicsSettings.asset");
            if (graphicsSettingsAssets.Length == 0)
            {
                throw new InvalidOperationException(
                    "Unity GraphicsSettings asset is unavailable.");
            }

            var serializedSettings = new SerializedObject(graphicsSettingsAssets[0]);
            var includedShaders = serializedSettings.FindProperty("m_AlwaysIncludedShaders");
            if (includedShaders == null || !includedShaders.isArray)
            {
                throw new InvalidOperationException(
                    "Unity always-included shader list is unavailable.");
            }

            for (var index = includedShaders.arraySize - 1; index >= 0; index -= 1)
            {
                var shader = includedShaders.GetArrayElementAtIndex(index).objectReferenceValue as Shader;
                if (shader != null &&
                    (shader.name == "Universal Render Pipeline/Lit" ||
                     shader.name == "Universal Render Pipeline/Unlit"))
                {
                    includedShaders.DeleteArrayElementAtIndex(index);
                }
            }

            foreach (var shaderName in new[]
                     {
                         "Standard",
                         "UniGLTF/UniUnlit",
                         "VRM10/MToon10",
                         "VRM10/Universal Render Pipeline/MToon10"
                     })
            {
                var shader = Shader.Find(shaderName);
                if (shader == null)
                {
                    throw new InvalidOperationException(
                        "Required runtime shader is unavailable: " + shaderName);
                }

                var alreadyIncluded = false;
                for (var index = 0; index < includedShaders.arraySize; index += 1)
                {
                    if (includedShaders.GetArrayElementAtIndex(index).objectReferenceValue == shader)
                    {
                        alreadyIncluded = true;
                        break;
                    }
                }
                if (!alreadyIncluded)
                {
                    var index = includedShaders.arraySize;
                    includedShaders.InsertArrayElementAtIndex(index);
                    includedShaders.GetArrayElementAtIndex(index).objectReferenceValue = shader;
                }
            }

            foreach (var optionalShaderName in new[]
                     {
                         "Toon",
                         "Universal Render Pipeline/Toon"
                     })
            {
                var shader = Shader.Find(optionalShaderName);
                if (shader == null)
                {
                    continue;
                }

                var alreadyIncluded = false;
                for (var index = 0; index < includedShaders.arraySize; index += 1)
                {
                    if (includedShaders.GetArrayElementAtIndex(index).objectReferenceValue == shader)
                    {
                        alreadyIncluded = true;
                        break;
                    }
                }
                if (!alreadyIncluded)
                {
                    var index = includedShaders.arraySize;
                    includedShaders.InsertArrayElementAtIndex(index);
                    includedShaders.GetArrayElementAtIndex(index).objectReferenceValue = shader;
                }
            }
            serializedSettings.ApplyModifiedPropertiesWithoutUndo();
        }

        private static void CopyRuntimeAsset(string sourceRelativePath, string targetName = null)
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
            var repositoryRoot = Path.GetFullPath(Path.Combine(projectRoot, ".."));
            var sourcePath = Path.Combine(repositoryRoot, "Resources", sourceRelativePath);
            if (!File.Exists(sourcePath))
            {
                throw new FileNotFoundException("Runtime asset is missing.", sourcePath);
            }

            var streamingAssets = Path.Combine(Application.dataPath, "StreamingAssets");
            Directory.CreateDirectory(streamingAssets);
            var destinationPath = Path.Combine(
                streamingAssets,
                targetName ?? Path.GetFileName(sourcePath));
            Directory.CreateDirectory(Path.GetDirectoryName(destinationPath) ?? streamingAssets);
            File.Copy(sourcePath, destinationPath, true);
        }

        private static void TryDisableFlipModelSwapchain()
        {
            var property = typeof(PlayerSettings).GetProperty(
                "useFlipModelSwapchain",
                System.Reflection.BindingFlags.Public |
                System.Reflection.BindingFlags.Static);
            if (property != null && property.CanWrite)
            {
                property.SetValue(null, false);
            }
        }
    }
}
#endif
