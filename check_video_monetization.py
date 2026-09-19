import urllib.request
import re

url = "https://www.youtube.com/watch?v=VdMcUf7zWC8"
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }
)

try:
    html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8")
    print("Video page HTML fetched. Length:", len(html))
    
    # Check monetization flags
    matches = re.findall(r'"is_monetization_enabled":\s*(true|false)', html)
    print("is_monetization_enabled matches:", matches)
    
    tags = re.findall(r'(\"key\":\"is_monetization_enabled\",\"value\":\"[^\"]+\")', html)
    print("key is_monetization_enabled matches:", tags)
    
    ad_matches = re.findall(r'("adPlacements"|"playerAds"|"adSlots")', html)
    print("adPlacements found:", set(ad_matches))
except Exception as e:
    print("Error:", e)
