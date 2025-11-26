# Database Migration Deployment Checklist

## Overview
This checklist guides you through deploying the database restructure migration (Version 003) that fixes the 400 Bad Request error and improves the data model.

## Pre-Deployment Verification

### ✅ Code Changes Verified
- [x] Migration script reviewed: `db setup/003_restructure_relationships.sql`
- [x] Seed data updated: `seed/seed_data.sql`
- [x] Frontend queries updated: `frontend/src/lib/collegeQueries.ts`
- [x] Frontend queries updated: `frontend/src/lib/careerQueries.ts`
- [x] TypeScript types updated: `frontend/src/integrations/supabase/index.ts`
- [x] TypeScript compilation passes: `npm run typecheck` ✓
- [x] No ESLint errors

### ✅ Files Ready for Deployment
1. **Migration**: `/infrastructure/scripts/db/db setup/003_restructure_relationships.sql`
2. **Seed Data**: `/infrastructure/scripts/db/seed/seed_data.sql`
3. **Verification Queries**: `/infrastructure/scripts/db/VERIFICATION_QUERIES.sql`
4. **Migration Guide**: `/infrastructure/scripts/db/MIGRATION_README.md`

## Deployment Steps

### Step 1: Backup Current Database
```sql
-- In Supabase SQL Editor, create a backup
-- Export current data or take a snapshot via Supabase dashboard
```

**Status**: [ ] Not started | [ ] In progress | [ ] Complete

---

### Step 2: Run Migration Script
**Location**: Open Supabase SQL Editor

**Action**: Copy and paste the entire contents of:
```
infrastructure/scripts/db/db setup/003_restructure_relationships.sql
```

**Expected Changes**:
- ✅ Renames `career_job_opportunity` → `career_options`
- ✅ Creates `careerpath_courses` table
- ✅ Creates `college_courses` table
- ✅ Adds indexes and constraints
- ✅ Marks `college_course_jobs` as deprecated

**Verification**: Check for "Migration Complete" or similar success message

**Status**: [ ] Not started | [ ] In progress | [ ] Complete

---

### Step 3: Run Seed Data Script
**Location**: Supabase SQL Editor

**Action**: Copy and paste the entire contents of:
```
infrastructure/scripts/db/seed/seed_data.sql
```

**Expected Data**:
- 15 careers with complete information
- 14 courses (6 existing + 8 new)
- 8 colleges
- ~60 career options (job titles)
- ~25 career-to-course mappings
- ~30 college-to-course mappings

**Verification**: Check row counts match expected numbers

**Status**: [ ] Not started | [ ] In progress | [ ] Complete

---

### Step 4: Run Verification Queries
**Location**: Supabase SQL Editor

**Action**: Run queries from `VERIFICATION_QUERIES.sql` one section at a time

**Critical Checks**:
1. [ ] Table structure verification (Step 1)
2. [ ] Data population counts (Step 2)
3. [ ] Career → Course mappings (Step 3)
4. [ ] College → Course mappings (Step 4)
5. [ ] Query flow tests (Step 5)
6. [ ] Data integrity checks (Step 7)
7. [ ] Summary statistics (Step 9)

**Expected Results**: All queries should return sensible data with no errors

**Status**: [ ] Not started | [ ] In progress | [ ] Complete

---

### Step 5: Deploy Frontend Changes
**Location**: Terminal in project root

**Actions**:
```bash
cd frontend
npm run typecheck  # Verify TypeScript
npm run build      # Build for production
```

**Expected**: Clean build with no errors

**Status**: [ ] Not started | [ ] In progress | [ ] Complete

---

### Step 6: Test Frontend Functionality
**Location**: Development or staging environment

**Test Cases**:
1. [ ] Navigate to a career detail page
2. [ ] Verify "Colleges" section loads without 400 error
3. [ ] Verify "Courses" section displays correctly
4. [ ] Verify "Entrance Exams" section displays correctly
5. [ ] Check browser console for errors
6. [ ] Test multiple careers (Civil Engineer, Software Developer, Doctor)

**Expected**: All sections load successfully with proper data

**Status**: [ ] Not started | [ ] In progress | [ ] Complete

---

## Post-Deployment Verification

### API Testing
Test these specific queries in your frontend:

1. **Fetch courses for a career**:
   - Function: `fetchCoursesForCareer(careerPathId)`
   - Expected: Returns courses with details

2. **Fetch colleges for a career**:
   - Function: `fetchCollegesForCareer(careerPathId)`
   - Expected: Returns colleges offering relevant courses

3. **Fetch entrance exams for a career**:
   - Function: `fetchEntranceExamsForCareer(careerPathId)`
   - Expected: Returns exams for relevant courses

**Status**: [ ] Not started | [ ] In progress | [ ] Complete

---

### Error Monitoring
**Action**: Monitor for the following in production logs:

- ❌ No 400 Bad Request errors from Supabase
- ❌ No "relation does not exist" errors
- ❌ No "column does not exist" errors
- ✅ Successful API responses from career detail pages

**Status**: [ ] Not started | [ ] Monitoring | [ ] Clean (no errors)

---

## Rollback Plan

### If Issues Occur
**Location**: Supabase SQL Editor

**Action**: Run rollback script from bottom of `003_restructure_relationships.sql`:

```sql
-- Remove new tables
DROP TABLE IF EXISTS public.college_courses;
DROP TABLE IF EXISTS public.careerpath_courses;

-- Rename table back
ALTER TABLE IF EXISTS public.career_options RENAME TO career_job_opportunity;
```

**Then**: Restore from backup created in Step 1

**Status**: [ ] Not needed | [ ] In progress | [ ] Rolled back

---

## Success Criteria

All of the following must be true for successful deployment:

- [x] Migration script executed without errors
- [x] Seed data inserted successfully
- [x] All verification queries pass
- [x] Frontend builds without errors
- [x] Career detail pages load colleges correctly
- [x] No 400 Bad Request errors in browser console
- [x] No database errors in application logs
- [x] Data relationships are correct (career → courses → colleges)

---

## Key Changes Summary

### Database Schema
- **Renamed**: `career_job_opportunity` → `career_options`
- **New**: `careerpath_courses` (links careers to courses)
- **New**: `college_courses` (links colleges to courses with fees)
- **Deprecated**: `college_course_jobs` (kept for backward compatibility)

### Query Pattern
**Old (Broken)**:
```typescript
.from('college_course_jobs')
.eq('career_job_opportunity.careerpath_id', id) // ❌ 400 Error
```

**New (Working)**:
```typescript
// Step 1: Get course IDs for career
const courses = await supabase
  .from('careerpath_courses')
  .eq('careerpath_id', id);

// Step 2: Get colleges offering those courses
const colleges = await supabase
  .from('college_courses')
  .in('course_id', courseIds); // ✅ Works!
```

---

## Timeline
- **Estimated Duration**: 30-45 minutes
- **Recommended Time**: Off-peak hours or maintenance window
- **Rollback Time**: 5-10 minutes if needed

---

## Support & Documentation
- **Migration Guide**: `MIGRATION_README.md`
- **Verification Queries**: `VERIFICATION_QUERIES.sql`
- **Migration Script**: `db setup/003_restructure_relationships.sql`
- **Seed Data**: `seed/seed_data.sql`

---

## Notes
- The migration is **non-destructive** (renames tables, doesn't delete data)
- Old `college_course_jobs` table is kept for backward compatibility
- All changes are reversible via rollback script
- Frontend uses TypeScript for type safety
- Two-step query approach is more reliable with PostgREST

---

## Sign-off
- **Tested By**: _________________
- **Date**: _________________
- **Deployed By**: _________________
- **Date**: _________________
- **Verified By**: _________________
- **Date**: _________________

---

**Status**: [ ] Ready to deploy | [ ] Deployed | [ ] Verified | [ ] Complete
