export { supabase } from './client';

export interface CareerPath {
  id: string;
  name: string;
  description: string[];
  highlights: string[];
  type;string;
  created_at: string;
  slug:string;
  emoji:string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  rating: number;
  type: string;
  specializations: string[];
  career_path_id: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  topics: string[];
  career_path_id: string | null;
  created_at: string;
}

export interface Exam {
  id: string;
  name: string;
  organizer: string;
  next_date: string;
  eligibility: string;
  importance: 'required' | 'recommended' | 'optional';
  career_path_id: string | null;
  created_at: string;
}
