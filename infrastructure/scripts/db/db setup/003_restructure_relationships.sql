-- ================================================================
-- MIGRATION: Restructure Database Relationships
-- Version: 003
-- Date: 2025-01-22
-- Description: Restructures the database to support cleaner relationships:
--              - Renames career_job_opportunity to career_options
--              - Creates careerpath_courses (career → courses)
--              - Creates college_courses (college → courses)
--              - Deprecates college_course_jobs table
-- ================================================================

-- ================================================================
-- PART 1: RENAME career_job_opportunity TO career_options
-- ================================================================

-- Rename the table for clarity
ALTER TABLE IF EXISTS public.career_job_opportunity RENAME TO career_options;

-- Add comment explaining the table
COMMENT ON TABLE public.career_options IS 'Career options/job titles available for each career path (e.g., Structural Engineer, Frontend Developer)';


-- ================================================================
-- PART 2: CREATE careerpath_courses JUNCTION TABLE
-- ================================================================
-- Links career paths directly to relevant courses
-- Example: Civil Engineer career → B.Tech Civil Engineering course

CREATE TABLE IF NOT EXISTS public.careerpath_courses (
  id uuid default gen_random_uuid() primary key,
  careerpath_id uuid NOT NULL,
  course_id uuid NOT NULL,
  is_primary boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  FOREIGN KEY (careerpath_id) REFERENCES public.career_path(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE
);

-- Add unique constraint to prevent duplicate mappings (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'careerpath_courses_unique'
  ) THEN
    ALTER TABLE public.careerpath_courses
    ADD CONSTRAINT careerpath_courses_unique UNIQUE (careerpath_id, course_id);
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_careerpath_courses_careerpath ON public.careerpath_courses(careerpath_id);
CREATE INDEX IF NOT EXISTS idx_careerpath_courses_course ON public.careerpath_courses(course_id);

-- Add comments
COMMENT ON TABLE public.careerpath_courses IS 'Junction table linking career paths to their relevant courses';
COMMENT ON COLUMN public.careerpath_courses.is_primary IS 'Indicates if this is the primary/recommended course for the career';
COMMENT ON COLUMN public.careerpath_courses.notes IS 'Optional notes about this career-course relationship';


-- ================================================================
-- PART 3: CREATE college_courses JUNCTION TABLE
-- ================================================================
-- Links colleges to the courses they offer
-- Example: IIT Delhi → B.Tech Computer Science

CREATE TABLE IF NOT EXISTS public.college_courses (
  id uuid default gen_random_uuid() primary key,
  college_id uuid NOT NULL,
  course_id uuid NOT NULL,
  annual_fees text,
  total_fees text,
  seats text,
  duration_override text,
  admission_process text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  FOREIGN KEY (college_id) REFERENCES public.college(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES public.course(id) ON DELETE CASCADE
);

-- Add unique constraint to prevent duplicate mappings (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'college_courses_unique'
  ) THEN
    ALTER TABLE public.college_courses
    ADD CONSTRAINT college_courses_unique UNIQUE (college_id, course_id);
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_college_courses_college ON public.college_courses(college_id);
CREATE INDEX IF NOT EXISTS idx_college_courses_course ON public.college_courses(course_id);

-- Add comments
COMMENT ON TABLE public.college_courses IS 'Junction table linking colleges to courses they offer, with college-specific details';
COMMENT ON COLUMN public.college_courses.annual_fees IS 'Annual fees for this course at this college';
COMMENT ON COLUMN public.college_courses.total_fees IS 'Total fees for complete course duration';
COMMENT ON COLUMN public.college_courses.seats IS 'Number of seats available for this course';
COMMENT ON COLUMN public.college_courses.duration_override IS 'Override duration if different from course default';
COMMENT ON COLUMN public.college_courses.admission_process IS 'Admission process specific to this college-course combination';


-- ================================================================
-- PART 4: DEPRECATE college_course_jobs TABLE
-- ================================================================
-- Mark as deprecated but keep for backward compatibility during migration

COMMENT ON TABLE public.college_course_jobs IS 'DEPRECATED: Use careerpath_courses and college_courses instead. Will be removed in future migration.';


-- ================================================================
-- PART 5: UPDATE st_college_course_jobs (staging table)
-- ================================================================
-- Also deprecate the staging version

COMMENT ON TABLE public.st_college_course_jobs IS 'DEPRECATED: Staging table for college_course_jobs. Use careerpath_courses and college_courses instead.';


-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================

-- Summary of changes:
-- 1. Renamed career_job_opportunity → career_options
-- 2. Created careerpath_courses junction table (career → courses)
-- 3. Created college_courses junction table (college → courses)
-- 4. Deprecated college_course_jobs table
-- 5. Added appropriate indexes and constraints

-- New Query Flow:
-- To find colleges for a career:
--   career_path → careerpath_courses → course → college_courses → college
--
-- To find entrance exams for a career:
--   career_path → careerpath_courses → course → course_entrance_exams → entrance_exam


-- ================================================================
-- ROLLBACK SCRIPT (Save this for emergency rollback)
-- ================================================================
/*
-- Run these commands to rollback this migration if needed:

-- Remove new tables
DROP TABLE IF EXISTS public.college_courses;
DROP TABLE IF EXISTS public.careerpath_courses;

-- Rename table back
ALTER TABLE IF EXISTS public.career_options RENAME TO career_job_opportunity;

-- Remove deprecation comments
COMMENT ON TABLE public.college_course_jobs IS NULL;
COMMENT ON TABLE public.st_college_course_jobs IS NULL;
*/
