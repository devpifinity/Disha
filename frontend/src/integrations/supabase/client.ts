import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase credentials
// Get them from: Project Settings > API in your Supabase dashboard
//const SUPABASE_URL = 'https://xqeldfbnwykfuouviqsq.supabase.co';
const SUPABASE_URL = 'https://czqyykcerlzhmrsfdfmq.supabase.co';

//const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZWxkZmJud3lrZnVvdXZpcXNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3Mzk4OTcsImV4cCI6MjA3NTMxNTg5N30.DTsQ5-9FNPvan7tBcX5W9ivnwXKt3kH7VSDKmZyKM3c';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_LW0NmZuoNZMydQLDDFUS4w_qrYmiXeW';


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cXl5a2Nlcmx6aG1yc2ZkZm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDg5NjgsImV4cCI6MjA3NTc4NDk2OH0.2QOLg_5_gHsHlEkLjgFmLoxfQGeHK4Iuo13am5qZB3Y
//sb_secret_G4_hRIQOvbB_zi-maD91iA_yUGFrvEk

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
