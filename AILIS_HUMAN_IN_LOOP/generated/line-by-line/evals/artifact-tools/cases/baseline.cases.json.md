# evals/artifact-tools/cases/baseline.cases.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`structured-data`
- 原始行数：299
- SHA-256：`4d7612737154e91bb5d4e399e092a05155846a35a92c7263cc103ab8e3f495e8`
- 可运行副本：[打开源文件](../../../../../source/evals/artifact-tools/cases/baseline.cases.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>[</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 3 | <code>    "id": "xlsx_map_path_color",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>    "artifactKind": "workbook",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>    "format": "xlsx",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>    "input": "evals/artifact-tools/fixtures/xlsx/map-path-color.xlsx",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>    "goal": "Answer a spreadsheet map path question using exact cell values, fills, and coordinates.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>    "requiredCapabilities": ["load", "inspect", "render", "validate"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>    "expectedEvidence": ["cell values", "fill colors", "coordinates"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>    "expectedAnswer": "F478A7",</code> | 结构化数据字段 `expectedAnswer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>      "mapPath": {</code> | 结构化数据字段 `mapPath`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>        "startText": "START",</code> | 结构化数据字段 `startText`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>        "endText": "END",</code> | 结构化数据字段 `endText`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>        "obstacleColor": "0099FF",</code> | 结构化数据字段 `obstacleColor`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>        "turns": 11,</code> | 结构化数据字段 `turns`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>        "cellsPerTurn": 2,</code> | 结构化数据字段 `cellsPerTurn`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>        "landedCell": "E3",</code> | 结构化数据字段 `landedCell`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 19 | <code>        "landedColor": "F478A7",</code> | 结构化数据字段 `landedColor`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>        "minimumPathLength": 23</code> | 结构化数据字段 `minimumPathLength`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 21 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 22 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 23 | <code>    "checks": ["structured equality", "render nonblank"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 25 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 26 | <code>    "id": "xlsx_formula_style_inspect",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>    "artifactKind": "workbook",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>    "format": "xlsx",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 29 | <code>    "input": "evals/artifact-tools/fixtures/xlsx/formula-style-model.xlsx",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>    "goal": "Inspect a workbook with tables, formulas, styles, validation, merges, and a known formula error.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>    "requiredCapabilities": ["load", "inspect", "validate"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>    "expectedEvidence": ["sheet names", "table names", "merged ranges", "formula cells", "formula errors", "cell styles"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 34 | <code>      "allowedDiagnosticCodes": ["xlsx_formula_error"],</code> | 结构化数据字段 `allowedDiagnosticCodes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>      "xlsx": {</code> | 结构化数据字段 `xlsx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>        "sheetNames": ["Data", "Summary"],</code> | 结构化数据字段 `sheetNames`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>        "requiredTables": ["SalesTable"],</code> | 结构化数据字段 `requiredTables`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>        "requiredMerges": ["Summary!A1:D1"],</code> | 结构化数据字段 `requiredMerges`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>        "minimumFormulaCount": 5,</code> | 结构化数据字段 `minimumFormulaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 40 | <code>        "formulaErrorCount": 1,</code> | 结构化数据字段 `formulaErrorCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>        "cells": [</code> | 结构化数据字段 `cells`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>          { "ref": "Summary!B3", "formula": "SUM(Data!D2:D4)", "fillRgb": "DCFCE7" },</code> | 结构化数据字段 `ref`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 43 | <code>          { "ref": "Summary!B4", "formula": "Missing!A1", "fillRgb": "FEE2E2" }</code> | 结构化数据字段 `ref`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 44 | <code>        ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 45 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 46 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 47 | <code>    "checks": ["sheet inventory", "table inventory", "formula scan", "style scan", "diagnostics"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 49 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 50 | <code>    "id": "xlsx_edit_export_roundtrip",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>    "artifactKind": "workbook",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>    "format": "xlsx",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 53 | <code>    "input": "evals/artifact-tools/fixtures/xlsx/formula-style-model.xlsx",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>    "goal": "Apply declaration-style XLSX edits, export, reopen, and verify the changed values, formulas, and styles.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>    "requiredCapabilities": ["load", "inspect", "edit", "validate", "export", "roundtrip"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>    "expectedEvidence": ["operation log", "dirty range", "exported workbook", "reopened cell values", "reopened formulas", "reopened styles"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 58 | <code>      "allowedDiagnosticCodes": ["xlsx_formula_error"],</code> | 结构化数据字段 `allowedDiagnosticCodes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 59 | <code>      "xlsx": {</code> | 结构化数据字段 `xlsx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 60 | <code>        "sheetNames": ["Data", "Summary"],</code> | 结构化数据字段 `sheetNames`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>        "minimumFormulaCount": 5,</code> | 结构化数据字段 `minimumFormulaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 62 | <code>        "formulaErrorCount": 1</code> | 结构化数据字段 `formulaErrorCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 63 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 64 | <code>      "editRoundtrip": {</code> | 结构化数据字段 `editRoundtrip`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 65 | <code>        "operations": [</code> | 结构化数据字段 `operations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>          {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 67 | <code>            "op": "range.setValues",</code> | 结构化数据字段 `op`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 68 | <code>            "target": "Summary!A6:B6",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 69 | <code>            "values": [["Edited status", "OK"]]</code> | 结构化数据字段 `values`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 70 | <code>          },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 71 | <code>          {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 72 | <code>            "op": "range.setStyles",</code> | 结构化数据字段 `op`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 73 | <code>            "target": "Summary!B6",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 74 | <code>            "style": {</code> | 结构化数据字段 `style`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 75 | <code>              "fill": "#10B981",</code> | 结构化数据字段 `fill`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 76 | <code>              "font": { "bold": true, "color": "#FFFFFF" },</code> | 结构化数据字段 `font`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 77 | <code>              "alignment": { "horizontal": "center" }</code> | 结构化数据字段 `alignment`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 78 | <code>            }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 79 | <code>          },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 80 | <code>          {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 81 | <code>            "op": "range.setFormulas",</code> | 结构化数据字段 `op`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 82 | <code>            "target": "Summary!B7",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 83 | <code>            "formulas": [[{ "formula": "SUM(Data!D2:D4)+9", "result": 100 }]]</code> | 结构化数据字段 `formulas`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 84 | <code>          }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 85 | <code>        ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 86 | <code>        "verifyTarget": "Summary!A6:B7",</code> | 结构化数据字段 `verifyTarget`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 87 | <code>        "after": {</code> | 结构化数据字段 `after`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>          "allowedDiagnosticCodes": ["xlsx_formula_error"],</code> | 结构化数据字段 `allowedDiagnosticCodes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 89 | <code>          "target": "Summary!A6:B7",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 90 | <code>          "xlsx": {</code> | 结构化数据字段 `xlsx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>            "formulaErrorCount": 1,</code> | 结构化数据字段 `formulaErrorCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>            "cells": [</code> | 结构化数据字段 `cells`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 93 | <code>              { "ref": "Summary!B6", "value": "OK", "fillRgb": "10B981" },</code> | 结构化数据字段 `ref`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 94 | <code>              { "ref": "Summary!B7", "formula": "SUM(Data!D2:D4)+9" }</code> | 结构化数据字段 `ref`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 95 | <code>            ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 96 | <code>          }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 97 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 98 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 99 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 100 | <code>    "checks": ["declarative edit", "export", "roundtrip reopen", "style equality", "formula equality"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 101 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 102 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 103 | <code>    "id": "xlsx_render_trace_recalculate",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 104 | <code>    "artifactKind": "workbook",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 105 | <code>    "format": "xlsx",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 106 | <code>    "input": "evals/artifact-tools/fixtures/xlsx/formula-style-model.xlsx",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 107 | <code>    "goal": "Render a real XLSX range to PNG, trace formula dependencies, change an input, recalculate a dependent formula, export, and reopen.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 108 | <code>    "requiredCapabilities": ["load", "inspect", "render", "trace", "recalculate", "export", "roundtrip"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 109 | <code>    "expectedEvidence": ["png render", "formula graph", "dependency refs", "updated cached formula result", "reopened workbook"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 110 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 111 | <code>      "allowedDiagnosticCodes": ["xlsx_formula_error"],</code> | 结构化数据字段 `allowedDiagnosticCodes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 112 | <code>      "render": {</code> | 结构化数据字段 `render`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 113 | <code>        "target": "Summary!A1:D7",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 114 | <code>        "scale": 2</code> | 结构化数据字段 `scale`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 115 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 116 | <code>      "xlsx": {</code> | 结构化数据字段 `xlsx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 117 | <code>        "sheetNames": ["Data", "Summary"],</code> | 结构化数据字段 `sheetNames`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 118 | <code>        "minimumFormulaCount": 5,</code> | 结构化数据字段 `minimumFormulaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 119 | <code>        "formulaErrorCount": 1</code> | 结构化数据字段 `formulaErrorCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 120 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 121 | <code>      "formulaTrace": {</code> | 结构化数据字段 `formulaTrace`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 122 | <code>        "target": "Summary!B3",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 123 | <code>        "maxDepth": 5,</code> | 结构化数据字段 `maxDepth`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 124 | <code>        "mustReference": ["Data!D2:D4", "Data!D2", "Data!B2"]</code> | 结构化数据字段 `mustReference`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 125 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 126 | <code>      "recalculate": {</code> | 结构化数据字段 `recalculate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 127 | <code>        "beforeOperations": [</code> | 结构化数据字段 `beforeOperations`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 128 | <code>          {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 129 | <code>            "op": "range.setValues",</code> | 结构化数据字段 `op`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 130 | <code>            "target": "Data!B2",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 131 | <code>            "values": [[10]]</code> | 结构化数据字段 `values`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 132 | <code>          }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 133 | <code>        ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 134 | <code>        "target": "Summary!B3",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 135 | <code>        "after": {</code> | 结构化数据字段 `after`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 136 | <code>          "allowedDiagnosticCodes": ["xlsx_formula_error"],</code> | 结构化数据字段 `allowedDiagnosticCodes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 137 | <code>          "target": "Summary!B3",</code> | 结构化数据字段 `target`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 138 | <code>          "xlsx": {</code> | 结构化数据字段 `xlsx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 139 | <code>            "formulaErrorCount": 1,</code> | 结构化数据字段 `formulaErrorCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 140 | <code>            "cells": [</code> | 结构化数据字段 `cells`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 141 | <code>              { "ref": "Summary!B3", "value": 187, "formula": "SUM(Data!D2:D4)", "fillRgb": "DCFCE7" }</code> | 结构化数据字段 `ref`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 142 | <code>            ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 143 | <code>          }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 144 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 145 | <code>      }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 146 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 147 | <code>    "checks": ["png render", "formula trace", "local recalculate", "export reopen"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 148 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 149 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 150 | <code>    "id": "xlsx_search_index_observation",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 151 | <code>    "artifactKind": "workbook",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 152 | <code>    "format": "xlsx",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 153 | <code>    "input": "evals/artifact-tools/fixtures/xlsx/formula-style-model.xlsx",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 154 | <code>    "goal": "Build an XLSX index and search compact candidate evidence across text, styles, formulas, errors, tables, merges, comments, defined names, hidden structure, package inventory, and table queries.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 155 | <code>    "requiredCapabilities": ["load", "index", "search", "query", "inspect"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 156 | <code>    "expectedEvidence": ["candidate cells", "style matches", "formula matches", "error matches", "table inventory", "merge inventory", "comment inventory", "defined names", "hidden rows", "image anchors", "query aggregates"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 157 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 158 | <code>      "allowedDiagnosticCodes": ["xlsx_formula_error"],</code> | 结构化数据字段 `allowedDiagnosticCodes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 159 | <code>      "xlsx": {</code> | 结构化数据字段 `xlsx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 160 | <code>        "sheetNames": ["Data", "Summary"],</code> | 结构化数据字段 `sheetNames`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 161 | <code>        "requiredTables": ["SalesTable"],</code> | 结构化数据字段 `requiredTables`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 162 | <code>        "requiredMerges": ["Summary!A1:D1"],</code> | 结构化数据字段 `requiredMerges`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 163 | <code>        "minimumFormulaCount": 5,</code> | 结构化数据字段 `minimumFormulaCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 164 | <code>        "formulaErrorCount": 1</code> | 结构化数据字段 `formulaErrorCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 165 | <code>      },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 166 | <code>      "searches": [</code> | 结构化数据字段 `searches`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 167 | <code>        { "searchKind": "text", "query": "Alpha", "mustReference": ["Data!A2"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 168 | <code>        { "searchKind": "style", "fillRgb": "DCFCE7", "mustReference": ["Summary!B3"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 169 | <code>        { "searchKind": "formula", "query": "Data!D2:D4", "mustReference": ["Summary!B3"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 170 | <code>        { "searchKind": "error", "error": "#REF", "mustReference": ["Summary!B4"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 171 | <code>        { "searchKind": "table", "query": "SalesTable", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 172 | <code>        { "searchKind": "merge", "query": "Summary!A1:D1", "mustReference": ["Summary!A1:D1"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 173 | <code>        { "searchKind": "comment", "query": "artifact_search", "mustReference": ["Data!A2"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 174 | <code>        { "searchKind": "definedName", "query": "TotalRevenue", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 175 | <code>        { "searchKind": "hidden", "query": "Beta", "mustReference": ["Data!A3"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 176 | <code>        { "searchKind": "image", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 177 | <code>        { "searchKind": "imageAnchor", "query": "Summary", "minimumMatches": 1 }</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 178 | <code>      ],</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 179 | <code>      "queries": [</code> | 结构化数据字段 `queries`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 180 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 181 | <code>          "table": "SalesTable",</code> | 结构化数据字段 `table`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 182 | <code>          "aggregate": { "op": "max", "column": "Revenue" },</code> | 结构化数据字段 `aggregate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 183 | <code>          "sortBy": "Revenue",</code> | 结构化数据字段 `sortBy`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 184 | <code>          "top": 1,</code> | 结构化数据字段 `top`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 185 | <code>          "aggregateValue": 45,</code> | 结构化数据字段 `aggregateValue`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 186 | <code>          "mustReference": ["Data!A3:D3"]</code> | 结构化数据字段 `mustReference`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 187 | <code>        },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 188 | <code>        {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 189 | <code>          "table": "SalesTable",</code> | 结构化数据字段 `table`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 190 | <code>          "groupBy": "Item",</code> | 结构化数据字段 `groupBy`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 191 | <code>          "aggregate": { "op": "sum", "column": "Revenue" },</code> | 结构化数据字段 `aggregate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 192 | <code>          "topGroups": 3,</code> | 结构化数据字段 `topGroups`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 193 | <code>          "mustGroups": [{ "key": "Beta", "value": 45 }]</code> | 结构化数据字段 `mustGroups`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 194 | <code>        }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 195 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 196 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 197 | <code>    "checks": ["xlsx index cache", "artifact search", "artifact query", "compact observation"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 198 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 199 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 200 | <code>    "id": "pdf_text_layer_search",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 201 | <code>    "artifactKind": "pdf",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 202 | <code>    "format": "pdf",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 203 | <code>    "input": "evals/artifact-tools/fixtures/pdf/text-layer-report.pdf",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 204 | <code>    "goal": "Search text-layer spans and cite page evidence without OCR.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 205 | <code>    "requiredCapabilities": ["load", "inspect", "search", "render"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 206 | <code>    "expectedEvidence": ["page number", "text span", "coordinates"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 207 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 208 | <code>      "pageCount": 1,</code> | 结构化数据字段 `pageCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 209 | <code>      "mustContainText": "deterministic text evidence",</code> | 结构化数据字段 `mustContainText`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 210 | <code>      "mustHaveTextLayer": true,</code> | 结构化数据字段 `mustHaveTextLayer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 211 | <code>      "minimumTextSpanCount": 3,</code> | 结构化数据字段 `minimumTextSpanCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 212 | <code>      "searches": [</code> | 结构化数据字段 `searches`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 213 | <code>        { "searchKind": "text", "query": "deterministic text evidence", "mustReference": ["page:1"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 214 | <code>        { "searchKind": "span", "query": "deterministic", "minimumMatches": 1 }</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 215 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 216 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 217 | <code>    "checks": ["text match", "page render nonblank"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 218 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 219 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 220 | <code>    "id": "docx_render_layout_gate",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 221 | <code>    "artifactKind": "document",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 222 | <code>    "format": "docx",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 223 | <code>    "input": "evals/artifact-tools/fixtures/docx/report-with-tables.docx",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 224 | <code>    "goal": "Render DOCX pages and detect layout failures before delivery.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 225 | <code>    "requiredCapabilities": ["load", "inspect", "render", "validate"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 226 | <code>    "expectedEvidence": ["page images", "layout diagnostics"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 227 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 228 | <code>      "mustContainText": "END-DOCX-FIXTURE",</code> | 结构化数据字段 `mustContainText`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 229 | <code>      "minimumParagraphCount": 4,</code> | 结构化数据字段 `minimumParagraphCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 230 | <code>      "minimumTableCount": 1,</code> | 结构化数据字段 `minimumTableCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 231 | <code>      "minimumImageCount": 1,</code> | 结构化数据字段 `minimumImageCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 232 | <code>      "minimumCommentCount": 1,</code> | 结构化数据字段 `minimumCommentCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 233 | <code>      "searches": [</code> | 结构化数据字段 `searches`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 234 | <code>        { "searchKind": "paragraph", "query": "END-DOCX-FIXTURE", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 235 | <code>        { "searchKind": "table", "query": "Metric", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 236 | <code>        { "searchKind": "comment", "query": "DOCX-COMMENT-ASSET", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 237 | <code>        { "searchKind": "image", "minimumMatches": 1 }</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 238 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 239 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 240 | <code>    "checks": ["render nonblank", "no fatal diagnostics"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 241 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 242 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 243 | <code>    "id": "pptx_render_contact_sheet",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 244 | <code>    "artifactKind": "presentation",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 245 | <code>    "format": "pptx",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 246 | <code>    "input": "evals/artifact-tools/fixtures/pptx/template-edit.pptx",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 247 | <code>    "goal": "Render slide previews and verify slide inventory.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 248 | <code>    "requiredCapabilities": ["load", "inspect", "render", "validate"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 249 | <code>    "expectedEvidence": ["slide count", "rendered slides"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 250 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 251 | <code>      "slideCount": 2,</code> | 结构化数据字段 `slideCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 252 | <code>      "mustContainText": "Adapter Roundtrip",</code> | 结构化数据字段 `mustContainText`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 253 | <code>      "minimumImageCount": 1,</code> | 结构化数据字段 `minimumImageCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 254 | <code>      "minimumTableCount": 1,</code> | 结构化数据字段 `minimumTableCount`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 255 | <code>      "searches": [</code> | 结构化数据字段 `searches`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 256 | <code>        { "searchKind": "slide", "query": "Adapter Roundtrip", "mustReference": ["slide:2"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 257 | <code>        { "searchKind": "text", "query": "Slide inventory fixture", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 258 | <code>        { "searchKind": "image", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 259 | <code>        { "searchKind": "table", "minimumMatches": 1 }</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 260 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 261 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 262 | <code>    "checks": ["render nonblank", "slide inventory"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 263 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 264 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 265 | <code>    "id": "image_metadata_nonblank",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 266 | <code>    "artifactKind": "image",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 267 | <code>    "format": "png",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 268 | <code>    "input": "evals/artifact-tools/fixtures/image/nonblank-swatch.png",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 269 | <code>    "goal": "Inspect image metadata, dominant colors, nonblank visual statistics, and render a thumbnail preview without OCR or vision models.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 270 | <code>    "requiredCapabilities": ["load", "inspect", "index", "search", "render", "validate"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 271 | <code>    "expectedEvidence": ["dimensions", "dominant colors", "nonblank visual check"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 272 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 273 | <code>      "width": 320,</code> | 结构化数据字段 `width`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 274 | <code>      "height": 180,</code> | 结构化数据字段 `height`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 275 | <code>      "nonblank": true,</code> | 结构化数据字段 `nonblank`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 276 | <code>      "mustContainColor": "10B981",</code> | 结构化数据字段 `mustContainColor`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 277 | <code>      "searches": [</code> | 结构化数据字段 `searches`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 278 | <code>        { "searchKind": "metadata", "query": "320x180", "mustReference": ["image:metadata"] },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 279 | <code>        { "searchKind": "color", "fillRgb": "10B981", "minimumMatches": 1 },</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 280 | <code>        { "searchKind": "visual", "query": "nonBlankRatio", "minimumMatches": 1 }</code> | 结构化数据字段 `searchKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 281 | <code>      ]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 282 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 283 | <code>    "checks": ["metadata", "dominant color search", "render nonblank"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 284 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 285 | <code>  {</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 286 | <code>    "id": "csv_schema_inference",</code> | 结构化数据字段 `id`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 287 | <code>    "artifactKind": "table",</code> | 结构化数据字段 `artifactKind`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 288 | <code>    "format": "csv",</code> | 结构化数据字段 `format`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 289 | <code>    "input": "evals/artifact-tools/fixtures/csv/dirty-data.csv",</code> | 结构化数据字段 `input`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 290 | <code>    "goal": "Infer schema, detect malformed rows, and produce table diagnostics.",</code> | 结构化数据字段 `goal`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 291 | <code>    "requiredCapabilities": ["load", "inspect", "validate"],</code> | 结构化数据字段 `requiredCapabilities`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 292 | <code>    "expectedEvidence": ["headers", "types", "malformed rows"],</code> | 结构化数据字段 `expectedEvidence`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 293 | <code>    "expected": {</code> | 结构化数据字段 `expected`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 294 | <code>      "headers": ["id", "name", "score", "joined", "active"],</code> | 结构化数据字段 `headers`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 295 | <code>      "malformedRowNumbers": [5, 6]</code> | 结构化数据字段 `malformedRowNumbers`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 296 | <code>    },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 297 | <code>    "checks": ["schema inference", "diagnostics"]</code> | 结构化数据字段 `checks`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 298 | <code>  }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 299 | <code>]</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
