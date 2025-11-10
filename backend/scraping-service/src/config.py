"""
Configuration file for login credentials and URLs
"""

# Login credentials
LOGIN_EMAIL = "kundu.ansh@yahoo.com"
LOGIN_PASSWORD = "anshk05"

# URLs
MAIN_URL = "https://careerzoom.edumilestones.com/"
COLLEGE_SEARCH_URL = "https://careertest.edumilestones.com/india-colleges/"

# Browser settings
HEADLESS = False  # Set to True to run browser in background
WAIT_TIMEOUT = 10  # Timeout in seconds for element waits

# Output settings
OUTPUT_DIR = "data"
CSV_FILENAME = "colleges_data.csv"

# Scraping settings
MAX_SCROLLS = 50  # Maximum number of scrolls to load all colleges
MAX_PAGES = 10    # Maximum number of pages to scrape (pagination)
SCROLL_PAUSE_TIME = 2  # Seconds to wait between scrolls