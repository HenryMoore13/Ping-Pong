from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestLogin:
    def setup_method(self):
        self.browser = Firefox()

    def teardown_method(self):
        self.browser.quit()

    def test_login_suc(self):
        self.browser.get("http://localhost:5500/")
        assert "Login" in self.browser.find_element_by_id("loginBtn").text

    def test_login_success(self):
        self.browser.get("http://localhost:5500/")
        self.browser.find_element_by_id("loginBtn").click()
        self.browser.find_element_by_id("username").send_keys("henrymoore")
        self.browser.find_element_by_id("password").send_keys("henry")
        self.browser.find_element_by_id("logBtn").click()
        WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.ID, "newGameBtn")))
        assert "Start Game" in self.browser.find_element_by_id(
            "newGameBtn").text

    def test_game(self):
        self.browser.get("http://localhost:5500/")
        self.browser.find_element_by_id("loginBtn").click()
        self.browser.find_element_by_id("username").send_keys("henrymoore")
        self.browser.find_element_by_id("password").send_keys("henry")
        self.browser.find_element_by_id("logBtn").click()
        WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.ID, "newGameBtn")))
        assert "Start Game" in self.browser.find_element_by_id(
            "newGameBtn").text
        self.browser.find_element_by_id("newGameBtn").click()
        self.browser.find_element_by_id("p1USER").send_keys("henrymoore")
        self.browser.find_element_by_id("p2USER").send_keys("henrymoore13")
        self.browser.find_element_by_id("play").click()
        for _ in range(9):
            self.browser.find_element_by_id("ply1UCount").click()
        for _ in range(10):
            self.browser.find_element_by_id("ply2UCount").click()
        WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.ID, "startNew")))
        assert "New Game" in self.browser.find_element_by_id("startNew").text
