import base64
import json
import os
import sys
import tempfile
import time
from pathlib import Path


PROJECT_ROOT = Path(os.environ.get("AILIS_PROJECT_ROOT") or Path(__file__).resolve().parents[1])
REPO_ID = os.environ.get("AILIS_KOKORO_REPO_ID") or "hexgrad/Kokoro-82M-v1.1-zh"
DEFAULT_VOICE = os.environ.get("AILIS_KOKORO_VOICE") or "zf_003"
DEFAULT_SPEED = float(os.environ.get("AILIS_KOKORO_SPEED") or "0.98")
SAMPLE_RATE = 24000
JSON_STDOUT = sys.stdout


torch = None
np = None
sf = None
model = None
zh_pipeline = None


def write_response(payload):
    JSON_STDOUT.write(json.dumps(payload, ensure_ascii=False) + "\n")
    JSON_STDOUT.flush()


class redirect_stdout_to_stderr:
    def __enter__(self):
        self.previous_stdout = sys.stdout
        sys.stdout = sys.stderr

    def __exit__(self, _exc_type, _exc, _traceback):
        sys.stdout = self.previous_stdout


def patch_espeak_wrapper():
    try:
        from phonemizer.backend.espeak.wrapper import EspeakWrapper
    except Exception:
        return

    if hasattr(EspeakWrapper, "set_data_path"):
        return

    @classmethod
    def set_data_path(cls, data_path):
        cls._ESPEAK_DATA_PATH = str(data_path)

    EspeakWrapper.set_data_path = set_data_path


def normalize_text(value):
    text = str(value or "").replace("\r", " ").replace("\n", " ").strip()
    return " ".join(text.split())


def normalize_voice(value):
    voice = str(value or DEFAULT_VOICE).strip()
    return voice or DEFAULT_VOICE


def clamp_speed(value):
    try:
        numeric_value = float(value)
    except (TypeError, ValueError):
        numeric_value = DEFAULT_SPEED
    return min(max(numeric_value, 0.65), 1.25)


def ensure_model():
    global torch, np, sf, model, zh_pipeline
    if zh_pipeline is not None:
        return zh_pipeline

    patch_espeak_wrapper()

    with redirect_stdout_to_stderr():
        import numpy as numpy_module
        import soundfile as soundfile_module
        import torch as torch_module
        from kokoro import KModel, KPipeline

        torch = torch_module
        np = numpy_module
        sf = soundfile_module

        device = os.environ.get("AILIS_KOKORO_DEVICE") or (
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        model = KModel(repo_id=REPO_ID).to(device).eval()
        zh_pipeline = KPipeline(
            lang_code="z",
            repo_id=REPO_ID,
            model=model,
        )

    return zh_pipeline


def audio_to_numpy(audio):
    if torch is not None and torch.is_tensor(audio):
        audio = audio.detach().cpu().numpy()
    array = np.asarray(audio, dtype=np.float32)
    if array.ndim == 2:
        if array.shape[0] <= 8 and array.shape[0] < array.shape[1]:
            array = array.T
        if array.shape[1] == 1:
            array = array[:, 0]
    if array.ndim != 1:
        raise ValueError(f"Kokoro 返回了不支持的音频形状: {array.shape}")
    return array


def synthesize(request):
    text = normalize_text(request.get("text") or request.get("input"))
    if not text:
        raise ValueError("缺少需要合成的文本")

    pipeline = ensure_model()
    voice = normalize_voice(request.get("voice"))
    speed = clamp_speed(request.get("speed"))
    started_at = time.time()
    wavs = []

    with redirect_stdout_to_stderr():
        generator = pipeline(text, voice=voice, speed=speed)
        for result in generator:
            audio = audio_to_numpy(result.audio)
            if audio.size > 0:
                wavs.append(audio)

    if not wavs:
        raise RuntimeError("Kokoro 没有返回音频")

    if len(wavs) == 1:
        waveform = wavs[0]
    else:
        pause = np.zeros(int(SAMPLE_RATE * 0.12), dtype=np.float32)
        parts = []
        for index, chunk in enumerate(wavs):
            if index:
                parts.append(pause)
            parts.append(chunk)
        waveform = np.concatenate(parts)

    tmp_file = tempfile.NamedTemporaryFile(prefix="ailis-kokoro-", suffix=".wav", delete=False)
    tmp_path = tmp_file.name
    tmp_file.close()

    try:
        sf.write(tmp_path, waveform, SAMPLE_RATE, subtype="PCM_16")
        audio_bytes = Path(tmp_path).read_bytes()
    finally:
        try:
            Path(tmp_path).unlink(missing_ok=True)
        except OSError:
            pass

    return {
        "ok": True,
        "provider": "kokoro",
        "voice": voice,
        "audio_base64": base64.b64encode(audio_bytes).decode("ascii"),
        "mime_type": "audio/wav",
        "sampleRate": SAMPLE_RATE,
        "durationSeconds": round(float(len(waveform)) / SAMPLE_RATE, 3),
        "elapsedSeconds": round(time.time() - started_at, 3),
    }


def warmup(request=None):
    request = request or {}
    started_at = time.time()
    pipeline = ensure_model()
    voice = normalize_voice(request.get("voice"))
    speed = clamp_speed(request.get("speed"))
    with redirect_stdout_to_stderr():
        generator = pipeline("嗯。", voice=voice, speed=speed)
        next(generator)
    return {
        "ok": True,
        "provider": "kokoro",
        "voice": voice,
        "type": "warmup",
        "elapsedSeconds": round(time.time() - started_at, 3),
    }


def main():
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")
    os.environ.setdefault("KMP_DUPLICATE_LIB_OK", "TRUE")
    write_response({"type": "ready", "ok": True, "provider": "kokoro"})

    for line in sys.stdin:
        raw_line = line.strip()
        if not raw_line:
            continue

        request = {}
        try:
            request = json.loads(raw_line)
            request_id = request.get("id")
            if request.get("type") == "shutdown":
                write_response({"id": request_id, "ok": True, "type": "shutdown"})
                return
            if request.get("type") == "warmup":
                response = warmup(request)
            else:
                response = synthesize(request)
            response["id"] = request_id
            write_response(response)
        except Exception as error:
            write_response({
                "id": request.get("id") if isinstance(request, dict) else None,
                "ok": False,
                "error": str(error),
                "provider": "kokoro",
            })


if __name__ == "__main__":
    main()
