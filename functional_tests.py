from selenium.webdriver import Firefox


def test_login_success():
    browser = Firefox()
    browser.get("http://localhost: 5500/")
    assert "login" in browser.find_element_by_id("loginBtn").text
    browser.quit()
