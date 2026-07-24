import base64
import builtins
from contextlib import contextmanager
import importlib.util
import json
import os
import sys
import tempfile
import time
from pathlib import Path


PROJECT_ROOT = Path(os.environ.get("AILIS_PROJECT_ROOT") or Path(__file__).resolve().parents[1])
COSYVOICE_ROOT = Path(os.environ.get("AILIS_COSYVOICE_ROOT") or PROJECT_ROOT / "build-cache" / "CosyVoice")
MODEL_DIR = Path(os.environ.get("AILIS_COSYVOICE3_MODEL_DIR") or COSYVOICE_ROOT / "pretrained_models" / "Fun-CosyVoice3-0.5B")
DEFAULT_PROMPT_WAV = COSYVOICE_ROOT / "asset" / "zero_shot_prompt.wav"
SELECTED_PREVIEW_WAV = PROJECT_ROOT / "Resources" / "tts" / "cosyvoice3_ailis_anime_shy_soft_0.wav"
DEFAULT_INSTRUCT_TEXT = (
    "You are a helpful assistant. "
    "请用泛化的日系二次元害羞少女声线说话，语气轻声、柔弱、有一点小心翼翼，"
    "尾音带一点撒娇感，但不要模仿任何真实声优或特定角色。"
    "<|endofprompt|>"
)


def env_flag(name, default=False):
    raw_value = os.environ.get(name)
    if raw_value is None:
        return default
    normalized_value = str(raw_value).strip().lower()
    if normalized_value in {"0", "false", "no", "off"}:
        return False
    if normalized_value in {"1", "true", "yes", "on"}:
        return True
    return default


LOCAL_ONLY = env_flag("AILIS_COSYVOICE3_LOCAL_ONLY", True)
DISABLE_REMOTE_TEXT_FRONTEND = env_flag(
    "AILIS_COSYVOICE3_DISABLE_REMOTE_TEXT_FRONTEND",
    LOCAL_ONLY,
)
ACCELERATION_MODE = str(os.environ.get("AILIS_COSYVOICE3_ACCELERATION") or "auto").strip().lower()

if LOCAL_ONLY:
    os.environ.setdefault("HF_HUB_OFFLINE", "1")
    os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
    os.environ.setdefault("HF_DATASETS_OFFLINE", "1")
    os.environ.setdefault("MODELSCOPE_OFFLINE", "1")


model = None
torch = None
torchaudio = None
model_acceleration = None
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


@contextmanager
def block_remote_text_frontend_imports():
    if not DISABLE_REMOTE_TEXT_FRONTEND:
        yield
        return

    original_import = builtins.__import__

    def guarded_import(name, globals=None, locals=None, fromlist=(), level=0):
        root_name = str(name or "").split(".", 1)[0]
        if root_name == "wetext":
            raise ImportError("wetext text frontend is disabled in AILIS_COSYVOICE3_LOCAL_ONLY mode")
        return original_import(name, globals, locals, fromlist, level)

    builtins.__import__ = guarded_import
    try:
        yield
    finally:
        builtins.__import__ = original_import


def get_prompt_wav():
    raw_path = os.environ.get("AILIS_COSYVOICE3_PROMPT_WAV")
    candidates = [
        Path(raw_path) if raw_path else None,
        DEFAULT_PROMPT_WAV,
        SELECTED_PREVIEW_WAV,
    ]
    for candidate in candidates:
        if candidate and candidate.exists():
            return str(candidate)
    raise FileNotFoundError("CosyVoice3 参考音频不存在")


def has_python_module(name):
    try:
        return importlib.util.find_spec(name) is not None
    except Exception:
        return False


def get_onnxruntime_providers():
    try:
        import onnxruntime
        return list(onnxruntime.get_available_providers())
    except Exception:
        return []


def get_cuda_devices(torch_module):
    if not torch_module.cuda.is_available():
        return []
    devices = []
    for index in range(torch_module.cuda.device_count()):
        try:
            devices.append(torch_module.cuda.get_device_name(index))
        except Exception:
            devices.append(f"cuda:{index}")
    return devices


def existing_trt_plan_for(fp16):
    precision = "fp16" if fp16 else "fp32"
    return MODEL_DIR / f"flow.decoder.estimator.{precision}.mygpu.plan"


def choose_acceleration(torch_module):
    cuda_available = bool(torch_module.cuda.is_available())
    has_vllm = has_python_module("vllm")
    has_tensorrt = has_python_module("tensorrt")
    onnx_providers = get_onnxruntime_providers()
    requested_mode = ACCELERATION_MODE if ACCELERATION_MODE in {
        "auto",
        "cpu",
        "torch",
        "cuda",
        "vllm",
        "trt",
        "trt-vllm",
        "vllm-trt",
    } else "auto"

    fp16 = env_flag("AILIS_COSYVOICE3_FP16", cuda_available)
    allow_trt_build = env_flag("AILIS_COSYVOICE3_ALLOW_TRT_BUILD", False)
    load_vllm = False
    load_trt = False
    notes = []

    if requested_mode == "cpu":
        fp16 = False
        notes.append("forced_cpu")
    elif not cuda_available:
        fp16 = False
        notes.append("cuda_unavailable")
    else:
        if requested_mode in {"auto", "vllm", "trt-vllm", "vllm-trt"}:
            load_vllm = has_vllm
            if not has_vllm and requested_mode != "auto":
                notes.append("vllm_requested_but_not_installed")

        if requested_mode in {"auto", "trt", "trt-vllm", "vllm-trt"}:
            selected_trt_plan = existing_trt_plan_for(fp16)
            can_use_trt = has_tensorrt and (selected_trt_plan.exists() or allow_trt_build)
            load_trt = can_use_trt
            if not has_tensorrt and requested_mode != "auto":
                notes.append("trt_requested_but_tensorrt_not_installed")
            elif has_tensorrt and not selected_trt_plan.exists() and not allow_trt_build:
                notes.append("trt_plan_missing_and_build_disabled")

    backend = "cpu"
    if cuda_available and fp16:
        backend = "torch-cuda-fp16"
    elif cuda_available:
        backend = "torch-cuda-fp32"
    if load_vllm and load_trt:
        backend = f"{backend}+vllm+trt"
    elif load_vllm:
        backend = f"{backend}+vllm"
    elif load_trt:
        backend = f"{backend}+trt"

    if cuda_available and "CUDAExecutionProvider" not in onnx_providers:
        notes.append("onnxruntime_cuda_provider_unavailable")

    return {
        "mode": requested_mode,
        "backend": backend,
        "cudaAvailable": cuda_available,
        "cudaDevices": get_cuda_devices(torch_module),
        "torchVersion": getattr(torch_module, "__version__", ""),
        "torchCudaVersion": str(getattr(torch_module.version, "cuda", "") or ""),
        "onnxRuntimeProviders": onnx_providers,
        "hasVllm": has_vllm,
        "hasTensorRT": has_tensorrt,
        "fp16": fp16,
        "loadVllm": load_vllm,
        "loadTrt": load_trt,
        "trtPlan": str(existing_trt_plan_for(fp16)),
        "allowTrtBuild": allow_trt_build,
        "notes": notes,
    }


def create_auto_model(AutoModel, acceleration):
    return AutoModel(
        model_dir=str(MODEL_DIR),
        load_trt=bool(acceleration["loadTrt"]),
        load_vllm=bool(acceleration["loadVllm"]),
        fp16=bool(acceleration["fp16"]),
    )


def ensure_model():
    global model, torch, torchaudio, model_acceleration
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
        with block_remote_text_frontend_imports():
            from cosyvoice.cli.cosyvoice import AutoModel

            torch = torch_module
            torchaudio = torchaudio_module
            model_acceleration = choose_acceleration(torch)
            sys.stderr.write(
                "[cosyvoice3] acceleration selected: "
                + json.dumps(model_acceleration, ensure_ascii=False)
                + "\n"
            )
            sys.stderr.flush()
            try:
                model = create_auto_model(AutoModel, model_acceleration)
            except Exception:
                if (
                    model_acceleration["mode"] != "auto"
                    or (not model_acceleration["loadVllm"] and not model_acceleration["loadTrt"])
                ):
                    raise
                sys.stderr.write("[cosyvoice3] accelerated backend failed, falling back to torch backend\n")
                sys.stderr.flush()
                fallback_backend = "cpu"
                if model_acceleration["cudaAvailable"] and model_acceleration["fp16"]:
                    fallback_backend = "torch-cuda-fp16"
                elif model_acceleration["cudaAvailable"]:
                    fallback_backend = "torch-cuda-fp32"
                model_acceleration = {
                    **model_acceleration,
                    "backend": fallback_backend,
                    "loadVllm": False,
                    "loadTrt": False,
                    "notes": [*model_acceleration.get("notes", []), "accelerated_backend_fallback"],
                }
                model = create_auto_model(AutoModel, model_acceleration)
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

    tmp_file = tempfile.NamedTemporaryFile(prefix="ailis-cosyvoice3-", suffix=".wav", delete=False)
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
        "acceleration": model_acceleration,
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
        "acceleration": model_acceleration,
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
