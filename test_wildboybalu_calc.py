from playwright.sync_api import sync_playwright
import json
import sys

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

def test_calculations():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://127.0.0.1:8080/index.html")

        # Evaluate the calculation directly using the loaded RevenueEngine
        res = page.evaluate("""() => {
            // Case 1: Exact numbers from user prompt (26.6M total, 24M shorts, 2.6M long)
            // shortsPercent = (24 / 26.6) * 100 = 90.22556%
            const traffic = [
                { code: "IN", share: 82 },
                { code: "PK", share: 6 },
                { code: "BD", share: 4 },
                { code: "AE", share: 4 },
                { code: "US", share: 4 }
            ];

            // Test with duration: long_video (15-30 min, 2.35x) and mid_video (8-14 min, 1.70x) and short_video (1.0x)
            const calcLongVideo = window.trueRpmApp.engine.calculate({
                monthlyViews: 26600000,
                shortsPercent: (24000000 / 26600000) * 100,
                nicheId: 'entertainment',
                durationId: 'long_video',
                traffic: traffic,
                isMonetized: true,
                adblockPercent: 25
            });

            const calcMidVideo = window.trueRpmApp.engine.calculate({
                monthlyViews: 26600000,
                shortsPercent: (24000000 / 26600000) * 100,
                nicheId: 'entertainment',
                durationId: 'mid_video',
                traffic: traffic,
                isMonetized: true,
                adblockPercent: 25
            });

            const calcShortVideo = window.trueRpmApp.engine.calculate({
                monthlyViews: 26600000,
                shortsPercent: (24000000 / 26600000) * 100,
                nicheId: 'entertainment',
                durationId: 'short_video',
                traffic: traffic,
                isMonetized: true,
                adblockPercent: 25
            });

            return {
                calcLongVideo,
                calcMidVideo,
                calcShortVideo
            };
        }""")

        browser.close()
        print(json.dumps(res, indent=2))

if __name__ == "__main__":
    test_calculations()
