import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase credentials
// Get them from: Project Settings > API in your Supabase dashboard
const SUPABASE_URL = 'https://xqeldfbnwykfuouviqsq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZWxkZmJud3lrZnVvdXZpcXNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3Mzk4OTcsImV4cCI6MjA3NTMxNTg5N30.DTsQ5-9FNPvan7tBcX5W9ivnwXKt3kH7VSDKmZyKM3c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
