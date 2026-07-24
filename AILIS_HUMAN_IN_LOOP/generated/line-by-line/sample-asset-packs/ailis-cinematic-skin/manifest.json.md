# sample-asset-packs/ailis-cinematic-skin/manifest.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`structured-data`
- 原始行数：21
- SHA-256：`af00a0987c61f05858bf0e4625743b7ef7d2a88ad64b9bd7f382c0c392e95e2e`
- 可运行副本：[打开源文件](../../../../source/sample-asset-packs/ailis-cinematic-skin/manifest.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "schemaVersion": 1,</code> | 结构化数据字段 `schemaVersion`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "id": "ailis.skin.cinematic-wave.v1",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "type": "skin_pack",</code> | 结构化数据字段 `type`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "displayName": "AILIS Cinematic Wave Skin",</code> | 结构化数据字段 `displayName`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>  "version": "1.0.0",</code> | 结构化数据字段 `version`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>  "publisher": "AILIS Local Sample",</code> | 结构化数据字段 `publisher`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>  "description": "A local sample skin pack for validating install, activate, uninstall, and visual style switching in the open-source runtime.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>  "renderProfileId": "ailis_cinematic_rim_toon",</code> | 结构化数据字段 `renderProfileId`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>  "assets": {</code> | 结构化数据字段 `assets`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>    "renderProfile": "assets/render-profile.json",</code> | 结构化数据字段 `renderProfile`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>    "personaStyle": "assets/persona-style.json",</code> | 结构化数据字段 `personaStyle`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>    "voiceProfile": "assets/voice-profile.json"</code> | 结构化数据字段 `voiceProfile`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 15 | <code>  "compatibility": {</code> | 结构化数据字段 `compatibility`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>    "minAilisVersion": "1.0.6",</code> | 结构化数据字段 `minAilisVersion`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>    "runtime": [</code> | 结构化数据字段 `runtime`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>      "desktop"</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 19 | <code>    ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 20 | <code>  }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 21 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
