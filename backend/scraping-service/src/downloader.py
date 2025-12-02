"""
Module for downloading college data from the search page
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException, NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
import time
import os
import re
from typing import List, Dict, Optional
from src.utils import clean_text
from src.logger import setup_logger

logger = setup_logger()


def build_search_url(base_url: str, course_category: str = None, specialization: str = None, 
                     city: str = None, university: str = None) -> str:
    """Build search URL with filters"""
    # Base encoded part (MTgyMA==)
    url = f"{base_url}MTgyMA%3D%3D/"
    
    # Add filters in order: course_category/specialization/city/university
    url += f"{course_category or 'null'}/"
    url += f"{specialization or 'null'}/"
    url += f"{city or 'null'}/"
    url += f"{university or 'null'}"
    
    return url


def scroll_to_load_all(driver, max_scrolls=50):
    """Scroll progressively to load all college entries"""
    logger.info("Scrolling to load all colleges...")
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    scroll_attempts = 0
    no_change_count = 0
    
    while scroll_attempts < max_scrolls:
        # Scroll down
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        
        # Check if new content loaded
        new_height = driver.execute_script("return document.body.scrollHeight")
        
        if new_height == last_height:
            no_change_count += 1
            if no_change_count >= 3:
                logger.info("Reached end of page")
                break
        else:
            no_change_count = 0
            logger.info(f"Loaded more content (scroll {scroll_attempts + 1})")
        
        last_height = new_height
        scroll_attempts += 1
        
        # Trigger lazy loading
        if scroll_attempts % 5 == 0:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight - 500);")
            time.sleep(1)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1)
    
    # Scroll back to top
    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(2)
    
    logger.info(f"Scrolling complete: {scroll_attempts} scrolls")


def wait_for_content_update(driver, old_course_name, timeout=5):
    """Wait for the course content to update after clicking"""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            # Check if any visible dropdown button text has changed
            buttons = driver.find_elements(By.CSS_SELECTOR, "button.dropdown-toggle")
            for button in buttons:
                if button.is_displayed():
                    current_text = clean_text(button.text).replace('', '').strip()
                    if current_text != old_course_name and current_text:
                        return True
            time.sleep(0.3)
        except:
            time.sleep(0.3)
    return False


def get_course_options_from_dropdown(driver, card_index: int):
    """Extract all course options from a specific card's dropdown"""
    courses = []
    
    try:
        # Get all cards
        all_cards = driver.find_elements(By.CSS_SELECTOR, "div.college-box")
        if card_index >= len(all_cards):
            return courses
        
        card = all_cards[card_index]
        
        # Scroll to card
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", card)
        time.sleep(0.5)
        
        # Get the dropdown button within this specific card
        dropdown_buttons = card.find_elements(By.CSS_SELECTOR, "button.dropdown-toggle")
        if not dropdown_buttons:
            logger.warning("  No dropdown button found")
            return courses
        
        dropdown_button = dropdown_buttons[0]
        
        # Click to open dropdown
        driver.execute_script("arguments[0].click();", dropdown_button)
        time.sleep(1)
        
        # Wait for dropdown menu to appear
        try:
            # Find the dropdown menu that's currently visible
            dropdown_menus = driver.find_elements(By.CSS_SELECTOR, "ul.dropdown-menu.courses-dropdown")
            visible_menu = None
            for menu in dropdown_menus:
                if menu.is_displayed():
                    visible_menu = menu
                    break
            
            if not visible_menu:
                logger.warning("  No visible dropdown menu found")
                # Try to close any open dropdowns
                driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                return courses
            
            # Get all course items with data-search attribute
            course_items = visible_menu.find_elements(By.CSS_SELECTOR, "li[data-search]")
            
            for item in course_items:
                try:
                    course_name = clean_text(item.text)
                    data_search = item.get_attribute('data-search')
                    data_of = item.get_attribute('data-of')
                    
                    if course_name and data_search:
                        courses.append({
                            'name': course_name,
                            'data_search': data_search,
                            'data_of': data_of
                        })
                except:
                    continue
            
            logger.info(f"  Found {len(courses)} courses in dropdown")
            
        except Exception as e:
            logger.error(f"  Error reading dropdown: {e}")
        
        # Close dropdown
        try:
            driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
            time.sleep(0.5)
        except:
            pass
        
    except Exception as e:
        logger.error(f"  Error opening dropdown: {e}")
    
    return courses


def extract_course_specific_data(driver, card_index: int) -> Optional[Dict]:
    """Extract only course-specific data from a card (not college-level data)"""
    try:
        # Get all cards
        all_cards = driver.find_elements(By.CSS_SELECTOR, "div.college-box")
        if card_index >= len(all_cards):
            return None
        
        card = all_cards[card_index]
        
        course_data = {}
        
        # Extract Course Name (from dropdown button text)
        try:
            course_elem = card.find_element(By.CSS_SELECTOR, "div.dropdown button.dropdown-toggle")
            course_text = clean_text(course_elem.text)
            course_text = course_text.replace('', '').strip()
            course_data['Course Name'] = course_text
        except:
            course_data['Course Name'] = ""
        
        # Extract Fees
        try:
            fees_elem = card.find_element(By.CSS_SELECTOR, "li.current-fees")
            fees_text = clean_text(fees_elem.text)
            fees_text = fees_text.replace('', '').replace('₹', '').strip()
            course_data['Fees'] = fees_text
        except:
            course_data['Fees'] = ""
        
        # Extract Duration
        try:
            duration_elems = card.find_elements(By.TAG_NAME, "li")
            for elem in duration_elems:
                text = clean_text(elem.text)
                if 'year' in text.lower():
                    course_data['Duration'] = text
                    break
            if 'Duration' not in course_data:
                course_data['Duration'] = ""
        except:
            course_data['Duration'] = ""
        
        # Extract Degree Type
        try:
            degree_elems = card.find_elements(By.TAG_NAME, "li")
            for elem in degree_elems:
                text = clean_text(elem.text)
                if 'degree' in text.lower():
                    course_data['Degree Type'] = text
                    break
            if 'Degree Type' not in course_data:
                course_data['Degree Type'] = ""
        except:
            course_data['Degree Type'] = ""
        
        # Extract Exams
        try:
            exam_elems = card.find_elements(By.TAG_NAME, "li")
            for elem in exam_elems:
                text = clean_text(elem.text)
                if 'exam' in text.lower():
                    exam_text = text.replace('Exams:', '').strip()
                    course_data['Entrance Exams'] = exam_text
                    break
            if 'Entrance Exams' not in course_data:
                course_data['Entrance Exams'] = ""
        except:
            course_data['Entrance Exams'] = ""
        
        return course_data
        
    except Exception as e:
        logger.error(f"  Error extracting course data: {e}")
        return None


def extract_college_level_data(driver, card_index: int) -> Optional[Dict]:
    """Extract college-level data (non-course-specific) from a card"""
    try:
        # Get all cards
        all_cards = driver.find_elements(By.CSS_SELECTOR, "div.college-box")
        if card_index >= len(all_cards):
            return None
        
        card = all_cards[card_index]
        
        college_data = {}
        
        # Extract College Name
        try:
            name_elem = card.find_element(By.CSS_SELECTOR, "div.college-img-name h2")
            college_data['College Name'] = clean_text(name_elem.text)
        except:
            try:
                name_elem = card.find_element(By.CSS_SELECTOR, "h2")
                college_data['College Name'] = clean_text(name_elem.text)
            except:
                college_data['College Name'] = ""
        
        # Extract Location
        try:
            location_elem = card.find_element(By.CSS_SELECTOR, "h4.location")
            location_text = clean_text(location_elem.text)
            location_text = location_text.replace('', '').strip()
            college_data['Location'] = location_text
        except:
            college_data['Location'] = ""
        
        # Extract Course Category
        try:
            category_elem = card.find_element(By.CSS_SELECTOR, "div.scholarship-div span")
            college_data['Course Category'] = clean_text(category_elem.text)
        except:
            college_data['Course Category'] = ""
        
        # Extract Total Courses Count
        try:
            courses_elem = card.find_element(By.CSS_SELECTOR, "p.courses-trending")
            courses_text = clean_text(courses_elem.text)
            match = re.search(r'(\d+)\s+Course', courses_text)
            if match:
                college_data['Total Courses'] = match.group(1)
            else:
                college_data['Total Courses'] = courses_text
        except:
            college_data['Total Courses'] = ""
        
        # Extract College Type
        try:
            type_elems = card.find_elements(By.TAG_NAME, "li")
            for elem in type_elems:
                text = clean_text(elem.text)
                if any(keyword in text.lower() for keyword in ['deemed', 'private', 'government', 'public']):
                    college_data['College Type'] = text
                    break
            if 'College Type' not in college_data:
                college_data['College Type'] = ""
        except:
            college_data['College Type'] = ""
        
        # Extract Match Percentage
        try:
            percentage_elem = card.find_element(By.CSS_SELECTOR, "text.percentage")
            college_data['Match Percentage'] = clean_text(percentage_elem.text)
        except:
            college_data['Match Percentage'] = ""
        
        # Extract Match Level
        try:
            match_level_elem = card.find_element(By.CSS_SELECTOR, "div.predictor-box-and-logo h4")
            college_data['Match Level'] = clean_text(match_level_elem.text)
        except:
            college_data['Match Level'] = ""
        
        # Extract Website Link availability
        try:
            card.find_element(By.CSS_SELECTOR, "a.get-university-website")
            college_data['Has Website Link'] = "Yes"
        except:
            college_data['Has Website Link'] = "No"
        
        # Extract College ID
        try:
            data_id = card.get_attribute('data-id')
            college_data['College ID'] = data_id if data_id else ""
        except:
            college_data['College ID'] = ""
        
        return college_data
        
    except Exception as e:
        logger.error(f"  Error extracting college data: {e}")
        return None


def click_course_in_dropdown(driver, card_index: int, data_search: str, max_retries=3) -> bool:
    """Click a specific course in the dropdown"""
    for attempt in range(max_retries):
        try:
            # Get all cards
            all_cards = driver.find_elements(By.CSS_SELECTOR, "div.college-box")
            if card_index >= len(all_cards):
                return False
            
            card = all_cards[card_index]
            
            # Scroll to card
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", card)
            time.sleep(0.5)
            
            # Get current course name before clicking
            try:
                current_button = card.find_element(By.CSS_SELECTOR, "button.dropdown-toggle")
                old_course_name = clean_text(current_button.text).replace('', '').strip()
            except:
                old_course_name = ""
            
            # Open dropdown
            dropdown_button = card.find_element(By.CSS_SELECTOR, "button.dropdown-toggle")
            driver.execute_script("arguments[0].click();", dropdown_button)
            time.sleep(0.8)
            
            # Wait for dropdown to be visible
            time.sleep(0.5)
            
            # Find visible dropdown menu
            dropdown_menus = driver.find_elements(By.CSS_SELECTOR, "ul.dropdown-menu.courses-dropdown")
            visible_menu = None
            for menu in dropdown_menus:
                try:
                    if menu.is_displayed():
                        visible_menu = menu
                        break
                except:
                    continue
            
            if not visible_menu:
                if attempt < max_retries - 1:
                    time.sleep(1)
                    continue
                return False
            
            # Find the course item
            course_item = visible_menu.find_element(By.CSS_SELECTOR, f"li[data-search='{data_search}']")
            
            # Scroll course item into view within dropdown
            driver.execute_script("arguments[0].scrollIntoView({block: 'nearest'});", course_item)
            time.sleep(0.3)
            
            # Click the course
            driver.execute_script("arguments[0].click();", course_item)
            
            # Wait for content to update
            time.sleep(2)
            
            # Verify the change occurred
            updated = wait_for_content_update(driver, old_course_name, timeout=3)
            
            if updated or attempt == max_retries - 1:
                return True
            
        except Exception as e:
            if attempt < max_retries - 1:
                logger.warning(f"    Retry {attempt + 1}/{max_retries}: {str(e)[:80]}")
                time.sleep(1)
                # Try to close any open dropdowns
                try:
                    driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
                    time.sleep(0.5)
                except:
                    pass
            else:
                logger.error(f"    Failed after {max_retries} attempts: {str(e)[:80]}")
                return False
    
    return False


def extract_college_card_data_all_courses(driver, card_index: int) -> Optional[Dict]:
    """Extract data from a single college card with ALL courses as an array"""
    
    try:
        # Get all cards
        all_cards = driver.find_elements(By.CSS_SELECTOR, "div.college-box")
        if card_index >= len(all_cards):
            return None
        
        card = all_cards[card_index]
        
        # Extract college-level data (once for the whole college)
        college_data = extract_college_level_data(driver, card_index)
        
        if not college_data or not college_data.get('College Name'):
            logger.warning(f"  Card {card_index}: Could not find college name, skipping")
            return None
        
        logger.info(f"  Card {card_index}: Processing '{college_data['College Name']}'")
        
        # Initialize courses array
        courses_array = []
        
        # Extract data for the currently displayed course
        current_course_data = extract_course_specific_data(driver, card_index)
        if current_course_data and current_course_data.get('Course Name'):
            courses_array.append(current_course_data)
            logger.info(f"    ✓ Current course: {current_course_data['Course Name']}")
        
        # Get all course options from dropdown
        course_options = get_course_options_from_dropdown(driver, card_index)
        
        if not course_options:
            logger.info(f"    No additional courses found in dropdown")
        else:
            # Iterate through each course option
            for idx, course in enumerate(course_options):
                try:
                    logger.info(f"    Processing course {idx + 1}/{len(course_options)}: {course['name'][:50]}...")
                    
                    # Click the course in dropdown
                    success = click_course_in_dropdown(driver, card_index, course['data_search'])
                    
                    if not success:
                        logger.warning(f"    ✗ Course {idx + 1}/{len(course_options)}: Failed to click")
                        continue
                    
                    # Extract data for this course
                    course_data = extract_course_specific_data(driver, card_index)
                    if course_data and course_data.get('Course Name'):
                        courses_array.append(course_data)
                        logger.info(f"    ✓ Course {idx + 1}/{len(course_options)}: {course_data['Course Name']}")
                    else:
                        logger.warning(f"    ✗ Course {idx + 1}/{len(course_options)}: Failed to extract data")
                    
                except Exception as e:
                    logger.error(f"    ✗ Course {idx + 1}/{len(course_options)}: Error - {str(e)[:100]}")
                    continue
        
        # Add courses array to college data
        college_data['Courses'] = courses_array
        
        logger.info(f"    Total courses extracted: {len(courses_array)}")
        
        return college_data
        
    except Exception as e:
        logger.error(f"  Error extracting college card data: {e}")
        import traceback
        traceback.print_exc()
        return None


def extract_college_data(driver) -> List[Dict]:
    """Extract college data from the search results page"""
    colleges = []
    
    try:
        wait = WebDriverWait(driver, 10)
        time.sleep(3)
        
        logger.info("Extracting college data...")
        
        # Scroll to load all results
        scroll_to_load_all(driver)
        
        # Find all college cards
        logger.info("Looking for college cards...")
        college_cards = driver.find_elements(By.CSS_SELECTOR, "div.college-box")
        
        if not college_cards:
            logger.warning("No college cards found")
            return []
        
        logger.info(f"Found {len(college_cards)} college cards")
        logger.info("Extracting data for all courses in each college...\n")
        
        # Extract data from each card
        for idx in range(len(college_cards)):
            try:
                # Extract college with all courses
                college_data = extract_college_card_data_all_courses(driver, idx)
                if college_data:
                    colleges.append(college_data)
                
                logger.info("")  # Blank line between colleges
                
            except Exception as e:
                logger.error(f"  Error processing card {idx}: {e}")
                continue
        
        logger.info(f"\nExtraction complete:")
        logger.info(f"  - Total college cards processed: {len(college_cards)}")
        logger.info(f"  - Total colleges extracted: {len(colleges)}")
        total_courses = sum(len(c.get('Courses', [])) for c in colleges)
        logger.info(f"  - Total course records extracted: {total_courses}")
        
    except Exception as e:
        logger.error(f"Error extracting college data: {e}")
        import traceback
        traceback.print_exc()
    
    return colleges


def try_download_report(driver):
    """Try to download CSV report using the Report button"""
    try:
        wait = WebDriverWait(driver, 10)
        logger.info("Checking for 'Report' button to download CSV...")
        
        report_selectors = [
            "//button[contains(text(), 'Report')]",
            "//a[contains(text(), 'Report')]",
            "//*[contains(text(), 'Report') and contains(text(), 'Download')]",
            "//button[contains(@class, 'report')]",
            "//a[contains(@href, 'report') or contains(@href, 'download')]",
        ]
        
        for selector in report_selectors:
            try:
                report_btn = driver.find_element(By.XPATH, selector)
                if report_btn.is_displayed() and report_btn.is_enabled():
                    logger.info("Found 'Report' button, clicking to download CSV...")
                    report_btn.click()
                    time.sleep(5)
                    logger.info("CSV download initiated via Report button")
                    return True
            except:
                continue
        
        logger.warning("Report button not found or not clickable")
        return False
        
    except Exception as e:
        logger.error(f"Error trying to download report: {e}")
        return False


def get_all_results(driver, max_pages=10):
    """Handle pagination and get all results"""
    all_colleges = []
    
    try:
        page = 1
        while page <= max_pages:
            logger.info(f"\nExtracting page {page}...")
            colleges = extract_college_data(driver)
            all_colleges.extend(colleges)
            
            # Try to find and click next page button
            try:
                next_button = driver.find_element(By.XPATH, 
                    "//a[contains(text(), 'Next')] | //button[contains(text(), 'Next')] | //a[contains(@class, 'next')]")
                if next_button.is_enabled():
                    next_button.click()
                    time.sleep(3)
                    page += 1
                else:
                    break
            except:
                # No next button found
                break
                
    except Exception as e:
        logger.error(f"Error getting all results: {e}")
    
    return all_colleges