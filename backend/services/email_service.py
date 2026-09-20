"""账户邮件发送边界。

生产环境只从配置读取 SMTP 凭据；账户服务只负责生成一次性 Token，
邮件服务负责把链接发送出去，二者不互相保存敏感信息。
"""

from __future__ import annotations

import asyncio
import smtplib
import ssl
from email.message import EmailMessage

from backend.core.config import get_settings


settings = get_settings()


class EmailDeliveryError(RuntimeError):
    pass


class EmailService:
    @property
    def ready(self) -> bool:
        return bool(settings.APP_SMTP_HOST and settings.APP_EMAIL_FROM)

    async def send(self, *, recipient: str, subject: str, text: str) -> None:
        if not self.ready:
            raise EmailDeliveryError("SMTP 邮件服务尚未配置")
        try:
            await asyncio.to_thread(self._send_sync, recipient, subject, text)
        except EmailDeliveryError:
            raise
        except Exception as exc:
            raise EmailDeliveryError("SMTP 邮件发送失败") from exc

    def _send_sync(self, recipient: str, subject: str, text: str) -> None:
        message = EmailMessage()
        message["From"] = settings.APP_EMAIL_FROM
        message["To"] = recipient
        message["Subject"] = subject
        message.set_content(text)

        context = ssl.create_default_context()
        if settings.APP_SMTP_USE_SSL:
            with smtplib.SMTP_SSL(
                settings.APP_SMTP_HOST,
                int(settings.APP_SMTP_PORT),
                context=context,
                timeout=20,
            ) as client:
                if settings.APP_SMTP_USERNAME:
                    client.login(settings.APP_SMTP_USERNAME, settings.APP_SMTP_PASSWORD)
                client.send_message(message)
            return

        with smtplib.SMTP(
            settings.APP_SMTP_HOST,
            int(settings.APP_SMTP_PORT),
            timeout=20,
        ) as client:
            if settings.APP_SMTP_USE_TLS:
                client.starttls(context=context)
            if settings.APP_SMTP_USERNAME:
                client.login(settings.APP_SMTP_USERNAME, settings.APP_SMTP_PASSWORD)
            client.send_message(message)
