-- ================================================================
-- CLEANUP DUPLICATE CAREER RECORDS
-- ================================================================
-- This script removes duplicate career_path records based on slug
-- Keeps only the most recent record for each slug
-- ================================================================

-- Find and display duplicates first (for verification)
SELECT
  slug,
  name,
  COUNT(*) as duplicate_count,
  array_agg(id::text ORDER BY created_at DESC) as ids
FROM public.career_path
GROUP BY slug, name
HAVING COUNT(*) > 1
ORDER BY slug;

-- ================================================================
-- Remove duplicates - Keep the most recent record for each slug
-- ================================================================

DO $$
DECLARE
  duplicate_record RECORD;
  ids_to_keep uuid[];
  ids_to_delete uuid[];
BEGIN
  -- Loop through each duplicate slug
  FOR duplicate_record IN
    SELECT slug
    FROM public.career_path
    GROUP BY slug
    HAVING COUNT(*) > 1
  LOOP
    RAISE NOTICE 'Processing duplicates for slug: %', duplicate_record.slug;

    -- Get the most recent ID to keep (by created_at)
    SELECT ARRAY[id] INTO ids_to_keep
    FROM public.career_path
    WHERE slug = duplicate_record.slug
    ORDER BY created_at DESC
    LIMIT 1;

    -- Get all other IDs to delete
    SELECT ARRAY_AGG(id) INTO ids_to_delete
    FROM public.career_path
    WHERE slug = duplicate_record.slug
      AND id != ids_to_keep[1];

    -- Delete the duplicates (CASCADE will handle related records)
    DELETE FROM public.career_path
    WHERE id = ANY(ids_to_delete);

    RAISE NOTICE 'Kept ID: %, Deleted % duplicate(s)', ids_to_keep[1], array_length(ids_to_delete, 1);
  END LOOP;

  RAISE NOTICE 'Cleanup complete!';
END $$;

-- ================================================================
-- Verify no duplicates remain
-- ================================================================

SELECT
  slug,
  COUNT(*) as count
FROM public.career_path
GROUP BY slug
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates)

-- ================================================================
-- Show final career count
-- ================================================================

SELECT COUNT(DISTINCT slug) as unique_careers
FROM public.career_path;
-- Expected: 15 careers
