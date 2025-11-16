export { supabase } from './client';

// ============================================
// Core Tables
// ============================================

export interface CareerPath {
  id: string;
  name: string;
  description: string; // TEXT field
  highlights: string; // TEXT field
  type: string;
  career_stream_id: string;
  career_cluster_id: string;
  created_at: string;
  // Optional fields (can be null in DB)
  slug?: string | null;
  category?: string | null;
  overview?: string | null;
  salary_starting?: string | null;
  salary_experienced?: string | null;
  salary_senior?: string | null;
  industry_demand?: string | null;
  recommended_stream?: string | null;
  education_pathway?: string[] | null;
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
  description: string[]; // TEXT[] array
  created_at: string;
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
