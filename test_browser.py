import os
import sys

# Ensure UTF-8 output
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

from playwright.sync_api import sync_playwright

def run():
    artifact_dir = r"C:\Users\ACER\.gemini\antigravity-ide\brain\a6381963-e06e-4d81-9e12-3fcf678c4f6a"
    os.makedirs(artifact_dir, exist_ok=True)
    
    print("[*] Starting Playwright test for wildboybalu live extraction...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 960})
        page = context.new_page()

        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: console_logs.append(f"[ERROR] {err}"))

        print("[*] Navigating to http://127.0.0.1:8080/index.html")
        page.goto("http://127.0.0.1:8080/index.html")
        page.wait_for_load_state("domcontentloaded")
        page.wait_for_timeout(1500)

        # TEST: Search 'wildboybalu'
        test_channel = "wildboybalu"
        print(f"[*] Testing User Channel: {test_channel}")
        
        search_input = page.locator("#input-search-channel")
        search_btn = page.locator("#btn-search-analyze")

        search_input.fill(test_channel)
        search_btn.click()

        # Wait for live API fetch and modal completion
        print("[*] Waiting for live YouTube API scan to resolve...")
        page.wait_for_selector(".scan-modal-overlay.open", timeout=5000)
        print("[*] Scan modal opened, waiting for scan to finish...")
        page.locator("#scan-modal-overlay").wait_for(state="hidden", timeout=20000)
        page.wait_for_timeout(1000)

        # Extract resolved values
        profile_name = page.locator("#profile-name").inner_text()
        profile_handle = page.locator("#profile-handle").inner_text()
        profile_subs = page.locator("#profile-subscribers").inner_text()
        profile_views = page.locator("#profile-total-views").inner_text()
        profile_country = page.locator("#profile-origin-country").inner_text()
        profile_format = page.locator("#profile-format-split").inner_text()
        profile_traffic = page.locator("#profile-top-traffic").inner_text()
        profile_badge = page.locator("#profile-monetization-badge").inner_text()
        
        long_rev = page.locator("#callout-long-revenue").inner_text()
        long_sub = page.locator("#callout-long-sub").inner_text()
        shorts_rev = page.locator("#callout-shorts-revenue").inner_text()
        shorts_sub = page.locator("#callout-shorts-sub").inner_text()

        # Extract calculation proof values
        fantasy_calc = page.locator("#fantasy-live-calc").inner_text()
        reality_calc = page.locator("#reality-live-calc").inner_text()
        proof_long_calc = page.locator("#proof-long-calc").inner_text()
        proof_shorts_calc = page.locator("#proof-shorts-calc").inner_text()
        proof_sum_total = page.locator("#proof-sum-total").inner_text()
        proof_fantasy_formula = page.locator("#proof-fantasy-formula-detail").inner_text()
        proof_fantasy_res = page.locator("#proof-fantasy-result-detail").inner_text()
        # Extract AdBlock & Unpaid Views values
        adblock_status = page.locator("#badge-adblock-status").inner_text()
        adblock_profile = page.locator("#profile-adblock-rate").inner_text()
        proof_unpaid = page.locator("#proof-unpaid-views").inner_text()
        proof_monetized = page.locator("#proof-monetized-views").inner_text()
        overestimate_mult = page.locator("#proof-overestimate-multiple").inner_text()

        print("\n" + "="*55)
        print("VERIFIED LIVE YOUTUBE RESOLUTION RESULTS FOR WILDBOYBALU:")
        print(f"  Channel Name:         {profile_name}")
        print(f"  Handle:               {profile_handle}")
        print(f"  Subscribers:          {profile_subs}")
        print(f"  Total Views:          {profile_views}")
        print(f"  Country Origin:       {profile_country}")
        print(f"  Format Split:         {profile_format}")
        print(f"  Top Audience Traffic: {profile_traffic}")
        print(f"  AdBlock Filter Pill:  {adblock_profile} ({adblock_status})")
        print(f"  Monetization Badge:   {profile_badge.replace(chr(10), ' ')}")
        print(f"  Long-Form Revenue:    {long_rev} ({long_sub})")
        print(f"  Shorts Revenue:       {shorts_rev} ({shorts_sub})")
        print("\n  --- MATHEMATICAL CALCULATION BREAKDOWN (WITH ADBLOCK FILTER) ---")
        print(f"  Unpaid Views Deducted:{proof_unpaid}")
        print(f"  Net Monetized Views:  {proof_monetized}")
        print(f"  Fantasy Formula:      {proof_fantasy_formula}")
        print(f"  Fantasy Result:       {proof_fantasy_res}")
        print(f"  Fantasy Eval Pill:    {fantasy_calc.replace(chr(10), ' | ')}")
        print(f"  Long-Form Math:       {proof_long_calc}")
        print(f"  Shorts Math:          {proof_shorts_calc}")
        print(f"  Sum Total Proof:      {proof_sum_total}")
        print(f"  Reality Eval Pill:    {reality_calc}")
        print(f"  Overestimate Multi:   {overestimate_mult}")
        print("="*55 + "\n")

        # Save screenshots
        screen_path = os.path.join(artifact_dir, "truerpm_wildboybalu_live_verified.png")
        page.screenshot(path=screen_path, full_page=False)
        print(f"[*] Saved verified live screenshot: {screen_path}")

        profile_card_path = os.path.join(artifact_dir, "truerpm_wildboybalu_profile_card.png")
        page.locator("#channel-profile-card").screenshot(path=profile_card_path)
        print(f"[*] Saved profile card screenshot: {profile_card_path}")

        battlefield_path = os.path.join(artifact_dir, "truerpm_wildboybalu_battlefield.png")
        page.locator(".reality-gap-card").screenshot(path=battlefield_path)
        print(f"[*] Saved battlefield screenshot: {battlefield_path}")

        calc_proof_path = os.path.join(artifact_dir, "truerpm_calculation_proof.png")
        page.locator("#calc-proof-card").screenshot(path=calc_proof_path)
        print(f"[*] Saved calculation proof screenshot: {calc_proof_path}")

        adblock_card_path = os.path.join(artifact_dir, "truerpm_adblock_filter_control.png")
        page.locator(".adblock-field-card").screenshot(path=adblock_card_path)
        print(f"[*] Saved AdBlock filter card screenshot: {adblock_card_path}")

        browser.close()
        print("[*] Playwright test finished successfully!")

if __name__ == "__main__":
    run()
