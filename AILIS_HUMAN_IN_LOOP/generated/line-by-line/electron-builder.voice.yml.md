# electron-builder.voice.yml 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`structured-data`
- 原始行数：46
- SHA-256：`a362c957eec93e7f96122a5b963c98556e279c429dcaf021790c31b0310640a7`
- 可运行副本：[打开源文件](../../source/electron-builder.voice.yml)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>appId: com.ailis.desktop</code> | 配置键 `appId`：为构建、部署、依赖或运行时声明参数。 |
| 2 | <code>productName: AILIS</code> | 配置键 `productName`：为构建、部署、依赖或运行时声明参数。 |
| 3 | <code>artifactName: ${productName}-${version}-offline-voice-${arch}.${ext}</code> | 配置键 `artifactName`：为构建、部署、依赖或运行时声明参数。 |
| 4 | <code>icon: build/icon.png</code> | 配置键 `icon`：为构建、部署、依赖或运行时声明参数。 |
| 5 | <code>afterPack: scripts/fix-windows-exe-icon.cjs</code> | 配置键 `afterPack`：为构建、部署、依赖或运行时声明参数。 |
| 6 | <code>directories:</code> | 配置键 `directories`：为构建、部署、依赖或运行时声明参数。 |
| 7 | <code>  output: D:/AILIS/Build/AILIS-voice</code> | 配置键 `output`：为构建、部署、依赖或运行时声明参数。 |
| 8 | <code>files:</code> | 配置键 `files`：为构建、部署、依赖或运行时声明参数。 |
| 9 | <code>  - dist/**/*</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 10 | <code>  - electron/**/*</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 11 | <code>  - scripts/mcp-ailis-research-server.cjs</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 12 | <code>  - scripts/ailis-crawl4ai-worker.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 13 | <code>  - scripts/ailis-python-search-worker.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 14 | <code>  - package.json</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 15 | <code>extraResources:</code> | 配置键 `extraResources`：为构建、部署、依赖或运行时声明参数。 |
| 16 | <code>  - from: models/voice-runtime</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 17 | <code>    to: models/voice-runtime</code> | 配置键 `to`：为构建、部署、依赖或运行时声明参数。 |
| 18 | <code>    filter:</code> | 配置键 `filter`：为构建、部署、依赖或运行时声明参数。 |
| 19 | <code>      - "**/*"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 20 | <code>      - "!pip-cache/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 21 | <code>      - "!downloads/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 22 | <code>      - "!uv-cache/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 23 | <code>      - "!asr-cache/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 24 | <code>      - "!**/__pycache__/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 25 | <code>      - "!**/*.pyc"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 26 | <code>      - "!**/*.pyo"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 27 | <code>      - "!**/.git/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 28 | <code>      - "!**/.cache/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 29 | <code>      - "!voice-venv.backup*/**"</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 30 | <code>extraMetadata:</code> | 配置键 `extraMetadata`：为构建、部署、依赖或运行时声明参数。 |
| 31 | <code>  main: electron/main.cjs</code> | 配置键 `main`：为构建、部署、依赖或运行时声明参数。 |
| 32 | <code>asar: true</code> | 配置键 `asar`：为构建、部署、依赖或运行时声明参数。 |
| 33 | <code>asarUnpack:</code> | 配置键 `asarUnpack`：为构建、部署、依赖或运行时声明参数。 |
| 34 | <code>  - electron/**/*.cjs</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 35 | <code>  - electron/**/*.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 36 | <code>  - scripts/**/*.cjs</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 37 | <code>  - scripts/**/*.py</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 38 | <code>npmRebuild: false</code> | 配置键 `npmRebuild`：为构建、部署、依赖或运行时声明参数。 |
| 39 | <code>win:</code> | 配置键 `win`：为构建、部署、依赖或运行时声明参数。 |
| 40 | <code>  icon: build/icon.ico</code> | 配置键 `icon`：为构建、部署、依赖或运行时声明参数。 |
| 41 | <code>  executableName: AILIS</code> | 配置键 `executableName`：为构建、部署、依赖或运行时声明参数。 |
| 42 | <code>  signAndEditExecutable: false</code> | 配置键 `signAndEditExecutable`：为构建、部署、依赖或运行时声明参数。 |
| 43 | <code>  target:</code> | 配置键 `target`：为构建、部署、依赖或运行时声明参数。 |
| 44 | <code>    - target: zip</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 45 | <code>      arch:</code> | 配置键 `arch`：为构建、部署、依赖或运行时声明参数。 |
| 46 | <code>        - x64</code> | 配置结构行：建立层级、列表或复合配置值。 |
