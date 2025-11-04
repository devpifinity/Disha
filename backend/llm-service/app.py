import streamlit as st
import os
import json
import csv
import io
import asyncio
import re
from dotenv import load_dotenv
from engines.llm_engine import CollegeDiscoveryEngine
from engines.validation_engine import EvidenceValidator
from engines.supabase_integration import SupabaseIntegration
from models.college import EvidenceStatus
from json_repair import repair_json

load_dotenv()

st.set_page_config(page_title="College Discovery App - Staging", layout="wide")

st.title("College Discovery App - Staging Pipeline")
st.markdown("Discover colleges with AI-powered validation → Push to staging tables for admin review")

with st.sidebar:
    st.header("⚙️ Settings")
    
    st.subheader("Gemini Configuration")
    
    api_key = st.text_input("Google API Key", 
                           value=os.getenv("GOOGLE_API_KEY", ""),
                           type="password",
                           help="Get your key from https://makersuite.google.com/app/apikey")
    
    model_options = ["gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"]
    model = st.selectbox("Select Model", model_options, index=0)
    
    st.markdown("---")
    
    st.subheader("Supabase Configuration")
    supabase_url = st.text_input("Supabase URL", 
                                 value=os.getenv("SUPABASE_URL", ""),
                                 type="password",
                                 help="Your Supabase project URL")
    supabase_key = st.text_input("Supabase Key", 
                                value=os.getenv("SUPABASE_KEY", ""),
                                type="password",
                                help="Your Supabase anon/service role key")
    
    if supabase_url and supabase_key:
        if st.button("Test Connection", use_container_width=True):
            try:
                supabase = SupabaseIntegration(supabase_url, supabase_key)
                if supabase.test_connection():
                    st.success("✅ Connected!")
                else:
                    st.error("❌ Failed")
            except Exception as e:
                st.error(f"❌ {str(e)[:50]}")
        
        if st.button("Staging Stats", use_container_width=True):
            try:
                supabase = SupabaseIntegration(supabase_url, supabase_key)
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                stats = loop.run_until_complete(supabase.get_staging_stats())
                loop.close()
                
                if stats:
                    st.info(f"Colleges: {stats.get('total_colleges', 0)}")
                    st.info(f"Courses: {stats.get('total_courses', 0)}")
            except Exception as e:
                st.error(f"❌ {str(e)[:50]}")
    
    st.markdown("---")
    
    st.subheader("Batch Processing")
    batch_size = st.slider(
        "Colleges per batch", 
        min_value=3, 
        max_value=15, 
        value=5,
        help="Process multiple colleges in one API call to save tokens"
    )
    st.info(f"📊 ~{(60 // batch_size) + 1} API calls for 60 colleges")
    
    st.markdown("---")
    
    st.subheader("🔍 Validation")
    enable_validation = st.checkbox("Enable Validation", value=True, 
                                   help="Validate colleges against websites and government databases")
    validation_delay = st.slider("Validation Delay (seconds)", 0.5, 5.0, 1.5, 0.5,
                                help="Delay between validation requests")
    
    st.markdown("---")
    st.markdown("### 📋 Pipeline Flow")
    st.markdown("""
    1️⃣ **Discover colleges** in location
    
    2️⃣ **Batch discover courses** (optimized)
    
    3️⃣ **Validate** evidence (optional)
    
    4️⃣ **Push to staging** tables
    
    5️⃣ **Admin reviews** & approves
    
    ✨ **Note**: College-course linking handled by admin
    """)

col1, col2 = st.columns(2)
with col1:
    location = st.text_input("Location (city/state):", placeholder="e.g., Bangalore, Karnataka")
with col2:
    career_path = st.text_input("Career Path (Optional):", 
                               placeholder="e.g., Data Science, Engineering")

st.info("**Tip:** Leave Career Path empty to discover all colleges and courses, or specify to filter results.")

if api_key:
    try:
        engine = CollegeDiscoveryEngine(api_key=api_key, model=model)
        validator = EvidenceValidator(delay=validation_delay)
    except Exception as e:
        st.error(f"❌ Error initializing Gemini engine: {e}")
        st.stop()

if st.button("Generate Prompts", type="secondary", use_container_width=True):
    if not location:
        st.error("Please provide a location first.")
    elif not api_key:
        st.error("Please provide your Google API key.")
    else:
        if "college_prompt" not in st.session_state:
            st.session_state["college_prompt"] = ""
        if "course_prompt_template" not in st.session_state:
            st.session_state["course_prompt_template"] = ""
        
        college_prompt = engine.create_college_list_prompt(location)
        st.session_state["college_prompt"] = college_prompt
        
        sample_colleges = [
            type('College', (), {'name': '{COLLEGE_1}', 'website': '{WEBSITE_1}'})(),
            type('College', (), {'name': '{COLLEGE_2}', 'website': '{WEBSITE_2}'})(),
            type('College', (), {'name': '...', 'website': '...'})(),
        ]
        course_prompt = engine.create_batch_course_discovery_prompt(sample_colleges, career_path)
        st.session_state["course_prompt_template"] = course_prompt
        
        st.success("✅ Prompts generated! You can edit them below before running discovery 👇")
        st.rerun()

if st.session_state.get("college_prompt"):
    st.markdown("---")
    st.subheader("📝 Prompt Configuration")
    
    st.info("**Tip:** Modify these prompts to customize what information Gemini extracts. Changes will be applied when you run discovery.")
    
    col1, col2 = st.columns(2)
    
    with col1:
        with st.expander("🏫 College Discovery Prompt (Step 1)", expanded=True):
            st.markdown("**This prompt discovers all colleges in the location:**")
            edited_college_prompt = st.text_area(
                "Edit College Discovery Prompt:",
                value=st.session_state["college_prompt"],
                height=400,
                key="college_prompt_editor",
                help="Modify this prompt to change what college information is collected"
            )
            st.session_state["college_prompt"] = edited_college_prompt
            
            st.caption("📋 **Will extract:** name, description, address, city, state, zip_code, website, email, phone, scholarshipdetails, rating, type, confidence")
    
    with col2:
        with st.expander("📚 Batch Course Discovery Prompt Template (Step 2)", expanded=True):
            st.markdown(f"**This template processes {batch_size} colleges at once:**")
            edited_course_prompt = st.text_area(
                "Edit Batch Course Discovery Prompt:",
                value=st.session_state["course_prompt_template"],
                height=400,
                key="course_prompt_editor",
                help="Modify this template to change what course information is collected"
            )
            st.session_state["course_prompt_template"] = edited_course_prompt
            
            st.caption("📋 **Will extract:** name, description, duration, degree_level, seats, annual_fees, entrance_exams, specializations")
    
    if st.button("🔄 Reset Prompts to Default", type="secondary"):
        st.session_state["college_prompt"] = engine.create_college_list_prompt(location)
        sample_colleges = [
            type('College', (), {'name': '{COLLEGE_1}', 'website': '{WEBSITE_1}'})(),
            type('College', (), {'name': '{COLLEGE_2}', 'website': '{WEBSITE_2}'})(),
        ]
        st.session_state["course_prompt_template"] = engine.create_batch_course_discovery_prompt(sample_colleges, career_path)
        st.success("✅ Prompts reset to default!")
        st.rerun()

if st.button("Run Discovery", type="primary", use_container_width=True):
    
    if not api_key:
        st.error("❌ Please provide your Google API key.")
    elif not location:
        st.error("❌ Please provide a location.")
    else:
        step1_container = st.container()
        step2_container = st.container()
        step3_container = st.container()
        
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            with step1_container:
                st.markdown("---")
                st.subheader("Step 1: Discovering Colleges")
                step1_status = st.empty()
                step1_status.text(f"🔍 Searching for colleges in {location}...")
            
            async def discover_colleges_with_custom_prompt():
                """Use custom edited prompt if available, otherwise use default"""
                try:
                    prompt_to_use = st.session_state.get("college_prompt")
                    if not prompt_to_use:
                        prompt_to_use = engine.create_college_list_prompt(location)
                    
                    content = await engine._call_gemini(prompt_to_use, max_tokens=6000)
                    json_match = re.search(r'\{.*\}', content, re.DOTALL)
                    
                    if not json_match:
                        raise ValueError("No valid JSON found in response")

                    repaired_json_str = repair_json(json_match.group())
                    data = json.loads(repaired_json_str)

                    return engine._parse_colleges_basic(data, location)

                except Exception as e:
                    print(f"Error in college list discovery: {e}")
                    return []
            
            colleges = loop.run_until_complete(discover_colleges_with_custom_prompt())
            
            if not colleges:
                step1_status.error("❌ No colleges found. Please try a different location.")
                st.stop()
            
            step1_status.success(f"✅ Found {len(colleges)} colleges with detailed information!")
            
            with step2_container:
                st.markdown("---")
                st.subheader(f"Step 2: Batch Discovering Courses ({batch_size} colleges/batch)")
                step2_progress = st.progress(0)
                step2_status = st.empty()
                
                total_batches = (len(colleges) + batch_size - 1) // batch_size
                step2_status.text(f"Processing {total_batches} batches...")
                
                async def discover_all_courses_batch():
                    colleges_with_courses = []
                    
                    for i in range(0, len(colleges), batch_size):
                        batch = colleges[i:i+batch_size]
                        batch_num = i // batch_size + 1
                        
                        step2_status.text(
                            f"Batch {batch_num}/{total_batches}: Processing {len(batch)} colleges..."
                        )
                        step2_progress.progress(batch_num / total_batches)
                        
                        batch_results = await engine._discover_batch_courses(batch, career_path)
                        colleges_with_courses.extend(batch_results)
                    
                    return colleges_with_courses
                
                colleges = loop.run_until_complete(discover_all_courses_batch())
            
            total_courses = sum(len(c.courses) for c in colleges)
            step2_status.success(f"✅ Discovered {total_courses} courses across {len(colleges)} colleges!")
            
            single_call_estimate = len(colleges)
            batch_calls = (len(colleges) + batch_size - 1) // batch_size
            savings = ((single_call_estimate - batch_calls) / single_call_estimate) * 100
            st.info(f"💡 **API Call Optimization:** Used {batch_calls} calls instead of {single_call_estimate} (saved {savings:.0f}%!)")
            
            if career_path:
                original_count = len(colleges)
                colleges = [c for c in colleges if len(c.courses) > 0]
                if len(colleges) < original_count:
                    st.info(f"ℹ️ Filtered to {len(colleges)} colleges with {career_path}-related courses")
            
            if enable_validation and colleges:
                with step3_container:
                    st.markdown("---")
                    st.subheader("Step 3: Validating Colleges")
                    
                    validator.delay = validation_delay
                    val_progress = st.progress(0)
                    val_status = st.empty()
                    
                    async def validate_with_progress():
                        validated = []
                        for i, college in enumerate(colleges):
                            val_status.text(f"🔐 Validating: {college.name} ({i+1}/{len(colleges)})")
                            val_progress.progress((i + 1) / len(colleges))
                            
                            result = await validator.validate_colleges([college])
                            validated.extend(result)
                        
                        return validated
                    
                    try:
                        colleges = loop.run_until_complete(validate_with_progress())
                        val_status.success("✅ Validation completed!")
                    except Exception as e:
                        st.warning(f"⚠️ Validation encountered issues: {e}")
                        st.info("Proceeding with unvalidated data...")
            
            loop.close()
            
            st.session_state["colleges"] = colleges
            st.session_state["location"] = location
            st.session_state["career_path"] = career_path or "All Programs"
            st.session_state["validation_enabled"] = enable_validation
            st.session_state["model_used"] = model

        except Exception as e:
            st.error(f"❌ Error during discovery: {e}")
            import traceback
            with st.expander("See error details"):
                st.code(traceback.format_exc())

if "colleges" in st.session_state:
    colleges = st.session_state["colleges"]
    
    st.markdown("---")
    st.header("📊 Discovery Results")
    
    st.caption(f"Generated using: Google Gemini ({st.session_state.get('model_used', 'gemini-2.0-flash-exp')})")
    
    total_courses = sum(len(c.courses) for c in colleges)
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Colleges", len(colleges))
    with col2:
        st.metric("Total Courses", total_courses)
    with col3:
        high_conf = sum(1 for c in colleges if c.overall_confidence >= 0.8)
        st.metric("High Confidence", high_conf, 
                 delta=f"{high_conf/len(colleges)*100:.0f}%" if colleges else "0%")
    with col4:
        validated = sum(1 for c in colleges 
                       if c.evidence_status in [EvidenceStatus.VERIFIED, EvidenceStatus.PARTIALLY_VERIFIED])
        st.metric("Validated", validated)
    
    st.markdown("---")
    st.header("Push to Staging Tables")
    
    col1, col2, col3 = st.columns([2, 1, 1])
    
    with col1:
        st.markdown("""
        **Ready to push to staging?**
        
        This will insert:
        - Colleges → `st_college` table
        - Courses → `st_course` table (deduplicated)
        - Relationships → `st_college_course_jobs` table (job_id=null)
        
        ⚠️ **Note**: Job associations will be handled by CMS admin later.
        """)
    
    with col2:
        st.metric("Will Insert", f"{len(colleges)} colleges")
    
    with col3:
        unique_courses = len(set(c.name for college in colleges for c in college.courses))
        total_relationships = sum(len(c.courses) for c in colleges)
        st.metric("Will Insert", f"{unique_courses} courses")
        st.caption(f"{total_relationships} relationships")
    
    if supabase_url and supabase_key:
        if st.button("Push to Staging Tables", type="primary", use_container_width=True):
            try:
                supabase = SupabaseIntegration(supabase_url, supabase_key)
                
                push_progress = st.progress(0)
                push_status = st.empty()
                
                def progress_callback(current, total, college_name):
                    push_status.text(f"📤 Pushing: {college_name} ({current}/{total})")
                    push_progress.progress(current / total)
                
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                results = loop.run_until_complete(
                    supabase.push_colleges_and_courses(colleges, progress_callback)
                )
                
                loop.close()
                
                push_status.empty()
                push_progress.empty()
                
                st.success(f"✅ Successfully pushed to staging tables!")
                
                st.markdown("### 📊 Push Statistics")
                stat_col1, stat_col2, stat_col3 = st.columns(3)
                
                with stat_col1:
                    st.metric("Colleges Inserted", results['colleges_inserted'])
                    st.metric("Colleges Failed", results['colleges_failed'])
                
                with stat_col2:
                    st.metric("Courses Inserted", results['courses_inserted'])
                    st.metric("Courses Failed", results['courses_failed'])
                
                with stat_col3:
                    st.metric("Relationships Created", results['relationships_created'])
                    st.metric("Relationships Failed", results['relationships_failed'])
                
                if results['errors']:
                    with st.expander(f"⚠️ View Errors ({len(results['errors'])})"):
                        for error in results['errors']:
                            st.text(error)
                
                st.info("""
                ✅ **Next Steps:**
                1. CMS admin reviews data in staging tables
                2. Admin connects jobs to college-course relationships
                3. Admin approves and promotes to production tables
                
                **Note**: College-course relationships are already created in `st_college_course_jobs` with `job_id=null`
                """)
                
            except Exception as e:
                st.error(f"❌ Error pushing to Supabase: {e}")
                import traceback
                with st.expander("See error details"):
                    st.code(traceback.format_exc())
    else:
        st.warning("⚠️ Configure Supabase credentials in sidebar first")
    
    st.markdown("---")
    st.subheader("📥 Export Options")
    
    col1, col2 = st.columns(2)
    
    with col1:
        json_data = {
            "metadata": {
                "location": st.session_state.get("location", ""),
                "career_path": st.session_state.get("career_path", ""),
                "total_colleges": len(colleges),
                "total_courses": total_courses,
                "validation_enabled": st.session_state.get("validation_enabled", False),
                "model": st.session_state.get("model_used", "gemini-2.0-flash-exp")
            },
            "colleges": [
                {
                    **c.to_dict(),
                    "courses": [
                        {
                            "name": course.name,
                            "description": course.description,
                            "degree_level": course.degree_level,
                            "duration": course.duration,
                            "annual_fees": course.annual_fees,
                            "seats": course.seats,
                            "entrance_exams": course.entrance_exams,
                            "specializations": course.specializations
                        }
                        for course in c.courses
                    ]
                }
                for c in colleges
            ]
        }
        
        json_str = json.dumps(json_data, indent=2, ensure_ascii=False)
        location_safe = st.session_state.get("location", "").replace(' ', '_').replace(',', '')
        
        st.download_button(
            label="📥 Download JSON",
            data=json_str,
            file_name=f"staging_colleges_{location_safe}.json",
            mime="application/json",
            use_container_width=True
        )
    
    with col2:
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow([
            'College Name', 'Description', 'Address', 'City', 'State', 'ZIP Code',
            'Website', 'Email', 'Phone', 'Scholarship Details', 'Rating', 'Type',
            'Confidence Score', 'Confidence Level', 'Evidence Status',
            'Total Courses', 'Course Name', 'Course Description', 'Degree Level',
            'Duration', 'Annual Fees', 'Seats'
        ])
        
        for college in colleges:
            base_row = [
                college.name, college.description, college.address,
                college.city, college.state, college.zip_code,
                college.website, college.email, college.phone,
                college.scholarshipdetails, f"{college.rating:.1f}",
                college.type, f"{college.overall_confidence:.2f}",
                college.confidence_level, str(college.evidence_status.value if hasattr(college.evidence_status, 'value') else college.evidence_status),
                len(college.courses)
            ]
            
            if college.courses:
                for course in college.courses:
                    writer.writerow(base_row + [
                        course.name, course.description, course.degree_level,
                        course.duration, course.annual_fees or "",
                        course.seats or ""
                    ])
            else:
                writer.writerow(base_row + ["", "", "", "", "", ""])
        
        csv_str = output.getvalue()
        output.close()
        
        st.download_button(
            label="📥 Download CSV",
            data=csv_str,
            file_name=f"staging_colleges_{location_safe}.csv",
            mime="text/csv",
            use_container_width=True
        )
    
    st.markdown("---")
    st.subheader("🏫 College Details (Staging Preview)")
    
    for college in colleges[:10]:
        with st.expander(
            f"**{college.name}** - {college.confidence_level} "
            f"({college.overall_confidence:.2f}) - {len(college.courses)} courses"
        ):
            col1, col2 = st.columns([2, 1])
            
            with col1:
                st.markdown(f"**📝 Description:** {college.description[:200]}...")
                st.markdown(f"**📍 Address:** {college.address}")
                st.markdown(f"**🏢 Type:** {college.type}")
                st.markdown(f"**🌐 Website:** [{college.website}]({college.website})")
                st.markdown(f"**📧 Email:** {college.email}")
                if college.phone:
                    st.markdown(f"**📞 Phone:** {college.phone}")
            
            with col2:
                st.metric("Rating", f"{college.rating:.1f}/5.0")
                st.metric("Confidence", f"{college.overall_confidence:.2f}")
                if college.scholarshipdetails:
                    st.info(f"💰 {college.scholarshipdetails[:100]}")
            
            if college.courses:
                st.markdown("---")
                st.markdown(f"**📚 Sample Courses ({min(3, len(college.courses))} of {len(college.courses)}):**")
                for course in college.courses[:3]:
                    st.markdown(f"- **{course.name}**")
                    st.caption(f"   {course.description[:150]}..." if len(course.description) > 150 else f"   {course.description}")
                    st.caption(f"   Duration: {course.duration} | Level: {course.degree_level}")
    
    if len(colleges) > 10:
        st.info(f"Showing 10 of {len(colleges)} colleges. Download CSV/JSON for complete data.")