#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using UniGLTF;
using UniVRM10;
using UnityEditor;
using UnityEngine;

namespace Ailis.CharacterDemo.Editor
{
    public static class AilisVrmaMotionLibraryBuilder
    {
        private const string CharacterPackagesRoot =
            "Assets/StreamingAssets/Characters";
        private const string VrmaGuideMaterialPath =
            "Assets/Resources/AILIS/Rendering/AILIS_VrmaGuideMaterial.mat";
        private const string GltfDefaultMaterialName =
            "__UNIGLTF__DEFAULT__MATERIAL__";

        public static void CreateOrUpdate()
        {
            var packageRoot = Path.GetFullPath(CharacterPackagesRoot);
            if (!Directory.Exists(packageRoot))
            {
                Debug.Log(
                    "[AILIS Animation] No runtime character packages to bake.");
                return;
            }

            var bakedCount = 0;
            foreach (var manifestPath in Directory.GetFiles(
                         packageRoot,
                         "ailis-character.json",
                         SearchOption.AllDirectories))
            {
                var manifest = JsonUtility.FromJson<AilisCharacterPackageManifest>(
                    File.ReadAllText(manifestPath));
                if (manifest == null ||
                    !string.Equals(
                        manifest.adapter,
                        "vrm",
                        StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var manifestRoot =
                    Path.GetDirectoryName(manifestPath) ?? packageRoot;
                foreach (var motion in manifest.motions ??
                         Array.Empty<AilisMotionDefinition>())
                {
                    if (motion == null ||
                        string.IsNullOrWhiteSpace(motion.file))
                    {
                        continue;
                    }
                    // Compatibility controls automatic scheduling, not whether a
                    // motion is available for manual review in Character Lab.
                    var sourcePath = Path.GetFullPath(
                        Path.IsPathRooted(motion.file)
                            ? motion.file
                            : Path.Combine(manifestRoot, motion.file));
                    if (!File.Exists(sourcePath))
                    {
                        Debug.LogWarning(
                            "[AILIS Animation] VRMA source is missing: " +
                            sourcePath);
                        continue;
                    }
                    BakeMotion(manifest.id, motion, sourcePath);
                    bakedCount += 1;
                }
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log(
                "[AILIS Animation] VRMA Humanoid library ready: " +
                bakedCount + " clips.");
        }

        private static void BakeMotion(
            string packageId,
            AilisMotionDefinition motion,
            string sourcePath)
        {
            var resourcePath =
                AilisPerformanceAnimatorParameters.ResolveVrmaClipResource(
                    packageId,
                    motion.id);
            var assetPath =
                "Assets/Resources/" + resourcePath + ".anim";
            EnsureAssetFolder(
                Path.GetDirectoryName(assetPath)
                    ?.Replace('\\', '/') ?? "Assets/Resources");
            AssetDatabase.DeleteAsset(assetPath);

            using (var data = new AutoGltfFileParser(sourcePath).Parse())
            using (var loader = new VrmAnimationImporter(
                       new VrmAnimationData(data),
                       CreateExternalObjectMap()))
            {
                var instance = loader
                    .LoadAsync(new ImmediateCaller())
                    .GetAwaiter()
                    .GetResult();
                var root = instance.gameObject;
                try
                {
                    var animationInstance =
                        root.GetComponent<Vrm10AnimationInstance>();
                    if (animationInstance?.BoxMan != null)
                    {
                        animationInstance.BoxMan.enabled = false;
                    }
                    var animation = root.GetComponent<Animation>();
                    if (animation == null)
                    {
                        throw new InvalidDataException(
                            "VRMA has no Animation component: " + sourcePath);
                    }
                    var clip = AilisVrmaHumanoidClipBaker.Bake(
                        root,
                        animation,
                        packageId + " - " + motion.id,
                        motion.loop,
                        motion.fallbackDurationSeconds);
                    var settings =
                        AnimationUtility.GetAnimationClipSettings(clip);
                    settings.loopTime = motion.loop;
                    settings.loopBlend = motion.loop;
                    settings.keepOriginalOrientation = true;
                    settings.keepOriginalPositionXZ = true;
                    settings.keepOriginalPositionY = true;
                    AnimationUtility.SetAnimationClipSettings(clip, settings);
                    AssetDatabase.CreateAsset(clip, assetPath);
                }
                finally
                {
                    UnityEngine.Object.DestroyImmediate(root);
                }
            }
        }

        private static IReadOnlyDictionary<SubAssetKey, UnityEngine.Object>
            CreateExternalObjectMap()
        {
            var material =
                AssetDatabase.LoadAssetAtPath<Material>(
                    VrmaGuideMaterialPath);
            if (material == null)
            {
                throw new InvalidDataException(
                    "VRMA guide material is missing: " +
                    VrmaGuideMaterialPath);
            }
            return new Dictionary<SubAssetKey, UnityEngine.Object>
            {
                [new SubAssetKey(
                    typeof(Material),
                    GltfDefaultMaterialName)] = material
            };
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
    }
}
#endif
