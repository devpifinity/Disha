import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase credentials
// Get them from: Project Settings > API in your Supabase dashboard
const SUPABASE_URL = 'https://czqyykcerlzhmrsfdfmq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cXl5a2Nlcmx6aG1yc2ZkZm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDg5NjgsImV4cCI6MjA3NTc4NDk2OH0.2QOLg_5_gHsHlEkLjgFmLoxfQGeHK4Iuo13am5qZB3Y'
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
