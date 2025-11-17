"""
Batch Configuration for College Data Scraper
============================================

Define multiple scraping tasks to be executed sequentially.
Each task will be processed with a configurable delay between executions.

Format:
    Each task is a dictionary with the following keys:
    - course_category: Course category (e.g., "Engineering", "Management") or None
    - specialization: Specialization (e.g., "Science", "Computer") or None
    - city: City name (e.g., "Chandigarh", "Bangalore") or None
    - university: University name (e.g., "Chitkara", "VIT") or None
    - format: Output format - "csv", "json", or "both" (default: "json")
"""

# Delay between each batch task (in seconds)
BATCH_DELAY = 5

# Define your batch scraping tasks here
BATCH_TASKS = [
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Tumkur",
    #     "university": None,
    #     "format": "json"
    # },
    {
        "course_category": "Engineering",
        "specialization": None,
        "city": "Mandya",
        "university": None,
        "format": "json"
    },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Kolar",
    #     "university": None,
    #     "format": "json"
    # },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Chikkaballapur",
    #     "university": None,
    #     "format": "json"
    # },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Kanakapura",
    #     "university": None,
    #     "format": "json"
    # },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Mysore",
    #     "university": None,
    #     "format": "json"
    # },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Hosur",
    #     "university": None,
    #     "format": "json"
    # },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Krishnagiri",
    #     "university": None,
    #     "format": "json"
    # },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Hassan",
    #     "university": None,
    #     "format": "json"
    # },
    # {
    #     "course_category": "Engineering",
    #     "specialization": None,
    #     "city": "Chitradurga",
    #     "university": None,
    #     "format": "json"
    # },
    # Add more tasks as needed
    # Example with different parameters:
    # {
    #     "course_category": "Management",
    #     "specialization": "MBA",
    #     "city": "Delhi",
    #     "university": None,
    #     "format": "both"
    # },
]

# Alternative: Load tasks from CSV file
# If you prefer to manage tasks in a CSV file, set this to True
USE_CSV_CONFIG = False
CSV_CONFIG_FILE = "batch_tasks.csv"

"""
CSV Format (batch_tasks.csv):
course_category,specialization,city,university,format
Engineering,null,Chandigarh,null,json
Engineering,null,Bangalore,null,json
Engineering,null,Hubli,null,json
Management,MBA,Delhi,null,both
"""