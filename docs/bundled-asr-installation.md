# v1.4.3 默认安装包：远程合成 + 本地识别

本构建面向 Windows x64。保持原有默认配置：语音合成 `hosted`（AILIS 服务端调用微软 Edge TTS），录音模式 `fast-vad`，识别模型 `openai/whisper-small`。安装程序不再提供可选运行时勾选页；仍保留普通的安装路径选择。

## 用户需要做什么

安装 Setup 后启动 AILIS，允许麦克风访问并选对输入设备。无需另装 Python、PyTorch、CUDA 或下载 ASR 模型。首次识别仍需要加载模型，不是零等待。CPU 识别速度依赖硬件；不承诺等同于开发机的 GPU 速度。

本地 ASR 可以在无网络条件下识别。远程大模型和远程微软语音合成仍需要网络，不能将本安装包描述为“全部功能离线”。一般 Python 编程任务需要的任意第三方库也不在这项保证内。

已有用户设置不覆盖：安装包默认 hosted 不等于把已有用户的 off 强制改成 hosted。旧安装器的组件选择记录会移除，但用户数据、工作目录、外置模型不删除。

## 固定交付内容

- 原有 Electron、桌面界面、人物资源与 Agent/EXEC 代码。
- 应用私有 Python 3.12.10，不向系统注册，不修改全局 PATH。
- CPU PyTorch 2.6.0、torchaudio 2.6.0、Transformers 4.53.3 及锁定依赖。
- Whisper Small 原始 safetensors 权重、配置和 tokenizer，固定 snapshot `973afd24965f72e36ca33b3055d56a652f456b4d`。
- 第三方许可证、依赖版本/分发哈希和运行时文件 SHA-256 清单。

不包含 CosyVoice、GPU CUDA 组件、pip/uv 下载缓存、未完成模型下载、可选 Web/Search 大型运行包。保留应用对外部能力的原有配置入口，不通过改模型指令或放松权限实现兼容。

## 构建与验收

构建机运行 `node scripts/prepare-bundled-asr.mjs --model-source=<上述 snapshot 本地目录>` 准备专属运行时。uv 仅用于构建；依赖从 PyPI 和精确指定的官方 PyTorch CPU wheel 获取。完整依赖锁文件固定在 `installer/asr-requirements-win-x64.lock`，随运行时归档；发布构建不会自动升级依赖版本。

运行 `pnpm build:desktop` 后，用 `scripts/build-ailis-release.mjs --profile core --skip-frontend --output-root <全新目录>` 构建。发布入口在实际打包前逐文件验证运行时哈希；缺文件、错模型、错平台或校验失败均不得继续。

`scripts/verify-bundled-asr.cjs` 必须使用实际打包的 AILIS.exe 启动，验证全新用户目录、系统限定 PATH、故意错误的开发 Python/缓存路径、禁止 Python 网络连接的真实中文识别、静音以及实际模块来源。测试数据由 `scripts/make-asr-install-fixtures.ps1` 在构建机合成，不读取用户麦克风或私有音频。

这项自动验收不等于全新 Windows 虚拟机安装验收，也不证明所有麦克风/声卡组合。原生安装、卸载、授权弹窗和更多硬件仍需独立验收；以随交付包的实际报告为准。
