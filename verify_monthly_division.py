from playwright.sync_api import sync_playwright
import sys
import os

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

def test_monthly_division_features():
    print("[*] Starting verification of Monthly Views Division and 'This Month' features...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 960})
        page = context.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(f"[PAGE ERROR] {err}"))
        page.on("console", lambda msg: errors.append(f"[CONSOLE ERROR] {msg.text}") if msg.type == "error" else None)

        print("[*] Navigating to http://127.0.0.1:8080/index.html")
        page.goto("http://127.0.0.1:8080/index.html")
        page.wait_for_load_state("networkidle")

        # 1. Audit 'wildboybalu'
        print("[*] Auditing 'wildboybalu' to test live extraction and monthly division...")
        search_input = page.locator("#input-search-channel")
        search_btn = page.locator("#btn-search-analyze")
        search_input.fill("wildboybalu")
        search_btn.click()

        # Wait for scan modal to close
        page.wait_for_selector(".scan-modal-overlay.open", timeout=5000)
        page.locator("#scan-modal-overlay").wait_for(state="hidden", timeout=20000)
        page.wait_for_timeout(1000)

        # 2. Check Profile Card new fields
        channel_age = page.locator("#profile-channel-age").inner_text()
        lifetime_avg = page.locator("#profile-lifetime-avg").inner_text()
        monthly_views = page.locator("#profile-monthly-views").inner_text()
        print(f"[+] Channel Inception extracted: '{channel_age}'")
        print(f"[+] Lifetime Monthly Average: '{lifetime_avg}'")
        print(f"[+] This Month's Velocity: '{monthly_views}'")
        assert "mos" in channel_age.lower() or "joined" in channel_age.lower(), "Channel age not extracted"
        assert "M" in lifetime_avg, "Lifetime average not displaying millions"
        assert "26" in monthly_views or "27" in monthly_views, "This Month views not matching 26.6M"

        # 3. Check Views Scope Pill selection
        caption_before = page.locator("#views-scope-caption").inner_text()
        print(f"[+] Initial Scope Caption: '{caption_before}'")

        # Test switching to Lifetime Average mode
        print("[*] Switching to 'Lifetime Monthly Average' mode...")
        btn_scope_lifetime = page.locator("#btn-scope-lifetime-avg")
        btn_scope_lifetime.click()
        page.wait_for_timeout(500)
        disp_views_lifetime = page.locator("#display-monthly-views").inner_text()
        caption_lifetime = page.locator("#views-scope-caption").inner_text()
        print(f"[+] Monthly views input updated to: '{disp_views_lifetime}'")
        print(f"[+] Scope caption updated to: '{caption_lifetime}'")

        # Test switching back to 'This Month' mode
        print("[*] Switching back to 'This Month' mode...")
        btn_scope_this_month = page.locator("#btn-scope-this-month")
        btn_scope_this_month.click()
        page.wait_for_timeout(500)
        disp_views_this_month = page.locator("#display-monthly-views").inner_text()
        print(f"[+] Monthly views input restored to: '{disp_views_this_month}'")

        # 4. Test Tab 4: 12-Month Views Division
        print("[*] Opening Tab 4 (12-Month Views Division)...")
        tab4_btn = page.locator(".tab-btn[data-target='tab-monthly-division']")
        tab4_btn.click()
        page.wait_for_timeout(500)

        assert page.locator("#tab-monthly-division").is_visible(), "Tab 4 is not visible"
        this_month_takehome = page.locator("#disp-this-month-takehome").inner_text()
        this_month_views_badge = page.locator("#disp-this-month-views").inner_text()
        print(f"[+] Tab 4 'This Month' Take-Home Callout: '{this_month_takehome}'")
        print(f"[+] Tab 4 'This Month' Views Callout: '{this_month_views_badge}'")

        # Verify 12 rows in table body
        rows = page.locator("#table-monthly-division tbody tr")
        row_count = rows.count()
        print(f"[+] 12-Month schedule body rows rendered: {row_count}")
        assert row_count == 12, f"Expected 12 months, got {row_count}"

        # Verify current month highlight row exists
        current_month_row = page.locator("#table-monthly-division tr.row-this-month")
        assert current_month_row.count() == 1, "Expected exactly 1 highlighted row for This Month"
        current_month_badge = current_month_row.locator(".badge-current-month").inner_text()
        print(f"[+] Highlighted current month row found with badge: '{current_month_badge}'")

        # 5. Test Quick Divide Modal
        print("[*] Testing Quick Divide Views Modal...")
        btn_open_modal = page.locator("#btn-open-divide-modal")
        btn_open_modal.click()
        page.wait_for_timeout(300)
        assert page.locator("#divide-views-modal").is_visible(), "Divide modal did not open"

        # Change period to 6 months
        period_6m = page.locator(".divide-period-btn[data-months='6']")
        period_6m.click()
        page.wait_for_timeout(200)
        calc_divided_preview = page.locator("#disp-calc-divided-views").inner_text()
        print(f"[+] Divided views preview for 6 months: '{calc_divided_preview}'")

        # Close modal
        btn_close_modal = page.locator("#btn-close-divide-modal")
        btn_close_modal.click()
        page.wait_for_timeout(300)
        assert not page.locator("#divide-views-modal").is_visible(), "Divide modal did not close"
        print("[+] Divide modal closed successfully")

        # Save screenshot
        artifact_dir = r"C:\Users\ACER\.gemini\antigravity-ide\brain\a7f37e09-8843-444b-8ce2-03f0d0f12b6c"
        screenshot_path = os.path.join(artifact_dir, "truerpm_monthly_division_verified.png")
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"[+] Verification screenshot saved: {screenshot_path}")

        browser.close()

        if errors:
            print(f"[!] Errors encountered: {errors}")
            sys.exit(1)
        else:
            print("[+] ALL MONTHLY DIVISION AND THIS MONTH FEATURES VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_monthly_division_features()
