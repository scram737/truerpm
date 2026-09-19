import json
import re

with open("yt_dump.json", "r", encoding="utf-8") as f:
    text = f.read()

vids = list(set(re.findall(r'"videoId":\s*"([a-zA-Z0-9_-]{11})"', text)))
print("Found video IDs:", vids[:5])
