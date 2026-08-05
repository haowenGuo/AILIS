using System;
using UnityEngine;
using UnityEngine.Animations.Rigging;

namespace Ailis.CharacterDemo
{
    public sealed class AilisAnimationRigController : MonoBehaviour
    {
        private sealed class LimbRig
        {
            public Transform Tip;
            public Transform Target;
            public TwoBoneIKConstraint Constraint;
            public Vector3 PreviousTipPosition;
            public float CurrentWeight;
            public bool HasPreviousTipPosition;
        }

        private readonly RaycastHit[] _groundHits = new RaycastHit[12];
        private Animator _animator;
        private AilisLayeredPerformanceController _performance;
        private AilisRigProfile _profile;
        private RigBuilder _rigBuilder;
        private Rig _rig;
        private LimbRig _leftFoot;
        private LimbRig _rightFoot;
        private LimbRig _leftHand;
        private LimbRig _rightHand;
        private Transform _gazeTarget;
        private MultiAimConstraint _headAim;
        private string _gazeSemantic = "user";

        public bool IsReady { get; private set; }

        public bool Configure(
            Animator animator,
            AilisRigProfile profile,
            AilisLayeredPerformanceController performance)
        {
            _animator = animator;
            _profile = profile ?? new AilisRigProfile();
            _profile.Normalize();
            _performance = performance;
            if (!_profile.enabled ||
                _animator == null ||
                !_animator.isHuman)
            {
                return false;
            }

            var rigRoot = new GameObject("AILIS Animation Rig");
            rigRoot.transform.SetParent(_animator.transform, false);
            _rig = rigRoot.AddComponent<Rig>();

            _leftFoot = CreateLimbRig(
                rigRoot.transform,
                "Left Foot",
                HumanBodyBones.LeftUpperLeg,
                HumanBodyBones.LeftLowerLeg,
                HumanBodyBones.LeftFoot,
                0f);
            _rightFoot = CreateLimbRig(
                rigRoot.transform,
                "Right Foot",
                HumanBodyBones.RightUpperLeg,
                HumanBodyBones.RightLowerLeg,
                HumanBodyBones.RightFoot,
                0f);
            _leftHand = CreateLimbRig(
                rigRoot.transform,
                "Left Hand",
                HumanBodyBones.LeftUpperArm,
                HumanBodyBones.LeftLowerArm,
                HumanBodyBones.LeftHand,
                0f);
            _rightHand = CreateLimbRig(
                rigRoot.transform,
                "Right Hand",
                HumanBodyBones.RightUpperArm,
                HumanBodyBones.RightLowerArm,
                HumanBodyBones.RightHand,
                0f);
            _headAim = CreateHeadAim(rigRoot.transform);

            _rigBuilder = _animator.gameObject.AddComponent<RigBuilder>();
            _rigBuilder.layers.Add(new RigLayer(_rig));
            IsReady = _rigBuilder.Build();
            Debug.Log(
                "[AILIS Animation] Animation Rigging " +
                (IsReady ? "ready" : "unavailable") +
                ": footGrounding=raycast(" +
                _profile.footGroundingWeight.ToString("0.00") + ")" +
                ", hands=" + _profile.handIkWeight.ToString("0.00") +
                ", gaze=" + _profile.gazeWeight.ToString("0.00"));
            return IsReady;
        }

        public void ApplySurface(AilisPersonaSurface surface)
        {
            _gazeSemantic = string.IsNullOrWhiteSpace(surface?.gazeTarget)
                ? "user"
                : surface.gazeTarget.Trim().ToLowerInvariant();
        }

        public void SetHandTargets(Transform leftTarget, Transform rightTarget)
        {
            SetExternalTarget(_leftHand, leftTarget);
            SetExternalTarget(_rightHand, rightTarget);
        }

        private LimbRig CreateLimbRig(
            Transform rigRoot,
            string label,
            HumanBodyBones rootBone,
            HumanBodyBones midBone,
            HumanBodyBones tipBone,
            float weight)
        {
            var root = _animator.GetBoneTransform(rootBone);
            var mid = _animator.GetBoneTransform(midBone);
            var tip = _animator.GetBoneTransform(tipBone);
            if (root == null || mid == null || tip == null)
            {
                return null;
            }

            var target = new GameObject(label + " Target").transform;
            target.SetParent(rigRoot, true);
            target.SetPositionAndRotation(tip.position, tip.rotation);
            var hint = new GameObject(label + " Hint").transform;
            hint.SetParent(rigRoot, true);
            hint.position = mid.position + _animator.transform.forward * 0.2f;

            var constraintObject = new GameObject(label + " IK");
            constraintObject.transform.SetParent(rigRoot, false);
            var constraint = constraintObject.AddComponent<TwoBoneIKConstraint>();
            constraint.Reset();
            ref var data = ref constraint.data;
            data.root = root;
            data.mid = mid;
            data.tip = tip;
            data.target = target;
            data.hint = hint;
            data.targetPositionWeight = 1f;
            data.targetRotationWeight = 0.25f;
            data.hintWeight = 0.5f;
            data.maintainTargetPositionOffset = false;
            data.maintainTargetRotationOffset = true;
            constraint.weight = Mathf.Clamp01(weight);
            return new LimbRig
            {
                Tip = tip,
                Target = target,
                Constraint = constraint
            };
        }

        private MultiAimConstraint CreateHeadAim(Transform rigRoot)
        {
            var head = _animator.GetBoneTransform(HumanBodyBones.Head);
            if (head == null)
            {
                return null;
            }

            _gazeTarget = new GameObject("Gaze Target").transform;
            _gazeTarget.SetParent(rigRoot, true);
            _gazeTarget.position =
                head.position + _animator.transform.forward * _profile.gazeDistance;

            var constraintObject = new GameObject("Head Gaze");
            constraintObject.transform.SetParent(rigRoot, false);
            var constraint = constraintObject.AddComponent<MultiAimConstraint>();
            constraint.Reset();
            var sources = new WeightedTransformArray(0);
            sources.Add(new WeightedTransform(_gazeTarget, 1f));
            ref var data = ref constraint.data;
            data.constrainedObject = head;
            data.sourceObjects = sources;
            data.aimAxis = MultiAimConstraintData.Axis.Z;
            data.upAxis = MultiAimConstraintData.Axis.Y;
            data.worldUpType = MultiAimConstraintData.WorldUpType.SceneUp;
            data.worldUpAxis = MultiAimConstraintData.Axis.Y;
            data.limits = new Vector2(
                -_profile.headAngleLimit,
                _profile.headAngleLimit);
            data.constrainedXAxis = true;
            data.constrainedYAxis = true;
            data.constrainedZAxis = false;
            data.maintainOffset = true;
            constraint.weight = _profile.gazeWeight;
            return constraint;
        }

        private void LateUpdate()
        {
            if (!IsReady)
            {
                return;
            }

            var actionWeight = _performance?.ActionWeight ?? 0f;
            var groundingWeight =
                _profile.footGroundingWeight * (1f - actionWeight);
            UpdateFootTarget(_leftFoot, groundingWeight, Time.deltaTime);
            UpdateFootTarget(_rightFoot, groundingWeight, Time.deltaTime);
            UpdateGazeTarget();
        }

        private void UpdateFootTarget(
            LimbRig limb,
            float maximumWeight,
            float deltaTime)
        {
            if (limb?.Tip == null ||
                limb.Target == null ||
                limb.Constraint == null)
            {
                return;
            }

            var tipPosition = limb.Tip.position;
            var up = _animator.transform.up;
            var verticalSpeed = 0f;
            if (limb.HasPreviousTipPosition && deltaTime > 0.0001f)
            {
                verticalSpeed = Vector3.Dot(
                    tipPosition - limb.PreviousTipPosition,
                    up) / deltaTime;
            }
            limb.PreviousTipPosition = tipPosition;
            limb.HasPreviousTipPosition = true;

            var targetWeight = 0f;
            if (TryFindGround(limb.Tip, up, out var hit))
            {
                var groundedPosition =
                    hit.point + up * _profile.groundOffset;
                var distanceFromGround = Mathf.Abs(Vector3.Dot(
                    tipPosition - groundedPosition,
                    up));
                var contactDistance =
                    _profile.groundContactDistance *
                    Mathf.Max(0.6f, _animator.humanScale);
                var maximumVerticalSpeed =
                    0.35f * Mathf.Max(0.6f, _animator.humanScale);
                if (distanceFromGround <= contactDistance &&
                    verticalSpeed <= maximumVerticalSpeed)
                {
                    limb.Target.position = groundedPosition;
                    limb.Target.rotation =
                        Quaternion.FromToRotation(
                            limb.Tip.up,
                            hit.normal) *
                        limb.Tip.rotation;
                    targetWeight = Mathf.Clamp01(maximumWeight);
                }
            }

            var blendSeconds = Mathf.Max(
                0.02f,
                _profile.groundingBlendSeconds);
            limb.CurrentWeight = Mathf.MoveTowards(
                limb.CurrentWeight,
                targetWeight,
                deltaTime / blendSeconds);
            limb.Constraint.weight = limb.CurrentWeight;
        }

        private bool TryFindGround(
            Transform foot,
            Vector3 up,
            out RaycastHit groundHit)
        {
            groundHit = default;
            var origin =
                foot.position + up * _profile.groundProbeHeight;
            var distance =
                _profile.groundProbeHeight +
                _profile.groundProbeDistance;
            var hitCount = Physics.RaycastNonAlloc(
                origin,
                -up,
                _groundHits,
                distance,
                _profile.groundLayerMask,
                QueryTriggerInteraction.Ignore);
            var closestDistance = float.PositiveInfinity;
            var found = false;
            for (var index = 0; index < hitCount; index++)
            {
                var candidate = _groundHits[index];
                if (candidate.collider == null ||
                    candidate.collider.transform.IsChildOf(
                        _animator.transform))
                {
                    continue;
                }
                if (candidate.distance >= closestDistance)
                {
                    continue;
                }
                closestDistance = candidate.distance;
                groundHit = candidate;
                found = true;
            }
            return found;
        }

        private void UpdateGazeTarget()
        {
            if (_gazeTarget == null || _headAim == null)
            {
                return;
            }
            var head = _animator.GetBoneTransform(HumanBodyBones.Head);
            if (head == null)
            {
                return;
            }

            var direction = _animator.transform.forward;
            switch (_gazeSemantic)
            {
                case "side":
                    direction = Quaternion.AngleAxis(
                        18f,
                        _animator.transform.up) * direction;
                    break;
                case "down":
                    direction = Quaternion.AngleAxis(
                        12f,
                        _animator.transform.right) * direction;
                    break;
                case "screen":
                    direction = Quaternion.AngleAxis(
                        -10f,
                        _animator.transform.up) * direction;
                    break;
            }
            _gazeTarget.position =
                head.position + direction.normalized * _profile.gazeDistance;
            _headAim.weight =
                _profile.gazeWeight *
                (1f - (_performance?.ActionWeight ?? 0f) * 0.65f);
        }

        private void SetExternalTarget(LimbRig limb, Transform externalTarget)
        {
            if (limb?.Constraint == null)
            {
                return;
            }
            if (externalTarget == null)
            {
                limb.Constraint.weight = 0f;
                return;
            }
            ref var data = ref limb.Constraint.data;
            data.target = externalTarget;
            limb.Constraint.weight = _profile.handIkWeight;
        }

        public void DisposeRig()
        {
            if (_rigBuilder != null)
            {
                _rigBuilder.Clear();
                Destroy(_rigBuilder);
                _rigBuilder = null;
            }
            if (_rig != null)
            {
                Destroy(_rig.gameObject);
                _rig = null;
            }
            IsReady = false;
        }

        private void OnDestroy()
        {
            DisposeRig();
        }
    }
}
