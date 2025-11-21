"""
Batch Runner for College Data Scraper
======================================

Executes multiple scraping tasks sequentially based on batch_config.py
"""

import sys
import os
import time
import csv
from datetime import datetime
from src.config import (
    LOGIN_EMAIL, 
    LOGIN_PASSWORD, 
    MAIN_URL, 
    COLLEGE_SEARCH_URL,
    HEADLESS,
    OUTPUT_DIR
)
from src.auth import create_driver, login, manual_login
from src.downloader import get_all_results, try_download_report, build_search_url
from src.utils import save_data
from batch_config import BATCH_TASKS, BATCH_DELAY, USE_CSV_CONFIG, CSV_CONFIG_FILE


class BatchRunner:
    """Handles batch execution of scraping tasks"""
    
    def __init__(self, headless=False, manual_login_mode=False):
        self.headless = headless
        self.manual_login_mode = manual_login_mode
        self.driver = None
        self.logged_in = False
        self.results_summary = []
        
    def load_tasks_from_csv(self, csv_file):
        """Load batch tasks from CSV file"""
        tasks = []
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    task = {
                        'course_category': None if row.get('course_category', '').lower() in ['null', ''] else row['course_category'],
                        'specialization': None if row.get('specialization', '').lower() in ['null', ''] else row.get('specialization'),
                        'city': None if row.get('city', '').lower() in ['null', ''] else row.get('city'),
                        'university': None if row.get('university', '').lower() in ['null', ''] else row.get('university'),
                        'format': row.get('format', 'json')
                    }
                    tasks.append(task)
            print(f"✅ Loaded {len(tasks)} tasks from {csv_file}")
        except FileNotFoundError:
            print(f"❌ CSV file not found: {csv_file}")
            print(f"   Please create the file or set USE_CSV_CONFIG=False in batch_config.py")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error reading CSV file: {e}")
            sys.exit(1)
        
        return tasks
    
    def initialize_driver(self):
        """Initialize browser driver and perform login once"""
        print("\n" + "="*70)
        print("Initializing Browser and Login")
        print("="*70)
        
        try:
            # Create browser driver
            print("Creating browser instance...")
            headless_mode = HEADLESS or self.headless
            self.driver = create_driver(headless=headless_mode)
            
            # Login once
            if self.manual_login_mode:
                print("\nOpening login page for manual login...")
                manual_login(self.driver, MAIN_URL)
                self.logged_in = True
            else:
                print("\nAttempting automatic login...")
                login_success = login(self.driver, LOGIN_EMAIL, LOGIN_PASSWORD, MAIN_URL)
                
                if not login_success:
                    print("\n⚠️  Automatic login failed. Falling back to manual login...")
                    manual_login(self.driver, MAIN_URL)
                    self.logged_in = True
                else:
                    self.logged_in = True
            
            # Clean up extra tabs
            time.sleep(1)
            if len(self.driver.window_handles) > 1:
                print("\nCleaning up extra tabs...")
                current_handle = self.driver.current_window_handle
                for handle in self.driver.window_handles:
                    if handle != current_handle:
                        try:
                            self.driver.switch_to.window(handle)
                            self.driver.close()
                        except:
                            pass
                self.driver.switch_to.window(current_handle)
                time.sleep(2)
            
            print("✅ Browser initialized and logged in successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Failed to initialize browser: {e}")
            return False
    
    def execute_task(self, task_num, task, total_tasks):
        """Execute a single scraping task"""
        print("\n" + "="*70)
        print(f"Task {task_num}/{total_tasks}")
        print("="*70)
        
        # Extract task parameters
        course_category = task.get('course_category')
        specialization = task.get('specialization')
        city = task.get('city')
        university = task.get('university')
        output_format = task.get('format', 'json')
        
        # Determine output formats
        output_formats = []
        if output_format == 'both':
            output_formats = ['csv', 'json']
        else:
            output_formats = [output_format]
        
        print(f"Filters:")
        print(f"  - Course Category: {course_category or 'All'}")
        print(f"  - Specialization:  {specialization or 'All'}")
        print(f"  - City:            {city or 'All'}")
        print(f"  - University:      {university or 'All'}")
        print(f"  - Output Format:   {', '.join(output_formats).upper()}")
        
        task_start_time = time.time()
        task_result = {
            'task_num': task_num,
            'course_category': course_category or 'All',
            'specialization': specialization or 'All',
            'city': city or 'All',
            'university': university or 'All',
            'format': ', '.join(output_formats).upper(),
            'status': 'Failed',
            'colleges_found': 0,
            'courses_found': 0,
            'files_saved': [],
            'duration': 0,
            'error': None
        }
        
        try:
            # Build search URL with filters
            search_url = build_search_url(
                COLLEGE_SEARCH_URL,
                course_category,
                specialization,
                city,
                university
            )
            
            # Navigate to college search page with filters
            print(f"\nNavigating to search page...")
            print(f"URL: {search_url}")
            self.driver.get(search_url)
            
            # Wait for page to load
            time.sleep(5)
            
            # Try to download via Report button first (if available)
            print(f"\nAttempting to download CSV via Report button...")
            report_downloaded = try_download_report(self.driver)
            
            # Extract all college data
            print(f"\nExtracting college data from page...")
            colleges = get_all_results(self.driver)
            
            if not colleges and not report_downloaded:
                print("\n⚠️  Warning: No college data extracted")
                task_result['error'] = "No colleges found for given filters"
            else:
                if colleges:
                    # Calculate total courses
                    total_courses = sum(len(c.get('Courses', [])) for c in colleges)
                    
                    # Generate base filename from filters
                    filter_parts = []
                    if course_category:
                        filter_parts.append(course_category)
                    if specialization:
                        filter_parts.append(specialization)
                    if city:
                        filter_parts.append(city)
                    if university:
                        filter_parts.append(university)
                    
                    base_filename = "_".join(filter_parts) if filter_parts else "colleges_data"
                    base_filename = base_filename.replace(" ", "_")
                    
                    # Save to specified format(s)
                    print(f"\nSaving {len(colleges)} colleges...")
                    # Also save/update search criteria in Supabase so records are upserted
                    saved_files = save_data(
                        colleges,
                        OUTPUT_DIR,
                        base_filename,
                        output_formats,
                        manual_login=True,
                        career_path=course_category,
                        specialization=specialization,
                        location=city,
                        university=university
                    )
                    
                    task_result['status'] = 'Success'
                    task_result['colleges_found'] = len(colleges)
                    task_result['courses_found'] = total_courses
                    task_result['files_saved'] = list(saved_files.values())
                    
                    print(f"\n✅ Task {task_num} completed successfully!")
                    print(f"   Colleges: {len(colleges)}")
                    print(f"   Courses: {total_courses}")
                    for fmt, filepath in saved_files.items():
                        print(f"   {fmt.upper()}: {filepath}")
                
                if report_downloaded:
                    print("\n✅ CSV download initiated via Report button")
                    if task_result['status'] != 'Success':
                        task_result['status'] = 'Success (Report Download)'
            
        except Exception as e:
            print(f"\n❌ Task {task_num} failed: {e}")
            task_result['error'] = str(e)
            import traceback
            traceback.print_exc()
        
        task_result['duration'] = time.time() - task_start_time
        self.results_summary.append(task_result)
        
        return task_result['status'] == 'Success'
    
    def print_summary(self):
        """Print summary of all executed tasks"""
        print("\n" + "="*70)
        print("BATCH EXECUTION SUMMARY")
        print("="*70)
        
        total_tasks = len(self.results_summary)
        successful_tasks = sum(1 for r in self.results_summary if r['status'] == 'Success')
        failed_tasks = total_tasks - successful_tasks
        total_colleges = sum(r['colleges_found'] for r in self.results_summary)
        total_courses = sum(r['courses_found'] for r in self.results_summary)
        total_duration = sum(r['duration'] for r in self.results_summary)
        
        print(f"\nOverall Statistics:")
        print(f"  Total Tasks:        {total_tasks}")
        print(f"  Successful:         {successful_tasks}")
        print(f"  Failed:             {failed_tasks}")
        print(f"  Total Colleges:     {total_colleges}")
        print(f"  Total Courses:      {total_courses}")
        print(f"  Total Duration:     {total_duration:.2f}s ({total_duration/60:.2f} min)")
        
        print(f"\nTask Details:")
        print("-" * 70)
        
        for result in self.results_summary:
            status_icon = "✅" if result['status'] == 'Success' else "❌"
            print(f"\n{status_icon} Task {result['task_num']}: {result['status']}")
            print(f"   Category: {result['course_category']}, City: {result['city']}")
            print(f"   Colleges: {result['colleges_found']}, Courses: {result['courses_found']}")
            print(f"   Duration: {result['duration']:.2f}s")
            
            if result['files_saved']:
                for filepath in result['files_saved']:
                    print(f"   Saved: {filepath}")
            
            if result['error']:
                print(f"   Error: {result['error']}")
        
        print("\n" + "="*70)
        
        # Save summary to file
        self.save_summary_report()
    
    def save_summary_report(self):
        """Save execution summary to a file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_filename = f"batch_summary_{timestamp}.txt"
        report_path = os.path.join(OUTPUT_DIR, report_filename)
        
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("="*70 + "\n")
            f.write("BATCH EXECUTION SUMMARY\n")
            f.write("="*70 + "\n")
            f.write(f"Execution Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            total_tasks = len(self.results_summary)
            successful_tasks = sum(1 for r in self.results_summary if r['status'] == 'Success')
            failed_tasks = total_tasks - successful_tasks
            total_colleges = sum(r['colleges_found'] for r in self.results_summary)
            total_courses = sum(r['courses_found'] for r in self.results_summary)
            total_duration = sum(r['duration'] for r in self.results_summary)
            
            f.write("Overall Statistics:\n")
            f.write(f"  Total Tasks:        {total_tasks}\n")
            f.write(f"  Successful:         {successful_tasks}\n")
            f.write(f"  Failed:             {failed_tasks}\n")
            f.write(f"  Total Colleges:     {total_colleges}\n")
            f.write(f"  Total Courses:      {total_courses}\n")
            f.write(f"  Total Duration:     {total_duration:.2f}s ({total_duration/60:.2f} min)\n\n")
            
            f.write("Task Details:\n")
            f.write("-" * 70 + "\n")
            
            for result in self.results_summary:
                f.write(f"\nTask {result['task_num']}: {result['status']}\n")
                f.write(f"  Filters:\n")
                f.write(f"    - Course Category: {result['course_category']}\n")
                f.write(f"    - Specialization:  {result['specialization']}\n")
                f.write(f"    - City:            {result['city']}\n")
                f.write(f"    - University:      {result['university']}\n")
                f.write(f"  Results:\n")
                f.write(f"    - Colleges Found:  {result['colleges_found']}\n")
                f.write(f"    - Courses Found:   {result['courses_found']}\n")
                f.write(f"    - Duration:        {result['duration']:.2f}s\n")
                f.write(f"    - Format:          {result['format']}\n")
                
                if result['files_saved']:
                    f.write(f"  Files Saved:\n")
                    for filepath in result['files_saved']:
                        f.write(f"    - {filepath}\n")
                
                if result['error']:
                    f.write(f"  Error: {result['error']}\n")
        
        print(f"\n📄 Summary report saved to: {report_path}")
    
    def run(self):
        """Run all batch tasks"""
        start_time = time.time()
        
        # Load tasks
        if USE_CSV_CONFIG:
            print("Loading tasks from CSV file...")
            tasks = self.load_tasks_from_csv(CSV_CONFIG_FILE)
        else:
            print("Loading tasks from batch_config.py...")
            tasks = BATCH_TASKS
        
        if not tasks:
            print("❌ No tasks defined. Please add tasks to batch_config.py or CSV file.")
            return
        
        print(f"✅ Loaded {len(tasks)} tasks to execute")
        
        # Initialize driver and login once
        if not self.initialize_driver():
            print("❌ Failed to initialize browser. Aborting batch execution.")
            return
        
        # Execute all tasks
        try:
            for idx, task in enumerate(tasks, 1):
                self.execute_task(idx, task, len(tasks))
                
                # Add delay between tasks (except after the last one)
                if idx < len(tasks):
                    print(f"\n⏳ Waiting {BATCH_DELAY} seconds before next task...")
                    time.sleep(BATCH_DELAY)
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Batch execution interrupted by user")
        except Exception as e:
            print(f"\n❌ Batch execution error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            # Print summary
            self.print_summary()
            
            # Close browser
            if self.driver:
                print("\nClosing browser...")
                self.driver.quit()
            
            total_time = time.time() - start_time
            print(f"\n⏱️  Total execution time: {total_time:.2f}s ({total_time/60:.2f} min)")
            print("Done!")


def main():
    """Main entry point for batch runner"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Batch College Data Scraper - Execute multiple scraping tasks',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument('--headless', 
                        action='store_true',
                        help='Run browser in headless mode')
    parser.add_argument('--manual-login',
                        action='store_true',
                        help='Use manual login instead of automatic')
    
    args = parser.parse_args()
    
    print("="*70)
    print("College Data Scraper - Batch Mode")
    print("="*70)
    print()
    
    runner = BatchRunner(
        headless=args.headless,
        manual_login_mode=args.manual_login
    )
    
    runner.run()


if __name__ == "__main__":
    main()