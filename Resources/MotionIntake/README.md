# 动作候选资源与审核

本目录是候选动作资产池。实际账本是 [motion-intake-catalog.js](../../src/character/motion-intake-catalog.js) 与 [external-candidates](../../src/character/motion-intake-external-candidates.js)；稳定动作消费见 [motion-library.js](../../src/character/motion-library.js)。

## 添加一个候选

1. 在 `candidates/<source-id>/` 保留来源、原始许可和下载／购买凭据，不把凭据公开提交。
2. 登记路径、source、license、style、feminineScore、clippingRisk、approved 等账本字段；未完成核验不要冒充正式可发布资源。
3. 在仓库根执行 `pnpm motion:intake:scan`，需要结构核验时执行 `pnpm motion:intake:verify`。
4. 逐项检查本地文件、动作注册、身体／衣服／头发穿模、镜头构图、动作节奏与角色风格。
5. 单独核验授权范围和是否允许随包分发；程序中的 approved 不能代替许可审查。

## 必须保留的来源边界

账本将 VRoid official 动作与 Sachi／fumi2kick 候选分开记录。VRoid 条款不等于 CC0；Sachi／fumi2kick 的 CC0 描述仍要求核对取得的包内条款。历史 Sachi ZIP 曾有损坏记录，抽取到部分文件不等于拥有完整归档。

旧命名动作中有 `approved: true` 但 `license: unknown-local-file` 的条目。发布前应解决这些授权缺口，而不是因为当前能播放就统一声明可再分发。相关原始 README／许可文件保留不变。

[scan-motion-intake.mjs](../../scripts/scan-motion-intake.mjs)核对结构和本地文件／注册关系，不会替你完成视觉或法律授权判断。参见 [角色手册](../../docs/voice-and-avatar.md)。
