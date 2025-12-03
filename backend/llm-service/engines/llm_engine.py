import os
import json
import re
from typing import List, Dict, Optional
from datetime import datetime
from models.college import College, Course, VerificationStatus, EvidenceStatus
import google.generativeai as genai
from json_repair import repair_json

class CollegeDiscoveryEngine:
    def __init__(self, api_key: str, model: str = None):
        """Initialize Gemini client"""
        self.model = model or self._get_default_model()
        genai.configure(api_key=api_key)
        self.client = genai.GenerativeModel(self.model)

    def _get_default_model(self) -> str:
        """Get default Gemini model"""
        return os.getenv("LLM_MODEL", "gemini-2.0-flash-exp")
    def create_college_list_prompt(self, location: str, career_path: str = None, specialization: str = None, university: str = None) -> str:
        if career_path:
            stream_text = f"Include ONLY Stream: {career_path}"
        else:
            stream_text = "Include ALL streams: Engineering, Medical, Arts, Commerce, Science, Management, etc."
        if specialization:
            specialization_text = f"Include ONLY Specialization: {specialization}"
        else:
            specialization_text = "Include ALL specializations"
        if university:
            university_text = f"Include ONLY University: {university}"
        else:
            university_text = "Include ALL universities"

        return f"""
        You are an expert educational consultant specializing in Indian higher education.

        Task: Find at most 2 colleges and universities in {location}.

        Requirements:
        1. Only include colleges physically located in {location}
             - Do NOT include any colleges from other cities or states.
        2. Include ALL types: Government, Private, Deemed, Central, State Universities.
        3. {stream_text}
        4. {specialization_text}
        5. {university_text}
        6. Be comprehensive — aim for 40-60 colleges if available in the location.
        7. Provide accurate, verifiable information. Use official and authoritative sources, such as:
            - AICTE approved institute lists
            - VTU / local university affiliated colleges for the region
            - "{location.split(',')[-1].strip()}" state education portals
            - Official college websites
        8. Restrict results ONLY to colleges affiliated to or part of: {university_text}
        9. Prioritize colleges offering courses in: {career_path if career_path else "Engineering, Medical, Arts, Commerce, Science, Management, etc."}

        Output Format (JSON):
        {{
        "colleges": [
            {{
                "name": "Exact college name",
                "description": "Brief description of the college (2-3 sentences about its establishment, reputation, and programs)",
                "address": "Full street address of the college",
                "city": "City name",
                "state": "State name",
                "zip_code": "PIN code/ZIP code",
                "website": "https://official-college-domain.ac.in",
                "email": "contact@college.edu.in",
                "phone": "+91-XXX-XXXXXXX",
                "scholarshipdetails": "Brief overview of scholarships available (if known)",
                "rating": 4.2,
                "type": "government|private|deemed|central|state",
                "confidence": 0.85
            }}
                ]
        }}

        Important Guidelines:
        - Do NOT exclude any college listed on official sources within {location}
        - Focus on well-known, established institutions but include verified smaller colleges as well.
        - Use confidence scores between 0.6-0.95 realistically.
        - Prioritize official websites where available.
        - Include as many colleges as possible from {location}
        - For rating: use a scale of 1.0–5.0 based on reputation; if unknown, use 3.5.
        - For scholarshipdetails: mention merit-based, need-based, government schemes if known.
        - If email/phone not known, try to infer from website domain.
        - Do NOT include course information (that will be fetched separately).
        """

    
    def create_batch_course_discovery_prompt(self, colleges: List[College], career_path: str = None) -> str:
        """Create BATCH prompt for discovering courses - Updated for staging table schema"""
        career_filter = f"\n- Focus on courses related to: {career_path}" if career_path else ""

        college_list = "\n".join([
            f"{i+1}. {c.name} - {c.website}" 
            for i, c in enumerate(colleges)
        ])
        

        return f"""
        You are an expert educational consultant specializing in Indian higher education.

        Task: Find ALL courses offered by the following {len(colleges)} colleges.

        Colleges to analyze:
        {college_list}

        Requirements for EACH college:{career_filter}
        -Only include courses actually offered by the college (verify using official sources: college websites, AICTE/UGC/VTU listings, or other authoritative sources)
        - List ALL undergraduate and postgraduate courses offered
        - Include certificates, diplomas, and doctoral programs
        - Provide detailed course information
        - Include entrance exam information
        - If you cannot find course information for a college, return empty courses array

        Output Format (JSON):
        {{
        "colleges": [
            {{
            "college_name": "Exact name from list above",
            "website": "College website",
            "courses": [
                {{
                "name": "Full course name (e.g., Bachelor of Technology in Computer Science)",
                "description": "Detailed course description including objectives, key subjects, and career prospects (3-4 sentences)",
                "duration": "4 years",
                "degree_level": "UG|PG|Diploma|Certificate|PhD",
                "seats": 120,
                "annual_fees": "₹1,00,000",
                "entrance_exams": ["JEE Main", "State CET"],
                "specializations": ["AI/ML", "Data Science"]
                }}
            ]
            }}
        ]
        }}

        Important Guidelines:
        - Process ALL {len(colleges)} colleges listed above
        - For course descriptions: mention curriculum highlights, practical training, industry exposure
        - If uncertain about fees/seats, omit rather than guess
        - Ensure course names are specific and accurate
        - If no courses found for a college, use empty courses array: "courses": []
        - For duration: use standard formats like "3 years", "4 years", "2 years", "6 months"
        - For degree_level: use exactly one of: UG, PG, Diploma, Certificate, PhD
        - Be thorough but efficient
        """
    
    async def discover_colleges(self, location: str, career_path: str = None,
                                progress_callback=None, batch_size: int = 5) -> List[College]:
        """
        Optimized two-step discovery process with batching:
        Step 1: Discover colleges by location
        Step 2: Batch process colleges for course discovery (5-10 colleges per API call)
        """

        if progress_callback:
            progress_callback("step1_start", {"location": location})

        colleges_basic = await self._discover_colleges_list(location)

        if not colleges_basic:
            return []

        if progress_callback:
            progress_callback("step1_complete", {"count": len(colleges_basic)})

        colleges_with_courses = []
        total = len(colleges_basic)

        for i in range(0, total, batch_size):
            batch = colleges_basic[i:i+batch_size]
            batch_num = i
            total_batches = (total + batch_size - 1)

            if progress_callback:
                progress_callback("step2_batch_progress", {
                    "batch": batch_num,
                    "total_batches": total_batches,
                    "colleges_in_batch": len(batch)
                })
            
            batch_results = await self._discover_batch_courses(batch, career_path)
            colleges_with_courses.extend(batch_results)

        if progress_callback:
            progress_callback("step2_complete", {"count": len(colleges_with_courses)})
        
        if career_path:
            colleges_with_courses = [
                c for c in colleges_with_courses 
                if len(c.courses) > 0
            ]
        
        return colleges_with_courses

    async def _discover_colleges_list(self, location: str) -> List[College]:
        """Step 1: Discover list of colleges"""
        prompt = self.create_college_list_prompt(location)

        try:
            content = await self._call_gemini(prompt, max_tokens=6000)
            # 🐞 Debug: print Gemini raw response
            print("\n================ GEMINI RAW OUTPUT START ================\n")
            print(content)
            print("\n================ GEMINI RAW OUTPUT END ==================\n")
            json_match = re.search(r'\{.*\}', content, re.DOTALL)

            if not json_match:
                raise ValueError("No valid JSON found in response")
            
            raw_json = json_match.group()
            try:
                data = json.loads(raw_json)
            except json.JSONDecodeError as e:
                print("Invalid JSON detected. Attempting repair")
                print(f"JSON error: {e}")

                repaired = repair_json(raw_json)
                data = json.loads(repaired)

            return self._parse_colleges_basic(data, location)
        
        except Exception as e:
            print(f"Error in college list discovery {e}")
            return []
        
    async def _discover_batch_courses(self, colleges: List[College],
                                      career_path: str = None) -> List[College]:
        """Step 2: Discover courses for a batch of colleges"""
        prompt = self.create_batch_course_discovery_prompt(colleges, career_path)

        try:
            content = await self._call_gemini(prompt, max_tokens=10000, use_search=True)
            json_match = re.search(r'\{.*\}', content, re.DOTALL)

            if not json_match:
                print(f"No valid JSON found for batch")
                return colleges
            
            raw_json = json_match.group()
            try:
                data = json.loads(raw_json)
            except json.JSONDecodeError as e:
                print("Invalid JSON detected in batch. Attempting repair")
                print(f"JSON error: {e}")
                repaired = repair_json(raw_json)
                data = json.loads(repaired)

            return self._merge_batch_results(colleges, data)
        
        except Exception as e:
            print(f"Error discovering batch courses: {e}")
            return colleges
        
    async def _call_gemini(self, prompt: str, max_tokens: int = 4000, use_search: bool = False) -> str:
        """Call Gemini API"""
        system_msg = "You are a precise educational data expert. Always return valid JSON with accurate information about Indian colleges and universities."

        generation_config = {
            "temperature": 0.1,
            "top_p": 0.9,
            "max_output_tokens": max_tokens,
        }

        if use_search:
            enhanced_prompt = f"""{system_msg}
            IMPORTANT: Use your most current and comprehensive knowledge to find accurate course information.
            For each college, provide detailed and up-to-date course offerings.
            {prompt}"""

            response = self.client.generate_content(
                enhanced_prompt,
                generation_config=generation_config
            )
        else:
            response = self.client.generate_content(
                f"{system_msg}\n\n{prompt}",
                generation_config=generation_config
            )
        
        return response.text
    
    def _parse_colleges_basic(self, data: Dict, location: str) -> List[College]:
        """Parse basic college information (Step 1) - Updated for staging schema"""
        colleges = []
        for college_data in data.get("colleges", []):
            try:
                college_type = college_data.get("type", "private").lower()
                college = College(
                    name=college_data.get("name", ""),
                    description=college_data.get("description", ""),
                    address=college_data.get("address", ""),
                    city=college_data.get("city", ""),
                    state=college_data.get("state", ""),
                    zip_code=college_data.get("zip_code", ""),
                    website=college_data.get("website", ""),
                    email=college_data.get("email", ""),
                    phone=college_data.get("phone", ""),
                    scholarshipdetails=college_data.get("scholarshipdetails", ""),
                    rating=min(5.0, max(1.0, college_data.get("rating", 3.5))),
                    type=college_type,
                    overall_confidence=college_data.get("confidence", 0.5),
                    last_collected=datetime.now(),
                    verification_status=VerificationStatus.DRAFT,
                    evidence_status=EvidenceStatus.PENDING_VERIFICATION,
                    courses=[]
                )
                colleges.append(college)
            except Exception as e:
                print(f"Error parsing college data: {e}")
                continue

        return colleges
    
    def _merge_batch_results(self, colleges: List[College], data: Dict) -> List[College]:
        """Merge batch course discovery results back into college objects"""
        results_by_name = {
            r.get("college_name", "").lower(): r 
            for r in data.get("colleges", [])
        }
        for college in colleges:
            key = college.name.lower()
            if key in results_by_name:
                result = results_by_name[key]
                college.courses = self._parse_courses(
                    {"courses": result.get("courses", [])}, 
                    college.website
                )
            else:
                college.courses = []

        return colleges
    
    def _parse_courses(self, data: Dict, college_website: str) -> List[Course]:
        """Parse college information - Updated for staging schema"""
        courses = []
        for course_data in data.get("courses", []):
            try:
                course = Course(
                    name=course_data.get("name", ""),
                    description=course_data.get("description", ""),
                    duration=course_data.get("duration", "Not specified"),
                    degree_level=course_data.get("degree_level", "UG"),
                    seats=course_data.get("seats"),
                    annual_fees=course_data.get("annual_fees"),
                    official_source_url=college_website,
                    row_confidence=0.7,
                    entrance_exams=course_data.get("entrance_exams", []),
                    specializations=course_data.get("specializations", [])
                )
                courses.append(course)
            except Exception as e:
                print(f"Error parsing course data: {e}")
                continue
        return courses












