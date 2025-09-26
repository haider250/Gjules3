import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # --- Test Chemical Reference Library ---
        molecular_weight_input = page.locator('#molecular-weight')
        safety_warning_div = page.locator('#safety-warning')
        chemical_properties_div = page.locator('#chemical-properties')

        # Test NaOH
        page.select_option('#chemical-select', 'NaOH')
        expect(molecular_weight_input).to_have_value('40')
        expect(safety_warning_div).to_be_visible()
        expect(safety_warning_div).to_contain_text('Highly corrosive')
        expect(chemical_properties_div).to_be_visible()
        expect(chemical_properties_div).to_contain_text('Hygroscopicity')

        # Test KMnO4
        page.select_option('#chemical-select', 'KMnO4')
        expect(molecular_weight_input).to_have_value('158.03')
        expect(safety_warning_div).to_be_visible()
        expect(safety_warning_div).to_contain_text('Strong oxidizer')
        expect(chemical_properties_div).to_be_visible()
        expect(chemical_properties_div).to_contain_text('Instability')

        # Test Acetic Acid
        page.select_option('#chemical-select', 'AceticAcid')
        expect(molecular_weight_input).to_have_value('60.05')
        expect(safety_warning_div).to_be_visible()
        expect(safety_warning_div).to_contain_text('Flammable liquid')
        expect(chemical_properties_div).to_be_visible()
        expect(chemical_properties_div).to_contain_text('Volatility')

        # Test hiding the sections
        page.select_option('#chemical-select', '')
        expect(molecular_weight_input).to_have_value('')
        expect(safety_warning_div).to_be_hidden()
        expect(chemical_properties_div).to_be_hidden()

        # Re-select one to have it visible in the screenshot
        page.select_option('#chemical-select', 'NaOH')

        # Take a full page screenshot
        page.screenshot(path='jules-scratch/verification/verification.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()