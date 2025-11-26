-- ================================================================
-- MIGRATION: Add Extended Career Fields
-- Version: 001
-- Date: 2025-01-16
-- Description: Adds missing fields to support complete career data
--              from frontend, including salary, education pathway,
--              entrance exams, and enhanced skill categorization
-- ================================================================

-- ================================================================
-- PART 1: ALTER career_path TABLE
-- ================================================================

-- Core Display Fields
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS snapshot TEXT;

-- Salary Information
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS salary_starting TEXT;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS salary_experienced TEXT;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS salary_senior TEXT;

-- Career Guidance Information
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS industry_demand TEXT;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS recommended_stream TEXT;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS student_path_example TEXT;

-- Structured Data Fields (JSONB for flexibility and querying)
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS education_pathway JSONB;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS entrance_exams_list JSONB;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS grade_wise_advice JSONB;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS essential_subjects JSONB;
ALTER TABLE public.career_path ADD COLUMN IF NOT EXISTS optional_subjects JSONB;

-- Add unique constraint on slug after data population
-- Note: Run this after populating slug values
-- ALTER TABLE public.career_path ADD CONSTRAINT career_path_slug_unique UNIQUE (slug);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_career_path_slug ON public.career_path(slug);

-- Add comments for documentation
COMMENT ON COLUMN public.career_path.slug IS 'URL-friendly identifier (e.g., civil-engineer)';
COMMENT ON COLUMN public.career_path.category IS 'Career category for UI display (e.g., STEM, Helping, Business)';
COMMENT ON COLUMN public.career_path.snapshot IS 'Short career tagline/summary for quick overview';
COMMENT ON COLUMN public.career_path.salary_starting IS 'Entry-level salary range (e.g., ₹3.5-6 Lakhs)';
COMMENT ON COLUMN public.career_path.salary_experienced IS 'Mid-career salary range (e.g., ₹8-15 Lakhs)';
COMMENT ON COLUMN public.career_path.salary_senior IS 'Senior-level salary range (e.g., ₹15+ Lakhs)';
COMMENT ON COLUMN public.career_path.industry_demand IS 'Market outlook and demand analysis';
COMMENT ON COLUMN public.career_path.recommended_stream IS 'Recommended educational stream (e.g., Science PCM)';
COMMENT ON COLUMN public.career_path.student_path_example IS 'Real student success story narrative';
COMMENT ON COLUMN public.career_path.education_pathway IS 'JSON array of education steps';
COMMENT ON COLUMN public.career_path.entrance_exams_list IS 'JSON array of entrance exam names';
COMMENT ON COLUMN public.career_path.grade_wise_advice IS 'JSON object with grade-specific advice';
COMMENT ON COLUMN public.career_path.essential_subjects IS 'JSON array of essential subject names';
COMMENT ON COLUMN public.career_path.optional_subjects IS 'JSON array of optional subject names';


-- ================================================================
-- PART 2: ALTER skill TABLE
-- ================================================================

-- Add skill categorization and descriptions
ALTER TABLE public.skill ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.skill ADD COLUMN IF NOT EXISTS description TEXT;

-- Add check constraint for valid skill categories
ALTER TABLE public.skill DROP CONSTRAINT IF EXISTS skill_category_check;
ALTER TABLE public.skill ADD CONSTRAINT skill_category_check
  CHECK (category IN ('technical', 'soft', NULL));

-- Add comments
COMMENT ON COLUMN public.skill.category IS 'Skill type: technical or soft';
COMMENT ON COLUMN public.skill.description IS 'Detailed skill description with context and examples';


-- ================================================================
-- PART 3: ALTER careerpath_skills JUNCTION TABLE
-- ================================================================

-- Add denormalized category for faster filtering
ALTER TABLE public.careerpath_skills ADD COLUMN IF NOT EXISTS skill_category TEXT;

-- Add custom description override for career-specific skill context
ALTER TABLE public.careerpath_skills ADD COLUMN IF NOT EXISTS custom_description TEXT;

-- Add comments
COMMENT ON COLUMN public.careerpath_skills.skill_category IS 'Denormalized skill category for faster queries';
COMMENT ON COLUMN public.careerpath_skills.custom_description IS 'Career-specific skill description override';


-- ================================================================
-- PART 4: ALTER entrance_exam TABLE
-- ================================================================

-- Add detailed entrance exam information
ALTER TABLE public.entrance_exam ADD COLUMN IF NOT EXISTS eligibility TEXT;
ALTER TABLE public.entrance_exam ADD COLUMN IF NOT EXISTS exam_pattern TEXT;
ALTER TABLE public.entrance_exam ADD COLUMN IF NOT EXISTS difficulty_level TEXT;
ALTER TABLE public.entrance_exam ADD COLUMN IF NOT EXISTS exam_dates TEXT;
ALTER TABLE public.entrance_exam ADD COLUMN IF NOT EXISTS official_website TEXT;

-- Add check constraint for difficulty level
ALTER TABLE public.entrance_exam DROP CONSTRAINT IF EXISTS exam_difficulty_check;
ALTER TABLE public.entrance_exam ADD CONSTRAINT exam_difficulty_check
  CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard', 'Very Hard', NULL));

-- Add comments
COMMENT ON COLUMN public.entrance_exam.eligibility IS 'Eligibility criteria for the exam';
COMMENT ON COLUMN public.entrance_exam.exam_pattern IS 'Exam structure, sections, and format';
COMMENT ON COLUMN public.entrance_exam.difficulty_level IS 'Overall difficulty: Easy, Medium, Hard, Very Hard';
COMMENT ON COLUMN public.entrance_exam.exam_dates IS 'Typical exam schedule and important dates';
COMMENT ON COLUMN public.entrance_exam.official_website IS 'Official exam website URL';


-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================

-- Summary of changes:
-- career_path: Added 14 new columns
-- skill: Added 2 new columns + 1 constraint
-- careerpath_skills: Added 2 new columns
-- entrance_exam: Added 5 new columns + 1 constraint
-- Total: 23 new columns, 2 constraints, 1 index

-- ================================================================
-- ROLLBACK SCRIPT (Save this for emergency rollback)
-- ================================================================
/*
-- Run these commands to rollback this migration if needed:

-- Remove indexes
DROP INDEX IF EXISTS public.idx_career_path_slug;

-- Remove constraints
ALTER TABLE public.career_path DROP CONSTRAINT IF EXISTS career_path_slug_unique;
ALTER TABLE public.skill DROP CONSTRAINT IF EXISTS skill_category_check;
ALTER TABLE public.entrance_exam DROP CONSTRAINT IF EXISTS exam_difficulty_check;

-- Remove columns from career_path
ALTER TABLE public.career_path DROP COLUMN IF EXISTS slug;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS category;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS snapshot;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS salary_starting;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS salary_experienced;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS salary_senior;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS industry_demand;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS recommended_stream;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS student_path_example;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS education_pathway;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS entrance_exams_list;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS grade_wise_advice;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS essential_subjects;
ALTER TABLE public.career_path DROP COLUMN IF EXISTS optional_subjects;

-- Remove columns from skill
ALTER TABLE public.skill DROP COLUMN IF EXISTS category;
ALTER TABLE public.skill DROP COLUMN IF EXISTS description;

-- Remove columns from careerpath_skills
ALTER TABLE public.careerpath_skills DROP COLUMN IF EXISTS skill_category;
ALTER TABLE public.careerpath_skills DROP COLUMN IF EXISTS custom_description;

-- Remove columns from entrance_exam
ALTER TABLE public.entrance_exam DROP COLUMN IF EXISTS eligibility;
ALTER TABLE public.entrance_exam DROP COLUMN IF EXISTS exam_pattern;
ALTER TABLE public.entrance_exam DROP COLUMN IF EXISTS difficulty_level;
ALTER TABLE public.entrance_exam DROP COLUMN IF EXISTS exam_dates;
ALTER TABLE public.entrance_exam DROP COLUMN IF EXISTS official_website;
*/
