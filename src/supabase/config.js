import { createClient } from '@supabase/supabase-js'

// Your Supabase configuration
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
