# electron-builder.yml 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`structured-data`
- 原始行数：61
- SHA-256：`5da004c4c547867384aecb04048377c7365ecd35171a98a88bcf63807a2331a2`
- 可运行副本：[打开源文件](../../source/electron-builder.yml)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>appId: com.ailis.desktop</code> | 配置键 `appId`：为构建、部署、依赖或运行时声明参数。 |
| 2 | <code>productName: AILIS</code> | 配置键 `productName`：为构建、部署、依赖或运行时声明参数。 |
| 3 | <code>artifactName: ${productName}-${version}-${arch}.${ext}</code> | 配置键 `artifactName`：为构建、部署、依赖或运行时声明参数。 |
| 4 | <code>icon: build/icon.png</code> | 配置键 `icon`：为构建、部署、依赖或运行时声明参数。 |
| 5 | <code>afterPack: scripts/fix-windows-exe-icon.cjs</code> | 配置键 `afterPack`：为构建、部署、依赖或运行时声明参数。 |
| 6 | <code>directories:</code> | 配置键 `directories`：为构建、部署、依赖或运行时声明参数。 |
| 7 | <code>  output: F:/AILIS/Build/AILIS</code> | 配置键 `output`：为构建、部署、依赖或运行时声明参数。 |
| 8 | <code>files:</code> | 配置键 `files`：为构建、部署、依赖或运行时声明参数。 |
| 9 | <code>  - dist/**/*</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 10 | <code>  - electron/**/*</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 11 | <code>  - scripts/mcp-ailis-research-server.cjs</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 12 | <code>  - scripts/ailis-crawl4ai-worker.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 13 | <code>  - scripts/ailis-python-search-worker.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 14 | <code>  - installer/ailis-runtime-components.json</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 15 | <code>  - package.json</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 16 | <code>extraMetadata:</code> | 配置键 `extraMetadata`：为构建、部署、依赖或运行时声明参数。 |
| 17 | <code>  main: electron/main.cjs</code> | 配置键 `main`：为构建、部署、依赖或运行时声明参数。 |
| 18 | <code>asar: true</code> | 配置键 `asar`：为构建、部署、依赖或运行时声明参数。 |
| 19 | <code>asarUnpack:</code> | 配置键 `asarUnpack`：为构建、部署、依赖或运行时声明参数。 |
| 20 | <code>  - dist/**/*</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 21 | <code>  - electron/**/*.cjs</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 22 | <code>  - electron/**/*.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 23 | <code>  - scripts/**/*.cjs</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 24 | <code>  - scripts/**/*.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 25 | <code>npmRebuild: false</code> | 配置键 `npmRebuild`：为构建、部署、依赖或运行时声明参数。 |
| 26 | <code>win:</code> | 配置键 `win`：为构建、部署、依赖或运行时声明参数。 |
| 27 | <code>  icon: build/icon.ico</code> | 配置键 `icon`：为构建、部署、依赖或运行时声明参数。 |
| 28 | <code>  executableName: AILIS</code> | 配置键 `executableName`：为构建、部署、依赖或运行时声明参数。 |
| 29 | <code>  signAndEditExecutable: false</code> | 配置键 `signAndEditExecutable`：为构建、部署、依赖或运行时声明参数。 |
| 30 | <code>  target:</code> | 配置键 `target`：为构建、部署、依赖或运行时声明参数。 |
| 31 | <code>    - target: nsis</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 32 | <code>      arch:</code> | 配置键 `arch`：为构建、部署、依赖或运行时声明参数。 |
| 33 | <code>        - x64</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 34 | <code>    - target: portable</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 35 | <code>      arch:</code> | 配置键 `arch`：为构建、部署、依赖或运行时声明参数。 |
| 36 | <code>        - x64</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 37 | <code>nsis:</code> | 配置键 `nsis`：为构建、部署、依赖或运行时声明参数。 |
| 38 | <code>  artifactName: ${productName}-Setup-${version}-win-${arch}.${ext}</code> | 配置键 `artifactName`：为构建、部署、依赖或运行时声明参数。 |
| 39 | <code>  oneClick: false</code> | 配置键 `oneClick`：为构建、部署、依赖或运行时声明参数。 |
| 40 | <code>  allowToChangeInstallationDirectory: true</code> | 配置键 `allowToChangeInstallationDirectory`：为构建、部署、依赖或运行时声明参数。 |
| 41 | <code>  include: installer/ailis-runtime-components.nsh</code> | 配置键 `include`：为构建、部署、依赖或运行时声明参数。 |
| 42 | <code>portable:</code> | 配置键 `portable`：为构建、部署、依赖或运行时声明参数。 |
| 43 | <code>  artifactName: ${productName}-Portable-${version}-win-${arch}.${ext}</code> | 配置键 `artifactName`：为构建、部署、依赖或运行时声明参数。 |
| 44 | <code>linux:</code> | 配置键 `linux`：为构建、部署、依赖或运行时声明参数。 |
| 45 | <code>  icon: build/icon.png</code> | 配置键 `icon`：为构建、部署、依赖或运行时声明参数。 |
| 46 | <code>  executableName: ailis</code> | 配置键 `executableName`：为构建、部署、依赖或运行时声明参数。 |
| 47 | <code>  category: Utility</code> | 配置键 `category`：为构建、部署、依赖或运行时声明参数。 |
| 48 | <code>  target:</code> | 配置键 `target`：为构建、部署、依赖或运行时声明参数。 |
| 49 | <code>    - target: AppImage</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 50 | <code>      arch:</code> | 配置键 `arch`：为构建、部署、依赖或运行时声明参数。 |
| 51 | <code>        - x64</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 52 | <code>    - target: deb</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 53 | <code>      arch:</code> | 配置键 `arch`：为构建、部署、依赖或运行时声明参数。 |
| 54 | <code>        - x64</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 55 | <code>    - target: tar.gz</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 56 | <code>      arch:</code> | 配置键 `arch`：为构建、部署、依赖或运行时声明参数。 |
| 57 | <code>        - x64</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 58 | <code>appImage:</code> | 配置键 `appImage`：为构建、部署、依赖或运行时声明参数。 |
| 59 | <code>  artifactName: ${productName}-${version}-linux-${arch}.${ext}</code> | 配置键 `artifactName`：为构建、部署、依赖或运行时声明参数。 |
| 60 | <code>deb:</code> | 配置键 `deb`：为构建、部署、依赖或运行时声明参数。 |
| 61 | <code>  artifactName: ${productName}-${version}-linux-${arch}.${ext}</code> | 配置键 `artifactName`：为构建、部署、依赖或运行时声明参数。 |
