"""
Utility functions for data processing and CSV/JSON export
"""
import pandas as pd
import json
import os
from typing import List, Dict


def deduplicate_colleges(colleges: List[Dict]) -> List[Dict]:
    """Remove duplicate colleges based on college name"""
    seen = {}
    
    for college in colleges:
        college_name = college.get('College Name', '').strip().lower()
        
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


def save_to_json(data: List[Dict], output_dir: str, filename: str):
    """Save data to JSON file"""
    os.makedirs(output_dir, exist_ok=True)
    
    if data:
        print(f"Removing duplicates from {len(data)} records...")
        data = deduplicate_colleges(data)
        print(f"After deduplication: {len(data)} unique records")
        
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ JSON saved to {filepath}")
        print(f"Total unique records: {len(data)}")
        return filepath
    else:
        print("No data to save")
        return None


def save_data(data: List[Dict], output_dir: str, base_filename: str, formats: List[str] = ['csv']):
    """
    Save data in multiple formats
    
    Args:
        data: List of dictionaries containing college data
        output_dir: Directory to save files
        base_filename: Base filename without extension
        formats: List of formats to save ('csv', 'json', or both)
    
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
            filepath = save_to_json(data, output_dir, filename)
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