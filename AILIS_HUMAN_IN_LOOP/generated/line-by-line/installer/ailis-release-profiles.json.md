# installer/ailis-release-profiles.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`structured-data`
- 原始行数：67
- SHA-256：`f215dcdbf1b3aa28c6d40a036cd7bf44b64f416b582c159273d64cc64049dc56`
- 可运行副本：[打开源文件](../../../source/installer/ailis-release-profiles.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "schemaVersion": 1,</code> | 结构化数据字段 `schemaVersion`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "product": "AILIS",</code> | 结构化数据字段 `product`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "outputRoot": "F:/AILIS/Build/AILIS",</code> | 结构化数据字段 `outputRoot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "profiles": {</code> | 结构化数据字段 `profiles`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    "core": {</code> | 结构化数据字段 `core`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>      "title": "Core lightweight installer",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>      "description": "Build the default lightweight installer and portable package. Runtime components stay optional and are not bundled.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>      "buildFrontend": true,</code> | 结构化数据字段 `buildFrontend`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>      "buildDesktop": true,</code> | 结构化数据字段 `buildDesktop`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>      "builderConfig": "electron-builder.yml",</code> | 结构化数据字段 `builderConfig`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>      "builderTargets": ["--win", "nsis", "portable"],</code> | 结构化数据字段 `builderTargets`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>      "runtimeComponents": [],</code> | 结构化数据字段 `runtimeComponents`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>      "buildRuntimePacks": false,</code> | 结构化数据字段 `buildRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>      "stageRuntimePacks": false,</code> | 结构化数据字段 `stageRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>      "outputSubdir": "core"</code> | 结构化数据字段 `outputSubdir`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 18 | <code>    "runtime-packs": {</code> | 结构化数据字段 `runtime-packs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 19 | <code>      "title": "Runtime packs only",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>      "description": "Build selected optional runtime packs without rebuilding the desktop installer.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 21 | <code>      "buildFrontend": false,</code> | 结构化数据字段 `buildFrontend`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 22 | <code>      "buildDesktop": false,</code> | 结构化数据字段 `buildDesktop`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 23 | <code>      "runtimeComponents": [</code> | 结构化数据字段 `runtimeComponents`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>        "python-runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 25 | <code>        "cosyvoice3-runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 26 | <code>        "asr-runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 27 | <code>        "web-runtime"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 28 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 29 | <code>      "buildRuntimePacks": true,</code> | 结构化数据字段 `buildRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>      "stageRuntimePacks": true,</code> | 结构化数据字段 `stageRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>      "runtimePackSubdir": "",</code> | 结构化数据字段 `runtimePackSubdir`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>      "outputSubdir": "runtime-packs"</code> | 结构化数据字段 `outputSubdir`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 34 | <code>    "with-packs": {</code> | 结构化数据字段 `with-packs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>      "title": "Installer plus sidecar runtime packs",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>      "description": "Build the lightweight installer, then place selected runtime packs next to it under runtime-packs/ for optional offline install.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>      "buildFrontend": true,</code> | 结构化数据字段 `buildFrontend`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>      "buildDesktop": true,</code> | 结构化数据字段 `buildDesktop`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>      "builderConfig": "electron-builder.yml",</code> | 结构化数据字段 `builderConfig`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 40 | <code>      "builderTargets": ["--win", "nsis", "portable"],</code> | 结构化数据字段 `builderTargets`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>      "runtimeComponents": [</code> | 结构化数据字段 `runtimeComponents`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>        "python-runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 43 | <code>        "cosyvoice3-runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 44 | <code>        "asr-runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 45 | <code>        "web-runtime"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 46 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 47 | <code>      "buildRuntimePacks": true,</code> | 结构化数据字段 `buildRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>      "stageRuntimePacks": true,</code> | 结构化数据字段 `stageRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 49 | <code>      "outputSubdir": "with-packs"</code> | 结构化数据字段 `outputSubdir`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 50 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 51 | <code>    "voice-debug": {</code> | 结构化数据字段 `voice-debug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>      "title": "Offline voice debug package",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 53 | <code>      "description": "Build the legacy voice-heavy directory package for internal debugging only. This is not the default public release.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>      "buildFrontend": true,</code> | 结构化数据字段 `buildFrontend`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>      "buildDesktop": true,</code> | 结构化数据字段 `buildDesktop`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>      "builderConfig": "electron-builder.voice.yml",</code> | 结构化数据字段 `builderConfig`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>      "builderTargets": ["--win", "--dir"],</code> | 结构化数据字段 `builderTargets`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 58 | <code>      "runtimeComponents": [</code> | 结构化数据字段 `runtimeComponents`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 59 | <code>        "python-runtime",</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 60 | <code>        "cosyvoice3-runtime"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 61 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 62 | <code>      "buildRuntimePacks": false,</code> | 结构化数据字段 `buildRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 63 | <code>      "stageRuntimePacks": false,</code> | 结构化数据字段 `stageRuntimePacks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 64 | <code>      "outputSubdir": "voice-debug"</code> | 结构化数据字段 `outputSubdir`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 65 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 66 | <code>  }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 67 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
