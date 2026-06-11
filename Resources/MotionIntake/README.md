# AIGL Motion Intake

这个目录用于管理 AIGL 的动作资产候选池。原则是：所有新动作先进入候选池并标注来源、许可、风格、女性化评分、穿模风险和是否通过审核；只有肉眼验收通过的动作才允许进入稳定 Runtime。

## 目录约定

- `candidates/`: 用户下载或购买后的原始动作包解压目录。
- `download-attempts.json`: 记录来源页面、下载链接、许可声明和当前下载状态。
- `src/character/motion-intake-catalog.js`: Runtime 使用的动作资产账本。

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
   - AIGL 身体、衣服、头发、手臂没有明显穿模。
   - 动作风格符合 AIGL：柔和、女性化、二次元助手感。
   - 镜头内构图稳定，不会大幅出框。
   - 不会显著打断对话节奏。
   - 许可允许当前使用场景。

## 当前免费来源

- `[CC0] Sachi VRMA 1`: BOOTH 商品页可访问，但匿名访问 `downloadables/5713997` 会跳转登录。
- `fumi2kick VRMA motion pack`: BOOTH 商品页可访问，但匿名访问 `downloadables/4234181` 会跳转登录。
- `VRoid official 7 VRMA`: 本地 `Resources/VRMA_MotionPack` 已包含对应 readme 和 `VRMA_01` 到 `VRMA_07` 文件；许可不是 CC0，需遵守 VRoid Project 条款。

## 2026-06-03 本地导入

- `F:/新建文件夹/SachiVRMA1.zip` 已复制到 `candidates/sachi-vrma-1/raw/`。该 zip 的中央目录损坏，`Expand-Archive` 无法完整打开；`tar` 成功抽出 `capture_vrma` 下 42 个 `.vrma`，但在后续 Blender 源文件处失败。因此这些 VRMA 可以进入候选验收，但在重新下载健康压缩包前，不应视为完整归档。
- `F:/新建文件夹/fm_vrma_motion_pack_01.zip` 已完整解压到 `candidates/fumi2kick-vrma-motion-pack/extracted/`，包含 8 个 `.vrma`。
- 两个包的动作均已登记到 `src/character/motion-intake-external-candidates.js`，默认 `approved: false`。

## 付费动作包导入原则

付费包也走同一流程，不允许直接改稳定动作映射。先进入候选池，标注购买来源和许可摘要，再由验收面板肉眼通过后进入稳定 Runtime。
