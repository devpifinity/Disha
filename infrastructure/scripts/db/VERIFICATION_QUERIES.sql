-- ================================================================
-- DATABASE MIGRATION VERIFICATION QUERIES
-- Version: 003
-- Purpose: Verify the restructured database relationships
-- ================================================================

-- ================================================================
-- STEP 1: Verify Table Structure
-- ================================================================

-- Check that career_options table exists (renamed from career_job_opportunity)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'career_options';
-- Expected: 1 row with 'career_options'

-- Check that old table doesn't exist anymore
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'career_job_opportunity';
-- Expected: 0 rows

-- Check that careerpath_courses table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'careerpath_courses';
-- Expected: 1 row with 'careerpath_courses'

-- Check that college_courses table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'college_courses';
-- Expected: 1 row with 'college_courses'


-- ================================================================
-- STEP 2: Verify Data Population
-- ================================================================

-- Count career options (should have job titles for all careers)
SELECT COUNT(*) as total_career_options
FROM public.career_options;
-- Expected: ~45-75 job titles across all careers

-- Count career-to-course mappings
SELECT COUNT(*) as total_career_course_mappings
FROM public.careerpath_courses;
-- Expected: ~15-30 mappings (each career has 1-3 courses)

-- Count college-to-course mappings
SELECT COUNT(*) as total_college_course_mappings
FROM public.college_courses;
-- Expected: ~20-40 mappings (8 colleges × avg 3 courses each)

-- Count courses
SELECT COUNT(*) as total_courses
FROM public.course;
-- Expected: ~14 courses total


-- ================================================================
-- STEP 3: Verify Career → Course Mappings
-- ================================================================

-- Show all career-to-course mappings
SELECT
  cp.name as career_name,
  c.name as course_name,
  pc.is_primary,
  pc.notes
FROM public.careerpath_courses pc
JOIN public.career_path cp ON cp.id = pc.careerpath_id
JOIN public.course c ON c.id = pc.course_id
ORDER BY cp.name, pc.is_primary DESC, c.name;
-- Expected: List of careers with their relevant courses

-- Check that each career has at least one course
SELECT
  cp.name as career_name,
  COUNT(pc.id) as course_count
FROM public.career_path cp
LEFT JOIN public.careerpath_courses pc ON cp.id = pc.careerpath_id
GROUP BY cp.id, cp.name
ORDER BY course_count ASC, cp.name;
-- Expected: All careers should have at least 1 course (course_count >= 1)

-- Find careers with primary courses
SELECT
  cp.name as career_name,
  c.name as primary_course
FROM public.careerpath_courses pc
JOIN public.career_path cp ON cp.id = pc.careerpath_id
JOIN public.course c ON c.id = pc.course_id
WHERE pc.is_primary = true
ORDER BY cp.name;
-- Expected: Most careers should have 1 primary course


-- ================================================================
-- STEP 4: Verify College → Course Mappings
-- ================================================================

-- Show all college-to-course mappings with fees
SELECT
  col.name as college_name,
  col.type as college_type,
  c.name as course_name,
  cc.annual_fees,
  cc.total_fees,
  cc.seats,
  cc.admission_process
FROM public.college_courses cc
JOIN public.college col ON col.id = cc.college_id
JOIN public.course c ON c.id = cc.course_id
ORDER BY col.name, c.name;
-- Expected: List of colleges with courses they offer and fee details

-- Check course availability by college type
SELECT
  col.type as college_type,
  COUNT(DISTINCT cc.college_id) as colleges_count,
  COUNT(DISTINCT cc.course_id) as courses_offered,
  COUNT(cc.id) as total_offerings
FROM public.college_courses cc
JOIN public.college col ON col.id = cc.college_id
GROUP BY col.type
ORDER BY college_type;
-- Expected: Both 'govt' and 'private' colleges should have course offerings

-- Find colleges offering the most courses
SELECT
  col.name as college_name,
  col.type,
  COUNT(cc.id) as courses_offered
FROM public.college col
LEFT JOIN public.college_courses cc ON col.id = cc.college_id
GROUP BY col.id, col.name, col.type
ORDER BY courses_offered DESC;
-- Expected: IIT Delhi, AIIMS should have multiple course offerings


-- ================================================================
-- STEP 5: Test the New Query Flow
-- ================================================================

-- Example 1: Find courses for "Civil Engineer" career
WITH civil_engineer AS (
  SELECT id
  FROM public.career_path
  WHERE slug = 'civil-engineer'
  LIMIT 1
)
SELECT
  c.name as course_name,
  c.description,
  c.duration,
  pc.is_primary,
  pc.notes
FROM public.careerpath_courses pc
JOIN public.course c ON c.id = pc.course_id
JOIN civil_engineer ce ON pc.careerpath_id = ce.id;
-- Expected: B.Tech Civil Engineering course

-- Example 2: Find colleges offering courses for "Civil Engineer"
WITH civil_engineer AS (
  SELECT id
  FROM public.career_path
  WHERE slug = 'civil-engineer'
  LIMIT 1
),
civil_courses AS (
  SELECT pc.course_id
  FROM public.careerpath_courses pc
  JOIN civil_engineer ce ON pc.careerpath_id = ce.id
)
SELECT
  col.name as college_name,
  col.city,
  col.state,
  col.type,
  c.name as course_name,
  cc.annual_fees,
  cc.seats
FROM public.college_courses cc
JOIN public.college col ON col.id = cc.college_id
JOIN public.course c ON c.id = cc.course_id
JOIN civil_courses courses ON cc.course_id = courses.course_id
ORDER BY col.type, col.name;
-- Expected: Colleges like IIT Delhi, NIT Trichy offering B.Tech Civil Engineering

-- Example 3: Find entrance exams for "Software Developer" career
WITH software_dev AS (
  SELECT id
  FROM public.career_path
  WHERE slug = 'software-developer'
  LIMIT 1
),
software_courses AS (
  SELECT pc.course_id
  FROM public.careerpath_courses pc
  JOIN software_dev sd ON pc.careerpath_id = sd.id
)
SELECT
  c.name as course_name,
  ee.name as exam_name,
  ee.difficulty_level,
  ee.exam_dates,
  ee.official_website
FROM public.course_entrance_exams cee
JOIN public.entrance_exam ee ON ee.id = cee.entranceexam_id
JOIN public.course c ON c.id = cee.course_id
JOIN software_courses courses ON cee.course_id = courses.course_id
ORDER BY ee.difficulty_level DESC, ee.name;
-- Expected: JEE Main, JEE Advanced for B.Tech Computer Science


-- ================================================================
-- STEP 6: Verify Career Options (Job Titles)
-- ================================================================

-- Show career options for each career
SELECT
  cp.name as career_name,
  co.job_title
FROM public.career_options co
JOIN public.career_path cp ON cp.id = co.careerpath_id
ORDER BY cp.name, co.job_title;
-- Expected: List of job titles like "Structural Engineer", "Frontend Developer", etc.

-- Count job titles per career
SELECT
  cp.name as career_name,
  COUNT(co.id) as job_title_count
FROM public.career_path cp
LEFT JOIN public.career_options co ON cp.id = co.careerpath_id
GROUP BY cp.id, cp.name
ORDER BY job_title_count DESC, cp.name;
-- Expected: Each career should have 3-5 job titles


-- ================================================================
-- STEP 7: Data Integrity Checks
-- ================================================================

-- Check for orphaned career-course mappings
SELECT COUNT(*) as orphaned_career_courses
FROM public.careerpath_courses pc
WHERE NOT EXISTS (SELECT 1 FROM public.career_path WHERE id = pc.careerpath_id)
   OR NOT EXISTS (SELECT 1 FROM public.course WHERE id = pc.course_id);
-- Expected: 0 orphaned records

-- Check for orphaned college-course mappings
SELECT COUNT(*) as orphaned_college_courses
FROM public.college_courses cc
WHERE NOT EXISTS (SELECT 1 FROM public.college WHERE id = cc.college_id)
   OR NOT EXISTS (SELECT 1 FROM public.course WHERE id = cc.course_id);
-- Expected: 0 orphaned records

-- Check for duplicate career-course mappings
SELECT
  careerpath_id,
  course_id,
  COUNT(*) as duplicate_count
FROM public.careerpath_courses
GROUP BY careerpath_id, course_id
HAVING COUNT(*) > 1;
-- Expected: 0 duplicates (unique constraint should prevent this)

-- Check for duplicate college-course mappings
SELECT
  college_id,
  course_id,
  COUNT(*) as duplicate_count
FROM public.college_courses
GROUP BY college_id, course_id
HAVING COUNT(*) > 1;
-- Expected: 0 duplicates (unique constraint should prevent this)


-- ================================================================
-- STEP 8: Performance Verification
-- ================================================================

-- Test index on careerpath_courses
EXPLAIN ANALYZE
SELECT * FROM public.careerpath_courses
WHERE careerpath_id = (SELECT id FROM public.career_path LIMIT 1);
-- Expected: Should use idx_careerpath_courses_careerpath index

-- Test index on college_courses
EXPLAIN ANALYZE
SELECT * FROM public.college_courses
WHERE college_id = (SELECT id FROM public.college LIMIT 1);
-- Expected: Should use idx_college_courses_college index


-- ================================================================
-- STEP 9: Summary Statistics
-- ================================================================

-- Overall data summary
SELECT
  'Careers' as entity,
  COUNT(*) as count
FROM public.career_path
UNION ALL
SELECT
  'Courses' as entity,
  COUNT(*) as count
FROM public.course
UNION ALL
SELECT
  'Colleges' as entity,
  COUNT(*) as count
FROM public.college
UNION ALL
SELECT
  'Career Options (Jobs)' as entity,
  COUNT(*) as count
FROM public.career_options
UNION ALL
SELECT
  'Career → Course Mappings' as entity,
  COUNT(*) as count
FROM public.careerpath_courses
UNION ALL
SELECT
  'College → Course Mappings' as entity,
  COUNT(*) as count
FROM public.college_courses
UNION ALL
SELECT
  'Entrance Exams' as entity,
  COUNT(*) as count
FROM public.entrance_exam;
-- Expected: Complete summary of all entities


-- ================================================================
-- SUCCESS CRITERIA
-- ================================================================

/*
✅ All verification checks should pass with expected results
✅ No orphaned records
✅ No duplicate mappings
✅ All indexes are being used
✅ All careers have at least one course
✅ All colleges offer at least one course
✅ Query performance is good (uses indexes)
✅ Data relationships are clean and logical

If all checks pass, the migration is successful! 🎉
*/
