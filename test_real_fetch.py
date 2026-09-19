import urllib.request
import re
import json

def check_channel(channel_id_or_url):
    if not channel_id_or_url.startswith("http"):
        if channel_id_or_url.startswith("UC"):
            url = f"https://www.youtube.com/channel/{channel_id_or_url}"
        elif channel_id_or_url.startswith("@"):
            url = f"https://www.youtube.com/{channel_id_or_url}"
        else:
            url = f"https://www.youtube.com/@{channel_id_or_url}"
    else:
        url = channel_id_or_url

    print(f"[*] Fetching {url}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }

    req = urllib.request.Request(url, headers=headers)
    html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8")

    # 1. Monetization flag directly in channel HTML or video HTML
    is_monetized = False
    monetization_reason = ""
    
    if '"key":"is_monetization_enabled","value":"true"' in html or '"is_monetization_enabled":true' in html:
        is_monetized = True
        monetization_reason = "Direct 'is_monetization_enabled: true' flag detected in YouTube channel payload"
    elif '"key":"is_monetization_enabled","value":"false"' in html or '"is_monetization_enabled":false' in html:
        is_monetized = False
        monetization_reason = "Explicit 'is_monetization_enabled: false' flag detected in YouTube channel payload"
    
    # Check if there are join/membership buttons or commercial shelves
    has_join = "sponsorButton" in html or "membership" in html or "badges" in html
    
    # 2. Extract Metadata
    m_title = re.search(r'<meta property="og:title" content="([^"]+)"', html)
    m_image = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    m_desc = re.search(r'<meta property="og:description" content="([^"]*)"', html)
    
    sub_match = re.search(r'([\d\.]+[MK]?)\s+subscribers', html, re.IGNORECASE)
    view_match = re.search(r'([\d,]+)\s+views', html, re.IGNORECASE)
    video_match = re.search(r'([\d,]+)\s+videos', html, re.IGNORECASE)
    country_match = re.search(r'"country":\s*"([^"]+)"', html)
    
    title = m_title.group(1) if m_title else "YouTube Creator"
    avatar = m_image.group(1) if m_image else ""
    country = country_match.group(1) if country_match else "Global"
    subs_str = sub_match.group(1) if sub_match else "Unknown"
    views_str = view_match.group(1) if view_match else "Unknown"
    videos_str = video_match.group(1) if video_match else "Unknown"
    
    # If not found directly on channel home, check videos tab / latest video
    if not is_monetized:
        video_ids = re.findall(r'/watch\?v=([a-zA-Z0-9_-]{11})', html)
        if video_ids:
            v_url = f"https://www.youtube.com/watch?v={video_ids[0]}"
            print(f"[*] Checking video {v_url} for ads/monetization tags...")
            v_req = urllib.request.Request(v_url, headers=headers)
            v_html = urllib.request.urlopen(v_req, timeout=10).read().decode("utf-8")
            if '"key":"is_monetization_enabled","value":"true"' in v_html or '"is_monetization_enabled":true' in v_html:
                is_monetized = True
                monetization_reason = f"Verified via video {video_ids[0]} (is_monetization_enabled: true)"
            elif '"key":"is_monetization_enabled","value":"false"' in v_html:
                is_monetized = False
                monetization_reason = f"Video {video_ids[0]} reports is_monetization_enabled: false"
            elif "yt_ad" in v_html or "adPlacements" in v_html or "playerAds" in v_html:
                is_monetized = True
                monetization_reason = "Active ad placements and commercial tags detected on video playback"

    # Fallback to subscriber threshold if flags are stripped
    if not monetization_reason and subs_str != "Unknown":
        # Check sub count >= 1,000
        is_k_or_m = "K" in subs_str.upper() or "M" in subs_str.upper()
        if is_k_or_m:
            is_monetized = True
            monetization_reason = f"Channel has {subs_str} (>1,000 required for YPP) and meets public watch criteria"
        else:
            try:
                num = int(re.sub(r'[^\d]', '', subs_str))
                is_monetized = num >= 1000
                monetization_reason = f"Subscriber count ({num}) is {'above' if is_monetized else 'below'} 1,000 YPP threshold"
            except:
                pass

    return {
        "title": title,
        "avatar": avatar,
        "country": country,
        "subscribers": subs_str,
        "views": views_str,
        "videos": videos_str,
        "isMonetized": is_monetized,
        "monetizationReason": monetization_reason
    }

if __name__ == "__main__":
    res = check_channel("UCjNVDW-rkDYR0aOKp3E-2wg")
    print(json.dumps(res, indent=2))
