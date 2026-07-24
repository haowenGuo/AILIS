param(
    [string]$Python = "python",
    [string]$Target = ""
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Requirements = Join-Path $Root "vendor\ragflow-lite\requirements.txt"
if (-not $Target) {
    $Target = Join-Path $Root "vendor\ragflow-lite\python-deps"
}
$NltkData = Join-Path $Root "vendor\ragflow-lite\nltk-data"

New-Item -ItemType Directory -Force -Path $Target | Out-Null
New-Item -ItemType Directory -Force -Path $NltkData | Out-Null

& $Python -m pip install --upgrade --target $Target -r $Requirements

$env:AILIS_RAGFLOW_PYDEPS = $Target
$env:AILIS_RAGFLOW_NLTK_DATA = $NltkData
@'
import importlib
import os
import sys

target = os.environ.get("AILIS_RAGFLOW_PYDEPS")
if target:
    sys.path.insert(0, target)
nltk_data = os.environ.get("AILIS_RAGFLOW_NLTK_DATA")
if nltk_data:
    os.environ["NLTK_DATA"] = nltk_data
    os.makedirs(nltk_data, exist_ok=True)
for mod in ["xpinyin", "infinity.rag_tokenizer"]:
    importlib.import_module(mod)
    print(f"{mod}: ok")
import nltk
for resource in ["punkt_tab"]:
    nltk.download(resource, download_dir=nltk_data, quiet=True)
    print(f"nltk:{resource}: ok")
'@ | & $Python -
