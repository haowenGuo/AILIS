#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEditor.Animations;
using UnityEngine;

namespace Ailis.CharacterDemo.Editor
{
    public static class AilisPerformanceAnimatorTemplateBuilder
    {
        public const string ControllerResourcePath =
            "AILIS/Animation/AILIS_Performance";
        public const string GestureMaskResourcePath =
            "AILIS/Animation/AILIS_GestureMask";

        private const string Root = "Assets/Resources/AILIS/Animation";
        private const string ControllerPath = Root + "/AILIS_Performance.controller";
        private const string GestureMaskPath = Root + "/AILIS_GestureMask.mask";
        private const string FaceMaskPath = Root + "/AILIS_FaceMask.mask";
        private const string FullBodyMaskPath = Root + "/AILIS_FullBodyMask.mask";

        private static readonly string[] PlaceholderNames =
        {
            AilisPerformanceAnimatorParameters.IdleClip,
            AilisPerformanceAnimatorParameters.SpeakingClip,
            AilisPerformanceAnimatorParameters.ThinkingClip,
            AilisPerformanceAnimatorParameters.WorkingClip,
            AilisPerformanceAnimatorParameters.AdditiveClip,
            AilisPerformanceAnimatorParameters.GestureClip,
            AilisPerformanceAnimatorParameters.ActionClip,
            AilisPerformanceAnimatorParameters.FaceClip
        };

        public static void CreateOrUpdate()
        {
            EnsureAssetFolder(Root);
            var clips = CreatePlaceholderClips();
            var gestureMask = CreateMask(
                GestureMaskPath,
                "AILIS Gesture Mask",
                AvatarMaskBodyPart.Body,
                AvatarMaskBodyPart.Head,
                AvatarMaskBodyPart.LeftArm,
                AvatarMaskBodyPart.RightArm,
                AvatarMaskBodyPart.LeftFingers,
                AvatarMaskBodyPart.RightFingers);
            var faceMask = CreateMask(
                FaceMaskPath,
                "AILIS Face Mask",
                AvatarMaskBodyPart.Head);
            var fullBodyMask = CreateMask(
                FullBodyMaskPath,
                "AILIS Full Body Mask",
                AvatarMaskBodyPart.Root,
                AvatarMaskBodyPart.Body,
                AvatarMaskBodyPart.Head,
                AvatarMaskBodyPart.LeftLeg,
                AvatarMaskBodyPart.RightLeg,
                AvatarMaskBodyPart.LeftArm,
                AvatarMaskBodyPart.RightArm,
                AvatarMaskBodyPart.LeftFingers,
                AvatarMaskBodyPart.RightFingers,
                AvatarMaskBodyPart.LeftFootIK,
                AvatarMaskBodyPart.RightFootIK,
                AvatarMaskBodyPart.LeftHandIK,
                AvatarMaskBodyPart.RightHandIK);

            AssetDatabase.DeleteAsset(ControllerPath);
            var controller =
                AnimatorController.CreateAnimatorControllerAtPath(ControllerPath);
            controller.name = "AILIS Performance";
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.MotionX,
                AnimatorControllerParameterType.Float);
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.MotionY,
                AnimatorControllerParameterType.Float);
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.Intensity,
                AnimatorControllerParameterType.Float);
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.Speaking,
                AnimatorControllerParameterType.Float);
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.Emotion,
                AnimatorControllerParameterType.Int);
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.GestureWeight,
                AnimatorControllerParameterType.Float);
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.ActionWeight,
                AnimatorControllerParameterType.Float);
            controller.AddParameter(
                AilisPerformanceAnimatorParameters.FaceWeight,
                AnimatorControllerParameterType.Float);

            ConfigureBaseLayer(controller, clips);
            AddLayer(
                controller,
                "Additive",
                clips[AilisPerformanceAnimatorParameters.AdditiveClip],
                gestureMask,
                AnimatorLayerBlendingMode.Additive);
            AddLayer(
                controller,
                "Gesture",
                clips[AilisPerformanceAnimatorParameters.GestureClip],
                gestureMask,
                AnimatorLayerBlendingMode.Override);
            AddLayer(
                controller,
                "Action",
                clips[AilisPerformanceAnimatorParameters.ActionClip],
                fullBodyMask,
                AnimatorLayerBlendingMode.Override);
            AddLayer(
                controller,
                "Face",
                clips[AilisPerformanceAnimatorParameters.FaceClip],
                faceMask,
                AnimatorLayerBlendingMode.Additive);

            EditorUtility.SetDirty(controller);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log(
                "[AILIS Animation] Standard Animator template ready: " +
                ControllerPath);
        }

        private static System.Collections.Generic.Dictionary<string, AnimationClip>
            CreatePlaceholderClips()
        {
            var clips =
                new System.Collections.Generic.Dictionary<string, AnimationClip>(
                    StringComparer.Ordinal);
            foreach (var name in PlaceholderNames)
            {
                var path = Root + "/" + name + ".anim";
                AssetDatabase.DeleteAsset(path);
                var clip = new AnimationClip
                {
                    name = name,
                    frameRate = 30f,
                    wrapMode = WrapMode.Loop
                };
                AssetDatabase.CreateAsset(clip, path);
                clips[name] = clip;
            }
            return clips;
        }

        private static void ConfigureBaseLayer(
            AnimatorController controller,
            System.Collections.Generic.IReadOnlyDictionary<string, AnimationClip>
                clips)
        {
            var layer = controller.layers[0];
            layer.name = "Base";
            layer.defaultWeight = 1f;
            layer.blendingMode = AnimatorLayerBlendingMode.Override;

            var stateMachine = layer.stateMachine;
            stateMachine.name = "Base";
            foreach (var existingState in stateMachine.states)
            {
                stateMachine.RemoveState(existingState.state);
            }

            var blendTree = new BlendTree
            {
                name = "AILIS Performance Blend",
                blendType = BlendTreeType.FreeformCartesian2D,
                blendParameter = AilisPerformanceAnimatorParameters.MotionX,
                blendParameterY = AilisPerformanceAnimatorParameters.MotionY,
                useAutomaticThresholds = false
            };
            AssetDatabase.AddObjectToAsset(blendTree, controller);
            blendTree.AddChild(
                clips[AilisPerformanceAnimatorParameters.IdleClip],
                Vector2.zero);
            blendTree.AddChild(
                clips[AilisPerformanceAnimatorParameters.SpeakingClip],
                new Vector2(1f, 0f));
            blendTree.AddChild(
                clips[AilisPerformanceAnimatorParameters.ThinkingClip],
                new Vector2(0f, 1f));
            blendTree.AddChild(
                clips[AilisPerformanceAnimatorParameters.WorkingClip],
                new Vector2(-1f, 0f));

            var performanceState = stateMachine.AddState("Performance Blend");
            performanceState.motion = blendTree;
            performanceState.writeDefaultValues = false;
            stateMachine.defaultState = performanceState;
            controller.layers = ReplaceLayer(controller.layers, 0, layer);
        }

        private static void AddLayer(
            AnimatorController controller,
            string name,
            AnimationClip clip,
            AvatarMask mask,
            AnimatorLayerBlendingMode blendingMode)
        {
            var stateMachine = new AnimatorStateMachine
            {
                name = name
            };
            AssetDatabase.AddObjectToAsset(stateMachine, controller);
            var state = stateMachine.AddState(name + " Runtime Input");
            state.motion = clip;
            state.writeDefaultValues = false;
            stateMachine.defaultState = state;

            controller.AddLayer(new AnimatorControllerLayer
            {
                name = name,
                stateMachine = stateMachine,
                avatarMask = mask,
                blendingMode = blendingMode,
                defaultWeight = 1f,
                iKPass = true
            });
        }

        private static AnimatorControllerLayer[] ReplaceLayer(
            AnimatorControllerLayer[] layers,
            int index,
            AnimatorControllerLayer layer)
        {
            layers[index] = layer;
            return layers;
        }

        private static AvatarMask CreateMask(
            string path,
            string name,
            params AvatarMaskBodyPart[] enabledParts)
        {
            AssetDatabase.DeleteAsset(path);
            var mask = new AvatarMask
            {
                name = name
            };
            for (var index = (int)AvatarMaskBodyPart.Root;
                 index < (int)AvatarMaskBodyPart.LastBodyPart;
                 index += 1)
            {
                var part = (AvatarMaskBodyPart)index;
                mask.SetHumanoidBodyPartActive(part, false);
            }
            foreach (var part in enabledParts)
            {
                mask.SetHumanoidBodyPartActive(part, true);
            }
            AssetDatabase.CreateAsset(mask, path);
            return mask;
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
