using System;
using System.Collections;
using System.IO;
using UnityEngine;
using UnityEngine.Profiling;

namespace Ailis.CharacterDemo
{
    public sealed class AilisCharacterDemoBootstrap : MonoBehaviour
    {
        private const float HitTestBoundsRefreshIntervalSeconds = 0.16f;
        private const float HitTestBoundsChangeThresholdPixels = 1.5f;

        [Serializable]
        private sealed class BenchmarkSnapshot
        {
            public float startupSeconds;
            public float sampleSeconds;
            public float averageFps;
            public long unityAllocatedBytes;
            public string graphicsDevice;
            public int graphicsMemoryMb;
            public int systemMemoryMb;
            public string packageId;
            public string adapterId;
            public string modelPath;
            public string pipelineAsset;
            public int windowWidth;
            public int windowHeight;
            public float renderScale;
            public int msaaSampleCount;
            public bool transparent;
        }

        private IAilisAvatarAdapter _avatar;
        private AilisCharacterPackage _package;
        private AilisRendererSettings _settings;
        private AilisRendererWindow _initialWindow;
        private AilisRenderDirector _renderDirector;
        private AilisPersonaSurfaceReceiver _receiver;
        private AilisTransparentWindowBridge _windowBridge;
        private AilisRendererEventClient _eventClient;
        private AilisPcmLipSyncDriver _pcmLipSync;
        private AilisAvatarHitTestMask _hitTestMask;
        private string _status = "starting";
        private float _smoothedFrameTime;
        private float _nextHitTestBoundsRefreshAt;
        private Rect _lastHitTestBounds;
        private bool _hasLastHitTestBounds;
        private string _lastHitTestMask = "";
        private string _activeBaseMotionId = "";
        private string _lastGestureRequestId = "";
        private bool _windowDragActive;
        private int _defaultMaxQueuedFrames;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Create()
        {
            if (AilisMotionCompatibilityRunner.IsRequested)
            {
                var validationRoot =
                    new GameObject("AILIS Motion Compatibility Runtime");
                DontDestroyOnLoad(validationRoot);
                validationRoot.AddComponent<
                    AilisMotionCompatibilityRunner>();
                return;
            }
            if (FindObjectOfType<AilisCharacterDemoBootstrap>() != null)
            {
                return;
            }
            AilisVrmAvatarController.RegisterAdapter();
            AilisAssetBundleAvatarAdapter.RegisterAdapter();
            var root = new GameObject("AILIS Character Runtime");
            DontDestroyOnLoad(root);
            root.AddComponent<AilisCharacterDemoBootstrap>();
        }

        private async void Awake()
        {
            _defaultMaxQueuedFrames = QualitySettings.maxQueuedFrames;
            var packagedSettingsPath = Path.Combine(
                Application.streamingAssetsPath,
                "ailis-renderer-settings.json");
            var bootstrapSettingsPath = ReadPathArgument("--settings-file", "");
            _settings = AilisRendererSettingsStore.LoadFromPath(bootstrapSettingsPath) ??
                AilisRendererSettingsStore.Load(packagedSettingsPath);
            ApplyCommandLineSettings(_settings);
            _initialWindow = new AilisRendererWindow
            {
                x = ReadIntArgument("--x", 0),
                y = ReadIntArgument("--y", 0),
                width = Mathf.Clamp(ReadIntArgument("--width", 720), 180, 2160),
                height = Mathf.Clamp(ReadIntArgument("--height", 960), 240, 2880)
            };
            if (!Application.isEditor)
            {
                Screen.SetResolution(
                    _initialWindow.width,
                    _initialWindow.height,
                    FullScreenMode.Windowed);
            }

            var modelPath = ReadPathArgument(
                "--model",
                Path.Combine(Application.streamingAssetsPath, "AILIS.vrm"));
            var motionPath = ReadPathArgument(
                "--motion",
                Path.Combine(Application.streamingAssetsPath, "Motions", "Idle.vrma"));
            var manifestPath = ReadPathArgument(
                "--character-package",
                Path.Combine(Application.streamingAssetsPath, "ailis-character.json"));
            _package = AilisCharacterPackage.Load(manifestPath, modelPath, motionPath);
            Debug.Log("[AILIS Renderer] Character package loaded: " + _package.ManifestPath);

            _renderDirector = gameObject.AddComponent<AilisRenderDirector>();
            _renderDirector.SetOutputSize(_initialWindow.width, _initialWindow.height);
            var portraitCamera = _renderDirector.Initialize(_settings, _package.Manifest.art);
            _hitTestMask = gameObject.AddComponent<AilisAvatarHitTestMask>();
            _hitTestMask.Configure(portraitCamera);
            Debug.Log("[AILIS Renderer] Render director initialized.");
            _windowBridge = gameObject.AddComponent<AilisTransparentWindowBridge>();
            _windowBridge.Initialize(portraitCamera, _initialWindow);
            Debug.Log("[AILIS Renderer] Transparent window bridge initialized.");

            var avatarHost = new GameObject("AILIS Avatar Adapter - " + _package.Manifest.adapter);
            avatarHost.transform.SetParent(transform, false);
            _avatar = AilisAvatarAdapterRegistry.Create(_package.Manifest.adapter, avatarHost);
            ApplyAvatarRenderingSettings();
            Debug.Log("[AILIS Renderer] Avatar adapter created: " + _package.Manifest.adapter);

            _receiver = gameObject.AddComponent<AilisPersonaSurfaceReceiver>();
            _receiver.MessageReceived += HandleMessage;
            _receiver.StartReceiver(ReadIntArgument("--port", AilisPersonaSurfaceProtocol.DefaultPort));
            _eventClient = new AilisRendererEventClient();
            _eventClient.Configure(ReadIntArgument("--event-port", AilisPersonaSurfaceProtocol.DefaultPort + 1));
            Debug.Log("[AILIS Renderer] IPC channels initialized.");

            try
            {
                _status = "loading_character";
                Debug.Log("[AILIS Renderer] Loading avatar: " + _package.ModelPath);
                await _avatar.LoadAsync(_package);
                _pcmLipSync = gameObject.AddComponent<AilisPcmLipSyncDriver>();
                if (!_pcmLipSync.Configure(_avatar))
                {
                    Debug.LogWarning(
                        "[AILIS Renderer] PCM lip sync unavailable: " +
                        _pcmLipSync.Status);
                }
                if (_avatar.TryGetWorldBounds(out var avatarBounds))
                {
                    _renderDirector.FrameAvatar(avatarBounds, _package.Manifest.art);
                    var camera = _renderDirector.PortraitCamera;
                    Debug.Log(
                        "[AILIS Renderer] Avatar framing: boundsCenter=" +
                        avatarBounds.center.ToString("F3") +
                        ", boundsSize=" +
                        avatarBounds.size.ToString("F3") +
                        ", cameraPosition=" +
                        camera.transform.position.ToString("F3") +
                        ", cameraForward=" +
                        camera.transform.forward.ToString("F3") +
                        ", near=" +
                        camera.nearClipPlane.ToString("F3") +
                        ", far=" +
                        camera.farClipPlane.ToString("F3") +
                        ", cullingMask=" +
                        camera.cullingMask);
                }
                _windowBridge.FinalizeNativePresentation();
                _status = "ready";
                SendRendererEvent("renderer.ready", "ready");
                PublishAvatarHitTestBounds(force: true);
                Debug.Log(
                    "[AILIS Renderer] Ready in " +
                    Time.realtimeSinceStartup.ToString("0.000") +
                    " seconds with " + _avatar.AdapterId + ".");
                StartBenchmarkIfRequested();
            }
            catch (Exception error)
            {
                _status = "failed: " + error.Message;
                Debug.LogException(error);
            }
        }

        private async void HandleMessage(AilisCharacterMessage message)
        {
            try
            {
                switch (message.type)
                {
                    case "persona.surface":
                        _avatar.ApplySurface(message.surface);
                        var baseMotion = _package.SelectBaseMotion(message.surface);
                        if (baseMotion != null &&
                            !string.Equals(
                                baseMotion.id,
                                _activeBaseMotionId,
                                StringComparison.OrdinalIgnoreCase))
                        {
                            if (await _avatar.PlayMotionAsync(baseMotion))
                            {
                                _activeBaseMotionId = baseMotion.id ?? "";
                            }
                        }
                        var oneShotMotion = _package.SelectOneShotMotion(message.surface);
                        var gestureRequestId =
                            (message.requestId ?? "") + ":" + (oneShotMotion?.id ?? "");
                        if (oneShotMotion != null &&
                            !string.Equals(
                                gestureRequestId,
                                _lastGestureRequestId,
                                StringComparison.Ordinal))
                        {
                            _lastGestureRequestId = gestureRequestId;
                            await _avatar.PlayMotionAsync(oneShotMotion);
                        }
                        break;
                    case "persona.lip":
                        _avatar.ApplyLip(message.lip);
                        break;
                    case "persona.speech.start":
                        if (string.Equals(
                                message.mode,
                                "audio",
                                StringComparison.OrdinalIgnoreCase))
                        {
                            _pcmLipSync?.BeginSpeech();
                            _avatar.ApplyLip(new AilisLipFrame
                            {
                                mode = "viseme",
                                viseme = "aa",
                                weight = 0f,
                                durationSeconds = 60f,
                                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                            });
                        }
                        break;
                    case "persona.audio.samples":
                        _pcmLipSync?.PushSamples(message.audio);
                        break;
                    case "persona.speech.stop":
                        _pcmLipSync?.EndSpeech();
                        _avatar.ApplyLip(new AilisLipFrame
                        {
                            weight = 0f,
                            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                        });
                        break;
                    case "character.action":
                        var motion = _package.FindMotion(message.action.motionId);
                        if (motion == null)
                        {
                            Debug.LogWarning("[AILIS Renderer] Unknown motion: " + message.action.motionId);
                            SendActionResult(
                                message.requestId,
                                message.action.motionId,
                                false,
                                "unknown_motion");
                        }
                        else
                        {
                            var played = await _avatar.PlayMotionAsync(motion);
                            SendActionResult(
                                message.requestId,
                                motion.id,
                                played,
                                _avatar.Status);
                        }
                        break;
                    case "character.animation.state.request":
                        SendAnimationStateEvent(
                            message.requestId,
                            "snapshot");
                        break;
                    case "character.animation.control":
                        var debugApplied =
                            _avatar is IAilisAnimationDebugAdapter debugAdapter &&
                            debugAdapter.ApplyAnimationDebugControl(
                                message.animationDebug);
                        SendAnimationStateEvent(
                            message.requestId,
                            debugApplied ? message.animationDebug.operation : "unsupported");
                        break;
                    case "renderer.configure":
                        ApplyRendererConfiguration(message.renderer);
                        break;
                    case "renderer.capture.request":
                        StartCoroutine(CaptureRuntimeFrame(
                            message.requestId,
                            message.capture));
                        break;
                    case "renderer.window":
                        {
                            var phase = message.window.phase ?? "sync";
                            var isDragBegin = string.Equals(
                                phase,
                                "drag_begin",
                                StringComparison.OrdinalIgnoreCase);
                            var isLegacyDrag = string.Equals(
                                phase,
                                "drag",
                                StringComparison.OrdinalIgnoreCase);
                            if (!isDragBegin && !isLegacyDrag)
                            {
                                _windowBridge.EndExternalDrag();
                                SetWindowDragActive(false);
                            }
                            var outputSizeChanged = _renderDirector.SetOutputSize(
                                message.window.width,
                                message.window.height);
                            _windowBridge.ApplyWindowBounds(
                                message.window,
                                resizeWindow: outputSizeChanged);
                            if (outputSizeChanged)
                            {
                                _renderDirector.Apply(
                                    _settings,
                                    _package.Manifest.art,
                                    resizeWindow: false);
                                StartCoroutine(ReframeAfterWindowResize());
                            }
                            if (isDragBegin)
                            {
                                SetWindowDragActive(
                                    _windowBridge.BeginExternalDrag(_lastHitTestBounds));
                            }
                            else if (isLegacyDrag)
                            {
                                SetWindowDragActive(true);
                            }
                            if (string.Equals(
                                    phase,
                                    "settle",
                                    StringComparison.OrdinalIgnoreCase))
                            {
                                SendRendererEvent("renderer.window.settled", "settled");
                            }
                            break;
                        }
                }
            }
            catch (Exception error)
            {
                Debug.LogWarning("[AILIS Renderer] Command failed: " + error.Message);
                if (string.Equals(
                        message?.type,
                        "character.action",
                        StringComparison.Ordinal))
                {
                    SendActionResult(
                        message.requestId,
                        message.action?.motionId ?? "",
                        false,
                        error.Message);
                }
            }
        }

        private void SendActionResult(
            string requestId,
            string motionId,
            bool played,
            string detail)
        {
            _eventClient?.Send(new AilisRendererEvent
            {
                type = "character.action.result",
                action = motionId ?? "",
                source = "unity",
                requestId = requestId ?? "",
                status = played ? "played" : "failed",
                detail = detail ?? "",
                complete = true,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            });
        }

        private IEnumerator CaptureRuntimeFrame(
            string requestId,
            AilisRendererCapture capture)
        {
            var resolvedPath = Path.GetFullPath(capture.path);
            var directory = Path.GetDirectoryName(resolvedPath);
            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            yield return new WaitForEndOfFrame();
            ScreenCapture.CaptureScreenshot(
                resolvedPath,
                Mathf.Clamp(capture.superSize, 1, 4));

            var deadline = Time.realtimeSinceStartup + 5f;
            while ((!File.Exists(resolvedPath) ||
                    new FileInfo(resolvedPath).Length == 0) &&
                   Time.realtimeSinceStartup < deadline)
            {
                yield return null;
            }

            var captured = File.Exists(resolvedPath) &&
                           new FileInfo(resolvedPath).Length > 0;
            _eventClient?.Send(new AilisRendererEvent
            {
                type = "renderer.capture.completed",
                action = "capture",
                source = "unity",
                requestId = requestId ?? "",
                status = captured ? "captured" : "failed",
                detail = resolvedPath,
                complete = true,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            });
        }

        private void ApplyRendererConfiguration(AilisRendererSettings incoming)
        {
            if (incoming == null)
            {
                return;
            }
            incoming.Normalize();
            if (_settings != null &&
                string.Equals(
                    JsonUtility.ToJson(_settings),
                    JsonUtility.ToJson(incoming),
                    StringComparison.Ordinal))
            {
                return;
            }
            _settings = incoming;
            _renderDirector.Apply(_settings, _package.Manifest.art, resizeWindow: false);
            ApplyAvatarRenderingSettings();
            _windowBridge.ApplyPresentationSettings();
            if (_avatar != null && _avatar.TryGetWorldBounds(out var avatarBounds))
            {
                _renderDirector.FrameAvatar(avatarBounds, _package.Manifest.art);
            }
            AilisRendererSettingsStore.Save(_settings);
            PublishAvatarHitTestBounds(force: true);
            Debug.Log("[AILIS Renderer] Settings saved: " + AilisRendererSettingsStore.PersistentPath);
        }

        private void SetWindowDragActive(bool active)
        {
            if (_windowDragActive == active)
            {
                return;
            }
            _windowDragActive = active;
            if (active)
            {
                QualitySettings.maxQueuedFrames = 1;
                QualitySettings.vSyncCount = 1;
                Application.targetFrameRate = -1;
                return;
            }

            QualitySettings.maxQueuedFrames = _defaultMaxQueuedFrames;
            QualitySettings.vSyncCount = 0;
            Application.targetFrameRate = _settings.targetFrameRate;
            _nextHitTestBoundsRefreshAt = 0f;
        }

        private void ApplyAvatarRenderingSettings()
        {
            if (_avatar is IAilisAvatarRenderingAdapter renderingAdapter)
            {
                renderingAdapter.ApplyRenderingSettings(_settings);
            }
        }

        private IEnumerator ReframeAfterWindowResize()
        {
            yield return null;
            yield return new WaitForEndOfFrame();
            if (_avatar != null && _avatar.TryGetWorldBounds(out var avatarBounds))
            {
                _renderDirector.FrameAvatar(avatarBounds, _package.Manifest.art);
            }
            PublishAvatarHitTestBounds(force: true);
        }

        private void ApplyCommandLineSettings(AilisRendererSettings settings)
        {
            var quality = ReadArgument("--quality");
            if (!string.IsNullOrWhiteSpace(quality))
            {
                settings.ApplyPipelineProfile(quality);
            }
            settings.targetFrameRate = ReadIntArgument("--fps", settings.targetFrameRate);
            settings.msaaSampleCount = ReadIntArgument("--aa", settings.msaaSampleCount);
            settings.showDebugOverlay = ReadBoolArgument("--debug-overlay", settings.showDebugOverlay);
            settings.Normalize();
        }

        private void Update()
        {
            if (Input.GetKeyDown(KeyCode.F1))
            {
                _settings.showDebugOverlay = !_settings.showDebugOverlay;
            }
            _smoothedFrameTime = Mathf.Lerp(
                _smoothedFrameTime,
                Time.unscaledDeltaTime,
                0.08f);
            if (_windowDragActive && _windowBridge.UpdateExternalDrag())
            {
                SetWindowDragActive(false);
                SendRendererEvent("renderer.window.drag_released", "released");
            }
            if (!_windowDragActive &&
                _status == "ready" &&
                Time.unscaledTime >= _nextHitTestBoundsRefreshAt)
            {
                _nextHitTestBoundsRefreshAt = Time.unscaledTime + HitTestBoundsRefreshIntervalSeconds;
                PublishAvatarHitTestBounds();
            }
        }

        private void PublishAvatarHitTestBounds(bool force = false)
        {
            if (_hitTestMask != null &&
                _hitTestMask.TryCapture(out var maskData))
            {
                if (!force &&
                    _hasLastHitTestBounds &&
                    !HasBoundsChanged(_lastHitTestBounds, maskData.Bounds) &&
                    string.Equals(
                        _lastHitTestMask,
                        maskData.MaskBase64,
                        StringComparison.Ordinal))
                {
                    return;
                }

                _lastHitTestBounds = maskData.Bounds;
                _lastHitTestMask = maskData.MaskBase64;
                _hasLastHitTestBounds = true;
                SendRendererEvent(
                    "renderer.hit_test_bounds",
                    "update",
                    maskData.Bounds,
                    maskData);
                return;
            }

            if (!TryGetAvatarScreenBounds(out var screenBounds))
            {
                return;
            }
            if (!force && _hasLastHitTestBounds && !HasBoundsChanged(_lastHitTestBounds, screenBounds))
            {
                return;
            }

            _lastHitTestBounds = screenBounds;
            _hasLastHitTestBounds = true;
            SendRendererEvent("renderer.hit_test_bounds", "update", screenBounds);
        }

        private bool TryGetAvatarScreenBounds(out Rect screenBounds)
        {
            screenBounds = default;
            var camera = _renderDirector != null ? _renderDirector.PortraitCamera : null;
            if (camera == null || _avatar == null || !_avatar.TryGetWorldBounds(out var worldBounds))
            {
                return false;
            }

            var min = worldBounds.min;
            var max = worldBounds.max;
            var minX = float.PositiveInfinity;
            var minY = float.PositiveInfinity;
            var maxX = float.NegativeInfinity;
            var maxY = float.NegativeInfinity;
            var visibleCorners = 0;
            for (var x = 0; x < 2; x++)
            {
                for (var y = 0; y < 2; y++)
                {
                    for (var z = 0; z < 2; z++)
                    {
                        var worldPoint = new Vector3(
                            x == 0 ? min.x : max.x,
                            y == 0 ? min.y : max.y,
                            z == 0 ? min.z : max.z);
                        var projected = camera.WorldToScreenPoint(worldPoint);
                        if (projected.z <= camera.nearClipPlane)
                        {
                            continue;
                        }
                        minX = Mathf.Min(minX, projected.x);
                        minY = Mathf.Min(minY, projected.y);
                        maxX = Mathf.Max(maxX, projected.x);
                        maxY = Mathf.Max(maxY, projected.y);
                        visibleCorners++;
                    }
                }
            }

            if (visibleCorners == 0 || Screen.width <= 0 || Screen.height <= 0)
            {
                return false;
            }

            var left = Mathf.Clamp(minX, 0f, Screen.width);
            var right = Mathf.Clamp(maxX, 0f, Screen.width);
            var top = Mathf.Clamp(Screen.height - maxY, 0f, Screen.height);
            var bottom = Mathf.Clamp(Screen.height - minY, 0f, Screen.height);
            if (right - left < 2f || bottom - top < 2f)
            {
                return false;
            }
            screenBounds = Rect.MinMaxRect(left, top, right, bottom);
            return true;
        }

        private static bool HasBoundsChanged(Rect previous, Rect current)
        {
            return Mathf.Abs(previous.x - current.x) > HitTestBoundsChangeThresholdPixels ||
                Mathf.Abs(previous.y - current.y) > HitTestBoundsChangeThresholdPixels ||
                Mathf.Abs(previous.width - current.width) > HitTestBoundsChangeThresholdPixels ||
                Mathf.Abs(previous.height - current.height) > HitTestBoundsChangeThresholdPixels;
        }

        private void SendRendererEvent(
            string type,
            string action,
            Rect? bounds = null,
            AilisAvatarHitTestMaskData maskData = null)
        {
            var rendererEvent = new AilisRendererEvent
            {
                type = type,
                action = action,
                source = "unity",
                shape = maskData != null
                    ? "mask"
                    : type == "renderer.hit_test_bounds"
                        ? "ellipse"
                        : "",
                status = _status,
                complete = true,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            };
            if (bounds.HasValue)
            {
                rendererEvent.x = bounds.Value.x;
                rendererEvent.y = bounds.Value.y;
                rendererEvent.width = bounds.Value.width;
                rendererEvent.height = bounds.Value.height;
            }
            if (maskData != null)
            {
                rendererEvent.maskEncoding = "bitset-base64-v1";
                rendererEvent.mask = maskData.MaskBase64;
                rendererEvent.maskWidth = maskData.MaskWidth;
                rendererEvent.maskHeight = maskData.MaskHeight;
            }
            _eventClient?.Send(rendererEvent);
        }

        private void SendAnimationStateEvent(
            string requestId,
            string action)
        {
            var animation = _avatar is IAilisAnimationDebugAdapter debugAdapter
                ? debugAdapter.GetAnimationDebugSnapshot()
                : new AilisAnimationDebugSnapshot
                {
                    supported = false,
                    ready = _avatar?.IsLoaded == true,
                    adapterId = _avatar?.AdapterId ?? "",
                    status = _avatar?.Status ?? _status,
                    timestamp =
                        DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                };
            _eventClient?.Send(new AilisRendererEvent
            {
                type = "character.animation.state",
                action = action ?? "",
                source = "unity",
                requestId = requestId ?? "",
                status = animation.ready ? "ready" : animation.status,
                complete = true,
                timestamp =
                    DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                animation = animation
            });
        }

        private void StartBenchmarkIfRequested()
        {
            var screenshotPath = ReadArgument("--screenshot");
            var metricsPath = ReadArgument("--metrics");
            if (!string.IsNullOrWhiteSpace(screenshotPath) ||
                !string.IsNullOrWhiteSpace(metricsPath))
            {
                StartCoroutine(CaptureBenchmark(screenshotPath, metricsPath));
            }
        }

        private IEnumerator CaptureBenchmark(string screenshotPath, string metricsPath)
        {
            yield return new WaitForEndOfFrame();
            if (!string.IsNullOrWhiteSpace(screenshotPath))
            {
                var resolvedScreenshotPath = Path.GetFullPath(screenshotPath);
                Directory.CreateDirectory(Path.GetDirectoryName(resolvedScreenshotPath));
                ScreenCapture.CaptureScreenshot(resolvedScreenshotPath);
                Debug.Log("[AILIS Renderer] Screenshot requested: " + resolvedScreenshotPath);
            }

            var sampleStartedAt = Time.realtimeSinceStartup;
            var frames = 0;
            while (Time.realtimeSinceStartup - sampleStartedAt < 10f)
            {
                frames += 1;
                yield return null;
            }

            if (!string.IsNullOrWhiteSpace(metricsPath))
            {
                var resolvedMetricsPath = Path.GetFullPath(metricsPath);
                Directory.CreateDirectory(Path.GetDirectoryName(resolvedMetricsPath));
                var sampleSeconds = Time.realtimeSinceStartup - sampleStartedAt;
                var snapshot = new BenchmarkSnapshot
                {
                    startupSeconds = sampleStartedAt,
                    sampleSeconds = sampleSeconds,
                    averageFps = frames / sampleSeconds,
                    unityAllocatedBytes = Profiler.GetTotalAllocatedMemoryLong(),
                    graphicsDevice = SystemInfo.graphicsDeviceName,
                    graphicsMemoryMb = SystemInfo.graphicsMemorySize,
                    systemMemoryMb = SystemInfo.systemMemorySize,
                    packageId = _package.Manifest.id,
                    adapterId = _avatar.AdapterId,
                    modelPath = _package.ModelPath,
                    pipelineAsset = _settings.pipelineAsset,
                    windowWidth = Screen.width,
                    windowHeight = Screen.height,
                    renderScale = _settings.renderScale,
                    msaaSampleCount = _settings.msaaSampleCount,
                    transparent = true
                };
                File.WriteAllText(resolvedMetricsPath, JsonUtility.ToJson(snapshot, true));
                Debug.Log("[AILIS Renderer] Benchmark written: " + resolvedMetricsPath);
            }
        }

        private void OnGUI()
        {
            if (_settings == null || !_settings.showDebugOverlay)
            {
                return;
            }
            GUI.color = Color.white;
            GUI.Box(new Rect(14f, 14f, 390f, 150f), "");
            GUI.Label(new Rect(28f, 24f, 350f, 24f), "AILIS Character Runtime");
            GUI.Label(new Rect(28f, 48f, 350f, 22f), "Status: " + _status);
            GUI.Label(new Rect(28f, 70f, 350f, 22f), "Adapter: " + (_avatar?.AdapterId ?? "-"));
            GUI.Label(new Rect(28f, 92f, 350f, 22f), "Window: " + (_windowBridge?.Status ?? "-"));
            GUI.Label(new Rect(28f, 114f, 350f, 22f), "UDP: 127.0.0.1:" + (_receiver?.Port ?? 0));
            var fps = _smoothedFrameTime > 0f ? 1f / _smoothedFrameTime : 0f;
            GUI.Label(
                new Rect(28f, 136f, 350f, 22f),
                "FPS: " + fps.ToString("0.0") + " | " + Screen.width + "x" + Screen.height + " | F1");
        }

        private static string ReadPathArgument(string name, string fallback)
        {
            var value = ReadArgument(name);
            var selected = string.IsNullOrWhiteSpace(value) ? fallback : value;
            return string.IsNullOrWhiteSpace(selected) ? "" : Path.GetFullPath(selected);
        }

        private static int ReadIntArgument(string name, int fallback)
        {
            return int.TryParse(ReadArgument(name), out var value) ? value : fallback;
        }

        private static bool ReadBoolArgument(string name, bool fallback)
        {
            var value = ReadArgument(name);
            if (string.IsNullOrWhiteSpace(value))
            {
                return fallback;
            }
            return string.Equals(value, "1", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(value, "true", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(value, "yes", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(value, "on", StringComparison.OrdinalIgnoreCase);
        }

        private static string ReadArgument(string name)
        {
            var args = Environment.GetCommandLineArgs();
            var index = Array.FindIndex(args, value => string.Equals(value, name, StringComparison.Ordinal));
            return index >= 0 && index + 1 < args.Length ? args[index + 1] : "";
        }

        private void OnDestroy()
        {
            if (_receiver != null)
            {
                _receiver.MessageReceived -= HandleMessage;
            }
            _avatar?.DisposeAvatar();
            _eventClient?.Dispose();
        }
    }
}
