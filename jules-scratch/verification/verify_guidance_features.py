import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # --- Verify Procedural Guidance ---
        procedure_section = page.locator('#procedure-guidance')
        expect(procedure_section).to_be_visible()
        expect(procedure_section.locator('h2')).to_have_text('Procedure Guidance: The Right Way to Make a 1L Solution')

        # --- Verify Dynamic Safety Warnings ---
        safety_warning_div = page.locator('#safety-warning')

        # Test HCl
        page.select_option('#chemical-select', 'HCl')
        expect(safety_warning_div).to_be_visible()
        expect(safety_warning_div).to_contain_text('Always add acid to water slowly.')

        # Test NaOH
        page.select_option('#chemical-select', 'NaOH')
        expect(safety_warning_div).to_be_visible()
        expect(safety_warning_div).to_contain_text('Sodium hydroxide is hygroscopic')

        # Test H2O2
        page.select_option('#chemical-select', 'H2O2')
        expect(safety_warning_div).to_be_visible()
        expect(safety_warning_div).to_contain_text('Hydrogen peroxide can decompose')

        # Test hiding the warning
        page.select_option('#chemical-select', '')
        expect(safety_warning_div).to_be_hidden()

        # Re-select one to have it visible in the screenshot
        page.select_option('#chemical-select', 'HCl')

        # Take a full page screenshot
        page.screenshot(path='jules-scratch/verification/verification.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()