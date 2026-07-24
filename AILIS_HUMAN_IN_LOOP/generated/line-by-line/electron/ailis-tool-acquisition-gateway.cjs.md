# electron/ailis-tool-acquisition-gateway.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。
- 文件类型：`source-code`
- 原始行数：3679
- SHA-256：`d25e63659e706213b5f3de680dce90147de691035938365a4b15a4e691740e91`
- 可运行副本：[打开源文件](../../../source/electron/ailis-tool-acquisition-gateway.cjs)
- 依赖：`fs/promises`、`path`、`crypto`、`child_process`、`./ailis-tool-contracts.cjs`、`./ailis-skills.cjs`、`./ailis-contract-compiler.cjs`、`./ailis-standard-tool-packs.cjs`
- 主要符号：`fsp`、`path`、`OFFICIAL_MCP_REGISTRY_URL`、`LEARNING_SCHEMA_VERSION`、`EXTERNAL_EXPOSURE_VERSION`、`EXTERNAL_AUTH_PROFILE_VERSION`、`SAFE_HTTP_METHODS`、`DEFAULT_COMPOSIO_API_BASE_URL`、`LOCAL_ADAPTER_OUTPUT_LIMIT`、`LOCAL_DOCUMENT_ADAPTERS`、`CORE_TOOL_BUNDLES`、`BUILTIN_PUBLIC_OPENAPI_OPERATIONS`、`normalizeString`、`trimmed`、`normalizeArray`、`isPlainObject`、`cloneJson`、`safeSegment`、`safeToolSegment`、`splitToolSegment`、`stripProviderPrefix`、`tool`、`provider`、`providerCompact`、`parts`、`compactPrefix`、`index`、`inferHostProvider`、`text`、`url`、`host`、`first`、`inferExternalProviderSegment`、`source`、`explicit`、`inferExternalToolSegment`、`raw`、`createExternalVirtualToolId`、`isExternalVirtualToolId`、`sampleArgsFromSchema`、`properties`、`required`、`sample`、`prop`、`readJsonFile`、`writeJsonFileAtomic`、`tmpPath`、`tokenize`、`stableTaskSignature`、`terms`、`scoreText`、`haystack`、`redactHeaders`、`redacted`、`extractResponseHeaders`、`wanted`、`result`、`lower`、`classifyHttpFailure`、`inferLocalDocumentAdapter`、`requestedType`、`key`、`adapter`、`localAdapterCommand`、`envVar`、`runProcessCapture`、`child`、`stdout`、`stderr`、`killedForOutput`、`timer`、`pythonImportProbeSource`、`markitdownConvertSource`、`doclingConvertSource`、`pythonDocumentExtractSource`、`pickServerUrl`、`servers`、`serverUrl`、`normalizeOpenApiParameterLocations`、`locations`、`name`、`firstString`、`inferComposioToolSlug`、`normalizeAuthType`、`redactUrlSecret`、`secretEnvNameForServer`、`registryMeta`、`normalizeRemote`、`type`、`requiredHeaders`、`authRequired`、`pickRegistryRemote`、`remotes`、`pickNpmPackage`、`registry`、`buildRegistryCandidate`、`server`、`meta`、`remote`、`npmPackage`、`repositoryUrl`、`latest`、`mcpConfig`、`packageName`、`sourceKind`、`id`、`description`、`buildMcpSmokeProfile`、`AILISToolAcquisitionGateway`、`availableContracts`、`availableSkills`、`availableToolIds`、`availableSkillIds`、`health`、`query`、`limit`、`includeCore`、`includeRegistry`、`includeStandardPacks`、`errors`、`candidates`、`ranked`、`core`、`rawEntries`、`latestByName`、`candidate`、`previous`、`pageLimit`、`pages`、`entries`、`cursor`、`page`、`payload`、`response`、`install`、`secretEnvVar`、`capabilityId`、`serverName`、`planArgs`、`candidateId`、`search`、`planned`、`specs`、`ok`、`contract`、`lint`、`state`、`next`、`sourceType`、`rawContracts`、`minScore`、`compiled`、`accepted`、`rejected`、`byId`、`saved`、`status`、`contracts`、`safeId`、`entry`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3 | <code>const { createHash } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4 | <code>const { spawn } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5 | <code>const { listToolContractSummaries } = require('./ailis-tool-contracts.cjs');</code> | 导入依赖 `./ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 6 | <code>const { listAILISSkills } = require('./ailis-skills.cjs');</code> | 导入依赖 `./ailis-skills.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 7 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 8 | <code>    CONTRACT_SOURCE_PROFILES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 9 | <code>    compileAndLintAilisContract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 10 | <code>    lintAilisContract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 11 | <code>    buildContractPromptCard</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 12 | <code>} = require('./ailis-contract-compiler.cjs');</code> | 导入依赖 `./ailis-contract-compiler.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 14 | <code>    STANDARD_TOOL_PACKS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 15 | <code>    listStandardToolPacks,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 16 | <code>    searchStandardToolPacks,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 17 | <code>    collectStandardToolPackContracts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 18 | <code>    collectStandardToolPackAuthProfiles,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 19 | <code>    publicReadonlyOpenApiOperationsFromStandardPacks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 20 | <code>} = require('./ailis-standard-tool-packs.cjs');</code> | 导入依赖 `./ailis-standard-tool-packs.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>const OFFICIAL_MCP_REGISTRY_URL = 'https://registry.modelcontextprotocol.io/v0/servers';</code> | 声明局部标识符 `OFFICIAL_MCP_REGISTRY_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 23 | <code>const LEARNING_SCHEMA_VERSION = 1;</code> | 声明局部标识符 `LEARNING_SCHEMA_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 24 | <code>const EXTERNAL_EXPOSURE_VERSION = 1;</code> | 声明局部标识符 `EXTERNAL_EXPOSURE_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 25 | <code>const EXTERNAL_AUTH_PROFILE_VERSION = 1;</code> | 声明局部标识符 `EXTERNAL_AUTH_PROFILE_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 26 | <code>const SAFE_HTTP_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);</code> | 声明局部标识符 `SAFE_HTTP_METHODS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 27 | <code>const DEFAULT_COMPOSIO_API_BASE_URL = 'https://backend.composio.dev/api/v3';</code> | 声明局部标识符 `DEFAULT_COMPOSIO_API_BASE_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 28 | <code>const LOCAL_ADAPTER_OUTPUT_LIMIT = 10 * 1024 * 1024;</code> | 声明局部标识符 `LOCAL_ADAPTER_OUTPUT_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 29 | <code>const LOCAL_DOCUMENT_ADAPTERS = Object.freeze({</code> | 声明局部标识符 `LOCAL_DOCUMENT_ADAPTERS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 30 | <code>    docling_convert_document: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 31 | <code>        id: 'local_docling_converter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 32 | <code>        type: 'local_document_converter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 33 | <code>        runtime: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 34 | <code>        packageName: 'docling',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 35 | <code>        importName: 'docling',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 36 | <code>        commandEnvVar: 'AILIS_PYTHON',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 37 | <code>        outputFormat: 'markdown'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 38 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>    markitdown_convert_document: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 40 | <code>        id: 'local_markitdown_converter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 41 | <code>        type: 'local_document_converter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 42 | <code>        runtime: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 43 | <code>        packageName: 'markitdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 44 | <code>        importName: 'markitdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 45 | <code>        commandEnvVar: 'AILIS_PYTHON',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 46 | <code>        outputFormat: 'markdown'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 47 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>    python_document_extract: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 49 | <code>        id: 'local_python_document_extractor',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 50 | <code>        type: 'local_document_converter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 51 | <code>        runtime: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 52 | <code>        packageName: 'python-docx,pypdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 53 | <code>        importNames: Object.freeze(['docx', 'pypdf']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 54 | <code>        commandEnvVar: 'AILIS_PYTHON',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 55 | <code>        outputFormat: 'markdown'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 56 | <code>    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>const CORE_TOOL_BUNDLES = Object.freeze([</code> | 声明局部标识符 `CORE_TOOL_BUNDLES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 60 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 61 | <code>        id: 'core:file_system',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 62 | <code>        label: '文件系统',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 63 | <code>        category: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 64 | <code>        description: 'Read, write, search, hash, copy, move, delete, and verify local files through the computer/file tools.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 65 | <code>        toolIds: Object.freeze(['computer', 'file_manager', 'read', 'write', 'apply_patch']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 66 | <code>        skillIds: Object.freeze(['file_manager']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 67 | <code>        keywords: Object.freeze(['file', 'folder', 'directory', 'read', 'write', 'search', 'copy', 'move', 'delete', '文件', '目录', '读取', '整理']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 68 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 69 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 70 | <code>                Object.freeze({ id: 'computer_list_workspace', tool: 'computer', action: 'list', mutates: false }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 71 | <code>                Object.freeze({ id: 'file_manager_plan', tool: 'file_manager', action: 'plan', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 72 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 76 | <code>        id: 'core:command_line',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 77 | <code>        label: '命令行与 PTY',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 78 | <code>        category: 'command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 79 | <code>        description: 'Run shell commands, long-running sessions, PTY interaction, stdin writes, process reads, and permission-gated execution.',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 80 | <code>        toolIds: Object.freeze(['computer', 'exec', 'request_permissions']),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 81 | <code>        skillIds: Object.freeze(['computer']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 82 | <code>        keywords: Object.freeze(['shell', 'terminal', 'cmd', 'powershell', 'bash', 'pty', 'stdin', 'command', '命令行', '终端', '执行']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 83 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 84 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 85 | <code>                Object.freeze({ id: 'exec_echo', tool: 'computer', action: 'exec_command', mutates: false }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 86 | <code>                Object.freeze({ id: 'session_roundtrip', tool: 'computer', action: 'session_start/process_read/process_write', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 87 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 91 | <code>        id: 'core:browser',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 92 | <code>        label: '浏览器与网页',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 93 | <code>        category: 'browser',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 94 | <code>        description: 'Use browser-facing MCP/direct tools for web search, fetch, page inspection, screenshots, and web task evidence.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 95 | <code>        toolIds: Object.freeze(['tool_search', 'mcp_bridge', 'vision.capture_context']),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 96 | <code>        skillIds: Object.freeze(['mcp_bridge']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 97 | <code>        keywords: Object.freeze(['browser', 'web', 'search', 'fetch', 'html', 'page', 'screenshot', '网页', '浏览器', '搜索', '抓取']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 98 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 99 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 100 | <code>                Object.freeze({ id: 'tool_search_web', tool: 'tool_search', action: 'search', mutates: false }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 101 | <code>                Object.freeze({ id: 'mcp_web_specs', tool: 'mcp_bridge', action: 'search_tools', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 102 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 106 | <code>        id: 'core:git',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 107 | <code>        label: 'Git 与代码版本',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 108 | <code>        category: 'git',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 109 | <code>        description: 'Inspect status/diff, commit, create PR plans, and verify repository changes through the code/computer tools.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 110 | <code>        toolIds: Object.freeze(['code', 'computer', 'apply_patch']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 111 | <code>        skillIds: Object.freeze(['code']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 112 | <code>        keywords: Object.freeze(['git', 'diff', 'commit', 'branch', 'pr', 'ci', 'repository', '仓库', '提交', '分支']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 113 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 114 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 115 | <code>                Object.freeze({ id: 'git_status', tool: 'code', action: 'git_status', mutates: false }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 116 | <code>                Object.freeze({ id: 'git_diff', tool: 'code', action: 'git_diff', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 117 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 121 | <code>        id: 'core:python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 122 | <code>        label: 'Python 执行',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 123 | <code>        category: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 124 | <code>        description: 'Run Python scripts for data processing, validation, document parsing, tests, and one-off automation.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 125 | <code>        toolIds: Object.freeze(['computer', 'code']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 126 | <code>        skillIds: Object.freeze(['code']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 127 | <code>        keywords: Object.freeze(['python', 'script', 'notebook', 'data', 'pandas', 'numpy', '脚本', '数据处理']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 128 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 129 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 130 | <code>                Object.freeze({ id: 'python_version', tool: 'computer', action: 'exec_command', mutates: false }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 131 | <code>                Object.freeze({ id: 'code_test', tool: 'code', action: 'test', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 132 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 136 | <code>        id: 'core:document_parse',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 137 | <code>        label: '文档解析',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 138 | <code>        category: 'document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 139 | <code>        description: 'Parse, verify, and summarize PDF, Markdown, JSON, CSV, spreadsheet, and common document artifacts.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 140 | <code>        toolIds: Object.freeze(['artifact_verifier', 'computer', 'mcp_bridge']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 141 | <code>        skillIds: Object.freeze(['mcp_bridge']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 142 | <code>        keywords: Object.freeze(['pdf', 'docx', 'xlsx', 'csv', 'markdown', 'document', 'parse', 'extract', '文档', '表格', '解析']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 143 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 144 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 145 | <code>                Object.freeze({ id: 'artifact_verifier_schema', tool: 'artifact_verifier', action: 'schema', mutates: false }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 146 | <code>                Object.freeze({ id: 'document_mcp_search', tool: 'tool_search', action: 'search', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 147 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 151 | <code>        id: 'core:media',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 152 | <code>        label: '音视频与多媒体',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 153 | <code>        category: 'media',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 154 | <code>        description: 'Handle audio/video/image metadata, transcription/OCR-adjacent workflows, downloads, and conversion through Python or MCP tools.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 155 | <code>        toolIds: Object.freeze(['computer', 'mcp_bridge', 'tool_search']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 156 | <code>        skillIds: Object.freeze(['mcp_bridge']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 157 | <code>        keywords: Object.freeze(['audio', 'video', 'image', 'ffmpeg', 'transcribe', 'media', '音频', '视频', '图片', '转写']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 158 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 159 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 160 | <code>                Object.freeze({ id: 'media_tool_search', tool: 'tool_search', action: 'search', mutates: false }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 161 | <code>                Object.freeze({ id: 'python_media_probe', tool: 'computer', action: 'exec_command', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 162 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 166 | <code>        id: 'core:ocr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 167 | <code>        label: 'OCR 与视觉读屏',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 168 | <code>        category: 'ocr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 169 | <code>        description: 'Read visible UI/screenshots and route OCR-heavy tasks to vision or installable document/image MCP tools.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 170 | <code>        toolIds: Object.freeze(['vision.capture_context', 'tool_search', 'mcp_bridge']),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 171 | <code>        skillIds: Object.freeze(['vision']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 172 | <code>        keywords: Object.freeze(['ocr', 'vision', 'screenshot', 'screen', 'image text', '识别', '截图', '屏幕', '文字识别']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 173 | <code>        smokeProfile: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 174 | <code>            checks: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 175 | <code>                Object.freeze({ id: 'vision_capture_contract', tool: 'vision.capture_context', action: 'capture_context', mutates: false }),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 176 | <code>                Object.freeze({ id: 'ocr_mcp_search', tool: 'tool_search', action: 'search', mutates: false })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 177 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>const BUILTIN_PUBLIC_OPENAPI_OPERATIONS = Object.freeze([</code> | 声明局部标识符 `BUILTIN_PUBLIC_OPENAPI_OPERATIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 183 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 184 | <code>        operationId: 'clinicalTrialsSearchStudies',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 185 | <code>        method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 186 | <code>        path: '/api/v2/studies?format=json&amp;pageSize=10&amp;fields=NCTId,BriefTitle,OfficialTitle,OverallStatus,EnrollmentCount,EnrollmentType,StartDate,PrimaryCompletionDate,CompletionDate,StudyFirstPostDate,LastUpdateSubmitDate,LastUpdatePostDate&amp;query.term={query}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 187 | <code>        baseUrl: 'https://clinicaltrials.gov',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 188 | <code>        sourceName: 'clinicaltrials',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 189 | <code>        summary: 'Search ClinicalTrials.gov by condition, intervention, title, sponsor, or other study terms and return compact structured study fields.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 190 | <code>        parameters: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 191 | <code>            Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 192 | <code>                name: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 193 | <code>                in: 'path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 194 | <code>                required: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 195 | <code>                schema: Object.freeze({ type: 'string' }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 196 | <code>                description: 'Clinical study search terms, for example H. pylori acne vulgaris.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 197 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>        whenToUse: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 200 | <code>            'Use when a ClinicalTrials.gov or NIH study question is known by topic or dates but the NCT id is not known.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 201 | <code>            'Use before broad web search when the requested answer is a structured study field such as enrollment, status, phase, or dates.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 202 | <code>        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        whenNotToUse: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 204 | <code>            'Do not use for general medical advice or studies outside ClinicalTrials.gov.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 205 | <code>        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>        preconditions: Object.freeze(['Provide concise terms that identify the study; an NCT id is not required.']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 207 | <code>        examples: Object.freeze([Object.freeze({ query: 'H. pylori acne vulgaris' })]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 208 | <code>        badExamples: Object.freeze([Object.freeze({ query: 'medicine' })]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 209 | <code>        alternatives: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 210 | <code>            'After identifying an NCT id, use external__clinicaltrials__get_study for the complete current record.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 211 | <code>        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>        errors: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 213 | <code>            not_found: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 214 | <code>                recoverable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 215 | <code>                nextActions: Object.freeze(['Retry with the condition, intervention, sponsor, or a shorter exact title phrase.'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 216 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>        permissions: Object.freeze(['clinicaltrials.read'])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 219 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 221 | <code>        operationId: 'clinicalTrialsGetStudy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 222 | <code>        method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 223 | <code>        path: '/api/v2/studies/{nctId}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 224 | <code>        baseUrl: 'https://clinicaltrials.gov',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 225 | <code>        sourceName: 'clinicaltrials',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 226 | <code>        summary: 'Get a ClinicalTrials.gov study record by NCT id, including actual enrollment count and structured study fields.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 227 | <code>        parameters: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 228 | <code>            Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 229 | <code>                name: 'nctId',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 230 | <code>                in: 'path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 231 | <code>                required: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 232 | <code>                schema: Object.freeze({ type: 'string' }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 233 | <code>                description: 'ClinicalTrials.gov NCT identifier, for example NCT03411733.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 234 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>        whenToUse: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 237 | <code>            'Use for structured ClinicalTrials.gov study records, actual enrollment count, phase, status, dates, and NCT-specific fields.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 238 | <code>        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>        whenNotToUse: Object.freeze([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 240 | <code>            'Do not use for broad medical web search or non-ClinicalTrials.gov pages.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 241 | <code>        ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>        preconditions: Object.freeze(['The NCT id is known or can be found from prior evidence.']),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 243 | <code>        examples: Object.freeze([Object.freeze({ nctId: 'NCT03411733' })]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 244 | <code>        badExamples: Object.freeze([Object.freeze({ query: 'H pylori acne' })]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 245 | <code>        alternatives: Object.freeze(['Use web_search/web_fetch only to discover the NCT id, then use this structured API.']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 246 | <code>        errors: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 247 | <code>            not_found: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 248 | <code>                recoverable: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 249 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>        permissions: Object.freeze(['clinicaltrials.read'])</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 252 | <code>    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 256 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 257 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 258 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 260 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 261 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>function normalizeArray(value) {</code> | 定义函数 `normalizeArray`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 264 | <code>    if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 265 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    return Array.isArray(value) ? value : [value];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 268 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>function isPlainObject(value) {</code> | 定义函数 `isPlainObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 271 | <code>    return Boolean(value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 272 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 275 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 276 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 277 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 278 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>function safeSegment(value, fallback = 'item') {</code> | 定义函数 `safeSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 283 | <code>    return normalizeString(value, fallback)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 284 | <code>        .replace(/[^a-zA-Z0-9._-]+/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 285 | <code>        .replace(/^-+&#124;-+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 286 | <code>        .slice(0, 90) &#124;&#124; fallback;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 287 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>function safeToolSegment(value, fallback = 'item') {</code> | 定义函数 `safeToolSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 290 | <code>    return normalizeString(value, fallback)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 291 | <code>        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 292 | <code>        .toLowerCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 293 | <code>        .replace(/[^a-z0-9]+/g, '_')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 294 | <code>        .replace(/^_+&#124;_+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 295 | <code>        .slice(0, 80) &#124;&#124; fallback;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 296 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>function splitToolSegment(value = '') {</code> | 定义函数 `splitToolSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 299 | <code>    return safeToolSegment(value, '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 300 | <code>        .split('_')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 301 | <code>        .map((part) =&gt; part.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 302 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 303 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>function stripProviderPrefix(toolSegment = '', providerSegment = '') {</code> | 定义函数 `stripProviderPrefix`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 306 | <code>    const tool = safeToolSegment(toolSegment, 'tool');</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 307 | <code>    const provider = safeToolSegment(providerSegment, 'external');</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 308 | <code>    const providerCompact = provider.replace(/_/g, '');</code> | 声明局部标识符 `providerCompact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 309 | <code>    const parts = splitToolSegment(tool);</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 310 | <code>    let compactPrefix = '';</code> | 声明局部标识符 `compactPrefix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 311 | <code>    for (let index = 0; index &lt; parts.length - 1; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 312 | <code>        compactPrefix += parts[index];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 313 | <code>        if (compactPrefix === providerCompact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 314 | <code>            return parts.slice(index + 1).join('_') &#124;&#124; tool;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 315 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>    return tool.startsWith(`${provider}_`) ? tool.slice(provider.length + 1) &#124;&#124; tool : tool;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 318 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>function inferHostProvider(value = '') {</code> | 定义函数 `inferHostProvider`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 321 | <code>    const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 322 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 323 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 326 | <code>        const url = new URL(text.includes('://') ? text : `https://${text}`);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 327 | <code>        const host = url.hostname.replace(/^www\./i, '');</code> | 声明局部标识符 `host`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 328 | <code>        const first = host.split('.').find(Boolean);</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 329 | <code>        return safeToolSegment(first, '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 330 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 331 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 332 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>function inferExternalProviderSegment(exposure = {}) {</code> | 定义函数 `inferExternalProviderSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 336 | <code>    const source = exposure.source &#124;&#124; {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 337 | <code>    const explicit = normalizeString(source.provider &#124;&#124; source.service &#124;&#124; source.name &#124;&#124; exposure.provider);</code> | 声明局部标识符 `explicit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 338 | <code>    if (explicit &amp;&amp; !['external', 'generic_tool', 'openapi_operation', 'composio_tool'].includes(explicit)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 339 | <code>        return safeToolSegment(explicit, 'external');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 340 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>    return inferHostProvider(source.baseUrl &#124;&#124; source.url &#124;&#124; source.sourceUrl) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 342 | <code>        safeToolSegment(explicit &#124;&#124; source.type &#124;&#124; 'external', 'external');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 343 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>function inferExternalToolSegment(exposure = {}, providerSegment = '') {</code> | 定义函数 `inferExternalToolSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 346 | <code>    const raw = normalizeString(</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 347 | <code>        exposure.virtualName &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 348 | <code>            exposure.toolId &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 349 | <code>            exposure.contract?.id &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 350 | <code>            exposure.contract?.name &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 351 | <code>            exposure.modelFacing?.name &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 352 | <code>            exposure.name &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 353 | <code>            exposure.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 354 | <code>        'tool'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 355 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>    return stripProviderPrefix(safeToolSegment(raw, 'tool'), providerSegment);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 357 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>function createExternalVirtualToolId(exposure = {}) {</code> | 定义函数 `createExternalVirtualToolId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 360 | <code>    const provider = inferExternalProviderSegment(exposure);</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 361 | <code>    const tool = inferExternalToolSegment(exposure, provider);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 362 | <code>    return `external__${provider}__${tool}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 363 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>function isExternalVirtualToolId(value = '') {</code> | 定义函数 `isExternalVirtualToolId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 366 | <code>    return /^external__[a-z0-9_]+__[a-z0-9_]+$/.test(normalizeString(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 367 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>function sampleArgsFromSchema(schema = {}) {</code> | 定义函数 `sampleArgsFromSchema`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 370 | <code>    const properties = schema?.properties &amp;&amp; typeof schema.properties === 'object' ? schema.properties : {};</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 371 | <code>    const required = Array.isArray(schema?.required) ? schema.required : Object.keys(properties).slice(0, 4);</code> | 声明局部标识符 `required`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 372 | <code>    const sample = {};</code> | 声明局部标识符 `sample`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 373 | <code>    for (const name of required.slice(0, 8)) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 374 | <code>        if (!name &#124;&#124; typeof name !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 375 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 376 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>        const prop = properties[name] &#124;&#124; {};</code> | 声明局部标识符 `prop`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 378 | <code>        if (prop.default !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 379 | <code>            sample[name] = prop.default;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 380 | <code>        } else if (Array.isArray(prop.examples) &amp;&amp; prop.examples.length) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 381 | <code>            sample[name] = prop.examples[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 382 | <code>        } else if (Array.isArray(prop.enum) &amp;&amp; prop.enum.length) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 383 | <code>            sample[name] = prop.enum[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 384 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 385 | <code>            sample[name] = `&lt;${name}&gt;`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 386 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>    return sample;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 389 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>async function readJsonFile(filePath, fallback) {</code> | 定义函数 `readJsonFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 392 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 393 | <code>        const raw = await fsp.readFile(filePath, 'utf8');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 394 | <code>        return JSON.parse(raw &#124;&#124; '{}');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 395 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 396 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 397 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 400 | <code>async function writeJsonFileAtomic(filePath, value) {</code> | 定义函数 `writeJsonFileAtomic`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 401 | <code>    await fsp.mkdir(path.dirname(filePath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 402 | <code>    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;</code> | 声明局部标识符 `tmpPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 403 | <code>    await fsp.writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 404 | <code>    await fsp.rename(tmpPath, filePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 405 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 407 | <code>function tokenize(text = '') {</code> | 定义函数 `tokenize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 408 | <code>    return String(text &#124;&#124; '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 409 | <code>        .toLowerCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 410 | <code>        .replace(/[^\p{L}\p{N}_@./:-]+/gu, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 411 | <code>        .split(/\s+/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 412 | <code>        .map((term) =&gt; term.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 413 | <code>        .filter((term) =&gt; term.length &gt;= 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 414 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>function stableTaskSignature(text = '') {</code> | 定义函数 `stableTaskSignature`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 417 | <code>    const terms = [...new Set(tokenize(text))].sort().slice(0, 24);</code> | 声明局部标识符 `terms`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 418 | <code>    if (!terms.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 419 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 420 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>    return createHash('sha256').update(terms.join(' ')).digest('hex').slice(0, 16);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 422 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>function scoreText(query = '', text = '') {</code> | 定义函数 `scoreText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 425 | <code>    const terms = tokenize(query);</code> | 声明局部标识符 `terms`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 426 | <code>    if (!terms.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 427 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 428 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>    const haystack = String(text &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 430 | <code>    return terms.reduce((score, term) =&gt; score + (haystack.includes(term) ? 1 : 0), 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 431 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>function redactHeaders(headers = {}) {</code> | 定义函数 `redactHeaders`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 434 | <code>    const redacted = {};</code> | 声明局部标识符 `redacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 435 | <code>    for (const [key, value] of Object.entries(headers &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 436 | <code>        if (/authorization&#124;token&#124;api[_-]?key&#124;secret&#124;cookie/i.test(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 437 | <code>            redacted[key] = '__REDACTED__';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 438 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 439 | <code>            redacted[key] = String(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 440 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 441 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>    return redacted;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 443 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>function extractResponseHeaders(headers) {</code> | 定义函数 `extractResponseHeaders`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 446 | <code>    const wanted = new Set([</code> | 声明局部标识符 `wanted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 447 | <code>        'retry-after',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 448 | <code>        'x-ratelimit-limit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 449 | <code>        'x-ratelimit-remaining',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 450 | <code>        'x-ratelimit-reset',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 451 | <code>        'x-rate-limit-limit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 452 | <code>        'x-rate-limit-remaining',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 453 | <code>        'x-rate-limit-reset'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 454 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>    const result = {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 456 | <code>    if (!headers?.forEach) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 457 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 458 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>    headers.forEach((value, key) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 460 | <code>        const lower = String(key).toLowerCase();</code> | 声明局部标识符 `lower`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 461 | <code>        if (wanted.has(lower)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 462 | <code>            result[lower] = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 463 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 466 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 468 | <code>function classifyHttpFailure(status, exposure = {}, responseHeaders = {}) {</code> | 定义函数 `classifyHttpFailure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 469 | <code>    const provider = normalizeString(exposure.source?.name &#124;&#124; exposure.provider &#124;&#124; exposure.source?.provider &#124;&#124; exposure.toolId &#124;&#124; 'external_api');</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 470 | <code>    if (status === 429) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 471 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 472 | <code>            reason: 'rate_limited',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 473 | <code>            message: `${provider} returned HTTP 429 rate limit. Do not retry in a tight loop.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 474 | <code>            retryAfter: responseHeaders['retry-after'] &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 475 | <code>            nextActions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 476 | <code>                'Switch to an alternate structured source if one is available.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 477 | <code>                'Use an authenticated API profile when the provider supports one.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 478 | <code>                'Retry only after the provider rate-limit window resets.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 479 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 482 | <code>    if (status === 403) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 483 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 484 | <code>            reason: 'forbidden_or_blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 485 | <code>            message: `${provider} returned HTTP 403 forbidden. This is usually access policy, bot protection, missing auth, or a blocked endpoint, not a query wording problem.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 486 | <code>            nextActions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 487 | <code>                'Switch to an official API or mirrored structured source.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 488 | <code>                'Use an authenticated profile when the task requires this provider.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 489 | <code>                'Do not keep rewriting the same web request against the blocked endpoint.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 490 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 492 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>    if (status === 401) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 494 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 495 | <code>            reason: 'authentication_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 496 | <code>            message: `${provider} returned HTTP 401 authentication required.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 497 | <code>            nextActions: ['Configure the required auth profile, then rerun smoke before exposing as callable.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 498 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 500 | <code>    if (status &gt;= 500) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 501 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 502 | <code>            reason: 'provider_unavailable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 503 | <code>            message: `${provider} returned HTTP ${status}. Treat this as provider/server instability.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 504 | <code>            nextActions: ['Retry once with backoff, then switch source if the task can be solved another way.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 505 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>    if (status &gt;= 400) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 508 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 509 | <code>            reason: 'http_client_error',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 510 | <code>            message: `${provider} returned HTTP ${status}. Check required parameters and endpoint access policy before retrying.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 511 | <code>            nextActions: ['Inspect the response body for parameter errors.', 'Avoid repeated equivalent retries.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 512 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 513 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 515 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>function inferLocalDocumentAdapter(raw = {}, requestedAdapter = {}) {</code> | 定义函数 `inferLocalDocumentAdapter`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 518 | <code>    const requestedType = normalizeString(requestedAdapter.type &#124;&#124; requestedAdapter.id);</code> | 声明局部标识符 `requestedType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 519 | <code>    if (requestedType === 'local_document_converter' &#124;&#124; /^local_(docling&#124;markitdown)_converter$/.test(requestedType)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 520 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 521 | <code>            ...requestedAdapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 522 | <code>            id: normalizeString(requestedAdapter.id, requestedType),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 523 | <code>            type: 'local_document_converter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 524 | <code>            runtime: normalizeString(requestedAdapter.runtime, 'python'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 525 | <code>            packageName: normalizeString(requestedAdapter.packageName &#124;&#124; requestedAdapter.package &#124;&#124; requestedAdapter.dependency),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 526 | <code>            importName: normalizeString(requestedAdapter.importName &#124;&#124; requestedAdapter.import &#124;&#124; requestedAdapter.packageName &#124;&#124; requestedAdapter.package),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 527 | <code>            importNames: normalizeArray(requestedAdapter.importNames &#124;&#124; requestedAdapter.requiredImports &#124;&#124; requestedAdapter.imports).map(String).filter(Boolean),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 528 | <code>            commandEnvVar: normalizeString(requestedAdapter.commandEnvVar &#124;&#124; requestedAdapter.pythonEnvVar, 'AILIS_PYTHON')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 529 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>    const key = normalizeString(raw.toolId &#124;&#124; raw.id &#124;&#124; raw.name &#124;&#124; raw.operationId).toLowerCase();</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 532 | <code>    const adapter = LOCAL_DOCUMENT_ADAPTERS[key];</code> | 声明局部标识符 `adapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 533 | <code>    return adapter ? cloneJson(adapter) : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 534 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>function localAdapterCommand(adapter = {}) {</code> | 定义函数 `localAdapterCommand`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 537 | <code>    const envVar = normalizeString(adapter.commandEnvVar, 'AILIS_PYTHON');</code> | 声明局部标识符 `envVar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 538 | <code>    return normalizeString(envVar &amp;&amp; process.env[envVar], normalizeString(adapter.command, 'python'));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 539 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 541 | <code>function runProcessCapture(command, args = [], { timeoutMs = 30000, cwd = '', env = {}, maxOutputBytes = LOCAL_ADAPTER_OUTPUT_LIMIT } = {}) {</code> | 定义函数 `runProcessCapture`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 542 | <code>    return new Promise((resolve) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 543 | <code>        const child = spawn(command, args, {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 544 | <code>            cwd: cwd &#124;&#124; undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 545 | <code>            env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 546 | <code>                ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 547 | <code>                ...env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 548 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>            windowsHide: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 550 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>        let stdout = '';</code> | 声明局部标识符 `stdout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 552 | <code>        let stderr = '';</code> | 声明局部标识符 `stderr`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 553 | <code>        let killedForOutput = false;</code> | 声明局部标识符 `killedForOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 554 | <code>        const timer = setTimeout(() =&gt; {</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 555 | <code>            child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 556 | <code>        }, Math.max(1000, Number(timeoutMs) &#124;&#124; 30000));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 557 | <code>        child.stdout.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 558 | <code>            stdout += chunk.toString('utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 559 | <code>            if (Buffer.byteLength(stdout, 'utf8') &gt; maxOutputBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 560 | <code>                killedForOutput = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 561 | <code>                child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 562 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 563 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 564 | <code>        child.stderr.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 565 | <code>            stderr += chunk.toString('utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 566 | <code>            if (Buffer.byteLength(stderr, 'utf8') &gt; maxOutputBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 567 | <code>                killedForOutput = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 568 | <code>                child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 569 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 571 | <code>        child.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 572 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 573 | <code>            resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 574 | <code>                status: 'spawn_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 575 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 576 | <code>                exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 577 | <code>                stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 578 | <code>                stderr,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 579 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 580 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 581 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>        child.on('close', (code, signal) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 583 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 584 | <code>            resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 585 | <code>                status: killedForOutput ? 'output_limit_exceeded' : code === 0 ? 'completed' : 'process_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 586 | <code>                ok: code === 0 &amp;&amp; !killedForOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 587 | <code>                exitCode: code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 588 | <code>                signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 589 | <code>                stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 590 | <code>                stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 591 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>function pythonImportProbeSource() {</code> | 定义函数 `pythonImportProbeSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 597 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 598 | <code>        'import importlib.util, sys',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 599 | <code>        'name = sys.argv[1]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 600 | <code>        'sys.exit(0 if importlib.util.find_spec(name) else 2)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 601 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 602 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 604 | <code>function markitdownConvertSource() {</code> | 定义函数 `markitdownConvertSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 605 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 606 | <code>        'import json, os, sys, traceback',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 607 | <code>        'path = sys.argv[1]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 608 | <code>        'try:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 609 | <code>        '    from markitdown import MarkItDown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 610 | <code>        '    converter = MarkItDown()',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 611 | <code>        '    result = converter.convert(path)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 612 | <code>        '    text = getattr(result, "text_content", "") or str(result)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 613 | <code>        '    payload = {"ok": True, "format": "markdown", "text": text, "tables": [], "metadata": {"converter": "markitdown", "source_path": os.path.abspath(path)}}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 614 | <code>        '    print(json.dumps(payload, ensure_ascii=False))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 615 | <code>        'except Exception as exc:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 616 | <code>        '    print(json.dumps({"ok": False, "error": str(exc), "traceback": traceback.format_exc()}, ensure_ascii=False))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 617 | <code>        '    sys.exit(1)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 618 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 619 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 621 | <code>function doclingConvertSource() {</code> | 定义函数 `doclingConvertSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 622 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 623 | <code>        'import json, os, sys, traceback',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 624 | <code>        'path = sys.argv[1]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 625 | <code>        'output_format = sys.argv[2] if len(sys.argv) &gt; 2 else "markdown"',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 626 | <code>        'try:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 627 | <code>        '    from docling.document_converter import DocumentConverter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 628 | <code>        '    result = DocumentConverter().convert(path)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 629 | <code>        '    doc = result.document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 630 | <code>        '    text = ""',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 631 | <code>        '    data = None',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 632 | <code>        '    tables = []',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 633 | <code>        '    if output_format == "json":',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 634 | <code>        '        if hasattr(doc, "export_to_dict"):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 635 | <code>        '            data = doc.export_to_dict()',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 636 | <code>        '        text = json.dumps(data if data is not None else {}, ensure_ascii=False)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 637 | <code>        '    elif hasattr(doc, "export_to_markdown"):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 638 | <code>        '        text = doc.export_to_markdown()',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 639 | <code>        '    elif hasattr(doc, "export_to_text"):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 640 | <code>        '        text = doc.export_to_text()',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 641 | <code>        '    else:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 642 | <code>        '        text = str(doc)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 643 | <code>        '    if hasattr(doc, "tables"):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 644 | <code>        '        tables = [str(table) for table in list(getattr(doc, "tables") or [])[:50]]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 645 | <code>        '    payload = {"ok": True, "format": output_format, "text": text, "tables": tables, "metadata": {"converter": "docling", "source_path": os.path.abspath(path)}}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 646 | <code>        '    if data is not None:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 647 | <code>        '        payload["document"] = data',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 648 | <code>        '    print(json.dumps(payload, ensure_ascii=False))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 649 | <code>        'except Exception as exc:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 650 | <code>        '    print(json.dumps({"ok": False, "error": str(exc), "traceback": traceback.format_exc()}, ensure_ascii=False))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 651 | <code>        '    sys.exit(1)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 652 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 653 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 655 | <code>function pythonDocumentExtractSource() {</code> | 定义函数 `pythonDocumentExtractSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 656 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 657 | <code>        'import csv, json, os, sys, traceback',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 658 | <code>        'path = sys.argv[1]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 659 | <code>        'ext = os.path.splitext(path)[1].lower()',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 660 | <code>        'try:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 661 | <code>        '    text_parts = []',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 662 | <code>        '    tables = []',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 663 | <code>        '    if ext == ".docx":',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 664 | <code>        '        import docx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 665 | <code>        '        document = docx.Document(path)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 666 | <code>        '        for paragraph in document.paragraphs:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 667 | <code>        '            value = paragraph.text.strip()',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 668 | <code>        '            if value:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 669 | <code>        '                text_parts.append(value)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 670 | <code>        '        for table_index, table in enumerate(document.tables):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 671 | <code>        '            rows = []',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 672 | <code>        '            text_parts.append("")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 673 | <code>        '            text_parts.append(f"Table {table_index + 1}")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 674 | <code>        '            for row in table.rows:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 675 | <code>        '                values = [cell.text.strip().replace("\\n", " ") for cell in row.cells]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 676 | <code>        '                rows.append(values)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 677 | <code>        '                text_parts.append(" &#124; ".join(values))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 678 | <code>        '            tables.append({"index": table_index, "rows": rows})',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 679 | <code>        '    elif ext == ".pdf":',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 680 | <code>        '        from pypdf import PdfReader',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 681 | <code>        '        reader = PdfReader(path)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 682 | <code>        '        for index, page in enumerate(reader.pages):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 683 | <code>        '            text_parts.append(f"Page {index + 1}")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 684 | <code>        '            text_parts.append(page.extract_text() or "")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 685 | <code>        '    elif ext in [".txt", ".md", ".csv", ".tsv", ".html", ".htm", ".json"]:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 686 | <code>        '        with open(path, "r", encoding="utf-8", errors="replace") as handle:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 687 | <code>        '            text_parts.append(handle.read())',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 688 | <code>        '        if ext in [".csv", ".tsv"]:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 689 | <code>        '            delimiter = "\\t" if ext == ".tsv" else ","',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 690 | <code>        '            with open(path, "r", encoding="utf-8", errors="replace", newline="") as handle:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 691 | <code>        '                tables.append({"index": 0, "rows": list(csv.reader(handle, delimiter=delimiter))})',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 692 | <code>        '    else:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 693 | <code>        '        raise RuntimeError(f"unsupported format for python_document_extract: {ext}")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 694 | <code>        '    payload = {"ok": True, "format": "markdown", "text": "\\n".join(text_parts), "tables": tables, "metadata": {"converter": "python_document_extract", "source_path": os.path.abspath(path), "extension": ext}}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 695 | <code>        '    print(json.dumps(payload, ensure_ascii=False))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 696 | <code>        'except Exception as exc:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 697 | <code>        '    print(json.dumps({"ok": False, "error": str(exc), "traceback": traceback.format_exc()}, ensure_ascii=False))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 698 | <code>        '    sys.exit(1)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 699 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 700 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 702 | <code>function pickServerUrl(raw = {}, args = {}) {</code> | 定义函数 `pickServerUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 703 | <code>    const servers = normalizeArray(raw.servers &#124;&#124; raw.server);</code> | 声明局部标识符 `servers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 704 | <code>    const serverUrl = servers</code> | 声明局部标识符 `serverUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 705 | <code>        .map((entry) =&gt; typeof entry === 'string' ? entry : entry?.url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 706 | <code>        .map((entry) =&gt; normalizeString(entry))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 707 | <code>        .find(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 708 | <code>    return normalizeString(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 709 | <code>        args.baseUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 710 | <code>            args.baseURL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 711 | <code>            raw.baseUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 712 | <code>            raw.baseURL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 713 | <code>            raw.serverUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 714 | <code>            raw.serverURL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 715 | <code>            raw.server_url &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 716 | <code>            serverUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 717 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 718 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 720 | <code>function normalizeOpenApiParameterLocations(parameters = []) {</code> | 定义函数 `normalizeOpenApiParameterLocations`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 721 | <code>    const locations = {};</code> | 声明局部标识符 `locations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 722 | <code>    for (const parameter of normalizeArray(parameters)) {</code> | 声明局部标识符 `parameter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 723 | <code>        const name = normalizeString(parameter?.name);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 724 | <code>        if (!name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 725 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 726 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 727 | <code>        locations[name] = normalizeString(parameter.in, 'query').toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 728 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 729 | <code>    return locations;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 730 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 732 | <code>function firstString(...values) {</code> | 定义函数 `firstString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 733 | <code>    for (const value of values) {</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 734 | <code>        const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 735 | <code>        if (text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 736 | <code>            return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 737 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 740 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 741 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 742 | <code>function inferComposioToolSlug(raw = {}) {</code> | 定义函数 `inferComposioToolSlug`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 743 | <code>    return firstString(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 744 | <code>        raw.toolSlug,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 745 | <code>        raw.tool_slug,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 746 | <code>        raw.slug,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 747 | <code>        raw.actionSlug,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 748 | <code>        raw.action_slug,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 749 | <code>        raw.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 750 | <code>        raw.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 751 | <code>        raw.operationId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 752 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 753 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 755 | <code>function normalizeAuthType(value = '', provider = '') {</code> | 定义函数 `normalizeAuthType`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 756 | <code>    const explicit = normalizeString(value).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `explicit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 757 | <code>    if (explicit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 758 | <code>        return explicit;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 759 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 760 | <code>    const source = normalizeString(provider).toLowerCase();</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 761 | <code>    if (source.includes('composio')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 762 | <code>        return 'composio_api_key_env';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 763 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>    return 'none';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 765 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 767 | <code>function redactUrlSecret(urlText = '') {</code> | 定义函数 `redactUrlSecret`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 768 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 769 | <code>        const url = new URL(urlText);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 770 | <code>        for (const key of [...url.searchParams.keys()]) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 771 | <code>            if (/token&#124;api[_-]?key&#124;secret&#124;authorization&#124;password/i.test(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 772 | <code>                url.searchParams.set(key, '__REDACTED__');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 773 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 774 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 775 | <code>        return url.toString();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 776 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 777 | <code>        return urlText;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 778 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 779 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>function secretEnvNameForServer(serverName = '') {</code> | 定义函数 `secretEnvNameForServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 782 | <code>    return `AILIS_MCP_${safeSegment(serverName, 'SERVER').replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()}_TOKEN`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 783 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 785 | <code>function registryMeta(entry = {}) {</code> | 定义函数 `registryMeta`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 786 | <code>    return entry?._meta?.['io.modelcontextprotocol.registry/official'] &#124;&#124; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 787 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 788 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 789 | <code>function normalizeRemote(remote = {}) {</code> | 定义函数 `normalizeRemote`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 790 | <code>    if (!isPlainObject(remote)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 791 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 792 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 793 | <code>    const url = normalizeString(remote.url);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 794 | <code>    if (!url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 795 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 796 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 797 | <code>    const type = normalizeString(remote.type &#124;&#124; remote.transport, 'streamable-http').toLowerCase();</code> | 声明局部标识符 `type`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 798 | <code>    const requiredHeaders = normalizeArray(remote.headers)</code> | 声明局部标识符 `requiredHeaders`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 799 | <code>        .filter((header) =&gt; header?.isRequired &#124;&#124; header?.required)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 800 | <code>        .map((header) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 801 | <code>            name: normalizeString(header.name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 802 | <code>            description: normalizeString(header.description),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 803 | <code>            isSecret: header.isSecret !== false</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 804 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 805 | <code>        .filter((header) =&gt; header.name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 806 | <code>    const authRequired = requiredHeaders.some((header) =&gt; header.isSecret &#124;&#124; /authorization&#124;token&#124;key/i.test(header.name));</code> | 声明局部标识符 `authRequired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 807 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 808 | <code>        type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 809 | <code>        url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 810 | <code>        requiredHeaders,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 811 | <code>        authRequired</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 812 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>function pickRegistryRemote(server = {}) {</code> | 定义函数 `pickRegistryRemote`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 816 | <code>    const remotes = normalizeArray(server.remotes).map(normalizeRemote).filter(Boolean);</code> | 声明局部标识符 `remotes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 817 | <code>    return remotes.find((remote) =&gt; remote.type === 'streamable-http')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 818 | <code>        &#124;&#124; remotes.find((remote) =&gt; remote.type.includes('http'))</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 819 | <code>        &#124;&#124; remotes[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 820 | <code>        &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 821 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 823 | <code>function pickNpmPackage(server = {}) {</code> | 定义函数 `pickNpmPackage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 824 | <code>    return normalizeArray(server.packages).find((entry) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 825 | <code>        const registry = normalizeString(entry?.registry_name &#124;&#124; entry?.registry &#124;&#124; entry?.type).toLowerCase();</code> | 声明局部标识符 `registry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 826 | <code>        return registry === 'npm' &#124;&#124; registry.includes('npm');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 827 | <code>    }) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 828 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 830 | <code>function buildRegistryCandidate(entry = {}) {</code> | 定义函数 `buildRegistryCandidate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 831 | <code>    const server = entry.server &#124;&#124; entry;</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 832 | <code>    const name = normalizeString(server.name &#124;&#124; server.id);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 833 | <code>    if (!name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 834 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 835 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 836 | <code>    const meta = registryMeta(entry);</code> | 声明局部标识符 `meta`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 837 | <code>    const remote = pickRegistryRemote(server);</code> | 声明局部标识符 `remote`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 838 | <code>    const npmPackage = pickNpmPackage(server);</code> | 声明局部标识符 `npmPackage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 839 | <code>    const repositoryUrl = normalizeString(server.repository?.url &#124;&#124; server.repositoryUrl &#124;&#124; server.repo);</code> | 声明局部标识符 `repositoryUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 840 | <code>    const latest = meta.isLatest !== false;</code> | 声明局部标识符 `latest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 841 | <code>    const envVar = remote?.authRequired ? secretEnvNameForServer(name) : '';</code> | 声明局部标识符 `envVar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 842 | <code>    const mcpConfig = remote</code> | 声明局部标识符 `mcpConfig`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 843 | <code>        ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 844 | <code>            transport: 'http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 845 | <code>            url: remote.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 846 | <code>            protocolVersion: '2025-06-18',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 847 | <code>            timeoutMs: 30000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 848 | <code>            ...(envVar ? { bearerTokenEnvVar: envVar } : {})</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 849 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 850 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 851 | <code>    const packageName = normalizeString(npmPackage?.name &#124;&#124; npmPackage?.package &#124;&#124; npmPackage?.identifier);</code> | 声明局部标识符 `packageName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 852 | <code>    const sourceKind = mcpConfig</code> | 声明局部标识符 `sourceKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 853 | <code>        ? 'mcp_config'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 854 | <code>        : packageName</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 855 | <code>            ? 'npm_mcp'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 856 | <code>            : repositoryUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 857 | <code>                ? 'github_mcp'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 858 | <code>                : 'registry_metadata';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 859 | <code>    const id = `mcp-registry:${safeSegment(name)}:${safeSegment(server.version &#124;&#124; 'latest')}`;</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 860 | <code>    const description = normalizeString(server.description &#124;&#124; server.summary);</code> | 声明局部标识符 `description`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 861 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 862 | <code>        id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 863 | <code>        type: 'mcp_candidate',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 864 | <code>        source: 'official_mcp_registry',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 865 | <code>        sourceUrl: OFFICIAL_MCP_REGISTRY_URL,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 866 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 867 | <code>        serverName: safeSegment(name.replace(/[./@]+/g, '-'), 'mcp_server'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 868 | <code>        title: normalizeString(server.title &#124;&#124; server.displayName, name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 869 | <code>        description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 870 | <code>        version: normalizeString(server.version),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 871 | <code>        latest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 872 | <code>        websiteUrl: normalizeString(server.websiteUrl &#124;&#124; server.website_url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 873 | <code>        repositoryUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 874 | <code>        risk: remote?.authRequired ? 'medium' : sourceKind === 'github_mcp' ? 'high' : 'medium',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 875 | <code>        install: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 876 | <code>            sourceKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 877 | <code>            npmPackage: packageName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 878 | <code>            githubRepo: repositoryUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 879 | <code>            mcpConfig,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 880 | <code>            requiredSecrets: remote?.requiredHeaders &#124;&#124; [],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 881 | <code>            authEnvVar: envVar</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 882 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 883 | <code>        smokeProfile: buildMcpSmokeProfile({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 884 | <code>            serverName: safeSegment(name.replace(/[./@]+/g, '-'), 'mcp_server'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 885 | <code>            sourceKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 886 | <code>            authRequired: remote?.authRequired === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 887 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 888 | <code>        searchText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 889 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 890 | <code>            server.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 891 | <code>            description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 892 | <code>            server.version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 893 | <code>            server.websiteUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 894 | <code>            repositoryUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 895 | <code>            remote?.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 896 | <code>            packageName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 897 | <code>            remote?.requiredHeaders?.map((header) =&gt; `${header.name} ${header.description}`).join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 898 | <code>        ].filter(Boolean).join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 899 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 900 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>function buildMcpSmokeProfile({ serverName = '', sourceKind = 'mcp_config', authRequired = false } = {}) {</code> | 定义函数 `buildMcpSmokeProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 903 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 904 | <code>        id: `smoke:${safeSegment(serverName, 'mcp_server')}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 905 | <code>        target: serverName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 906 | <code>        sourceKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 907 | <code>        authRequired,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 908 | <code>        exposePolicy: 'only_expose_after_all_required_checks_pass',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 909 | <code>        checks: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 910 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 911 | <code>                id: 'mcp_config_static_shape',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 912 | <code>                title: 'MCP config has a supported transport and endpoint/command.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 913 | <code>                type: 'static_config',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 914 | <code>                required: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 915 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 916 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 917 | <code>                id: 'mcp_initialize',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 918 | <code>                title: 'MCP server initializes successfully.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 919 | <code>                type: 'mcp_health_check',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 920 | <code>                required: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 921 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 922 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 923 | <code>                id: 'mcp_tools_list',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 924 | <code>                title: 'MCP server returns at least one model-visible tool schema.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 925 | <code>                type: 'mcp_list_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 926 | <code>                minTools: 1,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 927 | <code>                required: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 928 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 929 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 930 | <code>                id: 'mcp_direct_tool_specs',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 931 | <code>                title: 'AILIS can convert returned tools into mcp__server__tool direct specs.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 932 | <code>                type: 'mcp_direct_spec_generation',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 933 | <code>                required: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 934 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 935 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 936 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 937 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 938 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 939 | <code>class AILISToolAcquisitionGateway {</code> | 定义类 `AILISToolAcquisitionGateway`，把相关状态与行为收拢为一个运行时对象。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 940 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 941 | <code>        this.workspaceRoot = path.resolve(options.workspaceRoot &#124;&#124; process.cwd());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 942 | <code>        this.projectRoot = path.resolve(options.projectRoot &#124;&#124; this.workspaceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 943 | <code>        this.stateDir = path.resolve(options.stateDir &#124;&#124; path.join(this.projectRoot, '.ailis-state', 'tool-acquisition'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 944 | <code>        this.learningPath = path.join(this.stateDir, 'tool-learning.json');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 945 | <code>        this.contractIntakePath = path.join(this.stateDir, 'contract-intake.json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 946 | <code>        this.externalExposurePath = path.join(this.stateDir, 'external-tool-exposure.json');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 947 | <code>        this.externalAuthProfilesPath = path.join(this.stateDir, 'external-auth-profiles.json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 948 | <code>        this.registryUrl = normalizeString(options.registryUrl, OFFICIAL_MCP_REGISTRY_URL);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 949 | <code>        this.fetchRegistry = typeof options.registryFetcher === 'function' ? options.registryFetcher : this.defaultFetchRegistry.bind(this);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 950 | <code>        this.mcpManager = options.mcpManager &#124;&#124; null;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 951 | <code>        this.localAdapterRunner = options.localAdapterRunner &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 952 | <code>        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 953 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 954 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 955 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 956 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 957 | <code>            enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 958 | <code>            registryUrl: this.registryUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 959 | <code>            learningPath: this.learningPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 960 | <code>            contractIntakePath: this.contractIntakePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 961 | <code>            externalExposurePath: this.externalExposurePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 962 | <code>            externalAuthProfilesPath: this.externalAuthProfilesPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 963 | <code>            contractSourceCount: CONTRACT_SOURCE_PROFILES.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 964 | <code>            coreBundleCount: CORE_TOOL_BUNDLES.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 965 | <code>            standardToolPackCount: STANDARD_TOOL_PACKS.length</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 966 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 967 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 968 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 969 | <code>    listContractSources() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 970 | <code>        return CONTRACT_SOURCE_PROFILES.map((profile) =&gt; cloneJson(profile));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 971 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 972 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 973 | <code>    listStandardToolPacks(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 974 | <code>        return listStandardToolPacks({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 975 | <code>            includeTools: args.includeTools !== false</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 976 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 977 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 978 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 979 | <code>    searchStandardToolPacks(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 980 | <code>        return searchStandardToolPacks(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 981 | <code>            args.query &#124;&#124; args.q &#124;&#124; args.taskText &#124;&#124; args.task &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 982 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 983 | <code>                limit: args.limit &#124;&#124; 12,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 984 | <code>                includeTools: args.includeTools !== false</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 985 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 986 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 989 | <code>    listCoreTools() {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 990 | <code>        const availableContracts = new Set(listToolContractSummaries().map((contract) =&gt; contract.id));</code> | 声明局部标识符 `availableContracts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 991 | <code>        const availableSkills = new Set(listAILISSkills().map((skill) =&gt; skill.id));</code> | 声明局部标识符 `availableSkills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 992 | <code>        return CORE_TOOL_BUNDLES.map((bundle) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 993 | <code>            const availableToolIds = bundle.toolIds.filter((toolId) =&gt; availableContracts.has(toolId));</code> | 声明局部标识符 `availableToolIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 994 | <code>            const availableSkillIds = bundle.skillIds.filter((skillId) =&gt; availableSkills.has(skillId));</code> | 声明局部标识符 `availableSkillIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 995 | <code>            const health = availableToolIds.length &#124;&#124; availableSkillIds.length ? 'available' : 'needs_mcp_or_plugin';</code> | 声明局部标识符 `health`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 996 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 997 | <code>                id: bundle.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 998 | <code>                type: 'core_tool_bundle',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 999 | <code>                label: bundle.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1000 | <code>                category: bundle.category,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1001 | <code>                description: bundle.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1002 | <code>                health,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1003 | <code>                source: 'ailis_core_tool_catalog',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1004 | <code>                toolIds: [...bundle.toolIds],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1005 | <code>                availableToolIds,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1006 | <code>                skillIds: [...bundle.skillIds],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1007 | <code>                availableSkillIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1008 | <code>                keywords: [...bundle.keywords],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1009 | <code>                smokeProfile: cloneJson(bundle.smokeProfile)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1010 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1012 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1014 | <code>    async searchCandidates(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1015 | <code>        const query = normalizeString(args.query &#124;&#124; args.q &#124;&#124; args.taskText &#124;&#124; args.task &#124;&#124; args.intent);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1016 | <code>        const limit = Math.max(1, Math.min(Number(args.limit &#124;&#124; 12), 50));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1017 | <code>        const includeCore = args.includeCore !== false;</code> | 声明局部标识符 `includeCore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1018 | <code>        const includeRegistry = args.includeRegistry !== false;</code> | 声明局部标识符 `includeRegistry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1019 | <code>        const includeStandardPacks = args.includeStandardPacks !== false &amp;&amp; args.includeStandardToolPacks !== false;</code> | 声明局部标识符 `includeStandardPacks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1020 | <code>        const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1021 | <code>        let candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1022 | <code>        if (includeCore) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1023 | <code>            candidates.push(...this.searchCoreCandidates(query, limit));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1024 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1025 | <code>        if (includeStandardPacks) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1026 | <code>            candidates.push(...this.searchStandardToolPacks({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1027 | <code>                query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1028 | <code>                limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1029 | <code>                includeTools: args.includePackTools === true</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1030 | <code>            }).map((pack) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1031 | <code>                ...pack,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1032 | <code>                health: 'available_after_exposure',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1033 | <code>                searchText: pack.searchText &#124;&#124; JSON.stringify(pack),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1034 | <code>                smokeProfile: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1035 | <code>                    checks: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1036 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1037 | <code>                            id: `${pack.id}_contract_lint`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1038 | <code>                            type: 'contract_lint',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1039 | <code>                            mutates: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1040 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1041 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1042 | <code>                            id: `${pack.id}_exposure_dry_run`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1043 | <code>                            type: 'standard_tool_pack_exposure',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1044 | <code>                            mutates: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1045 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1046 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>            })));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1049 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1050 | <code>        if (includeRegistry) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1051 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1052 | <code>                const registry = await this.searchOfficialRegistry({</code> | 声明局部标识符 `registry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1053 | <code>                    query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1054 | <code>                    limit: Math.max(limit, Number(args.registryLimit &#124;&#124; limit)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1055 | <code>                    maxPages: Number(args.registryMaxPages &#124;&#124; args.maxPages &#124;&#124; 3),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1056 | <code>                    includeAllVersions: args.includeAllVersions === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1057 | <code>                    registryUrl: normalizeString(args.registryUrl, this.registryUrl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1058 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1059 | <code>                candidates.push(...registry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1060 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1061 | <code>                errors.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1062 | <code>                    source: 'official_mcp_registry',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1063 | <code>                    error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1064 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1065 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1066 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1067 | <code>        const ranked = candidates</code> | 声明局部标识符 `ranked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1068 | <code>            .map((candidate) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1069 | <code>                candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1070 | <code>                score: query ? scoreText(query, candidate.searchText &#124;&#124; JSON.stringify(candidate)) : 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1071 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1072 | <code>            .filter((entry) =&gt; !query &#124;&#124; entry.score &gt; 0 &#124;&#124; entry.candidate.type === 'core_tool_bundle')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1073 | <code>            .sort((a, b) =&gt; b.score - a.score &#124;&#124; a.candidate.id.localeCompare(b.candidate.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1074 | <code>            .slice(0, limit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1075 | <code>            .map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1076 | <code>                ...entry.candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1077 | <code>                matchScore: entry.score</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1078 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1079 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1080 | <code>            status: errors.length ? 'partial' : 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1081 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1082 | <code>            sourceCount: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1083 | <code>                core: includeCore ? CORE_TOOL_BUNDLES.length : 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1084 | <code>                standardPacks: includeStandardPacks ? STANDARD_TOOL_PACKS.length : 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1085 | <code>                registry: ranked.filter((candidate) =&gt; candidate.source === 'official_mcp_registry').length</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1086 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1087 | <code>            candidateCount: ranked.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1088 | <code>            candidates: ranked,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1089 | <code>            errors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1090 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1093 | <code>    searchCoreCandidates(query = '', limit = 12) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1094 | <code>        const core = this.listCoreTools();</code> | 声明局部标识符 `core`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1095 | <code>        const ranked = core</code> | 声明局部标识符 `ranked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1096 | <code>            .map((bundle) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1097 | <code>                bundle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1098 | <code>                score: query ? scoreText(query, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1099 | <code>                    bundle.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1100 | <code>                    bundle.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1101 | <code>                    bundle.category,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1102 | <code>                    bundle.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1103 | <code>                    bundle.toolIds.join(' '),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1104 | <code>                    bundle.keywords.join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1105 | <code>                ].join(' ')) : 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1106 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1107 | <code>            .filter((entry) =&gt; !query &#124;&#124; entry.score &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1108 | <code>            .sort((a, b) =&gt; b.score - a.score &#124;&#124; a.bundle.id.localeCompare(b.bundle.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1109 | <code>            .slice(0, Math.max(1, Number(limit) &#124;&#124; 12))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1110 | <code>            .map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1111 | <code>                ...entry.bundle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1112 | <code>                searchText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1113 | <code>                    entry.bundle.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1114 | <code>                    entry.bundle.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1115 | <code>                    entry.bundle.category,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1116 | <code>                    entry.bundle.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1117 | <code>                    entry.bundle.toolIds.join(' '),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1118 | <code>                    entry.bundle.keywords.join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1119 | <code>                ].join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1120 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1121 | <code>        return ranked;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1122 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1124 | <code>    async searchOfficialRegistry({ query = '', limit = 12, maxPages = 3, includeAllVersions = false, registryUrl = '' } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1125 | <code>        const rawEntries = await this.fetchRegistryEntries({ limit, maxPages, registryUrl });</code> | 声明局部标识符 `rawEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1126 | <code>        const latestByName = new Map();</code> | 声明局部标识符 `latestByName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1127 | <code>        const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1128 | <code>        for (const entry of rawEntries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1129 | <code>            const candidate = buildRegistryCandidate(entry);</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1130 | <code>            if (!candidate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1131 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1132 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1133 | <code>            if (includeAllVersions) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1134 | <code>                candidates.push(candidate);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1135 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1136 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1137 | <code>            const previous = latestByName.get(candidate.name);</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1138 | <code>            if (!previous &#124;&#124; candidate.latest &#124;&#124; String(candidate.version).localeCompare(String(previous.version)) &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1139 | <code>                latestByName.set(candidate.name, candidate);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1140 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1141 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1142 | <code>        const source = includeAllVersions ? candidates : [...latestByName.values()];</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1143 | <code>        const ranked = source</code> | 声明局部标识符 `ranked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1144 | <code>            .map((candidate) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1145 | <code>                candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1146 | <code>                score: query ? scoreText(query, candidate.searchText) : 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1147 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1148 | <code>            .filter((entry) =&gt; !query &#124;&#124; entry.score &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1149 | <code>            .sort((a, b) =&gt; b.score - a.score &#124;&#124; a.candidate.id.localeCompare(b.candidate.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1150 | <code>            .slice(0, Math.max(1, Math.min(Number(limit) &#124;&#124; 12, 100)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1151 | <code>            .map((entry) =&gt; entry.candidate);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1152 | <code>        return ranked;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1155 | <code>    async fetchRegistryEntries({ limit = 12, maxPages = 3, registryUrl = '' } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1156 | <code>        const pageLimit = Math.max(1, Math.min(Number(limit) &#124;&#124; 12, 100));</code> | 声明局部标识符 `pageLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1157 | <code>        const pages = Math.max(1, Math.min(Number(maxPages) &#124;&#124; 3, 10));</code> | 声明局部标识符 `pages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1158 | <code>        const entries = [];</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1159 | <code>        let cursor = '';</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1160 | <code>        for (let page = 0; page &lt; pages &amp;&amp; entries.length &lt; pageLimit * pages; page += 1) {</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1161 | <code>            const url = new URL(normalizeString(registryUrl, this.registryUrl));</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1162 | <code>            url.searchParams.set('limit', String(pageLimit));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1163 | <code>            if (cursor) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1164 | <code>                url.searchParams.set('cursor', cursor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1165 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1166 | <code>            const payload = await this.fetchRegistry(url.toString());</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1167 | <code>            const servers = Array.isArray(payload?.servers) ? payload.servers : [];</code> | 声明局部标识符 `servers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1168 | <code>            entries.push(...servers);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1169 | <code>            cursor = normalizeString(payload?.metadata?.nextCursor &#124;&#124; payload?.nextCursor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1170 | <code>            if (!cursor &#124;&#124; !servers.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1171 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1172 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1173 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1174 | <code>        return entries;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1175 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1177 | <code>    async defaultFetchRegistry(url) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1178 | <code>        if (typeof fetch !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1179 | <code>            throw new Error('global fetch is unavailable in this Node runtime');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1180 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1181 | <code>        const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1182 | <code>            headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1183 | <code>                Accept: 'application/json'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1184 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1185 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1186 | <code>        if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1187 | <code>            throw new Error(`MCP Registry request failed with HTTP ${response.status}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1188 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1189 | <code>        return await response.json();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1190 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1192 | <code>    async planMcpCandidate(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1193 | <code>        const candidate = await this.resolveCandidate(args);</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1194 | <code>        if (!candidate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1195 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1196 | <code>                status: 'not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1197 | <code>                candidateId: normalizeString(args.candidateId &#124;&#124; args.id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1198 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1199 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1200 | <code>        if (candidate.type !== 'mcp_candidate') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1201 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1202 | <code>                status: 'not_installable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1203 | <code>                candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1204 | <code>                reason: 'Only MCP registry candidates can be converted into MCP install plans.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1205 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1207 | <code>        const install = candidate.install &#124;&#124; {};</code> | 声明局部标识符 `install`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1208 | <code>        if (!['mcp_config', 'npm_mcp', 'github_mcp'].includes(install.sourceKind)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1209 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1210 | <code>                status: 'not_installable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1211 | <code>                candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1212 | <code>                reason: 'Candidate does not include a supported remote, npm, or GitHub install source.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1213 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1214 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1215 | <code>        const secretEnvVar = normalizeString(args.secretEnvVar &#124;&#124; args.bearerTokenEnvVar &#124;&#124; install.authEnvVar);</code> | 声明局部标识符 `secretEnvVar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1216 | <code>        const mcpConfig = cloneJson(install.mcpConfig &#124;&#124; args.mcpConfig &#124;&#124; null);</code> | 声明局部标识符 `mcpConfig`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1217 | <code>        if (mcpConfig &amp;&amp; secretEnvVar &amp;&amp; !mcpConfig.bearerTokenEnvVar &amp;&amp; !mcpConfig.bearer_token_env_var) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1218 | <code>            mcpConfig.bearerTokenEnvVar = secretEnvVar;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1219 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1220 | <code>        const capabilityId = safeSegment(args.capabilityId &#124;&#124; candidate.name.replace(/[./@]+/g, '-'), 'mcp_capability');</code> | 声明局部标识符 `capabilityId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1221 | <code>        const serverName = safeSegment(args.mcpServerName &#124;&#124; args.server &#124;&#124; candidate.serverName &#124;&#124; capabilityId, capabilityId);</code> | 声明局部标识符 `serverName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1222 | <code>        const planArgs = {</code> | 声明局部标识符 `planArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1223 | <code>            action: 'plan_install',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1224 | <code>            request: normalizeString(args.request, `Install MCP Registry server ${candidate.title &#124;&#124; candidate.name}`),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1225 | <code>            capabilityId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1226 | <code>            label: normalizeString(args.label, candidate.title &#124;&#124; candidate.name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1227 | <code>            description: normalizeString(args.description, candidate.description &#124;&#124; candidate.title &#124;&#124; candidate.name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1228 | <code>            sourceKind: install.sourceKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1229 | <code>            risk: normalizeString(args.risk, candidate.risk &#124;&#124; 'medium'),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1230 | <code>            npmPackage: normalizeString(args.npmPackage &#124;&#124; install.npmPackage),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1231 | <code>            githubRepo: normalizeString(args.githubRepo &#124;&#124; install.githubRepo &#124;&#124; candidate.repositoryUrl),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1232 | <code>            mcpServerName: serverName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1233 | <code>            mcpConfig,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1234 | <code>            skillId: safeSegment(args.skillId &#124;&#124; `${capabilityId}_skill`, `${capabilityId}_skill`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1235 | <code>            skillLabel: normalizeString(args.skillLabel &#124;&#124; args.label, `${candidate.title &#124;&#124; candidate.name} Skill`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1236 | <code>            skillDescription: normalizeString(args.skillDescription, `MCP capability loaded from the official MCP Registry entry ${candidate.name}.`),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1237 | <code>            when: normalizeString(args.when, `用户需要 ${candidate.title &#124;&#124; candidate.name} 相关外部工具能力时。`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1238 | <code>            triggers: normalizeArray(args.triggers &#124;&#124; [candidate.name, candidate.title, candidate.description]).filter(Boolean).map(String),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1239 | <code>            validationCommands: normalizeArray(args.validationCommands &#124;&#124; ['pnpm test:ailis-skills']).map(String)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1240 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1241 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1242 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1243 | <code>            candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1244 | <code>            planArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1245 | <code>            smokeProfile: candidate.smokeProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1246 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1247 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1249 | <code>    async resolveCandidate(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1250 | <code>        if (isPlainObject(args.candidate)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1251 | <code>            return buildRegistryCandidate(args.candidate) &#124;&#124; cloneJson(args.candidate);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1252 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1253 | <code>        if (args.mcpConfig &#124;&#124; args.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1254 | <code>            const name = normalizeString(args.name &#124;&#124; args.server &#124;&#124; args.mcpServerName &#124;&#124; args.url, 'custom-mcp');</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1255 | <code>            return buildRegistryCandidate({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1256 | <code>                server: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1257 | <code>                    name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1258 | <code>                    title: normalizeString(args.title &#124;&#124; args.label, name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1259 | <code>                    description: normalizeString(args.description &#124;&#124; args.request, name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1260 | <code>                    version: normalizeString(args.version, 'custom'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1261 | <code>                    remotes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1262 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1263 | <code>                            type: normalizeString(args.transport &#124;&#124; 'streamable-http'),</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1264 | <code>                            url: normalizeString(args.url &#124;&#124; args.mcpConfig?.url)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1265 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1266 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1267 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1268 | <code>                _meta: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1269 | <code>                    'io.modelcontextprotocol.registry/official': {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1270 | <code>                        isLatest: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1271 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1272 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1273 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1274 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1275 | <code>        const candidateId = normalizeString(args.candidateId &#124;&#124; args.id);</code> | 声明局部标识符 `candidateId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1276 | <code>        const query = normalizeString(args.query &#124;&#124; args.name &#124;&#124; args.server &#124;&#124; candidateId);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1277 | <code>        if (!query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1278 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1279 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1280 | <code>        const search = await this.searchCandidates({</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1281 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1282 | <code>            limit: Math.max(5, Number(args.limit &#124;&#124; 10)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1283 | <code>            includeCore: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1284 | <code>            includeRegistry: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1285 | <code>            registryLimit: args.registryLimit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1286 | <code>            registryMaxPages: args.registryMaxPages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1287 | <code>            registryUrl: args.registryUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1288 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1289 | <code>        return search.candidates.find((candidate) =&gt; candidate.id === candidateId)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1290 | <code>            &#124;&#124; search.candidates.find((candidate) =&gt; candidate.name === query &#124;&#124; candidate.serverName === query)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1291 | <code>            &#124;&#124; search.candidates[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1292 | <code>            &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1293 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1295 | <code>    async buildSmokeProfile(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1296 | <code>        const candidate = await this.resolveCandidate(args);</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1297 | <code>        if (candidate?.smokeProfile) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1298 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1299 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1300 | <code>                candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1301 | <code>                smokeProfile: candidate.smokeProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1302 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1303 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1304 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1305 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1306 | <code>            candidate: candidate &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1307 | <code>            smokeProfile: buildMcpSmokeProfile({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1308 | <code>                serverName: normalizeString(args.server &#124;&#124; args.mcpServerName &#124;&#124; args.name, 'mcp_server'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1309 | <code>                sourceKind: normalizeString(args.sourceKind, 'mcp_config')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1310 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1311 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1312 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1314 | <code>    async smokeMcpCandidate(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1315 | <code>        if (!this.mcpManager?.registerServers &#124;&#124; !this.mcpManager?.healthCheck &#124;&#124; !this.mcpManager?.listToolSpecs) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1316 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1317 | <code>                status: 'unsupported',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1318 | <code>                error: 'smoke_mcp_candidate requires an MCP manager with registerServers/healthCheck/listToolSpecs'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1319 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1320 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1321 | <code>        if (args.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1322 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1323 | <code>                status: 'needs_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1324 | <code>                approvalText: 'Run a temporary MCP smoke test? This may start a local server process or contact a remote MCP endpoint.'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1325 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1326 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1327 | <code>        const planned = await this.planMcpCandidate(args);</code> | 声明局部标识符 `planned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1328 | <code>        if (planned.status !== 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1329 | <code>            return planned;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1330 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1331 | <code>        const serverName = planned.planArgs.mcpServerName;</code> | 声明局部标识符 `serverName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1332 | <code>        const mcpConfig = planned.planArgs.mcpConfig;</code> | 声明局部标识符 `mcpConfig`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1333 | <code>        if (!mcpConfig) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1334 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1335 | <code>                status: 'unsupported',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1336 | <code>                candidate: planned.candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1337 | <code>                error: 'candidate does not include a direct MCP config to smoke test'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1338 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1339 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1340 | <code>        this.mcpManager.registerServers({ [serverName]: mcpConfig }, { persist: false });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1341 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1342 | <code>            const health = await this.mcpManager.healthCheck(serverName, args.timeoutMs &#124;&#124; 15000);</code> | 声明局部标识符 `health`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1343 | <code>            const specs = await this.mcpManager.listToolSpecs(serverName, args.timeoutMs &#124;&#124; 15000).catch(() =&gt; []);</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1344 | <code>            const ok = health.every((entry) =&gt; entry.ok) &amp;&amp; specs.length &gt; 0;</code> | 声明局部标识符 `ok`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1345 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1346 | <code>                status: ok ? 'completed' : 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1347 | <code>                candidate: planned.candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1348 | <code>                serverName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1349 | <code>                health,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1350 | <code>                directSpecCount: specs.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1351 | <code>                directSpecs: specs.slice(0, Number(args.limit &#124;&#124; 8)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1352 | <code>                smokeProfile: planned.smokeProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1353 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1354 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1355 | <code>            this.mcpManager.removeServer(serverName, { persist: false });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1356 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1357 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1359 | <code>    compileContract(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1360 | <code>        const raw = args.rawContract &#124;&#124;</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1361 | <code>            args.contract &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1362 | <code>            args.toolSpec &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1363 | <code>            args.tool &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1364 | <code>            args.operation &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1365 | <code>            args.openapiOperation &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1366 | <code>            args;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1367 | <code>        const result = compileAndLintAilisContract(raw, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1368 | <code>            id: args.contractId &#124;&#124; args.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1369 | <code>            name: args.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1370 | <code>            title: args.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1371 | <code>            description: args.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1372 | <code>            purpose: args.purpose,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1373 | <code>            sourceType: args.sourceType &#124;&#124; args.source_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1374 | <code>            sourceName: args.sourceName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1375 | <code>            sourceUrl: args.sourceUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1376 | <code>            server: args.server &#124;&#124; args.serverName &#124;&#124; args.mcpServerName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1377 | <code>            risk: args.risk,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1378 | <code>            approval: args.approval,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1379 | <code>            minScore: args.minScore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1380 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1381 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1382 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1383 | <code>            ...result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1384 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1385 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1387 | <code>    lintContract(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1388 | <code>        const contract = args.compiledContract &#124;&#124; args.contract;</code> | 声明局部标识符 `contract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1389 | <code>        if (!contract &#124;&#124; !contract.inputSchema) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1390 | <code>            return this.compileContract(args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1391 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1392 | <code>        const lint = lintAilisContract(contract, { minScore: args.minScore });</code> | 声明局部标识符 `lint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1393 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1394 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1395 | <code>            contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1396 | <code>            lint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1397 | <code>            promptCard: buildContractPromptCard(contract, lint)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1398 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1399 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1401 | <code>    async loadContractIntake() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1402 | <code>        const state = await readJsonFile(this.contractIntakePath, null);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1403 | <code>        if (state?.version === 1 &amp;&amp; Array.isArray(state.contracts)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1404 | <code>            return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1405 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1406 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1407 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1408 | <code>            createdAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1409 | <code>            updatedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1410 | <code>            contracts: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1411 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1412 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1413 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1414 | <code>    async saveContractIntake(state) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1415 | <code>        const next = {</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1416 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1417 | <code>            createdAt: state.createdAt &#124;&#124; new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1418 | <code>            updatedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1419 | <code>            contracts: Array.isArray(state.contracts) ? state.contracts : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1420 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1421 | <code>        await writeJsonFileAtomic(this.contractIntakePath, next);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1422 | <code>        return next;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1423 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1425 | <code>    async intakeContracts(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1426 | <code>        const sourceType = normalizeString(args.sourceType &#124;&#124; args.source_type);</code> | 声明局部标识符 `sourceType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1427 | <code>        const rawContracts = normalizeArray(</code> | 声明局部标识符 `rawContracts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1428 | <code>            args.rawContracts &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1429 | <code>                args.contracts &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1430 | <code>                args.tools &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1431 | <code>                args.toolSpecs &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1432 | <code>                args.openapiOperations &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1433 | <code>                args.operations &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1434 | <code>                args.mcpTools &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1435 | <code>                args.rawContract &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1436 | <code>                args.contract &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1437 | <code>                args.toolSpec &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1438 | <code>                args.tool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1439 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1440 | <code>        if (!rawContracts.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1441 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1442 | <code>                status: 'invalid_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1443 | <code>                error: 'intake_contracts requires contracts/tools/toolSpecs/rawContract'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1444 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1445 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1446 | <code>        const minScore = Number(args.minScore &#124;&#124; 75);</code> | 声明局部标识符 `minScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1447 | <code>        const compiled = rawContracts.map((raw, index) =&gt; compileAndLintAilisContract(raw, {</code> | 声明局部标识符 `compiled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1448 | <code>            sourceType: sourceType &#124;&#124; raw.sourceType &#124;&#124; raw.source_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1449 | <code>            server: args.server &#124;&#124; args.serverName &#124;&#124; args.mcpServerName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1450 | <code>            sourceName: args.sourceName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1451 | <code>            sourceUrl: args.sourceUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1452 | <code>            minScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1453 | <code>            id: raw.id &#124;&#124; raw.name &#124;&#124; `${sourceType &#124;&#124; 'tool'}_${index + 1}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1454 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1455 | <code>        const accepted = compiled.filter((entry) =&gt; entry.lint.approved);</code> | 声明局部标识符 `accepted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1456 | <code>        const rejected = compiled.filter((entry) =&gt; !entry.lint.approved);</code> | 声明局部标识符 `rejected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1457 | <code>        const state = await this.loadContractIntake();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1458 | <code>        const byId = new Map((state.contracts &#124;&#124; []).map((entry) =&gt; [entry.contract.id, entry]));</code> | 声明局部标识符 `byId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1459 | <code>        for (const entry of compiled) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1460 | <code>            byId.set(entry.contract.id, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1461 | <code>                importedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1462 | <code>                status: entry.lint.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1463 | <code>                score: entry.lint.score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1464 | <code>                minScore: entry.lint.minScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1465 | <code>                source: entry.contract.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1466 | <code>                contract: entry.contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1467 | <code>                lint: entry.lint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1468 | <code>                promptCard: entry.promptCard</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1469 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1470 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1471 | <code>        state.contracts = [...byId.values()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1472 | <code>            .sort((a, b) =&gt; String(a.contract.id).localeCompare(String(b.contract.id)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1473 | <code>        const saved = await this.saveContractIntake(state);</code> | 声明局部标识符 `saved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1474 | <code>        this.emitGatewayEvent('tool_acquisition.contract_intake.updated', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1475 | <code>            accepted: accepted.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1476 | <code>            rejected: rejected.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1477 | <code>            total: compiled.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1478 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1479 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1480 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1481 | <code>            contractIntakePath: this.contractIntakePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1482 | <code>            total: compiled.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1483 | <code>            accepted: accepted.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1484 | <code>            rejected: rejected.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1485 | <code>            acceptedContracts: accepted.map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1486 | <code>                id: entry.contract.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1487 | <code>                score: entry.lint.score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1488 | <code>                source: entry.contract.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1489 | <code>                smokeProfile: entry.contract.smokeProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1490 | <code>            })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1491 | <code>            rejectedContracts: rejected.map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1492 | <code>                id: entry.contract.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1493 | <code>                score: entry.lint.score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1494 | <code>                issues: entry.lint.issues</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1495 | <code>            })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1496 | <code>            contractCount: saved.contracts.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1497 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1498 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1500 | <code>    async listContractIntake(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1501 | <code>        const state = await this.loadContractIntake();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1502 | <code>        const status = normalizeString(args.status);</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1503 | <code>        const query = normalizeString(args.query).toLowerCase();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1504 | <code>        const contracts = state.contracts</code> | 声明局部标识符 `contracts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1505 | <code>            .filter((entry) =&gt; !status &#124;&#124; entry.status === status)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1506 | <code>            .filter((entry) =&gt; !query &#124;&#124; JSON.stringify(entry).toLowerCase().includes(query))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1507 | <code>            .slice(0, Math.max(1, Math.min(Number(args.limit &#124;&#124; 50), 500)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1508 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1509 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1510 | <code>            contractIntakePath: this.contractIntakePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1511 | <code>            updatedAt: state.updatedAt &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1512 | <code>            contractCount: state.contracts.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1513 | <code>            contracts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1514 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1515 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1517 | <code>    makeExternalExposureEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1518 | <code>        contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1519 | <code>        lint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1520 | <code>        promptCard = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1521 | <code>        source = {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1522 | <code>        callable = false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1523 | <code>        toolId = '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1524 | <code>        modelSpec = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1525 | <code>        verification = 'unverified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1526 | <code>        exposureKind = 'external_contract_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1527 | <code>        adapter = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1528 | <code>        authProfileId = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1529 | <code>        notes = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1530 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1531 | <code>        const safeId = safeSegment(contract?.id &#124;&#124; toolId &#124;&#124; source.name &#124;&#124; 'external_tool');</code> | 声明局部标识符 `safeId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1532 | <code>        const entry = {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1533 | <code>            id: `external:${safeId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1534 | <code>            type: exposureKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1535 | <code>            status: 'exposed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1536 | <code>            exposure: 'direct_external',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1537 | <code>            callable: callable === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1538 | <code>            verified: verification === 'verified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1539 | <code>            verification,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1540 | <code>            toolId: normalizeString(toolId &#124;&#124; contract?.id),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1541 | <code>            name: normalizeString(contract?.name &#124;&#124; toolId &#124;&#124; safeId),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1542 | <code>            title: normalizeString(contract?.title &#124;&#124; contract?.name &#124;&#124; toolId &#124;&#124; safeId),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1543 | <code>            source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1544 | <code>                ...(contract?.source &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1545 | <code>                ...source</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1546 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1547 | <code>            score: lint?.score ?? null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1548 | <code>            lintStatus: lint?.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1549 | <code>            risk: normalizeString(contract?.risk, 'medium'),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1550 | <code>            mutates: contract?.mutates === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1551 | <code>            approval: normalizeString(contract?.approval, 'policy'),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1552 | <code>            adapter: adapter &amp;&amp; typeof adapter === 'object' &amp;&amp; !Array.isArray(adapter) ? adapter : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1553 | <code>            authProfileId: normalizeString(authProfileId &#124;&#124; adapter?.authProfileId &#124;&#124; contract?.authProfileId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1554 | <code>            callableReason: callable === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1555 | <code>                ? 'Runtime has a live callable direct spec for this tool.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1556 | <code>                : 'Visible to Agent as an external contract/candidate; execution requires install, adapter, auth, or smoke verification.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1557 | <code>            modelFacing: modelSpec &#124;&#124; {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1558 | <code>                type: 'external_contract',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1559 | <code>                name: normalizeString(contract?.id &#124;&#124; toolId &#124;&#124; safeId),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1560 | <code>                description: normalizeString(contract?.purpose &#124;&#124; contract?.description &#124;&#124; promptCard).slice(0, 1800),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1561 | <code>                parameters: contract?.inputSchema &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1562 | <code>                output_schema: contract?.outputSchema &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1563 | <code>                prompt_card: promptCard</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1564 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>            contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1566 | <code>            lint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1567 | <code>            notes: normalizeArray(notes).map(String).filter(Boolean).slice(0, 12),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1568 | <code>            exposedAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1569 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1570 | <code>        entry.virtualToolId = entry.callable ? createExternalVirtualToolId(entry) : '';</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1571 | <code>        return entry;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1572 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1574 | <code>    async loadExternalExposure() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1575 | <code>        const state = await readJsonFile(this.externalExposurePath, null);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1576 | <code>        if (state?.version === EXTERNAL_EXPOSURE_VERSION &amp;&amp; Array.isArray(state.exposures)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1577 | <code>            return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1578 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1579 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1580 | <code>            version: EXTERNAL_EXPOSURE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1581 | <code>            createdAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1582 | <code>            updatedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1583 | <code>            exposures: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1584 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1585 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1587 | <code>    async saveExternalExposure(state) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1588 | <code>        const next = {</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1589 | <code>            version: EXTERNAL_EXPOSURE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1590 | <code>            createdAt: state.createdAt &#124;&#124; new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1591 | <code>            updatedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1592 | <code>            exposures: Array.isArray(state.exposures) ? state.exposures : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1593 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1594 | <code>        await writeJsonFileAtomic(this.externalExposurePath, next);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1595 | <code>        return next;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1596 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1598 | <code>    async loadExternalAuthProfiles() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1599 | <code>        const state = await readJsonFile(this.externalAuthProfilesPath, null);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1600 | <code>        if (state?.version === EXTERNAL_AUTH_PROFILE_VERSION &amp;&amp; Array.isArray(state.profiles)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1601 | <code>            return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1602 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1603 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1604 | <code>            version: EXTERNAL_AUTH_PROFILE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1605 | <code>            createdAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1606 | <code>            updatedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1607 | <code>            profiles: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1608 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1609 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1611 | <code>    async saveExternalAuthProfiles(state) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1612 | <code>        const next = {</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1613 | <code>            version: EXTERNAL_AUTH_PROFILE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1614 | <code>            createdAt: state.createdAt &#124;&#124; new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1615 | <code>            updatedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1616 | <code>            profiles: Array.isArray(state.profiles) ? state.profiles : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1617 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1618 | <code>        await writeJsonFileAtomic(this.externalAuthProfilesPath, next);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1619 | <code>        return next;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1620 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1622 | <code>    normalizeExternalAuthProfile(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1623 | <code>        const provider = normalizeString(args.provider &#124;&#124; args.sourceType &#124;&#124; args.source &#124;&#124; args.type, 'external');</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1624 | <code>        const id = safeSegment(</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1625 | <code>            args.authProfileId &#124;&#124; args.profileId &#124;&#124; args.id &#124;&#124; args.name &#124;&#124; `${provider}_auth`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1626 | <code>            'external_auth'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1627 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1628 | <code>        const authType = normalizeAuthType(args.authType &#124;&#124; args.auth_type &#124;&#124; args.kind, provider);</code> | 声明局部标识符 `authType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1629 | <code>        if (args.secret &#124;&#124; args.secretValue &#124;&#124; args.token &#124;&#124; args.apiKey &#124;&#124; args.password) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1630 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1631 | <code>                error: 'raw_secret_not_allowed',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1632 | <code>                message: 'Do not store raw secrets in AILIS auth profiles. Put the secret in an environment variable and store only envVar here.'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1633 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1634 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1635 | <code>        const envVar = normalizeString(</code> | 声明局部标识符 `envVar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1636 | <code>            args.envVar &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1637 | <code>                args.apiKeyEnvVar &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1638 | <code>                args.tokenEnvVar &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1639 | <code>                args.bearerTokenEnvVar &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1640 | <code>                (authType === 'composio_api_key_env' ? 'COMPOSIO_API_KEY' : '')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1641 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1642 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1643 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1644 | <code>            label: normalizeString(args.label &#124;&#124; args.title, id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1645 | <code>            provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1646 | <code>            authType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1647 | <code>            envVar,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1648 | <code>            headerName: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1649 | <code>                args.headerName &#124;&#124; args.header &#124;&#124; (authType === 'api_key_env' &#124;&#124; authType === 'composio_api_key_env' ? 'x-api-key' : '')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1650 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1651 | <code>            queryParamName: normalizeString(args.queryParamName &#124;&#124; args.queryParam &#124;&#124; args.param),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1652 | <code>            tokenPrefix: normalizeString(args.tokenPrefix &#124;&#124; args.prefix, authType === 'bearer_env' ? 'Bearer' : ''),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1653 | <code>            baseUrl: normalizeString(args.baseUrl &#124;&#124; args.baseURL &#124;&#124; args.apiBaseUrl &#124;&#124; args.api_base_url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1654 | <code>            userId: normalizeString(args.userId &#124;&#124; args.user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1655 | <code>            connectedAccountId: normalizeString(args.connectedAccountId &#124;&#124; args.connected_account_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1656 | <code>            entityId: normalizeString(args.entityId &#124;&#124; args.entity_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1657 | <code>            defaultHeaders: args.defaultHeaders &amp;&amp; typeof args.defaultHeaders === 'object' &amp;&amp; !Array.isArray(args.defaultHeaders)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1658 | <code>                ? redactHeaders(args.defaultHeaders)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1659 | <code>                : {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1660 | <code>            scope: normalizeArray(args.scope &#124;&#124; args.scopes &#124;&#124; args.permissions).map(String).filter(Boolean).slice(0, 32)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1661 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1662 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1664 | <code>    authProfileStatus(profile = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1665 | <code>        const authType = normalizeAuthType(profile.authType, profile.provider);</code> | 声明局部标识符 `authType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1666 | <code>        const envRequired = !['none', 'no_auth'].includes(authType);</code> | 声明局部标识符 `envRequired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1667 | <code>        const envVar = normalizeString(profile.envVar);</code> | 声明局部标识符 `envVar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1668 | <code>        const envPresent = !envRequired &#124;&#124; Boolean(envVar &amp;&amp; process.env[envVar]);</code> | 声明局部标识符 `envPresent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1669 | <code>        const issues = [];</code> | 声明局部标识符 `issues`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1670 | <code>        if (envRequired &amp;&amp; !envVar) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1671 | <code>            issues.push('missing_env_var');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1672 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1673 | <code>        if (envRequired &amp;&amp; envVar &amp;&amp; !process.env[envVar]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1674 | <code>            issues.push('env_var_not_set');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1675 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1676 | <code>        if (authType === 'api_key_env' &amp;&amp; !normalizeString(profile.headerName &#124;&#124; profile.queryParamName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1677 | <code>            issues.push('missing_api_key_location');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1678 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1679 | <code>        if (authType === 'composio_api_key_env' &amp;&amp; !normalizeString(profile.headerName, 'x-api-key')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1680 | <code>            issues.push('missing_composio_header_name');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1681 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1682 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1683 | <code>            status: issues.length ? 'needs_config' : 'ready',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1684 | <code>            envRequired,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1685 | <code>            envPresent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1686 | <code>            issues</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1687 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1688 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1690 | <code>    publicAuthProfile(profile = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1691 | <code>        const status = this.authProfileStatus(profile);</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1692 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1693 | <code>            ...profile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1694 | <code>            envPresent: status.envPresent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1695 | <code>            readiness: status.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1696 | <code>            issues: status.issues,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1697 | <code>            secretValue: undefined</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1698 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1699 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1700 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1701 | <code>    async configureExternalAuthProfile(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1702 | <code>        const profile = this.normalizeExternalAuthProfile(args);</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1703 | <code>        if (profile.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1704 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1705 | <code>                status: profile.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1706 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1707 | <code>                message: profile.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1708 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1709 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1710 | <code>        const now = new Date().toISOString();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1711 | <code>        const state = await this.loadExternalAuthProfiles();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1712 | <code>        const byId = new Map((state.profiles &#124;&#124; []).map((entry) =&gt; [entry.id, entry]));</code> | 声明局部标识符 `byId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1713 | <code>        const previous = byId.get(profile.id) &#124;&#124; {};</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1714 | <code>        const nextProfile = {</code> | 声明局部标识符 `nextProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1715 | <code>            ...previous,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1716 | <code>            ...profile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1717 | <code>            createdAt: previous.createdAt &#124;&#124; now,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1718 | <code>            updatedAt: now</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1719 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1720 | <code>        byId.set(profile.id, nextProfile);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1721 | <code>        state.profiles = [...byId.values()].sort((a, b) =&gt; String(a.id).localeCompare(String(b.id)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1722 | <code>        const saved = await this.saveExternalAuthProfiles(state);</code> | 声明局部标识符 `saved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1723 | <code>        this.emitGatewayEvent('tool_acquisition.external_auth.profile_configured', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1724 | <code>            id: nextProfile.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1725 | <code>            provider: nextProfile.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1726 | <code>            authType: nextProfile.authType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1727 | <code>            readiness: this.authProfileStatus(nextProfile).status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1728 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1729 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1730 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1731 | <code>            externalAuthProfilesPath: this.externalAuthProfilesPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1732 | <code>            profile: this.publicAuthProfile(nextProfile),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1733 | <code>            total: saved.profiles.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1734 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1735 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1737 | <code>    async listExternalAuthProfiles(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1738 | <code>        const state = await this.loadExternalAuthProfiles();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1739 | <code>        const query = normalizeString(args.query &#124;&#124; args.provider &#124;&#124; args.sourceType &#124;&#124; args.source).toLowerCase();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1740 | <code>        const profiles = (state.profiles &#124;&#124; [])</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1741 | <code>            .filter((entry) =&gt; !query &#124;&#124; JSON.stringify(entry).toLowerCase().includes(query))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1742 | <code>            .slice(0, Math.max(1, Math.min(Number(args.limit &#124;&#124; 50), 500)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1743 | <code>            .map((entry) =&gt; this.publicAuthProfile(entry));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1744 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1745 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1746 | <code>            externalAuthProfilesPath: this.externalAuthProfilesPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1747 | <code>            updatedAt: state.updatedAt &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1748 | <code>            total: state.profiles.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1749 | <code>            returned: profiles.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1750 | <code>            profiles</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1751 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1752 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1753 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1754 | <code>    async getExternalAuthProfile(id = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1755 | <code>        const requested = normalizeString(id);</code> | 声明局部标识符 `requested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1756 | <code>        if (!requested) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1757 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1758 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1759 | <code>        const state = await this.loadExternalAuthProfiles();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1760 | <code>        const lowered = requested.toLowerCase();</code> | 声明局部标识符 `lowered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1761 | <code>        return (state.profiles &#124;&#124; []).find((entry) =&gt;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1762 | <code>            [entry.id, entry.label, entry.provider].map((value) =&gt; normalizeString(value).toLowerCase()).includes(lowered)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1763 | <code>        ) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1764 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1766 | <code>    resolveInlineAuthProfile(args = {}, exposure = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1767 | <code>        const inline = args.authProfile &amp;&amp; typeof args.authProfile === 'object' &amp;&amp; !Array.isArray(args.authProfile)</code> | 声明局部标识符 `inline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1768 | <code>            ? args.authProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1769 | <code>            : args.auth &amp;&amp; typeof args.auth === 'object' &amp;&amp; !Array.isArray(args.auth)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1770 | <code>                ? args.auth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1771 | <code>                : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1772 | <code>        if (!inline) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1773 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1774 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1775 | <code>        const profile = this.normalizeExternalAuthProfile({</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1776 | <code>            ...inline,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1777 | <code>            provider: inline.provider &#124;&#124; exposure.source?.type &#124;&#124; exposure.source?.name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1778 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1779 | <code>        return profile.error ? null : profile;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1780 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1782 | <code>    async resolveAuthProfileForExecution(exposure = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1783 | <code>        const requested = normalizeString(</code> | 声明局部标识符 `requested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1784 | <code>            args.authProfileId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1785 | <code>                args.profileId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1786 | <code>                exposure.authProfileId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1787 | <code>                exposure.adapter?.authProfileId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1788 | <code>                exposure.source?.authProfileId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1789 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1790 | <code>        if (requested) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1791 | <code>            const profile = await this.getExternalAuthProfile(requested);</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1792 | <code>            if (!profile) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1793 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1794 | <code>                    profile: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1795 | <code>                    status: 'auth_profile_not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1796 | <code>                    message: `External auth profile not found: ${requested}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1797 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1798 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1799 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1800 | <code>                profile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1801 | <code>                status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1802 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1803 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1804 | <code>        const inline = this.resolveInlineAuthProfile(args, exposure);</code> | 声明局部标识符 `inline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1805 | <code>        if (inline) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1806 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1807 | <code>                profile: inline,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1808 | <code>                status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1809 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1810 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1811 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1812 | <code>            profile: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1813 | <code>            status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1814 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1815 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1816 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1817 | <code>    buildAuthMaterial(profile = null) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1818 | <code>        if (!profile) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1819 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1820 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1821 | <code>                headers: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1822 | <code>                query: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1823 | <code>                body: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1824 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1825 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1826 | <code>        const authType = normalizeAuthType(profile.authType, profile.provider);</code> | 声明局部标识符 `authType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1827 | <code>        if (['none', 'no_auth'].includes(authType)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1828 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1829 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1830 | <code>                headers: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1831 | <code>                query: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1832 | <code>                body: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1833 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1834 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1835 | <code>        const envVar = normalizeString(profile.envVar);</code> | 声明局部标识符 `envVar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1836 | <code>        const secret = envVar ? process.env[envVar] : '';</code> | 声明局部标识符 `secret`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1837 | <code>        if (!envVar &#124;&#124; !secret) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1838 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1839 | <code>                status: 'auth_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1840 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1841 | <code>                authProfileId: profile.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1842 | <code>                authType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1843 | <code>                envVar,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1844 | <code>                message: envVar</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1845 | <code>                    ? `Required environment variable is not set: ${envVar}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1846 | <code>                    : `Auth profile ${profile.id &#124;&#124; profile.provider &#124;&#124; 'external'} requires an envVar.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1847 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1848 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1849 | <code>        const headers = {};</code> | 声明局部标识符 `headers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1850 | <code>        const query = {};</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1851 | <code>        if (authType === 'bearer_env') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1852 | <code>            const prefix = normalizeString(profile.tokenPrefix, 'Bearer');</code> | 声明局部标识符 `prefix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1853 | <code>            headers.Authorization = prefix ? `${prefix} ${secret}` : secret;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1854 | <code>        } else if (authType === 'api_key_env') {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1855 | <code>            const headerName = normalizeString(profile.headerName);</code> | 声明局部标识符 `headerName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1856 | <code>            const queryParamName = normalizeString(profile.queryParamName);</code> | 声明局部标识符 `queryParamName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1857 | <code>            if (headerName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1858 | <code>                headers[headerName] = secret;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1859 | <code>            } else if (queryParamName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1860 | <code>                query[queryParamName] = secret;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1861 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1862 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1863 | <code>                    status: 'auth_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1864 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1865 | <code>                    authProfileId: profile.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1866 | <code>                    authType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1867 | <code>                    envVar,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1868 | <code>                    message: 'api_key_env auth profile requires headerName or queryParamName.'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1869 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1870 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1871 | <code>        } else if (authType === 'composio_api_key_env') {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1872 | <code>            headers[normalizeString(profile.headerName, 'x-api-key')] = secret;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1873 | <code>        } else if (authType === 'basic_env') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1874 | <code>            headers.Authorization = `Basic ${Buffer.from(secret).toString('base64')}`;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1875 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1876 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1877 | <code>                status: 'unsupported_auth_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1878 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1879 | <code>                authProfileId: profile.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1880 | <code>                authType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1881 | <code>                message: `Unsupported external auth profile type: ${authType}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1882 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1883 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1884 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1885 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1886 | <code>            headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1887 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1888 | <code>            body: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1889 | <code>            authProfileId: profile.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1890 | <code>            authType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1891 | <code>            envVar</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1892 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1893 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1894 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1895 | <code>    needsExternalExecutionApproval(exposure = {}, { method = '', sourceType = '' } = {}, args = {}, context = {}) {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1896 | <code>        if (args.approved === true &#124;&#124; context.approved === true &#124;&#124; context.executeExternalApproved === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1897 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1898 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1899 | <code>        const normalizedMethod = normalizeString(method, 'GET').toUpperCase();</code> | 声明局部标识符 `normalizedMethod`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1900 | <code>        const source = normalizeString(sourceType &#124;&#124; exposure.source?.type);</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1901 | <code>        const mutates = exposure.mutates === true &#124;&#124; exposure.contract?.mutates === true &#124;&#124; !SAFE_HTTP_METHODS.has(normalizedMethod);</code> | 声明局部标识符 `mutates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1902 | <code>        const composioNeedsApproval = source === 'composio_tool' &amp;&amp; exposure.contract?.readOnlyHint !== true;</code> | 声明局部标识符 `composioNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1903 | <code>        if (!mutates &amp;&amp; !composioNeedsApproval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1904 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1905 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1906 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1907 | <code>            status: 'needs_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1908 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1909 | <code>            exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1910 | <code>            toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1911 | <code>            approvalText: `Execute external ${source &#124;&#124; 'tool'} ${exposure.title &#124;&#124; exposure.toolId &#124;&#124; exposure.id}? This may contact an external service${mutates ? ' and mutate remote state' : ''}.`,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1912 | <code>            approval: {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1913 | <code>                required: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1914 | <code>                reason: source === 'composio_tool' ? 'composio_external_action_requires_approval' : 'external_mutation_requires_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1915 | <code>                source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1916 | <code>                method: normalizedMethod,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1917 | <code>                mutates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1918 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1919 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1920 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1921 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1922 | <code>    async exposeInstalledMcpToolSpecs(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1923 | <code>        if (!this.mcpManager?.listToolSpecs) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1924 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1925 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1926 | <code>        const specs = await this.mcpManager.listToolSpecs(</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1927 | <code>            normalizeString(args.server &#124;&#124; args.serverName &#124;&#124; args.mcpServerName),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1928 | <code>            args.timeoutMs &#124;&#124; 15000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1929 | <code>        ).catch(() =&gt; []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1930 | <code>        return specs.slice(0, Math.max(1, Math.min(Number(args.limit &#124;&#124; 100), 500))).map((spec) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1931 | <code>            const raw = {</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1932 | <code>                id: spec.id &#124;&#124; spec.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1933 | <code>                name: spec.tool &#124;&#124; spec.name &#124;&#124; spec.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1934 | <code>                title: spec.title &#124;&#124; spec.name &#124;&#124; spec.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1935 | <code>                description: spec.description &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1936 | <code>                inputSchema: spec.input_schema &#124;&#124; spec.inputSchema &#124;&#124; spec.parameters &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1937 | <code>                outputSchema: spec.output_schema &#124;&#124; spec.outputSchema &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1938 | <code>                server: spec.server</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1939 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1940 | <code>            const compiled = compileAndLintAilisContract(raw, {</code> | 声明局部标识符 `compiled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1941 | <code>                sourceType: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1942 | <code>                server: spec.server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1943 | <code>                minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1944 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1945 | <code>            return this.makeExternalExposureEntry({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1946 | <code>                contract: compiled.contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1947 | <code>                lint: compiled.lint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1948 | <code>                promptCard: compiled.promptCard,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1949 | <code>                source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1950 | <code>                    type: 'installed_mcp_direct',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1951 | <code>                    name: spec.server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1952 | <code>                    rawToolName: spec.tool &#124;&#124; spec.name</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1953 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1954 | <code>                callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1955 | <code>                toolId: spec.id &#124;&#124; spec.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1956 | <code>                modelSpec: spec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1957 | <code>                verification: 'verified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1958 | <code>                exposureKind: 'live_mcp_direct_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1959 | <code>                notes: ['Installed MCP direct specs are callable as mcp__server__tool ids.']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1960 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1961 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1962 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1964 | <code>    async exposeMcpRegistryCandidates(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1965 | <code>        const query = normalizeString(args.query &#124;&#124; args.taskText &#124;&#124; args.task &#124;&#124; args.request);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1966 | <code>        const candidates = await this.searchOfficialRegistry({</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1967 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1968 | <code>            limit: Math.max(1, Math.min(Number(args.registryLimit &#124;&#124; args.limit &#124;&#124; 20), 100)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1969 | <code>            maxPages: Math.max(1, Math.min(Number(args.registryMaxPages &#124;&#124; args.maxPages &#124;&#124; 3), 10)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1970 | <code>            includeAllVersions: args.includeAllVersions === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1971 | <code>            registryUrl: normalizeString(args.registryUrl, this.registryUrl)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1972 | <code>        }).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1973 | <code>            this.emitGatewayEvent('tool_acquisition.external_exposure.registry_failed', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1974 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1975 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1976 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1977 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1978 | <code>        return candidates.map((candidate) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1979 | <code>            const raw = {</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1980 | <code>                id: candidate.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1981 | <code>                name: candidate.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1982 | <code>                title: candidate.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1983 | <code>                description: candidate.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1984 | <code>                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1985 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1986 | <code>                    required: ['query'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1987 | <code>                    additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1988 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1989 | <code>                        query: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1990 | <code>                            type: 'string',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1991 | <code>                            description: 'Task or capability need used to decide whether to install this MCP server.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1992 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1993 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1994 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1995 | <code>                whenToUse: [`Use when the task needs the external MCP server ${candidate.title &#124;&#124; candidate.name}.`],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1996 | <code>                whenNotToUse: ['Do not call as a direct runtime tool before installation and smoke test pass.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1997 | <code>                preconditions: ['Run plan_mcp_candidate, install_capability, and smoke_mcp_candidate before marking tools callable.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1998 | <code>                examples: [{ query: candidate.title &#124;&#124; candidate.name }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1999 | <code>                badExamples: [{ tool_call: candidate.name }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2000 | <code>                alternatives: ['Search installed MCP direct specs first.', 'Use core tools if they already satisfy the task.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2001 | <code>                errors: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2002 | <code>                    not_installed: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2003 | <code>                        recoverable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2004 | <code>                        nextActions: ['plan_mcp_candidate', 'install_capability', 'smoke_mcp_candidate']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2005 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2006 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2007 | <code>                permissions: candidate.install?.authEnvVar ? [candidate.install.authEnvVar] : []</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2008 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2009 | <code>            const compiled = compileAndLintAilisContract(raw, {</code> | 声明局部标识符 `compiled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2010 | <code>                sourceType: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2011 | <code>                sourceName: 'official_mcp_registry',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2012 | <code>                sourceUrl: candidate.sourceUrl &#124;&#124; this.registryUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2013 | <code>                minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2014 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2015 | <code>            return this.makeExternalExposureEntry({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2016 | <code>                contract: compiled.contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2017 | <code>                lint: compiled.lint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2018 | <code>                promptCard: compiled.promptCard,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2019 | <code>                source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2020 | <code>                    type: 'mcp_registry_candidate',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2021 | <code>                    name: candidate.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2022 | <code>                    url: candidate.sourceUrl &#124;&#124; this.registryUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2023 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2024 | <code>                callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2025 | <code>                toolId: candidate.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2026 | <code>                verification: 'install_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2027 | <code>                exposureKind: 'mcp_registry_candidate_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2028 | <code>                notes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2029 | <code>                    'This is directly visible to Agent for discovery/planning.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2030 | <code>                    'It is not callable until installed and smoke tested.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2031 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2032 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2033 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2034 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2036 | <code>    compileRawExternalToolsForExposure(rawContracts = [], args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2037 | <code>        const sourceType = normalizeString(args.sourceType &#124;&#124; args.source_type &#124;&#124; 'generic_tool');</code> | 声明局部标识符 `sourceType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2038 | <code>        return normalizeArray(rawContracts).map((raw, index) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2039 | <code>            const requestedAdapter = raw.adapter &amp;&amp; typeof raw.adapter === 'object' &amp;&amp; !Array.isArray(raw.adapter)</code> | 声明局部标识符 `requestedAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2040 | <code>                ? raw.adapter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2041 | <code>                : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2042 | <code>            const authProfileId = normalizeString(</code> | 声明局部标识符 `authProfileId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2043 | <code>                raw.authProfileId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2044 | <code>                    raw.auth_profile_id &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2045 | <code>                    args.authProfileId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2046 | <code>                    args.profileId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2047 | <code>                    requestedAdapter.authProfileId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2048 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2049 | <code>            const openApiAdapterEnabled = sourceType === 'openapi_operation' &amp;&amp; (</code> | 声明局部标识符 `openApiAdapterEnabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2050 | <code>                args.enableOpenApiAdapter === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2051 | <code>                args.enableExternalAdapters === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2052 | <code>                requestedAdapter.id === 'openapi_http' &#124;&#124;</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2053 | <code>                requestedAdapter.type === 'openapi_http'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2054 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2055 | <code>            const composioAdapterEnabled = sourceType === 'composio_tool' &amp;&amp; (</code> | 声明局部标识符 `composioAdapterEnabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2056 | <code>                args.enableComposioAdapter === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2057 | <code>                args.enableExternalAdapters === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2058 | <code>                requestedAdapter.id === 'composio_rest_v3' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2059 | <code>                requestedAdapter.type === 'composio_rest_v3'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2060 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2061 | <code>            const inferredLocalAdapter = inferLocalDocumentAdapter(raw, requestedAdapter);</code> | 声明局部标识符 `inferredLocalAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2062 | <code>            const localAdapterEnabled = ['pydantic_tool', 'langchain_tool'].includes(sourceType) &amp;&amp;</code> | 声明局部标识符 `localAdapterEnabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2063 | <code>                inferredLocalAdapter &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2064 | <code>                (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2065 | <code>                    args.enableLocalAdapters === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2066 | <code>                    args.enableLocalDocumentAdapters === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2067 | <code>                    args.enableExternalAdapters === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2068 | <code>                    requestedAdapter.id &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2069 | <code>                    requestedAdapter.type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2070 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2071 | <code>            const openApiMeta = sourceType === 'openapi_operation'</code> | 声明局部标识符 `openApiMeta`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2072 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2073 | <code>                    method: normalizeString(raw.method, 'GET').toUpperCase(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2074 | <code>                    path: normalizeString(raw.path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2075 | <code>                    baseUrl: pickServerUrl(raw, args),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2076 | <code>                    parameterLocations: normalizeOpenApiParameterLocations(raw.parameters)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2077 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2078 | <code>                : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2079 | <code>            const composioMeta = sourceType === 'composio_tool'</code> | 声明局部标识符 `composioMeta`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2080 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2081 | <code>                    toolSlug: inferComposioToolSlug(raw),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2082 | <code>                    baseUrl: normalizeString(raw.baseUrl &#124;&#124; raw.baseURL &#124;&#124; args.composioBaseUrl &#124;&#124; args.baseUrl, DEFAULT_COMPOSIO_API_BASE_URL),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2083 | <code>                    userId: normalizeString(raw.userId &#124;&#124; raw.user_id &#124;&#124; args.userId &#124;&#124; args.user_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2084 | <code>                    connectedAccountId: normalizeString(raw.connectedAccountId &#124;&#124; raw.connected_account_id &#124;&#124; args.connectedAccountId &#124;&#124; args.connected_account_id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2085 | <code>                    entityId: normalizeString(raw.entityId &#124;&#124; raw.entity_id &#124;&#124; args.entityId &#124;&#124; args.entity_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2086 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2087 | <code>                : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2088 | <code>            const adapter = openApiAdapterEnabled</code> | 声明局部标识符 `adapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2089 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2090 | <code>                    id: 'openapi_http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2091 | <code>                    type: 'openapi_http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2092 | <code>                    authProfileId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2093 | <code>                    supportsMutationsWithApproval: true</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2094 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2095 | <code>                : composioAdapterEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2096 | <code>                    ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2097 | <code>                        id: 'composio_rest_v3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2098 | <code>                        type: 'composio_rest_v3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2099 | <code>                        authProfileId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2100 | <code>                        supportsMutationsWithApproval: true</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2101 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2102 | <code>                    : requestedAdapter.id &#124;&#124; requestedAdapter.type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2103 | <code>                        ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2104 | <code>                            ...requestedAdapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2105 | <code>                            authProfileId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2106 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2107 | <code>                        : localAdapterEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2108 | <code>                            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2109 | <code>                                ...inferredLocalAdapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2110 | <code>                                authProfileId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2111 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2112 | <code>                        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2113 | <code>            const callable = args.trustCallable === true &amp;&amp; (</code> | 声明局部标识符 `callable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2114 | <code>                raw.callable === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2115 | <code>                openApiAdapterEnabled &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2116 | <code>                composioAdapterEnabled &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2117 | <code>                localAdapterEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2118 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2119 | <code>            const compiled = compileAndLintAilisContract(raw, {</code> | 声明局部标识符 `compiled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2120 | <code>                sourceType: sourceType &#124;&#124; raw.sourceType &#124;&#124; raw.source_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2121 | <code>                server: args.server &#124;&#124; args.serverName &#124;&#124; args.mcpServerName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2122 | <code>                sourceName: args.sourceName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2123 | <code>                sourceUrl: args.sourceUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2124 | <code>                minScore: args.minScore &#124;&#124; 60,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2125 | <code>                id: raw.toolId &#124;&#124; raw.id &#124;&#124; raw.name &#124;&#124; raw.operationId &#124;&#124; `${sourceType &#124;&#124; 'external'}_${index + 1}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2126 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2127 | <code>            return this.makeExternalExposureEntry({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2128 | <code>                contract: compiled.contract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2129 | <code>                lint: compiled.lint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2130 | <code>                promptCard: compiled.promptCard,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2131 | <code>                source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2132 | <code>                    type: sourceType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2133 | <code>                    name: normalizeString(args.sourceName &#124;&#124; raw.sourceName &#124;&#124; raw.source &#124;&#124; sourceType),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2134 | <code>                    url: normalizeString(args.sourceUrl &#124;&#124; raw.sourceUrl &#124;&#124; raw.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2135 | <code>                    authProfileId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2136 | <code>                    ...openApiMeta,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2137 | <code>                    ...composioMeta</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2138 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2139 | <code>                callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2140 | <code>                toolId: raw.toolId &#124;&#124; raw.id &#124;&#124; raw.name &#124;&#124; raw.operationId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2141 | <code>                verification: callable ? (adapter?.id ? 'adapter_configured' : 'declared_callable') : 'adapter_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2142 | <code>                exposureKind: `${sourceType}_external_contract_tool`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2143 | <code>                adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2144 | <code>                authProfileId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2145 | <code>                notes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2146 | <code>                    callable</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2147 | <code>                        ? `External ${adapter?.id &#124;&#124; 'declared'} adapter is configured; execution still checks auth and approval at call time.`</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2148 | <code>                        : 'Adapter/auth/executor required before runtime can call this tool.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2149 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2150 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2151 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2152 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2154 | <code>    builtinPublicExternalExposures() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2155 | <code>        return this.compileRawExternalToolsForExposure(BUILTIN_PUBLIC_OPENAPI_OPERATIONS.map((entry) =&gt; ({ ...entry })), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2156 | <code>            sourceType: 'openapi_operation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2157 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2158 | <code>            enableOpenApiAdapter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2159 | <code>            minScore: 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2160 | <code>        }).map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2161 | <code>            ...entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2162 | <code>            type: 'builtin_public_openapi_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2163 | <code>            verified: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2164 | <code>            verification: 'builtin_public_readonly',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2165 | <code>            notes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2166 | <code>                ...normalizeArray(entry.notes),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2167 | <code>                'Built-in public read-only OpenAPI adapter; no auth required.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2168 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2169 | <code>            virtualToolId: createExternalVirtualToolId(entry)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2170 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2171 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2173 | <code>    standardPackPublicExternalExposures(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2174 | <code>        const operations = publicReadonlyOpenApiOperationsFromStandardPacks({</code> | 声明局部标识符 `operations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2175 | <code>            packIds: args.standardToolPacks &#124;&#124; args.packIds &#124;&#124; args.packs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2176 | <code>            query: args.query &#124;&#124; args.taskText &#124;&#124; args.task</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2177 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2178 | <code>        return this.compileRawExternalToolsForExposure(operations.map((entry) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2179 | <code>            ...entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2180 | <code>            callable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2181 | <code>        })), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2182 | <code>            sourceType: 'openapi_operation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2183 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2184 | <code>            enableOpenApiAdapter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2185 | <code>            minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2186 | <code>        }).map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2187 | <code>            ...entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2188 | <code>            type: 'standard_pack_public_openapi_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2189 | <code>            verified: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2190 | <code>            verification: 'standard_pack_public_readonly',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2191 | <code>            notes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2192 | <code>                ...normalizeArray(entry.notes),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2193 | <code>                'AILIS Standard Tool Pack public read-only OpenAPI adapter; no auth required.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2194 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2195 | <code>            virtualToolId: createExternalVirtualToolId(entry)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2196 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2197 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2199 | <code>    findExternalExposure(state = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2200 | <code>        const requested = normalizeString(</code> | 声明局部标识符 `requested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2201 | <code>            args.exposureId &#124;&#124; args.exposure_id &#124;&#124; args.externalToolId &#124;&#124; args.external_tool_id &#124;&#124; args.toolId &#124;&#124; args.tool &#124;&#124; args.id &#124;&#124; args.name</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2202 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2203 | <code>        if (!requested) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2204 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2205 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2206 | <code>        const lowered = requested.toLowerCase();</code> | 声明局部标识符 `lowered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2207 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2208 | <code>            ...(state.exposures &#124;&#124; []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2209 | <code>            ...this.builtinPublicExternalExposures(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2210 | <code>            ...this.standardPackPublicExternalExposures(args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2211 | <code>        ].find((entry) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2212 | <code>            const values = [</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2213 | <code>                entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2214 | <code>                entry.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2215 | <code>                entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2216 | <code>                entry.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2217 | <code>                entry.virtualToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2218 | <code>                createExternalVirtualToolId(entry),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2219 | <code>                entry.contract?.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2220 | <code>                entry.contract?.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2221 | <code>                entry.modelFacing?.name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2222 | <code>            ].map((value) =&gt; normalizeString(value).toLowerCase()).filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2223 | <code>            return values.includes(lowered);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2224 | <code>        }) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2225 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2227 | <code>    makeExternalExposureSearchEntry(exposure = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2228 | <code>        const modelFacing = exposure.modelFacing &#124;&#124; {};</code> | 声明局部标识符 `modelFacing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2229 | <code>        const contract = exposure.contract &#124;&#124; {};</code> | 声明局部标识符 `contract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2230 | <code>        const parameters = modelFacing.parameters &#124;&#124; contract.inputSchema &#124;&#124; {};</code> | 声明局部标识符 `parameters`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2231 | <code>        const virtualToolId = exposure.virtualToolId &#124;&#124; (exposure.callable ? createExternalVirtualToolId(exposure) : '');</code> | 声明局部标识符 `virtualToolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2232 | <code>        const description = normalizeString(</code> | 声明局部标识符 `description`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2233 | <code>            modelFacing.description &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2234 | <code>                contract.purpose &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2235 | <code>                contract.description &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2236 | <code>                exposure.title &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2237 | <code>                exposure.name &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2238 | <code>                exposure.toolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2239 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2240 | <code>        const whenToUse = normalizeArray(contract.whenToUse).map((entry) =&gt; normalizeString(entry)).filter(Boolean).slice(0, 2);</code> | 声明局部标识符 `whenToUse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2241 | <code>        const whenNotToUse = normalizeArray(contract.whenNotToUse).map((entry) =&gt; normalizeString(entry)).filter(Boolean).slice(0, 3);</code> | 声明局部标识符 `whenNotToUse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2242 | <code>        const usageBoundary = [</code> | 声明局部标识符 `usageBoundary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2243 | <code>            whenToUse.length ? `When to use: ${whenToUse.join(' ')}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2244 | <code>            whenNotToUse.length ? `Avoid: ${whenNotToUse.join(' ')}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2245 | <code>        ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2246 | <code>        const callable = exposure.callable === true;</code> | 声明局部标识符 `callable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2247 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2248 | <code>            id: callable ? virtualToolId : exposure.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2249 | <code>            type: callable ? 'external_direct_tool' : 'external_exposure_candidate',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2250 | <code>            exposure: exposure.exposure &#124;&#124; 'direct_external',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2251 | <code>            exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2252 | <code>            toolId: exposure.toolId &#124;&#124; contract.id &#124;&#124; modelFacing.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2253 | <code>            virtualToolId: callable ? virtualToolId : '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2254 | <code>            callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2255 | <code>            verified: exposure.verified === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2256 | <code>            verification: exposure.verification &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2257 | <code>            adapter: exposure.adapter &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2258 | <code>            source: exposure.source &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2259 | <code>            score: exposure.score ?? null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2260 | <code>            risk: exposure.risk &#124;&#124; contract.risk &#124;&#124; '',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2261 | <code>            spec: callable</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2262 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2263 | <code>                    type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2264 | <code>                    name: virtualToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2265 | <code>                    description: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2266 | <code>                        description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2267 | <code>                        usageBoundary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2268 | <code>                        'Use this direct external tool after tool_search surfaces it. The Gateway routes it to the verified external adapter; do not wrap it in capability_manager.execute_exposed_external_tool.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2269 | <code>                    ].filter(Boolean).join('\n\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2270 | <code>                    strict: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2271 | <code>                    parameters,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2272 | <code>                    output_schema: modelFacing.output_schema &#124;&#124; contract.outputSchema &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2273 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2274 | <code>                : modelFacing,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2275 | <code>            call_pattern: callable</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2276 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2277 | <code>                    tool: virtualToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2278 | <code>                    args: sampleArgsFromSchema(parameters)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2279 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2280 | <code>                : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2281 | <code>                    tool: 'capability_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2282 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2283 | <code>                        action: 'bulk_expose_external_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2284 | <code>                        reason: 'This candidate is visible but not callable yet; install, configure adapter/auth, and smoke test before exposing it.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2285 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2286 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2287 | <code>            notes: exposure.notes &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2288 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2289 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2291 | <code>    makeContractIntakeSearchEntry(entry = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2292 | <code>        const contract = entry.contract &#124;&#124; {};</code> | 声明局部标识符 `contract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2293 | <code>        const source = contract.source &#124;&#124; entry.source &#124;&#124; {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2294 | <code>        const description = normalizeString(contract.purpose &#124;&#124; contract.description &#124;&#124; entry.promptCard &#124;&#124; contract.name &#124;&#124; contract.id);</code> | 声明局部标识符 `description`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2295 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2296 | <code>            id: `contract:${contract.id &#124;&#124; contract.name &#124;&#124; 'external'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2297 | <code>            type: 'external_contract_intake',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2298 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2299 | <code>            verified: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2300 | <code>            verification: entry.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2301 | <code>            toolId: contract.id &#124;&#124; contract.name &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2302 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2303 | <code>            score: entry.score ?? entry.lint?.score ?? null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2304 | <code>            risk: contract.risk &#124;&#124; '',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2305 | <code>            spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2306 | <code>                type: 'external_contract',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2307 | <code>                name: contract.id &#124;&#124; contract.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2308 | <code>                description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2309 | <code>                parameters: contract.inputSchema &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2310 | <code>                output_schema: contract.outputSchema &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2311 | <code>                prompt_card: entry.promptCard &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2312 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2313 | <code>            call_pattern: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2314 | <code>                tool: 'capability_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2315 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2316 | <code>                    action: 'bulk_expose_external_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2317 | <code>                    reason: 'Compile/expose this accepted contract with a verified adapter before direct execution.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2318 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2319 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2320 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2321 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2323 | <code>    async searchExternalToolEntries(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2324 | <code>        const query = normalizeString(args.query &#124;&#124; args.q &#124;&#124; args.taskText &#124;&#124; args.task).toLowerCase();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2325 | <code>        const limit = Math.max(1, Math.min(Number(args.limit &#124;&#124; 12), 100));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2326 | <code>        const includeExposed = args.includeExposed !== false;</code> | 声明局部标识符 `includeExposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2327 | <code>        const includeContracts = args.includeContracts !== false;</code> | 声明局部标识符 `includeContracts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2328 | <code>        const entries = [];</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2330 | <code>        if (includeExposed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2331 | <code>            const state = await this.loadExternalExposure();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2332 | <code>            for (const exposure of [</code> | 声明局部标识符 `exposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2333 | <code>                ...(state.exposures &#124;&#124; []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2334 | <code>                ...(args.includeBuiltinPublic !== false ? this.builtinPublicExternalExposures() : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2335 | <code>                ...(args.includeStandardPublic !== false ? this.standardPackPublicExternalExposures(args) : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2336 | <code>            ]) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2337 | <code>                entries.push(this.makeExternalExposureSearchEntry(exposure));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2338 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2339 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2341 | <code>        if (includeContracts) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2342 | <code>            const intake = await this.loadContractIntake();</code> | 声明局部标识符 `intake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2343 | <code>            const exposedContractIds = new Set(entries.map((entry) =&gt; normalizeString(entry.toolId).toLowerCase()).filter(Boolean));</code> | 声明局部标识符 `exposedContractIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2344 | <code>            for (const contractEntry of intake.contracts &#124;&#124; []) {</code> | 声明局部标识符 `contractEntry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2345 | <code>                const id = normalizeString(contractEntry.contract?.id &#124;&#124; contractEntry.contract?.name).toLowerCase();</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2346 | <code>                if (id &amp;&amp; exposedContractIds.has(id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2347 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2348 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2349 | <code>                entries.push(this.makeContractIntakeSearchEntry(contractEntry));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2350 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2351 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2353 | <code>        const uniqueEntries = [...new Map(entries.map((entry, index) =&gt; {</code> | 声明局部标识符 `uniqueEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2354 | <code>            const key = normalizeString(</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2355 | <code>                entry.virtualToolId &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2356 | <code>                    (entry.callable === true ? entry.call_pattern?.tool : '') &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2357 | <code>                    entry.toolId &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2358 | <code>                    entry.exposureId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2359 | <code>                    entry.id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2360 | <code>            ).toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2361 | <code>            return [key &#124;&#124; `${entry.type &#124;&#124; 'entry'}:${index}`, entry];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2362 | <code>        })).values()];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2364 | <code>        const scored = uniqueEntries.map((entry) =&gt; {</code> | 声明局部标识符 `scored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2365 | <code>            const searchText = JSON.stringify({</code> | 声明局部标识符 `searchText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2366 | <code>                id: entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2367 | <code>                toolId: entry.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2368 | <code>                virtualToolId: entry.virtualToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2369 | <code>                type: entry.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2370 | <code>                source: entry.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2371 | <code>                spec: entry.spec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2372 | <code>                notes: entry.notes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2373 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2374 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2375 | <code>                entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2376 | <code>                score: query ? scoreText(query, searchText) : 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2377 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2378 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2380 | <code>        const tools = scored</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2381 | <code>            .filter(({ score }) =&gt; score &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2382 | <code>            .sort((left, right) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2383 | <code>                right.score - left.score &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2384 | <code>                (right.entry.callable === true ? 1 : 0) - (left.entry.callable === true ? 1 : 0) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2385 | <code>                String(left.entry.id).localeCompare(String(right.entry.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2386 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2387 | <code>            .slice(0, limit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2388 | <code>            .map(({ entry, score }) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2389 | <code>                ...entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2390 | <code>                search_score: score</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2391 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2393 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2394 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2395 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2396 | <code>            total: uniqueEntries.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2397 | <code>            returned: tools.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2398 | <code>            tools</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2399 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2400 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2402 | <code>    buildExternalExposureNotCallableResult(exposure = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2403 | <code>        const status = exposure.verification === 'install_required'</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2404 | <code>            ? 'install_required'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2405 | <code>            : exposure.verification === 'adapter_required'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2406 | <code>                ? 'adapter_required'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2407 | <code>                : 'not_callable';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2408 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2409 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2410 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2411 | <code>            exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2412 | <code>            toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2413 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2414 | <code>            verification: exposure.verification,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2415 | <code>            source: exposure.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2416 | <code>            message: 'This external tool is visible to the Agent as a contract/candidate, but it is not a verified callable runtime tool yet.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2417 | <code>            nextActions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2418 | <code>                'Use capability_manager.plan_mcp_candidate/install_capability/smoke_mcp_candidate for MCP Registry candidates.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2419 | <code>                'Implement or configure the adapter/auth/executor, then re-expose with callable=true after smoke tests.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2420 | <code>                'Use built-in core tools if they can complete the task without this external integration.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2421 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2422 | <code>            contractSummary: buildContractPromptCard(exposure.contract &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2423 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2424 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2426 | <code>    buildOpenApiUrlForExposure(exposure = {}, params = {}, extraQuery = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2427 | <code>        const source = exposure.source &#124;&#124; {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2428 | <code>        const baseUrl = normalizeString(source.baseUrl &#124;&#124; source.url);</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2429 | <code>        const pathTemplate = normalizeString(source.path);</code> | 声明局部标识符 `pathTemplate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2430 | <code>        if (!baseUrl &#124;&#124; !pathTemplate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2431 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2432 | <code>                error: 'openapi_callable_missing_base_url_or_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2433 | <code>                message: 'Callable OpenAPI exposure requires source.baseUrl and source.path.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2434 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2435 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2436 | <code>        const used = new Set();</code> | 声明局部标识符 `used`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2437 | <code>        const pathValue = pathTemplate.replace(/\{([^}]+)\}/g, (_match, key) =&gt; {</code> | 声明局部标识符 `pathValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2438 | <code>            const name = normalizeString(key);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2439 | <code>            used.add(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2440 | <code>            return encodeURIComponent(String(params[name] ?? ''));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2441 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2442 | <code>        const url = new URL(pathValue, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2443 | <code>        const locations = source.parameterLocations &amp;&amp; typeof source.parameterLocations === 'object'</code> | 声明局部标识符 `locations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2444 | <code>            ? source.parameterLocations</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2445 | <code>            : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2446 | <code>        for (const [key, value] of Object.entries({ ...(params &#124;&#124; {}), ...(extraQuery &#124;&#124; {}) })) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 2447 | <code>            if (used.has(key) &#124;&#124; value === undefined &#124;&#124; value === null &#124;&#124; key === 'headers' &#124;&#124; key === 'body') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2448 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2449 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2450 | <code>            const location = normalizeString(locations[key], 'query');</code> | 声明局部标识符 `location`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2451 | <code>            if (location !== 'query') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2452 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2453 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2454 | <code>            if (Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2455 | <code>                for (const item of value) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2456 | <code>                    url.searchParams.append(key, String(item));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2457 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2458 | <code>            } else if (typeof value !== 'object') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2459 | <code>                url.searchParams.set(key, String(value));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2460 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2461 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2462 | <code>        return { url: url.toString() };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2463 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2465 | <code>    async checkLocalAdapterReadiness(adapter = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2466 | <code>        if (this.localAdapterRunner?.check) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2467 | <code>            return await this.localAdapterRunner.check(adapter, args);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2468 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2469 | <code>        if (normalizeString(adapter.type) !== 'local_document_converter') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2470 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2471 | <code>                status: 'adapter_unsupported',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2472 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2473 | <code>                adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2474 | <code>                message: 'Only local_document_converter adapters are supported by the local adapter runner.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2475 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2476 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2477 | <code>        const importNames = normalizeArray(adapter.importNames &#124;&#124; adapter.requiredImports &#124;&#124; adapter.importName &#124;&#124; adapter.packageName)</code> | 声明局部标识符 `importNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2478 | <code>            .map((entry) =&gt; normalizeString(entry))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2479 | <code>            .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2480 | <code>        if (!importNames.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2481 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2482 | <code>                status: 'adapter_invalid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2483 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2484 | <code>                adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2485 | <code>                message: 'Local document adapter is missing importName/packageName.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2486 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2487 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2488 | <code>        const command = localAdapterCommand(adapter);</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2489 | <code>        const missingImports = [];</code> | 声明局部标识符 `missingImports`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2490 | <code>        for (const importName of importNames) {</code> | 声明局部标识符 `importName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2491 | <code>            const result = await runProcessCapture(command, ['-c', pythonImportProbeSource(), importName], {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2492 | <code>                timeoutMs: args.timeoutMs &#124;&#124; 15000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2493 | <code>                cwd: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2494 | <code>                maxOutputBytes: 256000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2495 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2496 | <code>            if (result.status === 'spawn_error') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2497 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2498 | <code>                    status: 'missing_runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2499 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2500 | <code>                    adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2501 | <code>                    command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2502 | <code>                    message: `Python runtime is unavailable for local adapter: ${result.error}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2503 | <code>                    nextActions: ['Set AILIS_PYTHON to a Python executable with the required package installed.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2504 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2505 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2506 | <code>            if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2507 | <code>                missingImports.push(importName);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2508 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2509 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2510 | <code>        if (!missingImports.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2511 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2512 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2513 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2514 | <code>                adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2515 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2516 | <code>                packageName: normalizeString(adapter.packageName &#124;&#124; importNames.join(',')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2517 | <code>                importName: importNames[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2518 | <code>                importNames</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2519 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2520 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2521 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2522 | <code>            status: 'missing_dependency',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2523 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2524 | <code>            adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2525 | <code>            command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2526 | <code>            packageName: normalizeString(adapter.packageName &#124;&#124; missingImports.join(',')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2527 | <code>            importName: missingImports[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2528 | <code>            importNames,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2529 | <code>            missingImports,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2530 | <code>            message: `Python package is not importable: ${missingImports.join(', ')}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2531 | <code>            nextActions: [`Install ${adapter.packageName &#124;&#124; missingImports.join(', ')} in the AILIS Python environment.`, 'Use the alternate document converter if available.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2532 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2533 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2535 | <code>    async writeLocalAdapterArtifact(exposure = {}, payload = {}, text = '') {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2536 | <code>        const artifactDir = path.join(this.stateDir, 'local-adapter-artifacts');</code> | 声明局部标识符 `artifactDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2537 | <code>        await fsp.mkdir(artifactDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2538 | <code>        const stamp = new Date().toISOString().replace(/[:.]/g, '-');</code> | 声明局部标识符 `stamp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2539 | <code>        const safeTool = safeSegment(exposure.toolId &#124;&#124; exposure.id &#124;&#124; 'local_adapter');</code> | 声明局部标识符 `safeTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2540 | <code>        const extension = normalizeString(payload.format).toLowerCase() === 'json' ? 'json' : 'md';</code> | 声明局部标识符 `extension`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2541 | <code>        const artifactPath = path.join(artifactDir, `${safeTool}-${stamp}.${extension}`);</code> | 声明局部标识符 `artifactPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2542 | <code>        const body = extension === 'json' &amp;&amp; payload.document</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2543 | <code>            ? JSON.stringify(payload.document, null, 2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2544 | <code>            : String(text &#124;&#124; payload.text &#124;&#124; '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2545 | <code>        await fsp.writeFile(artifactPath, body, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2546 | <code>        return artifactPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2547 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2549 | <code>    parseLocalAdapterPayload(result = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2550 | <code>        const raw = normalizeString(result.stdout);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2551 | <code>        if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2552 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2553 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2554 | <code>                error: normalizeString(result.stderr, 'Local adapter returned no stdout.')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2555 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2556 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2557 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2558 | <code>            return JSON.parse(raw);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2559 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2560 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2561 | <code>                ok: result.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2562 | <code>                text: raw,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2563 | <code>                stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2564 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2565 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2566 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2568 | <code>    async executeLocalAdapterExposure(exposure = {}, params = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2569 | <code>        const adapter = exposure.adapter &#124;&#124; {};</code> | 声明局部标识符 `adapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2570 | <code>        if (normalizeString(adapter.type) !== 'local_document_converter') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2571 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2572 | <code>                status: 'adapter_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2573 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2574 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2575 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2576 | <code>                message: 'This local contract needs a local_document_converter adapter before execution.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2577 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2578 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2579 | <code>        const filePath = path.resolve(normalizeString(params.path &#124;&#124; params.file &#124;&#124; params.filePath));</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2580 | <code>        if (!filePath &#124;&#124; !normalizeString(params.path &#124;&#124; params.file &#124;&#124; params.filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2581 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2582 | <code>                status: 'invalid_args',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2583 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2584 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2585 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2586 | <code>                message: 'Local document adapter requires args.path pointing to an existing local file.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2587 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2588 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2589 | <code>        const stat = await fsp.stat(filePath).catch(() =&gt; null);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2590 | <code>        if (!stat?.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2591 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2592 | <code>                status: 'file_not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2593 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2594 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2595 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2596 | <code>                path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2597 | <code>                message: 'Local document path does not exist or is not a file.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2598 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2599 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2600 | <code>        const readiness = await this.checkLocalAdapterReadiness(adapter, args);</code> | 声明局部标识符 `readiness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2601 | <code>        if (!readiness.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2602 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2603 | <code>                ...readiness,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2604 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2605 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2606 | <code>                path: filePath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2607 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2608 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2609 | <code>        if (this.localAdapterRunner?.execute) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2610 | <code>            return await this.localAdapterRunner.execute(exposure, params, args);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2611 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2612 | <code>        const outputFormat = normalizeString(params.output_format &#124;&#124; params.format &#124;&#124; adapter.outputFormat, 'markdown');</code> | 声明局部标识符 `outputFormat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2613 | <code>        const command = localAdapterCommand(adapter);</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2614 | <code>        const adapterId = normalizeString(adapter.id);</code> | 声明局部标识符 `adapterId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2615 | <code>        const source = adapterId === 'local_docling_converter'</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2616 | <code>            ? doclingConvertSource()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2617 | <code>            : adapterId === 'local_python_document_extractor'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2618 | <code>                ? pythonDocumentExtractSource()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2619 | <code>                : markitdownConvertSource();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2620 | <code>        const childArgs = adapterId === 'local_docling_converter'</code> | 声明局部标识符 `childArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2621 | <code>            ? ['-c', source, filePath, outputFormat]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2622 | <code>            : ['-c', source, filePath];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2623 | <code>        const result = await runProcessCapture(command, childArgs, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2624 | <code>            timeoutMs: args.timeoutMs &#124;&#124; params.timeoutMs &#124;&#124; 120000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2625 | <code>            cwd: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2626 | <code>            maxOutputBytes: LOCAL_ADAPTER_OUTPUT_LIMIT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2627 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2628 | <code>        const payload = this.parseLocalAdapterPayload(result);</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2629 | <code>        if (!result.ok &#124;&#124; payload.ok === false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2630 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2631 | <code>                status: result.status === 'output_limit_exceeded' ? 'output_limit_exceeded' : 'adapter_execution_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2632 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2633 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2634 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2635 | <code>                path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2636 | <code>                adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2637 | <code>                command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2638 | <code>                exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2639 | <code>                error: payload.error &#124;&#124; normalizeString(result.stderr, 'Local adapter execution failed.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2640 | <code>                stderr: normalizeString(result.stderr).slice(0, 4000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2641 | <code>                nextActions: ['Try the alternate document converter.', 'If output is too large, request a page range or table-only extraction.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2642 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2643 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2644 | <code>        const text = normalizeString(payload.text);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2645 | <code>        const maxChars = Math.max(1000, Math.min(Number(params.max_chars &#124;&#124; params.maxChars &#124;&#124; 50000), 500000));</code> | 声明局部标识符 `maxChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2646 | <code>        const artifactPath = args.writeArtifact === false ? '' : await this.writeLocalAdapterArtifact(exposure, payload, text);</code> | 声明局部标识符 `artifactPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2647 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2648 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2649 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2650 | <code>            exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2651 | <code>            toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2652 | <code>            path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2653 | <code>            adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2654 | <code>            format: payload.format &#124;&#124; outputFormat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2655 | <code>            text: text.slice(0, maxChars),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2656 | <code>            truncated: text.length &gt; maxChars,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2657 | <code>            fullTextPath: artifactPath,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2658 | <code>            tables: normalizeArray(payload.tables),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2659 | <code>            metadata: payload.metadata &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2660 | <code>            document: payload.document &amp;&amp; outputFormat === 'json' ? payload.document : undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2661 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2662 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2664 | <code>    async executeOpenApiExposure(exposure = {}, params = {}, args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2665 | <code>        const method = normalizeString(exposure.source?.method, 'GET').toUpperCase();</code> | 声明局部标识符 `method`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2666 | <code>        const hasOpenApiAdapter = exposure.adapter?.id === 'openapi_http' &#124;&#124; exposure.adapter?.type === 'openapi_http';</code> | 声明局部标识符 `hasOpenApiAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2667 | <code>        if (!SAFE_HTTP_METHODS.has(method) &amp;&amp; !hasOpenApiAdapter) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2668 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2669 | <code>                status: 'blocked_unsafe_openapi_method',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2670 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2671 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2672 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2673 | <code>                method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2674 | <code>                message: 'Only GET/HEAD/OPTIONS OpenAPI operations can be executed by the generic external executor. Mutating operations need a dedicated adapter and approval flow.'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2675 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2676 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2677 | <code>        const approval = this.needsExternalExecutionApproval(exposure, { method, sourceType: 'openapi_operation' }, args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2678 | <code>        if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2679 | <code>            return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2680 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2681 | <code>        const auth = await this.resolveAuthProfileForExecution(exposure, args);</code> | 声明局部标识符 `auth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2682 | <code>        if (auth.status !== 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2683 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2684 | <code>                status: auth.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2685 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2686 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2687 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2688 | <code>                message: auth.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2689 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2690 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2691 | <code>        const authMaterial = this.buildAuthMaterial(auth.profile);</code> | 声明局部标识符 `authMaterial`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2692 | <code>        if (authMaterial.status !== 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2693 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2694 | <code>                ...authMaterial,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2695 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2696 | <code>                toolId: exposure.toolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2697 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2698 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2699 | <code>        const effectiveExposure = auth.profile?.baseUrl</code> | 声明局部标识符 `effectiveExposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2700 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2701 | <code>                ...exposure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2702 | <code>                source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2703 | <code>                    ...(exposure.source &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2704 | <code>                    baseUrl: auth.profile.baseUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2705 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2706 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2707 | <code>            : exposure;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2708 | <code>        const built = this.buildOpenApiUrlForExposure(effectiveExposure, params, authMaterial.query);</code> | 声明局部标识符 `built`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2709 | <code>        if (built.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2710 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2711 | <code>                status: built.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2712 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2713 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2714 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2715 | <code>                message: built.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2716 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2717 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2718 | <code>        const timeoutMs = Math.max(1000, Math.min(Number(args.timeoutMs &#124;&#124; params.timeoutMs &#124;&#124; 15000), 60000));</code> | 声明局部标识符 `timeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2719 | <code>        const controller = new AbortController();</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2720 | <code>        const timer = setTimeout(() =&gt; controller.abort(), timeoutMs);</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2721 | <code>        const headers = {</code> | 声明局部标识符 `headers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2722 | <code>            accept: 'application/json, text/plain;q=0.9, */*;q=0.5',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2723 | <code>            ...(auth.profile?.defaultHeaders &amp;&amp; typeof auth.profile.defaultHeaders === 'object' ? auth.profile.defaultHeaders : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2724 | <code>            ...authMaterial.headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2725 | <code>            ...(params.headers &amp;&amp; typeof params.headers === 'object' &amp;&amp; !Array.isArray(params.headers) ? params.headers : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2726 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2727 | <code>        const fetchOptions = {</code> | 声明局部标识符 `fetchOptions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2728 | <code>            method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2729 | <code>            headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2730 | <code>            signal: controller.signal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2731 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2732 | <code>        if (!SAFE_HTTP_METHODS.has(method)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2733 | <code>            headers['content-type'] = headers['content-type'] &#124;&#124; headers['Content-Type'] &#124;&#124; 'application/json';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2734 | <code>            const requestBody = params.body !== undefined</code> | 声明局部标识符 `requestBody`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2735 | <code>                ? params.body</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2736 | <code>                : params.json !== undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2737 | <code>                    ? params.json</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2738 | <code>                    : Object.fromEntries(Object.entries(params &#124;&#124; {}).filter(([key]) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2739 | <code>                        !['headers', 'timeoutMs'].includes(key) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2740 | <code>                        !Object.prototype.hasOwnProperty.call(effectiveExposure.source?.parameterLocations &#124;&#124; {}, key) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2741 | <code>                        !String(effectiveExposure.source?.path &#124;&#124; '').includes(`{${key}}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2742 | <code>                    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2743 | <code>            fetchOptions.body = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2744 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2745 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2746 | <code>            const response = await fetch(built.url, fetchOptions);</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2747 | <code>            const contentType = response.headers.get('content-type') &#124;&#124; '';</code> | 声明局部标识符 `contentType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2748 | <code>            const responseHeaders = extractResponseHeaders(response.headers);</code> | 声明局部标识符 `responseHeaders`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2749 | <code>            const failure = response.ok ? null : classifyHttpFailure(response.status, exposure, responseHeaders);</code> | 声明局部标识符 `failure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2750 | <code>            const text = await response.text();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2751 | <code>            let body = text;</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2752 | <code>            if (/json/i.test(contentType)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2753 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2754 | <code>                    body = JSON.parse(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2755 | <code>                } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2756 | <code>                    body = text;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2757 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2758 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2759 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2760 | <code>                status: response.ok ? 'completed' : 'http_error',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2761 | <code>                ok: response.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2762 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2763 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2764 | <code>                method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2765 | <code>                url: redactUrlSecret(built.url),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2766 | <code>                request: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2767 | <code>                    headers: redactHeaders(headers),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2768 | <code>                    authProfileId: auth.profile?.id &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2769 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2770 | <code>                http: {</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2771 | <code>                    status: response.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2772 | <code>                    statusText: response.statusText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2773 | <code>                    contentType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2774 | <code>                    headers: responseHeaders</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2775 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2776 | <code>                failure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2777 | <code>                failureReason: failure?.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2778 | <code>                message: failure?.message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2779 | <code>                nextActions: failure?.nextActions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2780 | <code>                body</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2781 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2782 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2783 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2784 | <code>                status: error?.name === 'AbortError' ? 'timeout' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2785 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2786 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2787 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2788 | <code>                method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2789 | <code>                url: redactUrlSecret(built.url),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2790 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2791 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2792 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2793 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2794 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2795 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2796 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2797 | <code>    buildComposioExecuteBody(exposure = {}, params = {}, profile = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2798 | <code>        const source = exposure.source &#124;&#124; {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2799 | <code>        const argumentsValue = params.arguments &amp;&amp; typeof params.arguments === 'object' &amp;&amp; !Array.isArray(params.arguments)</code> | 声明局部标识符 `argumentsValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2800 | <code>            ? params.arguments</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2801 | <code>            : params.args &amp;&amp; typeof params.args === 'object' &amp;&amp; !Array.isArray(params.args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2802 | <code>                ? params.args</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2803 | <code>                : Object.fromEntries(Object.entries(params &#124;&#124; {}).filter(([key]) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2804 | <code>                    !['headers', 'timeoutMs', 'user_id', 'userId', 'connected_account_id', 'connectedAccountId', 'entity_id', 'entityId'].includes(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2805 | <code>                ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2806 | <code>        const userId = firstString(params.user_id, params.userId, args.user_id, args.userId, source.userId, profile.userId);</code> | 声明局部标识符 `userId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2807 | <code>        const connectedAccountId = firstString(</code> | 声明局部标识符 `connectedAccountId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2808 | <code>            params.connected_account_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2809 | <code>            params.connectedAccountId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2810 | <code>            args.connected_account_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2811 | <code>            args.connectedAccountId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2812 | <code>            source.connectedAccountId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2813 | <code>            profile.connectedAccountId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2814 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2815 | <code>        const entityId = firstString(params.entity_id, params.entityId, args.entity_id, args.entityId, source.entityId, profile.entityId);</code> | 声明局部标识符 `entityId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2816 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2817 | <code>            arguments: argumentsValue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2818 | <code>            ...(userId ? { user_id: userId } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2819 | <code>            ...(connectedAccountId ? { connected_account_id: connectedAccountId } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2820 | <code>            ...(entityId ? { entity_id: entityId } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2821 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2822 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2823 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2824 | <code>    async executeComposioExposure(exposure = {}, params = {}, args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2825 | <code>        const approval = this.needsExternalExecutionApproval(exposure, { method: 'POST', sourceType: 'composio_tool' }, args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2826 | <code>        if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2827 | <code>            return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2828 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2829 | <code>        const hasAdapter = exposure.adapter?.id === 'composio_rest_v3' &#124;&#124; exposure.adapter?.type === 'composio_rest_v3';</code> | 声明局部标识符 `hasAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2830 | <code>        if (!hasAdapter) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2831 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2832 | <code>                status: 'adapter_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2833 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2834 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2835 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2836 | <code>                message: 'Composio execution requires the composio_rest_v3 adapter.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2837 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2838 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2839 | <code>        const auth = await this.resolveAuthProfileForExecution(exposure, args);</code> | 声明局部标识符 `auth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2840 | <code>        if (auth.status !== 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2841 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2842 | <code>                status: auth.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2843 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2844 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2845 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2846 | <code>                message: auth.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2847 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2848 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2849 | <code>        const authMaterial = this.buildAuthMaterial(auth.profile &#124;&#124; {</code> | 声明局部标识符 `authMaterial`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2850 | <code>            id: 'composio_default',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2851 | <code>            provider: 'composio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2852 | <code>            authType: 'composio_api_key_env',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2853 | <code>            envVar: 'COMPOSIO_API_KEY',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2854 | <code>            headerName: 'x-api-key'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2855 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2856 | <code>        if (authMaterial.status !== 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2857 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2858 | <code>                ...authMaterial,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2859 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2860 | <code>                toolId: exposure.toolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2861 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2862 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2863 | <code>        const slug = normalizeString(exposure.source?.toolSlug &#124;&#124; exposure.toolId &#124;&#124; exposure.name &#124;&#124; exposure.contract?.name);</code> | 声明局部标识符 `slug`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2864 | <code>        if (!slug) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2865 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2866 | <code>                status: 'invalid_composio_exposure',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2867 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2868 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2869 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2870 | <code>                message: 'Composio exposure is missing toolSlug/name.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2871 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2872 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2873 | <code>        const baseUrl = normalizeString(auth.profile?.baseUrl &#124;&#124; exposure.source?.baseUrl, DEFAULT_COMPOSIO_API_BASE_URL).replace(/\/+$/, '');</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2874 | <code>        const url = `${baseUrl}/tools/execute/${encodeURIComponent(slug)}`;</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2875 | <code>        const timeoutMs = Math.max(1000, Math.min(Number(args.timeoutMs &#124;&#124; params.timeoutMs &#124;&#124; 30000), 120000));</code> | 声明局部标识符 `timeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2876 | <code>        const controller = new AbortController();</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2877 | <code>        const timer = setTimeout(() =&gt; controller.abort(), timeoutMs);</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2878 | <code>        const headers = {</code> | 声明局部标识符 `headers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2879 | <code>            accept: 'application/json, text/plain;q=0.9, */*;q=0.5',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2880 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2881 | <code>            ...(auth.profile?.defaultHeaders &amp;&amp; typeof auth.profile.defaultHeaders === 'object' ? auth.profile.defaultHeaders : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2882 | <code>            ...authMaterial.headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2883 | <code>            ...(params.headers &amp;&amp; typeof params.headers === 'object' &amp;&amp; !Array.isArray(params.headers) ? params.headers : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2884 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2885 | <code>        const body = this.buildComposioExecuteBody(exposure, params, auth.profile &#124;&#124; {}, args);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2886 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2887 | <code>            const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2888 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2889 | <code>                headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2890 | <code>                body: JSON.stringify(body),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2891 | <code>                signal: controller.signal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2892 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2893 | <code>            const contentType = response.headers.get('content-type') &#124;&#124; '';</code> | 声明局部标识符 `contentType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2894 | <code>            const responseHeaders = extractResponseHeaders(response.headers);</code> | 声明局部标识符 `responseHeaders`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2895 | <code>            const failure = response.ok ? null : classifyHttpFailure(response.status, exposure, responseHeaders);</code> | 声明局部标识符 `failure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2896 | <code>            const text = await response.text();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2897 | <code>            let parsed = text;</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2898 | <code>            if (/json/i.test(contentType)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2899 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2900 | <code>                    parsed = JSON.parse(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2901 | <code>                } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2902 | <code>                    parsed = text;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2903 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2904 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2905 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2906 | <code>                status: response.ok ? 'completed' : 'http_error',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2907 | <code>                ok: response.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2908 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2909 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2910 | <code>                source: exposure.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2911 | <code>                adapter: exposure.adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2912 | <code>                url: redactUrlSecret(url),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2913 | <code>                request: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2914 | <code>                    headers: redactHeaders(headers),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2915 | <code>                    authProfileId: auth.profile?.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2916 | <code>                    hasUserScope: Boolean(body.user_id &#124;&#124; body.connected_account_id &#124;&#124; body.entity_id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2917 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2918 | <code>                http: {</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 2919 | <code>                    status: response.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2920 | <code>                    statusText: response.statusText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2921 | <code>                    contentType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2922 | <code>                    headers: responseHeaders</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2923 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2924 | <code>                failure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2925 | <code>                failureReason: failure?.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2926 | <code>                message: failure?.message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2927 | <code>                nextActions: failure?.nextActions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2928 | <code>                body: parsed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2929 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2930 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2931 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2932 | <code>                status: error?.name === 'AbortError' ? 'timeout' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2933 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2934 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2935 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2936 | <code>                url: redactUrlSecret(url),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2937 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2938 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2939 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2940 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2941 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2942 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2943 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2944 | <code>    async executeExposedExternalTool(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2945 | <code>        const state = await this.loadExternalExposure();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2946 | <code>        const exposure = this.findExternalExposure(state, args);</code> | 声明局部标识符 `exposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2947 | <code>        if (!exposure) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2948 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2949 | <code>                status: 'not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2950 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2951 | <code>                requested: normalizeString(args.exposureId &#124;&#124; args.toolId &#124;&#124; args.tool &#124;&#124; args.id &#124;&#124; args.name),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2952 | <code>                message: 'No exposed external tool matched this id/name/toolId.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2953 | <code>                available: (state.exposures &#124;&#124; []).slice(0, 20).map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2954 | <code>                    id: entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2955 | <code>                    toolId: entry.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2956 | <code>                    title: entry.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2957 | <code>                    callable: entry.callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2958 | <code>                    verification: entry.verification</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2959 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2960 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2961 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2962 | <code>        const params = args.args &amp;&amp; typeof args.args === 'object' &amp;&amp; !Array.isArray(args.args)</code> | 声明局部标识符 `params`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2963 | <code>            ? args.args</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2964 | <code>            : args.parameters &amp;&amp; typeof args.parameters === 'object' &amp;&amp; !Array.isArray(args.parameters)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2965 | <code>                ? args.parameters</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2966 | <code>                : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2967 | <code>        if (exposure.callable !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2968 | <code>            return this.buildExternalExposureNotCallableResult(exposure);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2969 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2970 | <code>        if (exposure.source?.type === 'installed_mcp_direct' &#124;&#124; /^mcp__/.test(exposure.toolId &#124;&#124; '')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2971 | <code>            if (!this.mcpManager?.callTool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2972 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2973 | <code>                    status: 'mcp_manager_unavailable',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2974 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2975 | <code>                    exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2976 | <code>                    toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2977 | <code>                    message: 'MCP manager is not available in this runtime.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2978 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2979 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2980 | <code>            const server = normalizeString(exposure.source?.name);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2981 | <code>            const tool = normalizeString(exposure.source?.rawToolName &#124;&#124; exposure.contract?.source?.rawToolName &#124;&#124; exposure.name);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2982 | <code>            if (!server &#124;&#124; !tool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2983 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2984 | <code>                    status: 'invalid_mcp_exposure',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2985 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2986 | <code>                    exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2987 | <code>                    toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2988 | <code>                    message: 'Callable MCP exposure is missing server or raw tool name.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2989 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2990 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2991 | <code>            const result = await this.mcpManager.callTool({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2992 | <code>                server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2993 | <code>                tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2994 | <code>                args: params,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2995 | <code>                meta: args.meta,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2996 | <code>                timeoutMs: args.timeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2997 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2998 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2999 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3000 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3001 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3002 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3003 | <code>                source: exposure.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3004 | <code>                result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3005 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3006 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3007 | <code>        if (exposure.source?.type === 'openapi_operation') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3008 | <code>            return await this.executeOpenApiExposure(exposure, params, args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3009 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3010 | <code>        if (exposure.source?.type === 'composio_tool') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3011 | <code>            return await this.executeComposioExposure(exposure, params, args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3012 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3013 | <code>        if (exposure.source?.type === 'pydantic_tool' &#124;&#124; exposure.adapter?.type === 'local_document_converter') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3014 | <code>            return await this.executeLocalAdapterExposure(exposure, params, args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3015 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3016 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3017 | <code>            status: 'executor_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3018 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3019 | <code>            exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3020 | <code>            toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3021 | <code>            callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3022 | <code>            source: exposure.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3023 | <code>            message: 'This exposure was marked callable, but AILIS does not have an executor adapter for this source type yet.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3024 | <code>            nextActions: ['Install or implement a source-specific adapter.', 'Run smoke tests, then re-expose after verification.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3025 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3026 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3028 | <code>    async executeVirtualExternalTool(toolId = '', params = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3029 | <code>        if (!isExternalVirtualToolId(toolId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3030 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3031 | <code>                status: 'invalid_external_virtual_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3032 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3033 | <code>                toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3034 | <code>                message: 'External virtual tools must use the form external__provider__tool.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3035 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3036 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3037 | <code>        return await this.executeExposedExternalTool({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3038 | <code>            toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3039 | <code>            args: params,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3040 | <code>            timeoutMs: params?.timeoutMs &#124;&#124; context?.timeoutMs</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3041 | <code>        }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3042 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3044 | <code>    async smokeExternalExposureObject(exposure = {}, args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3045 | <code>        const checks = [];</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3046 | <code>        const addCheck = (id, ok, details = {}) =&gt; {</code> | 声明局部标识符 `addCheck`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3047 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3048 | <code>                id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3049 | <code>                ok: Boolean(ok),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3050 | <code>                ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3051 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3052 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3053 | <code>        addCheck('exposure_present', true, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3054 | <code>            exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3055 | <code>            toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3056 | <code>            sourceType: exposure.source?.type &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3057 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3058 | <code>        addCheck('contract_lint_approved', exposure.lint?.approved !== false, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3059 | <code>            score: exposure.score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3060 | <code>            lintStatus: exposure.lintStatus</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3061 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3062 | <code>        addCheck('callable_flag', exposure.callable === true, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3063 | <code>            callable: exposure.callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3064 | <code>            verification: exposure.verification</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3065 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3066 | <code>        const adapterRequired = ['openapi_operation', 'composio_tool'].includes(exposure.source?.type) &#124;&#124;</code> | 声明局部标识符 `adapterRequired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3067 | <code>            exposure.adapter?.type === 'local_document_converter';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3068 | <code>        addCheck('adapter_configured', !adapterRequired &#124;&#124; Boolean(exposure.adapter?.id &#124;&#124; exposure.adapter?.type), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3069 | <code>            adapter: exposure.adapter &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3070 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3071 | <code>        const auth = await this.resolveAuthProfileForExecution(exposure, args);</code> | 声明局部标识符 `auth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3072 | <code>        if (auth.status !== 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3073 | <code>            addCheck('auth_profile', false, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3074 | <code>                status: auth.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3075 | <code>                message: auth.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3076 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3077 | <code>        } else if (auth.profile) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3078 | <code>            const authStatus = this.authProfileStatus(auth.profile);</code> | 声明局部标识符 `authStatus`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3079 | <code>            addCheck('auth_profile', authStatus.status === 'ready', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3080 | <code>                status: authStatus.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3081 | <code>                profile: this.publicAuthProfile(auth.profile)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3082 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3083 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3084 | <code>            addCheck('auth_profile', true, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3085 | <code>                profile: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3086 | <code>                note: 'No auth profile required or provided.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3087 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3088 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3089 | <code>        if (exposure.adapter?.type === 'local_document_converter') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3090 | <code>            const readiness = await this.checkLocalAdapterReadiness(exposure.adapter, args);</code> | 声明局部标识符 `readiness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3091 | <code>            addCheck('local_adapter_dependency', readiness.ok === true, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3092 | <code>                status: readiness.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3093 | <code>                packageName: readiness.packageName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3094 | <code>                importName: readiness.importName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3095 | <code>                command: readiness.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3096 | <code>                message: readiness.message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3097 | <code>                nextActions: readiness.nextActions</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3098 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3099 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3100 | <code>        const ok = checks.every((check) =&gt; check.ok);</code> | 声明局部标识符 `ok`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3101 | <code>        if (args.live !== true &amp;&amp; args.execute !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3102 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3103 | <code>                status: ok ? 'completed' : 'smoke_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3104 | <code>                ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3105 | <code>                mode: 'static',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3106 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3107 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3108 | <code>                checks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3109 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3110 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3111 | <code>        if (!ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3112 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3113 | <code>                status: 'smoke_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3114 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3115 | <code>                mode: 'live_skipped',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3116 | <code>                exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3117 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3118 | <code>                checks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3119 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3120 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3121 | <code>        const live = await this.executeExposedExternalTool({</code> | 声明局部标识符 `live`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3122 | <code>            ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3123 | <code>            args: args.args &#124;&#124; args.parameters &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3124 | <code>        }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3125 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3126 | <code>            status: live.ok === true &#124;&#124; live.status === 'completed' ? 'completed' : 'smoke_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3127 | <code>            ok: live.ok === true &#124;&#124; live.status === 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3128 | <code>            mode: 'live',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3129 | <code>            exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3130 | <code>            toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3131 | <code>            checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3132 | <code>            live</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3133 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3134 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3136 | <code>    async smokeExposedExternalTool(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3137 | <code>        const state = await this.loadExternalExposure();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3138 | <code>        const exposure = this.findExternalExposure(state, args);</code> | 声明局部标识符 `exposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3139 | <code>        if (!exposure) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3140 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3141 | <code>                status: 'not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3142 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3143 | <code>                requested: normalizeString(args.exposureId &#124;&#124; args.toolId &#124;&#124; args.tool &#124;&#124; args.id &#124;&#124; args.name),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3144 | <code>                message: 'No exposed external tool matched this id/name/toolId.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3145 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3146 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3147 | <code>        return await this.smokeExternalExposureObject(exposure, args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3148 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3150 | <code>    compileStandardToolPackExposureEntries(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3151 | <code>        const collected = collectStandardToolPackContracts({</code> | 声明局部标识符 `collected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3152 | <code>            packIds: args.standardToolPacks &#124;&#124; args.packIds &#124;&#124; args.packs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3153 | <code>            query: args.query &#124;&#124; args.taskText &#124;&#124; args.task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3154 | <code>            limit: args.limit &#124;&#124; args.maxTools &#124;&#124; 100,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3155 | <code>            includePublicReadonly: args.includePublicReadonly !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3156 | <code>            includeAuthRequired: args.includeAuthRequired !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3157 | <code>            includeLocalContracts: args.includeLocalContracts !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3158 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3159 | <code>        const publicOpenApi = collected.groups.openapiOperations.filter((tool) =&gt; normalizeString(tool.exposure) === 'public_readonly');</code> | 声明局部标识符 `publicOpenApi`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3160 | <code>        const authOpenApi = collected.groups.openapiOperations.filter((tool) =&gt; normalizeString(tool.exposure) !== 'public_readonly');</code> | 声明局部标识符 `authOpenApi`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3161 | <code>        const authAdaptersEnabled = args.enableAuthRequiredAdapters === true &#124;&#124; args.enableAuthenticatedAdapters === true;</code> | 声明局部标识符 `authAdaptersEnabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3162 | <code>        const localAdaptersEnabled = args.enableLocalAdapters === true &#124;&#124; args.enableLocalDocumentAdapters === true;</code> | 声明局部标识符 `localAdaptersEnabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3163 | <code>        const authProfiles = collectStandardToolPackAuthProfiles({</code> | 声明局部标识符 `authProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3164 | <code>            packIds: args.standardToolPacks &#124;&#124; args.packIds &#124;&#124; args.packs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3165 | <code>            query: args.query &#124;&#124; args.taskText &#124;&#124; args.task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3166 | <code>            limit: args.limit &#124;&#124; args.maxTools &#124;&#124; 100</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3167 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3168 | <code>        const exposures = [</code> | 声明局部标识符 `exposures`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3169 | <code>            ...this.compileRawExternalToolsForExposure(publicOpenApi.map((entry) =&gt; ({ ...entry, callable: true })), {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3170 | <code>                ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3171 | <code>                sourceType: 'openapi_operation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3172 | <code>                trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3173 | <code>                enableOpenApiAdapter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3174 | <code>                minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3175 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3176 | <code>            ...this.compileRawExternalToolsForExposure(authOpenApi, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3177 | <code>                ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3178 | <code>                sourceType: 'openapi_operation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3179 | <code>                trustCallable: authAdaptersEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3180 | <code>                enableOpenApiAdapter: authAdaptersEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3181 | <code>                minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3182 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3183 | <code>            ...this.compileRawExternalToolsForExposure(collected.groups.composioTools, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3184 | <code>                ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3185 | <code>                sourceType: 'composio_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3186 | <code>                trustCallable: authAdaptersEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3187 | <code>                enableComposioAdapter: authAdaptersEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3188 | <code>                minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3189 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3190 | <code>            ...this.compileRawExternalToolsForExposure(collected.groups.mcpTools, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3191 | <code>                ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3192 | <code>                sourceType: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3193 | <code>                trustCallable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3194 | <code>                minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3195 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3196 | <code>            ...this.compileRawExternalToolsForExposure(collected.groups.contracts, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3197 | <code>                ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3198 | <code>                sourceType: normalizeString(args.sourceType &#124;&#124; args.source_type &#124;&#124; 'pydantic_tool'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3199 | <code>                trustCallable: localAdaptersEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3200 | <code>                enableLocalAdapters: localAdaptersEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3201 | <code>                minScore: args.minScore &#124;&#124; 60</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3202 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3203 | <code>        ].map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3204 | <code>            ...entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3205 | <code>            standardToolPack: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3206 | <code>            type: entry.callable ? 'standard_pack_callable_tool' : 'standard_pack_contract_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3207 | <code>            verification: entry.callable ? entry.verification : normalizeString(entry.verification, 'adapter_required'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3208 | <code>            notes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3209 | <code>                ...normalizeArray(entry.notes),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3210 | <code>                'Imported from AILIS Standard Tool Packs; use smoke_exposed_external_tool before relying on live authenticated backends.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3211 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3212 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3213 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3214 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3215 | <code>            selectedPacks: collected.selectedPacks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3216 | <code>            counts: collected.counts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3217 | <code>            authProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3218 | <code>            exposures</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3219 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3220 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3222 | <code>    defaultSmokeArgsForExposure(exposure = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3223 | <code>        const toolId = normalizeString(exposure.toolId &#124;&#124; exposure.contract?.id);</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3224 | <code>        const maps = [</code> | 声明局部标识符 `maps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3225 | <code>            args.smokeArgsByToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3226 | <code>            args.smokeArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3227 | <code>            args.parametersByToolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3228 | <code>        ].filter((entry) =&gt; entry &amp;&amp; typeof entry === 'object' &amp;&amp; !Array.isArray(entry));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3229 | <code>        for (const map of maps) {</code> | 声明局部标识符 `map`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3230 | <code>            if (map[toolId] &amp;&amp; typeof map[toolId] === 'object' &amp;&amp; !Array.isArray(map[toolId])) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3231 | <code>                return map[toolId];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3232 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3233 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3234 | <code>        const defaults = {</code> | 声明局部标识符 `defaults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3235 | <code>            gmail_list_messages: { userId: 'me', maxResults: 1 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3236 | <code>            msgraph_list_messages: { '$top': 1, '$select': 'subject,from,receivedDateTime,isRead', '$orderby': 'receivedDateTime desc' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3237 | <code>            composio_gmail_search_emails: { query: 'newer_than:1d', max_results: 1 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3238 | <code>            firecrawl_scrape: { url: 'https://example.com', formats: ['markdown'], onlyMainContent: true },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 3239 | <code>            tavily_search: { query: 'OpenAI Codex', search_depth: 'basic', include_answer: false, include_raw_content: false, max_results: 1 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3240 | <code>            openalex_search_works: { search: 'Toolformer language models can teach themselves to use tools', 'per-page': 1 },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3241 | <code>            crossref_search_works: { 'query.bibliographic': 'Toolformer language models can teach themselves to use tools', rows: 1 },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3242 | <code>            semantic_scholar_search_contract: { query: 'Toolformer language models can teach themselves to use tools', fields: 'title,authors,year,venue,externalIds', limit: 1 }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3243 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3244 | <code>        if (defaults[toolId]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3245 | <code>            return defaults[toolId];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3246 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3247 | <code>        return normalizeArray(exposure.contract?.examples)[0] &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3248 | <code>            normalizeArray(exposure.contract?.generatedExamples)[0] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3249 | <code>            {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3250 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3252 | <code>    shouldRunLiveSmokeForExposure(exposure = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3253 | <code>        if (args.liveSmoke !== true &amp;&amp; args.executeSmoke !== true &amp;&amp; args.live !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3254 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3255 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3256 | <code>        if (args.liveSmokeAll === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3257 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3258 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3259 | <code>        const allow = new Set(normalizeArray(args.liveSmokeTools &#124;&#124; args.liveTools &#124;&#124; args.tools).map((entry) =&gt; normalizeString(entry).toLowerCase()).filter(Boolean));</code> | 声明局部标识符 `allow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3260 | <code>        if (!allow.size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3261 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3262 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3263 | <code>        const values = [</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3264 | <code>            exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3265 | <code>            exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3266 | <code>            exposure.virtualToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3267 | <code>            exposure.contract?.id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3268 | <code>        ].map((entry) =&gt; normalizeString(entry).toLowerCase()).filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3269 | <code>        return values.some((value) =&gt; allow.has(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3270 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3272 | <code>    downgradeExposureAfterSmokeFailure(exposure = {}, smoke = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3273 | <code>        const failed = normalizeArray(smoke.checks).find((check) =&gt; check.ok === false) &#124;&#124; {};</code> | 声明局部标识符 `failed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3274 | <code>        const reason = normalizeString(failed.status &#124;&#124; failed.id &#124;&#124; smoke.status, 'smoke_failed');</code> | 声明局部标识符 `reason`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3275 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3276 | <code>            ...exposure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3277 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3278 | <code>            verified: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3279 | <code>            virtualToolId: '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3280 | <code>            verification: reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3281 | <code>            callableReason: `Standard pack adapter was not promoted because smoke failed: ${reason}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3282 | <code>            notes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3283 | <code>                ...normalizeArray(exposure.notes),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3284 | <code>                `Smoke failed (${reason}); keep visible as a contract-only candidate until repaired.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3285 | <code>            ].slice(-12),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3286 | <code>            smoke: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3287 | <code>                status: smoke.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3288 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3289 | <code>                mode: smoke.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3290 | <code>                failedCheck: failed.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3291 | <code>                reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3292 | <code>                checks: smoke.checks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3293 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3294 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3295 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3297 | <code>    promoteExposureAfterSmokePass(exposure = {}, smoke = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3298 | <code>        const next = {</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3299 | <code>            ...exposure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3300 | <code>            callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3301 | <code>            verified: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3302 | <code>            verification: smoke.mode === 'live' ? 'live_smoke_passed' : 'static_smoke_passed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3303 | <code>            callableReason: smoke.mode === 'live'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3304 | <code>                ? 'Runtime adapter passed live smoke and can be called directly.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3305 | <code>                : 'Runtime adapter passed static auth/dependency smoke and can be called directly.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3306 | <code>            smoke: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3307 | <code>                status: smoke.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3308 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3309 | <code>                mode: smoke.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3310 | <code>                checks: smoke.checks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3311 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3312 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3313 | <code>        next.virtualToolId = createExternalVirtualToolId(next);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3314 | <code>        return next;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3315 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3317 | <code>    async verifyStandardExposureEntries(exposures = [], args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3318 | <code>        const smokeResults = [];</code> | 声明局部标识符 `smokeResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3319 | <code>        const verified = [];</code> | 声明局部标识符 `verified`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3320 | <code>        for (const exposure of exposures) {</code> | 声明局部标识符 `exposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3321 | <code>            const shouldSmoke = exposure.standardToolPack === true &amp;&amp;</code> | 声明局部标识符 `shouldSmoke`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3322 | <code>                (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3323 | <code>                    exposure.callable === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3324 | <code>                    exposure.adapter?.id &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3325 | <code>                    exposure.adapter?.type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3326 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3327 | <code>            if (!shouldSmoke) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3328 | <code>                verified.push(exposure);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3329 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3330 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3331 | <code>            const live = this.shouldRunLiveSmokeForExposure(exposure, args);</code> | 声明局部标识符 `live`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3332 | <code>            const smoke = await this.smokeExternalExposureObject(exposure, {</code> | 声明局部标识符 `smoke`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3333 | <code>                ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3334 | <code>                live,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3335 | <code>                execute: live,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3336 | <code>                approved: args.approved === true &#124;&#124; live,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3337 | <code>                args: args.args &#124;&#124; args.parameters &#124;&#124; this.defaultSmokeArgsForExposure(exposure, args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3338 | <code>            }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3339 | <code>            const failed = normalizeArray(smoke.checks).find((check) =&gt; check.ok === false) &#124;&#124; {};</code> | 声明局部标识符 `failed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3340 | <code>            smokeResults.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3341 | <code>                toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3342 | <code>                status: smoke.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3343 | <code>                ok: smoke.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3344 | <code>                mode: smoke.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3345 | <code>                verification: smoke.ok ? (smoke.mode === 'live' ? 'live_smoke_passed' : 'static_smoke_passed') : 'smoke_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3346 | <code>                reason: smoke.ok ? '' : normalizeString(failed.status &#124;&#124; failed.id &#124;&#124; smoke.status, 'smoke_failed')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3347 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3348 | <code>            verified.push(smoke.ok</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3349 | <code>                ? this.promoteExposureAfterSmokePass(exposure, smoke)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3350 | <code>                : this.downgradeExposureAfterSmokeFailure(exposure, smoke));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3351 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3352 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3353 | <code>            exposures: verified,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3354 | <code>            smokeResults</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3355 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3356 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3358 | <code>    async exposeStandardToolPacks(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3359 | <code>        const compiled = this.compileStandardToolPackExposureEntries(args);</code> | 声明局部标识符 `compiled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3360 | <code>        const includeRejected = args.includeRejected === true;</code> | 声明局部标识符 `includeRejected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3361 | <code>        const maxExposure = Math.max(1, Math.min(Number(args.limit &#124;&#124; args.maxTools &#124;&#124; 100), 1000));</code> | 声明局部标识符 `maxExposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3362 | <code>        let filtered = compiled.exposures</code> | 声明局部标识符 `filtered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3363 | <code>            .filter((entry) =&gt; includeRejected &#124;&#124; entry.lint?.approved !== false)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3364 | <code>            .slice(0, maxExposure);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3365 | <code>        let configuredAuthProfiles = [];</code> | 声明局部标识符 `configuredAuthProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3366 | <code>        if (args.configureAuthProfiles !== false &amp;&amp; args.dryRun !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3367 | <code>            for (const profile of compiled.authProfiles &#124;&#124; []) {</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3368 | <code>                const configured = await this.configureExternalAuthProfile(profile);</code> | 声明局部标识符 `configured`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3369 | <code>                configuredAuthProfiles.push(configured.profile &#124;&#124; configured);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3370 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3371 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3372 | <code>        let smokeResults = [];</code> | 声明局部标识符 `smokeResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3373 | <code>        if (args.verifyAdapters === true &#124;&#124; args.verifyLiveAdapters === true &#124;&#124; args.smokeAdapters === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3374 | <code>            const verified = await this.verifyStandardExposureEntries(filtered, args);</code> | 声明局部标识符 `verified`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3375 | <code>            filtered = verified.exposures;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3376 | <code>            smokeResults = verified.smokeResults;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3377 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3378 | <code>        if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3379 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3380 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3381 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3382 | <code>                selectedPacks: compiled.selectedPacks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3383 | <code>                counts: compiled.counts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3384 | <code>                authProfiles: compiled.authProfiles &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3385 | <code>                configuredAuthProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3386 | <code>                smokeResults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3387 | <code>                added: filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3388 | <code>                callable: filtered.filter((entry) =&gt; entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3389 | <code>                nonCallable: filtered.filter((entry) =&gt; !entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3390 | <code>                rejectedSkipped: compiled.exposures.length - filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3391 | <code>                exposures: filtered</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3392 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3393 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3394 | <code>        const state = await this.loadExternalExposure();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3395 | <code>        const byId = new Map((state.exposures &#124;&#124; []).map((entry) =&gt; [entry.id, entry]));</code> | 声明局部标识符 `byId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3396 | <code>        for (const entry of filtered) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3397 | <code>            byId.set(entry.id, entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3398 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3399 | <code>        state.exposures = [...byId.values()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3400 | <code>            .sort((a, b) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3401 | <code>                Number(b.callable) - Number(a.callable) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3402 | <code>                Number(b.score &#124;&#124; 0) - Number(a.score &#124;&#124; 0) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3403 | <code>                String(a.id).localeCompare(String(b.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3404 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3405 | <code>        const saved = await this.saveExternalExposure(state);</code> | 声明局部标识符 `saved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3406 | <code>        this.emitGatewayEvent('tool_acquisition.standard_tool_packs.exposed', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3407 | <code>            added: filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3408 | <code>            callable: filtered.filter((entry) =&gt; entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3409 | <code>            total: saved.exposures.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3410 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3411 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3412 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3413 | <code>            externalExposurePath: this.externalExposurePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3414 | <code>            selectedPacks: compiled.selectedPacks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3415 | <code>            counts: compiled.counts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3416 | <code>            authProfiles: compiled.authProfiles &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3417 | <code>            configuredAuthProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3418 | <code>            smokeResults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3419 | <code>            added: filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3420 | <code>            total: saved.exposures.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3421 | <code>            callable: filtered.filter((entry) =&gt; entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3422 | <code>            nonCallable: filtered.filter((entry) =&gt; !entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3423 | <code>            rejectedSkipped: compiled.exposures.length - filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3424 | <code>            exposures: filtered</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3425 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3426 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3428 | <code>    async bulkExposeExternalTools(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3429 | <code>        const includeInstalledMcp = args.includeInstalledMcp !== false &amp;&amp; args.includeInstalledMCP !== false;</code> | 声明局部标识符 `includeInstalledMcp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3430 | <code>        const includeMcpRegistry = args.includeMcpRegistry !== false &amp;&amp; args.includeMCPRegistry !== false;</code> | 声明局部标识符 `includeMcpRegistry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3431 | <code>        const includeRejected = args.includeRejected === true;</code> | 声明局部标识符 `includeRejected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3432 | <code>        const maxExposure = Math.max(1, Math.min(Number(args.limit &#124;&#124; args.maxTools &#124;&#124; 100), 1000));</code> | 声明局部标识符 `maxExposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3433 | <code>        const exposures = [];</code> | 声明局部标识符 `exposures`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3434 | <code>        if (args.includeStandardToolPacks === true &#124;&#124; args.includeStandardPacks === true &#124;&#124; args.standardToolPacks &#124;&#124; args.packIds &#124;&#124; args.packs) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3435 | <code>            exposures.push(...this.compileStandardToolPackExposureEntries(args).exposures);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3436 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3437 | <code>        if (includeInstalledMcp) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3438 | <code>            exposures.push(...await this.exposeInstalledMcpToolSpecs(args));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3439 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3440 | <code>        if (includeMcpRegistry) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3441 | <code>            exposures.push(...await this.exposeMcpRegistryCandidates(args));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3442 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3443 | <code>        const rawGroups = [</code> | 声明局部标识符 `rawGroups`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3444 | <code>            { sourceType: 'composio_tool', items: args.composioTools &#124;&#124; args.composio &#124;&#124; [] },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3445 | <code>            { sourceType: 'openapi_operation', items: args.openapiOperations &#124;&#124; args.openApiOperations &#124;&#124; args.openapi &#124;&#124; [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3446 | <code>            { sourceType: 'mcp_tool', items: args.mcpTools &#124;&#124; args.mcpToolSpecs &#124;&#124; [] },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3447 | <code>            { sourceType: normalizeString(args.sourceType &#124;&#124; args.source_type &#124;&#124; 'generic_tool'), items: args.contracts &#124;&#124; args.rawContracts &#124;&#124; args.tools &#124;&#124; args.toolSpecs &#124;&#124; [] }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3448 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3449 | <code>        for (const group of rawGroups) {</code> | 声明局部标识符 `group`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3450 | <code>            if (!normalizeArray(group.items).length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3451 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3452 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3453 | <code>            exposures.push(...this.compileRawExternalToolsForExposure(group.items, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3454 | <code>                ...args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3455 | <code>                sourceType: group.sourceType</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3456 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3457 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3458 | <code>        const filtered = exposures</code> | 声明局部标识符 `filtered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3459 | <code>            .filter((entry) =&gt; includeRejected &#124;&#124; entry.lint?.approved !== false)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3460 | <code>            .slice(0, maxExposure);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3461 | <code>        const state = await this.loadExternalExposure();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3462 | <code>        const byId = new Map((state.exposures &#124;&#124; []).map((entry) =&gt; [entry.id, entry]));</code> | 声明局部标识符 `byId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3463 | <code>        for (const entry of filtered) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3464 | <code>            byId.set(entry.id, entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3465 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3466 | <code>        state.exposures = [...byId.values()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3467 | <code>            .sort((a, b) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3468 | <code>                Number(b.callable) - Number(a.callable) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3469 | <code>                Number(b.score &#124;&#124; 0) - Number(a.score &#124;&#124; 0) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3470 | <code>                String(a.id).localeCompare(String(b.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3471 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3472 | <code>        const saved = await this.saveExternalExposure(state);</code> | 声明局部标识符 `saved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3473 | <code>        this.emitGatewayEvent('tool_acquisition.external_tools.exposed', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3474 | <code>            added: filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3475 | <code>            callable: filtered.filter((entry) =&gt; entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3476 | <code>            total: saved.exposures.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3477 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3478 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3479 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3480 | <code>            externalExposurePath: this.externalExposurePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3481 | <code>            added: filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3482 | <code>            total: saved.exposures.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3483 | <code>            callable: filtered.filter((entry) =&gt; entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3484 | <code>            nonCallable: filtered.filter((entry) =&gt; !entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3485 | <code>            rejectedSkipped: exposures.length - filtered.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3486 | <code>            exposurePolicy: includeRejected</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3487 | <code>                ? 'direct_visible_even_if_lint_rejected'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3488 | <code>                : 'direct_visible_after_contract_lint',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3489 | <code>            exposures: filtered</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3490 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3491 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3493 | <code>    async listExposedExternalTools(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3494 | <code>        const state = await this.loadExternalExposure();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3495 | <code>        const query = normalizeString(args.query &#124;&#124; args.taskText &#124;&#124; args.task).toLowerCase();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3496 | <code>        const callable = args.callable === undefined ? null : args.callable === true &#124;&#124; normalizeString(args.callable).toLowerCase() === 'true';</code> | 声明局部标识符 `callable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3497 | <code>        const limit = Math.max(1, Math.min(Number(args.limit &#124;&#124; 50), 500));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3498 | <code>        const exposures = (state.exposures &#124;&#124; [])</code> | 声明局部标识符 `exposures`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3499 | <code>            .filter((entry) =&gt; callable === null &#124;&#124; entry.callable === callable)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3500 | <code>            .filter((entry) =&gt; !query &#124;&#124; scoreText(query, JSON.stringify(entry)) &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3501 | <code>            .slice(0, limit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3502 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3503 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3504 | <code>            externalExposurePath: this.externalExposurePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3505 | <code>            updatedAt: state.updatedAt &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3506 | <code>            total: state.exposures.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3507 | <code>            returned: exposures.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3508 | <code>            callable: exposures.filter((entry) =&gt; entry.callable).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3509 | <code>            exposures</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3510 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3511 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3512 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3513 | <code>    async loadLearningTable() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3514 | <code>        const state = await readJsonFile(this.learningPath, null);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3515 | <code>        if (state?.version === LEARNING_SCHEMA_VERSION &amp;&amp; Array.isArray(state.tasks)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3516 | <code>            return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3517 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3518 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3519 | <code>            version: LEARNING_SCHEMA_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3520 | <code>            createdAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3521 | <code>            updatedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3522 | <code>            tasks: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3523 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3524 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3525 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3526 | <code>    async saveLearningTable(state) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3527 | <code>        const next = {</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3528 | <code>            version: LEARNING_SCHEMA_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3529 | <code>            createdAt: state.createdAt &#124;&#124; new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3530 | <code>            updatedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3531 | <code>            tasks: Array.isArray(state.tasks) ? state.tasks : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3532 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3533 | <code>        await writeJsonFileAtomic(this.learningPath, next);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3534 | <code>        return next;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3535 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3537 | <code>    async recordToolOutcome(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3538 | <code>        const taskText = normalizeString(args.taskText &#124;&#124; args.task &#124;&#124; args.userRequest &#124;&#124; args.query);</code> | 声明局部标识符 `taskText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3539 | <code>        const taskSignature = normalizeString(args.taskSignature &#124;&#124; args.signature, stableTaskSignature(taskText));</code> | 声明局部标识符 `taskSignature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3540 | <code>        const toolIds = normalizeArray(args.toolIds &#124;&#124; args.tools &#124;&#124; args.toolId &#124;&#124; args.tool).map(String).filter(Boolean);</code> | 声明局部标识符 `toolIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3541 | <code>        if (!taskSignature &#124;&#124; !toolIds.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3542 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3543 | <code>                status: 'invalid_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3544 | <code>                error: 'record_tool_outcome requires taskText/taskSignature and toolId/toolIds'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3545 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3546 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3547 | <code>        const success = args.success === true &#124;&#124; normalizeString(args.status).toLowerCase() === 'success';</code> | 声明局部标识符 `success`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3548 | <code>        const score = Math.max(0, Math.min(Number(args.score ?? (success ? 1 : 0)), 1));</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3549 | <code>        const state = await this.loadLearningTable();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3550 | <code>        let task = state.tasks.find((entry) =&gt; entry.signature === taskSignature);</code> | 声明局部标识符 `task`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3551 | <code>        if (!task) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3552 | <code>            task = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3553 | <code>                signature: taskSignature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3554 | <code>                taskText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3555 | <code>                tokens: [...new Set(tokenize(taskText))].slice(0, 40),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3556 | <code>                uses: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3557 | <code>                successes: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3558 | <code>                failures: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3559 | <code>                toolStats: {},</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3560 | <code>                examples: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3561 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3562 | <code>            state.tasks.push(task);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3563 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3564 | <code>        task.taskText = task.taskText &#124;&#124; taskText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3565 | <code>        task.tokens = [...new Set([...(task.tokens &#124;&#124; []), ...tokenize(taskText)])].slice(0, 60);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3566 | <code>        task.uses += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3567 | <code>        if (success) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3568 | <code>            task.successes += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3569 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3570 | <code>            task.failures += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3571 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3572 | <code>        for (const toolId of toolIds) {</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3573 | <code>            const stat = task.toolStats[toolId] &#124;&#124; {</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3574 | <code>                uses: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3575 | <code>                successes: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3576 | <code>                failures: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3577 | <code>                scoreSum: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3578 | <code>                lastUsedAt: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3579 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3580 | <code>            stat.uses += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3581 | <code>            stat.scoreSum += score;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3582 | <code>            if (success) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3583 | <code>                stat.successes += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3584 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3585 | <code>                stat.failures += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3586 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3587 | <code>            stat.lastUsedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3588 | <code>            task.toolStats[toolId] = stat;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3589 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3590 | <code>        task.examples = normalizeArray(task.examples).slice(-8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3591 | <code>        task.examples.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3592 | <code>            at: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3593 | <code>            runId: normalizeString(args.runId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3594 | <code>            success,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3595 | <code>            score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3596 | <code>            toolIds,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3597 | <code>            evidence: normalizeString(args.evidence &#124;&#124; args.note).slice(0, 600)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3598 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3599 | <code>        task.lastUpdatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3600 | <code>        const saved = await this.saveLearningTable(state);</code> | 声明局部标识符 `saved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3601 | <code>        this.emitGatewayEvent('tool_acquisition.learning.recorded', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3602 | <code>            taskSignature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3603 | <code>            toolIds,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3604 | <code>            success</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3605 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3606 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3607 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3608 | <code>            learningPath: this.learningPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3609 | <code>            task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3610 | <code>            taskCount: saved.tasks.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3611 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3612 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3613 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3614 | <code>    async recommendTools(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3615 | <code>        const taskText = normalizeString(args.taskText &#124;&#124; args.task &#124;&#124; args.query &#124;&#124; args.userRequest);</code> | 声明局部标识符 `taskText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3616 | <code>        const limit = Math.max(1, Math.min(Number(args.limit &#124;&#124; 8), 30));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3617 | <code>        const state = await this.loadLearningTable();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3618 | <code>        const queryTokens = new Set(tokenize(taskText));</code> | 声明局部标识符 `queryTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3619 | <code>        const learned = [];</code> | 声明局部标识符 `learned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3620 | <code>        for (const task of state.tasks) {</code> | 声明局部标识符 `task`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3621 | <code>            const overlap = (task.tokens &#124;&#124; []).reduce((sum, token) =&gt; sum + (queryTokens.has(token) ? 1 : 0), 0);</code> | 声明局部标识符 `overlap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3622 | <code>            if (!overlap &amp;&amp; taskText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3623 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3624 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3625 | <code>            for (const [toolId, stat] of Object.entries(task.toolStats &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3626 | <code>                const successRate = stat.uses ? stat.successes / stat.uses : 0;</code> | 声明局部标识符 `successRate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3627 | <code>                learned.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3628 | <code>                    source: 'learning_table',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3629 | <code>                    toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3630 | <code>                    taskSignature: task.signature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3631 | <code>                    taskText: task.taskText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3632 | <code>                    overlap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3633 | <code>                    uses: stat.uses,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3634 | <code>                    successRate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3635 | <code>                    averageScore: stat.uses ? stat.scoreSum / stat.uses : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3636 | <code>                    lastUsedAt: stat.lastUsedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3637 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3638 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3639 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3640 | <code>        const core = this.searchCoreCandidates(taskText, limit).map((candidate) =&gt; ({</code> | 声明局部标识符 `core`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3641 | <code>            source: 'core_catalog',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3642 | <code>            toolId: candidate.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3643 | <code>            candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3644 | <code>            overlap: scoreText(taskText, candidate.searchText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3645 | <code>            uses: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3646 | <code>            successRate: candidate.health === 'available' ? 1 : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3647 | <code>            averageScore: candidate.health === 'available' ? 1 : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3648 | <code>            lastUsedAt: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3649 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3650 | <code>        const recommendations = [...learned, ...core]</code> | 声明局部标识符 `recommendations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3651 | <code>            .sort((a, b) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3652 | <code>                (b.overlap - a.overlap)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3653 | <code>                &#124;&#124; (b.successRate - a.successRate)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3654 | <code>                &#124;&#124; (b.averageScore - a.averageScore)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3655 | <code>                &#124;&#124; String(a.toolId).localeCompare(String(b.toolId))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3656 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3657 | <code>            .slice(0, limit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3658 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3659 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3660 | <code>            taskText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3661 | <code>            learningPath: this.learningPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3662 | <code>            recommendationCount: recommendations.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3663 | <code>            recommendations</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3664 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3665 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3666 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3667 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3668 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3669 | <code>    AILISToolAcquisitionGateway,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3670 | <code>    OFFICIAL_MCP_REGISTRY_URL,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3671 | <code>    CORE_TOOL_BUNDLES,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3672 | <code>    BUILTIN_PUBLIC_OPENAPI_OPERATIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3673 | <code>    STANDARD_TOOL_PACKS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3674 | <code>    buildMcpSmokeProfile,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3675 | <code>    buildRegistryCandidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3676 | <code>    createExternalVirtualToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3677 | <code>    isExternalVirtualToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3678 | <code>    stableTaskSignature</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3679 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
