import subprocess, sys, re

# Install
subprocess.run([sys.executable, "-m", "pip", "install", "youtube-transcript-api", "-q"], capture_output=True, timeout=30)

from youtube_transcript_api import get_transcript

t = get_transcript("L1vXCYZAYYM")
text = " ".join([x["text"] for x in t])

# Find any mention of a number near "species" or "bird"
matches = []
for i, line in enumerate(text.split(".")):
    lower = line.lower()
    if "species" in lower or "bird" in lower or "together" in lower:
        matches.append(line.strip())

result = "\n".join(matches[:20])

# Also extract any numbers
nums = re.findall(r'\b(\d+)\s*(?:bird|species)\b', text.lower())
nums2 = re.findall(r'\b(?:bird|species)\s*(?::|is|are|were|here)\s*(\d+)\b', text.lower())

# Write to file
with open(r"F:\AILIS_self_evolution_runtime\answer_small.txt", "w", encoding="utf-8") as f:
    f.write("MATCHES:\n" + result[:3000] + "\n\nNUMS:" + str(nums) + "\nNUMS2:" + str(nums2))

print("WRITE_DONE")
