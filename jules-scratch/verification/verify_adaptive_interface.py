import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        procedure_guidance = page.locator('#procedure-guidance')
        conceptual_quiz = page.locator('#conceptual-quiz')
        content_library = page.locator('#content-library')
        # The clickable element is the label containing the switch
        mode_switch_label = page.locator('label.switch')

        # --- 1. Verify Default (Guided Mode) ---
        expect(procedure_guidance).to_be_visible()
        expect(conceptual_quiz).to_be_visible()
        expect(content_library).to_be_visible()
        page.screenshot(path='jules-scratch/verification/guided-mode.png', full_page=True)

        # --- 2. Switch to Expert Mode and Verify ---
        mode_switch_label.click()
        expect(procedure_guidance).to_be_hidden()
        expect(conceptual_quiz).to_be_hidden()
        expect(content_library).to_be_hidden()
        page.screenshot(path='jules-scratch/verification/expert-mode.png', full_page=True)

        # --- 3. Switch back to Guided Mode and Verify ---
        mode_switch_label.click()
        expect(procedure_guidance).to_be_visible()
        expect(conceptual_quiz).to_be_visible()
        expect(content_library).to_be_visible()

        browser.close()

if __name__ == "__main__":
    run_verification()