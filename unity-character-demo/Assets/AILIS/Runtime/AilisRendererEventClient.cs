using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using UnityEngine;

namespace Ailis.CharacterDemo
{
    public sealed class AilisRendererEventClient : IDisposable
    {
        private readonly UdpClient _client = new UdpClient();
        private IPEndPoint _endpoint;

        public void Configure(int port)
        {
            _endpoint = new IPEndPoint(IPAddress.Loopback, port);
        }

        public void Send(AilisRendererEvent rendererEvent)
        {
            if (_endpoint == null || rendererEvent == null)
            {
                return;
            }
            try
            {
                var bytes = Encoding.UTF8.GetBytes(JsonUtility.ToJson(rendererEvent));
                _client.Send(bytes, bytes.Length, _endpoint);
            }
            catch (Exception error)
            {
                Debug.LogWarning("[AILIS Renderer] Event send failed: " + error.Message);
            }
        }

        public void Dispose()
        {
            _client.Close();
        }
    }
}
