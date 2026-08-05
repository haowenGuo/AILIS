#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace Ailis.CharacterDemo.Editor
{
    [Serializable]
    internal sealed class AilisMotionLibraryAudit
    {
        public string schema = "ailis.motion-library-audit.v1";
        public string id = "quaternius-universal-animation-library-standard";
        public string assetPath = "";
        public string license = "CC0-1.0";
        public string sourceUrl =
            "https://quaternius.com/packs/universalanimationlibrary.html";
        public AilisMotionClipAudit[] clips = Array.Empty<AilisMotionClipAudit>();
    }

    [Serializable]
    internal sealed class AilisMotionClipAudit
    {
        public string assetPath = "";
        public string name = "";
        public float lengthSeconds;
        public float frameRate;
        public bool loop;
        public bool humanoid;
    }

    [Serializable]
    internal sealed class AilisRuntimeMotionCatalog
    {
        public string schema = "ailis.runtime-motion-catalog.v1";
        public AilisRuntimeMotionCatalogEntry[] motions =
            Array.Empty<AilisRuntimeMotionCatalogEntry>();
    }

    [Serializable]
    internal sealed class AilisRuntimeMotionCatalogEntry
    {
        public string id = "";
        public string displayName = "";
        public string resourcePath = "";
        public string sourceAssetPath = "";
        public string sourceClipName = "";
        public string sourceUrl = "";
        public string license = "CC0-1.0";
        public string[] styleTags = Array.Empty<string>();
        public bool loop;
        public float lengthSeconds;
    }

    public static class AilisFreeMotionLibraryImporter
    {
        private sealed class RuntimeMotionDefinition
        {
            public string Id = "";
            public string DisplayName = "";
            public string SourceAssetPath = QuaterniusAssetPath;
            public string SourceClipName = "";
            public string SourceUrl = QuaterniusSourceUrl;
            public string[] StyleTags = Array.Empty<string>();
            public bool Loop;
        }

        private const string RuntimeMotionRoot =
            "Assets/Resources/AILIS/FreeMotions";
        private const string RuntimeMotionCatalogPath =
            RuntimeMotionRoot + "/catalog.json";
        private const string QuaterniusAssetPath =
            "Assets/ThirdParty/Quaternius/UniversalAnimationLibrary/UAL1_Standard.fbx";
        private const string Quaternius2AssetPath =
            "Assets/ThirdParty/Quaternius/UniversalAnimationLibrary2/UAL2_Standard.fbx";
        private const string QuaterniusSourceUrl =
            "https://quaternius.com/packs/universalanimationlibrary.html";

        private static readonly string[] MotionAssetPaths =
        {
            QuaterniusAssetPath,
            Quaternius2AssetPath,
            "Assets/ThirdParty/OpenGameArt/CC0HumanoidEmotes/CrossArms.fbx",
            "Assets/ThirdParty/OpenGameArt/CC0HumanoidEmotes/Wave.fbx"
        };

        // These clips are intentionally a small cross-character baseline, not
        // the automatic performance library. They cover quiet, conversational,
        // expressive, locomotion and object-interaction poses.
        private static readonly RuntimeMotionDefinition[] RuntimeMotions =
        {
            new RuntimeMotionDefinition
            {
                Id = "cc0-idle",
                DisplayName = "CC0 Idle",
                SourceClipName = "Armature|Idle_Loop",
                StyleTags = new[] { "neutral", "idle", "full-body" },
                Loop = true
            },
            new RuntimeMotionDefinition
            {
                Id = "cc0-talking",
                DisplayName = "CC0 Talking Idle",
                SourceClipName = "Armature|Idle_Talking_Loop",
                StyleTags = new[] { "talking", "gesture", "full-body" },
                Loop = true
            },
            new RuntimeMotionDefinition
            {
                Id = "cc0-interact",
                DisplayName = "CC0 Interact",
                SourceClipName = "Armature|Interact",
                StyleTags = new[] { "interaction", "gesture", "full-body" },
                Loop = false
            },
            new RuntimeMotionDefinition
            {
                Id = "cc0-dance",
                DisplayName = "CC0 Dance",
                SourceClipName = "Armature|Dance_Loop",
                StyleTags = new[] { "expressive", "dance", "full-body" },
                Loop = true
            },
            new RuntimeMotionDefinition
            {
                Id = "cc0-formal-walk",
                DisplayName = "CC0 Formal Walk",
                SourceClipName = "Armature|Walk_Formal_Loop",
                StyleTags = new[] { "locomotion", "formal", "full-body" },
                Loop = true
            },
            new RuntimeMotionDefinition
            {
                Id = "cc0-pickup-table",
                DisplayName = "CC0 Pick Up From Table",
                SourceClipName = "Armature|PickUp_Table",
                StyleTags = new[] { "interaction", "reach", "full-body" },
                Loop = false
            },
            new RuntimeMotionDefinition
            {
                Id = "ual2-idle-fold-arms",
                DisplayName = "UAL2 Fold Arms Idle",
                SourceAssetPath = Quaternius2AssetPath,
                SourceClipName = "Armature|Idle_FoldArms_Loop",
                SourceUrl =
                    "https://quaternius.com/packs/universalanimationlibrary2.html",
                StyleTags = new[] { "candidate", "idle", "reserved", "full-body" },
                Loop = true
            },
            new RuntimeMotionDefinition
            {
                Id = "ual2-idle-neutral",
                DisplayName = "UAL2 Neutral Idle",
                SourceAssetPath = Quaternius2AssetPath,
                SourceClipName = "Armature|Idle_No_Loop",
                SourceUrl =
                    "https://quaternius.com/packs/universalanimationlibrary2.html",
                StyleTags = new[] { "candidate", "idle", "neutral", "full-body" },
                Loop = true
            },
            new RuntimeMotionDefinition
            {
                Id = "ual2-talking-phone",
                DisplayName = "UAL2 Talking On Phone",
                SourceAssetPath = Quaternius2AssetPath,
                SourceClipName = "Armature|Idle_TalkingPhone_Loop",
                SourceUrl =
                    "https://quaternius.com/packs/universalanimationlibrary2.html",
                StyleTags = new[] { "candidate", "talking", "prop", "full-body" },
                Loop = true
            },
            new RuntimeMotionDefinition
            {
                Id = "ual2-yes",
                DisplayName = "UAL2 Yes",
                SourceAssetPath = Quaternius2AssetPath,
                SourceClipName = "Armature|Yes",
                SourceUrl =
                    "https://quaternius.com/packs/universalanimationlibrary2.html",
                StyleTags = new[] { "candidate", "acknowledge", "gesture", "full-body" },
                Loop = false
            },
            new RuntimeMotionDefinition
            {
                Id = "ual2-consume",
                DisplayName = "UAL2 Consume",
                SourceAssetPath = Quaternius2AssetPath,
                SourceClipName = "Armature|Consume",
                SourceUrl =
                    "https://quaternius.com/packs/universalanimationlibrary2.html",
                StyleTags = new[] { "candidate", "prop", "daily", "full-body" },
                Loop = false
            }
        };

        private static readonly AilisRuntimeMotionCatalogEntry[]
            ExistingRuntimeMotions =
            {
                CreateExistingMotion(
                    "sachi-idle",
                    "Sachi Anime Idle",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/idle",
                    "AnimeIdle.vrma",
                    true,
                    "anime",
                    "feminine",
                    "idle"),
                CreateExistingMotion(
                    "sachi-wave",
                    "Sachi Anime Wave",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/greeting",
                    "AnimeWave.vrma",
                    false,
                    "anime",
                    "feminine",
                    "greeting"),
                CreateExistingMotion(
                    "sachi-thinking",
                    "Sachi Anime Thinking",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/thinking",
                    "AnimeListening.vrma",
                    true,
                    "anime",
                    "feminine",
                    "thinking"),
                CreateExistingMotion(
                    "sachi-listening",
                    "Sachi Anime Listening",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/working",
                    "AnimeListening.vrma",
                    true,
                    "anime",
                    "feminine",
                    "listening"),
                CreateExistingMotion(
                    "sachi-happy",
                    "Sachi Anime Happy",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/celebrate",
                    "AnimeHappy.vrma",
                    false,
                    "anime",
                    "feminine",
                    "celebrate"),
                CreateExistingMotion(
                    "sachi-gentle",
                    "Sachi Anime Gentle",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/shy",
                    "AnimeGentle.vrma",
                    false,
                    "anime",
                    "feminine",
                    "gentle"),
                CreateExistingMotion(
                    "sachi-confident",
                    "Sachi Anime Confident",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/pose",
                    "AnimeConfident.vrma",
                    false,
                    "anime",
                    "feminine",
                    "confident"),
                CreateExistingMotion(
                    "sachi-present",
                    "Sachi Anime Present",
                    "AILIS/Animation/VRMA/vroid-shino-cc0/present",
                    "AnimePresent.vrma",
                    false,
                    "anime",
                    "feminine",
                    "presentation")
            };

        public static void PrepareFromCommandLine()
        {
            try
            {
                Prepare();
                EditorApplication.Exit(0);
            }
            catch (Exception error)
            {
                Debug.LogException(error);
                EditorApplication.Exit(1);
            }
        }

        public static void Prepare()
        {
            var clips = MotionAssetPaths
                .SelectMany(PrepareAsset)
                .OrderBy(clip => clip.assetPath, StringComparer.OrdinalIgnoreCase)
                .ThenBy(clip => clip.name, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            if (clips.Length == 0)
            {
                throw new InvalidDataException(
                    "Unity imported the free motion libraries but found no animation clips.");
            }

            var runtimeCatalog = CreateRuntimeMotionLibrary();
            var report = new AilisMotionLibraryAudit
            {
                assetPath = string.Join(";", MotionAssetPaths),
                clips = clips
            };
            var projectRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, ".."));
            var logDirectory = Path.Combine(projectRoot, "Logs");
            Directory.CreateDirectory(logDirectory);
            var reportPath = Path.Combine(
                logDirectory,
                "free-motion-library-audit.json");
            File.WriteAllText(reportPath, JsonUtility.ToJson(report, true));

            Debug.Log(
                "[AILIS Motion Library] Prepared " +
                clips.Length +
                " Humanoid clips from " +
                MotionAssetPaths.Length +
                " CC0 sources; " +
                runtimeCatalog.motions.Length +
                " clips were compiled for cross-character validation. Audit: " +
                reportPath);
        }

        private static AilisMotionClipAudit[] PrepareAsset(string assetPath)
        {
            var importer = AssetImporter.GetAtPath(assetPath) as ModelImporter;
            if (importer == null)
            {
                throw new FileNotFoundException(
                    "A free motion FBX has not been copied into the Unity project.",
                    assetPath);
            }

            importer.importAnimation = true;
            importer.animationType = ModelImporterAnimationType.Human;
            importer.avatarSetup = ModelImporterAvatarSetup.CreateFromThisModel;
            importer.importBlendShapes = false;
            importer.importCameras = false;
            importer.importLights = false;
            importer.materialImportMode = ModelImporterMaterialImportMode.None;
            importer.SaveAndReimport();

            var configuredClips = importer.defaultClipAnimations;
            foreach (var clip in configuredClips)
            {
                clip.loopTime = ShouldLoop(clip.name);
                clip.loopPose = clip.loopTime;
                clip.keepOriginalOrientation = true;
                clip.keepOriginalPositionXZ = true;
                clip.keepOriginalPositionY = true;
                clip.lockRootRotation = true;
                clip.lockRootHeightY = true;
                clip.lockRootPositionXZ = true;
            }
            importer.clipAnimations = configuredClips;
            importer.SaveAndReimport();

            return AssetDatabase
                .LoadAllAssetsAtPath(assetPath)
                .OfType<AnimationClip>()
                .Where(clip =>
                    clip != null &&
                    !clip.name.StartsWith("__preview__", StringComparison.OrdinalIgnoreCase))
                .Select(clip => new AilisMotionClipAudit
                {
                    assetPath = assetPath,
                    name = clip.name,
                    lengthSeconds = clip.length,
                    frameRate = clip.frameRate,
                    loop = ShouldLoop(clip.name),
                    humanoid = clip.isHumanMotion
                })
                .ToArray();
        }

        private static AilisRuntimeMotionCatalog CreateRuntimeMotionLibrary()
        {
            EnsureAssetFolder(RuntimeMotionRoot);
            var sourceClipsByAsset = RuntimeMotions
                .Select(definition => definition.SourceAssetPath)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToDictionary(
                    assetPath => assetPath,
                    assetPath => AssetDatabase
                        .LoadAllAssetsAtPath(assetPath)
                        .OfType<AnimationClip>()
                        .Where(clip =>
                            clip != null &&
                            !clip.name.StartsWith(
                                "__preview__",
                                StringComparison.OrdinalIgnoreCase))
                        .ToDictionary(
                            clip => clip.name,
                            clip => clip,
                            StringComparer.OrdinalIgnoreCase),
                    StringComparer.OrdinalIgnoreCase);
            var entries = new List<AilisRuntimeMotionCatalogEntry>();
            foreach (var definition in RuntimeMotions)
            {
                if (!sourceClipsByAsset.TryGetValue(
                        definition.SourceAssetPath,
                        out var sourceClips))
                {
                    throw new FileNotFoundException(
                        "The free Humanoid motion source is missing.",
                        definition.SourceAssetPath);
                }
                if (!sourceClips.TryGetValue(
                        definition.SourceClipName,
                        out var sourceClip))
                {
                    throw new InvalidDataException(
                        "The free Humanoid motion baseline is missing clip: " +
                        definition.SourceClipName);
                }
                if (!sourceClip.isHumanMotion)
                {
                    throw new InvalidDataException(
                        "The free motion baseline is not Humanoid: " +
                        definition.SourceClipName);
                }

                var assetPath =
                    RuntimeMotionRoot + "/" + definition.Id + ".anim";
                AssetDatabase.DeleteAsset(assetPath);
                var runtimeClip = new AnimationClip();
                EditorUtility.CopySerialized(sourceClip, runtimeClip);
                runtimeClip.name = definition.Id;
                var settings =
                    AnimationUtility.GetAnimationClipSettings(runtimeClip);
                settings.loopTime = definition.Loop;
                settings.loopBlend = definition.Loop;
                settings.keepOriginalOrientation = false;
                settings.keepOriginalPositionXZ = false;
                settings.keepOriginalPositionY = false;
                settings.loopBlendOrientation = definition.Loop;
                settings.loopBlendPositionXZ = definition.Loop;
                settings.loopBlendPositionY = definition.Loop;
                AnimationUtility.SetAnimationClipSettings(
                    runtimeClip,
                    settings);
                AssetDatabase.CreateAsset(runtimeClip, assetPath);

                entries.Add(new AilisRuntimeMotionCatalogEntry
                {
                    id = definition.Id,
                    displayName = definition.DisplayName,
                    resourcePath =
                        "AILIS/FreeMotions/" + definition.Id,
                    sourceAssetPath = definition.SourceAssetPath,
                    sourceClipName = definition.SourceClipName,
                    sourceUrl = definition.SourceUrl,
                    license = "CC0-1.0",
                    styleTags = definition.StyleTags,
                    loop = definition.Loop,
                    lengthSeconds = runtimeClip.length
                });
            }
            foreach (var entry in ExistingRuntimeMotions)
            {
                var assetPath =
                    "Assets/Resources/" +
                    entry.resourcePath +
                    ".anim";
                var clip =
                    AssetDatabase.LoadAssetAtPath<AnimationClip>(
                        assetPath);
                if (clip == null || !clip.isHumanMotion)
                {
                    Debug.LogWarning(
                        "[AILIS Motion Library] Skipping unavailable " +
                        "Humanoid validation clip: " +
                        assetPath);
                    continue;
                }
                entry.sourceAssetPath = assetPath;
                entry.lengthSeconds = clip.length;
                entries.Add(entry);
            }

            var catalog = new AilisRuntimeMotionCatalog
            {
                motions = entries.ToArray()
            };
            File.WriteAllText(
                Path.GetFullPath(RuntimeMotionCatalogPath),
                JsonUtility.ToJson(catalog, true));
            AssetDatabase.ImportAsset(
                RuntimeMotionCatalogPath,
                ImportAssetOptions.ForceUpdate);
            AssetDatabase.SaveAssets();
            return catalog;
        }

        private static AilisRuntimeMotionCatalogEntry CreateExistingMotion(
            string id,
            string displayName,
            string resourcePath,
            string sourceClipName,
            bool loop,
            params string[] styleTags)
        {
            return new AilisRuntimeMotionCatalogEntry
            {
                id = id,
                displayName = displayName,
                resourcePath = resourcePath,
                sourceClipName = sourceClipName,
                sourceUrl =
                    "https://booth.pm/en/items/6412084",
                license = "CC0-1.0",
                styleTags = styleTags,
                loop = loop
            };
        }

        private static void EnsureAssetFolder(string assetFolder)
        {
            var normalized = assetFolder.Replace('\\', '/').TrimEnd('/');
            var segments = normalized.Split('/');
            var current = segments[0];
            for (var index = 1; index < segments.Length; index += 1)
            {
                var next = current + "/" + segments[index];
                if (!AssetDatabase.IsValidFolder(next))
                {
                    AssetDatabase.CreateFolder(current, segments[index]);
                }
                current = next;
            }
        }

        private static bool ShouldLoop(string clipName)
        {
            var normalized = (clipName ?? "").Trim().ToLowerInvariant();
            return normalized.Contains("idle") ||
                   normalized.Contains("walk") ||
                   normalized.Contains("run") ||
                   normalized.Contains("jog") ||
                   normalized.Contains("sprint") ||
                   normalized.Contains("crawl") ||
                   normalized.Contains("swim") ||
                   normalized.Contains("push") ||
                   normalized.Contains("sit");
        }
    }
}
#endif
