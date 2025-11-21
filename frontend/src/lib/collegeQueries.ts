import { supabase } from '@/integrations/supabase';
import type {
  College,
  Course,
  EntranceExam,
  CollegeCourseJob,
  CourseEntranceExam
} from '@/integrations/supabase';

/**
 * Fetch colleges for a specific career path
 * Links: career_path -> career_job_opportunity -> college_course_jobs -> college
 */
export async function fetchCollegesForCareer(careerPathId: string) {
  const { data, error } = await supabase
    .from('college_course_jobs')
    .select(`
      *,
      college:college_id (
        id,
        name,
        description,
        location,
        address,
        website,
        email,
        phone,
        scholarshipDetails,
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
      ),
      career_job_opportunity:job_id (
        id,
        careerpath_id,
        job_title
      )
    `)
    .eq('career_job_opportunity.careerpath_id', careerPathId);

  return { data: data as CollegeCourseJob[], error };
}

/**
 * Fetch entrance exams for courses related to a career
 */
export async function fetchEntranceExamsForCareer(careerPathId: string) {
  // First get all courses related to this career
  const { data: collegeCourseJobs } = await fetchCollegesForCareer(careerPathId);

  if (!collegeCourseJobs || collegeCourseJobs.length === 0) {
    return { data: [], error: null };
  }

  // Get unique course IDs
  const courseIds = [...new Set(collegeCourseJobs.map(ccj => ccj.course_id))];

  // Fetch entrance exams for these courses
  const { data, error } = await supabase
    .from('course_entrance_exams')
    .select(`
      *,
      entrance_exam:entranceexam_id (
        id,
        name,
        description,
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
 */
export async function fetchCollegesWithCoursesForCareer(careerPathId: string) {
  const { data: collegeCourseJobs, error } = await fetchCollegesForCareer(careerPathId);

  if (error || !collegeCourseJobs) {
    return { data: null, error };
  }

  // Group by college
  const collegeMap = new Map<string, {
    college: College;
    courses: Course[];
  }>();

  collegeCourseJobs.forEach(ccj => {
    if (ccj.college && ccj.course) {
      const collegeId = ccj.college.id;

      if (!collegeMap.has(collegeId)) {
        collegeMap.set(collegeId, {
          college: ccj.college,
          courses: []
        });
      }

      const entry = collegeMap.get(collegeId)!;
      // Avoid duplicate courses
      if (!entry.courses.find(c => c.id === ccj.course!.id)) {
        entry.courses.push(ccj.course);
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
