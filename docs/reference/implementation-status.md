# 实现状态记录

本页集中记录 2026-09-06 对照源码确认的特殊行为和待验证项。它是维护记录，不是功能路线图；本次文档工作没有修改下列实现。

| 项目 | 代码事实 | 使用或维护影响 |
| --- | --- | --- |
| 统一模式的 provider 压缩 | Runner 的 hard／stop 条件检查 task_agent、persona，未包含 unified | 统一模式仍有投影与预算，但该 provider 压缩分支的接入需要单独处理 |
| usage 汇总 | Runner.normalizeCostUsage 为缺失统计填 0；Gateway 分析另有归一与聚合逻辑 | 原始字段缺失须单列 unknown，聚合零值不充分证明零用量 |
| Lab step mode | buildRunPayload 将 dryRun 计算为 checked && !stepMode | 逐轮调试可能执行实际工具，不受复选框的 dry-run 值保护 |
| vLLM 设置迁移 | store 将保存的 provider=vllm 转为 ollama，并替换 URL／model 为 Ollama 默认值 | 不能用该旧 provider 值保存现有 vLLM 连接；兼容协议服务应显式配置 |
| Hosted 认证 | 内部 token 为空时 authorize 返回 true，health 在认证之前 | 部署时配置认证和网络访问范围 |
| secret 存储 | memory-store 使用 Base64；clearMemory 默认保留 secrets | 需要文件权限保护，并分别处理各存储的删除范围 |
| Web 发布入口 | 部署脚本默认 build 后检查 Test/index.html；Vite 默认 build 不包含 Test | 发布演示应明确使用 demo 产物；网站首页需要匹配路由 |
| 动作素材 | catalog 有 approved=true、license=unknown-local-file 的条目 | 视觉审核和分发许可需要分别核验 |

源码定位：[Runner](../../electron/agent-loop/runner.cjs)、[Gateway](../../electron/ailis-gateway.cjs)、[Lab](../../src/agent-lab-app.js)、[store](../../electron/store.cjs)、[Hosted 启动器](../../scripts/start-ailis-hosted-runtime.cjs)、[memory](../../electron/ailis-memory-store.cjs)、[Web 部署](../../scripts/deploy-ailis-web.ps1)、[Vite](../../vite.config.js)、[动作 catalog](../../src/character/motion-intake-catalog.js)。

## 验证边界

本轮文档依据入口、实现、配置和相关测试重建。未因此执行真实模型请求、正式评测、桌面设备测试或远程部署。离线测试结果另存本轮工作记录。

上述条目后续修复时，应关联代码提交与对应测试，并更新本页。不要只修改文字将未验证行为标记为完成。
