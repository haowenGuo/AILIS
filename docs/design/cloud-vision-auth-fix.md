# 托管视觉认证与能力判断修复（2026-09-22）

## 实际故障

用户在 D:\AILIS_TEST 安装版上传截图，describe_image 返回 `requires local LLM settings with vision support`。已核对实际 transcript 和安装版脚本：图片尚未发往服务器，readDesktopLlmSettings 因 keylessProvider 遗漏 ailis-cloud 而返回 null。

另一个独立问题：getProviderCapabilities 根据公开模型别名 ailis-cloud 猜测视觉能力，错误返回 false。服务器模式隐藏独立视觉模型界面，但后端仍读取旧辅助模型配置。

## 本次改动

- research 工具接受 ailis-cloud 的无个人 Key 配置，清除该配置中的旧个人 Key，仍通过现有 provider 获取托管会话认证。不改变普通 API 提供方的 Key 要求。
- 云端视觉能力不再由公开别名推断。仅接收会话响应 `capabilities.vision` 的布尔值；未声明或声明格式不正确时为 null（未确认）。按 base URL 隔离，随会话有效期过期。
- 视觉路由允许托管能力未确认时正常提交图片；这不是宣称模型已验证支持。服务器明确声明 false 时阻止图片 POST，不阻止普通文字请求。
- 401 刷新会话后重新检查声明，不无条件重发图片；保留实际认证/HTTP 错误。
- 托管 UI 模式不再采用被隐藏的旧辅助模型配置；切回直接 API 模式后旧设置仍保留。
- describe_image 的配置错误不再伪装成已经验证“没有视觉能力”。

没有新增付费探测，没有改变模型或服务器部署；现有服务器未返回能力字段时，使用未确认状态，实际图像调用仍由服务端验证。

## 验证

`node --test tests/ailis-cloud-vision.test.mjs tests/ailis-vision-model-router.test.mjs tests/desktop-llm-provider.test.mjs tests/ailis-provider-diagnostics.test.mjs`

66/66 通过，其中新增 12 项，包括真实 describe_image 入口 → mock 会话 GET → mock 图片 POST，完整 inline 图片保真、托管 Token 使用、旧个人 Key 不外发、能力三态及401刷新。

额外 research 全套测试有两项搜索测试失败（Wikipedia 聚合、python_search/SearXNG）。将本次 research 变更在测试进程内还原后，同两项仍以相同断言失败，不作为本次视觉修复的通过项，也未顺便修改搜索逻辑。

## 生效范围

修改位于 F:\AILIS\main 源码。2026-09-22 按用户后续要求完成标准 NSIS 重打包并更新 D:\AILIS_TEST，安装退出码 0；安装目录已通过源码哈希、包内工具与 mock 视觉认证链路验证，随后启动新版。构建记录：release/vision-fix-20260922/LOCAL-BUILD.md。未做线上付费视觉验证，不能把 mock 测试通过表述成 Luna 实际识图成功。
