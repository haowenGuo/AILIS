# AILIS Motion Intake

这个目录用于管理 AILIS 的动作资产候选池。原则是：所有新动作先进入候选池并标注来源、许可、风格、女性化评分、穿模风险和是否通过审核；只有肉眼验收通过的动作才允许进入稳定 Runtime。

## 目录约定

- `candidates/`: 用户下载或购买后的原始动作包解压目录。
- `download-attempts.json`: 记录来源页面、下载链接、许可声明和当前下载状态。
- `src/character/motion-intake-catalog.js`: Runtime 使用的动作资产账本。
- `unity-character-demo/MotionLibraries/`: 可复用于不同 Unity 人物的动作库配置；人物配方只声明依赖，不复制整套映射。

## 状态流转

1. 下载或购买动作包，保存到 `Resources/MotionIntake/candidates/<source-id>/raw/`。
2. 解压后只把准备测试的 `.vrma` 放到 `Resources/MotionIntake/candidates/<source-id>/vrma/`。
3. 在 `src/character/motion-intake-catalog.js` 新增动作条目，必须填写：
   - `source`
   - `license`
   - `style`
   - `feminineScore`
   - `clippingRisk`
   - `approved`
4. 运行 `pnpm motion:intake:verify`，确保账本、文件和 Runtime 注册一致。
5. 在桌面端打开“角色验收”面板，逐个观看候选动作。
6. 只有满足以下条件才把 `approved` 改为 `true`：
   - AILIS 身体、衣服、头发、手臂没有明显穿模。
   - 动作风格符合 AILIS：柔和、女性化、二次元助手感。
   - 镜头内构图稳定，不会大幅出框。
   - 不会显著打断对话节奏。
   - 许可允许当前使用场景。

## 当前免费来源

- `[CC0] Sachi VRMA 1`: BOOTH 商品页可访问，但匿名访问 `downloadables/5713997` 会跳转登录。
- `fumi2kick VRMA motion pack`: BOOTH 商品页可访问，但匿名访问 `downloadables/4234181` 会跳转登录。
- `VRoid official 7 VRMA`: 本地 `Resources/VRMA_MotionPack` 已包含对应 readme 和 `VRMA_01` 到 `VRMA_07` 文件；许可不是 CC0，需遵守 VRoid Project 条款。
- `Quaternius Universal Animation Library` 与 `OpenGameArt CC0 Humanoid Emotes`: 已导入 Unity，组成 `cc0-assistant-foundation` 通用动作库。
- `Quaternius Universal Animation Library 2`: 130+ 个 CC0 Humanoid 动作，非 Root Motion 版已进入候选审计；主要补充互动、生产、姿态和长程动作，不会自动进入桌宠动作调度。
- `Anime Girl Idle Animations Free`: 属于 Unity Asset Store Extension Asset，只允许用户账号本机导入，不进入 MIT 仓库或安装包。

## 免费来源分级

### 可随 AILIS 分发

- `Quaternius Universal Animation Library 1/2`: CC0，Unity Humanoid，可作为通用骨骼重定向基座。
- `OpenGameArt CC0 Humanoid Emotes`: CC0，适合补充挥手、抱臂等短手势。
- `fumi2kick VRMA motion pack`: CC0，原生 VRMA，但喜剧动作较多，必须经过人物视觉验收。
- `Sachi VRMA 1`: 来源页声明 CC0，偏日系；当前本地归档不完整，保留来源证据并重新取得健康压缩包后再扩展稳定动作。
- `Mesh2Motion`: 工具代码 MIT、官方动作资产 CC0，可作为 GLB 动作生成与转换补充管线，不直接替代人工视觉验收。

### 免费使用，但原始动作不随 MIT 包分发

- `Motifect Daily Life Motion Pack`: 40 个日常 FBX/BVH，覆盖说话、坐下、站起、挥手、开门和拾取；商品页允许在个人和商业游戏中使用，但未明确允许原始动作再分发。
- `VRoid official 7 VRMA`: 允许按条款使用，禁止以可提取原始动作的形式再分发。
- `Anime Girl Idle Animations Free`: Unity Asset Store EULA，仅由用户自己的 Unity 账号导入。
- `JBear free mocap packs` 与 `Anderson Rohr Everyday Actions`: 可免费用于项目，但在没有明确原始资产再分发条款前，只作为用户本地依赖。
- `Necocoya Free Emote Set`: 偏二次元的 Unity Humanoid AnimationClip，包含挥手、鞠躬、害羞、打招呼、和平手势、睡眠等；免费获取，但应先从随包手册确认商业使用与原始资产再分发条款。

### 不纳入

- 禁止商业使用、禁止 AI 相关使用，或来源/许可证无法验证的免费动作，不进入候选池。

## 免费架构参考

- `VRChat Custom Animator Controllers`: CC0，已经实现 Face、Gesture、Base、Action、Sitting 分层，包含表情/眨眼/口型互斥和 64 个 Emote 槽位。它不直接提供大量动作，但可用于核对 AILIS 分层 Animator 的行为是否完整。
- `Unity Simple Character Controller Set`: 除人物模型外，动作、脚本和 UI 为 CC0，适合检查最小 Humanoid 动作播放器和动作注册流程。

## 2026-06-03 本地导入

- `F:/新建文件夹/SachiVRMA1.zip` 已复制到 `candidates/sachi-vrma-1/raw/`。该 zip 的中央目录损坏，`Expand-Archive` 无法完整打开；`tar` 成功抽出 `capture_vrma` 下 42 个 `.vrma`，但在后续 Blender 源文件处失败。因此这些 VRMA 可以进入候选验收，但在重新下载健康压缩包前，不应视为完整归档。
- `F:/新建文件夹/fm_vrma_motion_pack_01.zip` 已完整解压到 `candidates/fumi2kick-vrma-motion-pack/extracted/`，包含 8 个 `.vrma`。
- 两个包的动作均已登记到 `src/character/motion-intake-external-candidates.js`，默认 `approved: false`。

## 2026-07-28 Sachi 日系动作精选

- 已在 Sendagaya Shino 上逐帧验收 `idle05`、`idle03`、`smallwve`、`happy01`、`skirt01` 和 `stand01`，并作为 CC0 日系精选动作接入稳定人物包。
- `point1` 的说明语义可用，但开场身体前倾较大，只进入 Character Lab 待审查，不参与自动动作调度。
- 转圈、行走、坐姿、未知命名和明显根位移动作没有进入稳定人物包，避免人物漂移、出框和服装穿模。
- 稳定副本位于 `unity-character-demo/RuntimePackages/vroid-shino-cc0/Motions/`，`unity:demo:prepare` 会把自包含人物包同步到 Unity StreamingAssets；候选原件继续保留在 intake 目录，便于复核来源。

## 2026-07-30 UAL2 免费基座验证

- 已下载并保留 `Universal Animation Library 2` 免费 Standard 包，归档 SHA-256 为 `4008EA208A604773A2B2177D965F0F5D3195498B5BF838C3F5785D68E95F2A68`。
- 商品完整库标称 130+ 动作；免费 Standard FBX 实际审计得到 43 个 Humanoid clip。
- 首批筛选 `抱臂待机 / 普通待机 / 通话 / 点头确认 / 饮用` 5 个动作，在 RadDoll、Unity-Chan 和 Shino 上完成 15 组相同原始 clip 重定向测试：机械 15/15 通过，跨人物一致性 15/15 通过。
- 这些动作仍是候选。头发、衣服、袖子、手部与道具的穿模必须在实时 Character Lab 中肉眼验收后，才能进入稳定动作调度。

## Unity 通用动作库

- `unity-character-demo/MotionLibraries/cc0-assistant-foundation.json` 提供 CC0 动作基座，人物配方通过 `motionLibraries` 选择使用。
- 动作库负责声明 Animator clip、语义意图、来源、许可、风格标签和安全回退；角色配方可按动作 ID 覆盖不适合该角色的映射。
- 外部动作首次接入统一标为 `compatibility: review`。Character Lab 可以精确播放验收，但 AILIS 自动动作选择只使用该角色已批准的动作或安全回退。
- 受 Unity Asset Store、VRoid、Unity-Chan 等专用条款约束的资产只能作为本地可选依赖，不得因为项目采用 MIT 就连同原始资产重新分发。

## 付费动作包导入原则

付费包也走同一流程，不允许直接改稳定动作映射。先进入候选池，标注购买来源和许可摘要，再由验收面板肉眼通过后进入稳定 Runtime。
