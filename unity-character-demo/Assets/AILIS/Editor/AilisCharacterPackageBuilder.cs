#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Animations;
using UnityEngine;

namespace Ailis.CharacterDemo.Editor
{
    [Serializable]
    internal sealed class AilisCharacterImportRecipe
    {
        public string schema = "ailis.character-import-recipe.v2";
        public string id = "";
        public string displayName = "";
        public string sourcePrefab = "";
        public string bundleFileName = "";
        public bool stripMonoBehaviours = true;
        public string runtimeAnimatorController = "";
        public AilisNativePlayableLayerRecipe[] nativePlayableLayers =
            Array.Empty<AilisNativePlayableLayerRecipe>();
        public string[] motionLibraries = Array.Empty<string>();
        public AilisAnimatorStateRecipe[] animatorStates =
            Array.Empty<AilisAnimatorStateRecipe>();
        public float scale = 1f;
        public float positionX;
        public float positionY;
        public float positionZ;
        public string licenseSourceDirectory = "";
        public string licenseName = "";
        public string licenseUrl = "";
        public string attribution = "";
        public string[] importedAssetRoots = Array.Empty<string>();
        public AilisArtProfile art = new AilisArtProfile();
        public AilisBlendShapeChannel[] visemes = Array.Empty<AilisBlendShapeChannel>();
        public string[] blinkBlendShapeNames = Array.Empty<string>();
        public AilisVrmExpressionProfile vrmExpressionProfile =
            new AilisVrmExpressionProfile();
        public AilisExpressionDefinition[] expressions = Array.Empty<AilisExpressionDefinition>();
        public AilisMotionDefinition[] motions = Array.Empty<AilisMotionDefinition>();
    }

    [Serializable]
    internal sealed class AilisNativePlayableLayerRecipe
    {
        public string id = "";
        public string role = "";
        public string controllerPath = "";
        public string maskPath = "";
        public float weight = 1f;
        public bool additive;
        public bool enabled = true;
    }

    [Serializable]
    internal sealed class AilisMotionLibraryProfile
    {
        public string schema = "ailis.motion-library-profile.v1";
        public string id = "";
        public string displayName = "";
        public string license = "";
        public string sourceUrl = "";
        public AilisAnimatorStateRecipe[] animatorStates =
            Array.Empty<AilisAnimatorStateRecipe>();
        public AilisMotionDefinition[] motions =
            Array.Empty<AilisMotionDefinition>();
    }

    [Serializable]
    internal sealed class AilisAnimatorStateRecipe
    {
        public string stateName = "";
        public string clipPath = "";
        public string clipName = "";
        public int layerIndex;
        public string layerName = "";
        public bool loop;
        public bool setAsDefault;
        public bool bakeRootRotation;
        public float rootRotationOffsetY;
    }

    public static class AilisCharacterPackageBuilder
    {
        private const string RecipeArgument = "--character-recipe";

        public static void BuildFromCommandLine()
        {
            try
            {
                Build(ReadRequiredArgument(RecipeArgument));
                EditorApplication.Exit(0);
            }
            catch (Exception error)
            {
                Debug.LogException(error);
                EditorApplication.Exit(1);
            }
        }

        public static void CleanupImportedSourcesFromCommandLine()
        {
            try
            {
                CleanupImportedSources(ReadRequiredArgument(RecipeArgument));
                EditorApplication.Exit(0);
            }
            catch (Exception error)
            {
                Debug.LogException(error);
                EditorApplication.Exit(1);
            }
        }

        private static void Build(string recipePath)
        {
            var fullRecipePath = Path.GetFullPath(recipePath);
            if (!File.Exists(fullRecipePath))
            {
                throw new FileNotFoundException("Character import recipe was not found.", fullRecipePath);
            }

            var recipe = JsonUtility.FromJson<AilisCharacterImportRecipe>(
                File.ReadAllText(fullRecipePath));
            ValidateRecipe(recipe);
            ApplyMotionLibraries(recipe, fullRecipePath);

            var sourcePrefab = AssetDatabase.LoadAssetAtPath<GameObject>(recipe.sourcePrefab);
            if (sourcePrefab == null)
            {
                throw new InvalidDataException(
                    "Character source prefab is unavailable after package import: " +
                    recipe.sourcePrefab);
            }

            var generatedRoot = "Assets/AILIS/GeneratedPackages/" + recipe.id;
            EnsureAssetFolder(generatedRoot);
            var runtimeController = BuildRuntimeAnimatorController(
                recipe,
                generatedRoot,
                sourcePrefab);
            var expressionProfile = BakeVrmExpressionProfile(
                recipe,
                generatedRoot);
            var generatedPrefabPath = generatedRoot + "/" + recipe.id + ".prefab";
            BuildRuntimePrefab(
                sourcePrefab,
                generatedPrefabPath,
                recipe,
                runtimeController);
            AssetDatabase.SaveAssets();

            var bundleBuildRoot = Path.Combine(
                Path.GetFullPath(Path.Combine(Application.dataPath, "..")),
                "Temp",
                "AILISCharacterBundles",
                recipe.id);
            Directory.CreateDirectory(bundleBuildRoot);
            var bundleName = string.IsNullOrWhiteSpace(recipe.bundleFileName)
                ? recipe.id + "-windows"
                : recipe.bundleFileName;
            var manifest = BuildPipeline.BuildAssetBundles(
                bundleBuildRoot,
                new[]
                {
                    new AssetBundleBuild
                    {
                        assetBundleName = bundleName,
                        assetNames = new[] { generatedPrefabPath }
                    }
                },
                BuildAssetBundleOptions.ChunkBasedCompression |
                BuildAssetBundleOptions.StrictMode,
                BuildTarget.StandaloneWindows64);
            if (manifest == null)
            {
                throw new InvalidOperationException("Unity did not produce an AssetBundle manifest.");
            }

            var builtBundlePath = Path.Combine(bundleBuildRoot, bundleName);
            VerifyBundle(builtBundlePath, generatedPrefabPath);

            var runtimeRoot = Path.Combine(
                Application.dataPath,
                "StreamingAssets",
                "Characters",
                recipe.id);
            Directory.CreateDirectory(runtimeRoot);
            File.Copy(
                builtBundlePath,
                Path.Combine(runtimeRoot, bundleName),
                true);
            CopyLicense(recipe.licenseSourceDirectory, Path.Combine(runtimeRoot, "License"));
            WriteLicenseNotice(recipe, runtimeRoot);

            var packageManifest = new AilisCharacterPackageManifest
            {
                id = recipe.id,
                displayName = recipe.displayName,
                adapter = "asset-bundle",
                model = bundleName,
                prefabAsset = generatedPrefabPath.ToLowerInvariant(),
                scale = recipe.scale,
                positionX = recipe.positionX,
                positionY = recipe.positionY,
                positionZ = recipe.positionZ,
                art = recipe.art ?? new AilisArtProfile(),
                visemes = recipe.visemes ?? Array.Empty<AilisBlendShapeChannel>(),
                blinkBlendShapeNames = recipe.blinkBlendShapeNames ?? Array.Empty<string>(),
                vrmExpressionProfile = expressionProfile,
                expressions = recipe.expressions ?? Array.Empty<AilisExpressionDefinition>(),
                motions = recipe.motions ?? Array.Empty<AilisMotionDefinition>()
            };
            File.WriteAllText(
                Path.Combine(runtimeRoot, "ailis-character.json"),
                JsonUtility.ToJson(packageManifest, true));
            AssetDatabase.Refresh();

            Debug.Log(
                "[AILIS Character Import] Built " + recipe.id +
                " from " + recipe.sourcePrefab +
                " -> " + Path.Combine(runtimeRoot, bundleName));
        }

        private static void BuildRuntimePrefab(
            GameObject sourcePrefab,
            string generatedPrefabPath,
            AilisCharacterImportRecipe recipe,
            RuntimeAnimatorController runtimeController)
        {
            var instance = PrefabUtility.InstantiatePrefab(sourcePrefab) as GameObject;
            if (instance == null)
            {
                throw new InvalidOperationException(
                    "Unity could not instantiate the character prefab: " + recipe.sourcePrefab);
            }

            try
            {
                instance.name = recipe.displayName;
                if (recipe.stripMonoBehaviours)
                {
                    foreach (var behaviour in instance.GetComponentsInChildren<MonoBehaviour>(true))
                    {
                        UnityEngine.Object.DestroyImmediate(behaviour);
                    }
                    foreach (var child in instance.GetComponentsInChildren<Transform>(true))
                    {
                        GameObjectUtility.RemoveMonoBehavioursWithMissingScript(
                            child.gameObject);
                    }
                }

                var animator = instance.GetComponentInChildren<Animator>(true);
                if (animator == null)
                {
                    throw new InvalidDataException(
                        "The source prefab needs an Animator.");
                }
                if (runtimeController != null)
                {
                    animator.runtimeAnimatorController = runtimeController;
                }
                if (animator.runtimeAnimatorController == null)
                {
                    throw new InvalidDataException(
                        "The source prefab needs an Animator with a runtime controller.");
                }
                if (!animator.isHuman)
                {
                    throw new InvalidDataException(
                        "The source prefab Animator must use a Humanoid avatar.");
                }
                AttachNativePlayableLayers(
                    instance,
                    recipe.nativePlayableLayers);

                PrefabUtility.SaveAsPrefabAsset(instance, generatedPrefabPath, out var success);
                if (!success)
                {
                    throw new InvalidOperationException(
                        "Unity could not save the generated runtime prefab: " +
                        generatedPrefabPath);
                }
            }
            finally
            {
                UnityEngine.Object.DestroyImmediate(instance);
            }
        }

        private static RuntimeAnimatorController BuildRuntimeAnimatorController(
            AilisCharacterImportRecipe recipe,
            string generatedRoot,
            GameObject sourcePrefab)
        {
            var nativeController = ResolveFirstNativePlayableController(
                recipe.nativePlayableLayers);
            if (nativeController != null)
            {
                Debug.Log(
                    "[AILIS Character Import] Preserving UnityPackage " +
                    "Animator/Playable Layers. Bootstrap controller: " +
                    nativeController.name);
                return nativeController;
            }

            if (recipe.animatorStates != null && recipe.animatorStates.Length > 0)
            {
                return BuildGeneratedAnimatorController(
                    recipe,
                    generatedRoot);
            }

            if (!string.IsNullOrWhiteSpace(recipe.runtimeAnimatorController))
            {
                var configuredController =
                    AssetDatabase.LoadAssetAtPath<RuntimeAnimatorController>(
                        recipe.runtimeAnimatorController);
                if (configuredController == null)
                {
                    throw new InvalidDataException(
                        "Configured runtime AnimatorController was not found: " +
                        recipe.runtimeAnimatorController);
                }
                return configuredController;
            }

            return sourcePrefab
                .GetComponentInChildren<Animator>(true)
                ?.runtimeAnimatorController;
        }

        private static RuntimeAnimatorController
            ResolveFirstNativePlayableController(
                IEnumerable<AilisNativePlayableLayerRecipe> recipes)
        {
            foreach (var layer in recipes ??
                                  Array.Empty<AilisNativePlayableLayerRecipe>())
            {
                if (layer?.enabled != true ||
                    string.IsNullOrWhiteSpace(layer.controllerPath))
                {
                    continue;
                }
                var controller =
                    AssetDatabase.LoadAssetAtPath<RuntimeAnimatorController>(
                        layer.controllerPath);
                if (controller == null)
                {
                    throw new InvalidDataException(
                        "Native Playable Layer controller was not found: " +
                        layer.controllerPath);
                }
                return controller;
            }
            return null;
        }

        private static void AttachNativePlayableLayers(
            GameObject instance,
            IEnumerable<AilisNativePlayableLayerRecipe> recipes)
        {
            var definitions = new List<AilisNativePlayableLayer>();
            foreach (var recipe in recipes ??
                                   Array.Empty<AilisNativePlayableLayerRecipe>())
            {
                if (recipe?.enabled != true ||
                    string.IsNullOrWhiteSpace(recipe.controllerPath))
                {
                    continue;
                }
                var controller =
                    AssetDatabase.LoadAssetAtPath<RuntimeAnimatorController>(
                        recipe.controllerPath);
                if (controller == null)
                {
                    throw new InvalidDataException(
                        "Native Playable Layer controller was not found: " +
                        recipe.controllerPath);
                }
                AvatarMask mask = null;
                if (!string.IsNullOrWhiteSpace(recipe.maskPath))
                {
                    mask = AssetDatabase.LoadAssetAtPath<AvatarMask>(
                        recipe.maskPath);
                    if (mask == null)
                    {
                        throw new InvalidDataException(
                            "Native Playable Layer AvatarMask was not found: " +
                            recipe.maskPath);
                    }
                }
                definitions.Add(new AilisNativePlayableLayer
                {
                    id = string.IsNullOrWhiteSpace(recipe.id)
                        ? controller.name
                        : recipe.id,
                    role = recipe.role,
                    controller = controller,
                    mask = mask,
                    weight = Mathf.Clamp01(recipe.weight),
                    additive = recipe.additive,
                    enabled = true
                });
            }
            if (definitions.Count == 0)
            {
                return;
            }

            var layerSet =
                instance.AddComponent<AilisNativePlayableLayerSet>();
            layerSet.sourceSystem =
                "unitypackage-native-playable-layers";
            layerSet.layers = definitions.ToArray();
            Debug.Log(
                "[AILIS Character Import] Attached native Playable Layers: " +
                string.Join(
                    ", ",
                    definitions.Select(
                        layer =>
                            layer.id +
                            "=" +
                            layer.controller.name)));
        }

        private static RuntimeAnimatorController BuildGeneratedAnimatorController(
            AilisCharacterImportRecipe recipe,
            string generatedRoot)
        {
            var states = recipe.animatorStates
                .Where(state =>
                    state != null &&
                    !string.IsNullOrWhiteSpace(state.stateName) &&
                    !string.IsNullOrWhiteSpace(state.clipPath))
                .OrderBy(state => state.layerIndex)
                .ToArray();
            if (states.Length == 0)
            {
                throw new InvalidDataException(
                    "animatorStates did not contain any playable state definitions.");
            }
            if (states.Any(state => state.layerIndex < 0))
            {
                throw new InvalidDataException(
                    "Animator layer indices must be zero or greater.");
            }

            var controllerPath = generatedRoot + "/" + recipe.id + ".controller";
            AssetDatabase.DeleteAsset(controllerPath);
            var controller =
                AnimatorController.CreateAnimatorControllerAtPath(controllerPath);
            var highestLayer = states.Max(state => state.layerIndex);
            while (controller.layers.Length <= highestLayer)
            {
                controller.AddLayer("Layer " + controller.layers.Length);
            }

            var layers = controller.layers;
            for (var layerIndex = 0; layerIndex < layers.Length; layerIndex += 1)
            {
                var configuredName = states
                    .Where(state => state.layerIndex == layerIndex)
                    .Select(state => state.layerName)
                    .FirstOrDefault(name => !string.IsNullOrWhiteSpace(name));
                layers[layerIndex].name = string.IsNullOrWhiteSpace(configuredName)
                    ? layerIndex == 0 ? "Body" : "Layer " + layerIndex
                    : configuredName;
                layers[layerIndex].defaultWeight = layerIndex == 0 ? 1f : 0f;
                layers[layerIndex].blendingMode =
                    AnimatorLayerBlendingMode.Override;
            }
            controller.layers = layers;

            var namesByLayer = new Dictionary<int, HashSet<string>>();
            foreach (var stateRecipe in states)
            {
                if (!namesByLayer.TryGetValue(
                        stateRecipe.layerIndex,
                        out var stateNames))
                {
                    stateNames = new HashSet<string>(
                        StringComparer.OrdinalIgnoreCase);
                    namesByLayer[stateRecipe.layerIndex] = stateNames;
                }
                if (!stateNames.Add(stateRecipe.stateName))
                {
                    throw new InvalidDataException(
                        "Duplicate Animator state name on layer " +
                        stateRecipe.layerIndex + ": " +
                        stateRecipe.stateName);
                }

                var sourceClip = LoadAnimationClip(stateRecipe);
                if (sourceClip == null)
                {
                    throw new InvalidDataException(
                        "Animation clip was not found: " +
                        stateRecipe.clipPath +
                        (string.IsNullOrWhiteSpace(stateRecipe.clipName)
                            ? ""
                            : " [" + stateRecipe.clipName + "]"));
                }

                var generatedClip = CloneAnimationClip(
                    sourceClip,
                    generatedRoot,
                    stateRecipe);
                var state = controller.layers[stateRecipe.layerIndex]
                    .stateMachine
                    .AddState(stateRecipe.stateName);
                state.motion = generatedClip;
                state.writeDefaultValues = false;

                var stateMachine =
                    controller.layers[stateRecipe.layerIndex].stateMachine;
                if (stateRecipe.setAsDefault ||
                    stateMachine.defaultState == null)
                {
                    stateMachine.defaultState = state;
                }
            }

            EditorUtility.SetDirty(controller);
            AssetDatabase.SaveAssets();
            Debug.Log(
                "[AILIS Character Import] Generated clean AnimatorController: " +
                controllerPath + " states=" + states.Length +
                " layers=" + controller.layers.Length);
            return controller;
        }

        private static AnimationClip LoadAnimationClip(
            AilisAnimatorStateRecipe stateRecipe)
        {
            if (string.IsNullOrWhiteSpace(stateRecipe.clipName))
            {
                return AssetDatabase.LoadAssetAtPath<AnimationClip>(
                    stateRecipe.clipPath);
            }

            return AssetDatabase
                .LoadAllAssetsAtPath(stateRecipe.clipPath)
                .OfType<AnimationClip>()
                .FirstOrDefault(clip =>
                    clip != null &&
                    string.Equals(
                        clip.name,
                        stateRecipe.clipName,
                        StringComparison.OrdinalIgnoreCase));
        }

        private static AnimationClip CloneAnimationClip(
            AnimationClip sourceClip,
            string generatedRoot,
            AilisAnimatorStateRecipe stateRecipe)
        {
            var clipsRoot = generatedRoot + "/AnimationClips";
            EnsureAssetFolder(clipsRoot);
            var clipPath = GetGeneratedClipPath(
                generatedRoot,
                stateRecipe);
            AssetDatabase.DeleteAsset(clipPath);

            var generatedClip = new AnimationClip();
            EditorUtility.CopySerialized(sourceClip, generatedClip);
            generatedClip.name = stateRecipe.stateName;
            var settings =
                AnimationUtility.GetAnimationClipSettings(generatedClip);
            settings.loopTime = stateRecipe.loop;
            settings.loopBlend = stateRecipe.loop;
            if (stateRecipe.bakeRootRotation)
            {
                // Normalize Humanoid clips to the avatar's body-forward axis.
                settings.keepOriginalOrientation = false;
                settings.orientationOffsetY =
                    stateRecipe.rootRotationOffsetY;
                settings.loopBlendOrientation = true;
            }
            AnimationUtility.SetAnimationClipSettings(
                generatedClip,
                settings);
            AssetDatabase.CreateAsset(generatedClip, clipPath);
            return generatedClip;
        }

        private static AilisVrmExpressionProfile BakeVrmExpressionProfile(
            AilisCharacterImportRecipe recipe,
            string generatedRoot)
        {
            var profile =
                recipe.vrmExpressionProfile ??
                new AilisVrmExpressionProfile();
            foreach (var expression in profile.bindings ??
                     Array.Empty<AilisVrmExpressionBinding>())
            {
                if (expression == null ||
                    !string.Equals(
                        expression.driver,
                        "animator-state",
                        StringComparison.OrdinalIgnoreCase) ||
                    string.IsNullOrWhiteSpace(expression.stateName))
                {
                    continue;
                }

                var stateRecipe = (recipe.animatorStates ??
                                   Array.Empty<AilisAnimatorStateRecipe>())
                    .FirstOrDefault(state =>
                        state != null &&
                        state.layerIndex == expression.layerIndex &&
                        string.Equals(
                            state.stateName,
                            expression.stateName,
                            StringComparison.OrdinalIgnoreCase));
                if (stateRecipe == null)
                {
                    continue;
                }

                var clip = AssetDatabase.LoadAssetAtPath<AnimationClip>(
                    GetGeneratedClipPath(generatedRoot, stateRecipe));
                var morphTargets = ExtractMorphTargetBindings(
                    clip,
                    expression.poseSampleTimeNormalized);
                if (morphTargets.Length == 0)
                {
                    continue;
                }

                expression.driver = "morph-targets";
                expression.morphTargetBindings = morphTargets;
                Debug.Log(
                    "[AILIS Character Import] Baked VRM expression " +
                    expression.ExpressionKey + " from " +
                    expression.stateName + ": " +
                    morphTargets.Length + " morph targets");
            }
            return profile;
        }

        private static AilisVrmMorphTargetBinding[] ExtractMorphTargetBindings(
            AnimationClip clip,
            float poseSampleTimeNormalized)
        {
            if (clip == null)
            {
                return Array.Empty<AilisVrmMorphTargetBinding>();
            }

            const string prefix = "blendShape.";
            var curves = new List<KeyValuePair<EditorCurveBinding, AnimationCurve>>();
            foreach (var binding in AnimationUtility.GetCurveBindings(clip))
            {
                if (string.IsNullOrWhiteSpace(binding.propertyName) ||
                    !binding.propertyName.StartsWith(
                        prefix,
                        StringComparison.Ordinal))
                {
                    continue;
                }
                var curve = AnimationUtility.GetEditorCurve(clip, binding);
                if (curve != null && curve.length > 0)
                {
                    curves.Add(
                        new KeyValuePair<EditorCurveBinding, AnimationCurve>(
                            binding,
                            curve));
                }
            }

            var sampleTime = ResolveExpressionPoseSampleTime(
                clip,
                curves,
                poseSampleTimeNormalized);
            var targets = new List<AilisVrmMorphTargetBinding>();
            foreach (var curveEntry in curves)
            {
                var binding = curveEntry.Key;
                var sampledWeight = curveEntry.Value.Evaluate(sampleTime);
                if (sampledWeight <= 0.001f)
                {
                    continue;
                }

                targets.Add(new AilisVrmMorphTargetBinding
                {
                    path = binding.path ?? "",
                    blendShapeName =
                        binding.propertyName.Substring(prefix.Length),
                    weight = Mathf.Clamp(sampledWeight, 0f, 100f)
                });
            }
            return targets
                .OrderBy(target => target.path, StringComparer.Ordinal)
                .ThenBy(
                    target => target.blendShapeName,
                    StringComparer.Ordinal)
                .ToArray();
        }

        private static float ResolveExpressionPoseSampleTime(
            AnimationClip clip,
            List<KeyValuePair<EditorCurveBinding, AnimationCurve>> curves,
            float configuredNormalizedTime)
        {
            if (configuredNormalizedTime >= 0f)
            {
                return Mathf.Clamp01(configuredNormalizedTime) *
                       Mathf.Max(0f, clip.length);
            }

            var candidateTimes = new HashSet<float> { 0f };
            foreach (var curveEntry in curves)
            {
                foreach (var key in curveEntry.Value.keys)
                {
                    candidateTimes.Add(key.time);
                }
            }

            var selectedTime = 0f;
            var selectedScore = float.MinValue;
            foreach (var candidateTime in candidateTimes)
            {
                var score = 0f;
                foreach (var curveEntry in curves)
                {
                    score += Mathf.Abs(
                        curveEntry.Value.Evaluate(candidateTime));
                }
                if (score > selectedScore)
                {
                    selectedScore = score;
                    selectedTime = candidateTime;
                }
            }
            return selectedTime;
        }

        private static string GetGeneratedClipPath(
            string generatedRoot,
            AilisAnimatorStateRecipe stateRecipe)
        {
            var safeName = string.Concat(
                stateRecipe.stateName.Select(character =>
                    Path.GetInvalidFileNameChars().Contains(character)
                        ? '_'
                        : character));
            return generatedRoot + "/AnimationClips/" +
                   stateRecipe.layerIndex + "-" +
                   safeName + ".anim";
        }

        private static void VerifyBundle(string bundlePath, string prefabAssetPath)
        {
            if (!File.Exists(bundlePath))
            {
                throw new FileNotFoundException("Character AssetBundle was not created.", bundlePath);
            }

            var bundle = AssetBundle.LoadFromFile(bundlePath);
            if (bundle == null)
            {
                throw new InvalidDataException(
                    "Unity could not reopen the generated Character AssetBundle: " + bundlePath);
            }
            try
            {
                var prefab = bundle.LoadAsset<GameObject>(prefabAssetPath);
                if (prefab == null)
                {
                    throw new InvalidDataException(
                        "Generated AssetBundle does not contain the expected prefab: " +
                        prefabAssetPath);
                }
            }
            finally
            {
                bundle.Unload(true);
            }
        }

        private static void CopyLicense(string assetDirectory, string destinationDirectory)
        {
            if (string.IsNullOrWhiteSpace(assetDirectory))
            {
                return;
            }

            var sourceDirectory = Path.GetFullPath(
                Path.Combine(
                    Path.GetFullPath(Path.Combine(Application.dataPath, "..")),
                    assetDirectory));
            if (!Directory.Exists(sourceDirectory))
            {
                throw new DirectoryNotFoundException(
                    "Character license directory was not found: " + sourceDirectory);
            }

            foreach (var sourcePath in Directory.GetFiles(
                         sourceDirectory,
                         "*",
                         SearchOption.AllDirectories))
            {
                if (sourcePath.EndsWith(".meta", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }
                var relativePath = sourcePath.Substring(sourceDirectory.Length)
                    .TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
                var destinationPath = Path.Combine(destinationDirectory, relativePath);
                Directory.CreateDirectory(Path.GetDirectoryName(destinationPath) ?? destinationDirectory);
                File.Copy(sourcePath, destinationPath, true);
            }
        }

        private static void WriteLicenseNotice(
            AilisCharacterImportRecipe recipe,
            string runtimeRoot)
        {
            if (string.IsNullOrWhiteSpace(recipe.licenseName) &&
                string.IsNullOrWhiteSpace(recipe.attribution))
            {
                return;
            }

            File.WriteAllText(
                Path.Combine(runtimeRoot, "NOTICE.txt"),
                "Character asset license: " + recipe.licenseName + Environment.NewLine +
                "License URL: " + recipe.licenseUrl + Environment.NewLine +
                "Attribution: " + recipe.attribution + Environment.NewLine +
                "The character asset is not distributed under the AILIS MIT license." +
                Environment.NewLine);
        }

        private static void ValidateRecipe(AilisCharacterImportRecipe recipe)
        {
            if (recipe == null ||
                (recipe.schema != "ailis.character-import-recipe.v1" &&
                 recipe.schema != "ailis.character-import-recipe.v2") ||
                string.IsNullOrWhiteSpace(recipe.id) ||
                string.IsNullOrWhiteSpace(recipe.displayName) ||
                string.IsNullOrWhiteSpace(recipe.sourcePrefab))
            {
                throw new InvalidDataException(
                    "Character recipe requires schema, id, displayName, and sourcePrefab.");
            }
            if (recipe.vrmExpressionProfile?.bindings?.Length > 0)
            {
                AilisVrmExpressionProtocol.ValidateProfile(
                    recipe.vrmExpressionProfile);
            }
        }

        private static void ApplyMotionLibraries(
            AilisCharacterImportRecipe recipe,
            string recipePath)
        {
            var profiles = (recipe.motionLibraries ?? Array.Empty<string>())
                .Where(path => !string.IsNullOrWhiteSpace(path))
                .Select(path => LoadMotionLibrary(path, recipePath))
                .ToArray();
            if (profiles.Length == 0)
            {
                return;
            }

            var states = new Dictionary<string, AilisAnimatorStateRecipe>(
                StringComparer.OrdinalIgnoreCase);
            foreach (var profile in profiles)
            {
                foreach (var state in profile.animatorStates ??
                         Array.Empty<AilisAnimatorStateRecipe>())
                {
                    if (state != null &&
                        !string.IsNullOrWhiteSpace(state.stateName))
                    {
                        states[GetAnimatorStateKey(state)] = state;
                    }
                }
            }
            foreach (var state in recipe.animatorStates ??
                     Array.Empty<AilisAnimatorStateRecipe>())
            {
                if (state != null &&
                    !string.IsNullOrWhiteSpace(state.stateName))
                {
                    // Character-specific states intentionally override library defaults.
                    states[GetAnimatorStateKey(state)] = state;
                }
            }

            var motions = new Dictionary<string, AilisMotionDefinition>(
                StringComparer.OrdinalIgnoreCase);
            foreach (var profile in profiles)
            {
                foreach (var motion in profile.motions ??
                         Array.Empty<AilisMotionDefinition>())
                {
                    if (motion != null && !string.IsNullOrWhiteSpace(motion.id))
                    {
                        if (string.IsNullOrWhiteSpace(motion.sourceId))
                        {
                            motion.sourceId = profile.id;
                        }
                        if (string.IsNullOrWhiteSpace(motion.license))
                        {
                            motion.license = profile.license;
                        }
                        motions[motion.id] = motion;
                    }
                }
            }
            foreach (var motion in recipe.motions ??
                     Array.Empty<AilisMotionDefinition>())
            {
                if (motion != null && !string.IsNullOrWhiteSpace(motion.id))
                {
                    // Character-authored mappings remain authoritative.
                    motions[motion.id] = motion;
                }
            }

            recipe.animatorStates = states.Values
                .OrderBy(state => state.layerIndex)
                .ThenBy(state => state.stateName, StringComparer.OrdinalIgnoreCase)
                .ToArray();
            recipe.motions = motions.Values
                .OrderBy(motion => motion.id, StringComparer.OrdinalIgnoreCase)
                .ToArray();
            Debug.Log(
                "[AILIS Motion Library] Applied " + profiles.Length +
                " reusable profile(s): states=" + recipe.animatorStates.Length +
                ", motions=" + recipe.motions.Length);
        }

        private static AilisMotionLibraryProfile LoadMotionLibrary(
            string configuredPath,
            string recipePath)
        {
            var projectRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, ".."));
            var candidates = new[]
            {
                Path.IsPathRooted(configuredPath)
                    ? configuredPath
                    : Path.Combine(projectRoot, configuredPath),
                Path.Combine(
                    Path.GetDirectoryName(Path.GetFullPath(recipePath)) ??
                    projectRoot,
                    configuredPath)
            };
            var resolvedPath = candidates
                .Select(Path.GetFullPath)
                .FirstOrDefault(File.Exists);
            if (string.IsNullOrWhiteSpace(resolvedPath))
            {
                throw new FileNotFoundException(
                    "Motion library profile was not found: " + configuredPath);
            }

            var profile = JsonUtility.FromJson<AilisMotionLibraryProfile>(
                File.ReadAllText(resolvedPath));
            if (profile == null ||
                profile.schema != "ailis.motion-library-profile.v1" ||
                string.IsNullOrWhiteSpace(profile.id))
            {
                throw new InvalidDataException(
                    "Motion library profile is invalid: " + resolvedPath);
            }
            return profile;
        }

        private static string GetAnimatorStateKey(
            AilisAnimatorStateRecipe state)
        {
            return state.layerIndex + ":" + state.stateName.Trim();
        }

        private static void CleanupImportedSources(string recipePath)
        {
            var fullRecipePath = Path.GetFullPath(recipePath);
            var recipe = JsonUtility.FromJson<AilisCharacterImportRecipe>(
                File.ReadAllText(fullRecipePath));
            ValidateRecipe(recipe);

            foreach (var assetPath in recipe.importedAssetRoots ?? Array.Empty<string>())
            {
                if (string.IsNullOrWhiteSpace(assetPath))
                {
                    continue;
                }
                if (!assetPath.StartsWith("Assets/", StringComparison.Ordinal) ||
                    assetPath.StartsWith("Assets/AILIS/", StringComparison.Ordinal) ||
                    assetPath.StartsWith("Assets/StreamingAssets/", StringComparison.Ordinal))
                {
                    throw new InvalidDataException(
                        "Refusing to remove an unsafe imported asset path: " + assetPath);
                }
                if (!AssetDatabase.DeleteAsset(assetPath))
                {
                    Debug.LogWarning(
                        "[AILIS Character Import] Imported source was already absent: " +
                    assetPath);
                }
            }
            AssetDatabase.DeleteAsset("Assets/AILIS/GeneratedPackages/" + recipe.id);
            AssetDatabase.Refresh();
            AssetDatabase.SaveAssets();
            Debug.Log(
                "[AILIS Character Import] Removed editor source assets for " + recipe.id + ".");
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

        private static string ReadRequiredArgument(string name)
        {
            var args = Environment.GetCommandLineArgs();
            for (var index = 0; index < args.Length - 1; index += 1)
            {
                if (string.Equals(args[index], name, StringComparison.OrdinalIgnoreCase))
                {
                    return args[index + 1];
                }
            }
            throw new ArgumentException("Missing command-line argument: " + name);
        }
    }
}
#endif
