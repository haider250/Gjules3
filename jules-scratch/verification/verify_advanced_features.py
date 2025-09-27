import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # --- 1. Test Molality Calculator ---
        page.fill('#solute-moles-molality', '0.5')
        page.fill('#solvent-mass-molality', '1')
        page.click('#calculate-molality')
        expect(page.locator('#molality-result')).to_have_text('0.5000 m')

        # --- 2. Test Context-Aware Search ---
        search_bar = page.locator('#search-bar')
        molarity_section = page.locator('#molarity-calculator')
        dilution_section = page.locator('#dilution-calculator')

        # First, select a chemical to make its properties searchable
        page.select_option('#chemical-select', 'NaOH')

        # Search for a term specific to the NaOH properties
        search_bar.fill('hygroscopic')

        # Assert that the correct section is highlighted
        expect(molarity_section).to_have_class('highlight')
        expect(dilution_section).not_to_have_class('highlight')

        # Take a screenshot with the highlight active
        page.screenshot(path='jules-scratch/verification/verification.png', full_page=True)

        # Clear the search and verify highlight is removed
        search_bar.fill('')
        expect(molarity_section).not_to_have_class('highlight')

        browser.close()

if __name__ == "__main__":
    run_verification()