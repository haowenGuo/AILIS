import re

# Read the transcript
with open(r"F:\AILIS_self_evolution_runtime\transcript_full.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Search for ALL numbers and their context
# Look for patterns like "X species" or numbers near species/bird/together words
lines = text.split(".")
relevant = []
for i, line in enumerate(lines):
    lower = line.lower()
    if any(w in lower for w in ["species", "bird"]):
        # Extract all numbers in this line
        nums = re.findall(r'\b\d+\b', line)
        if nums:
            relevant.append(f"Line {i}: {line.strip()[:200]}")

# Also just dump all unique numbers found near species
species_nums = re.findall(r'(\d+)\s*species', text.lower())
bird_nums = re.findall(r'(\d+)\s*birds?', text.lower())

with open(r"F:\AILIS_self_evolution_runtime\small_result.txt", "w", encoding="utf-8") as f:
    f.write(f"species_NUMS: {species_nums}\n")
    f.write(f"bird_NUMS: {bird_nums}\n")
    f.write(f"RELEVANT_LINES: {len(relevant)}\n")
    for r in relevant[:5]:
        f.write(r + "\n")

print("SAVED_SMALL_RESULT")
