# installer/ailis-runtime-components.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`structured-data`
- 原始行数：57
- SHA-256：`e8301db9d744416615238fdf1dd11365350b1fcd772819c028575c8e362e8f92`
- 可运行副本：[打开源文件](../../../source/installer/ailis-runtime-components.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "schemaVersion": 1,</code> | 结构化数据字段 `schemaVersion`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "product": "AILIS",</code> | 结构化数据字段 `product`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "installMode": "deferred-runtime-components",</code> | 结构化数据字段 `installMode`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "components": [</code> | 结构化数据字段 `components`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 7 | <code>      "id": "python-runtime",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>      "title": "AILIS private Python runtime",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>      "kind": "runtime",</code> | 结构化数据字段 `kind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>      "optional": true,</code> | 结构化数据字段 `optional`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>      "defaultSelected": false,</code> | 结构化数据字段 `defaultSelected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>      "estimatedUnpackedSize": "50 MB",</code> | 结构化数据字段 `estimatedUnpackedSize`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>      "extractTo": "resources",</code> | 结构化数据字段 `extractTo`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>      "installRoot": "resources/models/voice-runtime/python",</code> | 结构化数据字段 `installRoot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>      "packName": "AILIS-Runtime-python-runtime-${version}.zip",</code> | 结构化数据字段 `packName`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>      "description": "Small private Python base used by local runtime components. This is not enough by itself to enable TTS or ASR."</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 18 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 19 | <code>      "id": "cosyvoice3-runtime",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>      "title": "CosyVoice3 local TTS runtime",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 21 | <code>      "kind": "tts",</code> | 结构化数据字段 `kind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 22 | <code>      "optional": true,</code> | 结构化数据字段 `optional`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 23 | <code>      "defaultSelected": false,</code> | 结构化数据字段 `defaultSelected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>      "dependsOn": ["python-runtime"],</code> | 结构化数据字段 `dependsOn`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 25 | <code>      "estimatedUnpackedSize": "11.7 GB",</code> | 结构化数据字段 `estimatedUnpackedSize`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 26 | <code>      "extractTo": "resources",</code> | 结构化数据字段 `extractTo`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>      "installRoot": "resources/models/voice-runtime",</code> | 结构化数据字段 `installRoot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>      "packName": "AILIS-Runtime-cosyvoice3-runtime-${version}.zip",</code> | 结构化数据字段 `packName`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 29 | <code>      "description": "High-quality offline TTS runtime. Very large because it includes Torch/CUDA dependencies and CosyVoice3 model files."</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 31 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 32 | <code>      "id": "asr-runtime",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>      "title": "Local ASR runtime",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 34 | <code>      "kind": "asr",</code> | 结构化数据字段 `kind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>      "optional": true,</code> | 结构化数据字段 `optional`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>      "defaultSelected": false,</code> | 结构化数据字段 `defaultSelected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>      "dependsOn": ["python-runtime"],</code> | 结构化数据字段 `dependsOn`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>      "estimatedUnpackedSize": "4.8 GB",</code> | 结构化数据字段 `estimatedUnpackedSize`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>      "extractTo": "resources",</code> | 结构化数据字段 `extractTo`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 40 | <code>      "installRoot": "resources/ailis-asr-runtime",</code> | 结构化数据字段 `installRoot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>      "packName": "AILIS-Runtime-asr-runtime-${version}.zip",</code> | 结构化数据字段 `packName`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>      "description": "Offline speech recognition runtime. Users can skip it and use text-only or cloud recognition flows."</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 43 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 44 | <code>    {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 45 | <code>      "id": "web-runtime",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 46 | <code>      "title": "Local Web/Search runtime",</code> | 结构化数据字段 `title`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 47 | <code>      "kind": "web",</code> | 结构化数据字段 `kind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>      "optional": true,</code> | 结构化数据字段 `optional`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 49 | <code>      "defaultSelected": false,</code> | 结构化数据字段 `defaultSelected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 50 | <code>      "estimatedUnpackedSize": "1.4 GB",</code> | 结构化数据字段 `estimatedUnpackedSize`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>      "extractTo": "resources",</code> | 结构化数据字段 `extractTo`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>      "installRoot": "resources/ailis-web-runtime",</code> | 结构化数据字段 `installRoot`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 53 | <code>      "packName": "AILIS-Runtime-web-runtime-${version}.zip",</code> | 结构化数据字段 `packName`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>      "description": "Optional local web/search stack. It should not be bundled into the default installer."</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>    }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 56 | <code>  ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 57 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
