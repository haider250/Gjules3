import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')

        # Navigate to the local HTML file
        page.goto(f'file://{file_path}')

        # Fill in the form
        page.fill('#solute-mass', '58.44')
        page.fill('#molecular-weight', '58.44')
        page.fill('#solution-volume', '1000')
        page.select_option('#volume-unit', 'mL')

        # Click the calculate button
        page.click('#calculate-molarity')

        # Check for the result
        result_element = page.locator('#molarity-result')
        expect(result_element).to_have_text('1.0000 M')

        # Take a screenshot
        page.screenshot(path='jules-scratch/verification/verification.png')

        browser.close()

if __name__ == "__main__":
    run_verification()