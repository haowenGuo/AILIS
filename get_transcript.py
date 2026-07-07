from youtube_transcript_api import YouTubeTranscriptApi
try:
    api = YouTubeTranscriptApi()
    transcript = api.fetch('L1vXCYZAYYM')
    for entry in transcript:
        print(f"[{entry.start:.1f}s] {entry.text}")
    print("\n--- Full text ---")
    print(" ".join(entry.text for entry in transcript))
except Exception as e:
    print(f'Error: {e}')
