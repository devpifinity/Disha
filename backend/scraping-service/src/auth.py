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
        time.sleep(3)  # Give page time to load
        
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
                    time.sleep(5)  # Wait for dashboard page to load (may open in new tab)
                    
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
            # Keep the last opened tab (should be the login page)
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
        print("  1. Click on 'Student Log In' tab in the modal")
        print("  2. Enter your email: kundu.ansh@yahoo.com")
        print("  3. Enter your password")
        print("  4. Click the login/submit button")
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
    """Login to the CareerZoom website"""
    try:
        print(f"Navigating to main website: {main_url}")
        driver.get(main_url)
        
        # Wait for page to load
        wait = WebDriverWait(driver, 10)
        time.sleep(3)  # Give page time to load
        
        # Step 1: Click "Student Dashboard" link/button
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
                if dashboard_element and dashboard_element.is_displayed():
                    print("Found 'Student Dashboard' link, clicking...")
                    dashboard_element.click()
                    time.sleep(5)  # Wait for dashboard page to load (may open in new tab)
                    
                    # Handle tabs - switch to the latest tab if a new one opened
                    if len(driver.window_handles) > 1:
                        print("New tab opened, switching to it...")
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(2)
                    
                    break
            except:
                continue
        
        if not dashboard_element:
            print("Warning: Could not find 'Student Dashboard' link. Trying to continue...")
        
        # Make sure we're on the dashboard page
        current_url = driver.current_url
        if 'dashboard' not in current_url.lower():
            print(f"Current URL: {current_url}")
            print("Trying to navigate directly to dashboard...")
            driver.get("https://careertest.edumilestones.com/student-dashboard/")
            time.sleep(3)
        
        # Step 2: Click "Student Log In" tab in the modal
        print("Step 2: Looking for 'Student Log In' tab in modal...")
        
        # Wait for modal to appear
        time.sleep(3)
        
        # First, try to find the modal/dialog container
        modal_selectors = [
            "//div[contains(@class, 'modal')]",
            "//div[contains(@class, 'dialog')]",
            "//div[contains(@class, 'popup')]",
            "//div[contains(@id, 'modal')]",
            "//div[contains(@id, 'dialog')]",
        ]
        
        modal = None
        for selector in modal_selectors:
            try:
                modals = driver.find_elements(By.XPATH, selector)
                for m in modals:
                    if m.is_displayed():
                        modal = m
                        break
                if modal:
                    break
            except:
                continue
        
        # Priority selectors for tab elements in modal - these should work for tab-like elements
        toggle_selectors = [
            # Most specific: tabs within modal
            "//div[contains(@class, 'modal')]//*[contains(text(), 'Student Log In') and (contains(@class, 'tab') or contains(@class, 'toggle'))]",
            "//div[contains(@class, 'dialog')]//*[contains(text(), 'Student Log In')]",
            # Tab elements by role
            "//*[@role='tab' and contains(text(), 'Student Log In')]",
            "//*[@role='tab' and normalize-space(text())='Student Log In']",
            # Direct text matches (buttons, divs, spans commonly used for tabs)
            "//button[normalize-space(text())='Student Log In']",
            "//div[normalize-space(text())='Student Log In']",
            "//span[normalize-space(text())='Student Log In']",
            "//a[normalize-space(text())='Student Log In']",
            # With contains for partial matches
            "//button[contains(text(), 'Student Log In')]",
            "//div[contains(text(), 'Student Log In')]",
            "//span[contains(text(), 'Student Log In')]",
            "//a[contains(text(), 'Student Log In')]",
            "//label[contains(text(), 'Student Log In')]",
            # Elements that might be tabs with specific classes
            "//*[contains(@class, 'tab') and contains(text(), 'Student Log In')]",
            "//*[contains(@class, 'toggle') and contains(text(), 'Student Log In')]",
            "//*[contains(@class, 'switch') and contains(text(), 'Student Log In')]",
            # Elements near "Student Sign Up" (the other tab)
            "//*[contains(text(), 'Student Sign Up')]/following-sibling::*[contains(text(), 'Student Log In')]",
            "//*[contains(text(), 'Student Sign Up')]/../*[contains(text(), 'Student Log In')]",
            # Any clickable element with the text
            "//*[@onclick and contains(text(), 'Student Log In')]",
            "//*[@role='button' and contains(text(), 'Student Log In')]",
        ]
        
        student_login_element = None
        
        # Try each selector
        for selector in toggle_selectors:
            try:
                elements = driver.find_elements(By.XPATH, selector)
                print(f"Trying selector: {selector[:50]}... Found {len(elements)} elements")
                
                for element in elements:
                    try:
                        # Make sure element is visible and clickable
                        if not element.is_displayed():
                            continue
                        
                        # Get element text to verify it's the right one
                        element_text = element.text.strip()
                        if "student log in" not in element_text.lower():
                            continue
                        
                        # Check if it's already active/selected (if so, we don't need to click)
                        classes = element.get_attribute("class") or ""
                        aria_selected = element.get_attribute("aria-selected") or ""
                        checked = element.get_attribute("checked")
                        
                        # Check parent and siblings for active state
                        try:
                            parent = element.find_element(By.XPATH, "./..")
                            parent_classes = parent.get_attribute("class") or ""
                        except:
                            parent_classes = ""
                        
                        is_active = (
                            "active" in classes.lower() or 
                            "selected" in classes.lower() or 
                            aria_selected.lower() == "true" or 
                            checked == "true" or
                            "active" in parent_classes.lower()
                        )
                        
                        if not is_active:
                            print(f"Found 'Student Log In' tab (text: '{element_text}'), clicking to activate...")
                            # Scroll into view and click
                            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
                            time.sleep(0.5)
                            
                            # Try multiple click methods
                            try:
                                element.click()
                            except:
                                try:
                                    driver.execute_script("arguments[0].click();", element)
                                except:
                                    driver.execute_script("arguments[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));", element)
                            
                            time.sleep(3)  # Wait for login form to appear
                            student_login_element = element
                            print("Successfully clicked 'Student Log In' tab")
                            break
                        else:
                            print("'Student Log In' tab is already active")
                            student_login_element = element
                            break
                            
                    except Exception as e:
                        print(f"Error processing element: {e}")
                        continue
                        
                if student_login_element:
                    break
                    
            except Exception as e:
                print(f"Error with selector: {e}")
                continue
        
        # If toggle not found, try alternative selectors (simpler matches)
        if not student_login_element:
            print("Tab not found with specific selectors, trying alternative methods...")
            # Try finding any element with "Student Log In" text that's clickable
            try:
                all_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Student Log In')]")
                print(f"Found {len(all_elements)} elements containing 'Student Log In' text")
                
                for element in all_elements:
                    try:
                        text = element.text.strip()
                        if "student log in" in text.lower() and element.is_displayed():
                            # Check if parent is clickable instead
                            try:
                                parent = element.find_element(By.XPATH, "./..")
                                if parent.is_displayed():
                                    print(f"Trying parent element with text: '{text}'...")
                                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", parent)
                                    time.sleep(0.5)
                                    parent.click()
                                    time.sleep(3)
                                    student_login_element = parent
                                    print("Successfully clicked parent element")
                                    break
                            except:
                                pass
                            
                            # Try the element itself
                            try:
                                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
                                time.sleep(0.5)
                                element.click()
                                time.sleep(3)
                                student_login_element = element
                                print("Successfully clicked element")
                                break
                            except:
                                pass
                    except:
                        continue
            except Exception as e:
                print(f"Error in fallback search: {e}")
            
            # Last resort: try simpler selectors
            if not student_login_element:
                alt_selectors = [
                    "//button[contains(text(), 'Log In') and not(contains(text(), 'Sign Up'))]",
                    "//div[contains(text(), 'Log In') and not(contains(text(), 'Sign Up'))]",
                    "//span[contains(text(), 'Log In') and not(contains(text(), 'Sign Up'))]",
                    "//*[contains(text(), 'Log In') and not(contains(text(), 'Sign Up'))]",
                ]
                for selector in alt_selectors:
                    try:
                        elements = driver.find_elements(By.XPATH, selector)
                        for element in elements:
                            if element.is_displayed():
                                text = element.text.strip()
                                if "sign up" not in text.lower() and "log in" in text.lower():
                                    print(f"Found login element with text: '{text}', clicking...")
                                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
                                    time.sleep(0.5)
                                    element.click()
                                    time.sleep(2)
                                    student_login_element = element
                                    break
                        if student_login_element:
                            break
                    except:
                        continue
        
        if not student_login_element:
            print("Warning: Could not find 'Student Log In' toggle. The page might already be on login form.")
            print("Proceeding to look for login form fields...")
            time.sleep(2)  # Wait a bit in case form is already visible
        
        # Step 3: Enter credentials
        
        # Wait for email/username input field
        print("Step 3: Looking for email input field...")
        email_selectors = [
            (By.ID, "email"),
            (By.ID, "username"),
            (By.NAME, "email"),
            (By.NAME, "username"),
            (By.XPATH, "//input[@type='email']"),
            (By.XPATH, "//input[@placeholder='Email' or @placeholder='Email Address']"),
        ]
        
        email_field = None
        for by, value in email_selectors:
            try:
                email_field = wait.until(EC.presence_of_element_located((by, value)))
                if email_field:
                    break
            except:
                continue
        
        if not email_field:
            # Try to find by any input that might be email
            email_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[contains(@type, 'email') or contains(@name, 'email') or contains(@id, 'email')]")))
        
        print("Found email field, entering email...")
        email_field.clear()
        email_field.send_keys(email)
        time.sleep(1)
        
        # Find password field
        print("Looking for password input field...")
        password_selectors = [
            (By.ID, "password"),
            (By.NAME, "password"),
            (By.XPATH, "//input[@type='password']"),
        ]
        
        password_field = None
        for by, value in password_selectors:
            try:
                password_field = driver.find_element(by, value)
                if password_field:
                    break
            except:
                continue
        
        if not password_field:
            password_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        
        print("Found password field, entering password...")
        password_field.clear()
        password_field.send_keys(password)
        time.sleep(1)
        
        # Find and click submit/login button
        print("Looking for login button...")
        submit_selectors = [
            (By.XPATH, "//button[@type='submit']"),
            (By.XPATH, "//button[contains(text(), 'Login')]"),
            (By.XPATH, "//button[contains(text(), 'Sign In')]"),
            (By.XPATH, "//input[@type='submit']"),
            (By.XPATH, "//button[contains(@class, 'login') or contains(@class, 'submit')]"),
        ]
        
        submit_button = None
        for by, value in submit_selectors:
            try:
                submit_button = driver.find_element(by, value)
                if submit_button:
                    break
            except:
                continue
        
        if not submit_button:
            submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' or contains(text(), 'Login')]")))
        
        print("Clicking login button...")
        submit_button.click()
        
        # Wait for login to complete
        time.sleep(5)
        
        # Check if login was successful by looking for dashboard or user profile elements
        print("Verifying login...")
        try:
            # Common indicators of successful login
            dashboard_indicators = [
                "//a[contains(text(), 'Dashboard')]",
                "//a[contains(text(), 'Profile')]",
                "//a[contains(text(), 'Logout')]",
                "//div[contains(@class, 'user')]",
            ]
            
            for indicator in dashboard_indicators:
                try:
                    element = driver.find_element(By.XPATH, indicator)
                    if element:
                        print("Login successful!")
                        return True
                except:
                    continue
            
            # If we don't see explicit login indicators, check if we're still on login page
            current_url = driver.current_url
            if "login" not in current_url.lower() and "signin" not in current_url.lower():
                print("Login appears successful (redirected away from login page)")
                
                # Close extra tabs if any, keep only the main tab
                if len(driver.window_handles) > 1:
                    print(f"Closing {len(driver.window_handles) - 1} extra tab(s)...")
                    current_handle = driver.current_window_handle
                    for handle in driver.window_handles:
                        if handle != current_handle:
                            driver.switch_to.window(handle)
                            driver.close()
                    driver.switch_to.window(current_handle)
                
                return True
            else:
                print("Warning: Still on login page, login may have failed")
                return True  # Continue anyway in case the page structure is different
                
        except Exception as e:
            print(f"Could not verify login status, but continuing... Error: {e}")
            return True
        
    except Exception as e:
        print(f"Error during login: {e}")
        print("Attempting to continue anyway...")
        return False

