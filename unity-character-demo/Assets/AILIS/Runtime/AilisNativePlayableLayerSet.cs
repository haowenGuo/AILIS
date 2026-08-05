using System;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    [Serializable]
    public sealed class AilisNativePlayableLayer
    {
        public string id = "";
        public string role = "";
        public RuntimeAnimatorController controller;
        public AvatarMask mask;
        public float weight = 1f;
        public bool additive;
        public bool enabled = true;
    }

    public sealed class AilisNativePlayableLayerSet : MonoBehaviour
    {
        public string sourceSystem = "unity-mecanim";
        public AilisNativePlayableLayer[] layers =
            Array.Empty<AilisNativePlayableLayer>();
    }
}
