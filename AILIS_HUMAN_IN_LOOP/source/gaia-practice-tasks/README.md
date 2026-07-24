# GAIA Practice Tasks

这两个任务来自本地缓存的 `gaia-benchmark/GAIA` validation level 1 数据。测试时建议只把“给 AILIS 的任务文本”和对应附件交给 AILIS，不要提前给标准答案。

## Task 1: Secret Santa DOCX

- Task ID: `cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb`
- Attachment: `task1-secret-santa.docx`
- Source file: `F:\AILIS\build-cache\hf-datasets\gaia-benchmark-GAIA\2023\validation\cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb.docx`

给 AILIS 的任务文本：

```text
An office held a Secret Santa gift exchange where each of its twelve employees was assigned one other employee in the group to present with a gift. Each employee filled out a profile including three likes or hobbies. On the day of the gift exchange, only eleven gifts were given, each one specific to one of the recipient's interests. Based on the information in the attached document, who did not give a gift?

Please read the attached DOCX completely, extract the people, interests, gifts, and constraints, then reason through the matching. Return only the name as the final answer, but briefly mention the evidence you used before the final answer.
```

标准答案（不要提前给 AILIS 看）：

```text
Fred
```

主要考察点：

- 是否真的读取完整 DOCX，而不是凭文件名或题目猜。
- 是否能抽取约束并做匹配推理。
- 是否能把中间证据和最终精确答案分开。

## Task 2: Excel Map Path

- Task ID: `65afbc8a-89ca-4ad5-8d62-355bb401f61d`
- Attachment: `task2-excel-map.xlsx`
- Source file: `F:\AILIS\build-cache\hf-datasets\gaia-benchmark-GAIA\2023\validation\65afbc8a-89ca-4ad5-8d62-355bb401f61d.xlsx`

给 AILIS 的任务文本：

```text
You are given the attached Excel file as a map. You start on the START cell and move toward the END cell. You are allowed to move two cells per turn, and you may move up, down, left, or right. You may not move fewer than two cells, and you may not move backward. You must avoid moving onto any blue cells.

On the eleventh turn, what is the 6-digit hex code, without prefix, of the color of the cell where you land after moving?

Please inspect the full spreadsheet, including cell colors. Do not rely on a first-rows preview. Return only the 6-digit hex code as the final answer, and briefly explain how you reconstructed the path.
```

标准答案（不要提前给 AILIS 看）：

```text
F478A7
```

主要考察点：

- 是否能读取完整 Excel，而不是只看 preview。
- 是否能拿到单元格填充颜色，而不只是文本值。
- 是否能把网格路径走满 11 步，每步 2 格。
- 是否能输出精确格式：只有 6 位 hex code，不带 `#`。
