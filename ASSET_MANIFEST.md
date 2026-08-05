# Local Asset Manifest

The following assets are preserved on this workstation but intentionally excluded from the public Git branch.

| Local path | Reason | Restore action |
| --- | --- | --- |
| `unity-character-demo/Assets/RadDollV3/` | RadDoll VN3 terms prohibit redistribution of original and modified digital content. | Restore from the user's purchased/local `RadDollV3_v3.02.zip`. |
| `unity-character-demo/Assets/StreamingAssets/Characters/raddoll-v3.02/` | Runtime export derived from RadDoll. | Regenerate after restoring RadDoll. |
| `unity-character-demo/Assets/AILIS/GeneratedPackages/` | Generated packages include derivatives of local character assets. | Rebuild with the AILIS package builder in Unity. |
| `unity-character-demo/Assets/StreamingAssets/Characters/unity-chan-1.4.0/` | Unity-Chan has separate UCL terms and attribution requirements. | Restore from the original Unity-Chan package and keep its license files. |
| `unity-character-demo/Assets/Resources/AILIS/Animation/VRMA/` | Large generated animation cache. | Rebuild from the source motion libraries. |
| `Build/` | Reproducible standalone output. | Rebuild from the Unity project. |
| `unity-character-demo/Library/` | Unity import/cache state tied to the local editor. | Let Unity regenerate it. |
| `source-assets/` | Duplicate downloadable motion-source archive; runtime-ready motion metadata remains in Git. | Restore from the local archive or download again from the recorded upstream source. |

The local archive remains complete under `F:\AIGAME`; these exclusions only apply to Git publication.
