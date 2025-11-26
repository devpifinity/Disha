-- ================================================================
-- QUICK DATABASE STATE VERIFICATION
-- ================================================================
-- Run this in Supabase SQL Editor to check if seed data has been loaded
-- ================================================================

-- Check if Marketing Specialist career exists
SELECT
  'Career Path' as entity,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Marketing Specialist exists'
    ELSE '❌ No Marketing Specialist found'
  END as status
FROM public.career_path
WHERE slug = 'marketing-specialist';

-- Check BBA course
SELECT
  'BBA Course' as entity,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ BBA course exists'
    ELSE '❌ BBA course not found'
  END as status
FROM public.course
WHERE name = 'Bachelor of Business Administration (BBA)';

-- Check MBA course
SELECT
  'MBA Course' as entity,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ MBA course exists'
    ELSE '❌ MBA course not found'
  END as status
FROM public.course
WHERE name = 'Master of Business Administration (MBA)';

-- Check careerpath_courses table (Career → Course mappings)
SELECT
  'Career-Course Mappings' as entity,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Mappings exist'
    ELSE '❌ No career-course mappings found'
  END as status
FROM public.careerpath_courses;

-- Check college_courses table (College → Course mappings)
SELECT
  'College-Course Mappings' as entity,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Mappings exist'
    ELSE '❌ No college-course mappings found - THIS IS THE PROBLEM!'
  END as status
FROM public.college_courses;

-- Check specific Marketing Specialist to BBA/MBA mappings
SELECT
  'Marketing → BBA/MBA' as mapping,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Marketing courses mapped'
    ELSE '❌ Marketing courses not mapped'
  END as status
FROM public.careerpath_courses pc
JOIN public.career_path cp ON cp.id = pc.careerpath_id
WHERE cp.slug = 'marketing-specialist';

-- Check if colleges offer BBA
SELECT
  'Colleges offering BBA' as mapping,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Colleges offer BBA'
    ELSE '❌ No colleges offer BBA - THIS CAUSES 400 ERROR!'
  END as status
FROM public.college_courses cc
JOIN public.course c ON c.id = cc.course_id
WHERE c.name = 'Bachelor of Business Administration (BBA)';

-- ================================================================
-- DIAGNOSIS
-- ================================================================
-- If college_courses table shows 0 count, that's why you're getting 400 errors
-- Solution: Run the full seed_data.sql script in Supabase SQL Editor
-- ================================================================
