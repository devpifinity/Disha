# Lovable Project Merge - Master Implementation Guide

## Overview
This is a reusable guide for merging changes from the Lovable project (https://github.com/devpifinity/discover-pathway-finder) into the Disha project. This guide uses intelligent analysis to discover changes dynamically rather than hardcoding specific files.

**Purpose**: Execute this guide whenever you need to sync changes from the Lovable project.

**Execution**: Provide this file to Claude Code with the instruction: "Execute the Lovable merge guide step by step"

---

## Prerequisites

Before starting, verify:
- [ ] Current changes are committed (clean working directory)
- [ ] You are on the correct branch
- [ ] You have internet connectivity (to clone the repo)
- [ ] You have write permissions to the project directory

---

## Phase 1: Discovery & Analysis

### Step 1.1: Clone Lovable Repository
**Action**: Clone the latest version of the Lovable project to a temporary location.

```bash
# Remove old clone if exists
rm -rf /tmp/lovable-repo

# Clone fresh copy
git clone https://github.com/devpifinity/discover-pathway-finder /tmp/lovable-repo
```

**Validation**: Confirm `/tmp/lovable-repo` exists and contains the project files.

---

### Step 1.2: Automated File Discovery

**Action**: Compare file structures between Lovable and Disha projects.

#### A. List All Files in Both Projects
```bash
# Lovable files
find /tmp/lovable-repo/src -type f | sort > /tmp/lovable-files.txt

# Disha files
find frontend/src -type f | sort > /tmp/disha-files.txt
```

#### B. Identify New Files (in Lovable, not in Disha)
**Task**: Use the file lists to identify files that exist in Lovable but not in Disha.
- Compare `src/*` structure
- Identify new pages, components, hooks, lib files
- List in analysis document

#### C. Identify Modified Files (exist in both)
**Task**: For files that exist in both projects, identify which ones have different content.
- Compare file checksums or content
- Focus on: components, pages, App.tsx, lib files
- Exclude: node_modules, dist, build artifacts

#### D. Identify Protected Files
**Task**: Automatically mark these patterns as PROTECTED (never overwrite):
- `infrastructure/**/*` - Database and infrastructure files
- `backend/**/*` - Backend services
- `**/supabase/**` - Supabase integration
- `**/*Queries.ts` - Custom query files (careerQueries, collegeQueries, examQueries)
- `**/*.sql` - Database schema and seed files
- `.env*` - Environment configuration

---

### Step 1.3: Dependency Analysis

**Action**: Compare package.json files to identify dependency changes.

#### A. Extract Dependencies
```bash
# Compare dependencies sections
diff <(cat /tmp/lovable-repo/package.json | jq -S '.dependencies') \
     <(cat frontend/package.json | jq -S '.dependencies') > /tmp/deps-diff.txt
```

#### B. Categorize Changes
- **New dependencies**: In Lovable but not in Disha
- **Version updates**: Different versions between projects
- **Removed dependencies**: In Disha but not in Lovable (keep these - likely custom additions)

---

### Step 1.4: Configuration Analysis

**Action**: Compare configuration files for differences.

**Files to Compare**:
- `vite.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `components.json`
- `eslint.config.js`
- `postcss.config.js`

**Task**: For each config file, determine if Lovable version has changes worth merging.

---

## Phase 2: Generate Merge Plan

### Step 2.1: Create Analysis Document

**Action**: Generate `LOVABLE_MERGE_PLAN.md` in the `docs/` directory with the following structure:

```markdown
# Lovable Merge Plan - [DATE]

## Executive Summary
- Lovable commit: [commit hash]
- Analysis date: [date]
- Total new files: [count]
- Total modified files: [count]
- Protected files: [count]
- New dependencies: [count]

## 1. New Files to Copy

### Files Safe to Copy Directly
[For each new file:]
- **Source**: `/tmp/lovable-repo/src/[path]`
- **Destination**: `frontend/src/[path]`
- **Purpose**: [Brief description based on file analysis]
- **Dependencies**: [Any new dependencies this file requires]
- **Action**: COPY

[Example:]
- **Source**: `/tmp/lovable-repo/src/pages/UserProfile.tsx`
- **Destination**: `frontend/src/pages/UserProfile.tsx`
- **Purpose**: User profile page displaying quiz results and saved colleges
- **Dependencies**: userProfileStorage.ts
- **Action**: COPY

## 2. Modified Files Analysis

### Files Requiring Manual Review
[For each modified file:]
- **File**: `[filename]`
- **Changes Detected**: [High-level summary]
- **Conflict Risk**: [Low/Medium/High]
- **Recommendation**: [Review/Merge/Skip]
- **Action Required**: [Specific merge instructions]

[Example:]
- **File**: `frontend/src/App.tsx`
- **Changes Detected**: New route for `/profile` added in Lovable
- **Conflict Risk**: Low
- **Recommendation**: Review and add route
- **Action Required**: Add UserProfile route import and Route component

## 3. Protected Files (DO NOT MODIFY)

[List all protected files with reason:]
- `infrastructure/scripts/db/database-setup.sql` - Custom database schema
- `infrastructure/scripts/db/seed_data.sql` - Custom seed data
- `frontend/src/integrations/supabase/*` - Supabase configuration
- `frontend/src/lib/careerQueries.ts` - Custom DB queries
- `frontend/src/lib/collegeQueries.ts` - Custom DB queries
- `frontend/src/lib/examQueries.ts` - Custom DB queries

## 4. Dependency Changes

### New Dependencies to Add
[List with versions:]
```json
{
  "dependency-name": "version"
}
```

### Dependencies to Update
[List current vs new versions:]
- `package-name`: 1.0.0 → 2.0.0

### Dependencies to Keep (Disha-specific)
[List custom dependencies not in Lovable:]

## 5. Configuration Changes

[For each config file with differences:]
- **File**: [filename]
- **Changes**: [Description]
- **Action**: [Keep Disha/Merge/Use Lovable]

## 6. Execution Steps

### Step 1: Copy New Files
[Exact copy commands for each file:]
```bash
cp /tmp/lovable-repo/src/path/file.tsx frontend/src/path/file.tsx
```

### Step 2: Update package.json
[Exact dependencies to add/update]

### Step 3: Manual Merge Tasks
[Numbered list of files requiring manual attention with specific instructions]

### Step 4: Validation
```bash
npm install
npm run typecheck
npm run lint
npm run build
```

### Step 5: Testing Checklist
- [ ] Verify Supabase integration works
- [ ] Test new pages/components
- [ ] Check all routes function
- [ ] Verify database queries work

## 7. Rollback Plan

If merge causes issues:
```bash
# Revert copied files
rm [list of new files]

# Restore package.json
git checkout frontend/package.json
npm install
```
```

---

## Phase 3: User Review & Approval

### Step 3.1: Present Generated Plan
**Action**: Display the generated `LOVABLE_MERGE_PLAN.md` to the user.

**Ask**:
1. "Do you approve this merge plan?"
2. "Are there any files you want to exclude?"
3. "Any specific concerns about the identified changes?"

**Wait for**: User approval before proceeding to Phase 4.

---

## Phase 4: Systematic Execution

### Step 4.1: Execute File Copy Operations
**Action**: For each file in "New Files to Copy" section of the plan:

```bash
# Create destination directory if needed
mkdir -p [destination-directory]

# Copy file
cp /tmp/lovable-repo/src/[source-path] frontend/src/[dest-path]
```

**After each file**:
- ✅ Mark as copied
- Log the action
- Run `npm run typecheck` to catch immediate issues

---

### Step 4.2: Update package.json
**Action**: Add new dependencies identified in the analysis.

```bash
npm install [dependency-name]@[version]
```

**Validation**: Run `npm install` to verify no conflicts.

---

### Step 4.3: Manual Merge Tasks
**Action**: For each file requiring manual merge:

1. **Create comparison files**:
```bash
cp /tmp/lovable-repo/src/[file] /tmp/[file].lovable
cp frontend/src/[file] /tmp/[file].disha
```

2. **Present to user**: "Manual merge required for [file]. Here are the differences..."

3. **Wait for user**: User manually merges the changes

4. **Validate**: Run typecheck after each merge

---

### Step 4.4: Configuration Updates
**Action**: Apply approved configuration changes from the plan.

**Caution**: Only update configs if explicitly approved by user.

---

### Step 4.5: Final Validation
**Action**: Run complete validation suite:

```bash
# Install all dependencies
npm install

# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Preview build
npm run preview
```

**Success Criteria**: All commands complete without errors.

---

## Phase 5: Documentation & Cleanup

### Step 5.1: Generate Merge Report
**Action**: Create `LOVABLE_MERGE_REPORT.md` in `docs/merge-reports/`:

```markdown
# Lovable Merge Report - [DATE]

## Summary
- **Execution Date**: [date]
- **Lovable Commit**: [hash]
- **Status**: ✅ Success / ⚠️ Partial / ❌ Failed

## Files Copied ([count])
[List each copied file with source and destination]

## Files Manually Merged ([count])
[List each manually merged file]

## Dependencies Added ([count])
[List new dependencies]

## Files Skipped ([count])
[List skipped files with reason]

## Protected Files (Untouched)
[Confirm these were not modified]

## Manual Steps Remaining
[Any tasks user needs to complete]

## Testing Recommendations
- [ ] Test new features
- [ ] Verify database integration
- [ ] Check all routes
- [ ] Regression testing on existing features

## Rollback Instructions
[If needed, how to undo this merge]
```

---

### Step 5.2: Cleanup
**Action**: Clean up temporary files:

```bash
# Remove temporary file lists
rm /tmp/lovable-files.txt
rm /tmp/disha-files.txt
rm /tmp/deps-diff.txt

# Optionally remove cloned repo (can keep for reference)
# rm -rf /tmp/lovable-repo
```

---

## Success Criteria

The merge is complete when:
- ✅ All new files successfully copied
- ✅ All dependencies installed without conflicts
- ✅ Manual merges completed
- ✅ Protected files untouched and verified
- ✅ `npm run typecheck` passes
- ✅ `npm run build` succeeds
- ✅ Merge report generated
- ✅ User confirms all changes work as expected

---

## Troubleshooting

### Issue: Type errors after copying files
**Solution**:
- Check if new files have missing dependencies
- Verify imports are correct for Disha structure
- May need to adjust import paths

### Issue: Dependency conflicts
**Solution**:
- Check version compatibility
- May need to update other dependencies
- Consider using Disha's newer versions

### Issue: Build fails
**Solution**:
- Review copied files for syntax errors
- Check if any environment variables needed
- Verify all imports resolve correctly

### Issue: Features not working
**Solution**:
- Check if Lovable code assumes localStorage but Disha uses Supabase
- May need to adapt code to use Disha's database queries
- Review component props and data structures

---

## Notes for Claude Code

When executing this guide:
1. Work through phases sequentially
2. Do not skip validation steps
3. Pause for user input when manual merges required
4. Be verbose in reporting what actions are being taken
5. If uncertain about a merge decision, ask the user
6. Always protect database and backend files
7. Generate comprehensive reports for audit trail

---

## Maintenance

**Update this guide when**:
- Project structure changes significantly
- New protected file patterns emerge
- Better merge strategies discovered
- Troubleshooting patterns identified

**Last Updated**: [DATE]
**Version**: 1.0
