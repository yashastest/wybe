
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hiisslyuwioisprllxvq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaXNzbHl1d2lvaXNwcmxseHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTY3MzgsImV4cCI6MjA2Mjg5MjczOH0.WMg3MGv77QorfG8_UfJ4iTrp_PMm9Y6u4qXV9jejr68";

// Create client with optimal auth configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});
