import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # --- 1. Test a Calculator (Molarity) and Modal ---
        page.fill('#solute-mass', '58.44')
        page.fill('#molecular-weight', '58.44')
        page.fill('#solution-volume', '1000')
        page.select_option('#volume-unit', 'mL')
        page.click('#calculate-molarity')
        expect(page.locator('#molarity-result')).to_have_text('1.0000 M')

        # Verify and CLOSE the modal
        modal = page.locator('#unit-conversion-modal')
        expect(modal).to_be_visible()
        page.click('.close-button')
        expect(modal).to_be_hidden()

        # --- 2. Test the Search Functionality ---
        search_bar = page.locator('#search-bar')
        molarity_section = page.locator('#molarity-calculator')
        page.select_option('#chemical-select', 'NaOH')
        search_bar.fill('hygroscopic')
        expect(molarity_section).to_have_class('highlight')
        search_bar.fill('')
        expect(molarity_section).not_to_have_class('highlight')

        # --- 3. Test the Mode Switch ---
        mode_switch_label = page.locator('label.switch')
        procedure_guidance = page.locator('#procedure-guidance')

        # Switch to Expert Mode
        mode_switch_label.click()
        expect(procedure_guidance).to_be_hidden()

        # Switch back to Guided Mode
        mode_switch_label.click()
        expect(procedure_guidance).to_be_visible()

        # --- 4. Take a final screenshot ---
        page.screenshot(path='jules-scratch/verification/final-verification.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()