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
 * Fetch career path by URL slug (generated from name)
 * Note: Database doesn't have slug column, so we fetch all careers
 * and match by generating slugs from their names
 */
export async function fetchCareerBySlug(slug: string) {
  const dbInfo = getSupabaseInfo();
  console.log('🔍 [DB FETCH] Career by slug:', {
    slug,
    database: dbInfo.project,
    url: dbInfo.url,
    timestamp: new Date().toISOString()
  });

  // Fetch all careers and find by matching generated slug
  const { data: allCareers, error } = await supabase
    .from('career_path')
    .select('*');

  if (error) {
    console.log('❌ [DB FETCH] Failed to fetch careers:', {
      error: error.message,
      code: error.code
    });
    return { data: null, error };
  }

  console.log('📊 [DB FETCH] Total careers in database:', allCareers?.length || 0);

  let career = null;

  if (allCareers) {
    // Log all careers with their generated slugs
    allCareers.forEach(c => {
      const generatedSlug = generateSlug(c.name);
      console.log('  - Career:', {
        name: c.name,
        generatedSlug,
        matches: generatedSlug === slug
      });
    });

    // Find career by matching generated slug
    career = allCareers.find(c => generateSlug(c.name) === slug) || null;

    if (career) {
      console.log('✅ [DB FETCH] Career found by name matching:', {
        id: career.id,
        name: career.name,
        generatedSlug: generateSlug(career.name)
      });
    } else {
      console.log('❌ [DB FETCH] No career found matching slug:', slug);
    }
  }

  return { data: career, error: career ? null : new Error('Career not found') };
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
 * Fetch career skills with skill details
 */
export async function fetchCareerSkills(careerPathId: string) {
  const { data, error } = await supabase
    .from('careerpath_skills')
    .select(`
      *,
      skill:skill_id (
        id,
        name
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
 */
export async function fetchJobOpportunities(careerPathId: string) {
  const { data, error } = await supabase
    .from('career_job_opportunity')
    .select('*')
    .eq('careerpath_id', careerPathId);

  return { data: data as CareerJobOpportunity[], error };
}

/**
 * Fetch related careers from same cluster
 * Note: slug field doesn't exist in DB, generated client-side
 */
export async function fetchRelatedCareers(careerClusterId: string, excludeCareerPathId: string) {
  const { data, error } = await supabase
    .from('career_path')
    .select('id, name')
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
