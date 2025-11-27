# Database Migration Guide: Restructure Relationships

## Overview
This migration restructures the database to use a cleaner relationship model:
- Career Path → Courses → Colleges (instead of Career Path → Jobs → College+Course)
- Renames `career_job_opportunity` to `career_options`

## Files Changed
1. **Migration Script**: `migrations/003_restructure_relationships.sql`
2. **Seed Data**: `seed/seed_data.sql` (updated to use new tables)
3. **Frontend Queries**: `frontend/src/lib/collegeQueries.ts`
4. **TypeScript Types**: `frontend/src/integrations/supabase/index.ts`

## Execution Steps

### Step 1: Run the Migration
Execute the migration in your Supabase SQL Editor:

```sql
-- File: infrastructure/scripts/db/migrations/003_restructure_relationships.sql
```

This will:
- ✅ Rename `career_job_opportunity` → `career_options`
- ✅ Create `careerpath_courses` table
- ✅ Create `college_courses` table
- ✅ Deprecate `college_course_jobs` (kept for backward compatibility)

### Step 2: Run the Seed Data
Execute the complete seed data script:

```sql
-- File: infrastructure/scripts/db/seed/seed_data.sql
```

This will populate:
- Career clusters, streams, subjects, skills
- Entrance exams
- 15 careers with complete data
- 8 colleges
- 14 courses
- **NEW**: Career → Course mappings (`careerpath_courses`)
- **NEW**: College → Course mappings (`college_courses`)

### Step 3: Verify the Data
Run these verification queries:

```sql
-- Check career to course mappings
SELECT
  cp.name as career_name,
  c.name as course_name,
  pc.is_primary
FROM careerpath_courses pc
JOIN career_path cp ON cp.id = pc.careerpath_id
JOIN course c ON c.id = pc.course_id
ORDER BY cp.name, pc.is_primary DESC;

-- Check college to course mappings
SELECT
  col.name as college_name,
  c.name as course_name,
  cc.annual_fees,
  cc.seats
FROM college_courses cc
JOIN college col ON col.id = cc.college_id
JOIN course c ON c.id = cc.course_id
ORDER BY col.name, c.name;

-- Verify career options (renamed table)
SELECT
  cp.name as career_name,
  co.job_title
FROM career_options co
JOIN career_path cp ON cp.id = co.careerpath_id
ORDER BY cp.name;
```

## New Data Model

### Before (Old):
```
career_path → career_job_opportunity → college_course_jobs → college/course
```
**Problem**: Had to filter on nested relations, causing 400 errors

### After (New):
```
career_path
    ├── career_options (job titles)
    │
    └── careerpath_courses → course
                                └── college_courses → college
                                └── course_entrance_exams → entrance_exam
```
**Solution**: Two-step queries that work with Supabase's PostgREST API

## Query Examples

### Find colleges for a career:
```typescript
// Step 1: Get courses for career
const { data: careerCourses } = await supabase
  .from('careerpath_courses')
  .select('course_id')
  .eq('careerpath_id', careerPathId);

// Step 2: Get colleges offering those courses
const { data: colleges } = await supabase
  .from('college_courses')
  .select(`
    *,
    college:college_id(*),
    course:course_id(*)
  `)
  .in('course_id', courseIds);
```

### Find entrance exams for a career:
```typescript
// Step 1: Get courses for career
const { data: careerCourses } = await supabase
  .from('careerpath_courses')
  .select('course_id')
  .eq('careerpath_id', careerPathId);

// Step 2: Get exams for those courses
const { data: exams } = await supabase
  .from('course_entrance_exams')
  .select(`
    *,
    entrance_exam:entranceexam_id(*)
  `)
  .in('course_id', courseIds);
```

## Rollback (If Needed)
If you need to rollback, run the rollback script at the end of `003_restructure_relationships.sql`:

```sql
-- Remove new tables
DROP TABLE IF EXISTS public.college_courses;
DROP TABLE IF EXISTS public.careerpath_courses;

-- Rename table back
ALTER TABLE IF EXISTS public.career_options RENAME TO career_job_opportunity;
```

## Testing
After migration:
1. ✅ TypeScript compiles without errors
2. ✅ Frontend queries work correctly
3. ✅ No 400 Bad Request errors
4. ✅ College and course data displays properly

## Support
- Migration file: `migrations/003_restructure_relationships.sql`
- Seed data: `seed/seed_data.sql`
- Query functions: `frontend/src/lib/collegeQueries.ts`
- TypeScript types: `frontend/src/integrations/supabase/index.ts`
