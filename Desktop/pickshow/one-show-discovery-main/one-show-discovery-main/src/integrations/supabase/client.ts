// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://avxvrxkhvrtofoykequn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eHZyeGtodnJ0b2ZveWtlcXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjU1NjMsImV4cCI6MjA2MzA0MTU2M30.dchaggSwTVSVUHV66xv1Rou31Teu7WoKRyLIl5TFYtA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);