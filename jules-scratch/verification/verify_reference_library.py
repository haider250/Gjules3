import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # --- Test Expanded Chemical Properties ---
        chemical_properties_div = page.locator('#chemical-properties')

        # Select NaOH and check for new properties
        page.select_option('#chemical-select', 'NaOH')
        expect(chemical_properties_div).to_be_visible()
        expect(chemical_properties_div).to_contain_text('Density')
        expect(chemical_properties_div).to_contain_text('2.13 g/cm³')
        expect(chemical_properties_div).to_contain_text('Melting Point')
        expect(chemical_properties_div).to_contain_text('318 °C')

        # --- Test Instructional Content Library ---
        content_library = page.locator('#content-library')
        expect(content_library).to_be_visible()
        expect(content_library.locator('h2')).to_have_text('Instructional Content Library')
        expect(content_library).to_contain_text('Guide to Primary Standards (KHP)')

        # Take a full page screenshot
        page.screenshot(path='jules-scratch/verification/verification.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()