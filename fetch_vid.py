import subprocess, sys, json
subprocess.run([sys.executable, "-m", "pip", "install", "yt-dlp", "-q"], capture_output=True)
import yt_dlp
ydl = yt_dlp.YoutubeDL()
info = ydl.extract_info("https://www.youtube.com/watch?v=L1vXCYZAYYM", download=False)
description = info.get("description", "")
title = info.get("title", "")
with open(r"F:\AILIS_self_evolution_runtime\vid_desc.txt", "w", encoding="utf-8") as f:
    f.write(f"Title: {title}\n\nDescription:\n{description}")
print("DONE_WRITING_FILE")
