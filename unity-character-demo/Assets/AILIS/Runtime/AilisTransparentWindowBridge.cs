using System;
using Kirurobo;
using UnityEngine;
using UnityEngine.Rendering;

namespace Ailis.CharacterDemo
{
    public sealed class AilisTransparentWindowBridge : MonoBehaviour
    {
        private static readonly Color32 WindowsColorKey = new Color32(1, 0, 1, 255);

        public string Status { get; private set; } = "not_initialized";

        private UniWindowController _controller;
        private bool _hasAppliedWindowGeometry;
        private Vector2 _lastWindowPosition;
        private Vector2 _lastWindowSize;
        private bool _externalDragActive;
        private Vector2 _externalDragOffset;
        private Rect _externalDragVisibleBounds;

        public static bool SupportsFrameAlphaComposition()
        {
#if UNITY_STANDALONE_WIN && !UNITY_EDITOR
            var pipeline = GraphicsSettings.currentRenderPipeline;
            if (pipeline == null)
            {
                return true;
            }
            return pipeline.GetType().GetProperty("allowPostProcessAlphaOutput") != null;
#else
            return true;
#endif
        }

        public void Initialize(Camera portraitCamera, AilisRendererWindow initialWindow)
        {
#if UNITY_EDITOR
            Status = "editor_preview_no_transparency";
            return;
#else
            try
            {
                _controller = UniWindowController.current;
                if (_controller == null)
                {
                    var controllerObject = new GameObject("UniWindowController");
                    controllerObject.transform.SetParent(transform, false);
                    _controller = controllerObject.AddComponent<UniWindowController>();
                }

                if (_controller == null)
                {
                    Status = "transparent_window_unavailable";
                    return;
                }

                _controller.currentCamera = portraitCamera;
                _controller.autoSwitchCameraBackground = true;
                ConfigureTransparencyMode();
                ApplyPresentationSettings();
                StartCoroutine(InitializeWindowAfterReady(initialWindow));
            }
            catch (Exception error)
            {
                Status = "transparent_window_failed: " + error.Message;
                Debug.LogWarning(error);
            }
#endif
        }

        public void ApplyPresentationSettings()
        {
#if UNITY_EDITOR
            Status = "editor_preview_no_transparency";
#else
            if (_controller == null)
            {
                return;
            }
            try
            {
                ConfigureTransparencyMode();
                _controller.isTransparent = true;
                _controller.isTopmost = true;
                _controller.opacityThreshold = 0.08f;
                _controller.isHitTestEnabled = false;
                _controller.isClickThrough = true;
                var mode = SupportsFrameAlphaComposition() ? "alpha" : "color_key";
                Status = mode + "_topmost";
            }
            catch (Exception error)
            {
                Status = "transparent_window_failed: " + error.Message;
                Debug.LogWarning(error);
            }
#endif
        }

        public void FinalizeNativePresentation()
        {
#if !UNITY_EDITOR
            ApplyPresentationSettings();
#endif
        }

        public void ApplyWindowBounds(AilisRendererWindow bounds, bool resizeWindow)
        {
#if !UNITY_EDITOR
            if (_controller == null || bounds == null)
            {
                return;
            }
            var nextPosition = new Vector2(bounds.x, bounds.y);
            if (!_hasAppliedWindowGeometry || _lastWindowPosition != nextPosition)
            {
                _controller.windowPosition = nextPosition;
                _lastWindowPosition = nextPosition;
            }
            if (resizeWindow && bounds.width > 0 && bounds.height > 0)
            {
                var nextSize = new Vector2(bounds.width, bounds.height);
                if (!_hasAppliedWindowGeometry || _lastWindowSize != nextSize)
                {
                    _controller.windowSize = nextSize;
                    _lastWindowSize = nextSize;
                }
            }
            if (!string.Equals(
                    bounds.phase,
                    "drag",
                    StringComparison.OrdinalIgnoreCase))
            {
                EnsureTopmost();
            }
            _hasAppliedWindowGeometry = true;
#endif
        }

        public bool BeginExternalDrag(Rect visibleBounds)
        {
#if UNITY_EDITOR
            return false;
#else
            if (_controller == null ||
                (UniWindowController.GetMouseButtons() & UniWindowController.MouseButton.Left) ==
                    UniWindowController.MouseButton.None)
            {
                return false;
            }

            var windowSize = _controller.windowSize;
            _externalDragVisibleBounds = visibleBounds.width > 1f && visibleBounds.height > 1f
                ? visibleBounds
                : new Rect(Vector2.zero, windowSize);
            _lastWindowPosition = _controller.windowPosition;
            _externalDragOffset = _lastWindowPosition - _controller.cursorPosition;
            _externalDragActive = true;
            return true;
#endif
        }

        public bool UpdateExternalDrag()
        {
#if UNITY_EDITOR
            return false;
#else
            if (!_externalDragActive || _controller == null)
            {
                return false;
            }
            if ((UniWindowController.GetMouseButtons() & UniWindowController.MouseButton.Left) ==
                UniWindowController.MouseButton.None)
            {
                _externalDragActive = false;
                return true;
            }

            var cursor = _controller.cursorPosition;
            var nextPosition = ClampToCursorMonitor(
                cursor + _externalDragOffset,
                cursor,
                _externalDragVisibleBounds);
            nextPosition.x = Mathf.Round(nextPosition.x);
            nextPosition.y = Mathf.Round(nextPosition.y);
            if ((_lastWindowPosition - nextPosition).sqrMagnitude >= 0.25f)
            {
                _controller.windowPosition = nextPosition;
                _lastWindowPosition = nextPosition;
            }
            return false;
#endif
        }

        public void EndExternalDrag()
        {
            _externalDragActive = false;
        }

        private static Vector2 ClampToCursorMonitor(
            Vector2 windowPosition,
            Vector2 cursorPosition,
            Rect visibleBounds)
        {
            var monitorBounds = FindCursorMonitor(cursorPosition);
            if (monitorBounds.width <= 1f || monitorBounds.height <= 1f)
            {
                return windowPosition;
            }

            var minimumX = monitorBounds.xMin - visibleBounds.xMin;
            var maximumX = monitorBounds.xMax - visibleBounds.xMax;
            var minimumY = monitorBounds.yMin - visibleBounds.yMin;
            var maximumY = monitorBounds.yMax - visibleBounds.yMax;
            if (maximumX >= minimumX)
            {
                windowPosition.x = Mathf.Clamp(windowPosition.x, minimumX, maximumX);
            }
            if (maximumY >= minimumY)
            {
                windowPosition.y = Mathf.Clamp(windowPosition.y, minimumY, maximumY);
            }
            return windowPosition;
        }

        private static Rect FindCursorMonitor(Vector2 cursorPosition)
        {
            var monitorCount = UniWindowController.GetMonitorCount();
            var nearestMonitor = Rect.zero;
            var nearestDistance = float.PositiveInfinity;
            for (var index = 0; index < monitorCount; index++)
            {
                var monitor = UniWindowController.GetMonitorRect(index);
                if (monitor.Contains(cursorPosition))
                {
                    return monitor;
                }
                var nearestPoint = new Vector2(
                    Mathf.Clamp(cursorPosition.x, monitor.xMin, monitor.xMax),
                    Mathf.Clamp(cursorPosition.y, monitor.yMin, monitor.yMax));
                var distance = (nearestPoint - cursorPosition).sqrMagnitude;
                if (distance < nearestDistance)
                {
                    nearestDistance = distance;
                    nearestMonitor = monitor;
                }
            }
            return nearestMonitor;
        }

        private void ConfigureTransparencyMode()
        {
            if (SupportsFrameAlphaComposition())
            {
                _controller.SetTransparentType(UniWindowController.TransparentType.Alpha);
                return;
            }

            _controller.keyColor = WindowsColorKey;
            _controller.SetTransparentType(UniWindowController.TransparentType.ColorKey);
        }

        private System.Collections.IEnumerator InitializeWindowAfterReady(
            AilisRendererWindow initialWindow)
        {
            yield return null;
            yield return new WaitForEndOfFrame();
            ApplyPresentationSettings();
            yield return ApplyWindowGeometryAfterReady(initialWindow);
        }

        private System.Collections.IEnumerator ApplyWindowGeometryAfterReady(
            AilisRendererWindow bounds)
        {
#if !UNITY_EDITOR
            yield return null;
            yield return new WaitForEndOfFrame();
            if (_controller == null || bounds == null)
            {
                yield break;
            }

            _controller.isZoomed = false;
            _lastWindowSize = new Vector2(bounds.width, bounds.height);
            _controller.windowSize = _lastWindowSize;
            yield return new WaitForEndOfFrame();
            _lastWindowPosition = new Vector2(bounds.x, bounds.y);
            _controller.windowPosition = _lastWindowPosition;
            EnsureTopmost();
            _hasAppliedWindowGeometry = true;
#else
            yield break;
#endif
        }

        private void EnsureTopmost()
        {
            if (_controller != null)
            {
                _controller.isTopmost = true;
            }
        }
    }
}
