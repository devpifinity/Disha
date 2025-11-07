"""
Main script to login, filter, and download college data
Usage:
    python main.py <course_category> <specialization> <city> <university> [--format csv|json|both]
    
Example:
    python main.py Engineering Science Chandigarh Chitkara --format both
    python main.py Engineering null Delhi null --format json
"""

import sys
import os
import argparse
from src.config import (
    LOGIN_EMAIL, 
    LOGIN_PASSWORD, 
    MAIN_URL, 
    COLLEGE_SEARCH_URL,
    HEADLESS,
    OUTPUT_DIR,
    CSV_FILENAME
)
from src.auth import create_driver, manual_login
from src.downloader import get_all_results, try_download_report, build_search_url
from src.utils import save_data


def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='College Data Downloader - Scrape college information with filters',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
        Examples:
        python main.py Engineering Science Chandigarh Chitkara
        python main.py Engineering null Delhi null --format both
        python main.py null null Bangalore null --format json
        
        Note: Use 'null' for filters you want to skip
                """
    )
    
    parser.add_argument('course_category', 
                        help='Course category (e.g., Engineering, Management) or null')
    parser.add_argument('specialization', 
                        help='Specialization (e.g., Science, Computer) or null')
    parser.add_argument('city', 
                        help='City name (e.g., Delhi, Bangalore) or null')
    parser.add_argument('university', 
                        help='University name (e.g., Chitkara, VIT) or null')
    parser.add_argument('--format', '-f', 
                        choices=['csv', 'json', 'both'],
                        default='csv',
                        help='Output format (default: csv)')
    parser.add_argument('--headless', 
                        action='store_true',
                        help='Run browser in headless mode')
    
    return parser.parse_args()


def main():
    """Main function to execute the data download process"""
    args = parse_arguments()
    
    # Convert 'null' strings to None
    course_category = None if args.course_category.lower() == 'null' else args.course_category
    specialization = None if args.specialization.lower() == 'null' else args.specialization
    city = None if args.city.lower() == 'null' else args.city
    university = None if args.university.lower() == 'null' else args.university
    
    # Determine output formats
    output_formats = []
    if args.format == 'both':
        output_formats = ['csv', 'json']
    else:
        output_formats = [args.format]
    
    print("=" * 70)
    print("College Data Downloader")
    print("=" * 70)
    print(f"Filters:")
    print(f"  - Course Category: {course_category or 'All'}")
    print(f"  - Specialization:  {specialization or 'All'}")
    print(f"  - City:            {city or 'All'}")
    print(f"  - University:      {university or 'All'}")
    print(f"  - Output Format:   {', '.join(output_formats).upper()}")
    print()
    
    driver = None
    try:
        # Create browser driver
        print("Initializing browser...")
        headless_mode = HEADLESS or args.headless
        driver = create_driver(headless=headless_mode)
        
        # Manual Login
        print("\nStep 1: Opening login page for manual login...")
        import time
        manual_login(driver, MAIN_URL)
        
        # Clean up extra tabs
        time.sleep(1)
        if len(driver.window_handles) > 1:
            print(f"\nCleaning up extra tabs...")
            current_handle = driver.current_window_handle
            for handle in driver.window_handles:
                if handle != current_handle:
                    try:
                        driver.switch_to.window(handle)
                        driver.close()
                    except:
                        pass
            driver.switch_to.window(current_handle)
            time.sleep(2)
        
        # Build search URL with filters
        search_url = build_search_url(
            COLLEGE_SEARCH_URL,
            course_category,
            specialization,
            city,
            university
        )
        
        # Navigate to college search page with filters
        print(f"\nStep 2: Navigating to college search page with filters...")
        print(f"URL: {search_url}")
        driver.get(search_url)
        
        # Wait for page to load
        time.sleep(5)
        
        # Try to download via Report button first (if available)
        print(f"\nStep 3: Attempting to download CSV via Report button...")
        report_downloaded = try_download_report(driver)
        
        # Extract all college data
        print(f"\nStep 4: Extracting college data from page...")
        colleges = get_all_results(driver)
        
        if not colleges and not report_downloaded:
            print("\n⚠️  Warning: No college data extracted and Report button didn't work.")
            print("Possible reasons:")
            print("  - No colleges match the specified filters")
            print("  - Page structure changed")
            print("  - Login session expired")
            if not headless_mode:
                input("\nPress Enter to close the browser...")
        else:
            if colleges:
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
                print(f"\nStep 5: Saving {len(colleges)} colleges...")
                saved_files = save_data(colleges, OUTPUT_DIR, base_filename, output_formats)
                
                print(f"\n✅ Success!")
                print(f"Summary:")
                print(f"  - Total colleges found: {len(colleges)}")
                for fmt, filepath in saved_files.items():
                    print(f"  - {fmt.upper()} file: {filepath}")
            
            if report_downloaded:
                print("\n✅ CSV download initiated via Report button")
                print("  - Check your browser's default download folder")
        
        if not headless_mode:
            input("\nPress Enter to close the browser...")
            
    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if driver:
            print("\nClosing browser...")
            driver.quit()
            print("Done!")


if __name__ == "__main__":
    main()
