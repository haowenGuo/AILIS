import subprocess, sys, re, os
from collections import Counter

# Install package
subprocess.run([sys.executable, "-m", "pip", "install", "youtube-transcript-api", "-q"], capture_output=True, timeout=30)

from youtube_transcript_api import get_transcript

t = get_transcript("L1vXCYZAYYM")
text = " ".join([x["text"] for x in t])

# Search for numbers next to species/bird words
numbers_found = []
sentences = text.replace("?", ".").replace("!", ".").split(".")
for s in sentences:
    s = s.strip()
    if s and ("species" in s.lower() or "bird" in s.lower()):
        nums = re.findall(r'\d+', s)
        if nums:
            numbers_found.append((s[:150], nums))

# Write results
out_path = r"F:\AILIS_self_evolution_runtime\result_data.txt"
with open(out_path, "w", encoding="utf-8") as f:
    for ctx, nums in numbers_found:
        f.write(f"Nums:{nums} | {ctx}\n")

print(f"Results written to {out_path}")
print(f"File size: {os.path.getsize(out_path)} bytes")

# Print answer for immediate reading
if numbers_found:
    print(f"Found {len(numbers_found)} relevant lines")
    for ctx, nums in numbers_found[:10]:
        print(f"Numbers: {nums}")
else:
    # Try broader search
    for s in sentences:
        s = s.strip()
        if s and any(w in s.lower() for w in ["together", "camera", "frame", "shot", "simultaneous", "appear"]):
            nums = re.findall(r'\d+', s)
            if nums:
                print(f"ALT - Nums:{nums} | {s[:200]}")
    
    # Also count all unique numbers
    all_nums = re.findall(r'\b(\d+)\b', text)
    num_counts = Counter(all_nums)
    print(f"Most common numbers: {num_counts.most_common(20)}")
