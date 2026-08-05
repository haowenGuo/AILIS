using UnityEngine;
using System.Threading.Tasks;

namespace ChatdollKit.Model
{
    public interface IBlink
    {
        Task StartBlinkAsync();
        void StopBlink();
        void Setup(GameObject avatarObject);
    }
}
