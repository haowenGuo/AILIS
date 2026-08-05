#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using UniGLTF;
using UniVRM10;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Ailis.CharacterDemo.Editor
{
    public sealed class AilisAnimationWorkbenchHost : MonoBehaviour
    {
        [SerializeField] private string manifestPath = "";
        [SerializeField] private RuntimeAnimatorController controller;
        [SerializeField] private Camera previewCamera;

        private Vrm10Instance _instance;
        private AilisCharacterPackage _package;

        public Animator Animator { get; private set; }
        public string Status { get; private set; } = "waiting";
        public string CurrentMotionId { get; private set; } = "";
        public int CurrentLayerIndex { get; private set; }
        public bool IsReady => Animator != null && Status == "ready";

        public void Configure(
            string packageManifestPath,
            RuntimeAnimatorController animatorController,
            Camera camera)
        {
            manifestPath = packageManifestPath;
            controller = animatorController;
            previewCamera = camera;
        }

        private async void Start()
        {
            try
            {
                await LoadCharacterAsync();
            }
            catch (Exception error)
            {
                Status = "failed: " + error.Message;
                Debug.LogException(error);
            }
        }

        private async Task LoadCharacterAsync()
        {
            if (string.IsNullOrWhiteSpace(manifestPath) ||
                !File.Exists(manifestPath))
            {
                throw new FileNotFoundException(
                    "Animation Workbench character manifest was not found.",
                    manifestPath);
            }
            if (controller == null)
            {
                throw new InvalidOperationException(
                    "Animation Workbench AnimatorController is missing.");
            }

            Status = "loading";
            _package = AilisCharacterPackage.Load(manifestPath, "", "");
            _instance = await Vrm10.LoadPathAsync(
                _package.ModelPath,
                canLoadVrm0X: true,
                showMeshes: true,
                awaitCaller: new RuntimeOnlyAwaitCaller());
            _instance.name =
                "AILIS Workbench Avatar - " +
                _package.Manifest.displayName;
            _instance.transform.SetParent(transform, false);
            _instance.transform.localPosition = new Vector3(
                _package.Manifest.positionX,
                _package.Manifest.positionY,
                _package.Manifest.positionZ);
            _instance.transform.localScale =
                Vector3.one * Mathf.Max(0.01f, _package.Manifest.scale);
            _instance.Runtime.VrmAnimation = null;

            Animator = _instance.GetComponent<Animator>();
            if (Animator == null || !Animator.isHuman)
            {
                throw new InvalidDataException(
                    "Animation Workbench requires a Humanoid VRM avatar.");
            }
            Animator.applyRootMotion = false;
            Animator.cullingMode = AnimatorCullingMode.AlwaysAnimate;
            Animator.runtimeAnimatorController = controller;
            for (var layer = 0; layer < Animator.layerCount; layer += 1)
            {
                Animator.SetLayerWeight(layer, 1f);
            }
            Animator.Update(0f);
            FrameCamera();
            Selection.activeGameObject = Animator.gameObject;
            Status = "ready";
            Debug.Log(
                "[AILIS Animation Workbench] Character ready: " +
                _package.Manifest.displayName);
        }

        public bool PlayMotion(AilisMotionDefinition motion, float speed)
        {
            if (!IsReady || motion == null)
            {
                return false;
            }
            var layerIndex = ResolveLayerIndex(motion.ResolvePerformanceLayer());
            if (layerIndex < 0 || layerIndex >= Animator.layerCount)
            {
                return false;
            }
            ResetOverlayLayers(layerIndex);
            Animator.speed = Mathf.Clamp(speed, 0f, 2f);
            Animator.ResetTrigger(
                AilisAnimationWorkbenchControllerBuilder.ResolveTriggerName(
                    motion.id));
            Animator.SetTrigger(
                AilisAnimationWorkbenchControllerBuilder.ResolveTriggerName(
                    motion.id));
            Animator.Update(0f);
            CurrentMotionId = motion.id;
            CurrentLayerIndex = layerIndex;
            return true;
        }

        public bool ScrubMotion(
            AilisMotionDefinition motion,
            float normalizedTime)
        {
            if (!IsReady || motion == null)
            {
                return false;
            }
            var layerIndex = ResolveLayerIndex(motion.ResolvePerformanceLayer());
            if (layerIndex < 0 || layerIndex >= Animator.layerCount)
            {
                return false;
            }
            ResetOverlayLayers(layerIndex);
            Animator.speed = 0f;
            Animator.Play(
                motion.id,
                layerIndex,
                Mathf.Clamp01(normalizedTime));
            Animator.Update(0f);
            CurrentMotionId = motion.id;
            CurrentLayerIndex = layerIndex;
            return true;
        }

        public void Resume(float speed)
        {
            if (Animator != null)
            {
                Animator.speed = Mathf.Clamp(speed, 0f, 2f);
            }
        }

        public void Pause()
        {
            if (Animator != null)
            {
                Animator.speed = 0f;
            }
        }

        public float GetNormalizedTime()
        {
            if (!IsReady ||
                CurrentLayerIndex < 0 ||
                CurrentLayerIndex >= Animator.layerCount)
            {
                return 0f;
            }
            var state = Animator.GetCurrentAnimatorStateInfo(
                CurrentLayerIndex);
            return Mathf.Repeat(state.normalizedTime, 1f);
        }

        private void ResetOverlayLayers(int activeLayer)
        {
            for (var layer = 0; layer < Animator.layerCount; layer += 1)
            {
                var weight = layer == 0 || layer == activeLayer ? 1f : 0f;
                Animator.SetLayerWeight(layer, weight);
            }
        }

        private void FrameCamera()
        {
            if (previewCamera == null)
            {
                return;
            }
            var renderers = _instance.GetComponentsInChildren<Renderer>(true);
            if (renderers.Length == 0)
            {
                return;
            }
            var bounds = renderers[0].bounds;
            for (var index = 1; index < renderers.Length; index += 1)
            {
                bounds.Encapsulate(renderers[index].bounds);
            }
            var height = Mathf.Max(0.5f, bounds.size.y);
            var distance =
                height /
                (2f * Mathf.Tan(previewCamera.fieldOfView * 0.5f * Mathf.Deg2Rad));
            var target = bounds.center + Vector3.up * height * 0.02f;
            previewCamera.transform.position =
                target + Vector3.forward * distance * 1.18f;
            previewCamera.transform.rotation =
                Quaternion.LookRotation(
                    target - previewCamera.transform.position,
                    Vector3.up);
            previewCamera.nearClipPlane = Mathf.Max(0.01f, distance * 0.2f);
            previewCamera.farClipPlane = Mathf.Max(20f, distance * 4f);
        }

        private static int ResolveLayerIndex(string performanceLayer)
        {
            switch ((performanceLayer ?? "").Trim().ToLowerInvariant())
            {
                case "additive":
                    return 1;
                case "gesture":
                    return 2;
                case "action":
                    return 3;
                case "face":
                    return 4;
                default:
                    return 0;
            }
        }
    }

    public static class AilisAnimationWorkbenchControllerBuilder
    {
        public const string GeneratedRoot =
            "Assets/AILIS/Generated/AnimationWorkbench";
        private const string GestureMaskPath =
            "Assets/Resources/AILIS/Animation/AILIS_GestureMask.mask";
        private const string FaceMaskPath =
            "Assets/Resources/AILIS/Animation/AILIS_FaceMask.mask";
        private const string FullBodyMaskPath =
            "Assets/Resources/AILIS/Animation/AILIS_FullBodyMask.mask";

        public static AnimatorController CreateOrUpdate(
            string packageId,
            IReadOnlyList<AilisMotionDefinition> motions)
        {
            EnsureAssetFolder(GeneratedRoot);
            var safePackageId = Sanitize(packageId);
            var controllerPath =
                GeneratedRoot + "/" + safePackageId + ".controller";
            AssetDatabase.DeleteAsset(controllerPath);
            var controller =
                AnimatorController.CreateAnimatorControllerAtPath(
                    controllerPath);
            controller.name =
                "AILIS Animation Workbench - " + packageId;

            var emptyClip = new AnimationClip
            {
                name = "AILIS_Workbench_Empty",
                frameRate = 30f
            };
            AssetDatabase.AddObjectToAsset(emptyClip, controller);

            var gestureMask =
                AssetDatabase.LoadAssetAtPath<AvatarMask>(GestureMaskPath);
            var faceMask =
                AssetDatabase.LoadAssetAtPath<AvatarMask>(FaceMaskPath);
            var fullBodyMask =
                AssetDatabase.LoadAssetAtPath<AvatarMask>(FullBodyMaskPath);
            ConfigureBaseLayer(
                controller,
                packageId,
                motions,
                emptyClip);
            AddLayer(
                controller,
                "Additive",
                "additive",
                packageId,
                motions,
                emptyClip,
                gestureMask,
                AnimatorLayerBlendingMode.Additive);
            AddLayer(
                controller,
                "Gesture",
                "gesture",
                packageId,
                motions,
                emptyClip,
                gestureMask,
                AnimatorLayerBlendingMode.Override);
            AddLayer(
                controller,
                "Action",
                "action",
                packageId,
                motions,
                emptyClip,
                fullBodyMask,
                AnimatorLayerBlendingMode.Override);
            AddLayer(
                controller,
                "Face",
                "face",
                packageId,
                motions,
                emptyClip,
                faceMask,
                AnimatorLayerBlendingMode.Additive);

            EditorUtility.SetDirty(controller);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log(
                "[AILIS Animation Workbench] Debug Animator ready: " +
                controllerPath);
            return controller;
        }

        public static string ResolveTriggerName(string motionId)
        {
            return "Play__" + Sanitize(motionId);
        }

        public static string ResolveControllerPath(string packageId)
        {
            return GeneratedRoot + "/" +
                   Sanitize(packageId) + ".controller";
        }

        private static void ConfigureBaseLayer(
            AnimatorController controller,
            string packageId,
            IReadOnlyList<AilisMotionDefinition> motions,
            AnimationClip emptyClip)
        {
            var layer = controller.layers[0];
            layer.name = "Base";
            layer.defaultWeight = 1f;
            layer.blendingMode = AnimatorLayerBlendingMode.Override;
            var stateMachine = layer.stateMachine;
            stateMachine.name = "Base";
            ClearStates(stateMachine);
            var empty = stateMachine.AddState("Empty");
            empty.motion = emptyClip;
            empty.writeDefaultValues = false;
            stateMachine.defaultState = empty;
            AddMotionStates(
                controller,
                stateMachine,
                packageId,
                motions.Where(
                    motion => motion.ResolvePerformanceLayer() == "base"),
                empty);
            var layers = controller.layers;
            layers[0] = layer;
            controller.layers = layers;
        }

        private static void AddLayer(
            AnimatorController controller,
            string layerName,
            string performanceLayer,
            string packageId,
            IReadOnlyList<AilisMotionDefinition> motions,
            AnimationClip emptyClip,
            AvatarMask mask,
            AnimatorLayerBlendingMode blendingMode)
        {
            var stateMachine = new AnimatorStateMachine
            {
                name = layerName
            };
            AssetDatabase.AddObjectToAsset(stateMachine, controller);
            var empty = stateMachine.AddState("Empty");
            empty.motion = emptyClip;
            empty.writeDefaultValues = false;
            stateMachine.defaultState = empty;
            AddMotionStates(
                controller,
                stateMachine,
                packageId,
                motions.Where(
                    motion =>
                        motion.ResolvePerformanceLayer() ==
                        performanceLayer),
                empty);
            controller.AddLayer(new AnimatorControllerLayer
            {
                name = layerName,
                stateMachine = stateMachine,
                avatarMask = mask,
                blendingMode = blendingMode,
                defaultWeight = 1f,
                iKPass = false
            });
        }

        private static void AddMotionStates(
            AnimatorController controller,
            AnimatorStateMachine stateMachine,
            string packageId,
            IEnumerable<AilisMotionDefinition> motions,
            AnimatorState emptyState)
        {
            foreach (var motion in motions.Where(item => item != null))
            {
                var clip = LoadMotionClip(packageId, motion);
                if (clip == null)
                {
                    Debug.LogWarning(
                        "[AILIS Animation Workbench] Clip missing: " +
                        packageId + "/" + motion.id);
                    continue;
                }
                var triggerName = ResolveTriggerName(motion.id);
                if (!controller.parameters.Any(
                        parameter => parameter.name == triggerName))
                {
                    controller.AddParameter(
                        triggerName,
                        AnimatorControllerParameterType.Trigger);
                }
                var state = stateMachine.AddState(motion.id);
                state.motion = clip;
                state.writeDefaultValues = false;
                var enter = stateMachine.AddAnyStateTransition(state);
                enter.hasExitTime = false;
                enter.duration = Mathf.Clamp(
                    motion.transitionSeconds,
                    0f,
                    1.2f);
                enter.canTransitionToSelf = true;
                enter.AddCondition(
                    AnimatorConditionMode.If,
                    0f,
                    triggerName);
                if (!motion.loop)
                {
                    var leave = state.AddTransition(emptyState);
                    leave.hasExitTime = true;
                    leave.exitTime = 0.98f;
                    leave.duration = Mathf.Clamp(
                        motion.transitionSeconds,
                        0f,
                        1.2f);
                }
                if (stateMachine.defaultState == emptyState &&
                    motion.loop)
                {
                    stateMachine.defaultState = state;
                }
            }
        }

        public static AnimationClip LoadMotionClip(
            string packageId,
            AilisMotionDefinition motion)
        {
            if (motion == null)
            {
                return null;
            }
            var resourcePath =
                string.IsNullOrWhiteSpace(motion.bakedClipResource)
                    ? AilisPerformanceAnimatorParameters
                        .ResolveVrmaClipResource(packageId, motion.id)
                    : motion.bakedClipResource.Trim();
            return AssetDatabase.LoadAssetAtPath<AnimationClip>(
                "Assets/Resources/" + resourcePath + ".anim");
        }

        private static void ClearStates(AnimatorStateMachine stateMachine)
        {
            foreach (var state in stateMachine.states)
            {
                stateMachine.RemoveState(state.state);
            }
            foreach (var stateMachineChild in stateMachine.stateMachines)
            {
                stateMachine.RemoveStateMachine(
                    stateMachineChild.stateMachine);
            }
        }

        private static string Sanitize(string value)
        {
            var source = string.IsNullOrWhiteSpace(value)
                ? "default"
                : value.Trim();
            return new string(source.Select(
                character =>
                    char.IsLetterOrDigit(character) ||
                    character == '-' ||
                    character == '_'
                        ? character
                        : '_').ToArray());
        }

        private static void EnsureAssetFolder(string path)
        {
            var current = "Assets";
            foreach (var segment in path
                         .Substring("Assets/".Length)
                         .Split('/'))
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

    public sealed class AilisAnimationWorkbenchWindow : EditorWindow
    {
        private sealed class PackageEntry
        {
            public string ManifestPath;
            public AilisCharacterPackageManifest Manifest;
        }

        private const string SelectedPackagePreference =
            "AILIS.AnimationWorkbench.SelectedPackage";
        private const string WorkbenchScenePath =
            AilisAnimationWorkbenchControllerBuilder.GeneratedRoot +
            "/AILISAnimationWorkbench.unity";

        private readonly List<PackageEntry> _packages =
            new List<PackageEntry>();
        private Vector2 _motionScroll;
        private int _selectedPackageIndex;
        private int _selectedMotionIndex;
        private float _previewSpeed = 1f;
        private float _scrubTime;
        private bool _followPlayback = true;

        [MenuItem("AILIS/Animation Workbench")]
        public static void Open()
        {
            var window = GetWindow<AilisAnimationWorkbenchWindow>();
            window.titleContent =
                new GUIContent("AILIS Animation Workbench");
            window.minSize = new Vector2(520f, 620f);
            window.Show();
        }

        public static void BuildDefaultPreviewForBatch()
        {
            var root = Path.GetFullPath(
                "Assets/StreamingAssets/Characters");
            var manifestPaths = Directory.Exists(root)
                ? Directory.GetFiles(
                    root,
                    "ailis-character.json",
                    SearchOption.AllDirectories)
                : Array.Empty<string>();
            var manifestPath = manifestPaths.FirstOrDefault(
                path => path.IndexOf(
                    "vroid-shino-cc0",
                    StringComparison.OrdinalIgnoreCase) >= 0) ??
                manifestPaths.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(manifestPath))
            {
                throw new FileNotFoundException(
                    "No VRM character package is available for the " +
                    "Animation Workbench.");
            }
            var manifest =
                JsonUtility.FromJson<AilisCharacterPackageManifest>(
                    File.ReadAllText(manifestPath));
            if (manifest == null)
            {
                throw new InvalidDataException(
                    "Animation Workbench package manifest is invalid: " +
                    manifestPath);
            }
            AilisPerformanceAnimatorTemplateBuilder.CreateOrUpdate();
            AilisVrmaMotionLibraryBuilder.CreateOrUpdate();
            var controller =
                AilisAnimationWorkbenchControllerBuilder.CreateOrUpdate(
                    manifest.id,
                    manifest.motions ??
                    Array.Empty<AilisMotionDefinition>());
            CreateWorkbenchScene(
                Path.GetFullPath(manifestPath),
                controller);
        }

        private void OnEnable()
        {
            RefreshPackages();
            EditorApplication.update += HandleEditorUpdate;
        }

        private void OnDisable()
        {
            EditorApplication.update -= HandleEditorUpdate;
        }

        private void HandleEditorUpdate()
        {
            if (EditorApplication.isPlaying)
            {
                var host = FindObjectOfType<AilisAnimationWorkbenchHost>();
                if (_followPlayback && host?.IsReady == true)
                {
                    _scrubTime = host.GetNormalizedTime();
                }
                Repaint();
            }
        }

        private void OnGUI()
        {
            EditorGUILayout.LabelField(
                "AILIS Animation Workbench",
                EditorStyles.boldLabel);
            EditorGUILayout.HelpBox(
                "This is an authoring tool. It uses Unity Animator, " +
                "Animation and Timeline directly and does not modify the " +
                "desktop renderer while you preview character motions.",
                MessageType.Info);

            DrawPackageToolbar();
            if (_packages.Count == 0)
            {
                EditorGUILayout.HelpBox(
                    "No character packages were found under " +
                    "Assets/StreamingAssets/Characters.",
                    MessageType.Warning);
                return;
            }

            var entry = _packages[_selectedPackageIndex];
            var motions = entry.Manifest.motions ??
                          Array.Empty<AilisMotionDefinition>();
            DrawNativeToolToolbar(entry, motions);
            DrawRuntimeStatus();
            DrawMotionList(entry, motions);
            DrawPreviewControls(entry, motions);
        }

        private void DrawPackageToolbar()
        {
            EditorGUILayout.Space(4f);
            using (new EditorGUILayout.HorizontalScope())
            {
                EditorGUILayout.LabelField(
                    "Character",
                    GUILayout.Width(80f));
                var names = _packages
                    .Select(entry => entry.Manifest.displayName)
                    .ToArray();
                EditorGUI.BeginDisabledGroup(names.Length == 0);
                var next = EditorGUILayout.Popup(
                    _selectedPackageIndex,
                    names);
                EditorGUI.EndDisabledGroup();
                if (next != _selectedPackageIndex &&
                    next >= 0 &&
                    next < _packages.Count)
                {
                    _selectedPackageIndex = next;
                    _selectedMotionIndex = 0;
                    EditorPrefs.SetString(
                        SelectedPackagePreference,
                        _packages[next].Manifest.id);
                }
                if (GUILayout.Button("Refresh", GUILayout.Width(78f)))
                {
                    RefreshPackages();
                }
            }
        }

        private void DrawNativeToolToolbar(
            PackageEntry entry,
            IReadOnlyList<AilisMotionDefinition> motions)
        {
            EditorGUILayout.Space(4f);
            using (new EditorGUILayout.HorizontalScope())
            {
                if (GUILayout.Button("Prepare Preview Scene"))
                {
                    PrepareWorkbenchScene(entry, motions);
                }
                if (GUILayout.Button("Open Animator"))
                {
                    OpenAnimator(entry.Manifest.id);
                }
                if (GUILayout.Button("Open Animation"))
                {
                    OpenAnimation(entry, motions);
                }
                if (GUILayout.Button("Open Timeline"))
                {
                    EditorApplication.ExecuteMenuItem(
                        "Window/Sequencing/Timeline");
                }
            }
            using (new EditorGUILayout.HorizontalScope())
            {
                if (!EditorApplication.isPlaying)
                {
                    if (GUILayout.Button("Enter Play Mode"))
                    {
                        if (SceneManager.GetActiveScene().path !=
                            WorkbenchScenePath)
                        {
                            PrepareWorkbenchScene(entry, motions);
                        }
                        EditorApplication.EnterPlaymode();
                    }
                }
                else if (GUILayout.Button("Exit Play Mode"))
                {
                    EditorApplication.ExitPlaymode();
                }
                if (GUILayout.Button("Rebuild Motion Library"))
                {
                    AilisPerformanceAnimatorTemplateBuilder.CreateOrUpdate();
                    AilisVrmaMotionLibraryBuilder.CreateOrUpdate();
                    AilisAnimationWorkbenchControllerBuilder.CreateOrUpdate(
                        entry.Manifest.id,
                        motions);
                }
            }
        }

        private void DrawRuntimeStatus()
        {
            var host = EditorApplication.isPlaying
                ? FindObjectOfType<AilisAnimationWorkbenchHost>()
                : null;
            var status = host == null
                ? "Preview scene is not running."
                : host.Status;
            EditorGUILayout.HelpBox(
                "Status: " + status,
                host?.IsReady == true
                    ? MessageType.Info
                    : MessageType.None);
        }

        private void DrawMotionList(
            PackageEntry entry,
            IReadOnlyList<AilisMotionDefinition> motions)
        {
            EditorGUILayout.Space(4f);
            EditorGUILayout.LabelField(
                "Motion States",
                EditorStyles.boldLabel);
            _motionScroll = EditorGUILayout.BeginScrollView(
                _motionScroll,
                GUILayout.Height(240f));
            for (var index = 0; index < motions.Count; index += 1)
            {
                var motion = motions[index];
                if (motion == null)
                {
                    continue;
                }
                using (new EditorGUILayout.HorizontalScope())
                {
                    var selected = index == _selectedMotionIndex;
                    if (GUILayout.Toggle(
                            selected,
                            motion.displayName + "  [" +
                            motion.ResolvePerformanceLayer() + "]",
                            "Button"))
                    {
                        _selectedMotionIndex = index;
                    }
                    GUILayout.Label(
                        motion.compatibility,
                        GUILayout.Width(72f));
                    if (GUILayout.Button("Play", GUILayout.Width(54f)))
                    {
                        _selectedMotionIndex = index;
                        PlaySelectedMotion(motions);
                    }
                    if (GUILayout.Button("Clip", GUILayout.Width(48f)))
                    {
                        _selectedMotionIndex = index;
                        SelectMotionClip(entry, motion);
                    }
                }
            }
            EditorGUILayout.EndScrollView();
        }

        private void DrawPreviewControls(
            PackageEntry entry,
            IReadOnlyList<AilisMotionDefinition> motions)
        {
            if (motions.Count == 0)
            {
                return;
            }
            _selectedMotionIndex = Mathf.Clamp(
                _selectedMotionIndex,
                0,
                motions.Count - 1);
            var motion = motions[_selectedMotionIndex];
            if (motion == null)
            {
                return;
            }

            EditorGUILayout.Space(4f);
            EditorGUILayout.LabelField(
                "Selected Motion",
                EditorStyles.boldLabel);
            EditorGUILayout.LabelField("ID", motion.id);
            EditorGUILayout.LabelField(
                "Layer",
                motion.ResolvePerformanceLayer());
            EditorGUILayout.LabelField(
                "Source",
                string.IsNullOrWhiteSpace(motion.sourceId)
                    ? "(not declared)"
                    : motion.sourceId);
            EditorGUILayout.LabelField(
                "Compatibility",
                motion.compatibility);
            EditorGUILayout.LabelField(
                "Transition",
                motion.transitionSeconds.ToString("0.000") + " s");
            EditorGUILayout.LabelField(
                "Loop",
                motion.loop ? "yes" : "no");

            _previewSpeed = EditorGUILayout.Slider(
                "Playback Speed",
                _previewSpeed,
                0f,
                2f);
            using (new EditorGUILayout.HorizontalScope())
            {
                if (GUILayout.Button("Play"))
                {
                    PlaySelectedMotion(motions);
                }
                if (GUILayout.Button("Pause"))
                {
                    FindObjectOfType<AilisAnimationWorkbenchHost>()
                        ?.Pause();
                }
                if (GUILayout.Button("Resume"))
                {
                    FindObjectOfType<AilisAnimationWorkbenchHost>()
                        ?.Resume(_previewSpeed);
                }
            }

            _followPlayback = EditorGUILayout.Toggle(
                "Follow Playback",
                _followPlayback);
            EditorGUI.BeginChangeCheck();
            _scrubTime = EditorGUILayout.Slider(
                "Normalized Time",
                _scrubTime,
                0f,
                1f);
            if (EditorGUI.EndChangeCheck())
            {
                _followPlayback = false;
                FindObjectOfType<AilisAnimationWorkbenchHost>()
                    ?.ScrubMotion(motion, _scrubTime);
            }
            if (GUILayout.Button("Select Live Animator"))
            {
                var host =
                    FindObjectOfType<AilisAnimationWorkbenchHost>();
                if (host?.Animator != null)
                {
                    Selection.activeGameObject =
                        host.Animator.gameObject;
                }
            }
        }

        private void PlaySelectedMotion(
            IReadOnlyList<AilisMotionDefinition> motions)
        {
            if (!EditorApplication.isPlaying ||
                _selectedMotionIndex < 0 ||
                _selectedMotionIndex >= motions.Count)
            {
                return;
            }
            _followPlayback = true;
            FindObjectOfType<AilisAnimationWorkbenchHost>()
                ?.PlayMotion(
                    motions[_selectedMotionIndex],
                    _previewSpeed);
        }

        private void OpenAnimator(string packageId)
        {
            var host = EditorApplication.isPlaying
                ? FindObjectOfType<AilisAnimationWorkbenchHost>()
                : null;
            if (host?.Animator != null)
            {
                Selection.activeGameObject = host.Animator.gameObject;
            }
            else
            {
                Selection.activeObject =
                    AssetDatabase.LoadAssetAtPath<AnimatorController>(
                        AilisAnimationWorkbenchControllerBuilder
                            .ResolveControllerPath(packageId));
            }
            EditorApplication.ExecuteMenuItem(
                "Window/Animation/Animator");
        }

        private void OpenAnimation(
            PackageEntry entry,
            IReadOnlyList<AilisMotionDefinition> motions)
        {
            if (_selectedMotionIndex < 0 ||
                _selectedMotionIndex >= motions.Count)
            {
                return;
            }
            SelectMotionClip(
                entry,
                motions[_selectedMotionIndex]);
            EditorApplication.ExecuteMenuItem(
                "Window/Animation/Animation");
        }

        private static void SelectMotionClip(
            PackageEntry entry,
            AilisMotionDefinition motion)
        {
            Selection.activeObject =
                AilisAnimationWorkbenchControllerBuilder.LoadMotionClip(
                    entry.Manifest.id,
                    motion);
        }

        private static void PrepareWorkbenchScene(
            PackageEntry entry,
            IReadOnlyList<AilisMotionDefinition> motions)
        {
            if (!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
            {
                return;
            }
            AilisPerformanceAnimatorTemplateBuilder.CreateOrUpdate();
            AilisVrmaMotionLibraryBuilder.CreateOrUpdate();
            var controller =
                AilisAnimationWorkbenchControllerBuilder.CreateOrUpdate(
                    entry.Manifest.id,
                    motions);
            CreateWorkbenchScene(entry.ManifestPath, controller);
        }

        private static void CreateWorkbenchScene(
            string manifestPath,
            RuntimeAnimatorController controller)
        {
            var scene = EditorSceneManager.NewScene(
                NewSceneSetup.EmptyScene,
                NewSceneMode.Single);

            var cameraObject =
                new GameObject("AILIS Workbench Camera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor =
                new Color(0.11f, 0.12f, 0.15f, 1f);
            camera.fieldOfView = 32f;
            cameraObject.tag = "MainCamera";

            var keyLightObject =
                new GameObject("AILIS Workbench Key Light");
            var keyLight = keyLightObject.AddComponent<Light>();
            keyLight.type = LightType.Directional;
            keyLight.intensity = 1.15f;
            keyLight.color = new Color(1f, 0.94f, 0.88f);
            keyLightObject.transform.rotation =
                Quaternion.Euler(34f, -28f, 0f);

            var fillLightObject =
                new GameObject("AILIS Workbench Fill Light");
            var fillLight = fillLightObject.AddComponent<Light>();
            fillLight.type = LightType.Directional;
            fillLight.intensity = 0.5f;
            fillLight.color = new Color(0.72f, 0.82f, 1f);
            fillLightObject.transform.rotation =
                Quaternion.Euler(18f, 148f, 0f);

            var hostObject =
                new GameObject("AILIS Animation Workbench");
            var host =
                hostObject.AddComponent<AilisAnimationWorkbenchHost>();
            host.Configure(
                manifestPath,
                controller,
                camera);

            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene, WorkbenchScenePath);
            Selection.activeGameObject = hostObject;
        }

        private void RefreshPackages()
        {
            var selectedId =
                _packages.Count > 0 &&
                _selectedPackageIndex >= 0 &&
                _selectedPackageIndex < _packages.Count
                    ? _packages[_selectedPackageIndex].Manifest.id
                    : EditorPrefs.GetString(
                        SelectedPackagePreference,
                        "");
            _packages.Clear();
            var root =
                Path.GetFullPath(
                    "Assets/StreamingAssets/Characters");
            if (Directory.Exists(root))
            {
                foreach (var manifestPath in Directory.GetFiles(
                             root,
                             "ailis-character.json",
                             SearchOption.AllDirectories))
                {
                    try
                    {
                        var manifest =
                            JsonUtility.FromJson<
                                AilisCharacterPackageManifest>(
                                File.ReadAllText(manifestPath));
                        if (manifest == null ||
                            !string.Equals(
                                manifest.adapter,
                                "vrm",
                                StringComparison.OrdinalIgnoreCase))
                        {
                            continue;
                        }
                        _packages.Add(new PackageEntry
                        {
                            ManifestPath =
                                Path.GetFullPath(manifestPath),
                            Manifest = manifest
                        });
                    }
                    catch (Exception error)
                    {
                        Debug.LogWarning(
                            "[AILIS Animation Workbench] Package skipped: " +
                            error.Message);
                    }
                }
            }
            _packages.Sort(
                (left, right) => string.Compare(
                    left.Manifest.displayName,
                    right.Manifest.displayName,
                    StringComparison.OrdinalIgnoreCase));
            _selectedPackageIndex = Mathf.Max(
                0,
                _packages.FindIndex(
                    entry => entry.Manifest.id == selectedId));
            _selectedMotionIndex = 0;
            Repaint();
        }
    }
}
#endif
