# 动作资源接入

本目录管理候选动作。catalog 记录来源、文件、风格、穿模风险和审核状态，motion-library 提供运行使用的动作。

## 接入流程

1. 保存候选文件与来源记录。
2. 在 catalog 登记路径、source、license、style 和审核字段。
3. 执行结构检查，确认文件和注册关系。
4. 在角色上检查节奏、姿态、身体与衣物穿模。
5. 按实际发布方式核验许可，再纳入分发资源。

仓库根命令：

```powershell
pnpm motion:intake:scan
pnpm motion:intake:verify
```

结构检查与视觉审核不能替代资源许可核验。

实现：[catalog](../../src/character/motion-intake-catalog.js)、[外部候选](../../src/character/motion-intake-external-candidates.js)、[运行库](../../src/character/motion-library.js)、[检查脚本](../../scripts/scan-motion-intake.mjs)。
