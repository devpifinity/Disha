# Database Migrations

This directory contains versioned database migration scripts for the Disha Career Discovery Platform.

## Migration Files

### 001_add_career_extended_fields.sql
**Date:** 2025-01-16
**Status:** Pending
**Description:** Adds extended fields to support complete career data including salary information, education pathways, entrance exams, and enhanced skill categorization.

**Changes:**
- Adds 14 new columns to `career_path` table
- Adds 2 new columns + 1 constraint to `skill` table
- Adds 2 new columns to `careerpath_skills` junction table
- Adds 5 new columns + 1 constraint to `entrance_exam` table
- Creates index on `career_path.slug` for faster lookups

**Total Impact:** 23 new columns, 2 constraints, 1 index

## How to Run Migrations

### Prerequisites
- Access to Supabase SQL Editor or PostgreSQL client
- Admin/superuser privileges on the database
- Backup of database (recommended)

### Steps

1. **Backup Database (Recommended)**
   ```bash
   # Via Supabase Dashboard: Settings > Database > Backups
   # Or via pg_dump:
   pg_dump -h your-db-host -U postgres -d disha > backup_$(date +%Y%m%d).sql
   ```

2. **Run Migration Script**

   **Option A: Via Supabase SQL Editor**
   - Login to your Supabase project
   - Navigate to SQL Editor
   - Open the migration file: `001_add_career_extended_fields.sql`
   - Copy and paste the entire file content
   - Click "Run" to execute
   - Verify no errors in the output

   **Option B: Via psql Command Line**
   ```bash
   psql -h your-db-host -U postgres -d disha -f 001_add_career_extended_fields.sql
   ```

3. **Verify Migration**
   ```sql
   -- Check if new columns exist
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'career_path'
   AND column_name IN ('slug', 'category', 'snapshot', 'salary_starting');

   -- Verify constraints
   SELECT constraint_name, constraint_type
   FROM information_schema.table_constraints
   WHERE table_name IN ('skill', 'entrance_exam');

   -- Check index
   SELECT indexname, indexdef
   FROM pg_indexes
   WHERE tablename = 'career_path' AND indexname = 'idx_career_path_slug';
   ```

4. **Run Updated Seed Data**
   After migration succeeds, run the updated seed data:
   ```bash
   psql -h your-db-host -U postgres -d disha -f ../seed_data.sql
   ```

5. **Add Unique Constraint on Slug (After Data Population)**
   After all career data is populated with unique slugs:
   ```sql
   ALTER TABLE public.career_path
   ADD CONSTRAINT career_path_slug_unique UNIQUE (slug);
   ```

## Rollback Instructions

If you need to rollback this migration:

1. **Backup Current State First**
   ```bash
   pg_dump -h your-db-host -U postgres -d disha > pre_rollback_$(date +%Y%m%d).sql
   ```

2. **Run Rollback Commands**
   The rollback script is included at the bottom of `001_add_career_extended_fields.sql` as a commented section. Copy those commands and run them:

   ```sql
   -- Remove indexes
   DROP INDEX IF EXISTS public.idx_career_path_slug;

   -- Remove constraints
   ALTER TABLE public.career_path DROP CONSTRAINT IF EXISTS career_path_slug_unique;
   ALTER TABLE public.skill DROP CONSTRAINT IF EXISTS skill_category_check;
   ALTER TABLE public.entrance_exam DROP CONSTRAINT IF EXISTS exam_difficulty_check;

   -- Remove columns from career_path
   ALTER TABLE public.career_path DROP COLUMN IF EXISTS slug;
   ALTER TABLE public.career_path DROP COLUMN IF EXISTS category;
   -- ... (see full rollback script in migration file)
   ```

3. **Verify Rollback**
   ```sql
   -- Verify columns are removed
   SELECT column_name
   FROM information_schema.columns
   WHERE table_name = 'career_path'
   AND column_name IN ('slug', 'category', 'snapshot');
   -- Should return 0 rows
   ```

## Migration Checklist

Before running a migration:
- [ ] Read and understand the migration script
- [ ] Backup database
- [ ] Have rollback script ready
- [ ] Test in development environment first (if available)
- [ ] Verify database user has necessary privileges
- [ ] Check for any application dependencies

After running a migration:
- [ ] Verify all expected schema changes
- [ ] Run seed data if applicable
- [ ] Test application functionality
- [ ] Update TypeScript types to match new schema
- [ ] Update API/query functions if needed
- [ ] Document any breaking changes

## Best Practices

1. **Never modify existing migration files** - Create new migrations instead
2. **Always test migrations in development first**
3. **Create backups before running migrations**
4. **Version control all migration scripts**
5. **Document breaking changes clearly**
6. **Keep migrations atomic and focused**
7. **Include both upgrade and rollback scripts**

## Troubleshooting

### Common Issues

**Issue:** "column already exists" error
**Solution:** Migration may have already been run partially. Check existing columns and run only missing ALTER statements.

**Issue:** "constraint already exists" error
**Solution:** Drop the constraint first, then recreate it.

**Issue:** Data type mismatch when inserting JSONB
**Solution:** Ensure JSON strings are properly formatted and cast with `::jsonb`

**Issue:** Permission denied
**Solution:** Ensure database user has ALTER TABLE and CREATE INDEX privileges

### Getting Help

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs/guides/database
2. PostgreSQL JSON documentation: https://www.postgresql.org/docs/current/datatype-json.html
3. Create an issue in the project repository

## Migration History

| Version | Date | Description | Status |
|---------|------|-------------|--------|
| 001 | 2025-01-16 | Add extended career fields | Pending |

## Next Steps

After successfully running this migration:

1. **Update TypeScript Types**
   - File: `frontend/src/integrations/supabase/index.ts`
   - Add new fields to `CareerPath` interface
   - Remove optional markers for required fields

2. **Update Query Functions**
   - File: `frontend/src/lib/careerQueries.ts`
   - Fetch new fields in `fetchCareerWithDetails()`
   - Remove fallback to hardcoded data

3. **Clean Up Frontend**
   - File: `frontend/src/components/CareerDetails.tsx`
   - Remove hardcoded `careerData` object (~2000 lines)
   - Use 100% database-driven data

4. **Test Application**
   - Verify all career pages load correctly
   - Check that new fields display properly
   - Test with different careers

## Notes

- All migrations use `IF NOT EXISTS` and `IF EXISTS` to be idempotent
- JSONB fields allow flexible querying and indexing
- Slug field will have unique constraint after data population
- Migration is backward compatible with existing queries
