from youtube_transcript_api import YouTubeTranscriptApi
transcript = YouTubeTranscriptApi.get_transcript("L1vXCYZAYYM")
text = " ".join([t["text"] for t in transcript])
with open(r"F:\AILIS_self_evolution_runtime\bird_answer.txt", "w", encoding="utf-8") as f:
    f.write(text[:10000])
print("DONE")
