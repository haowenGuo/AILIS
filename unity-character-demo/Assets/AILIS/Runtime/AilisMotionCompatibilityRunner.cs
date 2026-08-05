using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using UniGLTF;
using UniVRM10;
using UnityEngine;
using UnityEngine.Animations;
using UnityEngine.Playables;

namespace Ailis.CharacterDemo
{
    [Serializable]
    internal sealed class AilisRuntimeMotionCatalog
    {
        public string schema = "";
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
        public string license = "";
        public string[] styleTags = Array.Empty<string>();
        public bool loop;
        public float lengthSeconds;

        public bool HasStyleTag(string tag)
        {
            return (styleTags ?? Array.Empty<string>()).Any(
                value => string.Equals(
                    value,
                    tag,
                    StringComparison.OrdinalIgnoreCase));
        }
    }

    [Serializable]
    internal sealed class AilisMotionCompatibilityReport
    {
        public string schema = "ailis.motion-retarget-report.v2";
        public string generatedAt = "";
        public string unityVersion = "";
        public string graphicsDevice = "";
        public int characterCount;
        public int motionCount;
        public int combinationCount;
        public int passCount;
        public int reviewCount;
        public int failCount;
        public string assessmentPolicy =
            "Retarget checks compare the same raw Humanoid clip across every " +
            "target Avatar. Rendering is reported separately. Clothing, hair " +
            "and mesh self-intersection always require contact-sheet review.";
        public AilisAvatarRetargetProfile[] characterProfiles =
            Array.Empty<AilisAvatarRetargetProfile>();
        public AilisMotionCompatibilityResult[] results =
            Array.Empty<AilisMotionCompatibilityResult>();
    }

    [Serializable]
    internal sealed class AilisAvatarRetargetProfile
    {
        public string characterId = "";
        public string characterName = "";
        public string adapter = "";
        public bool avatarValid;
        public bool humanoid;
        public int mappedBoneCount;
        public int mappedCoreBoneCount;
        public int expectedCoreBoneCount;
        public float humanScale;
        public float avatarHeight;
        public float bindFacingAngleToRootDegrees;
        public float shoulderWidthNormalized;
        public float armSpanNormalized;
        public float leftUpperArmNormalized;
        public float leftLowerArmNormalized;
        public float rightUpperArmNormalized;
        public float rightLowerArmNormalized;
        public float leftUpperLegNormalized;
        public float leftLowerLegNormalized;
        public float rightUpperLegNormalized;
        public float rightLowerLegNormalized;
        public string[] missingCoreBones = Array.Empty<string>();
    }

    [Serializable]
    internal sealed class AilisMotionCompatibilityResult
    {
        public string characterId = "";
        public string characterName = "";
        public string adapter = "";
        public string motionId = "";
        public string motionName = "";
        public string sourceClipName = "";
        public string status = "review";
        public string mechanicalStatus = "pending";
        public string crossAvatarStatus = "pending";
        public string visualStatus = "pending";
        public int riskScore;
        public bool humanoid;
        public bool finitePose = true;
        public bool visualReviewRequired = true;
        public int comparisonPeerCount;
        public int sampleCount;
        public int rendererCount;
        public int invalidShaderMaterialCount;
        public int silhouetteFallbackFrames;
        public int torsoProximityFrames;
        public int headProximityFrames;
        public int groundPenetrationFrames;
        public int footCrossingFrames;
        public int tPoseLikeFrames;
        public float avatarHeight;
        public float maximumRootDriftNormalized;
        public float maximumRootYawDeltaDegrees;
        public float maximumBodyFacingDeltaDegrees;
        public float maximumHandSpanNormalized;
        public float maximumRenderWidthNormalized;
        public float maximumVisiblePixelRatio;
        public float crossAvatarMeanJointAngleDeltaDegrees;
        public float crossAvatarMaximumJointAngleDeltaDegrees;
        public float minimumLeftElbowAngleDegrees = 180f;
        public float minimumRightElbowAngleDegrees = 180f;
        public float minimumLeftKneeAngleDegrees = 180f;
        public float minimumRightKneeAngleDegrees = 180f;
        public float captureViewportX;
        public float captureViewportY;
        public float captureViewportDepth;
        public float captureNearClip;
        public float captureFarClip;
        public string captureMode = "art";
        public string[] warnings = Array.Empty<string>();
        public string contactSheet = "";
        public string retargetContactSheet = "";

        [NonSerialized]
        public readonly List<float[]> PoseDirectionSamples =
            new List<float[]>();
    }

    public sealed class AilisMotionCompatibilityRunner : MonoBehaviour
    {
        private const string ReportArgument =
            "--motion-compatibility-report";
        private const string OutputArgument =
            "--motion-compatibility-output";
        private const string MotionIdsArgument =
            "--motion-compatibility-ids";
        private const int FrameWidth = 360;
        private const int FrameHeight = 540;

        private static readonly float[] SampleTimes =
        {
            0f,
            0.125f,
            0.25f,
            0.375f,
            0.5f,
            0.625f,
            0.75f,
            0.875f,
            0.999f
        };

        private static readonly int[] ContactSheetSampleIndices =
        {
            1,
            4,
            7
        };

        private static readonly HumanBodyBones[] CoreHumanoidBones =
        {
            HumanBodyBones.Hips,
            HumanBodyBones.Spine,
            HumanBodyBones.Head,
            HumanBodyBones.LeftUpperArm,
            HumanBodyBones.LeftLowerArm,
            HumanBodyBones.LeftHand,
            HumanBodyBones.RightUpperArm,
            HumanBodyBones.RightLowerArm,
            HumanBodyBones.RightHand,
            HumanBodyBones.LeftUpperLeg,
            HumanBodyBones.LeftLowerLeg,
            HumanBodyBones.LeftFoot,
            HumanBodyBones.RightUpperLeg,
            HumanBodyBones.RightLowerLeg,
            HumanBodyBones.RightFoot
        };

        private static readonly HumanBodyBones[] PoseSegmentStarts =
        {
            HumanBodyBones.Hips,
            HumanBodyBones.Spine,
            HumanBodyBones.LeftUpperArm,
            HumanBodyBones.LeftLowerArm,
            HumanBodyBones.RightUpperArm,
            HumanBodyBones.RightLowerArm,
            HumanBodyBones.LeftUpperLeg,
            HumanBodyBones.LeftLowerLeg,
            HumanBodyBones.RightUpperLeg,
            HumanBodyBones.RightLowerLeg
        };

        private static readonly HumanBodyBones[] PoseSegmentEnds =
        {
            HumanBodyBones.Spine,
            HumanBodyBones.Head,
            HumanBodyBones.LeftLowerArm,
            HumanBodyBones.LeftHand,
            HumanBodyBones.RightLowerArm,
            HumanBodyBones.RightHand,
            HumanBodyBones.LeftLowerLeg,
            HumanBodyBones.LeftFoot,
            HumanBodyBones.RightLowerLeg,
            HumanBodyBones.RightFoot
        };

        private sealed class LoadedAvatar
        {
            public GameObject Root;
            public Animator Animator;
            public AssetBundle Bundle;
            public AilisAvatarRetargetProfile Profile;
            public Quaternion WorldToBindFrame;
            public Quaternion BindRootRotation;
        }

        private sealed class PoseSnapshot
        {
            public Transform Transform;
            public Vector3 LocalPosition;
            public Quaternion LocalRotation;
            public Vector3 LocalScale;
        }

        public static bool IsRequested =>
            !string.IsNullOrWhiteSpace(ReadArgument(ReportArgument));

        private async void Awake()
        {
            DontDestroyOnLoad(gameObject);
            try
            {
                await RunAsync();
                Application.Quit(0);
            }
            catch (Exception error)
            {
                Debug.LogException(error);
                WriteFailureReport(error);
                Application.Quit(1);
            }
        }

        private async Task RunAsync()
        {
            var reportPath = Path.GetFullPath(ReadArgument(ReportArgument));
            var outputDirectory = ReadArgument(OutputArgument);
            outputDirectory = string.IsNullOrWhiteSpace(outputDirectory)
                ? Path.Combine(
                    Path.GetDirectoryName(reportPath) ?? ".",
                    "motion-compatibility-frames")
                : Path.GetFullPath(outputDirectory);
            Directory.CreateDirectory(outputDirectory);

            var catalogAsset =
                Resources.Load<TextAsset>("AILIS/FreeMotions/catalog");
            if (catalogAsset == null)
            {
                throw new InvalidDataException(
                    "The runtime motion catalog is missing. Rebuild the " +
                    "Unity renderer so the free Humanoid library is compiled.");
            }
            var catalog = JsonUtility.FromJson<AilisRuntimeMotionCatalog>(
                catalogAsset.text);
            var motions = SelectMotions(catalog);
            if (motions.Length == 0)
            {
                throw new InvalidDataException(
                    "No runtime Humanoid motions were selected.");
            }

            var manifestPaths = Directory
                .GetFiles(
                    Path.Combine(
                        Application.streamingAssetsPath,
                        "Characters"),
                    "ailis-character.json",
                    SearchOption.AllDirectories)
                .OrderBy(path => path, StringComparer.OrdinalIgnoreCase)
                .ToArray();
            if (manifestPaths.Length == 0)
            {
                throw new DirectoryNotFoundException(
                    "No packaged characters are available for compatibility " +
                    "validation.");
            }

            var results = new List<AilisMotionCompatibilityResult>();
            var characterProfiles = new List<AilisAvatarRetargetProfile>();
            foreach (var manifestPath in manifestPaths)
            {
                var package = AilisCharacterPackage.Load(
                    manifestPath,
                    "",
                    "");
                var loaded = await LoadAvatarAsync(package);
                characterProfiles.Add(loaded.Profile);
                await Task.Delay(200);
                EnsureRenderersVisible(loaded.Root);
                var renderHost = new GameObject(
                    "AILIS Compatibility Render - " +
                    package.Manifest.id);
                var director =
                    renderHost.AddComponent<AilisRenderDirector>();
                director.SetOutputSize(FrameWidth, FrameHeight);
                var settings = new AilisRendererSettings
                {
                    pipelineAsset = "quality",
                    renderScale = 1f,
                    msaaSampleCount = 4,
                    targetFrameRate = 60
                };
                var camera = director.Initialize(
                    settings,
                    package.Manifest.art);
                camera.cullingMask = ~0;
                camera.clearFlags = CameraClearFlags.SolidColor;
                camera.backgroundColor =
                    new Color(0.94f, 0.95f, 0.96f, 1f);
                if (TryGetHumanoidBounds(
                        loaded.Animator,
                        out var avatarBounds) ||
                    TryGetWorldBounds(
                        loaded.Root,
                        out avatarBounds))
                {
                    director.FrameAvatar(
                        avatarBounds,
                        package.Manifest.art);
                }

                try
                {
                    foreach (var motion in motions)
                    {
                        results.Add(
                            ValidateMotion(
                                package,
                                loaded,
                                director,
                                camera,
                                motion,
                                outputDirectory));
                        await Task.Yield();
                    }
                }
                finally
                {
                    Destroy(renderHost);
                    Destroy(loaded.Root);
                    loaded.Bundle?.Unload(true);
                }
            }

            ApplyCrossAvatarRetargetConsistency(results);
            foreach (var result in results)
            {
                FinalizeResult(result);
            }
            var report = new AilisMotionCompatibilityReport
            {
                generatedAt = DateTimeOffset.UtcNow.ToString("O"),
                unityVersion = Application.unityVersion,
                graphicsDevice = SystemInfo.graphicsDeviceName,
                characterCount = manifestPaths.Length,
                motionCount = motions.Length,
                combinationCount = results.Count,
                passCount = results.Count(item => item.status == "pass"),
                reviewCount = results.Count(item => item.status == "review"),
                failCount = results.Count(item => item.status == "fail"),
                characterProfiles = characterProfiles.ToArray(),
                results = results.ToArray()
            };
            Directory.CreateDirectory(
                Path.GetDirectoryName(reportPath) ?? ".");
            File.WriteAllText(
                reportPath,
                JsonUtility.ToJson(report, true));
            Debug.Log(
                "[AILIS Motion Compatibility] Complete: pass=" +
                report.passCount +
                ", review=" +
                report.reviewCount +
                ", fail=" +
                report.failCount +
                ", report=" +
                reportPath);
        }

        private static AilisRuntimeMotionCatalogEntry[] SelectMotions(
            AilisRuntimeMotionCatalog catalog)
        {
            var requestedIds = new HashSet<string>(
                (ReadArgument(MotionIdsArgument) ?? "")
                .Split(
                    new[] { ',', ';' },
                    StringSplitOptions.RemoveEmptyEntries)
                .Select(value => value.Trim())
                .Where(value => value.Length > 0),
                StringComparer.OrdinalIgnoreCase);
            return (catalog?.motions ??
                    Array.Empty<AilisRuntimeMotionCatalogEntry>())
                .Where(
                    motion =>
                        motion != null &&
                        (requestedIds.Count == 0 ||
                         requestedIds.Contains(motion.id)))
                .ToArray();
        }

        private static async Task<LoadedAvatar> LoadAvatarAsync(
            AilisCharacterPackage package)
        {
            if (string.Equals(
                    package.Manifest.adapter,
                    "vrm",
                    StringComparison.OrdinalIgnoreCase))
            {
                var instance = await Vrm10.LoadPathAsync(
                    package.ModelPath,
                    canLoadVrm0X: true,
                    showMeshes: true,
                    awaitCaller: new RuntimeOnlyAwaitCaller());
                instance.GetComponent<RuntimeGltfInstance>()
                    ?.ShowMeshes();
                instance.transform.position = new Vector3(
                    package.Manifest.positionX,
                    package.Manifest.positionY,
                    package.Manifest.positionZ);
                instance.transform.localScale =
                    Vector3.one *
                    Mathf.Max(0.01f, package.Manifest.scale);
                var loaded = CreateLoadedAvatar(instance.gameObject, null);
                ApplyProfileIdentity(loaded.Profile, package);
                return loaded;
            }

            if (!string.Equals(
                    package.Manifest.adapter,
                    "asset-bundle",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new NotSupportedException(
                    "Motion compatibility validation does not support " +
                    "adapter: " +
                    package.Manifest.adapter);
            }

            var bundle = AssetBundle.LoadFromFile(package.ModelPath);
            if (bundle == null)
            {
                throw new InvalidDataException(
                    "Could not load character AssetBundle: " +
                    package.ModelPath);
            }
            GameObject prefab = null;
            if (!string.IsNullOrWhiteSpace(
                    package.Manifest.prefabAsset))
            {
                prefab = bundle.LoadAsset<GameObject>(
                    package.Manifest.prefabAsset);
            }
            if (prefab == null)
            {
                foreach (var assetName in bundle.GetAllAssetNames())
                {
                    prefab = bundle.LoadAsset<GameObject>(assetName);
                    if (prefab != null)
                    {
                        break;
                    }
                }
            }
            if (prefab == null)
            {
                bundle.Unload(true);
                throw new InvalidDataException(
                    "Character AssetBundle contains no GameObject prefab.");
            }
            var root = Instantiate(prefab);
            root.name = package.Manifest.displayName;
            root.transform.position = new Vector3(
                package.Manifest.positionX,
                package.Manifest.positionY,
                package.Manifest.positionZ);
            root.transform.localScale =
                Vector3.one *
                Mathf.Max(0.01f, package.Manifest.scale);
            var loadedAvatar = CreateLoadedAvatar(root, bundle);
            ApplyProfileIdentity(loadedAvatar.Profile, package);
            return loadedAvatar;
        }

        private static void ApplyProfileIdentity(
            AilisAvatarRetargetProfile profile,
            AilisCharacterPackage package)
        {
            profile.characterId = package.Manifest.id;
            profile.characterName = package.Manifest.displayName;
            profile.adapter = package.Manifest.adapter;
        }

        private static LoadedAvatar CreateLoadedAvatar(
            GameObject root,
            AssetBundle bundle)
        {
            EnsureRenderersVisible(root);
            var animator = root.GetComponentInChildren<Animator>(true);
            if (animator == null ||
                animator.avatar == null ||
                !animator.avatar.isHuman)
            {
                Destroy(root);
                bundle?.Unload(true);
                throw new InvalidDataException(
                    "Character does not expose a valid Humanoid Animator.");
            }
            animator.applyRootMotion = false;
            animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
            animator.runtimeAnimatorController = null;
            RestoreBindPose(animator);
            var profile = BuildRetargetProfile(root, animator);
            return new LoadedAvatar
            {
                Root = root,
                Animator = animator,
                Bundle = bundle,
                Profile = profile,
                WorldToBindFrame = ResolveWorldToBindFrame(animator),
                BindRootRotation = animator.transform.rotation
            };
        }

        private static void SetLayerRecursively(
            Transform root,
            int layer)
        {
            root.gameObject.layer = layer;
            for (var index = 0; index < root.childCount; index += 1)
            {
                SetLayerRecursively(root.GetChild(index), layer);
            }
        }

        private static void EnsureRenderersVisible(GameObject root)
        {
            SetLayerRecursively(root.transform, 0);
            foreach (var renderer in
                     root.GetComponentsInChildren<Renderer>(true))
            {
                renderer.enabled = true;
                renderer.forceRenderingOff = false;
                if (renderer is SkinnedMeshRenderer skinned)
                {
                    skinned.updateWhenOffscreen = true;
                }
            }
        }

        private static AilisAvatarRetargetProfile BuildRetargetProfile(
            GameObject root,
            Animator animator)
        {
            var missing = CoreHumanoidBones
                .Where(bone => animator.GetBoneTransform(bone) == null)
                .Select(bone => bone.ToString())
                .ToArray();
            var mappedBoneCount = 0;
            for (
                var index = 0;
                index < (int)HumanBodyBones.LastBone;
                index += 1)
            {
                if (animator.GetBoneTransform((HumanBodyBones)index) != null)
                {
                    mappedBoneCount += 1;
                }
            }

            var bounds = TryGetWorldBounds(root, out var avatarBounds)
                ? avatarBounds
                : new Bounds(root.transform.position, Vector3.one);
            var height = Mathf.Max(0.2f, bounds.size.y);
            var leftUpperArm = animator.GetBoneTransform(
                HumanBodyBones.LeftUpperArm);
            var rightUpperArm = animator.GetBoneTransform(
                HumanBodyBones.RightUpperArm);
            var leftHand = animator.GetBoneTransform(
                HumanBodyBones.LeftHand);
            var rightHand = animator.GetBoneTransform(
                HumanBodyBones.RightHand);
            var bindForward = ResolveBodyForward(animator);

            return new AilisAvatarRetargetProfile
            {
                avatarValid = animator.avatar != null &&
                    animator.avatar.isValid,
                humanoid = animator.avatar != null &&
                    animator.avatar.isHuman &&
                    animator.isHuman,
                mappedBoneCount = mappedBoneCount,
                mappedCoreBoneCount =
                    CoreHumanoidBones.Length - missing.Length,
                expectedCoreBoneCount = CoreHumanoidBones.Length,
                humanScale = animator.humanScale,
                avatarHeight = height,
                bindFacingAngleToRootDegrees = Vector3.Angle(
                    bindForward,
                    animator.transform.forward),
                shoulderWidthNormalized = NormalizedDistance(
                    leftUpperArm,
                    rightUpperArm,
                    height),
                armSpanNormalized = NormalizedDistance(
                    leftHand,
                    rightHand,
                    height),
                leftUpperArmNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.LeftUpperArm,
                    HumanBodyBones.LeftLowerArm,
                    height),
                leftLowerArmNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.LeftLowerArm,
                    HumanBodyBones.LeftHand,
                    height),
                rightUpperArmNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.RightUpperArm,
                    HumanBodyBones.RightLowerArm,
                    height),
                rightLowerArmNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.RightLowerArm,
                    HumanBodyBones.RightHand,
                    height),
                leftUpperLegNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.LeftUpperLeg,
                    HumanBodyBones.LeftLowerLeg,
                    height),
                leftLowerLegNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.LeftLowerLeg,
                    HumanBodyBones.LeftFoot,
                    height),
                rightUpperLegNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.RightUpperLeg,
                    HumanBodyBones.RightLowerLeg,
                    height),
                rightLowerLegNormalized = NormalizedBoneLength(
                    animator,
                    HumanBodyBones.RightLowerLeg,
                    HumanBodyBones.RightFoot,
                    height),
                missingCoreBones = missing
            };
        }

        private static float NormalizedBoneLength(
            Animator animator,
            HumanBodyBones start,
            HumanBodyBones end,
            float height)
        {
            return NormalizedDistance(
                animator.GetBoneTransform(start),
                animator.GetBoneTransform(end),
                height);
        }

        private static float NormalizedDistance(
            Transform start,
            Transform end,
            float height)
        {
            return start == null || end == null
                ? 0f
                : Vector3.Distance(start.position, end.position) /
                  Mathf.Max(0.2f, height);
        }

        private static AilisMotionCompatibilityResult ValidateMotion(
            AilisCharacterPackage package,
            LoadedAvatar avatar,
            AilisRenderDirector director,
            Camera camera,
            AilisRuntimeMotionCatalogEntry motion,
            string outputDirectory)
        {
            var clip = Resources.Load<AnimationClip>(
                motion.resourcePath);
            if (clip == null)
            {
                throw new InvalidDataException(
                    "Compiled Humanoid clip is missing: " +
                    motion.resourcePath);
            }

            RestoreBindPose(avatar.Animator);
            var originalPose = CapturePose(avatar.Root);
            var warnings = new HashSet<string>(
                StringComparer.OrdinalIgnoreCase);
            var result = new AilisMotionCompatibilityResult
            {
                characterId = package.Manifest.id,
                characterName = package.Manifest.displayName,
                adapter = package.Manifest.adapter,
                motionId = motion.id,
                motionName = motion.displayName,
                sourceClipName = motion.sourceClipName,
                humanoid = clip.isHumanMotion,
                sampleCount = SampleTimes.Length,
                rendererCount = avatar.Root
                    .GetComponentsInChildren<Renderer>(true)
                    .Length,
                invalidShaderMaterialCount =
                    CountInvalidShaderMaterials(avatar.Root)
            };
            var contactFrames = new List<Texture2D>();
            var retargetFrames = new List<Texture2D>();
            var graph = PlayableGraph.Create(
                "AILIS Motion Compatibility - " +
                package.Manifest.id +
                " - " +
                motion.id);
            graph.SetTimeUpdateMode(DirectorUpdateMode.Manual);
            var playable = AnimationClipPlayable.Create(graph, clip);
            playable.SetApplyFootIK(false);
            playable.SetApplyPlayableIK(false);
            var output = AnimationPlayableOutput.Create(
                graph,
                "AILIS Compatibility Pose",
                avatar.Animator);
            // Retarget QA must drive every target with the exact same raw clip.
            // Mixing a character's native controller here makes the comparison
            // character-specific and can hide or invent retargeting defects.
            output.SetSourcePlayable(playable);
            graph.Play();

            try
            {
                RestorePose(originalPose);
                playable.SetTime(0d);
                graph.Evaluate(0f);
                var baselineRoot =
                    ResolveRootPosition(avatar.Animator);
                var baselineFootY =
                    ResolveFootY(avatar.Animator);
                var baselineBounds =
                    TryGetHumanoidBounds(
                        avatar.Animator,
                        out var sampledBounds) ||
                    TryGetWorldBounds(
                        avatar.Root,
                        out sampledBounds)
                    ? sampledBounds
                    : new Bounds(
                        avatar.Root.transform.position,
                        Vector3.one * 1.6f);
                var height =
                    Mathf.Max(0.2f, baselineBounds.size.y);
                result.avatarHeight = height;

                for (
                    var sampleIndex = 0;
                    sampleIndex < SampleTimes.Length;
                    sampleIndex += 1)
                {
                    RestorePose(originalPose);
                    playable.SetTime(
                        Math.Max(
                            0d,
                            clip.length * SampleTimes[sampleIndex]));
                    graph.Evaluate(0f);
                    EvaluatePose(
                        avatar.Animator,
                        motion,
                        height,
                        baselineRoot,
                        baselineFootY,
                        avatar.Root,
                        avatar.WorldToBindFrame,
                        avatar.BindRootRotation,
                        result,
                        warnings);
                    if (ContactSheetSampleIndices.Contains(sampleIndex))
                    {
                        EnsureRenderersVisible(avatar.Root);
                        if (TryGetHumanoidBounds(
                                avatar.Animator,
                                out var currentBounds) ||
                            TryGetWorldBounds(
                                avatar.Root,
                                out currentBounds))
                        {
                            director.FrameAvatar(
                                currentBounds,
                                package.Manifest.art);
                            var viewport =
                                camera.WorldToViewportPoint(
                                    currentBounds.center);
                            result.captureViewportX = viewport.x;
                            result.captureViewportY = viewport.y;
                            result.captureViewportDepth = viewport.z;
                            result.captureNearClip =
                                camera.nearClipPlane;
                            result.captureFarClip =
                                camera.farClipPlane;
                        }
                        var frame = RenderFrame(
                            camera,
                            FrameWidth,
                            FrameHeight);
                        var foregroundRatio =
                            CalculateForegroundRatio(
                                frame,
                                camera.backgroundColor);
                        if (foregroundRatio < 0.001f)
                        {
                            Destroy(frame);
                            frame = RenderSilhouetteFrame(
                                camera,
                                avatar.Root,
                                FrameWidth,
                                FrameHeight);
                            foregroundRatio =
                                CalculateForegroundRatio(
                                    frame,
                                    camera.backgroundColor);
                            if (foregroundRatio >= 0.001f)
                            {
                                result.silhouetteFallbackFrames += 1;
                                result.captureMode = "silhouette";
                            }
                        }
                        result.maximumVisiblePixelRatio = Mathf.Max(
                            result.maximumVisiblePixelRatio,
                            foregroundRatio);
                        contactFrames.Add(frame);
                        retargetFrames.Add(
                            RenderSilhouetteFrame(
                                camera,
                                avatar.Root,
                                FrameWidth,
                                FrameHeight));
                    }
                }
            }
            finally
            {
                graph.Destroy();
                RestorePose(originalPose);
            }

            result.visualStatus =
                result.maximumVisiblePixelRatio < 0.001f
                    ? "capture_unavailable"
                    : result.silhouetteFallbackFrames > 0
                        ? "silhouette_only"
                    : "pending_review";
            if (result.torsoProximityFrames > 0)
            {
                warnings.Add(
                    "Hand or forearm entered the torso proximity volume; " +
                    "inspect sleeves, chest and waist in the contact sheet.");
            }
            if (result.headProximityFrames > 0)
            {
                warnings.Add(
                    "A hand entered the head proximity volume; this may be " +
                    "intentional, but hair and face clipping need review.");
            }
            if (result.groundPenetrationFrames > 0)
            {
                warnings.Add(
                    "A foot moved below the character baseline.");
            }
            if (result.footCrossingFrames > 0)
            {
                warnings.Add(
                    "Feet became unusually close; inspect leg and skirt " +
                    "intersection.");
            }
            if (result.tPoseLikeFrames > 0)
            {
                warnings.Add(
                    "The motion produced a T-pose-like frame. A high count " +
                    "usually means Humanoid retargeting failed even when the " +
                    "clip reports isHumanMotion=true.");
            }
            if (result.maximumRenderWidthNormalized > 1.55f)
            {
                warnings.Add(
                    "Rendered character width expanded to " +
                    result.maximumRenderWidthNormalized.ToString("0.00") +
                    " avatar heights; inspect sleeves, hair and arm " +
                    "deformation.");
            }
            if (result.maximumVisiblePixelRatio < 0.001f)
            {
                warnings.Add(
                    "The compatibility render contains no visible character " +
                    "pixels. This is a capture infrastructure failure, not a " +
                    "Humanoid retarget failure.");
            }
            else if (result.silhouetteFallbackFrames > 0)
            {
                warnings.Add(
                    "The art materials were not visible in the validation " +
                    "camera, so the contact sheet uses a neutral silhouette. " +
                    "Bone retargeting can be reviewed, but materials and " +
                    "clothing still require live playback review.");
            }
            if (result.invalidShaderMaterialCount > 0)
            {
                warnings.Add(
                    result.invalidShaderMaterialCount +
                    " materials use a missing or unsupported shader.");
            }
            result.warnings = warnings.ToArray();
            result.contactSheet = SaveContactSheet(
                contactFrames,
                outputDirectory,
                package.Manifest.id,
                motion.id);
            result.retargetContactSheet = SaveContactSheet(
                retargetFrames,
                outputDirectory,
                package.Manifest.id,
                motion.id + "__retarget-skeleton");
            foreach (var frame in contactFrames)
            {
                Destroy(frame);
            }
            foreach (var frame in retargetFrames)
            {
                Destroy(frame);
            }
            return result;
        }

        private static void EvaluatePose(
            Animator animator,
            AilisRuntimeMotionCatalogEntry motion,
            float height,
            Vector3 baselineRoot,
            float baselineFootY,
            GameObject avatarRoot,
            Quaternion worldToBindFrame,
            Quaternion bindRootRotation,
            AilisMotionCompatibilityResult result,
            HashSet<string> warnings)
        {
            var requiredBones = new[]
            {
                HumanBodyBones.Hips,
                HumanBodyBones.Head,
                HumanBodyBones.LeftHand,
                HumanBodyBones.RightHand,
                HumanBodyBones.LeftFoot,
                HumanBodyBones.RightFoot
            };
            foreach (var bone in requiredBones)
            {
                var transform = animator.GetBoneTransform(bone);
                if (transform == null ||
                    !IsFinite(transform.position) ||
                    !IsFinite(transform.rotation))
                {
                    result.finitePose = false;
                    warnings.Add(
                        "A required Humanoid bone is missing or non-finite: " +
                        bone);
                }
            }
            if (!result.finitePose)
            {
                return;
            }

            var hips = animator.GetBoneTransform(HumanBodyBones.Hips);
            var chest =
                animator.GetBoneTransform(HumanBodyBones.UpperChest) ??
                animator.GetBoneTransform(HumanBodyBones.Chest) ??
                animator.GetBoneTransform(HumanBodyBones.Spine);
            var head = animator.GetBoneTransform(HumanBodyBones.Head);
            var leftHand =
                animator.GetBoneTransform(HumanBodyBones.LeftHand);
            var rightHand =
                animator.GetBoneTransform(HumanBodyBones.RightHand);
            var leftUpperArm =
                animator.GetBoneTransform(HumanBodyBones.LeftUpperArm);
            var rightUpperArm =
                animator.GetBoneTransform(HumanBodyBones.RightUpperArm);
            var leftForearm =
                animator.GetBoneTransform(HumanBodyBones.LeftLowerArm);
            var rightForearm =
                animator.GetBoneTransform(HumanBodyBones.RightLowerArm);
            var leftUpperLeg =
                animator.GetBoneTransform(HumanBodyBones.LeftUpperLeg);
            var rightUpperLeg =
                animator.GetBoneTransform(HumanBodyBones.RightUpperLeg);
            var leftLowerLeg =
                animator.GetBoneTransform(HumanBodyBones.LeftLowerLeg);
            var rightLowerLeg =
                animator.GetBoneTransform(HumanBodyBones.RightLowerLeg);
            var leftFoot =
                animator.GetBoneTransform(HumanBodyBones.LeftFoot);
            var rightFoot =
                animator.GetBoneTransform(HumanBodyBones.RightFoot);

            var torsoThreshold = height * 0.045f;
            if (DistancePointToSegment(
                    leftHand.position,
                    hips.position,
                    chest.position) < torsoThreshold ||
                DistancePointToSegment(
                    rightHand.position,
                    hips.position,
                    chest.position) < torsoThreshold ||
                leftForearm != null &&
                DistancePointToSegment(
                    leftForearm.position,
                    hips.position,
                    chest.position) < torsoThreshold * 0.8f ||
                rightForearm != null &&
                DistancePointToSegment(
                    rightForearm.position,
                    hips.position,
                    chest.position) < torsoThreshold * 0.8f)
            {
                result.torsoProximityFrames += 1;
            }
            var headThreshold = height * 0.065f;
            if (Vector3.Distance(leftHand.position, head.position) <
                    headThreshold ||
                Vector3.Distance(rightHand.position, head.position) <
                    headThreshold)
            {
                result.headProximityFrames += 1;
            }
            if (Mathf.Min(
                    leftFoot.position.y,
                    rightFoot.position.y) <
                baselineFootY - height * 0.075f)
            {
                result.groundPenetrationFrames += 1;
            }
            if (Vector3.Distance(
                    leftFoot.position,
                    rightFoot.position) <
                height * 0.035f)
            {
                result.footCrossingFrames += 1;
            }

            var handSpan =
                Vector3.Distance(
                    leftHand.position,
                    rightHand.position) /
                height;
            result.maximumHandSpanNormalized = Mathf.Max(
                result.maximumHandSpanNormalized,
                handSpan);
            if (leftUpperArm != null &&
                rightUpperArm != null &&
                handSpan > 0.72f &&
                Mathf.Abs(
                    leftHand.position.y -
                    leftUpperArm.position.y) < height * 0.1f &&
                Mathf.Abs(
                    rightHand.position.y -
                    rightUpperArm.position.y) < height * 0.1f)
            {
                result.tPoseLikeFrames += 1;
            }
            if (TryGetWorldBounds(
                    avatarRoot,
                    out var renderBounds))
            {
                result.maximumRenderWidthNormalized = Mathf.Max(
                    result.maximumRenderWidthNormalized,
                    renderBounds.size.x / height);
            }

            var rootDrift =
                Vector3.Distance(
                    ResolveRootPosition(animator),
                    baselineRoot) /
                height;
            result.maximumRootDriftNormalized = Mathf.Max(
                result.maximumRootDriftNormalized,
                rootDrift);
            result.maximumRootYawDeltaDegrees = Mathf.Max(
                result.maximumRootYawDeltaDegrees,
                Mathf.Abs(
                    Mathf.DeltaAngle(
                        bindRootRotation.eulerAngles.y,
                        animator.transform.rotation.eulerAngles.y)));
            var bodyForward = ResolveBodyForward(animator);
            var bodyForwardInBindFrame =
                worldToBindFrame * bodyForward;
            result.maximumBodyFacingDeltaDegrees = Mathf.Max(
                result.maximumBodyFacingDeltaDegrees,
                Vector3.Angle(
                    Vector3.forward,
                    bodyForwardInBindFrame));
            result.minimumLeftElbowAngleDegrees = Mathf.Min(
                result.minimumLeftElbowAngleDegrees,
                ResolveJointAngle(
                    leftUpperArm,
                    leftForearm,
                    leftHand));
            result.minimumRightElbowAngleDegrees = Mathf.Min(
                result.minimumRightElbowAngleDegrees,
                ResolveJointAngle(
                    rightUpperArm,
                    rightForearm,
                    rightHand));
            result.minimumLeftKneeAngleDegrees = Mathf.Min(
                result.minimumLeftKneeAngleDegrees,
                ResolveJointAngle(
                    leftUpperLeg,
                    leftLowerLeg,
                    leftFoot));
            result.minimumRightKneeAngleDegrees = Mathf.Min(
                result.minimumRightKneeAngleDegrees,
                ResolveJointAngle(
                    rightUpperLeg,
                    rightLowerLeg,
                    rightFoot));
            result.PoseDirectionSamples.Add(
                CapturePoseDirectionSignature(
                    animator,
                    worldToBindFrame));
            if (!motion.HasStyleTag("locomotion") &&
                rootDrift > 0.35f)
            {
                warnings.Add(
                    "A non-locomotion clip displaced the Humanoid root by " +
                    rootDrift.ToString("0.000") +
                    " avatar heights.");
            }
        }

        private static int CalculateRiskScore(
            AilisMotionCompatibilityResult result)
        {
            if (!result.finitePose || !result.humanoid)
            {
                return 100;
            }
            var samples = Mathf.Max(1, result.sampleCount);
            var score = 0f;
            score += 32f *
                     result.groundPenetrationFrames /
                     samples;
            score += 28f *
                     result.torsoProximityFrames /
                     samples;
            score += 18f *
                     result.headProximityFrames /
                     samples;
            score += 12f *
                     result.footCrossingFrames /
                     samples;
            score += 72f *
                     result.tPoseLikeFrames /
                     samples;
            if (result.maximumRenderWidthNormalized > 1.55f)
            {
                score += Mathf.Min(
                    45f,
                    (result.maximumRenderWidthNormalized - 1.55f) *
                    35f);
            }
            if (result.maximumRootDriftNormalized > 0.35f)
            {
                score += Mathf.Min(
                    30f,
                    result.maximumRootDriftNormalized * 35f);
            }
            if (result.crossAvatarStatus == "warning")
            {
                score += 15f;
            }
            else if (result.crossAvatarStatus == "fail")
            {
                score += 55f;
            }
            return Mathf.Clamp(Mathf.RoundToInt(score), 0, 100);
        }

        private static void ApplyCrossAvatarRetargetConsistency(
            IReadOnlyList<AilisMotionCompatibilityResult> results)
        {
            foreach (var motionGroup in results.GroupBy(
                         result => result.motionId,
                         StringComparer.OrdinalIgnoreCase))
            {
                var peers = motionGroup.ToArray();
                foreach (var result in peers)
                {
                    var angleSum = 0f;
                    var angleCount = 0;
                    var maximumAngle = 0f;
                    foreach (var peer in peers)
                    {
                        if (ReferenceEquals(result, peer))
                        {
                            continue;
                        }
                        ComparePoseDirectionSamples(
                            result.PoseDirectionSamples,
                            peer.PoseDirectionSamples,
                            ref angleSum,
                            ref angleCount,
                            ref maximumAngle);
                        result.comparisonPeerCount += 1;
                    }
                    result.crossAvatarMeanJointAngleDeltaDegrees =
                        angleCount == 0
                            ? 0f
                            : angleSum / angleCount;
                    result.crossAvatarMaximumJointAngleDeltaDegrees =
                        maximumAngle;
                    result.crossAvatarStatus =
                        result.comparisonPeerCount == 0 ||
                        angleCount == 0
                            ? "unavailable"
                            : result.crossAvatarMeanJointAngleDeltaDegrees >
                              30f ||
                              maximumAngle > 95f
                                ? "fail"
                                : result
                                      .crossAvatarMeanJointAngleDeltaDegrees >
                                  18f ||
                                  maximumAngle > 55f
                                    ? "warning"
                                    : "pass";
                }
            }
        }

        private static void ComparePoseDirectionSamples(
            IReadOnlyList<float[]> leftSamples,
            IReadOnlyList<float[]> rightSamples,
            ref float angleSum,
            ref int angleCount,
            ref float maximumAngle)
        {
            var sampleCount = Mathf.Min(
                leftSamples?.Count ?? 0,
                rightSamples?.Count ?? 0);
            for (var sampleIndex = 0;
                 sampleIndex < sampleCount;
                 sampleIndex += 1)
            {
                var left = leftSamples[sampleIndex];
                var right = rightSamples[sampleIndex];
                var componentCount = Mathf.Min(
                    left?.Length ?? 0,
                    right?.Length ?? 0);
                for (var offset = 0;
                     offset + 2 < componentCount;
                     offset += 3)
                {
                    var leftDirection = new Vector3(
                        left[offset],
                        left[offset + 1],
                        left[offset + 2]);
                    var rightDirection = new Vector3(
                        right[offset],
                        right[offset + 1],
                        right[offset + 2]);
                    if (leftDirection.sqrMagnitude < 0.5f ||
                        rightDirection.sqrMagnitude < 0.5f)
                    {
                        continue;
                    }
                    var angle = Vector3.Angle(
                        leftDirection,
                        rightDirection);
                    angleSum += angle;
                    angleCount += 1;
                    maximumAngle = Mathf.Max(maximumAngle, angle);
                }
            }
        }

        private static void FinalizeResult(
            AilisMotionCompatibilityResult result)
        {
            var warnings = new HashSet<string>(
                result.warnings ?? Array.Empty<string>(),
                StringComparer.OrdinalIgnoreCase);
            if (result.crossAvatarStatus == "warning")
            {
                warnings.Add(
                    "The normalized Humanoid pose differs noticeably across " +
                    "target Avatars; inspect the contact sheets before reuse.");
            }
            else if (result.crossAvatarStatus == "fail")
            {
                warnings.Add(
                    "The same Humanoid clip produced inconsistent limb " +
                    "directions across target Avatars. Check the source " +
                    "Avatar mapping and target Avatar configuration.");
            }
            if (result.maximumBodyFacingDeltaDegrees > 120f)
            {
                warnings.Add(
                    "The animated torso turned more than 120 degrees from " +
                    "the target Avatar bind-facing direction.");
            }
            result.riskScore = CalculateRiskScore(result);
            result.mechanicalStatus =
                !result.finitePose ||
                !result.humanoid ||
                result.crossAvatarStatus == "fail" ||
                result.riskScore >= 70
                    ? "fail"
                    : result.riskScore >= 15
                        ? "warning"
                        : "pass";
            result.status = result.mechanicalStatus == "fail"
                ? "fail"
                : "review";
            result.warnings = warnings.ToArray();
        }

        private static PoseSnapshot[] CapturePose(GameObject root)
        {
            return root
                .GetComponentsInChildren<Transform>(true)
                .Select(
                    transform => new PoseSnapshot
                    {
                        Transform = transform,
                        LocalPosition = transform.localPosition,
                        LocalRotation = transform.localRotation,
                        LocalScale = transform.localScale
                    })
                .ToArray();
        }

        private static float[] CapturePoseDirectionSignature(
            Animator animator,
            Quaternion worldToBindFrame)
        {
            var values = new float[PoseSegmentStarts.Length * 3];
            for (
                var index = 0;
                index < PoseSegmentStarts.Length;
                index += 1)
            {
                var start = animator.GetBoneTransform(
                    PoseSegmentStarts[index]);
                var end = animator.GetBoneTransform(
                    PoseSegmentEnds[index]);
                var direction =
                    start == null ||
                    end == null ||
                    (end.position - start.position).sqrMagnitude <
                    0.000001f
                        ? Vector3.zero
                        : worldToBindFrame *
                          (end.position - start.position).normalized;
                var offset = index * 3;
                values[offset] = direction.x;
                values[offset + 1] = direction.y;
                values[offset + 2] = direction.z;
            }
            return values;
        }

        private static Quaternion ResolveWorldToBindFrame(
            Animator animator)
        {
            var hips = animator.GetBoneTransform(HumanBodyBones.Hips);
            var head = animator.GetBoneTransform(HumanBodyBones.Head);
            var up = hips != null && head != null
                ? (head.position - hips.position).normalized
                : animator.transform.up;
            if (up.sqrMagnitude < 0.5f)
            {
                up = animator.transform.up;
            }
            var forward = ResolveBodyForward(animator);
            return Quaternion.Inverse(
                Quaternion.LookRotation(forward, up));
        }

        private static Vector3 ResolveBodyForward(Animator animator)
        {
            var leftUpperArm = animator.GetBoneTransform(
                HumanBodyBones.LeftUpperArm);
            var rightUpperArm = animator.GetBoneTransform(
                HumanBodyBones.RightUpperArm);
            var hips = animator.GetBoneTransform(HumanBodyBones.Hips);
            var head = animator.GetBoneTransform(HumanBodyBones.Head);
            if (leftUpperArm == null ||
                rightUpperArm == null ||
                hips == null ||
                head == null)
            {
                return animator.transform.forward;
            }
            var right =
                (rightUpperArm.position - leftUpperArm.position).normalized;
            var up = (head.position - hips.position).normalized;
            var forward = Vector3.Cross(right, up).normalized;
            return forward.sqrMagnitude < 0.5f
                ? animator.transform.forward
                : forward;
        }

        private static float ResolveJointAngle(
            Transform parent,
            Transform joint,
            Transform child)
        {
            if (parent == null || joint == null || child == null)
            {
                return 180f;
            }
            return Vector3.Angle(
                parent.position - joint.position,
                child.position - joint.position);
        }

        private static int CountInvalidShaderMaterials(GameObject root)
        {
            var invalid = 0;
            var visited = new HashSet<Material>();
            foreach (var renderer in
                     root.GetComponentsInChildren<Renderer>(true))
            {
                foreach (var material in renderer.sharedMaterials)
                {
                    if (material == null ||
                        !visited.Add(material))
                    {
                        continue;
                    }
                    if (material.shader == null ||
                        !material.shader.isSupported ||
                        material.shader.name.IndexOf(
                            "InternalErrorShader",
                            StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        invalid += 1;
                    }
                }
            }
            return invalid;
        }

        private static void RestorePose(IEnumerable<PoseSnapshot> snapshots)
        {
            foreach (var snapshot in snapshots)
            {
                if (snapshot?.Transform == null)
                {
                    continue;
                }
                snapshot.Transform.localPosition =
                    snapshot.LocalPosition;
                snapshot.Transform.localRotation =
                    snapshot.LocalRotation;
                snapshot.Transform.localScale =
                    snapshot.LocalScale;
            }
        }

        private static void RestoreBindPose(Animator animator)
        {
            animator.Rebind();
            animator.Update(0f);
        }

        private static Vector3 ResolveRootPosition(Animator animator)
        {
            return animator.GetBoneTransform(HumanBodyBones.Hips)
                       ?.position ??
                   animator.transform.position;
        }

        private static float ResolveFootY(Animator animator)
        {
            var left =
                animator.GetBoneTransform(HumanBodyBones.LeftFoot);
            var right =
                animator.GetBoneTransform(HumanBodyBones.RightFoot);
            if (left == null || right == null)
            {
                return animator.transform.position.y;
            }
            return Mathf.Min(left.position.y, right.position.y);
        }

        private static float DistancePointToSegment(
            Vector3 point,
            Vector3 start,
            Vector3 end)
        {
            var segment = end - start;
            var lengthSquared = segment.sqrMagnitude;
            if (lengthSquared <= 0.000001f)
            {
                return Vector3.Distance(point, start);
            }
            var amount = Mathf.Clamp01(
                Vector3.Dot(point - start, segment) /
                lengthSquared);
            return Vector3.Distance(
                point,
                start + segment * amount);
        }

        private static bool IsFinite(Vector3 value)
        {
            return IsFinite(value.x) &&
                   IsFinite(value.y) &&
                   IsFinite(value.z);
        }

        private static bool IsFinite(Quaternion value)
        {
            return IsFinite(value.x) &&
                   IsFinite(value.y) &&
                   IsFinite(value.z) &&
                   IsFinite(value.w);
        }

        private static bool IsFinite(float value)
        {
            return !float.IsNaN(value) &&
                   !float.IsInfinity(value);
        }

        private static bool TryGetWorldBounds(
            GameObject root,
            out Bounds bounds)
        {
            bounds = default;
            var found = false;
            foreach (var renderer in
                     root.GetComponentsInChildren<Renderer>(true))
            {
                if (!renderer.enabled ||
                    !renderer.gameObject.activeInHierarchy)
                {
                    continue;
                }
                if (!found)
                {
                    bounds = renderer.bounds;
                    found = true;
                }
                else
                {
                    bounds.Encapsulate(renderer.bounds);
                }
            }
            return found;
        }

        private static bool TryGetHumanoidBounds(
            Animator animator,
            out Bounds bounds)
        {
            bounds = default;
            var found = false;
            foreach (var bone in CoreHumanoidBones)
            {
                var transform = animator?.GetBoneTransform(bone);
                if (transform == null ||
                    !IsFinite(transform.position))
                {
                    continue;
                }
                if (!found)
                {
                    bounds = new Bounds(
                        transform.position,
                        Vector3.zero);
                    found = true;
                }
                else
                {
                    bounds.Encapsulate(transform.position);
                }
            }
            if (!found)
            {
                return false;
            }
            var padding = Mathf.Max(0.05f, bounds.size.y * 0.08f);
            bounds.Expand(
                new Vector3(
                    padding * 2f,
                    padding * 2f,
                    padding * 2f));
            return true;
        }

        private static Texture2D RenderFrame(
            Camera camera,
            int width,
            int height)
        {
            var target = RenderTexture.GetTemporary(
                width,
                height,
                24,
                RenderTextureFormat.ARGB32,
                RenderTextureReadWrite.sRGB);
            var previousTarget = camera.targetTexture;
            var previousActive = RenderTexture.active;
            camera.targetTexture = target;
            camera.Render();
            RenderTexture.active = target;
            var texture = new Texture2D(
                width,
                height,
                TextureFormat.RGBA32,
                false);
            texture.ReadPixels(
                new Rect(0, 0, width, height),
                0,
                0);
            texture.Apply(false, false);
            camera.targetTexture = previousTarget;
            RenderTexture.active = previousActive;
            RenderTexture.ReleaseTemporary(target);
            return texture;
        }

        private static Texture2D RenderSilhouetteFrame(
            Camera camera,
            GameObject root,
            int width,
            int height)
        {
            var sourceMaterial = Resources.Load<Material>(
                "AILIS/Rendering/AILIS_VrmaGuideMaterial");
            var shader = sourceMaterial == null
                ? Shader.Find("Universal Render Pipeline/Unlit") ??
                  Shader.Find("Unlit/Color")
                : sourceMaterial.shader;
            if (sourceMaterial == null && shader == null)
            {
                return RenderFrame(camera, width, height);
            }
            var material = sourceMaterial != null
                ? Instantiate(sourceMaterial)
                : new Material(shader);
            var silhouetteColor = new Color(0.08f, 0.42f, 0.52f, 1f);
            if (material.HasProperty("_BaseColor"))
            {
                material.SetColor("_BaseColor", silhouetteColor);
            }
            if (material.HasProperty("_Color"))
            {
                material.SetColor("_Color", silhouetteColor);
            }
            var renderers = root
                .GetComponentsInChildren<Renderer>(true)
                .ToArray();
            var originalEnabled = renderers
                .Select(renderer => renderer.enabled)
                .ToArray();
            var proxies = new List<GameObject>();
            try
            {
                var animator = root.GetComponentInChildren<Animator>(true);
                var avatarHeight = TryGetWorldBounds(
                    root,
                    out var avatarBounds)
                    ? Mathf.Max(0.2f, avatarBounds.size.y)
                    : 1.6f;
                var jointRadius = avatarHeight * 0.012f;
                for (
                    var index = 0;
                    index < PoseSegmentStarts.Length;
                    index += 1)
                {
                    var start = animator?.GetBoneTransform(
                        PoseSegmentStarts[index]);
                    var end = animator?.GetBoneTransform(
                        PoseSegmentEnds[index]);
                    if (start == null || end == null)
                    {
                        continue;
                    }
                    proxies.Add(
                        CreateBoneSegmentProxy(
                            start.position,
                            end.position,
                            jointRadius * 0.65f,
                            material));
                    proxies.Add(
                        CreateJointProxy(
                            start.position,
                            jointRadius,
                            material));
                    proxies.Add(
                        CreateJointProxy(
                            end.position,
                            jointRadius,
                            material));
                }
                for (var index = 0;
                     index < renderers.Length;
                     index += 1)
                {
                    renderers[index].enabled = false;
                }
                return RenderFrame(camera, width, height);
            }
            finally
            {
                for (var index = 0;
                     index < renderers.Length;
                     index += 1)
                {
                    if (renderers[index] != null)
                    {
                        renderers[index].enabled =
                            originalEnabled[index];
                    }
                }
                foreach (var proxy in proxies)
                {
                    Destroy(proxy);
                }
                Destroy(material);
            }
        }

        private static GameObject CreateJointProxy(
            Vector3 position,
            float radius,
            Material material)
        {
            var proxy = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            proxy.name = "AILIS Retarget Joint";
            proxy.layer = 0;
            proxy.transform.position = position;
            proxy.transform.localScale = Vector3.one * radius * 2f;
            proxy.GetComponent<Renderer>().sharedMaterial = material;
            var collider = proxy.GetComponent<Collider>();
            if (collider != null)
            {
                Destroy(collider);
            }
            return proxy;
        }

        private static GameObject CreateBoneSegmentProxy(
            Vector3 start,
            Vector3 end,
            float radius,
            Material material)
        {
            var direction = end - start;
            var proxy = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            proxy.name = "AILIS Retarget Bone";
            proxy.layer = 0;
            proxy.transform.position = (start + end) * 0.5f;
            proxy.transform.rotation = Quaternion.FromToRotation(
                Vector3.up,
                direction.normalized);
            proxy.transform.localScale = new Vector3(
                radius,
                direction.magnitude * 0.5f,
                radius);
            proxy.GetComponent<Renderer>().sharedMaterial = material;
            var collider = proxy.GetComponent<Collider>();
            if (collider != null)
            {
                Destroy(collider);
            }
            return proxy;
        }

        private static float CalculateForegroundRatio(
            Texture2D texture,
            Color background)
        {
            var pixels = texture.GetPixels32();
            var background32 = (Color32)background;
            var foreground = 0;
            foreach (var pixel in pixels)
            {
                var difference =
                    Mathf.Abs(pixel.r - background32.r) +
                    Mathf.Abs(pixel.g - background32.g) +
                    Mathf.Abs(pixel.b - background32.b);
                if (pixel.a > 12 && difference > 24)
                {
                    foreground += 1;
                }
            }
            return pixels.Length == 0
                ? 0f
                : (float)foreground / pixels.Length;
        }

        private static string SaveContactSheet(
            IReadOnlyList<Texture2D> frames,
            string outputDirectory,
            string characterId,
            string motionId)
        {
            if (frames.Count == 0)
            {
                return "";
            }
            var sheet = new Texture2D(
                FrameWidth * frames.Count,
                FrameHeight,
                TextureFormat.RGBA32,
                false);
            for (var index = 0; index < frames.Count; index += 1)
            {
                sheet.SetPixels32(
                    index * FrameWidth,
                    0,
                    FrameWidth,
                    FrameHeight,
                    frames[index].GetPixels32());
            }
            sheet.Apply(false, false);
            var path = Path.Combine(
                outputDirectory,
                SanitizeFileName(characterId) +
                "__" +
                SanitizeFileName(motionId) +
                ".png");
            File.WriteAllBytes(path, sheet.EncodeToPNG());
            Destroy(sheet);
            return Path.GetFullPath(path);
        }

        private static string SanitizeFileName(string value)
        {
            var invalid = Path.GetInvalidFileNameChars();
            return new string(
                (value ?? "")
                .Select(
                    character =>
                        invalid.Contains(character)
                            ? '_'
                            : character)
                .ToArray());
        }

        private static void WriteFailureReport(Exception error)
        {
            var reportPath = ReadArgument(ReportArgument);
            if (string.IsNullOrWhiteSpace(reportPath))
            {
                return;
            }
            reportPath = Path.GetFullPath(reportPath);
            Directory.CreateDirectory(
                Path.GetDirectoryName(reportPath) ?? ".");
            File.WriteAllText(
                reportPath,
                JsonUtility.ToJson(
                    new AilisMotionCompatibilityReport
                    {
                        generatedAt =
                            DateTimeOffset.UtcNow.ToString("O"),
                        unityVersion = Application.unityVersion,
                        graphicsDevice =
                            SystemInfo.graphicsDeviceName,
                        failCount = 1,
                        results = new[]
                        {
                            new AilisMotionCompatibilityResult
                            {
                                status = "fail",
                                riskScore = 100,
                                finitePose = false,
                                warnings = new[]
                                {
                                    error.GetType().Name +
                                    ": " +
                                    error.Message
                                }
                            }
                        }
                    },
                    true));
        }

        private static string ReadArgument(string name)
        {
            var args = Environment.GetCommandLineArgs();
            var index = Array.FindIndex(
                args,
                value => string.Equals(
                    value,
                    name,
                    StringComparison.Ordinal));
            return index >= 0 && index + 1 < args.Length
                ? args[index + 1]
                : "";
        }
    }
}
