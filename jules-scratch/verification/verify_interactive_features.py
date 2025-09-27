import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # --- Test Unit Conversion Modal ---
        modal = page.locator('#unit-conversion-modal')

        # Trigger the modal
        page.fill('#solute-mass', '58.44')
        page.fill('#molecular-weight', '58.44')
        page.fill('#solution-volume', '1000')
        page.select_option('#volume-unit', 'mL')
        page.click('#calculate-molarity')

        # Verify modal content and close it
        expect(modal).to_be_visible()
        expect(modal.locator('h3')).to_have_text('Unit Conversion Alert!')
        page.click('.close-button')
        expect(modal).to_be_hidden()

        # --- Test Conceptual Quiz ---
        feedback_div = page.locator('#quiz-feedback')

        # Test incorrect answer
        page.check('input[name="quiz-answer"][value="c"]')
        page.click('#check-quiz-answer')
        expect(feedback_div).to_be_visible()
        expect(feedback_div).to_have_class('feedback incorrect')
        expect(feedback_div).to_contain_text('Incorrect.')

        # Test correct answer
        page.check('input[name="quiz-answer"][value="b"]')
        page.click('#check-quiz-answer')
        expect(feedback_div).to_be_visible()
        expect(feedback_div).to_have_class('feedback correct')
        expect(feedback_div).to_contain_text('Correct!')

        # Take a full page screenshot
        page.screenshot(path='jules-scratch/verification/verification.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()