"""
Authentication module for logging into the CareerZoom website
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time
import os
import platform
import stat


def find_chromedriver_path(driver_path):
    """Find the actual chromedriver binary from the path returned by webdriver-manager"""
    # If the path is a file and executable, use it
    if os.path.isfile(driver_path) and os.access(driver_path, os.X_OK):
        # But make sure it's not a text file or notices file
        if 'notice' not in driver_path.lower() and 'third' not in driver_path.lower():
            return driver_path
    
    # If it's pointing to a file but wrong file (like THIRD_PARTY_NOTICES.chromedriver), 
    # look for chromedriver in the same directory
    if os.path.isfile(driver_path):
        parent_dir = os.path.dirname(driver_path)
        # Check for chromedriver in the same directory
        chromedriver_in_same_dir = os.path.join(parent_dir, 'chromedriver')
        if os.path.isfile(chromedriver_in_same_dir):
            os.chmod(chromedriver_in_same_dir, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
            return chromedriver_in_same_dir
        driver_path = parent_dir
    
    # If it's a directory, look for chromedriver inside
    if os.path.isdir(driver_path):
        # First, check if there's a chromedriver-mac-x64 or chromedriver-mac-arm64 subdirectory
        subdirs = ['chromedriver-mac-x64', 'chromedriver-mac-arm64', 'chromedriver']
        for subdir in subdirs:
            subdir_path = os.path.join(driver_path, subdir)
            if os.path.isdir(subdir_path):
                # Look for chromedriver binary inside this subdirectory
                binary_path = os.path.join(subdir_path, 'chromedriver')
                if os.path.isfile(binary_path):
                    os.chmod(binary_path, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
                    return binary_path
        
        # Look for chromedriver directly in the directory
        possible_names = ['chromedriver']
        for name in possible_names:
            potential_path = os.path.join(driver_path, name)
            if os.path.isfile(potential_path):
                # Make it executable
                os.chmod(potential_path, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
                return potential_path
        
        # Search recursively for chromedriver (excluding text files and notice files)
        for root, dirs, files in os.walk(driver_path):
            for file in files:
                if file == 'chromedriver' or (file.startswith('chromedriver') and not any(ext in file for ext in ['.txt', '.md', '.pdf'])):
                    full_path = os.path.join(root, file)
                    # Check if it's actually a binary (not a text file)
                    if not file.endswith('.txt') and 'notice' not in file.lower() and 'third' not in file.lower():
                        try:
                            # Make it executable
                            os.chmod(full_path, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
                            return full_path
                        except:
                            continue
    
    return driver_path


def create_driver(headless=False):
    """Create and configure Chrome WebDriver"""
    chrome_options = Options()
    if headless:
        chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    try:
        # Get the driver path from webdriver-manager
        driver_path = ChromeDriverManager().install()
        
        # Fix the path if needed (webdriver-manager sometimes returns wrong path on macOS)
        driver_path = find_chromedriver_path(driver_path)
        
        print(f"Using ChromeDriver at: {driver_path}")
        service = Service(driver_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)
        return driver
    except Exception as e:
        print(f"Error setting up ChromeDriver: {e}")
        print("Attempting to use system ChromeDriver...")
        # Fallback to system chromedriver if available
        try:
            service = Service()  # Will use system PATH
            driver = webdriver.Chrome(service=service, options=chrome_options)
            return driver
        except Exception as e2:
            raise Exception(f"Failed to initialize ChromeDriver. Please install ChromeDriver manually. Error: {e2}")


def manual_login(driver, main_url):
    """Opens the login page and waits for user to manually log in"""
    try:
        print(f"Navigating to main website: {main_url}")
        driver.get(main_url)
        
        # Wait for page to load
        wait = WebDriverWait(driver, 10)
        time.sleep(3)
        
        # Step 1: Click "Student Dashboard" link/button
        print("\nStep 1: Looking for 'Student Dashboard' link...")
        dashboard_selectors = [
            "//a[contains(text(), 'Student Dashboard')]",
            "//a[contains(text(), 'Student Dashboard') and contains(@href, 'dashboard')]",
            "//a[contains(@href, 'dashboard')]",
            "//*[contains(text(), 'Student Dashboard')]",
        ]
        
        dashboard_element = None
        for selector in dashboard_selectors:
            try:
                dashboard_element = wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                if dashboard_element and dashboard_element.is_displayed():
                    print("Found 'Student Dashboard' link, clicking...")
                    dashboard_element.click()
                    time.sleep(5)
                    
                    # Handle tabs - switch to the latest tab if a new one opened
                    if len(driver.window_handles) > 1:
                        print("New tab opened, switching to it...")
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(2)
                    
                    break
            except:
                continue
        
        if not dashboard_element:
            print("Warning: Could not find 'Student Dashboard' link. Navigating directly...")
            driver.get("https://careertest.edumilestones.com/student-dashboard/")
            time.sleep(3)
        
        # Ensure we're on the dashboard/login page
        current_url = driver.current_url
        print(f"\nCurrent URL: {current_url}")
        
        # Close extra tabs if any, keep the login tab
        if len(driver.window_handles) > 1:
            print(f"Found {len(driver.window_handles)} tabs, keeping the login tab open...")
            current_handle = driver.current_window_handle
            for handle in driver.window_handles:
                if handle != current_handle:
                    try:
                        driver.switch_to.window(handle)
                        driver.close()
                    except:
                        pass
            driver.switch_to.window(current_handle)
        
        print("\n" + "="*60)
        print("MANUAL LOGIN REQUIRED")
        print("="*60)
        print("\nPlease complete the login process in the browser:")
        print("  1. Click on 'Student Log In' tab")
        print("  2. Enter your email: kundu.ansh@yahoo.com")
        print("  3. Enter your password")
        print("  4. Click the 'LOG IN' button")
        print("  5. Wait until you're logged in and see the dashboard")
        print("\nThe browser window will remain open for you to log in.")
        print("="*60)
        
        # Wait for user to manually log in
        input("\nPress Enter AFTER you have successfully logged in and the dashboard is visible...")
        
        # Give a moment for any final page loads
        time.sleep(2)
        
        # Check if login was successful by looking at URL or page content
        final_url = driver.current_url
        print(f"\nFinal URL after login: {final_url}")
        
        if 'dashboard' in final_url.lower() or 'login' not in final_url.lower():
            print("✅ Login appears successful!")
            return True
        else:
            print("⚠️  Warning: Still appears to be on login page.")
            print("Continuing anyway - please make sure you're logged in...")
            return True
            
    except Exception as e:
        print(f"Error during manual login setup: {e}")
        print("Continuing anyway...")
        return True


def login(driver, email, password, main_url):
    """Login to the CareerZoom website - iframe aware version"""
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    import time

    try:
        print(f"Navigating to main website: {main_url}")
        driver.get(main_url)
        wait = WebDriverWait(driver, 20)
        time.sleep(3)

        # Step 1: Click "Student Dashboard" link
        print("Step 1: Looking for 'Student Dashboard' link...")
        dashboard_selectors = [
            "//a[contains(text(), 'Student Dashboard')]",
            "//a[contains(text(), 'Student Dashboard') and contains(@href, 'dashboard')]",
            "//a[contains(@href, 'dashboard')]",
            "//*[contains(text(), 'Student Dashboard')]",
        ]

        dashboard_element = None
        for selector in dashboard_selectors:
            try:
                dashboard_element = wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                if dashboard_element.is_displayed():
                    print("Found 'Student Dashboard' link, clicking...")
                    dashboard_element.click()
                    time.sleep(5)
                    if len(driver.window_handles) > 1:
                        print("New tab opened, switching to it...")
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(2)
                    break
            except:
                continue

        if not dashboard_element:
            print("Warning: Could not find 'Student Dashboard' link. Trying to navigate directly...")
            driver.get("https://careertest.edumilestones.com/student-dashboard/")
            time.sleep(3)

        current_url = driver.current_url
        print(f"Current URL: {current_url}")

        # Step 2: Wait for iframe to appear and switch into it
        print("\nStep 2: Locating and switching to login iframe...")
        iframe = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "iframe.loginIframe"))
        )
        driver.switch_to.frame(iframe)
        print("✅ Switched to iframe context")

        # Step 3: Activate "Student Log In" tab
        print("\nStep 3: Activating 'Student Log In' tab inside iframe...")
        try:
            login_tab = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//a[@data-toggle='tab' and @href='#login']"))
            )
            driver.execute_script("arguments[0].click();", login_tab)
            wait.until(lambda d: "in active" in d.find_element(By.ID, "login").get_attribute("class"))
            print("✅ 'Student Log In' tab activated")
        except Exception as e:
            print(f"⚠️ Could not click tab normally ({e}), forcing it active via JS...")
            driver.execute_script("""
                document.querySelector('#signup')?.classList.remove('in', 'active');
                document.querySelector('#login')?.classList.add('in', 'active');
                document.querySelector('#login')?.style.removeProperty('display');
            """)
            time.sleep(1)
            print("✅ 'Student Log In' tab forced active via JS.")

        # Step 4: Wait for login form fields
        print("\nStep 4: Waiting for login form fields...")
        email_field = wait.until(EC.visibility_of_element_located((By.ID, "email")))
        password_field = wait.until(EC.visibility_of_element_located((By.ID, "password")))
        print("✅ Email and password fields are visible")

        # Step 5: Fill credentials
        print("Entering credentials...")
        email_field.clear()
        email_field.send_keys(email)
        password_field.clear()
        password_field.send_keys(password)
        time.sleep(1)

        # Step 6: Click Login
        print("\nStep 6: Clicking login button...")
        login_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'LOG IN')]"))
        )
        driver.execute_script("arguments[0].click();", login_button)
        print("✅ Login button clicked")

        # Step 7: Wait for login completion
        print("\nStep 7: Waiting for login to complete...")
        time.sleep(5)

        # Switch back to main document
        driver.switch_to.default_content()
        print("✅ Switched back to main document")

        # Step 8: Verify login success
        final_url = driver.current_url
        print(f"Final URL after login: {final_url}")

        if "student-dashboard" in final_url.lower() or "login" not in final_url.lower():
            print("\n✅ Login appears successful!")
            return True
        else:
            print("\n⚠️ Could not verify login success, continuing anyway...")
            return True

    except Exception as e:
        print(f"\n❌ Error during login: {e}")
        import traceback
        traceback.print_exc()
        print("\nAttempting to continue anyway...")
        try:
            driver.switch_to.default_content()
        except:
            pass
        return False

