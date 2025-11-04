import os
from typing import List, Dict, Optional
from supabase import create_client, Client
from datetime import datetime
from models.college import College, Course

class SupabaseIntegration:
    def __init__(self, url: str = None, key: str = None):
        """Initialize Supabase client"""
        self.url = url or os.getenv("SUPABASE_URL")
        self.key = key or os.getenv("SUPABASE_KEY")
        
        if not self.url or not self.key:
            raise ValueError("Supabase URL and Key are required")
        
        self.client: Client = create_client(self.url, self.key)
    
    async def push_colleges_and_courses(self, colleges: List[College], 
                                       progress_callback=None) -> Dict:
        """
        Push colleges and courses to Supabase STAGING tables with relationships
        
        Tables populated:
        - st_college (colleges)
        - st_course (courses, deduplicated by name)
        - st_college_course_jobs (many-to-many relationships, job_id=null)
        
        Returns:
            Dict with success/failure statistics
        """
        results = {
            'colleges_inserted': 0,
            'colleges_failed': 0,
            'courses_inserted': 0,
            'courses_failed': 0,
            'relationships_created': 0,
            'relationships_failed': 0,
            'errors': []
        }
        
        total = len(colleges)
        
        course_name_to_id = {}
        
        for i, college in enumerate(colleges):
            try:
                if progress_callback:
                    progress_callback(i + 1, total, college.name)
                
                college_id = await self._insert_staging_college(college)
                
                if college_id:
                    results['colleges_inserted'] += 1
                    print(f"Inserted college: {college.name} (ID: {college_id})")
                    
                    for course in college.courses:
                        course_id = None
                        
                        if course.name in course_name_to_id:
                            course_id = course_name_to_id[course.name]
                            print(f"Reusing existing course: {course.name} (ID: {course_id})")
                        else:
                            course_id = await self._insert_staging_course(course)
                            if course_id:
                                results['courses_inserted'] += 1
                                course_name_to_id[course.name] = course_id
                                print(f"Inserted course: {course.name} (ID: {course_id})")
                            else:
                                results['courses_failed'] += 1
                                print(f"Failed to insert course: {course.name}")
                        
                        if course_id:
                            link_success = await self._link_college_course_staging(
                                college_id, course_id
                            )
                            if link_success:
                                results['relationships_created'] += 1
                            else:
                                results['relationships_failed'] += 1
                else:
                    results['colleges_failed'] += 1
                    print(f"Failed to insert college: {college.name}")
                    
            except Exception as e:
                results['colleges_failed'] += 1
                results['errors'].append(f"{college.name}: {str(e)}")
                print(f"Error processing {college.name}: {e}")
        
        print(f"\nSUMMARY:")
        print(f"   Colleges: {results['colleges_inserted']} inserted, {results['colleges_failed']} failed")
        print(f"   Courses: {results['courses_inserted']} inserted, {results['courses_failed']} failed")
        print(f"   Relationships: {results['relationships_created']} created, {results['relationships_failed']} failed")
        
        return results
    
    async def _insert_staging_college(self, college: College) -> Optional[str]:
        """Insert college into st_college staging table and return its UUID"""
        try:
            confidence_level = self._get_confidence_level(college.overall_confidence)
            
            evidence_urls_str = ""
            if college.evidence_urls and len(college.evidence_urls) > 0:
                evidence_urls_str = ", ".join(college.evidence_urls[:5])
            
            college_data = {
                'name': college.name,
                'description': college.description or f"{college.name} is located in {college.city}, {college.state}. Type: {college.type}",
                'address': college.address or f"{college.city}, {college.state}",
                'city': college.city,
                'state': college.state,
                'zip_code': college.zip_code or "",
                'website': college.website,
                'email': college.email or self._generate_email(college.website),
                'phone': college.phone or "",
                'scholarshipdetails': college.scholarshipdetails or "",
                'rating': round(float(college.rating if hasattr(college, 'rating') else 
                               (college.overall_confidence * 5)), 1),
                'type': college.type.lower(),
                'confidence': round(float(college.overall_confidence), 2),
                'confidence_level': confidence_level,
                'evidence_status': str(college.evidence_status.value) if hasattr(college.evidence_status, 'value') else str(college.evidence_status),
                'evidence_urls': evidence_urls_str
            }
            
            response = self.client.table('st_college').insert(college_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]['id']
            return None
            
        except Exception as e:
            print(f"Error inserting college {college.name} to staging: {e}")
            return None
    
    async def _insert_staging_course(self, course: Course) -> Optional[str]:
        """Insert course into st_course staging table and return its UUID"""
        try:
            existing = self.client.table('st_course').select('id').eq('name', course.name).execute()
            
            if existing.data and len(existing.data) > 0:
                return existing.data[0]['id']
            
            description = course.description if hasattr(course, 'description') and course.description else self._generate_course_description(course)
            
            course_data = {
                'name': course.name,
                'description': description,
                'duration': course.duration or 'Not specified',
                'degree_level': course.degree_level or 'UG',
                'seats': float(course.seats) if course.seats else None,
                'annual_fees': course.annual_fees or ""
            }
            
            response = self.client.table('st_course').insert(course_data).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]['id']
            return None
            
        except Exception as e:
            print(f"Error inserting course {course.name} to staging: {e}")
            return None
    
    async def _link_college_course_staging(self, college_id: str, course_id: str) -> bool:
        """
        Create college-course relationship in st_college_course_jobs table
        
        Args:
            college_id: UUID of the college in st_college
            course_id: UUID of the course in st_course
            
        Returns:
            bool: True if relationship created successfully
        """
        try:
            existing = (self.client.table('st_college_course_jobs')
                       .select('id')
                       .eq('college_id', college_id)
                       .eq('course_id', course_id)
                       .execute())
            
            if existing.data and len(existing.data) > 0:
                print(f"Relationship already exists")
                return True
            
            link_data = {
                'college_id': college_id,
                'course_id': course_id,
                'job_id': None
            }
            
            response = self.client.table('st_college_course_jobs').insert(link_data).execute()
            
            if response.data and len(response.data) > 0:
                print(f"Created relationship")
                return True
            return False
            
        except Exception as e:
            print(f"Error linking college-course: {e}")
            return False
    
    def _get_confidence_level(self, confidence: float) -> str:
        """Categorize confidence into levels"""
        if confidence >= 0.8:
            return "HIGH"
        elif confidence >= 0.6:
            return "MEDIUM"
        elif confidence >= 0.4:
            return "LOW"
        else:
            return "VERY_LOW"
    
    def _generate_course_description(self, course: Course) -> str:
        """Generate course description from available data"""
        desc_parts = [f"{course.name} program"]
        
        if course.duration:
            desc_parts.append(f"Duration: {course.duration}")
        
        if course.degree_level:
            level_map = {
                'UG': 'undergraduate',
                'PG': 'postgraduate',
                'PhD': 'doctoral',
                'Diploma': 'diploma',
                'Certificate': 'certificate'
            }
            desc_parts.append(f"This is a {level_map.get(course.degree_level, course.degree_level)} program")
        
        if course.entrance_exams and len(course.entrance_exams) > 0:
            desc_parts.append(f"Entrance exams: {', '.join(course.entrance_exams)}")
        
        if course.specializations and len(course.specializations) > 0:
            desc_parts.append(f"Specializations available: {', '.join(course.specializations)}")
        
        if course.annual_fees:
            desc_parts.append(f"Annual fees: {course.annual_fees}")
        
        if course.seats:
            desc_parts.append(f"Available seats: {course.seats}")
        
        return '. '.join(desc_parts) + '.'
    
    def _generate_email(self, website: str) -> str:
        """Generate placeholder email from website"""
        try:
            from urllib.parse import urlparse
            domain = urlparse(website).netloc
            return f"info@{domain}"
        except:
            return "info@college.edu.in"
    
    def test_connection(self) -> bool:
        """Test Supabase connection"""
        try:
            response = self.client.table('st_college').select('id').limit(1).execute()
            return True
        except Exception as e:
            print(f"Connection test failed: {e}")
            return False
    
    async def get_staging_stats(self) -> Dict:
        """Get statistics from staging tables"""
        try:
            colleges_count = len(self.client.table('st_college').select('id').execute().data)
            courses_count = len(self.client.table('st_course').select('id').execute().data)
            relationships_count = len(self.client.table('st_college_course_jobs').select('id').execute().data)
            
            colleges_data = self.client.table('st_college').select('confidence_level').execute().data
            confidence_breakdown = {}
            for item in colleges_data:
                level = item.get('confidence_level', 'UNKNOWN')
                confidence_breakdown[level] = confidence_breakdown.get(level, 0) + 1
            
            return {
                'total_colleges': colleges_count,
                'total_courses': courses_count,
                'total_relationships': relationships_count,
                'confidence_breakdown': confidence_breakdown
            }
        except Exception as e:
            print(f"Error getting staging stats: {e}")
            return {}
    
    async def clear_staging_tables(self) -> Dict:
        """Clear all data from staging tables (use with caution!)"""
        try:
            relationship_response = self.client.table('st_college_course_jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()

            college_response = self.client.table('st_college').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()

            course_response = self.client.table('st_course').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
            
            return {
                'success': True,
                'colleges_deleted': len(college_response.data) if college_response.data else 0,
                'courses_deleted': len(course_response.data) if course_response.data else 0,
                'relationships_deleted': len(relationship_response.data) if relationship_response.data else 0
            }
        except Exception as e:
            print(f"Error clearing staging tables: {e}")
            return {'success': False, 'error': str(e)}