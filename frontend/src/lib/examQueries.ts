import { supabase } from '@/integrations/supabase';
import type { EntranceExam } from '@/integrations/supabase';

/**
 * Fetch entrance exam by name
 * Note: Database only has basic info (name, description[])
 * For detailed exam info, use hardcoded data
 */
export async function fetchExamByName(examName: string) {
  const { data, error } = await supabase
    .from('entrance_exam')
    .select('*')
    .eq('name', examName)
    .single();

  return { data: data as EntranceExam | null, error };
}

/**
 * Fetch all entrance exams
 */
export async function fetchAllExams() {
  const { data, error } = await supabase
    .from('entrance_exam')
    .select('*')
    .order('name');

  return { data: data as EntranceExam[], error };
}

/**
 * Check if exam exists in database
 */
export async function examExists(examName: string): Promise<boolean> {
  const { data } = await fetchExamByName(examName);
  return !!data;
}
