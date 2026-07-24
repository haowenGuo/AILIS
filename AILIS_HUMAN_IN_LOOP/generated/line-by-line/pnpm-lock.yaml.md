# pnpm-lock.yaml 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：依赖锁定文件：固定可复现安装所需的精确版本与完整性信息。
- 文件类型：`structured-data`
- 原始行数：5777
- SHA-256：`17b0c2ef0daa23b08efcf3e67683d28e52377645da53d3dc41e03112796d3792`
- 可运行副本：[打开源文件](../../source/pnpm-lock.yaml)
- 依赖：`node:util`
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>lockfileVersion: '9.0'</code> | 配置键 `lockfileVersion`：为构建、部署、依赖或运行时声明参数。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>settings:</code> | 配置键 `settings`：为构建、部署、依赖或运行时声明参数。 |
| 4 | <code>  autoInstallPeers: true</code> | 配置键 `autoInstallPeers`：为构建、部署、依赖或运行时声明参数。 |
| 5 | <code>  excludeLinksFromLockfile: false</code> | 配置键 `excludeLinksFromLockfile`：为构建、部署、依赖或运行时声明参数。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>importers:</code> | 配置键 `importers`：为构建、部署、依赖或运行时声明参数。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>  .:</code> | 配置键 `.`：为构建、部署、依赖或运行时声明参数。 |
| 10 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 11 | <code>      '@babel/code-frame':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 12 | <code>        specifier: 7.29.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 13 | <code>        version: 7.29.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 14 | <code>      '@babel/generator':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 15 | <code>        specifier: ^7.29.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 16 | <code>        version: 7.29.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 17 | <code>      '@babel/helper-globals':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 18 | <code>        specifier: 7.28.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 19 | <code>        version: 7.28.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 20 | <code>      '@babel/helper-string-parser':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 21 | <code>        specifier: 7.27.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 22 | <code>        version: 7.27.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 23 | <code>      '@babel/helper-validator-identifier':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 24 | <code>        specifier: 7.28.5</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 25 | <code>        version: 7.28.5</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 26 | <code>      '@babel/parser':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 27 | <code>        specifier: ^7.29.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 28 | <code>        version: 7.29.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 29 | <code>      '@babel/template':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 30 | <code>        specifier: 7.28.6</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 31 | <code>        version: 7.28.6</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 32 | <code>      '@babel/traverse':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 33 | <code>        specifier: ^7.29.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 34 | <code>        version: 7.29.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 35 | <code>      '@babel/types':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 36 | <code>        specifier: ^7.29.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 37 | <code>        version: 7.29.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 38 | <code>      '@jridgewell/gen-mapping':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 39 | <code>        specifier: 0.3.13</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 40 | <code>        version: 0.3.13</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 41 | <code>      '@jridgewell/resolve-uri':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 42 | <code>        specifier: 3.1.2</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 43 | <code>        version: 3.1.2</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 44 | <code>      '@jridgewell/sourcemap-codec':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 45 | <code>        specifier: 1.5.5</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 46 | <code>        version: 1.5.5</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 47 | <code>      '@jridgewell/trace-mapping':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 48 | <code>        specifier: 0.3.31</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 49 | <code>        version: 0.3.31</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 50 | <code>      '@pixiv/three-vrm':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 51 | <code>        specifier: ^3.5.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 52 | <code>        version: 3.5.1(three@0.183.2)</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 53 | <code>      '@pixiv/three-vrm-animation':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 54 | <code>        specifier: ^3.5.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 55 | <code>        version: 3.5.1(three@0.183.2)</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 56 | <code>      '@selderee/plugin-htmlparser2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 57 | <code>        specifier: 0.11.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 58 | <code>        version: 0.11.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 59 | <code>      '@xenova/transformers':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 60 | <code>        specifier: ^2.17.2</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 61 | <code>        version: 2.17.2</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 62 | <code>      bl:</code> | 配置键 `bl`：为构建、部署、依赖或运行时声明参数。 |
| 63 | <code>        specifier: 4.1.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 64 | <code>        version: 4.1.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 65 | <code>      buffer:</code> | 配置键 `buffer`：为构建、部署、依赖或运行时声明参数。 |
| 66 | <code>        specifier: 5.7.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 67 | <code>        version: 5.7.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 68 | <code>      chess.js:</code> | 配置键 `chess.js`：为构建、部署、依赖或运行时声明参数。 |
| 69 | <code>        specifier: 1.4.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 70 | <code>        version: 1.4.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 71 | <code>      chownr:</code> | 配置键 `chownr`：为构建、部署、依赖或运行时声明参数。 |
| 72 | <code>        specifier: 1.1.4</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 73 | <code>        version: 1.1.4</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 74 | <code>      core-util-is:</code> | 配置键 `core-util-is`：为构建、部署、依赖或运行时声明参数。 |
| 75 | <code>        specifier: 1.0.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 76 | <code>        version: 1.0.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 77 | <code>      debug:</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 78 | <code>        specifier: 4.4.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 79 | <code>        version: 4.4.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 80 | <code>      detect-libc:</code> | 配置键 `detect-libc`：为构建、部署、依赖或运行时声明参数。 |
| 81 | <code>        specifier: 2.1.2</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 82 | <code>        version: 2.1.2</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 83 | <code>      end-of-stream:</code> | 配置键 `end-of-stream`：为构建、部署、依赖或运行时声明参数。 |
| 84 | <code>        specifier: 1.4.5</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 85 | <code>        version: 1.4.5</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 86 | <code>      exceljs:</code> | 配置键 `exceljs`：为构建、部署、依赖或运行时声明参数。 |
| 87 | <code>        specifier: ^4.4.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 88 | <code>        version: 4.4.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 89 | <code>      expand-template:</code> | 配置键 `expand-template`：为构建、部署、依赖或运行时声明参数。 |
| 90 | <code>        specifier: 2.0.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 91 | <code>        version: 2.0.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 92 | <code>      fs-constants:</code> | 配置键 `fs-constants`：为构建、部署、依赖或运行时声明参数。 |
| 93 | <code>        specifier: 1.0.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 94 | <code>        version: 1.0.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 95 | <code>      github-from-package:</code> | 配置键 `github-from-package`：为构建、部署、依赖或运行时声明参数。 |
| 96 | <code>        specifier: 0.0.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 97 | <code>        version: 0.0.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 98 | <code>      html-to-text:</code> | 配置键 `html-to-text`：为构建、部署、依赖或运行时声明参数。 |
| 99 | <code>        specifier: 9.0.5</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 100 | <code>        version: 9.0.5</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 101 | <code>      imapflow:</code> | 配置键 `imapflow`：为构建、部署、依赖或运行时声明参数。 |
| 102 | <code>        specifier: ^1.3.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 103 | <code>        version: 1.3.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 104 | <code>      inherits:</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 105 | <code>        specifier: 2.0.4</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 106 | <code>        version: 2.0.4</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 107 | <code>      isarray:</code> | 配置键 `isarray`：为构建、部署、依赖或运行时声明参数。 |
| 108 | <code>        specifier: 1.0.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 109 | <code>        version: 1.0.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 110 | <code>      js-tokens:</code> | 配置键 `js-tokens`：为构建、部署、依赖或运行时声明参数。 |
| 111 | <code>        specifier: 4.0.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 112 | <code>        version: 4.0.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 113 | <code>      jsesc:</code> | 配置键 `jsesc`：为构建、部署、依赖或运行时声明参数。 |
| 114 | <code>        specifier: 3.1.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 115 | <code>        version: 3.1.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 116 | <code>      leac:</code> | 配置键 `leac`：为构建、部署、依赖或运行时声明参数。 |
| 117 | <code>        specifier: 0.6.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 118 | <code>        version: 0.6.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 119 | <code>      mailparser:</code> | 配置键 `mailparser`：为构建、部署、依赖或运行时声明参数。 |
| 120 | <code>        specifier: ^3.9.8</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 121 | <code>        version: 3.9.8</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 122 | <code>      minimist:</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 123 | <code>        specifier: 1.2.8</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 124 | <code>        version: 1.2.8</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 125 | <code>      mkdirp-classic:</code> | 配置键 `mkdirp-classic`：为构建、部署、依赖或运行时声明参数。 |
| 126 | <code>        specifier: 0.5.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 127 | <code>        version: 0.5.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 128 | <code>      ms:</code> | 配置键 `ms`：为构建、部署、依赖或运行时声明参数。 |
| 129 | <code>        specifier: 2.1.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 130 | <code>        version: 2.1.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 131 | <code>      napi-build-utils:</code> | 配置键 `napi-build-utils`：为构建、部署、依赖或运行时声明参数。 |
| 132 | <code>        specifier: 2.0.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 133 | <code>        version: 2.0.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 134 | <code>      node-abi:</code> | 配置键 `node-abi`：为构建、部署、依赖或运行时声明参数。 |
| 135 | <code>        specifier: 3.92.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 136 | <code>        version: 3.92.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 137 | <code>      node-pty:</code> | 配置键 `node-pty`：为构建、部署、依赖或运行时声明参数。 |
| 138 | <code>        specifier: ^1.1.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 139 | <code>        version: 1.1.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 140 | <code>      nodemailer:</code> | 配置键 `nodemailer`：为构建、部署、依赖或运行时声明参数。 |
| 141 | <code>        specifier: ^8.0.7</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 142 | <code>        version: 8.0.7</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 143 | <code>      parseley:</code> | 配置键 `parseley`：为构建、部署、依赖或运行时声明参数。 |
| 144 | <code>        specifier: 0.12.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 145 | <code>        version: 0.12.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 146 | <code>      pdfjs-dist:</code> | 配置键 `pdfjs-dist`：为构建、部署、依赖或运行时声明参数。 |
| 147 | <code>        specifier: 6.0.227</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 148 | <code>        version: 6.0.227</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 149 | <code>      peberminta:</code> | 配置键 `peberminta`：为构建、部署、依赖或运行时声明参数。 |
| 150 | <code>        specifier: 0.9.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 151 | <code>        version: 0.9.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 152 | <code>      picocolors:</code> | 配置键 `picocolors`：为构建、部署、依赖或运行时声明参数。 |
| 153 | <code>        specifier: 1.1.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 154 | <code>        version: 1.1.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 155 | <code>      pinyin-pro:</code> | 配置键 `pinyin-pro`：为构建、部署、依赖或运行时声明参数。 |
| 156 | <code>        specifier: ^3.28.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 157 | <code>        version: 3.28.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 158 | <code>      process-nextick-args:</code> | 配置键 `process-nextick-args`：为构建、部署、依赖或运行时声明参数。 |
| 159 | <code>        specifier: 2.0.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 160 | <code>        version: 2.0.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 161 | <code>      pump:</code> | 配置键 `pump`：为构建、部署、依赖或运行时声明参数。 |
| 162 | <code>        specifier: 3.0.4</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 163 | <code>        version: 3.0.4</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 164 | <code>      rc:</code> | 配置键 `rc`：为构建、部署、依赖或运行时声明参数。 |
| 165 | <code>        specifier: 1.2.8</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 166 | <code>        version: 1.2.8</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 167 | <code>      safe-buffer:</code> | 配置键 `safe-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 168 | <code>        specifier: 5.2.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 169 | <code>        version: 5.2.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 170 | <code>      selderee:</code> | 配置键 `selderee`：为构建、部署、依赖或运行时声明参数。 |
| 171 | <code>        specifier: 0.11.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 172 | <code>        version: 0.11.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 173 | <code>      simple-concat:</code> | 配置键 `simple-concat`：为构建、部署、依赖或运行时声明参数。 |
| 174 | <code>        specifier: 1.0.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 175 | <code>        version: 1.0.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 176 | <code>      simple-get:</code> | 配置键 `simple-get`：为构建、部署、依赖或运行时声明参数。 |
| 177 | <code>        specifier: 4.0.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 178 | <code>        version: 4.0.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 179 | <code>      stockfish:</code> | 配置键 `stockfish`：为构建、部署、依赖或运行时声明参数。 |
| 180 | <code>        specifier: 18.0.8</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 181 | <code>        version: 18.0.8</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 182 | <code>      string_decoder:</code> | 配置键 `string_decoder`：为构建、部署、依赖或运行时声明参数。 |
| 183 | <code>        specifier: 1.3.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 184 | <code>        version: 1.3.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 185 | <code>      tar-fs:</code> | 配置键 `tar-fs`：为构建、部署、依赖或运行时声明参数。 |
| 186 | <code>        specifier: 2.1.4</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 187 | <code>        version: 2.1.4</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 188 | <code>      tar-stream:</code> | 配置键 `tar-stream`：为构建、部署、依赖或运行时声明参数。 |
| 189 | <code>        specifier: 2.2.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 190 | <code>        version: 2.2.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 191 | <code>      three:</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 192 | <code>        specifier: ^0.183.2</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 193 | <code>        version: 0.183.2</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 194 | <code>      tunnel-agent:</code> | 配置键 `tunnel-agent`：为构建、部署、依赖或运行时声明参数。 |
| 195 | <code>        specifier: 0.6.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 196 | <code>        version: 0.6.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 197 | <code>      typescript:</code> | 配置键 `typescript`：为构建、部署、依赖或运行时声明参数。 |
| 198 | <code>        specifier: ^6.0.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 199 | <code>        version: 6.0.3</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 200 | <code>      typescript-language-server:</code> | 配置键 `typescript-language-server`：为构建、部署、依赖或运行时声明参数。 |
| 201 | <code>        specifier: ^5.3.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 202 | <code>        version: 5.3.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 203 | <code>      util-deprecate:</code> | 配置键 `util-deprecate`：为构建、部署、依赖或运行时声明参数。 |
| 204 | <code>        specifier: 1.0.2</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 205 | <code>        version: 1.0.2</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 206 | <code>      vite:</code> | 配置键 `vite`：为构建、部署、依赖或运行时声明参数。 |
| 207 | <code>        specifier: ^8.0.3</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 208 | <code>        version: 8.0.3(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2)(@types/node@24.12.2)(jiti@2.6.1)</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 209 | <code>    devDependencies:</code> | 配置键 `devDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 210 | <code>      '@modelcontextprotocol/server-filesystem':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 211 | <code>        specifier: 2026.1.14</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 212 | <code>        version: 2026.1.14(zod@4.4.3)</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 213 | <code>      concurrently:</code> | 配置键 `concurrently`：为构建、部署、依赖或运行时声明参数。 |
| 214 | <code>        specifier: ^9.2.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 215 | <code>        version: 9.2.1</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 216 | <code>      cross-env:</code> | 配置键 `cross-env`：为构建、部署、依赖或运行时声明参数。 |
| 217 | <code>        specifier: ^10.1.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 218 | <code>        version: 10.1.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 219 | <code>      electron:</code> | 配置键 `electron`：为构建、部署、依赖或运行时声明参数。 |
| 220 | <code>        specifier: ^41.2.0</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 221 | <code>        version: 41.2.0</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 222 | <code>      electron-builder:</code> | 配置键 `electron-builder`：为构建、部署、依赖或运行时声明参数。 |
| 223 | <code>        specifier: ^26.8.1</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 224 | <code>        version: 26.8.1(electron-builder-squirrel-windows@26.8.1)</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 225 | <code>      wait-on:</code> | 配置键 `wait-on`：为构建、部署、依赖或运行时声明参数。 |
| 226 | <code>        specifier: ^9.0.5</code> | 配置键 `specifier`：为构建、部署、依赖或运行时声明参数。 |
| 227 | <code>        version: 9.0.5(debug@4.4.3)</code> | 配置键 `version`：为构建、部署、依赖或运行时声明参数。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>packages:</code> | 配置键 `packages`：为构建、部署、依赖或运行时声明参数。 |
| 230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 231 | <code>  7zip-bin@5.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 232 | <code>    resolution: {integrity: sha512-ukTPVhqG4jNzMro2qA9HSCSSVJN3aN7tlb+hfqYCt3ER0yWroeA2VR38MNrOHLQ/cVj+DaIMad0kFCtWWowh/A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>  '@babel/code-frame@7.29.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 235 | <code>    resolution: {integrity: sha512-9NhCeYjq9+3uxgdtp20LSiJXJvN0FeCtNGpJxuMFZ1Kv3cWUNb6DOhJwUvcVCzKGR66cw4njwM6hrJLqgOwbcw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 236 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>  '@babel/generator@7.29.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 239 | <code>    resolution: {integrity: sha512-qsaF+9Qcm2Qv8SRIMMscAvG4O3lJ0F1GuMo5HR/Bp02LopNgnZBC/EkbevHFeGs4ls/oPz9v+Bsmzbkbe+0dUw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 240 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>  '@babel/helper-globals@7.28.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 243 | <code>    resolution: {integrity: sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 244 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>  '@babel/helper-string-parser@7.27.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 247 | <code>    resolution: {integrity: sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 248 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>  '@babel/helper-validator-identifier@7.28.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 251 | <code>    resolution: {integrity: sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 252 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>  '@babel/parser@7.29.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 255 | <code>    resolution: {integrity: sha512-b3ctpQwp+PROvU/cttc4OYl4MzfJUWy6FZg+PMXfzmt/+39iHVF0sDfqay8TQM3JA2EUOyKcFZt75jWriQijsA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 256 | <code>    engines: {node: '&gt;=6.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 257 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>  '@babel/template@7.28.6':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 260 | <code>    resolution: {integrity: sha512-YA6Ma2KsCdGb+WC6UpBVFJGXL58MDA6oyONbjyF/+5sBgxY/dwkhLogbMT2GXXyU84/IhRw/2D1Os1B/giz+BQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 261 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>  '@babel/traverse@7.29.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 264 | <code>    resolution: {integrity: sha512-4HPiQr0X7+waHfyXPZpWPfWL/J7dcN1mx9gL6WdQVMbPnF3+ZhSMs8tCxN7oHddJE9fhNE7+lxdnlyemKfJRuA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 265 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>  '@babel/types@7.29.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 268 | <code>    resolution: {integrity: sha512-LwdZHpScM4Qz8Xw2iKSzS+cfglZzJGvofQICy7W7v4caru4EaAmyUuO6BGrbyQ2mYV11W0U8j5mBhd14dd3B0A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 269 | <code>    engines: {node: '&gt;=6.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>  '@develar/schema-utils@2.6.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 272 | <code>    resolution: {integrity: sha512-0cp4PsWQ/9avqTVMCtZ+GirikIA36ikvjtHweU4/j8yLtgObI0+JUPhYFScgwlteveGB1rt3Cm8UhN04XayDig==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 273 | <code>    engines: {node: '&gt;= 8.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>  '@electron/asar@3.4.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 276 | <code>    resolution: {integrity: sha512-i4/rNPRS84t0vSRa2HorerGRXWyF4vThfHesw0dmcWHp+cspK743UanA0suA5Q5y8kzY2y6YKrvbIUn69BCAiA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 277 | <code>    engines: {node: '&gt;=10.12.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 278 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>  '@electron/fuses@1.8.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 281 | <code>    resolution: {integrity: sha512-zx0EIq78WlY/lBb1uXlziZmDZI4ubcCXIMJ4uGjXzZW0nS19TjSPeXPAjzzTmKQlJUZm0SbmZhPKP7tuQ1SsEw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 282 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 284 | <code>  '@electron/get@2.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 285 | <code>    resolution: {integrity: sha512-Qkzpg2s9GnVV2I2BjRksUi43U5e6+zaQMcjoJy0C+C5oxaKl+fmckGDQFtRpZpZV0NQekuZZ+tGz7EA9TVnQtQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 286 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>  '@electron/get@3.1.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 289 | <code>    resolution: {integrity: sha512-F+nKc0xW+kVbBRhFzaMgPy3KwmuNTYX1fx6+FxxoSnNgwYX6LD7AKBTWkU0MQ6IBoe7dz069CNkR673sPAgkCQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 290 | <code>    engines: {node: '&gt;=14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>  '@electron/notarize@2.5.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 293 | <code>    resolution: {integrity: sha512-jNT8nwH1f9X5GEITXaQ8IF/KdskvIkOFfB2CvwumsveVidzpSc+mvhhTMdAGSYF3O+Nq49lJ7y+ssODRXu06+A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 294 | <code>    engines: {node: '&gt;= 10.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>  '@electron/osx-sign@1.3.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 297 | <code>    resolution: {integrity: sha512-KZ8mhXvWv2rIEgMbWZ4y33bDHyUKMXnx4M0sTyPNK/vcB81ImdeY9Ggdqy0SWbMDgmbqyQ+phgejh6V3R2QuSg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 298 | <code>    engines: {node: '&gt;=12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 299 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>  '@electron/rebuild@4.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 302 | <code>    resolution: {integrity: sha512-u9vpTHRMkOYCs/1FLiSVAFZ7FbjsXK+bQuzviJZa+lG7BHZl1nz52/IcGvwa3sk80/fc3llutBkbCq10Vh8WQA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 303 | <code>    engines: {node: '&gt;=22.12.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 304 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 306 | <code>  '@electron/universal@2.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 307 | <code>    resolution: {integrity: sha512-Wn9sPYIVFRFl5HmwMJkARCCf7rqK/EurkfQ/rJZ14mHP3iYTjZSIOSVonEAnhWeAXwtw7zOekGRlc6yTtZ0t+g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 308 | <code>    engines: {node: '&gt;=16.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>  '@electron/windows-sign@1.2.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 311 | <code>    resolution: {integrity: sha512-dfZeox66AvdPtb2lD8OsIIQh12Tp0GNCRUDfBHIKGpbmopZto2/A8nSpYYLoedPIHpqkeblZ/k8OV0Gy7PYuyQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 312 | <code>    engines: {node: '&gt;=14.14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 313 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>  '@emnapi/core@1.9.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 316 | <code>    resolution: {integrity: sha512-UC+ZhH3XtczQYfOlu3lNEkdW/p4dsJ1r/bP7H8+rhao3TTTMO1ATq/4DdIi23XuGoFY+Cz0JmCbdVl0hz9jZcA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>  '@emnapi/runtime@1.9.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 319 | <code>    resolution: {integrity: sha512-3U4+MIWHImeyu1wnmVygh5WlgfYDtyf0k8AbLhMFxOipihf6nrWC4syIm/SwEeec0mNSafiiNnMJwbza/Is6Lw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>  '@emnapi/wasi-threads@1.2.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 322 | <code>    resolution: {integrity: sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>  '@epic-web/invariant@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 325 | <code>    resolution: {integrity: sha512-lrTPqgvfFQtR/eY/qkIzp98OGdNJu0m5ji3q/nJI8v3SXkRKEnWiOxMmbvcSoAIzv/cGiuvRy57k4suKQSAdwA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 327 | <code>  '@fast-csv/format@4.3.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 328 | <code>    resolution: {integrity: sha512-8iRn6QF3I8Ak78lNAa+Gdl5MJJBM5vRHivFtMRUWINdevNo00K7OXxS2PshawLKTejVwieIlPmK5YlLu6w4u8A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>  '@fast-csv/parse@4.3.6':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 331 | <code>    resolution: {integrity: sha512-uRsLYksqpbDmWaSmzvJcuApSEe38+6NQZBUsuAyMZKqHxH0g1wcJgsKUvN3WC8tewaqFjBMMGrkHmC+T7k8LvA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>  '@hapi/address@5.1.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 334 | <code>    resolution: {integrity: sha512-A+po2d/dVoY7cYajycYI43ZbYMXukuopIsqCjh5QzsBCipDtdofHntljDlpccMjIfTy6UOkg+5KPriwYch2bXA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 335 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>  '@hapi/formula@3.0.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 338 | <code>    resolution: {integrity: sha512-hY5YPNXzw1He7s0iqkRQi+uMGh383CGdyyIGYtB+W5N3KHPXoqychklvHhKCC9M3Xtv0OCs/IHw+r4dcHtBYWw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 340 | <code>  '@hapi/hoek@11.0.7':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 341 | <code>    resolution: {integrity: sha512-HV5undWkKzcB4RZUusqOpcgxOaq6VOAH7zhhIr2g3G8NF/MlFO75SjOr2NfuSx0Mh40+1FqCkagKLJRykUWoFQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>  '@hapi/pinpoint@2.0.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 344 | <code>    resolution: {integrity: sha512-EKQmr16tM8s16vTT3cA5L0kZZcTMU5DUOZTuvpnY738m+jyP3JIUj+Mm1xc1rsLkGBQ/gVnfKYPwOmPg1tUR4Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 346 | <code>  '@hapi/tlds@1.1.6':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 347 | <code>    resolution: {integrity: sha512-xdi7A/4NZokvV0ewovme3aUO5kQhW9pQ2YD1hRqZGhhSi5rBv4usHYidVocXSi9eihYsznZxLtAiEYYUL6VBGw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 348 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>  '@hapi/topo@6.0.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 351 | <code>    resolution: {integrity: sha512-KR3rD5inZbGMrHmgPxsJ9dbi6zEK+C3ZwUwTa+eMwWLz7oijWUTWD2pMSNNYJAU6Qq+65NkxXjqHr/7LM2Xkqg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>  '@hono/node-server@1.19.14':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 354 | <code>    resolution: {integrity: sha512-GwtvgtXxnWsucXvbQXkRgqksiH2Qed37H9xHZocE5sA3N8O8O8/8FA3uclQXxXVzc9XBZuEOMK7+r02FmSpHtw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 355 | <code>    engines: {node: '&gt;=18.14.1'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 356 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 357 | <code>      hono: ^4</code> | 配置键 `hono`：为构建、部署、依赖或运行时声明参数。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>  '@huggingface/jinja@0.2.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 360 | <code>    resolution: {integrity: sha512-/KPde26khDUIPkTGU82jdtTW9UAuvUTumCAbFs/7giR0SxsvZC4hru51PBvpijH6BVkHcROcvZM/lpy5h1jRRA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 361 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>  '@isaacs/cliui@8.0.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 364 | <code>    resolution: {integrity: sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 365 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 367 | <code>  '@isaacs/fs-minipass@4.0.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 368 | <code>    resolution: {integrity: sha512-wgm9Ehl2jpeqP3zw/7mo3kRHFp5MEDhqAdwy1fTGkHAwnkGOVsgpvQhL8B5n1qlb01jV3n/bI0ZfZp5lWA1k4w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 369 | <code>    engines: {node: '&gt;=18.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 371 | <code>  '@jridgewell/gen-mapping@0.3.13':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 372 | <code>    resolution: {integrity: sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>  '@jridgewell/resolve-uri@3.1.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 375 | <code>    resolution: {integrity: sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 376 | <code>    engines: {node: '&gt;=6.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>  '@jridgewell/sourcemap-codec@1.5.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 379 | <code>    resolution: {integrity: sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>  '@jridgewell/trace-mapping@0.3.31':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 382 | <code>    resolution: {integrity: sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>  '@malept/cross-spawn-promise@2.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 385 | <code>    resolution: {integrity: sha512-1DpKU0Z5ThltBwjNySMC14g0CkbyhCaz9FkhxqNsZI6uAPJXFS8cMXlBKo26FJ8ZuW6S9GCMcR9IO5k2X5/9Fg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 386 | <code>    engines: {node: '&gt;= 12.13.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>  '@malept/flatpak-bundler@0.4.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 389 | <code>    resolution: {integrity: sha512-9QOtNffcOF/c1seMCDnjckb3R9WHcG34tky+FHpNKKCW0wc/scYLwMtO+ptyGUfMW0/b/n4qRiALlaFHc9Oj7Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 390 | <code>    engines: {node: '&gt;= 10.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 392 | <code>  '@modelcontextprotocol/sdk@1.29.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 393 | <code>    resolution: {integrity: sha512-zo37mZA9hJWpULgkRpowewez1y6ML5GsXJPY8FI0tBBCd77HEvza4jDqRKOXgHNn867PVGCyTdzqpz0izu5ZjQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 394 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 395 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 396 | <code>      '@cfworker/json-schema': ^4.1.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 397 | <code>      zod: ^3.25 &#124;&#124; ^4.0</code> | 配置键 `zod`：为构建、部署、依赖或运行时声明参数。 |
| 398 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 399 | <code>      '@cfworker/json-schema':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 400 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>  '@modelcontextprotocol/server-filesystem@2026.1.14':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 403 | <code>    resolution: {integrity: sha512-bGAfu3fWRVeF10NxvPhFBDlRen6ExSx6YkKJzoVgQMNrbdVVV4okfGGQ3KBRu9ygXYfw5/N9ermHAJXA0uys+g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 404 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>  '@napi-rs/canvas-android-arm64@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 407 | <code>    resolution: {integrity: sha512-3hNKJObUK7JsCF9aJlVCs1J0/KE/gGfZNeK8MO1ge6bB3aicr5walGme9t9No1f/oyk9GgvdAT/rjSdsx3gbIw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 408 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 409 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 410 | <code>    os: [android]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>  '@napi-rs/canvas-darwin-arm64@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 413 | <code>    resolution: {integrity: sha512-ZIja19/BiGz2puhki+WUYSRriwFeFJ8Mi9eK3hZdSS85w4Y60cuEAJVhMCfKwswQkKkUtrnzdKMBuO7TupvexA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 414 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 415 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 416 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>  '@napi-rs/canvas-darwin-x64@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 419 | <code>    resolution: {integrity: sha512-hImggWc82jqZVpEsFR9S7PE9OQYjq/H/D7vwCGB6X1jRH+UVBP1+1niJTPBOat1B154T6GKK7/kcFtoWgjgFzQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 420 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 421 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 422 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>  '@napi-rs/canvas-linux-arm-gnueabihf@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 425 | <code>    resolution: {integrity: sha512-hlJRy6d+kWLKVOG/+1rEvNQVURZ0DxxRPJsLmEWwhwiXZUJc0BF5o9esALHSEP4CoJK4wChRtj3hnyBgVx2oWA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 426 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 427 | <code>    cpu: [arm]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 428 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>  '@napi-rs/canvas-linux-arm64-gnu@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 431 | <code>    resolution: {integrity: sha512-5Hru4T3RXkosRQafcjelv7AUzw9mXqmGYsxnzeDDOWveFCJyEPMSJltvGCM+jfH98seOCbfwm9KyFg6Jm5FhAA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 432 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 433 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 434 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 435 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 437 | <code>  '@napi-rs/canvas-linux-arm64-musl@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 438 | <code>    resolution: {integrity: sha512-LTUl9jS8WsLSUGaxQZKQkxfluOJRpgvBuxxdM4pYcjib+di8AU4OzQc6+L6SzGMLcKc9H0RAjojRatBhTMqYdg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 439 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 440 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 441 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 442 | <code>    libc: [musl]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 443 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 444 | <code>  '@napi-rs/canvas-linux-riscv64-gnu@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 445 | <code>    resolution: {integrity: sha512-Iz931SAZf+WVDzpjk52Q3ffW3zw0YflFwEZMgs036Wfu1kX/LrwT9wGjsuSqyduqefUkl91/vTdAjn8hQu5ezA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 446 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 447 | <code>    cpu: [riscv64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 448 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 449 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>  '@napi-rs/canvas-linux-x64-gnu@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 452 | <code>    resolution: {integrity: sha512-pFEQ5eFK4JusgN1K6KkO9DKP/Hi1WMJOkF8Ch03/khTc4bFbCKkCCsJG4YcOMOW9bI4XbT2/eMAWxhO0xaWgPA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 453 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 454 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 455 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 456 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 458 | <code>  '@napi-rs/canvas-linux-x64-musl@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 459 | <code>    resolution: {integrity: sha512-jnvr8NrLHiZ3NCiOKWqDbkI4Ah+QDrqtZ+sddPZBltEb1mQ2coSvCSJYfict+oAwcm0c970oTmVySpjKP/lnaA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 460 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 461 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 462 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 463 | <code>    libc: [musl]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>  '@napi-rs/canvas-win32-arm64-msvc@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 466 | <code>    resolution: {integrity: sha512-y2j9/Gfd5joqiqxdP/L1smqjQ+uAx3C4N0EC7bDHrnZEEH8ToM/OC5p3uHvtj4Lq591aHj+ArL01UDLNwT5HgQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 467 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 468 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 469 | <code>    os: [win32]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 471 | <code>  '@napi-rs/canvas-win32-x64-msvc@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 472 | <code>    resolution: {integrity: sha512-qwdhh9N6Gge/hC4pL9S1tQp0iKwhSl/dYjg7+RGp9k26iRGRi5MqqUyKGOXIWli0zOcuy5Y2wIH/jk2ry6i/jA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 473 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 474 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 475 | <code>    os: [win32]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>  '@napi-rs/canvas@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 478 | <code>    resolution: {integrity: sha512-Jqxcy1XOIqj+lH9sl1GT+il6GR3uQv13vI2mrwubP3uT8Olak2ClDrK2RnxlQKjwv8BRr4b3ug0YR7c6hBX8wg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 479 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>  '@napi-rs/wasm-runtime@1.1.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 482 | <code>    resolution: {integrity: sha512-sNXv5oLJ7ob93xkZ1XnxisYhGYXfaG9f65/ZgYuAu3qt7b3NadcOEhLvx28hv31PgX8SZJRYrAIPQilQmFpLVw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 483 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 484 | <code>      '@emnapi/core': ^1.7.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 485 | <code>      '@emnapi/runtime': ^1.7.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 486 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 487 | <code>  '@npmcli/agent@3.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 488 | <code>    resolution: {integrity: sha512-S79NdEgDQd/NGCay6TCoVzXSj74skRZIKJcpJjC5lOq34SZzyI6MqtiiWoiVWoVrTcGjNeC4ipbh1VIHlpfF5Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 489 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 491 | <code>  '@npmcli/fs@4.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 492 | <code>    resolution: {integrity: sha512-/xGlezI6xfGO9NwuJlnwz/K14qD1kCSAGtacBHnGzeAIuJGazcp45KP5NuyARXoKb7cwulAGWVsbeSxdG/cb0Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 493 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 494 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 495 | <code>  '@oxc-project/types@0.122.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 496 | <code>    resolution: {integrity: sha512-oLAl5kBpV4w69UtFZ9xqcmTi+GENWOcPF7FCrczTiBbmC0ibXxCwyvZGbO39rCVEuLGAZM84DH0pUIyyv/YJzA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 498 | <code>  '@pinojs/redact@0.4.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 499 | <code>    resolution: {integrity: sha512-k2ENnmBugE/rzQfEcdWHcCY+/FM3VLzH9cYEsbdsoqrvzAKRhUZeRNhAZvB8OitQJ1TBed3yqWtdjzS6wJKBwg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 501 | <code>  '@pixiv/three-vrm-animation@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 502 | <code>    resolution: {integrity: sha512-zPfkktP6jOt1d5qPjx7WDwE1U7v95JUo/S0nzBB3AIWmhGPnjrnZ/63MHgZPpiI3Kj3kODXE4HYNkHOIo3mRAQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 503 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 504 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>  '@pixiv/three-vrm-core@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 507 | <code>    resolution: {integrity: sha512-uKT9wBXHzE6U3sABdKwNnLOj28akQPGF8+P1EGdEb/j3Fcmn2qmFwUq7rbKwKJP8WGAHp++N1LJn3r+xVjyLBA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 508 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 509 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 511 | <code>  '@pixiv/three-vrm-materials-hdr-emissive-multiplier@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 512 | <code>    resolution: {integrity: sha512-BlKRo9Oa8fdVakXGptjTfBG+JpTlDWKEipBF+yQ2v9Vo13rIJXcNCv3HgpbxFDJh+BssKC5WH0Tuw0BE2UPLwg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 513 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 514 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>  '@pixiv/three-vrm-materials-mtoon@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 517 | <code>    resolution: {integrity: sha512-6zrSDsdiQRtzU0/ZUbRuLnjaqfhFmivQ2OBwpJgtjXuHjCZVcsR8GmiDk+0/6OFlaWymux/CpPidLKN9DWr0Mw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 518 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 519 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>  '@pixiv/three-vrm-materials-v0compat@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 522 | <code>    resolution: {integrity: sha512-pVzEQDDaKIwJ0DBtHl+Q9wr2FtkxauEkmsw9jt1ZoSk7QxI1vkhCAbWUXAS6XT5ttZ4izbhfNd9Brn4f5Kigxg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 523 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 524 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 525 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 526 | <code>  '@pixiv/three-vrm-node-constraint@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 527 | <code>    resolution: {integrity: sha512-Bywh9IpfEUbQxFijiksNZUOaAodLhgvlD5nZjsNwx6uOxYPfSYYJkxjLA3+wxwt6rT7bS41FEUBMBYAmdsXHkg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 528 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 529 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 530 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 531 | <code>  '@pixiv/three-vrm-springbone@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 532 | <code>    resolution: {integrity: sha512-ylsukk+2o9t06vMEiOqE1443FDQYpozbov375SE8phgCDqfmPe9YEEvAX3md0cCCqOfqMWuXdxzU8avWXXynTw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 533 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 534 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>  '@pixiv/three-vrm@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 537 | <code>    resolution: {integrity: sha512-B2u0uCi2SHO83ycrgOJVDbtgLtQpgWbDdHRQ4SCeu+CZ0Dh1If5RDM2oUIbMA0j/6o93T385iSj4FHn/7ZvdCg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 538 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 539 | <code>      three: '&gt;=0.137'</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 541 | <code>  '@pixiv/types-vrm-0.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 542 | <code>    resolution: {integrity: sha512-97XgNpLw0v6YPVqzTALIjPftyOZnkK8Rd4QWwlI5RVo96DASSTrPpdMw1HAwwcDEGHj35ru9Cxar97eUltkJug==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 543 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 544 | <code>  '@pixiv/types-vrmc-materials-hdr-emissive-multiplier-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 545 | <code>    resolution: {integrity: sha512-/kZpjn3yDIH5+BlZz6VkCd7694Pz9kFTc/ImfTKQ/MNfXtmLU7zlhVZ55U/E/9kkSyzJ6ocmLgO9FnMRqZ2YBQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>  '@pixiv/types-vrmc-materials-mtoon-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 548 | <code>    resolution: {integrity: sha512-8IfN65S4qB+8vNMcsJHcjUAlSalR+T+QY5QZY3JU33/AnLQLJtnMzaRIAbwZyhrzOiIfK0b8eJnjHBYxV2Bteg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 550 | <code>  '@pixiv/types-vrmc-node-constraint-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 551 | <code>    resolution: {integrity: sha512-oeYhK42AhWCkJGiheY0vGHQkU7ayetI8fk93cU4vOAJUSW5Ric+36KtWAVOgp8Ja5o/RS2cu40Biuma6DZ0H7g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 552 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 553 | <code>  '@pixiv/types-vrmc-springbone-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 554 | <code>    resolution: {integrity: sha512-3563cYQ5tjdc0g8tj+hP206z/nKR3uGhoFh2t/r6yCOI6q3SPgSIEkHG8mZu1boegRfPj4fPbXbntQFeqJxECw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>  '@pixiv/types-vrmc-springbone-extended-collider-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 557 | <code>    resolution: {integrity: sha512-Q975/y/3zEKPggYC3E/6uG/RVTt+2k1GpRfR6ngJ9NHM5rzlSab4yDCSx3qePjHpHIJvS9847LK9HPUrG7f3Og==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>  '@pixiv/types-vrmc-vrm-1.0@2.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 560 | <code>    resolution: {integrity: sha512-RMP34Bk1qLFQv/CRB1Zqvn2qMFfWQfP2Hms5QrrfoBsW9XroZdEe0zPLNbGmUPYh4F7VtBb+B7+RCuymRtpehA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>  '@pixiv/types-vrmc-vrm-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 563 | <code>    resolution: {integrity: sha512-Ugf8Kv5SSORVf8i+P4i5O2iuMuyzKW6ZRvntWuGXFN6YO7Zx38Vn8zbGKtWTs+zR9dfHWdZixjWcW71Vy4NyVw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 565 | <code>  '@pixiv/types-vrmc-vrm-animation-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 566 | <code>    resolution: {integrity: sha512-q5UqefIbJmxQg5fVDSQGe2p/zsD7OmhBLSxPseXohj17O7Ew/5gVKyDCFjh7XpGZtpX6Ydmpd2svSI9QACfyaw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>  '@pkgjs/parseargs@0.11.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 569 | <code>    resolution: {integrity: sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 570 | <code>    engines: {node: '&gt;=14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>  '@protobufjs/aspromise@1.1.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 573 | <code>    resolution: {integrity: sha512-j+gKExEuLmKwvz3OgROXtrJ2UG2x8Ch2YZUxahh+s1F2HZ+wAceUNLkvy6zKCPVRkU++ZWQrdxsUeQXmcg4uoQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>  '@protobufjs/base64@1.1.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 576 | <code>    resolution: {integrity: sha512-AZkcAA5vnN/v4PDqKyMR5lx7hZttPDgClv83E//FMNhR2TMcLUhfRUBHCmSl0oi9zMgDDqRUJkSxO3wm85+XLg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 577 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 578 | <code>  '@protobufjs/codegen@2.0.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 579 | <code>    resolution: {integrity: sha512-zgXFLzW3Ap33e6d0Wlj4MGIm6Ce8O89n/apUaGNB/jx+hw+ruWEp7EwGUshdLKVRCxZW12fp9r40E1mQrf/34g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 581 | <code>  '@protobufjs/eventemitter@1.1.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 582 | <code>    resolution: {integrity: sha512-vW1GmwMZNnL+gMRaovlh9yZX74kc+TTU3FObkkurpMaRtBfLP3ldjS9KQWlwZgraRE0+dheEEoAxdzcJQ8eXZg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 583 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 584 | <code>  '@protobufjs/fetch@1.1.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 585 | <code>    resolution: {integrity: sha512-GpptLrs57adMSuHi3VNj0mAF8dwh36LMaYF6XyJ6JMWlVsc+t42tm1HSEDmOs3A8fC9yyeisgLhsTVQokOZ0zw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>  '@protobufjs/float@1.0.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 588 | <code>    resolution: {integrity: sha512-Ddb+kVXlXst9d+R9PfTIxh1EdNkgoRe5tOX6t01f1lYWOvJnSPDBlG241QLzcyPdoNTsblLUdujGSE4RzrTZGQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 589 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 590 | <code>  '@protobufjs/inquire@1.1.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 591 | <code>    resolution: {integrity: sha512-pa0vFRuws4wkvaXKK1uXZMAwAX4/t8ANaJo45iw/oQHNQ9q5xUzwgFmVJGXiga2BeN+zpX7Vf9vmsiIa2J+MUw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>  '@protobufjs/path@1.1.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 594 | <code>    resolution: {integrity: sha512-6JOcJ5Tm08dOHAbdR3GrvP+yUUfkjG5ePsHYczMFLq3ZmMkAD98cDgcT2iA1lJ9NVwFd4tH/iSSoe44YWkltEA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>  '@protobufjs/pool@1.1.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 597 | <code>    resolution: {integrity: sha512-0kELaGSIDBKvcgS4zkjz1PeddatrjYcmMWOlAuAPwAeccUrPHdUqo/J6LiymHHEiJT5NrF1UVwxY14f+fy4WQw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>  '@protobufjs/utf8@1.1.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 600 | <code>    resolution: {integrity: sha512-oOAWABowe8EAbMyWKM0tYDKi8Yaox52D+HWZhAIJqQXbqe0xI/GV7FhLWqlEKreMkfDjshR5FKgi3mnle0h6Eg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 602 | <code>  '@rolldown/binding-android-arm64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 603 | <code>    resolution: {integrity: sha512-pv1y2Fv0JybcykuiiD3qBOBdz6RteYojRFY1d+b95WVuzx211CRh+ytI/+9iVyWQ6koTh5dawe4S/yRfOFjgaA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 604 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 605 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 606 | <code>    os: [android]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>  '@rolldown/binding-darwin-arm64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 609 | <code>    resolution: {integrity: sha512-cFYr6zTG/3PXXF3pUO+umXxt1wkRK/0AYT8lDwuqvRC+LuKYWSAQAQZjCWDQpAH172ZV6ieYrNnFzVVcnSflAg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 610 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 611 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 612 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 613 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 614 | <code>  '@rolldown/binding-darwin-x64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 615 | <code>    resolution: {integrity: sha512-ZCsYknnHzeXYps0lGBz8JrF37GpE9bFVefrlmDrAQhOEi4IOIlcoU1+FwHEtyXGx2VkYAvhu7dyBf75EJQffBw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 616 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 617 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 618 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 620 | <code>  '@rolldown/binding-freebsd-x64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 621 | <code>    resolution: {integrity: sha512-dMLeprcVsyJsKolRXyoTH3NL6qtsT0Y2xeuEA8WQJquWFXkEC4bcu1rLZZSnZRMtAqwtrF/Ib9Ddtpa/Gkge9Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 622 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 623 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 624 | <code>    os: [freebsd]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 626 | <code>  '@rolldown/binding-linux-arm-gnueabihf@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 627 | <code>    resolution: {integrity: sha512-YqWjAgGC/9M1lz3GR1r1rP79nMgo3mQiiA+Hfo+pvKFK1fAJ1bCi0ZQVh8noOqNacuY1qIcfyVfP6HoyBRZ85Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 628 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 629 | <code>    cpu: [arm]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 630 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 631 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 632 | <code>  '@rolldown/binding-linux-arm64-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 633 | <code>    resolution: {integrity: sha512-/I5AS4cIroLpslsmzXfwbe5OmWvSsrFuEw3mwvbQ1kDxJ822hFHIx+vsN/TAzNVyepI/j/GSzrtCIwQPeKCLIg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 634 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 635 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 636 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 637 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>  '@rolldown/binding-linux-arm64-musl@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 640 | <code>    resolution: {integrity: sha512-V6/wZztnBqlx5hJQqNWwFdxIKN0m38p8Jas+VoSfgH54HSj9tKTt1dZvG6JRHcjh6D7TvrJPWFGaY9UBVOaWPw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 641 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 642 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 643 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 644 | <code>    libc: [musl]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>  '@rolldown/binding-linux-ppc64-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 647 | <code>    resolution: {integrity: sha512-AP3E9BpcUYliZCxa3w5Kwj9OtEVDYK6sVoUzy4vTOJsjPOgdaJZKFmN4oOlX0Wp0RPV2ETfmIra9x1xuayFB7g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 648 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 649 | <code>    cpu: [ppc64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 650 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 651 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>  '@rolldown/binding-linux-s390x-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 654 | <code>    resolution: {integrity: sha512-nWwpvUSPkoFmZo0kQazZYOrT7J5DGOJ/+QHHzjvNlooDZED8oH82Yg67HvehPPLAg5fUff7TfWFHQS8IV1n3og==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 655 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 656 | <code>    cpu: [s390x]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 657 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 658 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 660 | <code>  '@rolldown/binding-linux-x64-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 661 | <code>    resolution: {integrity: sha512-RNrafz5bcwRy+O9e6P8Z/OCAJW/A+qtBczIqVYwTs14pf4iV1/+eKEjdOUta93q2TsT/FI0XYDP3TCky38LMAg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 662 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 663 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 664 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 665 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 667 | <code>  '@rolldown/binding-linux-x64-musl@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 668 | <code>    resolution: {integrity: sha512-Jpw/0iwoKWx3LJ2rc1yjFrj+T7iHZn2JDg1Yny1ma0luviFS4mhAIcd1LFNxK3EYu3DHWCps0ydXQ5i/rrJ2ig==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 669 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 670 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 671 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 672 | <code>    libc: [musl]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>  '@rolldown/binding-openharmony-arm64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 675 | <code>    resolution: {integrity: sha512-vRugONE4yMfVn0+7lUKdKvN4D5YusEiPilaoO2sgUWpCvrncvWgPMzK00ZFFJuiPgLwgFNP5eSiUlv2tfc+lpA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 676 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 677 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 678 | <code>    os: [openharmony]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 680 | <code>  '@rolldown/binding-wasm32-wasi@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 681 | <code>    resolution: {integrity: sha512-ykGiLr/6kkiHc0XnBfmFJuCjr5ZYKKofkx+chJWDjitX+KsJuAmrzWhwyOMSHzPhzOHOy7u9HlFoa5MoAOJ/Zg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 682 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 683 | <code>    cpu: [wasm32]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>  '@rolldown/binding-win32-arm64-msvc@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 686 | <code>    resolution: {integrity: sha512-5eOND4duWkwx1AzCxadcOrNeighiLwMInEADT0YM7xeEOOFcovWZCq8dadXgcRHSf3Ulh1kFo/qvzoFiCLOL1Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 687 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 688 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 689 | <code>    os: [win32]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 690 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 691 | <code>  '@rolldown/binding-win32-x64-msvc@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 692 | <code>    resolution: {integrity: sha512-PyqoipaswDLAZtot351MLhrlrh6lcZPo2LSYE+VDxbVk24LVKAGOuE4hb8xZQmrPAuEtTZW8E6D2zc5EUZX4Lw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 693 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 694 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 695 | <code>    os: [win32]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 696 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 697 | <code>  '@rolldown/pluginutils@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 698 | <code>    resolution: {integrity: sha512-HHMwmarRKvoFsJorqYlFeFRzXZqCt2ETQlEDOb9aqssrnVBB1/+xgTGtuTrIk5vzLNX1MjMtTf7W9z3tsSbrxw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>  '@selderee/plugin-htmlparser2@0.11.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 701 | <code>    resolution: {integrity: sha512-P33hHGdldxGabLFjPPpaTxVolMrzrcegejx+0GxjrIb9Zv48D8yAIA/QTDR2dFl7Uz7urX8aX6+5bCZslr+gWQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 703 | <code>  '@sindresorhus/is@4.6.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 704 | <code>    resolution: {integrity: sha512-t09vSN3MdfsyCHoFcTRCH/iUtG7OJ0CsjzB8cjAmKc/va/kIgeDI/TxsigdncE/4be734m0cvIYwNaV4i2XqAw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 705 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 707 | <code>  '@standard-schema/spec@1.1.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 708 | <code>    resolution: {integrity: sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>  '@szmarczak/http-timer@4.0.6':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 711 | <code>    resolution: {integrity: sha512-4BAffykYOgO+5nzBWYwE3W90sBgLJoUPRWWcL8wlyiM8IB8ipJz3UMJ9KXQd1RKQXpKp8Tutn80HZtWsu2u76w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 712 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 713 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 714 | <code>  '@tybys/wasm-util@0.10.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 715 | <code>    resolution: {integrity: sha512-9tTaPJLSiejZKx+Bmog4uSubteqTvFrVrURwkmHixBo0G4seD0zUxp98E1DzUBJxLQ3NPwXrGKDiVjwx/DpPsg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 717 | <code>  '@types/cacheable-request@6.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 718 | <code>    resolution: {integrity: sha512-IQ3EbTzGxIigb1I3qPZc1rWJnH0BmSKv5QYTalEwweFvyBDLSAe24zP0le/hyi7ecGfZVlIVAg4BZqb8WBwKqw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 720 | <code>  '@types/debug@4.1.13':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 721 | <code>    resolution: {integrity: sha512-KSVgmQmzMwPlmtljOomayoR89W4FynCAi3E8PPs7vmDVPe84hT+vGPKkJfThkmXs0x0jAaa9U8uW8bbfyS2fWw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 722 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 723 | <code>  '@types/fs-extra@9.0.13':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 724 | <code>    resolution: {integrity: sha512-nEnwB++1u5lVDM2UI4c1+5R+FYaKfaAzS4OococimjVm3nQw3TuzH5UNsocrcTBbhnerblyHj4A49qXbIiZdpA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 726 | <code>  '@types/http-cache-semantics@4.2.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 727 | <code>    resolution: {integrity: sha512-L3LgimLHXtGkWikKnsPg0/VFx9OGZaC+eN1u4r+OB1XRqH3meBIAVC2zr1WdMH+RHmnRkqliQAOHNJ/E0j/e0Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 728 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 729 | <code>  '@types/keyv@3.1.4':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 730 | <code>    resolution: {integrity: sha512-BQ5aZNSCpj7D6K2ksrRCTmKRLEpnPvWDiLPfoGyhZ++8YtiK9d/3DBKPJgry359X/P1PfruyYwvnvwFjuEiEIg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 732 | <code>  '@types/long@4.0.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 733 | <code>    resolution: {integrity: sha512-MqTGEo5bj5t157U6fA/BiDynNkn0YknVdh48CMPkTSpFTVmvao5UQmm7uEF6xBEo7qIMAlY/JSleYaE6VOdpaA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>  '@types/ms@2.1.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 736 | <code>    resolution: {integrity: sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 737 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 738 | <code>  '@types/node@14.18.63':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 739 | <code>    resolution: {integrity: sha512-fAtCfv4jJg+ExtXhvCkCqUKZ+4ok/JQk01qDKhL5BDDoS3AxKXhV5/MAVUZyQnSEd2GT92fkgZl0pz0Q0AzcIQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 741 | <code>  '@types/node@24.12.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 742 | <code>    resolution: {integrity: sha512-A1sre26ke7HDIuY/M23nd9gfB+nrmhtYyMINbjI1zHJxYteKR6qSMX56FsmjMcDb3SMcjJg5BiRRgOCC/yBD0g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 743 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 744 | <code>  '@types/plist@3.0.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 745 | <code>    resolution: {integrity: sha512-E6OCaRmAe4WDmWNsL/9RMqdkkzDCY1etutkflWk4c+AcjDU07Pcz1fQwTX0TQz+Pxqn9i4L1TU3UFpjnrcDgxA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 746 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 747 | <code>  '@types/responselike@1.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 748 | <code>    resolution: {integrity: sha512-H/+L+UkTV33uf49PH5pCAUBVPNj2nDBXTN+qS1dOwyyg24l3CcicicCA7ca+HMvJBZcFgl5r8e+RR6elsb4Lyw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>  '@types/verror@1.10.11':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 751 | <code>    resolution: {integrity: sha512-RlDm9K7+o5stv0Co8i8ZRGxDbrTxhJtgjqjFyVh/tXQyl/rYtTKlnTvZ88oSTeYREWurwx20Js4kTuKCsFkUtg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 753 | <code>  '@types/yauzl@2.10.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 754 | <code>    resolution: {integrity: sha512-oJoftv0LSuaDZE3Le4DbKX+KS9G36NzOeSap90UIK0yMA/NhKJhqlSGtNDORNRaIbQfzjXDrQa0ytJ6mNRGz/Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 755 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 756 | <code>  '@xenova/transformers@2.17.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 757 | <code>    resolution: {integrity: sha512-lZmHqzrVIkSvZdKZEx7IYY51TK0WDrC8eR0c5IMnBsO8di8are1zzw8BlLhyO2TklZKLN5UffNGs1IJwT6oOqQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>  '@xmldom/xmldom@0.8.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 760 | <code>    resolution: {integrity: sha512-9k/gHF6n/pAi/9tqr3m3aqkuiNosYTurLLUtc7xQ9sxB/wm7WPygCv8GYa6mS0fLJEHhqMC1ATYhz++U/lRHqg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 761 | <code>    engines: {node: '&gt;=10.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 763 | <code>  '@zone-eu/mailsplit@5.4.8':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 764 | <code>    resolution: {integrity: sha512-eEyACj4JZ7sjzRvy26QhLgKEMWwQbsw1+QZnlLX+/gihcNH07lVPOcnwf5U6UAL7gkc//J3jVd76o/WS+taUiA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 766 | <code>  '@zone-eu/mailsplit@5.4.9':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 767 | <code>    resolution: {integrity: sha512-Qq7k6FzA5SmGf5HFPcr17gE7M+O1gttlmWn7tlGUlhGsbbjUaBL/4cEWIwExeCzqu5+kyZJ91mcBZbQ9zEwwYA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>  abbrev@3.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 770 | <code>    resolution: {integrity: sha512-AO2ac6pjRB3SJmGJo+v5/aK6Omggp6fsLrs6wN9bd35ulu4cCwaAU9+7ZhXjeqHVkaHThLuzH0nZr0YpCDhygg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 771 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 773 | <code>  accepts@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 774 | <code>    resolution: {integrity: sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 775 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 777 | <code>  agent-base@7.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 778 | <code>    resolution: {integrity: sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 779 | <code>    engines: {node: '&gt;= 14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>  ajv-formats@3.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 782 | <code>    resolution: {integrity: sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 783 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 784 | <code>      ajv: ^8.0.0</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 785 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 786 | <code>      ajv:</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 787 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 789 | <code>  ajv-keywords@3.5.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 790 | <code>    resolution: {integrity: sha512-5p6WTN0DdTGVQk6VjcEju19IgaHudalcfabD7yhDGeA6bcQnmL+CpveLJq/3hvfwd1aof6L386Ougkx6RfyMIQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 791 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 792 | <code>      ajv: ^6.9.1</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>  ajv@6.14.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 795 | <code>    resolution: {integrity: sha512-IWrosm/yrn43eiKqkfkHis7QioDleaXQHdDVPKg0FSwwd/DuvyX79TZnFOnYpB7dcsFAMmtFztZuXPDvSePkFw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 796 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 797 | <code>  ajv@8.20.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 798 | <code>    resolution: {integrity: sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 800 | <code>  ansi-regex@5.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 801 | <code>    resolution: {integrity: sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 802 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 803 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 804 | <code>  ansi-regex@6.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 805 | <code>    resolution: {integrity: sha512-Bq3SmSpyFHaWjPk8If9yc6svM8c56dB5BAtW4Qbw5jHTwwXXcTLoRMkpDJp6VL0XzlWaCHTXrkFURMYmD0sLqg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 806 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 808 | <code>  ansi-styles@4.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 809 | <code>    resolution: {integrity: sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 810 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 811 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 812 | <code>  ansi-styles@6.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 813 | <code>    resolution: {integrity: sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 814 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 816 | <code>  app-builder-bin@5.0.0-alpha.12:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 817 | <code>    resolution: {integrity: sha512-j87o0j6LqPL3QRr8yid6c+Tt5gC7xNfYo6uQIQkorAC6MpeayVMZrEDzKmJJ/Hlv7EnOQpaRm53k6ktDYZyB6w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 818 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 819 | <code>  app-builder-lib@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 820 | <code>    resolution: {integrity: sha512-p0Im/Dx5C4tmz8QEE1Yn4MkuPC8PrnlRneMhWJj7BBXQfNTJUshM/bp3lusdEsDbvvfJZpXWnYesgSLvwtM2Zw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 821 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 822 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 823 | <code>      dmg-builder: 26.8.1</code> | 配置键 `dmg-builder`：为构建、部署、依赖或运行时声明参数。 |
| 824 | <code>      electron-builder-squirrel-windows: 26.8.1</code> | 配置键 `electron-builder-squirrel-windows`：为构建、部署、依赖或运行时声明参数。 |
| 825 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 826 | <code>  archiver-utils@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 827 | <code>    resolution: {integrity: sha512-bEL/yUb/fNNiNTuUz979Z0Yg5L+LzLxGJz8x79lYmR54fmTIb6ob/hNQgkQnIUDWIFjZVQwl9Xs356I6BAMHfw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 828 | <code>    engines: {node: '&gt;= 6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 830 | <code>  archiver-utils@3.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 831 | <code>    resolution: {integrity: sha512-KVgf4XQVrTjhyWmx6cte4RxonPLR9onExufI1jhvw/MQ4BB6IsZD5gT8Lq+u/+pRkWna/6JoHpiQioaqFP5Rzw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 832 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 834 | <code>  archiver@5.3.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 835 | <code>    resolution: {integrity: sha512-+25nxyyznAXF7Nef3y0EbBeqmGZgeN/BxHX29Rs39djAfaFalmQ89SE6CWyDCHzGL0yt/ycBtNOmGTW0FyGWNw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 836 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>  argparse@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 839 | <code>    resolution: {integrity: sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 840 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 841 | <code>  assert-plus@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 842 | <code>    resolution: {integrity: sha512-NfJ4UzBCcQGLDlQq7nHxH+tv3kyZ0hHQqF5BO6J7tNJeP5do1llPr8dZ8zHonfhAu0PHAdMkSo+8o0wxg9lZWw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 843 | <code>    engines: {node: '&gt;=0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>  astral-regex@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 846 | <code>    resolution: {integrity: sha512-Z7tMw1ytTXt5jqMcOP+OQteU1VuNK9Y02uuJtKQ1Sv69jXQKKg5cibLwGJow8yzZP+eAc18EmLGPal0bp36rvQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 847 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 849 | <code>  async-exit-hook@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 850 | <code>    resolution: {integrity: sha512-NW2cX8m1Q7KPA7a5M2ULQeZ2wR5qI5PAbw5L0UOMxdioVk9PMZ0h1TmyZEkPYrCvYjDlFICusOu1dlEKAAeXBw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 851 | <code>    engines: {node: '&gt;=0.12.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 853 | <code>  async@3.2.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 854 | <code>    resolution: {integrity: sha512-htCUDlxyyCLMgaM3xXg0C0LW2xqfuQ6p05pCEIsXuyQ+a1koYKTuBMzRNwmybfLgvJDMd0r1LTn4+E0Ti6C2AA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 855 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 856 | <code>  asynckit@0.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 857 | <code>    resolution: {integrity: sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 858 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 859 | <code>  at-least-node@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 860 | <code>    resolution: {integrity: sha512-+q/t7Ekv1EDY2l6Gda6LLiX14rU9TV20Wa3ofeQmwPFZbOMo9DXrLbOjFaaclkXKWidIaopwAObQDqwWtGUjqg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 861 | <code>    engines: {node: '&gt;= 4.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 862 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 863 | <code>  atomic-sleep@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 864 | <code>    resolution: {integrity: sha512-kNOjDqAh7px0XWNI+4QbzoiR/nTkHAWNud2uvnJquD1/x5a7EQZMJT0AczqK0Qn67oY/TTQ1LbUKajZpp3I9tQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 865 | <code>    engines: {node: '&gt;=8.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 867 | <code>  axios@1.15.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 868 | <code>    resolution: {integrity: sha512-wWyJDlAatxk30ZJer+GeCWS209sA42X+N5jU2jy6oHTp7ufw8uzUTVFBX9+wTfAlhiJXGS0Bq7X6efruWjuK9Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 870 | <code>  b4a@1.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 871 | <code>    resolution: {integrity: sha512-aiqre1Nr0B/6DgE2N5vwTc+2/oQZ4Wh1t4NznYY4E00y8LCt6NqdRv81so00oo27D8MVKTpUa/MwUUtBLXCoDw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 872 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 873 | <code>      react-native-b4a: '*'</code> | 配置键 `react-native-b4a`：为构建、部署、依赖或运行时声明参数。 |
| 874 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 875 | <code>      react-native-b4a:</code> | 配置键 `react-native-b4a`：为构建、部署、依赖或运行时声明参数。 |
| 876 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 877 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 878 | <code>  balanced-match@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 879 | <code>    resolution: {integrity: sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 881 | <code>  balanced-match@4.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 882 | <code>    resolution: {integrity: sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 883 | <code>    engines: {node: 18 &#124;&#124; 20 &#124;&#124; &gt;=22}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 885 | <code>  bare-events@2.8.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 886 | <code>    resolution: {integrity: sha512-HdUm8EMQBLaJvGUdidNNbqpA1kYkwNcb+MYxkxCLAPJGQzlv9J0C24h8V65Z4c5GLd/JEALDvpFCQgpLJqc0zw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 887 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 888 | <code>      bare-abort-controller: '*'</code> | 配置键 `bare-abort-controller`：为构建、部署、依赖或运行时声明参数。 |
| 889 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 890 | <code>      bare-abort-controller:</code> | 配置键 `bare-abort-controller`：为构建、部署、依赖或运行时声明参数。 |
| 891 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 892 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 893 | <code>  bare-fs@4.7.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 894 | <code>    resolution: {integrity: sha512-WDRsyVN52eAx/lBamKD6uyw8H4228h/x0sGGGegOamM2cd7Pag88GfMQalobXI+HaEUxpCkbKQUDOQqt9wawRw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 895 | <code>    engines: {bare: '&gt;=1.16.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 896 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 897 | <code>      bare-buffer: '*'</code> | 配置键 `bare-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 898 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 899 | <code>      bare-buffer:</code> | 配置键 `bare-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 900 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>  bare-os@3.9.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 903 | <code>    resolution: {integrity: sha512-6M5XjcnsygQNPMCMPXSK379xrJFiZ/AEMNBmFEmQW8d/789VQATvriyi5r0HYTL9TkQ26rn3kgdTG3aisbrXkQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 904 | <code>    engines: {bare: '&gt;=1.14.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 906 | <code>  bare-path@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 907 | <code>    resolution: {integrity: sha512-tyfW2cQcB5NN8Saijrhqn0Zh7AnFNsnczRcuWODH0eYAXBsJ5gVxAUuNr7tsHSC6IZ77cA0SitzT+s47kot8Mw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 909 | <code>  bare-stream@2.13.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 910 | <code>    resolution: {integrity: sha512-Vp0cnjYyrEC4whYTymQ+YZi6pBpfiICZO3cfRG8sy67ZNWe951urv1x4eW1BKNngw3U+3fPYb5JQvHbCtxH7Ow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 911 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 912 | <code>      bare-abort-controller: '*'</code> | 配置键 `bare-abort-controller`：为构建、部署、依赖或运行时声明参数。 |
| 913 | <code>      bare-buffer: '*'</code> | 配置键 `bare-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 914 | <code>      bare-events: '*'</code> | 配置键 `bare-events`：为构建、部署、依赖或运行时声明参数。 |
| 915 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 916 | <code>      bare-abort-controller:</code> | 配置键 `bare-abort-controller`：为构建、部署、依赖或运行时声明参数。 |
| 917 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 918 | <code>      bare-buffer:</code> | 配置键 `bare-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 919 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 920 | <code>      bare-events:</code> | 配置键 `bare-events`：为构建、部署、依赖或运行时声明参数。 |
| 921 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 923 | <code>  bare-url@2.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 924 | <code>    resolution: {integrity: sha512-Kccpc7ACfXaxfeInfqKcZtW4pT5YBn1mesc4sCsun6sRwtbJ4h+sNOaksUpYEJUKfN65YWC6Bw2OJEFiKxq8nQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 926 | <code>  base64-js@1.5.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 927 | <code>    resolution: {integrity: sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 929 | <code>  big-integer@1.6.52:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 930 | <code>    resolution: {integrity: sha512-QxD8cf2eVqJOOz63z6JIN9BzvVs/dlySa5HGSBH5xtR8dPteIRQnBxxKqkNTiT6jbDTF6jAfrd4oMcND9RGbQg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 931 | <code>    engines: {node: '&gt;=0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 933 | <code>  binary@0.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 934 | <code>    resolution: {integrity: sha512-D4H1y5KYwpJgK8wk1Cue5LLPgmwHKYSChkbspQg5JtVuR5ulGckxfR62H3AE9UDkdMC8yyXlqYihuz3Aqg2XZg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 935 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 936 | <code>  bl@4.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 937 | <code>    resolution: {integrity: sha512-1W07cM9gS6DcLperZfFSj+bWLtaPGSOHWhPiGzXmvVJbRLdG82sH/Kn8EtW1VqWVA54AKf2h5k5BbnIbwF3h6w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 938 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 939 | <code>  bluebird@3.4.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 940 | <code>    resolution: {integrity: sha512-iD3898SR7sWVRHbiQv+sHUtHnMvC1o3nW5rAcqnq3uOn07DSAppZYUkIGslDz6gXC7HfunPe7YVBgoEJASPcHA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>  body-parser@2.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 943 | <code>    resolution: {integrity: sha512-oP5VkATKlNwcgvxi0vM0p/D3n2C3EReYVX+DNYs5TjZFn/oQt2j+4sVJtSMr18pdRr8wjTcBl6LoV+FUwzPmNA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 944 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 945 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 946 | <code>  boolean@3.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 947 | <code>    resolution: {integrity: sha512-d0II/GO9uf9lfUHH2BQsjxzRJZBdsjgsBiW4BvhWk/3qoKwQFjIDVN19PfX8F2D/r9PCMTtLWjYVCFrpeYUzsw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 948 | <code>    deprecated: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 950 | <code>  brace-expansion@1.1.14:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 951 | <code>    resolution: {integrity: sha512-MWPGfDxnyzKU7rNOW9SP/c50vi3xrmrua/+6hfPbCS2ABNWfx24vPidzvC7krjU/RTo235sV776ymlsMtGKj8g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 952 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 953 | <code>  brace-expansion@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 954 | <code>    resolution: {integrity: sha512-TN1kCZAgdgweJhWWpgKYrQaMNHcDULHkWwQIspdtjV4Y5aurRdZpjAqn6yX3FPqTA9ngHCc4hJxMAMgGfve85w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 955 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 956 | <code>  brace-expansion@5.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 957 | <code>    resolution: {integrity: sha512-VZznLgtwhn+Mact9tfiwx64fA9erHH/MCXEUfB/0bX/6Fz6ny5EGTXYltMocqg4xFAQZtnO3DHWWXi8RiuN7cQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 958 | <code>    engines: {node: 18 &#124;&#124; 20 &#124;&#124; &gt;=22}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 959 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 960 | <code>  buffer-crc32@0.2.13:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 961 | <code>    resolution: {integrity: sha512-VO9Ht/+p3SN7SKWqcrgEzjGbRSJYTx+Q1pTQC0wrWqHx0vpJraQ6GtHx8tvcg1rlK1byhU5gccxgOgj7B0TDkQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 962 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 963 | <code>  buffer-from@1.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 964 | <code>    resolution: {integrity: sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 966 | <code>  buffer-indexof-polyfill@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 967 | <code>    resolution: {integrity: sha512-I7wzHwA3t1/lwXQh+A5PbNvJxgfo5r3xulgpYDB5zckTu/Z9oUK9biouBKQUjEqzaz3HnAT6TYoovmE+GqSf7A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 968 | <code>    engines: {node: '&gt;=0.10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 970 | <code>  buffer@5.7.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 971 | <code>    resolution: {integrity: sha512-EHcyIPBQ4BSGlvjB16k5KgAJ27CIsHY/2JBmCRReo48y9rQ3MaUzWX3KVlBa4U7MyX02HdVj0K7C3WaB3ju7FQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 972 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 973 | <code>  buffers@0.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 974 | <code>    resolution: {integrity: sha512-9q/rDEGSb/Qsvv2qvzIzdluL5k7AaJOTrw23z9reQthrbF7is4CtlT0DXyO1oei2DCp4uojjzQ7igaSHp1kAEQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 975 | <code>    engines: {node: '&gt;=0.2.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 976 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 977 | <code>  builder-util-runtime@9.5.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 978 | <code>    resolution: {integrity: sha512-qt41tMfgHTllhResqM5DcnHyDIWNgzHvuY2jDcYP9iaGpkWxTUzV6GQjDeLnlR1/DtdlcsWQbA7sByMpmJFTLQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 979 | <code>    engines: {node: '&gt;=12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 980 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 981 | <code>  builder-util@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 982 | <code>    resolution: {integrity: sha512-pm1lTYbGyc90DHgCDO7eo8Rl4EqKLciayNbZqGziqnH9jrlKe8ZANGdityLZU+pJh16dfzjAx2xQq9McuIPEtw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 983 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 984 | <code>  bytes@3.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 985 | <code>    resolution: {integrity: sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 986 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 987 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 988 | <code>  cacache@19.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 989 | <code>    resolution: {integrity: sha512-hdsUxulXCi5STId78vRVYEtDAjq99ICAUktLTeTYsLoTE6Z8dS0c8pWNCxwdrk9YfJeobDZc2Y186hD/5ZQgFQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 990 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 991 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 992 | <code>  cacheable-lookup@5.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 993 | <code>    resolution: {integrity: sha512-2/kNscPhpcxrOigMZzbiWF7dz8ilhb/nIHU3EyZiXWXpeq/au8qJ8VhdftMkty3n7Gj6HIGalQG8oiBNB3AJgA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 994 | <code>    engines: {node: '&gt;=10.6.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 995 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 996 | <code>  cacheable-request@7.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 997 | <code>    resolution: {integrity: sha512-v+p6ongsrp0yTGbJXjgxPow2+DL93DASP4kXCDKb8/bwRtt9OEF3whggkkDkGNzgcWy2XaF4a8nZglC7uElscg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 998 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 999 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1000 | <code>  call-bind-apply-helpers@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1001 | <code>    resolution: {integrity: sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1002 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1003 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1004 | <code>  call-bound@1.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1005 | <code>    resolution: {integrity: sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1006 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1007 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1008 | <code>  chainsaw@0.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1009 | <code>    resolution: {integrity: sha512-75kWfWt6MEKNC8xYXIdRpDehRYY/tNSgwKaJq+dbbDcxORuVrrQ+SEHoWsniVn9XPYfP4gmdWIeDk/4YNp1rNQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1010 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1011 | <code>  chalk@4.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1012 | <code>    resolution: {integrity: sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1013 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1014 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1015 | <code>  chess.js@1.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1016 | <code>    resolution: {integrity: sha512-BBJgrrtKQOzFLonR0l+k64A98NLemPwNsCskwb+29bRwobUa4iTm51E1kwGPbWXAcfdDa18nad6vpPPKPWarqw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1018 | <code>  chownr@1.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1019 | <code>    resolution: {integrity: sha512-jJ0bqzaylmJtVnNgzTeSOs8DPavpbYgEr/b0YL8/2GO3xJEhInFmhKMUnEJQjZumK7KXGFhUy89PrsJWlakBVg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1020 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1021 | <code>  chownr@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1022 | <code>    resolution: {integrity: sha512-+IxzY9BZOQd/XuYPRmrvEVjF/nqj5kgT4kEq7VofrDoM1MxoRjEWkrCC3EtLi59TVawxTAn+orJwFQcrqEN1+g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1023 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1024 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1025 | <code>  chromium-pickle-js@0.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1026 | <code>    resolution: {integrity: sha512-1R5Fho+jBq0DDydt+/vHWj5KJNJCKdARKOCwZUen84I5BreWoLqRLANH1U87eJy1tiASPtMnGqJJq0ZsLoRPOw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1028 | <code>  ci-info@4.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1029 | <code>    resolution: {integrity: sha512-Wdy2Igu8OcBpI2pZePZ5oWjPC38tmDVx5WKUXKwlLYkA0ozo85sLsLvkBbBn/sZaSCMFOGZJ14fvW9t5/d7kdA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1030 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1032 | <code>  ci-info@4.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1033 | <code>    resolution: {integrity: sha512-77PSwercCZU2Fc4sX94eF8k8Pxte6JAwL4/ICZLFjJLqegs7kCuAsqqj/70NQF6TvDpgFjkubQB2FW2ZZddvQg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1034 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1036 | <code>  cli-cursor@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1037 | <code>    resolution: {integrity: sha512-I/zHAwsKf9FqGoXM4WWRACob9+SNukZTd94DWF57E4toouRulbCxcUh6RKUEOQlYTHJnzkPMySvPNaaSLNfLZw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1038 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1039 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1040 | <code>  cli-spinners@2.9.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1041 | <code>    resolution: {integrity: sha512-ywqV+5MmyL4E7ybXgKys4DugZbX0FC6LnwrhjuykIjnK9k8OQacQ7axGKnjDXWNhns0xot3bZI5h55H8yo9cJg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1042 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1044 | <code>  cli-truncate@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1045 | <code>    resolution: {integrity: sha512-n8fOixwDD6b/ObinzTrp1ZKFzbgvKZvuz/TvejnLn1aQfC6r52XEx85FmuC+3HI+JM7coBRXUvNqEU2PHVrHpg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1046 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1048 | <code>  cliui@8.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1049 | <code>    resolution: {integrity: sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1050 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1051 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1052 | <code>  clone-response@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1053 | <code>    resolution: {integrity: sha512-ROoL94jJH2dUVML2Y/5PEDNaSHgeOdSDicUyS7izcF63G6sTc/FTjLub4b8Il9S8S0beOfYt0TaA5qvFK+w0wA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1055 | <code>  clone@1.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1056 | <code>    resolution: {integrity: sha512-JQHZ2QMW6l3aH/j6xCqQThY/9OH4D/9ls34cgkUBiEeocRTU04tHfKPBsUK1PqZCUQM7GiA0IIXJSuXHI64Kbg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1057 | <code>    engines: {node: '&gt;=0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>  color-convert@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1060 | <code>    resolution: {integrity: sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1061 | <code>    engines: {node: '&gt;=7.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1062 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1063 | <code>  color-name@1.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1064 | <code>    resolution: {integrity: sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1065 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1066 | <code>  color-string@1.9.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1067 | <code>    resolution: {integrity: sha512-shrVawQFojnZv6xM40anx4CkoDP+fZsw/ZerEMsW/pyzsRbElpsL/DBVW7q3ExxwusdNXI3lXpuhEZkzs8p5Eg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1068 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1069 | <code>  color@4.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1070 | <code>    resolution: {integrity: sha512-1rXeuUUiGGrykh+CeBdu5Ie7OJwinCgQY0bc7GCRxy5xVHy+moaqkpL/jqQq0MtQOeYcrqEz4abc5f0KtU7W4A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1071 | <code>    engines: {node: '&gt;=12.5.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1072 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1073 | <code>  combined-stream@1.0.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1074 | <code>    resolution: {integrity: sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1075 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1076 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1077 | <code>  commander@5.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1078 | <code>    resolution: {integrity: sha512-P0CysNDQ7rtVw4QIQtm+MRxV66vKFSvlsQvGYXZWR3qFU0jlMKHZZZgw8e+8DSah4UDKMqnknRDQz+xuQXQ/Zg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1079 | <code>    engines: {node: '&gt;= 6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1080 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1081 | <code>  commander@9.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1082 | <code>    resolution: {integrity: sha512-KRs7WVDKg86PWiuAqhDrAQnTXZKraVcCc6vFdL14qrZ/DcWwuRo7VoiYXalXO7S5GKpqYiVEwCbgFDfxNHKJBQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1083 | <code>    engines: {node: ^12.20.0 &#124;&#124; &gt;=14}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1084 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1085 | <code>  compare-version@0.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1086 | <code>    resolution: {integrity: sha512-pJDh5/4wrEnXX/VWRZvruAGHkzKdr46z11OlTPN+VrATlWWhSKewNCJ1futCO5C7eJB3nPMFZA1LeYtcFboZ2A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1087 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1089 | <code>  compress-commons@4.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1090 | <code>    resolution: {integrity: sha512-D3uMHtGc/fcO1Gt1/L7i1e33VOvD4A9hfQLP+6ewd+BvG/gQ84Yh4oftEhAdjSMgBgwGL+jsppT7JYNpo6MHHg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1091 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1093 | <code>  concat-map@0.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1094 | <code>    resolution: {integrity: sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1095 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1096 | <code>  concurrently@9.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1097 | <code>    resolution: {integrity: sha512-fsfrO0MxV64Znoy8/l1vVIjjHa29SZyyqPgQBwhiDcaW8wJc2W3XWVOGx4M3oJBnv/zdUZIIp1gDeS98GzP8Ng==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1098 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1099 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1101 | <code>  content-disposition@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1102 | <code>    resolution: {integrity: sha512-5jRCH9Z/+DRP7rkvY83B+yGIGX96OYdJmzngqnw2SBSxqCFPd0w2km3s5iawpGX8krnwSGmF0FW5Nhr0Hfai3g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1103 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1105 | <code>  content-type@1.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1106 | <code>    resolution: {integrity: sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1107 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1109 | <code>  content-type@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1110 | <code>    resolution: {integrity: sha512-j/O/d7GcZCyNl7/hwZAb606rzqkyvaDctLmckbxLzHvFBzTJHuGEdodATcP3yIRoDrLHkIATJuvzbFlp/ki2cQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1111 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1113 | <code>  cookie-signature@1.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1114 | <code>    resolution: {integrity: sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1115 | <code>    engines: {node: '&gt;=6.6.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1117 | <code>  cookie@0.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1118 | <code>    resolution: {integrity: sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1119 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1121 | <code>  core-util-is@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1122 | <code>    resolution: {integrity: sha512-3lqz5YjWTYnW6dlDa5TLaTCcShfar1e40rmcJVwCBJC6mWlFuj0eCHIElmG1g5kyuJ/GD+8Wn4FFCcz4gJPfaQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1124 | <code>  core-util-is@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1125 | <code>    resolution: {integrity: sha512-ZQBvi1DcpJ4GDqanjucZ2Hj3wEO5pZDS89BWbkcrvdxksJorwUDDZamX9ldFkp9aw2lmBDLgkObEA4DWNJ9FYQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1127 | <code>  cors@2.8.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1128 | <code>    resolution: {integrity: sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1129 | <code>    engines: {node: '&gt;= 0.10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1131 | <code>  crc-32@1.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1132 | <code>    resolution: {integrity: sha512-ROmzCKrTnOwybPcJApAA6WBWij23HVfGVNKqqrZpuyZOHqK2CwHSvpGuyt/UNNvaIjEd8X5IFGp4Mh+Ie1IHJQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1133 | <code>    engines: {node: '&gt;=0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1134 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1136 | <code>  crc32-stream@4.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1137 | <code>    resolution: {integrity: sha512-NT7w2JVU7DFroFdYkeq8cywxrgjPHWkdX1wjpRQXPX5Asews3tA+Ght6lddQO5Mkumffp3X7GEqku3epj2toIw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1138 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1140 | <code>  crc@3.8.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1141 | <code>    resolution: {integrity: sha512-iX3mfgcTMIq3ZKLIsVFAbv7+Mc10kxabAGQb8HvjA1o3T1PIYprbakQ65d3I+2HGHt6nSKkM9PYjgoJO2KcFBQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1143 | <code>  cross-dirname@0.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1144 | <code>    resolution: {integrity: sha512-+R08/oI0nl3vfPcqftZRpytksBXDzOUveBq/NBVx0sUp1axwzPQrKinNx5yd5sxPu8j1wIy8AfnVQ+5eFdha6Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1146 | <code>  cross-env@10.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1147 | <code>    resolution: {integrity: sha512-GsYosgnACZTADcmEyJctkJIoqAhHjttw7RsFrVoJNXbsWWqaq6Ym+7kZjq6mS45O0jij6vtiReppKQEtqWy6Dw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1148 | <code>    engines: {node: '&gt;=20'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1149 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1151 | <code>  cross-spawn@7.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1152 | <code>    resolution: {integrity: sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1153 | <code>    engines: {node: '&gt;= 8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1155 | <code>  dayjs@1.11.21:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1156 | <code>    resolution: {integrity: sha512-98IT+HOahAisibz/yjKbzuOBwYcjJ7BCLPzARyHiyEBmRz4fatF+KPJszEHXsGYjUG234aH/cOjW1wwTbKUZlA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1158 | <code>  debug@4.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1159 | <code>    resolution: {integrity: sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1160 | <code>    engines: {node: '&gt;=6.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1161 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 1162 | <code>      supports-color: '*'</code> | 配置键 `supports-color`：为构建、部署、依赖或运行时声明参数。 |
| 1163 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 1164 | <code>      supports-color:</code> | 配置键 `supports-color`：为构建、部署、依赖或运行时声明参数。 |
| 1165 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 1166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1167 | <code>  decompress-response@6.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1168 | <code>    resolution: {integrity: sha512-aW35yZM6Bb/4oJlZncMH2LCoZtJXTRxES17vE3hoRiowU2kWHaJKFkSBDnDR+cm9J+9QhXmREyIfv0pji9ejCQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1169 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1171 | <code>  deep-extend@0.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1172 | <code>    resolution: {integrity: sha512-LOHxIOaPYdHlJRtCQfDIVZtfw/ufM8+rVj649RIHzcm/vGwQRXFt6OPqIFWsm2XEMrNIEtWR64sY1LEKD2vAOA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1173 | <code>    engines: {node: '&gt;=4.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1175 | <code>  deepmerge@4.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1176 | <code>    resolution: {integrity: sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1177 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1179 | <code>  defaults@1.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1180 | <code>    resolution: {integrity: sha512-eFuaLoy/Rxalv2kr+lqMlUnrDWV+3j4pljOIJgLIhI058IQfWJ7vXhyEIHu+HtC738klGALYxOKDO0bQP3tg8A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1182 | <code>  defer-to-connect@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1183 | <code>    resolution: {integrity: sha512-4tvttepXG1VaYGrRibk5EwJd1t4udunSOVMdLSAL6mId1ix438oPwPZMALY41FCijukO1L0twNcGsdzS7dHgDg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1184 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1186 | <code>  define-data-property@1.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1187 | <code>    resolution: {integrity: sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1188 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1190 | <code>  define-properties@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1191 | <code>    resolution: {integrity: sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1192 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1194 | <code>  delayed-stream@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1195 | <code>    resolution: {integrity: sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1196 | <code>    engines: {node: '&gt;=0.4.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1198 | <code>  depd@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1199 | <code>    resolution: {integrity: sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1200 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1202 | <code>  detect-libc@2.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1203 | <code>    resolution: {integrity: sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1204 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1206 | <code>  detect-node@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1207 | <code>    resolution: {integrity: sha512-T0NIuQpnTvFDATNuHN5roPwSBG83rFsuO+MXXH9/3N1eFbn4wcPjttvjMLEPWJ0RGUYgQE7cGgS3tNxbqCGM7g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1209 | <code>  diff@5.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1210 | <code>    resolution: {integrity: sha512-vtcDfH3TOjP8UekytvnHH1o1P4FcUdt4eQ1Y+Abap1tk/OB2MWQvcwS2ClCd1zuIhc3JKOx6p3kod8Vfys3E+A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1211 | <code>    engines: {node: '&gt;=0.3.1'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1213 | <code>  dir-compare@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1214 | <code>    resolution: {integrity: sha512-2xMCmOoMrdQIPHdsTawECdNPwlVFB9zGcz3kuhmBO6U3oU+UQjsue0i8ayLKpgBcm+hcXPMVSGUN9d+pvJ6+VQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1216 | <code>  dmg-builder@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1217 | <code>    resolution: {integrity: sha512-glMJgnTreo8CFINujtAhCgN96QAqApDMZ8Vl1r8f0QT8QprvC1UCltV4CcWj20YoIyLZx6IUskaJZ0NV8fokcg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1219 | <code>  dmg-license@1.0.11:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1220 | <code>    resolution: {integrity: sha512-ZdzmqwKmECOWJpqefloC5OJy1+WZBBse5+MR88z9g9Zn4VY+WYUkAyojmhzJckH5YbbZGcYIuGAkY5/Ys5OM2Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1221 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1222 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1223 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1225 | <code>  dom-serializer@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1226 | <code>    resolution: {integrity: sha512-wIkAryiqt/nV5EQKqQpo3SToSOV9J0DnbJqwK7Wv/Trc92zIAYZ4FlMu+JPFW1DfGFt81ZTCGgDEabffXeLyJg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1228 | <code>  domelementtype@2.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1229 | <code>    resolution: {integrity: sha512-OLETBj6w0OsagBwdXnPdN0cnMfF9opN69co+7ZrbfPGrdpPVNBUj02spi6B1N7wChLQiPn4CSH/zJvXw56gmHw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1231 | <code>  domhandler@5.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1232 | <code>    resolution: {integrity: sha512-cgwlv/1iFQiFnU96XXgROh8xTeetsnJiDsTc7TYCLFd9+/WNkIqPTxiM/8pSd8VIrhXGTf1Ny1q1hquVqDJB5w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1233 | <code>    engines: {node: '&gt;= 4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1235 | <code>  domutils@3.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1236 | <code>    resolution: {integrity: sha512-6kZKyUajlDuqlHKVX1w7gyslj9MPIXzIFiz/rGu35uC1wMi+kMhQwGhl4lt9unC9Vb9INnY9Z3/ZA3+FhASLaw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1238 | <code>  dotenv-expand@11.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1239 | <code>    resolution: {integrity: sha512-zIHwmZPRshsCdpMDyVsqGmgyP0yT8GAgXUnkdAoJisxvf33k7yO6OuoKmcTGuXPWSsm8Oh88nZicRLA9Y0rUeA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1240 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1242 | <code>  dotenv@16.6.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1243 | <code>    resolution: {integrity: sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1244 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1246 | <code>  dunder-proto@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1247 | <code>    resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1248 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1250 | <code>  duplexer2@0.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1251 | <code>    resolution: {integrity: sha512-asLFVfWWtJ90ZyOUHMqk7/S2w2guQKxUI2itj3d92ADHhxUSbCMGi1f1cBcJ7xM1To+pE/Khbwo1yuNbMEPKeA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1253 | <code>  eastasianwidth@0.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1254 | <code>    resolution: {integrity: sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1256 | <code>  ee-first@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1257 | <code>    resolution: {integrity: sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1259 | <code>  ejs@3.1.10:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1260 | <code>    resolution: {integrity: sha512-UeJmFfOrAQS8OJWPZ4qtgHyWExa088/MtK5UEyoJGFH67cDEXkZSviOiKRCZ4Xij0zxI3JECgYs3oKx+AizQBA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1261 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1262 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1264 | <code>  electron-builder-squirrel-windows@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1265 | <code>    resolution: {integrity: sha512-o288fIdgPLHA76eDrFADHPoo7VyGkDCYbLV1GzndaMSAVBoZrGvM9m2IehdcVMzdAZJ2eV9bgyissQXHv5tGzA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1267 | <code>  electron-builder@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1268 | <code>    resolution: {integrity: sha512-uWhx1r74NGpCagG0ULs/P9Nqv2nsoo+7eo4fLUOB8L8MdWltq9odW/uuLXMFCDGnPafknYLZgjNX0ZIFRzOQAw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1269 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1270 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1272 | <code>  electron-publish@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1273 | <code>    resolution: {integrity: sha512-q+jrSTIh/Cv4eGZa7oVR+grEJo/FoLMYBAnSL5GCtqwUpr1T+VgKB/dn1pnzxIxqD8S/jP1yilT9VrwCqINR4w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1275 | <code>  electron-winstaller@5.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1276 | <code>    resolution: {integrity: sha512-bO3y10YikuUwUuDUQRM4KfwNkKhnpVO7IPdbsrejwN9/AABJzzTQ4GeHwyzNSrVO+tEH3/Np255a3sVZpZDjvg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1277 | <code>    engines: {node: '&gt;=8.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1279 | <code>  electron@41.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1280 | <code>    resolution: {integrity: sha512-0OKLiymqfV0WK68RBXqAm3Myad2TpI5wwxLCBEUcH5Nugo3YfSk7p1Js/AL9266qTz5xZioUnxt9hG8FFwax0g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1281 | <code>    engines: {node: '&gt;= 12.20.55'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1282 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1284 | <code>  emoji-regex@8.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1285 | <code>    resolution: {integrity: sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1287 | <code>  emoji-regex@9.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1288 | <code>    resolution: {integrity: sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1290 | <code>  encodeurl@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1291 | <code>    resolution: {integrity: sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1292 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1294 | <code>  encoding-japanese@2.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1295 | <code>    resolution: {integrity: sha512-EuJWwlHPZ1LbADuKTClvHtwbaFn4rOD+dRAbWysqEOXRc2Uui0hJInNJrsdH0c+OhJA4nrCBdSkW4DD5YxAo6A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1296 | <code>    engines: {node: '&gt;=8.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1298 | <code>  encoding@0.1.13:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1299 | <code>    resolution: {integrity: sha512-ETBauow1T35Y/WZMkio9jiM0Z5xjHHmJ4XmjZOq1l/dXz3lr2sRn87nJy20RupqSh1F2m3HHPSp8ShIPQJrJ3A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1301 | <code>  end-of-stream@1.4.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1302 | <code>    resolution: {integrity: sha512-ooEGc6HP26xXq/N+GCGOT0JKCLDGrq2bQUZrQ7gyrJiZANJ/8YDTxTpQBXGMn+WbIQXNVpyWymm7KYVICQnyOg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1304 | <code>  entities@4.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1305 | <code>    resolution: {integrity: sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1306 | <code>    engines: {node: '&gt;=0.12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1308 | <code>  env-paths@2.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1309 | <code>    resolution: {integrity: sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1310 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1312 | <code>  err-code@2.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1313 | <code>    resolution: {integrity: sha512-2bmlRpNKBxT/CRmPOlyISQpNj+qSeYvcym/uT0Jx2bMOlKLtSy1ZmLuVxSEKKyor/N5yhvp/ZiG1oE3DEYMSFA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1315 | <code>  es-define-property@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1316 | <code>    resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1317 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1319 | <code>  es-errors@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1320 | <code>    resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1321 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1323 | <code>  es-object-atoms@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1324 | <code>    resolution: {integrity: sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1325 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1327 | <code>  es-set-tostringtag@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1328 | <code>    resolution: {integrity: sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1329 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1330 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1331 | <code>  es6-error@4.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1332 | <code>    resolution: {integrity: sha512-Um/+FxMr9CISWh0bi5Zv0iOD+4cFh5qLeks1qhAopKVAJw3drgKbKySikp7wGhDL0HPeaja0P5ULZrxLkniUVg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1334 | <code>  escalade@3.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1335 | <code>    resolution: {integrity: sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1336 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1338 | <code>  escape-html@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1339 | <code>    resolution: {integrity: sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1341 | <code>  escape-string-regexp@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1342 | <code>    resolution: {integrity: sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1343 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1345 | <code>  etag@1.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1346 | <code>    resolution: {integrity: sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1347 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1349 | <code>  events-universal@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1350 | <code>    resolution: {integrity: sha512-LUd5euvbMLpwOF8m6ivPCbhQeSiYVNb8Vs0fQ8QjXo0JTkEHpz8pxdQf0gStltaPpw0Cca8b39KxvK9cfKRiAw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1352 | <code>  eventsource-parser@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1353 | <code>    resolution: {integrity: sha512-kJezFj9YFAMLeORyi7aCLxLbD5/qWMQnoMVlVPyHIll7lgRJCc3JVln9Vgl9nwQi0YkMnhdGTMNn7CkRRAptMg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1354 | <code>    engines: {node: '&gt;=18.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1356 | <code>  eventsource@3.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1357 | <code>    resolution: {integrity: sha512-CRT1WTyuQoD771GW56XEZFQ/ZoSfWid1alKGDYMmkt2yl8UXrVR4pspqWNEcqKvVIzg6PAltWjxcSSPrboA4iA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1358 | <code>    engines: {node: '&gt;=18.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1360 | <code>  exceljs@4.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1361 | <code>    resolution: {integrity: sha512-XctvKaEMaj1Ii9oDOqbW/6e1gXknSY4g/aLCDicOXqBE4M0nRWkUu0PTp++UPNzoFY12BNHMfs/VadKIS6llvg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1362 | <code>    engines: {node: '&gt;=8.3.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1364 | <code>  expand-template@2.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1365 | <code>    resolution: {integrity: sha512-XYfuKMvj4O35f/pOXLObndIRvyQ+/+6AhODh+OKWj9S9498pHHn/IMszH+gt0fBCRWMNfk1ZSp5x3AifmnI2vg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1366 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1368 | <code>  exponential-backoff@3.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1369 | <code>    resolution: {integrity: sha512-ZgEeZXj30q+I0EN+CbSSpIyPaJ5HVQD18Z1m+u1FXbAeT94mr1zw50q4q6jiiC447Nl/YTcIYSAftiGqetwXCA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1371 | <code>  express-rate-limit@8.5.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1372 | <code>    resolution: {integrity: sha512-5Kb34ipNX694DH48vN9irak1Qx30nb0PLYHXfJgw4YEjiC3ZEmZJhwOp+VfiCYwFzvFTdB9QkArYS5kXa2cx2A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1373 | <code>    engines: {node: '&gt;= 16'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1374 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 1375 | <code>      express: '&gt;= 4.11'</code> | 配置键 `express`：为构建、部署、依赖或运行时声明参数。 |
| 1376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1377 | <code>  express@5.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1378 | <code>    resolution: {integrity: sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1379 | <code>    engines: {node: '&gt;= 18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1381 | <code>  extract-zip@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1382 | <code>    resolution: {integrity: sha512-GDhU9ntwuKyGXdZBUgTIe+vXnWj0fppUEtMDL0+idd5Sta8TGpHssn/eusA9mrPr9qNDym6SxAYZjNvCn/9RBg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1383 | <code>    engines: {node: '&gt;= 10.17.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1384 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1386 | <code>  extsprintf@1.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1387 | <code>    resolution: {integrity: sha512-Wrk35e8ydCKDj/ArClo1VrPVmN8zph5V4AtHwIuHhvMXsKf73UT3BOD+azBIW+3wOJ4FhEH7zyaJCFvChjYvMA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1388 | <code>    engines: {'0': node &gt;=0.6.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1390 | <code>  fast-csv@4.3.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1391 | <code>    resolution: {integrity: sha512-2RNSpuwwsJGP0frGsOmTb9oUF+VkFSM4SyLTDgwf2ciHWTarN0lQTC+F2f/t5J9QjW+c65VFIAAu85GsvMIusw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1392 | <code>    engines: {node: '&gt;=10.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1394 | <code>  fast-deep-equal@3.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1395 | <code>    resolution: {integrity: sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1397 | <code>  fast-fifo@1.3.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1398 | <code>    resolution: {integrity: sha512-/d9sfos4yxzpwkDkuN7k2SqFKtYNmCTzgfEpz82x34IM9/zc8KGxQoXg1liNC/izpRM/MBdt44Nmx41ZWqk+FQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1400 | <code>  fast-json-stable-stringify@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1401 | <code>    resolution: {integrity: sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1403 | <code>  fast-uri@3.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1404 | <code>    resolution: {integrity: sha512-rVjf7ArG3LTk+FS6Yw81V1DLuZl1bRbNrev6Tmd/9RaroeeRRJhAt7jg/6YFxbvAQXUCavSoZhPPj6oOx+5KjQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1406 | <code>  fd-slicer@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1407 | <code>    resolution: {integrity: sha512-cE1qsB/VwyQozZ+q1dGxR8LBYNZeofhEdUNGSMbQD3Gw2lAzX9Zb3uIU6Ebc/Fmyjo9AWWfnn0AUCHqtevs/8g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1409 | <code>  fdir@6.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1410 | <code>    resolution: {integrity: sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1411 | <code>    engines: {node: '&gt;=12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1412 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 1413 | <code>      picomatch: ^3 &#124;&#124; ^4</code> | 配置键 `picomatch`：为构建、部署、依赖或运行时声明参数。 |
| 1414 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 1415 | <code>      picomatch:</code> | 配置键 `picomatch`：为构建、部署、依赖或运行时声明参数。 |
| 1416 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 1417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1418 | <code>  filelist@1.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1419 | <code>    resolution: {integrity: sha512-5giy2PkLYY1cP39p17Ech+2xlpTRL9HLspOfEgm0L6CwBXBTgsK5ou0JtzYuepxkaQ/tvhCFIJ5uXo0OrM2DxA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1421 | <code>  finalhandler@2.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1422 | <code>    resolution: {integrity: sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1423 | <code>    engines: {node: '&gt;= 18.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1425 | <code>  flatbuffers@1.12.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1426 | <code>    resolution: {integrity: sha512-c7CZADjRcl6j0PlvFy0ZqXQ67qSEZfrVPynmnL+2zPc+NtMvrF8Y0QceMo7QqnSPc7+uWjUIAbvCQ5WIKlMVdQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1428 | <code>  follow-redirects@1.15.11:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1429 | <code>    resolution: {integrity: sha512-deG2P0JfjrTxl50XGCDyfI97ZGVCxIpfKYmfyrQ54n5FO/0gfIES8C/Psl6kWVDolizcaaxZJnTS0QSMxvnsBQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1430 | <code>    engines: {node: '&gt;=4.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1431 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 1432 | <code>      debug: '*'</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 1433 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 1434 | <code>      debug:</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 1435 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 1436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1437 | <code>  foreground-child@3.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1438 | <code>    resolution: {integrity: sha512-gIXjKqtFuWEgzFRJA9WCQeSJLZDjgJUOMCMzxtvFq/37KojM1BFGufqsCy0r4qSQmYLsZYMeyRqzIWOMup03sw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1439 | <code>    engines: {node: '&gt;=14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1441 | <code>  form-data@4.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1442 | <code>    resolution: {integrity: sha512-8RipRLol37bNs2bhoV67fiTEvdTrbMUYcFTiy3+wuuOnUog2QBHCZWXDRijWQfAkhBj2Uf5UnVaiWwA5vdd82w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1443 | <code>    engines: {node: '&gt;= 6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1445 | <code>  forwarded@0.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1446 | <code>    resolution: {integrity: sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1447 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1449 | <code>  fresh@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1450 | <code>    resolution: {integrity: sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1451 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1453 | <code>  fs-constants@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1454 | <code>    resolution: {integrity: sha512-y6OAwoSIf7FyjMIv94u+b5rdheZEjzR63GTyZJm5qh4Bi+2YgwLCcI/fPFZkL5PSixOt6ZNKm+w+Hfp/Bciwow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1456 | <code>  fs-extra@10.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1457 | <code>    resolution: {integrity: sha512-oRXApq54ETRj4eMiFzGnHWGy+zo5raudjuxN0b8H7s/RU2oW0Wvsx9O0ACRN/kRq9E8Vu/ReskGB5o3ji+FzHQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1458 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1460 | <code>  fs-extra@11.3.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1461 | <code>    resolution: {integrity: sha512-CTXd6rk/M3/ULNQj8FBqBWHYBVYybQ3VPBw0xGKFe3tuH7ytT6ACnvzpIQ3UZtB8yvUKC2cXn1a+x+5EVQLovA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1462 | <code>    engines: {node: '&gt;=14.14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1464 | <code>  fs-extra@7.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1465 | <code>    resolution: {integrity: sha512-YJDaCJZEnBmcbw13fvdAM9AwNOJwOzrE4pqMqBq5nFiEqXUqHwlK4B+3pUw6JNvfSPtX05xFHtYy/1ni01eGCw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1466 | <code>    engines: {node: '&gt;=6 &lt;7 &#124;&#124; &gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1468 | <code>  fs-extra@8.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1469 | <code>    resolution: {integrity: sha512-yhlQgA6mnOJUKOsRUFsgJdQCvkKhcz8tlZG5HBQfReYZy46OwLcY+Zia0mtdHsOo9y/hP+CxMN0TU9QxoOtG4g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1470 | <code>    engines: {node: '&gt;=6 &lt;7 &#124;&#124; &gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1472 | <code>  fs-extra@9.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1473 | <code>    resolution: {integrity: sha512-hcg3ZmepS30/7BSFqRvoo3DOMQu7IjqxO5nCDt+zM9XWjb33Wg7ziNT+Qvqbuc3+gWpzO02JubVyk2G4Zvo1OQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1474 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1476 | <code>  fs-minipass@3.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1477 | <code>    resolution: {integrity: sha512-XUBA9XClHbnJWSfBzjkm6RvPsyg3sryZt06BEQoXcF7EK/xpGaQYJgQKDJSUH5SGZ76Y7pFx1QBnXz09rU5Fbw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1478 | <code>    engines: {node: ^14.17.0 &#124;&#124; ^16.13.0 &#124;&#124; &gt;=18.0.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1480 | <code>  fs.realpath@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1481 | <code>    resolution: {integrity: sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1483 | <code>  fsevents@2.3.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1484 | <code>    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1485 | <code>    engines: {node: ^8.16.0 &#124;&#124; ^10.6.0 &#124;&#124; &gt;=11.0.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1486 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1488 | <code>  fstream@1.0.12:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1489 | <code>    resolution: {integrity: sha512-WvJ193OHa0GHPEL+AycEJgxvBEwyfRkN1vhjca23OaPVMCaLCXTd5qAu82AjTcgP1UJmytkOKb63Ypde7raDIg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1490 | <code>    engines: {node: '&gt;=0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1491 | <code>    deprecated: This package is no longer supported.</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 1492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1493 | <code>  function-bind@1.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1494 | <code>    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1496 | <code>  get-caller-file@2.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1497 | <code>    resolution: {integrity: sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1498 | <code>    engines: {node: 6.* &#124;&#124; 8.* &#124;&#124; &gt;= 10.*}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1500 | <code>  get-intrinsic@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1501 | <code>    resolution: {integrity: sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1502 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1504 | <code>  get-proto@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1505 | <code>    resolution: {integrity: sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1506 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1508 | <code>  get-stream@5.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1509 | <code>    resolution: {integrity: sha512-nBF+F1rAZVCu/p7rjzgA+Yb4lfYXrpl7a6VmJrU8wF9I1CKvP/QwPNZHnOlwbTkY6dvtFIzFMSyQXbLoTQPRpA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1510 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1512 | <code>  github-from-package@0.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1513 | <code>    resolution: {integrity: sha512-SyHy3T1v2NUXn29OsWdxmK6RwHD+vkj3v8en8AOBZ1wBQ/hCAQ5bAQTD02kW4W9tUp/3Qh6J8r9EvntiyCmOOw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1515 | <code>  glob@10.4.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1516 | <code>    resolution: {integrity: sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1517 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1519 | <code>  glob@10.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1520 | <code>    resolution: {integrity: sha512-DfXN8DfhJ7NH3Oe7cFmu3NCu1wKbkReJ8TorzSAFbSKrlNaQSKfIzqYqVY8zlbs2NLBbWpRiU52GX2PbaBVNkg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1521 | <code>    deprecated: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 1522 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1524 | <code>  glob@7.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1525 | <code>    resolution: {integrity: sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1526 | <code>    deprecated: Glob versions prior to v9 are no longer supported</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 1527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1528 | <code>  global-agent@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1529 | <code>    resolution: {integrity: sha512-PT6XReJ+D07JvGoxQMkT6qji/jVNfX/h364XHZOWeRzy64sSFr+xJ5OX7LI3b4MPQzdL4H8Y8M0xzPpsVMwA8Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1530 | <code>    engines: {node: '&gt;=10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1532 | <code>  globalthis@1.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1533 | <code>    resolution: {integrity: sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1534 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1536 | <code>  gopd@1.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1537 | <code>    resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1538 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1540 | <code>  got@11.8.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1541 | <code>    resolution: {integrity: sha512-6tfZ91bOr7bOXnK7PRDCGBLa1H4U080YHNaAQ2KsMGlLEzRbk44nsZF2E1IeRc3vtJHPVbKCYgdFbaGO2ljd8g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1542 | <code>    engines: {node: '&gt;=10.19.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1543 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1544 | <code>  graceful-fs@4.2.11:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1545 | <code>    resolution: {integrity: sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1547 | <code>  guid-typescript@1.0.9:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1548 | <code>    resolution: {integrity: sha512-Y8T4vYhEfwJOTbouREvG+3XDsjr8E3kIr7uf+JZ0BYloFsttiHU0WfvANVsR7TxNUJa/WpCnw/Ino/p+DeBhBQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1550 | <code>  has-flag@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1551 | <code>    resolution: {integrity: sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1552 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1553 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1554 | <code>  has-property-descriptors@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1555 | <code>    resolution: {integrity: sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1556 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1557 | <code>  has-symbols@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1558 | <code>    resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1559 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1561 | <code>  has-tostringtag@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1562 | <code>    resolution: {integrity: sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1563 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1565 | <code>  hasown@2.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1566 | <code>    resolution: {integrity: sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1567 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1568 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1569 | <code>  he@1.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1570 | <code>    resolution: {integrity: sha512-F/1DnUGPopORZi0ni+CvrCgHQ5FyEAHRLSApuYWMmrbSwoN2Mn/7k+Gl38gJnR7yyDZk6WLXwiGod1JOWNDKGw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1571 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1573 | <code>  hono@4.12.23:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1574 | <code>    resolution: {integrity: sha512-eIaZ9qDgu7XV0pxOCrg7/WhnQ6Ivm22UcxhXx/A3dcbqbbYgBEkc6e/J/s7j2tS96zoB0S9VBdLwQNCWwUo4LA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1575 | <code>    engines: {node: '&gt;=16.9.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1577 | <code>  hosted-git-info@4.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1578 | <code>    resolution: {integrity: sha512-kyCuEOWjJqZuDbRHzL8V93NzQhwIB71oFWSyzVo+KPZI+pnQPPxucdkrOZvkLRnrf5URsQM+IJ09Dw29cRALIA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1579 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1581 | <code>  html-to-text@9.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1582 | <code>    resolution: {integrity: sha512-qY60FjREgVZL03vJU6IfMV4GDjGBIoOyvuFdpBDIX9yTlDw0TjxVBQp+P8NvpdIXNJvfWBTNul7fsAQJq2FNpg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1583 | <code>    engines: {node: '&gt;=14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1584 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1585 | <code>  htmlparser2@8.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1586 | <code>    resolution: {integrity: sha512-GYdjWKDkbRLkZ5geuHs5NY1puJ+PXwP7+fHPRz06Eirsb9ugf6d8kkXav6ADhcODhFFPMIXyxkxSuMf3D6NCFA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1588 | <code>  http-cache-semantics@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1589 | <code>    resolution: {integrity: sha512-dTxcvPXqPvXBQpq5dUr6mEMJX4oIEFv6bwom3FDwKRDsuIjjJGANqhBuoAn9c1RQJIdAKav33ED65E2ys+87QQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1591 | <code>  http-errors@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1592 | <code>    resolution: {integrity: sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1593 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1594 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1595 | <code>  http-proxy-agent@7.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1596 | <code>    resolution: {integrity: sha512-T1gkAiYYDWYx3V5Bmyu7HcfcvL7mUrTWiM6yOfa3PIphViJ/gFPbvidQ+veqSOHci/PxBcDabeUNCzpOODJZig==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1597 | <code>    engines: {node: '&gt;= 14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1599 | <code>  http2-wrapper@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1600 | <code>    resolution: {integrity: sha512-V+23sDMr12Wnz7iTcDeJr3O6AIxlnvT/bmaAAAP/Xda35C90p9599p0F1eHR/N1KILWSoWVAiOMFjBBXaXSMxg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1601 | <code>    engines: {node: '&gt;=10.19.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1603 | <code>  https-proxy-agent@7.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1604 | <code>    resolution: {integrity: sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1605 | <code>    engines: {node: '&gt;= 14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1607 | <code>  iconv-corefoundation@1.1.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1608 | <code>    resolution: {integrity: sha512-T10qvkw0zz4wnm560lOEg0PovVqUXuOFhhHAkixw8/sycy7TJt7v/RrkEKEQnAw2viPSJu6iAkErxnzR0g8PpQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1609 | <code>    engines: {node: ^8.11.2 &#124;&#124; &gt;=10}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1610 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1611 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1612 | <code>  iconv-lite@0.6.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1613 | <code>    resolution: {integrity: sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1614 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1615 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1616 | <code>  iconv-lite@0.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1617 | <code>    resolution: {integrity: sha512-im9DjEDQ55s9fL4EYzOAv0yMqmMBSZp6G0VvFyTMPKWxiSBHUj9NW/qqLmXUwXrrM7AvqSlTCfvqRb0cM8yYqw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1618 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1620 | <code>  ieee754@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1621 | <code>    resolution: {integrity: sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1622 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1623 | <code>  imapflow@1.3.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1624 | <code>    resolution: {integrity: sha512-lx7nWcUDfNgITEKYYfunUDqJ3LT6ImuiA1ReqJepVEA2nqBQNUqa3ppF7Yz5CNjuDYG95pmzsCcNqRjMrwh/Vg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1626 | <code>  immediate@3.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1627 | <code>    resolution: {integrity: sha512-XXOFtyqDjNDAQxVfYxuF7g9Il/IbWmmlQg2MYKOH8ExIT1qg6xc4zyS3HaEEATgs1btfzxq15ciUiY7gjSXRGQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1628 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1629 | <code>  imurmurhash@0.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1630 | <code>    resolution: {integrity: sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1631 | <code>    engines: {node: '&gt;=0.8.19'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1632 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1633 | <code>  inflight@1.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1634 | <code>    resolution: {integrity: sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1635 | <code>    deprecated: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 1636 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1637 | <code>  inherits@2.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1638 | <code>    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1639 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1640 | <code>  ini@1.3.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1641 | <code>    resolution: {integrity: sha512-JV/yugV2uzW5iMRSiZAyDtQd+nxtUnjeLt0acNdw98kKLrvuRVyB80tsREOE7yvGVgalhZ6RNXCmEHkUKBKxew==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1642 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1643 | <code>  ip-address@10.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1644 | <code>    resolution: {integrity: sha512-XXADHxXmvT9+CRxhXg56LJovE+bmWnEWB78LB83VZTprKTmaC5QfruXocxzTZ2Kl0DNwKuBdlIhjL8LeY8Sf8Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1645 | <code>    engines: {node: '&gt;= 12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1647 | <code>  ip-address@10.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1648 | <code>    resolution: {integrity: sha512-/+S6j4E9AHvW9SWMSEY9Xfy66O5PWvVEJ08O0y5JGyEKQpojb0K0GKpz/v5HJ/G0vi3D2sjGK78119oXZeE0qA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1649 | <code>    engines: {node: '&gt;= 12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1651 | <code>  ipaddr.js@1.9.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1652 | <code>    resolution: {integrity: sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1653 | <code>    engines: {node: '&gt;= 0.10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1655 | <code>  is-arrayish@0.3.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1656 | <code>    resolution: {integrity: sha512-m6UrgzFVUYawGBh1dUsWR5M2Clqic9RVXC/9f8ceNlv2IcO9j9J/z8UoCLPqtsPBFNzEpfR3xftohbfqDx8EQA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1658 | <code>  is-fullwidth-code-point@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1659 | <code>    resolution: {integrity: sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1660 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1662 | <code>  is-interactive@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1663 | <code>    resolution: {integrity: sha512-2HvIEKRoqS62guEC+qBjpvRubdX910WCMuJTZ+I9yvqKU2/12eSL549HMwtabb4oupdj2sMP50k+XJfB/8JE6w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1664 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1666 | <code>  is-promise@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1667 | <code>    resolution: {integrity: sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1669 | <code>  is-unicode-supported@0.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1670 | <code>    resolution: {integrity: sha512-knxG2q4UC3u8stRGyAVJCOdxFmv5DZiRcdlIaAQXAbSfJya+OhopNotLQrstBhququ4ZpuKbDc/8S6mgXgPFPw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1671 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1673 | <code>  isarray@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1674 | <code>    resolution: {integrity: sha512-VLghIWNM6ELQzo7zwmcg0NmTVyWKYjvIeM83yjp0wRDTmUnrM678fQbcKBo6n2CJEF0szoG//ytg+TKla89ALQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1675 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1676 | <code>  isbinaryfile@4.0.10:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1677 | <code>    resolution: {integrity: sha512-iHrqe5shvBUcFbmZq9zOQHBoeOhZJu6RQGrDpBgenUm/Am+F3JM2MgQj+rK3Z601fzrL5gLZWtAPH2OBaSVcyw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1678 | <code>    engines: {node: '&gt;= 8.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1680 | <code>  isbinaryfile@5.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1681 | <code>    resolution: {integrity: sha512-gnWD14Jh3FzS3CPhF0AxNOJ8CxqeblPTADzI38r0wt8ZyQl5edpy75myt08EG2oKvpyiqSqsx+Wkz9vtkbTqYQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1682 | <code>    engines: {node: '&gt;= 18.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1683 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1684 | <code>  isexe@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1685 | <code>    resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1687 | <code>  isexe@3.1.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1688 | <code>    resolution: {integrity: sha512-6B3tLtFqtQS4ekarvLVMZ+X+VlvQekbe4taUkf/rhVO3d/h0M2rfARm/pXLcPEsjjMsFgrFgSrhQIxcSVrBz8w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1689 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1690 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1691 | <code>  jackspeak@3.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1692 | <code>    resolution: {integrity: sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1694 | <code>  jake@10.9.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1695 | <code>    resolution: {integrity: sha512-wpHYzhxiVQL+IV05BLE2Xn34zW1S223hvjtqk0+gsPrwd/8JNLXJgZZM/iPFsYc1xyphF+6M6EvdE5E9MBGkDA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1696 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1697 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1699 | <code>  jiti@2.6.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1700 | <code>    resolution: {integrity: sha512-ekilCSN1jwRvIbgeg/57YFh8qQDNbwDb9xT/qu2DAHbFFZUicIl4ygVaAvzveMhMVr3LnpSKTNnwt8PoOfmKhQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1701 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1703 | <code>  joi@18.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1704 | <code>    resolution: {integrity: sha512-rF5MAmps5esSlhCA+N1b6IYHDw9j/btzGaqfgie522jS02Ju/HXBxamlXVlKEHAxoMKQL77HWI8jlqWsFuekZA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1705 | <code>    engines: {node: '&gt;= 20'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1707 | <code>  jose@6.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1708 | <code>    resolution: {integrity: sha512-YYVDInQKFJfR/xa3ojUTl8c2KoTwiL1R5Wg9YCydwH0x0B9grbzlg5HC7mMjCtUJjbQ/YnGEZIhI5tCgfTb4Hw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1710 | <code>  js-tokens@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1711 | <code>    resolution: {integrity: sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1713 | <code>  js-yaml@4.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1714 | <code>    resolution: {integrity: sha512-qQKT4zQxXl8lLwBtHMWwaTcGfFOZviOJet3Oy/xmGk2gZH677CJM9EvtfdSkgWcATZhj/55JZ0rmy3myCT5lsA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1715 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1717 | <code>  jsesc@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1718 | <code>    resolution: {integrity: sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1719 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1720 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1722 | <code>  json-buffer@3.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1723 | <code>    resolution: {integrity: sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1724 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1725 | <code>  json-schema-traverse@0.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1726 | <code>    resolution: {integrity: sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1728 | <code>  json-schema-traverse@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1729 | <code>    resolution: {integrity: sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1731 | <code>  json-schema-typed@8.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1732 | <code>    resolution: {integrity: sha512-fQhoXdcvc3V28x7C7BMs4P5+kNlgUURe2jmUT1T//oBRMDrqy1QPelJimwZGo7Hg9VPV3EQV5Bnq4hbFy2vetA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1734 | <code>  json-stringify-safe@5.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1735 | <code>    resolution: {integrity: sha512-ZClg6AaYvamvYEE82d3Iyd3vSSIjQ+odgjaTzRuO3s7toCdFKczob2i0zCh7JE8kWn17yvAWhUVxvqGwUalsRA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1737 | <code>  json5@2.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1738 | <code>    resolution: {integrity: sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1739 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1740 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1741 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1742 | <code>  jsonfile@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1743 | <code>    resolution: {integrity: sha512-m6F1R3z8jjlf2imQHS2Qez5sjKWQzbuuhuJ/FKYFRZvPE3PuHcSMVZzfsLhGVOkfd20obL5SWEBew5ShlquNxg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1745 | <code>  jsonfile@6.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1746 | <code>    resolution: {integrity: sha512-FGuPw30AdOIUTRMC2OMRtQV+jkVj2cfPqSeWXv1NEAJ1qZ5zb1X6z1mFhbfOB/iy3ssJCD+3KuZ8r8C3uVFlAg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1748 | <code>  jszip@3.10.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1749 | <code>    resolution: {integrity: sha512-xXDvecyTpGLrqFrvkrUSoxxfJI5AH7U8zxxtVclpsUtMCq4JQ290LY8AW5c7Ggnr/Y/oK+bQMbqK2qmtk3pN4g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1751 | <code>  keyv@4.5.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1752 | <code>    resolution: {integrity: sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1753 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1754 | <code>  lazy-val@1.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1755 | <code>    resolution: {integrity: sha512-0/BnGCCfyUMkBpeDgWihanIAF9JmZhHBgUhEqzvf+adhNGLoP6TaiI5oF8oyb3I45P+PcnrqihSf01M0l0G5+Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1757 | <code>  lazystream@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1758 | <code>    resolution: {integrity: sha512-b94GiNHQNy6JNTrt5w6zNyffMrNkXZb3KTkCZJb2V1xaEGCk093vkZ2jk3tpaeP33/OiXC+WvK9AxUebnf5nbw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1759 | <code>    engines: {node: '&gt;= 0.6.3'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1760 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1761 | <code>  leac@0.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1762 | <code>    resolution: {integrity: sha512-y+SqErxb8h7nE/fiEX07jsbuhrpO9lL8eca7/Y1nuWV2moNlXhyd59iDGcRf6moVyDMbmTNzL40SUyrFU/yDpg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1763 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1764 | <code>  libbase64@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1765 | <code>    resolution: {integrity: sha512-GgOXd0Eo6phYgh0DJtjQ2tO8dc0IVINtZJeARPeiIJqge+HdsWSuaDTe8ztQ7j/cONByDZ3zeB325AHiv5O0dg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1767 | <code>  libmime@5.3.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1768 | <code>    resolution: {integrity: sha512-FlDb3Wtha8P01kTL3P9M+ZDNDWPKPmKHWaU/cG/lg5pfuAwdflVpZE+wm9m7pKmC5ww6s+zTxBKS1p6yl3KpSw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1769 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1770 | <code>  libmime@5.3.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1771 | <code>    resolution: {integrity: sha512-ZrCY+Q66mPvasAfjsQ/IgahzoBvfE1VdtGRpo1hwRB1oK3wJKxhKA3GOcd2a6j7AH5eMFccxK9fBoCpRZTf8ng==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1773 | <code>  libqp@2.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1774 | <code>    resolution: {integrity: sha512-0Wd+GPz1O134cP62YU2GTOPNA7Qgl09XwCqM5zpBv87ERCXdfDtyKXvV7c9U22yWJh44QZqBocFnXN11K96qow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1775 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1776 | <code>  lie@3.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1777 | <code>    resolution: {integrity: sha512-UaiMJzeWRlEujzAuw5LokY1L5ecNQYZKfmyZ9L7wDHb/p5etKaxXhohBcrw0EYby+G/NA52vRSN4N39dxHAIwQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1779 | <code>  lightningcss-android-arm64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1780 | <code>    resolution: {integrity: sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1781 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1782 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1783 | <code>    os: [android]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1785 | <code>  lightningcss-darwin-arm64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1786 | <code>    resolution: {integrity: sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1787 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1788 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1789 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1791 | <code>  lightningcss-darwin-x64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1792 | <code>    resolution: {integrity: sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1793 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1794 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1795 | <code>    os: [darwin]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1796 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1797 | <code>  lightningcss-freebsd-x64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1798 | <code>    resolution: {integrity: sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1799 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1800 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1801 | <code>    os: [freebsd]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1803 | <code>  lightningcss-linux-arm-gnueabihf@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1804 | <code>    resolution: {integrity: sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1805 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1806 | <code>    cpu: [arm]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1807 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1809 | <code>  lightningcss-linux-arm64-gnu@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1810 | <code>    resolution: {integrity: sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1811 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1812 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1813 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1814 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 1815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1816 | <code>  lightningcss-linux-arm64-musl@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1817 | <code>    resolution: {integrity: sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1818 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1819 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1820 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1821 | <code>    libc: [musl]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 1822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1823 | <code>  lightningcss-linux-x64-gnu@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1824 | <code>    resolution: {integrity: sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1825 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1826 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1827 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1828 | <code>    libc: [glibc]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 1829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1830 | <code>  lightningcss-linux-x64-musl@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1831 | <code>    resolution: {integrity: sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1832 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1833 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1834 | <code>    os: [linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1835 | <code>    libc: [musl]</code> | 配置键 `libc`：为构建、部署、依赖或运行时声明参数。 |
| 1836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1837 | <code>  lightningcss-win32-arm64-msvc@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1838 | <code>    resolution: {integrity: sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1839 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1840 | <code>    cpu: [arm64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1841 | <code>    os: [win32]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1843 | <code>  lightningcss-win32-x64-msvc@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1844 | <code>    resolution: {integrity: sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1845 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1846 | <code>    cpu: [x64]</code> | 配置键 `cpu`：为构建、部署、依赖或运行时声明参数。 |
| 1847 | <code>    os: [win32]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 1848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1849 | <code>  lightningcss@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1850 | <code>    resolution: {integrity: sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1851 | <code>    engines: {node: '&gt;= 12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1853 | <code>  linkify-it@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1854 | <code>    resolution: {integrity: sha512-5aHCbzQRADcdP+ATqnDuhhJ/MRIqDkZX5pyjFHRRysS8vZ5AbqGEoFIb6pYHPZ+L/OC2Lc+xT8uHVVR5CAK/wQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1855 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1856 | <code>  listenercount@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1857 | <code>    resolution: {integrity: sha512-3mk/Zag0+IJxeDrxSgaDPy4zZ3w05PRZeJNnlWhzFz5OkX49J4krc+A8X2d2M69vGMBEX0uyl8M+W+8gH+kBqQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1858 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1859 | <code>  lodash.defaults@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1860 | <code>    resolution: {integrity: sha512-qjxPLHd3r5DnsdGacqOMU6pb/avJzdh9tFX2ymgoZE27BmjXrNy/y4LoaiTeAb+O3gL8AfpJGtqfX/ae2leYYQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1862 | <code>  lodash.difference@4.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1863 | <code>    resolution: {integrity: sha512-dS2j+W26TQ7taQBGN8Lbbq04ssV3emRw4NY58WErlTO29pIqS0HmoT5aJ9+TUQ1N3G+JOZSji4eugsWwGp9yPA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1865 | <code>  lodash.escaperegexp@4.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1866 | <code>    resolution: {integrity: sha512-TM9YBvyC84ZxE3rgfefxUWiQKLilstD6k7PTGt6wfbtXF8ixIJLOL3VYyV/z+ZiPLsVxAsKAFVwWlWeb2Y8Yyw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1868 | <code>  lodash.flatten@4.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1869 | <code>    resolution: {integrity: sha512-C5N2Z3DgnnKr0LOpv/hKCgKdb7ZZwafIrsesve6lmzvZIRZRGaZ/l6Q8+2W7NaT+ZwO3fFlSCzCzrDCFdJfZ4g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1871 | <code>  lodash.groupby@4.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1872 | <code>    resolution: {integrity: sha512-5dcWxm23+VAoz+awKmBaiBvzox8+RqMgFhi7UvX9DHZr2HdxHXM/Wrf8cfKpsW37RNrvtPn6hSwNqurSILbmJw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1874 | <code>  lodash.isboolean@3.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1875 | <code>    resolution: {integrity: sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1876 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1877 | <code>  lodash.isequal@4.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1878 | <code>    resolution: {integrity: sha512-pDo3lu8Jhfjqls6GkMgpahsF9kCyayhgykjyLMNFTKWrpVdAQtYyB4muAMWozBB4ig/dtWAmsMxLEI8wuz+DYQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1879 | <code>    deprecated: This package is deprecated. Use require('node:util').isDeepStrictEqual instead.</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 1880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1881 | <code>  lodash.isfunction@3.0.9:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1882 | <code>    resolution: {integrity: sha512-AirXNj15uRIMMPihnkInB4i3NHeb4iBtNg9WRWuK2o31S+ePwwNmDPaTL3o7dTJ+VXNZim7rFs4rxN4YU1oUJw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1883 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1884 | <code>  lodash.isnil@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1885 | <code>    resolution: {integrity: sha512-up2Mzq3545mwVnMhTDMdfoG1OurpA/s5t88JmQX809eH3C8491iu2sfKhTfhQtKY78oPNhiaHJUpT/dUDAAtng==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1887 | <code>  lodash.isplainobject@4.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1888 | <code>    resolution: {integrity: sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1890 | <code>  lodash.isundefined@3.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1891 | <code>    resolution: {integrity: sha512-MXB1is3s899/cD8jheYYE2V9qTHwKvt+npCwpD+1Sxm3Q3cECXCiYHjeHWXNwr6Q0SOBPrYUDxendrO6goVTEA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1892 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1893 | <code>  lodash.union@4.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1894 | <code>    resolution: {integrity: sha512-c4pB2CdGrGdjMKYLA+XiRDO7Y0PRQbm/Gzg8qMj+QH+pFVAoTp5sBpO0odL3FjoPCGjK96p6qsP+yQoiLoOBcw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1896 | <code>  lodash.uniq@4.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1897 | <code>    resolution: {integrity: sha512-xfBaXQd9ryd9dlSDvnvI0lvxfLJlYAZzXomUYzLKtUeOQvOP5piqAWuGtrhWeqaXK9hhoM/iyJc5AV+XfsX3HQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1899 | <code>  lodash@4.18.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1900 | <code>    resolution: {integrity: sha512-dMInicTPVE8d1e5otfwmmjlxkZoUpiVLwyeTdUsi/Caj/gfzzblBcCE5sRHV/AsjuCmxWrte2TNGSYuCeCq+0Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1902 | <code>  log-symbols@4.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1903 | <code>    resolution: {integrity: sha512-8XPvpAA8uyhfteu8pIvQxpJZ7SYYdpUivZpGy6sFsBuKRY/7rQGavedeB8aK+Zkyq6upMFVL/9AW6vOYzfRyLg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1904 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1906 | <code>  long@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1907 | <code>    resolution: {integrity: sha512-XsP+KhQif4bjX1kbuSiySJFNAehNxgLb6hPRGJ9QsUr8ajHkuXGdrHmFUTUUXhDwVX2R5bY4JNZEwbUiMhV+MA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1909 | <code>  lowercase-keys@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1910 | <code>    resolution: {integrity: sha512-tqNXrS78oMOE73NMxK4EMLQsQowWf8jKooH9g7xPavRT706R6bkQJ6DY2Te7QukaZsulxa30wQ7bk0pm4XiHmA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1911 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1912 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1913 | <code>  lru-cache@10.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1914 | <code>    resolution: {integrity: sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1916 | <code>  lru-cache@6.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1917 | <code>    resolution: {integrity: sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1918 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1920 | <code>  mailparser@3.9.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1921 | <code>    resolution: {integrity: sha512-7jSlFGXiianVnhnb6wdutJFloD34488nrHY7r6FNqwXAhZ7YiJDYrKKTxZJ0oSrXcAPHm8YoYnh97xyGtrBQ3w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1923 | <code>  make-fetch-happen@14.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1924 | <code>    resolution: {integrity: sha512-QMjGbFTP0blj97EeidG5hk/QhKQ3T4ICckQGLgz38QF7Vgbk6e6FTARN8KhKxyBbWn8R0HU+bnw8aSoFPD4qtQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1925 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1927 | <code>  matcher@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1928 | <code>    resolution: {integrity: sha512-OkeDaAZ/bQCxeFAozM55PKcKU0yJMPGifLwV4Qgjitu+5MoAfSQN4lsLJeXZ1b8w0x+/Emda6MZgXS1jvsapng==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1929 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1931 | <code>  math-intrinsics@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1932 | <code>    resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1933 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1935 | <code>  media-typer@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1936 | <code>    resolution: {integrity: sha512-aisnrDP4GNe06UcKFnV5bfMNPBUw4jsLGaWwWfnH3v02GnBuXX2MCVn5RbrWo0j3pczUilYblq7fQ7Nw2t5XKw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1937 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1938 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1939 | <code>  merge-descriptors@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1940 | <code>    resolution: {integrity: sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1941 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1943 | <code>  mime-db@1.52.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1944 | <code>    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1945 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1947 | <code>  mime-db@1.54.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1948 | <code>    resolution: {integrity: sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1949 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1951 | <code>  mime-types@2.1.35:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1952 | <code>    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1953 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1954 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1955 | <code>  mime-types@3.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1956 | <code>    resolution: {integrity: sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1957 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1958 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1959 | <code>  mime@2.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1960 | <code>    resolution: {integrity: sha512-USPkMeET31rOMiarsBNIHZKLGgvKc/LrjofAnBlOttf5ajRvqiRA8QsenbcooctK6d6Ts6aqZXBA+XbkKthiQg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1961 | <code>    engines: {node: '&gt;=4.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1962 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 1963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1964 | <code>  mimic-fn@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1965 | <code>    resolution: {integrity: sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1966 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1968 | <code>  mimic-response@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1969 | <code>    resolution: {integrity: sha512-j5EctnkH7amfV/q5Hgmoal1g2QHFJRraOtmx0JpIqkxhBhI/lJSl1nMpQ45hVarwNETOoWEimndZ4QK0RHxuxQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1970 | <code>    engines: {node: '&gt;=4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1972 | <code>  mimic-response@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1973 | <code>    resolution: {integrity: sha512-z0yWI+4FDrrweS8Zmt4Ej5HdJmky15+L2e6Wgn3+iK5fWzb6T3fhNFq2+MeTRb064c6Wr4N/wv0DzQTjNzHNGQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1974 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1975 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1976 | <code>  minimatch@10.2.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1977 | <code>    resolution: {integrity: sha512-MULkVLfKGYDFYejP07QOurDLLQpcjk7Fw+7jXS2R2czRQzR56yHRveU5NDJEOviH+hETZKSkIk5c+T23GjFUMg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1978 | <code>    engines: {node: 18 &#124;&#124; 20 &#124;&#124; &gt;=22}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1979 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1980 | <code>  minimatch@3.1.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1981 | <code>    resolution: {integrity: sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1982 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1983 | <code>  minimatch@5.1.9:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1984 | <code>    resolution: {integrity: sha512-7o1wEA2RyMP7Iu7GNba9vc0RWWGACJOCZBJX2GJWip0ikV+wcOsgVuY9uE8CPiyQhkGFSlhuSkZPavN7u1c2Fw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1985 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1986 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1987 | <code>  minimatch@9.0.9:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1988 | <code>    resolution: {integrity: sha512-OBwBN9AL4dqmETlpS2zasx+vTeWclWzkblfZk7KTA5j3jeOONz/tRCnZomUyvNg83wL5Zv9Ss6HMJXAgL8R2Yg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1989 | <code>    engines: {node: '&gt;=16 &#124;&#124; 14 &gt;=14.17'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1990 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1991 | <code>  minimist@1.2.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1992 | <code>    resolution: {integrity: sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1993 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1994 | <code>  minipass-collect@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1995 | <code>    resolution: {integrity: sha512-D7V8PO9oaz7PWGLbCACuI1qEOsq7UKfLotx/C0Aet43fCUB/wfQ7DYeq2oR/svFJGYDHPr38SHATeaj/ZoKHKw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 1996 | <code>    engines: {node: '&gt;=16 &#124;&#124; 14 &gt;=14.17'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 1997 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1998 | <code>  minipass-fetch@4.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 1999 | <code>    resolution: {integrity: sha512-j7U11C5HXigVuutxebFadoYBbd7VSdZWggSe64NVdvWNBqGAiXPL2QVCehjmw7lY1oF9gOllYbORh+hiNgfPgQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2000 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2001 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2002 | <code>  minipass-flush@1.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2003 | <code>    resolution: {integrity: sha512-TbqTz9cUwWyHS2Dy89P3ocAGUGxKjjLuR9z8w4WUTGAVgEj17/4nhgo2Du56i0Fm3Pm30g4iA8Lcqctc76jCzA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2004 | <code>    engines: {node: '&gt;= 8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2005 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2006 | <code>  minipass-pipeline@1.2.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2007 | <code>    resolution: {integrity: sha512-xuIq7cIOt09RPRJ19gdi4b+RiNvDFYe5JH+ggNvBqGqpQXcru3PcRmOZuHBKWK1Txf9+cQ+HMVN4d6z46LZP7A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2008 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2009 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2010 | <code>  minipass-sized@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2011 | <code>    resolution: {integrity: sha512-MbkQQ2CTiBMlA2Dm/5cY+9SWFEN8pzzOXi6rlM5Xxq0Yqbda5ZQy9sU75a673FE9ZK0Zsbr6Y5iP6u9nktfg2g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2012 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2014 | <code>  minipass@3.3.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2015 | <code>    resolution: {integrity: sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2016 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2018 | <code>  minipass@7.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2019 | <code>    resolution: {integrity: sha512-tEBHqDnIoM/1rXME1zgka9g6Q2lcoCkxHLuc7ODJ5BxbP5d4c2Z5cGgtXAku59200Cx7diuHTOYfSBD8n6mm8A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2020 | <code>    engines: {node: '&gt;=16 &#124;&#124; 14 &gt;=14.17'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2021 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2022 | <code>  minizlib@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2023 | <code>    resolution: {integrity: sha512-KZxYo1BUkWD2TVFLr0MQoM8vUUigWD3LlD83a/75BqC+4qE0Hb1Vo5v1FgcfaNXvfXzr+5EhQ6ing/CaBijTlw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2024 | <code>    engines: {node: '&gt;= 18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2026 | <code>  mkdirp-classic@0.5.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2027 | <code>    resolution: {integrity: sha512-gKLcREMhtuZRwRAfqP3RFW+TK4JqApVBtOIftVgjuABpAtpxhPGaDcfvbhNvD0B8iD1oUr/txX35NjcaY6Ns/A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2028 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2029 | <code>  mkdirp@0.5.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2030 | <code>    resolution: {integrity: sha512-FP+p8RB8OWpF3YZBCrP5gtADmtXApB5AMLn+vdyA+PyxCjrCs00mjyUozssO33cwDeT3wNGdLxJ5M//YqtHAJw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2031 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2032 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2033 | <code>  ms@2.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2034 | <code>    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2036 | <code>  nanoid@3.3.11:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2037 | <code>    resolution: {integrity: sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2038 | <code>    engines: {node: ^10 &#124;&#124; ^12 &#124;&#124; ^13.7 &#124;&#124; ^14 &#124;&#124; &gt;=15.0.1}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2039 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2040 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2041 | <code>  napi-build-utils@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2042 | <code>    resolution: {integrity: sha512-GEbrYkbfF7MoNaoh2iGG84Mnf/WZfB0GdGEsM8wz7Expx/LlWf5U8t9nvJKXSp3qr5IsEbK04cBGhol/KwOsWA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2044 | <code>  negotiator@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2045 | <code>    resolution: {integrity: sha512-8Ofs/AUQh8MaEcrlq5xOX0CQ9ypTF5dl78mjlMNfOK08fzpgTHQRQPBxcPlEtIw0yRpws+Zo/3r+5WRby7u3Gg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2046 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2048 | <code>  node-abi@3.92.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2049 | <code>    resolution: {integrity: sha512-KdHvFWZjEKDf0cakgFjebl371GPsISX2oZHcuyKqM7DtogIsHrqKeLTo8wBHxaXRAQlY2PsPlZmfo+9ZCxEREQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2050 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2051 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2052 | <code>  node-abi@4.28.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2053 | <code>    resolution: {integrity: sha512-Qfp5XZL1cJDOabOT8H5gnqMTmM4NjvYzHp4I/Kt/Sl76OVkOBBHRFlPspGV0hYvMoqQsypFjT/Yp7Km0beXW9g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2054 | <code>    engines: {node: '&gt;=22.12.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2055 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2056 | <code>  node-addon-api@1.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2057 | <code>    resolution: {integrity: sha512-ibPK3iA+vaY1eEjESkQkM0BbCqFOaZMiXRTtdB0u7b4djtY6JnsjvPdUHVMg6xQt3B8fpTTWHI9A+ADjM9frzg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2059 | <code>  node-addon-api@6.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2060 | <code>    resolution: {integrity: sha512-+eawOlIgy680F0kBzPUNFhMZGtJ1YmqM6l4+Crf4IkImjYrO/mqPwRMh352g23uIaQKFItcQ64I7KMaJxHgAVA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2061 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2062 | <code>  node-addon-api@7.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2063 | <code>    resolution: {integrity: sha512-5m3bsyrjFWE1xf7nz7YXdN4udnVtXK6/Yfgn5qnahL6bCkf2yKt4k3nuTKAtT4r3IG8JNR2ncsIMdZuAzJjHQQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2064 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2065 | <code>  node-api-version@0.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2066 | <code>    resolution: {integrity: sha512-2xP/IGGMmmSQpI1+O/k72jF/ykvZ89JeuKX3TLJAYPDVLUalrshrLHkeVcCCZqG/eEa635cr8IBYzgnDvM2O8Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2067 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2068 | <code>  node-gyp@11.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2069 | <code>    resolution: {integrity: sha512-ra7Kvlhxn5V9Slyus0ygMa2h+UqExPqUIkfk7Pc8QTLT956JLSy51uWFwHtIYy0vI8cB4BDhc/S03+880My/LQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2070 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2071 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2072 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2073 | <code>  node-pty@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2074 | <code>    resolution: {integrity: sha512-20JqtutY6JPXTUnL0ij1uad7Qe1baT46lyolh2sSENDd4sTzKZ4nmAFkeAARDKwmlLjPx6XKRlwRUxwjOy+lUg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2075 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2076 | <code>  nodemailer@8.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2077 | <code>    resolution: {integrity: sha512-0PF8Yb1yZuQfQbq+5/pZJrtF6WQcjTd5/S4JOHs9PGFxuTqoB/icwuB44pOdURHJbRKX1PPoJZtY7R4VUoCC8w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2078 | <code>    engines: {node: '&gt;=6.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2079 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2080 | <code>  nodemailer@8.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2081 | <code>    resolution: {integrity: sha512-pkjE4mkBzQjdJT4/UmlKl3pX0rC9fZmjh7c6C9o7lv66Ac6w9WCnzPzhbPNxwZAzlF4mdq4CSWB5+FbK6FWCow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2082 | <code>    engines: {node: '&gt;=6.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2083 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2084 | <code>  nopt@8.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2085 | <code>    resolution: {integrity: sha512-ieGu42u/Qsa4TFktmaKEwM6MQH0pOWnaB3htzh0JRtx84+Mebc0cbZYN5bC+6WTZ4+77xrL9Pn5m7CV6VIkV7A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2086 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2087 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2089 | <code>  normalize-path@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2090 | <code>    resolution: {integrity: sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2091 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2093 | <code>  normalize-url@6.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2094 | <code>    resolution: {integrity: sha512-DlL+XwOy3NxAQ8xuC0okPgK46iuVNAK01YN7RueYBqqFeGsBjV9XmCAzAdgt+667bCl5kPh9EqKKDwnaPG1I7A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2095 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2096 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2097 | <code>  object-assign@4.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2098 | <code>    resolution: {integrity: sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2099 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2101 | <code>  object-inspect@1.13.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2102 | <code>    resolution: {integrity: sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2103 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2105 | <code>  object-keys@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2106 | <code>    resolution: {integrity: sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2107 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2109 | <code>  on-exit-leak-free@2.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2110 | <code>    resolution: {integrity: sha512-0eJJY6hXLGf1udHwfNftBqH+g73EU4B504nZeKpz1sYRKafAghwxEJunB2O7rDZkL4PGfsMVnTXZ2EjibbqcsA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2111 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2113 | <code>  on-finished@2.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2114 | <code>    resolution: {integrity: sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2115 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2117 | <code>  once@1.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2118 | <code>    resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2120 | <code>  onetime@5.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2121 | <code>    resolution: {integrity: sha512-kbpaSSGJTWdAY5KPVeMOKXSrPtr8C8C7wodJbcsd51jRnmD+GZu8Y0VoU6Dm5Z4vWr0Ig/1NKuWRKf7j5aaYSg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2122 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2124 | <code>  onnx-proto@4.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2125 | <code>    resolution: {integrity: sha512-aldMOB3HRoo6q/phyB6QRQxSt895HNNw82BNyZ2CMh4bjeKv7g/c+VpAFtJuEMVfYLMbRx61hbuqnKceLeDcDA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2127 | <code>  onnxruntime-common@1.14.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2128 | <code>    resolution: {integrity: sha512-3LJpegM2iMNRX2wUmtYfeX/ytfOzNwAWKSq1HbRrKc9+uqG/FsEA0bbKZl1btQeZaXhC26l44NWpNUeXPII7Ew==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2130 | <code>  onnxruntime-node@1.14.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2131 | <code>    resolution: {integrity: sha512-5ba7TWomIV/9b6NH/1x/8QEeowsb+jBEvFzU6z0T4mNsFwdPqXeFUM7uxC6QeSRkEbWu3qEB0VMjrvzN/0S9+w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2132 | <code>    os: [win32, darwin, linux]</code> | 配置键 `os`：为构建、部署、依赖或运行时声明参数。 |
| 2133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2134 | <code>  onnxruntime-web@1.14.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2135 | <code>    resolution: {integrity: sha512-Kcqf43UMfW8mCydVGcX9OMXI2VN17c0p6XvR7IPSZzBf/6lteBzXHvcEVWDPmCKuGombl997HgLqj91F11DzXw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2137 | <code>  ora@5.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2138 | <code>    resolution: {integrity: sha512-5b6Y85tPxZZ7QytO+BQzysW31HJku27cRIlkbAXaNx+BdcVi+LlRFmVXzeF6a7JCwJpyw5c4b+YSVImQIrBpuQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2139 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2141 | <code>  p-cancelable@2.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2142 | <code>    resolution: {integrity: sha512-BZOr3nRQHOntUjTrH8+Lh54smKHoHyur8We1V8DSMVrl5A2malOOwuJRnKRDjSnkoeBh4at6BwEnb5I7Jl31wg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2143 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2145 | <code>  p-limit@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2146 | <code>    resolution: {integrity: sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2147 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2149 | <code>  p-map@7.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2150 | <code>    resolution: {integrity: sha512-tkAQEw8ysMzmkhgw8k+1U/iPhWNhykKnSk4Rd5zLoPJCuJaGRPo6YposrZgaxHKzDHdDWWZvE/Sk7hsL2X/CpQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2151 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2153 | <code>  package-json-from-dist@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2154 | <code>    resolution: {integrity: sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2156 | <code>  pako@1.0.11:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2157 | <code>    resolution: {integrity: sha512-4hLB8Py4zZce5s4yd9XzopqwVv/yGNhV1Bl8NTmCq1763HeK2+EwVTv+leGeL13Dnh2wfbqowVPXCIO0z4taYw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2159 | <code>  parseley@0.12.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2160 | <code>    resolution: {integrity: sha512-e6qHKe3a9HWr0oMRVDTRhKce+bRO8VGQR3NyVwcjwrbhMmFCX9KszEV35+rn4AdilFAq9VPxP/Fe1wC9Qjd2lw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2162 | <code>  parseurl@1.3.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2163 | <code>    resolution: {integrity: sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2164 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2166 | <code>  path-is-absolute@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2167 | <code>    resolution: {integrity: sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2168 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2170 | <code>  path-key@3.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2171 | <code>    resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2172 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2174 | <code>  path-scurry@1.11.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2175 | <code>    resolution: {integrity: sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2176 | <code>    engines: {node: '&gt;=16 &#124;&#124; 14 &gt;=14.18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2178 | <code>  path-to-regexp@8.4.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2179 | <code>    resolution: {integrity: sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2181 | <code>  pdfjs-dist@6.0.227:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2182 | <code>    resolution: {integrity: sha512-/P6M4SXw+70waMVLUM7rdRtvo+dEzqE1t6W/zQNvBETo2MaRa5rrvCcAYdfWGiUzadTgM0lJmRApUrW0d9zgKg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2183 | <code>    engines: {node: '&gt;=22.13.0 &#124;&#124; &gt;=24'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2185 | <code>  pe-library@0.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2186 | <code>    resolution: {integrity: sha512-eRWB5LBz7PpDu4PUlwT0PhnQfTQJlDDdPa35urV4Osrm0t0AqQFGn+UIkU3klZvwJ8KPO3VbBFsXquA6p6kqZw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2187 | <code>    engines: {node: '&gt;=12', npm: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2189 | <code>  peberminta@0.9.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2190 | <code>    resolution: {integrity: sha512-XIxfHpEuSJbITd1H3EeQwpcZbTLHc+VVr8ANI9t5sit565tsI4/xK3KWTUFE2e6QiangUkh3B0jihzmGnNrRsQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2192 | <code>  pend@1.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2193 | <code>    resolution: {integrity: sha512-F3asv42UuXchdzt+xXqfW1OGlVBe+mxa2mqI0pg5yAHZPvFmY3Y6drSf/GQ1A86WgWEN9Kzh/WrgKa6iGcHXLg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2195 | <code>  picocolors@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2196 | <code>    resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2198 | <code>  picomatch@4.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2199 | <code>    resolution: {integrity: sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2200 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2202 | <code>  pino-abstract-transport@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2203 | <code>    resolution: {integrity: sha512-wlfUczU+n7Hy/Ha5j9a/gZNy7We5+cXp8YL+X+PG8S0KXxw7n/JXA3c46Y0zQznIJ83URJiwy7Lh56WLokNuxg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2205 | <code>  pino-std-serializers@7.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2206 | <code>    resolution: {integrity: sha512-BndPH67/JxGExRgiX1dX0w1FvZck5Wa4aal9198SrRhZjH3GxKQUKIBnYJTdj2HDN3UQAS06HlfcSbQj2OHmaw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2208 | <code>  pino@10.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2209 | <code>    resolution: {integrity: sha512-r34yH/GlQpKZbU1BvFFqOjhISRo1MNx1tWYsYvmj6KIRHSPMT2+yHOEb1SG6NMvRoHRF0a07kCOox/9yakl1vg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2210 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2212 | <code>  pinyin-pro@3.28.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2213 | <code>    resolution: {integrity: sha512-oqz8ulwRgtUXRi0vbqEfGNly19zpyCxYrjhkk5TibGcgSW6eNwS5woajCXRwqURi8Ehc2yOFTiB4uNoZ+NJOnA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2215 | <code>  pkce-challenge@5.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2216 | <code>    resolution: {integrity: sha512-wQ0b/W4Fr01qtpHlqSqspcj3EhBvimsdh0KlHhH8HRZnMsEa0ea2fTULOXOS9ccQr3om+GcGRk4e+isrZWV8qQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2217 | <code>    engines: {node: '&gt;=16.20.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2219 | <code>  platform@1.3.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2220 | <code>    resolution: {integrity: sha512-fnWVljUchTro6RiCFvCXBbNhJc2NijN7oIQxbwsyL0buWJPG85v81ehlHI9fXrJsMNgTofEoWIQeClKpgxFLrg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2222 | <code>  plist@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2223 | <code>    resolution: {integrity: sha512-uysumyrvkUX0rX/dEVqt8gC3sTBzd4zoWfLeS29nb53imdaXVvLINYXTI2GNqzaMuvacNx4uJQ8+b3zXR0pkgQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2224 | <code>    engines: {node: '&gt;=10.4.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2226 | <code>  postcss@8.5.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2227 | <code>    resolution: {integrity: sha512-OW/rX8O/jXnm82Ey1k44pObPtdblfiuWnrd8X7GJ7emImCOstunGbXUpp7HdBrFQX6rJzn3sPT397Wp5aCwCHg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2228 | <code>    engines: {node: ^10 &#124;&#124; ^12 &#124;&#124; &gt;=14}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2230 | <code>  postject@1.0.0-alpha.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2231 | <code>    resolution: {integrity: sha512-b9Eb8h2eVqNE8edvKdwqkrY6O7kAwmI8kcnBv1NScolYJbo59XUF0noFq+lxbC1yN20bmC0WBEbDC5H/7ASb0A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2232 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2233 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2235 | <code>  prebuild-install@7.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2236 | <code>    resolution: {integrity: sha512-8Mf2cbV7x1cXPUILADGI3wuhfqWvtiLA1iclTDbFRZkgRQS0NqsPZphna9V+HyTEadheuPmjaJMsbzKQFOzLug==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2237 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2238 | <code>    deprecated: No longer maintained. Please contact the author of the relevant native addon; alternatives are available.</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 2239 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2241 | <code>  proc-log@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2242 | <code>    resolution: {integrity: sha512-Azwzvl90HaF0aCz1JrDdXQykFakSSNPaPoiZ9fm5qJIMHioDZEi7OAdRwSm6rSoPtY3Qutnm3L7ogmg3dc+wbQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2243 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2245 | <code>  process-nextick-args@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2246 | <code>    resolution: {integrity: sha512-3ouUOpQhtgrbOa17J7+uxOTpITYWaGP7/AhoR3+A+/1e9skrzelGi/dXzEYyvbxubEF6Wn2ypscTKiKJFFn1ag==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2248 | <code>  process-warning@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2249 | <code>    resolution: {integrity: sha512-a39t9ApHNx2L4+HBnQKqxxHNs1r7KF+Intd8Q/g1bUh6q0WIp9voPXJ/x0j+ZL45KF1pJd9+q2jLIRMfvEshkA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2251 | <code>  progress@2.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2252 | <code>    resolution: {integrity: sha512-7PiHtLll5LdnKIMw100I+8xJXR5gW2QwWYkT6iJva0bXitZKa/XMrSbdmg3r2Xnaidz9Qumd0VPaMrZlF9V9sA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2253 | <code>    engines: {node: '&gt;=0.4.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2255 | <code>  promise-retry@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2256 | <code>    resolution: {integrity: sha512-y+WKFlBR8BGXnsNlIHFGPZmyDf3DFMoLhaflAnyZgV6rG6xu+JwesTo2Q9R6XwYmtmwAFCkAk3e35jEdoeh/3g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2257 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2259 | <code>  proper-lockfile@4.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2260 | <code>    resolution: {integrity: sha512-TjNPblN4BwAWMXU8s9AEz4JmQxnD1NNL7bNOY/AKUzyamc379FWASUhc/K1pL2noVb+XmZKLL68cjzLsiOAMaA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2262 | <code>  protobufjs@6.11.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2263 | <code>    resolution: {integrity: sha512-k8BHqgPBOtrlougZZqF2uUk5Z7bN8f0wj+3e8M3hvtSv0NBAz4VBy5f6R5Nxq/l+i7mRFTgNZb2trxqTpHNY/A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2264 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2266 | <code>  proxy-addr@2.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2267 | <code>    resolution: {integrity: sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2268 | <code>    engines: {node: '&gt;= 0.10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2270 | <code>  proxy-from-env@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2271 | <code>    resolution: {integrity: sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2272 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2274 | <code>  pump@3.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2275 | <code>    resolution: {integrity: sha512-VS7sjc6KR7e1ukRFhQSY5LM2uBWAUPiOPa/A3mkKmiMwSmRFUITt0xuj+/lesgnCv+dPIEYlkzrcyXgquIHMcA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2277 | <code>  punycode.js@2.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2278 | <code>    resolution: {integrity: sha512-uxFIHU0YlHYhDQtV4R9J6a52SLx28BCjT+4ieh7IGbgwVJWO+km431c4yRlREUAsAmt/uMjQUyQHNEPf0M39CA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2279 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2281 | <code>  punycode@2.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2282 | <code>    resolution: {integrity: sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2283 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2285 | <code>  qs@6.15.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2286 | <code>    resolution: {integrity: sha512-Rzq0KEyX/w/tEybncDgdkZrJgVUsUMk3xjh3t5bv3S1HTAtg+uOYt72+ZfwiQwKdysThkTBdL/rTi6HDmX9Ddw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2287 | <code>    engines: {node: '&gt;=0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2289 | <code>  quick-format-unescaped@4.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2290 | <code>    resolution: {integrity: sha512-tYC1Q1hgyRuHgloV/YXs2w15unPVh8qfu/qCTfhTYamaw7fyhumKa2yGpdSo87vY32rIclj+4fWYQXUMs9EHvg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2292 | <code>  quick-lru@5.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2293 | <code>    resolution: {integrity: sha512-WuyALRjWPDGtt/wzJiadO5AXY+8hZ80hVpe6MyivgraREW751X3SbhRvG3eLKOYN+8VEvqLcf3wdnt44Z4S4SA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2294 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2296 | <code>  range-parser@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2297 | <code>    resolution: {integrity: sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2298 | <code>    engines: {node: '&gt;= 0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2300 | <code>  raw-body@3.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2301 | <code>    resolution: {integrity: sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2302 | <code>    engines: {node: '&gt;= 0.10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2304 | <code>  rc@1.2.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2305 | <code>    resolution: {integrity: sha512-y3bGgqKj3QBdxLbLkomlohkvsA8gdAiUQlSBJnBhfn+BPxg4bc62d8TcBW15wavDfgexCgccckhcZvywyQYPOw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2306 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2308 | <code>  read-binary-file-arch@1.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2309 | <code>    resolution: {integrity: sha512-BNg9EN3DD3GsDXX7Aa8O4p92sryjkmzYYgmgTAc6CA4uGLEDzFfxOxugu21akOxpcXHiEgsYkC6nPsQvLLLmEg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2310 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2312 | <code>  readable-stream@2.3.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2313 | <code>    resolution: {integrity: sha512-8p0AUk4XODgIewSi0l8Epjs+EVnWiK7NoDIEGU0HhE7+ZyY8D1IMY7odu5lRrFXGg71L15KG8QrPmum45RTtdA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2315 | <code>  readable-stream@3.6.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2316 | <code>    resolution: {integrity: sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2317 | <code>    engines: {node: '&gt;= 6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2319 | <code>  readdir-glob@1.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2320 | <code>    resolution: {integrity: sha512-v05I2k7xN8zXvPD9N+z/uhXPaj0sUFCe2rcWZIpBsqxfP7xXFQ0tipAd/wjj1YxWyWtUS5IDJpOG82JKt2EAVA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2322 | <code>  real-require@0.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2323 | <code>    resolution: {integrity: sha512-57frrGM/OCTLqLOAh0mhVA9VBMHd+9U7Zb2THMGdBUoZVOtGbJzjxsYGDJ3A9AYYCP4hn6y1TVbaOfzWtm5GFg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2324 | <code>    engines: {node: '&gt;= 12.13.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2326 | <code>  real-require@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2327 | <code>    resolution: {integrity: sha512-P4nbQYQfePJxRSmY+v/KINxVucm4NF3p3s7pJveMTtom52FR4YGltUQLB8idDXwDDWW+eYrWDFbuzUnjoWHF7g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2329 | <code>  require-directory@2.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2330 | <code>    resolution: {integrity: sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2331 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2333 | <code>  require-from-string@2.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2334 | <code>    resolution: {integrity: sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2335 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2337 | <code>  resedit@1.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2338 | <code>    resolution: {integrity: sha512-vHjcY2MlAITJhC0eRD/Vv8Vlgmu9Sd3LX9zZvtGzU5ZImdTN3+d6e/4mnTyV8vEbyf1sgNIrWxhWlrys52OkEA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2339 | <code>    engines: {node: '&gt;=12', npm: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2341 | <code>  resolve-alpn@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2342 | <code>    resolution: {integrity: sha512-0a1F4l73/ZFZOakJnQ3FvkJ2+gSTQWz/r2KE5OdDY0TxPm5h4GkqkWWfM47T7HsbnOtcJVEF4epCVy6u7Q3K+g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2344 | <code>  responselike@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2345 | <code>    resolution: {integrity: sha512-4gl03wn3hj1HP3yzgdI7d3lCkF95F21Pz4BPGvKHinyQzALR5CapwC8yIi0Rh58DEMQ/SguC03wFj2k0M/mHhw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2347 | <code>  restore-cursor@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2348 | <code>    resolution: {integrity: sha512-l+sSefzHpj5qimhFSE5a8nufZYAM3sBSVMAPtYkmC+4EH2anSGaEMXSD0izRQbu9nfyQ9y5JrVmp7E8oZrUjvA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2349 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2351 | <code>  retry@0.12.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2352 | <code>    resolution: {integrity: sha512-9LkiTwjUh6rT555DtE9rTX+BKByPfrMzEAtnlEtdEwr3Nkffwiihqe2bWADg+OQRjt9gl6ICdmB/ZFDCGAtSow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2353 | <code>    engines: {node: '&gt;= 4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2355 | <code>  rimraf@2.6.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2356 | <code>    resolution: {integrity: sha512-mwqeW5XsA2qAejG46gYdENaxXjx9onRNCfn7L0duuP4hCuTIi/QO7PDK07KJfp1d+izWPrzEJDcSqBa0OZQriA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2357 | <code>    deprecated: Rimraf versions prior to v4 are no longer supported</code> | 配置键 `deprecated`：为构建、部署、依赖或运行时声明参数。 |
| 2358 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2360 | <code>  roarr@2.15.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2361 | <code>    resolution: {integrity: sha512-CHhPh+UNHD2GTXNYhPWLnU8ONHdI+5DI+4EYIAOaiD63rHeYlZvyh8P+in5999TTSFgUYuKUAjzRI4mdh/p+2A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2362 | <code>    engines: {node: '&gt;=8.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2364 | <code>  rolldown@1.0.0-rc.12:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2365 | <code>    resolution: {integrity: sha512-yP4USLIMYrwpPHEFB5JGH1uxhcslv6/hL0OyvTuY+3qlOSJvZ7ntYnoWpehBxufkgN0cvXxppuTu5hHa/zPh+A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2366 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2367 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2369 | <code>  router@2.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2370 | <code>    resolution: {integrity: sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2371 | <code>    engines: {node: '&gt;= 18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2373 | <code>  rxjs@7.8.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2374 | <code>    resolution: {integrity: sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2376 | <code>  safe-buffer@5.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2377 | <code>    resolution: {integrity: sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2379 | <code>  safe-buffer@5.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2380 | <code>    resolution: {integrity: sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2382 | <code>  safe-stable-stringify@2.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2383 | <code>    resolution: {integrity: sha512-b3rppTKm9T+PsVCBEOUR46GWI7fdOs00VKZ1+9c1EWDaDMvjQc6tUwuFyIprgGgTcWoVHSKrU8H31ZHA2e0RHA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2384 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2386 | <code>  safer-buffer@2.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2387 | <code>    resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2389 | <code>  sanitize-filename@1.6.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2390 | <code>    resolution: {integrity: sha512-9ZyI08PsvdQl2r/bBIGubpVdR3RR9sY6RDiWFPreA21C/EFlQhmgo20UZlNjZMMZNubusLhAQozkA0Od5J21Eg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2392 | <code>  sax@1.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2393 | <code>    resolution: {integrity: sha512-6R3J5M4AcbtLUdZmRv2SygeVaM7IhrLXu9BmnOGmmACak8fiUtOsYNWUS4uK7upbmHIBbLBeFeI//477BKLBzA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2394 | <code>    engines: {node: '&gt;=11.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2396 | <code>  saxes@5.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2397 | <code>    resolution: {integrity: sha512-5LBh1Tls8c9xgGjw3QrMwETmTMVk0oFgvrFSvWx62llR2hcEInrKNZ2GZCCuuy2lvWrdl5jhbpeqc5hRYKFOcw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2398 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2400 | <code>  selderee@0.11.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2401 | <code>    resolution: {integrity: sha512-5TF+l7p4+OsnP8BCCvSyZiSPc4x4//p5uPwK8TCnVPJYRmU2aYKMpOXvw8zM5a5JvuuCGN1jmsMwuU2W02ukfA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2403 | <code>  semver-compare@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2404 | <code>    resolution: {integrity: sha512-YM3/ITh2MJ5MtzaM429anh+x2jiLVjqILF4m4oyQB18W7Ggea7BfqdH/wGMK7dDiMghv/6WG7znWMwUDzJiXow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2406 | <code>  semver@5.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2407 | <code>    resolution: {integrity: sha512-cBznnQ9KjJqU67B52RMC65CMarK2600WFnbkcaiwWq3xy/5haFJlshgnpjovMVJ+Hff49d8GEn0b87C5pDQ10g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2408 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2410 | <code>  semver@6.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2411 | <code>    resolution: {integrity: sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2412 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2413 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2414 | <code>  semver@7.7.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2415 | <code>    resolution: {integrity: sha512-vFKC2IEtQnVhpT78h1Yp8wzwrf8CM+MzKMHGJZfBtzhZNycRFnXsHk6E5TxIkkMsgNS7mdX3AGB7x2QM2di4lA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2416 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2417 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2419 | <code>  send@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2420 | <code>    resolution: {integrity: sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2421 | <code>    engines: {node: '&gt;= 18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2423 | <code>  serialize-error@7.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2424 | <code>    resolution: {integrity: sha512-8I8TjW5KMOKsZQTvoxjuSIa7foAwPWGOts+6o7sgjz41/qMD9VQHEDxi6PBvK2l0MXUmqZyNpUK+T2tQaaElvw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2425 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2427 | <code>  serve-static@2.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2428 | <code>    resolution: {integrity: sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2429 | <code>    engines: {node: '&gt;= 18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2431 | <code>  setimmediate@1.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2432 | <code>    resolution: {integrity: sha512-MATJdZp8sLqDl/68LfQmbP8zKPLQNV6BIZoIgrscFDQ+RsvK/BxeDQOgyxKKoh0y/8h3BqVFnCqQ/gd+reiIXA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2434 | <code>  setprototypeof@1.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2435 | <code>    resolution: {integrity: sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2437 | <code>  sharp@0.32.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2438 | <code>    resolution: {integrity: sha512-KyLTWwgcR9Oe4d9HwCwNM2l7+J0dUQwn/yf7S0EnTtb0eVS4RxO0eUSvxPtzT4F3SY+C4K6fqdv/DO27sJ/v/w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2439 | <code>    engines: {node: '&gt;=14.15.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2441 | <code>  shebang-command@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2442 | <code>    resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2443 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2445 | <code>  shebang-regex@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2446 | <code>    resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2447 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2449 | <code>  shell-quote@1.8.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2450 | <code>    resolution: {integrity: sha512-ObmnIF4hXNg1BqhnHmgbDETF8dLPCggZWBjkQfhZpbszZnYur5DUljTcCHii5LC3J5E0yeO/1LIMyH+UvHQgyw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2451 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2453 | <code>  side-channel-list@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2454 | <code>    resolution: {integrity: sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2455 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2457 | <code>  side-channel-map@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2458 | <code>    resolution: {integrity: sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2459 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2461 | <code>  side-channel-weakmap@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2462 | <code>    resolution: {integrity: sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2463 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2465 | <code>  side-channel@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2466 | <code>    resolution: {integrity: sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2467 | <code>    engines: {node: '&gt;= 0.4'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2469 | <code>  signal-exit@3.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2470 | <code>    resolution: {integrity: sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2472 | <code>  signal-exit@4.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2473 | <code>    resolution: {integrity: sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2474 | <code>    engines: {node: '&gt;=14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2476 | <code>  simple-concat@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2477 | <code>    resolution: {integrity: sha512-cSFtAPtRhljv69IK0hTVZQ+OfE9nePi/rtJmw5UjHeVyVroEqJXP1sFztKUy1qU+xvz3u/sfYJLa947b7nAN2Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2479 | <code>  simple-get@4.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2480 | <code>    resolution: {integrity: sha512-brv7p5WgH0jmQJr1ZDDfKDOSeWWg+OVypG99A/5vYGPqJ6pxiaHLy8nxtFjBA7oMa01ebA9gfh1uMCFqOuXxvA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2482 | <code>  simple-swizzle@0.2.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2483 | <code>    resolution: {integrity: sha512-nAu1WFPQSMNr2Zn9PGSZK9AGn4t/y97lEm+MXTtUDwfP0ksAIX4nO+6ruD9Jwut4C49SB1Ws+fbXsm/yScWOHw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2485 | <code>  simple-update-notifier@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2486 | <code>    resolution: {integrity: sha512-a2B9Y0KlNXl9u/vsW6sTIu9vGEpfKu2wRV6l1H3XEas/0gUIzGzBoP/IouTcUQbm9JWZLH3COxyn03TYlFax6w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2487 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2489 | <code>  slice-ansi@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2490 | <code>    resolution: {integrity: sha512-pSyv7bSTC7ig9Dcgbw9AuRNUb5k5V6oDudjZoMBSr13qpLBG7tB+zgCkARjq7xIUgdz5P1Qe8u+rSGdouOOIyQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2491 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2493 | <code>  smart-buffer@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2494 | <code>    resolution: {integrity: sha512-94hK0Hh8rPqQl2xXc3HsaBoOXKV20MToPkcXvwbISWLEs+64sBq5kFgn2kJDHb1Pry9yrP0dxrCI9RRci7RXKg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2495 | <code>    engines: {node: '&gt;= 6.0.0', npm: '&gt;= 3.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2496 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2497 | <code>  socks-proxy-agent@8.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2498 | <code>    resolution: {integrity: sha512-HehCEsotFqbPW9sJ8WVYB6UbmIMv7kUUORIF2Nncq4VQvBfNBLibW9YZR5dlYCSUhwcD628pRllm7n+E+YTzJw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2499 | <code>    engines: {node: '&gt;= 14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2501 | <code>  socks@2.8.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2502 | <code>    resolution: {integrity: sha512-HLpt+uLy/pxB+bum/9DzAgiKS8CX1EvbWxI4zlmgGCExImLdiad2iCwXT5Z4c9c3Eq8rP2318mPW2c+QbtjK8A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2503 | <code>    engines: {node: '&gt;= 10.0.0', npm: '&gt;= 3.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2505 | <code>  socks@2.8.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2506 | <code>    resolution: {integrity: sha512-NlGELfPrgX2f1TAAcz0WawlLn+0r3FyhhCRpFFK2CemXenPYvzMWWZINv3eDNo9ucdwme7oCHRY0Jnbs4aIkog==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2507 | <code>    engines: {node: '&gt;= 10.0.0', npm: '&gt;= 3.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2509 | <code>  sonic-boom@4.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2510 | <code>    resolution: {integrity: sha512-w6AxtubXa2wTXAUsZMMWERrsIRAdrK0Sc+FUytWvYAhBJLyuI4llrMIC1DtlNSdI99EI86KZum2MMq3EAZlF9Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2512 | <code>  source-map-js@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2513 | <code>    resolution: {integrity: sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2514 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2516 | <code>  source-map-support@0.5.21:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2517 | <code>    resolution: {integrity: sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2519 | <code>  source-map@0.6.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2520 | <code>    resolution: {integrity: sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2521 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2522 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2523 | <code>  split2@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2524 | <code>    resolution: {integrity: sha512-UcjcJOWknrNkF6PLX83qcHM6KHgVKNkV62Y8a5uYDVv9ydGQVwAHMKqHdJje1VTWpljG0WYpCDhrCdAOYH4TWg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2525 | <code>    engines: {node: '&gt;= 10.x'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2527 | <code>  sprintf-js@1.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2528 | <code>    resolution: {integrity: sha512-Oo+0REFV59/rz3gfJNKQiBlwfHaSESl1pcGyABQsnnIfWOFt6JNj5gCog2U6MLZ//IGYD+nA8nI+mTShREReaA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2530 | <code>  ssri@12.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2531 | <code>    resolution: {integrity: sha512-S7iGNosepx9RadX82oimUkvr0Ct7IjJbEbs4mJcTxst8um95J3sDYU1RBEOvdu6oL1Wek2ODI5i4MAw+dZ6cAQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2532 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2533 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2534 | <code>  stat-mode@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2535 | <code>    resolution: {integrity: sha512-jH9EhtKIjuXZ2cWxmXS8ZP80XyC3iasQxMDV8jzhNJpfDb7VbQLVW4Wvsxz9QZvzV+G4YoSfBUVKDOyxLzi/sg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2536 | <code>    engines: {node: '&gt;= 6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2538 | <code>  statuses@2.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2539 | <code>    resolution: {integrity: sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2540 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2542 | <code>  stockfish@18.0.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2543 | <code>    resolution: {integrity: sha512-z+f2UMPXLylDBGjv9e9zU8QulY7hUl8MYHesLRrdddewlOXjJrUSmtNmbtID1/F72EPhq0CCkCNxgWS5MQVWtQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2544 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2546 | <code>  streamx@2.25.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2547 | <code>    resolution: {integrity: sha512-0nQuG6jf1w+wddNEEXCF4nTg3LtufWINB5eFEN+5TNZW7KWJp6x87+JFL43vaAUPyCfH1wID+mNVyW6OHtFamg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2549 | <code>  string-width@4.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2550 | <code>    resolution: {integrity: sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2551 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2552 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2553 | <code>  string-width@5.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2554 | <code>    resolution: {integrity: sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2555 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2556 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2557 | <code>  string_decoder@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2558 | <code>    resolution: {integrity: sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2560 | <code>  string_decoder@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2561 | <code>    resolution: {integrity: sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2562 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2563 | <code>  strip-ansi@6.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2564 | <code>    resolution: {integrity: sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2565 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2567 | <code>  strip-ansi@7.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2568 | <code>    resolution: {integrity: sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2569 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2571 | <code>  strip-json-comments@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2572 | <code>    resolution: {integrity: sha512-4gB8na07fecVVkOI6Rs4e7T6NOTki5EmL7TUduTs6bu3EdnSycntVJ4re8kgZA+wx9IueI2Y11bfbgwtzuE0KQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2573 | <code>    engines: {node: '&gt;=0.10.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2575 | <code>  sumchecker@3.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2576 | <code>    resolution: {integrity: sha512-MvjXzkz/BOfyVDkG0oFOtBxHX2u3gKbMHIF/dXblZsgD3BWOFLmHovIpZY7BykJdAjcqRCBi1WYBNdEC9yI7vg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2577 | <code>    engines: {node: '&gt;= 8.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2579 | <code>  supports-color@7.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2580 | <code>    resolution: {integrity: sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2581 | <code>    engines: {node: '&gt;=8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2582 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2583 | <code>  supports-color@8.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2584 | <code>    resolution: {integrity: sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2585 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2587 | <code>  tar-fs@2.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2588 | <code>    resolution: {integrity: sha512-mDAjwmZdh7LTT6pNleZ05Yt65HC3E+NiQzl672vQG38jIrehtJk/J3mNwIg+vShQPcLF/LV7CMnDW6vjj6sfYQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2589 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2590 | <code>  tar-fs@3.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2591 | <code>    resolution: {integrity: sha512-QGxxTxxyleAdyM3kpFs14ymbYmNFrfY+pHj7Z8FgtbZ7w2//VAgLMac7sT6nRpIHjppXO2AwwEOg0bPFVRcmXw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2593 | <code>  tar-stream@2.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2594 | <code>    resolution: {integrity: sha512-ujeqbceABgwMZxEJnk2HDY2DlnUZ+9oEcb1KzTVfYHio0UE6dG71n60d8D2I4qNvleWrrXpmjpt7vZeF1LnMZQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2595 | <code>    engines: {node: '&gt;=6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2597 | <code>  tar-stream@3.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2598 | <code>    resolution: {integrity: sha512-ojzvCvVaNp6aOTFmG7jaRD0meowIAuPc3cMMhSgKiVWws1GyHbGd/xvnyuRKcKlMpt3qvxx6r0hreCNITP9hIg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2600 | <code>  tar@7.5.13:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2601 | <code>    resolution: {integrity: sha512-tOG/7GyXpFevhXVh8jOPJrmtRpOTsYqUIkVdVooZYJS/z8WhfQUX8RJILmeuJNinGAMSu1veBr4asSHFt5/hng==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2602 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2604 | <code>  teex@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2605 | <code>    resolution: {integrity: sha512-eYE6iEI62Ni1H8oIa7KlDU6uQBtqr4Eajni3wX7rpfXD8ysFx8z0+dri+KWEPWpBsxXfxu58x/0jvTVT1ekOSg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2607 | <code>  temp-file@3.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2608 | <code>    resolution: {integrity: sha512-C5tjlC/HCtVUOi3KWVokd4vHVViOmGjtLwIh4MuzPo/nMYTV/p1urt3RnMz2IWXDdKEGJH3k5+KPxtqRsUYGtg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2610 | <code>  temp@0.9.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2611 | <code>    resolution: {integrity: sha512-yYrrsWnrXMcdsnu/7YMYAofM1ktpL5By7vZhf15CrXijWWrEYZks5AXBudalfSWJLlnen/QUJUB5aoB0kqZUGA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2612 | <code>    engines: {node: '&gt;=6.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2613 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2614 | <code>  text-decoder@1.2.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2615 | <code>    resolution: {integrity: sha512-vlLytXkeP4xvEq2otHeJfSQIRyWxo/oZGEbXrtEEF9Hnmrdly59sUbzZ/QgyWuLYHctCHxFF4tRQZNQ9k60ExQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2617 | <code>  thread-stream@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2618 | <code>    resolution: {integrity: sha512-e2zZ96wSChazBsbENf/Pcm/4swHt2cEKQ92rhUjkL9GCKiTDJIaTBenjE/m9DXi0QBmTMDkFDdOomUy20A1tDQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2619 | <code>    engines: {node: '&gt;=20'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2621 | <code>  three@0.183.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2622 | <code>    resolution: {integrity: sha512-di3BsL2FEQ1PA7Hcvn4fyJOlxRRgFYBpMTcyOgkwJIaDOdJMebEFPA+t98EvjuljDx4hNulAGwF6KIjtwI5jgQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2624 | <code>  tiny-async-pool@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2625 | <code>    resolution: {integrity: sha512-01EAw5EDrcVrdgyCLgoSPvqznC0sVxDSVeiOz09FUpjh71G79VCqneOr+xvt7T1r76CF6ZZfPjHorN2+d+3mqA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2626 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2627 | <code>  tinyglobby@0.2.15:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2628 | <code>    resolution: {integrity: sha512-j2Zq4NyQYG5XMST4cbs02Ak8iJUdxRM0XI5QyxXuZOzKOINmWurp3smXu3y5wDcJrptwpSjgXHzIQxR0omXljQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2629 | <code>    engines: {node: '&gt;=12.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2631 | <code>  tlds@1.261.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2632 | <code>    resolution: {integrity: sha512-QXqwfEl9ddlGBaRFXIvNKK6OhipSiLXuRuLJX5DErz0o0Q0rYxulWLdFryTkV5PkdZct5iMInwYEGe/eR++1AA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2633 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2635 | <code>  tmp-promise@3.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2636 | <code>    resolution: {integrity: sha512-RwM7MoPojPxsOBYnyd2hy0bxtIlVrihNs9pj5SUvY8Zz1sQcQG2tG1hSr8PDxfgEB8RNKDhqbIlroIarSNDNsQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2638 | <code>  tmp@0.2.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2639 | <code>    resolution: {integrity: sha512-voyz6MApa1rQGUxT3E+BK7/ROe8itEx7vD8/HEvt4xwXucvQ5G5oeEiHkmHZJuBO21RpOf+YYm9MOivj709jow==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2640 | <code>    engines: {node: '&gt;=14.14'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2641 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2642 | <code>  toidentifier@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2643 | <code>    resolution: {integrity: sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2644 | <code>    engines: {node: '&gt;=0.6'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2646 | <code>  traverse@0.3.9:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2647 | <code>    resolution: {integrity: sha512-iawgk0hLP3SxGKDfnDJf8wTz4p2qImnyihM5Hh/sGvQ3K37dPi/w8sRhdNIxYA1TwFwc5mDhIJq+O0RsvXBKdQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2649 | <code>  tree-kill@1.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2650 | <code>    resolution: {integrity: sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2651 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2653 | <code>  truncate-utf8-bytes@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2654 | <code>    resolution: {integrity: sha512-95Pu1QXQvruGEhv62XCMO3Mm90GscOCClvrIUwCM0PYOXK3kaF3l3sIHxx71ThJfcbM2O5Au6SO3AWCSEfW4mQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2656 | <code>  tslib@2.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2657 | <code>    resolution: {integrity: sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2659 | <code>  tunnel-agent@0.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2660 | <code>    resolution: {integrity: sha512-McnNiV1l8RYeY8tBgEpuodCC1mLUdbSN+CYBL7kJsJNInOP8UjDDEwdk6Mw60vdLLrr5NHKZhMAOSrR2NZuQ+w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2662 | <code>  type-fest@0.13.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2663 | <code>    resolution: {integrity: sha512-34R7HTnG0XIJcBSn5XhDd7nNFPRcXYRZrBB2O2jdKqYODldSzBAqzsWoZYYvduky73toYS/ESqxPvkDf/F0XMg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2664 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2666 | <code>  type-is@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2667 | <code>    resolution: {integrity: sha512-faYHw0anBbc/kWF3zFTEnxSFOAGUX9GFbOBthvDdLsIlEoWOFOtS0zgCiQYwIskL9iGXZL3kAXD8OoZ4GmMATA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2668 | <code>    engines: {node: '&gt;= 18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2670 | <code>  typescript-language-server@5.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2671 | <code>    resolution: {integrity: sha512-5puofxZHgFdAYtfNpmwCAvgtaYgg8wrUnH30m7Ze3QuguId5RNRadKASpOpyDxTyUdAF51FjhTdjntLw/EuWcQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2672 | <code>    engines: {node: '&gt;=20'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2673 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2675 | <code>  typescript@6.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2676 | <code>    resolution: {integrity: sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2677 | <code>    engines: {node: '&gt;=14.17'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2678 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2680 | <code>  uc.micro@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2681 | <code>    resolution: {integrity: sha512-ARDJmphmdvUk6Glw7y9DQ2bFkKBHwQHLi2lsaH6PPmz/Ka9sFOBsBluozhDltWmnv9u/cF6Rt87znRTPV+yp/A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2683 | <code>  undici-types@7.16.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2684 | <code>    resolution: {integrity: sha512-Zz+aZWSj8LE6zoxD+xrjh4VfkIG8Ya6LvYkZqtUQGJPZjYl53ypCaUwWqo7eI0x66KBGeRo+mlBEkMSeSZ38Nw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2686 | <code>  unique-filename@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2687 | <code>    resolution: {integrity: sha512-XSnEewXmQ+veP7xX2dS5Q4yZAvO40cBN2MWkJ7D/6sW4Dg6wYBNwM1Vrnz1FhH5AdeLIlUXRI9e28z1YZi71NQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2688 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2690 | <code>  unique-slug@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2691 | <code>    resolution: {integrity: sha512-9OdaqO5kwqR+1kVgHAhsp5vPNU0hnxRa26rBFNfNgM7M6pNtgzeBn3s/xbyCQL3dcjzOatcef6UUHpB/6MaETg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2692 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2694 | <code>  universalify@0.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2695 | <code>    resolution: {integrity: sha512-rBJeI5CXAlmy1pV+617WB9J63U6XcazHHF2f2dbJix4XzpUF0RS3Zbj0FGIOCAva5P/d/GBOYaACQ1w+0azUkg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2696 | <code>    engines: {node: '&gt;= 4.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2698 | <code>  universalify@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2699 | <code>    resolution: {integrity: sha512-gptHNQghINnc/vTGIk0SOFGFNXw7JVrlRUtConJRlvaw6DuX0wO5Jeko9sWrMBhh+PsYAZ7oXAiOnf/UKogyiw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2700 | <code>    engines: {node: '&gt;= 10.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2702 | <code>  unpipe@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2703 | <code>    resolution: {integrity: sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2704 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2706 | <code>  unzipper@0.10.14:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2707 | <code>    resolution: {integrity: sha512-ti4wZj+0bQTiX2KmKWuwj7lhV+2n//uXEotUmGuQqrbVZSEGFMbI68+c6JCQ8aAmUWYvtHEz2A8K6wXvueR/6g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2709 | <code>  uri-js@4.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2710 | <code>    resolution: {integrity: sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2712 | <code>  utf8-byte-length@1.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2713 | <code>    resolution: {integrity: sha512-Xn0w3MtiQ6zoz2vFyUVruaCL53O/DwUvkEeOvj+uulMm0BkUGYWmBYVyElqZaSLhY6ZD0ulfU3aBra2aVT4xfA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2715 | <code>  util-deprecate@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2716 | <code>    resolution: {integrity: sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2718 | <code>  uuid@8.3.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2719 | <code>    resolution: {integrity: sha512-+NYs2QeMWy+GWFOEm9xnn6HCDp0l7QBD7ml8zLUmJ+93Q5NF0NocErnwkTkXVFNiX3/fpC6afS8Dhb/gz7R7eg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2720 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2722 | <code>  vary@1.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2723 | <code>    resolution: {integrity: sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2724 | <code>    engines: {node: '&gt;= 0.8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2726 | <code>  verror@1.10.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2727 | <code>    resolution: {integrity: sha512-veufcmxri4e3XSrT0xwfUR7kguIkaxBeosDg00yDWhk49wdwkSUrvvsm7nc75e1PUyvIeZj6nS8VQRYz2/S4Xg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2728 | <code>    engines: {node: '&gt;=0.6.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2729 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2730 | <code>  vite@8.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2731 | <code>    resolution: {integrity: sha512-B9ifbFudT1TFhfltfaIPgjo9Z3mDynBTJSUYxTjOQruf/zHH+ezCQKcoqO+h7a9Pw9Nm/OtlXAiGT1axBgwqrQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2732 | <code>    engines: {node: ^20.19.0 &#124;&#124; &gt;=22.12.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2733 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2734 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2735 | <code>      '@types/node': ^20.19.0 &#124;&#124; &gt;=22.12.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2736 | <code>      '@vitejs/devtools': ^0.1.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2737 | <code>      esbuild: ^0.27.0</code> | 配置键 `esbuild`：为构建、部署、依赖或运行时声明参数。 |
| 2738 | <code>      jiti: '&gt;=1.21.0'</code> | 配置键 `jiti`：为构建、部署、依赖或运行时声明参数。 |
| 2739 | <code>      less: ^4.0.0</code> | 配置键 `less`：为构建、部署、依赖或运行时声明参数。 |
| 2740 | <code>      sass: ^1.70.0</code> | 配置键 `sass`：为构建、部署、依赖或运行时声明参数。 |
| 2741 | <code>      sass-embedded: ^1.70.0</code> | 配置键 `sass-embedded`：为构建、部署、依赖或运行时声明参数。 |
| 2742 | <code>      stylus: '&gt;=0.54.8'</code> | 配置键 `stylus`：为构建、部署、依赖或运行时声明参数。 |
| 2743 | <code>      sugarss: ^5.0.0</code> | 配置键 `sugarss`：为构建、部署、依赖或运行时声明参数。 |
| 2744 | <code>      terser: ^5.16.0</code> | 配置键 `terser`：为构建、部署、依赖或运行时声明参数。 |
| 2745 | <code>      tsx: ^4.8.1</code> | 配置键 `tsx`：为构建、部署、依赖或运行时声明参数。 |
| 2746 | <code>      yaml: ^2.4.2</code> | 配置键 `yaml`：为构建、部署、依赖或运行时声明参数。 |
| 2747 | <code>    peerDependenciesMeta:</code> | 配置键 `peerDependenciesMeta`：为构建、部署、依赖或运行时声明参数。 |
| 2748 | <code>      '@types/node':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2749 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2750 | <code>      '@vitejs/devtools':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2751 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2752 | <code>      esbuild:</code> | 配置键 `esbuild`：为构建、部署、依赖或运行时声明参数。 |
| 2753 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2754 | <code>      jiti:</code> | 配置键 `jiti`：为构建、部署、依赖或运行时声明参数。 |
| 2755 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2756 | <code>      less:</code> | 配置键 `less`：为构建、部署、依赖或运行时声明参数。 |
| 2757 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2758 | <code>      sass:</code> | 配置键 `sass`：为构建、部署、依赖或运行时声明参数。 |
| 2759 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2760 | <code>      sass-embedded:</code> | 配置键 `sass-embedded`：为构建、部署、依赖或运行时声明参数。 |
| 2761 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2762 | <code>      stylus:</code> | 配置键 `stylus`：为构建、部署、依赖或运行时声明参数。 |
| 2763 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2764 | <code>      sugarss:</code> | 配置键 `sugarss`：为构建、部署、依赖或运行时声明参数。 |
| 2765 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2766 | <code>      terser:</code> | 配置键 `terser`：为构建、部署、依赖或运行时声明参数。 |
| 2767 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2768 | <code>      tsx:</code> | 配置键 `tsx`：为构建、部署、依赖或运行时声明参数。 |
| 2769 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2770 | <code>      yaml:</code> | 配置键 `yaml`：为构建、部署、依赖或运行时声明参数。 |
| 2771 | <code>        optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 2772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2773 | <code>  vscode-jsonrpc@5.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2774 | <code>    resolution: {integrity: sha512-JvONPptw3GAQGXlVV2utDcHx0BiY34FupW/kI6mZ5x06ER5DdPG/tXWMVHjTNULF5uKPOUUD0SaXg5QaubJL0A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2775 | <code>    engines: {node: '&gt;=8.0.0 &#124;&#124; &gt;=10.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2777 | <code>  vscode-jsonrpc@8.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2778 | <code>    resolution: {integrity: sha512-C+r0eKJUIfiDIfwJhria30+TYWPtuHJXHtI7J0YlOmKAo7ogxP20T0zxB7HZQIFhIyvoBPwWskjxrvAtfjyZfA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2779 | <code>    engines: {node: '&gt;=14.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2781 | <code>  vscode-languageserver-protocol@3.17.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2782 | <code>    resolution: {integrity: sha512-mb1bvRJN8SVznADSGWM9u/b07H7Ecg0I3OgXDuLdn307rl/J3A9YD6/eYOssqhecL27hK1IPZAsaqh00i/Jljg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2783 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2784 | <code>  vscode-languageserver-types@3.17.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2785 | <code>    resolution: {integrity: sha512-Ld1VelNuX9pdF39h2Hgaeb5hEZM2Z3jUrrMgWQAu82jMtZp7p3vJT3BzToKtZI7NgQssZje5o0zryOrhQvzQAg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2787 | <code>  wait-on@9.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2788 | <code>    resolution: {integrity: sha512-qgnbHDfDTRIp73ANEJNRW/7kn8CrDUcvZz18xotJQku/P4saTGkbIzvnMZebPmVvVNUiRq1qWAPyqCH+W4H8KA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2789 | <code>    engines: {node: '&gt;=20.0.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2790 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2792 | <code>  wcwidth@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2793 | <code>    resolution: {integrity: sha512-XHPEwS0q6TaxcvG85+8EYkbiCux2XtWG2mkc47Ng2A77BQu9+DqIOJldST4HgPkuea7dvKSj5VgX3P1d4rW8Tg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2795 | <code>  which@2.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2796 | <code>    resolution: {integrity: sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2797 | <code>    engines: {node: '&gt;= 8'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2798 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2800 | <code>  which@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2801 | <code>    resolution: {integrity: sha512-JEdGzHwwkrbWoGOlIHqQ5gtprKGOenpDHpxE9zVR1bWbOtYRyPPHMe9FaP6x61CmNaTThSkb0DAJte5jD+DmzQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2802 | <code>    engines: {node: ^18.17.0 &#124;&#124; &gt;=20.5.0}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2803 | <code>    hasBin: true</code> | 配置键 `hasBin`：为构建、部署、依赖或运行时声明参数。 |
| 2804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2805 | <code>  wrap-ansi@7.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2806 | <code>    resolution: {integrity: sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2807 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2809 | <code>  wrap-ansi@8.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2810 | <code>    resolution: {integrity: sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2811 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2813 | <code>  wrappy@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2814 | <code>    resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2816 | <code>  xmlbuilder@15.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2817 | <code>    resolution: {integrity: sha512-yMqGBqtXyeN1e3TGYvgNgDVZ3j84W4cwkOXQswghol6APgZWaff9lnbvN7MHYJOiXsvGPXtjTYJEiC9J2wv9Eg==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2818 | <code>    engines: {node: '&gt;=8.0'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2819 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2820 | <code>  xmlchars@2.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2821 | <code>    resolution: {integrity: sha512-JZnDKK8B0RCDw84FNdDAIpZK+JuJw+s7Lz8nksI7SIuU3UXJJslUthsi+uWBUYOwPFwW7W7PRLRfUKpxjtjFCw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2823 | <code>  y18n@5.0.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2824 | <code>    resolution: {integrity: sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2825 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2826 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2827 | <code>  yallist@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2828 | <code>    resolution: {integrity: sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2830 | <code>  yallist@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2831 | <code>    resolution: {integrity: sha512-YgvUTfwqyc7UXVMrB+SImsVYSmTS8X/tSrtdNZMImM+n7+QTriRXyXim0mBrTXNeqzVF0KWGgHPeiyViFFrNDw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2832 | <code>    engines: {node: '&gt;=18'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2834 | <code>  yargs-parser@21.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2835 | <code>    resolution: {integrity: sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2836 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2838 | <code>  yargs@17.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2839 | <code>    resolution: {integrity: sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2840 | <code>    engines: {node: '&gt;=12'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2842 | <code>  yauzl@2.10.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2843 | <code>    resolution: {integrity: sha512-p4a9I6X6nu6IhoGmBqAcbJy1mlC4j27vEPZX9F4L4/vZT3Lyq1VkFHw/V/PUcB9Buo+DG3iHkT0x3Qya58zc3g==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2845 | <code>  yocto-queue@0.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2846 | <code>    resolution: {integrity: sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2847 | <code>    engines: {node: '&gt;=10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2849 | <code>  zip-stream@4.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2850 | <code>    resolution: {integrity: sha512-9qv4rlDiopXg4E69k+vMHjNN63YFMe9sZMrdlvKnCjlCRWeCBswPPMPUfx+ipsAWq1LXHe70RcbaHdJJpS6hyQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2851 | <code>    engines: {node: '&gt;= 10'}</code> | 配置键 `engines`：为构建、部署、依赖或运行时声明参数。 |
| 2852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2853 | <code>  zod-to-json-schema@3.25.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2854 | <code>    resolution: {integrity: sha512-O/PgfnpT1xKSDeQYSCfRI5Gy3hPf91mKVDuYLUHZJMiDFptvP41MSnWofm8dnCm0256ZNfZIM7DSzuSMAFnjHA==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2855 | <code>    peerDependencies:</code> | 配置键 `peerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2856 | <code>      zod: ^3.25.28 &#124;&#124; ^4</code> | 配置键 `zod`：为构建、部署、依赖或运行时声明参数。 |
| 2857 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2858 | <code>  zod@4.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2859 | <code>    resolution: {integrity: sha512-ytENFjIJFl2UwYglde2jchW2Hwm4GJFLDiSXWdTrJQBIN9Fcyp7n4DhxJEiWNAJMV1/BqWfW/kkg71UDcHJyTQ==}</code> | 配置键 `resolution`：为构建、部署、依赖或运行时声明参数。 |
| 2860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2861 | <code>snapshots:</code> | 配置键 `snapshots`：为构建、部署、依赖或运行时声明参数。 |
| 2862 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2863 | <code>  7zip-bin@5.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2865 | <code>  '@babel/code-frame@7.29.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2866 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2867 | <code>      '@babel/helper-validator-identifier': 7.28.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2868 | <code>      js-tokens: 4.0.0</code> | 配置键 `js-tokens`：为构建、部署、依赖或运行时声明参数。 |
| 2869 | <code>      picocolors: 1.1.1</code> | 配置键 `picocolors`：为构建、部署、依赖或运行时声明参数。 |
| 2870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2871 | <code>  '@babel/generator@7.29.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2872 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2873 | <code>      '@babel/parser': 7.29.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2874 | <code>      '@babel/types': 7.29.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2875 | <code>      '@jridgewell/gen-mapping': 0.3.13</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2876 | <code>      '@jridgewell/trace-mapping': 0.3.31</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2877 | <code>      jsesc: 3.1.0</code> | 配置键 `jsesc`：为构建、部署、依赖或运行时声明参数。 |
| 2878 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2879 | <code>  '@babel/helper-globals@7.28.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2881 | <code>  '@babel/helper-string-parser@7.27.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2882 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2883 | <code>  '@babel/helper-validator-identifier@7.28.5': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2885 | <code>  '@babel/parser@7.29.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2886 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2887 | <code>      '@babel/types': 7.29.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2888 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2889 | <code>  '@babel/template@7.28.6':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2890 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2891 | <code>      '@babel/code-frame': 7.29.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2892 | <code>      '@babel/parser': 7.29.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2893 | <code>      '@babel/types': 7.29.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2895 | <code>  '@babel/traverse@7.29.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2896 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2897 | <code>      '@babel/code-frame': 7.29.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2898 | <code>      '@babel/generator': 7.29.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2899 | <code>      '@babel/helper-globals': 7.28.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2900 | <code>      '@babel/parser': 7.29.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2901 | <code>      '@babel/template': 7.28.6</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2902 | <code>      '@babel/types': 7.29.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2903 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 2904 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2905 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2907 | <code>  '@babel/types@7.29.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2908 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2909 | <code>      '@babel/helper-string-parser': 7.27.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2910 | <code>      '@babel/helper-validator-identifier': 7.28.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2911 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2912 | <code>  '@develar/schema-utils@2.6.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2913 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2914 | <code>      ajv: 6.14.0</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 2915 | <code>      ajv-keywords: 3.5.2(ajv@6.14.0)</code> | 配置键 `ajv-keywords`：为构建、部署、依赖或运行时声明参数。 |
| 2916 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2917 | <code>  '@electron/asar@3.4.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2918 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2919 | <code>      commander: 5.1.0</code> | 配置键 `commander`：为构建、部署、依赖或运行时声明参数。 |
| 2920 | <code>      glob: 7.2.3</code> | 配置键 `glob`：为构建、部署、依赖或运行时声明参数。 |
| 2921 | <code>      minimatch: 3.1.5</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 2922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2923 | <code>  '@electron/fuses@1.8.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2924 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2925 | <code>      chalk: 4.1.2</code> | 配置键 `chalk`：为构建、部署、依赖或运行时声明参数。 |
| 2926 | <code>      fs-extra: 9.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 2927 | <code>      minimist: 1.2.8</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 2928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2929 | <code>  '@electron/get@2.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2930 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2931 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 2932 | <code>      env-paths: 2.2.1</code> | 配置键 `env-paths`：为构建、部署、依赖或运行时声明参数。 |
| 2933 | <code>      fs-extra: 8.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 2934 | <code>      got: 11.8.6</code> | 配置键 `got`：为构建、部署、依赖或运行时声明参数。 |
| 2935 | <code>      progress: 2.0.3</code> | 配置键 `progress`：为构建、部署、依赖或运行时声明参数。 |
| 2936 | <code>      semver: 6.3.1</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 2937 | <code>      sumchecker: 3.0.1</code> | 配置键 `sumchecker`：为构建、部署、依赖或运行时声明参数。 |
| 2938 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2939 | <code>      global-agent: 3.0.0</code> | 配置键 `global-agent`：为构建、部署、依赖或运行时声明参数。 |
| 2940 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2941 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2943 | <code>  '@electron/get@3.1.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2944 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2945 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 2946 | <code>      env-paths: 2.2.1</code> | 配置键 `env-paths`：为构建、部署、依赖或运行时声明参数。 |
| 2947 | <code>      fs-extra: 8.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 2948 | <code>      got: 11.8.6</code> | 配置键 `got`：为构建、部署、依赖或运行时声明参数。 |
| 2949 | <code>      progress: 2.0.3</code> | 配置键 `progress`：为构建、部署、依赖或运行时声明参数。 |
| 2950 | <code>      semver: 6.3.1</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 2951 | <code>      sumchecker: 3.0.1</code> | 配置键 `sumchecker`：为构建、部署、依赖或运行时声明参数。 |
| 2952 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2953 | <code>      global-agent: 3.0.0</code> | 配置键 `global-agent`：为构建、部署、依赖或运行时声明参数。 |
| 2954 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2955 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2956 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2957 | <code>  '@electron/notarize@2.5.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2958 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2959 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 2960 | <code>      fs-extra: 9.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 2961 | <code>      promise-retry: 2.0.1</code> | 配置键 `promise-retry`：为构建、部署、依赖或运行时声明参数。 |
| 2962 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2963 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2964 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2965 | <code>  '@electron/osx-sign@1.3.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2966 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2967 | <code>      compare-version: 0.1.2</code> | 配置键 `compare-version`：为构建、部署、依赖或运行时声明参数。 |
| 2968 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 2969 | <code>      fs-extra: 10.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 2970 | <code>      isbinaryfile: 4.0.10</code> | 配置键 `isbinaryfile`：为构建、部署、依赖或运行时声明参数。 |
| 2971 | <code>      minimist: 1.2.8</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 2972 | <code>      plist: 3.1.0</code> | 配置键 `plist`：为构建、部署、依赖或运行时声明参数。 |
| 2973 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2974 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2975 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2976 | <code>  '@electron/rebuild@4.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2977 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2978 | <code>      '@malept/cross-spawn-promise': 2.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2979 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 2980 | <code>      detect-libc: 2.1.2</code> | 配置键 `detect-libc`：为构建、部署、依赖或运行时声明参数。 |
| 2981 | <code>      got: 11.8.6</code> | 配置键 `got`：为构建、部署、依赖或运行时声明参数。 |
| 2982 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 2983 | <code>      node-abi: 4.28.0</code> | 配置键 `node-abi`：为构建、部署、依赖或运行时声明参数。 |
| 2984 | <code>      node-api-version: 0.2.1</code> | 配置键 `node-api-version`：为构建、部署、依赖或运行时声明参数。 |
| 2985 | <code>      node-gyp: 11.5.0</code> | 配置键 `node-gyp`：为构建、部署、依赖或运行时声明参数。 |
| 2986 | <code>      ora: 5.4.1</code> | 配置键 `ora`：为构建、部署、依赖或运行时声明参数。 |
| 2987 | <code>      read-binary-file-arch: 1.0.6</code> | 配置键 `read-binary-file-arch`：为构建、部署、依赖或运行时声明参数。 |
| 2988 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 2989 | <code>      tar: 7.5.13</code> | 配置键 `tar`：为构建、部署、依赖或运行时声明参数。 |
| 2990 | <code>      yargs: 17.7.2</code> | 配置键 `yargs`：为构建、部署、依赖或运行时声明参数。 |
| 2991 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2992 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2993 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2994 | <code>  '@electron/universal@2.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2995 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 2996 | <code>      '@electron/asar': 3.4.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2997 | <code>      '@malept/cross-spawn-promise': 2.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 2998 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 2999 | <code>      dir-compare: 4.2.0</code> | 配置键 `dir-compare`：为构建、部署、依赖或运行时声明参数。 |
| 3000 | <code>      fs-extra: 11.3.4</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 3001 | <code>      minimatch: 9.0.9</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 3002 | <code>      plist: 3.1.0</code> | 配置键 `plist`：为构建、部署、依赖或运行时声明参数。 |
| 3003 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3004 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3005 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3006 | <code>  '@electron/windows-sign@1.2.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3007 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3008 | <code>      cross-dirname: 0.1.0</code> | 配置键 `cross-dirname`：为构建、部署、依赖或运行时声明参数。 |
| 3009 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 3010 | <code>      fs-extra: 11.3.4</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 3011 | <code>      minimist: 1.2.8</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 3012 | <code>      postject: 1.0.0-alpha.6</code> | 配置键 `postject`：为构建、部署、依赖或运行时声明参数。 |
| 3013 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3014 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3015 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3016 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3017 | <code>  '@emnapi/core@1.9.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3018 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3019 | <code>      '@emnapi/wasi-threads': 1.2.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3020 | <code>      tslib: 2.8.1</code> | 配置键 `tslib`：为构建、部署、依赖或运行时声明参数。 |
| 3021 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3022 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3023 | <code>  '@emnapi/runtime@1.9.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3024 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3025 | <code>      tslib: 2.8.1</code> | 配置键 `tslib`：为构建、部署、依赖或运行时声明参数。 |
| 3026 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3028 | <code>  '@emnapi/wasi-threads@1.2.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3029 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3030 | <code>      tslib: 2.8.1</code> | 配置键 `tslib`：为构建、部署、依赖或运行时声明参数。 |
| 3031 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3032 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3033 | <code>  '@epic-web/invariant@1.0.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3034 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3035 | <code>  '@fast-csv/format@4.3.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3036 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3037 | <code>      '@types/node': 14.18.63</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3038 | <code>      lodash.escaperegexp: 4.1.2</code> | 配置键 `lodash.escaperegexp`：为构建、部署、依赖或运行时声明参数。 |
| 3039 | <code>      lodash.isboolean: 3.0.3</code> | 配置键 `lodash.isboolean`：为构建、部署、依赖或运行时声明参数。 |
| 3040 | <code>      lodash.isequal: 4.5.0</code> | 配置键 `lodash.isequal`：为构建、部署、依赖或运行时声明参数。 |
| 3041 | <code>      lodash.isfunction: 3.0.9</code> | 配置键 `lodash.isfunction`：为构建、部署、依赖或运行时声明参数。 |
| 3042 | <code>      lodash.isnil: 4.0.0</code> | 配置键 `lodash.isnil`：为构建、部署、依赖或运行时声明参数。 |
| 3043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3044 | <code>  '@fast-csv/parse@4.3.6':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3045 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3046 | <code>      '@types/node': 14.18.63</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3047 | <code>      lodash.escaperegexp: 4.1.2</code> | 配置键 `lodash.escaperegexp`：为构建、部署、依赖或运行时声明参数。 |
| 3048 | <code>      lodash.groupby: 4.6.0</code> | 配置键 `lodash.groupby`：为构建、部署、依赖或运行时声明参数。 |
| 3049 | <code>      lodash.isfunction: 3.0.9</code> | 配置键 `lodash.isfunction`：为构建、部署、依赖或运行时声明参数。 |
| 3050 | <code>      lodash.isnil: 4.0.0</code> | 配置键 `lodash.isnil`：为构建、部署、依赖或运行时声明参数。 |
| 3051 | <code>      lodash.isundefined: 3.0.1</code> | 配置键 `lodash.isundefined`：为构建、部署、依赖或运行时声明参数。 |
| 3052 | <code>      lodash.uniq: 4.5.0</code> | 配置键 `lodash.uniq`：为构建、部署、依赖或运行时声明参数。 |
| 3053 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3054 | <code>  '@hapi/address@5.1.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3055 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3056 | <code>      '@hapi/hoek': 11.0.7</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3057 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3058 | <code>  '@hapi/formula@3.0.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3059 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3060 | <code>  '@hapi/hoek@11.0.7': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3061 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3062 | <code>  '@hapi/pinpoint@2.0.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3063 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3064 | <code>  '@hapi/tlds@1.1.6': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3065 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3066 | <code>  '@hapi/topo@6.0.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3067 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3068 | <code>      '@hapi/hoek': 11.0.7</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3069 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3070 | <code>  '@hono/node-server@1.19.14(hono@4.12.23)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3071 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3072 | <code>      hono: 4.12.23</code> | 配置键 `hono`：为构建、部署、依赖或运行时声明参数。 |
| 3073 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3074 | <code>  '@huggingface/jinja@0.2.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3075 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3076 | <code>  '@isaacs/cliui@8.0.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3077 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3078 | <code>      string-width: 5.1.2</code> | 配置键 `string-width`：为构建、部署、依赖或运行时声明参数。 |
| 3079 | <code>      string-width-cjs: string-width@4.2.3</code> | 配置键 `string-width-cjs`：为构建、部署、依赖或运行时声明参数。 |
| 3080 | <code>      strip-ansi: 7.2.0</code> | 配置键 `strip-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 3081 | <code>      strip-ansi-cjs: strip-ansi@6.0.1</code> | 配置键 `strip-ansi-cjs`：为构建、部署、依赖或运行时声明参数。 |
| 3082 | <code>      wrap-ansi: 8.1.0</code> | 配置键 `wrap-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 3083 | <code>      wrap-ansi-cjs: wrap-ansi@7.0.0</code> | 配置键 `wrap-ansi-cjs`：为构建、部署、依赖或运行时声明参数。 |
| 3084 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3085 | <code>  '@isaacs/fs-minipass@4.0.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3086 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3087 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 3088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3089 | <code>  '@jridgewell/gen-mapping@0.3.13':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3090 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3091 | <code>      '@jridgewell/sourcemap-codec': 1.5.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3092 | <code>      '@jridgewell/trace-mapping': 0.3.31</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3093 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3094 | <code>  '@jridgewell/resolve-uri@3.1.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3095 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3096 | <code>  '@jridgewell/sourcemap-codec@1.5.5': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3097 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3098 | <code>  '@jridgewell/trace-mapping@0.3.31':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3099 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3100 | <code>      '@jridgewell/resolve-uri': 3.1.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3101 | <code>      '@jridgewell/sourcemap-codec': 1.5.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3103 | <code>  '@malept/cross-spawn-promise@2.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3104 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3105 | <code>      cross-spawn: 7.0.6</code> | 配置键 `cross-spawn`：为构建、部署、依赖或运行时声明参数。 |
| 3106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3107 | <code>  '@malept/flatpak-bundler@0.4.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3108 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3109 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 3110 | <code>      fs-extra: 9.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 3111 | <code>      lodash: 4.18.1</code> | 配置键 `lodash`：为构建、部署、依赖或运行时声明参数。 |
| 3112 | <code>      tmp-promise: 3.0.3</code> | 配置键 `tmp-promise`：为构建、部署、依赖或运行时声明参数。 |
| 3113 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3114 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3116 | <code>  '@modelcontextprotocol/sdk@1.29.0(zod@4.4.3)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3117 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3118 | <code>      '@hono/node-server': 1.19.14(hono@4.12.23)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3119 | <code>      ajv: 8.20.0</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 3120 | <code>      ajv-formats: 3.0.1(ajv@8.20.0)</code> | 配置键 `ajv-formats`：为构建、部署、依赖或运行时声明参数。 |
| 3121 | <code>      content-type: 1.0.5</code> | 配置键 `content-type`：为构建、部署、依赖或运行时声明参数。 |
| 3122 | <code>      cors: 2.8.6</code> | 配置键 `cors`：为构建、部署、依赖或运行时声明参数。 |
| 3123 | <code>      cross-spawn: 7.0.6</code> | 配置键 `cross-spawn`：为构建、部署、依赖或运行时声明参数。 |
| 3124 | <code>      eventsource: 3.0.7</code> | 配置键 `eventsource`：为构建、部署、依赖或运行时声明参数。 |
| 3125 | <code>      eventsource-parser: 3.1.0</code> | 配置键 `eventsource-parser`：为构建、部署、依赖或运行时声明参数。 |
| 3126 | <code>      express: 5.2.1</code> | 配置键 `express`：为构建、部署、依赖或运行时声明参数。 |
| 3127 | <code>      express-rate-limit: 8.5.2(express@5.2.1)</code> | 配置键 `express-rate-limit`：为构建、部署、依赖或运行时声明参数。 |
| 3128 | <code>      hono: 4.12.23</code> | 配置键 `hono`：为构建、部署、依赖或运行时声明参数。 |
| 3129 | <code>      jose: 6.2.3</code> | 配置键 `jose`：为构建、部署、依赖或运行时声明参数。 |
| 3130 | <code>      json-schema-typed: 8.0.2</code> | 配置键 `json-schema-typed`：为构建、部署、依赖或运行时声明参数。 |
| 3131 | <code>      pkce-challenge: 5.0.1</code> | 配置键 `pkce-challenge`：为构建、部署、依赖或运行时声明参数。 |
| 3132 | <code>      raw-body: 3.0.2</code> | 配置键 `raw-body`：为构建、部署、依赖或运行时声明参数。 |
| 3133 | <code>      zod: 4.4.3</code> | 配置键 `zod`：为构建、部署、依赖或运行时声明参数。 |
| 3134 | <code>      zod-to-json-schema: 3.25.2(zod@4.4.3)</code> | 配置键 `zod-to-json-schema`：为构建、部署、依赖或运行时声明参数。 |
| 3135 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3136 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3138 | <code>  '@modelcontextprotocol/server-filesystem@2026.1.14(zod@4.4.3)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3139 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3140 | <code>      '@modelcontextprotocol/sdk': 1.29.0(zod@4.4.3)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3141 | <code>      diff: 5.2.2</code> | 配置键 `diff`：为构建、部署、依赖或运行时声明参数。 |
| 3142 | <code>      glob: 10.5.0</code> | 配置键 `glob`：为构建、部署、依赖或运行时声明参数。 |
| 3143 | <code>      minimatch: 10.2.5</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 3144 | <code>      zod-to-json-schema: 3.25.2(zod@4.4.3)</code> | 配置键 `zod-to-json-schema`：为构建、部署、依赖或运行时声明参数。 |
| 3145 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3146 | <code>      - '@cfworker/json-schema'</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3147 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3148 | <code>      - zod</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3150 | <code>  '@napi-rs/canvas-android-arm64@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3151 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3153 | <code>  '@napi-rs/canvas-darwin-arm64@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3154 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3156 | <code>  '@napi-rs/canvas-darwin-x64@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3157 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3159 | <code>  '@napi-rs/canvas-linux-arm-gnueabihf@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3160 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3162 | <code>  '@napi-rs/canvas-linux-arm64-gnu@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3163 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3165 | <code>  '@napi-rs/canvas-linux-arm64-musl@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3166 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3168 | <code>  '@napi-rs/canvas-linux-riscv64-gnu@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3169 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3171 | <code>  '@napi-rs/canvas-linux-x64-gnu@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3172 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3174 | <code>  '@napi-rs/canvas-linux-x64-musl@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3175 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3177 | <code>  '@napi-rs/canvas-win32-arm64-msvc@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3178 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3180 | <code>  '@napi-rs/canvas-win32-x64-msvc@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3181 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3183 | <code>  '@napi-rs/canvas@1.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3184 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3185 | <code>      '@napi-rs/canvas-android-arm64': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3186 | <code>      '@napi-rs/canvas-darwin-arm64': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3187 | <code>      '@napi-rs/canvas-darwin-x64': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3188 | <code>      '@napi-rs/canvas-linux-arm-gnueabihf': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3189 | <code>      '@napi-rs/canvas-linux-arm64-gnu': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3190 | <code>      '@napi-rs/canvas-linux-arm64-musl': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3191 | <code>      '@napi-rs/canvas-linux-riscv64-gnu': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3192 | <code>      '@napi-rs/canvas-linux-x64-gnu': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3193 | <code>      '@napi-rs/canvas-linux-x64-musl': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3194 | <code>      '@napi-rs/canvas-win32-arm64-msvc': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3195 | <code>      '@napi-rs/canvas-win32-x64-msvc': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3196 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3198 | <code>  '@napi-rs/wasm-runtime@1.1.2(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3199 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3200 | <code>      '@emnapi/core': 1.9.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3201 | <code>      '@emnapi/runtime': 1.9.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3202 | <code>      '@tybys/wasm-util': 0.10.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3203 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3205 | <code>  '@npmcli/agent@3.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3206 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3207 | <code>      agent-base: 7.1.4</code> | 配置键 `agent-base`：为构建、部署、依赖或运行时声明参数。 |
| 3208 | <code>      http-proxy-agent: 7.0.2</code> | 配置键 `http-proxy-agent`：为构建、部署、依赖或运行时声明参数。 |
| 3209 | <code>      https-proxy-agent: 7.0.6</code> | 配置键 `https-proxy-agent`：为构建、部署、依赖或运行时声明参数。 |
| 3210 | <code>      lru-cache: 10.4.3</code> | 配置键 `lru-cache`：为构建、部署、依赖或运行时声明参数。 |
| 3211 | <code>      socks-proxy-agent: 8.0.5</code> | 配置键 `socks-proxy-agent`：为构建、部署、依赖或运行时声明参数。 |
| 3212 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3213 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3215 | <code>  '@npmcli/fs@4.0.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3216 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3217 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 3218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3219 | <code>  '@oxc-project/types@0.122.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3221 | <code>  '@pinojs/redact@0.4.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3223 | <code>  '@pixiv/three-vrm-animation@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3224 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3225 | <code>      '@pixiv/three-vrm-core': 3.5.1(three@0.183.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3226 | <code>      '@pixiv/types-vrmc-vrm-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3227 | <code>      '@pixiv/types-vrmc-vrm-animation-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3228 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3230 | <code>  '@pixiv/three-vrm-core@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3231 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3232 | <code>      '@pixiv/types-vrm-0.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3233 | <code>      '@pixiv/types-vrmc-vrm-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3234 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3236 | <code>  '@pixiv/three-vrm-materials-hdr-emissive-multiplier@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3237 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3238 | <code>      '@pixiv/types-vrmc-materials-hdr-emissive-multiplier-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3239 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3241 | <code>  '@pixiv/three-vrm-materials-mtoon@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3242 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3243 | <code>      '@pixiv/types-vrm-0.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3244 | <code>      '@pixiv/types-vrmc-materials-mtoon-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3245 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3247 | <code>  '@pixiv/three-vrm-materials-v0compat@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3248 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3249 | <code>      '@pixiv/types-vrm-0.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3250 | <code>      '@pixiv/types-vrmc-materials-mtoon-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3251 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3253 | <code>  '@pixiv/three-vrm-node-constraint@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3254 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3255 | <code>      '@pixiv/types-vrmc-node-constraint-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3256 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3258 | <code>  '@pixiv/three-vrm-springbone@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3259 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3260 | <code>      '@pixiv/types-vrm-0.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3261 | <code>      '@pixiv/types-vrmc-springbone-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3262 | <code>      '@pixiv/types-vrmc-springbone-extended-collider-1.0': 3.5.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3263 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3265 | <code>  '@pixiv/three-vrm@3.5.1(three@0.183.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3266 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3267 | <code>      '@pixiv/three-vrm-core': 3.5.1(three@0.183.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3268 | <code>      '@pixiv/three-vrm-materials-hdr-emissive-multiplier': 3.5.1(three@0.183.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3269 | <code>      '@pixiv/three-vrm-materials-mtoon': 3.5.1(three@0.183.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3270 | <code>      '@pixiv/three-vrm-materials-v0compat': 3.5.1(three@0.183.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3271 | <code>      '@pixiv/three-vrm-node-constraint': 3.5.1(three@0.183.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3272 | <code>      '@pixiv/three-vrm-springbone': 3.5.1(three@0.183.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3273 | <code>      three: 0.183.2</code> | 配置键 `three`：为构建、部署、依赖或运行时声明参数。 |
| 3274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3275 | <code>  '@pixiv/types-vrm-0.0@3.5.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3277 | <code>  '@pixiv/types-vrmc-materials-hdr-emissive-multiplier-1.0@3.5.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3279 | <code>  '@pixiv/types-vrmc-materials-mtoon-1.0@3.5.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3281 | <code>  '@pixiv/types-vrmc-node-constraint-1.0@3.5.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3283 | <code>  '@pixiv/types-vrmc-springbone-1.0@3.5.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3285 | <code>  '@pixiv/types-vrmc-springbone-extended-collider-1.0@3.5.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3287 | <code>  '@pixiv/types-vrmc-vrm-1.0@2.0.3': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3289 | <code>  '@pixiv/types-vrmc-vrm-1.0@3.5.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3291 | <code>  '@pixiv/types-vrmc-vrm-animation-1.0@3.5.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3292 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3293 | <code>      '@pixiv/types-vrmc-vrm-1.0': 2.0.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3295 | <code>  '@pkgjs/parseargs@0.11.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3296 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3298 | <code>  '@protobufjs/aspromise@1.1.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3300 | <code>  '@protobufjs/base64@1.1.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3302 | <code>  '@protobufjs/codegen@2.0.5': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3304 | <code>  '@protobufjs/eventemitter@1.1.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3306 | <code>  '@protobufjs/fetch@1.1.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3307 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3308 | <code>      '@protobufjs/aspromise': 1.1.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3310 | <code>  '@protobufjs/float@1.0.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3312 | <code>  '@protobufjs/inquire@1.1.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3314 | <code>  '@protobufjs/path@1.1.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3316 | <code>  '@protobufjs/pool@1.1.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3318 | <code>  '@protobufjs/utf8@1.1.1': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3320 | <code>  '@rolldown/binding-android-arm64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3321 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3323 | <code>  '@rolldown/binding-darwin-arm64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3324 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3326 | <code>  '@rolldown/binding-darwin-x64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3327 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3329 | <code>  '@rolldown/binding-freebsd-x64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3330 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3332 | <code>  '@rolldown/binding-linux-arm-gnueabihf@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3333 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3335 | <code>  '@rolldown/binding-linux-arm64-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3336 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3338 | <code>  '@rolldown/binding-linux-arm64-musl@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3339 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3341 | <code>  '@rolldown/binding-linux-ppc64-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3342 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3344 | <code>  '@rolldown/binding-linux-s390x-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3345 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3347 | <code>  '@rolldown/binding-linux-x64-gnu@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3348 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3350 | <code>  '@rolldown/binding-linux-x64-musl@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3351 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3353 | <code>  '@rolldown/binding-openharmony-arm64@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3354 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3356 | <code>  '@rolldown/binding-wasm32-wasi@1.0.0-rc.12(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2)':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3357 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3358 | <code>      '@napi-rs/wasm-runtime': 1.1.2(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3359 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3360 | <code>      - '@emnapi/core'</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3361 | <code>      - '@emnapi/runtime'</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3362 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3364 | <code>  '@rolldown/binding-win32-arm64-msvc@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3365 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3367 | <code>  '@rolldown/binding-win32-x64-msvc@1.0.0-rc.12':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3368 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3370 | <code>  '@rolldown/pluginutils@1.0.0-rc.12': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3372 | <code>  '@selderee/plugin-htmlparser2@0.11.0':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3373 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3374 | <code>      domhandler: 5.0.3</code> | 配置键 `domhandler`：为构建、部署、依赖或运行时声明参数。 |
| 3375 | <code>      selderee: 0.11.0</code> | 配置键 `selderee`：为构建、部署、依赖或运行时声明参数。 |
| 3376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3377 | <code>  '@sindresorhus/is@4.6.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3379 | <code>  '@standard-schema/spec@1.1.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3381 | <code>  '@szmarczak/http-timer@4.0.6':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3382 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3383 | <code>      defer-to-connect: 2.0.1</code> | 配置键 `defer-to-connect`：为构建、部署、依赖或运行时声明参数。 |
| 3384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3385 | <code>  '@tybys/wasm-util@0.10.1':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3386 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3387 | <code>      tslib: 2.8.1</code> | 配置键 `tslib`：为构建、部署、依赖或运行时声明参数。 |
| 3388 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3390 | <code>  '@types/cacheable-request@6.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3391 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3392 | <code>      '@types/http-cache-semantics': 4.2.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3393 | <code>      '@types/keyv': 3.1.4</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3394 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3395 | <code>      '@types/responselike': 1.0.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3397 | <code>  '@types/debug@4.1.13':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3398 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3399 | <code>      '@types/ms': 2.1.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3401 | <code>  '@types/fs-extra@9.0.13':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3402 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3403 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3404 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3405 | <code>  '@types/http-cache-semantics@4.2.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3407 | <code>  '@types/keyv@3.1.4':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3408 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3409 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3411 | <code>  '@types/long@4.0.2': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3413 | <code>  '@types/ms@2.1.0': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3415 | <code>  '@types/node@14.18.63': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3417 | <code>  '@types/node@24.12.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3418 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3419 | <code>      undici-types: 7.16.0</code> | 配置键 `undici-types`：为构建、部署、依赖或运行时声明参数。 |
| 3420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3421 | <code>  '@types/plist@3.0.5':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3422 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3423 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3424 | <code>      xmlbuilder: 15.1.1</code> | 配置键 `xmlbuilder`：为构建、部署、依赖或运行时声明参数。 |
| 3425 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3427 | <code>  '@types/responselike@1.0.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3428 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3429 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3431 | <code>  '@types/verror@1.10.11':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3432 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3434 | <code>  '@types/yauzl@2.10.3':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3435 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3436 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3437 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3439 | <code>  '@xenova/transformers@2.17.2':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3440 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3441 | <code>      '@huggingface/jinja': 0.2.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3442 | <code>      onnxruntime-web: 1.14.0</code> | 配置键 `onnxruntime-web`：为构建、部署、依赖或运行时声明参数。 |
| 3443 | <code>      sharp: 0.32.6</code> | 配置键 `sharp`：为构建、部署、依赖或运行时声明参数。 |
| 3444 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3445 | <code>      onnxruntime-node: 1.14.0</code> | 配置键 `onnxruntime-node`：为构建、部署、依赖或运行时声明参数。 |
| 3446 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3447 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3448 | <code>      - bare-buffer</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3449 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3451 | <code>  '@xmldom/xmldom@0.8.12': {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3453 | <code>  '@zone-eu/mailsplit@5.4.8':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3454 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3455 | <code>      libbase64: 1.3.0</code> | 配置键 `libbase64`：为构建、部署、依赖或运行时声明参数。 |
| 3456 | <code>      libmime: 5.3.7</code> | 配置键 `libmime`：为构建、部署、依赖或运行时声明参数。 |
| 3457 | <code>      libqp: 2.1.1</code> | 配置键 `libqp`：为构建、部署、依赖或运行时声明参数。 |
| 3458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3459 | <code>  '@zone-eu/mailsplit@5.4.9':</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3460 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3461 | <code>      libbase64: 1.3.0</code> | 配置键 `libbase64`：为构建、部署、依赖或运行时声明参数。 |
| 3462 | <code>      libmime: 5.3.8</code> | 配置键 `libmime`：为构建、部署、依赖或运行时声明参数。 |
| 3463 | <code>      libqp: 2.1.1</code> | 配置键 `libqp`：为构建、部署、依赖或运行时声明参数。 |
| 3464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3465 | <code>  abbrev@3.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3467 | <code>  accepts@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3468 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3469 | <code>      mime-types: 3.0.2</code> | 配置键 `mime-types`：为构建、部署、依赖或运行时声明参数。 |
| 3470 | <code>      negotiator: 1.0.0</code> | 配置键 `negotiator`：为构建、部署、依赖或运行时声明参数。 |
| 3471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3472 | <code>  agent-base@7.1.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3474 | <code>  ajv-formats@3.0.1(ajv@8.20.0):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3475 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3476 | <code>      ajv: 8.20.0</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 3477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3478 | <code>  ajv-keywords@3.5.2(ajv@6.14.0):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3479 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3480 | <code>      ajv: 6.14.0</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 3481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3482 | <code>  ajv@6.14.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3483 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3484 | <code>      fast-deep-equal: 3.1.3</code> | 配置键 `fast-deep-equal`：为构建、部署、依赖或运行时声明参数。 |
| 3485 | <code>      fast-json-stable-stringify: 2.1.0</code> | 配置键 `fast-json-stable-stringify`：为构建、部署、依赖或运行时声明参数。 |
| 3486 | <code>      json-schema-traverse: 0.4.1</code> | 配置键 `json-schema-traverse`：为构建、部署、依赖或运行时声明参数。 |
| 3487 | <code>      uri-js: 4.4.1</code> | 配置键 `uri-js`：为构建、部署、依赖或运行时声明参数。 |
| 3488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3489 | <code>  ajv@8.20.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3490 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3491 | <code>      fast-deep-equal: 3.1.3</code> | 配置键 `fast-deep-equal`：为构建、部署、依赖或运行时声明参数。 |
| 3492 | <code>      fast-uri: 3.1.2</code> | 配置键 `fast-uri`：为构建、部署、依赖或运行时声明参数。 |
| 3493 | <code>      json-schema-traverse: 1.0.0</code> | 配置键 `json-schema-traverse`：为构建、部署、依赖或运行时声明参数。 |
| 3494 | <code>      require-from-string: 2.0.2</code> | 配置键 `require-from-string`：为构建、部署、依赖或运行时声明参数。 |
| 3495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3496 | <code>  ansi-regex@5.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3498 | <code>  ansi-regex@6.2.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3500 | <code>  ansi-styles@4.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3501 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3502 | <code>      color-convert: 2.0.1</code> | 配置键 `color-convert`：为构建、部署、依赖或运行时声明参数。 |
| 3503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3504 | <code>  ansi-styles@6.2.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3506 | <code>  app-builder-bin@5.0.0-alpha.12: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3508 | <code>  app-builder-lib@26.8.1(dmg-builder@26.8.1)(electron-builder-squirrel-windows@26.8.1):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3509 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3510 | <code>      '@develar/schema-utils': 2.6.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3511 | <code>      '@electron/asar': 3.4.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3512 | <code>      '@electron/fuses': 1.8.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3513 | <code>      '@electron/get': 3.1.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3514 | <code>      '@electron/notarize': 2.5.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3515 | <code>      '@electron/osx-sign': 1.3.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3516 | <code>      '@electron/rebuild': 4.0.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3517 | <code>      '@electron/universal': 2.0.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3518 | <code>      '@malept/flatpak-bundler': 0.4.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3519 | <code>      '@types/fs-extra': 9.0.13</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3520 | <code>      async-exit-hook: 2.0.1</code> | 配置键 `async-exit-hook`：为构建、部署、依赖或运行时声明参数。 |
| 3521 | <code>      builder-util: 26.8.1</code> | 配置键 `builder-util`：为构建、部署、依赖或运行时声明参数。 |
| 3522 | <code>      builder-util-runtime: 9.5.1</code> | 配置键 `builder-util-runtime`：为构建、部署、依赖或运行时声明参数。 |
| 3523 | <code>      chromium-pickle-js: 0.2.0</code> | 配置键 `chromium-pickle-js`：为构建、部署、依赖或运行时声明参数。 |
| 3524 | <code>      ci-info: 4.3.1</code> | 配置键 `ci-info`：为构建、部署、依赖或运行时声明参数。 |
| 3525 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 3526 | <code>      dmg-builder: 26.8.1(electron-builder-squirrel-windows@26.8.1)</code> | 配置键 `dmg-builder`：为构建、部署、依赖或运行时声明参数。 |
| 3527 | <code>      dotenv: 16.6.1</code> | 配置键 `dotenv`：为构建、部署、依赖或运行时声明参数。 |
| 3528 | <code>      dotenv-expand: 11.0.7</code> | 配置键 `dotenv-expand`：为构建、部署、依赖或运行时声明参数。 |
| 3529 | <code>      ejs: 3.1.10</code> | 配置键 `ejs`：为构建、部署、依赖或运行时声明参数。 |
| 3530 | <code>      electron-builder-squirrel-windows: 26.8.1(dmg-builder@26.8.1)</code> | 配置键 `electron-builder-squirrel-windows`：为构建、部署、依赖或运行时声明参数。 |
| 3531 | <code>      electron-publish: 26.8.1</code> | 配置键 `electron-publish`：为构建、部署、依赖或运行时声明参数。 |
| 3532 | <code>      fs-extra: 10.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 3533 | <code>      hosted-git-info: 4.1.0</code> | 配置键 `hosted-git-info`：为构建、部署、依赖或运行时声明参数。 |
| 3534 | <code>      isbinaryfile: 5.0.7</code> | 配置键 `isbinaryfile`：为构建、部署、依赖或运行时声明参数。 |
| 3535 | <code>      jiti: 2.6.1</code> | 配置键 `jiti`：为构建、部署、依赖或运行时声明参数。 |
| 3536 | <code>      js-yaml: 4.1.1</code> | 配置键 `js-yaml`：为构建、部署、依赖或运行时声明参数。 |
| 3537 | <code>      json5: 2.2.3</code> | 配置键 `json5`：为构建、部署、依赖或运行时声明参数。 |
| 3538 | <code>      lazy-val: 1.0.5</code> | 配置键 `lazy-val`：为构建、部署、依赖或运行时声明参数。 |
| 3539 | <code>      minimatch: 10.2.5</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 3540 | <code>      plist: 3.1.0</code> | 配置键 `plist`：为构建、部署、依赖或运行时声明参数。 |
| 3541 | <code>      proper-lockfile: 4.1.2</code> | 配置键 `proper-lockfile`：为构建、部署、依赖或运行时声明参数。 |
| 3542 | <code>      resedit: 1.7.2</code> | 配置键 `resedit`：为构建、部署、依赖或运行时声明参数。 |
| 3543 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 3544 | <code>      tar: 7.5.13</code> | 配置键 `tar`：为构建、部署、依赖或运行时声明参数。 |
| 3545 | <code>      temp-file: 3.4.0</code> | 配置键 `temp-file`：为构建、部署、依赖或运行时声明参数。 |
| 3546 | <code>      tiny-async-pool: 1.3.0</code> | 配置键 `tiny-async-pool`：为构建、部署、依赖或运行时声明参数。 |
| 3547 | <code>      which: 5.0.0</code> | 配置键 `which`：为构建、部署、依赖或运行时声明参数。 |
| 3548 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3549 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3551 | <code>  archiver-utils@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3552 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3553 | <code>      glob: 7.2.3</code> | 配置键 `glob`：为构建、部署、依赖或运行时声明参数。 |
| 3554 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 3555 | <code>      lazystream: 1.0.1</code> | 配置键 `lazystream`：为构建、部署、依赖或运行时声明参数。 |
| 3556 | <code>      lodash.defaults: 4.2.0</code> | 配置键 `lodash.defaults`：为构建、部署、依赖或运行时声明参数。 |
| 3557 | <code>      lodash.difference: 4.5.0</code> | 配置键 `lodash.difference`：为构建、部署、依赖或运行时声明参数。 |
| 3558 | <code>      lodash.flatten: 4.4.0</code> | 配置键 `lodash.flatten`：为构建、部署、依赖或运行时声明参数。 |
| 3559 | <code>      lodash.isplainobject: 4.0.6</code> | 配置键 `lodash.isplainobject`：为构建、部署、依赖或运行时声明参数。 |
| 3560 | <code>      lodash.union: 4.6.0</code> | 配置键 `lodash.union`：为构建、部署、依赖或运行时声明参数。 |
| 3561 | <code>      normalize-path: 3.0.0</code> | 配置键 `normalize-path`：为构建、部署、依赖或运行时声明参数。 |
| 3562 | <code>      readable-stream: 2.3.8</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3564 | <code>  archiver-utils@3.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3565 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3566 | <code>      glob: 7.2.3</code> | 配置键 `glob`：为构建、部署、依赖或运行时声明参数。 |
| 3567 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 3568 | <code>      lazystream: 1.0.1</code> | 配置键 `lazystream`：为构建、部署、依赖或运行时声明参数。 |
| 3569 | <code>      lodash.defaults: 4.2.0</code> | 配置键 `lodash.defaults`：为构建、部署、依赖或运行时声明参数。 |
| 3570 | <code>      lodash.difference: 4.5.0</code> | 配置键 `lodash.difference`：为构建、部署、依赖或运行时声明参数。 |
| 3571 | <code>      lodash.flatten: 4.4.0</code> | 配置键 `lodash.flatten`：为构建、部署、依赖或运行时声明参数。 |
| 3572 | <code>      lodash.isplainobject: 4.0.6</code> | 配置键 `lodash.isplainobject`：为构建、部署、依赖或运行时声明参数。 |
| 3573 | <code>      lodash.union: 4.6.0</code> | 配置键 `lodash.union`：为构建、部署、依赖或运行时声明参数。 |
| 3574 | <code>      normalize-path: 3.0.0</code> | 配置键 `normalize-path`：为构建、部署、依赖或运行时声明参数。 |
| 3575 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3577 | <code>  archiver@5.3.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3578 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3579 | <code>      archiver-utils: 2.1.0</code> | 配置键 `archiver-utils`：为构建、部署、依赖或运行时声明参数。 |
| 3580 | <code>      async: 3.2.6</code> | 配置键 `async`：为构建、部署、依赖或运行时声明参数。 |
| 3581 | <code>      buffer-crc32: 0.2.13</code> | 配置键 `buffer-crc32`：为构建、部署、依赖或运行时声明参数。 |
| 3582 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3583 | <code>      readdir-glob: 1.1.3</code> | 配置键 `readdir-glob`：为构建、部署、依赖或运行时声明参数。 |
| 3584 | <code>      tar-stream: 2.2.0</code> | 配置键 `tar-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3585 | <code>      zip-stream: 4.1.1</code> | 配置键 `zip-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3587 | <code>  argparse@2.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3589 | <code>  assert-plus@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3590 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3591 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3592 | <code>  astral-regex@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3593 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3594 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3595 | <code>  async-exit-hook@2.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3597 | <code>  async@3.2.6: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3599 | <code>  asynckit@0.4.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3601 | <code>  at-least-node@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3603 | <code>  atomic-sleep@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3605 | <code>  axios@1.15.0(debug@4.4.3):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3606 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3607 | <code>      follow-redirects: 1.15.11(debug@4.4.3)</code> | 配置键 `follow-redirects`：为构建、部署、依赖或运行时声明参数。 |
| 3608 | <code>      form-data: 4.0.5</code> | 配置键 `form-data`：为构建、部署、依赖或运行时声明参数。 |
| 3609 | <code>      proxy-from-env: 2.1.0</code> | 配置键 `proxy-from-env`：为构建、部署、依赖或运行时声明参数。 |
| 3610 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3611 | <code>      - debug</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3613 | <code>  b4a@1.8.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3614 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3615 | <code>  balanced-match@1.0.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3617 | <code>  balanced-match@4.0.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3619 | <code>  bare-events@2.8.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3621 | <code>  bare-fs@4.7.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3622 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3623 | <code>      bare-events: 2.8.3</code> | 配置键 `bare-events`：为构建、部署、依赖或运行时声明参数。 |
| 3624 | <code>      bare-path: 3.0.0</code> | 配置键 `bare-path`：为构建、部署、依赖或运行时声明参数。 |
| 3625 | <code>      bare-stream: 2.13.1(bare-events@2.8.3)</code> | 配置键 `bare-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3626 | <code>      bare-url: 2.4.3</code> | 配置键 `bare-url`：为构建、部署、依赖或运行时声明参数。 |
| 3627 | <code>      fast-fifo: 1.3.2</code> | 配置键 `fast-fifo`：为构建、部署、依赖或运行时声明参数。 |
| 3628 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3629 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3630 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3631 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3632 | <code>  bare-os@3.9.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3634 | <code>  bare-path@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3635 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3636 | <code>      bare-os: 3.9.1</code> | 配置键 `bare-os`：为构建、部署、依赖或运行时声明参数。 |
| 3637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3638 | <code>  bare-stream@2.13.1(bare-events@2.8.3):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3639 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3640 | <code>      streamx: 2.25.0</code> | 配置键 `streamx`：为构建、部署、依赖或运行时声明参数。 |
| 3641 | <code>      teex: 1.0.1</code> | 配置键 `teex`：为构建、部署、依赖或运行时声明参数。 |
| 3642 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3643 | <code>      bare-events: 2.8.3</code> | 配置键 `bare-events`：为构建、部署、依赖或运行时声明参数。 |
| 3644 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3645 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3647 | <code>  bare-url@2.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3648 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3649 | <code>      bare-path: 3.0.0</code> | 配置键 `bare-path`：为构建、部署、依赖或运行时声明参数。 |
| 3650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3651 | <code>  base64-js@1.5.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3653 | <code>  big-integer@1.6.52: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3655 | <code>  binary@0.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3656 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3657 | <code>      buffers: 0.1.1</code> | 配置键 `buffers`：为构建、部署、依赖或运行时声明参数。 |
| 3658 | <code>      chainsaw: 0.1.0</code> | 配置键 `chainsaw`：为构建、部署、依赖或运行时声明参数。 |
| 3659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3660 | <code>  bl@4.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3661 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3662 | <code>      buffer: 5.7.1</code> | 配置键 `buffer`：为构建、部署、依赖或运行时声明参数。 |
| 3663 | <code>      inherits: 2.0.4</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 3664 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3666 | <code>  bluebird@3.4.7: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3667 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3668 | <code>  body-parser@2.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3669 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3670 | <code>      bytes: 3.1.2</code> | 配置键 `bytes`：为构建、部署、依赖或运行时声明参数。 |
| 3671 | <code>      content-type: 1.0.5</code> | 配置键 `content-type`：为构建、部署、依赖或运行时声明参数。 |
| 3672 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 3673 | <code>      http-errors: 2.0.1</code> | 配置键 `http-errors`：为构建、部署、依赖或运行时声明参数。 |
| 3674 | <code>      iconv-lite: 0.7.2</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 3675 | <code>      on-finished: 2.4.1</code> | 配置键 `on-finished`：为构建、部署、依赖或运行时声明参数。 |
| 3676 | <code>      qs: 6.15.2</code> | 配置键 `qs`：为构建、部署、依赖或运行时声明参数。 |
| 3677 | <code>      raw-body: 3.0.2</code> | 配置键 `raw-body`：为构建、部署、依赖或运行时声明参数。 |
| 3678 | <code>      type-is: 2.1.0</code> | 配置键 `type-is`：为构建、部署、依赖或运行时声明参数。 |
| 3679 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3680 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3682 | <code>  boolean@3.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3683 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3685 | <code>  brace-expansion@1.1.14:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3686 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3687 | <code>      balanced-match: 1.0.2</code> | 配置键 `balanced-match`：为构建、部署、依赖或运行时声明参数。 |
| 3688 | <code>      concat-map: 0.0.1</code> | 配置键 `concat-map`：为构建、部署、依赖或运行时声明参数。 |
| 3689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3690 | <code>  brace-expansion@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3691 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3692 | <code>      balanced-match: 1.0.2</code> | 配置键 `balanced-match`：为构建、部署、依赖或运行时声明参数。 |
| 3693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3694 | <code>  brace-expansion@5.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3695 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3696 | <code>      balanced-match: 4.0.4</code> | 配置键 `balanced-match`：为构建、部署、依赖或运行时声明参数。 |
| 3697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3698 | <code>  buffer-crc32@0.2.13: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3700 | <code>  buffer-from@1.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3702 | <code>  buffer-indexof-polyfill@1.0.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3704 | <code>  buffer@5.7.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3705 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3706 | <code>      base64-js: 1.5.1</code> | 配置键 `base64-js`：为构建、部署、依赖或运行时声明参数。 |
| 3707 | <code>      ieee754: 1.2.1</code> | 配置键 `ieee754`：为构建、部署、依赖或运行时声明参数。 |
| 3708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3709 | <code>  buffers@0.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3711 | <code>  builder-util-runtime@9.5.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3712 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3713 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 3714 | <code>      sax: 1.6.0</code> | 配置键 `sax`：为构建、部署、依赖或运行时声明参数。 |
| 3715 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3716 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3718 | <code>  builder-util@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3719 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3720 | <code>      7zip-bin: 5.2.0</code> | 配置键 `7zip-bin`：为构建、部署、依赖或运行时声明参数。 |
| 3721 | <code>      '@types/debug': 4.1.13</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3722 | <code>      app-builder-bin: 5.0.0-alpha.12</code> | 配置键 `app-builder-bin`：为构建、部署、依赖或运行时声明参数。 |
| 3723 | <code>      builder-util-runtime: 9.5.1</code> | 配置键 `builder-util-runtime`：为构建、部署、依赖或运行时声明参数。 |
| 3724 | <code>      chalk: 4.1.2</code> | 配置键 `chalk`：为构建、部署、依赖或运行时声明参数。 |
| 3725 | <code>      cross-spawn: 7.0.6</code> | 配置键 `cross-spawn`：为构建、部署、依赖或运行时声明参数。 |
| 3726 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 3727 | <code>      fs-extra: 10.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 3728 | <code>      http-proxy-agent: 7.0.2</code> | 配置键 `http-proxy-agent`：为构建、部署、依赖或运行时声明参数。 |
| 3729 | <code>      https-proxy-agent: 7.0.6</code> | 配置键 `https-proxy-agent`：为构建、部署、依赖或运行时声明参数。 |
| 3730 | <code>      js-yaml: 4.1.1</code> | 配置键 `js-yaml`：为构建、部署、依赖或运行时声明参数。 |
| 3731 | <code>      sanitize-filename: 1.6.4</code> | 配置键 `sanitize-filename`：为构建、部署、依赖或运行时声明参数。 |
| 3732 | <code>      source-map-support: 0.5.21</code> | 配置键 `source-map-support`：为构建、部署、依赖或运行时声明参数。 |
| 3733 | <code>      stat-mode: 1.0.0</code> | 配置键 `stat-mode`：为构建、部署、依赖或运行时声明参数。 |
| 3734 | <code>      temp-file: 3.4.0</code> | 配置键 `temp-file`：为构建、部署、依赖或运行时声明参数。 |
| 3735 | <code>      tiny-async-pool: 1.3.0</code> | 配置键 `tiny-async-pool`：为构建、部署、依赖或运行时声明参数。 |
| 3736 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3737 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3739 | <code>  bytes@3.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3741 | <code>  cacache@19.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3742 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3743 | <code>      '@npmcli/fs': 4.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3744 | <code>      fs-minipass: 3.0.3</code> | 配置键 `fs-minipass`：为构建、部署、依赖或运行时声明参数。 |
| 3745 | <code>      glob: 10.4.5</code> | 配置键 `glob`：为构建、部署、依赖或运行时声明参数。 |
| 3746 | <code>      lru-cache: 10.4.3</code> | 配置键 `lru-cache`：为构建、部署、依赖或运行时声明参数。 |
| 3747 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 3748 | <code>      minipass-collect: 2.0.1</code> | 配置键 `minipass-collect`：为构建、部署、依赖或运行时声明参数。 |
| 3749 | <code>      minipass-flush: 1.0.7</code> | 配置键 `minipass-flush`：为构建、部署、依赖或运行时声明参数。 |
| 3750 | <code>      minipass-pipeline: 1.2.4</code> | 配置键 `minipass-pipeline`：为构建、部署、依赖或运行时声明参数。 |
| 3751 | <code>      p-map: 7.0.4</code> | 配置键 `p-map`：为构建、部署、依赖或运行时声明参数。 |
| 3752 | <code>      ssri: 12.0.0</code> | 配置键 `ssri`：为构建、部署、依赖或运行时声明参数。 |
| 3753 | <code>      tar: 7.5.13</code> | 配置键 `tar`：为构建、部署、依赖或运行时声明参数。 |
| 3754 | <code>      unique-filename: 4.0.0</code> | 配置键 `unique-filename`：为构建、部署、依赖或运行时声明参数。 |
| 3755 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3756 | <code>  cacheable-lookup@5.0.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3758 | <code>  cacheable-request@7.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3759 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3760 | <code>      clone-response: 1.0.3</code> | 配置键 `clone-response`：为构建、部署、依赖或运行时声明参数。 |
| 3761 | <code>      get-stream: 5.2.0</code> | 配置键 `get-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3762 | <code>      http-cache-semantics: 4.2.0</code> | 配置键 `http-cache-semantics`：为构建、部署、依赖或运行时声明参数。 |
| 3763 | <code>      keyv: 4.5.4</code> | 配置键 `keyv`：为构建、部署、依赖或运行时声明参数。 |
| 3764 | <code>      lowercase-keys: 2.0.0</code> | 配置键 `lowercase-keys`：为构建、部署、依赖或运行时声明参数。 |
| 3765 | <code>      normalize-url: 6.1.0</code> | 配置键 `normalize-url`：为构建、部署、依赖或运行时声明参数。 |
| 3766 | <code>      responselike: 2.0.1</code> | 配置键 `responselike`：为构建、部署、依赖或运行时声明参数。 |
| 3767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3768 | <code>  call-bind-apply-helpers@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3769 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3770 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 3771 | <code>      function-bind: 1.1.2</code> | 配置键 `function-bind`：为构建、部署、依赖或运行时声明参数。 |
| 3772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3773 | <code>  call-bound@1.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3774 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3775 | <code>      call-bind-apply-helpers: 1.0.2</code> | 配置键 `call-bind-apply-helpers`：为构建、部署、依赖或运行时声明参数。 |
| 3776 | <code>      get-intrinsic: 1.3.0</code> | 配置键 `get-intrinsic`：为构建、部署、依赖或运行时声明参数。 |
| 3777 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3778 | <code>  chainsaw@0.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3779 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3780 | <code>      traverse: 0.3.9</code> | 配置键 `traverse`：为构建、部署、依赖或运行时声明参数。 |
| 3781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3782 | <code>  chalk@4.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3783 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3784 | <code>      ansi-styles: 4.3.0</code> | 配置键 `ansi-styles`：为构建、部署、依赖或运行时声明参数。 |
| 3785 | <code>      supports-color: 7.2.0</code> | 配置键 `supports-color`：为构建、部署、依赖或运行时声明参数。 |
| 3786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3787 | <code>  chess.js@1.4.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3789 | <code>  chownr@1.1.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3791 | <code>  chownr@3.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3793 | <code>  chromium-pickle-js@0.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3795 | <code>  ci-info@4.3.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3796 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3797 | <code>  ci-info@4.4.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3799 | <code>  cli-cursor@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3800 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3801 | <code>      restore-cursor: 3.1.0</code> | 配置键 `restore-cursor`：为构建、部署、依赖或运行时声明参数。 |
| 3802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3803 | <code>  cli-spinners@2.9.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3805 | <code>  cli-truncate@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3806 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3807 | <code>      slice-ansi: 3.0.0</code> | 配置键 `slice-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 3808 | <code>      string-width: 4.2.3</code> | 配置键 `string-width`：为构建、部署、依赖或运行时声明参数。 |
| 3809 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3811 | <code>  cliui@8.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3812 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3813 | <code>      string-width: 4.2.3</code> | 配置键 `string-width`：为构建、部署、依赖或运行时声明参数。 |
| 3814 | <code>      strip-ansi: 6.0.1</code> | 配置键 `strip-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 3815 | <code>      wrap-ansi: 7.0.0</code> | 配置键 `wrap-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 3816 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3817 | <code>  clone-response@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3818 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3819 | <code>      mimic-response: 1.0.1</code> | 配置键 `mimic-response`：为构建、部署、依赖或运行时声明参数。 |
| 3820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3821 | <code>  clone@1.0.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3823 | <code>  color-convert@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3824 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3825 | <code>      color-name: 1.1.4</code> | 配置键 `color-name`：为构建、部署、依赖或运行时声明参数。 |
| 3826 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3827 | <code>  color-name@1.1.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3828 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3829 | <code>  color-string@1.9.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3830 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3831 | <code>      color-name: 1.1.4</code> | 配置键 `color-name`：为构建、部署、依赖或运行时声明参数。 |
| 3832 | <code>      simple-swizzle: 0.2.4</code> | 配置键 `simple-swizzle`：为构建、部署、依赖或运行时声明参数。 |
| 3833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3834 | <code>  color@4.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3835 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3836 | <code>      color-convert: 2.0.1</code> | 配置键 `color-convert`：为构建、部署、依赖或运行时声明参数。 |
| 3837 | <code>      color-string: 1.9.1</code> | 配置键 `color-string`：为构建、部署、依赖或运行时声明参数。 |
| 3838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3839 | <code>  combined-stream@1.0.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3840 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3841 | <code>      delayed-stream: 1.0.0</code> | 配置键 `delayed-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3843 | <code>  commander@5.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3845 | <code>  commander@9.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3846 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3847 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3848 | <code>  compare-version@0.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3850 | <code>  compress-commons@4.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3851 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3852 | <code>      buffer-crc32: 0.2.13</code> | 配置键 `buffer-crc32`：为构建、部署、依赖或运行时声明参数。 |
| 3853 | <code>      crc32-stream: 4.0.3</code> | 配置键 `crc32-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3854 | <code>      normalize-path: 3.0.0</code> | 配置键 `normalize-path`：为构建、部署、依赖或运行时声明参数。 |
| 3855 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3857 | <code>  concat-map@0.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3858 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3859 | <code>  concurrently@9.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3860 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3861 | <code>      chalk: 4.1.2</code> | 配置键 `chalk`：为构建、部署、依赖或运行时声明参数。 |
| 3862 | <code>      rxjs: 7.8.2</code> | 配置键 `rxjs`：为构建、部署、依赖或运行时声明参数。 |
| 3863 | <code>      shell-quote: 1.8.3</code> | 配置键 `shell-quote`：为构建、部署、依赖或运行时声明参数。 |
| 3864 | <code>      supports-color: 8.1.1</code> | 配置键 `supports-color`：为构建、部署、依赖或运行时声明参数。 |
| 3865 | <code>      tree-kill: 1.2.2</code> | 配置键 `tree-kill`：为构建、部署、依赖或运行时声明参数。 |
| 3866 | <code>      yargs: 17.7.2</code> | 配置键 `yargs`：为构建、部署、依赖或运行时声明参数。 |
| 3867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3868 | <code>  content-disposition@1.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3870 | <code>  content-type@1.0.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3871 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3872 | <code>  content-type@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3874 | <code>  cookie-signature@1.2.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3876 | <code>  cookie@0.7.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3877 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3878 | <code>  core-util-is@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3879 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3881 | <code>  core-util-is@1.0.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3882 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3883 | <code>  cors@2.8.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3884 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3885 | <code>      object-assign: 4.1.1</code> | 配置键 `object-assign`：为构建、部署、依赖或运行时声明参数。 |
| 3886 | <code>      vary: 1.1.2</code> | 配置键 `vary`：为构建、部署、依赖或运行时声明参数。 |
| 3887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3888 | <code>  crc-32@1.2.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3890 | <code>  crc32-stream@4.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3891 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3892 | <code>      crc-32: 1.2.2</code> | 配置键 `crc-32`：为构建、部署、依赖或运行时声明参数。 |
| 3893 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 3894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3895 | <code>  crc@3.8.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3896 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3897 | <code>      buffer: 5.7.1</code> | 配置键 `buffer`：为构建、部署、依赖或运行时声明参数。 |
| 3898 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3899 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3900 | <code>  cross-dirname@0.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3901 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3902 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3903 | <code>  cross-env@10.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3904 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3905 | <code>      '@epic-web/invariant': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3906 | <code>      cross-spawn: 7.0.6</code> | 配置键 `cross-spawn`：为构建、部署、依赖或运行时声明参数。 |
| 3907 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3908 | <code>  cross-spawn@7.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3909 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3910 | <code>      path-key: 3.1.1</code> | 配置键 `path-key`：为构建、部署、依赖或运行时声明参数。 |
| 3911 | <code>      shebang-command: 2.0.0</code> | 配置键 `shebang-command`：为构建、部署、依赖或运行时声明参数。 |
| 3912 | <code>      which: 2.0.2</code> | 配置键 `which`：为构建、部署、依赖或运行时声明参数。 |
| 3913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3914 | <code>  dayjs@1.11.21: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3916 | <code>  debug@4.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3917 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3918 | <code>      ms: 2.1.3</code> | 配置键 `ms`：为构建、部署、依赖或运行时声明参数。 |
| 3919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3920 | <code>  decompress-response@6.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3921 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3922 | <code>      mimic-response: 3.1.0</code> | 配置键 `mimic-response`：为构建、部署、依赖或运行时声明参数。 |
| 3923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3924 | <code>  deep-extend@0.6.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3926 | <code>  deepmerge@4.3.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3927 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3928 | <code>  defaults@1.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3929 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3930 | <code>      clone: 1.0.4</code> | 配置键 `clone`：为构建、部署、依赖或运行时声明参数。 |
| 3931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3932 | <code>  defer-to-connect@2.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3933 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3934 | <code>  define-data-property@1.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3935 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3936 | <code>      es-define-property: 1.0.1</code> | 配置键 `es-define-property`：为构建、部署、依赖或运行时声明参数。 |
| 3937 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 3938 | <code>      gopd: 1.2.0</code> | 配置键 `gopd`：为构建、部署、依赖或运行时声明参数。 |
| 3939 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3940 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3941 | <code>  define-properties@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3942 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3943 | <code>      define-data-property: 1.1.4</code> | 配置键 `define-data-property`：为构建、部署、依赖或运行时声明参数。 |
| 3944 | <code>      has-property-descriptors: 1.0.2</code> | 配置键 `has-property-descriptors`：为构建、部署、依赖或运行时声明参数。 |
| 3945 | <code>      object-keys: 1.1.1</code> | 配置键 `object-keys`：为构建、部署、依赖或运行时声明参数。 |
| 3946 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3947 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3948 | <code>  delayed-stream@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3950 | <code>  depd@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3951 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3952 | <code>  detect-libc@2.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3953 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3954 | <code>  detect-node@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3955 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3956 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3957 | <code>  diff@5.2.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3958 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3959 | <code>  dir-compare@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3960 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3961 | <code>      minimatch: 3.1.5</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 3962 | <code>      p-limit: 3.1.0</code> | 配置键 `p-limit`：为构建、部署、依赖或运行时声明参数。 |
| 3963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3964 | <code>  dmg-builder@26.8.1(electron-builder-squirrel-windows@26.8.1):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3965 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3966 | <code>      app-builder-lib: 26.8.1(dmg-builder@26.8.1)(electron-builder-squirrel-windows@26.8.1)</code> | 配置键 `app-builder-lib`：为构建、部署、依赖或运行时声明参数。 |
| 3967 | <code>      builder-util: 26.8.1</code> | 配置键 `builder-util`：为构建、部署、依赖或运行时声明参数。 |
| 3968 | <code>      fs-extra: 10.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 3969 | <code>      iconv-lite: 0.6.3</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 3970 | <code>      js-yaml: 4.1.1</code> | 配置键 `js-yaml`：为构建、部署、依赖或运行时声明参数。 |
| 3971 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3972 | <code>      dmg-license: 1.0.11</code> | 配置键 `dmg-license`：为构建、部署、依赖或运行时声明参数。 |
| 3973 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3974 | <code>      - electron-builder-squirrel-windows</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3975 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3976 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3977 | <code>  dmg-license@1.0.11:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3978 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3979 | <code>      '@types/plist': 3.0.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3980 | <code>      '@types/verror': 1.10.11</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3981 | <code>      ajv: 6.14.0</code> | 配置键 `ajv`：为构建、部署、依赖或运行时声明参数。 |
| 3982 | <code>      crc: 3.8.0</code> | 配置键 `crc`：为构建、部署、依赖或运行时声明参数。 |
| 3983 | <code>      iconv-corefoundation: 1.1.7</code> | 配置键 `iconv-corefoundation`：为构建、部署、依赖或运行时声明参数。 |
| 3984 | <code>      plist: 3.1.0</code> | 配置键 `plist`：为构建、部署、依赖或运行时声明参数。 |
| 3985 | <code>      smart-buffer: 4.2.0</code> | 配置键 `smart-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 3986 | <code>      verror: 1.10.1</code> | 配置键 `verror`：为构建、部署、依赖或运行时声明参数。 |
| 3987 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 3988 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3989 | <code>  dom-serializer@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3990 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3991 | <code>      domelementtype: 2.3.0</code> | 配置键 `domelementtype`：为构建、部署、依赖或运行时声明参数。 |
| 3992 | <code>      domhandler: 5.0.3</code> | 配置键 `domhandler`：为构建、部署、依赖或运行时声明参数。 |
| 3993 | <code>      entities: 4.5.0</code> | 配置键 `entities`：为构建、部署、依赖或运行时声明参数。 |
| 3994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3995 | <code>  domelementtype@2.3.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3996 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3997 | <code>  domhandler@5.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3998 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 3999 | <code>      domelementtype: 2.3.0</code> | 配置键 `domelementtype`：为构建、部署、依赖或运行时声明参数。 |
| 4000 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4001 | <code>  domutils@3.2.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4002 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4003 | <code>      dom-serializer: 2.0.0</code> | 配置键 `dom-serializer`：为构建、部署、依赖或运行时声明参数。 |
| 4004 | <code>      domelementtype: 2.3.0</code> | 配置键 `domelementtype`：为构建、部署、依赖或运行时声明参数。 |
| 4005 | <code>      domhandler: 5.0.3</code> | 配置键 `domhandler`：为构建、部署、依赖或运行时声明参数。 |
| 4006 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4007 | <code>  dotenv-expand@11.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4008 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4009 | <code>      dotenv: 16.6.1</code> | 配置键 `dotenv`：为构建、部署、依赖或运行时声明参数。 |
| 4010 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4011 | <code>  dotenv@16.6.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4013 | <code>  dunder-proto@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4014 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4015 | <code>      call-bind-apply-helpers: 1.0.2</code> | 配置键 `call-bind-apply-helpers`：为构建、部署、依赖或运行时声明参数。 |
| 4016 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 4017 | <code>      gopd: 1.2.0</code> | 配置键 `gopd`：为构建、部署、依赖或运行时声明参数。 |
| 4018 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4019 | <code>  duplexer2@0.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4020 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4021 | <code>      readable-stream: 2.3.8</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 4022 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4023 | <code>  eastasianwidth@0.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4024 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4025 | <code>  ee-first@1.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4026 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4027 | <code>  ejs@3.1.10:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4028 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4029 | <code>      jake: 10.9.4</code> | 配置键 `jake`：为构建、部署、依赖或运行时声明参数。 |
| 4030 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4031 | <code>  electron-builder-squirrel-windows@26.8.1(dmg-builder@26.8.1):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4032 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4033 | <code>      app-builder-lib: 26.8.1(dmg-builder@26.8.1)(electron-builder-squirrel-windows@26.8.1)</code> | 配置键 `app-builder-lib`：为构建、部署、依赖或运行时声明参数。 |
| 4034 | <code>      builder-util: 26.8.1</code> | 配置键 `builder-util`：为构建、部署、依赖或运行时声明参数。 |
| 4035 | <code>      electron-winstaller: 5.4.0</code> | 配置键 `electron-winstaller`：为构建、部署、依赖或运行时声明参数。 |
| 4036 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4037 | <code>      - dmg-builder</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4038 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4039 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4040 | <code>  electron-builder@26.8.1(electron-builder-squirrel-windows@26.8.1):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4041 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4042 | <code>      app-builder-lib: 26.8.1(dmg-builder@26.8.1)(electron-builder-squirrel-windows@26.8.1)</code> | 配置键 `app-builder-lib`：为构建、部署、依赖或运行时声明参数。 |
| 4043 | <code>      builder-util: 26.8.1</code> | 配置键 `builder-util`：为构建、部署、依赖或运行时声明参数。 |
| 4044 | <code>      builder-util-runtime: 9.5.1</code> | 配置键 `builder-util-runtime`：为构建、部署、依赖或运行时声明参数。 |
| 4045 | <code>      chalk: 4.1.2</code> | 配置键 `chalk`：为构建、部署、依赖或运行时声明参数。 |
| 4046 | <code>      ci-info: 4.4.0</code> | 配置键 `ci-info`：为构建、部署、依赖或运行时声明参数。 |
| 4047 | <code>      dmg-builder: 26.8.1(electron-builder-squirrel-windows@26.8.1)</code> | 配置键 `dmg-builder`：为构建、部署、依赖或运行时声明参数。 |
| 4048 | <code>      fs-extra: 10.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 4049 | <code>      lazy-val: 1.0.5</code> | 配置键 `lazy-val`：为构建、部署、依赖或运行时声明参数。 |
| 4050 | <code>      simple-update-notifier: 2.0.0</code> | 配置键 `simple-update-notifier`：为构建、部署、依赖或运行时声明参数。 |
| 4051 | <code>      yargs: 17.7.2</code> | 配置键 `yargs`：为构建、部署、依赖或运行时声明参数。 |
| 4052 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4053 | <code>      - electron-builder-squirrel-windows</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4054 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4055 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4056 | <code>  electron-publish@26.8.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4057 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4058 | <code>      '@types/fs-extra': 9.0.13</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4059 | <code>      builder-util: 26.8.1</code> | 配置键 `builder-util`：为构建、部署、依赖或运行时声明参数。 |
| 4060 | <code>      builder-util-runtime: 9.5.1</code> | 配置键 `builder-util-runtime`：为构建、部署、依赖或运行时声明参数。 |
| 4061 | <code>      chalk: 4.1.2</code> | 配置键 `chalk`：为构建、部署、依赖或运行时声明参数。 |
| 4062 | <code>      form-data: 4.0.5</code> | 配置键 `form-data`：为构建、部署、依赖或运行时声明参数。 |
| 4063 | <code>      fs-extra: 10.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 4064 | <code>      lazy-val: 1.0.5</code> | 配置键 `lazy-val`：为构建、部署、依赖或运行时声明参数。 |
| 4065 | <code>      mime: 2.6.0</code> | 配置键 `mime`：为构建、部署、依赖或运行时声明参数。 |
| 4066 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4067 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4068 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4069 | <code>  electron-winstaller@5.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4070 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4071 | <code>      '@electron/asar': 3.4.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4072 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 4073 | <code>      fs-extra: 7.0.1</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 4074 | <code>      lodash: 4.18.1</code> | 配置键 `lodash`：为构建、部署、依赖或运行时声明参数。 |
| 4075 | <code>      temp: 0.9.4</code> | 配置键 `temp`：为构建、部署、依赖或运行时声明参数。 |
| 4076 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4077 | <code>      '@electron/windows-sign': 1.2.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4078 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4079 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4080 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4081 | <code>  electron@41.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4082 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4083 | <code>      '@electron/get': 2.0.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4084 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4085 | <code>      extract-zip: 2.0.1</code> | 配置键 `extract-zip`：为构建、部署、依赖或运行时声明参数。 |
| 4086 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4087 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4089 | <code>  emoji-regex@8.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4090 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4091 | <code>  emoji-regex@9.2.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4093 | <code>  encodeurl@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4094 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4095 | <code>  encoding-japanese@2.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4096 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4097 | <code>  encoding@0.1.13:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4098 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4099 | <code>      iconv-lite: 0.6.3</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 4100 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4102 | <code>  end-of-stream@1.4.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4103 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4104 | <code>      once: 1.4.0</code> | 配置键 `once`：为构建、部署、依赖或运行时声明参数。 |
| 4105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4106 | <code>  entities@4.5.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4108 | <code>  env-paths@2.2.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4110 | <code>  err-code@2.0.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4112 | <code>  es-define-property@1.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4114 | <code>  es-errors@1.3.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4116 | <code>  es-object-atoms@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4117 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4118 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 4119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4120 | <code>  es-set-tostringtag@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4121 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4122 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 4123 | <code>      get-intrinsic: 1.3.0</code> | 配置键 `get-intrinsic`：为构建、部署、依赖或运行时声明参数。 |
| 4124 | <code>      has-tostringtag: 1.0.2</code> | 配置键 `has-tostringtag`：为构建、部署、依赖或运行时声明参数。 |
| 4125 | <code>      hasown: 2.0.2</code> | 配置键 `hasown`：为构建、部署、依赖或运行时声明参数。 |
| 4126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4127 | <code>  es6-error@4.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4128 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4130 | <code>  escalade@3.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4132 | <code>  escape-html@1.0.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4134 | <code>  escape-string-regexp@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4135 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4137 | <code>  etag@1.8.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4139 | <code>  events-universal@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4140 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4141 | <code>      bare-events: 2.8.3</code> | 配置键 `bare-events`：为构建、部署、依赖或运行时声明参数。 |
| 4142 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4143 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4145 | <code>  eventsource-parser@3.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4147 | <code>  eventsource@3.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4148 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4149 | <code>      eventsource-parser: 3.1.0</code> | 配置键 `eventsource-parser`：为构建、部署、依赖或运行时声明参数。 |
| 4150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4151 | <code>  exceljs@4.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4152 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4153 | <code>      archiver: 5.3.2</code> | 配置键 `archiver`：为构建、部署、依赖或运行时声明参数。 |
| 4154 | <code>      dayjs: 1.11.21</code> | 配置键 `dayjs`：为构建、部署、依赖或运行时声明参数。 |
| 4155 | <code>      fast-csv: 4.3.6</code> | 配置键 `fast-csv`：为构建、部署、依赖或运行时声明参数。 |
| 4156 | <code>      jszip: 3.10.1</code> | 配置键 `jszip`：为构建、部署、依赖或运行时声明参数。 |
| 4157 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 4158 | <code>      saxes: 5.0.1</code> | 配置键 `saxes`：为构建、部署、依赖或运行时声明参数。 |
| 4159 | <code>      tmp: 0.2.5</code> | 配置键 `tmp`：为构建、部署、依赖或运行时声明参数。 |
| 4160 | <code>      unzipper: 0.10.14</code> | 配置键 `unzipper`：为构建、部署、依赖或运行时声明参数。 |
| 4161 | <code>      uuid: 8.3.2</code> | 配置键 `uuid`：为构建、部署、依赖或运行时声明参数。 |
| 4162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4163 | <code>  expand-template@2.0.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4165 | <code>  exponential-backoff@3.1.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4167 | <code>  express-rate-limit@8.5.2(express@5.2.1):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4168 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4169 | <code>      express: 5.2.1</code> | 配置键 `express`：为构建、部署、依赖或运行时声明参数。 |
| 4170 | <code>      ip-address: 10.2.0</code> | 配置键 `ip-address`：为构建、部署、依赖或运行时声明参数。 |
| 4171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4172 | <code>  express@5.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4173 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4174 | <code>      accepts: 2.0.0</code> | 配置键 `accepts`：为构建、部署、依赖或运行时声明参数。 |
| 4175 | <code>      body-parser: 2.2.2</code> | 配置键 `body-parser`：为构建、部署、依赖或运行时声明参数。 |
| 4176 | <code>      content-disposition: 1.1.0</code> | 配置键 `content-disposition`：为构建、部署、依赖或运行时声明参数。 |
| 4177 | <code>      content-type: 1.0.5</code> | 配置键 `content-type`：为构建、部署、依赖或运行时声明参数。 |
| 4178 | <code>      cookie: 0.7.2</code> | 配置键 `cookie`：为构建、部署、依赖或运行时声明参数。 |
| 4179 | <code>      cookie-signature: 1.2.2</code> | 配置键 `cookie-signature`：为构建、部署、依赖或运行时声明参数。 |
| 4180 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 4181 | <code>      depd: 2.0.0</code> | 配置键 `depd`：为构建、部署、依赖或运行时声明参数。 |
| 4182 | <code>      encodeurl: 2.0.0</code> | 配置键 `encodeurl`：为构建、部署、依赖或运行时声明参数。 |
| 4183 | <code>      escape-html: 1.0.3</code> | 配置键 `escape-html`：为构建、部署、依赖或运行时声明参数。 |
| 4184 | <code>      etag: 1.8.1</code> | 配置键 `etag`：为构建、部署、依赖或运行时声明参数。 |
| 4185 | <code>      finalhandler: 2.1.1</code> | 配置键 `finalhandler`：为构建、部署、依赖或运行时声明参数。 |
| 4186 | <code>      fresh: 2.0.0</code> | 配置键 `fresh`：为构建、部署、依赖或运行时声明参数。 |
| 4187 | <code>      http-errors: 2.0.1</code> | 配置键 `http-errors`：为构建、部署、依赖或运行时声明参数。 |
| 4188 | <code>      merge-descriptors: 2.0.0</code> | 配置键 `merge-descriptors`：为构建、部署、依赖或运行时声明参数。 |
| 4189 | <code>      mime-types: 3.0.2</code> | 配置键 `mime-types`：为构建、部署、依赖或运行时声明参数。 |
| 4190 | <code>      on-finished: 2.4.1</code> | 配置键 `on-finished`：为构建、部署、依赖或运行时声明参数。 |
| 4191 | <code>      once: 1.4.0</code> | 配置键 `once`：为构建、部署、依赖或运行时声明参数。 |
| 4192 | <code>      parseurl: 1.3.3</code> | 配置键 `parseurl`：为构建、部署、依赖或运行时声明参数。 |
| 4193 | <code>      proxy-addr: 2.0.7</code> | 配置键 `proxy-addr`：为构建、部署、依赖或运行时声明参数。 |
| 4194 | <code>      qs: 6.15.2</code> | 配置键 `qs`：为构建、部署、依赖或运行时声明参数。 |
| 4195 | <code>      range-parser: 1.2.1</code> | 配置键 `range-parser`：为构建、部署、依赖或运行时声明参数。 |
| 4196 | <code>      router: 2.2.0</code> | 配置键 `router`：为构建、部署、依赖或运行时声明参数。 |
| 4197 | <code>      send: 1.2.1</code> | 配置键 `send`：为构建、部署、依赖或运行时声明参数。 |
| 4198 | <code>      serve-static: 2.2.1</code> | 配置键 `serve-static`：为构建、部署、依赖或运行时声明参数。 |
| 4199 | <code>      statuses: 2.0.2</code> | 配置键 `statuses`：为构建、部署、依赖或运行时声明参数。 |
| 4200 | <code>      type-is: 2.1.0</code> | 配置键 `type-is`：为构建、部署、依赖或运行时声明参数。 |
| 4201 | <code>      vary: 1.1.2</code> | 配置键 `vary`：为构建、部署、依赖或运行时声明参数。 |
| 4202 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4203 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4205 | <code>  extract-zip@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4206 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4207 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 4208 | <code>      get-stream: 5.2.0</code> | 配置键 `get-stream`：为构建、部署、依赖或运行时声明参数。 |
| 4209 | <code>      yauzl: 2.10.0</code> | 配置键 `yauzl`：为构建、部署、依赖或运行时声明参数。 |
| 4210 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4211 | <code>      '@types/yauzl': 2.10.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4212 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4213 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4215 | <code>  extsprintf@1.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4216 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4218 | <code>  fast-csv@4.3.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4219 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4220 | <code>      '@fast-csv/format': 4.3.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4221 | <code>      '@fast-csv/parse': 4.3.6</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4223 | <code>  fast-deep-equal@3.1.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4225 | <code>  fast-fifo@1.3.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4227 | <code>  fast-json-stable-stringify@2.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4229 | <code>  fast-uri@3.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4231 | <code>  fd-slicer@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4232 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4233 | <code>      pend: 1.2.0</code> | 配置键 `pend`：为构建、部署、依赖或运行时声明参数。 |
| 4234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4235 | <code>  fdir@6.5.0(picomatch@4.0.4):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4236 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4237 | <code>      picomatch: 4.0.4</code> | 配置键 `picomatch`：为构建、部署、依赖或运行时声明参数。 |
| 4238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4239 | <code>  filelist@1.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4240 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4241 | <code>      minimatch: 5.1.9</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 4242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4243 | <code>  finalhandler@2.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4244 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4245 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 4246 | <code>      encodeurl: 2.0.0</code> | 配置键 `encodeurl`：为构建、部署、依赖或运行时声明参数。 |
| 4247 | <code>      escape-html: 1.0.3</code> | 配置键 `escape-html`：为构建、部署、依赖或运行时声明参数。 |
| 4248 | <code>      on-finished: 2.4.1</code> | 配置键 `on-finished`：为构建、部署、依赖或运行时声明参数。 |
| 4249 | <code>      parseurl: 1.3.3</code> | 配置键 `parseurl`：为构建、部署、依赖或运行时声明参数。 |
| 4250 | <code>      statuses: 2.0.2</code> | 配置键 `statuses`：为构建、部署、依赖或运行时声明参数。 |
| 4251 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4252 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4254 | <code>  flatbuffers@1.12.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4256 | <code>  follow-redirects@1.15.11(debug@4.4.3):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4257 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4258 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 4259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4260 | <code>  foreground-child@3.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4261 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4262 | <code>      cross-spawn: 7.0.6</code> | 配置键 `cross-spawn`：为构建、部署、依赖或运行时声明参数。 |
| 4263 | <code>      signal-exit: 4.1.0</code> | 配置键 `signal-exit`：为构建、部署、依赖或运行时声明参数。 |
| 4264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4265 | <code>  form-data@4.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4266 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4267 | <code>      asynckit: 0.4.0</code> | 配置键 `asynckit`：为构建、部署、依赖或运行时声明参数。 |
| 4268 | <code>      combined-stream: 1.0.8</code> | 配置键 `combined-stream`：为构建、部署、依赖或运行时声明参数。 |
| 4269 | <code>      es-set-tostringtag: 2.1.0</code> | 配置键 `es-set-tostringtag`：为构建、部署、依赖或运行时声明参数。 |
| 4270 | <code>      hasown: 2.0.2</code> | 配置键 `hasown`：为构建、部署、依赖或运行时声明参数。 |
| 4271 | <code>      mime-types: 2.1.35</code> | 配置键 `mime-types`：为构建、部署、依赖或运行时声明参数。 |
| 4272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4273 | <code>  forwarded@0.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4275 | <code>  fresh@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4277 | <code>  fs-constants@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4279 | <code>  fs-extra@10.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4280 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4281 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4282 | <code>      jsonfile: 6.2.0</code> | 配置键 `jsonfile`：为构建、部署、依赖或运行时声明参数。 |
| 4283 | <code>      universalify: 2.0.1</code> | 配置键 `universalify`：为构建、部署、依赖或运行时声明参数。 |
| 4284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4285 | <code>  fs-extra@11.3.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4286 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4287 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4288 | <code>      jsonfile: 6.2.0</code> | 配置键 `jsonfile`：为构建、部署、依赖或运行时声明参数。 |
| 4289 | <code>      universalify: 2.0.1</code> | 配置键 `universalify`：为构建、部署、依赖或运行时声明参数。 |
| 4290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4291 | <code>  fs-extra@7.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4292 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4293 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4294 | <code>      jsonfile: 4.0.0</code> | 配置键 `jsonfile`：为构建、部署、依赖或运行时声明参数。 |
| 4295 | <code>      universalify: 0.1.2</code> | 配置键 `universalify`：为构建、部署、依赖或运行时声明参数。 |
| 4296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4297 | <code>  fs-extra@8.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4298 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4299 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4300 | <code>      jsonfile: 4.0.0</code> | 配置键 `jsonfile`：为构建、部署、依赖或运行时声明参数。 |
| 4301 | <code>      universalify: 0.1.2</code> | 配置键 `universalify`：为构建、部署、依赖或运行时声明参数。 |
| 4302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4303 | <code>  fs-extra@9.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4304 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4305 | <code>      at-least-node: 1.0.0</code> | 配置键 `at-least-node`：为构建、部署、依赖或运行时声明参数。 |
| 4306 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4307 | <code>      jsonfile: 6.2.0</code> | 配置键 `jsonfile`：为构建、部署、依赖或运行时声明参数。 |
| 4308 | <code>      universalify: 2.0.1</code> | 配置键 `universalify`：为构建、部署、依赖或运行时声明参数。 |
| 4309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4310 | <code>  fs-minipass@3.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4311 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4312 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4314 | <code>  fs.realpath@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4316 | <code>  fsevents@2.3.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4317 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4319 | <code>  fstream@1.0.12:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4320 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4321 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4322 | <code>      inherits: 2.0.4</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 4323 | <code>      mkdirp: 0.5.6</code> | 配置键 `mkdirp`：为构建、部署、依赖或运行时声明参数。 |
| 4324 | <code>      rimraf: 2.6.3</code> | 配置键 `rimraf`：为构建、部署、依赖或运行时声明参数。 |
| 4325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4326 | <code>  function-bind@1.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4328 | <code>  get-caller-file@2.0.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4330 | <code>  get-intrinsic@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4331 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4332 | <code>      call-bind-apply-helpers: 1.0.2</code> | 配置键 `call-bind-apply-helpers`：为构建、部署、依赖或运行时声明参数。 |
| 4333 | <code>      es-define-property: 1.0.1</code> | 配置键 `es-define-property`：为构建、部署、依赖或运行时声明参数。 |
| 4334 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 4335 | <code>      es-object-atoms: 1.1.1</code> | 配置键 `es-object-atoms`：为构建、部署、依赖或运行时声明参数。 |
| 4336 | <code>      function-bind: 1.1.2</code> | 配置键 `function-bind`：为构建、部署、依赖或运行时声明参数。 |
| 4337 | <code>      get-proto: 1.0.1</code> | 配置键 `get-proto`：为构建、部署、依赖或运行时声明参数。 |
| 4338 | <code>      gopd: 1.2.0</code> | 配置键 `gopd`：为构建、部署、依赖或运行时声明参数。 |
| 4339 | <code>      has-symbols: 1.1.0</code> | 配置键 `has-symbols`：为构建、部署、依赖或运行时声明参数。 |
| 4340 | <code>      hasown: 2.0.2</code> | 配置键 `hasown`：为构建、部署、依赖或运行时声明参数。 |
| 4341 | <code>      math-intrinsics: 1.1.0</code> | 配置键 `math-intrinsics`：为构建、部署、依赖或运行时声明参数。 |
| 4342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4343 | <code>  get-proto@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4344 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4345 | <code>      dunder-proto: 1.0.1</code> | 配置键 `dunder-proto`：为构建、部署、依赖或运行时声明参数。 |
| 4346 | <code>      es-object-atoms: 1.1.1</code> | 配置键 `es-object-atoms`：为构建、部署、依赖或运行时声明参数。 |
| 4347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4348 | <code>  get-stream@5.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4349 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4350 | <code>      pump: 3.0.4</code> | 配置键 `pump`：为构建、部署、依赖或运行时声明参数。 |
| 4351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4352 | <code>  github-from-package@0.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4354 | <code>  glob@10.4.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4355 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4356 | <code>      foreground-child: 3.3.1</code> | 配置键 `foreground-child`：为构建、部署、依赖或运行时声明参数。 |
| 4357 | <code>      jackspeak: 3.4.3</code> | 配置键 `jackspeak`：为构建、部署、依赖或运行时声明参数。 |
| 4358 | <code>      minimatch: 9.0.9</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 4359 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4360 | <code>      package-json-from-dist: 1.0.1</code> | 配置键 `package-json-from-dist`：为构建、部署、依赖或运行时声明参数。 |
| 4361 | <code>      path-scurry: 1.11.1</code> | 配置键 `path-scurry`：为构建、部署、依赖或运行时声明参数。 |
| 4362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4363 | <code>  glob@10.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4364 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4365 | <code>      foreground-child: 3.3.1</code> | 配置键 `foreground-child`：为构建、部署、依赖或运行时声明参数。 |
| 4366 | <code>      jackspeak: 3.4.3</code> | 配置键 `jackspeak`：为构建、部署、依赖或运行时声明参数。 |
| 4367 | <code>      minimatch: 9.0.9</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 4368 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4369 | <code>      package-json-from-dist: 1.0.1</code> | 配置键 `package-json-from-dist`：为构建、部署、依赖或运行时声明参数。 |
| 4370 | <code>      path-scurry: 1.11.1</code> | 配置键 `path-scurry`：为构建、部署、依赖或运行时声明参数。 |
| 4371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4372 | <code>  glob@7.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4373 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4374 | <code>      fs.realpath: 1.0.0</code> | 配置键 `fs.realpath`：为构建、部署、依赖或运行时声明参数。 |
| 4375 | <code>      inflight: 1.0.6</code> | 配置键 `inflight`：为构建、部署、依赖或运行时声明参数。 |
| 4376 | <code>      inherits: 2.0.4</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 4377 | <code>      minimatch: 3.1.5</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 4378 | <code>      once: 1.4.0</code> | 配置键 `once`：为构建、部署、依赖或运行时声明参数。 |
| 4379 | <code>      path-is-absolute: 1.0.1</code> | 配置键 `path-is-absolute`：为构建、部署、依赖或运行时声明参数。 |
| 4380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4381 | <code>  global-agent@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4382 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4383 | <code>      boolean: 3.2.0</code> | 配置键 `boolean`：为构建、部署、依赖或运行时声明参数。 |
| 4384 | <code>      es6-error: 4.1.1</code> | 配置键 `es6-error`：为构建、部署、依赖或运行时声明参数。 |
| 4385 | <code>      matcher: 3.0.0</code> | 配置键 `matcher`：为构建、部署、依赖或运行时声明参数。 |
| 4386 | <code>      roarr: 2.15.4</code> | 配置键 `roarr`：为构建、部署、依赖或运行时声明参数。 |
| 4387 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 4388 | <code>      serialize-error: 7.0.1</code> | 配置键 `serialize-error`：为构建、部署、依赖或运行时声明参数。 |
| 4389 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4391 | <code>  globalthis@1.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4392 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4393 | <code>      define-properties: 1.2.1</code> | 配置键 `define-properties`：为构建、部署、依赖或运行时声明参数。 |
| 4394 | <code>      gopd: 1.2.0</code> | 配置键 `gopd`：为构建、部署、依赖或运行时声明参数。 |
| 4395 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4397 | <code>  gopd@1.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4399 | <code>  got@11.8.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4400 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4401 | <code>      '@sindresorhus/is': 4.6.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4402 | <code>      '@szmarczak/http-timer': 4.0.6</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4403 | <code>      '@types/cacheable-request': 6.0.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4404 | <code>      '@types/responselike': 1.0.3</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4405 | <code>      cacheable-lookup: 5.0.4</code> | 配置键 `cacheable-lookup`：为构建、部署、依赖或运行时声明参数。 |
| 4406 | <code>      cacheable-request: 7.0.4</code> | 配置键 `cacheable-request`：为构建、部署、依赖或运行时声明参数。 |
| 4407 | <code>      decompress-response: 6.0.0</code> | 配置键 `decompress-response`：为构建、部署、依赖或运行时声明参数。 |
| 4408 | <code>      http2-wrapper: 1.0.3</code> | 配置键 `http2-wrapper`：为构建、部署、依赖或运行时声明参数。 |
| 4409 | <code>      lowercase-keys: 2.0.0</code> | 配置键 `lowercase-keys`：为构建、部署、依赖或运行时声明参数。 |
| 4410 | <code>      p-cancelable: 2.1.1</code> | 配置键 `p-cancelable`：为构建、部署、依赖或运行时声明参数。 |
| 4411 | <code>      responselike: 2.0.1</code> | 配置键 `responselike`：为构建、部署、依赖或运行时声明参数。 |
| 4412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4413 | <code>  graceful-fs@4.2.11: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4415 | <code>  guid-typescript@1.0.9: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4417 | <code>  has-flag@4.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4419 | <code>  has-property-descriptors@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4420 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4421 | <code>      es-define-property: 1.0.1</code> | 配置键 `es-define-property`：为构建、部署、依赖或运行时声明参数。 |
| 4422 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4424 | <code>  has-symbols@1.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4426 | <code>  has-tostringtag@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4427 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4428 | <code>      has-symbols: 1.1.0</code> | 配置键 `has-symbols`：为构建、部署、依赖或运行时声明参数。 |
| 4429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4430 | <code>  hasown@2.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4431 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4432 | <code>      function-bind: 1.1.2</code> | 配置键 `function-bind`：为构建、部署、依赖或运行时声明参数。 |
| 4433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4434 | <code>  he@1.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4436 | <code>  hono@4.12.23: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4437 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4438 | <code>  hosted-git-info@4.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4439 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4440 | <code>      lru-cache: 6.0.0</code> | 配置键 `lru-cache`：为构建、部署、依赖或运行时声明参数。 |
| 4441 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4442 | <code>  html-to-text@9.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4443 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4444 | <code>      '@selderee/plugin-htmlparser2': 0.11.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4445 | <code>      deepmerge: 4.3.1</code> | 配置键 `deepmerge`：为构建、部署、依赖或运行时声明参数。 |
| 4446 | <code>      dom-serializer: 2.0.0</code> | 配置键 `dom-serializer`：为构建、部署、依赖或运行时声明参数。 |
| 4447 | <code>      htmlparser2: 8.0.2</code> | 配置键 `htmlparser2`：为构建、部署、依赖或运行时声明参数。 |
| 4448 | <code>      selderee: 0.11.0</code> | 配置键 `selderee`：为构建、部署、依赖或运行时声明参数。 |
| 4449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4450 | <code>  htmlparser2@8.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4451 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4452 | <code>      domelementtype: 2.3.0</code> | 配置键 `domelementtype`：为构建、部署、依赖或运行时声明参数。 |
| 4453 | <code>      domhandler: 5.0.3</code> | 配置键 `domhandler`：为构建、部署、依赖或运行时声明参数。 |
| 4454 | <code>      domutils: 3.2.2</code> | 配置键 `domutils`：为构建、部署、依赖或运行时声明参数。 |
| 4455 | <code>      entities: 4.5.0</code> | 配置键 `entities`：为构建、部署、依赖或运行时声明参数。 |
| 4456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4457 | <code>  http-cache-semantics@4.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4459 | <code>  http-errors@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4460 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4461 | <code>      depd: 2.0.0</code> | 配置键 `depd`：为构建、部署、依赖或运行时声明参数。 |
| 4462 | <code>      inherits: 2.0.4</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 4463 | <code>      setprototypeof: 1.2.0</code> | 配置键 `setprototypeof`：为构建、部署、依赖或运行时声明参数。 |
| 4464 | <code>      statuses: 2.0.2</code> | 配置键 `statuses`：为构建、部署、依赖或运行时声明参数。 |
| 4465 | <code>      toidentifier: 1.0.1</code> | 配置键 `toidentifier`：为构建、部署、依赖或运行时声明参数。 |
| 4466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4467 | <code>  http-proxy-agent@7.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4468 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4469 | <code>      agent-base: 7.1.4</code> | 配置键 `agent-base`：为构建、部署、依赖或运行时声明参数。 |
| 4470 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 4471 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4472 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4474 | <code>  http2-wrapper@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4475 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4476 | <code>      quick-lru: 5.1.1</code> | 配置键 `quick-lru`：为构建、部署、依赖或运行时声明参数。 |
| 4477 | <code>      resolve-alpn: 1.2.1</code> | 配置键 `resolve-alpn`：为构建、部署、依赖或运行时声明参数。 |
| 4478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4479 | <code>  https-proxy-agent@7.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4480 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4481 | <code>      agent-base: 7.1.4</code> | 配置键 `agent-base`：为构建、部署、依赖或运行时声明参数。 |
| 4482 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 4483 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4484 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4486 | <code>  iconv-corefoundation@1.1.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4487 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4488 | <code>      cli-truncate: 2.1.0</code> | 配置键 `cli-truncate`：为构建、部署、依赖或运行时声明参数。 |
| 4489 | <code>      node-addon-api: 1.7.2</code> | 配置键 `node-addon-api`：为构建、部署、依赖或运行时声明参数。 |
| 4490 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4492 | <code>  iconv-lite@0.6.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4493 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4494 | <code>      safer-buffer: 2.1.2</code> | 配置键 `safer-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 4495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4496 | <code>  iconv-lite@0.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4497 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4498 | <code>      safer-buffer: 2.1.2</code> | 配置键 `safer-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 4499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4500 | <code>  ieee754@1.2.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4502 | <code>  imapflow@1.3.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4503 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4504 | <code>      '@zone-eu/mailsplit': 5.4.9</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4505 | <code>      encoding-japanese: 2.2.0</code> | 配置键 `encoding-japanese`：为构建、部署、依赖或运行时声明参数。 |
| 4506 | <code>      iconv-lite: 0.7.2</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 4507 | <code>      libbase64: 1.3.0</code> | 配置键 `libbase64`：为构建、部署、依赖或运行时声明参数。 |
| 4508 | <code>      libmime: 5.3.8</code> | 配置键 `libmime`：为构建、部署、依赖或运行时声明参数。 |
| 4509 | <code>      libqp: 2.1.1</code> | 配置键 `libqp`：为构建、部署、依赖或运行时声明参数。 |
| 4510 | <code>      nodemailer: 8.0.7</code> | 配置键 `nodemailer`：为构建、部署、依赖或运行时声明参数。 |
| 4511 | <code>      pino: 10.3.1</code> | 配置键 `pino`：为构建、部署、依赖或运行时声明参数。 |
| 4512 | <code>      socks: 2.8.8</code> | 配置键 `socks`：为构建、部署、依赖或运行时声明参数。 |
| 4513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4514 | <code>  immediate@3.0.6: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4516 | <code>  imurmurhash@0.1.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4518 | <code>  inflight@1.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4519 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4520 | <code>      once: 1.4.0</code> | 配置键 `once`：为构建、部署、依赖或运行时声明参数。 |
| 4521 | <code>      wrappy: 1.0.2</code> | 配置键 `wrappy`：为构建、部署、依赖或运行时声明参数。 |
| 4522 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4523 | <code>  inherits@2.0.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4525 | <code>  ini@1.3.8: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4527 | <code>  ip-address@10.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4529 | <code>  ip-address@10.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4530 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4531 | <code>  ipaddr.js@1.9.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4533 | <code>  is-arrayish@0.3.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4535 | <code>  is-fullwidth-code-point@3.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4537 | <code>  is-interactive@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4539 | <code>  is-promise@4.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4541 | <code>  is-unicode-supported@0.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4543 | <code>  isarray@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4545 | <code>  isbinaryfile@4.0.10: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4547 | <code>  isbinaryfile@5.0.7: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4549 | <code>  isexe@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4551 | <code>  isexe@3.1.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4552 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4553 | <code>  jackspeak@3.4.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4554 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4555 | <code>      '@isaacs/cliui': 8.0.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4556 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4557 | <code>      '@pkgjs/parseargs': 0.11.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4559 | <code>  jake@10.9.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4560 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4561 | <code>      async: 3.2.6</code> | 配置键 `async`：为构建、部署、依赖或运行时声明参数。 |
| 4562 | <code>      filelist: 1.0.6</code> | 配置键 `filelist`：为构建、部署、依赖或运行时声明参数。 |
| 4563 | <code>      picocolors: 1.1.1</code> | 配置键 `picocolors`：为构建、部署、依赖或运行时声明参数。 |
| 4564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4565 | <code>  jiti@2.6.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4567 | <code>  joi@18.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4568 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4569 | <code>      '@hapi/address': 5.1.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4570 | <code>      '@hapi/formula': 3.0.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4571 | <code>      '@hapi/hoek': 11.0.7</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4572 | <code>      '@hapi/pinpoint': 2.0.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4573 | <code>      '@hapi/tlds': 1.1.6</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4574 | <code>      '@hapi/topo': 6.0.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4575 | <code>      '@standard-schema/spec': 1.1.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4577 | <code>  jose@6.2.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4579 | <code>  js-tokens@4.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4581 | <code>  js-yaml@4.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4582 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4583 | <code>      argparse: 2.0.1</code> | 配置键 `argparse`：为构建、部署、依赖或运行时声明参数。 |
| 4584 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4585 | <code>  jsesc@3.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4587 | <code>  json-buffer@3.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4589 | <code>  json-schema-traverse@0.4.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4591 | <code>  json-schema-traverse@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4593 | <code>  json-schema-typed@8.0.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4594 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4595 | <code>  json-stringify-safe@5.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4596 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4598 | <code>  json5@2.2.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4600 | <code>  jsonfile@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4601 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4602 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4604 | <code>  jsonfile@6.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4605 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4606 | <code>      universalify: 2.0.1</code> | 配置键 `universalify`：为构建、部署、依赖或运行时声明参数。 |
| 4607 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4608 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4610 | <code>  jszip@3.10.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4611 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4612 | <code>      lie: 3.3.0</code> | 配置键 `lie`：为构建、部署、依赖或运行时声明参数。 |
| 4613 | <code>      pako: 1.0.11</code> | 配置键 `pako`：为构建、部署、依赖或运行时声明参数。 |
| 4614 | <code>      readable-stream: 2.3.8</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 4615 | <code>      setimmediate: 1.0.5</code> | 配置键 `setimmediate`：为构建、部署、依赖或运行时声明参数。 |
| 4616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4617 | <code>  keyv@4.5.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4618 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4619 | <code>      json-buffer: 3.0.1</code> | 配置键 `json-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 4620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4621 | <code>  lazy-val@1.0.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4622 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4623 | <code>  lazystream@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4624 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4625 | <code>      readable-stream: 2.3.8</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 4626 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4627 | <code>  leac@0.6.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4628 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4629 | <code>  libbase64@1.3.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4631 | <code>  libmime@5.3.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4632 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4633 | <code>      encoding-japanese: 2.2.0</code> | 配置键 `encoding-japanese`：为构建、部署、依赖或运行时声明参数。 |
| 4634 | <code>      iconv-lite: 0.6.3</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 4635 | <code>      libbase64: 1.3.0</code> | 配置键 `libbase64`：为构建、部署、依赖或运行时声明参数。 |
| 4636 | <code>      libqp: 2.1.1</code> | 配置键 `libqp`：为构建、部署、依赖或运行时声明参数。 |
| 4637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4638 | <code>  libmime@5.3.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4639 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4640 | <code>      encoding-japanese: 2.2.0</code> | 配置键 `encoding-japanese`：为构建、部署、依赖或运行时声明参数。 |
| 4641 | <code>      iconv-lite: 0.7.2</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 4642 | <code>      libbase64: 1.3.0</code> | 配置键 `libbase64`：为构建、部署、依赖或运行时声明参数。 |
| 4643 | <code>      libqp: 2.1.1</code> | 配置键 `libqp`：为构建、部署、依赖或运行时声明参数。 |
| 4644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4645 | <code>  libqp@2.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4647 | <code>  lie@3.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4648 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4649 | <code>      immediate: 3.0.6</code> | 配置键 `immediate`：为构建、部署、依赖或运行时声明参数。 |
| 4650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4651 | <code>  lightningcss-android-arm64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4652 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4653 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4654 | <code>  lightningcss-darwin-arm64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4655 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4657 | <code>  lightningcss-darwin-x64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4658 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4660 | <code>  lightningcss-freebsd-x64@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4661 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4662 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4663 | <code>  lightningcss-linux-arm-gnueabihf@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4664 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4666 | <code>  lightningcss-linux-arm64-gnu@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4667 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4669 | <code>  lightningcss-linux-arm64-musl@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4670 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4672 | <code>  lightningcss-linux-x64-gnu@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4673 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4675 | <code>  lightningcss-linux-x64-musl@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4676 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4677 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4678 | <code>  lightningcss-win32-arm64-msvc@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4679 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4681 | <code>  lightningcss-win32-x64-msvc@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4682 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4683 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4684 | <code>  lightningcss@1.32.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4685 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4686 | <code>      detect-libc: 2.1.2</code> | 配置键 `detect-libc`：为构建、部署、依赖或运行时声明参数。 |
| 4687 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4688 | <code>      lightningcss-android-arm64: 1.32.0</code> | 配置键 `lightningcss-android-arm64`：为构建、部署、依赖或运行时声明参数。 |
| 4689 | <code>      lightningcss-darwin-arm64: 1.32.0</code> | 配置键 `lightningcss-darwin-arm64`：为构建、部署、依赖或运行时声明参数。 |
| 4690 | <code>      lightningcss-darwin-x64: 1.32.0</code> | 配置键 `lightningcss-darwin-x64`：为构建、部署、依赖或运行时声明参数。 |
| 4691 | <code>      lightningcss-freebsd-x64: 1.32.0</code> | 配置键 `lightningcss-freebsd-x64`：为构建、部署、依赖或运行时声明参数。 |
| 4692 | <code>      lightningcss-linux-arm-gnueabihf: 1.32.0</code> | 配置键 `lightningcss-linux-arm-gnueabihf`：为构建、部署、依赖或运行时声明参数。 |
| 4693 | <code>      lightningcss-linux-arm64-gnu: 1.32.0</code> | 配置键 `lightningcss-linux-arm64-gnu`：为构建、部署、依赖或运行时声明参数。 |
| 4694 | <code>      lightningcss-linux-arm64-musl: 1.32.0</code> | 配置键 `lightningcss-linux-arm64-musl`：为构建、部署、依赖或运行时声明参数。 |
| 4695 | <code>      lightningcss-linux-x64-gnu: 1.32.0</code> | 配置键 `lightningcss-linux-x64-gnu`：为构建、部署、依赖或运行时声明参数。 |
| 4696 | <code>      lightningcss-linux-x64-musl: 1.32.0</code> | 配置键 `lightningcss-linux-x64-musl`：为构建、部署、依赖或运行时声明参数。 |
| 4697 | <code>      lightningcss-win32-arm64-msvc: 1.32.0</code> | 配置键 `lightningcss-win32-arm64-msvc`：为构建、部署、依赖或运行时声明参数。 |
| 4698 | <code>      lightningcss-win32-x64-msvc: 1.32.0</code> | 配置键 `lightningcss-win32-x64-msvc`：为构建、部署、依赖或运行时声明参数。 |
| 4699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4700 | <code>  linkify-it@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4701 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4702 | <code>      uc.micro: 2.1.0</code> | 配置键 `uc.micro`：为构建、部署、依赖或运行时声明参数。 |
| 4703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4704 | <code>  listenercount@1.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4706 | <code>  lodash.defaults@4.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4708 | <code>  lodash.difference@4.5.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4710 | <code>  lodash.escaperegexp@4.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4712 | <code>  lodash.flatten@4.4.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4713 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4714 | <code>  lodash.groupby@4.6.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4716 | <code>  lodash.isboolean@3.0.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4718 | <code>  lodash.isequal@4.5.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4720 | <code>  lodash.isfunction@3.0.9: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4722 | <code>  lodash.isnil@4.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4724 | <code>  lodash.isplainobject@4.0.6: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4726 | <code>  lodash.isundefined@3.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4728 | <code>  lodash.union@4.6.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4729 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4730 | <code>  lodash.uniq@4.5.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4732 | <code>  lodash@4.18.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4734 | <code>  log-symbols@4.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4735 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4736 | <code>      chalk: 4.1.2</code> | 配置键 `chalk`：为构建、部署、依赖或运行时声明参数。 |
| 4737 | <code>      is-unicode-supported: 0.1.0</code> | 配置键 `is-unicode-supported`：为构建、部署、依赖或运行时声明参数。 |
| 4738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4739 | <code>  long@4.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4741 | <code>  lowercase-keys@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4743 | <code>  lru-cache@10.4.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4745 | <code>  lru-cache@6.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4746 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4747 | <code>      yallist: 4.0.0</code> | 配置键 `yallist`：为构建、部署、依赖或运行时声明参数。 |
| 4748 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4749 | <code>  mailparser@3.9.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4750 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4751 | <code>      '@zone-eu/mailsplit': 5.4.8</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4752 | <code>      encoding-japanese: 2.2.0</code> | 配置键 `encoding-japanese`：为构建、部署、依赖或运行时声明参数。 |
| 4753 | <code>      he: 1.2.0</code> | 配置键 `he`：为构建、部署、依赖或运行时声明参数。 |
| 4754 | <code>      html-to-text: 9.0.5</code> | 配置键 `html-to-text`：为构建、部署、依赖或运行时声明参数。 |
| 4755 | <code>      iconv-lite: 0.7.2</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 4756 | <code>      libmime: 5.3.8</code> | 配置键 `libmime`：为构建、部署、依赖或运行时声明参数。 |
| 4757 | <code>      linkify-it: 5.0.0</code> | 配置键 `linkify-it`：为构建、部署、依赖或运行时声明参数。 |
| 4758 | <code>      nodemailer: 8.0.5</code> | 配置键 `nodemailer`：为构建、部署、依赖或运行时声明参数。 |
| 4759 | <code>      punycode.js: 2.3.1</code> | 配置键 `punycode.js`：为构建、部署、依赖或运行时声明参数。 |
| 4760 | <code>      tlds: 1.261.0</code> | 配置键 `tlds`：为构建、部署、依赖或运行时声明参数。 |
| 4761 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4762 | <code>  make-fetch-happen@14.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4763 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4764 | <code>      '@npmcli/agent': 3.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4765 | <code>      cacache: 19.0.1</code> | 配置键 `cacache`：为构建、部署、依赖或运行时声明参数。 |
| 4766 | <code>      http-cache-semantics: 4.2.0</code> | 配置键 `http-cache-semantics`：为构建、部署、依赖或运行时声明参数。 |
| 4767 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4768 | <code>      minipass-fetch: 4.0.1</code> | 配置键 `minipass-fetch`：为构建、部署、依赖或运行时声明参数。 |
| 4769 | <code>      minipass-flush: 1.0.7</code> | 配置键 `minipass-flush`：为构建、部署、依赖或运行时声明参数。 |
| 4770 | <code>      minipass-pipeline: 1.2.4</code> | 配置键 `minipass-pipeline`：为构建、部署、依赖或运行时声明参数。 |
| 4771 | <code>      negotiator: 1.0.0</code> | 配置键 `negotiator`：为构建、部署、依赖或运行时声明参数。 |
| 4772 | <code>      proc-log: 5.0.0</code> | 配置键 `proc-log`：为构建、部署、依赖或运行时声明参数。 |
| 4773 | <code>      promise-retry: 2.0.1</code> | 配置键 `promise-retry`：为构建、部署、依赖或运行时声明参数。 |
| 4774 | <code>      ssri: 12.0.0</code> | 配置键 `ssri`：为构建、部署、依赖或运行时声明参数。 |
| 4775 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4776 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4777 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4778 | <code>  matcher@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4779 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4780 | <code>      escape-string-regexp: 4.0.0</code> | 配置键 `escape-string-regexp`：为构建、部署、依赖或运行时声明参数。 |
| 4781 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4783 | <code>  math-intrinsics@1.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4785 | <code>  media-typer@1.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4787 | <code>  merge-descriptors@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4789 | <code>  mime-db@1.52.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4791 | <code>  mime-db@1.54.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4793 | <code>  mime-types@2.1.35:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4794 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4795 | <code>      mime-db: 1.52.0</code> | 配置键 `mime-db`：为构建、部署、依赖或运行时声明参数。 |
| 4796 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4797 | <code>  mime-types@3.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4798 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4799 | <code>      mime-db: 1.54.0</code> | 配置键 `mime-db`：为构建、部署、依赖或运行时声明参数。 |
| 4800 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4801 | <code>  mime@2.6.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4803 | <code>  mimic-fn@2.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4805 | <code>  mimic-response@1.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4806 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4807 | <code>  mimic-response@3.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4809 | <code>  minimatch@10.2.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4810 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4811 | <code>      brace-expansion: 5.0.5</code> | 配置键 `brace-expansion`：为构建、部署、依赖或运行时声明参数。 |
| 4812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4813 | <code>  minimatch@3.1.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4814 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4815 | <code>      brace-expansion: 1.1.14</code> | 配置键 `brace-expansion`：为构建、部署、依赖或运行时声明参数。 |
| 4816 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4817 | <code>  minimatch@5.1.9:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4818 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4819 | <code>      brace-expansion: 2.1.0</code> | 配置键 `brace-expansion`：为构建、部署、依赖或运行时声明参数。 |
| 4820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4821 | <code>  minimatch@9.0.9:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4822 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4823 | <code>      brace-expansion: 2.1.0</code> | 配置键 `brace-expansion`：为构建、部署、依赖或运行时声明参数。 |
| 4824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4825 | <code>  minimist@1.2.8: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4826 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4827 | <code>  minipass-collect@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4828 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4829 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4831 | <code>  minipass-fetch@4.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4832 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4833 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4834 | <code>      minipass-sized: 1.0.3</code> | 配置键 `minipass-sized`：为构建、部署、依赖或运行时声明参数。 |
| 4835 | <code>      minizlib: 3.1.0</code> | 配置键 `minizlib`：为构建、部署、依赖或运行时声明参数。 |
| 4836 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4837 | <code>      encoding: 0.1.13</code> | 配置键 `encoding`：为构建、部署、依赖或运行时声明参数。 |
| 4838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4839 | <code>  minipass-flush@1.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4840 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4841 | <code>      minipass: 3.3.6</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4843 | <code>  minipass-pipeline@1.2.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4844 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4845 | <code>      minipass: 3.3.6</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4847 | <code>  minipass-sized@1.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4848 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4849 | <code>      minipass: 3.3.6</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4850 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4851 | <code>  minipass@3.3.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4852 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4853 | <code>      yallist: 4.0.0</code> | 配置键 `yallist`：为构建、部署、依赖或运行时声明参数。 |
| 4854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4855 | <code>  minipass@7.1.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4857 | <code>  minizlib@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4858 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4859 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 4860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4861 | <code>  mkdirp-classic@0.5.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4862 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4863 | <code>  mkdirp@0.5.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4864 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4865 | <code>      minimist: 1.2.8</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 4866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4867 | <code>  ms@2.1.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4868 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4869 | <code>  nanoid@3.3.11: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4871 | <code>  napi-build-utils@2.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4872 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4873 | <code>  negotiator@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4874 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4875 | <code>  node-abi@3.92.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4876 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4877 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 4878 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4879 | <code>  node-abi@4.28.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4880 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4881 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 4882 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4883 | <code>  node-addon-api@1.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4884 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4885 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4886 | <code>  node-addon-api@6.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4888 | <code>  node-addon-api@7.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4890 | <code>  node-api-version@0.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4891 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4892 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 4893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4894 | <code>  node-gyp@11.5.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4895 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4896 | <code>      env-paths: 2.2.1</code> | 配置键 `env-paths`：为构建、部署、依赖或运行时声明参数。 |
| 4897 | <code>      exponential-backoff: 3.1.3</code> | 配置键 `exponential-backoff`：为构建、部署、依赖或运行时声明参数。 |
| 4898 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 4899 | <code>      make-fetch-happen: 14.0.3</code> | 配置键 `make-fetch-happen`：为构建、部署、依赖或运行时声明参数。 |
| 4900 | <code>      nopt: 8.1.0</code> | 配置键 `nopt`：为构建、部署、依赖或运行时声明参数。 |
| 4901 | <code>      proc-log: 5.0.0</code> | 配置键 `proc-log`：为构建、部署、依赖或运行时声明参数。 |
| 4902 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 4903 | <code>      tar: 7.5.13</code> | 配置键 `tar`：为构建、部署、依赖或运行时声明参数。 |
| 4904 | <code>      tinyglobby: 0.2.15</code> | 配置键 `tinyglobby`：为构建、部署、依赖或运行时声明参数。 |
| 4905 | <code>      which: 5.0.0</code> | 配置键 `which`：为构建、部署、依赖或运行时声明参数。 |
| 4906 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4907 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4909 | <code>  node-pty@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4910 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4911 | <code>      node-addon-api: 7.1.1</code> | 配置键 `node-addon-api`：为构建、部署、依赖或运行时声明参数。 |
| 4912 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4913 | <code>  nodemailer@8.0.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4915 | <code>  nodemailer@8.0.7: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4916 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4917 | <code>  nopt@8.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4918 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4919 | <code>      abbrev: 3.0.1</code> | 配置键 `abbrev`：为构建、部署、依赖或运行时声明参数。 |
| 4920 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4921 | <code>  normalize-path@3.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4923 | <code>  normalize-url@6.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4924 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4925 | <code>  object-assign@4.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4927 | <code>  object-inspect@1.13.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4929 | <code>  object-keys@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4930 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4932 | <code>  on-exit-leak-free@2.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4933 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4934 | <code>  on-finished@2.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4935 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4936 | <code>      ee-first: 1.1.1</code> | 配置键 `ee-first`：为构建、部署、依赖或运行时声明参数。 |
| 4937 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4938 | <code>  once@1.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4939 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4940 | <code>      wrappy: 1.0.2</code> | 配置键 `wrappy`：为构建、部署、依赖或运行时声明参数。 |
| 4941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4942 | <code>  onetime@5.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4943 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4944 | <code>      mimic-fn: 2.1.0</code> | 配置键 `mimic-fn`：为构建、部署、依赖或运行时声明参数。 |
| 4945 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4946 | <code>  onnx-proto@4.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4947 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4948 | <code>      protobufjs: 6.11.6</code> | 配置键 `protobufjs`：为构建、部署、依赖或运行时声明参数。 |
| 4949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4950 | <code>  onnxruntime-common@1.14.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4951 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4952 | <code>  onnxruntime-node@1.14.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4953 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4954 | <code>      onnxruntime-common: 1.14.0</code> | 配置键 `onnxruntime-common`：为构建、部署、依赖或运行时声明参数。 |
| 4955 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 4956 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4957 | <code>  onnxruntime-web@1.14.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4958 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4959 | <code>      flatbuffers: 1.12.0</code> | 配置键 `flatbuffers`：为构建、部署、依赖或运行时声明参数。 |
| 4960 | <code>      guid-typescript: 1.0.9</code> | 配置键 `guid-typescript`：为构建、部署、依赖或运行时声明参数。 |
| 4961 | <code>      long: 4.0.0</code> | 配置键 `long`：为构建、部署、依赖或运行时声明参数。 |
| 4962 | <code>      onnx-proto: 4.0.4</code> | 配置键 `onnx-proto`：为构建、部署、依赖或运行时声明参数。 |
| 4963 | <code>      onnxruntime-common: 1.14.0</code> | 配置键 `onnxruntime-common`：为构建、部署、依赖或运行时声明参数。 |
| 4964 | <code>      platform: 1.3.6</code> | 配置键 `platform`：为构建、部署、依赖或运行时声明参数。 |
| 4965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4966 | <code>  ora@5.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4967 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4968 | <code>      bl: 4.1.0</code> | 配置键 `bl`：为构建、部署、依赖或运行时声明参数。 |
| 4969 | <code>      chalk: 4.1.2</code> | 配置键 `chalk`：为构建、部署、依赖或运行时声明参数。 |
| 4970 | <code>      cli-cursor: 3.1.0</code> | 配置键 `cli-cursor`：为构建、部署、依赖或运行时声明参数。 |
| 4971 | <code>      cli-spinners: 2.9.2</code> | 配置键 `cli-spinners`：为构建、部署、依赖或运行时声明参数。 |
| 4972 | <code>      is-interactive: 1.0.0</code> | 配置键 `is-interactive`：为构建、部署、依赖或运行时声明参数。 |
| 4973 | <code>      is-unicode-supported: 0.1.0</code> | 配置键 `is-unicode-supported`：为构建、部署、依赖或运行时声明参数。 |
| 4974 | <code>      log-symbols: 4.1.0</code> | 配置键 `log-symbols`：为构建、部署、依赖或运行时声明参数。 |
| 4975 | <code>      strip-ansi: 6.0.1</code> | 配置键 `strip-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 4976 | <code>      wcwidth: 1.0.1</code> | 配置键 `wcwidth`：为构建、部署、依赖或运行时声明参数。 |
| 4977 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4978 | <code>  p-cancelable@2.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4979 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4980 | <code>  p-limit@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4981 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4982 | <code>      yocto-queue: 0.1.0</code> | 配置键 `yocto-queue`：为构建、部署、依赖或运行时声明参数。 |
| 4983 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4984 | <code>  p-map@7.0.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4986 | <code>  package-json-from-dist@1.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4987 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4988 | <code>  pako@1.0.11: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4989 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4990 | <code>  parseley@0.12.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4991 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 4992 | <code>      leac: 0.6.0</code> | 配置键 `leac`：为构建、部署、依赖或运行时声明参数。 |
| 4993 | <code>      peberminta: 0.9.0</code> | 配置键 `peberminta`：为构建、部署、依赖或运行时声明参数。 |
| 4994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4995 | <code>  parseurl@1.3.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4996 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4997 | <code>  path-is-absolute@1.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 4998 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4999 | <code>  path-key@3.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5000 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5001 | <code>  path-scurry@1.11.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5002 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5003 | <code>      lru-cache: 10.4.3</code> | 配置键 `lru-cache`：为构建、部署、依赖或运行时声明参数。 |
| 5004 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 5005 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5006 | <code>  path-to-regexp@8.4.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5007 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5008 | <code>  pdfjs-dist@6.0.227:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5009 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5010 | <code>      '@napi-rs/canvas': 1.0.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5012 | <code>  pe-library@0.4.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5014 | <code>  peberminta@0.9.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5015 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5016 | <code>  pend@1.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5018 | <code>  picocolors@1.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5019 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5020 | <code>  picomatch@4.0.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5021 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5022 | <code>  pino-abstract-transport@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5023 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5024 | <code>      split2: 4.2.0</code> | 配置键 `split2`：为构建、部署、依赖或运行时声明参数。 |
| 5025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5026 | <code>  pino-std-serializers@7.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5028 | <code>  pino@10.3.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5029 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5030 | <code>      '@pinojs/redact': 0.4.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5031 | <code>      atomic-sleep: 1.0.0</code> | 配置键 `atomic-sleep`：为构建、部署、依赖或运行时声明参数。 |
| 5032 | <code>      on-exit-leak-free: 2.1.2</code> | 配置键 `on-exit-leak-free`：为构建、部署、依赖或运行时声明参数。 |
| 5033 | <code>      pino-abstract-transport: 3.0.0</code> | 配置键 `pino-abstract-transport`：为构建、部署、依赖或运行时声明参数。 |
| 5034 | <code>      pino-std-serializers: 7.1.0</code> | 配置键 `pino-std-serializers`：为构建、部署、依赖或运行时声明参数。 |
| 5035 | <code>      process-warning: 5.0.0</code> | 配置键 `process-warning`：为构建、部署、依赖或运行时声明参数。 |
| 5036 | <code>      quick-format-unescaped: 4.0.4</code> | 配置键 `quick-format-unescaped`：为构建、部署、依赖或运行时声明参数。 |
| 5037 | <code>      real-require: 0.2.0</code> | 配置键 `real-require`：为构建、部署、依赖或运行时声明参数。 |
| 5038 | <code>      safe-stable-stringify: 2.5.0</code> | 配置键 `safe-stable-stringify`：为构建、部署、依赖或运行时声明参数。 |
| 5039 | <code>      sonic-boom: 4.2.1</code> | 配置键 `sonic-boom`：为构建、部署、依赖或运行时声明参数。 |
| 5040 | <code>      thread-stream: 4.2.0</code> | 配置键 `thread-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5041 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5042 | <code>  pinyin-pro@3.28.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5044 | <code>  pkce-challenge@5.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5045 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5046 | <code>  platform@1.3.6: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5048 | <code>  plist@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5049 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5050 | <code>      '@xmldom/xmldom': 0.8.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5051 | <code>      base64-js: 1.5.1</code> | 配置键 `base64-js`：为构建、部署、依赖或运行时声明参数。 |
| 5052 | <code>      xmlbuilder: 15.1.1</code> | 配置键 `xmlbuilder`：为构建、部署、依赖或运行时声明参数。 |
| 5053 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5054 | <code>  postcss@8.5.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5055 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5056 | <code>      nanoid: 3.3.11</code> | 配置键 `nanoid`：为构建、部署、依赖或运行时声明参数。 |
| 5057 | <code>      picocolors: 1.1.1</code> | 配置键 `picocolors`：为构建、部署、依赖或运行时声明参数。 |
| 5058 | <code>      source-map-js: 1.2.1</code> | 配置键 `source-map-js`：为构建、部署、依赖或运行时声明参数。 |
| 5059 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5060 | <code>  postject@1.0.0-alpha.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5061 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5062 | <code>      commander: 9.5.0</code> | 配置键 `commander`：为构建、部署、依赖或运行时声明参数。 |
| 5063 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5064 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5065 | <code>  prebuild-install@7.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5066 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5067 | <code>      detect-libc: 2.1.2</code> | 配置键 `detect-libc`：为构建、部署、依赖或运行时声明参数。 |
| 5068 | <code>      expand-template: 2.0.3</code> | 配置键 `expand-template`：为构建、部署、依赖或运行时声明参数。 |
| 5069 | <code>      github-from-package: 0.0.0</code> | 配置键 `github-from-package`：为构建、部署、依赖或运行时声明参数。 |
| 5070 | <code>      minimist: 1.2.8</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 5071 | <code>      mkdirp-classic: 0.5.3</code> | 配置键 `mkdirp-classic`：为构建、部署、依赖或运行时声明参数。 |
| 5072 | <code>      napi-build-utils: 2.0.0</code> | 配置键 `napi-build-utils`：为构建、部署、依赖或运行时声明参数。 |
| 5073 | <code>      node-abi: 3.92.0</code> | 配置键 `node-abi`：为构建、部署、依赖或运行时声明参数。 |
| 5074 | <code>      pump: 3.0.4</code> | 配置键 `pump`：为构建、部署、依赖或运行时声明参数。 |
| 5075 | <code>      rc: 1.2.8</code> | 配置键 `rc`：为构建、部署、依赖或运行时声明参数。 |
| 5076 | <code>      simple-get: 4.0.1</code> | 配置键 `simple-get`：为构建、部署、依赖或运行时声明参数。 |
| 5077 | <code>      tar-fs: 2.1.4</code> | 配置键 `tar-fs`：为构建、部署、依赖或运行时声明参数。 |
| 5078 | <code>      tunnel-agent: 0.6.0</code> | 配置键 `tunnel-agent`：为构建、部署、依赖或运行时声明参数。 |
| 5079 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5080 | <code>  proc-log@5.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5081 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5082 | <code>  process-nextick-args@2.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5083 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5084 | <code>  process-warning@5.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5085 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5086 | <code>  progress@2.0.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5087 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5088 | <code>  promise-retry@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5089 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5090 | <code>      err-code: 2.0.3</code> | 配置键 `err-code`：为构建、部署、依赖或运行时声明参数。 |
| 5091 | <code>      retry: 0.12.0</code> | 配置键 `retry`：为构建、部署、依赖或运行时声明参数。 |
| 5092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5093 | <code>  proper-lockfile@4.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5094 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5095 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 5096 | <code>      retry: 0.12.0</code> | 配置键 `retry`：为构建、部署、依赖或运行时声明参数。 |
| 5097 | <code>      signal-exit: 3.0.7</code> | 配置键 `signal-exit`：为构建、部署、依赖或运行时声明参数。 |
| 5098 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5099 | <code>  protobufjs@6.11.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5100 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5101 | <code>      '@protobufjs/aspromise': 1.1.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5102 | <code>      '@protobufjs/base64': 1.1.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5103 | <code>      '@protobufjs/codegen': 2.0.5</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5104 | <code>      '@protobufjs/eventemitter': 1.1.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5105 | <code>      '@protobufjs/fetch': 1.1.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5106 | <code>      '@protobufjs/float': 1.0.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5107 | <code>      '@protobufjs/inquire': 1.1.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5108 | <code>      '@protobufjs/path': 1.1.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5109 | <code>      '@protobufjs/pool': 1.1.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5110 | <code>      '@protobufjs/utf8': 1.1.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5111 | <code>      '@types/long': 4.0.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5112 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5113 | <code>      long: 4.0.0</code> | 配置键 `long`：为构建、部署、依赖或运行时声明参数。 |
| 5114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5115 | <code>  proxy-addr@2.0.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5116 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5117 | <code>      forwarded: 0.2.0</code> | 配置键 `forwarded`：为构建、部署、依赖或运行时声明参数。 |
| 5118 | <code>      ipaddr.js: 1.9.1</code> | 配置键 `ipaddr.js`：为构建、部署、依赖或运行时声明参数。 |
| 5119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5120 | <code>  proxy-from-env@2.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5122 | <code>  pump@3.0.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5123 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5124 | <code>      end-of-stream: 1.4.5</code> | 配置键 `end-of-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5125 | <code>      once: 1.4.0</code> | 配置键 `once`：为构建、部署、依赖或运行时声明参数。 |
| 5126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5127 | <code>  punycode.js@2.3.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5129 | <code>  punycode@2.3.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5131 | <code>  qs@6.15.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5132 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5133 | <code>      side-channel: 1.1.0</code> | 配置键 `side-channel`：为构建、部署、依赖或运行时声明参数。 |
| 5134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5135 | <code>  quick-format-unescaped@4.0.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5137 | <code>  quick-lru@5.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5139 | <code>  range-parser@1.2.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5141 | <code>  raw-body@3.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5142 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5143 | <code>      bytes: 3.1.2</code> | 配置键 `bytes`：为构建、部署、依赖或运行时声明参数。 |
| 5144 | <code>      http-errors: 2.0.1</code> | 配置键 `http-errors`：为构建、部署、依赖或运行时声明参数。 |
| 5145 | <code>      iconv-lite: 0.7.2</code> | 配置键 `iconv-lite`：为构建、部署、依赖或运行时声明参数。 |
| 5146 | <code>      unpipe: 1.0.0</code> | 配置键 `unpipe`：为构建、部署、依赖或运行时声明参数。 |
| 5147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5148 | <code>  rc@1.2.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5149 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5150 | <code>      deep-extend: 0.6.0</code> | 配置键 `deep-extend`：为构建、部署、依赖或运行时声明参数。 |
| 5151 | <code>      ini: 1.3.8</code> | 配置键 `ini`：为构建、部署、依赖或运行时声明参数。 |
| 5152 | <code>      minimist: 1.2.8</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 5153 | <code>      strip-json-comments: 2.0.1</code> | 配置键 `strip-json-comments`：为构建、部署、依赖或运行时声明参数。 |
| 5154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5155 | <code>  read-binary-file-arch@1.0.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5156 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5157 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 5158 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5159 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5161 | <code>  readable-stream@2.3.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5162 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5163 | <code>      core-util-is: 1.0.3</code> | 配置键 `core-util-is`：为构建、部署、依赖或运行时声明参数。 |
| 5164 | <code>      inherits: 2.0.4</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 5165 | <code>      isarray: 1.0.0</code> | 配置键 `isarray`：为构建、部署、依赖或运行时声明参数。 |
| 5166 | <code>      process-nextick-args: 2.0.1</code> | 配置键 `process-nextick-args`：为构建、部署、依赖或运行时声明参数。 |
| 5167 | <code>      safe-buffer: 5.1.2</code> | 配置键 `safe-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 5168 | <code>      string_decoder: 1.1.1</code> | 配置键 `string_decoder`：为构建、部署、依赖或运行时声明参数。 |
| 5169 | <code>      util-deprecate: 1.0.2</code> | 配置键 `util-deprecate`：为构建、部署、依赖或运行时声明参数。 |
| 5170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5171 | <code>  readable-stream@3.6.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5172 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5173 | <code>      inherits: 2.0.4</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 5174 | <code>      string_decoder: 1.3.0</code> | 配置键 `string_decoder`：为构建、部署、依赖或运行时声明参数。 |
| 5175 | <code>      util-deprecate: 1.0.2</code> | 配置键 `util-deprecate`：为构建、部署、依赖或运行时声明参数。 |
| 5176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5177 | <code>  readdir-glob@1.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5178 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5179 | <code>      minimatch: 5.1.9</code> | 配置键 `minimatch`：为构建、部署、依赖或运行时声明参数。 |
| 5180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5181 | <code>  real-require@0.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5183 | <code>  real-require@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5185 | <code>  require-directory@2.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5187 | <code>  require-from-string@2.0.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5189 | <code>  resedit@1.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5190 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5191 | <code>      pe-library: 0.4.1</code> | 配置键 `pe-library`：为构建、部署、依赖或运行时声明参数。 |
| 5192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5193 | <code>  resolve-alpn@1.2.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5195 | <code>  responselike@2.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5196 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5197 | <code>      lowercase-keys: 2.0.0</code> | 配置键 `lowercase-keys`：为构建、部署、依赖或运行时声明参数。 |
| 5198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5199 | <code>  restore-cursor@3.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5200 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5201 | <code>      onetime: 5.1.2</code> | 配置键 `onetime`：为构建、部署、依赖或运行时声明参数。 |
| 5202 | <code>      signal-exit: 3.0.7</code> | 配置键 `signal-exit`：为构建、部署、依赖或运行时声明参数。 |
| 5203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5204 | <code>  retry@0.12.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5206 | <code>  rimraf@2.6.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5207 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5208 | <code>      glob: 7.2.3</code> | 配置键 `glob`：为构建、部署、依赖或运行时声明参数。 |
| 5209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5210 | <code>  roarr@2.15.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5211 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5212 | <code>      boolean: 3.2.0</code> | 配置键 `boolean`：为构建、部署、依赖或运行时声明参数。 |
| 5213 | <code>      detect-node: 2.1.0</code> | 配置键 `detect-node`：为构建、部署、依赖或运行时声明参数。 |
| 5214 | <code>      globalthis: 1.0.4</code> | 配置键 `globalthis`：为构建、部署、依赖或运行时声明参数。 |
| 5215 | <code>      json-stringify-safe: 5.0.1</code> | 配置键 `json-stringify-safe`：为构建、部署、依赖或运行时声明参数。 |
| 5216 | <code>      semver-compare: 1.0.0</code> | 配置键 `semver-compare`：为构建、部署、依赖或运行时声明参数。 |
| 5217 | <code>      sprintf-js: 1.1.3</code> | 配置键 `sprintf-js`：为构建、部署、依赖或运行时声明参数。 |
| 5218 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5220 | <code>  rolldown@1.0.0-rc.12(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5221 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5222 | <code>      '@oxc-project/types': 0.122.0</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5223 | <code>      '@rolldown/pluginutils': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5224 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5225 | <code>      '@rolldown/binding-android-arm64': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5226 | <code>      '@rolldown/binding-darwin-arm64': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5227 | <code>      '@rolldown/binding-darwin-x64': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5228 | <code>      '@rolldown/binding-freebsd-x64': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5229 | <code>      '@rolldown/binding-linux-arm-gnueabihf': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5230 | <code>      '@rolldown/binding-linux-arm64-gnu': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5231 | <code>      '@rolldown/binding-linux-arm64-musl': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5232 | <code>      '@rolldown/binding-linux-ppc64-gnu': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5233 | <code>      '@rolldown/binding-linux-s390x-gnu': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5234 | <code>      '@rolldown/binding-linux-x64-gnu': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5235 | <code>      '@rolldown/binding-linux-x64-musl': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5236 | <code>      '@rolldown/binding-openharmony-arm64': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5237 | <code>      '@rolldown/binding-wasm32-wasi': 1.0.0-rc.12(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2)</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5238 | <code>      '@rolldown/binding-win32-arm64-msvc': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5239 | <code>      '@rolldown/binding-win32-x64-msvc': 1.0.0-rc.12</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5240 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5241 | <code>      - '@emnapi/core'</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5242 | <code>      - '@emnapi/runtime'</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5244 | <code>  router@2.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5245 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5246 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 5247 | <code>      depd: 2.0.0</code> | 配置键 `depd`：为构建、部署、依赖或运行时声明参数。 |
| 5248 | <code>      is-promise: 4.0.0</code> | 配置键 `is-promise`：为构建、部署、依赖或运行时声明参数。 |
| 5249 | <code>      parseurl: 1.3.3</code> | 配置键 `parseurl`：为构建、部署、依赖或运行时声明参数。 |
| 5250 | <code>      path-to-regexp: 8.4.2</code> | 配置键 `path-to-regexp`：为构建、部署、依赖或运行时声明参数。 |
| 5251 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5252 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5254 | <code>  rxjs@7.8.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5255 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5256 | <code>      tslib: 2.8.1</code> | 配置键 `tslib`：为构建、部署、依赖或运行时声明参数。 |
| 5257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5258 | <code>  safe-buffer@5.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5260 | <code>  safe-buffer@5.2.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5262 | <code>  safe-stable-stringify@2.5.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5264 | <code>  safer-buffer@2.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5266 | <code>  sanitize-filename@1.6.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5267 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5268 | <code>      truncate-utf8-bytes: 1.0.2</code> | 配置键 `truncate-utf8-bytes`：为构建、部署、依赖或运行时声明参数。 |
| 5269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5270 | <code>  sax@1.6.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5272 | <code>  saxes@5.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5273 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5274 | <code>      xmlchars: 2.2.0</code> | 配置键 `xmlchars`：为构建、部署、依赖或运行时声明参数。 |
| 5275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5276 | <code>  selderee@0.11.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5277 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5278 | <code>      parseley: 0.12.1</code> | 配置键 `parseley`：为构建、部署、依赖或运行时声明参数。 |
| 5279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5280 | <code>  semver-compare@1.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5281 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5283 | <code>  semver@5.7.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5285 | <code>  semver@6.3.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5287 | <code>  semver@7.7.4: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5289 | <code>  send@1.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5290 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5291 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 5292 | <code>      encodeurl: 2.0.0</code> | 配置键 `encodeurl`：为构建、部署、依赖或运行时声明参数。 |
| 5293 | <code>      escape-html: 1.0.3</code> | 配置键 `escape-html`：为构建、部署、依赖或运行时声明参数。 |
| 5294 | <code>      etag: 1.8.1</code> | 配置键 `etag`：为构建、部署、依赖或运行时声明参数。 |
| 5295 | <code>      fresh: 2.0.0</code> | 配置键 `fresh`：为构建、部署、依赖或运行时声明参数。 |
| 5296 | <code>      http-errors: 2.0.1</code> | 配置键 `http-errors`：为构建、部署、依赖或运行时声明参数。 |
| 5297 | <code>      mime-types: 3.0.2</code> | 配置键 `mime-types`：为构建、部署、依赖或运行时声明参数。 |
| 5298 | <code>      ms: 2.1.3</code> | 配置键 `ms`：为构建、部署、依赖或运行时声明参数。 |
| 5299 | <code>      on-finished: 2.4.1</code> | 配置键 `on-finished`：为构建、部署、依赖或运行时声明参数。 |
| 5300 | <code>      range-parser: 1.2.1</code> | 配置键 `range-parser`：为构建、部署、依赖或运行时声明参数。 |
| 5301 | <code>      statuses: 2.0.2</code> | 配置键 `statuses`：为构建、部署、依赖或运行时声明参数。 |
| 5302 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5303 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5305 | <code>  serialize-error@7.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5306 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5307 | <code>      type-fest: 0.13.1</code> | 配置键 `type-fest`：为构建、部署、依赖或运行时声明参数。 |
| 5308 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5310 | <code>  serve-static@2.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5311 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5312 | <code>      encodeurl: 2.0.0</code> | 配置键 `encodeurl`：为构建、部署、依赖或运行时声明参数。 |
| 5313 | <code>      escape-html: 1.0.3</code> | 配置键 `escape-html`：为构建、部署、依赖或运行时声明参数。 |
| 5314 | <code>      parseurl: 1.3.3</code> | 配置键 `parseurl`：为构建、部署、依赖或运行时声明参数。 |
| 5315 | <code>      send: 1.2.1</code> | 配置键 `send`：为构建、部署、依赖或运行时声明参数。 |
| 5316 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5317 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5319 | <code>  setimmediate@1.0.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5321 | <code>  setprototypeof@1.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5323 | <code>  sharp@0.32.6:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5324 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5325 | <code>      color: 4.2.3</code> | 配置键 `color`：为构建、部署、依赖或运行时声明参数。 |
| 5326 | <code>      detect-libc: 2.1.2</code> | 配置键 `detect-libc`：为构建、部署、依赖或运行时声明参数。 |
| 5327 | <code>      node-addon-api: 6.1.0</code> | 配置键 `node-addon-api`：为构建、部署、依赖或运行时声明参数。 |
| 5328 | <code>      prebuild-install: 7.1.3</code> | 配置键 `prebuild-install`：为构建、部署、依赖或运行时声明参数。 |
| 5329 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 5330 | <code>      simple-get: 4.0.1</code> | 配置键 `simple-get`：为构建、部署、依赖或运行时声明参数。 |
| 5331 | <code>      tar-fs: 3.1.2</code> | 配置键 `tar-fs`：为构建、部署、依赖或运行时声明参数。 |
| 5332 | <code>      tunnel-agent: 0.6.0</code> | 配置键 `tunnel-agent`：为构建、部署、依赖或运行时声明参数。 |
| 5333 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5334 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5335 | <code>      - bare-buffer</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5336 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5338 | <code>  shebang-command@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5339 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5340 | <code>      shebang-regex: 3.0.0</code> | 配置键 `shebang-regex`：为构建、部署、依赖或运行时声明参数。 |
| 5341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5342 | <code>  shebang-regex@3.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5344 | <code>  shell-quote@1.8.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5346 | <code>  side-channel-list@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5347 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5348 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 5349 | <code>      object-inspect: 1.13.4</code> | 配置键 `object-inspect`：为构建、部署、依赖或运行时声明参数。 |
| 5350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5351 | <code>  side-channel-map@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5352 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5353 | <code>      call-bound: 1.0.4</code> | 配置键 `call-bound`：为构建、部署、依赖或运行时声明参数。 |
| 5354 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 5355 | <code>      get-intrinsic: 1.3.0</code> | 配置键 `get-intrinsic`：为构建、部署、依赖或运行时声明参数。 |
| 5356 | <code>      object-inspect: 1.13.4</code> | 配置键 `object-inspect`：为构建、部署、依赖或运行时声明参数。 |
| 5357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5358 | <code>  side-channel-weakmap@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5359 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5360 | <code>      call-bound: 1.0.4</code> | 配置键 `call-bound`：为构建、部署、依赖或运行时声明参数。 |
| 5361 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 5362 | <code>      get-intrinsic: 1.3.0</code> | 配置键 `get-intrinsic`：为构建、部署、依赖或运行时声明参数。 |
| 5363 | <code>      object-inspect: 1.13.4</code> | 配置键 `object-inspect`：为构建、部署、依赖或运行时声明参数。 |
| 5364 | <code>      side-channel-map: 1.0.1</code> | 配置键 `side-channel-map`：为构建、部署、依赖或运行时声明参数。 |
| 5365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5366 | <code>  side-channel@1.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5367 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5368 | <code>      es-errors: 1.3.0</code> | 配置键 `es-errors`：为构建、部署、依赖或运行时声明参数。 |
| 5369 | <code>      object-inspect: 1.13.4</code> | 配置键 `object-inspect`：为构建、部署、依赖或运行时声明参数。 |
| 5370 | <code>      side-channel-list: 1.0.1</code> | 配置键 `side-channel-list`：为构建、部署、依赖或运行时声明参数。 |
| 5371 | <code>      side-channel-map: 1.0.1</code> | 配置键 `side-channel-map`：为构建、部署、依赖或运行时声明参数。 |
| 5372 | <code>      side-channel-weakmap: 1.0.2</code> | 配置键 `side-channel-weakmap`：为构建、部署、依赖或运行时声明参数。 |
| 5373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5374 | <code>  signal-exit@3.0.7: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5376 | <code>  signal-exit@4.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5378 | <code>  simple-concat@1.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5380 | <code>  simple-get@4.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5381 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5382 | <code>      decompress-response: 6.0.0</code> | 配置键 `decompress-response`：为构建、部署、依赖或运行时声明参数。 |
| 5383 | <code>      once: 1.4.0</code> | 配置键 `once`：为构建、部署、依赖或运行时声明参数。 |
| 5384 | <code>      simple-concat: 1.0.1</code> | 配置键 `simple-concat`：为构建、部署、依赖或运行时声明参数。 |
| 5385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5386 | <code>  simple-swizzle@0.2.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5387 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5388 | <code>      is-arrayish: 0.3.4</code> | 配置键 `is-arrayish`：为构建、部署、依赖或运行时声明参数。 |
| 5389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5390 | <code>  simple-update-notifier@2.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5391 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5392 | <code>      semver: 7.7.4</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 5393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5394 | <code>  slice-ansi@3.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5395 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5396 | <code>      ansi-styles: 4.3.0</code> | 配置键 `ansi-styles`：为构建、部署、依赖或运行时声明参数。 |
| 5397 | <code>      astral-regex: 2.0.0</code> | 配置键 `astral-regex`：为构建、部署、依赖或运行时声明参数。 |
| 5398 | <code>      is-fullwidth-code-point: 3.0.0</code> | 配置键 `is-fullwidth-code-point`：为构建、部署、依赖或运行时声明参数。 |
| 5399 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5401 | <code>  smart-buffer@4.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5403 | <code>  socks-proxy-agent@8.0.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5404 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5405 | <code>      agent-base: 7.1.4</code> | 配置键 `agent-base`：为构建、部署、依赖或运行时声明参数。 |
| 5406 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 5407 | <code>      socks: 2.8.7</code> | 配置键 `socks`：为构建、部署、依赖或运行时声明参数。 |
| 5408 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5409 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5411 | <code>  socks@2.8.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5412 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5413 | <code>      ip-address: 10.1.0</code> | 配置键 `ip-address`：为构建、部署、依赖或运行时声明参数。 |
| 5414 | <code>      smart-buffer: 4.2.0</code> | 配置键 `smart-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 5415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5416 | <code>  socks@2.8.8:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5417 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5418 | <code>      ip-address: 10.2.0</code> | 配置键 `ip-address`：为构建、部署、依赖或运行时声明参数。 |
| 5419 | <code>      smart-buffer: 4.2.0</code> | 配置键 `smart-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 5420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5421 | <code>  sonic-boom@4.2.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5422 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5423 | <code>      atomic-sleep: 1.0.0</code> | 配置键 `atomic-sleep`：为构建、部署、依赖或运行时声明参数。 |
| 5424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5425 | <code>  source-map-js@1.2.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5427 | <code>  source-map-support@0.5.21:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5428 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5429 | <code>      buffer-from: 1.1.2</code> | 配置键 `buffer-from`：为构建、部署、依赖或运行时声明参数。 |
| 5430 | <code>      source-map: 0.6.1</code> | 配置键 `source-map`：为构建、部署、依赖或运行时声明参数。 |
| 5431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5432 | <code>  source-map@0.6.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5434 | <code>  split2@4.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5436 | <code>  sprintf-js@1.1.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5437 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5439 | <code>  ssri@12.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5440 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5441 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 5442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5443 | <code>  stat-mode@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5445 | <code>  statuses@2.0.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5447 | <code>  stockfish@18.0.8: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5449 | <code>  streamx@2.25.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5450 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5451 | <code>      events-universal: 1.0.1</code> | 配置键 `events-universal`：为构建、部署、依赖或运行时声明参数。 |
| 5452 | <code>      fast-fifo: 1.3.2</code> | 配置键 `fast-fifo`：为构建、部署、依赖或运行时声明参数。 |
| 5453 | <code>      text-decoder: 1.2.7</code> | 配置键 `text-decoder`：为构建、部署、依赖或运行时声明参数。 |
| 5454 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5455 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5456 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5458 | <code>  string-width@4.2.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5459 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5460 | <code>      emoji-regex: 8.0.0</code> | 配置键 `emoji-regex`：为构建、部署、依赖或运行时声明参数。 |
| 5461 | <code>      is-fullwidth-code-point: 3.0.0</code> | 配置键 `is-fullwidth-code-point`：为构建、部署、依赖或运行时声明参数。 |
| 5462 | <code>      strip-ansi: 6.0.1</code> | 配置键 `strip-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 5463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5464 | <code>  string-width@5.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5465 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5466 | <code>      eastasianwidth: 0.2.0</code> | 配置键 `eastasianwidth`：为构建、部署、依赖或运行时声明参数。 |
| 5467 | <code>      emoji-regex: 9.2.2</code> | 配置键 `emoji-regex`：为构建、部署、依赖或运行时声明参数。 |
| 5468 | <code>      strip-ansi: 7.2.0</code> | 配置键 `strip-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 5469 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5470 | <code>  string_decoder@1.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5471 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5472 | <code>      safe-buffer: 5.1.2</code> | 配置键 `safe-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 5473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5474 | <code>  string_decoder@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5475 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5476 | <code>      safe-buffer: 5.2.1</code> | 配置键 `safe-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 5477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5478 | <code>  strip-ansi@6.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5479 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5480 | <code>      ansi-regex: 5.0.1</code> | 配置键 `ansi-regex`：为构建、部署、依赖或运行时声明参数。 |
| 5481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5482 | <code>  strip-ansi@7.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5483 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5484 | <code>      ansi-regex: 6.2.2</code> | 配置键 `ansi-regex`：为构建、部署、依赖或运行时声明参数。 |
| 5485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5486 | <code>  strip-json-comments@2.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5488 | <code>  sumchecker@3.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5489 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5490 | <code>      debug: 4.4.3</code> | 配置键 `debug`：为构建、部署、依赖或运行时声明参数。 |
| 5491 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5492 | <code>      - supports-color</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5494 | <code>  supports-color@7.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5495 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5496 | <code>      has-flag: 4.0.0</code> | 配置键 `has-flag`：为构建、部署、依赖或运行时声明参数。 |
| 5497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5498 | <code>  supports-color@8.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5499 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5500 | <code>      has-flag: 4.0.0</code> | 配置键 `has-flag`：为构建、部署、依赖或运行时声明参数。 |
| 5501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5502 | <code>  tar-fs@2.1.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5503 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5504 | <code>      chownr: 1.1.4</code> | 配置键 `chownr`：为构建、部署、依赖或运行时声明参数。 |
| 5505 | <code>      mkdirp-classic: 0.5.3</code> | 配置键 `mkdirp-classic`：为构建、部署、依赖或运行时声明参数。 |
| 5506 | <code>      pump: 3.0.4</code> | 配置键 `pump`：为构建、部署、依赖或运行时声明参数。 |
| 5507 | <code>      tar-stream: 2.2.0</code> | 配置键 `tar-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5509 | <code>  tar-fs@3.1.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5510 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5511 | <code>      pump: 3.0.4</code> | 配置键 `pump`：为构建、部署、依赖或运行时声明参数。 |
| 5512 | <code>      tar-stream: 3.2.0</code> | 配置键 `tar-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5513 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5514 | <code>      bare-fs: 4.7.1</code> | 配置键 `bare-fs`：为构建、部署、依赖或运行时声明参数。 |
| 5515 | <code>      bare-path: 3.0.0</code> | 配置键 `bare-path`：为构建、部署、依赖或运行时声明参数。 |
| 5516 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5517 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5518 | <code>      - bare-buffer</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5519 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5521 | <code>  tar-stream@2.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5522 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5523 | <code>      bl: 4.1.0</code> | 配置键 `bl`：为构建、部署、依赖或运行时声明参数。 |
| 5524 | <code>      end-of-stream: 1.4.5</code> | 配置键 `end-of-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5525 | <code>      fs-constants: 1.0.0</code> | 配置键 `fs-constants`：为构建、部署、依赖或运行时声明参数。 |
| 5526 | <code>      inherits: 2.0.4</code> | 配置键 `inherits`：为构建、部署、依赖或运行时声明参数。 |
| 5527 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5529 | <code>  tar-stream@3.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5530 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5531 | <code>      b4a: 1.8.1</code> | 配置键 `b4a`：为构建、部署、依赖或运行时声明参数。 |
| 5532 | <code>      bare-fs: 4.7.1</code> | 配置键 `bare-fs`：为构建、部署、依赖或运行时声明参数。 |
| 5533 | <code>      fast-fifo: 1.3.2</code> | 配置键 `fast-fifo`：为构建、部署、依赖或运行时声明参数。 |
| 5534 | <code>      streamx: 2.25.0</code> | 配置键 `streamx`：为构建、部署、依赖或运行时声明参数。 |
| 5535 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5536 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5537 | <code>      - bare-buffer</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5538 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5540 | <code>  tar@7.5.13:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5541 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5542 | <code>      '@isaacs/fs-minipass': 4.0.1</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5543 | <code>      chownr: 3.0.0</code> | 配置键 `chownr`：为构建、部署、依赖或运行时声明参数。 |
| 5544 | <code>      minipass: 7.1.3</code> | 配置键 `minipass`：为构建、部署、依赖或运行时声明参数。 |
| 5545 | <code>      minizlib: 3.1.0</code> | 配置键 `minizlib`：为构建、部署、依赖或运行时声明参数。 |
| 5546 | <code>      yallist: 5.0.0</code> | 配置键 `yallist`：为构建、部署、依赖或运行时声明参数。 |
| 5547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5548 | <code>  teex@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5549 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5550 | <code>      streamx: 2.25.0</code> | 配置键 `streamx`：为构建、部署、依赖或运行时声明参数。 |
| 5551 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5552 | <code>      - bare-abort-controller</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5553 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5555 | <code>  temp-file@3.4.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5556 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5557 | <code>      async-exit-hook: 2.0.1</code> | 配置键 `async-exit-hook`：为构建、部署、依赖或运行时声明参数。 |
| 5558 | <code>      fs-extra: 10.1.0</code> | 配置键 `fs-extra`：为构建、部署、依赖或运行时声明参数。 |
| 5559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5560 | <code>  temp@0.9.4:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5561 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5562 | <code>      mkdirp: 0.5.6</code> | 配置键 `mkdirp`：为构建、部署、依赖或运行时声明参数。 |
| 5563 | <code>      rimraf: 2.6.3</code> | 配置键 `rimraf`：为构建、部署、依赖或运行时声明参数。 |
| 5564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5565 | <code>  text-decoder@1.2.7:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5566 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5567 | <code>      b4a: 1.8.1</code> | 配置键 `b4a`：为构建、部署、依赖或运行时声明参数。 |
| 5568 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5569 | <code>      - react-native-b4a</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5571 | <code>  thread-stream@4.2.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5572 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5573 | <code>      real-require: 1.0.0</code> | 配置键 `real-require`：为构建、部署、依赖或运行时声明参数。 |
| 5574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5575 | <code>  three@0.183.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5577 | <code>  tiny-async-pool@1.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5578 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5579 | <code>      semver: 5.7.2</code> | 配置键 `semver`：为构建、部署、依赖或运行时声明参数。 |
| 5580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5581 | <code>  tinyglobby@0.2.15:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5582 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5583 | <code>      fdir: 6.5.0(picomatch@4.0.4)</code> | 配置键 `fdir`：为构建、部署、依赖或运行时声明参数。 |
| 5584 | <code>      picomatch: 4.0.4</code> | 配置键 `picomatch`：为构建、部署、依赖或运行时声明参数。 |
| 5585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5586 | <code>  tlds@1.261.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5588 | <code>  tmp-promise@3.0.3:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5589 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5590 | <code>      tmp: 0.2.5</code> | 配置键 `tmp`：为构建、部署、依赖或运行时声明参数。 |
| 5591 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5592 | <code>  tmp@0.2.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5594 | <code>  toidentifier@1.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5596 | <code>  traverse@0.3.9: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5598 | <code>  tree-kill@1.2.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5600 | <code>  truncate-utf8-bytes@1.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5601 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5602 | <code>      utf8-byte-length: 1.0.5</code> | 配置键 `utf8-byte-length`：为构建、部署、依赖或运行时声明参数。 |
| 5603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5604 | <code>  tslib@2.8.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5605 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5606 | <code>  tunnel-agent@0.6.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5607 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5608 | <code>      safe-buffer: 5.2.1</code> | 配置键 `safe-buffer`：为构建、部署、依赖或运行时声明参数。 |
| 5609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5610 | <code>  type-fest@0.13.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5611 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5613 | <code>  type-is@2.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5614 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5615 | <code>      content-type: 2.0.0</code> | 配置键 `content-type`：为构建、部署、依赖或运行时声明参数。 |
| 5616 | <code>      media-typer: 1.1.0</code> | 配置键 `media-typer`：为构建、部署、依赖或运行时声明参数。 |
| 5617 | <code>      mime-types: 3.0.2</code> | 配置键 `mime-types`：为构建、部署、依赖或运行时声明参数。 |
| 5618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5619 | <code>  typescript-language-server@5.3.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5620 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5621 | <code>      vscode-jsonrpc: 5.0.1</code> | 配置键 `vscode-jsonrpc`：为构建、部署、依赖或运行时声明参数。 |
| 5622 | <code>      vscode-languageserver-protocol: 3.17.5</code> | 配置键 `vscode-languageserver-protocol`：为构建、部署、依赖或运行时声明参数。 |
| 5623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5624 | <code>  typescript@6.0.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5626 | <code>  uc.micro@2.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5628 | <code>  undici-types@7.16.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5630 | <code>  unique-filename@4.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5631 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5632 | <code>      unique-slug: 5.0.0</code> | 配置键 `unique-slug`：为构建、部署、依赖或运行时声明参数。 |
| 5633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5634 | <code>  unique-slug@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5635 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5636 | <code>      imurmurhash: 0.1.4</code> | 配置键 `imurmurhash`：为构建、部署、依赖或运行时声明参数。 |
| 5637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5638 | <code>  universalify@0.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5639 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5640 | <code>  universalify@2.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5641 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5642 | <code>  unpipe@1.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5643 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5644 | <code>  unzipper@0.10.14:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5645 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5646 | <code>      big-integer: 1.6.52</code> | 配置键 `big-integer`：为构建、部署、依赖或运行时声明参数。 |
| 5647 | <code>      binary: 0.3.0</code> | 配置键 `binary`：为构建、部署、依赖或运行时声明参数。 |
| 5648 | <code>      bluebird: 3.4.7</code> | 配置键 `bluebird`：为构建、部署、依赖或运行时声明参数。 |
| 5649 | <code>      buffer-indexof-polyfill: 1.0.2</code> | 配置键 `buffer-indexof-polyfill`：为构建、部署、依赖或运行时声明参数。 |
| 5650 | <code>      duplexer2: 0.1.4</code> | 配置键 `duplexer2`：为构建、部署、依赖或运行时声明参数。 |
| 5651 | <code>      fstream: 1.0.12</code> | 配置键 `fstream`：为构建、部署、依赖或运行时声明参数。 |
| 5652 | <code>      graceful-fs: 4.2.11</code> | 配置键 `graceful-fs`：为构建、部署、依赖或运行时声明参数。 |
| 5653 | <code>      listenercount: 1.0.1</code> | 配置键 `listenercount`：为构建、部署、依赖或运行时声明参数。 |
| 5654 | <code>      readable-stream: 2.3.8</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5655 | <code>      setimmediate: 1.0.5</code> | 配置键 `setimmediate`：为构建、部署、依赖或运行时声明参数。 |
| 5656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5657 | <code>  uri-js@4.4.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5658 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5659 | <code>      punycode: 2.3.1</code> | 配置键 `punycode`：为构建、部署、依赖或运行时声明参数。 |
| 5660 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5661 | <code>  utf8-byte-length@1.0.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5662 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5663 | <code>  util-deprecate@1.0.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5665 | <code>  uuid@8.3.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5667 | <code>  vary@1.1.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5669 | <code>  verror@1.10.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5670 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5671 | <code>      assert-plus: 1.0.0</code> | 配置键 `assert-plus`：为构建、部署、依赖或运行时声明参数。 |
| 5672 | <code>      core-util-is: 1.0.2</code> | 配置键 `core-util-is`：为构建、部署、依赖或运行时声明参数。 |
| 5673 | <code>      extsprintf: 1.4.1</code> | 配置键 `extsprintf`：为构建、部署、依赖或运行时声明参数。 |
| 5674 | <code>    optional: true</code> | 配置键 `optional`：为构建、部署、依赖或运行时声明参数。 |
| 5675 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5676 | <code>  vite@8.0.3(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2)(@types/node@24.12.2)(jiti@2.6.1):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5677 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5678 | <code>      lightningcss: 1.32.0</code> | 配置键 `lightningcss`：为构建、部署、依赖或运行时声明参数。 |
| 5679 | <code>      picomatch: 4.0.4</code> | 配置键 `picomatch`：为构建、部署、依赖或运行时声明参数。 |
| 5680 | <code>      postcss: 8.5.8</code> | 配置键 `postcss`：为构建、部署、依赖或运行时声明参数。 |
| 5681 | <code>      rolldown: 1.0.0-rc.12(@emnapi/core@1.9.2)(@emnapi/runtime@1.9.2)</code> | 配置键 `rolldown`：为构建、部署、依赖或运行时声明参数。 |
| 5682 | <code>      tinyglobby: 0.2.15</code> | 配置键 `tinyglobby`：为构建、部署、依赖或运行时声明参数。 |
| 5683 | <code>    optionalDependencies:</code> | 配置键 `optionalDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5684 | <code>      '@types/node': 24.12.2</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5685 | <code>      fsevents: 2.3.3</code> | 配置键 `fsevents`：为构建、部署、依赖或运行时声明参数。 |
| 5686 | <code>      jiti: 2.6.1</code> | 配置键 `jiti`：为构建、部署、依赖或运行时声明参数。 |
| 5687 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5688 | <code>      - '@emnapi/core'</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5689 | <code>      - '@emnapi/runtime'</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5690 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5691 | <code>  vscode-jsonrpc@5.0.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5693 | <code>  vscode-jsonrpc@8.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5694 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5695 | <code>  vscode-languageserver-protocol@3.17.5:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5696 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5697 | <code>      vscode-jsonrpc: 8.2.0</code> | 配置键 `vscode-jsonrpc`：为构建、部署、依赖或运行时声明参数。 |
| 5698 | <code>      vscode-languageserver-types: 3.17.5</code> | 配置键 `vscode-languageserver-types`：为构建、部署、依赖或运行时声明参数。 |
| 5699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5700 | <code>  vscode-languageserver-types@3.17.5: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5702 | <code>  wait-on@9.0.5(debug@4.4.3):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5703 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5704 | <code>      axios: 1.15.0(debug@4.4.3)</code> | 配置键 `axios`：为构建、部署、依赖或运行时声明参数。 |
| 5705 | <code>      joi: 18.1.2</code> | 配置键 `joi`：为构建、部署、依赖或运行时声明参数。 |
| 5706 | <code>      lodash: 4.18.1</code> | 配置键 `lodash`：为构建、部署、依赖或运行时声明参数。 |
| 5707 | <code>      minimist: 1.2.8</code> | 配置键 `minimist`：为构建、部署、依赖或运行时声明参数。 |
| 5708 | <code>      rxjs: 7.8.2</code> | 配置键 `rxjs`：为构建、部署、依赖或运行时声明参数。 |
| 5709 | <code>    transitivePeerDependencies:</code> | 配置键 `transitivePeerDependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5710 | <code>      - debug</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5712 | <code>  wcwidth@1.0.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5713 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5714 | <code>      defaults: 1.0.4</code> | 配置键 `defaults`：为构建、部署、依赖或运行时声明参数。 |
| 5715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5716 | <code>  which@2.0.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5717 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5718 | <code>      isexe: 2.0.0</code> | 配置键 `isexe`：为构建、部署、依赖或运行时声明参数。 |
| 5719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5720 | <code>  which@5.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5721 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5722 | <code>      isexe: 3.1.5</code> | 配置键 `isexe`：为构建、部署、依赖或运行时声明参数。 |
| 5723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5724 | <code>  wrap-ansi@7.0.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5725 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5726 | <code>      ansi-styles: 4.3.0</code> | 配置键 `ansi-styles`：为构建、部署、依赖或运行时声明参数。 |
| 5727 | <code>      string-width: 4.2.3</code> | 配置键 `string-width`：为构建、部署、依赖或运行时声明参数。 |
| 5728 | <code>      strip-ansi: 6.0.1</code> | 配置键 `strip-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 5729 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5730 | <code>  wrap-ansi@8.1.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5731 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5732 | <code>      ansi-styles: 6.2.3</code> | 配置键 `ansi-styles`：为构建、部署、依赖或运行时声明参数。 |
| 5733 | <code>      string-width: 5.1.2</code> | 配置键 `string-width`：为构建、部署、依赖或运行时声明参数。 |
| 5734 | <code>      strip-ansi: 7.2.0</code> | 配置键 `strip-ansi`：为构建、部署、依赖或运行时声明参数。 |
| 5735 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5736 | <code>  wrappy@1.0.2: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5737 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5738 | <code>  xmlbuilder@15.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5739 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5740 | <code>  xmlchars@2.2.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5741 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5742 | <code>  y18n@5.0.8: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5743 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5744 | <code>  yallist@4.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5746 | <code>  yallist@5.0.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5748 | <code>  yargs-parser@21.1.1: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5750 | <code>  yargs@17.7.2:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5751 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5752 | <code>      cliui: 8.0.1</code> | 配置键 `cliui`：为构建、部署、依赖或运行时声明参数。 |
| 5753 | <code>      escalade: 3.2.0</code> | 配置键 `escalade`：为构建、部署、依赖或运行时声明参数。 |
| 5754 | <code>      get-caller-file: 2.0.5</code> | 配置键 `get-caller-file`：为构建、部署、依赖或运行时声明参数。 |
| 5755 | <code>      require-directory: 2.1.1</code> | 配置键 `require-directory`：为构建、部署、依赖或运行时声明参数。 |
| 5756 | <code>      string-width: 4.2.3</code> | 配置键 `string-width`：为构建、部署、依赖或运行时声明参数。 |
| 5757 | <code>      y18n: 5.0.8</code> | 配置键 `y18n`：为构建、部署、依赖或运行时声明参数。 |
| 5758 | <code>      yargs-parser: 21.1.1</code> | 配置键 `yargs-parser`：为构建、部署、依赖或运行时声明参数。 |
| 5759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5760 | <code>  yauzl@2.10.0:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5761 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5762 | <code>      buffer-crc32: 0.2.13</code> | 配置键 `buffer-crc32`：为构建、部署、依赖或运行时声明参数。 |
| 5763 | <code>      fd-slicer: 1.1.0</code> | 配置键 `fd-slicer`：为构建、部署、依赖或运行时声明参数。 |
| 5764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5765 | <code>  yocto-queue@0.1.0: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5767 | <code>  zip-stream@4.1.1:</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5768 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5769 | <code>      archiver-utils: 3.0.4</code> | 配置键 `archiver-utils`：为构建、部署、依赖或运行时声明参数。 |
| 5770 | <code>      compress-commons: 4.1.2</code> | 配置键 `compress-commons`：为构建、部署、依赖或运行时声明参数。 |
| 5771 | <code>      readable-stream: 3.6.2</code> | 配置键 `readable-stream`：为构建、部署、依赖或运行时声明参数。 |
| 5772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5773 | <code>  zod-to-json-schema@3.25.2(zod@4.4.3):</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 5774 | <code>    dependencies:</code> | 配置键 `dependencies`：为构建、部署、依赖或运行时声明参数。 |
| 5775 | <code>      zod: 4.4.3</code> | 配置键 `zod`：为构建、部署、依赖或运行时声明参数。 |
| 5776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5777 | <code>  zod@4.4.3: {}</code> | 配置结构行：建立层级、列表或复合配置值。 |
