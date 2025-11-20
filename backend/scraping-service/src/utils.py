"""
Utility functions for data processing and CSV/JSON export
"""
import pandas as pd
import json
import os
from typing import List, Dict, Optional
from supabase import create_client, Client
from src.config import SUPABASE_URL, SUPABASE_KEY


def transform_college_data(colleges: List[Dict]) -> List[Dict]:
    """
    Transform extracted college data to the target JSON format
    
    Converts from:
    - "College Name" -> "name"
    - "Location" -> "city" (extract city from location string)
    - "College Type" -> "type"
    - "Course Category" -> "course_category"
    - "Total Courses" -> "total_courses"
    - "Match Percentage" -> "match_percentage"
    - "Match Level" -> "match_level"
    - "Has Website Link" -> "has_website_link"
    - "College ID" -> "college_id"
    - "Courses" -> "courses" (transform each course)
    """
    transformed = []
    
    for college in colleges:
        # Extract city from Location (format: "City" or "City, State")
        location = college.get('Location', '').strip()
        city = location.split(',')[0].strip() if location else ""
        
        # Transform college data
        transformed_college = {
            "city": city,
            "name": college.get('College Name', ''),
            "type": college.get('College Type', ''),
            "course_category": college.get('Course Category', ''),
            "total_courses": college.get('Total Courses', ''),
            "match_percentage": college.get('Match Percentage', ''),
            "match_level": college.get('Match Level', ''),
            "has_website_link": college.get('Has Website Link', ''),
            "college_id": college.get('College ID', ''),
            "courses": []
        }
        
        # Transform courses
        courses = college.get('Courses', [])
        for course in courses:
            # Convert entrance_exams to array of strings
            entrance_exams_raw = course.get('Entrance Exams', '')
            if isinstance(entrance_exams_raw, list):
                # Already a list, use it as is
                entrance_exams = [str(exam).strip() for exam in entrance_exams_raw if exam and str(exam).strip()]
            elif isinstance(entrance_exams_raw, str):
                # Split by comma if multiple exams, otherwise single item array
                if entrance_exams_raw.strip():
                    entrance_exams = [exam.strip() for exam in entrance_exams_raw.split(',') if exam.strip()]
                else:
                    entrance_exams = []
            else:
                entrance_exams = []
            
            transformed_course = {
                "name": course.get('Course Name', ''),
                "annual_fees": course.get('Fees', ''),
                "duration": course.get('Duration', ''),
                "degree_level": course.get('Degree Type', ''),
                "entrance_exams": entrance_exams
            }
            transformed_college["courses"].append(transformed_course)
        
        transformed.append(transformed_college)
    
    return transformed


def deduplicate_colleges(colleges: List[Dict]) -> List[Dict]:
    """Remove duplicate colleges based on college name"""
    seen = {}
    
    for college in colleges:
        # Handle both old format ("College Name") and new format ("name")
        college_name = college.get('College Name', college.get('name', '')).strip().lower()
        
        if not college_name:
            continue
        
        # If we haven't seen this college, or if this entry has more data, keep it
        if college_name not in seen:
            seen[college_name] = college
        else:
            # Compare data richness - keep the one with more fields
            existing = seen[college_name]
            existing_fields = sum(1 for v in existing.values() if v and str(v).strip())
            new_fields = sum(1 for v in college.values() if v and str(v).strip())
            
            if new_fields > existing_fields:
                seen[college_name] = college
    
    return list(seen.values())


def save_to_csv(data: List[Dict], output_dir: str, filename: str):
    """Save data to CSV file"""
    os.makedirs(output_dir, exist_ok=True)
    
    if data:
        print(f"Removing duplicates from {len(data)} records...")
        data = deduplicate_colleges(data)
        print(f"After deduplication: {len(data)} unique records")
        
        df = pd.DataFrame(data)
        filepath = os.path.join(output_dir, filename)
        df.to_csv(filepath, index=False, encoding='utf-8')
        print(f"✅ CSV saved to {filepath}")
        print(f"Total unique records: {len(data)}")
        return filepath
    else:
        print("No data to save")
        return None


def save_to_json(
    data: List[Dict], 
    output_dir: str, 
    filename: str,
    manual_login: bool = False,
    career_path: Optional[str] = None,
    specialization: Optional[str] = None,
    location: Optional[str] = None,
    university: Optional[str] = None
):
    """
    Save data to JSON file and optionally to Supabase
    
    Args:
        data: List of college dictionaries
        output_dir: Directory to save the file
        filename: Name of the file
        manual_login: If True, also save to Supabase
        career_path: Career path filter for Supabase
        specialization: Specialization filter for Supabase
        location: Location filter for Supabase
        university: University filter for Supabase
    """
    os.makedirs(output_dir, exist_ok=True)
    
    if data:
        print(f"Removing duplicates from {len(data)} records...")
        data = deduplicate_colleges(data)
        print(f"After deduplication: {len(data)} unique records")
        
        # Transform data to target format
        print(f"Transforming data to target format...")
        transformed_data = transform_college_data(data)
        
        # Prepare JSON structure with 'colleges' key
        json_data = {"colleges": transformed_data}
        
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ JSON saved to {filepath}")
        print(f"Total unique records: {len(transformed_data)}")
        
        # Save to Supabase if manual_login is True
        if manual_login:
            print(f"\nSaving to Supabase...")
            save_to_supabase(
                json_data=json_data,
                career_path=career_path,
                specialization=specialization,
                location=location,
                university=university
            )
        
        return filepath
    else:
        print("No data to save")
        return None


def save_data(
    data: List[Dict], 
    output_dir: str, 
    base_filename: str, 
    formats: List[str] = ['csv'],
    manual_login: bool = False,
    career_path: Optional[str] = None,
    specialization: Optional[str] = None,
    location: Optional[str] = None,
    university: Optional[str] = None
):
    """
    Save data in multiple formats
    
    Args:
        data: List of dictionaries containing college data
        output_dir: Directory to save files
        base_filename: Base filename without extension
        formats: List of formats to save ('csv', 'json', or both)
        manual_login: If True, also save to Supabase when saving JSON
        career_path: Career path filter for Supabase
        specialization: Specialization filter for Supabase
        location: Location filter for Supabase
        university: University filter for Supabase
    
    Returns:
        Dictionary mapping format to filepath
    """
    saved_files = {}
    
    for fmt in formats:
        if fmt.lower() == 'csv':
            filename = f"{base_filename}.csv" if not base_filename.endswith('.csv') else base_filename
            filepath = save_to_csv(data, output_dir, filename)
            if filepath:
                saved_files['csv'] = filepath
        
        elif fmt.lower() == 'json':
            filename = f"{base_filename}.json" if not base_filename.endswith('.json') else base_filename
            # Remove .csv extension if present
            filename = filename.replace('.csv', '.json')
            filepath = save_to_json(
                data, 
                output_dir, 
                filename,
                manual_login=manual_login,
                career_path=career_path,
                specialization=specialization,
                location=location,
                university=university
            )
            if filepath:
                saved_files['json'] = filepath
    
    return saved_files


def clean_text(text: str) -> str:
    """Clean and normalize text data"""
    if not text:
        return ""
    
    # Remove extra whitespace and newlines
    text = ' '.join(text.split())
    return text.strip()


def save_to_supabase(
    json_data: Dict,
    career_path: Optional[str],
    specialization: Optional[str],
    location: Optional[str],
    university: Optional[str]
) -> bool:
    """
    Save or update data in Supabase search_criteria table
    
    Args:
        json_data: The JSON data to save (should have 'colleges' key)
        career_path: Career path filter (e.g., 'Engineering')
        specialization: Specialization filter (e.g., 'Science') or None
        location: Location filter (e.g., 'Delhi') or None
        university: University filter or None
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Prepare the data for search_criteria table
        # Format location as "city, state" if available, or just city
        location_str = location or ""
        
        
        # Ensure we pass a dict for the jsonb column. Use the provided `json_data`.
        if isinstance(json_data, dict):
            llm_json = json_data
        else:
            try:
                llm_json = json.loads(json_data)
            except Exception:
                llm_json = {"colleges": json_data}

        # Prepare the record data (include location so upsert conflict keys match)
        record_data = {
            "career_path": career_path or None,
            "specialization": specialization or None,
            "university": university or None,
            "location": location_str or None,
            "llm_json": llm_json
        }
        
        # First try to find an existing record that matches the four key columns
        # If found -> update the existing record. Otherwise -> insert a new record.
        try:
            query = supabase.table("search_criteria").select("*")

            # Match or is NULL depending on whether value was provided
            if career_path:
                query = query.eq("career_path", career_path)
            else:
                query = query.is_("career_path", None)

            if specialization:
                query = query.eq("specialization", specialization)
            else:
                query = query.is_("specialization", None)

            if university:
                query = query.eq("university", university)
            else:
                query = query.is_("university", None)

            if location_str:
                query = query.eq("location", location_str)
            else:
                query = query.is_("location", None)

            existing = query.limit(1).execute()

            if getattr(existing, "data", None) and len(existing.data) > 0:
                # Update the first matching record
                record_id = existing.data[0].get("id")
                if record_id:
                    response = supabase.table("search_criteria").update(record_data).eq("id", record_id).execute()
                    print(f"✅ Updated existing record in Supabase (ID: {record_id})")
                    return True

            # No matching record found -> insert a new one
            response = supabase.table("search_criteria").insert(record_data).execute()
            if getattr(response, "data", None) and len(response.data) > 0:
                print(f"✅ Inserted new record in Supabase (ID: {response.data[0].get('id', 'N/A')})")
                return True
            else:
                print("⚠️  Warning: Supabase insert returned no data")
                return False
        except Exception:
            # Re-raise to be handled by outer except block below
            raise
            
    except Exception as e:
        print(f"❌ Error saving to Supabase: {e}")
        import traceback
        traceback.print_exc()
        return False