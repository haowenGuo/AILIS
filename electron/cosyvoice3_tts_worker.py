import base64
import json
import os
import sys
import tempfile
import time
from pathlib import Path


PROJECT_ROOT = Path(os.environ.get("AIGRIL_PROJECT_ROOT") or Path(__file__).resolve().parents[1])
COSYVOICE_ROOT = Path(os.environ.get("AIGRIL_COSYVOICE_ROOT") or PROJECT_ROOT / "build-cache" / "CosyVoice")
MODEL_DIR = Path(os.environ.get("AIGRIL_COSYVOICE3_MODEL_DIR") or COSYVOICE_ROOT / "pretrained_models" / "Fun-CosyVoice3-0.5B")
DEFAULT_PROMPT_WAV = COSYVOICE_ROOT / "asset" / "zero_shot_prompt.wav"
SELECTED_PREVIEW_WAV = PROJECT_ROOT / "Resources" / "tts" / "cosyvoice3_aigl_anime_shy_soft_0.wav"
DEFAULT_INSTRUCT_TEXT = (
    "You are a helpful assistant. "
    "请用泛化的日系二次元害羞少女声线说话，语气轻声、柔弱、有一点小心翼翼，"
    "尾音带一点撒娇感，但不要模仿任何真实声优或特定角色。"
    "<|endofprompt|>"
)


model = None
torch = None
torchaudio = None
JSON_STDOUT = sys.stdout


def write_response(payload):
    JSON_STDOUT.write(json.dumps(payload, ensure_ascii=False) + "\n")
    JSON_STDOUT.flush()


class redirect_stdout_to_stderr:
    def __enter__(self):
        self.previous_stdout = sys.stdout
        sys.stdout = sys.stderr

    def __exit__(self, _exc_type, _exc, _traceback):
        sys.stdout = self.previous_stdout


def get_prompt_wav():
    raw_path = os.environ.get("AIGRIL_COSYVOICE3_PROMPT_WAV")
    candidates = [
        Path(raw_path) if raw_path else None,
        DEFAULT_PROMPT_WAV,
        SELECTED_PREVIEW_WAV,
    ]
    for candidate in candidates:
        if candidate and candidate.exists():
            return str(candidate)
    raise FileNotFoundError("CosyVoice3 参考音频不存在")


def ensure_model():
    global model, torch, torchaudio
    if model is not None:
        return model

    if not COSYVOICE_ROOT.exists():
        raise FileNotFoundError(f"CosyVoice 源码目录不存在: {COSYVOICE_ROOT}")
    if not MODEL_DIR.exists():
        raise FileNotFoundError(f"CosyVoice3 模型目录不存在: {MODEL_DIR}")

    sys.path.insert(0, str(COSYVOICE_ROOT))
    sys.path.insert(0, str(COSYVOICE_ROOT / "third_party" / "Matcha-TTS"))

    with redirect_stdout_to_stderr():
        import torch as torch_module
        import torchaudio as torchaudio_module
        from cosyvoice.cli.cosyvoice import AutoModel

        torch = torch_module
        torchaudio = torchaudio_module
        model = AutoModel(
            model_dir=str(MODEL_DIR),
            load_trt=False,
            load_vllm=False,
            fp16=torch.cuda.is_available(),
        )
    return model


def normalize_text(value):
    text = str(value or "").replace("\r", " ").replace("\n", " ").strip()
    return " ".join(text.split())


def clamp_speed(value):
    try:
        numeric_value = float(value)
    except (TypeError, ValueError):
        numeric_value = 0.92
    return min(max(numeric_value, 0.6), 1.4)


def synthesize(request):
    text = normalize_text(request.get("text") or request.get("input"))
    if not text:
        raise ValueError("缺少需要合成的文本")

    active_model = ensure_model()
    prompt_wav = str(request.get("promptWav") or get_prompt_wav())
    instruct_text = str(request.get("instructText") or DEFAULT_INSTRUCT_TEXT)
    speed = clamp_speed(request.get("speed"))

    started_at = time.time()
    pieces = []
    with redirect_stdout_to_stderr():
        for item in active_model.inference_instruct2(
            text,
            instruct_text,
            prompt_wav,
            stream=False,
            speed=speed,
        ):
            pieces.append(item["tts_speech"].detach().cpu())

    if not pieces:
        raise RuntimeError("CosyVoice3 没有返回音频")

    speech = torch.cat(pieces, dim=1) if len(pieces) > 1 else pieces[0]
    sample_rate = int(active_model.sample_rate)
    duration_seconds = speech.shape[1] / sample_rate

    tmp_file = tempfile.NamedTemporaryFile(prefix="aigril-cosyvoice3-", suffix=".wav", delete=False)
    tmp_path = tmp_file.name
    tmp_file.close()

    try:
        torchaudio.save(tmp_path, speech, sample_rate)
        audio_bytes = Path(tmp_path).read_bytes()
    finally:
        try:
            Path(tmp_path).unlink(missing_ok=True)
        except OSError:
            pass

    return {
        "ok": True,
        "provider": "cosyvoice3",
        "voicePreset": "anime_shy_soft",
        "audio_base64": base64.b64encode(audio_bytes).decode("ascii"),
        "mime_type": "audio/wav",
        "sampleRate": sample_rate,
        "durationSeconds": round(duration_seconds, 3),
        "elapsedSeconds": round(time.time() - started_at, 3),
    }


def warmup():
    started_at = time.time()
    active_model = ensure_model()
    prompt_wav = get_prompt_wav()
    with redirect_stdout_to_stderr():
        for _item in active_model.inference_instruct2(
            "嗯。",
            DEFAULT_INSTRUCT_TEXT,
            prompt_wav,
            stream=False,
            speed=1.0,
        ):
            pass
    return {
        "ok": True,
        "provider": "cosyvoice3",
        "voicePreset": "anime_shy_soft",
        "type": "warmup",
        "elapsedSeconds": round(time.time() - started_at, 3),
    }


def main():
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")
    os.environ.setdefault("KMP_DUPLICATE_LIB_OK", "TRUE")
    write_response({"type": "ready", "ok": True, "provider": "cosyvoice3"})

    for line in sys.stdin:
        raw_line = line.strip()
        if not raw_line:
            continue

        try:
            request = json.loads(raw_line)
            request_id = request.get("id")
            if request.get("type") == "shutdown":
                write_response({"id": request_id, "ok": True, "type": "shutdown"})
                return
            if request.get("type") == "warmup":
                response = warmup()
            else:
                response = synthesize(request)
            response["id"] = request_id
            write_response(response)
        except Exception as error:
            write_response({
                "id": request.get("id") if "request" in locals() and isinstance(request, dict) else None,
                "ok": False,
                "error": str(error),
                "provider": "cosyvoice3",
            })


if __name__ == "__main__":
    main()
