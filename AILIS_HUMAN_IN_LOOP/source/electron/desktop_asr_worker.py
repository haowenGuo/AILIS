import base64
import io
import json
import os
import sys
import tempfile
import time
import traceback
import wave
from typing import Any

import numpy as np


ENGINE = os.environ.get("AILIS_ASR_ENGINE", os.environ.get("AILIS_ASR_PROVIDER", "whisper")).strip().lower() or "whisper"
MODEL_ID = os.environ.get("AILIS_ASR_MODEL_ID", "openai/whisper-small").strip() or "openai/whisper-small"
SENSEVOICE_MODEL_ID = os.environ.get("AILIS_SENSEVOICE_MODEL_ID", "FunAudioLLM/SenseVoiceSmall").strip() or "FunAudioLLM/SenseVoiceSmall"
MODEL_ENDPOINT = os.environ.get("AILIS_ASR_MODEL_ENDPOINT", "").strip()
CACHE_DIR = os.environ.get("AILIS_ASR_CACHE_DIR", os.path.join(os.path.dirname(__file__), "..", ".local", "asr-cache"))
LANGUAGE = os.environ.get("AILIS_ASR_LANGUAGE", "zh").strip()
SENSEVOICE_LANGUAGE = os.environ.get("AILIS_SENSEVOICE_LANGUAGE", "auto").strip() or "auto"
TASK = os.environ.get("AILIS_ASR_TASK", "transcribe").strip() or "transcribe"
CHUNK_LENGTH_S = int(os.environ.get("AILIS_ASR_CHUNK_LENGTH_S", "30"))
BATCH_SIZE = int(os.environ.get("AILIS_ASR_BATCH_SIZE", "8"))
SILENCE_RMS_THRESHOLD = float(os.environ.get("AILIS_ASR_SILENCE_RMS_THRESHOLD", "0.0010"))
SILENCE_PEAK_THRESHOLD = float(os.environ.get("AILIS_ASR_SILENCE_PEAK_THRESHOLD", "0.0060"))

def env_flag(name: str, default: bool = False) -> bool:
    raw_value = os.environ.get(name)
    if raw_value is None:
        return default
    normalized_value = str(raw_value).strip().lower()
    if normalized_value in {"0", "false", "no", "off"}:
        return False
    if normalized_value in {"1", "true", "yes", "on"}:
        return True
    return default


LOCAL_ONLY = env_flag("AILIS_ASR_LOCAL_ONLY", True)

if MODEL_ENDPOINT and not LOCAL_ONLY:
    os.environ.setdefault("HF_ENDPOINT", MODEL_ENDPOINT)
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")
os.environ.setdefault("HF_HOME", CACHE_DIR)
os.environ.setdefault("HF_HUB_CACHE", os.path.join(CACHE_DIR, "hub"))
os.environ.setdefault("TRANSFORMERS_CACHE", os.path.join(CACHE_DIR, "transformers"))
if LOCAL_ONLY:
    os.environ.setdefault("HF_HUB_OFFLINE", "1")
    os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
    os.environ.setdefault("HF_DATASETS_OFFLINE", "1")

PIPELINE = None
SENSEVOICE_MODEL = None
SENSEVOICE_POSTPROCESS = None


def elapsed_seconds(started_at: float) -> float:
    return round(time.perf_counter() - started_at, 3)


def send(payload: dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def log(message: str) -> None:
    sys.stderr.write(message + "\n")
    sys.stderr.flush()


def normalize_preset(value: Any) -> str:
    normalized_value = str(value or "").strip().lower()
    if normalized_value in {"fast", "low-latency", "low_latency", "realtime"}:
        return "fast"
    return "balanced"


def build_generate_kwargs(preset: str) -> dict[str, Any]:
    generate_kwargs: dict[str, Any] = {
        "task": TASK,
        "temperature": 0.0,
        "condition_on_prev_tokens": False,
        "compression_ratio_threshold": 1.35,
        "logprob_threshold": -1.0,
        "no_speech_threshold": 0.6
    }
    if LANGUAGE:
        generate_kwargs["language"] = LANGUAGE

    if preset == "fast":
        generate_kwargs.update({
            "num_beams": 1,
            "compression_ratio_threshold": 1.5,
            "no_speech_threshold": 0.45
        })

    return generate_kwargs


def decode_wav_bytes(wav_bytes: bytes) -> tuple[np.ndarray, int, float]:
    try:
        with wave.open(io.BytesIO(wav_bytes), "rb") as wav_file:
            frame_rate = wav_file.getframerate()
            frame_count = wav_file.getnframes()
            channels = wav_file.getnchannels()
            sample_width = wav_file.getsampwidth()
            raw_frames = wav_file.readframes(frame_count)
    except wave.Error as exc:
        raise RuntimeError("当前本地识别仅支持 WAV 音频") from exc

    if frame_count <= 0:
        raise RuntimeError("音频没有可识别的采样数据")

    if sample_width == 1:
        audio = np.frombuffer(raw_frames, dtype=np.uint8).astype(np.float32)
        audio = (audio - 128.0) / 128.0
    elif sample_width == 2:
        audio = np.frombuffer(raw_frames, dtype=np.int16).astype(np.float32) / 32768.0
    elif sample_width == 4:
        audio = np.frombuffer(raw_frames, dtype=np.int32).astype(np.float32) / 2147483648.0
    else:
        raise RuntimeError(f"不支持的 WAV 采样宽度：{sample_width * 8} bit")

    if channels > 1:
        audio = audio.reshape(-1, channels).mean(axis=1)

    duration_seconds = frame_count / float(frame_rate)
    return audio, frame_rate, duration_seconds


def is_effective_silence(audio_array: np.ndarray) -> bool:
    if audio_array.size == 0:
        return True

    rms = float(np.sqrt(np.mean(np.square(audio_array))))
    peak = float(np.max(np.abs(audio_array)))
    return rms < SILENCE_RMS_THRESHOLD and peak < SILENCE_PEAK_THRESHOLD


def raise_local_model_error(model_id: str, exc: Exception) -> None:
    if not LOCAL_ONLY:
        raise exc

    raise RuntimeError(
        f"本地 ASR 模型未安装或缓存不完整：{model_id}。"
        f"当前只使用本地模型缓存，不会联网下载；请先把完整模型缓存放到 {CACHE_DIR}。"
        f"底层错误类型：{type(exc).__name__}"
    ) from exc


def ensure_pipeline():
    global PIPELINE
    if PIPELINE is not None:
        return PIPELINE

    import torch
    from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

    has_cuda = torch.cuda.is_available()
    model_device = "cuda:0" if has_cuda else "cpu"
    pipeline_device = 0 if has_cuda else -1
    torch_dtype = torch.float16 if has_cuda else torch.float32

    log(f"[worker] loading Whisper model: {MODEL_ID}")

    try:
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            MODEL_ID,
            cache_dir=CACHE_DIR,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=True,
            local_files_only=LOCAL_ONLY
        )
    except Exception as exc:  # noqa: BLE001
        raise_local_model_error(MODEL_ID, exc)

    model.to(model_device)

    try:
        processor = AutoProcessor.from_pretrained(
            MODEL_ID,
            cache_dir=CACHE_DIR,
            local_files_only=LOCAL_ONLY
        )
    except Exception as exc:  # noqa: BLE001
        raise_local_model_error(MODEL_ID, exc)

    PIPELINE = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        chunk_length_s=CHUNK_LENGTH_S,
        batch_size=BATCH_SIZE,
        torch_dtype=torch_dtype,
        device=pipeline_device
    )
    log("[worker] Whisper model ready")
    return PIPELINE


def ensure_sensevoice_model():
    global SENSEVOICE_MODEL
    global SENSEVOICE_POSTPROCESS
    if SENSEVOICE_MODEL is not None:
        return SENSEVOICE_MODEL, SENSEVOICE_POSTPROCESS

    try:
        import torch
        from funasr import AutoModel
        from funasr.utils.postprocess_utils import rich_transcription_postprocess
    except ImportError as exc:
        raise RuntimeError(
            'SenseVoiceSmall 需要安装 funasr：python -m pip install "funasr>=1.1.2" modelscope huggingface_hub'
        ) from exc

    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    log(f"[worker] loading SenseVoice model: {SENSEVOICE_MODEL_ID} on {device}")
    try:
        SENSEVOICE_MODEL = AutoModel(
            model=SENSEVOICE_MODEL_ID,
            trust_remote_code=True,
            device=device,
            hub="hf",
            cache_dir=CACHE_DIR
        )
    except Exception as exc:  # noqa: BLE001
        raise_local_model_error(SENSEVOICE_MODEL_ID, exc)

    SENSEVOICE_POSTPROCESS = rich_transcription_postprocess
    log("[worker] SenseVoice model ready")
    return SENSEVOICE_MODEL, SENSEVOICE_POSTPROCESS


def call_whisper_pipeline(asr_pipeline: Any, audio_array: np.ndarray, sample_rate: int, preset: str) -> Any:
    payload = {
        "array": audio_array,
        "sampling_rate": sample_rate
    }
    call_kwargs: dict[str, Any] = {
        "return_timestamps": False,
        "generate_kwargs": build_generate_kwargs(preset)
    }

    if preset == "fast":
        call_kwargs.update({
            "chunk_length_s": min(CHUNK_LENGTH_S, 12),
            "batch_size": min(BATCH_SIZE, 4)
        })

    try:
        return asr_pipeline(payload, **call_kwargs)
    except TypeError as exc:
        message = str(exc)
        if "chunk_length_s" not in message and "batch_size" not in message:
            raise
        call_kwargs.pop("chunk_length_s", None)
        call_kwargs.pop("batch_size", None)
        return asr_pipeline(payload, **call_kwargs)


def transcribe(audio_base64: str, preset_value: Any = "balanced") -> dict[str, Any]:
    if not audio_base64:
        raise RuntimeError("录音内容为空")

    total_started_at = time.perf_counter()
    decode_started_at = time.perf_counter()
    preset = normalize_preset(preset_value)
    audio_bytes = base64.b64decode(audio_base64)
    audio_array, sample_rate, duration_seconds = decode_wav_bytes(audio_bytes)
    decode_seconds = elapsed_seconds(decode_started_at)

    if is_effective_silence(audio_array):
        return {
            "text": "",
            "engine": ENGINE,
            "preset": preset,
            "language": LANGUAGE or None,
            "task": TASK,
            "model_id": SENSEVOICE_MODEL_ID if ENGINE in {"sensevoice", "sensevoice-small", "funasr"} else MODEL_ID,
            "duration_seconds": duration_seconds,
            "timing": {
                "decode_seconds": decode_seconds,
                "model_seconds": 0,
                "total_seconds": elapsed_seconds(total_started_at)
            }
        }

    if ENGINE in {"sensevoice", "sensevoice-small", "funasr"}:
        return transcribe_sensevoice(audio_bytes, duration_seconds, preset, {
            "total_started_at": total_started_at,
            "decode_seconds": decode_seconds
        })

    asr_pipeline = ensure_pipeline()
    model_started_at = time.perf_counter()
    result = call_whisper_pipeline(asr_pipeline, audio_array, sample_rate, preset)
    model_seconds = elapsed_seconds(model_started_at)

    text = ""
    if isinstance(result, dict):
        text = str(result.get("text") or "").strip()
    else:
        text = str(result or "").strip()

    return {
        "text": text,
        "engine": "whisper",
        "preset": preset,
        "language": LANGUAGE or None,
        "task": TASK,
        "model_id": MODEL_ID,
        "duration_seconds": duration_seconds,
        "timing": {
            "decode_seconds": decode_seconds,
            "model_seconds": model_seconds,
            "total_seconds": elapsed_seconds(total_started_at)
        }
    }


def transcribe_sensevoice(
    wav_bytes: bytes,
    duration_seconds: float,
    preset: str,
    timing_context: dict[str, Any]
) -> dict[str, Any]:
    model, postprocess = ensure_sensevoice_model()
    temp_path = ""
    model_started_at = time.perf_counter()
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as audio_file:
            audio_file.write(wav_bytes)
            temp_path = audio_file.name

        result = model.generate(
            input=temp_path,
            cache={},
            language=SENSEVOICE_LANGUAGE,
            use_itn=True,
            batch_size=64
        )
    finally:
        if temp_path:
            try:
                os.remove(temp_path)
            except OSError:
                pass

    text = ""
    if isinstance(result, list) and result:
        text = str(result[0].get("text") or "").strip()
    elif isinstance(result, dict):
        text = str(result.get("text") or "").strip()
    else:
        text = str(result or "").strip()

    if text and postprocess:
        text = postprocess(text)

    return {
        "text": text,
        "engine": "sensevoice",
        "preset": preset,
        "language": SENSEVOICE_LANGUAGE,
        "task": TASK,
        "model_id": SENSEVOICE_MODEL_ID,
        "duration_seconds": duration_seconds,
        "timing": {
            "decode_seconds": float(timing_context.get("decode_seconds") or 0),
            "model_seconds": elapsed_seconds(model_started_at),
            "total_seconds": elapsed_seconds(float(timing_context.get("total_started_at") or time.perf_counter()))
        }
    }


def handle_request(payload: dict[str, Any]) -> dict[str, Any]:
    action = payload.get("action")

    if action == "ping":
        return {
            "status": "ok"
        }

    if action == "warmup":
        if ENGINE in {"sensevoice", "sensevoice-small", "funasr"}:
            ensure_sensevoice_model()
            model_id = SENSEVOICE_MODEL_ID
        else:
            ensure_pipeline()
            model_id = MODEL_ID
        return {
            "status": "ready",
            "engine": ENGINE,
            "model_id": model_id
        }

    if action == "transcribe":
        return transcribe(str(payload.get("audioBase64") or ""), payload.get("preset"))

    raise RuntimeError(f"不支持的 action：{action}")


def main() -> None:
    send({
        "type": "ready",
        "engine": ENGINE,
        "model_id": MODEL_ID
    })

    for raw_line in sys.stdin:
        line = str(raw_line or "").strip()
        if not line:
            continue

        request_id = None
        try:
            payload = json.loads(line)
            request_id = str(payload.get("id") or "")
            result = handle_request(payload)
            send({
                "id": request_id,
                "ok": True,
                "result": result
            })
        except Exception as exc:  # noqa: BLE001
            error_message = str(exc)
            if error_message.startswith("本地 ASR 模型未安装或缓存不完整："):
                log(error_message)
            else:
                log(traceback.format_exc())
            send({
                "id": request_id,
                "ok": False,
                "error": error_message
            })


if __name__ == "__main__":
    main()
