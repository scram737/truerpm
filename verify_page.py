from playwright.sync_api import sync_playwright
import sys

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

def verify_all_features():
    print("[*] Starting comprehensive page verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 960})
        
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)

        # 1. Load page
        page.goto("http://127.0.0.1:8080/index.html")
        page.wait_for_load_state("networkidle")
        print("[+] Page loaded successfully")

        # 2. Test Currency Selector (USD -> INR)
        currency_sel = page.locator("#currency-selector")
        currency_sel.select_option("INR")
        page.wait_for_timeout(500)
        net_rev = page.locator("#stat-reality-price").inner_text()
        print(f"[+] Currency switched to INR: net revenue displays '{net_rev}'")
        assert "₹" in net_rev, "INR symbol not found in net revenue"

        # Switch back to USD
        currency_sel.select_option("USD")
        page.wait_for_timeout(300)

        # 3. Test Preset Buttons
        us_finance_preset = page.locator(".preset-pill:has-text('US Finance')")
        if us_finance_preset.count() > 0:
            us_finance_preset.click()
            page.wait_for_timeout(500)
            niche_val = page.locator("#select-niche").input_value()
            print(f"[+] Applied US Finance Preset: Niche is '{niche_val}'")

        # 4. Test Sliders
        page.eval_on_selector("#slider-monthly-views", "(el) => { el.value = 5000000; el.dispatchEvent(new Event('input')); }")
        page.wait_for_timeout(300)
        views_display = page.locator("#display-monthly-views").inner_text()
        print(f"[+] Monthly views slider set to 5M, display is: '{views_display}'")

        # 5. Test AdBlock slider & toggle
        adblock_toggle = page.locator("#toggle-adblock")
        is_checked = adblock_toggle.is_checked()
        print(f"[+] AdBlock filter toggle default checked: {is_checked}")

        # 6. Test Tabs (Traffic Breakdown, Format & Duration, Multi-Stream)
        tab_format = page.locator(".tab-btn[data-target='tab-format-breakdown']")
        tab_format.click()
        page.wait_for_timeout(300)
        assert page.locator("#tab-format-breakdown").is_visible(), "Format breakdown tab is not visible"
        print("[+] Format & Duration tab opened and visible")

        tab_stream = page.locator(".tab-btn[data-target='tab-multistream']")
        tab_stream.click()
        page.wait_for_timeout(300)
        assert page.locator("#tab-multistream").is_visible(), "Multi-stream tab is not visible"
        print("[+] Multi-Stream tab opened and visible")

        # 7. Test Global RPM Database search and filter
        country_search = page.locator("#input-country-search")
        country_search.fill("Japan")
        page.wait_for_timeout(300)
        jp_row = page.locator("#table-all-countries tbody tr:visible")
        print(f"[+] Country database filtered for 'Japan', rows visible: {jp_row.count()}")

        # 8. Test Export Audit (triggers download or print/modal)
        export_btn = page.locator("#btn-export-report")
        assert export_btn.is_visible(), "Export Audit button visible"
        print("[+] Export Audit button is visible and accessible")

        browser.close()

        if errors:
            print(f"[!] JavaScript Errors detected: {errors}")
            sys.exit(1)
        else:
            print("[+] All interactive features checked with 0 errors!")

if __name__ == "__main__":
    verify_all_features()
