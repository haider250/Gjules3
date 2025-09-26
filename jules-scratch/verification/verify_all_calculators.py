import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # --- Test Dilution Calculator ---
        # Solve for M2
        page.check('input[name="solve-for"][value="m2"]')
        page.fill('#m1', '14.8')
        page.fill('#v1', '10')
        page.fill('#v2', '1000')
        page.click('#calculate-dilution')
        expect(page.locator('#dilution-result')).to_have_text('0.1480 M')

        # --- Test w/v % Calculator ---
        page.fill('#solute-mass-wv', '4')
        page.fill('#solution-volume-wv', '100')
        page.click('#calculate-wv')
        expect(page.locator('#wv-result')).to_have_text('4.00%')

        # --- Test v/v % Calculator ---
        page.fill('#solute-volume-vv', '80')
        page.fill('#solution-volume-vv', '2000')
        page.click('#calculate-vv')
        expect(page.locator('#vv-result')).to_have_text('4.00%')

        # Take a full page screenshot
        page.screenshot(path='jules-scratch/verification/verification.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()