# Web 部署入口与已知差异

这是 [当前代码手册](../docs/README.md) 的部署补充，不是一条已经执行的发布记录。后端与 Hosted 的配置见 [服务说明](../docs/backend-and-hosted.md)。

## 当前脚本实际做什么

[deploy-ailis-web.ps1](../scripts/deploy-ailis-web.ps1)接受 `SiteUrl`、`SshHost`、`IdentityFile`、`ReleaseName`、`SkipBuild`、`DryRun`。它准备静态产物、替换 canonical origin、生成 robots／sitemap、打包，然后经 SSH 上传到 `/var/www/ailis/releases/<release>`，切换 `current` 并检查／重载 Nginx。

脚本内有具体服务器和 SSH key 的旧默认值，不应当作你的部署目标。使用前明确指定目标并确认授权；本次文档重写没有连接服务器。

## 不能直接照搬的默认链

默认构建命令 `pnpm build` 现在不含 `Test/index.html`，但发布脚本仍强制检查该文件。[域名模板](ailis-domain.nginx.conf.template)也把 `/` 指向 `/Test/index.html`。这是一处现存衔接差异，不是文档里可以宣称已修好的能力。

若明确要准备旧的浏览器演示发布候选，先 `pnpm build:demo`，再使用 `-SkipBuild`，防止脚本重新生成不含 Test 的产物。若要发布网站首页，需要另行核对并调整路由／产物契约，不能只换域名就认为完成。

## 本地预演示例

先替换占位域名、主机和已有密钥路径，确认构建 profile 后再使用：

```powershell
pnpm build:demo
powershell -NoProfile -File scripts/deploy-ailis-web.ps1 -SkipBuild -DryRun -SiteUrl https://ailis.example.com -SshHost deploy@ailis.example.com -IdentityFile C:\keys\ailis-deploy
```

`DryRun` 只阻止远程上传／切换，**仍会验证本地密钥路径、处理临时 staging 和生成 archive**；不是纯只读检查。该示例不是批准真实部署。去掉 DryRun 会产生远程写入。

## 上线检查

核对候选产物来源 commit、域名／TLS、Nginx 路由、API 上游、会话 secret、内部 token、限流、CORS、服务权限、磁盘空间和日志脱敏。切换前记录原 current 目标和恢复步骤；脚本保留旧 release 不等于任何故障都会自动回滚。

不要把静态发布成功等同于后端、模型、语音或 Agent 工具全链可用；逐层验收后再对外报告。
