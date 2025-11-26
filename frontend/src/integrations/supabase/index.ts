export { supabase } from './client';

// ============================================
// Core Tables
// ============================================

export interface CareerPath {
  id: string;
  name: string;
  description: string; // TEXT field
  highlights: string; // TEXT field (pipe-separated)
  type: string;
  career_stream_id: string;
  career_cluster_id: string;
  created_at: string;
  // Extended fields (now populated in DB)
  slug: string; // URL-friendly identifier (e.g., 'civil-engineer')
  category: string; // UI category: 'STEM', 'Helping', 'Business', 'Creative', 'Public Service'
  snapshot: string; // Short career tagline/summary
  salary_starting: string; // Entry-level salary range (e.g., '₹3.5-6 Lakhs')
  salary_experienced: string; // Mid-career salary range (e.g., '₹8-15 Lakhs')
  salary_senior: string; // Senior-level salary range (e.g., '₹15+ Lakhs')
  industry_demand: string; // Market outlook and demand analysis
  recommended_stream: string; // Recommended educational stream (e.g., 'Science (PCM)')
  student_path_example: string; // Real student success story narrative
  education_pathway: string[]; // JSONB array of education steps
  entrance_exams_list: string[]; // JSONB array of entrance exam names
  grade_wise_advice: {
    '9th-10th': string;
    '11th-12th': string;
  }; // JSONB object with grade-specific advice
  essential_subjects: string[]; // JSONB array of essential subject names
  optional_subjects: string[]; // JSONB array of optional subject names
}

export interface Stream {
  id: string;
  name: string;
  created_at: string;
}

export interface CareerCluster {
  id: string;
  name: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  created_at: string;
  // Extended fields
  category: 'technical' | 'soft'; // Skill type categorization
  description: string; // Detailed skill description with context and examples
}

export interface College {
  id: string;
  name: string;
  description: string[]; // TEXT[] array
  location: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  scholarshipDetails: string[]; // TEXT[] array
  rating: number; // numeric(2,1)
  type: 'govt' | 'private'; // enum type_of_college
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  description: string[]; // TEXT[] array
  duration: string;
  created_at: string;
}

export interface EntranceExam {
  id: string;
  name: string;
  description: string; // TEXT field
  created_at: string;
  // Extended fields
  eligibility: string; // Eligibility criteria with age limits and requirements
  exam_pattern: string; // Exam structure, sections, and format details
  difficulty_level: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'; // Difficulty assessment
  exam_dates: string; // Typical exam schedule and registration timelines
  official_website: string; // Official exam website URL
}

// ============================================
// Relation Tables
// ============================================

export interface CareerPathSubject {
  id: string;
  careerpath_id: string;
  subject_id: string;
  is_mandatory: 'yes' | 'no'; // enum answer_type
  subject?: Subject; // Joined data
}

export interface CareerPathSkill {
  id: string;
  careerpath_id: string;
  skill_id: string;
  skill?: Skill; // Joined data
  // Extended fields
  skill_category?: 'technical' | 'soft'; // Denormalized skill category for faster filtering
  custom_description?: string; // Career-specific skill description override
}

export interface CareerPathTag {
  id: string;
  careerpath_id: string;
  tag: string;
}

export interface CareerJobOpportunity {
  id: string;
  careerpath_id: string;
  job_title: string;
}

export interface CourseSkill {
  id: string;
  course_id: string;
  skill_id: string;
  skill?: Skill; // Joined data
}

export interface CollegeCourseJob {
  id: string;
  job_id: string;
  college_id: string;
  course_id: string;
  // Joined data
  college?: College;
  course?: Course;
  career_job_opportunity?: CareerJobOpportunity;
}

export interface CourseEntranceExam {
  id: string;
  course_id: string;
  entranceexam_id: string;
  // Joined data
  entrance_exam?: EntranceExam;
  course?: Course;
}

// ============================================
// Helper Types
// ============================================

export interface CareerPathWithRelations extends CareerPath {
  subjects?: CareerPathSubject[];
  skills?: CareerPathSkill[];
  tags?: CareerPathTag[];
  job_opportunities?: CareerJobOpportunity[];
  stream?: Stream;
  cluster?: CareerCluster;
}
