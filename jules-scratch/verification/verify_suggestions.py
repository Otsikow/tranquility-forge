
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:8082/chat")
    page.wait_for_selector("textarea[placeholder=\"Share what's on your mind...\"]")
    page.get_by_placeholder("Share what's on your mind...").click()
    page.get_by_placeholder("Share what's on your mind...").fill("I'm feeling anxious about work")
    page.get_by_label("Send message").click()
    page.wait_for_selector("text=Let's try the breathing exercise")
    page.screenshot(path="jules-scratch/verification/suggestions.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
