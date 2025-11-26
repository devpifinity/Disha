import { supabase } from '@/integrations/supabase';

// Types for the new data model
export interface College {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  website: string;
  email: string;
  phone: string;
  scholarshipdetails: string; // PostgreSQL lowercase column name
  rating: number;
  type: string;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  degree_level?: string;
  seats?: number;
  annual_fees?: string;
  created_at: string;
}

export interface EntranceExam {
  id: string;
  name: string;
  description: string;
  eligibility?: string;
  exam_pattern?: string;
  difficulty_level?: string;
  exam_dates?: string;
  official_website?: string;
  created_at: string;
}

export interface CollegeCourse {
  id: string;
  college_id: string;
  course_id: string;
  annual_fees?: string;
  total_fees?: string;
  seats?: string;
  duration_override?: string;
  admission_process?: string;
  created_at: string;
  college?: College;
  course?: Course;
}

export interface CareerPathCourse {
  id: string;
  careerpath_id: string;
  course_id: string;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  course?: Course;
}

export interface CourseEntranceExam {
  id: string;
  course_id: string;
  entranceexam_id: string;
  entrance_exam?: EntranceExam;
  course?: Course;
}

/**
 * Fetch courses for a specific career path
 * New flow: career_path → careerpath_courses → course
 */
export async function fetchCoursesForCareer(careerPathId: string) {
  const { data, error } = await supabase
    .from('careerpath_courses')
    .select(`
      *,
      course:course_id (
        id,
        name,
        description,
        duration,
        degree_level,
        seats,
        annual_fees,
        created_at
      )
    `)
    .eq('careerpath_id', careerPathId);

  return { data: data as CareerPathCourse[], error };
}

/**
 * Fetch colleges that offer courses for a specific career path
 * New flow: career_path → careerpath_courses → course → college_courses → college
 */
export async function fetchCollegesForCareer(careerPathId: string) {
  // Step 1: Get all course IDs for this career
  const { data: careerCourses, error: coursesError } = await fetchCoursesForCareer(careerPathId);

  if (coursesError || !careerCourses || careerCourses.length === 0) {
    return { data: [], error: coursesError };
  }

  // Get unique course IDs
  const courseIds = careerCourses.map(cc => cc.course_id);

  // Step 2: Get colleges that offer these courses
  const { data, error } = await supabase
    .from('college_courses')
    .select(`
      *,
      college:college_id (
        id,
        name,
        description,
        address,
        city,
        state,
        zip_code,
        website,
        email,
        phone,
        scholarshipdetails,
        rating,
        type,
        created_at
      ),
      course:course_id (
        id,
        name,
        description,
        duration,
        created_at
      )
    `)
    .in('course_id', courseIds);

  return { data: data as CollegeCourse[], error };
}

/**
 * Fetch entrance exams for courses related to a career
 * New flow: career_path → careerpath_courses → course → course_entrance_exams → entrance_exam
 */
export async function fetchEntranceExamsForCareer(careerPathId: string) {
  // First get all courses related to this career
  const { data: careerCourses, error: coursesError } = await fetchCoursesForCareer(careerPathId);

  if (coursesError || !careerCourses || careerCourses.length === 0) {
    return { data: [], error: coursesError };
  }

  // Get unique course IDs
  const courseIds = careerCourses.map(cc => cc.course_id);

  // Fetch entrance exams for these courses
  const { data, error } = await supabase
    .from('course_entrance_exams')
    .select(`
      *,
      entrance_exam:entranceexam_id (
        id,
        name,
        description,
        eligibility,
        exam_pattern,
        difficulty_level,
        exam_dates,
        official_website,
        created_at
      ),
      course:course_id (
        id,
        name
      )
    `)
    .in('course_id', courseIds);

  return { data: data as CourseEntranceExam[], error };
}

/**
 * Get unique colleges with their courses for a career
 * Groups colleges with all courses they offer that are relevant to the career
 */
export async function fetchCollegesWithCoursesForCareer(careerPathId: string) {
  const { data: collegeCourses, error } = await fetchCollegesForCareer(careerPathId);

  if (error || !collegeCourses) {
    return { data: null, error };
  }

  // Group by college
  const collegeMap = new Map<string, {
    college: College;
    courses: (Course & {
      annual_fees?: string;
      total_fees?: string;
      seats?: string;
      admission_process?: string;
    })[];
  }>();

  collegeCourses.forEach(cc => {
    if (cc.college && cc.course) {
      const collegeId = cc.college.id;

      if (!collegeMap.has(collegeId)) {
        collegeMap.set(collegeId, {
          college: cc.college,
          courses: []
        });
      }

      const entry = collegeMap.get(collegeId)!;
      // Avoid duplicate courses and add fee information
      if (!entry.courses.find(c => c.id === cc.course!.id)) {
        entry.courses.push({
          ...cc.course,
          annual_fees: cc.annual_fees,
          total_fees: cc.total_fees,
          seats: cc.seats,
          admission_process: cc.admission_process
        });
      }
    }
  });

  return {
    data: Array.from(collegeMap.values()),
    error: null
  };
}

/**
 * Get unique entrance exams for a career
 */
export async function fetchUniqueEntranceExamsForCareer(careerPathId: string) {
  const { data: courseExams, error } = await fetchEntranceExamsForCareer(careerPathId);

  if (error || !courseExams) {
    return { data: [], error };
  }

  // Get unique exams
  const examMap = new Map<string, EntranceExam>();

  courseExams.forEach(ce => {
    if (ce.entrance_exam && !examMap.has(ce.entrance_exam.id)) {
      examMap.set(ce.entrance_exam.id, ce.entrance_exam);
    }
  });

  return {
    data: Array.from(examMap.values()),
    error: null
  };
}

/**
 * Fetch career options (job titles) for a career path
 * Uses the renamed career_options table (formerly career_job_opportunity)
 */
export async function fetchCareerOptionsForCareer(careerPathId: string) {
  const { data, error } = await supabase
    .from('career_options')
    .select('*')
    .eq('careerpath_id', careerPathId);

  return { data, error };
}

/**
 * Fetch all courses offered by a specific college
 */
export async function fetchCoursesForCollege(collegeId: string) {
  const { data, error } = await supabase
    .from('college_courses')
    .select(`
      *,
      course:course_id (
        id,
        name,
        description,
        duration,
        degree_level,
        created_at
      )
    `)
    .eq('college_id', collegeId);

  return { data: data as CollegeCourse[], error };
}

/**
 * Fetch colleges by type (govt, private, etc.)
 */
export async function fetchCollegesByType(type: string) {
  const { data, error } = await supabase
    .from('college')
    .select('*')
    .eq('type', type);

  return { data: data as College[], error };
}
