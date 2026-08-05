using System;
using System.Collections;
using Unity.Collections;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace Ailis.CharacterDemo
{
    public sealed class AilisAvatarHitTestMaskData
    {
        public Rect Bounds;
        public string MaskBase64;
        public int MaskWidth;
        public int MaskHeight;
    }

    public sealed class AilisAvatarHitTestMask : MonoBehaviour
    {
        private const int CaptureWidth = 64;
        private const int CaptureHeight = 96;
        private const byte AlphaThreshold = 10;

        private Camera _sourceCamera;
        private Camera _captureCamera;
        private RenderTexture _renderTexture;
        private Texture2D _readbackTexture;
        private AilisAvatarHitTestMaskData _latestAsyncData;
        private bool _asyncReadbackPending;
        private uint _asyncDataVersion;
        private uint _consumedAsyncDataVersion;

        public void Configure(Camera sourceCamera)
        {
            _sourceCamera = sourceCamera;
            if (_sourceCamera == null)
            {
                return;
            }

            var cameraObject = new GameObject("AILIS Avatar Hit Test Camera");
            cameraObject.transform.SetParent(transform, false);
            _captureCamera = cameraObject.AddComponent<Camera>();
            _captureCamera.CopyFrom(_sourceCamera);
            // Modern GPUs render this tiny utility camera only when a fresh mask is
            // requested. The synchronous compatibility path keeps the old continuous
            // render behavior because it cannot safely schedule a deferred readback.
            _captureCamera.enabled = !SystemInfo.supportsAsyncGPUReadback;
            _captureCamera.depth = _sourceCamera.depth - 1f;
            _captureCamera.allowHDR = false;
            _captureCamera.allowMSAA = false;
            _captureCamera.clearFlags = CameraClearFlags.SolidColor;
            _captureCamera.backgroundColor = Color.clear;

            var cameraData = cameraObject.AddComponent<UniversalAdditionalCameraData>();
            cameraData.SetRenderer(0);
            cameraData.renderPostProcessing = false;
            cameraData.antialiasing = AntialiasingMode.None;

            _renderTexture = new RenderTexture(
                CaptureWidth,
                CaptureHeight,
                16,
                RenderTextureFormat.ARGB32)
            {
                name = "AILIS Avatar Hit Test Mask",
                filterMode = FilterMode.Point,
                useMipMap = false,
                autoGenerateMips = false
            };
            _renderTexture.Create();
            _captureCamera.targetTexture = _renderTexture;
            _readbackTexture = new Texture2D(
                CaptureWidth,
                CaptureHeight,
                TextureFormat.RGBA32,
                false,
                true);
        }

        public bool TryCapture(out AilisAvatarHitTestMaskData data)
        {
            data = null;
            if (_sourceCamera == null ||
                _captureCamera == null ||
                _renderTexture == null ||
                _readbackTexture == null ||
                Screen.width <= 0 ||
                Screen.height <= 0)
            {
                return false;
            }

            SyncCaptureCamera();
            if (SystemInfo.supportsAsyncGPUReadback)
            {
                RequestAsyncCapture();
                if (_latestAsyncData == null ||
                    _consumedAsyncDataVersion == _asyncDataVersion)
                {
                    return false;
                }

                data = _latestAsyncData;
                _consumedAsyncDataVersion = _asyncDataVersion;
                return true;
            }

            return TryCaptureSynchronously(out data);
        }

        private void RequestAsyncCapture()
        {
            if (_asyncReadbackPending || _renderTexture == null)
            {
                return;
            }

            _asyncReadbackPending = true;
            StartCoroutine(RenderAndRequestAsyncReadback());
        }

        private IEnumerator RenderAndRequestAsyncReadback()
        {
            if (_captureCamera == null || _renderTexture == null)
            {
                _asyncReadbackPending = false;
                yield break;
            }

            SyncCaptureCamera();
            _captureCamera.enabled = true;
            yield return new WaitForEndOfFrame();
            _captureCamera.enabled = false;
            if (_renderTexture == null || !isActiveAndEnabled)
            {
                _asyncReadbackPending = false;
                yield break;
            }

            AsyncGPUReadback.Request(
                _renderTexture,
                0,
                TextureFormat.RGBA32,
                HandleAsyncReadback);
        }

        private void HandleAsyncReadback(AsyncGPUReadbackRequest request)
        {
            _asyncReadbackPending = false;
            if (request.hasError || !isActiveAndEnabled)
            {
                return;
            }

            var pixels = request.GetData<Color32>();
            _latestAsyncData = BuildMaskData(pixels);
            if (_latestAsyncData != null)
            {
                _asyncDataVersion++;
            }
        }

        private bool TryCaptureSynchronously(out AilisAvatarHitTestMaskData data)
        {
            data = null;
            var previous = RenderTexture.active;
            try
            {
                RenderTexture.active = _renderTexture;
                _readbackTexture.ReadPixels(
                    new Rect(0, 0, CaptureWidth, CaptureHeight),
                    0,
                    0,
                    false);
                _readbackTexture.Apply(false, false);
            }
            finally
            {
                RenderTexture.active = previous;
            }

            var pixels = _readbackTexture.GetPixels32();
            data = BuildMaskData(pixels);
            return data != null;
        }

        private AilisAvatarHitTestMaskData BuildMaskData(NativeArray<Color32> pixels)
        {
            return BuildMaskData(index => pixels[index], pixels.Length);
        }

        private AilisAvatarHitTestMaskData BuildMaskData(Color32[] pixels)
        {
            return BuildMaskData(index => pixels[index], pixels.Length);
        }

        private AilisAvatarHitTestMaskData BuildMaskData(
            Func<int, Color32> pixelAt,
            int pixelCount)
        {
            if (pixelAt == null || pixelCount != CaptureWidth * CaptureHeight)
            {
                return null;
            }

            var occupied = new bool[CaptureWidth * CaptureHeight];
            for (var index = 0; index < pixelCount; index++)
            {
                occupied[index] = pixelAt(index).a >= AlphaThreshold;
            }
            occupied = Dilate(occupied);

            var minX = CaptureWidth;
            var minY = CaptureHeight;
            var maxX = -1;
            var maxY = -1;
            for (var y = 0; y < CaptureHeight; y++)
            {
                for (var x = 0; x < CaptureWidth; x++)
                {
                    if (!occupied[y * CaptureWidth + x])
                    {
                        continue;
                    }
                    minX = Mathf.Min(minX, x);
                    minY = Mathf.Min(minY, y);
                    maxX = Mathf.Max(maxX, x);
                    maxY = Mathf.Max(maxY, y);
                }
            }
            if (maxX < minX || maxY < minY)
            {
                return null;
            }

            var maskWidth = maxX - minX + 1;
            var maskHeight = maxY - minY + 1;
            var bits = new byte[(maskWidth * maskHeight + 7) / 8];
            for (var topRow = 0; topRow < maskHeight; topRow++)
            {
                var sourceY = maxY - topRow;
                for (var column = 0; column < maskWidth; column++)
                {
                    if (!occupied[sourceY * CaptureWidth + minX + column])
                    {
                        continue;
                    }
                    var bitIndex = topRow * maskWidth + column;
                    bits[bitIndex >> 3] |= (byte)(1 << (bitIndex & 7));
                }
            }

            var left = minX * (float)Screen.width / CaptureWidth;
            var top = (CaptureHeight - 1 - maxY) * (float)Screen.height / CaptureHeight;
            var right = (maxX + 1) * (float)Screen.width / CaptureWidth;
            var bottom = (CaptureHeight - minY) * (float)Screen.height / CaptureHeight;
            return new AilisAvatarHitTestMaskData
            {
                Bounds = Rect.MinMaxRect(left, top, right, bottom),
                MaskBase64 = Convert.ToBase64String(bits),
                MaskWidth = maskWidth,
                MaskHeight = maskHeight
            };
        }

        private void SyncCaptureCamera()
        {
            _captureCamera.transform.SetPositionAndRotation(
                _sourceCamera.transform.position,
                _sourceCamera.transform.rotation);
            _captureCamera.fieldOfView = _sourceCamera.fieldOfView;
            _captureCamera.orthographic = _sourceCamera.orthographic;
            _captureCamera.orthographicSize = _sourceCamera.orthographicSize;
            _captureCamera.nearClipPlane = _sourceCamera.nearClipPlane;
            _captureCamera.farClipPlane = _sourceCamera.farClipPlane;
            _captureCamera.cullingMask = _sourceCamera.cullingMask;
            _captureCamera.aspect = _sourceCamera.aspect;
        }

        private static bool[] Dilate(bool[] source)
        {
            var result = new bool[source.Length];
            for (var y = 0; y < CaptureHeight; y++)
            {
                for (var x = 0; x < CaptureWidth; x++)
                {
                    if (!source[y * CaptureWidth + x])
                    {
                        continue;
                    }
                    for (var offsetY = -1; offsetY <= 1; offsetY++)
                    {
                        for (var offsetX = -1; offsetX <= 1; offsetX++)
                        {
                            var targetX = x + offsetX;
                            var targetY = y + offsetY;
                            if (targetX >= 0 &&
                                targetX < CaptureWidth &&
                                targetY >= 0 &&
                                targetY < CaptureHeight)
                            {
                                result[targetY * CaptureWidth + targetX] = true;
                            }
                        }
                    }
                }
            }
            return result;
        }

        private void OnDestroy()
        {
            if (_captureCamera != null)
            {
                _captureCamera.targetTexture = null;
            }
            if (_renderTexture != null)
            {
                _renderTexture.Release();
                Destroy(_renderTexture);
            }
            if (_readbackTexture != null)
            {
                Destroy(_readbackTexture);
            }
        }
    }
}
