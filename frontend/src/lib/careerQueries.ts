import { supabase } from '@/integrations/supabase';
import type {
  CareerPath,
  CareerPathSubject,
  CareerPathSkill,
  CareerPathTag,
  CareerJobOpportunity
} from '@/integrations/supabase';

// Get Supabase URL for logging
const getSupabaseInfo = () => {
  const url = supabase.supabaseUrl;
  return { url, project: url.split('//')[1]?.split('.')[0] };
};

/**
 * Generate a slug from career name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch career path by URL slug
 * Now uses the slug column directly from the database
 */
export async function fetchCareerBySlug(slug: string) {
  const dbInfo = getSupabaseInfo();
  console.log('🔍 [DB FETCH] Career by slug:', {
    slug,
    database: dbInfo.project,
    url: dbInfo.url,
    timestamp: new Date().toISOString()
  });

  // Fetch career directly by slug column (now available in DB)
  const { data: career, error } = await supabase
    .from('career_path')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.log('❌ [DB FETCH] Failed to fetch career:', {
      slug,
      error: error.message,
      code: error.code
    });
    return { data: null, error };
  }

  if (career) {
    console.log('✅ [DB FETCH] Career found:', {
      id: career.id,
      name: career.name,
      slug: career.slug,
      hasExtendedData: !!(career.salary_starting && career.education_pathway)
    });
  }

  return { data: career as CareerPath, error: null };
}

/**
 * Fetch career subjects with subject details
 */
export async function fetchCareerSubjects(careerPathId: string) {
  console.log('📚 [DB FETCH] Career subjects for:', careerPathId);

  const { data, error } = await supabase
    .from('careerpath_subjects')
    .select(`
      *,
      subject:subject_id (
        id,
        name
      )
    `)
    .eq('careerpath_id', careerPathId);

  console.log('📚 [DB RESULT] Subjects:', {
    count: data?.length || 0,
    mandatory: data?.filter(s => s.is_mandatory === 'yes').length || 0,
    optional: data?.filter(s => s.is_mandatory === 'no').length || 0,
    error: error?.message
  });

  return { data: data as CareerPathSubject[], error };
}

/**
 * Fetch career skills with skill details including category and description
 */
export async function fetchCareerSkills(careerPathId: string) {
  const { data, error } = await supabase
    .from('careerpath_skills')
    .select(`
      *,
      skill:skill_id (
        id,
        name,
        category,
        description
      )
    `)
    .eq('careerpath_id', careerPathId);

  return { data: data as CareerPathSkill[], error };
}

/**
 * Fetch career tags
 */
export async function fetchCareerTags(careerPathId: string) {
  const { data, error } = await supabase
    .from('careerpath_tags')
    .select('*')
    .eq('careerpath_id', careerPathId);

  return { data: data as CareerPathTag[], error };
}

/**
 * Fetch job opportunities for a career
 * Uses the renamed career_options table (formerly career_job_opportunity)
 */
export async function fetchJobOpportunities(careerPathId: string) {
  const { data, error } = await supabase
    .from('career_options')
    .select('*')
    .eq('careerpath_id', careerPathId);

  return { data: data as CareerJobOpportunity[], error };
}

/**
 * Fetch related careers from same cluster
 * Now includes slug from database
 */
export async function fetchRelatedCareers(careerClusterId: string, excludeCareerPathId: string) {
  const { data, error } = await supabase
    .from('career_path')
    .select('id, name, slug')
    .eq('career_cluster_id', careerClusterId)
    .neq('id', excludeCareerPathId)
    .limit(5);

  return { data: data as CareerPath[], error };
}

/**
 * Fetch all career path data with related information
 */
export async function fetchCareerWithDetails(slug: string) {
  console.log('🎯 [DB FETCH] Starting complete career fetch for slug:', slug);

  const { data: career, error: careerError } = await fetchCareerBySlug(slug);

  if (careerError || !career) {
    console.log('❌ [DB FETCH] Career not found, will use fallback data');
    return { data: null, error: careerError };
  }

  console.log('✅ [DB FETCH] Career found, fetching related data...');

  // Fetch all related data in parallel
  const [subjects, skills, tags, jobOpportunities, relatedCareers] = await Promise.all([
    fetchCareerSubjects(career.id),
    fetchCareerSkills(career.id),
    fetchCareerTags(career.id),
    fetchJobOpportunities(career.id),
    fetchRelatedCareers(career.career_cluster_id, career.id)
  ]);

  const result = {
    career,
    subjects: subjects.data || [],
    skills: skills.data || [],
    tags: tags.data || [],
    jobOpportunities: jobOpportunities.data || [],
    relatedCareers: relatedCareers.data || []
  };

  console.log('🎉 [DB FETCH] Complete! Summary:', {
    careerName: career.name,
    subjectsCount: result.subjects.length,
    skillsCount: result.skills.length,
    tagsCount: result.tags.length,
    jobsCount: result.jobOpportunities.length,
    relatedCareersCount: result.relatedCareers.length
  });

  return {
    data: result,
    error: null
  };
}
