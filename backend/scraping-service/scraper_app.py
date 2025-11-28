import streamlit as st
import subprocess
import sys
import os
import json
import pandas as pd
import time
import glob
from collections import Counter
from pathlib import Path
from typing import List, Dict, Optional, Tuple

# Add the current directory to sys.path to allow imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from src.logger import setup_logger
from src.utils import save_to_supabase

logger = setup_logger("scraper_ui")

try:
    from models.colleges_course import College, Courses
except ImportError:
    # Fallback if models are not found, though user said they created it
    st.warning("Models not found. Proceeding without strict type validation.")
    College = None
    Courses = None

# Configuration
DATA_DIR = os.path.join(current_dir, "data")
LOG_FILE = os.path.join(current_dir, "scraping_service.log")

st.set_page_config(
    page_title="College Data Scraper",
    page_icon="🕷️",
    layout="wide"
)

def load_latest_data(base_filename: str) -> Tuple[Optional[Dict], Optional[str]]:
    """Load the most recently created JSON file matching the base filename."""
    # Look for json files in data dir
    pattern = os.path.join(DATA_DIR, f"*{base_filename}*.json")
    files = glob.glob(pattern)
    
    if not files:
        return None, None
        
    # Get latest file
    latest_file = max(files, key=os.path.getctime)
    
    try:
        with open(latest_file, 'r', encoding='utf-8') as f:
            return json.load(f), latest_file
    except Exception as e:
        st.error(f"Error reading file {latest_file}: {e}")
        return None, None


def infer_filters_from_payload(json_payload: Dict) -> Dict[str, Optional[str]]:
    """Best-effort extraction of filter metadata from a scrape result."""
    inferred = {
        "career_path": None,
        "specialization": None,
        "location": None,
        "university": None
    }

    if not isinstance(json_payload, dict):
        return inferred

    colleges = json_payload.get("colleges") or []
    if not isinstance(colleges, list) or not colleges:
        return inferred

    def _single_value(values):
        cleaned = [str(v).strip() for v in values if v and str(v).strip()]
        if not cleaned:
            return None
        unique = set(cleaned)
        if len(unique) == 1:
            return cleaned[0]
        return None

    inferred["career_path"] = _single_value([c.get("course_category") for c in colleges])
    inferred["location"] = _single_value([c.get("city") for c in colleges])
    inferred["university"] = _single_value([c.get("university") for c in colleges])

    # No reliable specialization in payload; leave as None for now
    return inferred

def run_scraper(course_category, specialization, city, university, headless, manual_login, push_to_supabase, engine):
    """Execute the main.py script with provided arguments."""
    
    cmd = [sys.executable, "main.py"]
    
    # Handle 'null' inputs
    cmd.append(course_category if course_category else "null")
    cmd.append(specialization if specialization else "null")
    cmd.append(city if city else "null")
    cmd.append(university if university else "null")
    
    cmd.append("--format")
    cmd.append("both")  # Always get both for UI (JSON) and download (CSV)
    
    if headless:
        cmd.append("--headless")
        
    if manual_login:
        cmd.append("--manual-login")
        
    if push_to_supabase:
        cmd.append("--save")
        
    cmd.append("--engine")
    cmd.append(engine)
    
    return subprocess.Popen(
        cmd,
        cwd=current_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
    )

# --- UI Layout ---

st.title("🕷️ College Data Scraper")
st.markdown("Interface for running the Playwright/Selenium scraper to fetch college data.")

with st.sidebar:
    st.header("⚙️ Configuration")
    
    st.subheader("Filters")
    course_category = st.text_input("Course Category", placeholder="e.g. Engineering")
    specialization = st.text_input("Specialization", placeholder="e.g. Computer Science")
    city = st.text_input("City", placeholder="e.g. Bangalore")
    university = st.text_input("University", placeholder="e.g. Bangalore University")
    
    st.markdown("---")
    
    st.subheader("Options")
    engine = st.selectbox("Scraping Engine", ["playwright", "selenium"], index=0)
    headless = st.checkbox("Headless Mode", value=True, help="Run browser in background")
    manual_login = st.checkbox("Manual Login", value=False, help="Open browser to login manually (Selenium only)")
    push_to_supabase = st.checkbox("Save to Supabase", value=False, help="Save scraped data to database")
    
    if manual_login and engine == "playwright":
        st.warning("⚠️ **Playwright Mode**: 'Manual Login' is ignored. Playwright always uses automatic login.")
    
    st.markdown("---")
    
    run_btn = st.button("🚀 Run Scraper", type="primary", use_container_width=True)

# Main Content Area
if run_btn:
    if not any([course_category, specialization, city, university]):
        msg = "⚠️ Please provide at least one filter (Category, Specialization, City, or University)."
        st.error(msg)
        logger.warning("User attempted to run scraper without filters")
    else:
        logger.info(f"Starting scraper with filters: Category={course_category}, Spec={specialization}, City={city}, Uni={university}, Engine={engine}")
        st.info(f"Starting {engine.title()} scraper...")
        
        # Create a placeholder for logs
        log_container = st.empty()
        logs = []
        
        process = run_scraper(course_category, specialization, city, university, headless, manual_login, push_to_supabase, engine)
        
        # Stream output
        try:
            while True:
                line = process.stdout.readline()
                if not line and process.poll() is not None:
                    break
                if line:
                    logs.append(line.strip())
                    # Keep only last 20 lines for cleaner display
                    log_text = "\n".join(logs[-20:])
                    log_container.code(log_text, language="bash")
        except Exception as e:
            logger.error(f"Error streaming logs: {e}")
            st.error(f"An error occurred: {e}")
            
        if process.returncode == 0:
            logger.info("Scraping completed successfully")
            st.success("✅ Scraping completed successfully!")
            
            # Attempt to load results
            # Construct expected base filename logic from main.py to find the file
            # Or just search for the most recent file in data/
            
            # Simple heuristic: filter parts joined by underscore
            parts = [p for p in [course_category, specialization, city, university] if p]
            base_name_guess = "_".join(parts) if parts else "colleges_data"
            # Sanitize a bit like main.py does (simplified)
            base_name_guess = base_name_guess.replace(" ", "_")
            
            data, filepath = load_latest_data(base_name_guess)
            
            if data and "colleges" in data:
                colleges_data = data["colleges"]
                st.subheader(f"📊 Results ({len(colleges_data)} colleges)")
                
                # Convert to DataFrame for display
                # Flatten the structure slightly for the main table
                flat_data = []
                for c in colleges_data:
                    # Use College model if available for validation/structure
                    if College:
                        try:
                            # The JSON keys might match the model init args
                            # But main.py output keys are: city, name, type, course_category, etc.
                            # The College model expects: name, description, address...
                            # There is a mismatch between main.py output (transform_college_data in utils.py)
                            # and the College model in models/colleges_course.py.
                            # transform_college_data produces: city, name, type, course_category, total_courses...
                            # College model expects: name, description, address, city...
                            
                            # We will just use the dict as is for the table to avoid data loss
                            pass
                        except:
                            pass
                            
                    flat_data.append({
                        "Name": c.get("name"),
                        "City": c.get("city"),
                        "Type": c.get("type"),
                        "Courses": len(c.get("courses", [])),
                        "Website": "Yes" if c.get("has_website_link") else "No"
                    })
                
                df = pd.DataFrame(flat_data)
                st.dataframe(df, use_container_width=True)
                
                # Download buttons
                col1, col2 = st.columns(2)
                with col1:
                    with open(filepath, "r", encoding="utf-8") as f:
                        st.download_button(
                            label="📥 Download JSON",
                            data=f,
                            file_name=os.path.basename(filepath),
                            mime="application/json"
                        )
                
                with col2:
                    # Try to find corresponding CSV
                    csv_path = filepath.replace(".json", ".csv")
                    if os.path.exists(csv_path):
                        with open(csv_path, "r", encoding="utf-8") as f:
                            st.download_button(
                                label="📥 Download CSV",
                                data=f,
                                file_name=os.path.basename(csv_path),
                                mime="text/csv"
                            )
                
                st.markdown("---")
                push_status = st.empty()
                if st.button("☁️ Push to Supabase", help="Save these results to the Supabase database"):
                    derived_filters = infer_filters_from_payload(data)
                    effective_filters = {
                        "career_path": course_category or derived_filters["career_path"],
                        "specialization": specialization or derived_filters["specialization"],
                        "location": city or derived_filters["location"],
                        "university": university or derived_filters["university"]
                    }

                    if not effective_filters["location"]:
                        push_status.error("Unable to infer a location. Please rerun with the City filter specified.")
                    else:
                        push_status.info("Sending current scrape to Supabase...")
                        with st.spinner("Pushing data to Supabase..."):
                            success, supabase_msg = save_to_supabase(
                                json_data=data,
                                career_path=effective_filters["career_path"],
                                specialization=effective_filters["specialization"],
                                location=effective_filters["location"],
                                university=effective_filters["university"]
                            )
                        if success:
                            push_status.success(f"Supabase update completed: {supabase_msg}")
                        else:
                            push_status.error(f"Supabase push failed: {supabase_msg}")
            else:
                logger.warning("No data found or file could not be read after successful exit code")
                st.warning("No data found or file could not be read.")
                
        else:
            logger.error(f"Scraping failed with return code {process.returncode}")
            st.error("❌ Scraping failed. Check logs above.")

else:
    # Show instructions or recent data
    st.info("👈 Configure filters in the sidebar and click 'Run Scraper' to start.")
    
    # Optional: Show recently scraped files
    if os.path.exists(DATA_DIR):
        st.markdown("### 📂 Recently Scraped Data")
        
        tab1, tab2 = st.tabs(["CSV Files", "JSON Files"])
        
        with tab1:
            csv_files = glob.glob(os.path.join(DATA_DIR, "*.csv"))
            if csv_files:
                csv_files.sort(key=os.path.getmtime, reverse=True)
                for f in csv_files[:5]:
                    st.text(f"📄 {os.path.basename(f)}")
            else:
                st.caption("No CSV files found.")
                
        with tab2:
            json_files = glob.glob(os.path.join(DATA_DIR, "*.json"))
            if json_files:
                json_files.sort(key=os.path.getmtime, reverse=True)
                for f in json_files[:5]:
                    col_file, col_btn = st.columns([3, 1])
                    with col_file:
                        st.text(f"📄 {os.path.basename(f)}")
                    with col_btn:
                        push_file_status = st.empty()
                        if st.button("☁️ Push", key=f"push_{f}", help="Push this file to Supabase"):
                            try:
                                push_file_status.info(f"Sending {os.path.basename(f)} to Supabase...")
                                with open(f, 'r', encoding='utf-8') as json_file:
                                    file_data = json.load(json_file)
                                    
                                derived_filters = infer_filters_from_payload(file_data)

                                if not derived_filters["location"]:
                                    push_file_status.error("Unable to infer a unique city from this file. Please rerun the scrape with City specified.")
                                else:
                                    with st.spinner(f"Pushing {os.path.basename(f)}..."):
                                        success, supabase_msg = save_to_supabase(
                                            json_data=file_data,
                                            career_path=derived_filters["career_path"],
                                            specialization=derived_filters["specialization"],
                                            location=derived_filters["location"],
                                            university=derived_filters["university"]
                                        )
                                    if success:
                                        push_file_status.success(f"Supabase update completed: {supabase_msg}")
                                    else:
                                        push_file_status.error(f"Supabase push failed: {supabase_msg}")
                            except Exception as e:
                                push_file_status.error(f"Error: {e}")
            else:
                st.caption("No JSON files found.")
