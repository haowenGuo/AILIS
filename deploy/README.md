# Web 发布脚本

[deploy-ailis-web.ps1](../scripts/deploy-ailis-web.ps1)准备静态文件、生成站点元数据、打包、上传 release 并切换 Nginx 的 current 目标。

## 参数

| 参数 | 用途 |
| --- | --- |
| SiteUrl | 站点地址 |
| SshHost | 上传与远程操作目标 |
| IdentityFile | SSH 身份文件 |
| ReleaseName | 发布目录名称 |
| SkipBuild | 使用已有 dist |
| DryRun | 只准备本地产物，不上传和切换远程服务 |

使用前显式指定站点、主机和身份文件，不依赖脚本内置目标。DryRun 仍会验证本地路径并创建 staging 和 archive。

## 产物约定

脚本检查 Test/index.html，配套 Nginx 模板将首页指向这个入口。发布该演示时，先执行 pnpm build:demo，再使用 SkipBuild 保留演示产物。

默认 pnpm build 的页面集合不包含 Test。发布网站首页时，应先调整并验证产物和路由约定，详见[实现记录](../docs/reference/implementation-status.md)。

## 发布检查

记录候选产物来源和当前 release，核对域名、TLS、API 上游、认证和文件权限。发布后分别检查静态页面、后端和需要的模型功能；恢复操作使用事先记录的 release 目标。

其他流程：[桌面发布](../docs/engineering/distribution.md)、[服务端](../docs/engineering/services.md)。
