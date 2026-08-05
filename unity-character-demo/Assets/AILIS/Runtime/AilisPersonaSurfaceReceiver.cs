using System;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    public sealed class AilisPersonaSurfaceReceiver : MonoBehaviour
    {
        private sealed class PendingMessage
        {
            public string Json;
            public IPEndPoint Remote;
        }

        private readonly ConcurrentQueue<PendingMessage> _pending = new ConcurrentQueue<PendingMessage>();
        private UdpClient _client;
        private Thread _receiveThread;
        private volatile bool _running;

        public int Port { get; private set; } = AilisPersonaSurfaceProtocol.DefaultPort;
        public string LastPacket { get; private set; } = "";
        public event Action<AilisCharacterMessage> MessageReceived;

        public void StartReceiver(int port)
        {
            if (_running)
            {
                return;
            }

            Port = port;
            _client = new UdpClient(new IPEndPoint(IPAddress.Loopback, Port));
            _client.Client.ReceiveTimeout = 500;
            _running = true;
            _receiveThread = new Thread(ReceiveLoop)
            {
                IsBackground = true,
                Name = "AILIS Persona Surface Receiver"
            };
            _receiveThread.Start();
            Debug.Log("[AILIS Unity Demo] Listening on udp://127.0.0.1:" + Port);
        }

        private void ReceiveLoop()
        {
            while (_running)
            {
                try
                {
                    IPEndPoint remote = null;
                    var bytes = _client.Receive(ref remote);
                    _pending.Enqueue(new PendingMessage
                    {
                        Json = Encoding.UTF8.GetString(bytes),
                        Remote = remote
                    });
                }
                catch (SocketException error)
                {
                    if (error.SocketErrorCode != SocketError.TimedOut && _running)
                    {
                        Debug.LogWarning("[AILIS Unity Demo] UDP receive failed: " + error.Message);
                    }
                }
                catch (ObjectDisposedException)
                {
                    return;
                }
                catch (Exception error)
                {
                    if (_running)
                    {
                        Debug.LogWarning("[AILIS Unity Demo] UDP receive failed: " + error.Message);
                    }
                }
            }
        }

        private void Update()
        {
            PendingMessage latestWindowPending = null;
            AilisCharacterMessage latestWindowMessage = null;
            while (_pending.TryDequeue(out var pending))
            {
                LastPacket = pending.Json;
                if (!AilisPersonaSurfaceProtocol.TryParse(pending.Json, out var message))
                {
                    SendEvent(pending.Remote, new AilisRendererEvent
                    {
                        type = "renderer.rejected",
                        requestId = "",
                        status = "invalid_message",
                        detail = "Unsupported or invalid AILIS character command.",
                        timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                    });
                    continue;
                }

                if (string.Equals(
                        message.type,
                        "renderer.window",
                        StringComparison.Ordinal))
                {
                    latestWindowPending = pending;
                    latestWindowMessage = message;
                    continue;
                }

                FlushLatestWindow(
                    ref latestWindowPending,
                    ref latestWindowMessage);
                DispatchMessage(pending, message);
            }

            FlushLatestWindow(
                ref latestWindowPending,
                ref latestWindowMessage);
        }

        private void FlushLatestWindow(
            ref PendingMessage pending,
            ref AilisCharacterMessage message)
        {
            if (pending == null || message == null)
            {
                return;
            }
            DispatchMessage(pending, message);
            pending = null;
            message = null;
        }

        private void DispatchMessage(
            PendingMessage pending,
            AilisCharacterMessage message)
        {
            MessageReceived?.Invoke(message);
            if (string.Equals(
                    message.type,
                    "renderer.window",
                    StringComparison.Ordinal) &&
                string.Equals(
                    message.window?.phase,
                    "drag",
                    StringComparison.OrdinalIgnoreCase))
            {
                return;
            }
            SendEvent(pending.Remote, new AilisRendererEvent
            {
                type = "renderer.command.accepted",
                requestId = message.requestId,
                status = "ok",
                detail = message.type,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            });
        }

        private void SendEvent(IPEndPoint remote, AilisRendererEvent rendererEvent)
        {
            if (remote == null || _client == null)
            {
                return;
            }

            try
            {
                var bytes = Encoding.UTF8.GetBytes(JsonUtility.ToJson(rendererEvent));
                _client.Send(bytes, bytes.Length, remote);
            }
            catch (Exception error)
            {
                Debug.LogWarning("[AILIS Unity Demo] UDP reply failed: " + error.Message);
            }
        }

        private void OnDestroy()
        {
            _running = false;
            _client?.Close();
            _client = null;
            if (_receiveThread != null && _receiveThread.IsAlive)
            {
                _receiveThread.Join(750);
            }
            _receiveThread = null;
        }
    }
}
